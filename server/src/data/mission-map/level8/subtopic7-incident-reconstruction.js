const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L08-OE61',
    order: 61,
    levelNumber: 8,
    title: 'C2 External Destination IP Address from Network Telemetry',
    prompt: `An intrusion analyst analyzes a 24-hour packet capture from an internal subnet gateway. A compromised workstation (\`10.10.4.55\`) maintains repetitive outbound TCP connections on port 8443:

\`\`\`text
10.10.4.55:49152 -> 198.51.100.205:8443 [SYN]  at 02:00:00
10.10.4.55:49153 -> 198.51.100.205:8443 [SYN]  at 02:01:00
10.10.4.55:49154 -> 198.51.100.205:8443 [SYN]  at 02:02:00
\`\`\`

What is the foreign IPv4 address of this external Command and Control (C2) server?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the IP address).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{198.51.100.205}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the destination IP: 198.51.100.205.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE61',
      seedId: 'HTG-L08-OE61',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "198.51.100.205 is the destination IP address targeted by the periodic beacon connections.",
      essentialKeyPoints: [
        "Repetitive outbound SYN packets with identical inter-arrival gaps indicate automated C2 beaconing.",
        "Foreign destination IPs form primary network indicators of compromise (IOCs)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{198.51.100.205}' or '198.51.100.205'.",
        partialCredit: "Submits IP with port (198.51.100.205:8443).",
        noCredit: "Submits internal IP 10.10.4.55."
      },
      acceptableAlternatives: ['HTG{198.51.100.205}', '198.51.100.205']
    }
  },
  {
    stableId: 'HTG-L08-OE62',
    order: 62,
    levelNumber: 8,
    title: 'Periodic C2 Beaconing Interval in Seconds',
    prompt: `Examining the packet timestamps of the recurring outbound telemetry sessions:

\`\`\`text
Connection 1: 02:00:00 UTC
Connection 2: 02:01:00 UTC
Connection 3: 02:02:00 UTC
Connection 4: 02:03:00 UTC
\`\`\`

What is the exact periodic beacon interval in seconds between consecutive connection attempts?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer second count).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{60}',
    hints: [
      {
        hintIndex: 1,
        content: "1 minute equals 60 seconds.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE62',
      seedId: 'HTG-L08-OE62',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "The connections trigger every 60 seconds (1 minute), characteristic of fixed-interval beaconing without jitter.",
      essentialKeyPoints: [
        "Beacon interval analysis reveals C2 heartbeat schedules.",
        "Low jitter makes periodic beacons readily detectable through delta-time histograms."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{60}' or '60'.",
        partialCredit: "Submits '60 seconds' or '60s'.",
        noCredit: "Submits 1 or 120."
      },
      acceptableAlternatives: ['HTG{60}', '60', '60 seconds', '60s']
    }
  },
  {
    stableId: 'HTG-L08-OE63',
    order: 63,
    levelNumber: 8,
    title: 'Initial Access Protocol via External Port 3389',
    prompt: `Timeline correlation indicates an unauthorized inbound connection on the external firewall preceding the malware deployment:

