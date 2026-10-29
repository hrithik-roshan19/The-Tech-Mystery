const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L04-OE41',
    order: 41,
    levelNumber: 4,
    title: 'Gravatar Profile Image MD5 Hash Calculation',
    prompt: `An OSINT investigator discovers an email address associated with an administrative account: \`analyst.keene@gridcorp.io\`.

Globally Recognized Avatars (Gravatar) calculate profile image endpoints by taking the lowercase, trimmed email address and computing its hexadecimal MD5 cryptographic hash (\`https://www.gravatar.com/avatar/<md5>\`).

Compute the 32-character hexadecimal MD5 hash for \`analyst.keene@gridcorp.io\`.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 32-character hex hash).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{3f9c39385555b96f7b0ad9e1f819dc00}',
    hints: [
      {
        hintIndex: 1,
        content: "Ensure the email is trimmed and lowercase before running MD5. The hash starts with '3f9c' and ends with 'dc00'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE41',
      seedId: 'HTG-L04-OE41',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Gravatar generates user avatar queries by taking the lowercase MD5 hash of an email. MD5('analyst.keene@gridcorp.io') produces 3f9c39385555b96f7b0ad9e1f819dc00.",
      essentialKeyPoints: [
        "Gravatar hashing can be reversed via rainbow tables or brute-forcing if wordlists match.",
        "Querying avatar hashes often confirms whether an email has an active presence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{3f9c39385555b96f7b0ad9e1f819dc00}' or '3f9c39385555b96f7b0ad9e1f819dc00'.",
        partialCredit: "Submits uppercase MD5 string.",
        noCredit: "Submits SHA256 hash or raw email."
      },
      acceptableAlternatives: [
        'HTG{3f9c39385555b96f7b0ad9e1f819dc00}',
        '3f9c39385555b96f7b0ad9e1f819dc00',
        '3F9C39385555B96F7B0AD9E1F819DC00'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE42',
    order: 42,
    levelNumber: 4,
    title: 'Cross-Platform Username Correlation and Domain Proof',
    prompt: `An investigator tracks an online alias \`valkyrie_sec\` across multiple developer platforms. On Keybase, the profile contains a cryptographically verified proof linking identity ownership to an external personal domain:

\`\`\`text
Username:   valkyrie_sec
Proof Type: dns
Domain:     valkyriesec.internal
Signature:  Verified by Keybase Key ID 7A9B01C2
Status:     Active / Valid
\`\`\`

Identify the verified domain name linked to this alias profile.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the domain).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{valkyriesec.internal}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the string following 'Domain: ' in the proof summary.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE42',
      seedId: 'HTG-L04-OE42',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Platforms like Keybase use cryptographic signatures in DNS TXT records or web proofs to verify that an online persona controls a specific domain name.",
      essentialKeyPoints: [
        "Cryptographic identity proofs bridge anonymous social handles to real infrastructure.",
        "Domain proofs establish high-confidence attribution across disjoint platforms."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{valkyriesec.internal}' or 'valkyriesec.internal'.",
        partialCredit: "Submits uppercase 'VALKYRIESEC.INTERNAL'.",
        noCredit: "Submits the handle valkyrie_sec."
      },
      acceptableAlternatives: ['HTG{valkyriesec.internal}', 'valkyriesec.internal', 'VALKYRIESEC.INTERNAL']
    }
  },
  {
    stableId: 'HTG-L04-OE43',
    order: 43,
    levelNumber: 4,
    title: 'OpenPGP Public Key User ID Email Extraction',
    prompt: `An auditor parses a PGP public key certificate extracted from a public keyserver:

\`\`\`text
Type: Public Key Packet (Tag 6)
Key Algorithm: RSA (2048-bit)
Key ID: F4A12B890CD34EF1
User ID Packet (Tag 13):
  Elena Rostova (Lead Architect) <elena.rostova@helios-labs.test>
\`\`\`

Extract the email address contained within the OpenPGP User ID packet (inside the angle brackets).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the email address).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{elena.rostova@helios-labs.test}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the email text between '<' and '>'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE43',
      seedId: 'HTG-L04-OE43',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "OpenPGP User ID packets format identity strings as 'Name (Comment) <email>'. The email is elena.rostova@helios-labs.test.",
      essentialKeyPoints: [
        "Public keyserver directories (VKS/HKP) are valuable OSINT repositories for discovering organizational emails.",
        "Key creation dates and subkey bindings establish individual timelines."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{elena.rostova@helios-labs.test}' or 'elena.rostova@helios-labs.test'.",
        partialCredit: "Submits email with angle brackets.",
        noCredit: "Submits the user's name or key ID."
      },
      acceptableAlternatives: ['HTG{elena.rostova@helios-labs.test}', 'elena.rostova@helios-labs.test']
    }
  },
  {
    stableId: 'HTG-L04-OE44',
    order: 44,
    levelNumber: 4,
    title: 'Unix Epoch Account Registration Timestamp Analysis',
    prompt: `An analyst audits an account registration record recovered from a synthetic telemetry forum:

