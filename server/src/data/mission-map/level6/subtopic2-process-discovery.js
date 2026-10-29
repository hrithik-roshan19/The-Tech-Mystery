const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    stableId: 'HTG-L06-OE11',
    order: 11,
    levelNumber: 6,
    title: 'Volatility Process Tree Parent Process ID Attribution',
    prompt: `An incident responder inspects process ancestry in a memory dump using Volatility 3 (\`windows.pstree\`):

\`\`\`text
PID     PPID    ImageFileName   CreateTime
580     492     wininit.exe     2026-04-12 10:00:01
640     580     services.exe    2026-04-12 10:00:02
1024    640     svchost.exe     2026-04-12 10:00:05
4192    1024    powershell.exe  2026-04-12 10:15:30
\`\`\`

A suspicious instance of \`powershell.exe\` (PID 4192) was spawned as a child process of a generic service host.

What is the Parent Process ID (PPID) of this \`powershell.exe\` instance?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer PPID, e.g. 1024).`,
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
    flag: 'HTG{1024}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the PPID column value for powershell.exe: 1024.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE11',
      seedId: 'HTG-L06-OE11',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "Process tree analysis maps parent-child execution lineages. powershell.exe has PPID 1024 (svchost.exe), indicating execution via a compromised service or scheduled task.",
      essentialKeyPoints: [
        "Unusual parent-child relationships (e.g. svchost spawning powershell) highlight lateral movement and persistence.",
        "pstree parses EPROCESS.InheritedFromUniqueProcessId to construct hierarchy."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1024}' or '1024'.",
        partialCredit: "Submits PID 4192 instead of PPID.",
        noCredit: "Submits services.exe PID 640."
      },
      acceptableAlternatives: ['HTG{1024}', '1024']
    }
  },
  {
    stableId: 'HTG-L06-OE12',
    order: 12,
    levelNumber: 6,
    title: 'Direct Kernel Object Manipulation (DKOM) Unlinked Process Discovery',
    prompt: `A rootkit attempts to hide its process by unlinking its \`EPROCESS\` structure from the kernel's doubly-linked process list (\`ActiveProcessLinks\`).

Running \`windows.pslist\` fails to display the malicious process because it only traverses the active linked list. However, carving physical memory pool allocations using \`windows.psscan\` reveals an unlinked \`EPROCESS\` object:

\`\`\`text
Offset: 0xffff9a0184b200 | PID: 8840 | PPID: 1024 | ImageFileName: rootkit.exe | CreateTime: 2026-04-12 10:18:22
\`\`\`

What is the Process ID (PID) of this unlinked stealth process?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer PID, e.g. 8840).`,
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
    flag: 'HTG{8840}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the PID from the psscan result: 8840.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE12',
      seedId: 'HTG-L06-OE12',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "DKOM unlinks EPROCESS blocks from ActiveProcessLinks, hiding them from EnumProcesses and pslist. Pool tag scanning (psscan) discovers residual EPROCESS objects by signature.",
      essentialKeyPoints: [
        "Comparing pslist against psscan detects unlinked processes.",
        "The thread scheduler still schedules threads of unlinked processes because scheduling is thread-based (ETHREAD/KTHREAD)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{8840}' or '8840'.",
        partialCredit: "Submits PPID 1024.",
        noCredit: "Submits kernel memory offset."
      },
      acceptableAlternatives: ['HTG{8840}', '8840']
    }
  },
  {
    stableId: 'HTG-L06-OE13',
    order: 13,
    levelNumber: 6,
    title: 'Windows Service Control Manager Legitimate Parent Identification',
    prompt: `An analyst audits the process hierarchy of a critical system daemon in a memory capture:

\`\`\`text
Process: services.exe (Service Control Manager)
PID:     640
\`\`\`

Under standard Microsoft Windows operating system architecture, which specific system initialization executable is the only legitimate parent process of \`services.exe\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the executable name, e.g. wininit.exe).`,
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
    flag: 'HTG{wininit.exe}',
    hints: [
      {
        hintIndex: 1,
        content: "The parent of services.exe and lsass.exe is 'wininit.exe'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE13',
      seedId: 'HTG-L06-OE13',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "wininit.exe launches services.exe (SCM), lsass.exe (LSA), and lsaiso.exe. If services.exe has any other parent, it indicates process spoofing.",
      essentialKeyPoints: [
        "Baseline process architecture defines expected parents, paths, and instance counts.",
        "Parent-PID spoofing attempts to forge parentage using InitializeProcThreadAttributeList."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{wininit.exe}' or 'wininit.exe'.",
        partialCredit: "Submits 'wininit' without extension or uppercase 'WININIT.EXE'.",
        noCredit: "Submits smss.exe or explorer.exe."
      },
      acceptableAlternatives: ['HTG{wininit.exe}', 'wininit.exe', 'wininit', 'WININIT.EXE', 'HTG{wininit}']
    }
  },
  {
    stableId: 'HTG-L06-OE14',
    order: 14,
    levelNumber: 6,
    title: 'Typosquatting Process Name Masquerading Detection',
    prompt: `An examiner reviews running processes in a memory image and flags an anomalous typosquatted process name:

\`\`\`text
PID     PPID    ImageFileName
1024    640     svchost.exe
1088    640     svchost.exe
3912    640     scvhost.exe
\`\`\`

Adversaries frequently disguise malicious executables by swapping adjacent letters of legitimate system binaries (e.g. swapping 'c' and 'v').

Identify the exact misspelled malicious process name detected in this process table.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the executable name, e.g. scvhost.exe).`,
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
    flag: 'HTG{scvhost.exe}',
    hints: [
      {
        hintIndex: 1,
        content: "Notice the spelling: 'scvhost.exe' has 'c' before 'v'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE14',
      seedId: 'HTG-L06-OE14',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "scvhost.exe is a classic typosquatting masquerading technique designed to blend into process lists alongside legitimate svchost.exe instances.",
      essentialKeyPoints: [
        "Process masquerading preys on visual inspection in Task Manager.",
        "Automated memory tools flag known suspicious spelling deviations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{scvhost.exe}' or 'scvhost.exe'.",
        partialCredit: "Submits 'scvhost' without extension or uppercase 'SCVHOST.EXE'.",
        noCredit: "Submits legitimate name svchost.exe."
      },
      acceptableAlternatives: ['HTG{scvhost.exe}', 'scvhost.exe', 'scvhost', 'SCVHOST.EXE', 'HTG{scvhost}']
    }
  },
  {
    stableId: 'HTG-L06-OE15',
    order: 15,
    levelNumber: 6,
    title: 'Terminated Process Execution Duration Calculation',
    prompt: `Volatility 3's \`windows.pslist\` plugin displays timestamps for an ephemeral command execution shell that exited before memory acquisition:

\`\`\`text
PID:            5120
ImageFileName:  cmd.exe
CreateTime:     2026-04-10 14:00:00 UTC
ExitTime:       2026-04-10 14:05:00 UTC
\`\`\`

When a process terminates, its \`EPROCESS\` block remains in memory until all open handles are closed.

Calculate the total lifetime duration of this process in integer minutes.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 5).`,
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
    flag: 'HTG{5}',
    hints: [
      {
        hintIndex: 1,
        content: "From 14:00:00 to 14:05:00 is exactly 5 minutes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE15',
      seedId: 'HTG-L06-OE15',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "CreateTime was 14:00:00 and ExitTime was 14:05:00, giving a duration of 5 minutes.",
      essentialKeyPoints: [
        "Terminated processes with ExitTime values remain reconstructible in memory dumps.",
        "Execution duration helps determine whether a process performed interactive commands or quick scripted execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{5}' or '5'.",
        partialCredit: "Submits '5 minutes' or '5 min'.",
        noCredit: "Submits 300 (seconds without units)."
      },
      acceptableAlternatives: ['HTG{5}', '5', '5 minutes', '5 min']
    }
  },
  {
    stableId: 'HTG-L06-OE16',
    order: 16,
    levelNumber: 6,
    title: 'LSASS Process Instance Multiplicity Anomaly',
    prompt: `An auditor reviews the process table of an enterprise workstation:

\`\`\`text
PID     PPID    ImageFileName   Path
680     580     lsass.exe       C:\\Windows\\System32\\lsass.exe
4412    1024    lsass.exe       C:\\Windows\\Temp\\lsass.exe
\`\`\`

The Local Security Authority Subsystem Service (\`lsass.exe\`) authenticates users and manages security tokens.

In a normal, non-compromised Windows operating system installation, what integer count represents the maximum legitimate number of concurrently running \`lsass.exe\` instances?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 1).`,
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
    flag: 'HTG{1}',
    hints: [
      {
        hintIndex: 1,
        content: "There must only ever be exactly 1 instance of lsass.exe.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE16',
      seedId: 'HTG-L06-OE16',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "Windows architecture strictly enforces a single instance of lsass.exe running in Session 0. Multiple instances immediately indicate malware.",
      essentialKeyPoints: [
        "Single-instance system processes: lsass.exe, wininit.exe, winlogon.exe (per session).",
        "A rogue second lsass.exe is often a credential dumper or backdoor."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1}' or '1'.",
        partialCredit: "Submits text 'one'.",
        noCredit: "Submits 2."
      },
      acceptableAlternatives: ['HTG{1}', '1', 'one']
    }
  },
  {
    stableId: 'HTG-L06-OE17',
    order: 17,
    levelNumber: 6,
    title: 'Linux Initial User-Space Process Ancestor Mnemonic',
    prompt: `In Linux memory analysis using Volatility 3 (\`linux.pslist\`), all user-space processes descend directly or indirectly from the root ancestor process assigned Process ID 1.

On modern systemd-based Linux distributions, what is the process image name of this initial PID 1 daemon (e.g. systemd or init)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the name).`,
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
    flag: 'HTG{systemd}',
    hints: [
      {
        hintIndex: 1,
        content: "The init daemon on modern Linux distributions is 'systemd'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE17',
      seedId: 'HTG-L06-OE17',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "PID 1 on modern Linux is systemd (or traditional init). All user-space processes branch from PID 1.",
      essentialKeyPoints: [
        "In Linux kernel memory, task_struct chains trace back to init_task and PID 1.",
        "Reparented orphaned processes have PPID set to 1."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{systemd}' or 'systemd'.",
        partialCredit: "Submits traditional name 'init'.",
        noCredit: "Submits kernel swapper or PID 0."
      },
      acceptableAlternatives: ['HTG{systemd}', 'systemd', 'init', 'SYSTEMD', 'INIT']
    }
  },
  {
    stableId: 'HTG-L06-OE18',
    order: 18,
    levelNumber: 6,
    title: 'Windows System Services Session Zero Isolation',
    prompt: `In Windows Vista and later architectures, Session 0 Isolation mitigates shatter attacks by isolating services and background system daemons from interactive user desktop sessions.

Which integer Session ID is exclusively reserved for operating system services (e.g. services.exe, svchost.exe)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 0).`,
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
    flag: 'HTG{0}',
    hints: [
      {
        hintIndex: 1,
        content: "Session 0 is reserved exclusively for non-interactive system services.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE18',
      seedId: 'HTG-L06-OE18',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "Session 0 Isolation restricts background services to Session ID 0. Interactive user desktop sessions start at Session ID 1 and above.",
      essentialKeyPoints: [
        "Session 0 Isolation prevents malware running as a user from injecting windows messages into services.",
        "System binaries running in Session 1+ indicate malicious interactive execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'session 0'.",
        noCredit: "Submits 1."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'session 0', 'Session 0']
    }
  },
  {
    stableId: 'HTG-L06-OE19',
    order: 19,
    levelNumber: 6,
    title: 'Explorer Shell Launching Process Userinit Identification',
    prompt: `An analyst analyzes an orphaned process entry in memory:

\`\`\`text
PID:   4820
Image: explorer.exe
PPID:  3100 (Non-existent process in active process list)
\`\`\`

In Windows user logon sequencing, the user desktop shell (\`explorer.exe\`) is launched by a logon initialization executable that terminates immediately after starting the shell, leaving \`explorer.exe\` with an apparent non-existent parent PID.

What is the executable filename of this legitimate logon initialization helper process (e.g. userinit.exe)?

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
    flag: 'HTG{userinit.exe}',
    hints: [
      {
        hintIndex: 1,
        content: "The process is 'userinit.exe' (User Initialization).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE19',
      seedId: 'HTG-L06-OE19',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "userinit.exe is launched by winlogon.exe, starts explorer.exe, and exits. This legitimately causes explorer.exe to appear orphaned.",
      essentialKeyPoints: [
        "Normal Windows logon: winlogon.exe -> userinit.exe -> explorer.exe.",
        "Malware frequently hijacks the Userinit registry key for persistence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{userinit.exe}' or 'userinit.exe'.",
        partialCredit: "Submits 'userinit' without extension.",
        noCredit: "Submits winlogon.exe."
      },
      acceptableAlternatives: ['HTG{userinit.exe}', 'userinit.exe', 'userinit', 'USERINIT.EXE', 'HTG{userinit}']
    }
  },
  {
    stableId: 'HTG-L06-OE20',
    order: 20,
    levelNumber: 6,
    title: 'Suspicious Temp Directory Process PID Identification',
    prompt: `A security analyst audits the executable image paths for running processes in a memory image:

\`\`\`text
PID     PPID    ImageFileName   BinaryPath
640     580     services.exe    C:\\Windows\\System32\\services.exe
1024    640     svchost.exe     C:\\Windows\\System32\\svchost.exe
7712    1024    updater.exe     C:\\Users\\Analyst\\AppData\\Local\\Temp\\updater.exe
\`\`\`

Executables executing out of user \`Temp\` directories frequently indicate dropper or payload staging activity.

Extract the Process ID (PID) of this suspicious temporary directory executable.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer PID, e.g. 1024).`,
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
    flag: 'HTG{7712}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the PID corresponding to updater.exe: 7712.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE20',
      seedId: 'HTG-L06-OE20',
      subtopic: 'Process discovery and process-tree reconstruction',
      explanation: "updater.exe running from AppData\\Local\\Temp with PID 7712 is a classic dropper execution path.",
      essentialKeyPoints: [
        "Execution from writable user directories (Temp, Downloads, AppData) is a high-confidence threat indicator.",
        "Correlating path anomalies with parent PID 1024 highlights malicious service abuse."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{7712}' or '7712'.",
        partialCredit: "Submits image name updater.exe.",
        noCredit: "Submits PPID 1024."
      },
      acceptableAlternatives: ['HTG{7712}', '7712']
    }
  }
];

module.exports = subtopic2Questions;
