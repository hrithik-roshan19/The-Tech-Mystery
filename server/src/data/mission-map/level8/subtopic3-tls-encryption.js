const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L08-OE21',
    order: 21,
    levelNumber: 8,
    title: 'TLS Server Name Indication Extension Acronym',
    prompt: `When a web browser connects to a shared hosting environment hosting multiple HTTPS websites on a single IP address, the client must indicate which virtual host it wishes to communicate with during the initial TLS handshake.

This domain name is transmitted in cleartext within an extension field of the TLS \`Client Hello\` frame before any encrypted channel is established.

What 3-letter acronym designates this Server Name Indication extension?

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
    flag: 'HTG{SNI}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Server Name Indication: SNI.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE21',
      seedId: 'HTG-L08-OE21',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "SNI (Server Name Indication) exposes the target hostname in the TLS Client Hello before encryption starts.",
      essentialKeyPoints: [
        "SNI enables virtual hosting for TLS endpoints on shared IP addresses.",
        "Network monitoring tools inspect SNI to classify encrypted web sessions without breaking TLS."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SNI}' or 'SNI'.",
        partialCredit: "Submits lowercase 'sni'.",
        noCredit: "Submits SAN or ALPN."
      },
      acceptableAlternatives: ['HTG{SNI}', 'SNI', 'sni', 'HTG{sni}']
    }
  },
  {
    stableId: 'HTG-L08-OE22',
    order: 22,
    levelNumber: 8,
    title: 'TLS Client Hello server_name Extension Type Code',
    prompt: `In the IANA Transport Layer Security (TLS) Extensions registry, each extension included in the Client Hello or Server Hello contains a 16-bit numeric type identifier:

