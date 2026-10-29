const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L03-OE21',
    order: 31,
    levelNumber: 3,
    title: 'Rail Fence Zigzag Classical Transposition Decryption',
    prompt: `An intercepted sensor stream was transposed across 3 rails using a classic zigzag Rail Fence cipher:

\`\`\`text
FURQECENY
\`\`\`

In a 3-rail zigzag cipher:
- Rail 0 receives characters at indices 0, 4, 8...
- Rail 1 receives characters at indices 1, 3, 5, 7...
- Rail 2 receives characters at indices 2, 6...

Reconstruct the zigzag path across the 3 rails to decrypt the original 9-letter telemetry word.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{FREQUENCY}',
    hints: [
      {
        hintIndex: 1,
        content: "Rail 0 holds 2 letters (F, U). Rail 1 holds 4 letters (R, Q, E, C). Rail 2 holds 3 letters (E, N, Y). Trace the zigzag: F-R-E-Q-U-E-N-C-Y.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE21',
      seedId: 'HTG-L03-OE21',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "Placing 'FURQECENY' into a 3-rail zigzag grid and reading in alternating diagonal order reveals the plaintext 'FREQUENCY'.",
      essentialKeyPoints: [
        "Rail fence zigzag matrix reconstruction.",
        "Transposition without character substitution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{FREQUENCY}' or 'FREQUENCY'.",
        partialCredit: "Submits lowercase 'frequency'.",
        noCredit: "Submits Caesar shifted text."
      },
      acceptableAlternatives: ['HTG{FREQUENCY}', 'FREQUENCY', 'frequency', 'HTG{frequency}'],
      safetyNotes: 'Rail fence decryption.'
    }
  },
  {
    stableId: 'HTG-L03-OE22',
    order: 32,
    levelNumber: 3,
    title: 'Simple Columnar Transposition Matrix Decryption',
    prompt: `A communication beacon arranged a 12-letter message into a rectangular matrix with 3 rows and 4 columns, writing across rows and then transmitting column by column:

\`\`\`text
SAAILCGBONEN
\`\`\`

The columns were transmitted in order (Column 0, Column 1, Column 2, Column 3), with each column containing exactly 3 letters:
- Column 0: S A A
- Column 1: I L C
- Column 2: G B O
- Column 3: N E N

Reassemble the columns into the 3x4 grid and read horizontally across the rows to recover the original 12-letter two-word plaintext.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit as two words / concatenated text).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{SIGNALBEACON}',
    hints: [
      {
        hintIndex: 1,
        content: "Row 0: S I G N. Row 1: A L B E. Row 2: A C O N.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE22',
      seedId: 'HTG-L03-OE22',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "Writing the columns into a 3x4 grid: Row 0 is 'SIGN', Row 1 is 'ALBE', Row 2 is 'ACON'. Concatenating rows gives 'SIGNAL BEACON'.",
      essentialKeyPoints: [
        "Columnar grid reconstruction.",
        "Row-major writing vs column-major reading."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SIGNALBEACON}' or 'SIGNAL BEACON'.",
        partialCredit: "Submits lowercase 'signalbeacon'.",
        noCredit: "Submits raw column ciphertext."
      },
      acceptableAlternatives: [
        'HTG{SIGNALBEACON}',
        'SIGNALBEACON',
        'SIGNAL BEACON',
        'signal beacon',
        'signalbeacon',
        'HTG{SIGNAL_BEACON}',
        'SIGNAL_BEACON',
        'signal_beacon'
      ],
      safetyNotes: 'Columnar transposition matrix recovery.'
    }
  },
  {
    stableId: 'HTG-L03-OE23',
    order: 33,
    levelNumber: 3,
    title: 'Keyed Columnar Transposition Decryption with Alphabetic Permutation',
    prompt: `An encrypted transmission was enciphered using a keyed columnar transposition with keyword:

\`\`\`text
RADIO
\`\`\`

In keyed columnar transposition, the columns are sorted alphabetically by the letters of the keyword:
- Original column indices: R (0), A (1), D (2), I (3), O (4)
- Alphabetical keyword order: A (col 1), D (col 2), I (col 3), O (col 4), R (col 0)

The intercepted ciphertext (15 letters, forming 3 rows of 5 columns) is:

\`\`\`text
ETRLREEYAMSMTET
\`\`\`

Rearrange the 3-letter blocks back to their original keyword order (R, A, D, I, O) and read across the 3 rows to recover the original message.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{TELEMETRYSTREAM}',
    hints: [
      {
        hintIndex: 1,
        content: "A is 'ETR', D is 'LRE', I is 'EYA', O is 'MSM', R is 'TET'. Reconstructed columns: R=TET, A=ETR, D=LRE, I=EYA, O=MSM.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE23',
      seedId: 'HTG-L03-OE23',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "Assigning the ciphertext blocks to their alphabetical columns and restoring them to order R-A-D-I-O produces rows 'TELEM', 'ETRYS', 'TREAM', spelling 'TELEMETRY STREAM'.",
      essentialKeyPoints: [
        "Keyed columnar permutation inversion.",
        "Mapping alphabetic rank back to physical column indices."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TELEMETRYSTREAM}' or 'TELEMETRYSTREAM'.",
        partialCredit: "Submits 'TELEMETRY STREAM' or lowercase.",
        noCredit: "Submits unpermuted ciphertext."
      },
      acceptableAlternatives: [
        'HTG{TELEMETRYSTREAM}',
        'TELEMETRYSTREAM',
        'TELEMETRY STREAM',
        'telemetry stream',
        'telemetrystream',
        'HTG{TELEMETRY_STREAM}',
        'TELEMETRY_STREAM',
        'telemetry_stream'
      ],
      safetyNotes: 'Keyed transposition cryptanalysis.'
    }
  },
  {
    stableId: 'HTG-L03-OE24',
    order: 34,
    levelNumber: 3,
    title: 'Ancient Spartan Mechanical Transposition Scytale Cipher',
    prompt: `In classical history, Spartan commanders transmitted military directives by wrapping a strip of parchment spirally around a wooden rod of fixed diameter, writing the message along the rod, and unwrapping the strip.

