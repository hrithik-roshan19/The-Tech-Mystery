const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L03-OE01',
    order: 11,
    levelNumber: 3,
    title: 'Caesar Cipher Fixed Shift Decryption',
    prompt: `An emergency radio intercept captured the following enciphered telemetry signal:

\`\`\`text
OLSSV NYPK
\`\`\`

Historical mission logs indicate that standard beacon transmissions use a Caesar monoalphabetic shift cipher with an encryption key of +7 (where each plaintext letter is shifted 7 positions forward in the 26-letter Latin alphabet).

Reverse the shift by 7 positions to recover the original two-word plaintext message.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit as two words / concatenated text).`,
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
    flag: 'HTG{HELLOGRID}',
    hints: [
      {
        hintIndex: 1,
        content: "Shift each character backward by 7: O (14) - 7 = H (7), L (11) - 7 = E (4).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE01',
      seedId: 'HTG-L03-OE01',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "A Caesar shift of +7 is inverted by subtracting 7 modulo 26. 'OLSSV NYPK' decodes directly to 'HELLO GRID'.",
      essentialKeyPoints: [
        "Caesar cipher modular arithmetic: P = (C - k) mod 26.",
        "Deterministic monoalphabetic reversal."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{HELLOGRID}' or 'HELLO GRID'.",
        partialCredit: "Submits lowercase 'hellogrid'.",
        noCredit: "Submits incorrect shift or unshifted ciphertext."
      },
      acceptableAlternatives: [
        'HTG{HELLOGRID}',
        'HELLOGRID',
        'HELLO GRID',
        'hello grid',
        'hellogrid',
        'HTG{HELLO_GRID}',
        'HELLO_GRID',
        'hello_grid'
      ],
      safetyNotes: 'Classical cryptography education.'
    }
  },
  {
    stableId: 'HTG-L03-OE02',
    order: 12,
    levelNumber: 3,
    title: 'Caesar Shift Exhaustive Search Keyspace Cardinality',
    prompt: `A communications analyst considers performing an exhaustive brute-force search against an intercepted monoalphabetic Caesar shift cipher over the standard 26-letter Latin alphabet (A-Z).

Shifts of k = 0 (and its equivalent k = 26) produce the identity transformation without changing any letters.

How many non-trivial unique encryption keys exist in the Caesar cipher keyspace? Submit the integer count.`,
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
    flag: '25',
    hints: [
      {
        hintIndex: 1,
        content: "The total alphabet size is 26. Excluding the identity shift (0), how many shift offsets remain?",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE02',
      seedId: 'HTG-L03-OE02',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "The modulo 26 group has 26 possible elements (0 through 25). Shift 0 is the identity mapping, leaving exactly 25 non-trivial shifts.",
      essentialKeyPoints: [
        "Caesar cipher keyspace definition (Z_26).",
        "Vulnerability of tiny keyspaces to brute force search."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 25.",
        partialCredit: "Submits 'twenty-five'.",
        noCredit: "Submits 26 or 24."
      },
      acceptableAlternatives: ['25', 'twenty-five', 'twenty five', 'HTG{25}'],
      safetyNotes: 'Keyspace calculation analysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE03',
    order: 13,
    levelNumber: 3,
    title: 'ROT13 Mathematical Involutory Self-Inverse Property',
    prompt: `ROT13 is a specialized Caesar shift with an offset of k = 13.

Because the Latin alphabet contains 26 characters and 13 + 13 = 26 = 0 (mod 26), applying the ROT13 algorithm a second time to any ciphertext immediately restores the original plaintext:

E(E(M)) = M

In mathematics and cryptography, what single technical term denotes any function or mapping that is its own inverse?

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
    flag: 'HTG{involution}',
    hints: [
      {
        hintIndex: 1,
        content: "Starts with 'invol-'; an involutory function is an involution.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE03',
      seedId: 'HTG-L03-OE03',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "An involution (or involutory function) is a mathematical function that is its own inverse (f(f(x)) = x). ROT13 is a quintessential involutory cipher.",
      essentialKeyPoints: [
        "Definition of an involution in cryptography.",
        "Symmetric encryption/decryption routines in self-inverse mappings."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{involution}' or 'involution'.",
        partialCredit: "Submits 'involutory' or 'involutive'.",
        noCredit: "Submits symmetric or bijective."
      },
      acceptableAlternatives: [
        'HTG{involution}',
        'involution',
        'INVOLUTION',
        'involutory',
        'involutive',
        'HTG{involutory}'
      ],
      safetyNotes: 'Mathematical properties of ciphers.'
    }
  },
  {
    stableId: 'HTG-L03-OE04',
    order: 14,
    levelNumber: 3,
    title: 'Affine Cipher Coprime Multiplicative Keys Count',
    prompt: `The Affine cipher encrypts each plaintext character using the linear congruence:

C = (a * P + b) mod 26

For a unique decryption transformation to exist across all 26 letters, the multiplier key 'a' must be coprime to the modulus 26 (that is, gcd(a, 26) = 1).

How many integers in the range 1 through 25 are coprime to 26? Submit the integer count.`,
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
        content: "Calculate Euler's totient phi(26) = 26 * (1 - 1/2) * (1 - 1/13).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE04',
      seedId: 'HTG-L03-OE04',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "By Euler's totient function, phi(26) = 26 * (1/2) * (12/13) = 12. The valid values are {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}.",
      essentialKeyPoints: [
        "Coprimality requirement for modular inversions.",
        "Euler's totient function phi(n)."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 12.",
        partialCredit: "Submits 'twelve'.",
        noCredit: "Submits 26 or 13."
      },
      acceptableAlternatives: ['12', 'twelve', 'HTG{12}'],
      safetyNotes: 'Affine cipher modular arithmetic.'
    }
  },
  {
    stableId: 'HTG-L03-OE05',
    order: 15,
    levelNumber: 3,
    title: 'Modular Multiplicative Inverse Modulo 26 Calculation',
    prompt: `In an Affine cryptosystem operating over the 26-letter alphabet, a transmission was encrypted using multiplier key a = 7.

To decrypt the message, the cryptanalyst must determine the modular multiplicative inverse of 7 modulo 26 (denoted a^-1), which satisfies the congruence:

(7 * a^-1) = 1 (mod 26)

What integer value in the range 1 through 25 is the modular multiplicative inverse of 7 modulo 26? Submit the integer.`,
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
    flag: '15',
    hints: [
      {
        hintIndex: 1,
        content: "Test multiples of 26 plus 1: 27, 53, 79, 105... 105 / 7 = 15.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE05',
      seedId: 'HTG-L03-OE05',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "7 * 15 = 105. 105 = 4 * 26 + 1. Therefore, 105 mod 26 = 1, making 15 the modular inverse of 7 modulo 26.",
      essentialKeyPoints: [
        "Extended Euclidean Algorithm for modular inverses.",
        "Affine cipher decryption parameter derivation."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 15.",
        partialCredit: "Submits 'fifteen'.",
        noCredit: "Submits 7 or 11."
      },
      acceptableAlternatives: ['15', 'fifteen', 'HTG{15}'],
      safetyNotes: 'Modular inverse derivation.'
    }
  },
  {
    stableId: 'HTG-L03-OE06',
    order: 16,
    levelNumber: 3,
    title: 'Affine Cipher Known-Key Decryption',
    prompt: `An intercept post received an Affine ciphertext:

\`\`\`text
IRFLVS
\`\`\`

The encryption parameters are confirmed as:
- Multiplier key: a = 3
- Additive shift: b = 5
- Decryption formula: P = a^-1 * (C - b) mod 26
- Modular inverse: 3^-1 mod 26 = 9

Decrypt the 6-letter ciphertext to reveal the original transmission target word.

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
    flag: 'HTG{BEACON}',
    hints: [
      {
        hintIndex: 1,
        content: "For I (8): 9 * (8 - 5) = 27 = 1 (mod 26) -> B. For R (17): 9 * (17 - 5) = 108 = 4 (mod 26) -> E.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE06',
      seedId: 'HTG-L03-OE06',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "Evaluating P = 9 * (C - 5) mod 26 for 'IRFLVS' yields indices [1, 4, 0, 2, 14, 13], which spells 'BEACON'.",
      essentialKeyPoints: [
        "Step-by-step Affine decryption.",
        "Modular reduction of negative or large values."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{BEACON}' or 'BEACON'.",
        partialCredit: "Submits lowercase 'beacon'.",
        noCredit: "Submits unshifted or Caesar-decrypted text."
      },
      acceptableAlternatives: ['HTG{BEACON}', 'BEACON', 'beacon', 'HTG{beacon}'],
      safetyNotes: 'Affine cipher decryption execution.'
    }
  },
  {
    stableId: 'HTG-L03-OE07',
    order: 17,
    levelNumber: 3,
    title: 'Atbash Classical Reciprocal Cipher Reversal',
    prompt: `A legacy tracking node transmits navigation waypoints encoded with the classical Atbash monoalphabetic cipher. In Atbash, the alphabet is paired symmetrically from opposite ends:
A <-> Z, B <-> Y, C <-> X, D <-> W, and so forth.

The received intercept is:

\`\`\`text
GIZQVXGLIB
\`\`\`

Reverse the reciprocal mapping to decode the 10-letter navigational directive.

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
    flag: 'HTG{TRAJECTORY}',
    hints: [
      {
        hintIndex: 1,
        content: "G maps to T (7th from start <-> 7th from end), I maps to R, Z maps to A.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE07',
      seedId: 'HTG-L03-OE07',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "Applying Atbash reflection (char = 25 - index) to 'GIZQVXGLIB' produces 'TRAJECTORY'.",
      essentialKeyPoints: [
        "Atbash reciprocal substitution mechanics.",
        "Monoalphabetic inversion without keys."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TRAJECTORY}' or 'TRAJECTORY'.",
        partialCredit: "Submits lowercase 'trajectory'.",
        noCredit: "Submits Caesar shifted text."
      },
      acceptableAlternatives: ['HTG{TRAJECTORY}', 'TRAJECTORY', 'trajectory', 'HTG{trajectory}'],
      safetyNotes: 'Atbash cipher decoding.'
    }
  },
  {
    stableId: 'HTG-L03-OE08',
    order: 18,
    levelNumber: 3,
    title: 'Monoalphabetic Substitution Vulnerability: Frequency Preservation',
    prompt: `Simple monoalphabetic substitution ciphers (including Caesar, Atbash, and arbitrary 26-letter substitution alphabets) replace each plaintext character with a single fixed ciphertext counterpart.

What statistical distribution characteristic of the natural language plaintext is strictly preserved in the resulting ciphertext, making all monoalphabetic ciphers trivial to break with sufficient text?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing letter frequency).`,
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
    flag: 'HTG{letter frequency}',
    hints: [
      {
        hintIndex: 1,
        content: "Two words: 'letter frequency' or 'frequency distribution'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE08',
      seedId: 'HTG-L03-OE08',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "Monoalphabetic ciphers preserve the unigram frequency distribution of the underlying language. The most frequent ciphertext symbol maps directly to the most frequent plaintext character.",
      essentialKeyPoints: [
        "Unigram frequency invariance in monoalphabetic ciphers.",
        "Foundations of classical cryptanalysis."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{letter frequency}' or 'letter frequency'.",
        partialCredit: "Submits 'frequency distribution' or 'character frequency'.",
        noCredit: "Submits entropy or key length."
      },
      acceptableAlternatives: [
        'HTG{letter frequency}',
        'letter frequency',
        'frequency distribution',
        'character frequency',
        'unigram frequency',
        'letter frequencies',
        'HTG{frequency distribution}'
      ],
      safetyNotes: 'Statistical cryptanalysis theory.'
    }
  },
  {
    stableId: 'HTG-L03-OE09',
    order: 19,
    levelNumber: 3,
    title: 'Shift Offset Derivation from Known Character Mapping',
    prompt: `In an intercepted transmission confirmed to use a Caesar shift cipher (C = P + k mod 26), known protocol formatting reveals that the plaintext character 'E' (alphabet index 4) was enciphered into the ciphertext character 'R' (alphabet index 17).

What integer shift key k was applied during encryption? Submit the integer.`,
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
    flag: '13',
    hints: [
      {
        hintIndex: 1,
        content: "Subtract the plaintext index from the ciphertext index: 17 - 4 = 13.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE09',
      seedId: 'HTG-L03-OE09',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "k = (C - P) mod 26 = (17 - 4) mod 26 = 13. A single known plaintext-ciphertext character pair completely breaks any Caesar cipher.",
      essentialKeyPoints: [
        "Known-character key recovery in shift ciphers.",
        "Single degree of freedom in Caesar cipher."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 13.",
        partialCredit: "Submits 'thirteen'.",
        noCredit: "Submits 17 or 4."
      },
      acceptableAlternatives: ['13', 'thirteen', 'HTG{13}'],
      safetyNotes: 'Known character cryptanalysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE10',
    order: 20,
    levelNumber: 3,
    title: 'Caesar Brute Force Candidate Elimination',
    prompt: `A 5-letter distress beacon was intercepted:

\`\`\`text
UWTGJ
\`\`\`

A shift of 5 positions backward (k = 5) deciphers this intercept into an authentic English reconnaissance term.

Decrypt the ciphertext by shifting each character backward by 5 positions.

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
    flag: 'HTG{PROBE}',
    hints: [
      {
        hintIndex: 1,
        content: "U (20) - 5 = P (15), W (22) - 5 = R (17), T (19) - 5 = O (14).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE10',
      seedId: 'HTG-L03-OE10',
      subtopic: 'Classical Substitution, Caesar & Affine Transformations',
      explanation: "Shifting 'UWTGJ' backward by 5 positions: U->P, W->R, T->O, G->B, J->E yields 'PROBE'.",
      essentialKeyPoints: [
        "Caesar shift brute force candidate evaluation.",
        "Distinguishing English plaintext from noise."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PROBE}' or 'PROBE'.",
        partialCredit: "Submits lowercase 'probe'.",
        noCredit: "Submits incorrect shift."
      },
      acceptableAlternatives: ['HTG{PROBE}', 'PROBE', 'probe', 'HTG{probe}'],
      safetyNotes: 'Candidate elimination analysis.'
    }
  }
];

module.exports = subtopic1Questions;

