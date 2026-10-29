const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L06-OE31',
    order: 31,
    levelNumber: 6,
    title: 'Volatility windows.netscan Remote Port Identification',
    prompt: `A digital forensics investigator parses the active network socket pools of a compromised host using Volatility 3's \`windows.netscan\` plugin:

\`\`\`text
Offset       Proto  LocalAddr       LocalPort  ForeignAddr     ForeignPort  State        PID   Owner
0x8a01f400   TCPv4  192.168.1.105   52114      198.51.100.23   4444         ESTABLISHED  4820  powershell.exe
0x8a02d180   TCPv4  0.0.0.0         445        0.0.0.0         0            LISTENING    4     System
\`\`\`

The \`powershell.exe\` process maintains an active outbound network connection to external IP \`198.51.100.23\`.

What is the destination (foreign) TCP port number used by this suspicious PowerShell connection?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer port number).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{4444}',
    hints: [
      {
        hintIndex: 1,
        content: "Check the ForeignPort column for PID 4820.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE31',
      seedId: 'HTG-L06-OE31',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "The ForeignPort column displays 4444, a default listener port frequently associated with Metasploit payloads.",
      essentialKeyPoints: [
        "windows.netscan carves TCP and UDP socket endpoints directly from kernel pool allocations.",
        "ForeignPort identifies destination ports utilized during C2 beaconing."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{4444}' or '4444'.",
        partialCredit: "Submits port with leading spaces or quotes.",
        noCredit: "Submits 52114 or 445."
      },
      acceptableAlternatives: ['HTG{4444}', '4444']
    }
  },
  {
    stableId: 'HTG-L06-OE32',
    order: 32,
    levelNumber: 6,
    title: 'Suspicious Reverse Shell Foreign IP Address',
    prompt: `During memory analysis of an intrusion on a grid management controller, the network scan reveals an interactive command line shell communicating with an off-network IP address:

\`\`\`text
Offset       Proto  LocalAddr       LocalPort  ForeignAddr     ForeignPort  State        PID   Owner
0x8b11c200   TCPv4  10.0.4.15       49822      198.51.100.77   8443         ESTABLISHED  3312  cmd.exe
\`\`\`

Extract the remote foreign IPv4 address to which \`cmd.exe\` established this outbound reverse shell connection.

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
    difficulty: 'HARD',
    flag: 'HTG{198.51.100.77}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the ForeignAddr column for cmd.exe: 198.51.100.77.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE32',
      seedId: 'HTG-L06-OE32',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "cmd.exe established a socket to 198.51.100.77 on port 8443, characteristic of an outbound reverse command shell.",
      essentialKeyPoints: [
        "Direct socket connections owned by command interpreters (cmd.exe, powershell.exe) indicate interactive reverse shells.",
        "ForeignAddr provides the external C2 IP address for threat hunting."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{198.51.100.77}' or '198.51.100.77'.",
        partialCredit: "Submits IP with port attached (198.51.100.77:8443).",
        noCredit: "Submits local IP 10.0.4.15."
      },
      acceptableAlternatives: ['HTG{198.51.100.77}', '198.51.100.77']
    }
  },
  {
    stableId: 'HTG-L06-OE33',
    order: 33,
    levelNumber: 6,
    title: 'TCP Connection State for Active Sockets',
    prompt: `In the TCP finite state machine, a socket transitions through distinct states during connection establishment, data transfer, and termination:
- LISTEN
- SYN_SENT
- SYN_RECEIVED
- [Active Transmission State]
- FIN_WAIT_1 / FIN_WAIT_2
- TIME_WAIT
- CLOSE_WAIT

