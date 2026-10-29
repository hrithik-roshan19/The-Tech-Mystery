const subtopic1Questions = require('./subtopic1-classical-substitution');
const subtopic2Questions = require('./subtopic2-vigenere-polyalphabetic');
const subtopic3Questions = require('./subtopic3-classical-transposition');
const subtopic4Questions = require('./subtopic4-frequency-analysis');
const subtopic5Questions = require('./subtopic5-kasiski-keylength');
const subtopic6Questions = require('./subtopic6-known-plaintext');
const subtopic7Questions = require('./subtopic7-multilayer-corrupted');

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
  levelNumber: 3,
  title: 'Lost Transmission',
  difficulty: 'MEDIUM',
  questions
};

