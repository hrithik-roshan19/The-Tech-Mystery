const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L01-OE41',
    order: 51,
    levelNumber: 1,
    title: 'Arithmetic Step in ASCII Character Sequence',
    prompt: `An encryption counter advances through an arithmetic progression of uppercase ASCII characters:

\`'A', 'C', 'E', 'G', ?\`

Following the pattern of stepping forward by +2 character positions, what is the next single uppercase character in this sequence?`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.LOGICAL_REASONING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'I',
    hints: [
      {
        hintIndex: 1,
        content: "A(65) + 2 = C(67), C + 2 = E(69), E + 2 = G(71), G + 2 = ?",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE41',
      seedId: 'HTG-L01-OE41',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "'A'=65, 'C'=67, 'E'=69, 'G'=71. Stepping +2 gives 73, which corresponds to uppercase 'I'.",
      essentialKeyPoints: [
        "Arithmetic sequence over character codepoints.",
        "Step +2 progression."
      ],
      gradingRubric: {
        fullCredit: "Submits 'I'.",
        partialCredit: "Submits 'letter I' or '73'.",
        noCredit: "Submits wrong character."
      },
      acceptableAlternatives: ['I', 'letter I', 'i'],
      safetyNotes: 'Sequence pattern deduction.'
    }
  },
  {
    stableId: 'HTG-L01-OE42',
    order: 52,
    levelNumber: 1,
    title: 'Alternating Shift Sequence Reversal',
    prompt: `A four-letter ciphertext was created using an alternating shift cipher:

\`HQJC\`

The encryption rule was:
- Characters at odd positions (1st, 3rd) were shifted forward by +1 ('char + 1').
- Characters at even positions (2nd, 4th) were shifted backward by -1 ('char - 1').

Reverse this encryption transformation to recover the original 4-letter English word.`,
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
    flag: 'GRID',
    hints: [
      {
        hintIndex: 1,
        content: "To decrypt: odd positions shift -1 (H - 1 = G), even positions shift +1 (Q + 1 = R).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE42',
      seedId: 'HTG-L01-OE42',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Reversing the cipher: Pos 1: 'H' - 1 = 'G'. Pos 2: 'Q' + 1 = 'R'. Pos 3: 'J' - 1 = 'I'. Pos 4: 'C' + 1 = 'D'. Decrypted word: 'GRID'.",
      essentialKeyPoints: [
        "Inverting alternating transformation rules.",
        "Odd/even position tracking."
      ],
      gradingRubric: {
        fullCredit: "Submits 'GRID'.",
        partialCredit: "Submits lowercase 'grid'.",
        noCredit: "Incorrect shifts."
      },
      acceptableAlternatives: ['GRID', 'grid', 'Grid'],
      safetyNotes: 'Polyalphabetic pattern deduction.'
    }
  },
  {
    stableId: 'HTG-L01-OE43',
    order: 53,
    levelNumber: 1,
    title: 'Fibonacci Index Character Sampling',
    prompt: `A steganographic message was embedded across the following 13-character string:

\`MATDREFIJKLNX\`

Extract the characters located at the 1-based Fibonacci index sequence:
Index 1, Index 2, Index 3, Index 5, Index 8, and Index 13.

Concatenate these six extracted characters into a single keyword.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.LOGICAL_REASONING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'MATRIX',
    hints: [
      {
        hintIndex: 1,
        content: "Index 1 is 'M', Index 2 is 'A', Index 3 is 'T', Index 5 is 'R', Index 8 is 'I', Index 13 is 'X'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE43',
      seedId: 'HTG-L01-OE43',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Evaluating indices: 1='M', 2='A', 3='T', 5='R', 8='I', 13='X'. Concatenation yields the word 'MATRIX'.",
      essentialKeyPoints: [
        "Mathematical sequence sampling.",
        "1-based indexing precision."
      ],
      gradingRubric: {
        fullCredit: "Submits 'MATRIX'.",
        partialCredit: "Submits lowercase 'matrix'.",
        noCredit: "Incorrect characters or 0-indexed offset errors."
      },
      acceptableAlternatives: ['MATRIX', 'matrix', 'Matrix'],
      safetyNotes: 'Mathematical index sampling.'
    }
  },
  {
    stableId: 'HTG-L01-OE44',
    order: 54,
    levelNumber: 1,
    title: 'Stride-Based Interleaved Character Extraction',
    prompt: `An obfuscated flag was interleaved with filler digits:

\`H99T99G99{99s99k99i99p99}\`

Extract every 3rd character starting at index 0 (stride = 3: index 0, index 3, index 6, ...) to assemble the complete flag.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.LOGICAL_REASONING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{skip}',
    hints: [
      {
        hintIndex: 1,
        content: "Take index 0 ('H'), skip two '9's, take index 3 ('T'), skip two '9's, take index 6 ('G')...",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE44',
      seedId: 'HTG-L01-OE44',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Extracting with stride 3: 0='H', 3='T', 6='G', 9='{', 12='s', 15='k', 18='i', 21='p', 24='}'. Result: 'HTG{skip}'.",
      essentialKeyPoints: [
        "Stride slicing (string[::3]).",
        "Filtering periodic noise."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{skip}'.",
        partialCredit: "Submits 'skip'.",
        noCredit: "Submits filler digits."
      },
      acceptableAlternatives: ['HTG{skip}', 'htg{skip}'],
      safetyNotes: 'Interleaved string extraction.'
    }
  },
  {
    stableId: 'HTG-L01-OE45',
    order: 55,
    levelNumber: 1,
    title: 'Column-Major Matrix Grid Transposition',
    prompt: `A 3x3 transposition grid contains characters arranged in three rows:

Row 1: \`K  L  N\`
Row 2: \`E  O  E\`
Row 3: \`Y  G  T\`

Read this matrix in column-major order (read Column 1 top-to-bottom, then Column 2 top-to-bottom, then Column 3 top-to-bottom) and concatenate the letters into a 9-letter keyword.`,
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
    flag: 'KEYLOGNET',
    hints: [
      {
        hintIndex: 1,
        content: "Column 1 is K-E-Y. Column 2 is L-O-G. Column 3 is N-E-T.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE45',
      seedId: 'HTG-L01-OE45',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Col 1: K, E, Y ('KEY'). Col 2: L, O, G ('LOG'). Col 3: N, E, T ('NET'). Concatenating column-first yields 'KEYLOGNET'.",
      essentialKeyPoints: [
        "Row-major vs column-major matrix traversal.",
        "Classical columnar transposition fundamentals."
      ],
      gradingRubric: {
        fullCredit: "Submits 'KEYLOGNET'.",
        partialCredit: "Submits 'keylognet' or 'KEY LOG NET'.",
        noCredit: "Submits row-major order (KLNEOEYGT)."
      },
      acceptableAlternatives: ['KEYLOGNET', 'keylognet', 'KEY LOG NET'],
      safetyNotes: 'Transposition matrix reading.'
    }
  },
  {
    stableId: 'HTG-L01-OE46',
    order: 56,
    levelNumber: 1,
    title: 'Atbash Classical Mirror Cipher Decryption',
    prompt: `In the biblical Atbash mirror cipher, the alphabet is reversed:
A <-> Z, B <-> Y, C <-> X, ..., H <-> S, ..., T <-> G.

What three-letter uppercase plaintext decrypts from the ciphertext:

\`SGT\`

Submit the 3-letter plaintext.`,
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
    flag: 'HTG',
    hints: [
      {
        hintIndex: 1,
        content: "S is 19th from start, matching H (19th from end). G matches T. T matches G.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE46',
      seedId: 'HTG-L01-OE46',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Atbash maps letter at index i to index (25 - i). S (18) <-> H (7). G (6) <-> T (19). T (19) <-> G (6). Ciphertext 'SGT' decrypts to 'HTG'.",
      essentialKeyPoints: [
        "Atbash monoalphabetic substitution.",
        "Symmetric alphabet reversal."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG'.",
        partialCredit: "Submits lowercase 'htg'.",
        noCredit: "Incorrect letters."
      },
      acceptableAlternatives: ['HTG', 'htg'],
      safetyNotes: 'Classical substitution cipher.'
    }
  },
  {
    stableId: 'HTG-L01-OE47',
    order: 57,
    levelNumber: 1,
    title: 'Frequency Outlier Character Identification',
    prompt: `A noisy radio transmission channel contains an array dominated by the background carrier symbol 'A':

\`AAAAABAAAAAAACAAAAA\`

What are the two non-'A' outlier characters present in this string, listed in the exact order in which they appear? (Concatenate them as a 2-letter string).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.LOGICAL_REASONING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'BC',
    hints: [
      {
        hintIndex: 1,
        content: "Scan across: AAAAA [B] AAAAAAA [C] AAAAA.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE47',
      seedId: 'HTG-L01-OE47',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Filtering out the background 'A' characters leaves 'B' at position 6 and 'C' at position 14. Concatenated in order of appearance: 'BC'.",
      essentialKeyPoints: [
        "Frequency anomaly detection.",
        "Signal noise filtering."
      ],
      gradingRubric: {
        fullCredit: "Submits 'BC'.",
        partialCredit: "Submits 'B, C' or 'B and C'.",
        noCredit: "Submits incorrect characters."
      },
      acceptableAlternatives: ['BC', 'B, C', 'B and C', 'bc'],
      safetyNotes: 'Anomaly detection in telemetry.'
    }
  },
  {
    stableId: 'HTG-L01-OE48',
    order: 58,
    levelNumber: 1,
    title: 'Hexadecimal Palindrome Reconstruction',
    prompt: `An integrity probe tests whether a transmission header is a valid palindrome (reads identically forwards and backwards).

A 7-character hexadecimal header begins with prefix \`7A3\` and is known to be an exact palindrome symmetric around its central character \`F\`.

By mirroring the 3 prefix characters around the center, reconstruct and submit the complete 7-character hexadecimal palindrome string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.LOGICAL_REASONING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '7A3F3A7',
    hints: [
      {
        hintIndex: 1,
        content: "Prefix is 7A3, center is F, suffix is reversed prefix (3A7).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE48',
      seedId: 'HTG-L01-OE48',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Mirroring prefix '7A3' around center 'F' produces '7A3' + 'F' + '3A7' = '7A3F3A7'.",
      essentialKeyPoints: [
        "Palindrome symmetry around odd center element.",
        "Hexadecimal string mirroring."
      ],
      gradingRubric: {
        fullCredit: "Submits '7A3F3A7'.",
        partialCredit: "Submits '0x7A3F3A7'.",
        noCredit: "Submits non-palindromic sequence."
      },
      acceptableAlternatives: ['7A3F3A7', '0x7A3F3A7', '7a3f3a7'],
      safetyNotes: 'Symmetric token verification.'
    }
  },
  {
    stableId: 'HTG-L01-OE49',
    order: 59,
    levelNumber: 1,
    title: 'Caesar Shift +3 ROT3 Decryption',
    prompt: `A classic Caesar cipher with a shift of +3 (ROT3) was used to encrypt a 3-letter acronym into the ciphertext:

\`KWJ\`

Decrypt the ciphertext by shifting each letter backward by 3 positions to reveal the original acronym.`,
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
    flag: 'HTG',
    hints: [
      {
        hintIndex: 1,
        content: "K(11) - 3 = H(8), W(23) - 3 = T(20), J(10) - 3 = G(7).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE49',
      seedId: 'HTG-L01-OE49',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "In ROT3 Caesar cipher, decryption subtracts 3: K - 3 = H, W - 3 = T, J - 3 = G. The acronym is 'HTG'.",
      essentialKeyPoints: [
        "Caesar shift decryption formula: P = (C - k) mod 26.",
        "Shift distance 3."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG'.",
        partialCredit: "Submits lowercase 'htg'.",
        noCredit: "Incorrect shifts."
      },
      acceptableAlternatives: ['HTG', 'htg'],
      safetyNotes: 'Historical cipher analysis.'
    }
  },
  {
    stableId: 'HTG-L01-OE50',
    order: 60,
    levelNumber: 1,
    title: 'Two-Rail Fence Transposition Decryption',
    prompt: `A 6-letter word was encrypted using a 2-rail fence cipher, yielding the ciphertext:

\`SGAINL\`

In a 2-rail fence cipher, letters were written alternately on Rail 1 (odd positions: 1, 3, 5) and Rail 2 (even positions: 2, 4, 6), then read off rail-by-rail (Rail 1: 'SGA', Rail 2: 'INL').

Reconstruct the original 6-letter English word by interleaving the rails.`,
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
    flag: 'SIGNAL',
    hints: [
      {
        hintIndex: 1,
        content: "Interleave: 1st from Rail 1 ('S'), 1st from Rail 2 ('I'), 2nd from Rail 1 ('G'), 2nd from Rail 2 ('N')...",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE50',
      seedId: 'HTG-L01-OE50',
      subtopic: 'Simple Pattern Recognition & Sequence Reasoning',
      explanation: "Rail 1 contains letters at positions 1, 3, 5 ('S', 'G', 'A'). Rail 2 contains letters at positions 2, 4, 6 ('I', 'N', 'L'). Interleaving produces S-I-G-N-A-L ('SIGNAL').",
      essentialKeyPoints: [
        "Rail fence transposition geometry.",
        "Interleaving parallel rail streams."
      ],
      gradingRubric: {
        fullCredit: "Submits 'SIGNAL'.",
        partialCredit: "Submits lowercase 'signal'.",
        noCredit: "Incorrect word or rail assignment."
      },
      acceptableAlternatives: ['SIGNAL', 'signal', 'Signal'],
      safetyNotes: 'Geometric transposition decryption.'
    }
  }
];

module.exports = subtopic5Questions;

