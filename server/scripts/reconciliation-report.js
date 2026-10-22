// Reads through the native driver only: no models, index creation, or write commands.
const fs = require('node:fs');
const path = require('node:path');

const id = value => value == null ? null : String(value);
const total = values => values.reduce((sum, value) => sum + (value || 0), 0);

function analyzeHistoricalData({ teams, scores, assignments, submissions }) {
  const teamIds = new Set(teams.map(t => id(t._id)));
  const unsupportedTeams = [];
  const candidateSolves = [];
  const scoreDiscrepancies = [];
  const alreadyOwnedSolves = [];
  for (const team of teams) {
    const snapshots = scores.filter(s => id(s.teamId) === id(team._id));
    const solved = assignments.filter(a => id(a.teamId) === id(team._id) && a.status === 'SOLVED');
    const solvedPoints = total(solved.map(a => a.pointsAwarded));
    const historyPoints = total(snapshots.flatMap(s => s.history || []).map(h => h.pointsAwarded));
    if (snapshots.length !== 1 || snapshots[0].currentScore !== (team.totalScore || 0) ||
        solvedPoints !== (team.totalScore || 0) || historyPoints !== (team.totalScore || 0)) {
      unsupportedTeams.push({ teamId: id(team._id), teamPoints: team.totalScore || 0,
        currentLevel: team.currentLevel, scoreSnapshotIds: snapshots.map(s => id(s._id)),
        snapshotPoints: snapshots.map(s => s.currentScore), solvedPoints, historyPoints,
        reason: solved.length === 0 ? 'No recorded solves support the stored total' : 'Recorded totals disagree',
        disposition: 'Organizer review required; no repair authorized' });
    }
    for (const solve of solved) {
      if (solve.scoringSubmissionId) {
        alreadyOwnedSolves.push({ assignmentId: id(solve._id), scoringSubmissionId: id(solve.scoringSubmissionId) });
        continue;
      }
      const correct = submissions.filter(s => id(s.teamChallengeId) === id(solve._id) && s.isCorrect);
      const evidence = correct.map(s => ({ submissionId: id(s._id), recordedPoints: s.pointsDelta ?? null,
        associationsMatch: id(s.teamId) === id(team._id) && id(s.challengeId) === id(solve.challengeId) &&
          id(s.questionId) === id(solve.assignedQuestionId),
        historyReferenceMatches: snapshots.some(score => (score.history || []).some(h =>
          id(h.submissionId) === id(s._id) && h.levelNumber === solve.levelNumber &&
          id(h.challengeId) === id(solve.challengeId) && h.pointsAwarded === solve.pointsAwarded)) }));
      const row = { teamId: id(team._id), assignmentId: id(solve._id), challengeId: id(solve.challengeId),
        questionId: id(solve.assignedQuestionId), level: solve.levelNumber, solvePoints: solve.pointsAwarded,
        scoreSnapshotIds: snapshots.map(s => id(s._id)), correctSubmissions: evidence };
      const contiguousProgression = Array.from({ length: solved.length }, (_, index) => index + 1)
        .every(level => solved.some(assignment => assignment.levelNumber === level));
      const coherent = evidence.length === 1 && evidence[0].recordedPoints === solve.pointsAwarded &&
        evidence[0].associationsMatch && evidence[0].historyReferenceMatches && snapshots.length === 1 &&
        snapshots[0].currentScore === (team.totalScore || 0) && solvedPoints === (team.totalScore || 0) &&
        historyPoints === (team.totalScore || 0) && team.currentLevel === solved.length + 1 && contiguousProgression;
      if (coherent) candidateSolves.push({ ...row, disposition: 'Evidence candidate only; approval required before owner backfill' });
      else scoreDiscrepancies.push({ ...row, disposition: 'Manual review required; do not infer or alter awarded points' });
    }
  }
  const orphanGroups = new Map();
  const assignmentIds = new Set(assignments.map(a => id(a._id)));
  for (const submission of submissions) {
    if (teamIds.has(id(submission.teamId))) continue;
    const teamId = id(submission.teamId);
    if (!orphanGroups.has(teamId)) orphanGroups.set(teamId, { missingTeamId: teamId, submissions: [] });
    orphanGroups.get(teamId).submissions.push({ submissionId: id(submission._id),
      assignmentId: id(submission.teamChallengeId), challengeId: id(submission.challengeId),
      questionId: id(submission.questionId), isCorrect: Boolean(submission.isCorrect),
      recordedPoints: submission.pointsDelta ?? null,
      assignmentExists: assignmentIds.has(id(submission.teamChallengeId)) });
  }
  return { summary: { teams: teams.length, storedTeamPoints: total(teams.map(t => t.totalScore)),
    solvedPoints: total(assignments.filter(a => a.status === 'SOLVED').map(a => a.pointsAwarded)),
    unsupportedTeams: unsupportedTeams.length, candidateSolves: candidateSolves.length,
    scoreDiscrepancies: scoreDiscrepancies.length, orphanTeamGroups: orphanGroups.size,
    orphanSubmissions: [...orphanGroups.values()].reduce((sum, group) => sum + group.submissions.length, 0) },
  unsupportedTeams, scoreDiscrepancies, candidateSolves, alreadyOwnedSolves,
  deletedTeamSubmissions: [...orphanGroups.values()],
  policy: 'Read-only evidence, not an executable migration. Original records and IDs remain unchanged.' };
}

