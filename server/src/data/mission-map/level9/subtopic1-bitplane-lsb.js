const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L09-OE01',
    order: 1,
    levelNumber: 9,
    title: 'Least Significant Bit (LSB) Bitmask Extraction',
    prompt: `In digital image steganography, extracting the least significant bit (Bit Plane 0) from an 8-bit grayscale pixel byte requires isolating the 0th bit while discarding the 7 higher-order bits.
\`\`\`c
uint8_t extract_lsb(uint8_t pixel_byte) {
    return pixel_byte & BITMASK;
}
\`\`\`
What two-digit hexadecimal literal should be used for \`BITMASK\` to isolate exclusively the least significant bit?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hexadecimal value).`,
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
    flag: 'HTG{0x01}',
    hints: [
      {
        hintIndex: 1,
        content: "Bit 0 has a decimal weight of 1, represented in hex as 0x01.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE01',
      seedId: 'HTG-L09-OE01',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "Bitwise AND with 0x01 isolates bit 0 (the least significant bit) in an 8-bit integer.",
      essentialKeyPoints: [
        "LSB plane 0 holds noise-like visual entropy where secret bits are embedded.",
        "A bitmask of 0x01 isolates the lowest-order bit in binary byte manipulation."
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
    stableId: 'HTG-L09-OE02',
    order: 2,
    levelNumber: 9,
    title: 'Standard Uncompressed Pixel Channel Extraction Sequence',
    prompt: `When inspecting uncompressed 24-bit TrueColor image raster data in standard W3C RGB order, each pixel is structured as three sequential 8-bit color channel bytes.
\`\`\`text
Offset +0: Red channel byte (8 bits)
Offset +1: Green channel byte (8 bits)
Offset +2: Blue channel byte (8 bits)
\`\`\`
What 3-letter uppercase acronym represents this canonical color component order?

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
    flag: 'HTG{RGB}',
    hints: [
      {
        hintIndex: 1,
        content: "Red, Green, Blue in canonical additive color order is RGB.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE02',
      seedId: 'HTG-L09-OE02',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "Canonical pixel serialization across web standards orders channels as Red, Green, Blue (RGB).",
      essentialKeyPoints: [
        "Uncompressed 24-bit raster data sequences three bytes per pixel: R, G, and B.",
        "OpenCV historically orders channels in reverse as BGR."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RGB}' or 'RGB'.",
        partialCredit: "Submits lowercase 'rgb'.",
        noCredit: "Submits CMYK or YUV."
      },
      acceptableAlternatives: ['HTG{RGB}', 'RGB', 'rgb', 'HTG{rgb}']
    }
  },
  {
    stableId: 'HTG-L09-OE03',
    order: 3,
    levelNumber: 9,
    title: 'Single-Channel LSB Pixel Requirement Calculation',
    prompt: `An operator embeds an uncompressed secret payload into a 24-bit TrueColor image by replacing exactly 1 bit per pixel, restricted exclusively to the Blue color channel's least significant bit.

How many consecutive pixels are required to embed and subsequently reconstruct exactly one 8-bit ASCII character byte?

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
    flag: 'HTG{8}',
    hints: [
      {
        hintIndex: 1,
        content: "Each pixel yields 1 bit from its Blue channel. An 8-bit byte needs 8 bits.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE03',
      seedId: 'HTG-L09-OE03',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "Extracting 8 bits at a rate of 1 bit per pixel requires exactly 8 consecutive pixels.",
      essentialKeyPoints: [
        "1 bit per pixel across a single channel yields an embedding rate of 1/8 byte per pixel.",
        "8 pixels are required to reconstruct an 8-bit byte."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{8}' or '8'.",
        partialCredit: "Submits 'eight'.",
        noCredit: "Submits 24 or 1."
      },
      acceptableAlternatives: ['HTG{8}', '8', 'eight', 'HTG{eight}']
    }
  },
  {
    stableId: 'HTG-L09-OE04',
    order: 4,
    levelNumber: 9,
    title: 'Highest Perceptual Energy Bit Plane Index',
    prompt: `In 8-bit grayscale bit-plane slicing, an image is decomposed into eight independent binary planes indexed from 0 through 7.

Bit Plane 0 contains the least significant bit (lowest numerical weight, $2^0 = 1$), which typically exhibits random noise characteristics.

Which bit plane index (0 through 7) carries the highest numerical weight ($2^7 = 128$) and contains the majority of visually perceptible structural energy and high-contrast scene contours?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer index).`,
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
    flag: 'HTG{7}',
    hints: [
      {
        hintIndex: 1,
        content: "The most significant bit in an 8-bit byte (bits 0 to 7) is bit 7.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE04',
      seedId: 'HTG-L09-OE04',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "Bit plane 7 represents the most significant bit (weight 128) and preserves primary visual contours.",
      essentialKeyPoints: [
        "Higher bit planes (6 and 7) contain recognizable visual semantic shapes.",
        "Lower bit planes (0 and 1) resemble pseudorandom noise and are favored for steganographic concealment."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{7}' or '7'.",
        partialCredit: "Submits 'MSB'.",
        noCredit: "Submits 0 or 8."
      },
      acceptableAlternatives: ['HTG{7}', '7', 'seven', 'HTG{seven}']
    }
  },
  {
    stableId: 'HTG-L09-OE05',
    order: 5,
    levelNumber: 9,
    title: 'Pseudorandom Traversal Coordinate Seed Terminology',
    prompt: `Rather than embedding secret bits sequentially into raster coordinates $(0,0), (0,1), (0,2)...$, robust steganographic systems scatter secret bits across non-consecutive pixel coordinates according to a pseudorandom number generator (PRNG).

What domain-specific term (consisting of two hyphenated or concatenated words: "Stego-..." or "...key") describes the secret parameter or passphrase used to seed this pseudorandom traversal sequence?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
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
    flag: 'HTG{stegokey}',
    hints: [
      {
        hintIndex: 1,
        content: "The term combines 'stego' and 'key' into stegokey.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE05',
      seedId: 'HTG-L09-OE05',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "A stegokey (or stego-key) controls the pseudorandom pixel coordinate permutation during embedding.",
      essentialKeyPoints: [
        "Stegokeys prevent straightforward sequential bit carving from raster scans.",
        "Without the correct stegokey, extracted bits appear as uncorrelated random bytes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{stegokey}' or 'stegokey'.",
        partialCredit: "Submits 'stego-key' or 'stego key'.",
        noCredit: "Submits private key or password."
      },
      acceptableAlternatives: ['HTG{stegokey}', 'stegokey', 'stego-key', 'stego key', 'STEGOKEY', 'HTG{stego-key}']
    }
  },
  {
    stableId: 'HTG-L09-OE06',
    order: 6,
    levelNumber: 9,
    title: 'Statistical Chi-Square Attack on LSB Replacement Pairs',
    prompt: `In traditional LSB replacement, embedding a 1 into an even pixel value $2k$ changes it to $2k+1$, while embedding a 0 into an odd pixel value $2k+1$ changes it to $2k$. This pairwise coupling is known as Values of Pairs (PoVs).

As embedding volume increases towards 100%, the histogram frequencies of $2k$ and $2k+1$ asymptotically equalize:
$$h(2k) \approx h(2k+1)$$

Which classical statistical hypothesis test (named after a Greek letter squared) is applied to detect this artificial equalization of adjacent histogram pairs?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the test name).`,
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
    flag: 'HTG{Chi-Square}',
    hints: [
      {
        hintIndex: 1,
        content: "Westfeld and Pfitzmann introduced this attack using the Chi-Square (or Chi-Squared) distribution test.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE06',
      seedId: 'HTG-L09-OE06',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "The Chi-Square test detects LSB replacement by measuring frequency convergence between adjacent bins (2k and 2k+1).",
      essentialKeyPoints: [
        "LSB replacement creates an artificial balance between pairs of pixel values (PoVs).",
        "Chi-square goodness-of-fit flags anomalous PoV distributions even when visual distortion is imperceptible."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Chi-Square}' or 'Chi-Square'.",
        partialCredit: "Submits 'Chi-Squared' or 'chisquare'.",
        noCredit: "Submits Student-t or ANOVA."
      },
      acceptableAlternatives: ['HTG{Chi-Square}', 'Chi-Square', 'chi-square', 'Chi-Squared', 'chi-squared', 'chisquare', 'HTG{chisquare}']
    }
  },
  {
    stableId: 'HTG-L09-OE07',
    order: 7,
    levelNumber: 9,
    title: 'Sample Pair Analysis (SPA) Steganalysis Technique',
    prompt: `To overcome the limitations of the Chi-Square attack on images with low embedding rates, Dumitrescu, Wu, and Wang (2001) introduced a higher-order steganalytic method that analyzes transitions among spatial pixel pairs $(u, v)$.

By partitioning pixel pairs into trace sets $P, X, Y, Z$ based on whether $|u - v|$ is even or odd before and after LSB flipping, the algorithm solves a quadratic equation to estimate the exact secret message length.

What is the 3-letter uppercase acronym for this foundational steganalysis methodology known as Sample Pair Analysis?

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
    flag: 'HTG{SPA}',
    hints: [
      {
        hintIndex: 1,
        content: "Sample Pair Analysis is abbreviated SPA.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE07',
      seedId: 'HTG-L09-OE07',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "Sample Pair Analysis (SPA) calculates LSB embedding ratios by evaluating transition dynamics in spatial pixel pairs.",
      essentialKeyPoints: [
        "SPA detects LSB replacement at significantly lower payload capacities than chi-square testing.",
        "It models natural image pixel differences and their destruction under bit substitution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SPA}' or 'SPA'.",
        partialCredit: "Submits lowercase 'spa'.",
        noCredit: "Submits PCA or SVD."
      },
      acceptableAlternatives: ['HTG{SPA}', 'SPA', 'spa', 'HTG{spa}']
    }
  },
  {
    stableId: 'HTG-L09-OE08',
    order: 8,
    levelNumber: 9,
    title: 'LSB Matching (Plus-Minus One) Steganographic Technique',
    prompt: `Unlike LSB replacement which always sets the 0th bit directly (creating PoV histogram pair collapse), a more sophisticated spatial embedding algorithm modifies pixel values by randomly adding or subtracting 1 ($v \pm 1$) when the carrier LSB does not match the secret bit:
$$v' = \\begin{cases} v & \\text{if } \\text{LSB}(v) = b \\\\ v \\pm 1 & \\text{if } \\text{LSB}(v) \\neq b \\end{cases}$$
Because $v$ is incremented or decremented with equal probability, the histogram is smoothed rather than paired into $(2k, 2k+1)$ bins.

What common name (consisting of "LSB ..." or "$\pm 1$ embedding") is given to this steganographic method?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the method name).`,
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
    flag: 'HTG{LSB Matching}',
    hints: [
      {
        hintIndex: 1,
        content: "The technique is called LSB Matching (also known as plus-minus one embedding).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE08',
      seedId: 'HTG-L09-OE08',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "LSB Matching alters pixel values by +/-1 to match secret bits without inducing PoV asymmetry.",
      essentialKeyPoints: [
        "LSB Matching defeats classical Chi-square attacks.",
        "Detecting LSB Matching requires feature-based classifiers or HCF-COM (Harmonic Centroid / Co-occurrence Matrix) analysis."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{LSB Matching}' or 'LSB Matching'.",
        partialCredit: "Submits 'LSB matching' or '+-1 embedding'.",
        noCredit: "Submits LSB Replacement."
      },
      acceptableAlternatives: ['HTG{LSB Matching}', 'LSB Matching', 'lsb matching', 'LSB matching', 'plus-minus one embedding', 'HTG{lsb matching}']
    }
  },
  {
    stableId: 'HTG-L09-OE09',
    order: 9,
    levelNumber: 9,
    title: 'Linear Error-Correcting Code Family for Matrix Embedding',
    prompt: `Matrix embedding enhances steganographic embedding efficiency by minimizing the number of pixel modifications required to embed a given payload.

Using a $[2^p - 1, 2^p - 1 - p, 3]$ binary linear block code, an embedder can conceal $p$ secret message bits into $n = 2^p - 1$ carrier pixels by altering at most 1 pixel value.

Which famous linear error-correcting code family (named after Richard Hamming) is utilized in this classic matrix embedding construction?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the code family name).`,
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
    flag: 'HTG{Hamming}',
    hints: [
      {
        hintIndex: 1,
        content: "Named after Richard Hamming: Hamming codes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE09',
      seedId: 'HTG-L09-OE09',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "Hamming codes provide the mathematical basis for matrix embedding, enabling p bits to be hidden with at most 1 change.",
      essentialKeyPoints: [
        "Matrix embedding maximizes embedding efficiency (embedded bits per modified carrier unit).",
        "Hamming codes [7, 4, 3] hide 3 bits in 7 pixels with at most 1 modification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Hamming}' or 'Hamming'.",
        partialCredit: "Submits 'Hamming code' or 'hamming'.",
        noCredit: "Submits Reed-Solomon or Golay."
      },
      acceptableAlternatives: ['HTG{Hamming}', 'Hamming', 'hamming', 'Hamming code', 'Hamming Code', 'HTG{hamming}']
    }
  },
  {
    stableId: 'HTG-L09-OE10',
    order: 10,
    levelNumber: 9,
    title: 'Reconstructed Blue-Channel LSB Character Byte',
    prompt: `An analyst extracts the least significant bits from the Blue channel of 8 consecutive 24-bit RGB pixels along raster row 0:
\`\`\`text
Pixel 0 (x=0): Blue byte = 0xA4 (10100100_2) -> LSB = 0
Pixel 1 (x=1): Blue byte = 0x3B (00111011_2) -> LSB = 1
Pixel 2 (x=2): Blue byte = 0x7E (01111110_2) -> LSB = 0
Pixel 3 (x=3): Blue byte = 0x58 (01011000_2) -> LSB = 0
Pixel 4 (x=4): Blue byte = 0xD9 (11011001_2) -> LSB = 1
Pixel 5 (x=5): Blue byte = 0x12 (00010010_2) -> LSB = 0
Pixel 6 (x=6): Blue byte = 0x86 (10000110_2) -> LSB = 0
Pixel 7 (x=7): Blue byte = 0x6D (01101101_2) -> LSB = 1
\`\`\`
Reconstructing the 8 bits in big-endian order (Pixel 0 = MSB, Pixel 7 = LSB) produces:
\`\`\`text
Binary: 0 1 0 0 1 0 0 1
\`\`\`
What single uppercase ASCII letter corresponds to binary \`01001001\` (hexadecimal \`0x49\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single letter).`,
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
    flag: 'HTG{I}',
    hints: [
      {
        hintIndex: 1,
        content: "0x49 in hexadecimal is 73 in decimal. ASCII 73 is the letter 'I'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE10',
      seedId: 'HTG-L09-OE10',
      subtopic: 'Bit-plane extraction & LSB analysis',
      explanation: "Binary 01001001 is 0x49 (decimal 73), which is the ASCII uppercase letter 'I'.",
      essentialKeyPoints: [
        "Sequential bit extraction recovers hidden bytes MSB-to-LSB or LSB-to-MSB.",
        "0x49 translates to uppercase ASCII 'I'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{I}' or 'I'.",
        partialCredit: "Submits '0x49' or '73'.",
        noCredit: "Submits H or J."
      },
      acceptableAlternatives: ['HTG{I}', 'I', 'i', 'HTG{i}']
    }
  }
];

module.exports = subtopic1Questions;