- \`server_name\`: [Extension Type Identifier]
- \`status_request\`: \`5\`
- \`supported_groups\`: \`10\`
- \`alpn\`: \`16\`

What decimal integer identifier is officially assigned as the extension type code for \`server_name\` (SNI)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer type code).`,
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
        content: "server_name is the very first registered TLS extension, with type code 0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE22',
      seedId: 'HTG-L08-OE22',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "Extension type 0 (0x0000) corresponds to server_name in the IANA TLS ExtensionType registry.",
      essentialKeyPoints: [
        "Extension type 0 defines server_name in TLS Client Hello frames.",
        "Parsing extension type 0 extracts the server host name during packet analysis."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits '0x0000' or 'zero'.",
        noCredit: "Submits 1 or 16."
      },
      acceptableAlternatives: ['HTG{0}', '0', '0x0000', 'zero']
    }
  },
  {
    stableId: 'HTG-L08-OE23',
    order: 23,
    levelNumber: 8,
    title: 'X.509 Certificate Subject Alternative Name Acronym',
    prompt: `During digital forensics of an encrypted C2 channel, the investigator extracts an X.509 server certificate presented in a TLS handshake.

While older certificates relied strictly on the Subject Common Name (\`CN\`), modern web standards mandate listing all valid domains and IP addresses in a specific X.509 v3 extension field.

What 3-letter acronym designates this Subject Alternative Name extension?

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
    flag: 'HTG{SAN}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Subject Alternative Name: SAN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE23',
      seedId: 'HTG-L08-OE23',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "SAN (Subject Alternative Name) specifies all valid domains, subdomains, and IP addresses for the certificate.",
      essentialKeyPoints: [
        "Modern TLS clients require hostnames to match an entry in the SAN list.",
        "Extracting SAN entries from certificates reveals hidden infrastructure and domain relationships."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SAN}' or 'SAN'.",
        partialCredit: "Submits lowercase 'san'.",
        noCredit: "Submits CN or SNI."
      },
      acceptableAlternatives: ['HTG{SAN}', 'SAN', 'san', 'HTG{san}']
    }
  },
  {
    stableId: 'HTG-L08-OE24',
    order: 24,
    levelNumber: 8,
    title: 'TLS Client Fingerprinting Method Acronym',
    prompt: `Network defenders fingerprint TLS client software (such as malware agents, script libraries, or standard browsers) by concatenating client-side handshake parameters into an ordered string:

\`\`\`text
SSLVersion,CipherSuites,Extensions,EllipticCurves,PointFormats
\`\`\`

The resulting string is MD5-hashed to produce a 32-character fingerprint that remains consistent regardless of the target IP address or SNI hostname.

What 3-character acronym designates this Salesforce-developed TLS client fingerprinting standard?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the acronym).`,
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
    flag: 'HTG{JA3}',
    hints: [
      {
        hintIndex: 1,
        content: "The fingerprint standard is named JA3 (and JA3S for servers).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE24',
      seedId: 'HTG-L08-OE24',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "JA3 fingerprints TLS clients by hashing their Client Hello cipher and extension parameters.",
      essentialKeyPoints: [
        "JA3 signatures identify malware tools (like Cobalt Strike) across diverse destination domains.",
        "JA3 hashes remain stable across connections regardless of encryption."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{JA3}' or 'JA3'.",
        partialCredit: "Submits lowercase 'ja3'.",
        noCredit: "Submits MD5 or SHA256."
      },
      acceptableAlternatives: ['HTG{JA3}', 'JA3', 'ja3', 'HTG{ja3}']
    }
  },
  {
    stableId: 'HTG-L08-OE25',
    order: 25,
    levelNumber: 8,
    title: 'TLS Record Layer Content Type for Handshake Messages',
    prompt: `In the Transport Layer Security (TLS) Record Layer protocol, each record header begins with a 1-byte \`Content Type\` field:

- \`20\` (\`0x14\`): Change Cipher Spec
- \`21\` (\`0x15\`): Alert
- [Content Type]: Handshake
- \`23\` (\`0x17\`): Application Data

What decimal integer represents a Handshake record (enclosing Client Hello, Server Hello, and Certificates)?

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
    flag: 'HTG{22}',
    hints: [
      {
        hintIndex: 1,
        content: "Decimal 22 corresponds to hex 0x16.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE25',
      seedId: 'HTG-L08-OE25',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "Content Type 22 (0x16) specifies TLS Handshake protocol messages.",
      essentialKeyPoints: [
        "TLS Record Layer prefixes all records with a 1-byte Content Type.",
        "Wireshark display filter 'tls.record.content_type == 22' isolates all handshake packets."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{22}' or '22'.",
        partialCredit: "Submits '0x16'.",
        noCredit: "Submits 20 or 23."
      },
      acceptableAlternatives: ['HTG{22}', '22', '0x16']
    }
  },
  {
    stableId: 'HTG-L08-OE26',
    order: 26,
    levelNumber: 8,
    title: 'Application-Layer Protocol Negotiation Acronym',
    prompt: `During a TLS handshake, the client and server negotiate which higher-layer application protocol will be used over the encrypted connection without requiring extra network round trips.

This is accomplished using a TLS extension where the client advertises a priority list of supported protocols (such as \`h2\` or \`http/1.1\`).

What 4-letter acronym designates Application-Layer Protocol Negotiation?

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
    flag: 'HTG{ALPN}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Application-Layer Protocol Negotiation: ALPN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE26',
      seedId: 'HTG-L08-OE26',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "ALPN (Application-Layer Protocol Negotiation) allows the application protocol selection within the TLS handshake.",
      essentialKeyPoints: [
        "ALPN eliminates the round trip required for HTTP/1.1 Upgrade negotiation.",
        "ALPN strings like 'h2' confirm the connection utilizes HTTP/2."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ALPN}' or 'ALPN'.",
        partialCredit: "Submits lowercase 'alpn'.",
        noCredit: "Submits NPN or SNI."
      },
      acceptableAlternatives: ['HTG{ALPN}', 'ALPN', 'alpn', 'HTG{alpn}']
    }
  },
  {
    stableId: 'HTG-L08-OE27',
    order: 27,
    levelNumber: 8,
    title: 'ALPN Protocol String for HTTP/2 Over TLS',
    prompt: `In the TLS Application-Layer Protocol Negotiation (ALPN) extension, standard protocol identification strings are registered with IANA.

While HTTP/1.1 is identified by the ASCII string \`http/1.1\`, what 2-character string token designates HTTP/2 over TLS?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-character string).`,
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
    flag: 'HTG{h2}',
    hints: [
      {
        hintIndex: 1,
        content: "The 2-character token is 'h2'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE27',
      seedId: 'HTG-L08-OE27',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "'h2' represents HTTP/2 over TLS in the ALPN registry, whereas 'h2c' denotes cleartext HTTP/2.",
      essentialKeyPoints: [
        "ALPN token 'h2' informs the server to handle multiplexed binary framing.",
        "Seeing 'h2' in ALPN indicates HTTP/2 streaming."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{h2}' or 'h2'.",
        partialCredit: "Submits uppercase 'H2'.",
        noCredit: "Submits http2 or spdy."
      },
      acceptableAlternatives: ['HTG{h2}', 'h2', 'H2', 'HTG{H2}']
    }
  },
  {
    stableId: 'HTG-L08-OE28',
    order: 28,
    levelNumber: 8,
    title: 'Standard HTTPS Destination TCP Port',
    prompt: `Secure HTTP traffic (HTTP over TLS/SSL) is assigned a dedicated well-known TCP port number according to standard IANA port allocations.

What decimal integer represents this standard HTTPS port?

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
    flag: 'HTG{443}',
    hints: [
      {
        hintIndex: 1,
        content: "HTTP is port 80; HTTPS is port 443.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE28',
      seedId: 'HTG-L08-OE28',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "Port 443 is the standard well-known port for HTTPS web traffic.",
      essentialKeyPoints: [
        "Standard HTTPS communicates over TCP port 443.",
        "Non-TLS traffic discovered on port 443 indicates tunneling or protocol evasion."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{443}' or '443'.",
        partialCredit: "Submits 'port 443'.",
        noCredit: "Submits 80 or 8443."
      },
      acceptableAlternatives: ['HTG{443}', '443']
    }
  },
  {
    stableId: 'HTG-L08-OE29',
    order: 29,
    levelNumber: 8,
    title: 'Diffie-Hellman Ephemeral Key Exchange Security Property',
    prompt: `In modern cipher suites (such as \`ECDHE-RSA-AES128-GCM-SHA256\` and TLS 1.3), key exchange uses Ephemeral Diffie-Hellman rather than static RSA key transport.

This cryptographic architecture ensures that even if an adversary records all encrypted network traffic and subsequently compromises the server's long-term private key in the future, past recorded sessions cannot be retroactively decrypted.

What hyphenated term names this essential cryptographic property?

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
    flag: 'HTG{forward-secrecy}',
    hints: [
      {
        hintIndex: 1,
        content: "Often called Perfect Forward Secrecy: forward-secrecy.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE29',
      seedId: 'HTG-L08-OE29',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "Forward secrecy (PFS) ensures that compromise of private keys does not expose previously recorded session keys.",
      essentialKeyPoints: [
        "Ephemeral key exchange generates unique per-session keys discarded after session close.",
        "TLS 1.3 mandates forward-secure key exchange, removing static RSA key transport."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{forward-secrecy}' or 'forward-secrecy'.",
        partialCredit: "Submits 'forward secrecy' or 'PFS'.",
        noCredit: "Submits confidentiality or integrity."
      },
      acceptableAlternatives: ['HTG{forward-secrecy}', 'forward-secrecy', 'forward secrecy', 'PFS', 'HTG{PFS}', 'HTG{forward secrecy}']
    }
  },
  {
    stableId: 'HTG-L08-OE30',
    order: 30,
    levelNumber: 8,
    title: 'OpenSSL TLS Heartbeat Extension Vulnerability Nickname',
    prompt: `In 2014, a critical vulnerability (CVE-2014-0160) was disclosed in OpenSSL's implementation of the TLS Heartbeat extension (RFC 6520).

Missing bounds validation allowed remote attackers to send a small heartbeat payload with a falsified 16-bit length field, causing the server to return up to 64 kilobytes of adjacent process memory, leaking private keys, passwords, and session tokens.

What popular brand/nickname was assigned to this vulnerability?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the vulnerability nickname).`,
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
    flag: 'HTG{Heartbleed}',
    hints: [
      {
        hintIndex: 1,
        content: "The nickname combines Heart and bleed: Heartbleed.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L08-OE30',
      seedId: 'HTG-L08-OE30',
      subtopic: 'Encrypted traffic, TLS/SSL and certificates',
      explanation: "Heartbleed (CVE-2014-0160) allowed memory reading via unchecked TLS Heartbeat payload length fields.",
      essentialKeyPoints: [
        "Heartbleed was caused by buffer over-read in TLS heartbeat echo processing.",
        "Demonstrated how extension implementation flaws can breach cryptographic boundary isolation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Heartbleed}' or 'Heartbleed'.",
        partialCredit: "Submits lowercase 'heartbleed'.",
        noCredit: "Submits CVE-2014-0160."
      },
      acceptableAlternatives: ['HTG{Heartbleed}', 'Heartbleed', 'heartbleed', 'HTG{heartbleed}']
    }
  }
];

module.exports = subtopic3Questions;

