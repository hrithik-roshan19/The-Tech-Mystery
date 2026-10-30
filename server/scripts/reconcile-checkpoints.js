/**
 * Checkpoint Reconciliation & Audit Script
 * The Tech Mystery / Hack The Grid — Utkrisht 2026
 *
 * Audits all checkpoints HTG-CP01 through HTG-CP10 in MongoDB Atlas 'test'.
 * Upgrades any checkpoint with obsolete localhost URLs to the canonical
 * production origin (https://the-tech-mystery.vercel.app).
 *
 * Usage:
 *   node server/scripts/reconcile-checkpoints.js             (Dry-Run Audit)
 *   node server/scripts/reconcile-checkpoints.js --confirm   (Apply Fixes)
 */

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch (e) {}

const mongoose = require('mongoose');
const QRCode = require('qrcode');
const config = require('../src/config/environment');
const { verifyCheckpointToken, decodeCheckpointToken } = require('../src/utils/crypto');

const CANONICAL_ORIGIN = 'https://the-tech-mystery.vercel.app';
const isConfirm = process.argv.includes('--confirm');

async function run() {
  console.log('====================================================');
  console.log('CHECKPOINT PRODUCTION RECONCILIATION & AUDIT');
  console.log('====================================================');
  console.log(`[Mode]           ${isConfirm ? 'CONFIRM (Writes Enabled)' : 'DRY-RUN (Audit Only)'}`);
  console.log(`[Target DB]      test`);
  console.log(`[Canonical URL]  ${CANONICAL_ORIGIN}`);

  await mongoose.connect(config.mongodbUri, { dbName: 'test' });
  console.log(`[Connected]      ${mongoose.connection.host}/${mongoose.connection.name}`);

  const Checkpoint = mongoose.model('Checkpoint', new mongoose.Schema({}, { strict: false }));
  const checkpoints = await Checkpoint.find({}).sort({ levelNumber: 1 });

  console.log(`\nFound ${checkpoints.length} Checkpoints in MongoDB Atlas.\n`);

  let obsoleteCount = 0;
  let validCount = 0;

  for (const cp of checkpoints) {
    const code = cp.checkpointCode;
    const level = cp.levelNumber;
    const hasLocalhost = cp.qrScanUrl && cp.qrScanUrl.includes('localhost');
    const token = cp.qrToken;
    const decoded = decodeCheckpointToken(token);

    const isCryptoValid = verifyCheckpointToken(code, level, token, {
      registeredToken: token
    });

    console.log(`--- [Level ${level}] ${code}: "${cp.name}" ---`);
    console.log(`  ID:            ${cp._id}`);
    console.log(`  Location:      ${cp.locationDescription}`);
    console.log(`  Scan URL:      ${cp.qrScanUrl}`);
    console.log(`  Contains Localhost: ${hasLocalhost ? 'YES (Obsolete!)' : 'NO (Production OK)'}`);
    console.log(`  Token Present: ${Boolean(token)} (Length: ${token?.length || 0})`);
    console.log(`  Decoded Exp:   ${decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : 'None'}`);
    console.log(`  Crypto Valid:  ${isCryptoValid ? 'PASS' : 'FAIL'}`);

    if (hasLocalhost || !cp.qrCodeDataUrl) {
      obsoleteCount++;
      if (isConfirm) {
        const canonicalScanUrl = `${CANONICAL_ORIGIN}/checkpoint/scan?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}${cp._id ? `&checkpointId=${cp._id}` : ''}`;
        const newQrDataUrl = await QRCode.toDataURL(canonicalScanUrl, {
          margin: 1,
          width: 400,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#101610',
            light: '#ffffff'
          }
        });

        await Checkpoint.updateOne(
          { _id: cp._id },
          {
            $set: {
              qrScanUrl: canonicalScanUrl,
              qrCodeDataUrl: newQrDataUrl
            }
          }
        );
        console.log(`  -> [RECONCILED] ScanUrl updated to ${canonicalScanUrl}`);
        console.log(`  -> [RECONCILED] QR code image re-rendered for canonical URL.`);
      } else {
        console.log(`  -> [ACTION NEEDED] Needs upgrade to ${CANONICAL_ORIGIN}`);
      }
    } else {
      validCount++;
    }
  }

  console.log('\n====================================================');
  console.log('AUDIT SUMMARY');
  console.log('====================================================');
  console.log(`Total Checkpoints:     ${checkpoints.length}`);
  console.log(`Valid Production QRs:  ${validCount}`);
  console.log(`Obsolete Localhost QRs: ${obsoleteCount}`);
  if (!isConfirm && obsoleteCount > 0) {
    console.log(`\nRun with --confirm to apply canonical URL upgrades to the database.`);
  } else if (isConfirm) {
    console.log(`\nAll obsolete checkpoints have been upgraded to ${CANONICAL_ORIGIN} successfully!`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Reconciliation failed:', err);
  process.exit(1);
});
