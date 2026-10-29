const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L08-OE31',
    order: 31,
    levelNumber: 8,
    title: 'Default NetFlow Collector UDP Listening Port',
    prompt: `Network routers and switches export NetFlow flow records to a centralized NetFlow collector using UDP datagrams.

While network administrators can configure custom ports, what is the industry-standard default UDP listening port for Cisco NetFlow collectors?

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
    flag: 'HTG{2055}',
    hints: [
      {
        hintIndex: 1,
        content: "The default NetFlow listening port is 2055.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE31',
      seedId: 'HTG-L08-OE31',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "UDP port 2055 is the standard default port for NetFlow export datagrams.",
      essentialKeyPoints: [
        "NetFlow v5 and v9 export flow summaries over UDP port 2055.",
        "Flow exporters summarize connections without recording packet payload contents."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2055}' or '2055'.",
        partialCredit: "Submits 'port 2055'.",
        noCredit: "Submits 514 or 4739."
      },
      acceptableAlternatives: ['HTG{2055}', '2055']
    }
  },
  {
    stableId: 'HTG-L08-OE32',
    order: 32,
    levelNumber: 8,
    title: 'IETF IP Flow Information Export (IPFIX) Core RFC Number',
    prompt: `To standardize network flow recording across multi-vendor equipment, the IETF developed the IP Flow Information Export (IPFIX) protocol based on Cisco's NetFlow v9 format.

The core protocol specification defining the IPFIX protocol format and information model is published under RFC 7011 (superseding RFC 5101).

What decimal integer represents this primary RFC document number?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer RFC number).`,
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
    flag: 'HTG{7011}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the RFC cited in the prompt: RFC 7011.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE32',
      seedId: 'HTG-L08-OE32',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "RFC 7011 defines the Specification of the IP Flow Information Export (IPFIX) Protocol for the Exchange of Flow Information.",
      essentialKeyPoints: [
        "IPFIX standardizes flow monitoring, introducing variable-length fields and enterprise-specific IDs.",
        "IPFIX commonly transmits over UDP port 4739."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{7011}' or '7011'.",
        partialCredit: "Submits 'RFC 7011'.",
        noCredit: "Submits 5101 or 793."
      },
      acceptableAlternatives: ['HTG{7011}', '7011', 'RFC 7011', 'rfc 7011']
    }
  },
  {
    stableId: 'HTG-L08-OE33',
    order: 33,
    levelNumber: 8,
    title: 'BGP Autonomous System Number Acronym',
    prompt: `In global internet routing and network telemetry, routers exchange reachability information using the Border Gateway Protocol (BGP).

Every independent routing domain (such as an ISP, cloud provider, or university network) is assigned a globally unique number by regional internet registries to control inter-domain routing paths.

