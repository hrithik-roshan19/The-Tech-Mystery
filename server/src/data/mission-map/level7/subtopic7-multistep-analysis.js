const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L07-OE61',
    order: 61,
    levelNumber: 7,
    title: 'Reconstructing Payload Byte Length from Disassembly',
    prompt: `An analyst examines the disassembly of a 64-bit input processor function:

\`\`\`assembly
sub    rsp, 0x40              ; Allocates 64 bytes for local buffer
lea    rax, [rbp - 0x40]
mov    rdi, rax
call   read_unbounded_string  ; Unchecked input reading
\`\`\`

The stack frame includes:
1. 64 bytes of local buffer space (\`0x40\`)
2. 8 bytes of saved base pointer (\`RBP\`)
3. 8 bytes of saved return address (\`RIP\`)

To overwrite the entire stack frame through the end of the return address with a target address, how many total bytes must the input payload comprise?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer byte count).`,
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
    flag: 'HTG{80}',
    hints: [
      {
        hintIndex: 1,
        content: "64 (buffer) + 8 (saved RBP) + 8 (return address) = 80 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE61',
      seedId: 'HTG-L07-OE61',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "Overwriting up to and including the 8-byte return address requires 64 + 8 + 8 = 80 bytes (0x50 bytes).",
      essentialKeyPoints: [
        "Full frame overwrite includes local variables, saved frame pointer, and return address.",
        "Precision in payload length ensures subsequent ROP chain gadgets align with stack slots."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{80}' or '80'.",
        partialCredit: "Submits '80 bytes' or '0x50'.",
        noCredit: "Submits 64 or 72."
      },
      acceptableAlternatives: ['HTG{80}', '80', '80 bytes', '0x50']
    }
  },
  {
    stableId: 'HTG-L07-OE62',
    order: 62,
    levelNumber: 7,
    title: 'Libc Base Address Calculation from Information Leak',
    prompt: `During exploitation of an ASLR-enabled 64-bit service, an information leak reveals the dynamic runtime memory address of the C library function \`puts()\`:

\`\`\`text
Leaked puts() Runtime Address: 0x7ffff7e4aa30
Known puts() Offset in libc.so: 0x00000008aa30
\`\`\`

Because ASLR randomizes the entire shared library as a contiguous block, the difference between any resolved function address and its static ELF offset yields the base address of \`libc\`.

What is the calculated runtime base address of \`libc\` in hexadecimal?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex address with leading 0x).`,
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
    flag: 'HTG{0x7ffff7dc0000}',
    hints: [
      {
        hintIndex: 1,
        content: "0x7ffff7e4aa30 - 0x8aa30 = 0x7ffff7dc0000.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE62',
      seedId: 'HTG-L07-OE62',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "Base address = Leaked Address - Static Offset = 0x7ffff7e4aa30 - 0x8aa30 = 0x7ffff7dc0000.",
      essentialKeyPoints: [
        "A single leaked library address unmasks the base address of all shared library symbols.",
        "Shared library base addresses are page-aligned (ending in 000 or 0000)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x7ffff7dc0000}' or '0x7ffff7dc0000'.",
        partialCredit: "Submits '7ffff7dc0000'.",
        noCredit: "Submits the leaked address unchanged."
      },
      acceptableAlternatives: ['HTG{0x7ffff7dc0000}', '0x7ffff7dc0000', '7ffff7dc0000', 'HTG{7ffff7dc0000}']
    }
  },
  {
    stableId: 'HTG-L07-OE63',
    order: 63,
    levelNumber: 7,
    title: 'One-Gadget RCE Offset in Glibc',
    prompt: `In modern binary exploitation against GNU C Library targets, analysts often search for single instruction locations that directly invoke \`execve("/bin/sh", ...)\` if simple register constraints (such as \`rsp+0x40 == NULL\`) are satisfied.

The popular open-source Ruby tool that automatically scans \`libc.so.6\` binaries to locate these convenient offsets shares this exact name.

What is the name of this tool and gadget concept (e.g. \`one_gadget\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the tool name).`,
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
    flag: 'HTG{one_gadget}',
    hints: [
      {
        hintIndex: 1,
        content: "The tool and concept is named one_gadget.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE63',
      seedId: 'HTG-L07-OE63',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "one_gadget finds single-instruction entry points in libc that call execve('/bin/sh', rsp+..., environ).",
      essentialKeyPoints: [
        "one_gadget avoids the need for multi-step ROP chains when register constraints are met.",
        "Adding the one_gadget offset to the calculated libc base provides the target return address."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{one_gadget}' or 'one_gadget'.",
        partialCredit: "Submits 'one-gadget' or 'onegadget'.",
        noCredit: "Submits ROPgadget or ropper."
      },
      acceptableAlternatives: ['HTG{one_gadget}', 'one_gadget', 'one-gadget', 'onegadget', 'HTG{one-gadget}']
    }
  },
  {
    stableId: 'HTG-L07-OE64',
    order: 64,
    levelNumber: 7,
    title: 'Seccomp BPF System Call Filtering Violation Signal',
    prompt: `To secure network services from remote code execution, developers implement Linux kernel Secure Computing mode with Berkeley Packet Filters (\`seccomp-bpf\`) to restrict allowable system calls.

When an exploited process attempts to invoke a forbidden system call (such as \`execve\` or \`fork\`), the seccomp filter triggers an immediate thread termination action (\`SECCOMP_RET_KILL_PROCESS\` or \`SECCOMP_RET_TRAP\`).

Under \`SECCOMP_RET_TRAP\`, what standard POSIX signal name (signal number 31) is delivered to the offending process?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the signal name).`,
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
    flag: 'HTG{SIGSYS}',
    hints: [
      {
        hintIndex: 1,
        content: "Signal number 31 is Bad System Call: SIGSYS.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE64',
      seedId: 'HTG-L07-OE64',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "SIGSYS (Signal 31) indicates an invalid system call, emitted by the kernel when a seccomp filter rule is violated.",
      essentialKeyPoints: [
        "seccomp sandboxes restrict accessible syscalls to open, read, write, and exit.",
        "When execve is filtered, attackers construct Open-Read-Write (ORW) shellcode or ROP chains."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SIGSYS}' or 'SIGSYS'.",
        partialCredit: "Submits lowercase 'sigsys'.",
        noCredit: "Submits SIGSEGV or SIGILL."
      },
      acceptableAlternatives: ['HTG{SIGSYS}', 'SIGSYS', 'sigsys', 'HTG{sigsys}']
    }
  },
  {
    stableId: 'HTG-L07-OE65',
    order: 65,
    levelNumber: 7,
    title: 'Heap Chunk Poisoning Tcache Bin Forensics',
    prompt: `In GNU C Library (glibc) version 2.26 and later, memory allocation performance was significantly boosted by introducing per-thread caching lists for allocations smaller than 1032 bytes.

Because these singly-linked lists initially lacked integrity checks (like double-free detection or pointer alignment verification), they became the primary target for "chunk poisoning" attacks that overwrite the forward (\`fd\`) pointer to allocate arbitrary memory addresses.

What 6-letter term designates this per-thread heap caching mechanism?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
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
    flag: 'HTG{tcache}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Thread Local Cache: tcache.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE65',
      seedId: 'HTG-L07-OE65',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "tcache (thread local cache) speeds up heap allocation by maintaining per-thread singly-linked lists of freed chunks.",
      essentialKeyPoints: [
        "tcache poisoning overwrites the next-chunk pointer to return arbitrary target addresses from malloc.",
        "Glibc 2.29+ introduced count limits and double-free mitigation in tcache structures."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{tcache}' or 'tcache'.",
        partialCredit: "Submits uppercase 'TCACHE' or 'Thread Cache'.",
        noCredit: "Submits fastbin or unsortedbin."
      },
      acceptableAlternatives: ['HTG{tcache}', 'tcache', 'TCACHE', 'Thread Cache', 'HTG{TCACHE}']
    }
  },
  {
    stableId: 'HTG-L07-OE66',
    order: 66,
    levelNumber: 7,
    title: 'Ret2CSU Universal Gadget __libc_csu_init Source',
    prompt: `In 64-bit x86-64 ELF executables compiled without PIE, finding specific gadgets to control registers like \`RDX\` can be difficult.

In 2018, security researchers documented a universal ROP technique (known as "ret2csu") that utilizes two cooperating gadgets residing inside a standard runtime initialization function linked into virtually every ELF binary:

\`\`\`assembly
__libc_csu_init:
  # Gadget 1: pops rbx, rbp, r12, r13, r14, r15
  # Gadget 2: sets rdx, rsi, edi and calls [r12 + rbx*8]
\`\`\`

What is the symbol name of this standard runtime initialization function?

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
    flag: 'HTG{__libc_csu_init}',
    hints: [
      {
        hintIndex: 1,
        content: "The symbol begins with double underscores: __libc_csu_init.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE66',
      seedId: 'HTG-L07-OE66',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "__libc_csu_init contains universal gadgets that enable controlling RDI, RSI, and RDX in non-PIE x86-64 binaries.",
      essentialKeyPoints: [
        "ret2csu solves the lack of 'pop rdx' gadgets in small binaries.",
        "Recent glibc versions have reorganized or eliminated __libc_csu_init to deprecate this attack surface."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{__libc_csu_init}' or '__libc_csu_init'.",
        partialCredit: "Submits 'libc_csu_init'.",
        noCredit: "Submits _start or __libc_start_main."
      },
      acceptableAlternatives: ['HTG{__libc_csu_init}', '__libc_csu_init', 'libc_csu_init', 'HTG{libc_csu_init}']
    }
  },
  {
    stableId: 'HTG-L07-OE67',
    order: 67,
    levelNumber: 7,
    title: 'Format String Parameter Index for Leak',
    prompt: `A 64-bit Linux program executes an unchecked format string call:

\`\`\`c
printf(user_buffer);
\`\`\`

Under the 64-bit System V AMD64 ABI, the first 5 parameters to \`printf\` are supplied via CPU registers:
1. RSI
2. RDX
3. RCX
4. R8
5. R9

Starting with the parameter immediately following these 5 register arguments, positional parameter specifiers (\`%<INDEX>$p\`) read directly from the top of the stack (\`RSP\`).

What 1-based decimal integer index specifier corresponds to the first word located on the stack?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer index).`,
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
    flag: 'HTG{6}',
    hints: [
      {
        hintIndex: 1,
        content: "5 arguments are in registers, so the 6th argument is on the stack: 6.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE67',
      seedId: 'HTG-L07-OE67',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "In 64-bit x86-64, arguments 1-5 come from registers (RSI, RDX, RCX, R8, R9), making %6$p the first value on the stack.",
      essentialKeyPoints: [
        "%6$p reads [RSP], %7$p reads [RSP+8], etc.",
        "Determining where user_buffer begins in the format stack allows arbitrary memory reading via %<INDEX>$s."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{6}' or '6'.",
        partialCredit: "Submits '%6$p' or '6th'.",
        noCredit: "Submits 1 or 5."
      },
      acceptableAlternatives: ['HTG{6}', '6', '%6$p', '6th']
    }
  },
  {
    stableId: 'HTG-L07-OE68',
    order: 68,
    levelNumber: 7,
    title: 'SROP Context Size in Bytes on Linux x86-64',
    prompt: `In Sigreturn-Oriented Programming (SROP) on 64-bit Linux, an attacker crafts a fake signal context frame on the stack.

When the \`rt_sigreturn\` system call executes, the Linux kernel reads the complete \`sigcontext\` structure containing all general-purpose registers, segment selectors, floating-point state, and flags.

On standard 64-bit Linux x86-64 kernels, what is the exact decimal byte size of this \`sigcontext\` / \`ucontext\` signal frame structure (occupying 31 eight-byte quadwords)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer byte count).`,
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
    flag: 'HTG{248}',
    hints: [
      {
        hintIndex: 1,
        content: "31 quadwords times 8 bytes per quadword equals 248 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE68',
      seedId: 'HTG-L07-OE68',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "On x86-64 Linux, sizeof(struct ucontext) and its signal frame is 248 bytes (0xF8 bytes).",
      essentialKeyPoints: [
        "SROP frames must match the exact 248-byte layout expected by the kernel rt_sigreturn handler.",
        "Tools like pwntools SigreturnFrame() automatically format this 248-byte structure."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{248}' or '248'.",
        partialCredit: "Submits '248 bytes' or '0xF8'.",
        noCredit: "Submits 128 or 512."
      },
      acceptableAlternatives: ['HTG{248}', '248', '248 bytes', '0xF8', '0xf8']
    }
  },
  {
    stableId: 'HTG-L07-OE69',
    order: 69,
    levelNumber: 7,
    title: 'Ret2dlresolve Symbol Resolution Function',
    prompt: `When an ELF binary is dynamically linked without Full RELRO, library functions are bound lazily upon first execution.

During the first call to an unresolved function, the PLT stub pushes a relocation index and branches into the dynamic linker's resolution handler:

\`\`\`assembly
.plt:
  jmp    qword ptr [got_entry]
  push   reloc_arg
  jmp    .plt_common
.plt_common:
  push   link_map
  jmp    [RESOLVER_FUNCTION]
\`\`\`

The \`ret2dlresolve\` attack crafts fake ELF symbol and relocation structures to trick this resolver into resolving arbitrary functions (like \`system\`) without an information leak.

What is the internal glibc dynamic loader function name that performs this runtime resolution?

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
    flag: 'HTG{_dl_runtime_resolve}',
    hints: [
      {
        hintIndex: 1,
        content: "The resolver symbol is _dl_runtime_resolve (or _dl_runtime_resolve_xsave).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE69',
      seedId: 'HTG-L07-OE69',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "_dl_runtime_resolve is the glibc loader function that parses relocation tables to bind dynamic symbols at runtime.",
      essentialKeyPoints: [
        "ret2dlresolve operates without library address leaks by abusing the dynamic linker's resolution logic.",
        "Full RELRO binds all symbols at startup, eliminating calls to _dl_runtime_resolve during program execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{_dl_runtime_resolve}' or '_dl_runtime_resolve'.",
        partialCredit: "Submits 'dl_runtime_resolve' or '_dl_runtime_resolve_xsave'.",
        noCredit: "Submits dlopen or dlsym."
      },
      acceptableAlternatives: ['HTG{_dl_runtime_resolve}', '_dl_runtime_resolve', 'dl_runtime_resolve', '_dl_runtime_resolve_xsave', 'HTG{dl_runtime_resolve}']
    }
  },
  {
    stableId: 'HTG-L07-OE70',
    order: 70,
    levelNumber: 7,
    title: 'Master Binary Exploitation Flag Token',
    prompt: `The binary exploitation and vulnerability analysis research track reaches completion:
- Stack frames, calling conventions, and memory layouts verified
- Memory boundary conditions and off-by-one vulnerabilities triaged
- Return address control and instruction pointer redirection analyzed
- Crash dumps, registers, and cyclic offsets evaluated in debuggers
- Modern mitigations (ASLR, NX, Canaries, PIE, RELRO, CET) audited
- Synthetic ROP chains, gadgets, and syscall sequences constructed
- Multi-step sandboxed analysis and protection models modeled

Upon validating the entire memory-safety curriculum, the lead security researcher signs off on the official Level 7 analysis token:

BUFFER_EXPLOITATION_ANALYZED

Submit the completed binary exploitation analysis token in standard competition flag format.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the token string (or submit the token string directly).`,
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
    flag: 'HTG{BUFFER_EXPLOITATION_ANALYZED}',
    hints: [
      {
        hintIndex: 1,
        content: "Prefix HTG with curly braces enclosing BUFFER_EXPLOITATION_ANALYZED.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE70',
      seedId: 'HTG-L07-OE70',
      subtopic: 'Multi-step sandboxed binary analysis and flag recovery',
      explanation: "Completes the Level 7 binary exploitation and memory safety analysis curriculum.",
      essentialKeyPoints: [
        "Memory corruption vulnerabilities stem from missing bounds checking and unchecked type conversions.",
        "Defense-in-depth combines compiler mitigations (canaries, PIE, RELRO), kernel defenses (ASLR), and hardware enforcement (CET)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{BUFFER_EXPLOITATION_ANALYZED}' or 'BUFFER_EXPLOITATION_ANALYZED'.",
        partialCredit: "Submits lowercase 'buffer_exploitation_analyzed'.",
        noCredit: "Submits incomplete or misspelled token."
      },
      acceptableAlternatives: ['HTG{BUFFER_EXPLOITATION_ANALYZED}', 'BUFFER_EXPLOITATION_ANALYZED', 'buffer_exploitation_analyzed', 'HTG{buffer_exploitation_analyzed}']
    }
  }
];

module.exports = subtopic7Questions;

