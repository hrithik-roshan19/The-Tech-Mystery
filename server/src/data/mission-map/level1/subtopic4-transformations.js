const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L01-OE31',
    order: 41,
    levelNumber: 1,
    title: 'Hexadecimal to Plaintext Flag Decoding',
    prompt: `An encoded security flag was extracted from a binary firmware string pool:

\`4854477b66697273745f737465707d\`

Decode this hexadecimal character sequence into the complete ASCII flag string.`,
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
    flag: 'HTG{first_step}',
    hints: [
      {
        hintIndex: 1,
        content: "Convert each pair of hex digits into ASCII: 48='H', 54='T', 47='G', 7b='{'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE31',
      seedId: 'HTG-L01-OE31',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "Converting hex pairs: 48->H, 54->T, 47->G, 7b->{, 66->f, 69->i, 72->r, 73->s, 74->t, 5f->_, 73->s, 74->t, 65->e, 70->p, 7d->}. Result is 'HTG{first_step}'.",
      essentialKeyPoints: [
        "Hex to ASCII string transformation.",
        "Delimiters 7b ('{') and 7d ('}')."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{first_step}'.",
        partialCredit: "Submits inner token 'first_step'.",
        noCredit: "Incorrect decoding or invalid string."
      },
      acceptableAlternatives: ['HTG{first_step}', 'htg{first_step}'],
      safetyNotes: 'Standard hex decoding exercise.'
    }
  },
  {
    stableId: 'HTG-L01-OE32',
    order: 42,
    levelNumber: 1,
    title: 'Classical ROT13 Caesar Decryption',
    prompt: `A communication channel applies ROT13 substitution to obscure flag tokens in transit:

\`UGT{ebg13_fhpprff}\`

Apply standard ROT13 rotation to decrypt the ciphertext string and recover the official flag.`,
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
    flag: 'HTG{rot13_success}',
    hints: [
      {
        hintIndex: 1,
        content: "Rotate each English letter forward or backward by 13 positions. Numbers and braces remain unchanged.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE32',
      seedId: 'HTG-L01-OE32',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "ROT13 rotates characters by 13 positions in the 26-letter Latin alphabet. U->H, G->T, T->G, e->r, b->o, g->t, 1->1, 3->3, f->s, h->u, p->c, p->c, r->e, f->s, f->s. The decrypted flag is 'HTG{rot13_success}'.",
      essentialKeyPoints: [
        "ROT13 is self-reciprocal (rotating 13 twice returns original).",
        "Non-alphabetical characters (numbers, braces, underscores) are not shifted."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rot13_success}'.",
        partialCredit: "Submits 'rot13_success'.",
        noCredit: "Leaves in ROT13 or incorrect rotation."
      },
      acceptableAlternatives: ['HTG{rot13_success}', 'htg{rot13_success}'],
      safetyNotes: 'Classical substitution decryption.'
    }
  },
  {
    stableId: 'HTG-L01-OE33',
    order: 43,
    levelNumber: 1,
    title: 'Layered Transformation Hex and Base64',
    prompt: `A payload was protected with two layers of encoding:

\`534652486532786865575679587a4a39\`

Step 1: Convert the hexadecimal string into an ASCII Base64 string.
Step 2: Decode the Base64 string to obtain the final flag.

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
    flag: 'HTG{layer_2}',
    hints: [
      {
        hintIndex: 1,
        content: "Converting hex gives 'SFRHe2xheWVyXzJ9'. Then decode that as Base64.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE33',
      seedId: 'HTG-L01-OE33',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "Hex decode of '534652486532786865575679587a4a39' produces Base64 string 'SFRHe2xheWVyXzJ9'. Base64 decoding this gives 'HTG{layer_2}'.",
      essentialKeyPoints: [
        "Layered decoding pipelines.",
        "Recognizing intermediate Base64 output."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{layer_2}'.",
        partialCredit: "Submits intermediate Base64 string 'SFRHe2xheWVyXzJ9'.",
        noCredit: "Submits incorrect decode."
      },
      acceptableAlternatives: ['HTG{layer_2}', 'htg{layer_2}'],
      safetyNotes: 'Multi-stage transformation pipeline.'
    }
  },
  {
    stableId: 'HTG-L01-OE34',
    order: 44,
    levelNumber: 1,
    title: 'Reversed String Character Inversion',
    prompt: `A telemetry transmission buffer inverted its character write pointer, recording the flag backwards:

\`}d3sr3v3r_l4ng1s{GTH\`

Reverse the character sequence to recover the original competition flag.`,
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
    flag: 'HTG{s1gn4l_r3v3rs3d}',
    hints: [
      {
        hintIndex: 1,
        content: "Read the characters from right to left.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE34',
      seedId: 'HTG-L01-OE34',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "Reversing '}d3sr3v3r_l4ng1s{GTH' starting with the last letter 'H', then 'T', then 'G', '{', etc., produces 'HTG{s1gn4l_r3v3rs3d}'.",
      essentialKeyPoints: [
        "String reversal technique.",
        "Symmetric structure preservation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{s1gn4l_r3v3rs3d}'.",
        partialCredit: "Submits 's1gn4l_r3v3rs3d'.",
        noCredit: "Submits unreversed string."
      },
      acceptableAlternatives: ['HTG{s1gn4l_r3v3rs3d}', 'htg{s1gn4l_r3v3rs3d}'],
      safetyNotes: 'Buffer reversal exercise.'
    }
  },
  {
    stableId: 'HTG-L01-OE35',
    order: 45,
    levelNumber: 1,
    title: 'Known-Plaintext Single-Byte XOR Key Recovery',
    prompt: `The first three bytes of an encrypted radio message are given in hexadecimal:

\`0x17 0x0B 0x18\`

You know from protocol specifications that the original plaintext begins with the known prefix 'HTG' (ASCII bytes 0x48 0x54 0x47).

Because Ciphertext = Plaintext XOR Key, it follows that Key = Plaintext XOR Ciphertext.

What single-byte hexadecimal key was used to encrypt this message? (Submit in hex, e.g. 0xXX).`,
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
    flag: '0x5F',
    hints: [
      {
        hintIndex: 1,
        content: "0x17 XOR 0x48 = 0x5F. Verify with 0x0B XOR 0x54.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE35',
      seedId: 'HTG-L01-OE35',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "Using known-plaintext attack: 'H' is 0x48; 0x17 XOR 0x48 = 0x5F. 'T' is 0x54; 0x0B XOR 0x54 = 0x5F. 'G' is 0x47; 0x18 XOR 0x47 = 0x5F. The single-byte XOR key is 0x5F (decimal 95, ASCII '_').",
      essentialKeyPoints: [
        "Known-plaintext XOR property: P ^ C = K.",
        "Consistency verification across multiple known bytes."
      ],
      gradingRubric: {
        fullCredit: "Submits '0x5F' or '5F'.",
        partialCredit: "Submits decimal 95.",
        noCredit: "Submits incorrect key byte."
      },
      acceptableAlternatives: ['0x5F', '5F', '0x5f', '5f', '95'],
      safetyNotes: 'Known-plaintext cryptanalysis concept.'
    }
  },
  {
    stableId: 'HTG-L01-OE36',
    order: 46,
    levelNumber: 1,
    title: 'Single-Byte XOR Cipher Decryption',
    prompt: `An encrypted transmission contains the following 8 hexadecimal bytes:

\`68 74 67 5b 7a 6f 72 5d\`

The key is known to be the single byte 0x20.

Perform a bitwise XOR between each byte and 0x20, and convert the resulting bytes into ASCII to reveal the complete flag.`,
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
    flag: 'HTG{ZOR}',
    hints: [
      {
        hintIndex: 1,
        content: "0x68 ^ 0x20 = 0x48 ('H'), 0x74 ^ 0x20 = 0x54 ('T'), 0x5b ^ 0x20 = 0x7b ('{').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE36',
      seedId: 'HTG-L01-OE36',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "Applying XOR 0x20 to each byte: 0x68^0x20=0x48 ('H'), 0x74^0x20=0x54 ('T'), 0x67^0x20=0x47 ('G'), 0x5b^0x20=0x7b ('{'), 0x7a^0x20=0x5a ('Z'), 0x6f^0x20=0x4f ('O'), 0x72^0x20=0x52 ('R'), 0x5d^0x20=0x7d ('}'). Result: 'HTG{ZOR}'.",
      essentialKeyPoints: [
        "XOR decryption with fixed key.",
        "Byte-by-byte mapping to ASCII characters."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ZOR}'.",
        partialCredit: "Submits lowercase 'HTG{zor}' or 'ZOR'.",
        noCredit: "Incorrect decryption."
      },
      acceptableAlternatives: ['HTG{ZOR}', 'htg{zor}', 'HTG{zor}'],
      safetyNotes: 'Symmetric XOR decryption.'
    }
  },
  {
    stableId: 'HTG-L01-OE37',
    order: 47,
    levelNumber: 1,
    title: 'Double Base64 Layer Unwrapping',
    prompt: `An obfuscation script applied Base64 encoding twice consecutively:

\`U0ZSSGUzVnVkM0poY0gwPQ==\`

Step 1: Perform the first Base64 decoding.
Step 2: Perform the second Base64 decoding on the intermediate result to obtain the final flag.

Submit the recovered flag string.`,
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
    flag: 'HTG{unwrap}',
    hints: [
      {
        hintIndex: 1,
        content: "First decode gives 'SFRHe3Vud3JhcH0='. Then decode that again.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE37',
      seedId: 'HTG-L01-OE37',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "First decoding of 'U0ZSSGUzVnVkM0poY0gwPQ==' yields 'SFRHe3Vud3JhcH0='. Second decoding yields 'HTG{unwrap}'.",
      essentialKeyPoints: [
        "Iterative encoding unwrapping.",
        "Recognizing valid Base64 intermediate strings."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{unwrap}'.",
        partialCredit: "Submits intermediate Base64 string 'SFRHe3Vud3JhcH0='.",
        noCredit: "Incorrect decode."
      },
      acceptableAlternatives: ['HTG{unwrap}', 'htg{unwrap}'],
      safetyNotes: 'Layered encoding inspection.'
    }
  },
  {
    stableId: 'HTG-L01-OE38',
    order: 48,
    levelNumber: 1,
    title: 'Decimal Byte Stream to Flag',
    prompt: `A network monitoring probe recorded an array of decimal ASCII character values:

\`[72, 84, 71, 123, 112, 97, 99, 107, 101, 116, 125]\`

Convert this sequence of 11 decimal ASCII byte values into the complete flag string.`,
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
    flag: 'HTG{packet}',
    hints: [
      {
        hintIndex: 1,
        content: "72='H', 84='T', 71='G', 123='{', 112='p', 97='a', 99='c', 107='k', 101='e', 116='t', 125='}'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE38',
      seedId: 'HTG-L01-OE38',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "72->H, 84->T, 71->G, 123->{, 112->p, 97->a, 99->c, 107->k, 101->e, 116->t, 125->}. String: 'HTG{packet}'.",
      essentialKeyPoints: [
        "Decimal byte array decoding.",
        "Reconstruction of formatted CTF flag."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{packet}'.",
        partialCredit: "Submits 'packet'.",
        noCredit: "Incorrect characters."
      },
      acceptableAlternatives: ['HTG{packet}', 'htg{packet}'],
      safetyNotes: 'Packet payload reconstruction.'
    }
  },
  {
    stableId: 'HTG-L01-OE39',
    order: 49,
    levelNumber: 1,
    title: 'Bitwise Inversion of Byte Value',
    prompt: `A communication channel uses an active-low inverted signaling standard where each bit is inverted (bitwise NOT, or 1's complement).

If a transmitted byte is received as \`0xAA\` (\`10101010\` in binary), what is the resulting hexadecimal byte value after applying a bitwise NOT operation masked to 8 bits (\`0xFF ^ 0xAA\`)? (Submit in hex, e.g. 0xXX).`,
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
    flag: '0x55',
    hints: [
      {
        hintIndex: 1,
        content: "Invert each bit: 1 becomes 0, 0 becomes 1. 10101010 becomes 01010101.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE39',
      seedId: 'HTG-L01-OE39',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "Inverting '10101010' bitwise gives '01010101'. In hexadecimal, 0101 = 5, so the byte is 0x55 (decimal 85).",
      essentialKeyPoints: [
        "1's complement bitwise inversion.",
        "0xAA and 0x55 are complementary bit patterns."
      ],
      gradingRubric: {
        fullCredit: "Submits '0x55' or '55'.",
        partialCredit: "Submits binary '01010101'.",
        noCredit: "Incorrect inversion."
      },
      acceptableAlternatives: ['0x55', '55', '0X55', '55h'],
      safetyNotes: 'Inverted signaling analysis.'
    }
  },
  {
    stableId: 'HTG-L01-OE40',
    order: 50,
    levelNumber: 1,
    title: 'Binary Byte Sequence to Flag',
    prompt: `A logic analyzer dumped 8 consecutive binary bytes:

\`01001000 01010100 01000111 01111011 01100010 01101001 01110100 01111101\`

Convert this 8-byte sequence into the complete ASCII flag string.`,
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
    flag: 'HTG{bit}',
    hints: [
      {
        hintIndex: 1,
        content: "01001000='H', 01010100='T', 01000111='G', 01111011='{', 01100010='b', 01101001='i', 01110100='t', 01111101='}'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE40',
      seedId: 'HTG-L01-OE40',
      subtopic: 'Basic Decoding & Multi-Step Data Transformation',
      explanation: "Decoding binary bytes: 01001000='H', 01010100='T', 01000111='G', 01111011='{', 01100010='b', 01101001='i', 01110100='t', 01111101='}'. Result: 'HTG{bit}'.",
      essentialKeyPoints: [
        "Binary to ASCII conversion.",
        "8-bit framing boundaries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{bit}'.",
        partialCredit: "Submits 'bit'.",
        noCredit: "Incorrect character translation."
      },
      acceptableAlternatives: ['HTG{bit}', 'htg{bit}'],
      safetyNotes: 'Binary stream decoding.'
    }
  }
];

module.exports = subtopic4Questions;

