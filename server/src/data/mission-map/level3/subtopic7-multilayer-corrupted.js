const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L03-OE61',
    order: 71,
    levelNumber: 3,
    title: 'Multi-Layer Encryption Inverse Sequence Principle',
    prompt: `A communication channel applies layered defenses, first enciphering a message with an inner substitution cipher (Layer 1) and subsequently passing that output through an outer transposition cipher (Layer 2).

In what sequence must the recipient apply the inverse decryption algorithms to successfully recover the plaintext? (Last-In, First-Out: Layer 2 decryption then Layer 1 decryption).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing Layer 2 then Layer 1).`,
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
    flag: 'HTG{Layer 2 then Layer 1}',
    hints: [
      {
        hintIndex: 1,
        content: "Decryption peels away outer layers first: Layer 2 then Layer 1 (or reverse order of encryption).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE61',
      seedId: 'HTG-L03-OE61',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "Layered encryption follows a strict Last-In First-Out (LIFO) stack. The outer layer (Layer 2) must be completely inverted before the inner layer (Layer 1) can be accessed.",
      essentialKeyPoints: [
        "LIFO order of layered decryption.",
        "Composite function inversions: (g o f)^-1 = f^-1 o g^-1."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Layer 2 then Layer 1}' or 'Layer 2 then Layer 1'.",
        partialCredit: "Submits 'reverse order' or 'outer then inner'.",
        noCredit: "Submits Layer 1 then Layer 2."
      },
      acceptableAlternatives: [
        'HTG{Layer 2 then Layer 1}',
        'Layer 2 then Layer 1',
        'layer 2 then layer 1',
        'outer then inner',
        'reverse order',
        'LIFO',
        'HTG{outer then inner}'
      ],
      safetyNotes: 'Layered cryptosystem dynamics.'
    }
  },
  {
    stableId: 'HTG-L03-OE62',
    order: 72,
    levelNumber: 3,
    title: 'Two-Stage Compound Intercept Decryption Execution',
    prompt: `An emergency telemetry burst was encrypted with a two-stage compound cryptosystem:
1. Inner Layer: Caesar shift with key +3
2. Outer Layer: Rail Fence cipher with 2 rails

The intercepted 10-character ciphertext is:

\`\`\`text
JLVFUUGHXH
\`\`\`

To decrypt:
- Step 1: Invert the 2-rail Rail Fence cipher by interleaving the first half ('JLVFU') and second half ('UGHXH') into alternating characters to recover the intermediate text.
- Step 2: Shift each character of the intermediate text backward by 3 positions to recover the original 10-letter message.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit concatenated text).`,
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
    flag: 'HTG{GRIDSECURE}',
    hints: [
      {
        hintIndex: 1,
        content: "Interleaving gives: J-U-L-G-V-H-F-X-U-H. Shift each backward by 3: J-3=G, U-3=R, L-3=I... spells GRIDSECURE.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE62',
      seedId: 'HTG-L03-OE62',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "De-interleaving the 2 rails of 'JLVFUUGHXH' gives 'JULGVHFXUH'. Shifting backward by 3 yields 'GRIDSECURE'.",
      essentialKeyPoints: [
        "Executing multi-stage compound cipher decryption.",
        "Combining transposition inversion with substitution reversal."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GRIDSECURE}' or 'GRIDSECURE'.",
        partialCredit: "Submits lowercase 'gridsecure' or intermediate 'JULGVHFXUH'.",
        noCredit: "Submits unshifted or single-layer text."
      },
      acceptableAlternatives: [
        'HTG{GRIDSECURE}',
        'GRIDSECURE',
        'gridsecure',
        'GRID SECURE',
        'grid secure',
        'HTG{GRID_SECURE}',
        'GRID_SECURE'
      ],
      safetyNotes: 'Compound cipher recovery.'
    }
  },
  {
    stableId: 'HTG-L03-OE63',
    order: 73,
    levelNumber: 3,
    title: 'Transposition Cipher Error Propagation Cascade Effect',
    prompt: `In classical columnar transposition ciphers, the grid dimensions (number of rows and columns) depend strictly on the exact total character count of the message.

If atmospheric interference causes a single character to be dropped from the transmission, what structural failure occurs during matrix reconstruction, corrupting all subsequent character alignments? (Grid desynchronization or alignment cascade).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing desynchronization).`,
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
    flag: 'HTG{desynchronization}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'desynchronization', 'alignment cascade', 'framing error', or 'cascading error'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE63',
      seedId: 'HTG-L03-OE63',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "Dropping a character alters column lengths, causing complete matrix desynchronization where all letters in subsequent columns are shifted into incorrect rows.",
      essentialKeyPoints: [
        "Error propagation in transposition vs substitution.",
        "Sensitivity of columnar structures to missing symbols."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{desynchronization}' or 'desynchronization'.",
        partialCredit: "Submits 'alignment cascade' or 'framing error'.",
        noCredit: "Submits bit flip."
      },
      acceptableAlternatives: [
        'HTG{desynchronization}',
        'desynchronization',
        'DESYNCHRONIZATION',
        'alignment cascade',
        'framing error',
        'cascading error',
        'loss of synchronization'
      ],
      safetyNotes: 'Error propagation analysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE64',
    order: 74,
    levelNumber: 3,
    title: 'Vigenère Error Localization Bounded Impact Count',
    prompt: `Consider a standard Vigenère polyalphabetic cipher (without autokey) operating on individual characters independently.

If channel noise corrupts a single ciphertext character into an incorrect letter during transmission, how many decrypted plaintext characters will be corrupted?

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
    flag: 'HTG{1}',
    hints: [
      {
        hintIndex: 1,
        content: "Because Vigenère encrypts character-by-character without feedback, exactly one character is affected.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE64',
      seedId: 'HTG-L03-OE64',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "In standard Vigenère, each position is decrypted independently: P_i = (C_i - K_i) mod 26. A single corrupted ciphertext character affects exactly 1 plaintext character with zero error propagation.",
      essentialKeyPoints: [
        "Absence of error propagation in basic stream/polyalphabetic ciphers.",
        "Contrast with block ciphers and CBC mode error extension."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1}' or integer 1.",
        partialCredit: "Submits 'one'.",
        noCredit: "Submits 26 or key length."
      },
      acceptableAlternatives: ['HTG{1}', '1', 'one', 'HTG{one}'],
      safetyNotes: 'Error localization metrics.'
    }
  },
  {
    stableId: 'HTG-L03-OE65',
    order: 75,
    levelNumber: 3,
    title: 'Automated Candidate Decryption N-Gram Fitness Scoring',
    prompt: `Automated cryptanalysis algorithms (such as hill-climbing or genetic algorithms) test millions of candidate keys against classical ciphertexts.

To automatically detect when a trial decryption produces authentic English rather than random unreadable gibberish without human review, algorithms compute fitness scores using pre-calculated probability tables of consecutive letters (trigrams or quadgrams).

What technical term denotes this process of rating candidate decryptions using character group frequencies? (N-gram scoring or fitness scoring).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing n-gram scoring).`,
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
    flag: 'HTG{n-gram scoring}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'n-gram scoring', 'fitness scoring', 'quadgram scoring', or 'trigram scoring'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE65',
      seedId: 'HTG-L03-OE65',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "N-gram scoring (particularly quadgram logarithmic probabilities) provides automated objective fitness functions for evaluating trial decryptions in heuristic search cryptanalysis.",
      essentialKeyPoints: [
        "Automated fitness scoring using n-gram statistics.",
        "Objective functions in hill-climbing cryptanalysis."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{n-gram scoring}' or 'n-gram scoring'.",
        partialCredit: "Submits 'fitness scoring' or 'quadgram scoring'.",
        noCredit: "Submits brute force."
      },
      acceptableAlternatives: [
        'HTG{n-gram scoring}',
        'n-gram scoring',
        'N-GRAM SCORING',
        'fitness scoring',
        'quadgram scoring',
        'trigram scoring',
        'n-gram fitness'
      ],
      safetyNotes: 'Automated cryptanalysis fitness functions.'
    }
  },
  {
    stableId: 'HTG-L03-OE66',
    order: 76,
    levelNumber: 3,
    title: 'Short Ciphertext Information Theoretical Ambiguity Count',
    prompt: `Suppose a radio operator intercepts an isolated Caesar ciphertext consisting of exactly one single character: 'A'.

