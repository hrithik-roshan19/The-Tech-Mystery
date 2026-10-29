const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L09-OE21',
    order: 21,
    levelNumber: 9,
    title: 'Baseline JPEG Discrete Cosine Transform (DCT) Block Dimensions',
    prompt: `In baseline JPEG image compression (ISO/IEC 10918-1), the input image channels are subdivided into non-overlapping square spatial pixel blocks before applying the 2D Discrete Cosine Transform (DCT).

Each square block is transformed into a matching grid of spatial frequency coefficients.

What are the pixel dimensions of this standard square transformation block (formatted as width x height, e.g. 16x16 or 8x8)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the dimensions).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{8x8}',
    hints: [
      {
        hintIndex: 1,
        content: "JPEG processes images in 8 by 8 pixel blocks (8x8).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE21',
      seedId: 'HTG-L09-OE21',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "Standard JPEG partitions images into 8x8 pixel blocks for DCT transformation.",
      essentialKeyPoints: [
        "Each 8x8 block yields 64 DCT coefficients (1 DC and 63 AC).",
        "Steganography in JPEG operates by modulating these 8x8 block coefficients."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{8x8}' or '8x8'.",
        partialCredit: "Submits '8 x 8' or '8*8'.",
        noCredit: "Submits 16x16 or 4x4."
      },
      acceptableAlternatives: ['HTG{8x8}', '8x8', '8 x 8', '8*8', 'HTG{8 x 8}']
    }
  },
  {
    stableId: 'HTG-L09-OE22',
    order: 22,
    levelNumber: 9,
    title: 'Zero-Frequency Direct Current (DC) Coefficient Designation',
    prompt: `Within an 8x8 JPEG DCT coefficient block, the coefficient located at coordinate $(0, 0)$ (the top-left corner) represents the zero-frequency component proportional to the average luminance of all 64 pixels in the block.

The remaining 63 coefficients represent alternating frequencies (AC) across increasing horizontal and vertical spatial frequencies.

