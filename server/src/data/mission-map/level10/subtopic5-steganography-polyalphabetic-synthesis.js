const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L10-OE41',
    order: 41,
    levelNumber: 10,
    title: 'Least Significant Bit (LSB) Extraction Mask',
    prompt: `In recovering hidden binary bit planes from suspect media carriers, an analyst isolates the least significant bit (Bit 0) from an 8-bit unsigned pixel channel byte.

What two-digit hexadecimal literal mask (e.g. \`0x??\`) must be applied via a bitwise AND operator to extract only Bit 0?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex literal).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{0x01}',
    hints: [
      {
        hintIndex: 1,
        content: "Bit 0 has a decimal value of 1, or 0x01 in hex.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE41',
      seedId: 'HTG-L10-OE41',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "A bitwise AND with 0x01 masks out bits 1-7, isolating bit 0.",
      essentialKeyPoints: [
        "LSB plane extraction requires bitmask 0x01.",
        "Bit 0 carries embedded steganographic payloads."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x01}' or '0x01'.",
        partialCredit: "Submits '01' or '0x1'.",
        noCredit: "Submits 0x80 or 0xFF."
      },
      acceptableAlternatives: ['HTG{0x01}', '0x01', '0x1', 'HTG{0x1}']
    }
  },
  {
    stableId: 'HTG-L10-OE42',
    order: 42,
    levelNumber: 10,
    title: 'Polyalphabetic Vigenère Modular Subtraction Character Recovery',
    prompt: `In polyalphabetic Vigenère cryptanalysis, each plaintext letter is recovered from ciphertext letter $C$ and key letter $K$ using modular subtraction:
$$P = (C - K) \\pmod{26}$$
Using standard alphabetical indices ($A=0, B=1, \\dots, Z=25$):
- Ciphertext letter: \`O\` (index 14)
- Key letter: \`K\` (index 10)
$$(14 - 10) \\pmod{26} = 4$$
What single uppercase letter corresponds to alphabetical index 4?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single letter).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{E}',
    hints: [
      {
        hintIndex: 1,
        content: "Index 0=A, 1=B, 2=C, 3=D, 4=E.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE42',
      seedId: 'HTG-L10-OE42',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "Index 4 corresponds to the letter 'E'.",
      essentialKeyPoints: [
        "Vigenère decryption subtracts key index from ciphertext index modulo 26.",
        "(14 - 10) mod 26 = 4, yielding 'E'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{E}' or 'E'.",
        partialCredit: "Submits lowercase 'e'.",
        noCredit: "Submits D or F."
      },
      acceptableAlternatives: ['HTG{E}', 'E', 'e', 'HTG{e}']
    }
  },
  {
    stableId: 'HTG-L10-OE43',
    order: 43,
    levelNumber: 10,
    title: 'Audio Spectrogram Vertical Dimension Metric',
    prompt: `When inspecting audio files for hidden spectrogram images or acoustic watermarks, analysis tools render a 2D time-frequency plot.

