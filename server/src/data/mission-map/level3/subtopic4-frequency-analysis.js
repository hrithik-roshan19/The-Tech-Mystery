const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L03-OE31',
    order: 41,
    levelNumber: 3,
    title: 'Primary English Monogram Frequency Leader',
    prompt: `In statistical analysis of standard written English prose (such as military reports, newspapers, and technical manuals), one single character accounts for approximately 12.7% of all occurrences, making it the most frequent letter in the language.

Which single letter possesses this highest statistical frequency in English?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the single letter.`,
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
    flag: 'HTG{E}',
    hints: [
      {
        hintIndex: 1,
        content: "Remember the ETAOIN SHRDLU mnemonic; the first letter is E.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE31',
      seedId: 'HTG-L03-OE31',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "Letter 'E' is the most frequent character in standard English, averaging roughly 12.7% of all characters.",
      essentialKeyPoints: [
        "English unigram frequency distribution.",
        "ETAOIN SHRDLU frequency ordering."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{E}' or 'E'.",
        partialCredit: "Submits lowercase 'e'.",
        noCredit: "Submits T, A, or O."
      },
      acceptableAlternatives: ['HTG{E}', 'E', 'e', 'HTG{e}'],
      safetyNotes: 'Statistical baseline analysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE32',
    order: 42,
    levelNumber: 3,
    title: 'Monoalphabetic Ciphertext Frequency Peak Substitution',
    prompt: `An intercepted 1,000-character monoalphabetic ciphertext was analyzed for character frequencies. The resulting unigram distribution shows:
- Character 'X' occurs 129 times (12.9%)
- Character 'Q' occurs 92 times (9.2%)
- Character 'M' occurs 81 times (8.1%)
- Character 'B' occurs 76 times (7.6%)

Under the hypothesis that the original plaintext was standard English, which English letter does ciphertext character 'X' most likely represent?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the single letter.`,
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
    flag: 'HTG{E}',
    hints: [
      {
        hintIndex: 1,
        content: "The 12.9% frequency peak of 'X' aligns with the English frequency peak: letter E.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE32',
      seedId: 'HTG-L03-OE32',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "Because monoalphabetic substitution preserves unigram frequencies, the most frequent ciphertext letter ('X' at 12.9%) maps to the most frequent English plaintext letter ('E' at ~12.7%).",
      essentialKeyPoints: [
        "Mapping frequency peaks in substitution ciphers.",
        "Hypothesis testing via empirical distributions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{E}' or 'E'.",
        partialCredit: "Submits lowercase 'e'.",
        noCredit: "Submits T or X."
      },
      acceptableAlternatives: ['HTG{E}', 'E', 'e', 'HTG{e}'],
      safetyNotes: 'Frequency peak mapping.'
    }
  },
  {
    stableId: 'HTG-L03-OE33',
    order: 43,
    levelNumber: 3,
    title: 'Primary English Digram Frequency Identification',
    prompt: `In cryptanalysis of classical ciphers, frequency analysis extends beyond single letters (monograms) to consecutive two-letter pairs (digrams).

In standard English text, what specific 2-letter digram occurs with the highest statistical frequency (commonly appearing in words like 'the', 'that', 'with', and 'other')?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the two letters.`,
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
    flag: 'HTG{TH}',
    hints: [
      {
        hintIndex: 1,
        content: "Common digrams include TH, HE, IN, ER, AN. The leader is TH.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE33',
      seedId: 'HTG-L03-OE33',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "'TH' is statistically the most common digram in written English, followed closely by 'HE' and 'IN'.",
      essentialKeyPoints: [
        "Digram frequency distribution in English.",
        "Using digrams to identify cipher polygraphs and transpositions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TH}' or 'TH'.",
        partialCredit: "Submits lowercase 'th'.",
        noCredit: "Submits HE or IN."
      },
      acceptableAlternatives: ['HTG{TH}', 'TH', 'th', 'HTG{th}'],
      safetyNotes: 'Digram analysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE34',
    order: 44,
    levelNumber: 3,
    title: 'Dominant English Trigram Frequency Sequence',
    prompt: `Trigram analysis examines consecutive sequences of three letters to detect preserved language patterns.

What 3-letter sequence constitutes the single most frequently occurring trigram in standard written English?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the three letters.`,
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
    flag: 'HTG{THE}',
    hints: [
      {
        hintIndex: 1,
        content: "The definite article 'the' makes 'THE' the dominant trigram in English.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE34',
      seedId: 'HTG-L03-OE34',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "'THE' is the most common trigram in the English language, accounting for roughly 1.8% of all 3-letter windows in natural text.",
      essentialKeyPoints: [
        "English trigram distribution characteristics.",
        "Locating common trigrams in cryptanalysis."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{THE}' or 'THE'.",
        partialCredit: "Submits lowercase 'the'.",
        noCredit: "Submits AND or ING."
      },
      acceptableAlternatives: ['HTG{THE}', 'THE', 'the', 'HTG{the}'],
      safetyNotes: 'Trigram frequency modeling.'
    }
  },
  {
    stableId: 'HTG-L03-OE35',
    order: 45,
    levelNumber: 3,
    title: 'Index of Coincidence Expected Value for English Plaintext',
    prompt: `The Index of Coincidence (IoC or Kappa) measures the probability that two randomly selected letters from a text are identical:

IC = sum(f_i * (f_i - 1)) / (N * (N - 1))

Because natural English has an uneven letter distribution dominated by letters like E, T, and A, its Index of Coincidence is significantly higher than that of random text.

What is the approximate expected Index of Coincidence value for standard English monograph text (expressed to three decimal places, approximately 0.066 to 0.068)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit as a decimal number).`,
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
        content: "Standard literature quotes 0.067 (or 0.0667, 0.068).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE35',
      seedId: 'HTG-L03-OE35',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "For natural English text, the expected Index of Coincidence is approximately 0.067 (sum of squared unigram probabilities).",
      essentialKeyPoints: [
        "Index of Coincidence mathematical formula.",
        "Expected value for natural English (~0.067)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0.067}' or '0.067'.",
        partialCredit: "Submits '0.066' or '0.068'.",
        noCredit: "Submits 0.038 or 0.5."
      },
      acceptableAlternatives: [
        'HTG{0.067}',
        '0.067',
        'HTG{0.066}',
        '0.066',
        '0.0667',
        '0.068',
        'HTG{0.068}'
      ],
      safetyNotes: 'Index of Coincidence theory.'
    }
  },
  {
    stableId: 'HTG-L03-OE36',
    order: 46,
    levelNumber: 3,
    title: 'Index of Coincidence for Uniformly Random 26-Letter Text',
    prompt: `If a message consists of characters generated uniformly at random across a 26-letter alphabet (where each letter has equal probability p = 1/26), what is the theoretical expected Index of Coincidence (1/26, expressed as a decimal rounded to three decimal places)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit as a decimal number).`,
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
    flag: 'HTG{0.038}',
    hints: [
      {
        hintIndex: 1,
        content: "1 / 26 = 0.03846... Rounded to three decimal places: 0.038.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE36',
      seedId: 'HTG-L03-OE36',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "For a uniform distribution over 26 characters, IC = 1/26 approx 0.038. This baseline represents maximum entropy and complete letter dispersion.",
      essentialKeyPoints: [
        "Uniform distribution IoC baseline (1/26).",
        "Contrasting English IoC (0.067) with random IoC (0.038)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0.038}' or '0.038'.",
        partialCredit: "Submits '0.0385' or '1/26'.",
        noCredit: "Submits 0.067."
      },
      acceptableAlternatives: ['HTG{0.038}', '0.038', '0.0385', '1/26', 'HTG{1/26}'],
      safetyNotes: 'Uniform randomness baseline.'
    }
  },
  {
    stableId: 'HTG-L03-OE37',
    order: 47,
    levelNumber: 3,
    title: 'Cipher Mechanism Discrimination via Index of Coincidence',
    prompt: `An intercepted ciphertext containing 600 characters is evaluated with the Index of Coincidence formula, yielding an observed value of:

IC = 0.066

Given that English plaintext averages ~0.067 while polyalphabetic ciphers with long keys yield values closer to ~0.038, does an IoC of 0.066 indicate that the underlying cipher is monoalphabetic (such as Caesar, substitution, or transposition) or polyalphabetic?

Submit 'monoalphabetic' or 'polyalphabetic'.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
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
    flag: 'HTG{monoalphabetic}',
    hints: [
      {
        hintIndex: 1,
        content: "0.066 is extremely close to the natural English baseline (0.067), indicating a monoalphabetic or transposition cipher.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE37',
      seedId: 'HTG-L03-OE37',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "An Index of Coincidence near 0.067 indicates that letter frequencies have not been flattened across multiple alphabets, diagnosing a monoalphabetic substitution or transposition cipher.",
      essentialKeyPoints: [
        "Using IoC to classify unknown ciphers.",
        "Monoalphabetic signature preservation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{monoalphabetic}' or 'monoalphabetic'.",
        partialCredit: "Submits 'mono-alphabetic'.",
        noCredit: "Submits polyalphabetic."
      },
      acceptableAlternatives: [
        'HTG{monoalphabetic}',
        'monoalphabetic',
        'MONOALPHABETIC',
        'mono-alphabetic',
        'HTG{mono-alphabetic}'
      ],
      safetyNotes: 'Cipher discrimination via IoC.'
    }
  },
  {
    stableId: 'HTG-L03-OE38',
    order: 48,
    levelNumber: 3,
    title: 'Chi-Squared Goodness-of-Fit Test in Shift Cryptanalysis',
    prompt: `When an automated cryptanalysis tool tests candidate Caesar shift keys, it evaluates each candidate shift by comparing the observed ciphertext letter frequencies (O_i) to expected English probabilities (E_i) using the statistical formula:

Stat = sum((O_i - E_i)^2 / E_i)

The candidate shift that produces the lowest score on this test corresponds to the authentic plaintext.

What classical statistical goodness-of-fit test is represented by this formula?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing chi-squared).`,
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
    flag: 'HTG{chi-squared}',
    hints: [
      {
        hintIndex: 1,
        content: "Named after the Greek letter Chi: chi-squared (or chi square).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE38',
      seedId: 'HTG-L03-OE38',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "The Chi-squared goodness-of-fit statistic measures the divergence between observed and expected frequency counts, allowing automated determination of the correct shift.",
      essentialKeyPoints: [
        "Chi-squared formula in automated cryptanalysis.",
        "Automated ranking of candidate decryption shifts."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{chi-squared}' or 'chi-squared'.",
        partialCredit: "Submits 'chi square' or 'chi-square'.",
        noCredit: "Submits ANOVA or t-test."
      },
      acceptableAlternatives: [
        'HTG{chi-squared}',
        'chi-squared',
        'CHI-SQUARED',
        'chi square',
        'chi-square',
        'chi squared',
        'HTG{chi-square}'
      ],
      safetyNotes: 'Chi-squared statistical cryptanalysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE39',
    order: 49,
    levelNumber: 3,
    title: 'Contact Analysis Adjacency Diversity Cryptanalysis Method',
    prompt: `In cryptanalyzing monoalphabetic substitution ciphers where frequency counts alone leave ambiguities, cryptanalysts construct contact tables recording which characters precede and follow each letter.

Because English vowels (A, E, I, O, U) contact a wide variety of different consonants, whereas consonants exhibit more restricted contact patterns, this technique successfully distinguishes vowels from consonants.

What cryptanalytic term denotes this method of analyzing character neighbor adjacency?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing contact analysis).`,
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
    flag: 'HTG{contact analysis}',
    hints: [
      {
        hintIndex: 1,
        content: "Two words: 'contact analysis' (or vowel identification).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE39',
      seedId: 'HTG-L03-OE39',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "Contact analysis tabulates preceding and succeeding character transitions, exploiting vowel-consonant alternation rules to categorize ciphertext symbols.",
      essentialKeyPoints: [
        "Contact analysis mechanics.",
        "Vowel identification through contact diversity."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{contact analysis}' or 'contact analysis'.",
        partialCredit: "Submits 'contact table' or 'adjacency analysis'.",
        noCredit: "Submits n-gram analysis."
      },
      acceptableAlternatives: [
        'HTG{contact analysis}',
        'contact analysis',
        'CONTACT ANALYSIS',
        'contact tables',
        'contact table'
      ],
      safetyNotes: 'Contact analysis theory.'
    }
  },
  {
    stableId: 'HTG-L03-OE40',
    order: 50,
    levelNumber: 3,
    title: 'Second Most Frequent English Monogram Letter',
    prompt: `In English monograph frequency distributions, letter 'E' occupies the first position (~12.7%).

Which letter ranks second in statistical frequency in standard written English, accounting for roughly 9.1% of all characters?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the single letter.`,
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
    flag: 'HTG{T}',
    hints: [
      {
        hintIndex: 1,
        content: "Second letter of ETAOIN: letter T.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE40',
      seedId: 'HTG-L03-OE40',
      subtopic: 'Frequency Analysis & Statistical Cryptanalysis',
      explanation: "Letter 'T' is the second most frequent English letter (~9.1%), prominently appearing as word initials and in digrams like 'TH'.",
      essentialKeyPoints: [
        "Second-rank monograph frequency in English.",
        "Distinguishing E and T in substitution cryptanalysis."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{T}' or 'T'.",
        partialCredit: "Submits lowercase 't'.",
        noCredit: "Submits A, O, or I."
      },
      acceptableAlternatives: ['HTG{T}', 'T', 't', 'HTG{t}'],
      safetyNotes: 'English frequency ordering.'
    }
  }
];

module.exports = subtopic4Questions;

