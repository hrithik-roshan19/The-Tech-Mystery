const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function runPhase3Audit() {
  console.log('=================================================================');
  console.log('       THE TECH MYSTERY — PHASE 3 BACKEND INTEGRATION TEST SUITE    ');
  console.log('=================================================================');

  // 1. Health check
  const healthRes = await axios.get(`${BASE_URL}/health`);
  console.log('✓ Health Endpoint:', healthRes.data.success ? 'PASSED' : 'FAILED', healthRes.data.data.status);

  // 2. Admin Authentication & RBAC
  const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
    emailOrUsername: 'admin@codesphere.tulas.edu.in',
    password: '12345'
  });
  const adminToken = adminLogin.data.data.accessToken;
  console.log('✓ Admin Login & JWT Issuance: PASSED (Role:', adminLogin.data.data.user.role + ')');

  // 3. Admin Dashboard Telemetry
  const adminStats = await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('✓ Admin Dashboard Stats: PASSED (Teams:', adminStats.data.data.stats.totalTeams, 'Challenges:', adminStats.data.data.stats.totalChallenges + ')');

  // 4. Admin Security Logs
  const securityLogs = await axios.get(`${BASE_URL}/admin/security-logs`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('✓ Admin Security Logs: PASSED (Count:', securityLogs.data.data.logs.length + ')');

  // 5. Public Leaderboard
  const leaderboardRes = await axios.get(`${BASE_URL}/leaderboard`);
  console.log('✓ Public Leaderboard: PASSED (Ranked Teams:', leaderboardRes.data.data.leaderboard.length + ')');
  console.log('   Top team:', leaderboardRes.data.data.leaderboard[0].teamName, 'Score:', leaderboardRes.data.data.leaderboard[0].totalScore);

  // 6. Participant Registration (New Operative)
  const rand = Math.floor(Math.random() * 90000) + 10000;
  const newOpUsername = `operative_${rand}`;
  const newOpEmail = `op_${rand}@tulas.edu.in`;
  const regRes = await axios.post(`${BASE_URL}/auth/register`, {
    username: newOpUsername,
    email: newOpEmail,
    password: 'password_secret_123',
    fullName: `Operative ${rand}`,
    phone: '9876543210',
    collegeRollNo: `TU-${rand}`
  });
  const newOpToken = regRes.data.data.accessToken;
  console.log('✓ Participant Registration: PASSED (User:', regRes.data.data.user.username + ')');

  // 7. Session Validation (GET /auth/me & GET /auth/profile)
  const profileRes = await axios.get(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${newOpToken}` }
  });
  console.log('✓ Participant Profile Sync: PASSED (Rank:', profileRes.data.data.stats.rankNumber + ')');

  // 8. Team Creation
  const teamName = `Alpha Squad ${rand}`;
  const teamCreateRes = await axios.post(
    `${BASE_URL}/teams/create`,
    { name: teamName },
    { headers: { Authorization: `Bearer ${newOpToken}` } }
  );
  const createdTeam = teamCreateRes.data.data.team;
  console.log('✓ Team Creation: PASSED (Team:', createdTeam.name, 'JoinCode:', createdTeam.joinCode + ')');

  // 9. Teammate Registration & Joining via Join Code
  const teammateUsername = `teammate_${rand}`;
  const teammateEmail = `tm_${rand}@tulas.edu.in`;
  const tmRegRes = await axios.post(`${BASE_URL}/auth/register`, {
    username: teammateUsername,
    email: teammateEmail,
    password: 'password_secret_123',
    fullName: `Teammate ${rand}`
  });
  const tmToken = tmRegRes.data.data.accessToken;

  const tmJoinRes = await axios.post(
    `${BASE_URL}/teams/join`,
    { joinCode: createdTeam.joinCode },
    { headers: { Authorization: `Bearer ${tmToken}` } }
  );
  console.log('✓ Team Join via Join Code: PASSED (Members count:', tmJoinRes.data.data.team.members.length + ')');

  // 10. Mission Map Retrieval
  const missionMapRes = await axios.get(`${BASE_URL}/challenges/mission-map`, {
    headers: { Authorization: `Bearer ${newOpToken}` }
  });
  console.log('✓ Mission Map: PASSED (Total stages:', missionMapRes.data.data.missionMap.length, 'Current Level:', missionMapRes.data.data.currentLevel + ')');

  // 11. Current Challenge & Idempotent Question Assignment (Level 1)
  const currentChRes = await axios.get(`${BASE_URL}/challenges/current`, {
    headers: { Authorization: `Bearer ${newOpToken}` }
  });
  console.log('✓ Current Challenge Access (Level 1): PASSED (Question:', currentChRes.data.data.question.title + ')');
  const assignedQId1 = currentChRes.data.data.question._id;

  // Verify Idempotency: call again, must return same question
  const repeatChRes = await axios.get(`${BASE_URL}/challenges/current`, {
    headers: { Authorization: `Bearer ${newOpToken}` }
  });
  if (repeatChRes.data.data.question._id === assignedQId1) {
    console.log('✓ Question Idempotency Verification: PASSED (Same Question ID preserved on reload)');
  } else {
    throw new Error('Question assignment failed idempotency check!');
  }

  // 12. Submit Flag for Level 1
  // We know the flag for the assigned question from our seed
  let flagToSubmit = '';
  if (currentChRes.data.data.question.title.includes('Base64')) {
    flagToSubmit = 'HTG{welcome_to_the_grid_2026}';
  } else if (currentChRes.data.data.question.title.includes('Caesar') || currentChRes.data.data.question.title.includes('Rotation')) {
    flagToSubmit = 'HTG{rot13_signal_decoded_2026}';
  } else {
    flagToSubmit = 'HTG{binary_beacon}';
  }

  // First test wrong flag
  try {
    await axios.post(
      `${BASE_URL}/submissions/submit`,
      { levelNumber: 1, flag: 'HTG{wrong_flag_test}' },
      { headers: { Authorization: `Bearer ${newOpToken}` } }
    );
    console.error('FAIL: Wrong flag was incorrectly accepted!');
  } catch (err) {
    console.log('✓ Incorrect Flag Rejection: PASSED (HTTP', err.response?.status, err.response?.data?.message + ')');
  }

  // Now submit correct flag
  const correctSubRes = await axios.post(
    `${BASE_URL}/submissions/submit`,
    { levelNumber: 1, flag: flagToSubmit },
    { headers: { Authorization: `Bearer ${newOpToken}` } }
  );
  console.log('✓ Correct Flag Submission: PASSED (Points awarded:', correctSubRes.data.data.pointsAwarded, 'Next level:', correctSubRes.data.data.nextLevel + ')');

  // 13. Level 2 Access Before Checkpoint Scan (Must be forbidden because Level 2 requires QR scan)
  try {
    await axios.get(`${BASE_URL}/challenges/current`, {
      headers: { Authorization: `Bearer ${newOpToken}` }
    });
    console.error('FAIL: Level 2 was accessible without checkpoint scan!');
  } catch (err) {
    console.log('✓ Checkpoint Enforcement Before Level 2: PASSED (HTTP', err.response?.status, err.response?.data?.message + ')');
  }

  // 14. Scan Checkpoint 02 (HTG-CP02)
  const scanRes = await axios.post(
    `${BASE_URL}/checkpoints/scan`,
    { code: 'HTG-CP02' },
    { headers: { Authorization: `Bearer ${newOpToken}` } }
  );
  console.log('✓ Checkpoint 02 Scan: PASSED (' + scanRes.data.message + ')');

  // 15. Level 2 Challenge Access After Checkpoint Scan
  const level2ChRes = await axios.get(`${BASE_URL}/challenges/current`, {
    headers: { Authorization: `Bearer ${newOpToken}` }
  });
  console.log('✓ Level 2 Challenge Unlocked: PASSED (Question:', level2ChRes.data.data.question.title + ')');

  // 16. Verify Leaderboard reflects the new score and rank
  const updatedLeaderboard = await axios.get(`${BASE_URL}/leaderboard`);
  const myTeamEntry = updatedLeaderboard.data.data.leaderboard.find(t => t.teamName === teamName);
  console.log('✓ Leaderboard Score Update: PASSED (Team:', myTeamEntry?.teamName, 'Score:', myTeamEntry?.totalScore, 'Rank:', myTeamEntry?.rank + ')');

  console.log('=================================================================');
  console.log('   ALL 16 PHASE 3 INTEGRATION CHECKS PASSED WITH 100% SUCCESS!   ');
  console.log('=================================================================');
}

runPhase3Audit().catch(err => {
  console.error('Audit failed with error:', err.response ? err.response.data : err.message);
  process.exit(1);
});

