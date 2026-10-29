const subtopic1Questions = require('./subtopic1-osint-methodology');
const subtopic2Questions = require('./subtopic2-git-history');
const subtopic3Questions = require('./subtopic3-file-metadata');
const subtopic4Questions = require('./subtopic4-exposed-secrets');
const subtopic5Questions = require('./subtopic5-identity-correlation');
const subtopic6Questions = require('./subtopic6-search-recon');
const subtopic7Questions = require('./subtopic7-timeline-investigation');

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
  levelNumber: 4,
  title: 'Digital Footprint',
  difficulty: 'MEDIUM',
  questions
};

