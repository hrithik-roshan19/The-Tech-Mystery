const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L07-OE41',
    order: 41,
    levelNumber: 7,
    title: 'Non-Executable Stack Memory Protection Acronym',
    prompt: `To mitigate classic stack-based code injection attacks, modern operating systems and processors enforce page-level permissions separating writable memory from executable memory (W^X).

Under this defense, pages allocated for thread stacks and heaps are marked as readable and writable, but executing instructions from them triggers an immediate fault.

What 2-letter acronym (No-Execute) designates this hardware-backed memory defense?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{NX}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for No-eXecute: NX (or DEP in Windows).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE41',
      seedId: 'HTG-L07-OE41',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "NX (No-Execute) prevents code execution from stack or heap memory, compelling attackers to use ROP instead of shellcode.",
      essentialKeyPoints: [
        "NX / DEP enforces W^X permissions at the CPU page table level.",
        "Binaries compiled with -z execstack disable NX, allowing direct stack execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{NX}' or 'NX'.",
        partialCredit: "Submits 'DEP' or 'W^X'.",
        noCredit: "Submits ASLR or PIE."
      },
      acceptableAlternatives: ['HTG{NX}', 'NX', 'DEP', 'W^X', 'HTG{DEP}', 'HTG{nx}']
    }
  },
  {
    stableId: 'HTG-L07-OE42',
    order: 42,
    levelNumber: 7,
    title: 'Linux Kernel ASLR Configuration Sysctl Path',
    prompt: `On Linux systems, Address Space Layout Randomization (ASLR) dynamically randomizes the base addresses of the stack, heap, and shared libraries upon program execution.

System administrators and testing environments configure this behavior by writing to a parameter under \`/proc/sys/kernel/\`:
\`0\` = ASLR disabled
\`1\` = Partial randomization (mmap, stack, VDSO)
\`2\` = Full randomization (includes heap / brk)

What is the parameter name located in \`/proc/sys/kernel/\` that controls this setting?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the parameter name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{randomize_va_space}',
    hints: [
      {
        hintIndex: 1,
        content: "The sysctl parameter is randomize_va_space.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE42',
      seedId: 'HTG-L07-OE42',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "/proc/sys/kernel/randomize_va_space controls the Linux kernel's ASLR implementation.",
      essentialKeyPoints: [
        "ASLR randomizes memory layouts across executions to prevent hardcoded return addresses.",
        "Full ASLR (setting 2) randomizes the stack, shared libraries, and heap (brk)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{randomize_va_space}' or 'randomize_va_space'.",
        partialCredit: "Submits uppercase 'RANDOMIZE_VA_SPACE'.",
        noCredit: "Submits aslr or va_space."
      },
      acceptableAlternatives: ['HTG{randomize_va_space}', 'randomize_va_space', 'RANDOMIZE_VA_SPACE', 'HTG{RANDOMIZE_VA_SPACE}']
    }
  },
  {
    stableId: 'HTG-L07-OE43',
    order: 43,
    levelNumber: 7,
    title: 'Stack Canary Null Byte Terminator Reason',
    prompt: `On 64-bit Linux binaries compiled with GCC's \`-fstack-protector\`, a randomized 8-byte stack canary is placed on the stack between local buffers and the saved base pointer.

