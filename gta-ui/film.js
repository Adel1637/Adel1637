// What GTA 6's UI teaches designers — kinetic dark-software style. FICTIONAL game UI (no Rockstar asset).
// Content + vignettes: shared/gta-topic.js (facts checked online on 23 Nov 2026), builder: shared/kinetic-film.js.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeGta, gtaTopic } from '../shared/gta-topic.js';
const K = makeKinetic(M), G = makeGta(M, K);
kineticFilm(M, K, gtaTopic(K, G, M.W > M.H));
