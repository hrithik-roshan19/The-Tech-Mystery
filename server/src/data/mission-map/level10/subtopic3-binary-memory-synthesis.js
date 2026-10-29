const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L10-OE21',
    order: 21,
    levelNumber: 10,
    title: 'Windows Virtual Address Descriptor (VAD) Tree Structure',
    prompt: `In Windows memory forensics, the kernel tracks contiguous allocated memory ranges and their associated page protection flags for each process using a self-balancing binary search tree.

What 3-letter uppercase acronym represents this Virtual Address Descriptor structure inspected by Volatility tools?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{VAD}',
    hints: [
      {
        hintIndex: 1,
        content: "Virtual Address Descriptor is abbreviated VAD.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE21',
      seedId: 'HTG-L10-OE21',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "The VAD (Virtual Address Descriptor) tree maintains memory allocation descriptors for Windows processes.",
      essentialKeyPoints: [
        "Plugins like 'windows.vadinfo' walk the VAD tree to map memory protections.",
        "Unbacked executable VAD nodes indicate in-memory code injection."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{VAD}' or 'VAD'.",
        partialCredit: "Submits lowercase 'vad'.",
        noCredit: "Submits PEB or TEB."
      },
      acceptableAlternatives: ['HTG{VAD}', 'VAD', 'vad', 'HTG{vad}']
    }
  },
  {
    stableId: 'HTG-L10-OE22',
    order: 22,
    levelNumber: 10,
    title: 'Anomalous Writable-Executable Memory Protection Constant',
    prompt: `In volatility memory triage (\`windows.malfind\`), automated detectors flag memory pages that permit concurrent write and execute privileges, which violates Data Execution Prevention (DEP / W^X) policies.

What exact Windows memory protection constant string (beginning with \`PAGE_EXECUTE_...\`) grants read, write, and execute permissions on a memory page?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the constant name).`,
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
    flag: 'HTG{PAGE_EXECUTE_READWRITE}',
    hints: [
      {
        hintIndex: 1,
        content: "The constant is PAGE_EXECUTE_READWRITE.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE22',
      seedId: 'HTG-L10-OE22',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "PAGE_EXECUTE_READWRITE (RWX) memory allows shellcode injection and in-place execution.",
      essentialKeyPoints: [
        "RWX permissions are primary indicators of unpacked malware or injected shellcode.",
        "Standard compiled code resides in PAGE_EXECUTE_READ memory."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PAGE_EXECUTE_READWRITE}' or 'PAGE_EXECUTE_READWRITE'.",
        partialCredit: "Submits 'RWX' or lowercase 'page_execute_readwrite'.",
        noCredit: "Submits PAGE_READWRITE."
      },
      acceptableAlternatives: ['HTG{PAGE_EXECUTE_READWRITE}', 'PAGE_EXECUTE_READWRITE', 'page_execute_readwrite', 'RWX', 'HTG{RWX}']
    }
  },
  {
    stableId: 'HTG-L10-OE23',
    order: 23,
    levelNumber: 10,
    title: 'Process Environment Block (PEB) Executive Data Structure',
    prompt: `In Windows user-mode process architecture, each running process maintains a core executive structure in user-space that stores the process image base address, command-line arguments, environment variables, and the loaded module doubly-linked lists.

What 3-letter uppercase acronym represents this Process Environment Block?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{PEB}',
    hints: [
      {
        hintIndex: 1,
        content: "Process Environment Block is abbreviated PEB.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE23',
      seedId: 'HTG-L10-OE23',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "The PEB (Process Environment Block) contains user-mode process state and loaded module pointers.",
      essentialKeyPoints: [
        "Malware unlinks DLLs from the PEB's InLoadOrderModuleList to hide from basic inspection.",
        "The PEB BeingDebugged flag is checked by anti-debugging routines."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PEB}' or 'PEB'.",
        partialCredit: "Submits lowercase 'peb'.",
        noCredit: "Submits TEB or EPROCESS."
      },
      acceptableAlternatives: ['HTG{PEB}', 'PEB', 'peb', 'HTG{peb}']
    }
  },
  {
    stableId: 'HTG-L10-OE24',
    order: 24,
    levelNumber: 10,
    title: 'Import Address Table (IAT) Hooking Redirection Technique',
    prompt: `In binary reverse engineering, malware often intercepts API calls by overwriting function pointers within the Portable Executable structure that resolves dynamic library addresses at runtime.

What 3-letter uppercase acronym designates the Import Address Table targeted by this classic API hooking method?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{IAT}',
    hints: [
      {
        hintIndex: 1,
        content: "Import Address Table is abbreviated IAT.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE24',
      seedId: 'HTG-L10-OE24',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "IAT (Import Address Table) hooking modifies import pointers to redirect system API calls to malicious routines.",
      essentialKeyPoints: [
        "The IAT is populated by the Windows PE loader with resolved virtual addresses.",
        "Comparing in-memory IAT pointers against disk DLL export addresses reveals hooks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{IAT}' or 'IAT'.",
        partialCredit: "Submits lowercase 'iat'.",
        noCredit: "Submits EAT or GOT."
      },
      acceptableAlternatives: ['HTG{IAT}', 'IAT', 'iat', 'HTG{iat}']
    }
  },
  {
    stableId: 'HTG-L10-OE25',
    order: 25,
    levelNumber: 10,
    title: 'Kernel Mutex Synchronization Object for Instance Control',
    prompt: `To prevent multiple instances of a malware implant from executing simultaneously and competing for resources, authors create a named kernel synchronization primitive.

If the object already exists, \`GetLastError()\` returns \`ERROR_ALREADY_EXISTS\` and the secondary process cleanly terminates.

What synchronization object type (short for mutual exclusion) is created using the Win32 \`CreateMutexA\` API?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the object type).`,
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
    flag: 'HTG{mutex}',
    hints: [
      {
        hintIndex: 1,
        content: "The synchronization primitive is a mutex (or mutant).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE25',
      seedId: 'HTG-L10-OE25',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "A named mutex enforces single-instance execution and serves as an important host IOC.",
      essentialKeyPoints: [
        "Security products search for known malware mutex names in memory dumps.",
        "Creating vaccination mutexes prevents specific malware families from activating."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{mutex}' or 'mutex'.",
        partialCredit: "Submits capitalized 'Mutex' or 'mutant'.",
        noCredit: "Submits semaphore or event."
      },
      acceptableAlternatives: ['HTG{mutex}', 'mutex', 'Mutex', 'mutant', 'Mutant', 'HTG{Mutex}']
    }
  },
  {
    stableId: 'HTG-L10-OE26',
    order: 26,
    levelNumber: 10,
    title: 'Reflective DLL Injection In-Memory Loading Paradigm',
    prompt: `In advanced in-memory evasion, Stephen Fewer designed a technique where a dynamic link library contains its own minimal PE loader inside its export table.

This allows the DLL to map its own sections, resolve imports, and apply base relocations directly from memory without calling the Windows API \`LoadLibrary\` or writing the binary to disk.

What 3-word phrase designates this in-memory loading methodology known as Reflective DLL Injection?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-word phrase).`,
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
    flag: 'HTG{reflective DLL injection}',
    hints: [
      {
        hintIndex: 1,
        content: "The technique is reflective DLL injection.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE26',
      seedId: 'HTG-L10-OE26',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "Reflective DLL injection enables stealthy in-memory module execution bypassing disk-based AV scanners.",
      essentialKeyPoints: [
        "The injected DLL resolves its own symbols and fixes relocations internally.",
        "Because LoadLibrary is never called, the DLL does not appear in standard module enumerations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{reflective DLL injection}' or 'reflective DLL injection'.",
        partialCredit: "Submits 'Reflective DLL Injection' or 'reflective loading'.",
        noCredit: "Submits process hollowing or atom bombing."
      },
      acceptableAlternatives: ['HTG{reflective DLL injection}', 'reflective DLL injection', 'Reflective DLL Injection', 'reflective dll injection', 'reflective loading', 'HTG{Reflective DLL Injection}']
    }
  },
  {
    stableId: 'HTG-L10-OE27',
    order: 27,
    levelNumber: 10,
    title: 'Claude Shannon Information Entropy Metric in Binary Triage',
    prompt: `In reverse engineering and binary packing detection, analysts calculate the randomness of bytes within Portable Executable sections.

Plaintext code sections generally exhibit values between 5.5 and 6.5, whereas encrypted, compressed, or packed sections approach the theoretical maximum of 8.0 bits per byte.

What mathematical information metric (named after Claude Shannon) measures this degree of byte randomness?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the metric name).`,
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
    flag: 'HTG{Shannon entropy}',
    hints: [
      {
        hintIndex: 1,
        content: "Named after Claude Shannon: Shannon entropy.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE27',
      seedId: 'HTG-L10-OE27',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "Shannon entropy quantifies information density and highlights packed or encrypted code sections.",
      essentialKeyPoints: [
        "Entropy > 7.0 strongly indicates encrypted shellcode or packing algorithms (UPX, Themida).",
        "It guides reverse engineers to unpacked memory dumps."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Shannon entropy}' or 'Shannon entropy'.",
        partialCredit: "Submits 'entropy' or 'Shannon Entropy'.",
        noCredit: "Submits variance or divergence."
      },
      acceptableAlternatives: ['HTG{Shannon entropy}', 'Shannon entropy', 'Shannon Entropy', 'entropy', 'Entropy', 'HTG{entropy}']
    }
  },
  {
    stableId: 'HTG-L10-OE28',
    order: 28,
    levelNumber: 10,
    title: 'Windows Security Access Token Object',
    prompt: `In Windows security and token manipulation attacks (such as token stealing and impersonation), the kernel associates a security context object with every logged-on user and executing process.

This kernel object encapsulates user SID, group memberships, and assigned privileges (such as \`SeDebugPrivilege\` and \`SeImpersonatePrivilege\`).

What is the general term for this Windows security object (known as an "... token")?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word phrase).`,
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
    flag: 'HTG{access token}',
    hints: [
      {
        hintIndex: 1,
        content: "The object is an access token (or primary/impersonation token).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE28',
      seedId: 'HTG-L10-OE28',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "Windows access tokens encapsulate identity, group memberships, and security privileges.",
      essentialKeyPoints: [
        "Threat actors use DuplicateTokenEx to steal SYSTEM tokens from lsass.exe or winlogon.exe.",
        "SeImpersonatePrivilege allows Potato family exploits to escalate to SYSTEM."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{access token}' or 'access token'.",
        partialCredit: "Submits 'Access Token' or 'security token'.",
        noCredit: "Submits Kerberos ticket."
      },
      acceptableAlternatives: ['HTG{access token}', 'access token', 'Access Token', 'security token', 'primary token', 'HTG{Access Token}']
    }
  },
  {
    stableId: 'HTG-L10-OE29',
    order: 29,
    levelNumber: 10,
    title: 'Linux Procfs Process Memory Maps Virtual File',
    prompt: `In Linux memory forensics and process introspection, the kernel exposes the virtual memory mappings of every active process via the \`/proc\` pseudo-filesystem.

Which virtual file under \`/proc/<pid>/\` displays start-end virtual address ranges, permission flags (\`rwxp\`), offset, device, and backing inode or mapped library path?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the file name).`,
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
    flag: 'HTG{maps}',
    hints: [
      {
        hintIndex: 1,
        content: "The file is /proc/<pid>/maps.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE29',
      seedId: 'HTG-L10-OE29',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "/proc/<pid>/maps lists memory regions and permission flags for Linux processes.",
      essentialKeyPoints: [
        "/proc/<pid>/maps details stack, heap, and shared library mappings.",
        "/proc/<pid>/mem allows reading raw bytes from those mapped ranges."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{maps}' or 'maps'.",
        partialCredit: "Submits '/proc/<pid>/maps'.",
        noCredit: "Submits status or smaps."
      },
      acceptableAlternatives: ['HTG{maps}', 'maps', 'MAPS', '/proc/<pid>/maps', 'HTG{MAPS}']
    }
  },
  {
    stableId: 'HTG-L10-OE30',
    order: 30,
    levelNumber: 10,
    title: 'In-Memory Module Initialization Token Carving',
    prompt: `A malware analyst carves an unbacked memory allocation mapped at virtual address \`0x00405000\` inside a compromised host process and extracts the embedded module initialization token:
\`\`\`text
0x00405020:  43 4F 52 45 5F 4D 4F 44  5F 49 4E 49 54 5F 38 32  CORE_MOD_INIT_82
0x00405030:  00 00 00 00 A1 B2 C3 D4  ...                      ........
\`\`\`
What is the exact module initialization token string discovered in this injected memory buffer?

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
    flag: 'HTG{CORE_MOD_INIT_82}',
    hints: [
      {
        hintIndex: 1,
        content: "Transcribe the carved string: CORE_MOD_INIT_82.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE30',
      seedId: 'HTG-L10-OE30',
      subtopic: 'Cross-synthesis of Binary Echo & Memory Artifacts',
      explanation: "Carving memory at offset 0x00405020 uncovers 'CORE_MOD_INIT_82'.",
      essentialKeyPoints: [
        "Injected shellcode contains configuration anchors in memory.",
        "The token forms the third sub-key in the citadel puzzle sequence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CORE_MOD_INIT_82}'.",
        partialCredit: "Submits 'CORE_MOD_INIT_82' without curly braces.",
        noCredit: "Submits raw hex bytes."
      },
      acceptableAlternatives: ['HTG{CORE_MOD_INIT_82}', 'CORE_MOD_INIT_82', 'core_mod_init_82', 'HTG{core_mod_init_82}']
    }
  }
];

module.exports = subtopic3Questions;