To prevent string copy functions like \`strcpy\`, \`strcat\`, or \`sprintf\` from accidentally leaking or bypassing the canary during string processing, the canary's lowest byte is deliberately set to a constant value.

What hexadecimal byte value occupies the lowest byte of standard GCC stack canaries?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex byte with leading 0x).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{0x00}',
    hints: [
      {
        hintIndex: 1,
        content: "The null byte terminator value is 0x00.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE43',
      seedId: 'HTG-L07-OE43',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "Standard stack canaries begin with a null byte (0x00) to terminate string-based read and write operations.",
      essentialKeyPoints: [
        "A null byte in the canary stops string copying functions from reading or writing further.",
        "Overwriting a canary requires writing the exact 8-byte value (including 0x00)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x00}' or '0x00'.",
        partialCredit: "Submits '0' or 'null byte'.",
        noCredit: "Submits 0xFF or 0xCC."
      },
      acceptableAlternatives: ['HTG{0x00}', '0x00', '0', '0x0', 'null byte', 'HTG{0}']
    }
  },
  {
    stableId: 'HTG-L07-OE44',
    order: 44,
    levelNumber: 7,
    title: 'Position Independent Executable Compiler Flag',
    prompt: `While ASLR randomizes shared libraries and stack layouts, an ELF binary compiled without relocation support loads its code (\`.text\`) and data segments at fixed base addresses (such as \`0x400000\`).

To ensure that the main application binary itself is randomized in memory along with libraries, developers compile the program as a Position Independent Executable (PIE).

What GCC compiler flag option enables the generation of Position Independent Executables?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the compiler flag).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{-fPIE}',
    hints: [
      {
        hintIndex: 1,
        content: "The compiler flag is -fPIE (or -pie for the linker).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE44',
      seedId: 'HTG-L07-OE44',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "-fPIE (Position Independent Executable) compiles machine code with relative addressing so the binary base can be randomized.",
      essentialKeyPoints: [
        "PIE eliminates fixed .text segment addresses, defeating static return address overwrites.",
        "Exploiting PIE binaries requires an information leak to calculate the randomized base address."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{-fPIE}' or '-fPIE'.",
        partialCredit: "Submits '-pie' or 'PIE'.",
        noCredit: "Submits -fPIC or -fstack-protector."
      },
      acceptableAlternatives: ['HTG{-fPIE}', '-fPIE', '-pie', 'fPIE', 'PIE', 'HTG{-pie}']
    }
  },
  {
    stableId: 'HTG-L07-OE45',
    order: 45,
    levelNumber: 7,
    title: 'GCC Stack Protection Failure Handler Function',
    prompt: `In functions compiled with stack canary protection, the epilogue verifies that the canary value placed on the stack remains unaltered before returning:

\`\`\`assembly
mov    rax, qword ptr [rbp - 0x8]
xor    rax, qword ptr fs:[0x28]
jnz    stack_violation_handler
\`\`\`

If \`XOR\` produces a non-zero result (indicating corruption), execution branches to a glibc termination function that prints \`*** stack smashing detected ***\` and aborts the process.

What is the symbol name of this glibc failure handler function?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{__stack_chk_fail}',
    hints: [
      {
        hintIndex: 1,
        content: "The function begins with double underscores: __stack_chk_fail.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE45',
      seedId: 'HTG-L07-OE45',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "__stack_chk_fail is called when a stack canary mismatch is detected, halting execution via abort().",
      essentialKeyPoints: [
        "__stack_chk_fail prevents execution from reaching the corrupted return address.",
        "Overwriting __stack_chk_fail@got was a historical bypass in partial RELRO environments."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{__stack_chk_fail}' or '__stack_chk_fail'.",
        partialCredit: "Submits 'stack_chk_fail'.",
        noCredit: "Submits abort or exit."
      },
      acceptableAlternatives: ['HTG{__stack_chk_fail}', '__stack_chk_fail', 'stack_chk_fail', 'HTG{stack_chk_fail}']
    }
  },
  {
    stableId: 'HTG-L07-OE46',
    order: 46,
    levelNumber: 7,
    title: 'Relocation Read-Only (RELRO) Security Mechanism',
    prompt: `Dynamic ELF binaries populate the Global Offset Table (GOT) at runtime. By default, the GOT must be writable so the dynamic linker can resolve function pointers on demand.

To protect the GOT from malicious overwrite attacks, linkers support a hardening mechanism that resolves all dynamic symbols immediately upon loading and marks the entire GOT section as read-only before user code runs.

What 5-letter acronym designates Relocation Read-Only?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{RELRO}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Relocation Read-Only: RELRO.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE46',
      seedId: 'HTG-L07-OE46',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "RELRO (Relocation Read-Only) hardens binaries by making the GOT read-only (Full RELRO).",
      essentialKeyPoints: [
        "Partial RELRO places internal data ahead of variables but leaves the GOT writable.",
        "Full RELRO binds all symbols at startup (-z now) and marks the GOT read-only (-z relro)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RELRO}' or 'RELRO'.",
        partialCredit: "Submits lowercase 'relro' or 'Full RELRO'.",
        noCredit: "Submits ASLR or DEP."
      },
      acceptableAlternatives: ['HTG{RELRO}', 'RELRO', 'relro', 'Full RELRO', 'HTG{relro}']
    }
  },
  {
    stableId: 'HTG-L07-OE47',
    order: 47,
    levelNumber: 7,
    title: 'Segment Register Storing Thread Local Storage Canary on x86-64',
    prompt: `In the 64-bit Linux ABI, the master reference value for the stack canary is stored in the Thread Control Block (TCB) within Thread Local Storage (TLS).

When setting up and checking the canary, functions load this reference value using an offset from a dedicated CPU segment register:

\`\`\`assembly
mov    rax, qword ptr fs:[0x28] ; Load master canary from TLS
\`\`\`

Which 2-letter segment register (\`fs\` or \`gs\`) holds the base address of Thread Local Storage in 64-bit Linux?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the register name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{fs}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the assembly operand: fs:[0x28].",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE47',
      seedId: 'HTG-L07-OE47',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "FS segment register points to the Thread Control Block (TCB) in 64-bit Linux (GS is used in 64-bit Windows).",
      essentialKeyPoints: [
        "fs:[0x28] stores the master stack canary value on Linux x86-64.",
        "Thread Local Storage corruption can overwrite the master canary reference."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{fs}' or 'fs'.",
        partialCredit: "Submits uppercase 'FS' or '%fs'.",
        noCredit: "Submits gs or cs."
      },
      acceptableAlternatives: ['HTG{fs}', 'fs', 'FS', '%fs', 'HTG{FS}']
    }
  },
  {
    stableId: 'HTG-L07-OE48',
    order: 48,
    levelNumber: 7,
    title: 'Memory Protection Tool Command Line Utility',
    prompt: `A security auditor checks the compiled security mitigations of a target binary before developing an exploit:

\`\`\`text
$ [COMMAND] --file=service_bin
RELRO:    Full RELRO
Stack:    Canary found
NX:       NX enabled
PIE:      PIE enabled
FORTIFY:  Enabled
\`\`\`

What is the name of this standard command-line utility used to audit executable protection flags?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the utility name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{checksec}',
    hints: [
      {
        hintIndex: 1,
        content: "The tool is checksec (or checksec.sh).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE48',
      seedId: 'HTG-L07-OE48',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "checksec is a bash script/utility that inspects ELF headers to report RELRO, Canary, NX, and PIE statuses.",
      essentialKeyPoints: [
        "checksec identifies enabled compiler mitigations.",
        "The security profile determines whether ROP, ret2libc, or shellcode execution is viable."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{checksec}' or 'checksec'.",
        partialCredit: "Submits 'checksec.sh' or uppercase.",
        noCredit: "Submits readelf or objdump."
      },
      acceptableAlternatives: ['HTG{checksec}', 'checksec', 'checksec.sh', 'CHECKSEC', 'HTG{checksec.sh}']
    }
  },
  {
    stableId: 'HTG-L07-OE49',
    order: 49,
    levelNumber: 7,
    title: 'Control-Flow Integrity Hardware Technology by Intel',
    prompt: `To eliminate Return-Oriented Programming (ROP) and Jump-Oriented Programming (JOP) attacks in hardware, Intel introduced an architecture extension that incorporates:
1. Shadow Stack: A dedicated hardware-protected secondary stack that stores copy-protected return addresses.
2. Indirect Branch Tracking (IBT): Mandates that indirect jumps land on valid \`ENDBR64\` instructions.

What 3-letter acronym designates Intel's Control-flow Enforcement Technology?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{CET}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Control-flow Enforcement Technology: CET.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE49',
      seedId: 'HTG-L07-OE49',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "Intel CET (Control-flow Enforcement Technology) implements hardware shadow stacks and indirect branch tracking.",
      essentialKeyPoints: [
        "CET Shadow Stacks compare the return address on ret against a secure hardware stack.",
        "Any discrepancy between data stack and shadow stack triggers a control protection exception (#CP)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CET}' or 'CET'.",
        partialCredit: "Submits lowercase 'cet' or 'Control-flow Enforcement Technology'.",
        noCredit: "Submits MPX or SGX."
      },
      acceptableAlternatives: ['HTG{CET}', 'CET', 'cet', 'Control-flow Enforcement Technology', 'HTG{cet}']
    }
  },
  {
    stableId: 'HTG-L07-OE50',
    order: 50,
    levelNumber: 7,
    title: 'Linux ASLR Setting Value for Full Address Randomization',
    prompt: `The Linux kernel sysctl interface \`/proc/sys/kernel/randomize_va_space\` supports three numeric states:
- \`0\`: ASLR completely disabled.
- \`1\`: Conservative randomization (shared libraries, stack, mmap, and VDSO).
- [State]: Full randomization (adds data segment heap allocation via \`brk\`).

What integer value configures full memory layout randomization?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer value).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Pwn',
    difficulty: 'HARD',
    flag: 'HTG{2}',
    hints: [
      {
        hintIndex: 1,
        content: "Setting the sysctl parameter to 2 enables full randomization.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE50',
      seedId: 'HTG-L07-OE50',
      subtopic: 'Mitigations: ASLR, NX/DEP, stack canaries, and PIE',
      explanation: "A value of 2 enables full ASLR including heap (brk) randomization in Linux.",
      essentialKeyPoints: [
        "randomize_va_space=2 provides full system ASLR protection.",
        "When randomize_va_space=0, memory segments remain at identical virtual addresses across restarts."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2}' or '2'.",
        partialCredit: "Submits 'two'.",
        noCredit: "Submits 0 or 1."
      },
      acceptableAlternatives: ['HTG{2}', '2', 'two']
    }
  }
];

module.exports = subtopic5Questions;

