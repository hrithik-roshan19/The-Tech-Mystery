/**
 * Phase 4: QR Checkpoint & Submission Engine Integration Test Suite
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
  console.log('====================================================');
  console.log(' PHASE 4: QR CHECKPOINT & SUBMISSION ENGINE TESTS');
  console.log('====================================================\n');

  try {
    // -------------------------------------------------------------
    // 1. Authenticate Admin and Test Checkpoints API
    // -------------------------------------------------------------
    console.log('1. Admin QR Checkpoints API & HMAC Generation:');
    const adminLogin = await apiRequest('/auth/login', {
      method: 'POST',
      body: { emailOrUsername: 'admin@codesphere.tulas.edu.in', password: '12345' }
    });
    assert(adminLogin.status === 200, 'Admin successfully authenticated');
    const adminToken = adminLogin.data?.data?.accessToken || adminLogin.data?.data?.token;

    const checkpointsRes = await apiRequest('/admin/checkpoints', { token: adminToken });
    assert(checkpointsRes.status === 200, 'GET /admin/checkpoints returns 200');
    const checkpoints = checkpointsRes.data?.data?.checkpoints || [];
    assert(Array.isArray(checkpoints) && checkpoints.length >= 2, `Retrieved ${checkpoints.length} registered checkpoints`);

    const cp1 = checkpoints.find((c) => c.levelNumber === 1 || c.code === 'HTG-CP01');
    const cp2 = checkpoints.find((c) => c.levelNumber === 2 || c.code === 'HTG-CP02');
    const cp3 = checkpoints.find((c) => c.levelNumber === 3 || c.code === 'HTG-CP03');

    assert(Boolean(cp1), `Checkpoint Level 1 (${cp1?.checkpointCode || cp1?.code}) exists`);
    assert(Boolean(cp1?.hmacToken || cp1?.token), 'Checkpoint has genuine server HMAC token');
    assert(Boolean(cp1?.sampleQrUrl), 'Checkpoint has canonical QR URL string');

    // -------------------------------------------------------------
    // 2. Register Participant Team
    // -------------------------------------------------------------
    console.log('\n2. Participant Team Registration & Initial State:');
    const rand = Math.floor(Math.random() * 90000) + 10000;
    const teamName = `AlphaGuard_${rand}`;
    const leaderUser = `leader_${rand}`;
    const leaderEmail = `leader_${rand}@tulas.edu.in`;

    const registerRes = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        username: leaderUser,
        email: leaderEmail,
        password: 'Password123!',
        fullName: 'Alpha Leader',
        collegeRollNo: `TU-${rand}`
      }
    });
    assert(registerRes.status === 201, `Registered operative "${leaderUser}"`);
    const participantToken = registerRes.data?.data?.accessToken || registerRes.data?.data?.token;

    const teamCreateRes = await apiRequest('/teams/create', {
      method: 'POST',
      token: participantToken,
      body: { name: teamName }
    });
    assert(teamCreateRes.status === 201, `Created team "${teamName}"`);

    // Verify initial team score and level
    const myTeamRes = await apiRequest('/teams/my-team', { token: participantToken });
    assert(myTeamRes.status === 200, 'GET /teams/my-team returns 200');
    assert(myTeamRes.data?.data?.team?.currentLevel === 1, 'Initial team level is 1');
    assert(myTeamRes.data?.data?.team?.totalScore === 0, 'Initial team score is 0 XP');

    // -------------------------------------------------------------
    // 3. QR Checkpoint Validation Security Tests
    // -------------------------------------------------------------
    console.log('\n3. QR Scanner Security & Validation:');

    // 3.1 Invalid Checkpoint Code
    const invalidScan = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: participantToken,
      body: { checkpointCode: 'HTG-NONEXISTENT-999' }
    });
    assert(invalidScan.status === 400, 'Rejects non-existent checkpoint code with 400');
    assert(
      invalidScan.data?.message?.includes('Invalid checkpoint code') ||
      invalidScan.data?.message?.includes('does not match'),
      `Informative rejection message: "${invalidScan.data?.message}"`
    );

    // 3.2 Forged / Tampered HMAC Token
    const forgedTokenScan = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: participantToken,
      body: {
        checkpointCode: cp1.checkpointCode || cp1.code,
        token: 'forged_hmac_signature_00000000000000000000000000000000'
      }
    });
    assert(forgedTokenScan.status === 400, 'Rejects forged/tampered HMAC token with 400');
    assert(
      forgedTokenScan.data?.message?.includes('Tampered or forged'),
      `Security rejection message: "${forgedTokenScan.data?.message}"`
    );

    // 3.3 Locked Level Checkpoint Scan (Team is on Level 1, scanning Level 3)
    if (cp3) {
      const lockedScan = await apiRequest('/checkpoints/scan', {
        method: 'POST',
        token: participantToken,
        body: {
          checkpointCode: cp3.checkpointCode || cp3.code,
          token: cp3.token || cp3.hmacToken
        }
      });
      assert(lockedScan.status === 400, 'Rejects higher level checkpoint scan when level is locked (400)');
      assert(
        lockedScan.data?.message?.includes('Checkpoint locked'),
        `Locked level message: "${lockedScan.data?.message}"`
      );
    }

    // 3.4 Checkpoint Scan Gating on Flag Submission
    // Attempting to submit flag BEFORE scanning checkpoint
    const prematureSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 1, flag: 'HTG{premature_flag_guess}' }
    });
    assert(
      prematureSubmit.status === 400,
      'Rejects flag submission before checkpoint is scanned or challenge assigned (400)'
    );

    // 3.5 Valid Physical QR Checkpoint Scan
    const validScan = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: participantToken,
      body: {
        checkpointCode: cp1.checkpointCode || cp1.code,
        token: cp1.token || cp1.hmacToken
      }
    });
    assert(validScan.status === 200, 'Valid QR checkpoint scan accepted (200)');
    assert(Boolean(validScan.data?.data?.checkpoint?.name), `Verified station: "${validScan.data?.data?.checkpoint?.name}"`);
    assert(validScan.data?.data?.teamChallenge?.checkpointScanned === true, 'TeamChallenge.checkpointScanned is true');
    assert(validScan.data?.data?.teamChallenge?.status === 'UNLOCKED', 'TeamChallenge.status is UNLOCKED');

    // CRITICAL: Ensure secret flag is NEVER exposed in checkpoint payload
    assert(
      validScan.data?.data?.question?.flag === undefined,
      'CRITICAL SECURITY: Secret flag/answer is excluded from checkpoint payload'
    );

    // CRITICAL: Scanning checkpoint alone must award ZERO points
    const teamAfterScan = await apiRequest('/teams/my-team', { token: participantToken });
    assert(
      teamAfterScan.data?.data?.team?.totalScore === 0,
      'Zero points awarded merely for scanning a QR code (Score is still 0)'
    );

    // 3.6 Re-scanning Already Scanned Checkpoint
    const rescan = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: participantToken,
      body: {
        checkpointCode: cp1.checkpointCode || cp1.code,
        token: cp1.token || cp1.hmacToken
      }
    });
    assert(rescan.status === 200, 'Re-scanning already scanned checkpoint returns 200');
    assert(rescan.data?.data?.alreadyScanned === true, 'Response indicates checkpoint was already scanned');

    // -------------------------------------------------------------
    // 4. Submission Engine & Flag Verification
    // -------------------------------------------------------------
    console.log('\n4. Submission Engine, Attempt Limiting & Scoring:');

    // 4.1 Incorrect Flag Submission
    const wrongSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 1, flag: 'HTG{completely_incorrect_flag}' }
    });
    assert(wrongSubmit.status === 400, 'Rejects incorrect flag with 400 Bad Request');
    assert(wrongSubmit.data?.data?.attemptsCount === 1, 'Attempts counter incremented to 1');
    assert(wrongSubmit.data?.data?.attemptsRemaining !== undefined, `Attempts remaining reported: ${wrongSubmit.data?.data?.attemptsRemaining}`);

    // Verify team score unchanged after failed attempt
    const teamAfterFail = await apiRequest('/teams/my-team', { token: participantToken });
    assert(teamAfterFail.data?.data?.team?.totalScore === 0, 'Score remains 0 after failed attempt');

    // 4.2 Max Attempts Lockout Test
    // Perform attempts until locked out (attempts default to 3)
    const maxAtt = wrongSubmit.data?.data?.maxAttempts || 3;
    for (let i = 2; i <= maxAtt; i++) {
      await apiRequest('/submissions/submit', {
        method: 'POST',
        token: participantToken,
        body: { levelNumber: 1, flag: `HTG{wrong_flag_try_${i}}` }
      });
    }

    const lockedOutSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: participantToken,
      body: { levelNumber: 1, flag: 'HTG{any_flag_after_lockout}' }
    });
    assert(lockedOutSubmit.status === 400, 'Rejects submission when max attempts exceeded (400)');
    assert(
      lockedOutSubmit.data?.message?.includes('Maximum submission attempts') ||
      lockedOutSubmit.data?.message?.includes('exceeded'),
      `Lockout message: "${lockedOutSubmit.data?.message}"`
    );

    // -------------------------------------------------------------
    // 5. Successful Solve, Atomic Scoring & Progression
    // -------------------------------------------------------------
    console.log('\n5. Successful Flag Solve, Progression & Anti-Replay:');

    // Register a fresh solver team to test successful completion
    const rand2 = Math.floor(Math.random() * 90000) + 10000;
    const solverTeamName = `CipherElite_${rand2}`;
    const solverUser = `solver_${rand2}`;
    const solverEmail = `solver_${rand2}@tulas.edu.in`;

    const solverReg = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        username: solverUser,
        email: solverEmail,
        password: 'Password123!',
        fullName: 'Cipher Elite',
        collegeRollNo: `TU-${rand2}`
      }
    });
    assert(solverReg.status === 201, `Registered solver user "${solverUser}"`);
    const solverToken = solverReg.data?.data?.accessToken || solverReg.data?.data?.token;

    const solverTeamCreate = await apiRequest('/teams/create', {
      method: 'POST',
      token: solverToken,
      body: { name: solverTeamName }
    });
    assert(solverTeamCreate.status === 201, `Created solver team "${solverTeamName}"`);

    // Scan Level 1 Checkpoint for solver team
    const solverScan = await apiRequest('/checkpoints/scan', {
      method: 'POST',
      token: solverToken,
      body: {
        checkpointCode: cp1.checkpointCode || cp1.code,
        token: cp1.token || cp1.hmacToken
      }
    });
    assert(solverScan.status === 200, 'Solver team scanned Level 1 checkpoint');

    // Get assigned question flag directly via admin inspection
    const adminQuestions = await apiRequest('/admin/questions?includeFlag=true&levelNumber=1', { token: adminToken });
    const assignedQId = solverScan.data?.data?.question?._id;
    const assignedQuestionRecord = adminQuestions.data?.data?.questions?.find(
      (q) => q._id === assignedQId
    );
    const correctFlag = assignedQuestionRecord?.flag;
    assert(Boolean(correctFlag), `Found assigned question flag: "${correctFlag}"`);

    // Submit correct flag
    const correctSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: solverToken,
      body: { levelNumber: 1, flag: correctFlag }
    });

    assert(correctSubmit.status === 200, 'Correct flag submission accepted with 200 OK');
    assert(correctSubmit.data?.data?.isCorrect === true, 'isCorrect is true in response');
    assert(correctSubmit.data?.data?.pointsAwarded === 100, 'Points awarded is 100');
    assert(correctSubmit.data?.data?.newTotalScore === 100, 'New total score is 100');
    assert(correctSubmit.data?.data?.nextLevel === 2, 'Next level is 2');

    // Verify team state advanced in database
    const solverTeamAfterSolve = await apiRequest('/teams/my-team', { token: solverToken });
    assert(solverTeamAfterSolve.data?.data?.team?.currentLevel === 2, 'Team advanced to Level 2 in database');
    assert(solverTeamAfterSolve.data?.data?.team?.totalScore === 100, 'Team total score updated to 100 in database');

    // 5.2 Anti-Replay / Duplicate Point Award Prevention
    const duplicateSubmit = await apiRequest('/submissions/submit', {
      method: 'POST',
      token: solverToken,
      body: { levelNumber: 1, flag: correctFlag }
    });
    assert(duplicateSubmit.status === 400, 'Duplicate submission on solved level rejected with 400');
    assert(
      duplicateSubmit.data?.message?.includes('already been solved') ||
      duplicateSubmit.data?.message?.includes('Cannot submit for Level 1'),
      `Duplicate rejection message: "${duplicateSubmit.data?.message}"`
    );

    // Verify team score was NOT double-counted
    const solverTeamAfterReplay = await apiRequest('/teams/my-team', { token: solverToken });
    assert(
      solverTeamAfterReplay.data?.data?.team?.totalScore === 100,
      'Score remains exactly 100 — no duplicate points awarded on replay'
    );

    // 5.3 Level 2 Checkpoint Scan Unlocked for Solver Team
    if (cp2) {
      const level2Scan = await apiRequest('/checkpoints/scan', {
        method: 'POST',
        token: solverToken,
        body: {
          checkpointCode: cp2.checkpointCode || cp2.code,
          token: cp2.token || cp2.hmacToken
        }
      });
      assert(level2Scan.status === 200, 'Level 2 checkpoint unlocked and successfully scanned by advanced team');
      assert(level2Scan.data?.data?.checkpoint?.levelNumber === 2, 'Level 2 challenge assigned and ready for solving');
    }

    // -------------------------------------------------------------
    // 6. Leaderboard Verification
    // -------------------------------------------------------------
    console.log('\n6. Leaderboard Score Synchronization:');
    const leaderboardRes = await apiRequest('/leaderboard');
    assert(leaderboardRes.status === 200, 'GET /leaderboard returns 200');
    const leaderboard = leaderboardRes.data?.data?.leaderboard || [];
    const solverEntry = leaderboard.find((t) => t.name === solverTeamName || t.teamName === solverTeamName);
    assert(Boolean(solverEntry), `Solver team "${solverTeamName}" appears on live leaderboard`);
    assert(solverEntry?.totalScore === 100, 'Leaderboard displays synchronized 100 XP');

  } catch (err) {
    console.error('Unhandled test failure:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(` RESULTS: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

