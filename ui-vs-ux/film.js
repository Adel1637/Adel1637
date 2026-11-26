// UI and UX are not the same — kinetic dark-software style. Content + vignettes: shared/uiux-topic.js
// (facts checked online on 22 Nov 2026), builder: shared/kinetic-film.js. Hook per shared/accroche.md.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeUIUX, uiuxTopic } from '../shared/uiux-topic.js';
const K = makeKinetic(M), U = makeUIUX(M, K);
kineticFilm(M, K, uiuxTopic(K, U, M.W > M.H));