\`\`\`json
{
  "user_id": "usr-88192",
  "username": "GridOperator01",
  "created_at_epoch": 1700000000,
  "status": "active"
}
\`\`\`

The \`created_at_epoch\` field records seconds elapsed since the Unix epoch (1970-01-01 00:00:00 UTC). Epoch timestamp 1700000000 corresponds to Tuesday, November 14, 2023 at 22:13:20 UTC.

What is the four-digit calendar year in which this account was registered?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-digit year).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{2023}',
    hints: [
      {
        hintIndex: 1,
        content: "Convert 1700000000 seconds to calendar date: November 2023.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE44',
      seedId: 'HTG-L04-OE44',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Unix epoch timestamps store seconds since January 1, 1970 UTC. 1700000000 corresponds to November 14, 2023.",
      essentialKeyPoints: [
        "Database exports frequently store temporal metrics as integer epoch offsets.",
        "Account age verification is essential for identifying sleeper or sockpuppet personas."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2023}' or '2023'.",
        partialCredit: "Submits full date '2023-11-14'.",
        noCredit: "Submits current year or user ID."
      },
      acceptableAlternatives: ['HTG{2023}', '2023']
    }
  },
  {
    stableId: 'HTG-L04-OE45',
    order: 45,
    levelNumber: 4,
    title: 'Cross-Database User Identifier Identity De-Anonymization',
    prompt: `An investigator investigates a forum account operating under the handle \`CyberHawk99\` on \`forum.grid.test\`, which displays internal member ID \`8471\`.

Cross-referencing an archived legacy issue tracker database backup reveals historical registration records sharing the exact same numeric UID space:

\`\`\`text
UID: 8469 | Username: DataSentry   | Full Name: Robert Chen
UID: 8470 | Username: VoidRunner   | Full Name: Sarah Jenkins
UID: 8471 | Username: HawkDev      | Full Name: Julian Thorne
UID: 8472 | Username: EchoMatrix   | Full Name: Alicia Gomez
\`\`\`

Identify the real full name linked to member ID 8471 in this historical database.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the full name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{Julian Thorne}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the Full Name field for UID 8471.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE45',
      seedId: 'HTG-L04-OE45',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Numeric user IDs often persist across system upgrades or forum migrations even when users change display handles. UID 8471 maps to Julian Thorne.",
      essentialKeyPoints: [
        "Internal database primary keys are durable tracking anchors.",
        "Historical system migrations often leave unscrubbed records linking pseudonyms to real names."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Julian Thorne}' or 'Julian Thorne'.",
        partialCredit: "Submits lowercase 'julian thorne' or 'Julian_Thorne'.",
        noCredit: "Submits old username HawkDev or other UIDs."
      },
      acceptableAlternatives: [
        'HTG{Julian Thorne}',
        'Julian Thorne',
        'julian thorne',
        'JULIAN THORNE',
        'Julian_Thorne'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE46',
    order: 46,
    levelNumber: 4,
    title: 'Cyrillic Homoglyph Lookalike Handle Detection',
    prompt: `A social engineering actor created an imposter account mimicking a trusted lead developer (\`valkyrie_sec\`). A forensic character audit detects that the first 'a' in the imposter's username is not an ASCII Latin 'a' (U+0061), but rather a visually indistinguishable Cyrillic Small Letter A.

In standard Unicode notation (format \`U+XXXX\`), what is the 6-character hex code for the Cyrillic Small Letter A character?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the code, e.g. U+0430).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{U+0430}',
    hints: [
      {
        hintIndex: 1,
        content: "The Cyrillic small letter 'а' resides at Unicode codepoint U+0430.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE46',
      seedId: 'HTG-L04-OE46',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Internationalized Domain Name (IDN) and homoglyph attacks use visually identical characters from other alphabets. Cyrillic small 'а' is U+0430.",
      essentialKeyPoints: [
        "Homoglyphs bypass superficial visual scrutiny and naive string filters.",
        "Unicode normalization and codepoint analysis are critical for identity verification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{U+0430}' or 'U+0430'.",
        partialCredit: "Submits '0430' or 'u+0430'.",
        noCredit: "Submits ASCII code U+0061."
      },
      acceptableAlternatives: ['HTG{U+0430}', 'U+0430', 'u+0430', '0430']
    }
  },
  {
    stableId: 'HTG-L04-OE47',
    order: 47,
    levelNumber: 4,
    title: 'Online Gaming Profile Vanity URL Identifier',
    prompt: `An investigator profiles a threat actor who uses gaming platform services for out-of-band communication. The profile URL is recorded as:

\`\`\`text
https://steamcommunity.com/id/grid_commander/
\`\`\`

In the URL structure of the Steam Community, the path segment following \`/id/\` represents the custom vanity profile slug chosen by the user.

Extract this vanity identifier string.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the vanity slug).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{grid_commander}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the text between '/id/' and the closing slash.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE47',
      seedId: 'HTG-L04-OE47',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Steam vanity URLs under /id/ use user-selected handles that frequently match handles on GitHub, Reddit, or Discord.",
      essentialKeyPoints: [
        "Vanity URLs reflect personal branding choices that repeat across consumer platforms.",
        "Gaming and hobbyist accounts often leak personal details unavailable on professional networks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{grid_commander}' or 'grid_commander'.",
        partialCredit: "Submits uppercase 'GRID_COMMANDER'.",
        noCredit: "Submits the full URL."
      },
      acceptableAlternatives: ['HTG{grid_commander}', 'grid_commander', 'GRID_COMMANDER']
    }
  },
  {
    stableId: 'HTG-L04-OE48',
    order: 48,
    levelNumber: 4,
    title: 'OpenSSH Known Hosts Hashing Algorithm Standard',
    prompt: `A forensic examiner inspects an SSH client configuration directory containing a hashed \`known_hosts\` file:

\`\`\`text
|1|rW8kY2pZ1qL=|8vA1b2c3d4e5f6g7h8i9j0k1l2m= ecdsa-sha2-nistp256 AAAAE2VjZHNh...
\`\`\`

In OpenSSH host hashing architecture (enabled via \`HashKnownHosts yes\`), the \`|1|\` prefix designates version 1 of the hashing scheme, which uses a keyed hash with a per-host random salt.

What standard cryptographic MAC algorithm is used by OpenSSH to hash these hostnames (e.g. HMAC-SHA1)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the algorithm name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{HMAC-SHA1}',
    hints: [
      {
        hintIndex: 1,
        content: "OpenSSH uses HMAC-SHA1 with a 160-bit salt for known_hosts obfuscation.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE48',
      seedId: 'HTG-L04-OE48',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "OpenSSH known_hosts hashing uses HMAC-SHA1 to obscure hostnames and IPs from post-exploitation discovery while allowing clients to verify known server keys.",
      essentialKeyPoints: [
        "OpenSSH known_hosts format: |1|<base64 salt>|<base64 hmac>.",
        "Offline dictionary attacks can still verify candidate hostnames against the HMAC-SHA1 hash."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{HMAC-SHA1}' or 'HMAC-SHA1'.",
        partialCredit: "Submits lowercase 'hmac-sha1' or 'SHA1'.",
        noCredit: "Submits HMAC-MD5 or SHA256."
      },
      acceptableAlternatives: ['HTG{HMAC-SHA1}', 'HMAC-SHA1', 'SHA1', 'hmac-sha1', 'sha1']
    }
  },
  {
    stableId: 'HTG-L04-OE49',
    order: 49,
    levelNumber: 4,
    title: 'Public Code Snippet Gist Author Attribution',
    prompt: `An investigator analyzes an anonymously posted code snippet containing internal infrastructure scripts. Examining the underlying Git commit log for the Gist repository reveals:

\`\`\`text
commit 7f1a8b9c0d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a
Author: k-ross <kross@mockmail.dev>
Date:   Mon Mar 23 18:30:12 2026 +0000

Update telemetry collection script
\`\`\`

Extract the author's Git username handle.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the username).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{k-ross}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the handle preceding the email in the Author field.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE49',
      seedId: 'HTG-L04-OE49',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Public Gists and paste services cloneable via Git retain the local author configurations of whoever pushed the commits. The username is k-ross.",
      essentialKeyPoints: [
        "Anonymous web interfaces often fail to scrub Git commit author headers.",
        "Author name and email headers provide direct attribution to developer workstations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{k-ross}' or 'k-ross'.",
        partialCredit: "Submits uppercase 'K-ROSS'.",
        noCredit: "Submits email address kross@mockmail.dev."
      },
      acceptableAlternatives: ['HTG{k-ross}', 'k-ross', 'K-ROSS']
    }
  },
  {
    stableId: 'HTG-L04-OE50',
    order: 50,
    levelNumber: 4,
    title: 'Social Profile Coordinate Geocoding Identification',
    prompt: `An adversary profile bio contains the following self-reported location coordinates:

\`\`\`text
Bio: "Grid Systems Architect | 37.7749 N, 122.4194 W | Building decentralized telemetry mesh networks"
\`\`\`

Identify the major United States metropolitan tech hub city located at approximately 37.7749 degrees North latitude and 122.4194 degrees West longitude.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the city name, e.g. San Francisco).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{San Francisco}',
    hints: [
      {
        hintIndex: 1,
        content: "37.7749° N, 122.4194° W are the exact municipal coordinates of San Francisco, California.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE50',
      seedId: 'HTG-L04-OE50',
      subtopic: 'Username Profiling & Identity Correlation',
      explanation: "Latitude 37.7749 N and Longitude 122.4194 W point directly to downtown San Francisco.",
      essentialKeyPoints: [
        "Geographic coordinates in bios and metadata often pin users to specific cities or headquarters.",
        "Geocoding converts raw latitude/longitude points into actionable location intelligence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{San Francisco}' or 'San Francisco'.",
        partialCredit: "Submits lowercase 'san francisco' or 'San_Francisco'.",
        noCredit: "Submits state 'California' or other cities."
      },
      acceptableAlternatives: [
        'HTG{San Francisco}',
        'San Francisco',
        'san francisco',
        'SAN FRANCISCO',
        'San_Francisco'
      ]
    }
  }
];

module.exports = subtopic5Questions;