When both the client and server have completed the three-way handshake (SYN, SYN-ACK, ACK), what standard TCP state name indicates an active, open two-way channel ready for data transmission?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the uppercase state name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{ESTABLISHED}',
    hints: [
      {
        hintIndex: 1,
        content: "The connection has been successfully established.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE33',
      seedId: 'HTG-L06-OE33',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "ESTABLISHED indicates the three-way handshake succeeded and the socket is actively communicating.",
      essentialKeyPoints: [
        "ESTABLISHED TCP states in memory dumps indicate live sessions at the moment of acquisition.",
        "Residual sockets in TIME_WAIT or CLOSE_WAIT provide historical connection traces."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ESTABLISHED}' or 'ESTABLISHED'.",
        partialCredit: "Submits lowercase 'established'.",
        noCredit: "Submits LISTENING or SYN_SENT."
      },
      acceptableAlternatives: ['HTG{ESTABLISHED}', 'ESTABLISHED', 'established', 'HTG{established}']
    }
  },
  {
    stableId: 'HTG-L06-OE34',
    order: 34,
    levelNumber: 6,
    title: 'Standard Name Resolution UDP Port Protocol Identification',
    prompt: `Network artifact analysis from a host memory dump reveals periodic outbound UDP queries sent from \`svchost.exe\` to the destination address \`10.0.0.2\` on port 53:

\`\`\`text
Proto: UDP
Source: 10.0.4.15:58210
Destination: 10.0.0.2:53
Length: 68 bytes
\`\`\`

Which core network resolution protocol used for hostname-to-IP address translation natively operates on port 53?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter protocol name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{DNS}',
    hints: [
      {
        hintIndex: 1,
        content: "Domain Name System protocol abbreviation.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE34',
      seedId: 'HTG-L06-OE34',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "Port 53 is the well-known port for DNS (Domain Name System) name resolution queries.",
      essentialKeyPoints: [
        "DNS queries in volatile memory provide evidence of domain generation algorithms (DGA) or DNS tunneling.",
        "Port 53 handles standard UDP lookups and TCP zone transfers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{DNS}' or 'DNS'.",
        partialCredit: "Submits lowercase 'dns' or 'Domain Name System'.",
        noCredit: "Submits DHCP or NTP."
      },
      acceptableAlternatives: ['HTG{DNS}', 'DNS', 'dns', 'Domain Name System', 'HTG{dns}']
    }
  },
  {
    stableId: 'HTG-L06-OE35',
    order: 35,
    levelNumber: 6,
    title: 'Linux /proc/net/tcp Inode to Process PID Mapping',
    prompt: `In Linux memory forensics, open network connections are recovered by parsing kernel socket tables. An entry from \`/proc/net/tcp\` lists an active socket with inode \`49182\`:

\`\`\`text
sl  local_address rem_address   st tx_queue rx_queue uid  timeout inode
 2: 0A00040F:C421 C633644D:115C 01 00000000:00000000 1000        0 49182
\`\`\`

Cross-referencing process file descriptors in \`/proc/*/fd/\` identifies the associated socket link:

\`\`\`text
lrwx------ 1 app app 64 /proc/2840/fd/3 -> socket:[49182]
\`\`\`

What is the Process ID (PID) of the user-space process that owns this network socket?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer PID).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{2840}',
    hints: [
      {
        hintIndex: 1,
        content: "The directory name under /proc/ is the process PID: 2840.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE35',
      seedId: 'HTG-L06-OE35',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "In Linux, /proc/<pid>/fd/ maps descriptor links to socket inodes. Inode 49182 maps directly to PID 2840.",
      essentialKeyPoints: [
        "Linux kernel associates network sockets with file descriptors via unique inodes.",
        "Correlating socket inodes to /proc/<pid>/fd identifies the responsible process."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2840}' or '2840'.",
        partialCredit: "Submits '/proc/2840'.",
        noCredit: "Submits inode number 49182."
      },
      acceptableAlternatives: ['HTG{2840}', '2840']
    }
  },
  {
    stableId: 'HTG-L06-OE36',
    order: 36,
    levelNumber: 6,
    title: 'Memory-Carved HTTP Exfiltration Request Method',
    prompt: `Forensic carving of an unallocated heap buffer in a compromised web server's memory dump reveals an outbound HTTP data exfiltration request:

\`\`\`http
POST /api/v1/telemetry/sync HTTP/1.1
Host: staging.grid-telemetry.internal
User-Agent: Custom-Agent/1.0
Content-Type: application/octet-stream
Content-Length: 48912

[Encrypted payload data...]
\`\`\`

Which HTTP request method was used in this request header to transmit the payload to the staging endpoint?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the uppercase HTTP method).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{POST}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the first word of the HTTP request line.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE36',
      seedId: 'HTG-L06-OE36',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "The HTTP request line begins with 'POST', which is used to send data in the request body.",
      essentialKeyPoints: [
        "Carving network buffers from memory uncovers unencrypted HTTP headers and payloads.",
        "POST requests often carry staged or exfiltrated binary data."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{POST}' or 'POST'.",
        partialCredit: "Submits lowercase 'post'.",
        noCredit: "Submits GET, PUT, or DELETE."
      },
      acceptableAlternatives: ['HTG{POST}', 'POST', 'post', 'HTG{post}']
    }
  },
  {
    stableId: 'HTG-L06-OE37',
    order: 37,
    levelNumber: 6,
    title: 'TLS 1.3 Client Hello Server Name Indication (SNI)',
    prompt: `An encrypted TLS connection was initiated by a malicious injector. Although the session data was encrypted, memory carving captured the unencrypted TLS Client Hello handshake frame from the network buffer:

\`\`\`text
TLSv1.3 Record Layer: Handshake Protocol: Client Hello
  Handshake Type: Client Hello (1)
  Extension: server_name (len=25)
    Server Name list length: 23
    Server Name Type: host_name (0)
    Server Name length: 20
    Server Name: c2.shadow-grid.test
\`\`\`

Extract the fully qualified domain name (FQDN) revealed in the Server Name Indication (SNI) extension.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the domain name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{c2.shadow-grid.test}',
    hints: [
      {
        hintIndex: 1,
        content: "Check the Server Name field: c2.shadow-grid.test.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE37',
      seedId: 'HTG-L06-OE37',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "The SNI field transmits the requested target hostname in plain text during TLS Client Hello negotiation.",
      essentialKeyPoints: [
        "SNI exposes target hostnames even when the subsequent application data stream is encrypted.",
        "Volatile memory buffers frequently retain Client Hello frames across active sessions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{c2.shadow-grid.test}' or 'c2.shadow-grid.test'.",
        partialCredit: "Submits domain with trailing period.",
        noCredit: "Submits invalid hostname or IP."
      },
      acceptableAlternatives: ['HTG{c2.shadow-grid.test}', 'c2.shadow-grid.test']
    }
  },
  {
    stableId: 'HTG-L06-OE38',
    order: 38,
    levelNumber: 6,
    title: 'IANA Ephemeral / Dynamic Port Range Lower Bound',
    prompt: `When an outbound TCP client establishes a connection to a remote service, the operating system kernel dynamically assigns a local source port from the ephemeral (private/dynamic) port pool.

According to the Internet Assigned Numbers Authority (IANA) standard port number allocations:
- Well-Known Ports: 0 – 1023
- Registered Ports: 1024 – 49151
- Dynamic / Ephemeral Ports: [Lower Bound] – 65535

What is the beginning (lowest) decimal port number of the official IANA dynamic and private port range?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer port number).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{49152}',
    hints: [
      {
        hintIndex: 1,
        content: "The dynamic range starts immediately after 49151.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE38',
      seedId: 'HTG-L06-OE38',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "IANA specifies ports 49152 through 65535 as dynamic/private/ephemeral ports.",
      essentialKeyPoints: [
        "Outbound client sockets routinely draw ephemeral ports from the 49152-65535 range.",
        "Distinguishing ephemeral source ports from listener ports is key in network triage."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{49152}' or '49152'.",
        partialCredit: "Submits '49152-65535'.",
        noCredit: "Submits 1024 or 32768."
      },
      acceptableAlternatives: ['HTG{49152}', '49152']
    }
  },
  {
    stableId: 'HTG-L06-OE39',
    order: 39,
    levelNumber: 6,
    title: 'Windows Named Pipe IPC Handle Owner Identification',
    prompt: `Malware frameworks like Cobalt Strike utilize Windows Named Pipes for stealthy inter-process communication (IPC) and lateral movement across SMB.

A memory analyst executes \`windows.handles\` to inspect open named pipes:

\`\`\`text
PID   Handle  Type        Access    Name
3940  0x1c4   NamedPipe   0x12019f  \\Device\\NamedPipe\\status_channel_3940
\`\`\`

Identify the Process ID (PID) of the host process holding this active named pipe handle.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer PID).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{3940}',
    hints: [
      {
        hintIndex: 1,
        content: "Check the PID column in the handles table: 3940.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE39',
      seedId: 'HTG-L06-OE39',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "Process ID 3940 holds an open kernel handle to the named pipe '\\Device\\NamedPipe\\status_channel_3940'.",
      essentialKeyPoints: [
        "Named pipes provide inter-process communication without exposing raw TCP sockets.",
        "Inspecting pipe names and owning PIDs uncovers beacon staging channels."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{3940}' or '3940'.",
        partialCredit: "Submits 'PID 3940'.",
        noCredit: "Submits handle value 0x1c4."
      },
      acceptableAlternatives: ['HTG{3940}', '3940']
    }
  },
  {
    stableId: 'HTG-L06-OE40',
    order: 40,
    levelNumber: 6,
    title: 'Windows DNS Client Cache Memory Artifact Extraction',
    prompt: `The Windows DNS Client service (\`dnscache\`) caches recent name resolution records in process memory within \`svchost.exe\`.

Recovering the client DNS cache from memory reveals an entry for an external telemetry service:

\`\`\`text
Entry Name:  api.cloud-telemetry.org
Record Type: A (IPv4)
TTL:         300
Data:        203.0.113.99
\`\`\`

What IPv4 address was resolved and stored in the local DNS cache for \`api.cloud-telemetry.org\`?

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
    difficulty: 'HARD',
    flag: 'HTG{203.0.113.99}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the Data field: 203.0.113.99.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE40',
      seedId: 'HTG-L06-OE40',
      subtopic: 'Network connections, sockets, and session reconstruction',
      explanation: "The DNS client cache record maps 'api.cloud-telemetry.org' to IP 203.0.113.99.",
      essentialKeyPoints: [
        "DNS client cache in volatile memory retains domain-to-IP resolutions that may no longer exist in network logs.",
        "dnscache entries survive until their Time-To-Live (TTL) expires."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{203.0.113.99}' or '203.0.113.99'.",
        partialCredit: "Submits IP with whitespace.",
        noCredit: "Submits hostname or TTL value."
      },
      acceptableAlternatives: ['HTG{203.0.113.99}', '203.0.113.99']
    }
  }
];

module.exports = subtopic4Questions;