\`\`\`text
Ingress Firewall Log:
  Time:   01:45:12 UTC
  Src:    198.51.100.205:54120
  Dst:    10.10.4.55:3389
  Action: ALLOW
  Proto:  TCP
\`\`\`

Which standard Microsoft graphical desktop remote access protocol operates on TCP port 3389?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter protocol acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{RDP}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Remote Desktop Protocol: RDP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE63',
      seedId: 'HTG-L08-OE63',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "Port 3389 is the standard port for Microsoft Remote Desktop Protocol (RDP).",
      essentialKeyPoints: [
        "Exposed RDP services without multi-factor authentication are frequent initial access vectors.",
        "Correlating ingress port 3389 logs with subsequent lateral movement confirms initial foothold."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RDP}' or 'RDP'.",
        partialCredit: "Submits lowercase 'rdp' or 'Remote Desktop Protocol'.",
        noCredit: "Submits SSH or VNC."
      },
      acceptableAlternatives: ['HTG{RDP}', 'RDP', 'rdp', 'Remote Desktop Protocol', 'HTG{rdp}']
    }
  },
  {
    stableId: 'HTG-L08-OE64',
    order: 64,
    levelNumber: 8,
    title: 'Reassembled Exfiltrated Database Archive Filename',
    prompt: `An analyst follows the TCP stream for an outbound HTTP POST session (\`tcp.stream eq 88\`). Carving the multipart MIME form-data boundary uncovers the upload parameter:

\`\`\`http
POST /upload/gateway HTTP/1.1
Host: dropzone.shadow-net.test
Content-Type: multipart/form-post; boundary=---------------------------974767299852498929531610575

-----------------------------974767299852498929531610575
Content-Disposition: form-data; name="archive"; filename="customer_vault.tar.gz"
Content-Type: application/gzip

[Binary archive payload...]
\`\`\`

What is the filename (including all extensions) of the compressed archive exfiltrated in this POST request?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the filename).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{customer_vault.tar.gz}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the filename parameter: customer_vault.tar.gz.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE64',
      seedId: 'HTG-L08-OE64',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "The MIME header specifies filename='customer_vault.tar.gz'.",
      essentialKeyPoints: [
        "MIME multipart form uploads preserve original client filenames in Content-Disposition headers.",
        "Carving streams reconstructs exfiltrated data files for damage assessment."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{customer_vault.tar.gz}' or 'customer_vault.tar.gz'.",
        partialCredit: "Submits 'customer_vault'.",
        noCredit: "Submits dropzone.shadow-net.test."
      },
      acceptableAlternatives: ['HTG{customer_vault.tar.gz}', 'customer_vault.tar.gz', 'CUSTOMER_VAULT.TAR.GZ']
    }
  },
  {
    stableId: 'HTG-L08-OE65',
    order: 65,
    levelNumber: 8,
    title: 'Lateral Movement Server Message Block (SMB) Port',
    prompt: `After gaining initial access, the threat actor pivoted laterally across internal subnets by authenticating over Server Message Block (SMB) directly over TCP without NetBIOS framing.

What destination TCP port number is utilized for direct-hosted SMB traffic?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer port number).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{445}',
    hints: [
      {
        hintIndex: 1,
        content: "Direct SMB over TCP operates on port 445.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE65',
      seedId: 'HTG-L08-OE65',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "TCP port 445 handles Microsoft-DS (SMB over IP) without requiring NetBIOS over TCP/IP.",
      essentialKeyPoints: [
        "Lateral movement tools (PsExec, WMI, Impacket) primarily target TCP 445.",
        "Isolating port 445 traffic between workstations mitigates lateral spread."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{445}' or '445'.",
        partialCredit: "Submits 'port 445'.",
        noCredit: "Submits 139 or 3389."
      },
      acceptableAlternatives: ['HTG{445}', '445']
    }
  },
  {
    stableId: 'HTG-L08-OE66',
    order: 66,
    levelNumber: 8,
    title: 'Proxy Chain Origin IP Extracted from X-Forwarded-For Header',
    prompt: `An HTTP reverse proxy log captures an inbound API exploit request. The request passed through two intermediate proxies before reaching the origin web server:

\`\`\`http
GET /internal/admin/dump HTTP/1.1
Host: internal-api.grid.test
X-Forwarded-For: 203.0.113.14, 198.51.100.50, 10.0.0.1
User-Agent: AttackTool/2.0
\`\`\`

The \`X-Forwarded-For\` header appends client IPs in left-to-right order, with the leftmost address representing the original client IP.

What is the true origin IPv4 address of the initiating client?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the IP address).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{203.0.113.14}',
    hints: [
      {
        hintIndex: 1,
        content: "The leftmost IP in X-Forwarded-For is the originating client: 203.0.113.14.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE66',
      seedId: 'HTG-L08-OE66',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "In X-Forwarded-For headers, the leftmost entry (203.0.113.14) identifies the initial requesting client.",
      essentialKeyPoints: [
        "X-Forwarded-For tracks client origin across HTTP proxy chains.",
        "Unless proxy headers are sanitized at the edge, untrusted clients can spoof leading entries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{203.0.113.14}' or '203.0.113.14'.",
        partialCredit: "Submits with whitespace.",
        noCredit: "Submits 198.51.100.50 or 10.0.0.1."
      },
      acceptableAlternatives: ['HTG{203.0.113.14}', '203.0.113.14']
    }
  },
  {
    stableId: 'HTG-L08-OE67',
    order: 67,
    levelNumber: 8,
    title: 'Suricata Alert Rule Signature ID (SID) Identification',
    prompt: `An intrusion detection engine (Suricata) generates a JSON alert record in \`eve.json\` matching an outbound reverse shell attempt:

\`\`\`json
{
  "timestamp": "2026-10-24T14:30:00.123456Z",
  "alert": {
    "action": "allowed",
    "gid": 1,
    "signature_id": 2024101,
    "rev": 1,
    "signature": "ET TROJAN Potential Reverse Shell Established",
    "category": "A Network Trojan was detected",
    "severity": 1
  }
}
\`\`\`

What decimal integer represents the unique Signature ID (\`signature_id\` or \`SID\`) that triggered this alert?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer SID).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{2024101}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the signature_id field: 2024101.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE67',
      seedId: 'HTG-L08-OE67',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "Suricata's signature_id field uniquely indexes detection rules; here the SID is 2024101.",
      essentialKeyPoints: [
        "Suricata and Snort rules use SIDs to reference specific signature definitions.",
        "Correlating SIDs to PCAP timestamps speeds up false-positive triage."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2024101}' or '2024101'.",
        partialCredit: "Submits 'SID 2024101'.",
        noCredit: "Submits 1."
      },
      acceptableAlternatives: ['HTG{2024101}', '2024101', 'SID 2024101']
    }
  },
  {
    stableId: 'HTG-L08-OE68',
    order: 68,
    levelNumber: 8,
    title: 'Correlating DNS Tunnel Apex Domain',
    prompt: `An analyst analyzes thousands of anomalous DNS queries generated by an internal server:

\`\`\`text
Query: a1b2c3d4e5.data-sync.cloud-telemetry.org (Type: TXT)
Query: f6g7h8i9j0.data-sync.cloud-telemetry.org (Type: TXT)
Query: k1l2m3n4o5.data-sync.cloud-telemetry.org (Type: TXT)
\`\`\`

While the leftmost labels change with each query to encode payload chunks, the tunnel routes all requests to a persistent secondary domain zone.

What is the shared parent domain suffix (\`data-sync.cloud-telemetry.org\`) used as the apex for this tunneling infrastructure?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the domain name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{data-sync.cloud-telemetry.org}',
    hints: [
      {
        hintIndex: 1,
        content: "The common domain suffix is data-sync.cloud-telemetry.org.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE68',
      seedId: 'HTG-L08-OE68',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "data-sync.cloud-telemetry.org is the apex domain receiving the exfiltration queries.",
      essentialKeyPoints: [
        "DNS tunneling tools use a static parent domain delegating NS records to attacker C2 servers.",
        "Blocking the apex domain at recursive resolvers disrupts the tunneling channel."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{data-sync.cloud-telemetry.org}' or 'data-sync.cloud-telemetry.org'.",
        partialCredit: "Submits domain with trailing period.",
        noCredit: "Submits cloud-telemetry.org alone."
      },
      acceptableAlternatives: ['HTG{data-sync.cloud-telemetry.org}', 'data-sync.cloud-telemetry.org']
    }
  },
  {
    stableId: 'HTG-L08-OE69',
    order: 69,
    levelNumber: 8,
    title: 'Chronological Multi-Artifact Incident Phase Sequence',
    prompt: `An incident response team correlates network evidence across four distinct phases of an intrusion:

1. [Phase 1]: Inbound RDP connection established from external IP at 01:45:12 UTC
2. [Phase 2]: Multipart HTTP POST data exfiltration of customer vault at 02:40:00 UTC
3. [Phase 3]: Port scan (SYN sweep) across external perimeter at 01:30:00 UTC
4. [Phase 4]: Lateral movement over SMB port 445 to database server at 02:15:30 UTC

Arrange these four phases in true chronological order from earliest to latest.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the hyphen-separated phase numbers (e.g. 1-2-3-4), or submit the hyphen-separated numbers directly.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{3-1-4-2}',
    hints: [
      {
        hintIndex: 1,
        content: "Timeline: 01:30:00 (3) -> 01:45:12 (1) -> 02:15:30 (4) -> 02:40:00 (2).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE69',
      seedId: 'HTG-L08-OE69',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "Chronological order: Reconnaissance SYN scan (01:30:00, Event 3), Initial RDP access (01:45:12, Event 1), SMB lateral movement (02:15:30, Event 4), HTTP exfiltration (02:40:00, Event 2). Sequence: 3-1-4-2.",
      essentialKeyPoints: [
        "Network incident chronology connects reconnaissance, initial access, lateral movement, and exfiltration.",
        "Timelines demonstrate causal attack flow across network perimeter boundaries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{3-1-4-2}' or '3-1-4-2'.",
        partialCredit: "Submits '3,1,4,2' or '3 1 4 2'.",
        noCredit: "Submits incorrect order."
      },
      acceptableAlternatives: ['HTG{3-1-4-2}', '3-1-4-2', '3,1,4,2', '3 1 4 2']
    }
  },
  {
    stableId: 'HTG-L08-OE70',
    order: 70,
    levelNumber: 8,
    title: 'Master Network and Infrastructure Investigation Token',
    prompt: `The network forensics and infrastructure analysis team completes full packet-level triage across the Level 8 environment:
- PCAP TCP streams reassembled and sequence gaps reconstructed
- Protocol headers, EtherTypes, and IP protocol numbers validated
- Encrypted TLS sessions, SNI hostnames, and JA3 fingerprints triaged
- NetFlow telemetry, flow durations, and syslog event severities mapped
- DNS tunneling, ICMP shells, and domain fronting channels uncovered
- Network spoofing, SYN floods, and MITM attacks analyzed
- Full end-to-end incident chronology reconstructed from initial scan to exfiltration

Upon certifying the network forensic evidence chain, the lead investigator records the official clearance token:

PACKET_HIGHWAY_RECONSTRUCTED

Submit the completed network and infrastructure investigation token in standard competition flag format.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the token string (or submit the token string directly).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Stego',
    difficulty: 'HARD',
    flag: 'HTG{PACKET_HIGHWAY_RECONSTRUCTED}',
    hints: [
      {
        hintIndex: 1,
        content: "Prefix HTG with curly braces enclosing PACKET_HIGHWAY_RECONSTRUCTED.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE70',
      seedId: 'HTG-L08-OE70',
      subtopic: 'Multi-artifact network incident reconstruction',
      explanation: "Concludes the Level 8 Packet Highway / Network & Infrastructure track.",
      essentialKeyPoints: [
        "Network traffic analysis provides immutable wire-level evidence of communication.",
        "Synthesizing PCAP streams, flow telemetry, and protocol metadata yields full incident visibility."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PACKET_HIGHWAY_RECONSTRUCTED}' or 'PACKET_HIGHWAY_RECONSTRUCTED'.",
        partialCredit: "Submits lowercase 'packet_highway_reconstructed'.",
        noCredit: "Submits incomplete or misspelled token."
      },
      acceptableAlternatives: ['HTG{PACKET_HIGHWAY_RECONSTRUCTED}', 'PACKET_HIGHWAY_RECONSTRUCTED', 'packet_highway_reconstructed', 'HTG{packet_highway_reconstructed}']
    }
  }
];

module.exports = subtopic7Questions;
