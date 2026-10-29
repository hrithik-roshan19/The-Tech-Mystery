const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L07-OE21',
    order: 21,
    levelNumber: 7,
    title: 'Total Offset to Return Address on 64-bit Stack Frame',
    prompt: `An analyst maps the stack frame layout of a vulnerable 64-bit function:

\`\`\`text
[RBP - 0x40 to RBP - 0x01] : 64-byte local input buffer
[RBP + 0x00 to RBP + 0x07] : 8-byte saved RBP (base pointer)
[RBP + 0x08 to RBP + 0x0F] : 8-byte saved return address (RIP)
\`\`\`

To hijack control flow, input data must fill the 64-byte local buffer, overwrite the 8-byte saved base pointer, and arrive at the start of the saved return address.

How many total bytes must precede the target return address in the input payload?

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
    flag: 'HTG{72}',
    hints: [
      {
        hintIndex: 1,
        content: "64 bytes (buffer) + 8 bytes (saved RBP) = 72 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE21',
      seedId: 'HTG-L07-OE21',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "Overwriting the saved return address requires 64 bytes of buffer fill plus 8 bytes for saved RBP, totaling 72 bytes.",
      essentialKeyPoints: [
        "In 64-bit x86 architecture, saved RBP occupies 8 bytes between local buffers and saved RIP.",
        "Accurate offset calculation prevents off-target memory corruption."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{72}' or '72'.",
        partialCredit: "Submits '72 bytes' or '0x48'.",
        noCredit: "Submits 64 or 80."
      },
      acceptableAlternatives: ['HTG{72}', '72', '72 bytes', '0x48']
    }
  },
  {
    stableId: 'HTG-L07-OE22',
    order: 22,
    levelNumber: 7,
    title: 'CPU Instruction Returning Execution to Caller',
    prompt: `When a function finishes execution, it must restore program flow to the caller. The call instruction previously placed the address of the next sequential instruction onto the stack.

