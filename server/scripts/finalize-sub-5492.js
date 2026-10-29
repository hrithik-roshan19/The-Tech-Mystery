const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function finalizeSub() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
  const subId = new mongoose.Types.ObjectId('6ae3c4e3c9065efba3665492');
  const sub = await mongoose.connection.db.collection('submissions').findOne({ _id: subId });
  console.log('Current submission in DB:', {
    _id: sub._id,
    status: sub.status,
    isCorrect: sub.isCorrect,
    reviewed: sub.reviewed,
    pointsDelta: sub.pointsDelta
  });

  if (sub && sub.reviewed === false) {
    const res = await mongoose.connection.db.collection('submissions').updateOne(
      { _id: subId, reviewed: false },
      {
        $set: {
          reviewed: true,
          reviewedAt: new Date(),
          reviewNote: 'Automatically verified and scored'
        }
      }
    );
    console.log(`Update result: matchedCount=${res.matchedCount}, modifiedCount=${res.modifiedCount}`);
  }

  const updated = await mongoose.connection.db.collection('submissions').findOne({ _id: subId });
  console.log('Finalized submission in DB:', {
    _id: updated._id,
    status: updated.status,
    isCorrect: updated.isCorrect,
    reviewed: updated.reviewed,
    reviewNote: updated.reviewNote,
    reviewedAt: updated.reviewedAt
  });

  await mongoose.disconnect();
}

finalizeSub().catch(err => {
  console.error(err);
  process.exit(1);
});
