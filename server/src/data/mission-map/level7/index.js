const subtopic1Questions = require('./subtopic1-stack-frames');
const subtopic2Questions = require('./subtopic2-buffer-boundaries');
const subtopic3Questions = require('./subtopic3-return-addresses');
const subtopic4Questions = require('./subtopic4-debugger-traces');
const subtopic5Questions = require('./subtopic5-mitigations');
const subtopic6Questions = require('./subtopic6-rop-gadgets');
const subtopic7Questions = require('./subtopic7-multistep-analysis');

const questions = [
  ...subtopic1Questions,
  ...subtopic2Questions,
  ...subtopic3Questions,
  ...subtopic4Questions,
  ...subtopic5Questions,
  ...subtopic6Questions,
  ...subtopic7Questions
];

module.exports = {
  levelNumber: 7,
  title: 'Buffer Vulnerability Exploitation',
  difficulty: 'HARD',
  questions
};

