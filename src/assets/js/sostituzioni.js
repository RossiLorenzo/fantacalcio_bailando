export default function sostituzioni(t, p, c) {
    let sostituzioni_fatte = 0;
    let p_d = p;
    for (let j = 0; j < 11; j++) {
        // Effettua sostituzioni
        if (t[j].status == 4 && t[j].fv == 100) {
            let p_s;
            if (c) {
                p_s = p_d.filter(x => x.r == t[j]['r'] && x.fv != 100);
            } else {
                p_s = p_d.filter(x => x.r == t[j]['r'] && (x.fv != 100 || x.status != 4));
            }
            if (sostituzioni_fatte < 5) {
                if (p_s.length > 0) {
                    p_d = p.filter(x => x.id != p_s[0].id)
                    t[j]['sostituto'] = p_s[0];
                    t[j]['voto_finale'] = t[j]['sostituto']['fv'];
                    t[j]['voto_iniziale'] = t[j]['sostituto']['vt'];
                    t[j]['in_calcolo'] = t[j]['sostituto']['in_calcolo'];
                    sostituzioni_fatte++;
                } else {
                    t[j]['sostituto'] = {
                        'n': 'Ufficio',
                        'fv': 4
                    };
                    t[j]['voto_finale'] = 4;
                    t[j]['voto_iniziale'] = 4;
                    sostituzioni_fatte++;
                }
            } else {
                t[j]['sostituto'] = {
                    'n': 'Finite',
                    'fv': 0
                };
                t[j]['voto_finale'] = t[j]['sostituto']['fv'];
                t[j]['voto_iniziale'] = t[j]['sostituto']['vt'];
            }

        }
    }
    return t;
}