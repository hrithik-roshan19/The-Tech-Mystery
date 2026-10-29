const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L08-OE51',
    order: 51,
    levelNumber: 8,
    title: 'ARP Cache Poisoning Man-in-the-Middle Attack Name',
    prompt: `An analyst detects a flood of unsolicited gratuitous ARP replies on a switch port:

\`\`\`text
ARP Reply: 192.168.1.1 is-at 00:0c:29:ab:cd:ef (Attacker MAC)
ARP Reply: 192.168.1.1 is-at 00:0c:29:ab:cd:ef (Attacker MAC)
\`\`\`

The attacker claims the IP address of the default gateway (\`192.168.1.1\`), causing neighboring workstations to update their internal IP-to-MAC resolution tables and route all outbound internet traffic through the attacker's machine.

What hyphenated term names this ARP cache manipulation attack?

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
    flag: 'HTG{ARP-SPOOFING}',
    hints: [
      {
        hintIndex: 1,
        content: "Commonly termed ARP-SPOOFING (or ARP-POISONING).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE51',
      seedId: 'HTG-L08-OE51',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "ARP Spoofing (or ARP Poisoning) overwrites ARP tables with falsified MAC mappings to intercept local traffic.",
      essentialKeyPoints: [
        "ARP lacks authentication; hosts accept unsolicited replies by default.",
        "Dynamic ARP Inspection (DAI) on managed switches mitigates ARP spoofing."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ARP-SPOOFING}' or 'ARP-SPOOFING'.",
        partialCredit: "Submits 'ARP spoofing', 'ARP-POISONING', or 'arp poisoning'.",
        noCredit: "Submits DNS spoofing or IP spoofing."
      },
      acceptableAlternatives: ['HTG{ARP-SPOOFING}', 'ARP-SPOOFING', 'arp-spoofing', 'ARP spoofing', 'ARP-POISONING', 'arp-poisoning', 'HTG{ARP-POISONING}']
    }
  },
  {
    stableId: 'HTG-L08-OE52',
    order: 52,
    levelNumber: 8,
    title: 'TCP SYN Flood Denial of Service Attack',
    prompt: `A web server becomes unresponsive to legitimate users. Traffic monitoring reveals an onslaught of incoming TCP connection requests originating from thousands of spoofed IP addresses:

\`\`\`text
Spoofed_IP_1:4812 -> Server:80 [SYN]
Spoofed_IP_2:4930 -> Server:80 [SYN]
Spoofed_IP_3:5102 -> Server:80 [SYN]
\`\`\`

The server allocates state memory in its connection backlog table and replies with \`SYN-ACK\`, but because the source IPs are fabricated, no final \`ACK\` is ever received. The backlog table exhausts available memory, preventing new sessions.

What hyphenated term designates this classic TCP denial-of-service attack?

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
    flag: 'HTG{SYN-FLOOD}',
    hints: [
      {
        hintIndex: 1,
        content: "The attack is a SYN-FLOOD.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE52',
      seedId: 'HTG-L08-OE52',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "A SYN Flood exhausts the server's half-open connection backlog queue.",
      essentialKeyPoints: [
        "SYN Floods fill the listen backlog table with unacknowledged state.",
        "SYN Cookies (RFC 4987) encode state into the ISN, mitigating backlog exhaustion."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SYN-FLOOD}' or 'SYN-FLOOD'.",
        partialCredit: "Submits lowercase 'syn-flood' or 'SYN flood'.",
        noCredit: "Submits UDP flood or Smurf."
      },
      acceptableAlternatives: ['HTG{SYN-FLOOD}', 'SYN-FLOOD', 'syn-flood', 'SYN flood', 'HTG{syn-flood}']
    }
  },
  {
    stableId: 'HTG-L08-OE53',
    order: 53,
    levelNumber: 8,
    title: 'Link-Local Multicast Name Resolution (LLMNR) UDP Port',
    prompt: `In Windows Active Directory environments, when a workstation cannot resolve a hostname via primary DNS, it broadcasts a name resolution query over Link-Local Multicast Name Resolution (LLMNR).

Adversaries run automated tools like \`Responder\` to answer these broadcast queries with rogue credentials prompts, capturing NetNTLM password hashes.

What UDP port number is assigned to LLMNR multicast traffic (IP \`224.0.0.252\`)?

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
    flag: 'HTG{5355}',
    hints: [
      {
        hintIndex: 1,
        content: "LLMNR operates on UDP port 5355.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE53',
      seedId: 'HTG-L08-OE53',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "UDP port 5355 is the standard port for LLMNR multicast queries and responses.",
      essentialKeyPoints: [
        "LLMNR allows peer-to-peer name resolution without a DNS server.",
        "Disabling LLMNR via Group Policy prevents Responder-style NetNTLM hash harvesting."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{5355}' or '5355'.",
        partialCredit: "Submits 'port 5355'.",
        noCredit: "Submits 53 or 137."
      },
      acceptableAlternatives: ['HTG{5355}', '5355']
    }
  },
  {
    stableId: 'HTG-L08-OE54',
    order: 54,
    levelNumber: 8,
    title: 'NetBIOS Name Service (NBT-NS) UDP Port',
    prompt: `Alongside LLMNR, legacy Windows workstations fall back to NetBIOS Name Service (NBT-NS) broadcast queries to resolve internal system names.