In the English language, there are only two valid standalone single-letter words: 'A' and 'I'.

Under different shift keys (k = 0 yielding 'A', and k = 18 yielding 'I'), both represent legitimate grammatical English words.

How many plausible distinct English plaintexts exist for this one-letter intercept? Submit the integer count.`,
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
    flag: '2',
    hints: [
      {
        hintIndex: 1,
        content: "The words 'A' and 'I' are the only single-letter English words. Count: 2.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE66',
      seedId: 'HTG-L03-OE66',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "With only 1 character, the message is far below the unicity distance. Both 'A' and 'I' are equally valid grammatical plaintexts, giving exactly 2 plausible solutions.",
      essentialKeyPoints: [
        "Ciphertext insufficiency and spurious decryptions.",
        "Why short intercepts cannot be uniquely broken."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 2.",
        partialCredit: "Submits 'two'.",
        noCredit: "Submits 1 or 26."
      },
      acceptableAlternatives: ['2', 'two', 'HTG{2}'],
      safetyNotes: 'Cryptographic ambiguity analysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE67',
    order: 77,
    levelNumber: 3,
    title: 'Shannon Unicity Distance Minimum Ciphertext Metric',
    prompt: `In his foundational 1949 paper 'Communication Theory of Secrecy Systems', Claude Shannon defined a mathematical quantity representing the minimum length of ciphertext required for an adversary with unlimited computing power to theoretically eliminate all spurious candidate keys and determine a unique plaintext:

