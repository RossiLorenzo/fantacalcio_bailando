#!/usr/bin/env node
// Pulls every giornata of the current Bailando season and writes 3 master CSVs:
//   <season>/formazioni.csv   (one row per giornata x team x player, includes non-listed rosa players)
//   <season>/classifica.csv   (one row per giornata x team, with rank + cumulative points)
//   <season>/matches.csv      (one row per head-to-head match in each giornata)
//
// Usage:
//   node scripts/pull_season.mjs <username> <password> [max_giornata]

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Node's fetch is sometimes blocked by the host sandbox while curl is allowed.
// We shell out to curl for every request so the script works in both modes.
function curl(url, { method = 'GET', headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const args = ['-sS', '--compressed', '-X', method];
    for (const [k, v] of Object.entries(headers)) args.push('-H', `${k}: ${v}`);
    if (body !== null) args.push('--data-binary', body);
    args.push(url);
    const cp = spawn('curl', args);
    let out = '', err = '';
    cp.stdout.on('data', d => out += d);
    cp.stderr.on('data', d => err += d);
    cp.on('error', reject);
    cp.on('close', code => {
      if (code !== 0) return reject(new Error(`curl exited ${code}: ${err}`));
      resolve(out);
    });
  });
}
async function httpJson(url, opts) {
  const txt = await curl(url, opts);
  try { return JSON.parse(txt); }
  catch (e) { throw new Error(`Bad JSON from ${url}: ${txt.slice(0, 200)}`); }
}

const BASE     = 'https://appleghe.fantacalcio.it/api/v1';
const GAMING   = 'https://apileague.fantacalcio.it';
const LIVE     = 'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live';
// Season-specific values live in one place; the competition ids are discovered
// from the lega profilo, same as the app does.
const { APP_KEY, LEGA_ID, competizioni_attive, jerseyYear } =
  await import('../src/config/season.js');
// Both written once the lega profilo / id_stagione are known.
let COMP_ID, OUT_DIR;

const ROLES = { P: 'Portiere', D: 'Difensore', C: 'Centrocampista', A: 'Attaccante', NA: 'NA' };
const STATUS = { 0:'NonIniziata', 1:'PrimoTempo', 2:'Intervallo', 3:'SecondoTempo', 4:'Finita', 5:'Sospesa', 6:'Rinviata' };
const EVENTS = {
  '1':{Bonus:-0.5, kind:'yellow_card'},
  '2':{Bonus:-1,   kind:'red_card'},
  '3':{Bonus:3,    kind:'goal'},
  '4':{Bonus:-1,   kind:'goal_conceded'},
  '7':{Bonus:3,    kind:'pen_saved'},
  '8':{Bonus:-3,   kind:'pen_missed'},
  '9':{Bonus:3,    kind:'pen_goal'},
  '10':{Bonus:-2,  kind:'own_goal'},
  '21':{Bonus:1,   kind:'assist'},
  '22':{Bonus:1,   kind:'assist'},
  '23':{Bonus:1,   kind:'assist'},
};
const EVENT_KINDS = ['goal','pen_goal','assist','yellow_card','red_card','pen_saved','pen_missed','own_goal','goal_conceded'];

