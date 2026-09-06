// Everything that changes when a new season starts.
//
// Only APP_KEY and LEGA_ID are hardcoded — the competition ids and the giornata
// offset are discovered at runtime from `v1_lega/profilo`, so a new season needs
// no code change. `node scripts/discover_season.mjs <user> <pass>` prints what
// the discovery would find, for when something looks off.

// Client key of the Leghe FC app. Rotates when the app ships a major version
// (last rotation: 2026-08-06, app v13.0.1). A stale key makes every appleghe
// call return S015 "Disinstalla la tua app" — including login. Refresh it from
// the apk: see asta-fantacalcio/docs/data-sources-apps.md.
export const APP_KEY = 'hz0bDrnBQfhftnmezks8hZDKjnHlHNc5';

// The Bailando lega. Stable across seasons.
export const LEGA_ID = 1113631;

// Calendar year the season starts in — used for the jersey image folder
// (`maglietta_<year>`). id_stagione 20 -> 2025/26, 21 -> 2026/27.
export const jerseyYear = (idStagione) => 2005 + idStagione;

// `v1_lega/profilo` returns every competition the lega has ever had. The ones
// for the current season are those not marked `eliminata`. `tipo` tells them
// apart: 2 = campionato (formula uno, one row per team per giornata), 6 =
// knockout cup (head-to-head), 3 = secondary all-play-all competition.
const TIPO_CAMPIONATO = 2;
const TIPO_COPPA = 6;

export function competizioni_attive(profilo) {
	const all = profilo?.data?.lega?.competizioni ?? [];
	const attive = all.filter(c => !c.eliminata);
	const campionato = attive.find(c => c.tipo === TIPO_CAMPIONATO);
	if (!campionato) {
		throw new Error(
			`No active competition of tipo ${TIPO_CAMPIONATO} in lega profilo ` +
			`(found: ${attive.map(c => `${c.id}/${c.nome}/tipo${c.tipo}`).join(', ') || 'none'})`
		);
	}
	return {
		campionato: campionato.id,
		// The teams actually playing this season. The lega roster is a superset:
		// it keeps retired teams, plus the "New Riposo" placeholder the cups use
		// as a bye when there's an odd number of entrants. Only the campionato's
		// own participant list is trustworthy.
		squadre: campionato.squadre.map(s => s.id),
		// Only the head-to-head cups: those are what "Scontri Diretti" renders.
		coppe: attive.filter(c => c.tipo === TIPO_COPPA).map(c => c.id),
		// The campionato starts at Serie A giornata `giornata_inizio`, so lega
		// giornata 1 == Serie A giornata `giornata_inizio`. Everything keyed on
		// the Serie A giornata (the live JSON) needs that offset added back.
		delay: campionato.giornata_inizio - 1
	};
}
