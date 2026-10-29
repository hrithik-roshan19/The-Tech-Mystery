const WITHHELD = 'Content withheld pending organizer review.';

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

function containsAnswer(text, answer) {
  if (!text || !answer || typeof text !== 'string') return false;
  if (/HTG\{[^}]+\}/i.test(text)) return true;
  const a = String(answer).trim();
  if (!a) return false;

  // Boundary check: require non-alphanumeric/word boundaries around alphanumeric start/end
  const startBound = /^[a-zA-Z0-9]/.test(a) ? '(?:^|[^a-zA-Z0-9])' : '';
  const endBound = /[a-zA-Z0-9]$/.test(a) ? '(?:[^a-zA-Z0-9]|$)' : '';
  const regex = new RegExp(startBound + escapeRegex(a) + endBound, 'i');
  return regex.test(text);
}

function safeContent(value, answers = []) {
  if (typeof value !== 'string') return value;
  if (/HTG\{[^}]+\}/i.test(value)) return WITHHELD;
  if (Array.isArray(answers) && answers.some(a => containsAnswer(value, a))) return WITHHELD;
  return value;
}

// Explicit DTO: never serialize entire private question documents, hints or metadata.
async function privateAnswers(questionId = null) {
  const query = questionId ? { _id: questionId } : {};
  const keys = await require('../models').Question.find(query).select('flag').lean();
  return keys
    .map(key => key.flag)
    .filter(Boolean)
    .filter(f => /HTG\{/i.test(f) || String(f).length >= 16);
}

async function participantQuestion(question) {
  if (!question) throw new Error('Assigned question is unavailable');
  let answers = await privateAnswers();
  if (question.flag) {
    answers.push(question.flag);
  } else if (question._id) {
    const doc = await require('../models').Question.findById(question._id).select('flag').lean();
    if (doc?.flag) answers.push(doc.flag);
  }

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
