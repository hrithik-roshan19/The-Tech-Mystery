const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L01-OE51',
    order: 61,
    levelNumber: 1,
    title: 'HTTP Header Security Token Extraction',
    prompt: `A curl probe against a web service returned the following HTTP response headers:

\`\`\`http
HTTP/1.1 200 OK
Server: nginx/1.18.0
Content-Type: text/html
X-Challenge-Token: SFRHe2hkcl90MGszbl80Mn0=
Content-Length: 104
\`\`\`

Decode the Base64 value of the custom header 'X-Challenge-Token' to reveal the complete competition flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.WEB,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{hdr_t0k3n_42}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the value 'SFRHe2hkcl90MGszbl80Mn0=' and decode it using base64 -d.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE51',
      seedId: 'HTG-L01-OE51',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "HTTP headers convey metadata between clients and servers. The Base64 string 'SFRHe2hkcl90MGszbl80Mn0=' decodes to 'HTG{hdr_t0k3n_42}'.",
      essentialKeyPoints: [
        "Inspecting HTTP response metadata headers.",
        "Base64 decoding custom header parameters."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{hdr_t0k3n_42}'.",
        partialCredit: "Submits 'hdr_t0k3n_42'.",
        noCredit: "Submits unencoded base64 or wrong header."
      },
      acceptableAlternatives: ['HTG{hdr_t0k3n_42}', 'htg{hdr_t0k3n_42}'],
      safetyNotes: 'HTTP protocol metadata analysis.'
    }
  },
  {
    stableId: 'HTG-L01-OE52',
    order: 62,
    levelNumber: 1,
    title: 'PNG Image File Magic Signature Identification',
    prompt: `A hex editor inspection of an unknown recovered file reveals the following leading 4 bytes:

\`89 50 4E 47\`

What standard graphic image file format is identified by these initial magic bytes? Submit the common 3-letter file extension or name.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.FORENSICS,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'PNG',
    hints: [
      {
        hintIndex: 1,
        content: "0x50 0x4E 0x47 in ASCII translates directly to 'PNG'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE52',
      seedId: 'HTG-L01-OE52',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "The magic bytes 89 50 4E 47 0D 0A 1A 0A define the Portable Network Graphics (PNG) file format.",
      essentialKeyPoints: [
        "File signatures (magic numbers) identify true file type regardless of extension.",
        "89 50 4E 47 is the PNG signature."
      ],
      gradingRubric: {
        fullCredit: "Submits 'PNG'.",
        partialCredit: "Submits 'png' or 'Portable Network Graphics'.",
        noCredit: "Submits JPG, GIF, or other formats."
      },
      acceptableAlternatives: ['PNG', 'png', 'Portable Network Graphics', '.png'],
      safetyNotes: 'File carving and header inspection.'
    }
  },
  {
    stableId: 'HTG-L01-OE53',
    order: 63,
    levelNumber: 1,
    title: 'Document Header Magic Bytes Identification',
    prompt: `A digital forensics carve operation extracts a file header beginning with 4 hexadecimal bytes:

