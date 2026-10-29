const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L09-OE61',
    order: 61,
    levelNumber: 9,
    title: 'Naor-Shamir Visual Cryptography Superposition Logic',
    prompt: `In 1994, Moni Naor and Adi Shamir introduced visual cryptography, where a secret black-and-white image is split into two printed transparency shares.

Each share individually resembles pure random visual static and leaks zero Shannon information about the secret. However, when the two physical transparencies are overlaid in exact alignment, the secret image becomes immediately visible to the human eye without any computational hardware.

What elementary Boolean logic gate operation (where light passing through two overlaid transparencies is blocked if either transparency contains a black subpixel) models this physical superposition?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the Boolean operator name).`,
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
    flag: 'HTG{OR}',
    hints: [
      {
        hintIndex: 1,
        content: "If transparency A is black OR transparency B is black, the output is black: Boolean OR.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE61',
      seedId: 'HTG-L09-OE61',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "Physical superposition of transparencies behaves as a Boolean OR operation on opaque subpixels.",
      essentialKeyPoints: [
        "Visual cryptography performs decryption via human visual perception.",
        "Overlaid transparencies transmit light only when both shares have transparent subpixels (OR logic for black)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{OR}' or 'OR'.",
        partialCredit: "Submits lowercase 'or' or 'Boolean OR'.",
        noCredit: "Submits AND or XOR."
      },
      acceptableAlternatives: ['HTG{OR}', 'OR', 'or', 'Boolean OR', 'boolean or', 'HTG{or}']
    }
  },
  {
    stableId: 'HTG-L09-OE62',
    order: 62,
    levelNumber: 9,
    title: 'Dual-Carrier Image Exclusive-OR Bit Reconstruction',
    prompt: `An analyst recovers two carrier bitmaps ($Carrier_A$ and $Carrier_B$) containing secret visual shares. The reconstruction specification mandates evaluating a pixel-wise Exclusive-OR (XOR, $\\oplus$) operation across all matching $(x, y)$ coordinate bits:
$$Secret(x, y) = Carrier_A(x, y) \\oplus Carrier_B(x, y)$$
If at coordinate $(42, 108)$, $Carrier_A$ has bit value $1$ and $Carrier_B$ has bit value $1$, what is the resulting single-digit binary bit value ($0$ or $1$) in the reconstructed secret image?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single bit value).`,
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
    flag: 'HTG{0}',
    hints: [
      {
        hintIndex: 1,
        content: "1 XOR 1 is 0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE62',
      seedId: 'HTG-L09-OE62',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "In Boolean XOR logic, 1 XOR 1 evaluates to 0.",
      essentialKeyPoints: [
        "XOR secret sharing achieves perfect secrecy when one share is a true one-time pad.",
        "Recombining shares via bitwise XOR cancels the random mask and recovers the secret."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'zero'.",
        noCredit: "Submits 1."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'zero', 'HTG{zero}']
    }
  },
  {
    stableId: 'HTG-L09-OE63',
    order: 63,
    levelNumber: 9,
    title: 'Hilbert Space-Filling Curve Coordinate Traversal',
    prompt: `To avoid visual banding and defeat spatial steganalysis tools that detect sequential raster row modifications, sophisticated embedders traverse image coordinates along a continuous fractal space-filling curve that preserves 2D locality.

What famous continuous fractal space-filling curve (first described by German mathematician David Hilbert in 1891) is commonly applied in spatial image processing and steganography?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the mathematician surname).`,
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
    flag: 'HTG{Hilbert}',
    hints: [
      {
        hintIndex: 1,
        content: "Named after David Hilbert: Hilbert curve.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE63',
      seedId: 'HTG-L09-OE63',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "The Hilbert curve maps 1D sequences into 2D space while preserving spatial clustering and locality.",
      essentialKeyPoints: [
        "Hilbert scanning scatters LSB modifications in non-linear spatial trajectories.",
        "It preserves local correlation better than Peano or Morton Z-order curves."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Hilbert}' or 'Hilbert'.",
        partialCredit: "Submits 'Hilbert curve' or 'hilbert'.",
        noCredit: "Submits Sierpinski or Mandelbrot."
      },
      acceptableAlternatives: ['HTG{Hilbert}', 'Hilbert', 'hilbert', 'Hilbert curve', 'Hilbert Curve', 'HTG{hilbert}']
    }
  },
  {
    stableId: 'HTG-L09-OE64',
    order: 64,
    levelNumber: 9,
    title: 'Steghide Graph-Theoretic Bipartite Matching Optimization',
    prompt: `The popular open-source tool \`steghide\` hides secret data in JPEG, BMP, and WAV files without altering first-order frequency statistics by swapping pairs of carrier samples rather than overwriting them.

To minimize the total perceptual distance introduced by these swaps, steghide constructs a graph connecting carrier coefficients to secret values and calculates a maximum weight matching.

What classical graph theory concept (connecting two disjoint sets of vertices such that no two edges share an endpoint) underpins steghide's optimization engine?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the graph theory term).`,
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
    flag: 'HTG{bipartite matching}',
    hints: [
      {
        hintIndex: 1,
        content: "The algorithm computes maximum weight bipartite matching.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE64',
      seedId: 'HTG-L09-OE64',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "Steghide uses graph-theoretic bipartite matching to pair carrier samples with minimal distortion.",
      essentialKeyPoints: [
        "Steghide preserves first-order statistics by swapping identical values when possible.",
        "Bipartite matching ensures optimal global pairing between carrier elements and secret payload bits."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{bipartite matching}' or 'bipartite matching'.",
        partialCredit: "Submits 'Bipartite Matching' or 'maximum bipartite matching'.",
        noCredit: "Submits Dijkstra or Kruskal."
      },
      acceptableAlternatives: ['HTG{bipartite matching}', 'bipartite matching', 'Bipartite Matching', 'maximum bipartite matching', 'HTG{Bipartite Matching}']
    }
  },
  {
    stableId: 'HTG-L09-OE65',
    order: 65,
    levelNumber: 9,
    title: 'Nested Steganography Cryptographic Convergence Paradigm',
    prompt: `In operational security, threat actors rarely embed raw unencrypted plaintext into steganographic carriers because forensic carving or bit extraction would immediately expose the message.

Instead, the payload is first encrypted using modern strong cryptography (e.g. AES-256-GCM), and the resulting ciphertext is then embedded into the carrier media.

What 2-word term (or "crypto-...") describes this layered practice of embedding pre-encrypted ciphertext inside a steganographic medium?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word term).`,
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
    flag: 'HTG{nested steganography}',
    hints: [
      {
        hintIndex: 1,
        content: "The technique is nested steganography (or crypto-steganography).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE65',
      seedId: 'HTG-L09-OE65',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "Nested steganography embeds cryptographically encrypted payloads inside steganographic covers.",
      essentialKeyPoints: [
        "Nested steganography guarantees confidentiality even if the stego channel is discovered.",
        "Ciphertext exhibits maximum entropy, resembling high-frequency random noise."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{nested steganography}' or 'nested steganography'.",
        partialCredit: "Submits 'crypto-steganography' or 'Nested Steganography'.",
        noCredit: "Submits encryption only."
      },
      acceptableAlternatives: ['HTG{nested steganography}', 'nested steganography', 'Nested Steganography', 'crypto-steganography', 'Crypto-Steganography', 'HTG{crypto-steganography}']
    }
  },
  {
    stableId: 'HTG-L09-OE66',
    order: 66,
    levelNumber: 9,
    title: 'PNG Ancillary Chunk Case-Sensitivity Convention',
    prompt: `In the W3C PNG specification, chunk names are strictly 4 ASCII letters. The case of each letter communicates specific architectural rules to decoders:
- Bit 5 of Byte 0: Critical (Uppercase) vs Ancillary (Lowercase)
- Bit 5 of Byte 1: Public (Uppercase) vs Private (Lowercase)
- Bit 5 of Byte 2: Reserved
- Bit 5 of Byte 3: Safe-to-copy (Lowercase) vs Unsafe-to-copy (Uppercase)

If the first letter of a chunk name is lowercase (such as \`tEXt\`, \`zTXt\`, or custom \`cOVR\`), what does this indicate to a standard PNG decoder regarding whether it can safely ignore and discard the chunk if unrecognized?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the adjective).`,
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
    flag: 'HTG{ancillary}',
    hints: [
      {
        hintIndex: 1,
        content: "Lowercase first letter denotes an ancillary chunk (non-critical).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE66',
      seedId: 'HTG-L09-OE66',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "Ancillary chunks (lowercase first letter) can be safely ignored by decoders without failing rendering.",
      essentialKeyPoints: [
        "Critical chunks (IHDR, PLTE, IDAT, IEND) have uppercase first letters.",
        "Ancillary chunks provide stealthy injection points for steganographic payloads."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ancillary}' or 'ancillary'.",
        partialCredit: "Submits capitalized 'Ancillary'.",
        noCredit: "Submits critical or private."
      },
      acceptableAlternatives: ['HTG{ancillary}', 'ancillary', 'Ancillary', 'ancillary chunk', 'HTG{Ancillary}']
    }
  },
  {
    stableId: 'HTG-L09-OE67',
    order: 67,
    levelNumber: 9,
    title: 'StegExpose Automated Multi-Algorithm Steganalysis Framework',
    prompt: `In bulk image forensic investigations, manual steganalysis across thousands of images is infeasible.

A widely used open-source Java-based steganalysis framework automates detection by combining Chi-square, Sample Pair Analysis (SPA), Primary Sets, and Regular/Singular (RS) analysis to output a unified probability score.

What is the exact tool name of this framework created by Benedikt Boehm?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the tool name).`,
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
    flag: 'HTG{StegExpose}',
    hints: [
      {
        hintIndex: 1,
        content: "The tool is named StegExpose.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE67',
      seedId: 'HTG-L09-OE67',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "StegExpose integrates multiple statistical steganalysis algorithms to detect LSB steganography in bulk.",
      essentialKeyPoints: [
        "StegExpose evaluates Chi-Square, SPA, RS, and Primary Sets.",
        "It provides empirical detection thresholds for bulk forensic triage."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{StegExpose}' or 'StegExpose'.",
        partialCredit: "Submits lowercase 'stegexpose'.",
        noCredit: "Submits Stegdetect or Stegsolve."
      },
      acceptableAlternatives: ['HTG{StegExpose}', 'StegExpose', 'stegexpose', 'STEGEXPOSE', 'HTG{stegexpose}']
    }
  },
  {
    stableId: 'HTG-L09-OE68',
    order: 68,
    levelNumber: 9,
    title: 'Cascaded Multi-Layer Cipher Decryption Sequence',
    prompt: `An investigator recovers a composite secret token protected by two successive cryptographic layers:
\`\`\`text
Obfuscated Token: "S2xhcnVzXzk5"
Layer 1: Base64 decode
Layer 2: Caesar ROT-13 decryption
\`\`\`
1. Decoding the Base64 string \`"S2xhcnVzXzk5"\` yields ASCII: \`"Klarus_99"\`
2. Decrypting \`"Klarus_99"\` by shifting each alphabetic letter by 13 positions (ROT-13):
\`\`\`text
K (+13) -> X
l (+13) -> y
a (+13) -> n
r (+13) -> e
u (+13) -> h
s (+13) -> f
_        -> _
99       -> 99
\`\`\`
What is the resulting 9-character plaintext key (case-sensitive)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 9-character key).`,
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
    flag: 'HTG{Xynehf_99}',
    hints: [
      {
        hintIndex: 1,
        content: "ROT-13 shifts 'Klarus_99' to 'Xynehf_99'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE68',
      seedId: 'HTG-L09-OE68',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "Base64 decoding produces 'Klarus_99'; applying ROT-13 produces 'Xynehf_99'.",
      essentialKeyPoints: [
        "Threat actors chain standard encodings with classical shifts to evade simple static signatures.",
        "Stepwise reversal untangles layered transformations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Xynehf_99}' or 'Xynehf_99'.",
        partialCredit: "Submits lowercase 'xynehf_99'.",
        noCredit: "Submits Klarus_99."
      },
      acceptableAlternatives: ['HTG{Xynehf_99}', 'Xynehf_99', 'xynehf_99', 'HTG{xynehf_99}']
    }
  },
  {
    stableId: 'HTG-L09-OE69',
    order: 69,
    levelNumber: 9,
    title: 'Prime Coordinate Filtering Pixel Extraction Rule',
    prompt: `An evidence image stores secret bits in the LSB of pixels whose 2D integer coordinates $(x, y)$ satisfy a strict mathematical constraint: both $x$ and $y$ must be prime numbers.

What fundamental mathematical definition characterizes an integer greater than 1 that possesses strictly two distinct positive divisors: 1 and itself?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the adjective).`,
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
    flag: 'HTG{prime}',
    hints: [
      {
        hintIndex: 1,
        content: "Numbers with only two positive divisors (1 and themselves) are prime numbers.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE69',
      seedId: 'HTG-L09-OE69',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "Prime numbers have exactly two divisors (1 and themselves); coordinate filtering using primes scatters bits non-linearly.",
      essentialKeyPoints: [
        "Prime coordinate filtering creates irregular spatial gaps that defeat simple stride-based attacks.",
        "Forensic reconstruction filters pixel matrices by primality tests."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{prime}' or 'prime'.",
        partialCredit: "Submits capitalized 'Prime' or 'prime number'.",
        noCredit: "Submits composite or odd."
      },
      acceptableAlternatives: ['HTG{prime}', 'prime', 'Prime', 'prime number', 'Prime Number', 'HTG{Prime}']
    }
  },
  {
    stableId: 'HTG-L09-OE70',
    order: 70,
    levelNumber: 9,
    title: 'Master Flag Fragment for Level 9 Logic & Steganography',
    prompt: `By methodically completing all seven investigatory tracks across Level 9 (Logic & Steganography / Polyalphabetic Steganography), an analyst compiles three core cryptographic tokens extracted from bit planes, transform domain DCT coefficients, and polyglot file headers:
\`\`\`text
Fragment 1 (Bit-Plane Extraction):    STEGO
Fragment 2 (Polyalphabetic Decouple): VIGENERE
Fragment 3 (Structural Payload Carve): POLYGLOT
Suffix:                               99
\`\`\`
Assembling these three fragments with underscores and attaching the numeric suffix yields the master completion key:
\`\`\`text
STEGO_VIGENERE_POLYGLOT_99
\`\`\`
What is the final composite completion flag for Level 9?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
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
    flag: 'HTG{STEGO_VIGENERE_POLYGLOT_99}',
    hints: [
      {
        hintIndex: 1,
        content: "Assemble the three fragments with underscores: HTG{STEGO_VIGENERE_POLYGLOT_99}.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE70',
      seedId: 'HTG-L09-OE70',
      subtopic: 'Multi-step logic puzzles & composite flag reconstruction',
      explanation: "Concludes the Level 9 Logic & Steganography / Polyalphabetic Steganography track, unlocking Level 10 (The Master Flag Citadel).",
      essentialKeyPoints: [
        "Synthesizes bit plane analysis, transform frequency domain steganography, and polyglot structural file carving.",
        "Unlocks the final citadel level in the Hack The Grid competition."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{STEGO_VIGENERE_POLYGLOT_99}'.",
        partialCredit: "Submits 'STEGO_VIGENERE_POLYGLOT_99' without curly braces.",
        noCredit: "Submits partial fragments."
      },
      acceptableAlternatives: ['HTG{STEGO_VIGENERE_POLYGLOT_99}', 'STEGO_VIGENERE_POLYGLOT_99', 'stego_vigenere_polyglot_99', 'HTG{stego_vigenere_polyglot_99}']
    }
  }
];

module.exports = subtopic7Questions;

