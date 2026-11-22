// How to choose the right icons — kinetic dark-software style. Content + vignettes: shared/icons-topic.js
// (facts checked online on 22 Nov 2026), builder: shared/kinetic-film.js. Hook per shared/accroche.md.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeIcons, iconsTopic } from '../shared/icons-topic.js';
const K = makeKinetic(M), I = makeIcons(M, K);
kineticFilm(M, K, iconsTopic(K, I, M.W > M.H));