What 2-letter uppercase abbreviation designates this fundamental zero-frequency coefficient?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-letter abbreviation).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{DC}',
    hints: [
      {
        hintIndex: 1,
        content: "Zero frequency represents direct current: DC.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE22',
      seedId: 'HTG-L09-OE22',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "The DC coefficient at (0,0) represents the average block intensity; other 63 coefficients are AC.",
      essentialKeyPoints: [
        "Modifying DC coefficients causes severe visual blocking artifacts.",
        "JPEG steganographic algorithms typically target mid-frequency AC coefficients rather than the DC coefficient."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{DC}' or 'DC'.",
        partialCredit: "Submits lowercase 'dc'.",
        noCredit: "Submits AC or HF."
      },
      acceptableAlternatives: ['HTG{DC}', 'DC', 'dc', 'HTG{dc}']
    }
  },
  {
    stableId: 'HTG-L09-OE23',
    order: 23,
    levelNumber: 9,
    title: 'JSteg Algorithm Coefficient Exclusion Rules',
    prompt: `The classic JSteg steganography program (developed by Derek Upham) hides secret payload bits in the least significant bits of quantized JPEG DCT coefficients.

To prevent severe image distortion and file expansion, JSteg strictly refuses to embed bits into coefficients with a value of 0 (which would destroy run-length encoding efficiency).

Additionally, JSteg skips coefficients equal to which specific non-zero integer value because flipping its LSB would create an asymmetric shift into 0?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer value).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{1}',
    hints: [
      {
        hintIndex: 1,
        content: "JSteg skips coefficients with values 0 and 1.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE23',
      seedId: 'HTG-L09-OE23',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "JSteg skips coefficients 0 and 1 to prevent converting 1 into 0, which would distort run-length encoding.",
      essentialKeyPoints: [
        "JSteg modifies coefficients with values not equal to 0 or 1.",
        "Skipping 0 and 1 preserves JPEG Huffman coding structure."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1}' or '1'.",
        partialCredit: "Submits 'one'.",
        noCredit: "Submits 2 or -1."
      },
      acceptableAlternatives: ['HTG{1}', '1', 'one', 'HTG{one}']
    }
  },
  {
    stableId: 'HTG-L09-OE24',
    order: 24,
    levelNumber: 9,
    title: 'OutGuess Statistical Histogram Compensation Mechanism',
    prompt: `To defeat first-order statistical attacks (such as the Chi-Square test on DCT coefficients), Niels Provos created the OutGuess steganography tool.

OutGuess operates in two passes:
1. It embeds the secret message into a pseudorandom selection of DCT coefficients.
2. In the second pass, it utilizes the remaining unused coefficients to deliberately correct and restore the original global DCT coefficient histogram.

What 2-word phrase describes this process of adjusting redundant carrier elements to preserve original probability distributions?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word phrase).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{statistical compensation}',
    hints: [
      {
        hintIndex: 1,
        content: "The technique is known as statistical compensation (or histogram preservation).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE24',
      seedId: 'HTG-L09-OE24',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "Statistical compensation modifies unused coefficients to neutralize histogram shifts caused by embedding.",
      essentialKeyPoints: [
        "OutGuess reserves part of the cover capacity for statistical restoration.",
        "It successfully defeats standard chi-square attacks by maintaining first-order histogram shape."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{statistical compensation}' or 'statistical compensation'.",
        partialCredit: "Submits 'histogram preservation' or 'statistical correction'.",
        noCredit: "Submits encryption or compression."
      },
      acceptableAlternatives: ['HTG{statistical compensation}', 'statistical compensation', 'Statistical Compensation', 'histogram preservation', 'statistical correction', 'HTG{histogram preservation}']
    }
  },
  {
    stableId: 'HTG-L09-OE25',
    order: 25,
    levelNumber: 9,
    title: 'F5 Algorithm Absolute Magnitude Shrinkage Phenomenon',
    prompt: `In the F5 steganography algorithm proposed by Andreas Westfeld, matrix embedding is combined with decremental modification.

When a DCT coefficient must be changed, F5 decrements its absolute value by 1 ($|c|' = |c| - 1$). If this reduction causes a coefficient with absolute value 1 to become 0 ($|c| = 1 \\to 0$), the coefficient can no longer carry a message bit because the extractor skips zeros.

This event requires the embedder to re-embed the message bit in the next coefficient group.

What specific single-word term did Westfeld introduce to describe this phenomenon of coefficients collapsing to zero and requiring re-embedding?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single word).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{shrinkage}',
    hints: [
      {
        hintIndex: 1,
        content: "Coefficients dropping to zero are said to suffer shrinkage.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE25',
      seedId: 'HTG-L09-OE25',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "In F5, 'shrinkage' refers to non-zero coefficients becoming zero when decremented, necessitating re-embedding.",
      essentialKeyPoints: [
        "Shrinkage reduces the effective capacity of the F5 matrix embedding matrix.",
        "The F5 receiver skips all zero coefficients, so any coefficient shrunk to zero is invisible to extraction."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{shrinkage}' or 'shrinkage'.",
        partialCredit: "Submits capitalized 'Shrinkage'.",
        noCredit: "Submits clipping or attenuation."
      },
      acceptableAlternatives: ['HTG{shrinkage}', 'shrinkage', 'Shrinkage', 'coefficient shrinkage', 'HTG{Shrinkage}']
    }
  },
  {
    stableId: 'HTG-L09-OE26',
    order: 26,
    levelNumber: 9,
    title: 'Discrete Wavelet Transform (DWT) Approximation Subband',
    prompt: `In 2D single-level Discrete Wavelet Transform (DWT) decomposition, an image is filtered through low-pass and high-pass quadrature mirror filters horizontally and vertically, yielding four distinct frequency subbands:
\`\`\`text
[ LL ] [ HL ]
[ LH ] [ HH ]
\`\`\`
Which 2-letter subband designation represents the low-frequency approximation of the image that contains the vast majority of visual energy and structural content?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-letter subband).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{LL}',
    hints: [
      {
        hintIndex: 1,
        content: "Low-pass in both horizontal and vertical directions is the LL subband.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE26',
      seedId: 'HTG-L09-OE26',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "The LL (Low-Low) subband is the low-frequency approximation containing the primary visual information.",
      essentialKeyPoints: [
        "LH, HL, and HH contain directional detail subbands (horizontal, vertical, diagonal).",
        "Steganography typically embeds into high or middle frequency subbands (LH, HL, HH) to preserve perceptual quality."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{LL}' or 'LL'.",
        partialCredit: "Submits lowercase 'll'.",
        noCredit: "Submits HH or LH."
      },
      acceptableAlternatives: ['HTG{LL}', 'LL', 'll', 'HTG{ll}']
    }
  },
  {
    stableId: 'HTG-L09-OE27',
    order: 27,
    levelNumber: 9,
    title: 'JPEG Define Quantization Table (DQT) Header Marker',
    prompt: `In the binary structure of a JPEG (JFIF) file, distinct segments are preceded by 2-byte marker codes starting with \`0xFF\`.

Which 4-digit hexadecimal marker code (beginning with \`0xFF\`) identifies the \`Define Quantization Table\` (DQT) segment that specifies the 64 divisor values used to quantize DCT coefficients?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-digit hex code).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{0xFFDB}',
    hints: [
      {
        hintIndex: 1,
        content: "Define Quantization Table in JPEG is marker 0xFFDB.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE27',
      seedId: 'HTG-L09-OE27',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "The JPEG marker 0xFFDB defines quantization tables (DQT).",
      essentialKeyPoints: [
        "DQT tables dictate how aggressively spatial frequencies are discarded.",
        "Custom quantization tables in DQT can serve as steganographic channels or fingerprint tampering tools."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xFFDB}' or '0xFFDB'.",
        partialCredit: "Submits 'FFDB' or '0xffdb'.",
        noCredit: "Submits 0xFFC0 or 0xFFC4."
      },
      acceptableAlternatives: ['HTG{0xFFDB}', '0xFFDB', '0xffdb', 'FFDB', 'ffdb', 'HTG{ffdb}']
    }
  },
  {
    stableId: 'HTG-L09-OE28',
    order: 28,
    levelNumber: 9,
    title: 'Fast Fourier Transform 2D Spectrum Centering Operation',
    prompt: `When computing the 2D Fast Fourier Transform (FFT) of an image, standard algorithms place the zero-frequency DC component at the top-left origin $(0,0)$.

To visualize the magnitude spectrum intuitively with low frequencies concentrated at the center and high frequencies radiating toward the periphery, quadrants are swapped diagonally.

What standard scientific computing function name (commonly found in MATLAB, SciPy, and NumPy) performs this quadrant-shift operation?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{fftshift}',
    hints: [
      {
        hintIndex: 1,
        content: "numpy.fft.fftshift performs this zero-frequency centering.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE28',
      seedId: 'HTG-L09-OE28',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "fftshift swaps frequency quadrants so that the DC component is centered.",
      essentialKeyPoints: [
        "Centering the 2D FFT magnitude spectrum highlights periodic watermarks and frequency-domain impulses.",
        "Synthetic frequency peaks appear as bright symmetric constellations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{fftshift}' or 'fftshift'.",
        partialCredit: "Submits 'fft_shift' or 'fftShift'.",
        noCredit: "Submits ifft or rfft."
      },
      acceptableAlternatives: ['HTG{fftshift}', 'fftshift', 'fftShift', 'FFTSHIFT', 'fft_shift', 'HTG{FFTSHIFT}']
    }
  },
  {
    stableId: 'HTG-L09-OE29',
    order: 29,
    levelNumber: 9,
    title: 'JPEG Huffman Run-Length End of Block (EOB) Symbol',
    prompt: `During JPEG entropy encoding, zigzag-ordered quantized AC coefficients are scanned until all remaining coefficients in the 8x8 block are zero.

Instead of writing individual zero runs for all remaining trailing positions, JPEG inserts a compact Huffman code indicating that all remaining coefficients in the block are zero.

What 3-letter uppercase acronym represents this "End of Block" terminating symbol?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{EOB}',
    hints: [
      {
        hintIndex: 1,
        content: "End of Block is abbreviated EOB.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE29',
      seedId: 'HTG-L09-OE29',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "EOB (End of Block) terminates the AC coefficient sequence in an 8x8 block when only zeros remain.",
      essentialKeyPoints: [
        "EOB enables compact representation of high-frequency zeros.",
        "Steganographic algorithms avoid modifying zero coefficients after EOB to maintain compression ratio."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{EOB}' or 'EOB'.",
        partialCredit: "Submits lowercase 'eob'.",
        noCredit: "Submits EOF or EOS."
      },
      acceptableAlternatives: ['HTG{EOB}', 'EOB', 'eob', 'HTG{eob}']
    }
  },
  {
    stableId: 'HTG-L09-OE30',
    order: 30,
    levelNumber: 9,
    title: 'Quantized DCT AC Coefficient Stream LSB Decoding',
    prompt: `An analyst extracts the first 8 non-zero quantized AC coefficients in zigzag order from a suspect JPEG 8x8 luminance block:
\`\`\`text
Index 1:  +4  -> |+4| % 2 = 0
Index 2:  +7  -> |+7| % 2 = 1
Index 3:  -3  -> |-3| % 2 = 1
Index 4:  +2  -> |+2| % 2 = 0
Index 5:  +6  -> |+6| % 2 = 0
Index 6:  -5  -> |-5| % 2 = 1
Index 7:  +8  -> |+8| % 2 = 0
Index 8:  -2  -> |-2| % 2 = 0
\`\`\`
Assembling these 8 extracted parity bits in big-endian order yields the binary byte:
\`\`\`text
Binary: 0 1 1 0 0 1 0 0  (Hexadecimal: 0x64, Decimal: 100)
\`\`\`
What single lowercase ASCII character corresponds to decimal \`100\` (\`0x64\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single character).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: true,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{d}',
    hints: [
      {
        hintIndex: 1,
        content: "Decimal 100 in ASCII is the lowercase letter 'd' ('a' is 97, 'b' is 98, 'c' is 99, 'd' is 100).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE30',
      seedId: 'HTG-L09-OE30',
      subtopic: 'Frequency domain & transform steganography',
      explanation: "0x64 is decimal 100, which maps to lowercase ASCII 'd'.",
      essentialKeyPoints: [
        "DCT coefficient parity extraction recovers embedded bit sequences.",
        "0x64 is lowercase 'd'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{d}' or 'd'.",
        partialCredit: "Submits '0x64' or '100'.",
        noCredit: "Submits uppercase 'D'."
      },
      acceptableAlternatives: ['HTG{d}', 'd', 'HTG{D}']
    }
  }
];

module.exports = subtopic3Questions;
