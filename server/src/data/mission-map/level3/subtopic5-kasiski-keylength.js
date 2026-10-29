const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L03-OE41',
    order: 51,
    levelNumber: 3,
    title: 'Kasiski Examination Core Pattern Recognition Mechanism',
    prompt: `In 1863, Prussian cryptanalyst Friedrich Kasiski published the first general mathematical method to break repeating-key polyalphabetic ciphers.

Kasiski observed that when the same plaintext word happens to occur at positions separated by a multiple of the key length, the encryption key aligns identically, producing what observable feature in the ciphertext?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing repeated n-grams).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{repeated n-grams}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'repeated n-grams', 'repeated sequences', 'repeated patterns', or 'repeated substrings'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE41',
      seedId: 'HTG-L03-OE41',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "Kasiski examination identifies identical repeated sequences of characters (n-grams) in the ciphertext, measuring the distance intervals between their occurrences.",
      essentialKeyPoints: [
        "Kasiski examination foundational observation.",
        "Alignments of repeated plaintext and periodic keys."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{repeated n-grams}' or 'repeated n-grams'.",
        partialCredit: "Submits 'repeated sequences' or 'repeated substrings'.",
        noCredit: "Submits single letter frequencies."
      },
      acceptableAlternatives: [
        'HTG{repeated n-grams}',
        'repeated n-grams',
        'REPEATED N-GRAMS',
        'repeated sequences',
        'repeated patterns',
        'repeated substrings',
        'repeated words'
      ],
      safetyNotes: 'Kasiski examination fundamentals.'
    }
  },
  {
    stableId: 'HTG-L03-OE42',
    order: 52,
    levelNumber: 3,
    title: 'Kasiski Distance Interval Greatest Common Divisor Inference',
    prompt: `A communications analyst intercepts a long polyalphabetic radio transmission.

Inspection reveals that a 3-letter sequence appears at character positions 15, 50, and 99:
- Distance between 1st and 2nd occurrence: 50 - 15 = 35 characters
- Distance between 2nd and 3rd occurrence: 99 - 50 = 49 characters

