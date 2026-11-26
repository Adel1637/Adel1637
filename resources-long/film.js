// Free resources for designers — kinetic dark-software style with real screenshots of public sites (captured 26 Nov 2026).
// Content: shared/resources-topic.js (checked online on 26 Nov 2026). Names as text only, no logo redrawn.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { resourcesTopic } from '../shared/resources-topic.js';
const K = makeKinetic(M);
kineticFilm(M, K, resourcesTopic(M, K, true));