What UDP port number is utilized by NBT-NS broadcast name queries on local subnets?

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
    flag: 'HTG{137}',
    hints: [
      {
        hintIndex: 1,
        content: "NetBIOS Name Service operates on UDP port 137.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE54',
      seedId: 'HTG-L08-OE54',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "UDP port 137 is the assigned port for NetBIOS Name Service (NBT-NS).",
      essentialKeyPoints: [
        "NBT-NS broadcasts name registration and resolution queries on port 137.",
        "Poisoning port 137 traffic allows interception of internal file share authentication."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{137}' or '137'.",
        partialCredit: "Submits 'port 137'.",
        noCredit: "Submits 139 or 445."
      },
      acceptableAlternatives: ['HTG{137}', '137']
    }
  },
  {
    stableId: 'HTG-L08-OE55',
    order: 55,
    levelNumber: 8,
    title: 'DHCP Starvation Initial Broadcast Message Type',
    prompt: `In a DHCP starvation attack, a malicious actor rapidly consumes all available IPv4 addresses in a subnet's DHCP pool by flooding the broadcast domain with thousands of lease requests using randomized MAC addresses.

What is the 8-letter message type name of the initial broadcast packet sent by a client to locate available DHCP servers in the classic DORA sequence?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the message name).`,
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
    flag: 'HTG{DISCOVER}',
    hints: [
      {
        hintIndex: 1,
        content: "The D in DORA stands for DISCOVER.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE55',
      seedId: 'HTG-L08-OE55',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "DHCPDISCOVER is the initial broadcast message in the DHCP DORA process.",
      essentialKeyPoints: [
        "DHCP starvation exhausts scope pools via simulated DHCPDISCOVER floods.",
        "DHCP Snooping on switches mitigates starvation by validating client MAC addresses."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{DISCOVER}' or 'DISCOVER'.",
        partialCredit: "Submits lowercase 'discover' or 'DHCPDISCOVER'.",
        noCredit: "Submits OFFER or REQUEST."
      },
      acceptableAlternatives: ['HTG{DISCOVER}', 'DISCOVER', 'discover', 'DHCPDISCOVER', 'dhcpdiscover', 'HTG{discover}']
    }
  },
  {
    stableId: 'HTG-L08-OE56',
    order: 56,
    levelNumber: 8,
    title: 'Smurf Attack Amplification Protocol',
    prompt: `In a classic Smurf distributed denial-of-service attack, an adversary sends a high volume of Echo Request packets with a falsified source IP address directed to an intermediary network's directed broadcast address.

Every active host on the broadcast network replies to the victim's spoofed IP address, amplifying traffic and overwhelming the victim's link.

Which core network protocol (abbreviated in 4 letters) is utilized as the amplification vector in a Smurf attack?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter protocol name).`,
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
    flag: 'HTG{ICMP}',
    hints: [
      {
        hintIndex: 1,
        content: "Echo requests belong to the ICMP protocol.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE56',
      seedId: 'HTG-L08-OE56',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "A Smurf attack amplifies traffic by sending ICMP Echo Requests to broadcast addresses.",
      essentialKeyPoints: [
        "Smurf attacks abuse IP directed broadcast functionality.",
        "Modern routers disable IP directed broadcast (RFC 2644) to prevent Smurf amplification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ICMP}' or 'ICMP'.",
        partialCredit: "Submits lowercase 'icmp'.",
        noCredit: "Submits UDP or TCP."
      },
      acceptableAlternatives: ['HTG{ICMP}', 'ICMP', 'icmp', 'HTG{icmp}']
    }
  },
  {
    stableId: 'HTG-L08-OE57',
    order: 57,
    levelNumber: 8,
    title: 'Slowloris HTTP Denial of Service Header Delimiter Flaw',
    prompt: `The Slowloris denial-of-service tool cripples threaded web servers (like Apache) by opening hundreds of connections and sending partial HTTP request headers at slow, periodic intervals:

\`\`\`text
GET / HTTP/1.1\\r\\n
Host: target.internal\\r\\n
X-a: b\\r\\n
... [Interval: 15 seconds] ...
X-c: d\\r\\n
\`\`\`

Standard HTTP requests conclude the header section with a double carriage-return line-feed sequence (\`\\r\\n\\r\\n\`). By withholding this concluding sequence, Slowloris forces the server to keep connection sockets allocated indefinitely.

What 8-character escape sequence represents the complete standard HTTP header termination delimiter?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the escape sequence).`,
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
    flag: 'HTG{\\r\\n\\r\\n}',
    hints: [
      {
        hintIndex: 1,
        content: "Two CRLF pairs: \\r\\n\\r\\n.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE57',
      seedId: 'HTG-L08-OE57',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "HTTP headers terminate with \\r\\n\\r\\n. Withholding it ties up server worker threads.",
      essentialKeyPoints: [
        "Slowloris exploits application-layer socket starvation rather than network bandwidth.",
        "Mitigation includes short header timeout policies and reverse proxy buffering."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{\\r\\n\\r\\n}' or '\\r\\n\\r\\n'.",
        partialCredit: "Submits 'CRLFCRLF' or '2 CRLF'.",
        noCredit: "Submits \\n\\n or EOF."
      },
      acceptableAlternatives: ['HTG{\\r\\n\\r\\n}', '\\r\\n\\r\\n', 'CRLFCRLF', 'crlfcrlf', 'HTG{CRLFCRLF}']
    }
  },
  {
    stableId: 'HTG-L08-OE58',
    order: 58,
    levelNumber: 8,
    title: 'Network Ingress Filtering Anti-Spoofing BCP/RFC Number',
    prompt: `To defeat IP source address spoofing in DDoS attacks, the IETF published Best Current Practice 38 (BCP 38), standardizing network ingress filtering at customer aggregation routers.

Under BCP 38, routers drop any outbound packet whose source IP address does not belong to the customer's allocated network prefix.

What decimal RFC number corresponds to BCP 38 (titled "Network Ingress Filtering: Defeating Denial of Service Attacks which employ IP Source Address Spoofing")?

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
    flag: 'HTG{2827}',
    hints: [
      {
        hintIndex: 1,
        content: "BCP 38 is RFC 2827.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE58',
      seedId: 'HTG-L08-OE58',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "RFC 2827 (BCP 38) mandates ingress filtering to prevent packets with spoofed source addresses from leaving customer networks.",
      essentialKeyPoints: [
        "BCP 38 / RFC 2827 stops IP address spoofing at the ISP edge.",
        "Unicast Reverse Path Forwarding (uRPF) is the primary router implementation of BCP 38."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2827}' or '2827'.",
        partialCredit: "Submits 'RFC 2827'.",
        noCredit: "Submits 1918 or 38."
      },
      acceptableAlternatives: ['HTG{2827}', '2827', 'RFC 2827', 'rfc 2827']
    }
  },
  {
    stableId: 'HTG-L08-OE59',
    order: 59,
    levelNumber: 8,
    title: 'SSL Stripping Tool Name by Moxie Marlinspike',
    prompt: `In 2009, security researcher Moxie Marlinspike presented a Man-in-the-Middle attack tool that transparently converts HTTPS links into cleartext HTTP links as they pass through the proxy:

\`\`\`text
Client <--- HTTP ---> Proxy (Attacker) <--- HTTPS ---> Web Server
\`\`\`

The client believes it is communicating over normal unencrypted HTTP, allowing the proxy to harvest plaintext credentials and session cookies.

What is the 9-letter name of this famous tool?

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
    flag: 'HTG{sslstrip}',
    hints: [
      {
        hintIndex: 1,
        content: "Combines ssl and strip: sslstrip.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE59',
      seedId: 'HTG-L08-OE59',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "sslstrip downgrades HTTPS connections to unencrypted HTTP by rewriting HTML links and redirects.",
      essentialKeyPoints: [
        "sslstrip exploits user reliance on HTTP 302 redirects to HTTPS.",
        "HTTP Strict Transport Security (HSTS) was created specifically to neutralize sslstrip."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{sslstrip}' or 'sslstrip'.",
        partialCredit: "Submits uppercase 'SSLSTRIP'.",
        noCredit: "Submits mitmproxy or wireshark."
      },
      acceptableAlternatives: ['HTG{sslstrip}', 'sslstrip', 'SSLSTRIP', 'HTG{SSLSTRIP}']
    }
  },
  {
    stableId: 'HTG-L08-OE60',
    order: 60,
    levelNumber: 8,
    title: 'HTTP Strict Transport Security Protocol Acronym',
    prompt: `To protect users against SSL stripping and man-in-the-middle downgrades, web servers emit a response header instructing modern browsers to communicate with the host exclusively over HTTPS for a defined duration:

\`\`\`http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

What 4-letter acronym designates HTTP Strict Transport Security?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter acronym).`,
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
    flag: 'HTG{HSTS}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for HTTP Strict Transport Security: HSTS.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE60',
      seedId: 'HTG-L08-OE60',
      subtopic: 'Network attacks, spoofing and anomalies',
      explanation: "HSTS (HTTP Strict Transport Security) forces browsers to use HTTPS, preventing sslstrip downgrade attacks.",
      essentialKeyPoints: [
        "HSTS header specifies max-age in seconds and optional preloading.",
        "Browser HSTS preload lists enforce HTTPS on the very first connection attempt."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{HSTS}' or 'HSTS'.",
        partialCredit: "Submits lowercase 'hsts'.",
        noCredit: "Submits CSP or CORS."
      },
      acceptableAlternatives: ['HTG{HSTS}', 'HSTS', 'hsts', 'HTG{hsts}']
    }
  }
];

module.exports = subtopic6Questions;
