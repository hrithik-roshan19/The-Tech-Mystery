const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L03-OE51',
    order: 61,
    levelNumber: 3,
    title: 'Known-Plaintext Cryptanalytic Attack Model Classification',
    prompt: `In cryptanalysis, attack models are categorized based on the information available to the adversary.

When an analyst possesses an intercepted ciphertext along with the exact corresponding plaintext for a portion of the message (such as a standard header or known protocol greeting), what attack model classification is this?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing known-plaintext attack).`,
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
    flag: 'HTG{known-plaintext attack}',
    hints: [
      {
        hintIndex: 1,
        content: "Common abbreviation is KPA: known-plaintext attack (or known plaintext).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE51',
      seedId: 'HTG-L03-OE51',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "A Known-Plaintext Attack (KPA) occurs when the cryptanalyst has access to both the plaintext and its corresponding ciphertext, allowing mathematical extraction of the secret key.",
      essentialKeyPoints: [
        "Cryptanalytic threat models (COA, KPA, CPA, CCA).",
        "Vulnerability of classical ciphers under KPA."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{known-plaintext attack}' or 'known-plaintext attack'.",
        partialCredit: "Submits 'known plaintext' or 'KPA'.",
        noCredit: "Submits ciphertext-only or chosen-plaintext."
      },
      acceptableAlternatives: [
        'HTG{known-plaintext attack}',
        'known-plaintext attack',
        'KNOWN-PLAINTEXT ATTACK',
        'known plaintext attack',
        'known plaintext',
        'KPA',
        'HTG{known plaintext}'
      ],
      safetyNotes: 'Attack model classification.'
    }
  },
  {
    stableId: 'HTG-L03-OE52',
    order: 62,
    levelNumber: 3,
    title: 'Vigenère Full Keyword Reconstruction from Known Intercept',
    prompt: `A reconnaissance team intercepts a Vigenère transmission:

\`\`\`text
JIJNRC
\`\`\`

A radio decrypts the intelligence that the 6-letter plaintext message was:

\`\`\`text
SIGNAL
\`\`\`

Using the algebraic relationship K_i = (C_i - P_i + 26) mod 26, recover the 5-letter repeating English keyword (note: the 6th letter wraps back to the 1st key character).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the 5-letter keyword.`,
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
    flag: 'HTG{RADAR}',
    hints: [
      {
        hintIndex: 1,
        content: "J (9) - S (18) + 26 = 17 (R). I (8) - I (8) = 0 (A). J (9) - G (6) = 3 (D). Word: RADAR.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE52',
      seedId: 'HTG-L03-OE52',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "Subtracting P ('SIGNAL') from C ('JIJNRC') modulo 26 yields key stream [17, 0, 3, 0, 17, 17], corresponding to 'RADAR' wrapping around to 'R'. Keyword is 'RADAR'.",
      essentialKeyPoints: [
        "Vigenère key subtraction: K = (C - P) mod 26.",
        "Keyword extraction under known-plaintext."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RADAR}' or 'RADAR'.",
        partialCredit: "Submits lowercase 'radar'.",
        noCredit: "Submits incorrect key."
      },
      acceptableAlternatives: ['HTG{RADAR}', 'RADAR', 'radar', 'HTG{radar}'],
      safetyNotes: 'Vigenère key recovery.'
    }
  },
  {
    stableId: 'HTG-L03-OE53',
    order: 63,
    levelNumber: 3,
    title: 'Crib Dragging Practical Cryptanalytic Technique',
    prompt: `When attacking polyalphabetic or stream ciphers where an analyst suspects a specific word or phrase exists somewhere inside the encrypted text (such as 'BEACON' or 'TRANSMIT'), the analyst shifts the candidate word through every possible character offset, evaluating the resulting key stream at each position for grammatical validity.

What classical cryptanalytic technique is named after dragging a suspected plaintext fragment across ciphertext?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing crib dragging).`,
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
    flag: 'HTG{crib dragging}',
    hints: [
      {
        hintIndex: 1,
        content: "Two words: 'crib dragging'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE53',
      seedId: 'HTG-L03-OE53',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "Crib dragging is the technique of testing a known or suspected plaintext word (a 'crib') at each sequential position across ciphertext to find sensible keys or plaintexts.",
      essentialKeyPoints: [
        "Crib dragging methodology.",
        "Breaking ciphers with probable words."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{crib dragging}' or 'crib dragging'.",
        partialCredit: "Submits 'crib' or 'dragging'.",
        noCredit: "Submits brute force."
      },
      acceptableAlternatives: [
        'HTG{crib dragging}',
        'crib dragging',
        'CRIB DRAGGING',
        'crib-dragging',
        'crib drag'
      ],
      safetyNotes: 'Crib dragging analysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE54',
    order: 64,
    levelNumber: 3,
    title: 'Probable Word Cryptanalytic Terminology (Crib)',
    prompt: `In cryptanalysis (famously used by Alan Turing and British codebreakers at Bletchley Park when attacking Enigma and Lorenz transmissions), what historical single-syllable slang term denotes a known or suspected piece of plaintext used as a lever to break an encrypted message?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the word.`,
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
    flag: 'HTG{crib}',
    hints: [
      {
        hintIndex: 1,
        content: "A four-letter word: C-R-I-B.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE54',
      seedId: 'HTG-L03-OE54',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "A 'crib' is historical cryptanalytic terminology for known or suspected plaintext that corresponds to a specific segment of ciphertext.",
      essentialKeyPoints: [
        "Definition of a crib in historical cryptanalysis.",
        "Role of stereotyped language in cryptanalytic breakthroughs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{crib}' or 'crib'.",
        partialCredit: "Submits uppercase 'CRIB'.",
        noCredit: "Submits key or hash."
      },
      acceptableAlternatives: ['HTG{crib}', 'crib', 'CRIB', 'a crib', 'HTG{CRIB}'],
      safetyNotes: 'Crib terminology.'
    }
  },
  {
    stableId: 'HTG-L03-OE55',
    order: 65,
    levelNumber: 3,
    title: 'Columnar Transposition Permutation Key Recovery from Known Header',
    prompt: `A military transmission starts with the standardized 6-letter header word 'REPORT'.

The message is known to be enciphered with a 6-column keyed transposition. Because the header occupies the first row of all 6 columns:
- Column containing 'R' must be Row 0, Col 0 (or Col 4)
- Column containing 'E' must be Row 0, Col 1
- Column containing 'P' must be Row 0, Col 2
- Column containing 'O' must be Row 0, Col 3
- Column containing 'T' must be Row 0, Col 5

What specific property of the cipher key is immediately revealed by inspecting the first character of each received column block? (The column permutation or column order).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing column permutation).`,
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
    flag: 'HTG{column permutation}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'column permutation', 'column order', 'permutation', or 'column sequence'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE55',
      seedId: 'HTG-L03-OE55',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "In columnar transposition, a known first row directly maps each transmitted column to its original horizontal position, completely recovering the column permutation.",
      essentialKeyPoints: [
        "Transposition key recovery from known headers.",
        "Why known headers collapse columnar security."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{column permutation}' or 'column permutation'.",
        partialCredit: "Submits 'column order' or 'permutation'.",
        noCredit: "Submits substitution key."
      },
      acceptableAlternatives: [
        'HTG{column permutation}',
        'column permutation',
        'COLUMN PERMUTATION',
        'column order',
        'permutation',
        'column sequence'
      ],
      safetyNotes: 'Transposition permutation recovery.'
    }
  },
  {
    stableId: 'HTG-L03-OE56',
    order: 66,
    levelNumber: 3,
    title: 'Chosen-Plaintext Attack Distinctive Capability',
    prompt: `In the taxonomy of cryptographic attacks:
- Ciphertext-Only Attack (COA): analyst has ciphertext only.
- Known-Plaintext Attack (KPA): analyst passively observes paired plaintext and ciphertext.
- Chosen-Plaintext Attack (CPA): analyst has an active advantage.

What active capability distinguishes Chosen-Plaintext Attack from Known-Plaintext Attack? (The ability to choose or submit arbitrary plaintext to be encrypted).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing choose plaintext).`,
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
    flag: 'HTG{choose plaintext}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'choose plaintext', 'select plaintext', 'chosen plaintext', or 'submit plaintext'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE56',
      seedId: 'HTG-L03-OE56',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "In a Chosen-Plaintext Attack, the adversary can choose arbitrary messages and obtain their corresponding ciphertexts, allowing targeted probing of the algorithm.",
      essentialKeyPoints: [
        "Chosen-Plaintext Attack definition.",
        "Active vs passive adversary capabilities."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{choose plaintext}' or 'choose plaintext'.",
        partialCredit: "Submits 'chosen plaintext' or 'select plaintext'.",
        noCredit: "Submits choose ciphertext."
      },
      acceptableAlternatives: [
        'HTG{choose plaintext}',
        'choose plaintext',
        'CHOOSE PLAINTEXT',
        'chosen plaintext',
        'select plaintext',
        'submit plaintext',
        'arbitrary plaintext'
      ],
      safetyNotes: 'Attack capability comparison.'
    }
  },
  {
    stableId: 'HTG-L03-OE57',
    order: 67,
    levelNumber: 3,
    title: 'Cyclic Keyword Reconstruction from Partial Crib',
    prompt: `An operative performs crib dragging against an intercepted Vigenère transmission, revealing the partial keyword sequence:

\`\`\`text
VECT...
\`\`\`

The key length has already been proven to be exactly 6 characters, and the keyword is known to be a common 6-letter English technical term in mathematics and physics beginning with 'VECT'.

What is the complete 6-letter keyword?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the keyword.`,
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
    flag: 'HTG{VECTOR}',
    hints: [
      {
        hintIndex: 1,
        content: "Completes 'VECT': VECTOR.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE57',
      seedId: 'HTG-L03-OE57',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "Completing the partial key 'VECT' into a standard 6-letter English technical term gives 'VECTOR'.",
      essentialKeyPoints: [
        "Lexical keyword completion from cribs.",
        "Using language dictionaries in key recovery."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{VECTOR}' or 'VECTOR'.",
        partialCredit: "Submits lowercase 'vector'.",
        noCredit: "Submits incomplete fragment."
      },
      acceptableAlternatives: ['HTG{VECTOR}', 'VECTOR', 'vector', 'HTG{vector}'],
      safetyNotes: 'Lexical key reconstruction.'
    }
  },
  {
    stableId: 'HTG-L03-OE58',
    order: 68,
    levelNumber: 3,
    title: 'Affine Cipher Minimum Known-Plaintext Character Pairs Count',
    prompt: `The Affine cipher encryption equation is C = (a * P + b) mod 26, which contains two unknown secret key parameters: the multiplier 'a' and the shift 'b'.

Each known plaintext-ciphertext letter pair (P_i, C_i) creates one linear congruence in the two unknown variables 'a' and 'b'.

What is the minimum number of distinct known plaintext-ciphertext character pairs required to set up a solvable system of linear congruences and uniquely recover both keys (a, b)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the integer (or submit the integer).`,
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
    flag: 'HTG{2}',
    hints: [
      {
        hintIndex: 1,
        content: "A system of linear equations in 2 variables requires 2 distinct equations.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE58',
      seedId: 'HTG-L03-OE58',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "Because there are two independent parameters (a and b), exactly 2 known character pairs provide the system of 2 linear congruences needed to uniquely solve for both keys.",
      essentialKeyPoints: [
        "Linear systems modulo 26.",
        "Affine cipher total collapse under 2 known characters."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2}' or integer 2.",
        partialCredit: "Submits 'two'.",
        noCredit: "Submits 1 or 26."
      },
      acceptableAlternatives: ['HTG{2}', '2', 'two', 'HTG{two}'],
      safetyNotes: 'Linear cryptanalysis of affine ciphers.'
    }
  },
  {
    stableId: 'HTG-L03-OE59',
    order: 69,
    levelNumber: 3,
    title: 'XOR Stream Cipher Keystream Inversion Operation',
    prompt: `In an additive binary stream cipher, each ciphertext byte C is calculated from plaintext byte P and secret keystream byte K using the exclusive-OR bitwise operation:

C = P XOR K

If an attacker learns the plaintext P corresponding to an intercepted ciphertext C, what exact bitwise operation between P and C computes the secret keystream byte K? (P XOR C).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing P XOR C).`,
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
    flag: 'HTG{P XOR C}',
    hints: [
      {
        hintIndex: 1,
        content: "Because XOR is self-inverse: K = P XOR C.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE59',
      seedId: 'HTG-L03-OE59',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "Because XOR is an involutory operation (A XOR B XOR B = A), K = P XOR C. Knowing P immediately reveals K.",
      essentialKeyPoints: [
        "Self-inverse property of bitwise XOR.",
        "Keystream exposure under known-plaintext."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{P XOR C}' or 'P XOR C'.",
        partialCredit: "Submits 'XOR' or 'C XOR P'.",
        noCredit: "Submits AND or OR."
      },
      acceptableAlternatives: [
        'HTG{P XOR C}',
        'P XOR C',
        'p xor c',
        'C XOR P',
        'c xor p',
        'XOR',
        'xor',
        'P ^ C'
      ],
      safetyNotes: 'XOR stream cipher vulnerability.'
    }
  },
  {
    stableId: 'HTG-L03-OE60',
    order: 70,
    levelNumber: 3,
    title: 'Standardized Protocol Header Information Exposure Vulnerability',
    prompt: `Communications protocols frequently enforce rigid formatting, requiring every message to begin with a fixed string such as 'HELO', 'HTTP/1.1', or 'TRANSMISSION_START:'.

In classical cryptography, what cryptanalytic risk is created when an encryption system transmits rigid, predictable message headers? (It provides a known crib or known plaintext).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing known crib).`,
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
    flag: 'HTG{known crib}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'known crib', 'known plaintext', 'crib', or 'predictable plaintext'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE60',
      seedId: 'HTG-L03-OE60',
      subtopic: 'Known-Plaintext Cryptanalysis & Key Recovery',
      explanation: "Predictable headers provide adversaries with guaranteed known-plaintext (cribs) at fixed offsets, completely bypassing the difficulty of ciphertext-only cryptanalysis.",
      essentialKeyPoints: [
        "Vulnerabilities arising from predictable message structures.",
        "Why modern protocols use randomized initialization vectors."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{known crib}' or 'known crib'.",
        partialCredit: "Submits 'known plaintext' or 'predictable plaintext'.",
        noCredit: "Submits key reuse."
      },
      acceptableAlternatives: [
        'HTG{known crib}',
        'known crib',
        'KNOWN CRIB',
        'known plaintext',
        'crib',
        'predictable plaintext'
      ],
      safetyNotes: 'Protocol header design risks.'
    }
  }
];

module.exports = subtopic6Questions;
