const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L06-OE21',
    order: 21,
    levelNumber: 6,
    title: 'Memory Page Permission Analysis in Volatility Malfind',
    prompt: `A memory forensics analyst runs the Volatility 3 \`windows.malfind\` plugin against a compromised host's RAM image. The plugin flags an unbacked, private memory allocation with suspicious permissions:

\`\`\`text
PID     Process     Protection              CommitCharge
3108    svchost.exe PAGE_EXECUTE_READWRITE  4
\`\`\`

Legitimate code pages loaded from disk typically possess \`PAGE_EXECUTE_READ\` protections. When memory pages are allocated with simultaneous read, write, and execute permissions, they strongly indicate code injection or shellcode staging.

What is the standard 3-letter permission abbreviation used in security analysis to denote memory that is simultaneously Readable, Writable, and Executable?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter abbreviation).`,
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
    flag: 'HTG{RWX}',
    hints: [
      {
        hintIndex: 1,
        content: "Combine the single-letter abbreviations for Read, Write, and Execute.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE21',
      seedId: 'HTG-L06-OE21',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "PAGE_EXECUTE_READWRITE allows memory to be written and executed without page re-protection. In shorthand, this is denoted as RWX.",
      essentialKeyPoints: [
        "Unbacked RWX pages in user-mode memory strongly correlate with shellcode injection.",
        "W^X (Write XOR Execute) memory protections aim to prevent simultaneous writable and executable permissions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RWX}' or 'RWX'.",
        partialCredit: "Submits lowercase 'rwx' or full 'PAGE_EXECUTE_READWRITE'.",
        noCredit: "Submits RO, RW, or non-executable memory flags."
      },
      acceptableAlternatives: ['HTG{RWX}', 'RWX', 'rwx', 'HTG{rwx}', 'PAGE_EXECUTE_READWRITE']
    }
  },
  {
    stableId: 'HTG-L06-OE22',
    order: 22,
    levelNumber: 6,
    title: 'Virtual Address Descriptor (VAD) Short Private Commit Tag',
    prompt: `In the Windows NT virtual memory manager, the Virtual Address Descriptor (VAD) tree tracks the range and attributes of virtual memory committed to a process. Each node in the VAD tree allocated from the executive kernel pool is identified by a 4-character pool tag.

Forensic memory tools like Volatility parse the VAD tree to detect stealthy memory regions. When a process allocates memory dynamically via \`VirtualAlloc(..., MEM_COMMIT, ...)\` with private backing, the Windows memory manager tags short VAD nodes with a specific 4-character pool tag.

Common pool tags include:
- \`Vad \`: Standard long VAD node
- \`VadF\`: Fast / mapped file VAD node
- \`VadS\`: Short private VAD node
- \`Vadl\`: Large VAD node

What is the 4-character pool tag corresponding to short private Virtual Address Descriptor allocations?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-character tag).`,
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
    flag: 'HTG{VadS}',
    hints: [
      {
        hintIndex: 1,
        content: "Short private commit VAD nodes use the 'S' suffix.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE22',
      seedId: 'HTG-L06-OE22',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "Windows kernel uses the 'VadS' pool tag for MMVAD_SHORT structures representing private, non-file-backed virtual memory allocations.",
      essentialKeyPoints: [
        "VAD tree traversal is critical for uncovering injected code that evades the PEB module list.",
        "VadS indicates short private virtual address descriptors commonly seen in dynamic heap and stack allocations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{VadS}' or 'VadS'.",
        partialCredit: "Submits 'vads' or 'VADS'.",
        noCredit: "Submits VadF or Vad."
      },
      acceptableAlternatives: ['HTG{VadS}', 'VadS', 'vads', 'VADS', 'HTG{vads}']
    }
  },
  {
    stableId: 'HTG-L06-OE23',
    order: 23,
    levelNumber: 6,
    title: '64-bit Process Environment Block (PEB) Base Address Extraction',
    prompt: `An incident response engineer uses a kernel debugger to inspect user-mode process structures in a 64-bit memory dump. Running the \`!peb\` command yields the following header:

\`\`\`text
PEB at 00000034a1bc0000
    InheritedAddressSpace:    No
    ReadImageFileExecOptions: No
    BeingDebugged:            0
    ImageBaseAddress:         00007ff612340000
    Ldr                       00007ffb84501230
\`\`\`

Identify the 64-bit hexadecimal memory base address where this Process Environment Block (PEB) resides.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex address with leading 0x).`,
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
    flag: 'HTG{0x34a1bc0000}',
    hints: [
      {
        hintIndex: 1,
        content: "The PEB address is shown on the first line: 00000034a1bc0000.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE23',
      seedId: 'HTG-L06-OE23',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "The !peb command directly prints the virtual address of the PEB data structure. Stripping leading zero padding gives 0x34a1bc0000.",
      essentialKeyPoints: [
        "The PEB resides in user-mode address space and contains process metadata, loaded DLLs, and command lines.",
        "64-bit Windows processes allocate the PEB dynamically at high address space locations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x34a1bc0000}' or '0x34a1bc0000'.",
        partialCredit: "Submits '34a1bc0000' or '00000034a1bc0000'.",
        noCredit: "Submits the ImageBaseAddress or Ldr address."
      },
      acceptableAlternatives: ['HTG{0x34a1bc0000}', '0x34a1bc0000', '34a1bc0000', '00000034a1bc0000', 'HTG{34a1bc0000}']
    }
  },
  {
    stableId: 'HTG-L06-OE24',
    order: 24,
    levelNumber: 6,
    title: 'Process Hollowing Target ImageBase Address Detection',
    prompt: `In a process hollowing (RunPE) technique, malware creates a benign process in a suspended state, unmaps its original code using \`NtUnmapViewOfSection\`, and replaces it with malicious code before calling \`SetThreadContext\` and \`ResumeThread\`.

A memory analyst inspects a suspended process whose PEB shows an initial executable image base:

\`\`\`text
PEB.ImageBaseAddress: 0x00400000
Unmapped Range:       0x00400000 - 0x00450000
Allocated Hollow:     0x00400000 (PAGE_EXECUTE_READWRITE)
Entry Offset:         0x000014F0
\`\`\`

What is the hexadecimal base address (\`ImageBaseAddress\`) of the target image recorded in the PEB prior to unmapping?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex address with leading 0x).`,
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
    flag: 'HTG{0x00400000}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the PEB.ImageBaseAddress: 0x00400000.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE24',
      seedId: 'HTG-L06-OE24',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "Process hollowing commonly targets standard 32-bit image base addresses such as 0x00400000 to replace the host program's memory with the payload.",
      essentialKeyPoints: [
        "Process hollowing replaces the memory section while retaining the original PID and path in the process tree.",
        "Comparing the PEB ImageBaseAddress with disk image headers uncovers discrepant entry points."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x00400000}' or '0x00400000'.",
        partialCredit: "Submits '0x400000' or '400000'.",
        noCredit: "Submits the entry offset."
      },
      acceptableAlternatives: ['HTG{0x00400000}', '0x00400000', '00400000', '0x400000', '400000', 'HTG{0x400000}']
    }
  },
  {
    stableId: 'HTG-L06-OE25',
    order: 25,
    levelNumber: 6,
    title: 'x64 CR3 Control Register and Page Map Level 4',
    prompt: `In modern x86-64 long mode, the Memory Management Unit (MMU) uses a 4-level paging hierarchy to translate virtual addresses into physical addresses:

\`\`\`text
CR3 Register -> [Root Page Table] -> PDPT -> Page Directory -> Page Table -> Physical Frame
\`\`\`

The CPU's CR3 control register holds the physical base address of this top-level page directory table.

What 4-character acronym designates this top-level paging table structure pointed to directly by the CR3 register in x86-64 long mode?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-character acronym).`,
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
    flag: 'HTG{PML4}',
    hints: [
      {
        hintIndex: 1,
        content: "It stands for Page Map Level 4.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE25',
      seedId: 'HTG-L06-OE25',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "CR3 stores the physical address of the Page Map Level 4 (PML4) table, which contains 512 64-bit entries pointing to Page Directory Pointer Tables.",
      essentialKeyPoints: [
        "In memory forensics, finding CR3 for each process is necessary to reconstruct its virtual address space.",
        "x86-64 long mode translates virtual addresses across PML4, PDPT, PD, and PT levels."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PML4}' or 'PML4'.",
        partialCredit: "Submits lowercase 'pml4' or 'Page Map Level 4'.",
        noCredit: "Submits PDPT, CR3, or GDT."
      },
      acceptableAlternatives: ['HTG{PML4}', 'PML4', 'pml4', 'Page Map Level 4', 'HTG{pml4}']
    }
  },
  {
    stableId: 'HTG-L06-OE26',
    order: 26,
    levelNumber: 6,
    title: 'User-Mode Inline Hooking Opcode Identification',
    prompt: `A forensic examiner disassembles the system call stub for \`ntdll!NtCreateFile\` in memory and observes an unexpected prologue detour:

\`\`\`assembly
ntdll!NtCreateFile:
7fff20101000  e9 3b 2f 14 05  jmp 7fff25243f40
7fff20101005  cc              int 3
\`\`\`

Under normal circumstances, the 64-bit Windows system call prologue executes:
\`\`\`assembly
mov r10, rcx
mov eax, <syscall_number>
\`\`\`

The 5-byte sequence beginning with byte \`0xE9\` redirects program flow to an injected monitoring function.

What is the 3-letter assembly instruction mnemonic corresponding to the opcode byte \`0xE9\` used to hijack execution?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the mnemonic).`,
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
    flag: 'HTG{jmp}',
    hints: [
      {
        hintIndex: 1,
        content: "Opcode 0xE9 encodes a relative near jump.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE26',
      seedId: 'HTG-L06-OE26',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "Opcode 0xE9 represents a relative JMP instruction in x86/x64, universally used in userland API detours and inline hooking.",
      essentialKeyPoints: [
        "Inline hooking patches the prologue of target API functions in memory with an unconditional jump.",
        "Comparing in-memory function bytes against disk-backed DLLs reveals user-mode rootkit hooks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{jmp}' or 'jmp'.",
        partialCredit: "Submits uppercase 'JMP'.",
        noCredit: "Submits call, ret, or mov."
      },
      acceptableAlternatives: ['HTG{jmp}', 'jmp', 'JMP', 'HTG{JMP}']
    }
  },
  {
    stableId: 'HTG-L06-OE27',
    order: 27,
    levelNumber: 6,
    title: 'Standard x86/x64 Virtual Memory Page Size',
    prompt: `Virtual memory management architectures partition memory into fixed-size contiguous blocks called pages. On x86 and x86-64 hardware architectures, standard (base) virtual memory pages are allocated with a uniform byte length.

Forensic tools align memory page table entries (PTEs) and carved memory dumps along these standard page boundaries.

What is the size in bytes of a standard base virtual memory page on x86 and x86-64 architectures?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer byte count).`,
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
    flag: 'HTG{4096}',
    hints: [
      {
        hintIndex: 1,
        content: "4 kilobytes equals 4 * 1024 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE27',
      seedId: 'HTG-L06-OE27',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "The standard hardware page size for x86 and x86-64 architectures is 4096 bytes (4 KiB, or 0x1000 bytes).",
      essentialKeyPoints: [
        "Base virtual memory pages are 4096 bytes (4 KB).",
        "Page boundary alignment (0x1000) determines virtual address decoding and page-fault handling."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{4096}' or '4096'.",
        partialCredit: "Submits '4 KB' or '4KB'.",
        noCredit: "Submits 1024 or 2048."
      },
      acceptableAlternatives: ['HTG{4096}', '4096', '4096 bytes', '4 KB', '4KB', 'HTG{4KB}']
    }
  },
  {
    stableId: 'HTG-L06-OE28',
    order: 28,
    levelNumber: 6,
    title: 'Reflective DLL Injection DOS Header Magic Identification',
    prompt: `During analysis of an unbacked heap segment in a memory dump, a forensics examiner discovers an unlinked dynamic library loaded via reflective DLL injection. Carving the first 32 bytes of the allocation reveals:

\`\`\`text
00007ff810000000  4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00  |MZ..............|
00007ff810000010  b8 00 00 00 00 00 00 00  40 00 00 00 00 00 00 00  |........@.......|
\`\`\`

The two leading bytes \`0x4D 0x5A\` represent the classic DOS header magic value named after Mark Zbikowski.

What two ASCII characters represent this standard executable header magic signature?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-character ASCII signature).`,
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
    flag: 'HTG{MZ}',
    hints: [
      {
        hintIndex: 1,
        content: "Hex 0x4D is ASCII 'M' and 0x5A is ASCII 'Z'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE28',
      seedId: 'HTG-L06-OE28',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "0x4D 0x5A corresponds to ASCII 'MZ', the IMAGE_DOS_HEADER e_magic constant present at the start of all PE/COFF Windows binaries.",
      essentialKeyPoints: [
        "Reflective DLL injection leaves in-memory PE images without registering in the PEB InMemoryOrderModuleList.",
        "Locating MZ signatures in unbacked memory pages is a primary heuristic for discovering reflective injection."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{MZ}' or 'MZ'.",
        partialCredit: "Submits lowercase 'mz'.",
        noCredit: "Submits PE or ELF."
      },
      acceptableAlternatives: ['HTG{MZ}', 'MZ', 'mz', 'HTG{mz}']
    }
  },
  {
    stableId: 'HTG-L06-OE29',
    order: 29,
    levelNumber: 6,
    title: 'Windows Graphical Device Interface (GDI) Handle Quota',
    prompt: `An incident responder inspects a malicious credential scraping tool that crashed due to handle table exhaustion. Windows enforces per-process resource quotas to prevent denial of service in kernel subsystem graphics handling.

The registry value \`GDIProcessHandleQuota\` under:
\`HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Windows\`
defines the maximum number of GDI handles a single process can open simultaneously before resource allocation calls fail.

What is the default decimal integer quota for GDI handles per process in standard Windows installations?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer quota).`,
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
    flag: 'HTG{10000}',
    hints: [
      {
        hintIndex: 1,
        content: "Ten thousand handles is the standard Windows kernel default limit.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE29',
      seedId: 'HTG-L06-OE29',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "Windows defaults GDIProcessHandleQuota to 10,000 handles per process to maintain kernel memory stability.",
      essentialKeyPoints: [
        "Kernel handle tables track user-mode process object consumption.",
        "Default per-process GDI handle limit is 10,000."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{10000}' or '10000'.",
        partialCredit: "Submits '10,000'.",
        noCredit: "Submits 1024 or 65536."
      },
      acceptableAlternatives: ['HTG{10000}', '10000', '10,000', 'HTG{10,000}']
    }
  },
  {
    stableId: 'HTG-L06-OE30',
    order: 30,
    levelNumber: 6,
    title: 'Thread Local Storage (TLS) Callback PE Directory',
    prompt: `Malware authors frequently place malicious initialization or anti-debugging routines inside callback functions registered in the PE header's Thread Local Storage table.

Because the Windows loader executes TLS callbacks prior to creating the main application thread and jumping to the executable's \`AddressOfEntryPoint\`, debugging breakpoints set at the entry point are bypassed.

What 3-letter abbreviation designates this Thread Local Storage directory and callback structure within the Portable Executable header?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter abbreviation).`,
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
    flag: 'HTG{TLS}',
    hints: [
      {
        hintIndex: 1,
        content: "Abbreviation for Thread Local Storage.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE30',
      seedId: 'HTG-L06-OE30',
      subtopic: 'Volatile-memory artifacts and address interpretation',
      explanation: "Thread Local Storage (TLS) callbacks allow code execution before the main entry point, a common evasion tactic observed during memory triage.",
      essentialKeyPoints: [
        "TLS callbacks execute before AddressOfEntryPoint during process initialization.",
        "Detecting TLS directory entries is an essential step in identifying pre-entry point code execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TLS}' or 'TLS'.",
        partialCredit: "Submits lowercase 'tls' or 'Thread Local Storage'.",
        noCredit: "Submits SEH or IAT."
      },
      acceptableAlternatives: ['HTG{TLS}', 'TLS', 'tls', 'Thread Local Storage', 'HTG{tls}']
    }
  }
];

module.exports = subtopic3Questions;