Assuming these repetitions are caused by identical key alignments, what is the greatest common divisor of these two distance intervals (gcd(35, 49)), indicating the suspected Vigenère key length? Submit the integer.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: '7',
    hints: [
      {
        hintIndex: 1,
        content: "35 = 5 * 7, 49 = 7 * 7. The common factor is 7.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE42',
      seedId: 'HTG-L03-OE42',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "The intervals 35 and 49 share the greatest common divisor gcd(35, 49) = 7. This indicates a high probability that the encryption keyword has length 7.",
      essentialKeyPoints: [
        "Kasiski distance interval GCD calculation.",
        "Inferring polyalphabetic key period."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 7.",
        partialCredit: "Submits 'seven'.",
        noCredit: "Submits 35 or 5."
      },
      acceptableAlternatives: ['7', 'seven', 'HTG{7}'],
      safetyNotes: 'Key length inference mathematics.'
    }
  },
  {
    stableId: 'HTG-L03-OE43',
    order: 53,
    levelNumber: 3,
    title: 'Multi-Interval Kasiski Greatest Common Divisor Key Length',
    prompt: `An intercept shows several repeated 4-letter groups located at intervals of:
- Interval 1: 28 characters
- Interval 2: 42 characters
- Interval 3: 70 characters

What is the greatest common divisor (gcd(28, 42, 70)) representing the primary candidate key length for the cipher? Submit the integer.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: '14',
    hints: [
      {
        hintIndex: 1,
        content: "28 = 2 * 14, 42 = 3 * 14, 70 = 5 * 14. The GCD is 14.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE43',
      seedId: 'HTG-L03-OE43',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "gcd(28, 42, 70) = 14. The key length is likely 14 (or a factor like 7).",
      essentialKeyPoints: [
        "Multi-interval GCD calculation in Kasiski analysis.",
        "Identifying candidate factor periods."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 14.",
        partialCredit: "Submits 'fourteen'.",
        noCredit: "Submits 28 or 7."
      },
      acceptableAlternatives: ['14', 'fourteen', 'HTG{14}'],
      safetyNotes: 'Multi-interval key deduction.'
    }
  },
  {
    stableId: 'HTG-L03-OE44',
    order: 54,
    levelNumber: 3,
    title: 'Friedman Statistical Test for Polyalphabetic Key Length Estimation',
    prompt: `In the 1920s, American cryptanalyst William F. Friedman devised an algebraic formula to estimate the key length 'k' of a polyalphabetic cipher directly from the ciphertext's overall Index of Coincidence without relying on repeated n-grams:

k approx (0.027 * N) / ((N - 1) * IC - 0.038 * N + 0.065)

What is this classical statistical test and formula called?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing Friedman test).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{Friedman test}',
    hints: [
      {
        hintIndex: 1,
        content: "Named after William F. Friedman: Friedman test (or kappa test).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE44',
      seedId: 'HTG-L03-OE44',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "The Friedman test (also known as the Kappa test) uses the Index of Coincidence to approximate the key length of polyalphabetic ciphers.",
      essentialKeyPoints: [
        "Friedman test formula and application.",
        "Key length estimation when ciphertext lacks repeated n-grams."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Friedman test}' or 'Friedman test'.",
        partialCredit: "Submits 'Friedman' or 'kappa test'.",
        noCredit: "Submits Kasiski."
      },
      acceptableAlternatives: [
        'HTG{Friedman test}',
        'Friedman test',
        'FRIEDMAN TEST',
        'Friedman',
        'kappa test',
        'Friedman formula'
      ],
      safetyNotes: 'Statistical key length estimation.'
    }
  },
  {
    stableId: 'HTG-L03-OE45',
    order: 55,
    levelNumber: 3,
    title: 'Ciphertext Coset Slicing Decomposition Type',
    prompt: `Once a Vigenère key length of k = 5 is established, an analyst separates the ciphertext into 5 independent sub-streams (cosets):
- Coset 1: characters at indices 1, 6, 11, 16...
- Coset 2: characters at indices 2, 7, 12, 17...
- Coset 3: characters at indices 3, 8, 13, 18...
- Coset 4: characters at indices 4, 9, 14, 19...
- Coset 5: characters at indices 5, 10, 15, 20...

Because each individual coset was enciphered by a single fixed key character, what classical monoalphabetic cipher governs each coset?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing Caesar cipher).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{Caesar cipher}',
    hints: [
      {
        hintIndex: 1,
        content: "A fixed shift by one letter is a Caesar cipher.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE45',
      seedId: 'HTG-L03-OE45',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "Each coset in a Vigenère cipher is a single Caesar shift cipher. Decomposing the ciphertext into k cosets converts a polyalphabetic attack into k independent monoalphabetic attacks.",
      essentialKeyPoints: [
        "Coset slicing cryptanalysis strategy.",
        "Treating polyalphabetic ciphers as parallel monoalphabetic problems."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Caesar cipher}' or 'Caesar cipher'.",
        partialCredit: "Submits 'Caesar' or 'shift cipher'.",
        noCredit: "Submits transposition or affine."
      },
      acceptableAlternatives: [
        'HTG{Caesar cipher}',
        'Caesar cipher',
        'caesar cipher',
        'Caesar',
        'caesar',
        'shift cipher',
        'monoalphabetic shift'
      ],
      safetyNotes: 'Coset decomposition methodology.'
    }
  },
  {
    stableId: 'HTG-L03-OE46',
    order: 56,
    levelNumber: 3,
    title: 'Kasiski False Positive Coincidence Causality',
    prompt: `In automated Kasiski examination, cryptanalysts typically discard repeated 2-letter bigrams and focus only on trigrams or longer sequences (length >= 3).

Why do short 2-letter sequences frequently produce misleading interval distances that do not divide the actual key length? (They occur by random coincidence or chance).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing random coincidence).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{random coincidence}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'random coincidence', 'chance', 'random chance', or 'accidental repetition'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE46',
      seedId: 'HTG-L03-OE46',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "In an alphabet of 26 letters, there are only 26^2 = 676 possible bigrams. In texts of several hundred characters, many bigrams repeat purely by random chance under different key letters.",
      essentialKeyPoints: [
        "False positive repetitions in Kasiski analysis.",
        "Why trigrams and quadgrams provide statistical reliability."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{random coincidence}' or 'random coincidence'.",
        partialCredit: "Submits 'chance' or 'accidental repetition'.",
        noCredit: "Submits key exhaustion."
      },
      acceptableAlternatives: [
        'HTG{random coincidence}',
        'random coincidence',
        'RANDOM COINCIDENCE',
        'chance',
        'random chance',
        'accidental repetition',
        'coincidence'
      ],
      safetyNotes: 'Statistical noise rejection.'
    }
  },
  {
    stableId: 'HTG-L03-OE47',
    order: 57,
    levelNumber: 3,
    title: 'Kasiski Triple-Interval Greatest Common Divisor Resolution',
    prompt: `An analysis of an intercepted message uncovers three distinct repetitions of a 4-letter sequence at character distances of:
- 36 positions
- 60 positions
- 84 positions

Calculate the greatest common divisor of these intervals (gcd(36, 60, 84)) to find the primary suspected key length. Submit the integer.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: '12',
    hints: [
      {
        hintIndex: 1,
        content: "36 = 3 * 12, 60 = 5 * 12, 84 = 7 * 12. GCD is 12.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE47',
      seedId: 'HTG-L03-OE47',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "gcd(36, 60, 84) = 12. All three distance intervals are multiples of 12.",
      essentialKeyPoints: [
        "Greatest Common Divisor algorithm in Kasiski analysis.",
        "Candidate key length determination."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 12.",
        partialCredit: "Submits 'twelve'.",
        noCredit: "Submits 6 or 36."
      },
      acceptableAlternatives: ['12', 'twelve', 'HTG{12}'],
      safetyNotes: 'Kasiski arithmetic execution.'
    }
  },
  {
    stableId: 'HTG-L03-OE48',
    order: 58,
    levelNumber: 3,
    title: 'Statistical Sample Size Insufficiency Constraint',
    prompt: `An operative captures a brief 12-letter encrypted fragment. When attempting to apply the Kasiski test or Index of Coincidence, the results are completely inconclusive.

What fundamental limitation of statistical cryptanalysis prevents the reliable determination of key length on extremely brief messages? (Insufficient sample size or short text length).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing insufficient sample size).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{insufficient sample size}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'insufficient sample size', 'short ciphertext', 'insufficient text', or 'small sample size'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE48',
      seedId: 'HTG-L03-OE48',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "Statistical laws require adequate sample sizes. In extremely short ciphertexts, random variance overwhelms natural language frequency signatures, making statistical tests invalid.",
      essentialKeyPoints: [
        "Sample size requirements for statistical cryptanalysis.",
        "Limits of Kasiski and IoC on short intercepts."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{insufficient sample size}' or 'insufficient sample size'.",
        partialCredit: "Submits 'short ciphertext' or 'insufficient text'.",
        noCredit: "Submits high entropy or strong cipher."
      },
      acceptableAlternatives: [
        'HTG{insufficient sample size}',
        'insufficient sample size',
        'INSUFFICIENT SAMPLE SIZE',
        'short ciphertext',
        'insufficient text',
        'small sample size',
        'insufficient data'
      ],
      safetyNotes: 'Statistical sample size boundaries.'
    }
  },
  {
    stableId: 'HTG-L03-OE49',
    order: 59,
    levelNumber: 3,
    title: 'Correct Coset Slicing Expected Index of Coincidence',
    prompt: `When an analyst slices a polyalphabetic ciphertext using incorrect trial key lengths (e.g. key length 4 instead of 7), each slice contains a mix of different shifts and yields an IoC near 0.038.

However, when the analyst slices using the true key length (k = 7), each slice becomes a pure monoalphabetic Caesar cipher.

To what approximate theoretical value will the Index of Coincidence of each correct coset slice jump (approaching the English monograph baseline)? Submit the decimal value to three decimal places (~0.067).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit as decimal number).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{0.067}',
    hints: [
      {
        hintIndex: 1,
        content: "Matches the expected English Index of Coincidence: 0.067 (or 0.066).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE49',
      seedId: 'HTG-L03-OE49',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "When partitioned by the true period, each coset contains text shifted by a single letter. Its frequency distribution matches natural English, driving the IoC from 0.038 up to ~0.067.",
      essentialKeyPoints: [
        "IoC behavior across trial key lengths.",
        "Using coset IoC peaks to confirm true key period."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0.067}' or '0.067'.",
        partialCredit: "Submits '0.066' or '0.068'.",
        noCredit: "Submits 0.038."
      },
      acceptableAlternatives: ['HTG{0.067}', '0.067', 'HTG{0.066}', '0.066', '0.0667', '0.068'],
      safetyNotes: 'Coset IoC confirmation.'
    }
  },
  {
    stableId: 'HTG-L03-OE50',
    order: 60,
    levelNumber: 3,
    title: 'Kasiski Repetition Keystream Alignment Causality',
    prompt: `In a Vigenère cipher, what exact alignment condition is required for two identical plaintext words (such as two occurrences of 'THE') to produce identical ciphertext sequences in different parts of the message?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing same key alignment).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{same key alignment}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'same key alignment', 'same key position', 'key alignment', or 'multiple of key length'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE50',
      seedId: 'HTG-L03-OE50',
      subtopic: 'Key-Length Inference & Kasiski Examination',
      explanation: "Identical plaintext words produce identical ciphertext sequences only if they occur at positions aligned with the exact same phase of the repeating keyword (i.e. distance is a multiple of key length).",
      essentialKeyPoints: [
        "Keystream phase alignment requirement.",
        "The mathematical necessity underlying Kasiski examination."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{same key alignment}' or 'same key alignment'.",
        partialCredit: "Submits 'key alignment' or 'same key position'.",
        noCredit: "Submits random chance."
      },
      acceptableAlternatives: [
        'HTG{same key alignment}',
        'same key alignment',
        'SAME KEY ALIGNMENT',
        'key alignment',
        'same key position',
        'multiple of key length',
        'aligned key'
      ],
      safetyNotes: 'Keystream alignment causality.'
    }
  }
];

module.exports = subtopic5Questions;