During the epilogue, a dedicated 1-byte opcode instruction pops this saved memory address off the stack and writes it into the instruction pointer register (\`RIP\`).

What 3-letter assembly instruction performs this pop-and-jump operation?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the instruction mnemonic).`,
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
    flag: 'HTG{ret}',
    hints: [
      {
        hintIndex: 1,
        content: "The return instruction is 'ret'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE22',
      seedId: 'HTG-L07-OE22',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "'ret' pops the value currently at [RSP] and loads it into RIP, incrementing RSP by 8 bytes (on 64-bit).",
      essentialKeyPoints: [
        "'ret' transfers control to whatever address resides at the top of the stack.",
        "Buffer overflows corrupt the stack address read by 'ret', redirecting execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ret}' or 'ret'.",
        partialCredit: "Submits 'RET' or 'retq'.",
        noCredit: "Submits call or jmp."
      },
      acceptableAlternatives: ['HTG{ret}', 'ret', 'RET', 'retq', 'RETQ', 'HTG{retq}']
    }
  },
  {
    stableId: 'HTG-L07-OE23',
    order: 23,
    levelNumber: 7,
    title: '64-bit Instruction Pointer Register Name',
    prompt: `In the x86-64 architecture, program control flow is governed by a dedicated register that holds the virtual memory address of the next machine instruction to be fetched and executed by the CPU.

Overwriting the saved return address on the stack allows an attacker to dictate the value loaded into this register upon return.

What 3-letter register name designates the 64-bit instruction pointer?

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
    flag: 'HTG{rip}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for 64-bit Instruction Pointer: RIP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE23',
      seedId: 'HTG-L07-OE23',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "RIP is the 64-bit instruction pointer register in x86-64 (corresponding to EIP in 32-bit and IP in 16-bit).",
      essentialKeyPoints: [
        "RIP holds the address of the next instruction to execute.",
        "Controlling RIP is the objective of control-flow hijacking exploits."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rip}' or 'rip'.",
        partialCredit: "Submits uppercase 'RIP'.",
        noCredit: "Submits rsp or rbp."
      },
      acceptableAlternatives: ['HTG{rip}', 'rip', 'RIP', 'HTG{RIP}']
    }
  },
  {
    stableId: 'HTG-L07-OE24',
    order: 24,
    levelNumber: 7,
    title: 'Little-Endian Multi-Byte Address Encoding',
    prompt: `An analyst targets a utility function located at memory address:

\`\`\`text
Target Address: 0x00000000004011B6
\`\`\`

When constructing the binary exploit payload on x86-64 Linux, the target address bytes must be transmitted in ascending memory order starting with the least significant byte:

\`\`\`text
Payload Bytes: \\xb6\\x11\\x40\\x00\\x00\\x00\\x00\\x00
\`\`\`

Does this memory byte arrangement represent BIG-ENDIAN or LITTLE-ENDIAN representation?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the endianness name).`,
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
    flag: 'HTG{LITTLE-ENDIAN}',
    hints: [
      {
        hintIndex: 1,
        content: "Least significant byte first indicates little-endian format.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE24',
      seedId: 'HTG-L07-OE24',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "x86 and x86-64 use little-endian byte ordering, storing least significant bytes at lower memory addresses.",
      essentialKeyPoints: [
        "Little-endian places the least significant byte first (e.g. 0x4011B6 becomes \\xb6\\x11\\x40...).",
        "Payload pack functions (like p64 in pwntools) format integer addresses as little-endian bytes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{LITTLE-ENDIAN}' or 'LITTLE-ENDIAN'.",
        partialCredit: "Submits lowercase 'little-endian' or 'little endian'.",
        noCredit: "Submits big-endian or network byte order."
      },
      acceptableAlternatives: ['HTG{LITTLE-ENDIAN}', 'LITTLE-ENDIAN', 'little-endian', 'little endian', 'Little-Endian', 'HTG{little-endian}']
    }
  },
  {
    stableId: 'HTG-L07-OE25',
    order: 25,
    levelNumber: 7,
    title: '64-bit Canonical Address Upper Byte Boundary',
    prompt: `In current 48-bit virtual addressing implementations on x86-64 processors, addresses must be in "canonical form" (bits 48 through 63 must be identical to bit 47).

User-space virtual memory is mapped strictly within the lower half of the canonical address range:
\`0x0000000000000000\` to \`[UPPER_BOUND]\`

Attempting to load a non-canonical address (such as \`0x4141414141414141\`) into RIP triggers an immediate hardware General Protection Fault (\`#GP\`).

What is the highest canonical hexadecimal user-space address in standard 48-bit x86-64 virtual memory?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hexadecimal address with leading 0x).`,
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
    flag: 'HTG{0x00007fffffffffff}',
    hints: [
      {
        hintIndex: 1,
        content: "47 bits of 1s in hex is 0x7fffffffffff.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE25',
      seedId: 'HTG-L07-OE25',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "In 48-bit virtual addressing, 0x00007fffffffffff (128 TB) is the maximum user-space canonical address.",
      essentialKeyPoints: [
        "Addresses with bit 47 set to 0 have bits 48-63 set to 0 (user space up to 0x00007fffffffffff).",
        "Non-canonical addresses trigger General Protection Faults instead of standard page faults."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x00007fffffffffff}' or '0x00007fffffffffff'.",
        partialCredit: "Submits '0x7fffffffffff' or '7fffffffffff'.",
        noCredit: "Submits 0xffffffffffffffff."
      },
      acceptableAlternatives: ['HTG{0x00007fffffffffff}', '0x00007fffffffffff', '7fffffffffff', '0x7fffffffffff', 'HTG{0x7fffffffffff}']
    }
  },
  {
    stableId: 'HTG-L07-OE26',
    order: 26,
    levelNumber: 7,
    title: 'Overwriting Function Pointers in Virtual Method Tables',
    prompt: `In compiled C++ binaries, polymorphism and dynamic dispatch are implemented via an array of function pointers stored in read-only memory, referenced by a pointer placed inside each object instance:

\`\`\`text
Object Instance:
[0x00]: vptr ----> [ Virtual Function Table ]
[0x08]: data member  [0x00]: method_1()
                     [0x08]: method_2()
\`\`\`

If heap corruption allows an attacker to overwrite an object's \`vptr\` with a pointer to a synthetic array, calling a virtual method executes arbitrary code.

What common 6-letter technical term (or abbreviation) designates this virtual method table?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the table name).`,
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
    flag: 'HTG{vtable}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Virtual Table: vtable.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE26',
      seedId: 'HTG-L07-OE26',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "A vtable (virtual method table) contains pointers to virtual member functions for dynamic binding.",
      essentialKeyPoints: [
        "C++ objects contain a hidden pointer (vptr) pointing to their class's vtable.",
        "vtable hijacking redirects virtual function calls to attacker-controlled gadgets."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{vtable}' or 'vtable'.",
        partialCredit: "Submits uppercase 'VTABLE' or 'vtbl'.",
        noCredit: "Submits GOT or IAT."
      },
      acceptableAlternatives: ['HTG{vtable}', 'vtable', 'VTABLE', 'vtbl', 'HTG{vtbl}']
    }
  },
  {
    stableId: 'HTG-L07-OE27',
    order: 27,
    levelNumber: 7,
    title: 'Control Flow Hijack Target Address Calculation',
    prompt: `A static binary is loaded at fixed base address \`0x00400000\`. Reverse engineering the binary identifies an uncalled administrative diagnostic function \`print_secret()\`:

\`\`\`text
Base Address:       0x00400000
Function Offset:    0x00001256
\`\`\`

To hijack execution flow and trigger this routine, what absolute hexadecimal address must be loaded into the instruction pointer (\`RIP\`)?

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
    flag: 'HTG{0x401256}',
    hints: [
      {
        hintIndex: 1,
        content: "0x400000 + 0x1256 = 0x401256.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE27',
      seedId: 'HTG-L07-OE27',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "Adding the function offset (0x1256) to the base address (0x400000) gives 0x401256.",
      essentialKeyPoints: [
        "In non-PIE binaries, code sections reside at predictable fixed addresses.",
        "Overwriting saved RIP with the absolute function address redirects program flow."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x401256}' or '0x401256'.",
        partialCredit: "Submits '401256' or '0x00401256'.",
        noCredit: "Submits 0x400000 or 0x1256."
      },
      acceptableAlternatives: ['HTG{0x401256}', '0x401256', '401256', '0x00401256', 'HTG{401256}']
    }
  },
  {
    stableId: 'HTG-L07-OE28',
    order: 28,
    levelNumber: 7,
    title: 'Signal Handler Return Trampoline Function',
    prompt: `In Sigreturn-Oriented Programming (SROP), an attacker leverages the kernel's signal handling mechanism.

When a Linux process handles a signal, the kernel pushes the entire CPU register state (\`ucontext\`) onto the stack. Upon completion, the process executes a system call that restores all registers directly from the stack frame in a single operation.

What is the name of this Linux system call / signal trampoline used to restore register state?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the system call name).`,
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
    flag: 'HTG{sigreturn}',
    hints: [
      {
        hintIndex: 1,
        content: "The signal return syscall is named sigreturn (or rt_sigreturn).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE28',
      seedId: 'HTG-L07-OE28',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "sigreturn (and rt_sigreturn on x86-64) reads a sigcontext struct from the stack to restore all general registers, RIP, and RSP.",
      essentialKeyPoints: [
        "SROP uses a single sigreturn gadget (syscall 15) to populate every CPU register simultaneously.",
        "Forging a sigcontext struct on the stack allows setting RIP, RAX, RDI, RSI, and RDX in one step."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{sigreturn}' or 'sigreturn'.",
        partialCredit: "Submits 'rt_sigreturn' or uppercase.",
        noCredit: "Submits signal or kill."
      },
      acceptableAlternatives: ['HTG{sigreturn}', 'sigreturn', 'SIGRETURN', 'rt_sigreturn', 'HTG{rt_sigreturn}']
    }
  },
  {
    stableId: 'HTG-L07-OE29',
    order: 29,
    levelNumber: 7,
    title: 'Global Offset Table (GOT) Overwrite Mechanism',
    prompt: `ELF dynamic linking decouples compiled code from shared libraries using two interconnected tables:
1. Procedure Linkage Table (PLT): Stubs containing jump instructions.
2. [Data Segment Table]: Stores runtime absolute addresses for dynamically resolved library functions.

In binaries compiled with Partial RELRO, this data segment table remains writable during execution. Corrupting an entry (such as \`puts@got\`) redirects all subsequent calls to an attacker-specified function.

What 3-letter acronym designates this Global Offset Table?

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
    flag: 'HTG{GOT}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Global Offset Table: GOT.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE29',
      seedId: 'HTG-L07-OE29',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "The GOT (Global Offset Table) holds absolute addresses of resolved library symbols; overwriting it hijacks execution.",
      essentialKeyPoints: [
        "GOT overwrite is prevented by Full RELRO, which marks the table read-only after dynamic binding.",
        "In Partial RELRO, GOT entries can be overwritten via format string or write-what-where primitives."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GOT}' or 'GOT'.",
        partialCredit: "Submits lowercase 'got' or 'Global Offset Table'.",
        noCredit: "Submits PLT or BSS."
      },
      acceptableAlternatives: ['HTG{GOT}', 'GOT', 'got', 'Global Offset Table', 'HTG{got}']
    }
  },
  {
    stableId: 'HTG-L07-OE30',
    order: 30,
    levelNumber: 7,
    title: 'Indirect Call Hijacking via Register',
    prompt: `Disassembly of an event dispatch loop shows an indirect function invocation:

\`\`\`assembly
mov    rax, qword ptr [rbp - 0x10] ; Load handler address
call   rax                         ; Transfer execution
\`\`\`

If an attacker controls the memory at \`[rbp - 0x10]\`, the value loaded into \`rax\` directs execution when the call instruction executes.

Which assembly instruction performs this indirect control flow transfer using register \`rax\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the instruction text).`,
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
    flag: 'HTG{call rax}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the second instruction: call rax.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE30',
      seedId: 'HTG-L07-OE30',
      subtopic: 'Return addresses and control-flow analysis',
      explanation: "'call rax' pushes the next instruction address onto the stack and jumps to the address contained in RAX.",
      essentialKeyPoints: [
        "Indirect calls (call reg or call [mem]) are common targets for control-flow hijacking.",
        "Forward-edge Control Flow Integrity (CFI) validates indirect call targets before execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{call rax}' or 'call rax'.",
        partialCredit: "Submits 'CALL RAX' or 'call *%rax'.",
        noCredit: "Submits jmp rax."
      },
      acceptableAlternatives: ['HTG{call rax}', 'call rax', 'CALL RAX', 'call *%rax', 'HTG{call *%rax}']
    }
  }
];

module.exports = subtopic3Questions;

