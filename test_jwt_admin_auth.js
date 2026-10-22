/**
 * Comprehensive Automated Test Suite: JWT Authentication & Admin Authorization Hardening
 * The Tech Mystery
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();
const config = require('./server/src/config/environment');

const BASE_URL = `http://127.0.0.1:${config.port}${config.apiPrefix}`;
const MONGO_URI = config.mongodbUri;
const JWT_SECRET = config.jwt.secret;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}${details ? ` -> ${details}` : ''}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

async function runAuthHardeningTests() {
  console.log('========================================================================');
  console.log(' THE TECH MYSTERY — JWT AUTHENTICATION & ADMIN AUTHORIZATION TEST SUITE');
  console.log('========================================================================\n');

  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db();
  const usersCollection = db.collection('users');
  const teamsCollection = db.collection('teams');

  const timestamp = Date.now();

  try {
    // ------------------------------------------------------------------------
    // 1. Missing, Malformed, Invalid, and Expired JWT
    // ------------------------------------------------------------------------
    console.log('1. Missing, Malformed, Invalid, and Expired JWT:');

    // 1.1 Missing token
    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`);
      assert(false, 'Missing token is rejected');
    } catch (err) {
      assert(err.response?.status === 401, 'Missing token returns 401', `Status: ${err.response?.status}`);
    }

    // 1.2 Malformed: Non-Bearer header
    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: 'Basic dXNlcjpwYXNz' }
      });
      assert(false, 'Non-Bearer authorization is rejected');
    } catch (err) {
      assert(err.response?.status === 401, 'Non-Bearer authorization returns 401', `Status: ${err.response?.status}`);
    }

    // 1.3 Malformed: Missing token after Bearer
    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: 'Bearer ' }
      });
      assert(false, 'Empty Bearer token is rejected');
    } catch (err) {
      assert(err.response?.status === 401, 'Empty Bearer token returns 401', `Status: ${err.response?.status}`);
    }

    // 1.4 Malformed: Corrupted string
    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: 'Bearer invalid.token.payload' }
      });
      assert(false, 'Malformed token string is rejected');
    } catch (err) {
      assert(err.response?.status === 401, 'Malformed token string returns 401', `Status: ${err.response?.status}`);
    }

    // 1.5 Invalid Signature
    const forgedToken = jwt.sign(
      { userId: new ObjectId().toString(), username: 'forger', role: 'ADMIN' },
      'wrong_untrusted_secret_key'
    );
    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${forgedToken}` }
      });
      assert(false, 'Forged signature token is rejected');
    } catch (err) {
      assert(err.response?.status === 401, 'Forged signature returns 401', `Status: ${err.response?.status}`);
    }

    // 1.6 Expired JWT
    const expiredToken = jwt.sign(
      { userId: new ObjectId().toString(), username: 'expired_user', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '-10s' }
    );
    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${expiredToken}` }
      });
      assert(false, 'Expired JWT is rejected');
    } catch (err) {
      assert(
        err.response?.status === 401 && err.response?.data?.message?.includes('expired'),
        'Expired JWT returns 401 with expiration notice',
        `Message: "${err.response?.data?.message}"`
      );
    }

    // ------------------------------------------------------------------------
    // 2. Deleted User
    // ------------------------------------------------------------------------
    console.log('\n2. Deleted User Handling:');
    const deletedUserId = new ObjectId();
    await usersCollection.insertOne({
      _id: deletedUserId,
      username: `deleted_${timestamp}`,
      email: `deleted_${timestamp}@tulas.edu.in`,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const deletedUserToken = jwt.sign(
      { userId: deletedUserId.toString(), username: `deleted_${timestamp}`, role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Delete user directly from DB
    await usersCollection.deleteOne({ _id: deletedUserId });

    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${deletedUserToken}` }
      });
      assert(false, 'Deleted user with valid JWT is rejected');
    } catch (err) {
      assert(
        err.response?.status === 401 && err.response?.data?.message?.includes('no longer exists'),
        'Deleted user receives 401 "User account no longer exists"',
        `Message: "${err.response?.data?.message}"`
      );
    }

    // ------------------------------------------------------------------------
    // 3. Inactive User
    // ------------------------------------------------------------------------
    console.log('\n3. Inactive / Deactivated User Handling:');
    const inactiveUserId = new ObjectId();
    await usersCollection.insertOne({
      _id: inactiveUserId,
      username: `inactive_${timestamp}`,
      email: `inactive_${timestamp}@tulas.edu.in`,
      role: 'ADMIN',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const inactiveUserToken = jwt.sign(
      { userId: inactiveUserId.toString(), username: `inactive_${timestamp}`, role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${inactiveUserToken}` }
      });
      assert(false, 'Inactive user with valid JWT is rejected');
    } catch (err) {
      assert(
        err.response?.status === 401 && (err.response?.data?.message?.toLowerCase().includes('deactivated') || err.response?.data?.message?.toLowerCase().includes('inactive')),
        'Inactive user receives 401 deactivation response',
        `Message: "${err.response?.data?.message}"`
      );
    }

    // ------------------------------------------------------------------------
    // 4. Active Admin Succeeds
    // ------------------------------------------------------------------------
    console.log('\n4. Active Admin Authorization:');
    const adminUserId = new ObjectId();
    await usersCollection.insertOne({
      _id: adminUserId,
      username: `testadmin_${timestamp}`,
      email: `testadmin_${timestamp}@tulas.edu.in`,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const activeAdminToken = jwt.sign(
      { userId: adminUserId.toString(), username: `testadmin_${timestamp}`, role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const adminStatsRes = await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${activeAdminToken}` }
    });
    assert(
      adminStatsRes.status === 200 && adminStatsRes.data?.success,
      'Active admin successfully accesses admin endpoint (200 OK)',
      `Stats returned: totalTeams=${adminStatsRes.data?.data?.stats?.totalTeams}`
    );

    // ------------------------------------------------------------------------
    // 5. Active Non-Admin Receives 403
    // ------------------------------------------------------------------------
    console.log('\n5. Active Non-Admin Access Restrictions:');
    const memberUserId = new ObjectId();
    await usersCollection.insertOne({
      _id: memberUserId,
      username: `member_${timestamp}`,
      email: `member_${timestamp}@tulas.edu.in`,
      role: 'TEAM_MEMBER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const memberToken = jwt.sign(
      { userId: memberUserId.toString(), username: `member_${timestamp}`, role: 'TEAM_MEMBER' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${memberToken}` }
      });
      assert(false, 'Non-admin accessing admin endpoint is rejected');
    } catch (err) {
      assert(
        err.response?.status === 403,
        'Active non-admin receives 403 Forbidden on admin endpoint',
        `Status: ${err.response?.status}`
      );
    }

    // ------------------------------------------------------------------------
    // 6. Role Changed in MongoDB Reflected Immediately
    // ------------------------------------------------------------------------
    console.log('\n6. Real-time Role Synchronization from MongoDB:');
    // Upgrade member to ADMIN in MongoDB without re-issuing token
    await usersCollection.updateOne(
      { _id: memberUserId },
      { $set: { role: 'ADMIN' } }
    );

    const upgradedRes = await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${memberToken}` } // Token payload still says 'TEAM_MEMBER'
    });
    assert(
      upgradedRes.status === 200 && upgradedRes.data?.success,
      'User upgraded to ADMIN in DB gains immediate admin access with existing token (200 OK)'
    );

    // Downgrade back to TEAM_MEMBER in MongoDB
    await usersCollection.updateOne(
      { _id: memberUserId },
      { $set: { role: 'TEAM_MEMBER' } }
    );

    try {
      await axios.get(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${memberToken}` }
      });
      assert(false, 'Downgraded user is blocked');
    } catch (err) {
      assert(
        err.response?.status === 403,
        'User downgraded in DB is immediately blocked with 403 Forbidden with existing token'
      );
    }

    // ------------------------------------------------------------------------
    // 7. Team Membership Removed in MongoDB Reflected Immediately
    // ------------------------------------------------------------------------
    console.log('\n7. Real-time Team Membership Synchronization & Stale Clearing:');
    const teamId = new ObjectId();
    await teamsCollection.insertOne({
      _id: teamId,
      name: `Team_${timestamp}`,
      joinCode: `HTG-${timestamp.toString(36).toUpperCase()}`,
      leader: memberUserId,
      members: [memberUserId],
      currentLevel: 1,
      totalScore: 0,
      isDisqualified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Assign user to team in DB
    await usersCollection.updateOne(
      { _id: memberUserId },
      { $set: { teamId: teamId } }
    );

    // Issue token with teamId
    const teamUserToken = jwt.sign(
      { userId: memberUserId.toString(), username: `member_${timestamp}`, role: 'TEAM_MEMBER', teamId: teamId.toString() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Check my-team succeeds
    const teamRes = await axios.get(`${BASE_URL}/teams/my-team`, {
      headers: { Authorization: `Bearer ${teamUserToken}` }
    });
    assert(
      teamRes.status === 200 && teamRes.data?.data?.team?._id === teamId.toString(),
      'User with active team membership accesses team resource (200 OK)'
    );

    // Remove user's teamId in DB (set to null)
    await usersCollection.updateOne(
      { _id: memberUserId },
      { $set: { teamId: null } }
    );

    // Verify stale teamId in token is cleared by testing endpoint requiring team membership (/challenges/mission-map)
    try {
      await axios.get(`${BASE_URL}/challenges/mission-map`, {
        headers: { Authorization: `Bearer ${teamUserToken}` }
      });
      assert(false, 'Removed team member accessing team-guarded challenge route is rejected');
    } catch (err) {
      assert(
        err.response?.status === 403 && err.response?.data?.message?.includes('membership'),
        'Stale teamId cleared: removed team member immediately receives 403 on team-required route',
        `Message: "${err.response?.data?.message}"`
      );
    }

    // Also verify /teams/my-team reflects un-enrolled state despite teamId in token
    try {
      await axios.get(`${BASE_URL}/teams/my-team`, {
        headers: { Authorization: `Bearer ${teamUserToken}` }
      });
      assert(false, 'Removed team member calling /teams/my-team is rejected');
    } catch (err) {
      assert(
        err.response?.status === 404 && err.response?.data?.message?.includes('not currently enrolled'),
        'User calling /teams/my-team with stale token receives 404 not enrolled',
        `Message: "${err.response?.data?.message}"`
      );
    }

    // ------------------------------------------------------------------------
    // 8. Optional Auth With No Token Remains Public
    // ------------------------------------------------------------------------
    console.log('\n8. Optional Auth Public Route Behavior:');
    const publicLeaderboardRes = await axios.get(`${BASE_URL}/leaderboard`);
    assert(
      publicLeaderboardRes.status === 200 && publicLeaderboardRes.data?.success && Array.isArray(publicLeaderboardRes.data?.data?.leaderboard),
      'Optional auth with no token allows public access to leaderboard (200 OK)'
    );

    // ------------------------------------------------------------------------
    // 9. Optional Auth With Inactive or Deleted User Does Not Authenticate
    // ------------------------------------------------------------------------
    console.log('\n9. Optional Auth Inactive / Deleted User Isolation:');
    // Call leaderboard with deleted user token: should still succeed as public, without crashing
    const optDeletedRes = await axios.get(`${BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${deletedUserToken}` }
    });
    assert(
      optDeletedRes.status === 200 && optDeletedRes.data?.success,
      'Optional auth with deleted user token gracefully remains public without crashing'
    );

    // Call leaderboard with inactive user token: should still succeed as public
    const optInactiveRes = await axios.get(`${BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${inactiveUserToken}` }
    });
    assert(
      optInactiveRes.status === 200 && optInactiveRes.data?.success,
      'Optional auth with inactive user token gracefully remains public without authenticating'
    );

    // Cleanup test fixtures
    await usersCollection.deleteMany({
      _id: { $in: [deletedUserId, inactiveUserId, adminUserId, memberUserId] }
    });
    await teamsCollection.deleteOne({ _id: teamId });
    console.log('\n  Cleaned up all temporary test users and teams from database.');

  } finally {
    await mongoClient.close();
  }

  console.log('\n========================================================================');
  console.log(` RESULTS: ${passedTests} passed, ${failedTests} failed out of ${totalTests} assertions`);
  console.log('========================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAuthHardeningTests().catch((err) => {
  console.error('Unhandled test suite failure:', err);
  process.exit(1);
});
