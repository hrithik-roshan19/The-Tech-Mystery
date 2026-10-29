const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L04-OE61',
    order: 61,
    levelNumber: 4,
    title: 'Multi-Source Digital Event Chronological Sequencing',
    prompt: `An incident response commander correlates artifacts collected from multiple open-source and network data streams:

\`\`\`text
Event A: TLS Certificate issued via Let's Encrypt CT logs (10:05 UTC)
Event B: Domain registered via WHOIS registrar (09:30 UTC)
Event C: First anomalous HTTP POST telemetry beacon observed (10:45 UTC)
Event D: Primary DNS A-record created and propagated (09:50 UTC)
\`\`\`

Reconstruct the chronological event sequence in order of occurrence from earliest to latest.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the hyphen-separated 4-letter sequence (or submit the sequence, e.g. B-D-A-C).`,
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
    flag: 'HTG{B-D-A-C}',
    hints: [
      {
        hintIndex: 1,
        content: "Timeline: 09:30 (B) -> 09:50 (D) -> 10:05 (A) -> 10:45 (C).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE61',
      seedId: 'HTG-L04-OE61',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "Chronological sorting establishes adversary preparation steps: domain registration (09:30), DNS configuration (09:50), TLS issuance (10:05), and initial beaconing (10:45). Sequence is B-D-A-C.",
      essentialKeyPoints: [
        "Reconstructing timelines from heterogeneous logs uncovers attack progression.",
        "Infrastructure preparation precedes active command-and-control operations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{B-D-A-C}' or 'B-D-A-C'.",
        partialCredit: "Submits 'BDAC' without hyphens.",
        noCredit: "Submits out-of-order sequence."
      },
      acceptableAlternatives: ['HTG{B-D-A-C}', 'B-D-A-C', 'BDAC', 'b-d-a-c', 'bdac']
    }
  },
  {
    stableId: 'HTG-L04-OE62',
    order: 62,
    levelNumber: 4,
    title: 'EXIF Capture and Git Commit Timestamp Interval Analysis',
    prompt: `An investigator cross-references metadata from a leaked site photograph and the corresponding Git repository commit in which it was added:

\`\`\`text
Photograph EXIF DateTimeOriginal: 2026-06-01 14:00:00 UTC
Git Commit Author Timestamp:     1717253100 +0000 (2026-06-01 14:45:00 UTC)
\`\`\`

Calculate the elapsed duration in integer minutes between the exact moment the photograph was captured and when the Git commit was recorded.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer minutes, e.g. 45).`,
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
    flag: 'HTG{45}',
    hints: [
      {
        hintIndex: 1,
        content: "From 14:00:00 to 14:45:00 is exactly 45 minutes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE62',
      seedId: 'HTG-L04-OE62',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "Correlating media creation timestamps with version control commit records reveals the speed of operational deployment (45 minutes).",
      essentialKeyPoints: [
        "Timestamp deltas provide operational insight into adversary operational tempo.",
        "Discrepancies highlight manual staging versus automated pipeline behavior."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{45}' or '45'.",
        partialCredit: "Submits '45 minutes' or '45 min'.",
        noCredit: "Submits seconds or incorrect duration."
      },
      acceptableAlternatives: ['HTG{45}', '45', '45 minutes', '45 min', '45m']
    }
  },
  {
    stableId: 'HTG-L04-OE63',
    order: 63,
    levelNumber: 4,
    title: 'Repository Contributor Anomaly and Rogue Attribution',
    prompt: `An audit of commit history across five developer profiles analyzes anomalous access signatures:

\`\`\`text
User A (dev-lead):   09:00 - 17:00 UTC | Subnet: 192.0.2.0/24 | Commits: 45
User B (frontend):   10:00 - 18:00 UTC | Subnet: 192.0.2.0/24 | Commits: 38
User C (AgentGhost): 02:15 - 03:00 UTC | Subnet: 198.51.100.44 | Commits: 2
User D (backend):    09:30 - 17:30 UTC | Subnet: 192.0.2.0/24 | Commits: 52
User E (devops):     08:00 - 16:00 UTC | Subnet: 192.0.2.0/24 | Commits: 29
\`\`\`

Identify the anomalous username handle committing code outside standard operating hours from an unapproved external IP subnet.

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
    flag: 'HTG{AgentGhost}',
    hints: [
      {
        hintIndex: 1,
        content: "Look for User C's handle committing at 02:15 UTC from 198.51.100.44.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE63',
      seedId: 'HTG-L04-OE63',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "AgentGhost is the clear outlier committing outside business hours from an external IP address.",
      essentialKeyPoints: [
        "Behavioral baseline profiling detects rogue insiders and compromised accounts.",
        "Temporal and geospatial anomalies in commit logs indicate unauthorized access."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{AgentGhost}' or 'AgentGhost'.",
        partialCredit: "Submits lowercase 'agentghost' or uppercase 'AGENTGHOST'.",
        noCredit: "Submits legitimate developer accounts."
      },
      acceptableAlternatives: ['HTG{AgentGhost}', 'AgentGhost', 'agentghost', 'AGENTGHOST']
    }
  },
  {
    stableId: 'HTG-L04-OE64',
    order: 64,
    levelNumber: 4,
    title: 'Pastebin Data Leak Database Schema Correlation',
    prompt: `An OSINT monitor identifies a public paste on a code sharing website titled \`Grid Telemetry Schema Export\`:

\`\`\`sql
-- Automated PostgreSQL Schema Dump
-- Server version 15.4
CREATE TABLE telemetry_node_credentials (
    credential_id SERIAL PRIMARY KEY,
    node_uuid UUID NOT NULL,
    secret_key TEXT NOT NULL,
    provisioned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

Identify the exact SQL table name disclosed in this leaked database definition.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the table name).`,
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
    flag: 'HTG{telemetry_node_credentials}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the table identifier following 'CREATE TABLE '.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE64',
      seedId: 'HTG-L04-OE64',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "Paste site dumps often expose raw DDL statements. The leaked table name is telemetry_node_credentials.",
      essentialKeyPoints: [
        "Continuous paste monitoring alerts organizations to unauthorized database leaks.",
        "Correlating schema dumps against internal databases confirms leak authenticity."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{telemetry_node_credentials}' or 'telemetry_node_credentials'.",
        partialCredit: "Submits uppercase 'TELEMETRY_NODE_CREDENTIALS'.",
        noCredit: "Submits column names like credential_id or secret_key."
      },
      acceptableAlternatives: [
        'HTG{telemetry_node_credentials}',
        'telemetry_node_credentials',
        'TELEMETRY_NODE_CREDENTIALS'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE65',
    order: 65,
    levelNumber: 4,
    title: 'Certificate SAN Private RFC 1918 Address Correlation',
    prompt: `A digital forensics examiner analyzes the Subject Alternative Names (SAN) of an SSL certificate alongside their live DNS A-record resolutions:

\`\`\`text
1. api.griddefense.test        -> 198.51.100.10  (Public IP)
2. mail.griddefense.test       -> 198.51.100.25  (Public IP)
3. vpn.griddefense.test        -> 198.51.100.50  (Public IP)
4. dev-vault.griddefense.test  -> 10.200.1.5     (Private IP)
\`\`\`

Under RFC 1918 private address space allocations, which specific fully qualified domain name (FQDN) points to an internal private network address?

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
    flag: 'HTG{dev-vault.griddefense.test}',
    hints: [
      {
        hintIndex: 1,
        content: "10.0.0.0/8 is reserved for private internal networks under RFC 1918. Look at host 4.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE65',
      seedId: 'HTG-L04-OE65',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "IP address 10.200.1.5 falls inside the RFC 1918 10.0.0.0/8 private network range. dev-vault.griddefense.test is the internal development host.",
      essentialKeyPoints: [
        "Public DNS records pointing to RFC 1918 addresses expose internal network architecture.",
        "Identifying private IPs highlights internal staging vaults and management systems."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{dev-vault.griddefense.test}' or 'dev-vault.griddefense.test'.",
        partialCredit: "Submits 'dev-vault'.",
        noCredit: "Submits public hosts or IP address."
      },
      acceptableAlternatives: [
        'HTG{dev-vault.griddefense.test}',
        'dev-vault.griddefense.test',
        'dev-vault',
        'HTG{dev-vault}'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE66',
    order: 66,
    levelNumber: 4,
    title: 'Cryptographic Commit Signature Public Key De-Anonymization',
    prompt: `An incident responder inspects a cryptographically signed commit from a pseudonymous contributor:

\`\`\`text
Commit SHA: 9a8b7c6d5e4f3a2b1c0d
Signed by GPG Key ID: B1C2D3E4F5A6B7C8
\`\`\`

The analyst queries an OpenPGP public keyserver with the Key ID and recovers the registered certificate:

\`\`\`text
pub   rsa4096 2024-01-15 [SC]
      A1B2C3D4E5F60718293AB1C2D3E4F5A6B7C8
uid   Victor Kovacs <vkovacs@defense.test>
sub   rsa4096 2024-01-15 [E]
\`\`\`

Identify the real full name associated with this signing key certificate.

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
    flag: 'HTG{Victor Kovacs}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the full name in the 'uid' record of the public keyserver response.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE66',
      seedId: 'HTG-L04-OE66',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "Cross-referencing GPG key IDs from Git commits against public keyservers de-anonymizes pseudonymous commit authors. The author is Victor Kovacs.",
      essentialKeyPoints: [
        "Cryptographic signatures link Git commits to public identity assertions.",
        "Keyservers maintain historical records linking keys to developer names."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Victor Kovacs}' or 'Victor Kovacs'.",
        partialCredit: "Submits lowercase 'victor kovacs' or 'Victor_Kovacs'.",
        noCredit: "Submits email address vkovacs@defense.test."
      },
      acceptableAlternatives: [
        'HTG{Victor Kovacs}',
        'Victor Kovacs',
        'victor kovacs',
        'VICTOR KOVACS',
        'Victor_Kovacs'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE67',
    order: 67,
    levelNumber: 4,
    title: 'Timestomped Binary vs Security Event Log Execution Year',
    prompt: `A suspicious dynamic link library \`payload.dll\` was discovered on a server. Filesystem metadata shows an artificial timestomped creation timestamp:

\`\`\`text
File: C:\\Windows\\Temp\\payload.dll
$SI Creation Time: 2020-01-01 00:00:00 UTC
\`\`\`

Correlating Windows Security Event Log Event ID 4688 (Process Creation) records when the binary was actually invoked by \`rundll32.exe\`:

\`\`\`xml
<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <EventID>4688</EventID>
    <TimeCreated SystemTime="2026-07-14T03:22:10.0000000Z" />
  </System>
  <EventData>
    <Data Name="CommandLine">rundll32.exe C:\Windows\Temp\payload.dll,StartGrid</Data>
  </EventData>
</Event>
\`\`\`

What is the true four-digit calendar year in which this executable payload was actually launched?

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
    flag: 'HTG{2026}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the year in the SystemTime attribute of Event ID 4688.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE67',
      seedId: 'HTG-L04-OE67',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "Windows Event ID 4688 logs process execution in real time. The true execution occurred on July 14, 2026, proving the 2020 file timestamp was timestomped.",
      essentialKeyPoints: [
        "Process creation event logs defeat filesystem timestomping anti-forensics.",
        "Multi-source log correlation bridges file artifacts to actual runtime activity."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2026}' or '2026'.",
        partialCredit: "Submits full date '2026-07-14'.",
        noCredit: "Submits timestomped year 2020."
      },
      acceptableAlternatives: ['HTG{2026}', '2026']
    }
  },
  {
    stableId: 'HTG-L04-OE68',
    order: 68,
    levelNumber: 4,
    title: 'CI Build Log Cloud Storage Bucket Attribution',
    prompt: `An OSINT analyst audits a publicly visible continuous integration pipeline run log:

\`\`\`text
[Step: Deploy Production Assets]
aws s3 sync ./dist/ s3://grid-production-assets-2026/ --delete
Upload: ./dist/app.js to s3://grid-production-assets-2026/app.js
Upload: ./dist/config.json to s3://grid-production-assets-2026/config.json
Deployment successful (Exit code: 0)
\`\`\`

Extract the Amazon Simple Storage Service (S3) bucket name targeted by the sync command.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the bucket name).`,
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
    flag: 'HTG{grid-production-assets-2026}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the bucket identifier between 's3://' and the trailing slash.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE68',
      seedId: 'HTG-L04-OE68',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "Public CI/CD job logs often disclose internal cloud storage endpoints. The S3 bucket name is grid-production-assets-2026.",
      essentialKeyPoints: [
        "Build logs often leak private asset paths, bucket names, and environmental configurations.",
        "Cloud storage bucket enumeration starts with names harvested from public build outputs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{grid-production-assets-2026}' or 'grid-production-assets-2026'.",
        partialCredit: "Submits 'grid-production-assets-2026' with s3 prefix.",
        noCredit: "Submits filename app.js or config.json."
      },
      acceptableAlternatives: [
        'HTG{grid-production-assets-2026}',
        'grid-production-assets-2026',
        's3://grid-production-assets-2026/'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE69',
    order: 69,
    levelNumber: 4,
    title: 'Adversary Dwell Time Calculation Analysis',
    prompt: `An incident response post-mortem establishes the critical milestones of a stealthy breach:

\`\`\`text
Initial Compromise Milestone:  2026-08-01 08:00:00 UTC (Compromised token used)
Detection and Eviction Milestone: 2026-08-05 20:00:00 UTC (Credentials revoked and adversary blocked)
\`\`\`

Dwell time is the total duration an attacker maintains undetected access within an environment before discovery and eviction.

Calculate the adversary's total dwell time in integer hours (4 days and 12 hours).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer hours, e.g. 108).`,
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
    flag: 'HTG{108}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 4 days * 24 hours/day + 12 hours = 96 + 12 = 108 hours.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE69',
      seedId: 'HTG-L04-OE69',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "Dwell time calculation: From Aug 1 08:00 to Aug 5 08:00 is 96 hours (4 days). Aug 5 08:00 to 20:00 is 12 hours. Total dwell time is 108 hours.",
      essentialKeyPoints: [
        "Dwell time measures detection capability and defensive efficacy.",
        "Reducing dwell time minimizes data exfiltration and persistent lateral movement."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{108}' or '108'.",
        partialCredit: "Submits '108 hours' or '108h'.",
        noCredit: "Submits days instead of hours (e.g. 4.5)."
      },
      acceptableAlternatives: ['HTG{108}', '108', '108 hours', '108h', '108 hrs']
    }
  },
  {
    stableId: 'HTG-L04-OE70',
    order: 70,
    levelNumber: 4,
    title: 'Incident Root Cause Vector Synthesis',
    prompt: `Synthesizing the complete digital footprint case file across all investigative phases:

\`\`\`text
1. Initial Vector: Accidental developer commit to public GitHub repository containing hardcoded API keys
2. Reconnaissance: Adversary parsed Git history and Certificate Transparency logs
3. Lateral Pivot: Authenticated using leaked credential to access staging endpoints
4. Exfiltration: Synchronized sensitive telemetry to an external S3 bucket
\`\`\`

Identify the primary root cause attack vector classification representing this failure mode: EXPOSED_API_TOKEN, SQL_INJECTION, or ZERO_DAY_EXPLOIT.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the classification).`,
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
    flag: 'HTG{EXPOSED_API_TOKEN}',
    hints: [
      {
        hintIndex: 1,
        content: "The initial vulnerability was the accidental commit of credentials: EXPOSED_API_TOKEN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE70',
      seedId: 'HTG-L04-OE70',
      subtopic: 'Multi-Source Investigation & Timeline Reconstruction',
      explanation: "The root cause initiating the compromise chain was an EXPOSED_API_TOKEN in public version control.",
      essentialKeyPoints: [
        "Root cause analysis identifies the original vulnerability permitting initial access.",
        "Preventing secret leakage eliminates downstream credential misuse and exfiltration."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{EXPOSED_API_TOKEN}' or 'EXPOSED_API_TOKEN'.",
        partialCredit: "Submits lowercase or spaced 'exposed api token'.",
        noCredit: "Submits secondary symptoms like S3 exfiltration."
      },
      acceptableAlternatives: [
        'HTG{EXPOSED_API_TOKEN}',
        'EXPOSED_API_TOKEN',
        'exposed_api_token',
        'exposed api token',
        'EXPOSED API TOKEN'
      ]
    }
  }
];

module.exports = subtopic7Questions;
