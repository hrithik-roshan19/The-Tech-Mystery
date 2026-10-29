const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L08-OE01',
    order: 1,
    levelNumber: 8,
    title: 'TCP Three-Way Handshake SYN-ACK Sequence Calculation',
    prompt: `A network security engineer investigates a captured TCP connection initiation in a packet capture (PCAP):

\`\`\`text
Packet 1: Client -> Server [SYN] Seq=1000000 Len=0
Packet 2: Server -> Client [SYN, ACK] Seq=5000000 Ack=1000001 Len=0
Packet 3: Client -> Server [ACK] Seq=1000001 Ack=[ACK_VALUE] Len=0
\`\`\`

During the TCP three-way handshake, the client's final ACK packet acknowledges the server's SYN-ACK by setting its Acknowledgment Number to the server's Initial Sequence Number (ISN) plus one.

What decimal integer value is transmitted in the Acknowledgment Number (\`Ack\`) field of Packet 3?

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
    flag: 'HTG{5000001}',
    hints: [
      {
        hintIndex: 1,
        content: "Add 1 to the server's Initial Sequence Number (5000000 + 1).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE01',
      seedId: 'HTG-L08-OE01',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "In TCP handshake synchronization, SYN consumes one sequence number. The final ACK acknowledges Server ISN (5000000) + 1 = 5000001.",
      essentialKeyPoints: [
        "TCP handshake sequences establish bidirectional reliable communication.",
        "SYN and FIN control flags each consume exactly one sequence number."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{5000001}' or '5000001'.",
        partialCredit: "Submits '5,000,001'.",
        noCredit: "Submits 1000001 or 5000000."
      },
      acceptableAlternatives: ['HTG{5000001}', '5000001', '5,000,001']
    }
  },
  {
    stableId: 'HTG-L08-OE02',
    order: 2,
    levelNumber: 8,
    title: 'Wireshark Follow TCP Stream Index Identification',
    prompt: `An analyst analyzes network traffic using Wireshark and locates an unauthorized HTTP download. In Wireshark's internal protocol tracking, every TCP conversation is assigned a sequential integer index stored in the metadata filter field \`tcp.stream\`.

The display filter applied to isolate this specific bidirectional conversation is:

