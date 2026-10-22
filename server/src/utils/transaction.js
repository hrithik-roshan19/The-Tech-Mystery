const mongoose = require('mongoose');

// Mongoose 8 propagates this session to every query in the async callback.
mongoose.set('transactionAsyncLocalStorage', true);

async function transaction(work) {
  if (mongoose.transactionAsyncLocalStorage.getStore()?.session) return work();
  try {
    return await mongoose.connection.transaction(work, {
      readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }
    });
  } catch (err) {
    if (err.code === 20 || err.codeName === 'IllegalOperation') {
      const unavailable = new Error('Secure writes require MongoDB configured as a replica set or sharded cluster.');
      unavailable.statusCode = 503;
      throw unavailable;
    }
    throw err;
  }
}

module.exports = transaction;
