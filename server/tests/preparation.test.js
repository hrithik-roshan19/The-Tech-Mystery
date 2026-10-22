const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { validateStagingConfig } = require('../scripts/staging-config');
const { analyzeHistoricalData } = require('../scripts/reconciliation-report');
const { inspectRunningApi } = require('../scripts/deployment-probe');

function stagingEnv() {
  return { NODE_ENV: 'production', PORT: '5100',
    MONGODB_URI: `mongodb://htg_staging_app:${crypto.randomBytes(32).toString('hex')}@127.0.0.1:27027/hack_the_grid_staging?replicaSet=htg-staging&authSource=hack_the_grid_staging&directConnection=true`,
    JWT_SECRET: crypto.randomBytes(32).toString('hex'), JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'),
    QR_SECRET_SALT: crypto.randomBytes(32).toString('hex') };
}
function evidence() {
  return { teams: [{ _id: 'team-1', totalScore: 100, currentLevel: 2 }],
    assignments: [{ _id: 'assignment-1', teamId: 'team-1', challengeId: 'challenge-1', assignedQuestionId: 'question-1',
      status: 'SOLVED', pointsAwarded: 100, levelNumber: 1 }],
    scores: [{ _id: 'score-1', teamId: 'team-1', currentScore: 100,
      history: [{ submissionId: 'submission-1', challengeId: 'challenge-1', levelNumber: 1, pointsAwarded: 100 }] }],
    submissions: [{ _id: 'submission-1', teamId: 'team-1', teamChallengeId: 'assignment-1', challengeId: 'challenge-1',
      questionId: 'question-1', isCorrect: true, pointsDelta: 100 }] };
}

describe('Preparation safeguards (no database connections)', () => {
  it('accepts only the dedicated authenticated replica-set staging target', () => {
    assert.equal(validateStagingConfig(stagingEnv()).database, 'hack_the_grid_staging');
  });
  it('refuses live database names, alternate ports, missing replica sets and templates', () => {
    const env = stagingEnv();
    for (const uri of [env.MONGODB_URI.replace('27027', '27017'),
      env.MONGODB_URI.replace('/hack_the_grid_staging?', '/hack_the_grid?'),
      env.MONGODB_URI.replace('replicaSet=htg-staging', 'replicaSet=other'),
      env.MONGODB_URI.replace(new URL(env.MONGODB_URI).password, '<REPLACE_PASSWORD>'),
      env.MONGODB_URI.replace(new URL(env.MONGODB_URI).password, 'weak'),
      env.MONGODB_URI + '&replicaSet=other']) {
      assert.throws(() => validateStagingConfig({ ...env, MONGODB_URI: uri }));
    }
    assert.throws(() => validateStagingConfig({ ...env, PORT: '5000' }));
    assert.throws(() => validateStagingConfig({ ...env, NODE_ENV: 'development' }));
  });
  it('refuses shared, missing and placeholder staging signing configuration', () => {
    const env = stagingEnv();
    assert.throws(() => validateStagingConfig({ ...env, QR_SECRET_SALT: env.JWT_SECRET }));
    assert.throws(() => validateStagingConfig({ ...env, JWT_SECRET: undefined }));
    assert.throws(() => validateStagingConfig({ ...env, JWT_SECRET: '<REPLACE_WITH_RANDOM_VALUE>' }));
  });
  it('classifies candidates without changing input IDs or records', () => {
    const data = evidence();
    const before = JSON.stringify(data);
    const report = analyzeHistoricalData(data);
    assert.equal(report.candidateSolves.length, 1);
    assert.equal(report.candidateSolves[0].assignmentId, 'assignment-1');
    assert.equal(JSON.stringify(data), before);
  });
  it('separates conflicting point amounts from owner-backfill candidates', () => {
    const data = evidence();
    data.submissions[0].pointsDelta = 0;
    const report = analyzeHistoricalData(data);
    assert.equal(report.candidateSolves.length, 0);
    assert.equal(report.scoreDiscrepancies.length, 1);
    assert.equal(report.scoreDiscrepancies[0].correctSubmissions[0].recordedPoints, 0);
  });
  it('does not choose between duplicate correct submissions or mismatched associations', () => {
    const data = evidence();
    data.submissions.push({ ...data.submissions[0], _id: 'submission-2' });
    assert.equal(analyzeHistoricalData(data).candidateSolves.length, 0);
    data.submissions.pop(); data.submissions[0].questionId = 'different-question';
    assert.equal(analyzeHistoricalData(data).candidateSolves.length, 0);
  });
  it('rejects a candidate with non-contiguous historical progression', () => {
    const data = evidence();
    data.assignments[0].levelNumber = 5;
    data.scores[0].history[0].levelNumber = 5;
    assert.equal(analyzeHistoricalData(data).candidateSolves.length, 0);
    assert.equal(analyzeHistoricalData(data).scoreDiscrepancies.length, 1);
  });
  it('records unsupported totals and deleted-team references without private fields', () => {
    const data = evidence();
    data.teams.push({ _id: 'unsupported-team', totalScore: 750, currentLevel: 1, name: 'PRIVATE-NAME' });
    data.submissions.push({ _id: 'orphan-submission', teamId: 'deleted-team', teamChallengeId: 'deleted-assignment',
      submittedAnswer: 'PRIVATE-ANSWER', userId: 'PRIVATE-USER' });
    const report = analyzeHistoricalData(data);
    assert.equal(report.unsupportedTeams.length, 1);
    assert.equal(report.deletedTeamSubmissions[0].missingTeamId, 'deleted-team');
    assert.ok(!JSON.stringify(report).includes('PRIVATE-'), 'Evidence artifact must omit personal/answer fields');
  });
  it('refuses non-loopback deployment probes before making requests', async () => {
    await assert.rejects(() => inspectRunningApi('https://example.invalid/api/v1'));
  });
  it('refuses staging API startup before importing database code without explicit approval', () => {
    const env = { ...process.env };
    delete env.HTG_APPROVED_STAGING_START;
    const result = spawnSync(process.execPath, [path.resolve(__dirname, '../scripts/staging-api.js')],
      { env, stdio: 'pipe', timeout: 3000 });
    assert.equal(result.status, 1);
    assert.ok(!String(result.stdout).includes('MongoDB Connected'));
  });
});
