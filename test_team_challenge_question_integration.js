const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api/v1';

async function runTestSuite() {
  console.log('========================================================================');
  console.log('  THE TECH MYSTERY — TEAM, CHALLENGE & QUESTION INTEGRATION TEST SUITE');
  console.log('========================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] ${testName}${details ? ` -> ${details}` : ''}`);
    } else {
      console.error(`[FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  try {
    // ------------------------------------------------------------------------
    // SECTION 1: HEALTH & DATABASE CONNECTIVITY
    // ------------------------------------------------------------------------
    console.log('\n--- 1. Health & Database Connectivity ---');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    assert(
      healthRes.status === 200 && healthRes.data.success && healthRes.data.data.database === 'connected',
      'Backend Health & DB Check',
      `Status: ${healthRes.data.data.status}, DB: ${healthRes.data.data.database}`
    );

    // ------------------------------------------------------------------------
    // SECTION 2: ADMIN AUTHENTICATION
    // ------------------------------------------------------------------------
    console.log('\n--- 2. Admin Authentication ---');
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      emailOrUsername: 'admin@codesphere.tulas.edu.in',
      password: '12345'
    });
    const adminToken = adminLoginRes.data.data.accessToken;
    assert(
      adminLoginRes.status === 200 && adminLoginRes.data.data.user.role === 'ADMIN',
      'Admin Login & JWT Issuance',
      `User: ${adminLoginRes.data.data.user.username}, Role: ${adminLoginRes.data.data.user.role}`
    );
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    // ------------------------------------------------------------------------
    // SECTION 3: CHECKPOINTS FETCHING (FOR LINKING)
    // ------------------------------------------------------------------------
    console.log('\n--- 3. Checkpoints Verification ---');
    const checkpointsRes = await axios.get(`${BASE_URL}/admin/checkpoints`, { headers: adminHeaders });
    assert(
      checkpointsRes.status === 200 && Array.isArray(checkpointsRes.data.data.checkpoints),
      'Admin Checkpoints Lookup',
      `Found ${checkpointsRes.data.data.checkpoints.length} checkpoint records`
    );
    const sampleCheckpoint = checkpointsRes.data.data.checkpoints[0];

    // ------------------------------------------------------------------------
    // SECTION 4: ADMIN TEAM CRUD
    // ------------------------------------------------------------------------
    console.log('\n--- 4. Admin Team Management CRUD ---');
    const rand = Math.floor(Math.random() * 90000) + 10000;
    // 4.1 Register a dedicated user for team leader
    const regLeaderRes = await axios.post(`${BASE_URL}/auth/register`, {
      username: `lead_user_${rand}`,
      email: `lead_user_${rand}@tulas.edu.in`,
      password: 'password123',
      fullName: `Squad Leader ${rand}`
    });
    const squadLeader = regLeaderRes.data.data.user;

    // 4.2 Create Team via Admin
    const adminTeamRes = await axios.post(
      `${BASE_URL}/admin/teams`,
      {
        name: `Admin Squad ${rand}`,
        college: "Tula's University",
        leaderEmailOrUsername: squadLeader.email
      },
      { headers: adminHeaders }
    );
    const testTeam = adminTeamRes.data.data.team;
    assert(
      adminTeamRes.status === 201 && testTeam && testTeam.name === `Admin Squad ${rand}`,
      'Admin Create Team',
      `Team ID: ${testTeam._id}, JoinCode: ${testTeam.joinCode}, College: ${testTeam.college}`
    );

    // 4.2 Update Team Details
    const updateTeamRes = await axios.patch(
      `${BASE_URL}/admin/teams/${testTeam._id}`,
      {
        name: `Admin Squad ${rand} [Renamed]`,
        totalScore: 750,
        college: "Tula's Institute of Engineering"
      },
      { headers: adminHeaders }
    );
    assert(
      updateTeamRes.status === 200 && updateTeamRes.data.data.team.totalScore === 750,
      'Admin Update Team',
      `Updated Name: ${updateTeamRes.data.data.team.name}, TotalScore: ${updateTeamRes.data.data.team.totalScore}`
    );

    // 4.3 Create a second user to add to the team
    const regMemberRes = await axios.post(`${BASE_URL}/auth/register`, {
      username: `member_${rand}`,
      email: `member_${rand}@tulas.edu.in`,
      password: 'password123',
      fullName: `Team Member ${rand}`
    });
    const newMemberUser = regMemberRes.data.data.user;

    // 4.4 Add Member to Team via Admin
    const addMemberRes = await axios.post(
      `${BASE_URL}/admin/teams/${testTeam._id}/members`,
      { userIdentifier: newMemberUser.email },
      { headers: adminHeaders }
    );
    assert(
      addMemberRes.status === 200 && addMemberRes.data.data.team.members.length >= 2,
      'Admin Add Member to Team',
      `Team now has ${addMemberRes.data.data.team.members.length} members`
    );

    // 4.5 Remove Member from Team via Admin
    const memberId = newMemberUser.id || newMemberUser._id;
    const removeMemberRes = await axios.delete(
      `${BASE_URL}/admin/teams/${testTeam._id}/members/${memberId}`,
      { headers: adminHeaders }
    );
    assert(
      removeMemberRes.status === 200,
      'Admin Remove Member from Team',
      `Member ${newMemberUser.username} removed successfully`
    );

    // 4.6 Delete Team via Admin
    const deleteTeamRes = await axios.delete(
      `${BASE_URL}/admin/teams/${testTeam._id}`,
      { headers: adminHeaders }
    );
    assert(
      deleteTeamRes.status === 200,
      'Admin Delete Team',
      'Team and score records cleaned up'
    );

    // ------------------------------------------------------------------------
    // SECTION 5: ADMIN CHALLENGE CRUD & ARCHIVED STATUS
    // ------------------------------------------------------------------------
    console.log('\n--- 5. Admin Challenge Management CRUD ---');
    const testLevel = 99; // Isolated test level number
    
    // 5.1 Create Challenge with Checkpoint Link and Archived Status
    const createChallengeRes = await axios.post(
      `${BASE_URL}/admin/challenges`,
      {
        levelNumber: testLevel,
        title: `Synthetic Protocol ${rand}`,
        subtitle: 'Security Test Vector',
        category: 'Crypto',
        difficulty: 'HARD',
        points: 250,
        status: 'Archived',
        description: 'Test challenge verifying archived status isolation.',
        checkpointId: sampleCheckpoint ? sampleCheckpoint._id : null,
        requiresCheckpointScan: true
      },
      { headers: adminHeaders }
    );
    const testChallenge = createChallengeRes.data.data.challenge;
    assert(
      createChallengeRes.status === 201 && testChallenge.status === 'Archived',
      'Admin Create Challenge (Archived)',
      `Level: ${testChallenge.levelNumber}, Status: ${testChallenge.status}`
    );

    // 5.2 Update Challenge to Published
    const updateChallengeRes = await axios.patch(
      `${BASE_URL}/admin/challenges/${testChallenge._id}`,
      {
        title: `Synthetic Protocol ${rand} [Live]`,
        status: 'Published',
        points: 300
      },
      { headers: adminHeaders }
    );
    assert(
      updateChallengeRes.status === 200 && updateChallengeRes.data.data.challenge.status === 'Published',
      'Admin Update Challenge to Published',
      `Status: ${updateChallengeRes.data.data.challenge.status}, Points: ${updateChallengeRes.data.data.challenge.points}`
    );

    // ------------------------------------------------------------------------
    // SECTION 6: ADMIN QUESTION CRUD WITH CHECKPOINT ASSOCIATION
    // ------------------------------------------------------------------------
    console.log('\n--- 6. Admin Question Management CRUD ---');
    const secretFlag = `HTG{test_flag_integration_${rand}}`;

    // 6.1 Create Question in Challenge Pool
    const createQuestionRes = await axios.post(
      `${BASE_URL}/admin/questions`,
      {
        challengeId: testChallenge._id,
        title: `Verify Cipher Signal ${rand}`,
        prompt: 'Decrypt the test ciphertext with salt key.',
        type: 'Flag',
        category: 'Crypto',
        difficulty: 'HARD',
        points: 300,
        status: 'Published',
        attempts: 3,
        flag: secretFlag,
        checkpointId: sampleCheckpoint ? sampleCheckpoint._id : null,
        hint: 'Use the standard substitution method.'
      },
      { headers: adminHeaders }
    );
    const testQuestion = createQuestionRes.data.data.question;
    assert(
      createQuestionRes.status === 201 && testQuestion && testQuestion.title.includes('Verify Cipher Signal'),
      'Admin Create Question',
      `Question ID: ${testQuestion._id}, Level: ${testQuestion.levelNumber}, Checkpoint: ${testQuestion.checkpointId ? testQuestion.checkpointId.checkpointCode : 'None'}`
    );

    // 6.2 Admin Retrieve Questions (with flag)
    const adminGetQRes = await axios.get(
      `${BASE_URL}/admin/questions?challengeId=${testChallenge._id}&includeFlag=true`,
      { headers: adminHeaders }
    );
    const adminQ = adminGetQRes.data.data.questions[0];
    assert(
      adminGetQRes.status === 200 && adminQ && adminQ.flag === secretFlag,
      'Admin Retrieve Question with Secret Flag',
      `Flag successfully returned to authorized ADMIN: ${adminQ.flag}`
    );

    // 6.3 Update Question
    const updateQRes = await axios.patch(
      `${BASE_URL}/admin/questions/${testQuestion._id}`,
      {
        title: `Verify Cipher Signal ${rand} [Updated]`,
        attempts: 5,
        status: 'Paused'
      },
      { headers: adminHeaders }
    );
    assert(
      updateQRes.status === 200 && updateQRes.data.data.question.attempts === 5,
      'Admin Update Question',
      `Status: ${updateQRes.data.data.question.status}, Attempts: ${updateQRes.data.data.question.attempts}`
    );

    // 6.4 Delete Question
    const deleteQRes = await axios.delete(
      `${BASE_URL}/admin/questions/${testQuestion._id}`,
      { headers: adminHeaders }
    );
    assert(
      deleteQRes.status === 200,
      'Admin Delete Question',
      `Question ${testQuestion._id} deleted from pool`
    );

    // 6.5 Delete Test Challenge
    const deleteChallengeRes = await axios.delete(
      `${BASE_URL}/admin/challenges/${testChallenge._id}`,
      { headers: adminHeaders }
    );
    assert(
      deleteChallengeRes.status === 200,
      'Admin Delete Challenge',
      `Challenge ${testChallenge._id} (Level ${testLevel}) deleted`
    );

    // ------------------------------------------------------------------------
    // SECTION 7: PARTICIPANT FLOW & SECURITY VERIFICATION
    // ------------------------------------------------------------------------
    console.log('\n--- 7. Participant Security & Isolation Verification ---');

    // 7.1 Register participant leader
    const pLeaderRes = await axios.post(`${BASE_URL}/auth/register`, {
      username: `lead_${rand}`,
      email: `lead_${rand}@tulas.edu.in`,
      password: 'leadPassword123!',
      fullName: `Lead Runner ${rand}`,
      college: "Tula's University"
    });
    const pLeaderToken = pLeaderRes.data.data.accessToken;
    const pLeaderHeaders = { Authorization: `Bearer ${pLeaderToken}` };

    // 7.2 Participant create team
    const pTeamRes = await axios.post(
      `${BASE_URL}/teams/create`,
      { name: `Runner Team ${rand}`, college: "Tula's University" },
      { headers: pLeaderHeaders }
    );
    const pTeam = pTeamRes.data.data.team;
    assert(
      pTeamRes.status === 201 && pTeam.name === `Runner Team ${rand}`,
      'Participant Team Creation',
      `Team: ${pTeam.name}, JoinCode: ${pTeam.joinCode}`
    );

    // 7.3 Participant getMyTeam
    const myTeamRes = await axios.get(`${BASE_URL}/teams/me`, { headers: pLeaderHeaders });
    assert(
      myTeamRes.status === 200 && myTeamRes.data.data.team._id === pTeam._id,
      'Participant Get My Team',
      `Members count: ${myTeamRes.data.data.team.members.length}, Score: ${myTeamRes.data.data.team.totalScore}`
    );

    // 7.4 Participant Mission Map
    const pMapRes = await axios.get(`${BASE_URL}/challenges/mission-map`, { headers: pLeaderHeaders });
    assert(
      pMapRes.status === 200 && Array.isArray(pMapRes.data.data.missionMap),
      'Participant Mission Map Access',
      `Accessible levels: ${pMapRes.data.data.missionMap.length}, Current Level: ${pMapRes.data.data.currentLevel}`
    );

    // 7.5 Participant Current Challenge & Question Access
    const pCurRes = await axios.get(`${BASE_URL}/challenges/current`, { headers: pLeaderHeaders });
    assert(
      pCurRes.status === 200 && pCurRes.data.data.challenge && pCurRes.data.data.question,
      'Participant Current Challenge & Dynamic Question',
      `Challenge: ${pCurRes.data.data.challenge.title}, Question: ${pCurRes.data.data.question.title}`
    );
    assert(
      pCurRes.data.data.question.flag === undefined,
      'Participant Flag Security (select: false)',
      'Question flag field is STRICTLY undefined in participant response'
    );

    // ------------------------------------------------------------------------
    // SUMMARY
    // ------------------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(`  INTEGRATION TEST AUDIT COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log('========================================================================\n');
    process.exit(0);

  } catch (err) {
    console.error('\n[FATAL TEST SUITE ERROR]:', err.response?.data || err.message);
    process.exit(1);
  }
}

runTestSuite();
