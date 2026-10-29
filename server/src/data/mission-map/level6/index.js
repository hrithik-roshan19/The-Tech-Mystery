const subtopic1Questions = require('./subtopic1-memory-acquisition');
const subtopic2Questions = require('./subtopic2-process-discovery');
const subtopic3Questions = require('./subtopic3-volatile-artifacts');
const subtopic4Questions = require('./subtopic4-network-sockets');
const subtopic5Questions = require('./subtopic5-command-history');
const subtopic6Questions = require('./subtopic6-disk-artifacts');
const subtopic7Questions = require('./subtopic7-multiartifact-correlation');

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
  levelNumber: 6,
  title: 'Memory Artifacts',
  difficulty: 'HARD',
  questions
};

