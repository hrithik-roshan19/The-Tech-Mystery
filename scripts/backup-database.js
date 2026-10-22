/**
 * Full MongoDB backup utility for The Tech Mystery.
 * Creates an exact JSON snapshot of all collections prior to dummy data removal.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hack_the_grid';
const backupDirs = [
  path.resolve(__dirname, '../backup/pre_dummy_data_cleanup'),
  path.resolve(__dirname, '../server/backup/pre_dummy_data_cleanup')
];

async function fullBackup() {
  console.log('Connecting to MongoDB for full database snapshot...');
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const dbName = mongoose.connection.name;
  console.log(`Connected to database: ${dbName}`);

  const collections = await db.listCollections().toArray();
  const metadata = {
    timestamp: new Date().toISOString(),
    database: dbName,
    collections: {}
  };

  for (const dir of backupDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  for (const col of collections) {
    const colName = col.name;
    const docs = await db.collection(colName).find({}).toArray();
    metadata.collections[colName] = docs.length;

    for (const dir of backupDirs) {
      const filePath = path.join(dir, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');
    }
    console.log(`[✓] Backed up ${docs.length} documents from collection '${colName}'`);
  }

  for (const dir of backupDirs) {
    const metaPath = path.join(dir, 'metadata.json');
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf8');
  }

  console.log(`\nFull database backup complete. Snapshots saved to:`);
  backupDirs.forEach(dir => console.log(`  - ${dir}`));
  await mongoose.disconnect();
}

fullBackup().catch(err => {
  console.error('Full backup failed:', err.message);
  process.exit(1);
});