While the horizontal X-axis represents elapsed time, what physical acoustic property (measured in Hertz, Hz, or kilohertz, kHz) is plotted along the vertical Y-axis?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the property name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{frequency}',
    hints: [
      {
        hintIndex: 1,
        content: "The Y-axis measures frequency (in Hz).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE43',
      seedId: 'HTG-L10-OE43',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "The vertical axis of a spectrogram represents frequency.",
      essentialKeyPoints: [
        "Time is on the X-axis; frequency is on the Y-axis; color/intensity indicates amplitude.",
        "Visual steganography in audio encodes images across specific frequency bands."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{frequency}' or 'frequency'.",
        partialCredit: "Submits capitalized 'Frequency'.",
        noCredit: "Submits amplitude or pitch."
      },
      acceptableAlternatives: ['HTG{frequency}', 'frequency', 'Frequency', 'FREQUENCY', 'HTG{Frequency}']
    }
  },
  {
    stableId: 'HTG-L10-OE44',
    order: 44,
    levelNumber: 10,
    title: 'PNG Chunk Integrity Checksum Verification Failure',
    prompt: `In the PNG specification, every chunk includes a 4-byte CRC-32 checksum that verifies chunk data integrity.

If an attacker modifies bytes within a PNG chunk to inject a steganographic message but fails to recompute this checksum, what generic condition or error (known as a "CRC ..." or "checksum ...") will compliant PNG decoders report?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word phrase).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{CRC error}',
    hints: [
      {
        hintIndex: 1,
        content: "The condition is a CRC error (or checksum mismatch).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE44',
      seedId: 'HTG-L10-OE44',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "A CRC error or checksum mismatch occurs when PNG chunk bytes do not match the declared CRC-32.",
      essentialKeyPoints: [
        "PNG decoders discard or abort on CRC errors.",
        "Forensic tools use CRC mismatches to locate tampered chunks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CRC error}' or 'CRC error'.",
        partialCredit: "Submits 'checksum mismatch' or 'CRC mismatch'.",
        noCredit: "Submits parsing error."
      },
      acceptableAlternatives: ['HTG{CRC error}', 'CRC error', 'crc error', 'checksum mismatch', 'CRC mismatch', 'HTG{checksum mismatch}']
    }
  },
  {
    stableId: 'HTG-L10-OE45',
    order: 45,
    levelNumber: 10,
    title: 'JPEG End of Image (EOI) Hexadecimal Marker',
    prompt: `In analyzing file slack and trailer injection steganography in JPEG images, investigators scan for the standard 2-byte marker code that formally terminates the JPEG datastream.

What 4-digit hexadecimal marker code (beginning with \`0xFF\`) represents the JPEG End of Image (EOI) marker?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-digit hex code).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{0xFFD9}',
    hints: [
      {
        hintIndex: 1,
        content: "The JPEG EOI marker is 0xFFD9.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE45',
      seedId: 'HTG-L10-OE45',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "0xFFD9 is the JPEG End of Image (EOI) marker.",
      essentialKeyPoints: [
        "Bytes appended past 0xFFD9 are ignored by image renderers.",
        "Forensic carvers extract appended ZIP or RAR archives located after 0xFFD9."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xFFD9}' or '0xFFD9'.",
        partialCredit: "Submits 'FFD9' or '0xffd9'.",
        noCredit: "Submits 0xFFD8."
      },
      acceptableAlternatives: ['HTG{0xFFD9}', '0xFFD9', '0xffd9', 'FFD9', 'ffd9', 'HTG{ffd9}']
    }
  },
  {
    stableId: 'HTG-L10-OE46',
    order: 46,
    levelNumber: 10,
    title: 'Highest Entropy Noise Bit Plane Index',
    prompt: `In 8-bit digital image bit-plane slicing, an image is separated into eight binary layers indexed from 0 to 7.

While Bit Plane 7 contains the most significant structural contours of the image, which bit plane index (0 through 7) contains the lowest visual weight, the highest degree of random visual noise, and the lowest perceptual degradation when modified?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer index).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{0}',
    hints: [
      {
        hintIndex: 1,
        content: "Bit plane 0 carries the least significant bit (weight 2^0 = 1).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE46',
      seedId: 'HTG-L10-OE46',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "Bit plane 0 corresponds to the least significant bit and exhibits the highest noise characteristics.",
      essentialKeyPoints: [
        "Bit plane 0 is the primary target for spatial LSB steganography.",
        "Bit plane 7 preserves high-level image contours."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'zero'.",
        noCredit: "Submits 7."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'zero', 'HTG{zero}']
    }
  },
  {
    stableId: 'HTG-L10-OE47',
    order: 47,
    levelNumber: 10,
    title: 'Reciprocal Caesar ROT-13 Rotation Distance',
    prompt: `The ROT-13 cipher is a special case of the Caesar cipher that rotates the 26-letter English alphabet by half its length, making the cipher self-reciprocal (the same function encrypts and decrypts).

By how many alphabetical letter positions (as an integer) does ROT-13 shift characters?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer value).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{13}',
    hints: [
      {
        hintIndex: 1,
        content: "ROT-13 rotates letters by 13 positions.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE47',
      seedId: 'HTG-L10-OE47',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "ROT-13 rotates alphabetic characters by 13 positions, which equals 26 / 2.",
      essentialKeyPoints: [
        "Applying ROT-13 twice returns the original plaintext.",
        "It is widely used in obfuscation and puzzle construction."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{13}' or '13'.",
        partialCredit: "Submits 'thirteen'.",
        noCredit: "Submits 26 or 7."
      },
      acceptableAlternatives: ['HTG{13}', '13', 'thirteen', 'HTG{thirteen}']
    }
  },
  {
    stableId: 'HTG-L10-OE48',
    order: 48,
    levelNumber: 10,
    title: 'Standard Base64 Padding Character',
    prompt: `In Base64 encoding (RFC 4648), binary data is encoded in 6-bit chunks mapped to a 64-character ASCII alphabet.

When the total number of input bytes is not evenly divisible by 3, what single ASCII punctuation character is appended as padding to make the final encoded string length a multiple of 4?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single character).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{=}',
    hints: [
      {
        hintIndex: 1,
        content: "The equals sign '=' is the Base64 padding character.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE48',
      seedId: 'HTG-L10-OE48',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "The equals sign '=' pads Base64 strings to a multiple of 4 characters.",
      essentialKeyPoints: [
        "One '=' indicates 2 bytes were encoded; two '==' indicate 1 byte was encoded.",
        "Padding is optional in some modern variants (Base64URL unpadded)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{=}' or '='.",
        partialCredit: "Submits 'equals' or 'equal sign'.",
        noCredit: "Submits + or /."
      },
      acceptableAlternatives: ['HTG{=}', '=', 'equals', 'equal sign', 'HTG{equals}']
    }
  },
  {
    stableId: 'HTG-L10-OE49',
    order: 49,
    levelNumber: 10,
    title: 'JPEG Lossy Discrete Cosine Transform Quantization Step',
    prompt: `In JPEG image compression, after spatial pixel blocks are transformed into frequency coefficients via the Discrete Cosine Transform (DCT), the coefficients undergo a lossy step that discards high-frequency detail by dividing them by predetermined values and rounding to integers.

What is the technical name for this division and rounding stage that governs compression quality and file size?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{quantization}',
    hints: [
      {
        hintIndex: 1,
        content: "Dividing DCT coefficients by a step size is called quantization.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE49',
      seedId: 'HTG-L10-OE49',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "Quantization is the lossy compression step in JPEG that divides DCT coefficients by a table of weights.",
      essentialKeyPoints: [
        "Quantization discards imperceptible high frequencies.",
        "Modifying quantized coefficients enables frequency-domain steganography."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{quantization}' or 'quantization'.",
        partialCredit: "Submits capitalized 'Quantization'.",
        noCredit: "Submits transformation or entropy encoding."
      },
      acceptableAlternatives: ['HTG{quantization}', 'quantization', 'Quantization', 'QUANTIZATION', 'HTG{Quantization}']
    }
  },
  {
    stableId: 'HTG-L10-OE50',
    order: 50,
    levelNumber: 10,
    title: 'Recovered Obfuscated Caesar Cipher Steganographic Message',
    prompt: `An investigator carves a custom ancillary chunk \`cOVR\` from a citadel badge image and uncovers an obfuscated message string:
\`\`\`text
KHOOR_FLWDGHO
\`\`\`
The message was encrypted using a classic Caesar shift with a rotation offset of +3 ($C = P + 3$).

Decrypting each letter by shifting backwards by 3 positions ($P = C - 3$):
\`\`\`text
K (-3) -> H
H (-3) -> E
O (-3) -> L
O (-3) -> L
R (-3) -> O
_      -> _
F (-3) -> C
L (-3) -> I
W (-3) -> T
D (-3) -> A
G (-3) -> D
H (-3) -> E
O (-3) -> L
\`\`\`
What is the complete decrypted uppercase plaintext message?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{HELLO_CITADEL}',
    hints: [
      {
        hintIndex: 1,
        content: "Shifting KHOOR_FLWDGHO back by 3 reveals HELLO_CITADEL.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE50',
      seedId: 'HTG-L10-OE50',
      subtopic: 'Cross-synthesis of Logic & Steganography',
      explanation: "Decryption with Caesar shift -3 produces 'HELLO_CITADEL'.",
      essentialKeyPoints: [
        "Caesar cipher shifts characters cyclically across the 26-letter alphabet.",
        "The string provides the fifth sub-key in the citadel puzzle sequence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{HELLO_CITADEL}'.",
        partialCredit: "Submits 'HELLO_CITADEL' without curly braces.",
        noCredit: "Submits incorrect plaintext."
      },
      acceptableAlternatives: ['HTG{HELLO_CITADEL}', 'HELLO_CITADEL', 'hello_citadel', 'HTG{hello_citadel}']
    }
  }
];

module.exports = subtopic5Questions;