U = H(K) / D

What two-word cryptographic concept is this fundamental threshold named?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing unicity distance).`,
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
    flag: 'HTG{unicity distance}',
    hints: [
      {
        hintIndex: 1,
        content: "Two words: 'unicity distance' (or unicity point).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE67',
      seedId: 'HTG-L03-OE67',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "The unicity distance is the minimum length of ciphertext needed to guarantee that only one key and plaintext pair are consistent with the natural language redundancy.",
      essentialKeyPoints: [
        "Shannon unicity distance formula: U = H(K)/D.",
        "Theoretical boundary between spurious decryptions and unique solvability."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{unicity distance}' or 'unicity distance'.",
        partialCredit: "Submits 'unicity point' or 'unicity'.",
        noCredit: "Submits entropy or Hamming distance."
      },
      acceptableAlternatives: [
        'HTG{unicity distance}',
        'unicity distance',
        'UNICITY DISTANCE',
        'unicity point',
        'unicity'
      ],
      safetyNotes: 'Information-theoretic security limits.'
    }
  },
  {
    stableId: 'HTG-L03-OE68',
    order: 78,
    levelNumber: 3,
    title: 'Information-Theoretic Perfect Secrecy One-Time Pad',
    prompt: `Shannon proved that for a cipher to achieve perfect secrecy (where the ciphertext reveals zero statistical information about the plaintext: H(M|C) = H(M)), the key must be completely random, as long as the message, used only once, and kept secret.

