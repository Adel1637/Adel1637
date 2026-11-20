// Code for designers — kinetic dark-software style. Content: shared/code-topics.js ('ui'),
// vignettes: shared/code-kinetic.js, film builder: shared/kinetic-film.js. Hook per shared/accroche.md.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { makeCodeKinetic } from '../shared/code-kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { topic } from '../shared/code-topics.js';
const K = makeKinetic(M), CK = makeCodeKinetic(M, K);
kineticFilm(M, K, topic('ui', K, CK, M.W > M.H));
