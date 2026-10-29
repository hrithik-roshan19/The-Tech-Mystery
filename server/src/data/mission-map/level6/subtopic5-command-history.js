const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L06-OE41',
    order: 41,
    levelNumber: 6,
    title: 'Volatility windows.cmdline Command Argument Extraction',
    prompt: `An investigator runs the Volatility 3 \`windows.cmdline\` plugin to extract process invocation arguments from user-mode memory blocks:

\`\`\`text
PID: 6244
Process: backup_agent.exe
CommandLine: "C:\\Program Files\\GridBackup\\backup_agent.exe" -TargetVault 994 -Mode Differential -KeyFile C:\\Keys\\vault.dat
\`\`\`

The command line parameters specify which target archive repository was operated on.

What decimal integer value was passed to the \`-TargetVault\` argument in this execution?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer value).`,
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
    flag: 'HTG{994}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the number immediately following the -TargetVault parameter: 994.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE41',
      seedId: 'HTG-L06-OE41',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "The command-line string in the process PEB contains '-TargetVault 994'.",
      essentialKeyPoints: [
        "Process command lines are stored in user-space PEB RTL_USER_PROCESS_PARAMETERS structures.",
        "Volatility windows.cmdline extracts original launch arguments regardless of subsequent console changes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{994}' or '994'.",
        partialCredit: "Submits '-TargetVault 994'.",
        noCredit: "Submits PID 6244."
      },
      acceptableAlternatives: ['HTG{994}', '994']
    }
  },
  {
    stableId: 'HTG-L06-OE42',
    order: 42,
    levelNumber: 6,
    title: 'PowerShell PSReadLine Command History Log Filename',
    prompt: `On Windows 10 and 11 workstations, PowerShell 5.1+ includes the \`PSReadLine\` module enabled by default. PSReadLine persists every command executed in an interactive PowerShell console session to a plain-text log file located at:

\`%APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\<FILENAME>\`

This file is a primary forensic artifact for recovering attacker commands that may have scrolled out of memory.

What is the exact filename (including the \`.txt\` extension) of this standard PSReadLine history log?

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
    flag: 'HTG{ConsoleHost_history.txt}',
    hints: [
      {
        hintIndex: 1,
        content: "It combines ConsoleHost and _history.txt.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE42',
      seedId: 'HTG-L06-OE42',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "PSReadLine automatically stores command history in ConsoleHost_history.txt in the user's AppData roaming folder.",
      essentialKeyPoints: [
        "PSReadLine logs commands across console restarts in ConsoleHost_history.txt.",
        "Forensic recovery of this artifact exposes obfuscated scripts, keys, and commands."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ConsoleHost_history.txt}' or 'ConsoleHost_history.txt'.",
        partialCredit: "Submits lowercase 'consolehost_history.txt'.",
        noCredit: "Submits .bash_history or cmd_history.txt."
      },
      acceptableAlternatives: ['HTG{ConsoleHost_history.txt}', 'ConsoleHost_history.txt', 'consolehost_history.txt', 'HTG{consolehost_history.txt}']
    }
  },
  {
    stableId: 'HTG-L06-OE43',
    order: 43,
    levelNumber: 6,
    title: 'Volatility windows.envars Leaked Cloud Secret Identification',
    prompt: `A forensic examiner extracts the process environment block variables using Volatility's \`windows.envars\` plugin for an administrator PowerShell session:

\`\`\`text
PID   Process         Variable                Value
4104  powershell.exe  AWS_DEFAULT_REGION      us-east-1
4104  powershell.exe  AWS_ACCESS_KEY_ID       AKIAIOSFODNN7EXAMPLE
4104  powershell.exe  AWS_SECRET_ACCESS_KEY   wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
\`\`\`

Which environment variable name holds the secret access key credential used for cloud authentication?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the exact uppercase variable name).`,
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
    flag: 'HTG{AWS_SECRET_ACCESS_KEY}',
    hints: [
      {
        hintIndex: 1,
        content: "The third variable in the table stores the secret access key.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE43',
      seedId: 'HTG-L06-OE43',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "AWS_SECRET_ACCESS_KEY is the standard AWS SDK environment variable containing the secret key.",
      essentialKeyPoints: [
        "Process environment variables often expose plaintext API tokens and credentials.",
        "windows.envars extracts the process environment block from volatile memory."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{AWS_SECRET_ACCESS_KEY}' or 'AWS_SECRET_ACCESS_KEY'.",
        partialCredit: "Submits lowercase 'aws_secret_access_key'.",
        noCredit: "Submits AWS_ACCESS_KEY_ID or the credential value."
      },
      acceptableAlternatives: ['HTG{AWS_SECRET_ACCESS_KEY}', 'AWS_SECRET_ACCESS_KEY', 'aws_secret_access_key', 'HTG{aws_secret_access_key}']
    }
  },
  {
    stableId: 'HTG-L06-OE44',
    order: 44,
    levelNumber: 6,
    title: 'Volatility windows.dlllist Injected DLL from Temporary Directory',
    prompt: `An analyst inspects the loaded module list for \`notepad.exe\` (PID 5180) using the \`windows.dlllist\` plugin:

\`\`\`text
Base                Size        Path
0x00007ff712000000  0x35000     C:\\Windows\\System32\\notepad.exe
0x00007ffb84100000  0x1e0000    C:\\Windows\\System32\\ntdll.dll
0x00007ffb83000000  0x52000     C:\\Users\\Target\\AppData\\Local\\Temp\\hook_helper.dll
\`\`\`

Standard Windows system applications should not load binaries from temporary user profile directories.

What is the filename (including the \`.dll\` extension) of the suspicious module loaded from the \`Temp\` directory?

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
    flag: 'HTG{hook_helper.dll}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the Path column on the third line: hook_helper.dll.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE44',
      seedId: 'HTG-L06-OE44',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "hook_helper.dll is loaded from the user's Temp folder, indicating dynamic DLL injection into notepad.exe.",
      essentialKeyPoints: [
        "DLLs loaded from Temp or AppData are high-fidelity indicators of compromise.",
        "windows.dlllist parses PEB Ldr InLoadOrderModuleList to uncover loaded dynamic libraries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{hook_helper.dll}' or 'hook_helper.dll'.",
        partialCredit: "Submits 'hook_helper' without extension.",
        noCredit: "Submits ntdll.dll or notepad.exe."
      },
      acceptableAlternatives: ['HTG{hook_helper.dll}', 'hook_helper.dll', 'HOOK_HELPER.DLL', 'hook_helper']
    }
  },
  {
    stableId: 'HTG-L06-OE45',
    order: 45,
    levelNumber: 6,
    title: 'Linux Root User Bash History File Artifact',
    prompt: `During incident response on a compromised Linux host, an examiner searches the filesystem and unallocated memory blocks for shell activity performed by the \`root\` superuser.

By default, the GNU Bourne-Again SHell (Bash) appends interactive terminal command history upon session exit to a hidden file in the user's home directory.

What is the standard filename (including the leading dot) of this Bash history file located in \`/root/\`?

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
    flag: 'HTG{.bash_history}',
    hints: [
      {
        hintIndex: 1,
        content: "It begins with a dot: .bash_history.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE45',
      seedId: 'HTG-L06-OE45',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "GNU Bash writes interactive command history to .bash_history in the user's home directory.",
      essentialKeyPoints: [
        ".bash_history preserves command sequences unless suppressed by HISTFILE=/dev/null or HISTSIZE=0.",
        "Forensic disk and memory carving regularly recovers unwritten Bash command lines."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{.bash_history}' or '.bash_history'.",
        partialCredit: "Submits 'bash_history' without leading dot.",
        noCredit: "Submits .profile or .bashrc."
      },
      acceptableAlternatives: ['HTG{.bash_history}', '.bash_history', 'bash_history', 'HTG{bash_history}']
    }
  },
  {
    stableId: 'HTG-L06-OE46',
    order: 46,
    levelNumber: 6,
    title: 'System Executable Search Directory Environment Variable',
    prompt: `When an operator enters an unquoted command name (such as \`netstat\` or \`whoami\`) in a command shell, the operating system iterates through a list of directories to locate the corresponding executable binary.

Adversaries abuse this mechanism by inserting untrusted directories earlier in this sequence to achieve search-order hijacking.

What standard environment variable name (shared across Windows, Linux, and macOS) stores this colon- or semicolon-delimited directory search sequence?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the variable name).`,
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
    flag: 'HTG{PATH}',
    hints: [
      {
        hintIndex: 1,
        content: "The 4-letter environment variable name is PATH.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE46',
      seedId: 'HTG-L06-OE46',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "PATH defines the ordered list of directories searched when invoking executable commands.",
      essentialKeyPoints: [
        "Modifications to PATH enable binary hijacking and persistence.",
        "Memory triage checks the PATH variable in process environment blocks for anomalous entries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PATH}' or 'PATH'.",
        partialCredit: "Submits lowercase 'path' or '$PATH'.",
        noCredit: "Submits CLASSPATH or LD_LIBRARY_PATH."
      },
      acceptableAlternatives: ['HTG{PATH}', 'PATH', 'path', 'HTG{path}', '$PATH', '%PATH%']
    }
  },
  {
    stableId: 'HTG-L06-OE47',
    order: 47,
    levelNumber: 6,
    title: 'Windows KnownDLLs Mechanism Registry Key',
    prompt: `To optimize memory sharing and mitigate DLL search-order hijacking, Windows uses a special Session Manager mechanism that pre-maps designated core dynamic libraries.

When an application loads a DLL in this set, the loader checks pre-created section objects directly under:
\`HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\<KEY_NAME>\`
bypassing the application directory and current working directory.

What is the name of this Windows mechanism and registry key?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the key name).`,
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
    flag: 'HTG{KnownDLLs}',
    hints: [
      {
        hintIndex: 1,
        content: "Known dynamic link libraries: KnownDLLs.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE47',
      seedId: 'HTG-L06-OE47',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "KnownDLLs ensures system libraries (e.g. kernel32.dll, user32.dll) are mapped from System32, protecting against local DLL search-order planting.",
      essentialKeyPoints: [
        "KnownDLLs prevents application-directory DLL preloading for registered system DLLs.",
        "DLL hijacking attacks target libraries omitted from the KnownDLLs list."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{KnownDLLs}' or 'KnownDLLs'.",
        partialCredit: "Submits lowercase 'knowndlls' or 'KNOWNDLLS'.",
        noCredit: "Submits AppPaths or SafeDllSearchMode."
      },
      acceptableAlternatives: ['HTG{KnownDLLs}', 'KnownDLLs', 'knowndlls', 'KNOWNDLLS', 'HTG{knowndlls}']
    }
  },
  {
    stableId: 'HTG-L06-OE48',
    order: 48,
    levelNumber: 6,
    title: 'Linux Dynamic Linker Preload Environment Variable',
    prompt: `On Linux systems, the dynamic linker (\`ld.so\`) supports an environment variable that forces specified shared libraries to be loaded before any other library, including \`libc.so\`.

Malicious actors utilize this mechanism for user-mode rootkits to hook library functions (such as \`readdir\` or \`fopen\`) across all dynamically linked processes without modifying binaries on disk.

What is the name of this dynamic linker preload environment variable?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the uppercase variable name).`,
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
    flag: 'HTG{LD_PRELOAD}',
    hints: [
      {
        hintIndex: 1,
        content: "It combines LD and PRELOAD: LD_PRELOAD.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE48',
      seedId: 'HTG-L06-OE48',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "LD_PRELOAD instructs the dynamic linker to load specified shared objects first, enabling function interception across newly spawned processes.",
      essentialKeyPoints: [
        "LD_PRELOAD rootkits intercept library calls in user mode to hide files and processes.",
        "Inspecting process environment variables in memory uncovers unauthorized LD_PRELOAD hooks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{LD_PRELOAD}' or 'LD_PRELOAD'.",
        partialCredit: "Submits lowercase 'ld_preload'.",
        noCredit: "Submits LD_LIBRARY_PATH or PATH."
      },
      acceptableAlternatives: ['HTG{LD_PRELOAD}', 'LD_PRELOAD', 'ld_preload', 'HTG{ld_preload}']
    }
  },
  {
    stableId: 'HTG-L06-OE49',
    order: 49,
    levelNumber: 6,
    title: 'Windows Console Window Keystroke Buffer Host Process',
    prompt: `In Windows 7 and later operating systems, the console subsystem architecture moved console window hosting out of \`csrss.exe\` into a dedicated per-console host process.

This process manages the console screen buffer, input queues, and interactive history for character-mode applications like \`cmd.exe\` and \`powershell.exe\`. Memory carving of this process often yields unencrypted keystroke history.

What is the executable name of this console host process (e.g. \`conhost.exe\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the executable name).`,
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
    flag: 'HTG{conhost.exe}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Console Host: conhost.exe.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE49',
      seedId: 'HTG-L06-OE49',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "conhost.exe runs as the host server for console sessions, buffering user input and console window graphics.",
      essentialKeyPoints: [
        "Dumping memory from conhost.exe processes allows forensic extraction of typed commands.",
        "conhost.exe is spawned as a child or sibling process for active terminal sessions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{conhost.exe}' or 'conhost.exe'.",
        partialCredit: "Submits 'conhost' without extension.",
        noCredit: "Submits csrss.exe or explorer.exe."
      },
      acceptableAlternatives: ['HTG{conhost.exe}', 'conhost.exe', 'conhost', 'CONHOST.EXE', 'HTG{conhost}']
    }
  },
  {
    stableId: 'HTG-L06-OE50',
    order: 50,
    levelNumber: 6,
    title: 'PowerShell EncodedCommand Payload Decoding',
    prompt: `A command-line execution recorded in the process table shows an obfuscated PowerShell launch:

\`\`\`text
powershell.exe -NoProfile -NonInteractive -EncodedCommand VABlAHMAdABHAHIAaQBkAA==
\`\`\`

PowerShell's \`-EncodedCommand\` parameter accepts base64-encoded Unicode (UTF-16LE) strings.

Decode the base64 string \`VABlAHMAdABHAHIAaQBkAA==\` to recover the original plain-text parameter passed to PowerShell.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the decoded text string).`,
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
    flag: 'HTG{TestGrid}',
    hints: [
      {
        hintIndex: 1,
        content: "Decode the base64 bytes as UTF-16LE characters: TestGrid.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE50',
      seedId: 'HTG-L06-OE50',
      subtopic: 'Command history, environment variables, and loaded modules',
      explanation: "Base64 decoding 'VABlAHMAdABHAHIAaQBkAA==' into UTF-16LE yields 'TestGrid'.",
      essentialKeyPoints: [
        "-EncodedCommand is widely used by threat actors to obfuscate PowerShell script blocks.",
        "UTF-16LE encoding places null bytes between ASCII characters in raw base64 data."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TestGrid}' or 'TestGrid'.",
        partialCredit: "Submits lowercase 'testgrid' or uppercase 'TESTGRID'.",
        noCredit: "Submits raw base64 string."
      },
      acceptableAlternatives: ['HTG{TestGrid}', 'TestGrid', 'testgrid', 'TESTGRID', 'HTG{testgrid}']
    }
  }
];

module.exports = subtopic5Questions;
