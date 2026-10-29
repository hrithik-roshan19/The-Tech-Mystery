const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    stableId: 'HTG-L10-OE11',
    order: 11,
    levelNumber: 10,
    title: 'Standard Git Object Identifier Cryptographic Hash Algorithm',
    prompt: `In reconstructing public code repository histories during OSINT investigations, analysts inspect Git commit, tree, and blob object hashes.

In standard Git installations (prior to optional SHA-256 transitions), which cryptographic hash algorithm produces the 40-character hexadecimal object identifiers (160-bit digest)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the algorithm name).`,
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
    flag: 'HTG{SHA-1}',
    hints: [
      {
        hintIndex: 1,
        content: "Git historically hashes objects using SHA-1 (40 hex characters).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE11',
      seedId: 'HTG-L10-OE11',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "Git uses SHA-1 to compute content-addressable object identifiers.",
      essentialKeyPoints: [
        "Every commit, tree, and blob is indexed by its 160-bit SHA-1 digest.",
        "Forensic tools search object loose databases for dangling commit hashes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SHA-1}' or 'SHA-1'.",
        partialCredit: "Submits 'SHA1' or 'sha-1'.",
        noCredit: "Submits SHA-256 or MD5."
      },
      acceptableAlternatives: ['HTG{SHA-1}', 'SHA-1', 'SHA1', 'sha-1', 'sha1', 'HTG{SHA1}']
    }
  },
  {
    stableId: 'HTG-L10-OE12',
    order: 12,
    levelNumber: 10,
    title: 'DNS Start of Authority (SOA) Zone Management Record',
    prompt: `In investigating domain infrastructure and DNS footprinting, an analyst queries the root of the target DNS zone.

Which 3-letter DNS resource record type specifies authoritative management parameters for the zone, including primary name server, administrator email, serial version number, and expiration timers?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter record type).`,
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
    flag: 'HTG{SOA}',
    hints: [
      {
        hintIndex: 1,
        content: "Start of Authority is abbreviated SOA.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE12',
      seedId: 'HTG-L10-OE12',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "SOA (Start of Authority) records supply authoritative parameters and administrative contacts for a DNS zone.",
      essentialKeyPoints: [
        "SOA serial numbers often reflect commit dates in format YYYYMMDDNN.",
        "The RNAME field exposes the administrator email address formatted with a dot instead of @."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SOA}' or 'SOA'.",
        partialCredit: "Submits lowercase 'soa'.",
        noCredit: "Submits NS or MX."
      },
      acceptableAlternatives: ['HTG{SOA}', 'SOA', 'soa', 'HTG{soa}']
    }
  },
  {
    stableId: 'HTG-L10-OE13',
    order: 13,
    levelNumber: 10,
    title: 'OpenPGP v4 Key Fingerprint Hexadecimal Length',
    prompt: `In public key cryptography and verified Git commit signatures, OpenPGP (RFC 4880) identifies public keys by a cryptographic fingerprint calculated as the SHA-1 hash of the key material and creation timestamp.

How many hexadecimal characters (equivalent to 160 bits / 20 bytes) comprise a standard OpenPGP v4 key fingerprint?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer count).`,
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
    flag: 'HTG{40}',
    hints: [
      {
        hintIndex: 1,
        content: "A 160-bit SHA-1 hash is 40 hexadecimal characters.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE13',
      seedId: 'HTG-L10-OE13',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "An OpenPGP v4 fingerprint consists of 40 hexadecimal characters.",
      essentialKeyPoints: [
        "Short key IDs (8 hex characters) and long key IDs (16 hex characters) are trailing slices of the 40-character fingerprint.",
        "Verifying author attribution requires matching the full 40-character fingerprint."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{40}' or '40'.",
        partialCredit: "Submits 'forty'.",
        noCredit: "Submits 64 or 32."
      },
      acceptableAlternatives: ['HTG{40}', '40', 'forty', 'HTG{forty}']
    }
  },
  {
    stableId: 'HTG-L10-OE14',
    order: 14,
    levelNumber: 10,
    title: 'Dual Git Commit Timestamp Differential Property',
    prompt: `When investigating suspicious repository activity, digital forensic analysts examine commit timestamps. Git records two separate timestamps for each commit object:
1. The \`Author Date\` (when code was originally written)
2. The date recorded when the commit was actually applied, amended, cherry-picked, or rebased.

What name is given to this second date field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the field name).`,
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
    flag: 'HTG{Committer}',
    hints: [
      {
        hintIndex: 1,
        content: "Git pairs Author with Committer (e.g. Committer date).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE14',
      seedId: 'HTG-L10-OE14',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "The Committer date reflects when a commit was written into the repository tree, distinct from Author date.",
      essentialKeyPoints: [
        "Discrepancies between Author and Committer timestamps expose rebasing or historical tampering.",
        "Git commit objects store both author and committer headers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Committer}' or 'Committer'.",
        partialCredit: "Submits 'committer' or 'Committer Date'.",
        noCredit: "Submits Push Date or Reviewer."
      },
      acceptableAlternatives: ['HTG{Committer}', 'Committer', 'committer', 'Committer Date', 'committer date', 'HTG{committer}']
    }
  },
  {
    stableId: 'HTG-L10-OE15',
    order: 15,
    levelNumber: 10,
    title: 'Autonomous System Number (ASN) Routing Identifier',
    prompt: `In BGP routing and network OSINT, independent networks administered by single technical entities (such as universities, ISPs, or enterprises) are assigned globally unique numeric routing identifiers.

What 3-letter acronym represents the Autonomous System Number used to correlate IP subnets with their governing organization?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{ASN}',
    hints: [
      {
        hintIndex: 1,
        content: "Autonomous System Number is abbreviated ASN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE15',
      seedId: 'HTG-L10-OE15',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "An ASN (Autonomous System Number) identifies an autonomous network routing domain in BGP tables.",
      essentialKeyPoints: [
        "ASN lookup maps disparate IP addresses to a common infrastructure provider.",
        "Routing registries (ARIN, RIPE, APNIC) maintain ASN allocation records."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ASN}' or 'ASN'.",
        partialCredit: "Submits lowercase 'asn'.",
        noCredit: "Submits CIDR or BGP."
      },
      acceptableAlternatives: ['HTG{ASN}', 'ASN', 'asn', 'HTG{asn}']
    }
  },
  {
    stableId: 'HTG-L10-OE16',
    order: 16,
    levelNumber: 10,
    title: 'Certificate Transparency Signed Certificate Timestamp (SCT)',
    prompt: `To detect fraudulent or mistakenly issued SSL/TLS certificates, Certificate Transparency (RFC 6962) requires Certificate Authorities to append cryptographic receipts to publicly audited append-only logs.

What 3-letter uppercase acronym designates the Signed Certificate Timestamp issued by a CT log server as cryptographic proof of logging?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{SCT}',
    hints: [
      {
        hintIndex: 1,
        content: "Signed Certificate Timestamp is abbreviated SCT.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE16',
      seedId: 'HTG-L10-OE16',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "An SCT (Signed Certificate Timestamp) proves that a certificate was recorded in a Certificate Transparency log.",
      essentialKeyPoints: [
        "Browsers mandate SCTs for EV and public TLS certificates.",
        "CT search engines (e.g. crt.sh) query log entries to enumerate hidden subdomains."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SCT}' or 'SCT'.",
        partialCredit: "Submits lowercase 'sct'.",
        noCredit: "Submits CRL or OCSP."
      },
      acceptableAlternatives: ['HTG{SCT}', 'SCT', 'sct', 'HTG{sct}']
    }
  },
  {
    stableId: 'HTG-L10-OE17',
    order: 17,
    levelNumber: 10,
    title: 'Classical Rail Fence Transposition Cipher',
    prompt: `In investigating a classical transposition cipher found in a committer's personal note, the plaintext characters are written in a zig-zag diagonal path along an imaginary fence with a specified number of horizontal rails:
\`\`\`text
Rail 1:  S . . . R . . . T
Rail 2:  . E . E . E . I .
Rail 3:  . . C . . . C . .
\`\`\`
What 2-word name (often called the "... fence cipher") identifies this classical transposition system?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word cipher name).`,
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
    flag: 'HTG{rail fence}',
    hints: [
      {
        hintIndex: 1,
        content: "The cipher is the rail fence cipher.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE17',
      seedId: 'HTG-L10-OE17',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "The rail fence cipher writes text diagonally in a zig-zag wave across N rails before reading rows horizontally.",
      essentialKeyPoints: [
        "Rail fence is a transposition cipher that preserves letter frequencies while shuffling positions.",
        "Reconstruction requires determining the depth (rail count) and offset."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rail fence}' or 'rail fence'.",
        partialCredit: "Submits 'Rail Fence' or 'rail fence cipher'.",
        noCredit: "Submits Caesar or Scytale."
      },
      acceptableAlternatives: ['HTG{rail fence}', 'rail fence', 'Rail Fence', 'rail fence cipher', 'Rail Fence Cipher', 'HTG{Rail Fence}']
    }
  },
  {
    stableId: 'HTG-L10-OE18',
    order: 18,
    levelNumber: 10,
    title: 'Git Object Store Deflate / Zlib Compression Engine',
    prompt: `When investigating an abandoned repository clone on a compromised endpoint, an investigator recovers loose objects under \`.git/objects/??/*\`.

Each loose object file consists of a header and content compressed using which industry-standard DEFLATE-based compression library?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the library name).`,
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
    flag: 'HTG{zlib}',
    hints: [
      {
        hintIndex: 1,
        content: "Git compresses loose objects with zlib.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE18',
      seedId: 'HTG-L10-OE18',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "Git compresses loose objects with zlib (header 'commit/blob/tree <size>\\0' followed by content).",
      essentialKeyPoints: [
        "Uncompressing .git/objects using Python's zlib.decompress() recovers deleted files.",
        "Carving loose objects unearths commit data not referenced in current branches."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{zlib}' or 'zlib'.",
        partialCredit: "Submits capitalized 'Zlib' or 'deflate'.",
        noCredit: "Submits gzip or lzma."
      },
      acceptableAlternatives: ['HTG{zlib}', 'zlib', 'Zlib', 'deflate', 'HTG{Zlib}']
    }
  },
  {
    stableId: 'HTG-L10-OE19',
    order: 19,
    levelNumber: 10,
    title: 'GitHub Personal Access Token Standard Prefix',
    prompt: `In token leakage analysis across public code repositories, automated secret scanners match prefixes to identify leaked credentials.

What 3-letter prefix (followed by an underscore, e.g. \`???_...\`) designates modern standard GitHub personal access tokens?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter prefix).`,
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
    flag: 'HTG{ghp}',
    hints: [
      {
        hintIndex: 1,
        content: "GitHub Personal Access Tokens begin with ghp_.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE19',
      seedId: 'HTG-L10-OE19',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "GitHub personal access tokens use the prefix 'ghp_' to aid secret scanning engines.",
      essentialKeyPoints: [
        "Other GitHub prefixes include gho_ (OAuth), ghu_ (user-to-server), and ghs_ (server-to-server).",
        "Regex patterns like 'ghp_[A-Za-z0-9_]{36}' locate leaked credentials in Git history."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ghp}' or 'ghp'.",
        partialCredit: "Submits 'ghp_' or 'GHP'.",
        noCredit: "Submits glpat or token."
      },
      acceptableAlternatives: ['HTG{ghp}', 'ghp', 'ghp_', 'GHP', 'HTG{ghp_}']
    }
  },
  {
    stableId: 'HTG-L10-OE20',
    order: 20,
    levelNumber: 10,
    title: 'Recovered Deleted Git Reflog Secret Token',
    prompt: `An investigator examines the Git reflog of a developer workstation and uncovers a sanitized commit that previously committed an administrative gateway secret:
\`\`\`text
$ git log -p -1 a1b2c3d
commit a1b2c3d4e5f6...
Author: sysadmin <admin@grid-corp.test>
Date:   Mon Oct 26 14:12:00 2026 -0400

    hotfix: sanitize leaked access key

diff --git a/config.env b/config.env
--- a/config.env
+++ b/config.env
@@ -1,3 +1,3 @@
-GATEWAY_TOKEN=GATEWAY_TOKEN_44
+GATEWAY_TOKEN=REDACTED
\`\`\`
What was the exact gateway token string that was committed and subsequent sanitized from \`config.env\`?

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
    flag: 'HTG{GATEWAY_TOKEN_44}',
    hints: [
      {
        hintIndex: 1,
        content: "The removed value was GATEWAY_TOKEN_44.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE20',
      seedId: 'HTG-L10-OE20',
      subtopic: 'Cross-synthesis of Lost Transmission & Digital Footprint',
      explanation: "Git commit diff shows the removed token was 'GATEWAY_TOKEN_44'.",
      essentialKeyPoints: [
        "Sanitizing files in new commits does not purge historical commits from Git object history.",
        "The recovered token represents the second key component of the citadel puzzle."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GATEWAY_TOKEN_44}'.",
        partialCredit: "Submits 'GATEWAY_TOKEN_44' without curly braces.",
        noCredit: "Submits REDACTED."
      },
      acceptableAlternatives: ['HTG{GATEWAY_TOKEN_44}', 'GATEWAY_TOKEN_44', 'gateway_token_44', 'HTG{gateway_token_44}']
    }
  }
];

module.exports = subtopic2Questions;

