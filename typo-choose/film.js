// How to choose a font — kinetic dark-software style, 6 real OFL fonts tested 7 ways.
// Content + vignettes: shared/typo-topic.js (facts checked online and measured on 24 Nov 2026), builder: shared/kinetic-film.js.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { kineticFilm } from '../shared/kinetic-film.js';
import { makeTypo, typoTopic } from '../shared/typo-topic.js';
const K = makeKinetic(M), Y = makeTypo(M, K);
kineticFilm(M, K, typoTopic(K, Y, M.W > M.H));
