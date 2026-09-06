#!/usr/bin/env node
// Prints every value src/config/season.js needs for the current season:
// id_stagione, the competition ids inside the lega, and the giornata offset
// between the Serie A giornata (from the timer) and the lega giornata.
//
// Usage:
//   node scripts/discover_season.mjs <username> <password>
//
// Credentials are only sent to appleghe.fantacalcio.it and never written to disk.

import { spawn } from 'node:child_process';

const BASE = 'https://appleghe.fantacalcio.it/api/v1';
const { APP_KEY, LEGA_ID, competizioni_attive, jerseyYear } =
  await import('../src/config/season.js');

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
    cp.on('close', c => c === 0 ? resolve(out) : reject(new Error(`curl ${c}: ${err}`)));
  });
}
const json = async (url, opts) => JSON.parse(await curl(url, opts));

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error('Usage: node scripts/discover_season.mjs <username> <password>');
  process.exit(1);
}

// ── login ───────────────────────────────────────────────────────────────────
const auth = await json(`${BASE}/v1_utente/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', app_key: APP_KEY },
  body: JSON.stringify({ username, password }),
});
if (!auth.success) {
  const id = auth.error_msgs?.[0]?.id;
  console.error('Login failed:', JSON.stringify(auth.error_msgs));
  if (id === 'S015') {
    console.error('S015 = APP_KEY in src/config/season.js is stale — pull the new one from');
    console.error('the Leghe FC apk (asta-fantacalcio/docs/data-sources-apps.md).');
  } else {
    console.error('The app_key is fine (it got as far as checking credentials).');
    console.error('`username` is your fantacalcio.it login — the email or the username you');
    console.error('registered the Leghe account with, not necessarily your main email.');
  }
  process.exit(1);
}
const lega = auth.data.leghe.find(l => l.id === LEGA_ID) || auth.data.leghe[0];
const headers = {
  'Content-Type': 'application/json',
  app_key: APP_KEY,
  lega_token: lega.token,
  user_token: auth.data.utente.utente_token,
};
console.log('leghe on this account:');
for (const l of auth.data.leghe) {
  console.log(`  ${JSON.stringify({ ...l, token: '<hidden>' })}`);
}
if (lega.id !== LEGA_ID) console.log(`! LEGA_ID ${LEGA_ID} not on this account; using ${lega.id}`);

// ── season ──────────────────────────────────────────────────────────────────
const timer = await json(`${BASE}/v1_lega/timer`, { headers });
const idStagione = timer.data.id_stagione;
console.log(`\nid_stagione: ${idStagione}  (season ${jerseyYear(idStagione)}/${jerseyYear(idStagione) + 1})`);
console.log(`timer giornata (Serie A): ${timer.data.giornata}`);

// ── competitions ────────────────────────────────────────────────────────────
// `v1_lega/profilo` carries every competition the lega has ever had; the ones
// for the current season are the ones not marked `eliminata`. This is the same
// source the app uses at runtime.
const profilo = await json(`${BASE}/v1_lega/profilo`, { headers });
console.log('\nall competitions on this lega (* = active this season):');
for (const c of profilo.data.lega.competizioni) {
  console.log(`  ${c.eliminata ? ' ' : '*'} ${c.id}  tipo=${c.tipo}  ${c.nome}` +
              `  giornate ${c.giornata_inizio}-${c.giornata_fine}  ${c.squadre.length} squadre`);
}

const { campionato, coppe, delay } = competizioni_attive(profilo);
console.log(`\nwhat the app will use:`);
console.log(`  campionato: ${campionato}`);
console.log(`  coppe:      [${coppe.join(', ')}]`);
console.log(`  delay:      ${delay}  → lega giornata ${timer.data.giornata - delay} is current`);

// Cross-check the delay against the calendar itself: every giornata carries both
// the lega number (gl) and the Serie A number (ga), so ga - gl must equal delay.
const cale = await json(`${BASE}/V2_LegaCompetizioni/completa?id=${campionato}`, { headers });
const cinc = cale.data?.cale?.cinc ?? [];
const offsets = [...new Set(cinc.map(g => g.ga - g.gl))];
console.log(`  calendar ga-gl offsets: [${offsets.join(', ')}]` +
            (offsets.length === 1 && offsets[0] === delay ? '  ✓ matches' : '  ✗ MISMATCH'));
for (const id of coppe) {
  const r = await json(`${BASE}/V2_LegaCompetizioni/completa?id=${id}`, { headers });
  console.log(`  coppa ${id}: ${r.data?.n} — ${r.data?.cale?.cinc?.length ?? 0} giornate` +
              ` (Serie A ${r.data?.gi}-${r.data?.gf})`);
}
