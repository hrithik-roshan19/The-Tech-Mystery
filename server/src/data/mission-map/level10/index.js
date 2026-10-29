const subtopic1Questions = require('./subtopic1-signal-web-recon-synthesis');
const subtopic2Questions = require('./subtopic2-cryptography-osint-synthesis');
const subtopic3Questions = require('./subtopic3-binary-memory-synthesis');
const subtopic4Questions = require('./subtopic4-pwn-network-synthesis');
const subtopic5Questions = require('./subtopic5-steganography-polyalphabetic-synthesis');
const subtopic6Questions = require('./subtopic6-incident-chain-correlation');
const subtopic7Questions = require('./subtopic7-master-flag-citadel-reconstruction');

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
  levelNumber: 10,
  title: 'The Master Flag Citadel',
  difficulty: 'EXPERT',
  questions
};

