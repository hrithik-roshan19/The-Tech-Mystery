const subtopic1Questions = require('./subtopic1-pcap-reassembly');
const subtopic2Questions = require('./subtopic2-protocol-headers');
const subtopic3Questions = require('./subtopic3-tls-encryption');
const subtopic4Questions = require('./subtopic4-netflow-telemetry');
const subtopic5Questions = require('./subtopic5-covert-tunnels');
const subtopic6Questions = require('./subtopic6-network-attacks');
const subtopic7Questions = require('./subtopic7-incident-reconstruction');

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
  levelNumber: 8,
  title: 'Packet Highway',
  difficulty: 'HARD',
  questions
};

