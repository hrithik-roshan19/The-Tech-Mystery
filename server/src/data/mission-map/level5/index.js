const subtopic1Questions = require('./subtopic1-binary-formats');
const subtopic2Questions = require('./subtopic2-assembly-controlflow');
const subtopic3Questions = require('./subtopic3-bytecode-instruction');
const subtopic4Questions = require('./subtopic4-strings-symbols');
const subtopic5Questions = require('./subtopic5-reverse-validation');
const subtopic6Questions = require('./subtopic6-debugging-traces');
const subtopic7Questions = require('./subtopic7-multistep-flag-recovery');

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
  levelNumber: 5,
  title: 'Binary Echo',
  difficulty: 'HARD',
  questions
};

