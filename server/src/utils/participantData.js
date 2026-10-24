const WITHHELD = 'Content withheld pending organizer review.';

function safeContent(value, answers = []) {
  if (typeof value !== 'string') return value;
  const lower = value.toLowerCase();
  if (/HTG\{[^}]+\}/i.test(value) || answers.some(a => a && lower.includes(String(a).toLowerCase()))) return WITHHELD;
  return value;
}

// Explicit DTO: never serialize entire private question documents, hints or metadata.
async function privateAnswers() {
  const keys = await require('../models').Question.find().select('flag').lean();
  return keys.map(key => key.flag).filter(Boolean);
}

async function participantQuestion(question) {
  const answers = await privateAnswers();
  if (!question) throw new Error('Assigned question is unavailable');
  const fields = ['title', 'prompt', 'category', 'difficulty', 'type', 'instructions'];
  const result = {
    _id: question._id,
    levelNumber: question.levelNumber,
    points: question.points,
    attempts: question.attempts,
    isCaseSensitive: Boolean(question.isCaseSensitive)
  };
  for (const field of fields) {
    if (question[field] !== undefined) {
      result[field] = safeContent(question[field], answers);
    }
  }
  if (Array.isArray(question.options)) {
    result.options = question.options.map(opt => String(opt || '').trim()).filter(Boolean);
  }
  result.assetUrls = (question.assetUrls || []).map(url => safeContent(url, answers)).filter(url => url !== WITHHELD);
  return result;
}

function canManageJoinCode(user, team) {
  return user?.role === 'ADMIN' || (user?.role === 'TEAM_LEADER' &&
    String(team.leaderId?._id || team.leaderId) === String(user.userId || user._id || user.id));
}

function participantTeam(team, user) {
  if (!team) return team;
  const result = team.toObject ? team.toObject() : { ...team };
  if (!canManageJoinCode(user, team)) delete result.joinCode;
  return result;
}

module.exports = {
  participantQuestion,
  sanitizeParticipantQuestion: participantQuestion,
  participantTeam,
  canManageJoinCode,
  safeContent,
  privateAnswers
};
