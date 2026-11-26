// UI/UX principles for dashboards — kinetic dark-software style. Content + vignettes: shared/dashboard-topic.js
// (facts checked online on 23 Nov 2026; random demo data), builder: shared/kinetic-film.js. Hook per shared/accroche.md.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeDashboard, dashboardTopic } from '../shared/dashboard-topic.js';
const K = makeKinetic(M), D = makeDashboard(M, K);
kineticFilm(M, K, dashboardTopic(K, D, M.W > M.H));
