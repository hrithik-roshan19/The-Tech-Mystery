const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L01-OE21',
    order: 31,
    levelNumber: 1,
    title: '8-bit Binary Byte Stream to ASCII',
    prompt: `An embedded microcontroller hardware bus line transmitted three 8-bit binary words:

\`01001000 01010100 01000111\`

Convert these three binary bytes into their corresponding ASCII characters.`,
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
    flag: 'HTG',
    hints: [
      {
        hintIndex: 1,
        content: "01001000 = 72 ('H'), 01010100 = 84 ('T'), 01000111 = 71 ('G').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE21',
      seedId: 'HTG-L01-OE21',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "Converting each binary byte to decimal and character: 01001000_2 = 72 ('H'), 01010100_2 = 84 ('T'), 01000111_2 = 71 ('G'). Concatenating produces 'HTG'.",
      essentialKeyPoints: [
        "Binary positional base-2 conversion.",
        "8-bit ASCII byte mapping."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG'.",
        partialCredit: "Submits lowercase 'htg'.",
        noCredit: "Incorrect letters or decimal numbers."
      },
      acceptableAlternatives: ['HTG', 'htg'],
      safetyNotes: 'Binary bus signal decoding.'
    }
  },
  {
    stableId: 'HTG-L01-OE22',
    order: 32,
    levelNumber: 1,
    title: 'Hexadecimal to Decimal Integer Conversion',
    prompt: `A memory debugger displays a register offset represented in hexadecimal notation:

\`0x2A\`

Convert this hexadecimal value into its standard base-10 decimal integer equivalent.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.BINARY_ASCII,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '42',
    hints: [
      {
        hintIndex: 1,
        content: "Multiply 2 by 16 and add A (which equals 10).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE22',
      seedId: 'HTG-L01-OE22',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "In base 16, '2' is in the 16s place and 'A' represents 10: (2 * 16) + (10 * 1) = 32 + 10 = 42.",
      essentialKeyPoints: [
        "Base 16 positional notation.",
        "Digit A represents 10."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 42.",
        partialCredit: "Submits 'forty-two'.",
        noCredit: "Submits incorrect arithmetic."
      },
      acceptableAlternatives: ['42', 'forty-two'],
      safetyNotes: 'Integer base conversion.'
    }
  },
  {
    stableId: 'HTG-L01-OE23',
    order: 33,
    levelNumber: 1,
    title: 'Decimal ASCII Byte Array to Word',
    prompt: `A keylogger diagnostic captured an array of four decimal ASCII character codes:

\`[87, 73, 82, 69]\`

Convert this array into the corresponding 4-letter English word.`,
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
    flag: 'WIRE',
    hints: [
      {
        hintIndex: 1,
        content: "87='W', 73='I', 82='R', 69='E'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE23',
      seedId: 'HTG-L01-OE23',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "Looking up ASCII codes: 87 -> 'W', 73 -> 'I', 82 -> 'R', 69 -> 'E'. The word is 'WIRE'.",
      essentialKeyPoints: [
        "ASCII decimal to character mapping.",
        "Standard English uppercase character range (65-90)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'WIRE'.",
        partialCredit: "Submits 'wire'.",
        noCredit: "Submits incorrect string."
      },
      acceptableAlternatives: ['WIRE', 'wire', 'Wire'],
      safetyNotes: 'ASCII array deserialization.'
    }
  },
  {
    stableId: 'HTG-L01-OE24',
    order: 34,
    levelNumber: 1,
    title: 'High Nibble Binary Representation',
    prompt: `A microcontroller hardware register contains the byte value \`0x9F\`.

A byte is divided into two 4-bit nibbles: the high nibble and the low nibble.

What is the 4-bit binary representation of the upper (most significant / high) nibble '9'? Submit the 4 binary digits (e.g. 0000).`,
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
    flag: '1001',
    hints: [
      {
        hintIndex: 1,
        content: "Convert the single digit 9 into 4-bit binary: 8 + 1.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE24',
      seedId: 'HTG-L01-OE24',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "In '0x9F', the high nibble is '9' and low nibble is 'F'. Decimal 9 in 4-bit binary is 1*8 + 0*4 + 0*2 + 1*1 = '1001'.",
      essentialKeyPoints: [
        "Nibble concept: 4 bits per hex character.",
        "High nibble occupies bits 4..7."
      ],
      gradingRubric: {
        fullCredit: "Submits '1001'.",
        partialCredit: "Submits '0b1001'.",
        noCredit: "Submits low nibble (1111) or wrong bits."
      },
      acceptableAlternatives: ['1001', '0b1001'],
      safetyNotes: 'Bit manipulation fundamentals.'
    }
  },
  {
    stableId: 'HTG-L01-OE25',
    order: 35,
    levelNumber: 1,
    title: 'ASCII Printable Space Hexadecimal Value',
    prompt: `In standard 7-bit ASCII tables, printable characters begin with the space character (' ').

What is the two-digit hexadecimal byte value representing the ASCII space character? (You may submit with or without '0x').`,
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
    flag: '0x20',
    hints: [
      {
        hintIndex: 1,
        content: "Decimal 32 converted to hexadecimal.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE25',
      seedId: 'HTG-L01-OE25',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "The space character is decimal 32 in ASCII. 32 / 16 = 2 with remainder 0, giving hexadecimal 0x20.",
      essentialKeyPoints: [
        "Space is ASCII decimal 32 / hex 0x20.",
        "Marks the transition from control codes (0-31) to printable text (32-126)."
      ],
      gradingRubric: {
        fullCredit: "Submits '0x20' or '20'.",
        partialCredit: "Submits '20h'.",
        noCredit: "Submits decimal 32 or wrong hex."
      },
      acceptableAlternatives: ['0x20', '20', '20h'],
      safetyNotes: 'ASCII table boundary recognition.'
    }
  },
  {
    stableId: 'HTG-L01-OE26',
    order: 36,
    levelNumber: 1,
    title: 'ASCII Tilde Maximum Printable Hex Code',
    prompt: `The tilde character ('~') is the highest printable character in the 7-bit ASCII table (decimal 126), immediately preceding the DEL control code.

What is the hexadecimal byte value representing the tilde character ('~')? (Submit with or without '0x').`,
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
    flag: '0x7E',
    hints: [
      {
        hintIndex: 1,
        content: "Convert decimal 126 to hexadecimal: 126 = (7 * 16) + 14.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE26',
      seedId: 'HTG-L01-OE26',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "Decimal 126 divided by 16 yields quotient 7 and remainder 14 ('E'). Thus 126 is 0x7E.",
      essentialKeyPoints: [
        "ASCII 126 = 0x7E.",
        "Highest printable 7-bit ASCII character."
      ],
      gradingRubric: {
        fullCredit: "Submits '0x7E' or '7E' (case-insensitive).",
        partialCredit: "Submits '7eh'.",
        noCredit: "Submits 0x7F (which is DEL) or decimal 126."
      },
      acceptableAlternatives: ['0x7E', '7E', '7e', '0x7e', '7Eh'],
      safetyNotes: 'Printable ASCII upper boundary.'
    }
  },
  {
    stableId: 'HTG-L01-OE27',
    order: 37,
    levelNumber: 1,
    title: 'Little-Endian 16-bit Integer Hex Representation',
    prompt: `An x86 architecture memory capture recorded two consecutive bytes in transmission order:

\`0x34 0x12\`

In little-endian byte ordering, the least significant byte is stored first.

What is the 16-bit hexadecimal integer value represented by these two bytes? State the result as a 4-digit hexadecimal number (e.g. 0xXXXX).`,
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
    flag: '0x1234',
    hints: [
      {
        hintIndex: 1,
        content: "In little-endian, reverse the byte order: byte 2 becomes high byte, byte 1 becomes low byte.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE27',
      seedId: 'HTG-L01-OE27',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "Little-endian stores the least significant byte (LSB, 0x34) at the lowest memory address, followed by the most significant byte (MSB, 0x12). Reconstructed as a 16-bit integer, the value is 0x1234 (decimal 4660).",
      essentialKeyPoints: [
        "Little-endian byte reversal for multi-byte words.",
        "LSB at lower address, MSB at higher address."
      ],
      gradingRubric: {
        fullCredit: "Submits '0x1234' or '1234'.",
        partialCredit: "Submits decimal 4660.",
        noCredit: "Leaves in big-endian order (0x3412)."
      },
      acceptableAlternatives: ['0x1234', '1234', '0X1234', '1234h'],
      safetyNotes: 'Endianness awareness for reverse engineering.'
    }
  },
  {
    stableId: 'HTG-L01-OE28',
    order: 38,
    levelNumber: 1,
    title: 'Big-Endian Network Byte Order Port',
    prompt: `Network protocols use big-endian ordering (network byte order). A TCP header sniffer recorded a 16-bit destination port field containing raw bytes:

\`0x00 0x50\`

What is the base-10 decimal integer port number represented by this field?`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.BINARY_ASCII,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '80',
    hints: [
      {
        hintIndex: 1,
        content: "Big-endian stores most significant byte first: (0x00 * 256) + 0x50.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE28',
      seedId: 'HTG-L01-OE28',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "In big-endian, bytes are read directly in order: 0x0050 = 5 * 16 = 80 decimal, the standard port for HTTP.",
      essentialKeyPoints: [
        "Network byte order is big-endian.",
        "0x0050 = 80 (HTTP)."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 80.",
        partialCredit: "Submits 'eighty'.",
        noCredit: "Submits 0x50 or incorrect number."
      },
      acceptableAlternatives: ['80', 'eighty'],
      safetyNotes: 'Network byte order interpretation.'
    }
  },
  {
    stableId: 'HTG-L01-OE29',
    order: 39,
    levelNumber: 1,
    title: 'ASCII Case Toggle Bitmask Value',
    prompt: `In standard ASCII, uppercase letters ('A' = 0x41 = 01000001_2) and lowercase letters ('a' = 0x61 = 01100001_2) differ by exactly one bit: bit 5 (0-indexed).

What base-10 integer decimal value corresponds to the bitmask 2^5 (1 << 5) used to toggle between uppercase and lowercase ASCII letters?`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.BINARY_ASCII,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '32',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate 2 raised to the power 5: 2 * 2 * 2 * 2 * 2.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE29',
      seedId: 'HTG-L01-OE29',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "2^5 = 32 (0x20 in hex). Adding 32 or performing bitwise OR with 0x20 converts uppercase to lowercase; subtracting 32 or bitwise AND with ~0x20 converts to uppercase.",
      essentialKeyPoints: [
        "Bit 5 (value 32) controls ASCII case.",
        "Bitwise manipulation of text streams."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 32.",
        partialCredit: "Submits '0x20'.",
        noCredit: "Submits wrong power of 2."
      },
      acceptableAlternatives: ['32', '0x20', 'thirty-two'],
      safetyNotes: 'Bitwise optimization concept.'
    }
  },
  {
    stableId: 'HTG-L01-OE30',
    order: 40,
    levelNumber: 1,
    title: 'Raw Hexadecimal Byte Stream Cardinality',
    prompt: `A raw packet dump displays an unbroken hexadecimal character stream:

\`4854477b62797465737d\`

How many total binary data bytes are represented by this hexadecimal string? Submit the integer count.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.BINARY_ASCII,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '10',
    hints: [
      {
        hintIndex: 1,
        content: "Each byte is represented by exactly 2 hexadecimal characters.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE30',
      seedId: 'HTG-L01-OE30',
      subtopic: 'Binary, Hexadecimal, ASCII & Character Representations',
      explanation: "The string contains 20 hexadecimal digits. Since 1 byte = 2 hex digits (1 nibble per digit), 20 / 2 = 10 bytes (decoding to 'HTG{bytes}').",
      essentialKeyPoints: [
        "Hex string length to byte count ratio (2:1).",
        "20 hex characters = 10 raw bytes."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 10.",
        partialCredit: "Submits 'ten'.",
        noCredit: "Submits 20 (hex digit count) or incorrect calculation."
      },
      acceptableAlternatives: ['10', 'ten'],
      safetyNotes: 'Data size estimation.'
    }
  }
];

module.exports = subtopic3Questions;

