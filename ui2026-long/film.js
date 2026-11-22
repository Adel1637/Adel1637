// UI in 2026: what's in, what's out — kinetic dark-software style. Content + vignettes: shared/ui2026.js
// (facts checked online on 22 Nov 2026), builder: shared/kinetic-film.js. Hook per shared/accroche.md.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeUI2026, ui2026Topic } from '../shared/ui2026.js';
const K = makeKinetic(M), U = makeUI2026(M, K);
kineticFilm(M, K, ui2026Topic(K, U, M.W > M.H));
