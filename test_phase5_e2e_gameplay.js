/**
 * Phase 5: Leaderboard, Final Flag & End-to-End Gameplay Integration Test Suite
 * The Tech Mystery
 */

const API_BASE = 'http://127.0.0.1:5000/api/v1';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, ok: response.ok, data };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('================================================================');
  console.log(' PHASE 5: LEADERBOARD, FINAL FLAG & E2E VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  const testSuffix = Date.now().toString(36);
  let adminToken = '';
  let participantToken = '';
  let participantUserId = '';
  let testTeamId = '';
  let testTeamJoinCode = '';

  try {
    // -----------------------------------------------------------------
    // 1. Authenticate Admin and Inspect Live Event Configuration
    // -----------------------------------------------------------------
    console.log('1. Admin Authentication & Event Control State Inspection:');
    const adminLogin = await apiRequest('/auth/login', {
      method: 'POST',
      body: { emailOrUsername: 'admin@codesphere.tulas.edu.in', password: '12345' }
    });
    assert(adminLogin.status === 200, 'Admin authenticated successfully');
    adminToken = adminLogin.data?.data?.accessToken || adminLogin.data?.data?.token;

    // Reset EventConfig to baseline LIVE state
    const resetConfig = await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: {
        state: 'LIVE',
        maintenanceMode: false,
        registrationOpen: true,
        qrCheckpoints: true,
        isLeaderboardFrozen: false,
        isLeaderboardVisible: true
      }
    });
    assert(resetConfig.status === 200, 'EventConfig initialized to clean LIVE baseline');

    // -----------------------------------------------------------------
    // 2. Authoritative Public Leaderboard & Deterministic Tie-Breaking
    // -----------------------------------------------------------------
    console.log('\n2. Public Leaderboard Telemetry & Tie-Breaking:');
    const pubLeaderboard = await apiRequest('/leaderboard');
    assert(pubLeaderboard.status === 200, 'GET /leaderboard returns HTTP 200');
    assert(pubLeaderboard.data?.data?.isVisible === true, 'Public leaderboard is currently visible');
    assert(pubLeaderboard.data?.data?.isFrozen === false, 'Leaderboard is not frozen');
    assert(Array.isArray(pubLeaderboard.data?.data?.leaderboard), 'Returns ranked team array');

    const teams = pubLeaderboard.data?.data?.leaderboard || [];
    console.log(`     Discovered ${teams.length} ranked teams on live scoreboard.`);

    // Verify deterministic sorting: totalScore DESC
    let isSortedProperly = true;
    for (let i = 0; i < teams.length - 1; i++) {
      if ((teams[i].totalScore || 0) < (teams[i + 1].totalScore || 0)) {
        isSortedProperly = false;
        break;
      }
    }
    assert(isSortedProperly, 'Teams are strictly ordered by totalScore DESC');

    // -----------------------------------------------------------------
    // 3. Admin Leaderboard & Event Concealment Gating
    // -----------------------------------------------------------------
    console.log('\n3. Admin Leaderboard & Visibility Concealment:');
    const adminLeaderboard = await apiRequest('/admin/leaderboard', { token: adminToken });
    assert(adminLeaderboard.status === 200, 'GET /admin/leaderboard returns HTTP 200 for authenticated admin');
    assert(Array.isArray(adminLeaderboard.data?.data?.leaderboard), 'Admin leaderboard returns full team array');

    // Conceal the public leaderboard
    console.log('     Hiding public leaderboard via EventConfig...');
    const hideConfig = await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { isLeaderboardVisible: false }
    });
    assert(hideConfig.status === 200, 'Admin updated isLeaderboardVisible to false');

    const concealedPub = await apiRequest('/leaderboard');
    assert(concealedPub.status === 200, 'GET /leaderboard returns 200 with concealed state');
    assert(concealedPub.data?.data?.isVisible === false, 'Public leaderboard reports isVisible: false');
    assert(concealedPub.data?.data?.leaderboard.length === 0, 'Public leaderboard hides team rankings array');

    // Admin leaderboard must still show full live rankings
    const adminStillSees = await apiRequest('/admin/leaderboard', { token: adminToken });
    assert(adminStillSees.status === 200, 'Admin can still view full rankings when public leaderboard is hidden');

    // Restore public visibility and test Leaderboard Freeze
    console.log('     Restoring visibility and testing Leaderboard Freeze...');
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { isLeaderboardVisible: true, isLeaderboardFrozen: true }
    });

    const frozenPub = await apiRequest('/leaderboard');
    assert(frozenPub.data?.data?.isFrozen === true, 'Public leaderboard accurately reflects isFrozen: true');

    // Restore un-frozen state
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { isLeaderboardFrozen: false }
    });

    // Check SecurityLog for configuration changes
    const securityLogs = await apiRequest('/admin/security-logs', { token: adminToken });
    assert(securityLogs.status === 200, 'GET /admin/security-logs returns 200');
    const configLogs = (securityLogs.data?.data?.logs || []).filter(l => l.category === 'CONFIGURATION');
    assert(configLogs.length > 0, `SecurityLog recorded privileged configuration updates (count: ${configLogs.length})`);

    // -----------------------------------------------------------------
    // 4. Event State Enforcement: PAUSED, MAINTENANCE, REGISTRATION_CLOSED
    // -----------------------------------------------------------------
    console.log('\n4. Event State Enforcement (Paused, Maintenance, Registration Closed):');

    // Register a test participant user
    const regRes = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        username: `e2e_user_${testSuffix}`,
        email: `e2e_user_${testSuffix}@tulas.edu.in`,
        password: 'Password@123',
        fullName: 'E2E Test Operative',
        collegeRollNo: `ROLL-${testSuffix.toUpperCase()}`
      }
    });
    assert(regRes.status === 201, 'Participant registered successfully');
    participantToken = regRes.data?.data?.accessToken || regRes.data?.data?.token;
    participantUserId = regRes.data?.data?.user?.id || regRes.data?.data?.user?._id;

    // Create team
    const teamRes = await apiRequest('/teams', {
      method: 'POST',
      token: participantToken,
      body: {
        name: `Alpha Squad ${testSuffix}`,
        college: "Tula's University"
      }
    });
    assert(teamRes.status === 201, 'Participant created team "Alpha Squad"');
    testTeamId = teamRes.data?.data?.team?._id;
    testTeamJoinCode = teamRes.data?.data?.team?.joinCode;
    participantToken = teamRes.data?.data?.accessToken || participantToken; // Updated token with teamId

    // A. Test Registration Closed
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { registrationOpen: false }
    });

    const regAnother = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        username: `e2e_user2_${testSuffix}`,
        email: `e2e_user2_${testSuffix}@tulas.edu.in`,
        password: 'Password@123',
        fullName: 'Second Operative',
        collegeRollNo: `ROLL2-${testSuffix.toUpperCase()}`
      }
    });
    const anotherToken = regAnother.data?.data?.accessToken;

    const blockedTeam = await apiRequest('/teams', {
      method: 'POST',
      token: anotherToken,
      body: { name: `Blocked Team ${testSuffix}` }
    });
    assert(blockedTeam.status === 400, 'Team creation rejected when registrationOpen === false');

    // Restore registration
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { registrationOpen: true }
    });

    // B. Test Event PAUSED state
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { state: 'PAUSED' }
    });

    const pausedSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 1, flag: 'HTG{dummy_flag}' }
    });
    assert(pausedSubmit.status === 403, 'Flag submission rejected with 403 when event is PAUSED');

    const pausedScan = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: participantToken,
      body: { checkpointCode: 'HTG-CP01' }
    });
    assert(pausedScan.status === 400, 'Checkpoint scan rejected when event is PAUSED');

    // C. Test MAINTENANCE mode
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { state: 'LIVE', maintenanceMode: true }
    });

    const maintSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 1, flag: 'HTG{dummy_flag}' }
    });
    assert(maintSubmit.status === 403, 'Flag submission rejected with 403 in Maintenance Mode');

    // Restore LIVE baseline
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: { state: 'LIVE', maintenanceMode: false }
    });
    console.log('     Event restored to LIVE operational mode.');

    // -----------------------------------------------------------------
    // 5. End-to-End Gameplay: Mission Map, Scan, Flag Verification
    // -----------------------------------------------------------------
    console.log('\n5. End-to-End Gameplay Progression:');

    // Fetch mission map
    const mapRes = await apiRequest('/challenges/mission-map', { token: participantToken });
    assert(mapRes.status === 200, 'GET /challenges/mission-map returns 200');
    const stages = mapRes.data?.data?.missionMap || [];
    assert(stages.length === 10, 'Mission map contains 10 challenge stages');
    assert(stages[0].isCurrent === true, 'Level 1 is marked as current level');
    assert(stages[9].isUnlocked === false, 'Level 10 (Master Flag) is locked initially');

    // Attempt to submit for Level 10 while at Level 1
    const prematureSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 10, flag: 'HTG{MASTER_FLAG_GRID_BREACHED_2026}' }
    });
    assert(prematureSubmit.status === 400, 'Premature Level 10 submission rejected with 400');

    // Scan Level 1 Checkpoint (HTG-CP01)
    const scanL1 = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: participantToken,
      body: { checkpointCode: 'HTG-CP01' }
    });
    assert(scanL1.status === 200, 'Level 1 checkpoint scanned successfully');

    // Fetch current challenge
    const currRes = await apiRequest('/challenges/current', { token: participantToken });
    assert(currRes.status === 200, 'GET /challenges/current returns Level 1 challenge');
    assert(!currRes.data?.data?.question?.flag, 'CRITICAL: Secret flag field is excluded from challenge question');
    const assignedQ = currRes.data?.data?.question;

    // Get the assigned question's secret flag via Admin API for testing
    const allQuestions = await apiRequest('/admin/questions?includeFlag=true', { token: adminToken });
    const questionsList = allQuestions.data?.data?.questions || [];
    const targetQ = questionsList.find(q => String(q._id) === String(assignedQ?._id) || q.title === assignedQ?.title);
    const correctL1Flag = targetQ?.flag || 'HTG{welcome_to_the_grid_2026}';

    // Submit incorrect flag
    const wrongSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 1, flag: 'HTG{incorrect_guess_xyz}' }
    });
    assert(wrongSubmit.status === 400, 'Incorrect flag rejected with 400');
    assert(wrongSubmit.data?.data?.attemptsRemaining !== undefined, 'Reports remaining submission attempts');

    // Submit correct flag for Level 1
    const correctSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 1, flag: correctL1Flag }
    });
    assert(correctSubmit.status === 200, 'Correct flag accepted (+100 PTS awarded)');
    assert(correctSubmit.data?.data?.isCorrect === true, 'isCorrect flag returned true');
    assert(correctSubmit.data?.data?.nextLevel === 2, 'Team advanced to Level 2');

    // Verify scoreboard reflects the 100 points
    const updatedLeaderboard = await apiRequest('/leaderboard');
    const myTeamRanked = (updatedLeaderboard.data?.data?.leaderboard || []).find(t => t.teamId === testTeamId);
    assert(myTeamRanked && myTeamRanked.totalScore === 100, 'Leaderboard immediately synced with verified score (100 pts)');

    // -----------------------------------------------------------------
    // 6. Level 10 Final Flag Engine & Victory HUD
    // -----------------------------------------------------------------
    console.log('\n6. Level 10 Master Flag & Victory HUD:');

    // Advance test team to Level 10 to test Final Flag submission
    const advanceTeam = await apiRequest(`/admin/teams/${testTeamId}`, {
      method: 'PATCH',
      token: adminToken,
      body: { currentLevel: 10 }
    });
    assert(advanceTeam.status === 200, 'Admin advanced test team to Level 10 for Final Flag verification');

    // Checkpoint scan for Level 10 (HTG-CP10)
    const scanL10 = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: participantToken,
      body: { checkpointCode: 'HTG-CP10' }
    });
    assert(scanL10.status === 200, 'Level 10 checkpoint scanned and unlocked');

    // Submit incorrect Master Flag
    const wrongMaster = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 10, flag: 'HTG{wrong_master_flag}' }
    });
    assert(wrongMaster.status === 400, 'Incorrect Master Flag rejected');

    // Submit correct Master Flag: "HTG{MASTER_FLAG_GRID_BREACHED_2026}"
    const correctMaster = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 10, flag: 'HTG{MASTER_FLAG_GRID_BREACHED_2026}' }
    });
    assert(correctMaster.status === 200, 'MASTER FLAG ACCEPTED! Grid breached!');
    assert(correctMaster.data?.data?.nextLevel === 11, 'Team achieved Level 11 (All levels conquered)');

    // Anti-replay / Duplicate solve check:
    // Submitting Level 10 flag again must be rejected with 400 and award 0 additional points
    const duplicateSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 10, flag: 'HTG{MASTER_FLAG_GRID_BREACHED_2026}' }
    });
    assert(duplicateSubmit.status === 400, 'Duplicate Level 10 solve rejected with 400 (Anti-replay guard active)');

    // -----------------------------------------------------------------
    // 7. Security Auditing & RBAC Authorization Checks
    // -----------------------------------------------------------------
    console.log('\n7. RBAC & Security Integrity Checks:');

    // Unauthenticated access to admin leaderboard
    const unauthAdmin = await apiRequest('/admin/leaderboard');
    assert(unauthAdmin.status === 401, 'Unauthenticated access to /admin/leaderboard blocked (401)');

    // Participant attempting to access admin endpoint
    const partAdmin = await apiRequest('/admin/leaderboard', { token: participantToken });
    assert(partAdmin.status === 403, 'Participant role blocked from /admin/leaderboard (403)');

    // Team disqualification test
    const disqRes = await apiRequest(`/admin/teams/${testTeamId}/disqualify`, {
      method: 'PATCH',
      token: adminToken,
      body: { isDisqualified: true, reason: 'Automated test suite verification' }
    });
    assert(disqRes.status === 200, 'Admin disqualified test team successfully');

    // Verify disqualified team cannot submit
    const disqSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 10, flag: 'HTG{MASTER_FLAG_GRID_BREACHED_2026}' }
    });
    assert(disqSubmit.status === 403, 'Disqualified team submission blocked with 403');

    // Verify SecurityLog captured the disqualification
    const updatedSecLogs = await apiRequest('/admin/security-logs', { token: adminToken });
    const disqLog = (updatedSecLogs.data?.data?.logs || []).find(l => l.event === 'Team disqualified' && l.target === `Alpha Squad ${testSuffix}`);
    assert(Boolean(disqLog), 'SecurityLog documented team disqualification under ADMIN ACTION');

    // -----------------------------------------------------------------
    // 8. Clean up Test Fixtures
    // -----------------------------------------------------------------
    console.log('\n8. Cleaning Up Test Fixtures:');
    if (testTeamId) {
      await apiRequest(`/admin/teams/${testTeamId}`, { method: 'DELETE', token: adminToken });
      console.log('     Deleted test team.');
    }

    // Reset baseline config
    await apiRequest('/admin/event-config', {
      method: 'PATCH',
      token: adminToken,
      body: {
        state: 'LIVE',
        maintenanceMode: false,
        registrationOpen: true,
        qrCheckpoints: true,
        isLeaderboardFrozen: false,
        isLeaderboardVisible: true
      }
    });
    console.log('     Event configuration restored to baseline.');

  } catch (error) {
    console.error('Unhandled test suite error:', error);
    failed++;
  }

  console.log('\n================================================================');
  console.log(` PHASE 5 VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
