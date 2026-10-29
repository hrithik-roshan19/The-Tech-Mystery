const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L04-OE01',
    order: 1,
    levelNumber: 4,
    title: 'Admiralty System Intelligence Grading Assessment',
    prompt: `An intelligence debrief on an external adversary infrastructure report assigns the source a reliability rating of 'B' (Usually reliable) and an information credibility rating of '2' (Probably true) under the standardized NATO/Admiralty Intelligence Evaluation System.

Synthesize the two-character alphanumeric intelligence grade code representing this combined evaluation.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the two-character code).`,
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
    flag: 'HTG{B2}',
    hints: [
      {
        hintIndex: 1,
        content: "Under the Admiralty System, source reliability is graded A through F and credibility is graded 1 through 6.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE01',
      seedId: 'HTG-L04-OE01',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "The Admiralty/NATO intelligence matrix combines source reliability (A to F) with information credibility (1 to 6). A source rated B (Usually reliable) and information rated 2 (Probably true) yields the evaluation code B2.",
      essentialKeyPoints: [
        "Admiralty System combines independent assessments of source reliability and information validity.",
        "Grade code B2 reflects a usually reliable source reporting probably true intelligence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{B2}' or 'B2'.",
        partialCredit: "Submits lowercase 'b2'.",
        noCredit: "Submits inverted code or inaccurate rating grades."
      },
      acceptableAlternatives: ['HTG{B2}', 'B2', 'b2', 'HTG{b2}']
    }
  },
  {
    stableId: 'HTG-L04-OE02',
    order: 2,
    levelNumber: 4,
    title: 'Autonomous System Number (ASN) Infrastructure Attribution',
    prompt: `Border Gateway Protocol (BGP) routing telemetry identified an unauthorized route announcement for network prefix \`198.51.100.0/24\`. The looking-glass query records the origin Autonomous System as:

\`\`\`text
Prefix:          198.51.100.0/24
AS-Path:         65001 65002 64496
Origin AS:       AS64496
AS Name:         SYNTH-NEO-NET
Registration:    RFC5398 Documentation Range
\`\`\`

Identify the origin Autonomous System identifier responsible for originating this route announcement.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the AS number, e.g. AS64496).`,
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
    flag: 'HTG{AS64496}',
    hints: [
      {
        hintIndex: 1,
        content: "The origin AS is the rightmost number in the BGP AS-Path or explicitly identified in the Origin AS field.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE02',
      seedId: 'HTG-L04-OE02',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "In BGP routing tables, the origin AS is the autonomous system that originates the IP prefix announcement. In the AS-Path '65001 65002 64496', the origin AS is AS64496.",
      essentialKeyPoints: [
        "BGP AS-Path traversal places the origin network at the tail of the path.",
        "ASN tracking is an essential OSINT methodology for network infrastructure attribution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{AS64496}', 'AS64496', or '64496'.",
        partialCredit: "Submits lowercase 'as64496'.",
        noCredit: "Submits transit AS numbers (65001 or 65002)."
      },
      acceptableAlternatives: ['HTG{AS64496}', 'AS64496', '64496', 'as64496', 'HTG{64496}']
    }
  },
  {
    stableId: 'HTG-L04-OE03',
    order: 3,
    levelNumber: 4,
    title: 'Passive DNS Historical Resolution Tracking',
    prompt: `A threat analyst investigating a dormant command beacon queries a passive DNS (pDNS) database for the hostname \`telemetry.helios-grid.internal\`. The database reveals the following historical A-record resolutions:

\`\`\`text
First Seen: 2026-01-10 04:12:00 UTC | Last Seen: 2026-02-01 18:30:00 UTC | IP: 203.0.113.88
First Seen: 2026-02-02 09:00:00 UTC | Last Seen: 2026-03-15 12:00:00 UTC | IP: 198.51.100.52
First Seen: 2026-03-15 12:01:00 UTC | Last Seen: 2026-04-01 00:00:00 UTC | IP: 192.0.2.14
\`\`\`

Identify the original IP address to which this hostname was first observed resolving.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the IP address).`,
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
    flag: 'HTG{203.0.113.88}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the earliest First Seen timestamp in the passive DNS resolution table.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE03',
      seedId: 'HTG-L04-OE03',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "Passive DNS logs store historical DNS mapping pairs over time. The earliest record shows telemetry.helios-grid.internal resolving to 203.0.113.88 on 2026-01-10.",
      essentialKeyPoints: [
        "Passive DNS provides historical mapping unaffected by current live DNS zone changes.",
        "Chronological sorting by 'First Seen' identifies initial infrastructure roots."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{203.0.113.88}' or '203.0.113.88'.",
        partialCredit: "Submits valid IP without standard prefix.",
        noCredit: "Submits subsequent or active IP addresses."
      },
      acceptableAlternatives: ['HTG{203.0.113.88}', '203.0.113.88']
    }
  },
  {
    stableId: 'HTG-L04-OE04',
    order: 4,
    levelNumber: 4,
    title: 'Certificate Transparency Log Reconnaissance',
    prompt: `During an external asset discovery assessment against \`cyber-grid.net\`, an investigator parses Certificate Transparency (CT) log entries. An unlisted pre-certificate issued by Let's Encrypt contains the following Subject Alternative Name (SAN):

\`\`\`text
Log Index:      98144201
Not Before:     2026-03-01 00:00:00 UTC
Issuer:         Let's Encrypt Authority X3
Common Name:    cyber-grid.net
DNS Names:
  - cyber-grid.net
  - www.cyber-grid.net
  - staging-api-v2.cyber-grid.net
\`\`\`

Identify the unlisted sub-service fully qualified domain name (FQDN) exposed in this certificate.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the FQDN).`,
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
    flag: 'HTG{staging-api-v2.cyber-grid.net}',
    hints: [
      {
        hintIndex: 1,
        content: "Exclude the apex domain and default www record; find the dedicated pre-release staging host.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE04',
      seedId: 'HTG-L04-OE04',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "Certificate Transparency logs provide an append-only, publicly auditable log of issued TLS certificates. Subdomain enumeration via CT logs frequently uncovers unadvertised staging environments such as staging-api-v2.cyber-grid.net.",
      essentialKeyPoints: [
        "Certificate Transparency logs are an authoritative passive OSINT data source.",
        "SAN extensions frequently disclose hidden internal and pre-production endpoints."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{staging-api-v2.cyber-grid.net}' or 'staging-api-v2.cyber-grid.net'.",
        partialCredit: "Submits 'staging-api-v2'.",
        noCredit: "Submits standard apex or www domains."
      },
      acceptableAlternatives: [
        'HTG{staging-api-v2.cyber-grid.net}',
        'staging-api-v2.cyber-grid.net',
        'staging-api-v2',
        'HTG{staging-api-v2}'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE05',
    order: 5,
    levelNumber: 4,
    title: 'WHOIS Registrar IANA Identifier Extraction',
    prompt: `An investigator examines the public RDAP/WHOIS registry record for a suspicious staging domain:

\`\`\`text
Domain Name: HELIOS-DEFENSE-LABS.TEST
Registry Domain ID: D9812401-VHG
Registrar: VeriHost Global Inc.
Registrar IANA ID: 9942
Registrar Abuse Contact Email: abuse@verihost-global.test
Registrar Abuse Contact Phone: +1.5550199420
Domain Status: clientTransferProhibited
Registry Tech ID: REDACTED FOR PRIVACY
\`\`\`

Identify the Registrar IANA Identifier assigned to the sponsoring registrar in this record.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer ID).`,
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
    flag: 'HTG{9942}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the specific field 'Registrar IANA ID' in the registration body.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE05',
      seedId: 'HTG-L04-OE05',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "ICANN and IANA assign unique numerical identifiers to accredited domain registrars. The Registrar IANA ID in the provided record is 9942.",
      essentialKeyPoints: [
        "IANA Registrar IDs uniquely identify the commercial entity managing domain registration.",
        "RDAP/WHOIS records preserve registrar metrics even when privacy redaction obscures registrant contact details."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{9942}' or '9942'.",
        partialCredit: "Submits numerical ID in quotes.",
        noCredit: "Submits Registry Domain ID or contact numbers."
      },
      acceptableAlternatives: ['HTG{9942}', '9942']
    }
  },
  {
    stableId: 'HTG-L04-OE06',
    order: 6,
    levelNumber: 4,
    title: 'Multi-Sensor Timestamp Corroboration Analysis',
    prompt: `During an intrusion investigation, three geographically separate telemetry monitoring stations logged an anomalous burst transmission from an unknown radio uplink:

\`\`\`text
Sensor Station Alpha (Frankfurt): 14:15 UTC
Sensor Station Beta (Tokyo):       14:15 UTC
Sensor Station Gamma (Virginia):   14:18 UTC
\`\`\`

Applying standard multi-source intelligence corroboration principles, determine the corroborated event timestamp confirmed by multiple independent recording stations.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the time, e.g. 14:15).`,
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
    flag: 'HTG{14:15}',
    hints: [
      {
        hintIndex: 1,
        content: "Identify the timestamp where two independent recording nodes are in exact agreement.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE06',
      seedId: 'HTG-L04-OE06',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "Corroboration requires independent confirmation across multiple sources. Alpha and Beta independently recorded 14:15 UTC, establishing majority consensus.",
      essentialKeyPoints: [
        "Corroboration prevents reliance on single-sensor reporting errors or clock drift.",
        "Consensus agreement between independent sensors forms the verified baseline."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{14:15}' or '14:15'.",
        partialCredit: "Submits '14:15 UTC'.",
        noCredit: "Submits the uncorroborated outlier 14:18."
      },
      acceptableAlternatives: ['HTG{14:15}', '14:15', '14:15 UTC', '14:15UTC', '14:15_UTC']
    }
  },
  {
    stableId: 'HTG-L04-OE07',
    order: 7,
    levelNumber: 4,
    title: 'Perceptual Hashing (pHash) Provenance Verification',
    prompt: `An OSINT analyst uses perceptual hashing (pHash) to track the provenance of a synthetic surveillance photograph across multiple social media platforms. The 64-bit DCT-based perceptual hash of the reference image is recorded in hex format as:

\`\`\`text
Algorithm: Discrete Cosine Transform 64-bit pHash
Reference Image Hash: d4a8e2f1c3b5a796
Query Target Hash:    d4a8e2f1c3b5a794
Hamming Distance:    1 bit (Near-duplicate match confirmed)
\`\`\`

Submit the 16-character hexadecimal perceptual hash of the original reference image.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex string).`,
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
    flag: 'HTG{d4a8e2f1c3b5a796}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the 16-hex character reference image hash in the forensic log snippet.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE07',
      seedId: 'HTG-L04-OE07',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "Perceptual hashing produces visually resilient fingerprint hashes where low Hamming distances indicate visual similarity or derivative copies.",
      essentialKeyPoints: [
        "Cryptographic hashes change radically upon 1-bit alteration (avalanche effect), while perceptual hashes preserve visual proximity.",
        "pHash comparison is a cornerstone of digital media forensics and reverse image verification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{d4a8e2f1c3b5a796}' or 'd4a8e2f1c3b5a796'.",
        partialCredit: "Submits uppercase hexadecimal variant.",
        noCredit: "Submits the query target hash or Hamming distance."
      },
      acceptableAlternatives: ['HTG{d4a8e2f1c3b5a796}', 'd4a8e2f1c3b5a796', 'D4A8E2F1C3B5A796']
    }
  },
  {
    stableId: 'HTG-L04-OE08',
    order: 8,
    levelNumber: 4,
    title: 'Pyramid of Pain Threat Attribution Tiering',
    prompt: `In cyber threat intelligence and attribution methodology, David Bianco's Pyramid of Pain categorizes threat indicators by how much hardship modifying them causes an adversary:

1. Hash Values (Trivial)
2. IP Addresses (Easy)
3. Domain Names (Simple)
4. Network / Host Artifacts (Annoying)
5. Tools (Challenging)
6. [Top Tier - Toughest to change]

What standard 4-letter intelligence acronym describes this pinnacle indicator category (referring to Tactics, Techniques, and Procedures)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the acronym).`,
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
    flag: 'HTG{TTPS}',
    hints: [
      {
        hintIndex: 1,
        content: "The acronym stands for Tactics, Techniques, and Procedures.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE08',
      seedId: 'HTG-L04-OE08',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "The apex of the Pyramid of Pain is TTPs (Tactics, Techniques, and Procedures). When defenders detect and deny TTPs, adversaries are forced to reinvent their operational methodology.",
      essentialKeyPoints: [
        "The Pyramid of Pain highlights the asymmetry between indicator-based blocking and behavioral disruption.",
        "TTPs represent behavioral tradecraft rather than disposable digital tokens."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TTPS}' or 'TTPs' or 'TTP'.",
        partialCredit: "Submits lowercase 'ttps'.",
        noCredit: "Submits lower-tier indicators like Tools or Artifacts."
      },
      acceptableAlternatives: ['HTG{TTPS}', 'TTPS', 'TTP', 'ttps', 'ttp', 'HTG{TTP}']
    }
  },
  {
    stableId: 'HTG-L04-OE09',
    order: 9,
    levelNumber: 4,
    title: 'Automated Sockpuppet Account Classification',
    prompt: `An OSINT team analyzes an anomalous social profile disseminating synchronized disinformation. Profile metrics show:

\`\`\`text
Account Name:         @EchoBot44
Account Age:          48 hours
Follower Count:       0
Following Count:      3400
Post Distribution:    100% Reposts / Retweets
Posting Velocity:     4.8 reposts per second
Client User-Agent:    Python-urllib/3.10
Activity Signature:   Continuous 24-hour cycle without sleep periods
\`\`\`

Based on automated social media behavioral profiling, classify this persona into one of standard bot archetypes: AMPLIFICATION_BOT, LURKER_ACCOUNT, or AUTHENTIC_USER.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the archetype).`,
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
    flag: 'HTG{AMPLIFICATION_BOT}',
    hints: [
      {
        hintIndex: 1,
        content: "The profile does not author original content; it exclusively retweets and reposts at machine velocity to amplify messages.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE09',
      seedId: 'HTG-L04-OE09',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "An account characterized by rapid repost velocity, lack of original content, scripted user agent, and round-the-clock activity is categorized as an AMPLIFICATION_BOT.",
      essentialKeyPoints: [
        "Sockpuppet detection evaluates account creation dates, activity rhythms, following ratios, and programmatic user agents.",
        "Amplification bots are engineered to artificially manipulate trending algorithms."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{AMPLIFICATION_BOT}' or 'AMPLIFICATION_BOT'.",
        partialCredit: "Submits lowercase or spaced 'amplification bot'.",
        noCredit: "Submits authentic user or lurker classifications."
      },
      acceptableAlternatives: [
        'HTG{AMPLIFICATION_BOT}',
        'AMPLIFICATION_BOT',
        'amplification_bot',
        'amplification bot',
        'AMPLIFICATION BOT'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE10',
    order: 10,
    levelNumber: 4,
    title: 'DNS SPF Record Hard Fail Policy Evaluation',
    prompt: `A security researcher performs passive DNS reconnaissance against \`griddefense.test\` to assess email spoofing protections. The primary domain TXT record contains:

\`\`\`text
griddefense.test. IN TXT "v=spf1 ip4:192.0.2.0/24 include:_spf.griddefense.test -all"
\`\`\`

In the Sender Policy Framework (RFC 7208) syntax, which directive suffix specifies a strict 'HardFail' policy (meaning any unlisted IP must be definitively rejected)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the directive, e.g. -all).`,
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
    flag: 'HTG{-all}',
    hints: [
      {
        hintIndex: 1,
        content: "The prefix '-' represents HardFail, '~' represents SoftFail, and '?' represents Neutral.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE10',
      seedId: 'HTG-L04-OE10',
      subtopic: 'OSINT Methodology, Source Corroboration & Attribution',
      explanation: "In SPF record syntax, the '-all' mechanism instructs receiving mail transfer agents to strictly reject (HardFail) messages originating from unauthorized sender IPs.",
      essentialKeyPoints: [
        "SPF qualifiers: '+' (Pass), '-' (Fail), '~' (SoftFail), '?' (Neutral).",
        "Passive DNS inspection of SPF, DKIM, and DMARC records provides critical posture intelligence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{-all}' or '-all'.",
        partialCredit: "Submits '-' or 'hardfail'.",
        noCredit: "Submits '~all' or '+all'."
      },
      acceptableAlternatives: ['HTG{-all}', '-all', '-', 'HTG{-}', 'hardfail']
    }
  }
];

module.exports = subtopic1Questions;
