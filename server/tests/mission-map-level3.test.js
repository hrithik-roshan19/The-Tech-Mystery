/**
 * Automated Test Suite for Level 3 Mission Map Question Bank
 * The Tech Mystery / Hack The Grid
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const level3Data = require('../src/data/mission-map/level3');
const { verifyAnswer } = require('../src/services/scoring.service');
const { participantQuestion, safeContent } = require('../src/utils/participantData');
const { validateDataset } = require('../scripts/seed-mission-map-level');

describe('Level 3 Mission Map: Lost Transmission', () => {

  describe('1. Dataset Structure & Specification Conformance', () => {
    test('contains exactly 70 questions for Level 3', () => {
      assert.strictEqual(level3Data.levelNumber, 3);
      assert.strictEqual(level3Data.title, 'Lost Transmission');
      assert.strictEqual(level3Data.difficulty, 'MEDIUM');
      assert.strictEqual(level3Data.questions.length, 70);
    });

    test('strictly enforces open-ended format with zero MCQs', () => {
      level3Data.questions.forEach((q) => {
        assert.notStrictEqual(q.type, 'Multiple Choice', `Question ${q.stableId} must not be Multiple Choice`);
        assert.ok(
          ['Short Text', 'Text Answer', 'Numeric Answer', 'Flag'].includes(q.type),
          `Question ${q.stableId} has invalid open-ended type: ${q.type}`
        );
        assert.deepStrictEqual(q.options, [], `Question ${q.stableId} must have empty options array`);
      });
    });

    test('enforces unique stable identifiers (HTG-L03-OE01 to HTG-L03-OE70)', () => {
      const seenIds = new Set();
      const seenOrders = new Set();

      level3Data.questions.forEach((q, index) => {
        const expectedId = `HTG-L03-OE${String(index + 1).padStart(2, '0')}`;
        assert.strictEqual(q.stableId, expectedId, `Question index ${index} must match ${expectedId}`);
        assert.ok(!seenIds.has(q.stableId), `Duplicate ID: ${q.stableId}`);
        seenIds.add(q.stableId);

        assert.ok(!seenOrders.has(q.order), `Duplicate order: ${q.order}`);
        seenOrders.add(q.order);
      });

      assert.strictEqual(seenIds.size, 70);
      assert.strictEqual(seenOrders.size, 70);
    });

    test('orders follow contiguous sequence from 11 to 80', () => {
      const orders = level3Data.questions.map(q => q.order).sort((a, b) => a - b);
      assert.strictEqual(orders[0], 11);
      assert.strictEqual(orders[69], 80);
      for (let i = 0; i < 70; i++) {
        assert.strictEqual(orders[i], 11 + i, `Order at index ${i} must be ${11 + i}`);
      }
    });

    test('requires complete technical metadata, rubrics and key points', () => {
      level3Data.questions.forEach((q) => {
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
      level3Data.questions.forEach((q) => {
        const isCorrect = verifyAnswer(q.flag, q);
        assert.strictEqual(isCorrect, true, `Canonical flag failed verification for ${q.stableId}: "${q.flag}"`);
      });
    });

    test('correctly evaluates all configured acceptable alternatives', () => {
      level3Data.questions.forEach((q) => {
        const alternatives = q.metadata.acceptableAlternatives || [];
        alternatives.forEach((alt) => {
          const isCorrect = verifyAnswer(alt, q);
          assert.strictEqual(isCorrect, true, `Alternative "${alt}" failed verification for ${q.stableId}`);
        });
      });
    });

    test('strictly rejects incorrect or bogus responses', () => {
      const bogusSubmissions = [
        'completely_wrong_token',
        'HTG{invalid_guess_123}',
        '000000',
        'gibberish!@#$',
        '   '
      ];

      level3Data.questions.forEach((q) => {
        bogusSubmissions.forEach((bogus) => {
          assert.strictEqual(verifyAnswer(bogus, q), false, `Bogus answer "${bogus}" was improperly accepted for ${q.stableId}`);
        });
        assert.strictEqual(verifyAnswer('', q), false);
        assert.strictEqual(verifyAnswer(null, q), false);
        assert.strictEqual(verifyAnswer(undefined, q), false);
      });
    });
  });

  describe('3. Participant Data Sanitization & Zero Leakage', () => {
    test('participantQuestion strictly strips flag, unearned hints, and internal metadata', async () => {
      for (const q of level3Data.questions) {
        const mockDoc = { ...q, _id: '507f191e810c19729de860ea' };
        const serialized = await participantQuestion(mockDoc);

        assert.strictEqual(serialized.flag, undefined, `${q.stableId}: flag must never be serialized`);
        assert.strictEqual(serialized.metadata, undefined, `${q.stableId}: metadata must never be serialized`);
        assert.strictEqual(serialized.hints, undefined, `${q.stableId}: hints must never be in question DTO`);
        assert.strictEqual(serialized.explanation, undefined, `${q.stableId}: explanation must not leak`);
        assert.strictEqual(serialized.gradingRubric, undefined, `${q.stableId}: rubric must not leak`);

        assert.ok(serialized._id);
        assert.strictEqual(serialized.levelNumber, 3);
        assert.strictEqual(serialized.points, 100);
        assert.strictEqual(serialized.type, q.type);
        assert.deepStrictEqual(serialized.options, []);
      }
    });

    test('ensures zero prompts are withheld by safeContent security filters', () => {
      level3Data.questions.forEach((q) => {
        const sanitizedPrompt = safeContent(q.prompt, [q.flag]);
        assert.ok(
          !sanitizedPrompt.includes('withheld'),
          `Prompt for ${q.stableId} triggered safeContent withholding!`
        );
      });
    });
  });

  describe('4. Seed Dataset Pre-Validation Guardrails', () => {
    test('validates full Level 3 dataset with 0 errors', async () => {
      const errors = await validateDataset(level3Data);
      assert.deepStrictEqual(errors, []);
    });

    test('rejects dataset if MCQs are introduced', async () => {
      const invalidDataset = {
        levelNumber: 3,
        title: 'Lost Transmission',
        questions: [
          ...level3Data.questions.slice(0, 69),
          {
            ...level3Data.questions[69],
            stableId: 'HTG-L03-OE70',
            type: 'Multiple Choice',
            options: ['Option A', 'Option B']
          }
        ]
      };

      const errors = await validateDataset(invalidDataset);
      assert.ok(errors.some(e => e.includes('MCQ detected')));
    });

    test('rejects dataset if question count is not exactly 70', async () => {
      const invalidDataset = {
        levelNumber: 3,
        title: 'Lost Transmission',
        questions: level3Data.questions.slice(0, 50)
      };

      const errors = await validateDataset(invalidDataset);
      assert.ok(errors.some(e => e.includes('count mismatch')));
    });
  });
});

