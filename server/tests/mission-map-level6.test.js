/**
 * Automated Test Suite for Level 6 Mission Map Question Bank
 * The Tech Mystery / Hack The Grid
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const level6Data = require('../src/data/mission-map/level6');
const { verifyAnswer } = require('../src/services/scoring.service');
const { participantQuestion, safeContent } = require('../src/utils/participantData');
const { validateDataset } = require('../scripts/seed-mission-map-level');

describe('Level 6 Mission Map: Memory Artifacts', () => {

  describe('1. Dataset Structure & Specification Conformance', () => {
    test('contains exactly 70 questions for Level 6', () => {
      assert.strictEqual(level6Data.levelNumber, 6);
      assert.strictEqual(level6Data.title, 'Memory Artifacts');
      assert.strictEqual(level6Data.difficulty, 'HARD');
      assert.strictEqual(level6Data.questions.length, 70);
    });

    test('strictly enforces open-ended format with zero MCQs', () => {
      level6Data.questions.forEach((q) => {
        assert.notStrictEqual(q.type, 'Multiple Choice', `Question ${q.stableId} must not be Multiple Choice`);
        assert.ok(
          ['Short Text', 'Text Answer', 'Numeric Answer', 'Flag'].includes(q.type),
          `Question ${q.stableId} has invalid open-ended type: ${q.type}`
        );
        assert.deepStrictEqual(q.options, [], `Question ${q.stableId} must have empty options array`);
      });
    });

    test('enforces unique stable identifiers (HTG-L06-OE01 to HTG-L06-OE70)', () => {
      const seenIds = new Set();
      const seenOrders = new Set();

      level6Data.questions.forEach((q, index) => {
        const expectedId = `HTG-L06-OE${String(index + 1).padStart(2, '0')}`;
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
      const orders = level6Data.questions.map(q => q.order).sort((a, b) => a - b);
      assert.strictEqual(orders[0], 1);
      assert.strictEqual(orders[69], 70);
      for (let i = 0; i < 70; i++) {
        assert.strictEqual(orders[i], 1 + i, `Order at index ${i} must be ${1 + i}`);
      }
    });

    test('requires complete technical metadata, rubrics and key points', () => {
      level6Data.questions.forEach((q) => {
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
      level6Data.questions.forEach((q) => {
        const isValid = verifyAnswer(q.flag, q);
        assert.ok(isValid, `${q.stableId}: canonical flag "${q.flag}" failed verification`);
      });
    });

    test('correctly evaluates all configured acceptable alternatives', () => {
      level6Data.questions.forEach((q) => {
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
        'HTG{INCORRECT}',
        '',
        'random_garbage_submission_12345'
      ];

      level6Data.questions.forEach((q) => {
        bogusSubmissions.forEach((bogus) => {
          const isInvalid = !verifyAnswer(bogus, q);
          assert.ok(isInvalid, `${q.stableId}: should reject bogus submission "${bogus}"`);
        });
      });
    });
  });

  describe('3. Participant Data Sanitization & Zero Leakage', () => {
    test('participantQuestion strictly strips flag, unearned hints, and internal metadata', async () => {
      for (const q of level6Data.questions) {
        const mockDoc = { ...q, _id: '507f191e810c19729de860ea' };
        const sanitized = await participantQuestion(mockDoc);

        // Security assurances
        assert.strictEqual(sanitized.flag, undefined, `${q.stableId}: flag leaked to participant!`);
        assert.strictEqual(sanitized.metadata, undefined, `${q.stableId}: metadata leaked to participant!`);
        assert.strictEqual(sanitized.hints, undefined, `${q.stableId}: hints leaked unearned to participant!`);
        assert.deepStrictEqual(sanitized.options, [], `${q.stableId}: options should be empty array`);

        // Functional fields preserved
        assert.strictEqual(sanitized.levelNumber, 6);
        assert.strictEqual(sanitized.points, 100);
        assert.ok(sanitized.title);
        assert.ok(sanitized.prompt);
      }
    });

    test('ensures zero prompts are withheld by safeContent security filters', () => {
      level6Data.questions.forEach((q) => {
        const sanitized = safeContent(q.prompt, [q.flag]);
        assert.ok(
          !sanitized.includes('withheld'),
          `${q.stableId}: prompt was withheld by safeContent security filter! Review prompt for answer leakage.`
        );
      });
    });
  });

  describe('4. Seed Dataset Pre-Validation Guardrails', () => {
    test('validates full Level 6 dataset with 0 errors', async () => {
      const errors = await validateDataset(level6Data);
      assert.deepStrictEqual(errors, [], `Expected 0 validation errors, got: ${errors.join(', ')}`);
    });

    test('rejects dataset if MCQs are introduced', async () => {
      const corruptedData = {
        ...level6Data,
        questions: [
          ...level6Data.questions.slice(0, 69),
          {
            ...level6Data.questions[69],
            type: 'Multiple Choice',
            options: ['Option A', 'Option B']
          }
        ]
      };
      const errors = await validateDataset(corruptedData);
      assert.ok(errors.some(e => e.includes('MCQ detected')));
    });

    test('rejects dataset if question count is not exactly 70', async () => {
      const shortData = {
        ...level6Data,
        questions: level6Data.questions.slice(0, 60)
      };
      const errors = await validateDataset(shortData);
      assert.ok(errors.some(e => e.includes('expected 70')));
    });
  });
});

