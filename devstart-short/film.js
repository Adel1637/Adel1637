// Beginner developer? Start here. — kinetic dark-software style, fictional page and code.
// Content: shared/devstart-topic.js (checked online on 26 Nov 2026).
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeDev, devTopic } from '../shared/devstart-topic.js';
const K = makeKinetic(M), D = makeDev(M, K);
kineticFilm(M, K, devTopic(K, D, false));
