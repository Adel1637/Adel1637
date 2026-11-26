// UX terms in 60 seconds — kinetic dark-software style, fictional interfaces. Content: shared/terms-topic.js (checked online on 25 Nov 2026).
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeTerms, termsTopic } from '../shared/terms-topic.js';
const K = makeKinetic(M), Q = makeTerms(M, K);
kineticFilm(M, K, termsTopic(K, Q, 'ux'));
