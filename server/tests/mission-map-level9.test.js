/**
 * Automated Test Suite for Level 9 Mission Map Question Bank
 * The Tech Mystery / Hack The Grid
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const level9Data = require('../src/data/mission-map/level9');
const { verifyAnswer } = require('../src/services/scoring.service');
const { participantQuestion, safeContent } = require('../src/utils/participantData');
const { validateDataset } = require('../scripts/seed-mission-map-level');

describe('Level 9 Mission Map: Polyalphabetic Steganography', () => {

  describe('1. Dataset Structure & Specification Conformance', () => {
    test('contains exactly 70 questions for Level 9', () => {
      assert.strictEqual(level9Data.levelNumber, 9);
      assert.strictEqual(level9Data.title, 'Polyalphabetic Steganography');
      assert.strictEqual(level9Data.difficulty, 'EXPERT');
      assert.strictEqual(level9Data.questions.length, 70);
    });

    test('strictly enforces open-ended format with zero MCQs', () => {
      level9Data.questions.forEach((q) => {
        assert.notStrictEqual(q.type, 'Multiple Choice', `Question ${q.stableId} must not be Multiple Choice`);
        assert.ok(
          ['Short Text', 'Text Answer', 'Numeric Answer', 'Flag'].includes(q.type),
          `Question ${q.stableId} has invalid open-ended type: ${q.type}`
        );
        assert.deepStrictEqual(q.options, [], `Question ${q.stableId} must have empty options array`);
      });
    });

    test('enforces unique stable identifiers (HTG-L09-OE01 to HTG-L09-OE70)', () => {
      const seenIds = new Set();
      const seenOrders = new Set();

      level9Data.questions.forEach((q, index) => {
        const expectedId = `HTG-L09-OE${String(index + 1).padStart(2, '0')}`;
        assert.strictEqual(q.stableId, expectedId, `Question index ${index} must match ${expectedId}`);
        assert.ok(!seenIds.has(q.stableId), `Duplicate ID: ${q.stableId}`);
        seenIds.add(q.stableId);

        assert.ok(!seenOrders.has(q.order), `Duplicate order: ${q.order}`);
        seenOrders.add(q.order);
      });

      assert.strictEqual(seenIds.size, 70);
      assert.strictEqual(seenOrders.size, 70);
    });

    test('orders follow contiguous sequence from 1 to 70', () => {
      const orders = level9Data.questions.map(q => q.order).sort((a, b) => a - b);
      assert.strictEqual(orders[0], 1);
      assert.strictEqual(orders[69], 70);
      for (let i = 0; i < 70; i++) {
        assert.strictEqual(orders[i], 1 + i, `Order at index ${i} must be ${1 + i}`);
      }
    });

    test('requires complete technical metadata, rubrics and key points', () => {
      level9Data.questions.forEach((q) => {
        assert.ok(q.title && q.title.trim().length > 0, `${q.stableId}: missing title`);
        assert.ok(q.prompt && q.prompt.trim().length > 0, `${q.stableId}: missing prompt`);
        assert.ok(q.flag && String(q.flag).trim().length > 0, `${q.stableId}: missing flag`);

        assert.ok(q.metadata, `${q.stableId}: missing metadata object`);
        assert.ok(q.metadata.explanation && q.metadata.explanation.length > 10, `${q.stableId}: explanation too short`);
        assert.ok(Array.isArray(q.metadata.essentialKeyPoints) && q.metadata.essentialKeyPoints.length >= 2, `${q.stableId}: must have >= 2 key points`);
        assert.ok(q.metadata.gradingRubric, `${q.stableId}: missing gradingRubric`);
        assert.ok(q.metadata.gradingRubric.fullCredit, `${q.stableId}: missing fullCredit criteria`);
        assert.ok(q.metadata.gradingRubric.partialCredit, `${q.stableId}: missing partialCredit criteria`);
        assert.ok(q.metadata.gradingRubric.noCredit, `${q.stableId}: missing noCredit criteria`);
        assert.ok(Array.isArray(q.hints) && q.hints.length >= 1, `${q.stableId}: must have at least 1 progressive hint`);
      });
    });
  });

  describe('2. Answer Evaluation & Robustness', () => {
    test('correctly evaluates all 70 canonical expected flags', () => {
      level9Data.questions.forEach((q) => {
        const isValid = verifyAnswer(q.flag, q);
        assert.ok(isValid, `${q.stableId}: canonical flag "${q.flag}" failed verification`);
      });
    });

    test('correctly evaluates all configured acceptable alternatives', () => {
      level9Data.questions.forEach((q) => {
        const alternatives = q.metadata.acceptableAlternatives || [];
        alternatives.forEach((alt) => {
          const isValid = verifyAnswer(alt, q);
          assert.ok(isValid, `${q.stableId}: acceptable alternative "${alt}" failed verification`);
        });
      });
    });

    test('strictly rejects incorrect or bogus responses', () => {
      const bogusSubmissions = [
        'WRONG_FLAG',
        'HTG{TOTALLY_WRONG}',
        'random_garbage_string_12345',
        'HTG{incorrect_flag_format}'
      ];

      level9Data.questions.forEach((q) => {
        bogusSubmissions.forEach((bogus) => {
          const isValid = verifyAnswer(bogus, q);
          assert.strictEqual(
            isValid,
            false,
            `${q.stableId}: incorrectly accepted bogus response "${bogus}"`
          );
        });
      });
    });
  });

  describe('3. Participant Data Sanitization & Zero Leakage', () => {
    test('participantQuestion strictly strips flag, unearned hints, and internal metadata', async () => {
      for (const q of level9Data.questions) {
        const sanitized = await participantQuestion(q);

        assert.strictEqual(sanitized.flag, undefined, `${q.stableId}: flag must be stripped`);
        assert.strictEqual(sanitized._flag, undefined, `${q.stableId}: _flag must be stripped`);
        assert.strictEqual(sanitized.solution, undefined, `${q.stableId}: solution must be stripped`);
        assert.strictEqual(sanitized.metadata?.gradingRubric, undefined, `${q.stableId}: gradingRubric must be stripped`);
        assert.strictEqual(sanitized.metadata?.essentialKeyPoints, undefined, `${q.stableId}: essentialKeyPoints must be stripped`);
        assert.strictEqual(sanitized.metadata?.acceptableAlternatives, undefined, `${q.stableId}: acceptableAlternatives must be stripped`);

        if (sanitized.hints) {
          sanitized.hints.forEach((h, hIdx) => {
            if (!h.unlocked) {
              assert.strictEqual(h.content, undefined, `${q.stableId}: hint ${hIdx} content must be stripped when locked`);
            }
          });
        }
      }
    });

    test('ensures zero prompts are withheld by safeContent security filters', () => {
      level9Data.questions.forEach((q) => {
        const sanitizedPrompt = safeContent(q.prompt, [q.flag]);
        assert.ok(
          !sanitizedPrompt.includes('withheld'),
          `${q.stableId}: prompt was partially withheld by safeContent filter!`
        );
      });
    });
  });

  describe('4. Seed Dataset Pre-Validation Guardrails', () => {
    test('validates full Level 9 dataset with 0 errors', async () => {
      const errors = await validateDataset(level9Data);
      assert.deepStrictEqual(errors, [], `Expected 0 validation errors, got: ${errors.join('; ')}`);
    });

    test('rejects dataset if MCQs are introduced', async () => {
      const corruptDataset = {
        ...level9Data,
        questions: level9Data.questions.map((q, idx) => {
          if (idx === 0) {
            return {
              ...q,
              type: 'Multiple Choice',
              options: ['Option A', 'Option B']
            };
          }
          return q;
        })
      };

      const errors = await validateDataset(corruptDataset);
      assert.ok(errors.some(e => e.includes('MCQ detected')), 'Should detect MCQ violation');
    });

    test('rejects dataset if question count is not exactly 70', async () => {
      const corruptDataset = {
        ...level9Data,
        questions: level9Data.questions.slice(0, 69)
      };

      const errors = await validateDataset(corruptDataset);
      assert.ok(errors.some(e => e.includes('Dataset question count mismatch')), 'Should detect count mismatch');
    });
  });
});