\`\`\`text
tcp.stream eq 42
\`\`\`

What decimal integer represents the stream index identifying this reassembled conversation?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer index).`,
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
    flag: 'HTG{42}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the integer in the filter: tcp.stream eq 42.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE02',
      seedId: 'HTG-L08-OE02',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "The filter 'tcp.stream eq 42' isolates conversation index 42, enabling 'Follow TCP Stream' extraction.",
      essentialKeyPoints: [
        "Wireshark numbers TCP streams sequentially starting from 0.",
        "tcp.stream enables multi-packet payload reconstruction into continuous ASCII or hex streams."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{42}' or '42'.",
        partialCredit: "Submits 'stream 42'.",
        noCredit: "Submits 0 or 1."
      },
      acceptableAlternatives: ['HTG{42}', '42']
    }
  },
  {
    stableId: 'HTG-L08-OE03',
    order: 3,
    levelNumber: 8,
    title: 'Graceful TCP Connection Teardown Control Flag',
    prompt: `When two communicating endpoints finish transmitting data over a standard TCP connection, the terminating host initiates a graceful two-way connection closure by setting a specific 1-bit control flag in the TCP header:

\`\`\`text
Host A -> Host B [CONTROL_FLAG, ACK] Seq=1420 Ack=890
Host B -> Host A [ACK]               Seq=890  Ack=1421
Host B -> Host A [CONTROL_FLAG, ACK] Seq=890  Ack=1421
Host A -> Host B [ACK]               Seq=1421 Ack=891
\`\`\`

Unlike an abrupt termination via the \`RST\` flag, this flag requests an orderly end to the transmission session.

What 3-letter control flag name indicates this graceful teardown?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the flag name).`,
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
    flag: 'HTG{FIN}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Finish: FIN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE03',
      seedId: 'HTG-L08-OE03',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "The FIN (Finish) flag signals that the sender has finished transmitting data and requests connection closure.",
      essentialKeyPoints: [
        "FIN teardown requires a four-way handshake (FIN, ACK, FIN, ACK).",
        "RST terminates connections immediately without waiting for unacknowledged data."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{FIN}' or 'FIN'.",
        partialCredit: "Submits lowercase 'fin'.",
        noCredit: "Submits RST or SYN."
      },
      acceptableAlternatives: ['HTG{FIN}', 'FIN', 'fin', 'HTG{fin}']
    }
  },
  {
    stableId: 'HTG-L08-OE04',
    order: 4,
    levelNumber: 8,
    title: 'Out-of-Order TCP Segment Reassembly Next Expected Sequence',
    prompt: `An analyst monitors incoming TCP stream segments received by a receiver:

\`\`\`text
Segment 1: Seq=1000 Length=500  (Bytes 1000-1499 received)
Segment 2: Seq=2000 Length=500  (Bytes 2000-2499 arrived out of order)
Segment 3: Seq=1500 Length=500  (Bytes 1500-1999 fills the gap)
\`\`\`

After receiving Segment 3, all contiguous data from byte 1000 through byte 2499 has arrived without loss.

What decimal integer will the receiver send in its next cumulative Acknowledgment Number (\`Ack\`) field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer sequence number).`,
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
    flag: 'HTG{2500}',
    hints: [
      {
        hintIndex: 1,
        content: "Cumulative ACK points to the next byte expected: 2499 + 1 = 2500.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE04',
      seedId: 'HTG-L08-OE04',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "Cumulative ACK acknowledges all received contiguous bytes up to 2499, requesting byte 2500 next.",
      essentialKeyPoints: [
        "TCP cumulative acknowledgment indicates the next contiguous byte expected.",
        "Out-of-order segments are buffered until missing segments arrive to close sequence gaps."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2500}' or '2500'.",
        partialCredit: "Submits '2500 bytes'.",
        noCredit: "Submits 1500 or 2000."
      },
      acceptableAlternatives: ['HTG{2500}', '2500']
    }
  },
  {
    stableId: 'HTG-L08-OE05',
    order: 5,
    levelNumber: 8,
    title: 'Total Reassembled HTTP POST Exfiltration Volume',
    prompt: `A data exfiltration incident is reconstructed by carving a multipart TCP stream. Three consecutive TCP segments carry chunks of the HTTP request body:

\`\`\`text
Segment 1: Payload Length = 1460 bytes
Segment 2: Payload Length = 1460 bytes
Segment 3: Payload Length = 880 bytes
\`\`\`

Assuming no duplicate packets and zero protocol retransmissions, what is the total volume in bytes of data payload transmitted across these three segments?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer byte count).`,
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
    flag: 'HTG{3800}',
    hints: [
      {
        hintIndex: 1,
        content: "1460 + 1460 + 880 = 3800 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE05',
      seedId: 'HTG-L08-OE05',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "1460 + 1460 + 880 = 3800 bytes of reassembled TCP application payload.",
      essentialKeyPoints: [
        "PCAP reassembly strips Ethernet, IP, and TCP headers to isolate raw application data.",
        "Total payload volume calculation is essential for data loss impact assessment."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{3800}' or '3800'.",
        partialCredit: "Submits '3,800' or '3800 bytes'.",
        noCredit: "Submits 2920 or 1460."
      },
      acceptableAlternatives: ['HTG{3800}', '3800', '3,800', '3800 bytes']
    }
  },
  {
    stableId: 'HTG-L08-OE06',
    order: 6,
    levelNumber: 8,
    title: 'Fast Retransmit Duplicate ACK Threshold',
    prompt: `In TCP congestion control and loss recovery (RFC 5681), the sender uses incoming duplicate ACKs to detect segment loss prior to retransmission timeout (RTO).

When a receiver receives out-of-order packets, it immediately emits duplicate ACKs repeating the last contiguous sequence number. Upon receiving a specific threshold count of identical duplicate ACKs, the sender infers loss and executes a Fast Retransmit.

What is the standard integer threshold of duplicate ACKs required to trigger TCP Fast Retransmit?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer threshold).`,
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
    flag: 'HTG{3}',
    hints: [
      {
        hintIndex: 1,
        content: "RFC 5681 defines 3 duplicate ACKs (triple duplicate ACK) as the threshold.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE06',
      seedId: 'HTG-L08-OE06',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "Three duplicate ACKs (a total of 4 identical ACKs) trigger TCP Fast Retransmit without waiting for the RTO timer.",
      essentialKeyPoints: [
        "Triple duplicate ACK threshold distinguishes packet reordering from packet loss.",
        "Fast Retransmit immediately resends the missing segment followed by Fast Recovery."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{3}' or '3'.",
        partialCredit: "Submits 'three'.",
        noCredit: "Submits 1 or 2."
      },
      acceptableAlternatives: ['HTG{3}', '3', 'three']
    }
  },
  {
    stableId: 'HTG-L08-OE07',
    order: 7,
    levelNumber: 8,
    title: 'Standard Ethernet Maximum Transmission Unit (MTU) in Bytes',
    prompt: `In Ethernet network packet captures, packets exceeding the maximum frame payload limit must be fragmented at the IP layer or segmented at the transport layer.

What is the default standard Maximum Transmission Unit (MTU) in bytes for standard IEEE 802.3 Ethernet networks (excluding jumbo frames)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer MTU).`,
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
    flag: 'HTG{1500}',
    hints: [
      {
        hintIndex: 1,
        content: "Standard Ethernet MTU is 1500 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE07',
      seedId: 'HTG-L08-OE07',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "Standard Ethernet MTU is 1500 bytes. Subtracting 20 bytes IP and 20 bytes TCP yields standard MSS = 1460 bytes.",
      essentialKeyPoints: [
        "MTU dictates the maximum IP packet size before link-layer fragmentation.",
        "Path MTU Discovery (PMTUD) utilizes ICMP Fragmentation Needed (Type 3, Code 4) messages."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1500}' or '1500'.",
        partialCredit: "Submits '1500 bytes'.",
        noCredit: "Submits 1460 or 9000."
      },
      acceptableAlternatives: ['HTG{1500}', '1500', '1500 bytes']
    }
  },
  {
    stableId: 'HTG-L08-OE08',
    order: 8,
    levelNumber: 8,
    title: 'HTTP Chunked Transfer Encoding Final Chunk Marker',
    prompt: `When inspecting a reassembled HTTP/1.1 response stream utilizing \`Transfer-Encoding: chunked\`, each chunk begins with its byte length in hexadecimal, followed by CRLF and data.

The sender signals the complete end of the chunked body by sending a terminal chunk of zero length:

\`\`\`text
[Final Chunk Marker]\\r\\n\\r\\n
\`\`\`

What single ASCII character represents this final zero-length chunk size?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single digit character).`,
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
    flag: 'HTG{0}',
    hints: [
      {
        hintIndex: 1,
        content: "A chunk of length zero is signaled with '0'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE08',
      seedId: 'HTG-L08-OE08',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "A chunk-size of '0' followed by CRLF terminates a chunked HTTP stream, followed by optional trailer fields.",
      essentialKeyPoints: [
        "Chunked encoding delivers dynamic HTTP bodies without requiring Content-Length headers up front.",
        "Reassembly parsers scan for '0\\r\\n\\r\\n' to conclude stream processing."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'zero'.",
        noCredit: "Submits EOF or NULL."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'zero']
    }
  },
  {
    stableId: 'HTG-L08-OE09',
    order: 9,
    levelNumber: 8,
    title: 'Wireshark Display Filter Protocol Field for TCP Destination Port',
    prompt: `An investigator wishes to filter a packet capture to display only traffic directed towards an internal HTTP service running on port 8080.

In Wireshark display filter syntax, what is the exact field name used to filter on the TCP destination port (e.g. \`tcp.dstport == 8080\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the field name).`,
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
    flag: 'HTG{tcp.dstport}',
    hints: [
      {
        hintIndex: 1,
        content: "The filter field name is tcp.dstport.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE09',
      seedId: 'HTG-L08-OE09',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "tcp.dstport matches the destination port in TCP headers, distinct from tcp.srcport or tcp.port.",
      essentialKeyPoints: [
        "tcp.dstport filters by destination port specifically.",
        "tcp.port filters if either source or destination matches."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{tcp.dstport}' or 'tcp.dstport'.",
        partialCredit: "Submits uppercase 'TCP.DSTPORT'.",
        noCredit: "Submits tcp.port or ip.dst."
      },
      acceptableAlternatives: ['HTG{tcp.dstport}', 'tcp.dstport', 'TCP.DSTPORT', 'HTG{TCP.DSTPORT}']
    }
  },
  {
    stableId: 'HTG-L08-OE10',
    order: 10,
    levelNumber: 8,
    title: 'TCP Reset Flag for Connection Abort',
    prompt: `During an active data transfer, an IDS sensor sends a TCP segment to immediately tear down a malicious command and control channel without undergoing the standard FIN handshake:

\`\`\`text
Sensor -> Host [CONTROL_FLAG] Seq=410290 Ack=0 Len=0
\`\`\`

Which 3-letter TCP control flag instructs the receiving host to immediately drop the connection and release associated socket resources?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the flag name).`,
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
    flag: 'HTG{RST}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Reset: RST.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE10',
      seedId: 'HTG-L08-OE10',
      subtopic: 'PCAP stream reassembly and TCP flow reconstruction',
      explanation: "The RST (Reset) flag immediately aborts a TCP connection upon arrival of unexpected segments or firewall intervention.",
      essentialKeyPoints: [
        "RST flags abort connections without waiting for round-trip acknowledgments.",
        "TCP reset injection is a classic technique used by network IPS to terminate hostile sessions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RST}' or 'RST'.",
        partialCredit: "Submits lowercase 'rst'.",
        noCredit: "Submits FIN or ACK."
      },
      acceptableAlternatives: ['HTG{RST}', 'RST', 'rst', 'HTG{rst}']
    }
  }
];

module.exports = subtopic1Questions;