What classical cipher implementation (invented by Gilbert Vernam and Joseph Mauborgne) is the only proven mathematical system to achieve perfect secrecy?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing One-Time Pad).`,
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
    flag: 'HTG{One-Time Pad}',
    hints: [
      {
        hintIndex: 1,
        content: "Common abbreviation is OTP: One-Time Pad (or Vernam cipher).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE68',
      seedId: 'HTG-L03-OE68',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "The One-Time Pad (OTP) satisfies Shannon's conditions for perfect secrecy because every possible plaintext is equally probable given any ciphertext.",
      essentialKeyPoints: [
        "Shannon perfect secrecy theorem.",
        "One-Time Pad mathematical properties."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{One-Time Pad}' or 'One-Time Pad'.",
        partialCredit: "Submits 'OTP' or 'Vernam cipher'.",
        noCredit: "Submits AES or RSA."
      },
      acceptableAlternatives: [
        'HTG{One-Time Pad}',
        'One-Time Pad',
        'ONE-TIME PAD',
        'one-time pad',
        'one time pad',
        'OTP',
        'Vernam cipher'
      ],
      safetyNotes: 'Perfect secrecy foundations.'
    }
  },
  {
    stableId: 'HTG-L03-OE69',
    order: 79,
    levelNumber: 3,
    title: 'Single-Bit Noise Detection Parity Verification Mechanism',
    prompt: `To protect radio transmissions against channel noise corruption, communication systems append an extra verification bit to each byte so that the total count of '1' bits is always even (or always odd).

What is this fundamental single-bit error detection mechanism called?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing parity bit).`,
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
    flag: 'HTG{parity bit}',
    hints: [
      {
        hintIndex: 1,
        content: "Two words: 'parity bit' (or parity check).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE69',
      seedId: 'HTG-L03-OE69',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "A parity bit (parity check) is a bit added to a string of binary code to ensure that the total number of 1-bits in the string is even or odd, detecting single-bit transmission corruption.",
      essentialKeyPoints: [
        "Parity check error detection.",
        "Mitigating noise corruption in telemetry links."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{parity bit}' or 'parity bit'.",
        partialCredit: "Submits 'parity check' or 'parity'.",
        noCredit: "Submits checksum or CRC."
      },
      acceptableAlternatives: [
        'HTG{parity bit}',
        'parity bit',
        'PARITY BIT',
        'parity check',
        'parity'
      ],
      safetyNotes: 'Transmission noise detection.'
    }
  },
  {
    stableId: 'HTG-L03-OE70',
    order: 80,
    levelNumber: 3,
    title: 'Final Mission Transmission Cryptanalysis Master Token',
    prompt: `Congratulations on completing Level 3: Lost Transmission.

All historical intercepts have been cross-referenced, polyalphabetic layers stripped, and the lost transmission telemetry fully restored.

To register your completion of Level 3 and advance to Level 4, submit the authoritative master mission token:

TRANSMISSION_RESTORED

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
    flag: 'HTG{TRANSMISSION_RESTORED}',
    hints: [
      {
        hintIndex: 1,
        content: "Wrap 'TRANSMISSION_RESTORED' inside the standard flag format.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE70',
      seedId: 'HTG-L03-OE70',
      subtopic: 'Multi-Layer Encryption, Corrupted Transmissions & Ambiguity',
      explanation: "Final verification flag representing successful end-to-end reconstruction of Level 3 cryptographic challenges.",
      essentialKeyPoints: [
        "Level 3 capstone synthesis.",
        "Successful conclusion of classical cryptanalysis mission."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TRANSMISSION_RESTORED}'.",
        partialCredit: "Submits 'TRANSMISSION_RESTORED' or lowercase.",
        noCredit: "Submits incorrect token."
      },
      acceptableAlternatives: [
        'HTG{TRANSMISSION_RESTORED}',
        'TRANSMISSION_RESTORED',
        'transmission_restored',
        'HTG{transmission_restored}',
        'TRANSMISSION RESTORED',
        'transmission restored'
      ],
      safetyNotes: 'Level completion token.'
    }
  }
];

module.exports = subtopic7Questions;
