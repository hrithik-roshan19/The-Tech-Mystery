/**
 * Read-only MongoDB backup script for The Tech Mystery users collection.
 * Creates an exact JSON snapshot of all user documents prior to any administrative identity mapping.
 * Does NOT perform any writes to MongoDB.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hack_the_grid';
const backupDir = path.resolve(__dirname, '../backup/pre_admin_clerk_link');

async function backup() {
  console.log('Connecting read-only to MongoDB...');
  await mongoose.connect(uri);
  
  const dbName = mongoose.connection.name;
  console.log(`Connected database: ${dbName}`);
  
  const users = await mongoose.connection.db.collection('users')
    .find({})
    .toArray();
    
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupFilePath = path.join(backupDir, 'users_snapshot.json');
  const metadataFilePath = path.join(backupDir, 'metadata.json');
  
  fs.writeFileSync(backupFilePath, JSON.stringify(users, null, 2), 'utf8');
  fs.writeFileSync(metadataFilePath, JSON.stringify({
    timestamp: new Date().toISOString(),
    database: dbName,
    collection: 'users',
    documentCount: users.length,
    backupFile: 'users_snapshot.json'
  }, null, 2), 'utf8');
  
  console.log(`Successfully backed up ${users.length} user documents to: ${backupFilePath}`);
  await mongoose.disconnect();
}

backup().catch(err => {
  console.error('Backup failed:', err.message);
  process.exit(1);
});

