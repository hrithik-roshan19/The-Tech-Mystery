/**
 * Master Aggregator for Level 1: Orientation & Signal Breaker
 * Official Mission Map Question Bank (70 Open-Ended Questions)
 */

const subtopic1 = require('./subtopic1-methodology');
const subtopic2 = require('./subtopic2-signals');
const subtopic3 = require('./subtopic3-binary-hex-ascii');
const subtopic4 = require('./subtopic4-transformations');
const subtopic5 = require('./subtopic5-patterns');
const subtopic6 = require('./subtopic6-evidence');
const subtopic7 = require('./subtopic7-malformed');
const subtopic8 = require('./subtopic8-multistep');

const level1Questions = [
  ...subtopic1,
  ...subtopic2,
  ...subtopic3,
  ...subtopic4,
  ...subtopic5,
  ...subtopic6,
  ...subtopic7,
  ...subtopic8
];

module.exports = {
  levelNumber: 1,
  title: 'Orientation & Signal Breaker',
  difficulty: 'EASY',
  questions: level1Questions
};