What 3-letter acronym designates this Autonomous System Number?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{ASN}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Autonomous System Number: ASN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE33',
      seedId: 'HTG-L08-OE33',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "An ASN (Autonomous System Number) identifies an administrative routing domain in global BGP routing.",
      essentialKeyPoints: [
        "BGP routes packets between Autonomous Systems via AS-Path lists.",
        "NetFlow collectors map IP addresses to source and destination ASNs for traffic attribution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ASN}' or 'ASN'.",
        partialCredit: "Submits lowercase 'asn'.",
        noCredit: "Submits BGP or CIDR."
      },
      acceptableAlternatives: ['HTG{ASN}', 'ASN', 'asn', 'HTG{asn}']
    }
  },
  {
    stableId: 'HTG-L08-OE34',
    order: 34,
    levelNumber: 8,
    title: 'Nmap Stealth SYN Scan Command Flag',
    prompt: `A network intrusion detection system captures thousands of half-open TCP connections: the scanner sends \`SYN\`, the server replies with \`SYN-ACK\` for open ports, and the scanner immediately sends \`RST\` instead of completing the handshake.

In the network scanner Nmap, what command-line flag enables this default "Stealth" or TCP SYN scan?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the exact flag string).`,
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
    flag: 'HTG{-sS}',
    hints: [
      {
        hintIndex: 1,
        content: "The scan flag is -sS (SYN Scan).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE34',
      seedId: 'HTG-L08-OE34',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "-sS enables Nmap's TCP SYN stealth scan, which avoids completing handshakes to evade application-layer connection logging.",
      essentialKeyPoints: [
        "SYN scans leave connections half-open, triggering SYN flood warnings or RST surges in IDS.",
        "-sS requires raw socket privileges (root/admin)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{-sS}' or '-sS'.",
        partialCredit: "Submits 'sS' or '-ss'.",
        noCredit: "Submits -sT or -sU."
      },
      acceptableAlternatives: ['HTG{-sS}', '-sS', 'sS', '-ss', 'HTG{sS}']
    }
  },
  {
    stableId: 'HTG-L08-OE35',
    order: 35,
    levelNumber: 8,
    title: 'Nmap Xmas Scan Active TCP Flags Combination',
    prompt: `In network reconnaissance, an attacker launches an "Xmas Scan" designed to exploit RFC 793 compliance loopholes in BSD-derived TCP/IP stacks.

The scan sends TCP packets with an anomalous combination of three control flags turned on simultaneously, "lighting up the packet like a Christmas tree":
- Finish flag (\`FIN\`)
- Push flag (\`PSH\`)
- Urgent flag (\`URG\`)

Format the three active flags in hyphen-separated format: FIN-PSH-URG.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hyphenated flag string).`,
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
    flag: 'HTG{FIN-PSH-URG}',
    hints: [
      {
        hintIndex: 1,
        content: "Hyphen-separated list: FIN-PSH-URG.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE35',
      seedId: 'HTG-L08-OE35',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "Xmas scan sets FIN, PSH, and URG flags. Closed ports reply with RST; open ports drop the packet silently.",
      essentialKeyPoints: [
        "Xmas packets (FIN+PSH+URG) represent invalid TCP state transitions.",
        "Nmap flag -sX generates this scan signature."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{FIN-PSH-URG}' or 'FIN-PSH-URG'.",
        partialCredit: "Submits lowercase 'fin-psh-urg'.",
        noCredit: "Submits SYN-ACK or RST."
      },
      acceptableAlternatives: ['HTG{FIN-PSH-URG}', 'FIN-PSH-URG', 'fin-psh-urg', 'HTG{fin-psh-urg}']
    }
  },
  {
    stableId: 'HTG-L08-OE36',
    order: 36,
    levelNumber: 8,
    title: 'VLAN Tagging IEEE Standard Number',
    prompt: `To segment physical local area networks into multiple isolated logical broadcast domains on trunk links, Ethernet switches insert a 4-byte encapsulation tag into frame headers.

What is the standard IEEE specification designation (e.g. \`802.1Q\`) for Virtual Local Area Network (VLAN) tagging?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the standard designation).`,
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
    flag: 'HTG{802.1Q}',
    hints: [
      {
        hintIndex: 1,
        content: "The standard is IEEE 802.1Q (often termed dot1q).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE36',
      seedId: 'HTG-L08-OE36',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "IEEE 802.1Q defines VLAN tagging on Ethernet networks, inserting a 4-byte tag with a 12-bit VLAN ID (VID).",
      essentialKeyPoints: [
        "802.1Q supports up to 4094 distinct logical VLANs (0 and 4095 reserved).",
        "Wireshark display filter 'vlan' isolates tagged frames on switch trunk captures."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{802.1Q}' or '802.1Q'.",
        partialCredit: "Submits 'dot1q' or '802.1q'.",
        noCredit: "Submits 802.3 or 802.11."
      },
      acceptableAlternatives: ['HTG{802.1Q}', '802.1Q', 'dot1q', '802.1q', 'HTG{dot1q}']
    }
  },
  {
    stableId: 'HTG-L08-OE37',
    order: 37,
    levelNumber: 8,
    title: 'IEEE 802.1Q Tag Protocol Identifier (TPID) Hex Value',
    prompt: `When an 802.1Q VLAN tag is inserted into an Ethernet frame, the original EtherType field is replaced by a 2-byte Tag Protocol Identifier (TPID) that signals the presence of a VLAN tag.

What 4-character hexadecimal value (with leading \`0x\`) designates the standard 802.1Q TPID?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex value).`,
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
    flag: 'HTG{0x8100}',
    hints: [
      {
        hintIndex: 1,
        content: "The TPID is hex 0x8100.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE37',
      seedId: 'HTG-L08-OE37',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "TPID 0x8100 identifies an IEEE 802.1Q tagged frame.",
      essentialKeyPoints: [
        "Ethernet frames with EtherType 0x8100 contain 802.1Q tags followed by priority and VID bits.",
        "Q-in-Q double-tagging uses TPID 0x88A8 for the outer service provider tag."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x8100}' or '0x8100'.",
        partialCredit: "Submits '8100'.",
        noCredit: "Submits 0x0800 or 0x0806."
      },
      acceptableAlternatives: ['HTG{0x8100}', '0x8100', '8100', 'HTG{8100}']
    }
  },
  {
    stableId: 'HTG-L08-OE38',
    order: 38,
    levelNumber: 8,
    title: 'NetFlow Flow Record Duration Calculation',
    prompt: `An incident response engineer queries a NetFlow v9 database to investigate a suspicious data transfer session:

\`\`\`text
Flow Record:
  Source IP:      192.168.10.45
  Destination IP: 198.51.100.80
  Start Time:     14:20:10.000 UTC  (Epoch ms: 1730211610000)
  End Time:       14:20:25.000 UTC  (Epoch ms: 1730211625000)
  Byte Count:     1250000 bytes
\`\`\`

What is the total duration of this network flow in milliseconds (ms)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer millisecond count).`,
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
    flag: 'HTG{15000}',
    hints: [
      {
        hintIndex: 1,
        content: "25 seconds - 10 seconds = 15 seconds = 15000 milliseconds.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE38',
      seedId: 'HTG-L08-OE38',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "1730211625000 - 1730211610000 = 15000 milliseconds (15 seconds).",
      essentialKeyPoints: [
        "NetFlow records start and end timestamps in millisecond resolution.",
        "Dividing byte count by duration yields connection throughput rates."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{15000}' or '15000'.",
        partialCredit: "Submits '15000 ms' or '15s'.",
        noCredit: "Submits 15 or 25."
      },
      acceptableAlternatives: ['HTG{15000}', '15000', '15000 ms', '15000ms']
    }
  },
  {
    stableId: 'HTG-L08-OE39',
    order: 39,
    levelNumber: 8,
    title: 'Standard Syslog Network UDP Port',
    prompt: `Network routers, firewalls, and switches forward system events and audit logs to central SIEM collectors using the standard Syslog protocol (RFC 5424 / RFC 3164).

What default UDP port number is assigned to the Syslog service?

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
    flag: 'HTG{514}',
    hints: [
      {
        hintIndex: 1,
        content: "Standard Syslog operates on UDP port 514.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE39',
      seedId: 'HTG-L08-OE39',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "UDP port 514 is the standard port for legacy Syslog messaging.",
      essentialKeyPoints: [
        "Syslog messages convey facility and severity codes in cleartext over UDP 514.",
        "Encrypted Syslog (TLS) uses TCP port 6514."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{514}' or '514'.",
        partialCredit: "Submits 'port 514'.",
        noCredit: "Submits 2055 or 161."
      },
      acceptableAlternatives: ['HTG{514}', '514']
    }
  },
  {
    stableId: 'HTG-L08-OE40',
    order: 40,
    levelNumber: 8,
    title: 'Syslog Severity Level Number for Emergency Conditions',
    prompt: `In the Syslog protocol specification (RFC 5424), message priority is calculated using Facility and Severity codes.

Severity levels range from 0 to 7:
- \`0\`: Emergency ("System is unusable")
- \`1\`: Alert ("Action must be taken immediately")
- \`2\`: Critical
- \`3\`: Error
- \`4\`: Warning
- \`5\`: Notice
- \`6\`: Informational
- \`7\`: Debug

What decimal integer represents the highest severity level (\`Emergency\`) in Syslog messages?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer severity level).`,
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
    flag: 'HTG{0}',
    hints: [
      {
        hintIndex: 1,
        content: "Emergency is severity level 0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE40',
      seedId: 'HTG-L08-OE40',
      subtopic: 'Network flow records and infrastructure telemetry',
      explanation: "Severity 0 indicates an Emergency condition requiring immediate panic response.",
      essentialKeyPoints: [
        "Syslog Priority (PRI) = (Facility * 8) + Severity.",
        "Lower severity numbers represent more urgent operational conditions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'zero'.",
        noCredit: "Submits 1 or 7."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'zero']
    }
  }
];

module.exports = subtopic4Questions;

