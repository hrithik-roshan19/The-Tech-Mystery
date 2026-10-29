const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L01-OE01',
    order: 11,
    levelNumber: 1,
    title: 'Flag Syntax Validation',
    prompt: `During an initial incident triage on an orientation terminal, an analyst intercepts an encoded diagnostic payload:

\`SFRHe3MxZ240bF9kMXNjMHYzcjNkfQ==\`

The official competition specification for Hack The Grid mandates that participants decode intercepted signals and submit the recovered flag.

Decode this Base64 payload and submit the complete recovered flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{s1gn4l_d1sc0v3r3d}',
    hints: [
      {
        hintIndex: 1,
        content: "Use base64 decode (e.g. echo '...' | base64 -d) to reveal the flag.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE01',
      seedId: 'HTG-L01-OE01',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Base64 decoding 'SFRHe3MxZ240bF9kMXNjMHYzcjNkfQ==' produces the official competition flag 'HTG{s1gn4l_d1sc0v3r3d}'.",
      essentialKeyPoints: [
        "Base64 decoding of primary flag signal.",
        "Canonical format begins with 'HTG{' and closes with '}'."
      ],
      gradingRubric: {
        fullCredit: "Submits exact string 'HTG{s1gn4l_d1sc0v3r3d}' (case-insensitive).",
        partialCredit: "Extracts inner token 's1gn4l_d1sc0v3r3d' without flag wrapper.",
        noCredit: "Submits invalid decode."
      },
      acceptableAlternatives: ['HTG{s1gn4l_d1sc0v3r3d}', 'htg{s1gn4l_d1sc0v3r3d}'],
      safetyNotes: 'Orientation decoding drill; no network access required.'
    }
  },
  {
    stableId: 'HTG-L01-OE02',
    order: 12,
    levelNumber: 1,
    title: 'Flag Delimiter Assembly',
    prompt: `A radio transmission scanner intercepted a beacon packet containing the following structured telemetry fields:

