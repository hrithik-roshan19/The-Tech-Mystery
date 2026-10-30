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
    // 1. Explicit canonical override
    if (process.env.CANONICAL_FRONTEND_URL) {
      return process.env.CANONICAL_FRONTEND_URL.replace(/\/+$/, '');
    }

    // 2. In production mode, always enforce the official production origin
    const PROD_CANONICAL = 'https://the-tech-mystery.vercel.app';
    if (config.isProduction || process.env.NODE_ENV === 'production') {
      const rawOrigin = config.cors?.origin;
      const raw = Array.isArray(rawOrigin) ? (rawOrigin[0] || '') : (rawOrigin || '');
      const primary = raw.includes(',') ? raw.split(',')[0].trim() : raw.trim();
      if (primary && !primary.includes('localhost') && !primary.includes('127.0.0.1')) {
        return primary.replace(/\/+$/, '');
      }
      return PROD_CANONICAL;
    }

    // 3. In non-production, check if CLIENT_URL has a non-localhost domain
    const rawOrigin = config.cors?.origin || 'http://localhost:5173';
    const raw = Array.isArray(rawOrigin) ? (rawOrigin[0] || 'http://localhost:5173') : rawOrigin;
    const primary = raw.includes(',') ? raw.split(',')[0].trim() : raw.trim();
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
    const scanUrl = `${frontendUrl}/checkpoint/scan?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}${checkpoint._id ? `&checkpointId=${checkpoint._id}` : ''}`;

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
   * Generate QR code for a challenge level.
   *
   * @param {number} levelNumber
   * @param {object} [checkpoint]
   * @returns {Promise<{ qrDataUrl: string, scanUrl: string, token: string, code: string }>}
   */
  async generateLevelQrCode(levelNumber, checkpoint = null) {
    const cp = checkpoint || {
      levelNumber,
      checkpointCode: `HTG-CP${String(levelNumber).padStart(2, '0')}`
    };
    const res = await this.generateCheckpointQr(cp);
    return {
      qrDataUrl: res.qrCodeDataUrl,
      scanUrl: res.scanUrl,
      token: res.token,
      code: cp.checkpointCode
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

