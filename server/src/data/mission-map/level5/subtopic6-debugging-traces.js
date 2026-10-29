const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L05-OE51',
    order: 51,
    levelNumber: 5,
    title: 'Windows PEB BeingDebugged Flag Offset',
    prompt: `In Windows 64-bit anti-reverse engineering techniques, executables frequently inspect their own Process Environment Block (PEB) directly without calling the Win32 API \`IsDebuggerPresent()\`:

\`\`\`nasm
mov rax, gs:[0x60]       ; rax = pointer to PEB
movzx eax, byte ptr [rax + 0x02] ; eax = BeingDebugged flag
test eax, eax
jnz loc_debugger_detected
\`\`\`

At what hexadecimal byte offset from the base of the 64-bit PEB structure is the \`BeingDebugged\` flag located (e.g. 0x02)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex offset).`,
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
    flag: 'HTG{0x02}',
    hints: [
      {
        hintIndex: 1,
        content: "The offset is 0x02 in both 32-bit and 64-bit PEB structures.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE51',
      seedId: 'HTG-L05-OE51',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "In Windows, PEB.BeingDebugged is located at byte offset 0x02. If non-zero, a user-mode debugger is attached to the process.",
      essentialKeyPoints: [
        "Direct PEB inspection bypasses API hooks on IsDebuggerPresent.",
        "ScyllaHide and modern debuggers patch PEB.BeingDebugged to 0 to bypass anti-debugging."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x02}', '0x02', or '2'.",
        partialCredit: "Submits '0x2'.",
        noCredit: "Submits PEB segment offset 0x60."
      },
      acceptableAlternatives: ['HTG{0x02}', '0x02', '2', '0x2', 'HTG{2}']
    }
  },
  {
    stableId: 'HTG-L05-OE52',
    order: 52,
    levelNumber: 5,
    title: 'Linux Anti-Debugging PTRACE_TRACEME Macro Constant',
    prompt: `A Linux binary implements anti-debugging detection in its initialization logic:

\`\`\`c
if (ptrace(PTRACE_TRACEME, 0, 1, 0) < 0) {
    printf("Debugger detected! Terminating.\\n");
    exit(1);
}
\`\`\`

A process can only be traced by one parent process at a time. If a debugger (such as GDB) is already attached, the request fails with \`-1\` (\`EPERM\`).

In the Linux \`<sys/ptrace.h>\` header, what uppercase symbolic macro name represents request code \`0\` used by a child process to request tracing?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the macro name, e.g. PTRACE_TRACEME).`,
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
    flag: 'HTG{PTRACE_TRACEME}',
    hints: [
      {
        hintIndex: 1,
        content: "The macro name is 'PTRACE_TRACEME'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE52',
      seedId: 'HTG-L05-OE52',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "PTRACE_TRACEME (value 0) requests that the parent process trace this process. If already traced by GDB, the call returns -1, alerting the program.",
      essentialKeyPoints: [
        "PTRACE_TRACEME is a standard Linux anti-debugging check.",
        "Bypassing requires patching the ptrace call or intercepting via LD_PRELOAD."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PTRACE_TRACEME}' or 'PTRACE_TRACEME'.",
        partialCredit: "Submits lowercase 'ptrace_traceme'.",
        noCredit: "Submits ptrace without macro constant."
      },
      acceptableAlternatives: ['HTG{PTRACE_TRACEME}', 'PTRACE_TRACEME', 'ptrace_traceme', 'HTG{ptrace_traceme}']
    }
  },
  {
    stableId: 'HTG-L05-OE53',
    order: 53,
    levelNumber: 5,
    title: 'GDB Register State Addition Execution',
    prompt: `An analyst inspects CPU registers at a breakpoint in GDB:

\`\`\`text
(gdb) info registers rax rbx
rax            0x42                66
rbx            0x08                8
\`\`\`

The next instruction to execute is:
\`\`\`nasm
add rax, rbx
\`\`\`

Calculate the resulting decimal integer value stored in \`rax\` after this instruction completes (hint: 66 + 8).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 74).`,
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
    flag: 'HTG{74}',
    hints: [
      {
        hintIndex: 1,
        content: "0x42 is 66 in decimal. 66 + 8 = 74 (0x4A in hex).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE53',
      seedId: 'HTG-L05-OE53',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "rax contains 0x42 (66 decimal), rbx contains 8. 66 + 8 = 74 (0x4A).",
      essentialKeyPoints: [
        "Tracking register values at breakpoints validates dynamic program state.",
        "GDB prints register contents in both hexadecimal and decimal representations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{74}' or '74'.",
        partialCredit: "Submits hex '0x4A' or '0x4a'.",
        noCredit: "Submits original register values 66 or 8."
      },
      acceptableAlternatives: ['HTG{74}', '74', '0x4A', '0x4a', '4A']
    }
  },
  {
    stableId: 'HTG-L05-OE54',
    order: 54,
    levelNumber: 5,
    title: 'Stack Frame Local Variable Base Pointer Offset',
    prompt: `A disassembler highlights the following local variable assignment in a function stack frame:

\`\`\`nasm
mov dword ptr [rbp - 0x18], 0x1337
\`\`\`

The stack grows downward, and local variables are addressed using negative displacements from the base pointer \`rbp\`.

How many bytes in decimal format below the base pointer \`rbp\` is this local variable stored (convert 0x18 to decimal)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer bytes, e.g. 24).`,
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
    flag: 'HTG{24}',
    hints: [
      {
        hintIndex: 1,
        content: "0x18 in decimal is 1 * 16 + 8 = 24.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE54',
      seedId: 'HTG-L05-OE54',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "Hexadecimal 0x18 equals 24 in decimal. The variable resides 24 bytes below the frame base pointer.",
      essentialKeyPoints: [
        "Local stack variables are referenced at negative offsets from RBP.",
        "Understanding stack offsets is critical for calculating buffer overflow distances."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{24}' or '24'.",
        partialCredit: "Submits '24 bytes'.",
        noCredit: "Submits literal hex 18."
      },
      acceptableAlternatives: ['HTG{24}', '24', '24 bytes']
    }
  },
  {
    stableId: 'HTG-L05-OE55',
    order: 55,
    levelNumber: 5,
    title: 'Binary Patching Conditional Jump Inversion Opcode',
    prompt: `An analyst patches a binary to invert a license check. The original instruction is a short Jump if Equal (\`JE\` / \`JZ\`):

\`\`\`text
Original Opcode: 0x74 (JE rel8)
\`\`\`

To force the branch to jump when values are not equal, the analyst replaces opcode \`0x74\` with the single-byte opcode representing short Jump if Not Equal (\`JNE\` / \`JNZ\`).

What is the 2-character hexadecimal opcode for short \`JNE\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex opcode, e.g. 0x75).`,
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
    flag: 'HTG{0x75}',
    hints: [
      {
        hintIndex: 1,
        content: "JE is 0x74, JNE is 0x75.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE55',
      seedId: 'HTG-L05-OE55',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "Opcode 0x74 encodes short JE/JZ; opcode 0x75 encodes short JNE/JNZ. Inverting 74 to 75 reverses branch behavior.",
      essentialKeyPoints: [
        "Binary patching flips conditional branches to bypass validation gates.",
        "Single-byte opcode substitutions preserve surrounding instruction offsets."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x75}', '0x75', or '75'.",
        partialCredit: "Submits uppercase '0X75'.",
        noCredit: "Submits NOP opcode 0x90."
      },
      acceptableAlternatives: ['HTG{0x75}', '0x75', '75', '0X75', 'HTG{75}']
    }
  },
  {
    stableId: 'HTG-L05-OE56',
    order: 56,
    levelNumber: 5,
    title: 'Short Jump NOP-Out Byte Count Calculation',
    prompt: `A reverse engineer patches an unwanted security validation branch in a binary on disk:

\`\`\`nasm
0x401200: 74 08    je 0x40120a
\`\`\`

To neutralize the conditional jump so execution flows unconditionally into the next instruction, the engineer replaces the entire instruction with \`NOP\` instructions (\`0x90\`).

How many \`0x90\` NOP bytes must be written to replace the 2-byte short jump instruction completely?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 2).`,
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
        content: "The instruction '74 08' is exactly 2 bytes long: 0x90 0x90.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE56',
      seedId: 'HTG-L05-OE56',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "A short jump '74 <disp8>' is 2 bytes long. Replacing it requires writing exactly two 0x90 NOP bytes.",
      essentialKeyPoints: [
        "NOP-padding must match the exact length of the original instruction to prevent instruction misalignment.",
        "Misaligned instruction streams cause invalid opcode exceptions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2}' or '2'.",
        partialCredit: "Submits text 'two'.",
        noCredit: "Submits displacement 8."
      },
      acceptableAlternatives: ['HTG{2}', '2', 'two']
    }
  },
  {
    stableId: 'HTG-L05-OE57',
    order: 57,
    levelNumber: 5,
    title: 'x86 Hardware Debug Register Zero Identification',
    prompt: `Unlike software breakpoints that modify memory with \`0xCC\`, hardware breakpoints use dedicated CPU on-chip debug registers to halt execution on instruction fetch, data read, or data write without altering binary bytes on disk or in memory.

x86 processors support four hardware debug address registers: \`DR0\`, \`DR1\`, \`DR2\`, and \`DR3\`.

What is the 3-character register name for the first hardware debug address register (e.g. DR0)?

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
    flag: 'HTG{DR0}',
    hints: [
      {
        hintIndex: 1,
        content: "The first debug register is DR0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE57',
      seedId: 'HTG-L05-OE57',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "Debug registers DR0-DR3 store linear memory addresses for hardware breakpoints. DR6 is the status register and DR7 is the control register.",
      essentialKeyPoints: [
        "Hardware breakpoints enable break-on-access (watchpoints) without modifying process memory.",
        "Anti-debugging routines query GetThreadContext to detect non-zero DR0-DR3 registers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{DR0}' or 'DR0'.",
        partialCredit: "Submits lowercase 'dr0'.",
        noCredit: "Submits control register DR7."
      },
      acceptableAlternatives: ['HTG{DR0}', 'DR0', 'dr0', 'HTG{dr0}']
    }
  },
  {
    stableId: 'HTG-L05-OE58',
    order: 58,
    levelNumber: 5,
    title: 'Return-Oriented Programming (ROP) Gadget Ret Opcode',
    prompt: `A binary exploitation researcher locates a Return-Oriented Programming (ROP) gadget in \`libc.so.6\`:

\`\`\`nasm
0x000000000002155f: pop rdi ; ret
\`\`\`

Machine code bytes:
\`\`\`text
5F C3
\`\`\`

The byte \`0x5F\` encodes \`pop rdi\`. What single-byte hexadecimal opcode represents the terminating near \`ret\` instruction that transfers control to the next pointer on the stack?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex byte, e.g. 0xC3).`,
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
    flag: 'HTG{0xC3}',
    hints: [
      {
        hintIndex: 1,
        content: "The near return opcode is 0xC3.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE58',
      seedId: 'HTG-L05-OE58',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "Opcode 0xC3 encodes near ret. ROP gadgets consist of short instruction sequences ending in ret (0xC3).",
      essentialKeyPoints: [
        "ROP bypasses Data Execution Prevention (DEP / W^X) by chaining existing code fragments.",
        "Gadget discovery tools (ROPgadget, ropper) search for useful sequences ending in 0xC3."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xC3}', '0xC3', or 'C3'.",
        partialCredit: "Submits lowercase '0xc3' or 'c3'.",
        noCredit: "Submits pop opcode 0x5F."
      },
      acceptableAlternatives: ['HTG{0xC3}', '0xC3', 'C3', '0xc3', 'c3', 'HTG{C3}']
    }
  },
  {
    stableId: 'HTG-L05-OE59',
    order: 59,
    levelNumber: 5,
    title: 'Timing Check Anti-Debugging RDTSC Instruction Mnemonic',
    prompt: `An obfuscated packer detects single-stepping debuggers by measuring elapsed CPU clock cycles across code blocks:

\`\`\`nasm
rdtsc                    ; read time-stamp counter into edx:eax
mov esi, eax             ; save start cycles
; ... target code ...
rdtsc                    ; read time-stamp counter again
sub eax, esi             ; compute elapsed cycles
cmp eax, 0xFFFFF         ; compare against threshold
ja loc_debugger_detected
\`\`\`

What is the 5-letter uppercase mnemonic of the x86 instruction that reads the 64-bit CPU cycle Time-Stamp Counter into registers \`edx:eax\` (e.g. RDTSC)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the mnemonic).`,
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
    flag: 'HTG{RDTSC}',
    hints: [
      {
        hintIndex: 1,
        content: "The instruction is RDTSC (Read Time-Stamp Counter).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE59',
      seedId: 'HTG-L05-OE59',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "RDTSC reads the internal CPU cycle counter. Significant cycle spikes between consecutive instructions indicate human debugging or hypervisor intervention.",
      essentialKeyPoints: [
        "Timing checks are prevalent anti-analysis techniques in malware.",
        "Analysis environments spoof or normalize RDTSC returns to evade detection."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RDTSC}' or 'RDTSC'.",
        partialCredit: "Submits lowercase 'rdtsc'.",
        noCredit: "Submits Sleep or GetTickCount."
      },
      acceptableAlternatives: ['HTG{RDTSC}', 'RDTSC', 'rdtsc', 'HTG{rdtsc}']
    }
  },
  {
    stableId: 'HTG-L05-OE60',
    order: 60,
    levelNumber: 5,
    title: 'Segmentation Fault Crash Signal POSIX Macro',
    prompt: `During dynamic fuzzing of an ELF executable, the program attempts to write to a read-only memory page (\`0x0000000000400000\`), triggering CPU exception 14 (Page Fault).

The Linux kernel terminates the process and emits POSIX signal 11, dumping a core file.

What standard uppercase POSIX signal macro name corresponds to signal 11 (representing a Segmentation Violation / Fault)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the signal name, e.g. SIGSEGV).`,
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
    flag: 'HTG{SIGSEGV}',
    hints: [
      {
        hintIndex: 1,
        content: "Signal 11 is SIGSEGV (Segmentation Violation).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE60',
      seedId: 'HTG-L05-OE60',
      subtopic: 'Debugging traces and program-state reconstruction',
      explanation: "Signal 11 is SIGSEGV, generated when a process accesses invalid memory addresses or violates page permission flags.",
      essentialKeyPoints: [
        "SIGSEGV indicates unhandled memory access violations.",
        "Analyzing core dumps from SIGSEGV crashes reveals register states and crash triage vectors."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SIGSEGV}' or 'SIGSEGV'.",
        partialCredit: "Submits lowercase 'sigsegv' or 'SEGV'.",
        noCredit: "Submits SIGABRT (signal 6) or SIGBUS (signal 7)."
      },
      acceptableAlternatives: ['HTG{SIGSEGV}', 'SIGSEGV', 'sigsegv', 'SEGV', 'HTG{sigsegv}']
    }
  }
];

module.exports = subtopic6Questions;

