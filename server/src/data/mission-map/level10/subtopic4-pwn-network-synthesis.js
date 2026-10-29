const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L10-OE31',
    order: 31,
    levelNumber: 10,
    title: 'Classic x86 NOP Sled Hexadecimal Byte Value',
    prompt: `In network-delivered buffer overflow exploitation, shellcode payloads are frequently preceded by a sequence of No Operation instructions (a NOP sled) to allow execution to slide smoothly into the target payload.

What 2-digit hexadecimal byte value represents the single-byte \`NOP\` instruction in the x86 instruction set architecture?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hexadecimal byte).`,
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
    flag: 'HTG{0x90}',
    hints: [
      {
        hintIndex: 1,
        content: "The x86 NOP opcode is 0x90.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE31',
      seedId: 'HTG-L10-OE31',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "0x90 is the opcode for NOP (No Operation) in x86/x64.",
      essentialKeyPoints: [
        "Network intrusion detection signatures scan for repeated 0x90 sequences in packet payloads.",
        "NOP sleds absorb minor variations in target stack address offsets."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x90}' or '0x90'.",
        partialCredit: "Submits '90'.",
        noCredit: "Submits 0xCC or 0x00."
      },
      acceptableAlternatives: ['HTG{0x90}', '0x90', '90', 'HTG{90}']
    }
  },
  {
    stableId: 'HTG-L10-OE32',
    order: 32,
    levelNumber: 10,
    title: 'Return-Oriented Programming (ROP) Gadget Terminator',
    prompt: `When binary exploits bypass Data Execution Prevention (DEP / NX) over network streams, attackers assemble Return-Oriented Programming (ROP) chains consisting of short instruction sequences borrowed from existing executable memory.

Which assembly instruction mnemonic (abbreviated in 3 lowercase letters) must conclude every ROP gadget to pop the next return address off the stack and continue the chain?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the instruction mnemonic).`,
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
    flag: 'HTG{ret}',
    hints: [
      {
        hintIndex: 1,
        content: "The return instruction is ret (opcode 0xC3).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE32',
      seedId: 'HTG-L10-OE32',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "Every ROP gadget concludes with 'ret' to transfer control to the next address in the chain.",
      essentialKeyPoints: [
        "'ret' pops the value at [esp]/[rsp] into the instruction pointer (eip/rip).",
        "ROP payload streams appear in network captures as packed sequences of code addresses."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ret}' or 'ret'.",
        partialCredit: "Submits uppercase 'RET'.",
        noCredit: "Submits call or jmp."
      },
      acceptableAlternatives: ['HTG{ret}', 'ret', 'RET', 'HTG{RET}']
    }
  },
  {
    stableId: 'HTG-L10-OE33',
    order: 33,
    levelNumber: 10,
    title: 'Outbound Interactive Reverse Shell Architecture',
    prompt: `In remote exploitation against firewall-protected network perimeters, inbound connection attempts to target servers are typically blocked by default border firewall rules.

To bypass this restriction, the exploit payload commands the compromised host to initiate an outbound TCP connection back to the attacker's public listening socket and redirect standard input/output to an interactive command shell.

What 2-word phrase designates this outbound remote access connection architecture?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word phrase).`,
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
    flag: 'HTG{reverse shell}',
    hints: [
      {
        hintIndex: 1,
        content: "The connection is a reverse shell (in contrast to a bind shell).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE33',
      seedId: 'HTG-L10-OE33',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "A reverse shell initiates outbound connections from the victim to bypass inbound firewall filtering.",
      essentialKeyPoints: [
        "Reverse shells evade stateful firewalls that permit established outbound connections.",
        "Forensic detection monitors unusual outbound sessions to high or ephemeral ports."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{reverse shell}' or 'reverse shell'.",
        partialCredit: "Submits 'Reverse Shell'.",
        noCredit: "Submits bind shell or web shell."
      },
      acceptableAlternatives: ['HTG{reverse shell}', 'reverse shell', 'Reverse Shell', 'reverse-shell', 'HTG{Reverse Shell}']
    }
  },
  {
    stableId: 'HTG-L10-OE34',
    order: 34,
    levelNumber: 10,
    title: 'High-Capacity DNS Data Tunneling Resource Record Type',
    prompt: `In covert network exfiltration analysis, adversaries abuse DNS resolution to bypass egress filters by packaging stolen data into recursive queries.

While upstream queries use subdomain prefixes in \`A\` or \`AAAA\` queries, what 3-letter DNS resource record type is favored for high-bandwidth command-and-control response payloads because individual strings can carry up to 255 bytes and total responses can reach several kilobytes?

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
    flag: 'HTG{TXT}',
    hints: [
      {
        hintIndex: 1,
        content: "TXT records carry unstructured text payloads in DNS tunneling.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE34',
      seedId: 'HTG-L10-OE34',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "TXT records are widely utilized in DNS tunnels (iodine, dnscat2) due to high payload capacity.",
      essentialKeyPoints: [
        "TXT records allow multi-string responses carrying binary base64 payloads.",
        "Spikes in TXT query frequency and size flag active DNS tunneling."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TXT}' or 'TXT'.",
        partialCredit: "Submits lowercase 'txt'.",
        noCredit: "Submits CNAME or MX."
      },
      acceptableAlternatives: ['HTG{TXT}', 'TXT', 'txt', 'HTG{txt}']
    }
  },
  {
    stableId: 'HTG-L10-OE35',
    order: 35,
    levelNumber: 10,
    title: 'Ping Tunnel (ptunnel) ICMP Covert Tunnel Utility',
    prompt: `When transport-layer TCP and UDP ports are strictly blocked by upstream network policies, covert channels can be established over network-layer protocols.

Which classic open-source utility (commonly known as \`ptunnel\`) encapsulates arbitrary TCP connections inside the payload bytes of ICMP Echo Request and Echo Reply packets?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the utility name).`,
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
    flag: 'HTG{ptunnel}',
    hints: [
      {
        hintIndex: 1,
        content: "The utility is ptunnel (or Ping Tunnel).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE35',
      seedId: 'HTG-L10-OE35',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "ptunnel forwards TCP streams over ICMP echo packets.",
      essentialKeyPoints: [
        "ICMP tunnels abuse ping requests where data bytes are normally static padding.",
        "Anomalous packet sizes and high ICMP packet rates expose ptunnel sessions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ptunnel}' or 'ptunnel'.",
        partialCredit: "Submits 'Ping Tunnel' or 'ping tunnel'.",
        noCredit: "Submits corkscrew or socat."
      },
      acceptableAlternatives: ['HTG{ptunnel}', 'ptunnel', 'Ping Tunnel', 'ping tunnel', 'PTUNNEL', 'HTG{Ping Tunnel}']
    }
  },
  {
    stableId: 'HTG-L10-OE36',
    order: 36,
    levelNumber: 10,
    title: 'Wireshark SYN-Only Packet Display Filter Syntax',
    prompt: `In forensic network packet analysis, identifying initial TCP connection requests or half-open port scans requires filtering for packets where the SYN flag is set and the ACK flag is cleared.

What exact Wireshark display filter expression isolates packets where \`tcp.flags.syn == 1\` and \`tcp.flags.ack == 0\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the expression).`,
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
    flag: 'HTG{tcp.flags.syn == 1 && tcp.flags.ack == 0}',
    hints: [
      {
        hintIndex: 1,
        content: "The Wireshark filter is tcp.flags.syn == 1 && tcp.flags.ack == 0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE36',
      seedId: 'HTG-L10-OE36',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "'tcp.flags.syn == 1 && tcp.flags.ack == 0' isolates TCP connection initiation packets without ACK.",
      essentialKeyPoints: [
        "SYN-only filters highlight port scans and connection floods.",
        "SYN-ACK packets have both syn==1 and ack==1."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{tcp.flags.syn == 1 && tcp.flags.ack == 0}'.",
        partialCredit: "Submits 'tcp.flags.syn==1 && tcp.flags.ack==0'.",
        noCredit: "Submits tcp.flags.syn == 1."
      },
      acceptableAlternatives: [
        'HTG{tcp.flags.syn == 1 && tcp.flags.ack == 0}',
        'tcp.flags.syn == 1 && tcp.flags.ack == 0',
        'tcp.flags.syn==1 && tcp.flags.ack==0',
        'tcp.flags.syn == 1 and tcp.flags.ack == 0',
        'HTG{tcp.flags.syn==1 && tcp.flags.ack==0}'
      ]
    }
  },
  {
    stableId: 'HTG-L10-OE37',
    order: 37,
    levelNumber: 10,
    title: 'Port Knocking Covert Perimeter Authentication Method',
    prompt: `To protect administrative listening services (such as SSH on port 22) against port scanners, the citadel firewall keeps the port closed by default.

A client gains access by transmitting a specific sequence of connection attempts across closed ports (e.g. TCP 7000, 8000, 9000). Upon detecting the correct secret sequence, the firewall daemon opens port 22 for the client's IP address.

What 2-word phrase designates this stealthy network access control method?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word phrase).`,
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
    flag: 'HTG{port knocking}',
    hints: [
      {
        hintIndex: 1,
        content: "The technique is known as port knocking.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE37',
      seedId: 'HTG-L10-OE37',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "Port knocking dynamically opens firewall ports in response to predetermined connection sequences.",
      essentialKeyPoints: [
        "Port knocking conceals open services from passive port scanners like Nmap.",
        "Packet capture logs reveal knock sequences from repeated closed-port SYNs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{port knocking}' or 'port knocking'.",
        partialCredit: "Submits capitalized 'Port Knocking'.",
        noCredit: "Submits port scanning or firewall rule."
      },
      acceptableAlternatives: ['HTG{port knocking}', 'port knocking', 'Port Knocking', 'port-knocking', 'HTG{Port Knocking}']
    }
  },
  {
    stableId: 'HTG-L10-OE38',
    order: 38,
    levelNumber: 10,
    title: 'Suricata / Snort Rule Action Keyword for Event Generation',
    prompt: `In network intrusion detection and signature-based exploit prevention (such as Suricata and Snort), rule definitions begin with an action directive:
\`\`\`text
<ACTION> tcp any any -> 10.0.0.5 80 (msg:"EXPLOIT Buffer Overflow Attempt"; ...)
\`\`\`
Which 5-letter standard rule action keyword instructs the engine to log an event and notify operators when packet criteria match?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 5-letter keyword).`,
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
    flag: 'HTG{alert}',
    hints: [
      {
        hintIndex: 1,
        content: "The action keyword is alert (e.g. alert tcp ...).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE38',
      seedId: 'HTG-L10-OE38',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "The 'alert' rule action generates an alert log when signature conditions are triggered.",
      essentialKeyPoints: [
        "Other IDS actions include pass, drop, and reject.",
        "Alert rules match malicious byte patterns in reassembled network payloads."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{alert}' or 'alert'.",
        partialCredit: "Submits capitalized 'Alert'.",
        noCredit: "Submits log or pass."
      },
      acceptableAlternatives: ['HTG{alert}', 'alert', 'Alert', 'ALERT', 'HTG{Alert}']
    }
  },
  {
    stableId: 'HTG-L10-OE39',
    order: 39,
    levelNumber: 10,
    title: 'Command and Control (C2) Sleep Interval Jitter Variation',
    prompt: `To defeat automated NetFlow and telemetry systems that flag regular, periodic network beacons (e.g. connections exactly every 60.0 seconds), advanced command-and-control frameworks introduce random timing variations into sleep cycles.

What single-word term (commonly expressed as a percentage parameter, e.g. 20%) describes this intentional random fluctuation added to beacon intervals?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
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
    flag: 'HTG{jitter}',
    hints: [
      {
        hintIndex: 1,
        content: "Random interval variation is called jitter.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE39',
      seedId: 'HTG-L10-OE39',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "Jitter randomizes C2 sleep intervals to avoid periodic timing signatures.",
      essentialKeyPoints: [
        "A 60-second beacon with 20% jitter fires randomly between 48 and 72 seconds.",
        "Forensic detection utilizes auto-correlation and statistical dispersion to detect jittered beacons."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{jitter}' or 'jitter'.",
        partialCredit: "Submits capitalized 'Jitter'.",
        noCredit: "Submits drift or delay."
      },
      acceptableAlternatives: ['HTG{jitter}', 'jitter', 'Jitter', 'JITTER', 'HTG{Jitter}']
    }
  },
  {
    stableId: 'HTG-L10-OE40',
    order: 40,
    levelNumber: 10,
    title: 'Reassembled TCP Stream Exploit Stager Token Extraction',
    prompt: `A network security analyst reassembles a suspicious TCP stream (\`tcp.stream eq 42\`) containing an active exploit against an internal web service:
\`\`\`text
POST /api/v1/debug/execute HTTP/1.1
Host: citadel-internal.grid.test
X-Stager-Auth: EXPLOIT_STAGER_KEY_91
Content-Length: 1024

[Binary payload containing ROP gadgets...]
\`\`\`
What is the exact authorization stager key string passed in the \`X-Stager-Auth\` request header?

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
    flag: 'HTG{EXPLOIT_STAGER_KEY_91}',
    hints: [
      {
        hintIndex: 1,
        content: "Transcribe the X-Stager-Auth header: EXPLOIT_STAGER_KEY_91.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE40',
      seedId: 'HTG-L10-OE40',
      subtopic: 'Cross-synthesis of Binary Exploitation & Network Forensics',
      explanation: "The X-Stager-Auth header carries 'EXPLOIT_STAGER_KEY_91'.",
      essentialKeyPoints: [
        "Packet capture reassembly isolates custom exploitation headers.",
        "The stager key represents the fourth sub-key in the citadel puzzle sequence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{EXPLOIT_STAGER_KEY_91}'.",
        partialCredit: "Submits 'EXPLOIT_STAGER_KEY_91' without curly braces.",
        noCredit: "Submits partial header."
      },
      acceptableAlternatives: ['HTG{EXPLOIT_STAGER_KEY_91}', 'EXPLOIT_STAGER_KEY_91', 'exploit_stager_key_91', 'HTG{exploit_stager_key_91}']
    }
  }
];

module.exports = subtopic4Questions;