// ───────────── HTTP ─────────────
async function login(username, password) {
  const data = await httpJson(`${BASE}/v1_utente/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', app_key: APP_KEY },
    body:    JSON.stringify({ username, password }),
  });
  if (!data.success) throw new Error('Login failed: ' + JSON.stringify(data));
  const lega = data.data.leghe.find(l => l.id === LEGA_ID) || data.data.leghe[0];
  if (!lega) throw new Error(`No leagues returned for user`);
  if (lega.id !== LEGA_ID) console.warn(`  ! Lega ${LEGA_ID} not in user leagues; falling back to leghe[0] id=${lega.id}`);
  return { utente_token: data.data.utente.utente_token, lega_token: lega.token,
           lega_jwt: lega.jwt, lega_id: lega.id };
}

const authHeaders = t => ({
  'Content-Type': 'application/json',
  app_key:    APP_KEY,
  lega_token: t.lega_token,
  user_token: t.utente_token,
});

// The gaming API (lineups) authenticates differently from the legacy one.
const gamingHeaders = t => ({
  'Content-Type':  'application/json',
  app_key:         APP_KEY,
  'Access-Token':  t.utente_token,
  authorization:   'Bearer ' + t.lega_jwt,
  Platform:        'android',
});

async function getGaming(url, t) {
  const data = await httpJson(url, { headers: gamingHeaders(t) });
  // Errors come back as {code, message} rather than an envelope.
  return (data && data.code && data.message) ? null : data;
}

// One request per team: the gaming API has no bulk lineup route.
async function fetchLineups(t, compId, g, cmday, teamIds) {
  const out = {};
  for (const id of teamIds) {
    const r = await getGaming(
      `${GAMING}/gaming/v1/teamLineup/${compId}/${g}/${cmday}/${id}/0/live`, t
    ).catch(() => null);
    out[id] = r ? r.home : undefined;
  }
  return out;
}

async function get(url, t, { quiet = false } = {}) {
  const data = await httpJson(url, { headers: authHeaders(t) });
  if (data && data.success === false) {
    if (!quiet) console.error('  ! API returned success=false:', data.error_msgs);
    throw new Error('API failed: ' + url);
  }
  return data;
}

async function getLive(year, n) {
  const url = `${LIVE}/${year}/live_${n}.json`;
  try { return await httpJson(url); }
  catch (e) {
    console.error(`  ! live fetch failed for ${url}: ${e.message}`);
    return null;
  }
}

// ───────────── Calculation logic (ported from src/utils/calculations/) ─────────────
function liveVotesStatus(liveStream) {
  const status = {};
  if (liveStream?.data?.inc) {
    for (const inc of liveStream.data.inc) {
      status[inc.id_a] = { status: inc.sto };
      status[inc.id_b] = { status: inc.sto };
    }
  }
  const voti = {};
  if (liveStream?.data?.pl) {
    for (const p of liveStream.data.pl) {
      let bonus = 0;
      const events = Object.fromEntries(EVENT_KINDS.map(k => [k, 0]));
      for (const code of (p.bm || [])) {
        const e = EVENTS[code];
        if (!e) continue;
        bonus += e.Bonus;
        events[e.kind] = (events[e.kind] || 0) + 1;
      }
      voti[p.id] = { vt: p.v, fv: p.v + bonus, titolare: p.id_sos === 0, bonus, events };
    }
  }
  return { played: liveStream?.data?.inc || [], status, voti };
}

function modDifesa(titolari) {
  const fix = v => v === 100 ? 6 : v === 56 ? 6 : v === 55 ? 4 : v;
  const dif = titolari.filter(x => x.r === 'D');
  if (dif.length < 4) return 0;
  const top3 = dif.map(x => fix(x.voto_iniziale)).sort((a,b) => b - a).slice(0, 3);
  const por  = titolari.filter(x => x.r === 'P').map(x => fix(x.voto_iniziale))[0] ?? 6;
  const sum  = top3.reduce((s,x) => s + x, 0) + por;
  if (sum >= 28) return 5;
  if (sum >= 26) return 3;
  return 1;
}

function applySubstitutions(titolari, panchinari, completed) {
  let done = 0;
  const entrati = [];
  for (let j = 0; j < 11; j++) {
    const t = titolari[j];
    if (t.status === 4 && t.fv === 100) {
      let pool = completed
        ? panchinari.filter(x => x.r === t.r && x.fv !== 100)
        : panchinari.filter(x => x.r === t.r && (x.fv !== 100 || x.status !== 4));
      pool = pool.filter(x => !entrati.includes(x.id));
      if (done < 5) {
        if (pool.length > 0) {
          entrati.push(pool[0].id);
          t.sostituto      = pool[0];
          t.voto_finale    = pool[0].fv;
          t.voto_iniziale  = pool[0].vt;
          t.in_calcolo     = pool[0].in_calcolo;
          done++;
        } else {
          t.sostituto     = { n: 'Ufficio', fv: 4, vt: 4 };
          t.voto_finale   = 4;
          t.voto_iniziale = 4;
          done++;
        }
      } else {
        t.sostituto     = { n: 'Finite', fv: 0, vt: 0 };
        t.voto_finale   = 0;
        t.voto_iniziale = 0;
      }
    }
  }
  return { titolari, entrati };
}

// `lineups` is { [team id]: gaming/v1 teamLineup live `home` object }. That API
// returns bare player ids plus the scores it already calculated (`scr` = voto,
// `cscr` = fantavoto, 100 until the player's match has been played), so the
// player's name/role/team comes from the listone instead.
function buildFormazioni(lineups, ls, squadre, playerById) {
  const teams = squadre.data.map(x => x.id);
  const out = {};

  const mk = p => {
    const a = playerById[p.pid];
    const id_s = a ? a.id_s : null;
    const status = (id_s != null && ls.status[id_s]) ? ls.status[id_s].status : 4;
    const g = {
      id: p.pid,
      id_s,
      n: a ? a.n : 'Sconosciuto',
      r: a ? a.r_f : 'NA',
      vt: p.scr,
      fv: p.cscr,
      status,
      voto_iniziale: p.scr,
      voto_finale:   p.cscr,
      in_calcolo:    false,
    };
    // The gaming API only publishes a fantavoto once the match is over; while
    // one is running cscr is still 100. Fall back to the live feed, which
    // updates in real time. (vt > 10 is a senza-voto sentinel, not a vote.)
    if (status > 0 && p.cscr === 100) {
      const live = ls.voti[p.pid];
      if (live && live.vt <= 10) {
        g.voto_finale = live.fv; g.voto_iniziale = live.vt;
        g.fv = live.fv; g.vt = live.vt; g.in_calcolo = true;
      }
    }
    return g;
  };

  for (const sId of teams) {
    const lu = lineups[sId];
    let titolari, panchinari, notSchierata = false, puntiServer = 0;

    if (!lu || lu.act !== 1 || !lu.starts || lu.starts.length === 0) {
      notSchierata = true;
      const dummy = Array.from({ length: 22 }, () => ({
        id: 219, fv: 0, vt: 0, r: 'NA', n: 'Non Schierato', t: null, status: 4,
        voto_iniziale: 0, voto_finale: 0, in_calcolo: false,
      }));
      titolari   = dummy.slice(0, 11);
      panchinari = dummy.slice(11, 22);
    } else {
      titolari    = lu.starts.map(mk);
      panchinari  = lu.bench.map(mk);
      puntiServer = lu.tot;
    }

    // The manual coach switch the legacy API exposed as sa/sb is already
    // reflected in the order the gaming API returns.
    const subRes = applySubstitutions(titolari, panchinari, true);
    titolari = subRes.titolari;

    const expPoints = titolari.reduce((s, x) => s + (x.voto_finale === 100 ? 6 : x.voto_finale), 0);
    const team = squadre.data.find(y => y.id === sId);
    out[sId] = {
      Name: team?.n || 'Unknown',
      Coach: team?.nu || 'Unknown',
      Jersey: team?.ms || '',
      Modulo: lu?.mdl ?? '',
      Titolari: titolari,
      Panchinari: panchinari,
      NotSchierata: notSchierata,
      PuntiServer: puntiServer,
      PuntiPrevisti: expPoints + modDifesa(titolari),
    };
  }
  return out;
}

// ───────────── CSV helpers ─────────────
function csvCell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function toCsv(rows, headers) {
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map(h => csvCell(r[h])).join(','));
  return lines.join('\n') + '\n';
}

// ───────────── Rosa detection ─────────────
// lista_calciatori may or may not carry a fanta-team field. We try several
// common names and fall back to building rosa from the union of all per-giornata
// formazioni for each team.
function detectTeamOwnerField(players, knownTeamIds) {
  if (!players?.data?.length) return null;
  const sample = players.data[0];
  const candidates = ['id_team', 'idsl', 'idsq', 'id_squadra', 'fteam', 'id_fanta_squadra', 'id_lega_squadra', 'sq_lega'];
  for (const k of candidates) {
    if (k in sample) {
      // verify the field values look like team ids
      const vals = new Set(players.data.map(p => p[k]).filter(v => v));
      const overlap = [...vals].filter(v => knownTeamIds.includes(v)).length;
      if (overlap >= Math.min(3, knownTeamIds.length)) return k;
    }
  }
  return null;
}

// ───────────── Main ─────────────
async function main() {
  const [, , username, password, maxGArg] = process.argv;
  if (!username || !password) {
    console.error('Usage: node scripts/pull_season.mjs <username> <password> [max_giornata]');
    process.exit(1);
  }

  console.log('→ Login');
  const tokens = await login(username, password);

  console.log('→ Static data');
  const profilo    = await get(`${BASE}/v1_lega/profilo`, tokens);
  const attive     = competizioni_attive(profilo);
  COMP_ID          = attive.campionato;
  console.log(`  campionato: ${COMP_ID} (${attive.squadre.length} squadre)`);
  const timer      = await get(`${BASE}/v1_lega/timer`, tokens);
  const squadre    = await get(`${BASE}/v1_lega/squadre`, tokens);
  // Only the teams entered in this season's campionato: drops retired teams and
  // the "New Riposo" bye placeholder the cups use.
  squadre.data     = squadre.data.filter(x => attive.squadre.includes(x.id));
  const players    = await get(`${BASE}/v1_calciatori/lista`, tokens);
  const campionato = await get(`${BASE}/V2_LegaCompetizioni/completa?id=${COMP_ID}`, tokens);

  const year         = timer.data.id_stagione;
  const startYear    = jerseyYear(year);
  OUT_DIR = path.resolve(__dirname, '..', `${startYear}-${startYear + 1}`);
  await fs.mkdir(OUT_DIR, { recursive: true });
  const totalSched   = campionato.data.cale.cinc.length;
  // A giornata is "played" when at least one match shows non-zero points.
  let lastPlayed = 0;
  for (let i = 0; i < totalSched; i++) {
    const incs = campionato.data.cale.cinc[i]?.inc || [];
    if (incs.some(m => (m.pa || 0) + (m.pb || 0) > 0)) lastPlayed = i + 1;
  }
  // Live-JSON offset: derive by probing for a known played round.
  // For the first played giornata, try a small range of offsets and pick the one whose live JSON exists.
  let liveOffset = null;
  for (const off of [3, 4, 5, 2, 1, 0, 6, 7]) {
    const probe = await getLive(year, 1 + off);
    if (probe && probe.data && probe.data.inc) { liveOffset = off; break; }
  }
  if (liveOffset === null) {
    console.warn('  ! Could not detect live-JSON offset; live data will be skipped (formazioni still authoritative)');
  }
  // Default to what has actually been calculated; an explicit argument wins so
  // an in-progress giornata can be pulled too, bounded by the calendar.
  const maxG = maxGArg ? Math.min(parseInt(maxGArg, 10), totalSched) : lastPlayed;

  const teamIds = squadre.data.map(x => x.id);
  const teamById = Object.fromEntries(squadre.data.map(x => [x.id, x]));

  console.log(`  year=${year}  scheduled_giornate=${totalSched}  last_played=${lastPlayed}  live_offset=${liveOffset}  pulling 1..${maxG}`);
  console.log(`  ${squadre.data.length} teams, ${players.data?.length || 0} players in lista_calciatori`);

  // Build rosa per team from squadre[*].cal (authoritative: semicolon-separated player ids)
  const rosaFromCal = {};
  for (const s of squadre.data) {
    const ids = (s.cal || '').split(';').map(x => parseInt(x, 10)).filter(x => !isNaN(x) && x > 0);
    rosaFromCal[s.id] = new Set(ids);
  }
  const rosaSizes = Object.values(rosaFromCal).map(s => s.size);
  console.log(`  rosa sizes from squadre[*].cal: min=${Math.min(...rosaSizes)} max=${Math.max(...rosaSizes)} avg=${(rosaSizes.reduce((a,b)=>a+b,0)/rosaSizes.length).toFixed(1)}`);

  // Maps for player name and team-of-Serie-A lookup
  const playerById = Object.fromEntries((players.data || []).map(p => [p.id, p]));

  // Accumulators
  const formRows  = [];
  const classRows = [];

  // PASS 1: pull every giornata's formazione + live, store them.
  const perG = []; // perG[g-1] = { f, ls }
  for (let g = 1; g <= maxG; g++) {
    process.stdout.write(`→ Pull giornata ${g}/${maxG} ... `);
    const [lineups, liveRaw] = await Promise.all([
      fetchLineups(tokens, COMP_ID, g, g + (liveOffset ?? 0), teamIds)
        .catch(e => { console.error(e.message); return {}; }),
      liveOffset !== null ? getLive(year, g + liveOffset) : Promise.resolve(null),
    ]);
    const ls = liveVotesStatus(liveRaw || { data: { inc: [], pl: [] } });
    const f  = buildFormazioni(lineups, ls, squadre, playerById);
    perG.push({ f, ls });
    console.log(`done (formazioni: ${Object.keys(f).length} teams, live players: ${Object.keys(ls.voti).length})`);
    await new Promise(r => setTimeout(r, 200));
  }

  // Build historical rosa per team: current cal ∪ everyone who ever appeared in a formazione.
  // This catches players who were transferred out mid-season.
  const rosaByTeam = Object.fromEntries(teamIds.map(id => [id, new Set(rosaFromCal[id])]));
  for (const { f } of perG) {
    for (const sId of teamIds) {
      const team = f[sId];
      for (const arr of [team.Titolari, team.Panchinari]) {
        for (const p of arr) {
          if (p.id && p.id !== 219) rosaByTeam[sId].add(p.id);
        }
      }
    }
  }
  const histSizes = Object.values(rosaByTeam).map(s => s.size);
  console.log(`  historical rosa sizes (cal ∪ all formations): min=${Math.min(...histSizes)} max=${Math.max(...histSizes)} avg=${(histSizes.reduce((a,b)=>a+b,0)/histSizes.length).toFixed(1)}`);

  // helper: returns event-kind columns for a player given the giornata's live state
  const emptyEvents = Object.fromEntries(EVENT_KINDS.map(k => [k, 0]));
  const eventCols = (ls, pid) => (ls.voti[pid]?.events) || emptyEvents;

  // PASS 2: emit rows
  for (let g = 1; g <= maxG; g++) {
    const { f, ls } = perG[g - 1];
    for (const sId of teamIds) {
      const team = f[sId];
      const matchById = {};

      // titolari
      team.Titolari.forEach((p, idx) => {
        const liveV = ls.voti[p.id];
        matchById[p.id] = true;
        formRows.push({
          giornata: g,
          team_id: sId,
          team_name: team.Name,
          coach: team.Coach,
          slot: 'Titolare',
          slot_index: idx + 1,
          player_id: p.id,
          player_name: p.n,
          role: p.r,
          role_full: ROLES[p.r] || p.r,
          serie_a_team: playerById[p.id]?.s || '',
          match_status: STATUS[p.status] ?? p.status,
          voto_iniziale: p.vt,
          voto_finale: p.fv,
          live_voto_iniziale: liveV?.vt ?? '',
          live_voto_finale:   liveV?.fv ?? '',
          live_bonus:         liveV?.bonus ?? '',
          in_calcolo: p.in_calcolo,
          played_as_starter: liveV ? liveV.titolare : '',
          was_replaced: p.sostituto ? true : false,
          replaced_by_player_id:   p.sostituto?.id ?? '',
          replaced_by_player_name: p.sostituto?.n ?? '',
          final_voto_after_sub:    p.voto_finale,
          contributes_points:      p.voto_finale === 100 ? 6 : p.voto_finale,
          modulo: team.Modulo,
          team_not_schierata: team.NotSchierata,
          ...eventCols(ls, p.id),
        });
      });

      // panchinari
      const subInLookup = {};
      team.Titolari.forEach(t => {
        if (t.sostituto?.id) subInLookup[t.sostituto.id] = t;
      });
      team.Panchinari.forEach((p, idx) => {
        const liveV = ls.voti[p.id];
        matchById[p.id] = true;
        const cameInFor = subInLookup[p.id];
        formRows.push({
          giornata: g,
          team_id: sId,
          team_name: team.Name,
          coach: team.Coach,
          slot: 'Panchina',
          slot_index: idx + 1,
          player_id: p.id,
          player_name: p.n,
          role: p.r,
          role_full: ROLES[p.r] || p.r,
          serie_a_team: playerById[p.id]?.s || '',
          match_status: STATUS[p.status] ?? p.status,
          voto_iniziale: p.vt,
          voto_finale: p.fv,
          live_voto_iniziale: liveV?.vt ?? '',
          live_voto_finale:   liveV?.fv ?? '',
          live_bonus:         liveV?.bonus ?? '',
          in_calcolo: p.in_calcolo,
          played_as_starter: liveV ? liveV.titolare : '',
          was_replaced: false,
          replaced_by_player_id: '',
          replaced_by_player_name: '',
          final_voto_after_sub: p.voto_finale,
          contributes_points: 0,
          came_in_for_player_id:   cameInFor?.id ?? '',
          came_in_for_player_name: cameInFor?.n ?? '',
          actually_used_as_sub:    cameInFor ? true : false,
          modulo: team.Modulo,
          team_not_schierata: team.NotSchierata,
          ...eventCols(ls, p.id),
        });
      });

      // Note: contributes_points on a Panchina row is 0. When a panchinaro is used as substitute,
      // his vote is credited to the Titolare slot (replaced_by_*), not to himself, so we don't double-count.

      // fuori-lista: historical-rosa players not in titolari+panchinari for this giornata
      for (const pid of rosaByTeam[sId]) {
        if (matchById[pid]) continue;
        const meta = playerById[pid];
        const liveV = ls.voti[pid];
        formRows.push({
          giornata: g,
          team_id: sId,
          team_name: team.Name,
          coach: team.Coach,
          slot: 'Fuori_Lista',
          slot_index: '',
          player_id: pid,
          player_name: meta?.n || '',
          role: meta?.r || '',
          role_full: ROLES[meta?.r] || meta?.r || '',
          serie_a_team: meta?.s || '',
          match_status: '',
          voto_iniziale: '',
          voto_finale: '',
          live_voto_iniziale: liveV?.vt ?? '',
          live_voto_finale:   liveV?.fv ?? '',
          live_bonus:         liveV?.bonus ?? '',
          in_calcolo: false,
          played_as_starter: liveV ? liveV.titolare : '',
          was_replaced: false,
          replaced_by_player_id: '',
          replaced_by_player_name: '',
          final_voto_after_sub: '',
          contributes_points: 0,
          in_current_rosa: rosaFromCal[sId].has(pid),
          modulo: team.Modulo,
          team_not_schierata: team.NotSchierata,
          ...eventCols(ls, pid),
        });
      }
    }
  }

  // classifica: per-giornata + cumulative + rank
  const ptsByTeamByG = Object.fromEntries(teamIds.map(id => [id, {}]));
  for (let i = 0; i < Math.min(maxG, campionato.data.cale.cinc.length); i++) {
    const giornata = i + 1;
    const incs = campionato.data.cale.cinc[i]?.inc || [];
    for (const m of incs) {
      if (ptsByTeamByG[m.ida]) ptsByTeamByG[m.ida][giornata] = m.pa;
      if (ptsByTeamByG[m.idb]) ptsByTeamByG[m.idb][giornata] = m.pb;
    }
  }
  // Build rows with running cumulative + rank + goals
  const fantaGoals = pts => Math.max(Math.floor((pts - 66) / 4) + 1, 0);
  for (let g = 1; g <= maxG; g++) {
    const rows = teamIds.map(id => {
      let cum = 0, gcum = 0;
      for (let k = 1; k <= g; k++) {
        const p = ptsByTeamByG[id][k] || 0;
        cum  += p;
        gcum += fantaGoals(p);
      }
      const team = teamById[id];
      const p_g  = ptsByTeamByG[id][g] ?? 0;
      return {
        giornata: g,
        team_id: id,
        team_name: team?.n || '',
        coach: team?.nu || '',
        points_giornata: p_g,
        goals_giornata: fantaGoals(p_g),
        points_cumulative: cum,
        goals_cumulative: gcum,
      };
    });
    [...rows].sort((a,b) => b.points_giornata - a.points_giornata).forEach((r, i) => { r.rank_giornata = i + 1; });
    [...rows].sort((a,b) => b.points_cumulative - a.points_cumulative).forEach((r, i) => { r.rank_cumulative = i + 1; });
    classRows.push(...rows);
  }

  // ───────────── Write CSVs ─────────────
  const formHeaders = [
    'giornata','team_id','team_name','coach',
    'slot','slot_index',
    'player_id','player_name','role','role_full','serie_a_team',
    'match_status',
    'voto_iniziale','voto_finale',
    'live_voto_iniziale','live_voto_finale','live_bonus',
    'in_calcolo','played_as_starter',
    'was_replaced','replaced_by_player_id','replaced_by_player_name',
    'came_in_for_player_id','came_in_for_player_name','actually_used_as_sub',
    'modulo',
    'final_voto_after_sub','contributes_points',
    'in_current_rosa','team_not_schierata',
    ...EVENT_KINDS,
  ];
  const classHeaders = ['giornata','team_id','team_name','coach','points_giornata','goals_giornata','points_cumulative','goals_cumulative','rank_giornata','rank_cumulative'];

  await fs.writeFile(path.join(OUT_DIR, 'formazioni.csv'), toCsv(formRows, formHeaders));
  await fs.writeFile(path.join(OUT_DIR, 'classifica.csv'), toCsv(classRows, classHeaders));

  console.log(`\n✓ Wrote:`);
  console.log(`  ${OUT_DIR}/formazioni.csv  (${formRows.length} rows)`);
  console.log(`  ${OUT_DIR}/classifica.csv  (${classRows.length} rows)`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