\`BEACON_PKT::ID=101::NAMESPACE=HTG::TAG=01_r3c0n_str1k3::CHECKSUM_OK\`

Following standard Hack The Grid flag formatting rules, combine the NAMESPACE and TAG fields into the official competition flag format: \`NAMESPACE{TAG}\`.`,
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
    flag: 'HTG{01_r3c0n_str1k3}',
    hints: [
      {
        hintIndex: 1,
        content: "Wrap the TAG value with curly braces and prepend the NAMESPACE value.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE02',
      seedId: 'HTG-L01-OE02',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Assembling NAMESPACE ('HTG') and TAG ('01_r3c0n_str1k3') according to the pattern produces 'HTG{01_r3c0n_str1k3}'.",
      essentialKeyPoints: [
        "Delimited flag assembly.",
        "Mapping structured packet fields to competition flag formats."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{01_r3c0n_str1k3}'.",
        partialCredit: "Submits inner token '01_r3c0n_str1k3'.",
        noCredit: "Submits log headers or unrelated text."
      },
      acceptableAlternatives: ['HTG{01_r3c0n_str1k3}', 'htg{01_r3c0n_str1k3}'],
      safetyNotes: 'Standard log token formatting drill.'
    }
  },
  {
    stableId: 'HTG-L01-OE03',
    order: 13,
    levelNumber: 1,
    title: 'Canonical Flag Normalization',
    prompt: `An incident responder recorded an unformatted token in bracket notation:

\`htg[b4s1c_0r13nt4t10n]\`

The automated scoring platform requires the canonical event format, which mandates uppercase namespace prefix 'HTG' followed by curly braces '{' and '}'.

Provide the canonical normalized flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{b4s1c_0r13nt4t10n}',
    hints: [
      {
        hintIndex: 1,
        content: "Change 'htg' to 'HTG' and replace square brackets '[' ']' with curly braces '{' '}'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE03',
      seedId: 'HTG-L01-OE03',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Standard CTF conventions standardize the namespace prefix in uppercase ('HTG') and delimit the payload with curly braces '{' and '}'.",
      essentialKeyPoints: [
        "Prefix normalization ensures uniform scoring records.",
        "Delimiter conversion from square brackets to curly braces."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{b4s1c_0r13nt4t10n}'.",
        partialCredit: "Submits inner token 'b4s1c_0r13nt4t10n'.",
        noCredit: "Leaves square brackets unchanged."
      },
      acceptableAlternatives: ['HTG{b4s1c_0r13nt4t10n}', 'htg{b4s1c_0r13nt4t10n}'],
      safetyNotes: 'Format conformance exercise.'
    }
  },
  {
    stableId: 'HTG-L01-OE04',
    order: 14,
    levelNumber: 1,
    title: 'Identifying Flag Checksum Suffix',
    prompt: `Flags deployed in this division append a 2-character hexadecimal CRC checksum separated by an underscore at the end of the inner token:

\`PREFIX=HTG | TOKEN=pr0t0c0l_v3r1fy | CRC_HEX=A7\`

According to the event specification, assemble these three elements into the official flag template:
\`PREFIX{TOKEN_CRC}\`

Submit the complete assembled flag string.`,
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
    flag: 'HTG{pr0t0c0l_v3r1fy_A7}',
    hints: [
      {
        hintIndex: 1,
        content: "Combine HTG + '{' + pr0t0c0l_v3r1fy + '_' + A7 + '}'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE04',
      seedId: 'HTG-L01-OE04',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Combining PREFIX ('HTG') with '{' and TOKEN_CRC ('pr0t0c0l_v3r1fy_A7') and '}' yields 'HTG{pr0t0c0l_v3r1fy_A7}'.",
      essentialKeyPoints: [
        "Hexadecimal checksum suffixes prevent accidental transcription errors.",
        "Token and checksum joining with underscore delimiter."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{pr0t0c0l_v3r1fy_A7}'.",
        partialCredit: "Submits 'pr0t0c0l_v3r1fy_A7' or 'A7'.",
        noCredit: "Submits malformed syntax."
      },
      acceptableAlternatives: ['HTG{pr0t0c0l_v3r1fy_A7}', 'htg{pr0t0c0l_v3r1fy_A7}'],
      safetyNotes: 'Integrity tag verification.'
    }
  },
  {
    stableId: 'HTG-L01-OE05',
    order: 15,
    levelNumber: 1,
    title: 'Leetspeak Flag Translation',
    prompt: `An intercepted encrypted token is hex-encoded:

\`73316d706c335f643363306433\`

Step 1: Convert these hexadecimal byte values into an ASCII leetspeak string.
Step 2: Translate the resulting leetspeak token into standard English words separated by an underscore, substituting numbers with their standard alphabet equivalents (1->i, 3->e, 0->o).

Submit the resulting plain English word pair.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'simple_decode',
    hints: [
      {
        hintIndex: 1,
        content: "Hex decodes to 's1mpl3_d3c0d3'. Substitute 1 with i, 3 with e, and 0 with o.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE05',
      seedId: 'HTG-L01-OE05',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "73 31 6d 70 6c 33 5f 64 33 63 30 64 33 decodes to 's1mpl3_d3c0d3'. Substituting 1->i, 3->e, 0->o yields 'simple_decode'.",
      essentialKeyPoints: [
        "Hex decoding to ASCII.",
        "Leetspeak substitution translation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'simple_decode' or 'simple decode'.",
        partialCredit: "Submits intermediate string 's1mpl3_d3c0d3'.",
        noCredit: "Submits incorrect translation."
      },
      acceptableAlternatives: ['simple_decode', 'simple decode', 'SIMPLE_DECODE', 'HTG{simple_decode}'],
      safetyNotes: 'Character substitution recognition drill.'
    }
  },
  {
    stableId: 'HTG-L01-OE06',
    order: 16,
    levelNumber: 1,
    title: 'Identifying False Flags & Canary Tokens',
    prompt: `A forensic scan of a staging server uncovered two candidate encoded streams:

Stream Alpha: \`RkFLRXtkMF9uMHRfc3VibTF0X20zfQ==\`
Stream Beta: \`SFRHe3Y0bDFkX2IzNGMwbl9mMHVuZH0=\`

One stream decodes to a decoy canary token, while the other decodes to an authentic tournament flag starting with the authorized event prefix.

Decode the streams and submit the full valid competition flag string.`,
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
    flag: 'HTG{v4l1d_b34c0n_f0und}',
    hints: [
      {
        hintIndex: 1,
        content: "Stream Alpha decodes to FAKE{...}. Stream Beta decodes to the authentic HTG flag.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE06',
      seedId: 'HTG-L01-OE06',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Stream Alpha decodes to 'FAKE{d0_n0t_subm1t_m3}'. Stream Beta decodes to 'HTG{v4l1d_b34c0n_f0und}'. Only the token with prefix 'HTG{' is valid.",
      essentialKeyPoints: [
        "Canary token filtering.",
        "Authorized prefix verification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{v4l1d_b34c0n_f0und}'.",
        partialCredit: "Submits 'Stream Beta'.",
        noCredit: "Submits decoy token 'FAKE{...}'."
      },
      acceptableAlternatives: ['HTG{v4l1d_b34c0n_f0und}', 'htg{v4l1d_b34c0n_f0und}', 'Stream Beta'],
      safetyNotes: 'Decoy flag avoidance awareness.'
    }
  },
  {
    stableId: 'HTG-L01-OE07',
    order: 17,
    levelNumber: 1,
    title: 'Flag Entropy Character Diversity',
    prompt: `A cryptographic security policy requires measuring character set diversity for tokens.

Consider the token string: \`s3cur1ty\`

How many unique (distinct) characters comprise this string? Submit the integer count.`,
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
    flag: '8',
    hints: [
      {
        hintIndex: 1,
        content: "List each character: s, 3, c, u, r, 1, t, y. Check for any repetitions.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE07',
      seedId: 'HTG-L01-OE07',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "The characters in 's3cur1ty' are ['s', '3', 'c', 'u', 'r', '1', 't', 'y']. Every character is unique, yielding exactly 8 distinct characters.",
      essentialKeyPoints: [
        "Character set cardinality evaluation.",
        "Zero duplicate characters in this specific token."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 8.",
        partialCredit: "Submits 'eight'.",
        noCredit: "Submits count less than 8 or greater than 8."
      },
      acceptableAlternatives: ['8', 'eight', '8 characters'],
      safetyNotes: 'Introductory entropy calculation.'
    }
  },
  {
    stableId: 'HTG-L01-OE08',
    order: 18,
    levelNumber: 1,
    title: 'Reconstructing Fragmented Flag',
    prompt: `A network packet fragmentation monitor split an incoming flag across three consecutive transmission fragments:

Fragment A: \`PREFIX=HTG\`
Fragment B: \`PAYLOAD_P1=spl1t_\`
Fragment C: \`PAYLOAD_P2=fl4g\`

Following standard flag syntax \`PREFIX{PAYLOAD_P1 + PAYLOAD_P2}\`, reconstruct and submit the complete unbroken flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{spl1t_fl4g}',
    hints: [
      {
        hintIndex: 1,
        content: "Concatenate HTG + '{' + spl1t_ + fl4g + '}'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE08',
      seedId: 'HTG-L01-OE08',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Concatenating PREFIX ('HTG') with '{' + 'spl1t_' + 'fl4g' + '}' produces 'HTG{spl1t_fl4g}'.",
      essentialKeyPoints: [
        "Packet reassembly preserves intra-stream character sequences.",
        "No whitespace or separators added between adjacent chunks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{spl1t_fl4g}'.",
        partialCredit: "Submits inner token 'spl1t_fl4g'.",
        noCredit: "Submits fragments out of order or with extra spaces."
      },
      acceptableAlternatives: ['HTG{spl1t_fl4g}', 'htg{spl1t_fl4g}'],
      safetyNotes: 'Fragment stream reassembly.'
    }
  },
  {
    stableId: 'HTG-L01-OE09',
    order: 19,
    levelNumber: 1,
    title: 'Stripping Trailing Metadata Nonce',
    prompt: `An automated log ingest pipeline recorded an event payload with an appended timestamp nonce:

\`RAW_RECORD::PREFIX=HTG::PAYLOAD=auth_t0k3n_99::NONCE=1710000000\`

Extract the PREFIX and PAYLOAD, discard the trailing NONCE parameter, and format the result into the canonical flag template \`PREFIX{PAYLOAD}\`.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{auth_t0k3n_99}',
    hints: [
      {
        hintIndex: 1,
        content: "Discard NONCE and combine PREFIX and PAYLOAD into HTG{...}.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE09',
      seedId: 'HTG-L01-OE09',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Extracting PREFIX ('HTG') and PAYLOAD ('auth_t0k3n_99') and formatting gives 'HTG{auth_t0k3n_99}'. The NONCE metadata is discarded.",
      essentialKeyPoints: [
        "Telemetry sanitization.",
        "Canonical flag encapsulation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{auth_t0k3n_99}'.",
        partialCredit: "Submits 'auth_t0k3n_99'.",
        noCredit: "Includes the timestamp nonce in the flag."
      },
      acceptableAlternatives: ['HTG{auth_t0k3n_99}', 'htg{auth_t0k3n_99}'],
      safetyNotes: 'Log sanitization exercise.'
    }
  },
  {
    stableId: 'HTG-L01-OE10',
    order: 20,
    levelNumber: 1,
    title: 'Event Namespace Prefix Identification',
    prompt: `Security documentation describes tournament operations for collegiate cyber defense exercises.

The title of this official tournament is "Hack The Grid".

What three-letter uppercase abbreviation formed by the initial letters of each word in the event title serves as the official flag namespace prefix? Submit the 3 letters.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG',
    hints: [
      {
        hintIndex: 1,
        content: "Take the first letter of Hack, The, and Grid.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE10',
      seedId: 'HTG-L01-OE10',
      subtopic: 'Basic CTF Methodology & Flag-Format Recognition',
      explanation: "Taking the initial letters of [H]ack [T]he [G]rid yields 'HTG', the official namespace prefix.",
      essentialKeyPoints: [
        "Official namespace identifier is 'HTG'.",
        "Corresponds to the tournament title."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG'.",
        partialCredit: "Submits 'HTG{'.",
        noCredit: "Submits other acronyms like CTF or FLAG."
      },
      acceptableAlternatives: ['HTG', 'htg', 'HTG{'],
      safetyNotes: 'Tournament orientation standard.'
    }
  }
];

module.exports = subtopic1Questions;

