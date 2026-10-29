const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L01-OE61',
    order: 71,
    levelNumber: 1,
    title: 'Identifying Corrupted Base64 Character',
    prompt: `An analyst attempts to decode the following string received over an unshielded serial wire:

\`SFRHe2Jhc2U2NF8hZGV9\`

Standard Base64 encoding utilizes strictly the characters A–Z, a–z, 0–9, '+', '/', and padding '='.

Which single invalid character in this string violates the Base64 alphabet specification? Submit the single character.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.BASE64_ENCODING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '!',
    hints: [
      {
        hintIndex: 1,
        content: "Look near the end of the string between '8' and 'Z'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE61',
      seedId: 'HTG-L01-OE61',
      subtopic: 'Identifying Malformed or Misleading Encoded Messages',
      explanation: "In 'SFRHe2Jhc2U2NF8hZGV9', the character '!' at position 15 is not a valid symbol in standard RFC 4648 Base64.",
      essentialKeyPoints: [
        "Base64 alphabet integrity.",
        "Identifying corrupt characters in noisy transmissions."
      ],
      gradingRubric: {
        fullCredit: "Submits '!'.",
        partialCredit: "Submits 'exclamation mark' or 'exclamation'.",
        noCredit: "Submits valid Base64 characters."
      },
      acceptableAlternatives: ['!', 'exclamation mark', 'exclamation'],
      safetyNotes: 'Malformed data stream triage.'
    }
  },
  {
    stableId: 'HTG-L01-OE62',
    order: 72,
    levelNumber: 1,
    title: 'Non-Hexadecimal Character Detection',
    prompt: `A raw byte dump claims to represent a sequence of hexadecimal bytes:

\`48 54 47 7B 4B 45 59 7Z\`

Base-16 hexadecimal notation permits only digits 0–9 and letters A–F (or lowercase a–f).

Which single uppercase letter in the sequence is invalid in hexadecimal notation? Submit the letter.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.BINARY_ASCII,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'Z',
    hints: [
      {
        hintIndex: 1,
        content: "Check the final byte: '7Z'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE62',
      seedId: 'HTG-L01-OE62',
      subtopic: 'Identifying Malformed or Misleading Encoded Messages',
      explanation: "Hexadecimal numbers range from 0 to 15 (0-9, A-F). 'Z' is outside the base-16 character set, making '7Z' an invalid hex byte.",
      essentialKeyPoints: [
        "Hex character set bounds (0-9, A-F).",
        "Detecting data corruption in hex streams."
      ],
      gradingRubric: {
        fullCredit: "Submits 'Z' (case-insensitive).",
        partialCredit: "Submits 'letter Z' or '7Z'.",
        noCredit: "Submits valid hex characters."
      },
      acceptableAlternatives: ['Z', 'z', 'letter Z', '7Z'],
      safetyNotes: 'Data validation and sanitization.'
    }
  },
  {
    stableId: 'HTG-L01-OE63',
    order: 73,
    levelNumber: 1,
    title: 'Base64 Maximum Consecutive Padding Limit',
    prompt: `A developer writes a custom Base64 encoder that outputs an invalid string with excessive padding: \`QUE===\`.

According to RFC 4648 Base64 standards, padding is used to align unaligned data bytes to a 4-character boundary.

What is the maximum number of consecutive '=' padding characters permitted at the end of any valid Base64 string? Submit the integer count.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.BASE64_ENCODING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '2',
    hints: [
      {
        hintIndex: 1,
        content: "Only single ('=') or double ('==') padding is mathematically valid.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE63',
      seedId: 'HTG-L01-OE63',
      subtopic: 'Identifying Malformed or Misleading Encoded Messages',
      explanation: "Base64 encodes 3 bytes into 4 characters. If 1 byte remains, 2 pads ('==') are added. If 2 bytes remain, 1 pad ('=') is added. 3 pads ('===') is mathematically impossible in compliant Base64.",
      essentialKeyPoints: [
        "Base64 padding constraint (at most 2 '=' signs).",
        "Recognizing malformed encoders."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 2.",
        partialCredit: "Submits 'two'.",
        noCredit: "Submits 1, 3, or 4."
      },
      acceptableAlternatives: ['2', 'two'],
      safetyNotes: 'RFC 4648 conformance.'
    }
  },
  {
    stableId: 'HTG-L01-OE64',
    order: 74,
    levelNumber: 1,
    title: 'Base32 Encoding Identification',
    prompt: `An encoded string from a cryptographic token log contains:

\`JRUGK4TFNZ2A====\`

Notice that the character set is restricted exclusively to uppercase letters and digits from 2 through 7, terminated by padding '=' signs.

What is the common name of this 32-character encoding standard? Submit the name (e.g. BaseXX).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.ENCODING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'Base32',
    hints: [
      {
        hintIndex: 1,
        content: "Digits 0, 1, 8, 9 are omitted. The standard uses 32 symbols.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE64',
      seedId: 'HTG-L01-OE64',
      subtopic: 'Identifying Malformed or Misleading Encoded Messages',
      explanation: "Base32 encodes 5 bits per character using A-Z and 2-7. 'JRUGK4TFNZ2A====' strictly obeys Base32 character constraints and 8-character block padding.",
      essentialKeyPoints: [
        "Differentiating Base32 vs Base64 by alphabet.",
        "Base32 padding up to 6 equals signs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'Base32'.",
        partialCredit: "Submits 'base32' or 'Base 32'.",
        noCredit: "Submits Base64 or Hex."
      },
      acceptableAlternatives: ['Base32', 'base32', 'Base 32', 'RFC 4648 Base32'],
      safetyNotes: 'Encoding classification.'
    }
  },
  {
    stableId: 'HTG-L01-OE65',
    order: 75,
    levelNumber: 1,
    title: 'Even Parity Frame Integrity Check',
    prompt: `A serial bus utilizes an Even Parity transmission protocol on 8-bit frames. Under even parity, the sum of all set bits in a valid frame must be divisible by 2 (parity check = total bits modulo 2 = 0).

An oscilloscope inspects an 8-bit frame:
\`01000011\`

Counting the set bits yields an odd sum of 3.

Calculate the parity error syndrome: \`3 % 2\`. What remainder value indicates a parity failure? Submit the integer.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.LOGICAL_REASONING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '1',
    hints: [
      {
        hintIndex: 1,
        content: "3 divided by 2 gives quotient 1 and remainder 1.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE65',
      seedId: 'HTG-L01-OE65',
      subtopic: 'Identifying Malformed or Misleading Encoded Messages',
      explanation: "In even parity, parity check = (bit sum) mod 2. For 3 set bits: 3 % 2 = 1. A non-zero remainder (1) signifies a parity check violation.",
      essentialKeyPoints: [
        "Even parity rule: bit sum mod 2 = 0.",
        "Error syndrome calculation."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 1.",
        partialCredit: "Submits 'one'.",
        noCredit: "Submits 0."
      },
      acceptableAlternatives: ['1', 'one'],
      safetyNotes: 'Physical layer error detection.'
    }
  }
];

module.exports = subtopic7Questions;
