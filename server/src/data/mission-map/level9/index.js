const subtopic1Questions = require('./subtopic1-bitplane-lsb');
const subtopic2Questions = require('./subtopic2-image-metadata-pixels');
const subtopic3Questions = require('./subtopic3-frequency-domain');
const subtopic4Questions = require('./subtopic4-audio-spectrograms');
const subtopic5Questions = require('./subtopic5-polyalphabetic-logic');
const subtopic6Questions = require('./subtopic6-file-signatures-carving');
const subtopic7Questions = require('./subtopic7-composite-logic-reconstruction');

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
  levelNumber: 9,
  title: 'Polyalphabetic Steganography',
  difficulty: 'EXPERT',
  questions
};

