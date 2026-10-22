const QRCode = require('qrcode');
const config = require('../config/environment');
const { generateCheckpointToken } = require('../utils/crypto');

/**
 * QR Generator Service
 * Automatically creates secure QR codes for Questions and Checkpoints.
 * 
 * SECURITY ARCHITECTURE:
 * Encodes ONLY the opaque verification URL and HMAC-signed token.
 * NEVER encodes answers, flags, clues, or private participant content!
 */
class QrGeneratorService {
  /**
   * Determine frontend origin for scan URLs.
   */
  getFrontendUrl() {
    const rawOrigin = config.cors?.origin || 'http://localhost:5173';
    // If comma-separated (e.g. multiple authorized parties), pick first valid URL
    const primary = rawOrigin.split(',')[0].trim();
    return primary.replace(/\/+$/, '');
  }

  /**
   * Generate QR code artifacts for a physical Checkpoint.
   *
   * @param {object} checkpoint - Checkpoint mongoose document or plain object
   * @returns {Promise<{ token: string, scanUrl: string, qrCodeDataUrl: string, qrSvg: string }>}
   */
  async generateCheckpointQr(checkpoint) {
    const code = String(checkpoint.checkpointCode || checkpoint.code || '').trim().toUpperCase();
    const levelNumber = Number(checkpoint.levelNumber || 1);

    const isTeamBound = checkpoint.mode === 'Team-bound QR' && checkpoint.boundTeamId;
    const token = generateCheckpointToken(code, levelNumber, {
      teamId: isTeamBound ? checkpoint.boundTeamId : null
    });

    const frontendUrl = this.getFrontendUrl();
    const scanUrl = `${frontendUrl}/checkpoint/scan?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`;

    const [qrCodeDataUrl, qrSvg] = await Promise.all([
      QRCode.toDataURL(scanUrl, {
        margin: 1,
        width: 400,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#101610',
          light: '#ffffff'
        }
      }),
      QRCode.toString(scanUrl, {
        type: 'svg',
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#101610',
          light: '#ffffff'
        }
      })
    ]);

    return {
      token,
      scanUrl,
      qrCodeDataUrl,
      qrSvg
    };
  }

  /**
   * Generate QR code artifacts for an individual Question variation.
   *
   * @param {object} question - Question mongoose document or plain object
   * @param {object} [checkpoint] - Associated Checkpoint document or null
   * @returns {Promise<{ token: string, scanUrl: string, qrCodeDataUrl: string, qrSvg: string, checkpointCode: string }>}
   */
  async generateQuestionQr(question, checkpoint = null) {
    const levelNumber = Number(question.levelNumber || 1);
    const code = (checkpoint?.checkpointCode || question.checkpointCode || `HTG-CP${String(levelNumber).padStart(2, '0')}`).trim().toUpperCase();
    const qid = String(question._id);

    // Question-specific token with qid payload embedded
    const token = generateCheckpointToken(code, levelNumber, {
      teamId: null,
      qid
    });

    const frontendUrl = this.getFrontendUrl();
    const scanUrl = `${frontendUrl}/checkpoint/scan?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}&qid=${encodeURIComponent(qid)}`;

    const [qrCodeDataUrl, qrSvg] = await Promise.all([
      QRCode.toDataURL(scanUrl, {
        margin: 1,
        width: 400,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#101610',
          light: '#ffffff'
        }
      }),
      QRCode.toString(scanUrl, {
        type: 'svg',
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#101610',
          light: '#ffffff'
        }
      })
    ]);

    return {
      token,
      scanUrl,
      qrCodeDataUrl,
      qrSvg,
      checkpointCode: code
    };
  }

  /**
   * Generate binary PNG buffer for downloads.
   *
   * @param {string} text - URL or text payload to encode
   * @param {number} [width=600] - Image width in px
   * @returns {Promise<Buffer>}
   */
  async generatePngBuffer(text, width = 600) {
    return QRCode.toBuffer(text, {
      type: 'png',
      margin: 2,
      width,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#101610',
        light: '#ffffff'
      }
    });
  }
}

module.exports = new QrGeneratorService();

