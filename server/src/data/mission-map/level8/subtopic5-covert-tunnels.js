const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L08-OE41',
    order: 41,
    levelNumber: 8,
    title: 'DNS Tunneling High-Capacity Inbound Record Type',
    prompt: `In DNS tunneling C2 architectures, malware sends stolen data to an authoritative nameserver by encoding bytes into query subdomains (e.g. \`data.c2.example.com\`).

To return large volumes of command instructions or binary payloads back to the compromised host in response packets, which standard DNS resource record type is most commonly abused due to its ability to return arbitrary descriptive text strings?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter record type).`,
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
    flag: 'HTG{TXT}',
    hints: [
      {
        hintIndex: 1,
        content: "The record type for text strings is TXT.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE41',
      seedId: 'HTG-L08-OE41',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "DNS TXT records carry arbitrary binary or text data, making them the primary vehicle for downlink C2 tunneling.",
      essentialKeyPoints: [
        "TXT records return up to multiple 255-byte character strings.",
        "High volumes of TXT queries with abnormal entropy indicate DNS tunneling."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TXT}' or 'TXT'.",
        partialCredit: "Submits lowercase 'txt'.",
        noCredit: "Submits A or CNAME."
      },
      acceptableAlternatives: ['HTG{TXT}', 'TXT', 'txt', 'HTG{txt}']
    }
  },
  {
    stableId: 'HTG-L08-OE42',
    order: 42,
    levelNumber: 8,
    title: 'DNS Protocol Maximum Label Length in Characters',
    prompt: `When exfiltrating data via DNS queries, an adversary chops encoded data into dot-separated subdomain labels (e.g. \`label1.label2.domain.com\`).

According to the DNS protocol specification (RFC 1035), what is the maximum permissible length in octets/characters for any single DNS label?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer character limit).`,
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
    flag: 'HTG{63}',
    hints: [
      {
        hintIndex: 1,
        content: "RFC 1035 limits each label to 63 octets.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE42',
      seedId: 'HTG-L08-OE42',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "Each label in a DNS domain name can be up to 63 octets long.",
      essentialKeyPoints: [
        "DNS tunneling utilities maximize throughput by generating 63-character labels.",
        "Monitoring for labels near the 63-character threshold flags exfiltration attempts."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{63}' or '63'.",
        partialCredit: "Submits '63 characters'.",
        noCredit: "Submits 253 or 255."
      },
      acceptableAlternatives: ['HTG{63}', '63', '63 characters']
    }
  },
  {
    stableId: 'HTG-L08-OE43',
    order: 43,
    levelNumber: 8,
    title: 'DNS Protocol Maximum Fully Qualified Domain Name (FQDN) Length',
    prompt: `In the DNS protocol specification (RFC 1035 and RFC 2181), an entire Fully Qualified Domain Name (FQDN) including all labels and dot separators cannot exceed a specific total character length.

What is the maximum permissible length in octets for a full domain name (often cited as 253 or 255 with root octet)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer count).`,
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
    flag: 'HTG{253}',
    hints: [
      {
        hintIndex: 1,
        content: "253 characters is the maximum text representation length (255 wire octets).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE43',
      seedId: 'HTG-L08-OE43',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "RFC 1035/2181 sets 253 octets as the maximum textual representation length of an FQDN.",
      essentialKeyPoints: [
        "The 253-octet limit restricts how much data can be packed into a single DNS query.",
        "Tunneling clients chunk large files across multiple consecutive queries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{253}' or '253'.",
        partialCredit: "Submits '255'.",
        noCredit: "Submits 63 or 512."
      },
      acceptableAlternatives: ['HTG{253}', '253', '255', 'HTG{255}']
    }
  },
  {
    stableId: 'HTG-L08-OE44',
    order: 44,
    levelNumber: 8,
    title: 'Base32 Encoding Alphabet Case-Insensitivity Property',
    prompt: `When exfiltrating data through DNS queries, standard Base64 encoding is problematic because intermediate caching resolvers may normalize domain names to lowercase, corrupting uppercase and lowercase distinction.

For this reason, DNS tunneling utilities frequently select Base32 encoding (RFC 4648), which relies on an alphabet of 32 characters (A-Z and 2-7) that is fundamentally immune to case normalization.

What hyphenated term describes this alphabet characteristic that does not differentiate between capital and small letters?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hyphenated term).`,
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
    flag: 'HTG{CASE-INSENSITIVE}',
    hints: [
      {
        hintIndex: 1,
        content: "The property is case-insensitive.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE44',
      seedId: 'HTG-L08-OE44',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "Base32 is case-insensitive, preventing resolver capitalization munging from corrupting payloads.",
      essentialKeyPoints: [
        "DNS names are treated case-insensitively by RFC 1035 resolvers.",
        "Base32 encodes binary data into 5-bit chunks safe for DNS transport."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CASE-INSENSITIVE}' or 'CASE-INSENSITIVE'.",
        partialCredit: "Submits lowercase 'case-insensitive' or 'case insensitive'.",
        noCredit: "Submits case-sensitive or binary."
      },
      acceptableAlternatives: ['HTG{CASE-INSENSITIVE}', 'CASE-INSENSITIVE', 'case-insensitive', 'case insensitive', 'HTG{case-insensitive}']
    }
  },
  {
    stableId: 'HTG-L08-OE45',
    order: 45,
    levelNumber: 8,
    title: 'ICMP Reverse Shell Tool Name',
    prompt: `An intrusion detection alert flags anomalous ICMP Echo Request packets containing interactive command shell strings (\`whoami\`, \`dir\`, \`powershell\`) hidden within the ICMP data payload.

A well-known open-source penetration testing utility designed to spawn a standalone reverse shell purely over ICMP Echo Request and Reply packets bears this exact tool name: \`icmpsh\`.

What is the name of this ICMP reverse shell tool?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the tool name).`,
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
    flag: 'HTG{icmpsh}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the tool name in the prompt: icmpsh.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE45',
      seedId: 'HTG-L08-OE45',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "icmpsh runs a reverse command shell over ICMP, bypassing firewalls that allow ping but block TCP/UDP.",
      essentialKeyPoints: [
        "ICMP tunnels embed data in the optional payload section of Echo Request/Reply packets.",
        "Normal ping payloads contain static alphanumeric patterns or timestamp padding."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{icmpsh}' or 'icmpsh'.",
        partialCredit: "Submits uppercase 'ICMPSH'.",
        noCredit: "Submits ping or traceroute."
      },
      acceptableAlternatives: ['HTG{icmpsh}', 'icmpsh', 'ICMPSH', 'HTG{ICMPSH}']
    }
  },
  {
    stableId: 'HTG-L08-OE46',
    order: 46,
    levelNumber: 8,
    title: 'SSH Dynamic Port Forwarding SOCKS Proxy Command Flag',
    prompt: `To route internal network reconnaissance tools through an encrypted SSH tunnel, an engineer establishes a local SOCKS proxy:

\`\`\`bash
ssh -N -D 1080 user@edge-gateway.internal
\`\`\`

Which single-letter command-line flag (\`-D\`, \`-L\`, or \`-R\`) instructs the OpenSSH client to configure dynamic application-level port forwarding via SOCKS?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the flag string).`,
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
    flag: 'HTG{-D}',
    hints: [
      {
        hintIndex: 1,
        content: "Dynamic port forwarding uses -D.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE46',
      seedId: 'HTG-L08-OE46',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "ssh -D allocates a local SOCKS4/SOCKS5 proxy port, dynamically forwarding client traffic through the encrypted SSH tunnel.",
      essentialKeyPoints: [
        "SSH dynamic forwarding (-D) turns the SSH connection into a versatile SOCKS proxy.",
        "Pivoting through SSH tunnels conceals lateral network traffic inside authorized port 22 streams."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{-D}' or '-D'.",
        partialCredit: "Submits 'D' or '-d'.",
        noCredit: "Submits -L or -R."
      },
      acceptableAlternatives: ['HTG{-D}', '-D', 'D', '-d', 'HTG{D}']
    }
  },
  {
    stableId: 'HTG-L08-OE47',
    order: 47,
    levelNumber: 8,
    title: 'Domain Fronting Discrepancy Header Identification',
    prompt: `In a Domain Fronting attack, an adversary circumvents censorship and egress domain filtering by exploiting CDN edge routing architecture:

\`\`\`text
TLS SNI Field:        allowed-cdn-site.com
Encrypted HTTP Line:  POST /api/v1/sync HTTP/1.1
Encrypted Header:     Host: malicious-c2.com
\`\`\`

The network perimeter inspects the unencrypted TLS SNI and allows the connection because it points to a benign allowed site. However, the CDN edge server unpacks the TLS stream and routes the request based on the inner HTTP header.

What is the name of this inner HTTP header that directs the request to the covert backend host?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the header name).`,
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
    flag: 'HTG{Host}',
    hints: [
      {
        hintIndex: 1,
        content: "The HTTP header is the Host header.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE47',
      seedId: 'HTG-L08-OE47',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "Domain Fronting relies on discrepancies between the TLS SNI header and the inner HTTP Host header.",
      essentialKeyPoints: [
        "Domain Fronting masks traffic behind reputable CDN customer hostnames.",
        "CDNs mitigate fronting by verifying that SNI matches the Host header."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Host}' or 'Host'.",
        partialCredit: "Submits lowercase 'host' or 'Host header'.",
        noCredit: "Submits User-Agent or Origin."
      },
      acceptableAlternatives: ['HTG{Host}', 'Host', 'host', 'Host header', 'HTG{host}']
    }
  },
  {
    stableId: 'HTG-L08-OE48',
    order: 48,
    levelNumber: 8,
    title: 'DNS Tunneling Software Package Name',
    prompt: `An incident responder detects bidirectional IP-over-DNS tunneling. Analysis of the client binary reveals it creates a \`tun\` network interface and forwards arbitrary IPv4 traffic encapsulated inside DNS queries to a remote server daemon named \`iodined\`.

What is the 6-letter name of this classic DNS tunneling client software package?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the software name).`,
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
    flag: 'HTG{iodine}',
    hints: [
      {
        hintIndex: 1,
        content: "The daemon is iodined, so the client package is iodine.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE48',
      seedId: 'HTG-L08-OE48',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "iodine tunnels IPv4 data through a DNS server, using iodined on the server and iodine on the client.",
      essentialKeyPoints: [
        "iodine supports Base32, Base64, and raw binary encoding inside DNS queries.",
        "Detection signatures look for high query frequencies and unusual null/TXT record lengths."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{iodine}' or 'iodine'.",
        partialCredit: "Submits uppercase 'IODINE'.",
        noCredit: "Submits dnscat2 or nstx."
      },
      acceptableAlternatives: ['HTG{iodine}', 'iodine', 'IODINE', 'HTG{IODINE}']
    }
  },
  {
    stableId: 'HTG-L08-OE49',
    order: 49,
    levelNumber: 8,
    title: 'WebSocket Protocol Upgrade Header Token Value',
    prompt: `An adversary establishes a persistent, full-duplex communication tunnel over standard port 80/443 that bypasses standard HTTP request-response logging.

The initial HTTP handshake requests a protocol upgrade:

\`\`\`http
GET /chat/stream HTTP/1.1
Host: gateway.internal
Connection: Upgrade
Upgrade: [PROTOCOL_TOKEN]
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
\`\`\`

What protocol token string is specified in the \`Upgrade\` header?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the token string).`,
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
    flag: 'HTG{websocket}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the Sec-WebSocket headers: websocket.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE49',
      seedId: 'HTG-L08-OE49',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "The WebSocket protocol upgrade uses 'Upgrade: websocket' to switch from HTTP to a persistent binary stream.",
      essentialKeyPoints: [
        "WebSockets provide bidirectional framing over a single TCP connection.",
        "C2 frameworks utilize WebSockets to evade HTTP polling inspection."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{websocket}' or 'websocket'.",
        partialCredit: "Submits 'WebSocket' or uppercase.",
        noCredit: "Submits HTTP/2 or spdy."
      },
      acceptableAlternatives: ['HTG{websocket}', 'websocket', 'WebSocket', 'WEBSOCKET', 'HTG{WebSocket}']
    }
  },
  {
    stableId: 'HTG-L08-OE50',
    order: 50,
    levelNumber: 8,
    title: 'TCP Initial Sequence Number Covert Channel Acronym',
    prompt: `In network steganography, a covert sender embeds secret data directly into the 32-bit sequence number of outgoing TCP \`SYN\` packets.

Because random-looking sequence numbers appear completely normal on the wire, the covert receiver reconstructs the transmitted message by reading this sequence number upon arrival.

What 3-letter acronym designates the TCP Initial Sequence Number?

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
    flag: 'HTG{ISN}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Initial Sequence Number: ISN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE50',
      seedId: 'HTG-L08-OE50',
      subtopic: 'Covert channels, tunnels and exfiltration patterns',
      explanation: "The ISN (Initial Sequence Number) is the 32-bit starting sequence number chosen during the TCP handshake.",
      essentialKeyPoints: [
        "ISN steganography leaks 4 bytes per connection attempt without transmitting application data.",
        "Modern OS kernels randomize ISNs using cryptographic hashes to prevent predictability."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ISN}' or 'ISN'.",
        partialCredit: "Submits lowercase 'isn' or 'Initial Sequence Number'.",
        noCredit: "Submits ACK or SEQ."
      },
      acceptableAlternatives: ['HTG{ISN}', 'ISN', 'isn', 'Initial Sequence Number', 'HTG{isn}']
    }
  }
];

module.exports = subtopic5Questions;