The unrolled parchment appeared as disconnected letters and could only be deciphered by wrapping it around a cylinder of identical diameter.

What ancient Greek cryptographic tool and cipher is this known as?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing scytale).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{scytale}',
    hints: [
      {
        hintIndex: 1,
        content: "Begins with 'scyt-': scytale (or skytale).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE24',
      seedId: 'HTG-L03-OE24',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "The Scytale was an ancient Spartan device used for transposition cryptography. The cylinder diameter determined the number of rows/columns.",
      essentialKeyPoints: [
        "Scytale mechanical transposition mechanics.",
        "Earliest historical implementations of transposition cryptography."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{scytale}' or 'scytale'.",
        partialCredit: "Submits 'skytale' or 'scytale cipher'.",
        noCredit: "Submits Caesar or Polybius."
      },
      acceptableAlternatives: [
        'HTG{scytale}',
        'scytale',
        'SCYTALE',
        'skytale',
        'scytale cipher',
        'HTG{skytale}'
      ],
      safetyNotes: 'Historical cryptographic devices.'
    }
  },
  {
    stableId: 'HTG-L03-OE25',
    order: 35,
    levelNumber: 3,
    title: 'Transposition Invariant Statistical Feature: Unigram Frequency',
    prompt: `When inspecting an unknown encrypted message to classify its cipher mechanism, an analyst computes the unigram (single-letter) frequency distribution.

In a pure transposition cipher, characters are simply rearranged into new positions without substitution.

How does the total count of each individual letter (e.g. number of 'E's, 'T's, 'A's) in the ciphertext compare to the plaintext? (They remain identical or preserved).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing identical).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{identical}',
    hints: [
      {
        hintIndex: 1,
        content: "Accepts 'identical', 'preserved', 'unchanged', or 'same'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE25',
      seedId: 'HTG-L03-OE25',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "Transposition ciphers do not alter letter identities; they only change positions. Therefore, unigram letter counts remain completely identical to the plaintext.",
      essentialKeyPoints: [
        "Unigram frequency invariance in transposition.",
        "Using unigram match to confirm transposition vs substitution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{identical}' or 'identical'.",
        partialCredit: "Submits 'preserved' or 'unchanged'.",
        noCredit: "Submits inverted or randomized."
      },
      acceptableAlternatives: [
        'HTG{identical}',
        'identical',
        'IDENTICAL',
        'preserved',
        'unchanged',
        'the same',
        'same'
      ],
      safetyNotes: 'Transposition detection theory.'
    }
  },
  {
    stableId: 'HTG-L03-OE26',
    order: 36,
    levelNumber: 3,
    title: 'Route Cipher Geometric Traversal Pattern',
    prompt: `In classical transposition, a technique fills plaintext letters into a geometric grid in standard rows, but extracts the ciphertext by following a predetermined geometric path — such as a clockwise spiral inward, an alternating boustrophedon zigzag, or diagonal diagonals.

What two-word cryptographic term denotes this class of geometric path ciphers?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing route cipher).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{route cipher}',
    hints: [
      {
        hintIndex: 1,
        content: "Two words: 'route cipher'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE26',
      seedId: 'HTG-L03-OE26',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "A route cipher is a classical transposition cipher where the key is a specific path/route followed through a pre-filled grid.",
      essentialKeyPoints: [
        "Route cipher mechanics.",
        "Geometric path traversals (spiral, boustrophedon)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{route cipher}' or 'route cipher'.",
        partialCredit: "Submits 'route' or 'route transposition'.",
        noCredit: "Submits rail fence or scytale."
      },
      acceptableAlternatives: [
        'HTG{route cipher}',
        'route cipher',
        'ROUTE CIPHER',
        'route',
        'route transposition'
      ],
      safetyNotes: 'Route cipher taxonomy.'
    }
  },
  {
    stableId: 'HTG-L03-OE27',
    order: 37,
    levelNumber: 3,
    title: 'Double Transposition Strengthening Technique',
    prompt: `Single columnar transposition ciphers are vulnerable to anagramming attacks because all letters belonging to the same original row remain grouped together across columns.

To drastically increase resistance to cryptanalysis, classical military cryptosystems enciphered messages by applying a columnar transposition, writing the result into a second grid, and applying a second transposition with an independent key.

What two-word cryptographic term describes this compounded transposition method?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing double transposition).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{double transposition}',
    hints: [
      {
        hintIndex: 1,
        content: "Two words: 'double transposition'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE27',
      seedId: 'HTG-L03-OE27',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "Double transposition applies two successive transposition stages, completely dispersing adjacent characters and defeating simple anagramming techniques.",
      essentialKeyPoints: [
        "Double transposition security advantage.",
        "Breaking digram adjacency in classical ciphers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{double transposition}' or 'double transposition'.",
        partialCredit: "Submits 'double columnar transposition'.",
        noCredit: "Submits substitution-transposition."
      },
      acceptableAlternatives: [
        'HTG{double transposition}',
        'double transposition',
        'DOUBLE TRANSPOSITION',
        'double columnar transposition',
        'double-transposition'
      ],
      safetyNotes: 'Compounded transposition security.'
    }
  },
  {
    stableId: 'HTG-L03-OE28',
    order: 38,
    levelNumber: 3,
    title: 'Rail Fence Zigzag Cycle Period Calculation',
    prompt: `In a Rail Fence cipher using R rails, characters bounce from Rail 0 down to Rail (R - 1) and then bounce back up to Rail 0.

The period of one complete downward-and-upward cycle is given by the formula:

Cycle Length = 2 * (R - 1)

If an analyst configures a Rail Fence cipher with R = 4 rails, what is the length of one complete zigzag cycle? Submit the integer count.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: '6',
    hints: [
      {
        hintIndex: 1,
        content: "2 * (4 - 1) = 2 * 3 = 6.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE28',
      seedId: 'HTG-L03-OE28',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "For R = 4 rails, the path visits rails 0, 1, 2, 3, 2, 1 before returning to rail 0 at index 6. The cycle length is 6.",
      essentialKeyPoints: [
        "Rail fence periodic cycle math: 2*(R-1).",
        "Calculating index positions across rails."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 6.",
        partialCredit: "Submits 'six'.",
        noCredit: "Submits 4 or 8."
      },
      acceptableAlternatives: ['6', 'six', 'HTG{6}'],
      safetyNotes: 'Rail fence cycle period calculation.'
    }
  },
  {
    stableId: 'HTG-L03-OE29',
    order: 39,
    levelNumber: 3,
    title: 'Columnar Transposition Matrix Row Dimension Calculation',
    prompt: `An intercepted columnar transmission has an exact length of 48 characters with no padding.

If the intercept confirms that the sender arranged the message into 6 vertical columns, how many horizontal rows were formed in the transposition matrix? Submit the integer count.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: '8',
    hints: [
      {
        hintIndex: 1,
        content: "Divide total length 48 by column count 6: 48 / 6 = 8.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE29',
      seedId: 'HTG-L03-OE29',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "Rows = Total Length / Columns = 48 / 6 = 8 rows.",
      essentialKeyPoints: [
        "Matrix dimension calculation for transposition ciphers.",
        "Factorization of ciphertext lengths."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 8.",
        partialCredit: "Submits 'eight'.",
        noCredit: "Submits 6 or 48."
      },
      acceptableAlternatives: ['8', 'eight', 'HTG{8}'],
      safetyNotes: 'Transposition matrix dimensions.'
    }
  },
  {
    stableId: 'HTG-L03-OE30',
    order: 40,
    levelNumber: 3,
    title: 'Column Anagramming Classical Cryptanalysis Method',
    prompt: `When attacking an unkeyed columnar transposition where the keyword is unknown, an analyst writes the suspected column slices onto strips of paper and shifts the strips left and right until intelligible English words appear across the rows simultaneously.

What classical cryptanalytic term denotes this technique of rearranging transposition columns by trial and linguistic alignment?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing anagramming).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Crypto',
    difficulty: 'MEDIUM',
    flag: 'HTG{anagramming}',
    hints: [
      {
        hintIndex: 1,
        content: "Root word is 'anagram': anagramming (or column anagramming).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L03-OE30',
      seedId: 'HTG-L03-OE30',
      subtopic: 'Classical Transposition & Columnar Transposition',
      explanation: "Anagramming is the standard cryptanalytic technique for solving columnar transpositions by aligning columns until plausible digrams and words emerge across rows.",
      essentialKeyPoints: [
        "Column anagramming technique.",
        "Exploiting row-wise digram probabilities."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{anagramming}' or 'anagramming'.",
        partialCredit: "Submits 'column anagramming'.",
        noCredit: "Submits frequency analysis."
      },
      acceptableAlternatives: [
        'HTG{anagramming}',
        'anagramming',
        'ANAGRAMMING',
        'column anagramming',
        'multiple anagramming'
      ],
      safetyNotes: 'Transposition cryptanalysis methodologies.'
    }
  }
];

module.exports = subtopic3Questions;