async function collectReport(uri) {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000, appName: 'htg-read-only-preparation' });
  const startedAt = new Date().toISOString();
  try {
    await client.connect();
    const db = client.db();
    const hello = await db.admin().command({ hello: 1 });
    const counts = {};
    for (const collection of ['users', 'teams', 'challenges', 'questions', 'checkpoints', 'teamchallenges', 'submissions', 'scores']) {
      counts[collection] = await db.collection(collection).countDocuments();
    }
    // Each inclusion projection deliberately excludes names, emails, credentials,
    // invitations, submitted answers, expected answers and signed QR payloads.
    const teams = await db.collection('teams').find({}, { projection: { _id: 1, totalScore: 1, currentLevel: 1 } }).sort({ _id: 1 }).toArray();
    const scores = await db.collection('scores').find({}, { projection: { _id: 1, teamId: 1, currentScore: 1, history: 1 } }).toArray();
    const assignments = await db.collection('teamchallenges').find({}, { projection: { _id: 1, teamId: 1, challengeId: 1,
      assignedQuestionId: 1, levelNumber: 1, status: 1, pointsAwarded: 1, scoringSubmissionId: 1 } }).toArray();
    const submissions = await db.collection('submissions').find({}, { projection: { _id: 1, teamId: 1, challengeId: 1,
      questionId: 1, teamChallengeId: 1, isCorrect: 1, pointsDelta: 1 } }).toArray();
    const endingCounts = {};
    for (const collection of Object.keys(counts)) endingCounts[collection] = await db.collection(collection).countDocuments();
    return { capturedAt: new Date().toISOString(), startedAt, database: db.databaseName,
      topology: hello.msg === 'isdbgrid' ? 'mongos' : hello.setName ? 'replica set' : 'standalone',
      counts, endingCounts, countsStable: JSON.stringify(counts) === JSON.stringify(endingCounts),
      consistency: 'Sequential read-only observations; not an atomic snapshot or backup. Stable counts do not prove no edits occurred.',
      ...analyzeHistoricalData({ teams, scores, assignments, submissions }) };
  } finally { await client.close(); }
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.includes('--read-config') || !args.includes('--output')) throw new Error('Explicit read authorization and output path required');
  const output = args[args.indexOf('--output') + 1];
  if (!output || output.startsWith('--')) throw new Error('Output path required');
  const report = await collectReport(require('../src/config/environment').mongodbUri);
  const destination = path.resolve(output);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ reportWritten: true, countsStable: report.countsStable, summary: report.summary }));
}
if (require.main === module) main().catch(() => { console.error('Read-only report failed; no database writes were attempted.'); process.exitCode = 1; });
module.exports = { analyzeHistoricalData, collectReport };
