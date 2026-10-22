const { generateCheckpointToken } = require('../utils/crypto');
function checkpointToken(checkpoint) {
  if (checkpoint.mode === 'Team-bound QR' && !checkpoint.boundTeamId) return null;
  return generateCheckpointToken(checkpoint.checkpointCode, checkpoint.levelNumber,
    { teamId: checkpoint.mode === 'Team-bound QR' ? checkpoint.boundTeamId : null });
}
module.exports = { checkpointToken };
