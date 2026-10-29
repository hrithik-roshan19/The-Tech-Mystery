const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    stableId: 'HTG-L01-OE11',
    order: 21,
    levelNumber: 1,
    title: 'Base64 Decoded Signal Keyword',
    prompt: `An emergency communications terminal displays an ASCII Base64-encoded string intercepted from an auxiliary transceiver:

\`U0lHTkFM\`

Decode this Base64 string to discover the plaintext English keyword.`,
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
    flag: 'SIGNAL',
    hints: [
      {
        hintIndex: 1,
        content: "Use base64 -d or atob() to decode the 8-character string.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE11',
      seedId: 'HTG-L01-OE11',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "Base64 decodes 4 ASCII characters into 3 raw bytes. 'U0lHTkFM' decodes to 0x53 0x49 0x47 0x4E 0x41 0x4C, which corresponds to ASCII 'SIGNAL'.",
      essentialKeyPoints: [
        "Base64 4:3 block encoding ratio.",
        "Accurate ASCII text recovery from standard 64-character table."
      ],
      gradingRubric: {
        fullCredit: "Submits 'SIGNAL' (case-insensitive).",
        partialCredit: "Submits lowercase 'signal'.",
        noCredit: "Submits incorrect word or unencoded string."
      },
      acceptableAlternatives: ['SIGNAL', 'signal', 'Signal'],
      safetyNotes: 'Standard encoding decoding; safe synthetic data.'
    }
  },
  {
    stableId: 'HTG-L01-OE12',
    order: 22,
    levelNumber: 1,
    title: 'Base64 Padding Length Rule',
    prompt: `When encoding raw binary data using Base64, data is grouped into 24-bit (3-byte) chunks.

If the original input length leaves an unaligned remainder of exactly 2 bytes (16 bits) in the final group, how many padding '=' characters are appended to complete the 4-character block? Submit the integer count.`,
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
    flag: '1',
    hints: [
      {
        hintIndex: 1,
        content: "3 bytes produce 0 pads. 2 bytes produce 1 pad. 1 byte produces 2 pads.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE12',
      seedId: 'HTG-L01-OE12',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "In RFC 4648 Base64, 16 bits of input are encoded into three 6-bit Base64 symbols (18 bits total with padding zeros), followed by exactly one '=' padding character to reach the 4-character block boundary.",
      essentialKeyPoints: [
        "Base64 padding rules for 1-byte and 2-byte remainders.",
        "A 2-byte remainder appends exactly 1 '=' character."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 1.",
        partialCredit: "Submits 'one'.",
        noCredit: "Submits 0, 2, or 3."
      },
      acceptableAlternatives: ['1', 'one', 'single'],
      safetyNotes: 'RFC 4648 encoding mechanics.'
    }
  },
  {
    stableId: 'HTG-L01-OE13',
    order: 23,
    levelNumber: 1,
    title: 'URL Percent-Encoding Spaces',
    prompt: `An access log captured the following URL parameter string:

\`search=grid%20signal%20active\`

Decode the URL percent-encoded sequence '%20' and provide the complete unencoded search phrase (the string after 'search=').`,
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
    flag: 'grid signal active',
    hints: [
      {
        hintIndex: 1,
        content: "%20 represents the hex code 0x20, which is the ASCII space character.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE13',
      seedId: 'HTG-L01-OE13',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "URL percent-encoding represents non-alphanumeric characters with '%' followed by their two-digit hex code. Hex 20 equals decimal 32, the standard space character. Decoding '%20' yields 'grid signal active'.",
      essentialKeyPoints: [
        "Hex 0x20 corresponds to ASCII space.",
        "RFC 3986 percent-decoding principles."
      ],
      gradingRubric: {
        fullCredit: "Submits 'grid signal active'.",
        partialCredit: "Submits 'grid signal active' with quotes.",
        noCredit: "Leaves '%20' unexpanded."
      },
      acceptableAlternatives: ['grid signal active', 'grid signal active'],
      safetyNotes: 'HTTP URI query parsing.'
    }
  },
  {
    stableId: 'HTG-L01-OE14',
    order: 24,
    levelNumber: 1,
    title: 'International Morse Distress Signal',
    prompt: `An optical sensor recorded a flashing light pattern alternating between short pulses (dots) and long pulses (dashes):

\`... --- ...\`

Decode this universal international radio distress signal into plain uppercase text.`,
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
    flag: 'SOS',
    hints: [
      {
        hintIndex: 1,
        content: "... is S, --- is O, ... is S.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE14',
      seedId: 'HTG-L01-OE14',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "In Morse code, three dots represent 'S' and three dashes represent 'O'. '... --- ...' is the internationally recognized emergency distress signal SOS.",
      essentialKeyPoints: [
        "Morse timing: dots vs dashes.",
        "Iconic communication emergency code SOS."
      ],
      gradingRubric: {
        fullCredit: "Submits 'SOS'.",
        partialCredit: "Submits 'sos' or 'S.O.S.'.",
        noCredit: "Submits unrelated text."
      },
      acceptableAlternatives: ['SOS', 'sos', 'S.O.S.', 'Save Our Souls'],
      safetyNotes: 'Radio communications standard.'
    }
  },
  {
    stableId: 'HTG-L01-OE15',
    order: 25,
    levelNumber: 1,
    title: 'Morse Code Word Decoding',
    prompt: `An acoustic hydrophone recorded the following Morse sequence separated by single spaces between letters:

\`-... . .- -.-. --- -.\`

Decode this sequence into the corresponding 6-letter English word.`,
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
    flag: 'BEACON',
    hints: [
      {
        hintIndex: 1,
        content: "-...=B, .=E, .-=A, -.-.=C, ---=O, -.=N",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE15',
      seedId: 'HTG-L01-OE15',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "Decoding letter-by-letter: '-...' = B, '.' = E, '.-' = A, '-.-.' = C, '---' = O, '-.' = N. Concatenating gives 'BEACON'.",
      essentialKeyPoints: [
        "Letter boundary delimitation in Morse.",
        "Direct lookup of standard Morse alphabet tables."
      ],
      gradingRubric: {
        fullCredit: "Submits 'BEACON'.",
        partialCredit: "Submits lowercase 'beacon'.",
        noCredit: "Incorrect letters or missing characters."
      },
      acceptableAlternatives: ['BEACON', 'beacon', 'Beacon'],
      safetyNotes: 'Acoustic signal demodulation scenario.'
    }
  },
  {
    stableId: 'HTG-L01-OE16',
    order: 26,
    levelNumber: 1,
    title: 'Hexadecimal Stream to Word',
    prompt: `A logic analyzer captured a 5-byte hexadecimal data frame:

\`52 41 44 41 52\`

Convert these hexadecimal byte values into an ASCII plaintext word.`,
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
    flag: 'RADAR',
    hints: [
      {
        hintIndex: 1,
        content: "0x52 is 82 ('R'), 0x41 is 65 ('A'), 0x44 is 68 ('D').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE16',
      seedId: 'HTG-L01-OE16',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "Converting each byte: 0x52 -> 'R', 0x41 -> 'A', 0x44 -> 'D', 0x41 -> 'A', 0x52 -> 'R'. The word is 'RADAR', a classic palindrome.",
      essentialKeyPoints: [
        "Hexadecimal to ASCII character table mapping.",
        "Recognizing byte-aligned uppercase English text."
      ],
      gradingRubric: {
        fullCredit: "Submits 'RADAR'.",
        partialCredit: "Submits 'radar'.",
        noCredit: "Submits raw decimal numbers or incorrect word."
      },
      acceptableAlternatives: ['RADAR', 'radar', 'Radar'],
      safetyNotes: 'Byte-stream interpretation.'
    }
  },
  {
    stableId: 'HTG-L01-OE17',
    order: 27,
    levelNumber: 1,
    title: 'Base64 Flag Payload Extraction',
    prompt: `An encrypted transmission status banner contains this encoded string:

\`SFRHe2Jhc2U2NF9vcGVuZWR9\`

Decode this Base64 payload to reveal the complete flag string.`,
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
    flag: 'HTG{base64_opened}',
    hints: [
      {
        hintIndex: 1,
        content: "Use base64 decode on 'SFRHe2Jhc2U2NF9vcGVuZWR9'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE17',
      seedId: 'HTG-L01-OE17',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "Base64 decoding 'SFRHe2Jhc2U2NF9vcGVuZWR9' yields the ASCII flag 'HTG{base64_opened}'.",
      essentialKeyPoints: [
        "Base64 strings starting with 'SFRH' decode to 'HTG{'.",
        "Preserving verbatim inner flag payload."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{base64_opened}'.",
        partialCredit: "Submits 'base64_opened'.",
        noCredit: "Incorrect decode or missing delimiters."
      },
      acceptableAlternatives: ['HTG{base64_opened}', 'htg{base64_opened}'],
      safetyNotes: 'Standard base64 challenge flag format.'
    }
  },
  {
    stableId: 'HTG-L01-OE18',
    order: 28,
    levelNumber: 1,
    title: 'Base32 Encoding Standard Recognition',
    prompt: `A token string was generated using a common encoding standard:

\`JBSWY3DPEBLW64TMMQ======\`

Notice that the character set is restricted exclusively to uppercase letters A–Z and digits 2–7, padded with '=' signs.

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
        content: "Digits 0, 1, 8, 9 are omitted to prevent visual confusion with O, I, B, etc.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE18',
      seedId: 'HTG-L01-OE18',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "RFC 4648 Base32 uses a 32-symbol alphabet (A-Z and digits 2-7) to represent 5 bits per symbol, avoiding ambiguous characters like 0/O and 1/l. 'JBSWY3DPEBLW64TMMQ======' is Base32 for 'HELLO WORLD'.",
      essentialKeyPoints: [
        "Base32 alphabet definition (A-Z, 2-7).",
        "Distinguishing Base32 from Base64 by character set constraints."
      ],
      gradingRubric: {
        fullCredit: "Submits 'Base32'.",
        partialCredit: "Submits 'base32' or 'Base 32'.",
        noCredit: "Submits Base64 or Hex."
      },
      acceptableAlternatives: ['Base32', 'base32', 'Base 32', 'RFC 4648 Base32'],
      safetyNotes: 'Encoding identification.'
    }
  },
  {
    stableId: 'HTG-L01-OE19',
    order: 29,
    levelNumber: 1,
    title: 'URL Encoded Delimiters',
    prompt: `A network sensor intercepted a URI path parameter where curly brackets were percent-encoded:

\`flag%7Bcyber%7D\`

Decode the percent-encoded characters ('%7B' and '%7D') to reveal the original formatted string.`,
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
    flag: 'flag{cyber}',
    hints: [
      {
        hintIndex: 1,
        content: "%7B is '{' and %7D is '}'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE19',
      seedId: 'HTG-L01-OE19',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "Hex 0x7B corresponds to '{' and 0x7D corresponds to '}' in ASCII. Decoding '%7B' and '%7D' gives 'flag{cyber}'.",
      essentialKeyPoints: [
        "0x7B = '{', 0x7D = '}'.",
        "URL decoding of structural delimiters."
      ],
      gradingRubric: {
        fullCredit: "Submits 'flag{cyber}'.",
        partialCredit: "Submits '{cyber}'.",
        noCredit: "Submits unexpanded percent codes."
      },
      acceptableAlternatives: ['flag{cyber}', 'FLAG{CYBER}'],
      safetyNotes: 'URI delimiter parsing.'
    }
  },
  {
    stableId: 'HTG-L01-OE20',
    order: 30,
    levelNumber: 1,
    title: 'Octal Escape Sequences to ASCII',
    prompt: `A legacy shell payload prints characters using octal escape sequences (base 8):

\`\\107 \\122 \\111 \\104\`

Convert these four octal byte values into their ASCII text word.`,
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
    flag: 'GRID',
    hints: [
      {
        hintIndex: 1,
        content: "Octal 107 = 1*64 + 0*8 + 7 = 71 in decimal ('G').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE20',
      seedId: 'HTG-L01-OE20',
      subtopic: 'Signal Interpretation & Simple Encoding',
      explanation: "Converting octal to decimal: 107_8 = 71 ('G'), 122_8 = 82 ('R'), 111_8 = 73 ('I'), 104_8 = 68 ('D'). The word is 'GRID'.",
      essentialKeyPoints: [
        "Octal base 8 positional expansion.",
        "Translating POSIX octal escape characters to ASCII."
      ],
      gradingRubric: {
        fullCredit: "Submits 'GRID'.",
        partialCredit: "Submits 'grid'.",
        noCredit: "Incorrect mathematical conversion."
      },
      acceptableAlternatives: ['GRID', 'grid', 'Grid'],
      safetyNotes: 'Shell escape decoding.'
    }
  }
];

module.exports = subtopic2Questions;

