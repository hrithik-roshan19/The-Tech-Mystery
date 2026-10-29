const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    stableId: 'HTG-L08-OE11',
    order: 11,
    levelNumber: 8,
    title: 'IPv4 Protocol Field Number for Transmission Control Protocol',
    prompt: `In an IPv4 packet header, byte 9 contains the 8-bit \`Protocol\` field that designates the transport-layer protocol encapsulated within the IP payload.

According to IANA assigned protocol registry numbers, each transport protocol has a designated decimal identifier (for example, ICMP is 1).

What decimal integer represents the Transmission Control Protocol (TCP) in the IPv4 Protocol field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer value).`,
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
    flag: 'HTG{6}',
    hints: [
      {
        hintIndex: 1,
        content: "IANA assigns protocol number 6 to TCP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE11',
      seedId: 'HTG-L08-OE11',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "Protocol number 6 in the IPv4 header denotes TCP encapsulation.",
      essentialKeyPoints: [
        "IPv4 Protocol field identifies the next-layer header (e.g. 6 = TCP, 17 = UDP, 1 = ICMP).",
        "Wireshark filters like 'ip.proto == 6' isolate TCP traffic regardless of port."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{6}' or '6'.",
        partialCredit: "Submits '0x06'.",
        noCredit: "Submits 17 or 1."
      },
      acceptableAlternatives: ['HTG{6}', '6', '0x06']
    }
  },
  {
    stableId: 'HTG-L08-OE12',
    order: 12,
    levelNumber: 8,
    title: 'IPv4 Protocol Field Number for User Datagram Protocol',
    prompt: `In an IPv4 packet header, the 8-bit Protocol field identifies the transport protocol encapsulated within the datagram.

While TCP is identified by protocol number 6, what decimal integer identifier represents User Datagram Protocol (UDP)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer value).`,
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
    flag: 'HTG{17}',
    hints: [
      {
        hintIndex: 1,
        content: "IANA assigns protocol number 17 (hex 0x11) to UDP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE12',
      seedId: 'HTG-L08-OE12',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "Protocol number 17 denotes UDP encapsulation in IPv4 headers.",
      essentialKeyPoints: [
        "UDP (Protocol 17) provides connectionless, lightweight datagram delivery.",
        "DNS, DHCP, NTP, and SNMP typically run over UDP."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{17}' or '17'.",
        partialCredit: "Submits '0x11'.",
        noCredit: "Submits 6 or 1."
      },
      acceptableAlternatives: ['HTG{17}', '17', '0x11']
    }
  },
  {
    stableId: 'HTG-L08-OE13',
    order: 13,
    levelNumber: 8,
    title: 'IPv4 Protocol Field Number for Internet Control Message Protocol',
    prompt: `Network diagnostics and error reporting packets (such as Destination Unreachable, Time Exceeded, and Echo requests) use the Internet Control Message Protocol (ICMP).

What decimal integer represents ICMP in the IPv4 header Protocol field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer value).`,
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
    flag: 'HTG{1}',
    hints: [
      {
        hintIndex: 1,
        content: "ICMP is assigned protocol number 1.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE13',
      seedId: 'HTG-L08-OE13',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "Protocol number 1 in the IPv4 header denotes ICMP.",
      essentialKeyPoints: [
        "ICMP operates alongside IP to provide control and diagnostic messaging.",
        "Display filter 'ip.proto == 1' extracts all ICMP traffic from a PCAP."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1}' or '1'.",
        partialCredit: "Submits '0x01'.",
        noCredit: "Submits 6 or 17."
      },
      acceptableAlternatives: ['HTG{1}', '1', '0x01']
    }
  },
  {
    stableId: 'HTG-L08-OE14',
    order: 14,
    levelNumber: 8,
    title: 'Address Resolution Protocol Request Opcode',
    prompt: `The Address Resolution Protocol (ARP) translates 32-bit IPv4 addresses to 48-bit MAC hardware addresses on local Ethernet broadcast domains.

The ARP header contains a 16-bit \`Opcode\` field indicating packet function:
- \`0x0001\`: ARP Request ("Who has IP X? Tell IP Y")
- \`0x0002\`: ARP Reply ("IP X is at MAC Z")

What decimal integer represents an ARP Request in the opcode field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer opcode).`,
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
    flag: 'HTG{1}',
    hints: [
      {
        hintIndex: 1,
        content: "Opcode 0x0001 corresponds to decimal 1.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE14',
      seedId: 'HTG-L08-OE14',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "ARP Request uses opcode 1 (0x0001), while ARP Reply uses opcode 2 (0x0002).",
      essentialKeyPoints: [
        "ARP requests are broadcast to FF:FF:FF:FF:FF:FF to locate target MACs.",
        "Monitoring ARP opcode distributions detects ARP cache poisoning attacks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1}' or '1'.",
        partialCredit: "Submits '0x0001' or '0x1'.",
        noCredit: "Submits 2."
      },
      acceptableAlternatives: ['HTG{1}', '1', '0x0001', '0x1']
    }
  },
  {
    stableId: 'HTG-L08-OE15',
    order: 15,
    levelNumber: 8,
    title: 'ICMP Echo Request Message Type',
    prompt: `The ping diagnostic utility uses Internet Control Message Protocol (ICMP) query messages.

The ICMP header defines message function via the 8-bit \`Type\` field:
- \`Type 0\`: Echo Reply
- \`Type 3\`: Destination Unreachable
- \`Type 8\`: [Echo Request]
- \`Type 11\`: Time Exceeded

What decimal integer represents an ICMP Echo Request in the Type field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer type).`,
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
    flag: 'HTG{8}',
    hints: [
      {
        hintIndex: 1,
        content: "ICMP Echo Request is Type 8.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE15',
      seedId: 'HTG-L08-OE15',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "ICMP Type 8 specifies an Echo Request, and Type 0 specifies an Echo Reply.",
      essentialKeyPoints: [
        "ICMP Echo Requests (Type 8) test bidirectional reachability.",
        "Unsolicited Type 8 bursts may indicate ping sweeps or ICMP tunneling."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{8}' or '8'.",
        partialCredit: "Submits 'Type 8'.",
        noCredit: "Submits 0 or 3."
      },
      acceptableAlternatives: ['HTG{8}', '8', 'Type 8']
    }
  },
  {
    stableId: 'HTG-L08-OE16',
    order: 16,
    levelNumber: 8,
    title: 'ICMP Echo Reply Message Type',
    prompt: `When a host receives a valid ICMP Echo Request (\`Type 8\`), it replies with an ICMP Echo Reply returning the identical identifier, sequence number, and data payload.

What decimal integer represents an ICMP Echo Reply in the ICMP header \`Type\` field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer type).`,
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
        content: "Echo Reply is designated by Type 0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE16',
      seedId: 'HTG-L08-OE16',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "ICMP Type 0 denotes an Echo Reply returned in response to an Echo Request.",
      essentialKeyPoints: [
        "Type 0 Echo Replies verify round-trip network connectivity.",
        "Mismatched Echo Reply payloads without preceding Requests indicate data exfiltration."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'Type 0' or 'zero'.",
        noCredit: "Submits 8 or 3."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'Type 0', 'zero']
    }
  },
  {
    stableId: 'HTG-L08-OE17',
    order: 17,
    levelNumber: 8,
    title: 'Ethernet II Frame EtherType for IPv4 Datagrams',
    prompt: `In an Ethernet II link-layer frame, the 2-byte \`EtherType\` field located after the 6-byte Destination MAC and 6-byte Source MAC indicates which network protocol payload follows:

\`\`\`text
Dest MAC (6B) | Src MAC (6B) | EtherType (2B) | Payload...
\`\`\`

Common EtherType values include:
- \`0x0806\`: ARP
- \`0x86DD\`: IPv6
- [EtherType]: IPv4

What 4-character hexadecimal value (with leading \`0x\`) designates an encapsulated IPv4 datagram?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex EtherType).`,
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
    flag: 'HTG{0x0800}',
    hints: [
      {
        hintIndex: 1,
        content: "The EtherType for IPv4 is 0x0800.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE17',
      seedId: 'HTG-L08-OE17',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "EtherType 0x0800 specifies that the Ethernet frame encapsulates an IPv4 packet.",
      essentialKeyPoints: [
        "EtherType fields enable link-layer multiplexing across multiple network layer protocols.",
        "In Wireshark, filtering with 'eth.type == 0x0800' extracts all IPv4 frames."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x0800}' or '0x0800'.",
        partialCredit: "Submits '0800' or uppercase '0x0800'.",
        noCredit: "Submits 0x0806 or 0x86DD."
      },
      acceptableAlternatives: ['HTG{0x0800}', '0x0800', '0800', 'HTG{0800}']
    }
  },
  {
    stableId: 'HTG-L08-OE18',
    order: 18,
    levelNumber: 8,
    title: 'Ethernet II Frame EtherType for Address Resolution Protocol',
    prompt: `Ethernet frames delivering Address Resolution Protocol (ARP) packets carry a distinct 2-byte EtherType value to instruct the receiving network interface card to dispatch the frame directly to the ARP subsystem.

What 4-character hexadecimal value (with leading \`0x\`) represents the ARP EtherType?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex EtherType).`,
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
    flag: 'HTG{0x0806}',
    hints: [
      {
        hintIndex: 1,
        content: "The EtherType for ARP is 0x0806.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE18',
      seedId: 'HTG-L08-OE18',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "EtherType 0x0806 specifies Address Resolution Protocol (ARP) encapsulation.",
      essentialKeyPoints: [
        "EtherType 0x0806 marks raw ARP frames on the local area network.",
        "Display filter 'eth.type == 0x0806' isolates ARP queries and replies."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x0806}' or '0x0806'.",
        partialCredit: "Submits '0806'.",
        noCredit: "Submits 0x0800 or 0x86DD."
      },
      acceptableAlternatives: ['HTG{0x0806}', '0x0806', '0806', 'HTG{0806}']
    }
  },
  {
    stableId: 'HTG-L08-OE19',
    order: 19,
    levelNumber: 8,
    title: 'SNMP Plaintext Default Read-Only Community String',
    prompt: `An auditor parses a packet capture containing unencrypted Simple Network Management Protocol (SNMPv1 / SNMPv2c) requests directed to a core router on UDP port 161.

Because SNMPv1 and SNMPv2c lack cryptographic authentication, access control relies entirely on a shared cleartext password string sent in the SNMP PDU header.

What is the classic, widely abused default read-only community string name configured on network devices?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the community string name).`,
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
    flag: 'HTG{public}',
    hints: [
      {
        hintIndex: 1,
        content: "The default read-only community string is 'public'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE19',
      seedId: 'HTG-L08-OE19',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "'public' is the ubiquitous default read-only SNMP community string, exposing device MIB trees to unauthorized enumeration.",
      essentialKeyPoints: [
        "SNMPv1/v2c transmit community strings in cleartext over UDP port 161.",
        "SNMPv3 introduces cryptographic authentication and encryption to replace community strings."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{public}' or 'public'.",
        partialCredit: "Submits uppercase 'PUBLIC'.",
        noCredit: "Submits private or admin."
      },
      acceptableAlternatives: ['HTG{public}', 'public', 'PUBLIC', 'HTG{PUBLIC}']
    }
  },
  {
    stableId: 'HTG-L08-OE20',
    order: 20,
    levelNumber: 8,
    title: 'DNS Header QR Bit Value for Query Packets',
    prompt: `In the standard Domain Name System (DNS) header (RFC 1035), the second 16-bit word contains flags that define message semantics:

\`\`\`text
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
\`\`\`

The very first bit of this flag word is the \`QR\` (Query/Response) bit, which distinguishes outgoing question queries from incoming server responses.

What binary bit value (0 or 1) represents a DNS Query?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single bit value).`,
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
        content: "QR bit: 0 = Query, 1 = Response.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE20',
      seedId: 'HTG-L08-OE20',
      subtopic: 'Protocol deep-dive and header analysis',
      explanation: "The QR bit is 0 for a DNS Query and 1 for a DNS Response.",
      essentialKeyPoints: [
        "In DNS headers, QR bit distinguishes queries (0) from replies (1).",
        "Wireshark display filter 'dns.flags.response == 0' isolates outgoing queries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'zero'.",
        noCredit: "Submits 1."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'zero']
    }
  }
];

module.exports = subtopic2Questions;
