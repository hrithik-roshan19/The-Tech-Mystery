const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L10-OE51',
    order: 51,
    levelNumber: 10,
    title: 'MITRE ATT&CK Adversary TTP Knowledge Base Framework',
    prompt: `To correlate threat behaviors across all phases of the attack chain, cyber defenders map adversary actions to a standardized matrix of tactics, techniques, and procedures (TTPs).

What 6-letter acronym (often written with an ampersand: ATT&CK) designates this globally accessible knowledge base curated by the MITRE Corporation?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the acronym).`,
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
    flag: 'HTG{ATT&CK}',
    hints: [
      {
        hintIndex: 1,
        content: "The framework is MITRE ATT&CK.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE51',
      seedId: 'HTG-L10-OE51',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "MITRE ATT&CK classifies real-world cyber adversary behaviors into structured tactics and techniques.",
      essentialKeyPoints: [
        "ATT&CK spans Initial Access, Execution, Persistence, Privilege Escalation, through Exfiltration.",
        "Incident correlation maps timeline evidence to ATT&CK technique IDs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ATT&CK}' or 'ATT&CK'.",
        partialCredit: "Submits 'ATTCK' or 'MITRE ATT&CK'.",
        noCredit: "Submits NIST or OWASP."
      },
      acceptableAlternatives: ['HTG{ATT&CK}', 'ATT&CK', 'ATTCK', 'MITRE ATT&CK', 'mitre att&ck', 'HTG{ATTCK}']
    }
  },
  {
    stableId: 'HTG-L10-OE52',
    order: 52,
    levelNumber: 10,
    title: 'MITRE ATT&CK Initial Access Tactic Identifier',
    prompt: `Within the MITRE ATT&CK Enterprise Matrix, each overarching tactical objective is designated by a standardized tactic identifier beginning with \`TA\` followed by four digits.

What is the 6-character identifier for the first tactic in the matrix: \`Initial Access\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 6-character ID).`,
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
    flag: 'HTG{TA0001}',
    hints: [
      {
        hintIndex: 1,
        content: "Initial Access is tactic TA0001.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE52',
      seedId: 'HTG-L10-OE52',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "TA0001 is the MITRE ATT&CK tactic ID for Initial Access.",
      essentialKeyPoints: [
        "Initial Access techniques include Phishing (T1566), Exploit Public-Facing Application (T1190), and Supply Chain (T1195).",
        "Level 1 and 2 artifacts map directly to TA0001."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TA0001}' or 'TA0001'.",
        partialCredit: "Submits lowercase 'ta0001'.",
        noCredit: "Submits TA0002."
      },
      acceptableAlternatives: ['HTG{TA0001}', 'TA0001', 'ta0001', 'HTG{ta0001}']
    }
  },
  {
    stableId: 'HTG-L10-OE53',
    order: 53,
    levelNumber: 10,
    title: 'Windows Security Successful Logon Audit Event Identifier',
    prompt: `In Windows enterprise event log correlation, security operations teams audit authentication attempts recorded in the \`Security.evtx\` log channel.

What 4-digit Event ID indicates that a user account was successfully logged on (including Logon Type 2 interactive, Type 3 network, and Type 10 RDP)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer Event ID).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{4624}',
    hints: [
      {
        hintIndex: 1,
        content: "Event ID 4624 records successful logons (4625 records failures).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE53',
      seedId: 'HTG-L10-OE53',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "Windows Event ID 4624 logs all successful logon events.",
      essentialKeyPoints: [
        "Logon Type 3 indicates network logon via SMB/RPC (common in lateral movement).",
        "Correlating 4624 records maps the adversary's lateral traversal across internal endpoints."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{4624}' or '4624'.",
        partialCredit: "Submits 'Event 4624'.",
        noCredit: "Submits 4625 or 4688."
      },
      acceptableAlternatives: ['HTG{4624}', '4624', 'Event 4624', 'HTG{Event 4624}']
    }
  },
  {
    stableId: 'HTG-L10-OE54',
    order: 54,
    levelNumber: 10,
    title: 'PsExec Lateral Movement Named Pipe Identifier',
    prompt: `In investigating administrative lateral movement across Windows domains, Sysinternals PsExec (and its open-source Impacket equivalents) creates an in-memory service executable on the remote host.

Communication between the local client and remote service is coordinated over a named pipe accessed through the \`IPC$\` SMB share.

What standard pipe name (commonly \`psexec\` or \`psexecsvc\`) identifies this execution communication conduit?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the pipe name).`,
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
    flag: 'HTG{psexec}',
    hints: [
      {
        hintIndex: 1,
        content: "The named pipe is psexec (or psexecsvc).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE54',
      seedId: 'HTG-L10-OE54',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "PsExec connects to the remote IPC$ share and establishes the named pipe 'psexec' (or 'psexecsvc').",
      essentialKeyPoints: [
        "Monitoring named pipe connections reveals remote execution tools.",
        "Impacket's psexec.py mimics this named pipe behavior."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{psexec}' or 'psexec'.",
        partialCredit: "Submits 'psexecsvc' or 'PsExec'.",
        noCredit: "Submits spoolss or lsarpc."
      },
      acceptableAlternatives: ['HTG{psexec}', 'psexec', 'psexecsvc', 'PsExec', 'PSEXEC', 'HTG{psexecsvc}']
    }
  },
  {
    stableId: 'HTG-L10-OE55',
    order: 55,
    levelNumber: 10,
    title: 'Kerberoasting Ticket Granting Service Request Type',
    prompt: `In Active Directory privilege escalation and credential extraction, Kerberoasting requests Kerberos ticket-granting service (TGS) tickets for service accounts associated with Service Principal Names (SPNs).

The returned tickets are encrypted with the service account's NTLM password hash, which can be extracted from memory and cracked offline.

What 7-character uppercase acronym designates this Kerberos Ticket Granting Service Request packet type?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the request type).`,
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
    flag: 'HTG{TGS-REQ}',
    hints: [
      {
        hintIndex: 1,
        content: "The request type is TGS-REQ (in contrast to AS-REQ).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE55',
      seedId: 'HTG-L10-OE55',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "TGS-REQ requests service tickets that carry RC4/AES encrypted hashes targeted in Kerberoasting.",
      essentialKeyPoints: [
        "Kerberoasting requires valid domain credentials to solicit TGS-REQs.",
        "Event ID 4769 logs Kerberos ticket requests with SPN names."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TGS-REQ}' or 'TGS-REQ'.",
        partialCredit: "Submits 'TGS' or lowercase 'tgs-req'.",
        noCredit: "Submits AS-REQ."
      },
      acceptableAlternatives: ['HTG{TGS-REQ}', 'TGS-REQ', 'tgs-req', 'TGS', 'tgs', 'HTG{TGS}']
    }
  },
  {
    stableId: 'HTG-L10-OE56',
    order: 56,
    levelNumber: 10,
    title: 'Sysmon Process Creation Event Identifier',
    prompt: `In Microsoft Sysmon (System Monitor) host telemetry, endpoint detection relies heavily on process telemetry to reconstruct command execution trees and identify malicious command-line arguments.

Which integer Event ID is assigned by Sysmon to log Process Creation events?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer Event ID).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{1}',
    hints: [
      {
        hintIndex: 1,
        content: "Sysmon Event ID 1 is Process Creation.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE56',
      seedId: 'HTG-L10-OE56',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "Sysmon Event ID 1 captures detailed process creation events including parent PID, user, and command line.",
      essentialKeyPoints: [
        "Sysmon 1 provides richer metadata than native Windows Security Event 4688.",
        "Process creation trees expose parent-child anomalies (e.g. word.exe spawning cmd.exe)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1}' or '1'.",
        partialCredit: "Submits 'one'.",
        noCredit: "Submits 4688 or 3."
      },
      acceptableAlternatives: ['HTG{1}', '1', 'one', 'HTG{one}']
    }
  },
  {
    stableId: 'HTG-L10-OE57',
    order: 57,
    levelNumber: 10,
    title: 'Living off the Land Binaries (LOLBins) Classification',
    prompt: `Modern adversaries frequently bypass signature-based application whitelisting by weaponizing pre-installed, trusted operating system executables (such as \`certutil.exe\`, \`powershell.exe\`, \`bitsadmin.exe\`, and \`rundll32.exe\`) to download payloads and execute code.

What 7-letter acronym designates these Living off the Land Binaries?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the acronym).`,
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
    flag: 'HTG{LOLBins}',
    hints: [
      {
        hintIndex: 1,
        content: "Living off the Land Binaries are called LOLBins (or LOLBAS).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE57',
      seedId: 'HTG-L10-OE57',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "LOLBins refers to legitimate administrative binaries abused for malicious objectives.",
      essentialKeyPoints: [
        "LOLBAS (Living Off The Land Binaries and Scripts) documents dual-use executables.",
        "Abusing trusted signed binaries avoids detection by basic AV engines."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{LOLBins}' or 'LOLBins'.",
        partialCredit: "Submits 'LOLBAS' or 'lolbins'.",
        noCredit: "Submits rootkit or trojan."
      },
      acceptableAlternatives: ['HTG{LOLBins}', 'LOLBins', 'lolbins', 'LOLBAS', 'lolbas', 'HTG{lolbins}']
    }
  },
  {
    stableId: 'HTG-L10-OE58',
    order: 58,
    levelNumber: 10,
    title: 'Pass-the-Hash Challenge-Response Protocol (NTLM)',
    prompt: `In the classic Pass-the-Hash (PtH) lateral movement technique, an attacker authenticates to remote Windows services using a captured password hash directly without needing to crack the cleartext password.

Which legacy challenge-response authentication protocol (abbreviated in 4 letters) accepts this pre-computed MD4 hash for user authentication?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter protocol name).`,
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
    flag: 'HTG{NTLM}',
    hints: [
      {
        hintIndex: 1,
        content: "The protocol is NTLM (NT LAN Manager).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE58',
      seedId: 'HTG-L10-OE58',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "NTLM authenticates using MD4 password hashes, enabling Pass-the-Hash lateral movement.",
      essentialKeyPoints: [
        "Pass-the-Hash bypasses password complexity requirements.",
        "Enforcing Kerberos with Restricted Admin mode mitigates NTLM PtH exposure."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{NTLM}' or 'NTLM'.",
        partialCredit: "Submits lowercase 'ntlm'.",
        noCredit: "Submits Kerberos or RADIUS."
      },
      acceptableAlternatives: ['HTG{NTLM}', 'NTLM', 'ntlm', 'HTG{ntlm}']
    }
  },
  {
    stableId: 'HTG-L10-OE59',
    order: 59,
    levelNumber: 10,
    title: 'MITRE ATT&CK Protocol Tunneling Technique Identifier',
    prompt: `In correlating the adversary's command-and-control and exfiltration operations, analysts classify covert encapsulation methods (such as DNS tunneling and SSH dynamic port forwarding).

Within the MITRE ATT&CK Enterprise Matrix, what is the 5-character Technique ID (beginning with \`T\` followed by four digits) for \`Protocol Tunneling\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 5-character ID).`,
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
    flag: 'HTG{T1572}',
    hints: [
      {
        hintIndex: 1,
        content: "Protocol Tunneling is technique T1572.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE59',
      seedId: 'HTG-L10-OE59',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "T1572 is the MITRE ATT&CK technique identifier for Protocol Tunneling.",
      essentialKeyPoints: [
        "T1572 covers tunnels over HTTP, SSH, DNS, and ICMP.",
        "Correlating network and host artifacts validates T1572."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{T1572}' or 'T1572'.",
        partialCredit: "Submits lowercase 't1572'.",
        noCredit: "Submits T1071."
      },
      acceptableAlternatives: ['HTG{T1572}', 'T1572', 't1572', 'HTG{t1572}']
    }
  },
  {
    stableId: 'HTG-L10-OE60',
    order: 60,
    levelNumber: 10,
    title: 'Unified Master Incident Attribution Code',
    prompt: `An incident response commander correlates evidence across all nine operational levels (radio signals, web clients, cryptographic ciphers, Git OSINT, compiled binaries, memory dumps, stack overflows, network tunnels, and polyalphabetic steganography) to form the unified attribution code:
\`\`\`text
INCIDENT_ATTRIBUTION_CITADEL_2026
\`\`\`
What is the complete competition flag for this unified master incident attribution code?

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
    flag: 'HTG{INCIDENT_ATTRIBUTION_CITADEL_2026}',
    hints: [
      {
        hintIndex: 1,
        content: "Prefix INCIDENT_ATTRIBUTION_CITADEL_2026 with HTG{...}.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE60',
      seedId: 'HTG-L10-OE60',
      subtopic: 'Full-spectrum incident chain correlation',
      explanation: "The unified incident attribution code is 'INCIDENT_ATTRIBUTION_CITADEL_2026'.",
      essentialKeyPoints: [
        "Unifies timeline evidence across all host, network, and reverse engineering tracks.",
        "Supplies the sixth sub-key leading into the Master Citadel core."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{INCIDENT_ATTRIBUTION_CITADEL_2026}'.",
        partialCredit: "Submits 'INCIDENT_ATTRIBUTION_CITADEL_2026' without curly braces.",
        noCredit: "Submits partial string."
      },
      acceptableAlternatives: [
        'HTG{INCIDENT_ATTRIBUTION_CITADEL_2026}',
        'INCIDENT_ATTRIBUTION_CITADEL_2026',
        'incident_attribution_citadel_2026',
        'HTG{incident_attribution_citadel_2026}'
      ]
    }
  }
];

module.exports = subtopic6Questions;

