/**
 * Master Aggregator for Level 2: Hidden in Plain Sight
 * Official Mission Map Question Bank (70 Open-Ended Questions)
 */

const subtopic1 = require('./subtopic1-html-dom');
const subtopic2 = require('./subtopic2-attributes');
const subtopic3 = require('./subtopic3-css-hidden');
const subtopic4 = require('./subtopic4-comments');
const subtopic5 = require('./subtopic5-javascript');
const subtopic6 = require('./subtopic6-devtools');
const subtopic7 = require('./subtopic7-trust-boundaries');

const level2Questions = [
  ...subtopic1,
  ...subtopic2,
  ...subtopic3,
  ...subtopic4,
  ...subtopic5,
  ...subtopic6,
  ...subtopic7
];

module.exports = {
  levelNumber: 2,
  title: 'Hidden in Plain Sight',
  difficulty: 'EASY',
  questions: level2Questions
};