\`25 50 44 46\`

Translating the final three hexadecimal bytes (50 44 46) into ASCII characters yields a standard 3-letter document format acronym.

What is this 3-letter uppercase format name or extension?`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.FORENSICS,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'PDF',
    hints: [
      {
        hintIndex: 1,
        content: "50 is 'P', 44 is 'D', 46 is 'F'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE53',
      seedId: 'HTG-L01-OE53',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "All PDF documents begin with '%PDF' (hex 25 50 44 46). 50 44 46 represents the acronym 'PDF'.",
      essentialKeyPoints: [
        "PDF file format header signature.",
        "Hex 25 50 44 46 = %PDF."
      ],
      gradingRubric: {
        fullCredit: "Submits 'PDF'.",
        partialCredit: "Submits 'pdf' or 'Portable Document Format'.",
        noCredit: "Submits wrong file extension."
      },
      acceptableAlternatives: ['PDF', 'pdf', 'Portable Document Format', '.pdf'],
      safetyNotes: 'Forensics file signature verification.'
    }
  },
  {
    stableId: 'HTG-L01-OE54',
    order: 64,
    levelNumber: 1,
    title: 'ICMP Echo Reply OS Fingerprinting',
    prompt: `An ICMP echo response packet capture line displays the following output:

\`32 bytes from 10.0.0.45: icmp_seq=1 ttl=64 time=0.812 ms\`

In network reconnaissance, default initial TTL values near 64 typically indicate Unix-like operating systems (as opposed to Windows, which defaults to 128).

What is the widely used open-source Unix-like operating system kernel created by Linus Torvalds that natively uses an initial TTL of 64?`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.NETWORK,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'Linux',
    hints: [
      {
        hintIndex: 1,
        content: "TTL 64 is the classic signature of the kernel named after Linus.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE54',
      seedId: 'HTG-L01-OE54',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "A default initial TTL of 64 is the standard footprint of Linux kernels. Windows hosts default to TTL 128.",
      essentialKeyPoints: [
        "TTL field in IP header / ping output.",
        "OS fingerprinting baseline (64 for Linux, 128 for Windows)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'Linux'.",
        partialCredit: "Submits 'Unix' or 'linux'.",
        noCredit: "Submits Windows."
      },
      acceptableAlternatives: ['Linux', 'linux', 'Unix', 'unix'],
      safetyNotes: 'Passive network stack reconnaissance.'
    }
  },
  {
    stableId: 'HTG-L01-OE55',
    order: 65,
    levelNumber: 1,
    title: 'Syslog Severity Numerical Level Calculation',
    prompt: `An RFC 5424 syslog transmission header begins with the PRI code:

\`<13>\`

The PRI formula is: \`Priority = (Facility * 8) + Severity\`

You are given that Facility = 1 (user-level messages).

Calculate the integer Severity level: \`Severity = Priority - (Facility * 8)\`. Submit the integer result.`,
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
    flag: '5',
    hints: [
      {
        hintIndex: 1,
        content: "13 - (1 * 8) = 13 - 8.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE55',
      seedId: 'HTG-L01-OE55',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "Given Priority = 13 and Facility = 1: 1 * 8 = 8. Severity = 13 - 8 = 5 (which corresponds to 'Notice' in RFC 5424 severity tables).",
      essentialKeyPoints: [
        "RFC 5424 PRI calculation: PRI = Facility * 8 + Severity.",
        "Severity level 5 represents 'Notice'."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 5.",
        partialCredit: "Submits 'five'.",
        noCredit: "Incorrect arithmetic."
      },
      acceptableAlternatives: ['5', 'five'],
      safetyNotes: 'Log protocol standard arithmetic.'
    }
  },
  {
    stableId: 'HTG-L01-OE56',
    order: 66,
    levelNumber: 1,
    title: 'MD5 Hash Digest Bit Length',
    prompt: `An integrity checksum was calculated using the MD5 hash function:

\`5d41402abc4b2a76b9719d911017c592\`

The hex representation consists of exactly 32 hexadecimal characters. Since each hexadecimal character represents 4 bits, how many total bits comprise an MD5 digest? Submit the integer count.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '128',
    hints: [
      {
        hintIndex: 1,
        content: "Multiply 32 hex characters by 4 bits per character (32 * 4).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE56',
      seedId: 'HTG-L01-OE56',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "MD5 produces a 128-bit digest (16 bytes). Expressed in hexadecimal, 128 bits / 4 bits/char = 32 hex characters.",
      essentialKeyPoints: [
        "MD5 produces a 128-bit hash.",
        "32 hex characters = 16 bytes = 128 bits."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 128.",
        partialCredit: "Submits '128 bits'.",
        noCredit: "Submits 256, 32, or 16."
      },
      acceptableAlternatives: ['128', '128 bits'],
      safetyNotes: 'Cryptographic hash size fundamentals.'
    }
  },
  {
    stableId: 'HTG-L01-OE57',
    order: 67,
    levelNumber: 1,
    title: 'Cryptographic Digest Bit Length Calculation',
    prompt: `A secure firmware image verification block computes a digest represented as 64 hexadecimal characters.

Since each hexadecimal character represents 4 bits of binary data, calculate the total bit length of this digest: \`64 * 4\`. Submit the integer count.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '256',
    hints: [
      {
        hintIndex: 1,
        content: "64 multiplied by 4 equals 256.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE57',
      seedId: 'HTG-L01-OE57',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "64 hex digits * 4 bits/digit = 256 bits (32 bytes). This is the standard output size of SHA-256.",
      essentialKeyPoints: [
        "64 hex digits = 256 bits.",
        "Standard SHA-2 digest size."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 256.",
        partialCredit: "Submits '256 bits'.",
        noCredit: "Submits incorrect multiplication."
      },
      acceptableAlternatives: ['256', '256 bits'],
      safetyNotes: 'Cryptographic hash standard knowledge.'
    }
  },
  {
    stableId: 'HTG-L01-OE58',
    order: 68,
    levelNumber: 1,
    title: 'HTTP Cookie Flag Parameter Extraction',
    prompt: `A packet capture of an authenticated web session reveals the following HTTP request header:

\`\`\`http
Cookie: session_id=sess_987123; tracking=false; flag_cookie=SFRHe2MwMGsxM19tMG5zdDNyfQ==
\`\`\`

Extract and Base64-decode the value assigned to the 'flag_cookie' parameter. Submit the complete recovered flag string.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.WEB,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: 'HTG{c00k13_m0nst3r}',
    hints: [
      {
        hintIndex: 1,
        content: "Decode 'SFRHe2MwMGsxM19tMG5zdDNyfQ==' using Base64 decode.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE58',
      seedId: 'HTG-L01-OE58',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "Extracting the value 'SFRHe2MwMGsxM19tMG5zdDNyfQ==' and Base64 decoding produces 'HTG{c00k13_m0nst3r}'.",
      essentialKeyPoints: [
        "Cookie header key-value parsing.",
        "Base64 cookie payload extraction."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{c00k13_m0nst3r}'.",
        partialCredit: "Submits 'c00k13_m0nst3r'.",
        noCredit: "Submits other cookie values like 'sess_987123'."
      },
      acceptableAlternatives: ['HTG{c00k13_m0nst3r}', 'htg{c00k13_m0nst3r}'],
      safetyNotes: 'Session header analysis.'
    }
  },
  {
    stableId: 'HTG-L01-OE59',
    order: 69,
    levelNumber: 1,
    title: 'Unix Epoch Origin Calendar Year',
    prompt: `A digital forensics timestamp parser encounters a raw timestamp integer of \`0\` in a POSIX system log.

In what calendar year does the standard Unix epoch begin (January 1st of that year at 00:00:00 UTC)? Submit the 4-digit year.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.FORENSICS,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '1970',
    hints: [
      {
        hintIndex: 1,
        content: "The Unix epoch was established on January 1st, nineteen seventy.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE59',
      seedId: 'HTG-L01-OE59',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "Unix time counts the number of seconds elapsed since Thursday, 1 January 1970 00:00:00 UTC.",
      essentialKeyPoints: [
        "Unix epoch baseline is 1970.",
        "Fundamental to digital forensics file timestamp analysis."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 1970.",
        partialCredit: "Submits 'nineteen seventy'.",
        noCredit: "Submits 2000, 1980, etc."
      },
      acceptableAlternatives: ['1970', 'nineteen seventy'],
      safetyNotes: 'Forensics timekeeping baseline.'
    }
  },
  {
    stableId: 'HTG-L01-OE60',
    order: 70,
    levelNumber: 1,
    title: 'IPv4 Point-to-Point Subnet Total Addresses',
    prompt: `A network router configuration links two core routers using an IPv4 subnet with a CIDR prefix of \`/30\` (subnet mask \`255.255.255.252\`).

The number of total IP addresses in an IPv4 block is given by 2^(32 - prefix). For prefix 30, this is 2^(32 - 30) = 2^2.

Calculate the total number of IP addresses (including network and broadcast) in this subnet block. Submit the integer count.`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: CHALLENGE_TYPES.NETWORK,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    flag: '4',
    hints: [
      {
        hintIndex: 1,
        content: "2 raised to the power of 2 equals 4.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L01-OE60',
      seedId: 'HTG-L01-OE60',
      subtopic: 'Introductory Evidence Interpretation & Metadata Clues',
      explanation: "In a /30 subnet, 32 - 30 = 2 host bits. 2^2 = 4 total IP addresses (1 network, 2 usable host IPs, 1 broadcast).",
      essentialKeyPoints: [
        "CIDR math: 2^(32 - prefix).",
        "/30 subnets provide 4 total addresses (2 usable)."
      ],
      gradingRubric: {
        fullCredit: "Submits integer 4.",
        partialCredit: "Submits 'four'.",
        noCredit: "Submits 2 (which is usable hosts, not total addresses) or other number."
      },
      acceptableAlternatives: ['4', 'four'],
      safetyNotes: 'Subnetting fundamentals.'
    }
  }
];

module.exports = subtopic6Questions;
