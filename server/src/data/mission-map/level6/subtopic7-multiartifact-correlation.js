const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L06-OE61',
    order: 61,
    levelNumber: 6,
    title: 'Chronological Multi-Artifact Incident Timeline Reconstruction',
    prompt: `An incident response lead correlates timeline evidence across four distinct forensic artifacts recovered from an industrial SCADA gateway:

1. [Shimcache Entry]: \`dropper.exe\` presence recorded at \`14:02:10 UTC\`
2. [Netscan Socket]: Outbound TCP connection to C2 established at \`14:05:00 UTC\`
3. [Prefetch Artifact]: \`DROPPER.EXE-1A2B.pf\` creation recorded at \`14:01:45 UTC\`
4. [USN Change Journal]: File creation record for \`dropper.exe\` logged at \`14:00:30 UTC\`

Order these four events chronologically from earliest to latest occurrence.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the hyphen-separated event numbers, or submit the hyphen-separated numbers (e.g. 1-2-3-4).`,
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
    flag: 'HTG{4-3-1-2}',
    hints: [
      {
        hintIndex: 1,
        content: "Timeline: 14:00:30 (4) -> 14:01:45 (3) -> 14:02:10 (1) -> 14:05:00 (2).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE61',
      seedId: 'HTG-L06-OE61',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "Chronological sequence: USN journal creation (14:00:30, Event 4), Prefetch execution (14:01:45, Event 3), Shimcache update (14:02:10, Event 1), Network beacon (14:05:00, Event 2). Sequence is 4-3-1-2.",
      essentialKeyPoints: [
        "Cross-correlating filesystem journals, prefetch files, shimcache, and network connections establishes incontrovertible timelines.",
        "Timelines demonstrate the progression from file drop to execution and external communication."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{4-3-1-2}' or '4-3-1-2'.",
        partialCredit: "Submits '4,3,1,2' or '4 3 1 2'.",
        noCredit: "Submits inverted or incorrect sequence."
      },
      acceptableAlternatives: ['HTG{4-3-1-2}', '4-3-1-2', '4,3,1,2', '4 3 1 2']
    }
  },
  {
    stableId: 'HTG-L06-OE62',
    order: 62,
    levelNumber: 6,
    title: 'Correlating Process Hollowing with Network C2 Activity',
    prompt: `A forensic examiner cross-references Volatility's \`windows.malfind\` and \`windows.netscan\` outputs to pinpoint the active covert channel:

\`windows.malfind\` highlights:
\`\`\`text
PID: 5020    Process: svchost.exe    Protection: PAGE_EXECUTE_READWRITE
Memory Tag: VadS (unbacked executable shellcode injection detected)
\`\`\`

\`windows.netscan\` highlights:
\`\`\`text
Offset       Proto  LocalAddr       LocalPort  ForeignAddr     ForeignPort  State        PID   Owner
0x8b010100   TCPv4  10.0.4.15       51230      198.51.100.99   443          ESTABLISHED  5020  svchost.exe
\`\`\`

Which Process ID (PID) links this injected, hollowed memory space directly to the active encrypted command and control beacon?

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
    flag: 'HTG{5020}',
    hints: [
      {
        hintIndex: 1,
        content: "Both malfind and netscan point to PID 5020.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE62',
      seedId: 'HTG-L06-OE62',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "PID 5020 connects the malfind code injection finding with the active network beacon to 198.51.100.99:443.",
      essentialKeyPoints: [
        "Adversaries hollow legitimate system processes (like svchost.exe) to disguise network connections.",
        "Correlating memory injection with socket tables uncovers the true malicious process."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{5020}' or '5020'.",
        partialCredit: "Submits 'PID 5020'.",
        noCredit: "Submits port 443 or 51230."
      },
      acceptableAlternatives: ['HTG{5020}', '5020']
    }
  },
  {
    stableId: 'HTG-L06-OE63',
    order: 63,
    levelNumber: 6,
    title: 'Lateral Movement Service Installation Event ID 7045',
    prompt: `An attacker moved laterally across internal subnets using administrative credentials. Forensic analysis of the System event log extracted from RAM yields Event ID 7045 ("A service was installed in the system"):

\`\`\`text
Event ID: 7045
Source: Service Control Manager
Service Name: PSEXESVC
Service File Name: %SystemRoot%\\PSEXESVC.exe
Service Type: user mode service
Service Start Type: demand start
Service Account: LocalSystem
\`\`\`

What is the service name (\`ServiceName\`) recorded in this event log, identifying the well-known Sysinternals lateral movement utility?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the service name).`,
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
    flag: 'HTG{PSEXESVC}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the Service Name field: PSEXESVC.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE63',
      seedId: 'HTG-L06-OE63',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "PSEXESVC is the default service installed by Sysinternals PsExec during remote command execution.",
      essentialKeyPoints: [
        "Windows Event ID 7045 logs every newly created system service.",
        "PSEXESVC indicates lateral movement using PsExec or automated tools (e.g. Impacket psexec)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PSEXESVC}' or 'PSEXESVC'.",
        partialCredit: "Submits lowercase 'psexesvc'.",
        noCredit: "Submits 7045 or LocalSystem."
      },
      acceptableAlternatives: ['HTG{PSEXESVC}', 'PSEXESVC', 'psexesvc', 'Psexesvc', 'HTG{psexesvc}']
    }
  },
  {
    stableId: 'HTG-L06-OE64',
    order: 64,
    levelNumber: 6,
    title: 'comsvcs.dll LSASS MiniDump Process Target Identification',
    prompt: `Adversaries frequently dump memory from the Local Security Authority Subsystem Service (LSASS) using built-in system binaries to evade antivirus signatures.

A carved command line from the memory buffer reveals:

\`\`\`text
rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 648 C:\\Windows\\Temp\\lsass.dmp full
\`\`\`

The \`MiniDump\` export of \`comsvcs.dll\` accepts the target process ID as its first argument.

What is the Process ID (PID) of the LSASS process targeted by this dump command?

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
    flag: 'HTG{648}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the argument immediately following MiniDump: 648.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE64',
      seedId: 'HTG-L06-OE64',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "The first parameter after MiniDump is the target process ID (648, representing lsass.exe).",
      essentialKeyPoints: [
        "comsvcs.dll MiniDump is a living-off-the-land technique (LOLBAS) for credential dumping.",
        "Carving command lines from memory exposes malicious rundll32 invocations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{648}' or '648'.",
        partialCredit: "Submits 'PID 648'.",
        noCredit: "Submits rundll32 or comsvcs.dll."
      },
      acceptableAlternatives: ['HTG{648}', '648']
    }
  },
  {
    stableId: 'HTG-L06-OE65',
    order: 65,
    levelNumber: 6,
    title: 'Detecting Timestomping via MFT $FILE_NAME vs $STANDARD_INFO',
    prompt: `An adversary timestomps a malicious tool (\`trojan.exe\`) to blend into legitimate system folders. An examiner compares timestamps across NTFS attributes and Prefetch metadata:

\`\`\`text
MFT Record for trojan.exe:
  $STANDARD_INFORMATION Created: 2019-01-15 08:30:00 UTC
  $FILE_NAME Created:            2026-10-20 16:45:12 UTC

Prefetch Artifact (TROJAN.EXE-7C8D.pf):
  Initial Creation Timestamp:    2026-10-20 16:46:00 UTC
\`\`\`

User-space APIs like \`SetFileTime\` alter \`$STANDARD_INFORMATION\` timestamps, but cannot modify kernel-managed \`$FILE_NAME\` timestamps.

What is the true 4-digit calendar year in which this malicious binary was actually created and introduced to the system?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-digit year).`,
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
    flag: 'HTG{2026}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the $FILE_NAME and Prefetch year: 2026.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE65',
      seedId: 'HTG-L06-OE65',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "Timestomping alters $STANDARD_INFORMATION (falsified to 2019), but $FILE_NAME and Prefetch preserve the authentic creation year 2026.",
      essentialKeyPoints: [
        "$FILE_NAME timestamps are modified only by the Windows kernel during file moves or renames.",
        "Comparing $STANDARD_INFORMATION with $FILE_NAME exposes timestamp falsification (timestomping)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2026}' or '2026'.",
        partialCredit: "Submits 'Year 2026'.",
        noCredit: "Submits falsified year 2019."
      },
      acceptableAlternatives: ['HTG{2026}', '2026']
    }
  },
  {
    stableId: 'HTG-L06-OE66',
    order: 66,
    levelNumber: 6,
    title: 'Staging Archive Carved from File System Journal',
    prompt: `To prepare extracted intellectual property for exfiltration, an attacker used command-line archiving utilities. Carving the command history and NTFS journal records identifies the staging command:

\`\`\`text
rar.exe a -hpSecretPass -r C:\\ProgramData\\staging_data.rar C:\\Confidential\\*
\`\`\`

What is the filename (including the \`.rar\` extension) of the encrypted staging archive created by the attacker?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the filename).`,
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
    flag: 'HTG{staging_data.rar}',
    hints: [
      {
        hintIndex: 1,
        content: "The archive name is staging_data.rar.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE66',
      seedId: 'HTG-L06-OE66',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "The command creates an encrypted RAR archive named staging_data.rar in C:\\ProgramData.",
      essentialKeyPoints: [
        "Data staging into password-protected archives (RAR, 7z, ZIP) is a standard exfiltration precursor.",
        "Command arguments reveal both the staging path and encryption passwords."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{staging_data.rar}' or 'staging_data.rar'.",
        partialCredit: "Submits 'staging_data' without extension.",
        noCredit: "Submits rar.exe or SecretPass."
      },
      acceptableAlternatives: ['HTG{staging_data.rar}', 'staging_data.rar', 'staging_data', 'STAGING_DATA.RAR']
    }
  },
  {
    stableId: 'HTG-L06-OE67',
    order: 67,
    levelNumber: 6,
    title: 'Persistence via Scheduled Task Name Extraction',
    prompt: `During triage of persistence mechanisms, an analyst recovers an XML task definition registered under \`C:\\Windows\\System32\\Tasks\`:

\`\`\`xml
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <URI>\\GridHealthTelemetry</URI>
  </RegistrationInfo>
  <Actions Context="Author">
    <Exec>
      <Command>C:\\ProgramData\\telemetry_agent.exe</Command>
    </Exec>
  </Actions>
</Task>
\`\`\`

What is the task name URI (omitting the leading backslash) assigned to this persistence scheduled task?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the task name).`,
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
    flag: 'HTG{GridHealthTelemetry}',
    hints: [
      {
        hintIndex: 1,
        content: "Check the URI element: GridHealthTelemetry.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE67',
      seedId: 'HTG-L06-OE67',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "The task name is GridHealthTelemetry, used to trigger telemetry_agent.exe persistently.",
      essentialKeyPoints: [
        "Scheduled tasks stored in C:\\Windows\\System32\\Tasks provide persistence across reboots.",
        "Task XML schemas specify triggers, security principals, and executable actions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GridHealthTelemetry}' or 'GridHealthTelemetry'.",
        partialCredit: "Submits lowercase 'gridhealthtelemetry'.",
        noCredit: "Submits telemetry_agent.exe."
      },
      acceptableAlternatives: ['HTG{GridHealthTelemetry}', 'GridHealthTelemetry', 'gridhealthtelemetry', 'HTG{gridhealthtelemetry}']
    }
  },
  {
    stableId: 'HTG-L06-OE68',
    order: 68,
    levelNumber: 6,
    title: 'PowerShell Defender Exclusion Path Identification',
    prompt: `To prevent host endpoint security from quarantining malware components, an attacker executed an exclusion command via administrative PowerShell:

\`\`\`powershell
powershell.exe -Command "Add-MpPreference -ExclusionPath 'C:\\Exclusions\\Payload'"
\`\`\`

What full directory path was added to the Microsoft Defender exclusion list?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the folder path).`,
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
    flag: 'HTG{C:\\Exclusions\\Payload}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the ExclusionPath parameter value: C:\\Exclusions\\Payload.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE68',
      seedId: 'HTG-L06-OE68',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "Add-MpPreference -ExclusionPath 'C:\\Exclusions\\Payload' disables antivirus scanning for that directory.",
      essentialKeyPoints: [
        "Antivirus exclusions are a defense evasion technique (MITRE ATT&CK T1562.001).",
        "Defender exclusions are recorded in the registry under HKLM\\SOFTWARE\\Microsoft\\Windows Defender\\Exclusions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{C:\\Exclusions\\Payload}' or 'C:\\Exclusions\\Payload'.",
        partialCredit: "Submits 'C:/Exclusions/Payload' or lowercase.",
        noCredit: "Submits Add-MpPreference."
      },
      acceptableAlternatives: ['HTG{C:\\Exclusions\\Payload}', 'C:\\Exclusions\\Payload', 'c:\\exclusions\\payload', 'C:/Exclusions/Payload', 'HTG{c:\\exclusions\payload}']
    }
  },
  {
    stableId: 'HTG-L06-OE69',
    order: 69,
    levelNumber: 6,
    title: 'Windows Defender Antivirus Threat Detection Event ID 1116',
    prompt: `An incident responder inspects the Windows Defender operational event log (\`Microsoft-Windows-Windows Defender/Operational\`) recovered from memory. Event ID 1116 records a malware detection:

\`\`\`text
Event ID:     1116
Source:       Microsoft-Windows-Windows Defender
Threat Name:  VirTool:Win32/Meterpreter.gen!D
Severity:     Severe
Path:         file:_C:\\Users\\Target\\Downloads\\payload.exe
Origin:       Local machine
\`\`\`

What well-known post-exploitation payload family name is identified in this threat signature?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the payload family name).`,
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
    flag: 'HTG{Meterpreter}',
    hints: [
      {
        hintIndex: 1,
        content: "The signature identifies VirTool:Win32/Meterpreter.gen!D.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE69',
      seedId: 'HTG-L06-OE69',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "The threat name identifies the Metasploit Meterpreter payload family.",
      essentialKeyPoints: [
        "Event ID 1116 logs malware detection events in Windows Defender.",
        "Recognizing canonical malware and tool signatures expedites incident classification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Meterpreter}' or 'Meterpreter'.",
        partialCredit: "Submits lowercase 'meterpreter' or 'METERPRETER'.",
        noCredit: "Submits 1116 or VirTool."
      },
      acceptableAlternatives: ['HTG{Meterpreter}', 'Meterpreter', 'meterpreter', 'METERPRETER', 'HTG{meterpreter}']
    }
  },
  {
    stableId: 'HTG-L06-OE70',
    order: 70,
    levelNumber: 6,
    title: 'Master Forensics Reconstruction Token',
    prompt: `The digital forensics team completes a full multi-artifact reconstruction of the Level 6 intrusion:
- Phase 1: Live physical memory acquisition verified via SHA-256 hash
- Phase 2: Process tree mapped, isolating hidden and orphaned processes
- Phase 3: Injected code and unbacked RWX VAD allocations triaged
- Phase 4: Network sockets and encrypted C2 endpoints correlated
- Phase 5: Command lines and environment variables recovered
- Phase 6: NTFS MFT records, prefetch counters, and USN journals parsed
- Phase 7: Incident chronology assembled from drop to persistence

Upon corroborating all digital artifacts, the lead investigator signs off on the official incident clearance token:

MEMORY_ARTIFACTS_ACQUIRED

Submit the completed memory artifacts forensic investigation token in standard competition flag format.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the token string (or submit the token string directly).`,
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
    flag: 'HTG{MEMORY_ARTIFACTS_ACQUIRED}',
    hints: [
      {
        hintIndex: 1,
        content: "Prefix HTG with curly braces enclosing MEMORY_ARTIFACTS_ACQUIRED.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE70',
      seedId: 'HTG-L06-OE70',
      subtopic: 'Multi-artifact forensic correlation and incident reconstruction',
      explanation: "Completes the Level 6 memory artifacts forensics track with the master investigation token.",
      essentialKeyPoints: [
        "Multi-artifact correlation links volatile RAM artifacts with persistent filesystem evidence.",
        "Forensic evidence must be verified end-to-end to withstand legal and technical review."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{MEMORY_ARTIFACTS_ACQUIRED}' or 'MEMORY_ARTIFACTS_ACQUIRED'.",
        partialCredit: "Submits lowercase 'memory_artifacts_acquired'.",
        noCredit: "Submits incomplete or misspelled token."
      },
      acceptableAlternatives: ['HTG{MEMORY_ARTIFACTS_ACQUIRED}', 'MEMORY_ARTIFACTS_ACQUIRED', 'memory_artifacts_acquired', 'HTG{memory_artifacts_acquired}']
    }
  }
];

module.exports = subtopic7Questions;
