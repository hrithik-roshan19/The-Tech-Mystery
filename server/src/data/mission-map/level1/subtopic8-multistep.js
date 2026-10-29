const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic8Questions = [
  {
    stableId: 'HTG-L01-OE66',
    order: 76,
    levelNumber: 1,
    title: 'Two-Stage Binary to Hex to ASCII Reconstruction',
    prompt: `Follow the documented two-stage reconstruction pipeline:

Stage 1: A logic analyzer recorded binary nibble pairs:
\`0100 1000\`
\`0101 0100\`
\`0100 0111\`
\`0111 1011\`
\`0110 0011\`
\`0110 1000\`
\`0110 0001\`
\`0110 1001\`
\`0110 1110\`
\`0111 1101\`

Combine each pair into a two-digit hexadecimal byte (e.g. 0100 1000 -> 0x48).
Stage 2: Decode the sequence of hexadecimal bytes into standard ASCII characters to obtain the complete flag.

Submit the recovered flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.MULTI_STAGE,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{chain}',
    hints: [
      {
        hintIndex: 1,
        content: "0100 1000 = 48 ('H'), 0101 0100 = 54 ('T'), 0100 0111 = 47 ('G'), 0111 1011 = 7b ('{').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE66',
      seedId: 'HTG-L01-OE66',
      subtopic: 'Following Multi-Step Clues & Documenting a Solution',
      explanation: "Converting nibbles to hex: 48 54 47 7b 63 68 61 69 6e 7d. Converting hex to ASCII: 'HTG{chain}'.",
      essentialKeyPoints: [
        "Nibble recombination into byte values.",
        "Hex-to-ASCII multi-step decoding."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{chain}'.",
        partialCredit: "Submits 'chain' or intermediate hex string.",
        noCredit: "Incorrect character sequence."
      },
      acceptableAlternatives: ['HTG{chain}', 'htg{chain}'],
      safetyNotes: 'Multi-stage data extraction drill.'
    }
  },
  {
    stableId: 'HTG-L01-OE67',
    order: 77,
    levelNumber: 1,
    title: 'Discovered Key Hex XOR Decryption Chain',
    prompt: `Follow the two-step cryptanalysis chain:

Clue 1: A developer's source comment states: "The single-byte XOR key is the ASCII byte value of uppercase letter 'X'".
Clue 2: An encrypted transmission log contains the ciphertext bytes in hexadecimal:
\`10 0C 1F 23 33 3D 21 25\`

Step 1: Determine the hexadecimal ASCII byte value of letter 'X' (hint: 'X' is decimal 88 = 0x58).
Step 2: Bitwise XOR each ciphertext byte with this key to decrypt the complete flag.

Submit the recovered flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{key}',
    hints: [
      {
        hintIndex: 1,
        content: "'X' is 0x58. 0x10 ^ 0x58 = 0x48 ('H'), 0x0C ^ 0x58 = 0x54 ('T'), 0x1F ^ 0x58 = 0x47 ('G').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE67',
      seedId: 'HTG-L01-OE67',
      subtopic: 'Following Multi-Step Clues & Documenting a Solution',
      explanation: "Key: 'X' = 0x58. XORing bytes: 0x10^0x58=0x48 ('H'), 0x0C^0x58=0x54 ('T'), 0x1F^0x58=0x47 ('G'), 0x23^0x58=0x7B ('{'), 0x33^0x58=0x6B ('k'), 0x3D^0x58=0x65 ('e'), 0x21^0x58=0x79 ('y'), 0x25^0x58=0x7D ('}'). Flag: 'HTG{key}'.",
      essentialKeyPoints: [
        "Recovering key from textual clue.",
        "Applying XOR decryption across array."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{key}'.",
        partialCredit: "Submits 'key'.",
        noCredit: "Incorrect key derivation or math."
      },
      acceptableAlternatives: ['HTG{key}', 'htg{key}'],
      safetyNotes: 'Multi-step symmetric decryption.'
    }
  },
  {
    stableId: 'HTG-L01-OE68',
    order: 78,
    levelNumber: 1,
    title: 'Two-Layer Base64 and Caesar Shift Pipeline',
    prompt: `An obfuscated transmission undergoes a two-step decryption process:

Encoded Payload: \`SVVIe3Rpamd1fQ==\`

Step 1: Decode the Base64 string to obtain an intermediate ciphertext string.
Step 2: The intermediate text was encrypted using a Caesar shift of +1 ('char + 1'). Shift each letter backward by 1 position (ROT-1 / 'char - 1') while preserving braces '{' and '}'.

Submit the final recovered flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.MULTI_STAGE,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{shift}',
    hints: [
      {
        hintIndex: 1,
        content: "Base64 decodes to 'IUH{tijgu}'. Then shift each letter back by 1: I-1=H, U-1=T, H-1=G...",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE68',
      seedId: 'HTG-L01-OE68',
      subtopic: 'Following Multi-Step Clues & Documenting a Solution',
      explanation: "Step 1: Base64 decode 'SVVIe3Rpamd1fQ==' yields 'IUH{tijgu}'. Step 2: Shifting each letter backward by 1: I->H, U->T, H->G, t->s, i->h, j->i, g->f, u->t. Result: 'HTG{shift}'.",
      essentialKeyPoints: [
        "Pipelined decoding: Base64 unwrap followed by Caesar rotation.",
        "Delimiter preservation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{shift}'.",
        partialCredit: "Submits intermediate string 'IUH{tijgu}' or 'shift'.",
        noCredit: "Incorrect shift."
      },
      acceptableAlternatives: ['HTG{shift}', 'htg{shift}'],
      safetyNotes: 'Multi-stage transformation pipeline.'
    }
  },
  {
    stableId: 'HTG-L01-OE69',
    order: 79,
    levelNumber: 1,
    title: 'Reversed Hex String Decoding Chain',
    prompt: `A communication stream was captured in reverse order before hex decoding:

\`d75636162747b7744584\`

Step 1: Reverse the 20-character hexadecimal string so it is ordered forwards.
Step 2: Convert the resulting hexadecimal bytes into ASCII text to reveal the flag.

Submit the recovered flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.MULTI_STAGE,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{trace}',
    hints: [
      {
        hintIndex: 1,
        content: "Reversing 'd75636162747b7744584' gives '4854477b74726163657d'. Then decode as hex.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE69',
      seedId: 'HTG-L01-OE69',
      subtopic: 'Following Multi-Step Clues & Documenting a Solution',
      explanation: "Step 1: Reversing 'd75636162747b7744584' produces '4854477b74726163657d'. Step 2: Hex decoding 48 54 47 7b 74 72 61 63 65 7d produces 'HTG{trace}'.",
      essentialKeyPoints: [
        "String reversal preceding hex decoding.",
        "Valid ASCII boundary verification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{trace}'.",
        partialCredit: "Submits intermediate reversed hex string or 'trace'.",
        noCredit: "Incorrect decode."
      },
      acceptableAlternatives: ['HTG{trace}', 'htg{trace}'],
      safetyNotes: 'Stream reversal and decoding.'
    }
  },
  {
    stableId: 'HTG-L01-OE70',
    order: 80,
    levelNumber: 1,
    title: 'Orientation Master Signal Pipeline Synthesis',
    prompt: `An end-to-end signal processing pipeline completed execution across three stages:

Stage 1: Demodulated 8-bit binary stream:
\`01010011 01001001 01000111 01001110 01000001 01001100\`
(Converting each binary byte to ASCII yields 'SIGNAL').

Stage 2: Extracted transmission state from packet header:
\`ACTIVE\`

Stage 3: According to tournament rules, format the two tokens separated by an underscore into the official flag structure with namespace prefix HTG and enclosing curly braces '{' and '}'.

Combine Stage 1 and Stage 2 to produce the final level completion flag.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.MULTI_STAGE,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{SIGNAL_ACTIVE}',
    hints: [
      {
        hintIndex: 1,
        content: "Stage 1 is SIGNAL, Stage 2 is ACTIVE. Format as HTG with '{' and '}'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE70',
      seedId: 'HTG-L01-OE70',
      subtopic: 'Following Multi-Step Clues & Documenting a Solution',
      explanation: "Stage 1 binary decodes to 'SIGNAL'. Stage 2 header is 'ACTIVE'. Combining under template 'HTG{<STAGE1>_<STAGE2>}' produces 'HTG{SIGNAL_ACTIVE}'.",
      essentialKeyPoints: [
        "End-to-end multi-source correlation.",
        "Capstone flag synthesis for Level 1."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SIGNAL_ACTIVE}'.",
        partialCredit: "Submits lowercase 'HTG{signal_active}' or 'SIGNAL_ACTIVE'.",
        noCredit: "Submits individual stage tokens without template."
      },
      acceptableAlternatives: ['HTG{SIGNAL_ACTIVE}', 'htg{signal_active}', 'HTG{signal_active}', 'SIGNAL_ACTIVE'],
      safetyNotes: 'Capstone level signal synthesis.'
    }
  }
];

module.exports = subtopic8Questions;

