const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    stableId: 'HTG-L05-OE11',
    order: 11,
    levelNumber: 5,
    title: 'Load Effective Address (LEA) Arithmetic Computation',
    prompt: `An analyst analyzes the following x86_64 instruction snippet:

\`\`\`nasm
; rbx is initialized to 0x1000
lea rax, [rbx + 4*8 + 0x20]
\`\`\`

Unlike \`mov\`, the \`lea\` (Load Effective Address) instruction calculates the address expression without dereferencing memory.

Calculate the resulting hexadecimal value loaded into \`rax\` (format as hex, e.g. 0x1040).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex string).`,
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
    flag: 'HTG{0x1040}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 0x1000 + (4 * 8) + 0x20 = 0x1000 + 32 + 32 = 0x1000 + 0x20 + 0x20 = 0x1040.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE11',
      seedId: 'HTG-L05-OE11',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "LEA evaluates the base-index-scale-displacement expression without accessing memory: 0x1000 + 32 (0x20) + 32 (0x20) = 0x1040.",
      essentialKeyPoints: [
        "LEA is commonly used by compilers for fast multi-operand integer arithmetic.",
        "LEA computes pointers without performing memory reads or generating segmentation faults."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x1040}', '0x1040', or '1040'.",
        partialCredit: "Submits decimal '4160'.",
        noCredit: "Submits unscaled result."
      },
      acceptableAlternatives: ['HTG{0x1040}', '0x1040', '1040', '0X1040', '4160', 'HTG{1040}']
    }
  },
  {
    stableId: 'HTG-L05-OE12',
    order: 12,
    levelNumber: 5,
    title: 'Register Zeroing Idiom via Bitwise XOR',
    prompt: `In compiled assembly binaries, compilers frequently emit the instruction:

\`\`\`nasm
xor eax, eax
\`\`\`

In addition to clearing \`eax\`, writing to a 32-bit subregister in x86_64 automatically zero-extends into the upper 32 bits of the corresponding 64-bit register (\`rax\`).

What integer value is present in the full 64-bit \`rax\` register after this instruction completes?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 0).`,
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
    flag: 'HTG{0}',
    hints: [
      {
        hintIndex: 1,
        content: "Any number XORed with itself results in zero.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE12',
      seedId: 'HTG-L05-OE12',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "XORing a register with itself clears all bits to 0. In x86_64, writing to 32-bit eax zeroes the upper 32 bits of rax as well.",
      essentialKeyPoints: [
        "xor eax, eax is preferred over mov eax, 0 because its opcode encoding is shorter (2 bytes vs 5 bytes).",
        "Modern CPUs recognize xor reg, reg as a zeroing idiom and clear registers without execution latency."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits 'zero'.",
        noCredit: "Submits non-zero integers."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'zero']
    }
  },
  {
    stableId: 'HTG-L05-OE13',
    order: 13,
    levelNumber: 5,
    title: 'Zero Flag Status and Jump if Zero Control Flow Evaluation',
    prompt: `An analyst traces the execution flow of the following conditional branch logic:

\`\`\`nasm
mov rax, 0
test rax, rax
jz loc_success
loc_fail:
  ; failure path
loc_success:
  ; success path
\`\`\`

The \`test\` instruction performs a bitwise logical AND between the two operands and sets the Zero Flag (\`ZF\`) if the result is zero.

Determine whether the conditional jump \`jz\` is TAKEN or NOT_TAKEN.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the word TAKEN).`,
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
    flag: 'HTG{TAKEN}',
    hints: [
      {
        hintIndex: 1,
        content: "0 AND 0 is 0, so ZF is set to 1. jz checks if ZF==1, so the branch is taken.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE13',
      seedId: 'HTG-L05-OE13',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "test rax, rax tests if rax is zero. When rax is 0, ZF is set to 1, causing jz (jump if zero) to branch (TAKEN).",
      essentialKeyPoints: [
        "test reg, reg evaluates register sign and zero status without modifying the register.",
        "jz and je evaluate the exact same CPU condition flag (ZF=1)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{TAKEN}' or 'TAKEN'.",
        partialCredit: "Submits lowercase 'taken' or 'YES'.",
        noCredit: "Submits NOT_TAKEN or NO."
      },
      acceptableAlternatives: ['HTG{TAKEN}', 'TAKEN', 'taken', 'YES', 'yes', 'TRUE', 'true']
    }
  },
  {
    stableId: 'HTG-L05-OE14',
    order: 14,
    levelNumber: 5,
    title: 'System V AMD64 ABI First Argument Register Standard',
    prompt: `Under the standard System V AMD64 ABI calling convention utilized by Linux, macOS, and FreeBSD for x86_64 architectures, integer and pointer arguments are passed in designated registers:

1. First Argument:  [REDACTED]
2. Second Argument: %rsi
3. Third Argument:  %rdx
4. Fourth Argument: %rcx
5. Fifth Argument:   %r8
6. Sixth Argument:   %r9

Identify the 3-letter general-purpose register designated to hold the first function argument (e.g. rdi).

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
    flag: 'HTG{rdi}',
    hints: [
      {
        hintIndex: 1,
        content: "The first argument register is RDI (%rdi).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE14',
      seedId: 'HTG-L05-OE14',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "System V AMD64 ABI passes arguments in order: RDI, RSI, RDX, RCX, R8, R9. The first argument register is RDI.",
      essentialKeyPoints: [
        "Calling conventions standardize parameter passing across compilers and shared libraries.",
        "Knowledge of argument registers is essential for reverse engineering API parameters and writing ROP chains."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rdi}' or 'rdi'.",
        partialCredit: "Submits uppercase 'RDI' or '%rdi'.",
        noCredit: "Submits Windows first argument register rcx."
      },
      acceptableAlternatives: ['HTG{rdi}', 'rdi', 'RDI', '%rdi', 'HTG{RDI}']
    }
  },
  {
    stableId: 'HTG-L05-OE15',
    order: 15,
    levelNumber: 5,
    title: 'x86_64 Stack Pointer Movement on 64-bit Push',
    prompt: `An analyst traces the function prologue in an x86_64 binary:

\`\`\`nasm
push rbp
mov rbp, rsp
sub rsp, 0x20
\`\`\`

The call stack on x86 architectures grows downward toward lower memory addresses. When a 64-bit register is pushed onto the stack via \`push rbp\`, by how many bytes does the stack pointer \`rsp\` decrement?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer bytes, e.g. 8).`,
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
    flag: 'HTG{8}',
    hints: [
      {
        hintIndex: 1,
        content: "A 64-bit quadword is 8 bytes wide.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE15',
      seedId: 'HTG-L05-OE15',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "In 64-bit mode, default operand size for push is 64 bits (8 bytes), decrementing rsp by 8.",
      essentialKeyPoints: [
        "The stack pointer decrements on push and increments on pop.",
        "Stack alignment in modern 64-bit ABIs requires rsp to be 16-byte aligned before call instructions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{8}' or '8'.",
        partialCredit: "Submits '8 bytes'.",
        noCredit: "Submits 4 or 16."
      },
      acceptableAlternatives: ['HTG{8}', '8', '8 bytes']
    }
  },
  {
    stableId: 'HTG-L05-OE16',
    order: 16,
    levelNumber: 5,
    title: 'Signed Comparison Jump if Greater RFLAGS Condition',
    prompt: `A reverse engineer analyzes the condition flags governing the signed jump instruction \`jg\` (Jump if Greater):

\`\`\`nasm
cmp eax, ebx
jg loc_success
\`\`\`

The \`jg\` instruction branches if and only if:
1. The Zero Flag (\`ZF\`) is 0 (meaning eax != ebx)
2. The Sign Flag (\`SF\`) equals the Overflow Flag (\`OF\`)

Submit the 5-character mathematical condition expressing that the Sign Flag equals the Overflow Flag (format: \`SF=OF\`).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the condition string).`,
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
    flag: 'HTG{SF=OF}',
    hints: [
      {
        hintIndex: 1,
        content: "The condition string is 'SF=OF'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE16',
      seedId: 'HTG-L05-OE16',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "Signed comparisons evaluate SF and OF. When SF equals OF, no unexpected sign inversion occurred, indicating greater-than (when ZF=0).",
      essentialKeyPoints: [
        "Signed jumps (jg, jl) evaluate SF and OF; unsigned jumps (ja, jb) evaluate CF and ZF.",
        "Distinguishing signed vs unsigned jumps reveals original variable types in source code."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SF=OF}' or 'SF=OF'.",
        partialCredit: "Submits 'SF == OF' or lowercase 'sf=of'.",
        noCredit: "Submits unsigned condition CF=0."
      },
      acceptableAlternatives: ['HTG{SF=OF}', 'SF=OF', 'SF == OF', 'sf=of', 'sf==of']
    }
  },
  {
    stableId: 'HTG-L05-OE17',
    order: 17,
    levelNumber: 5,
    title: 'Arithmetic Shift Right (SAR) Sign Bit Propagation',
    prompt: `A 32-bit register \`eax\` contains the signed negative hexadecimal value:

\`\`\`text
eax = 0x80000000
\`\`\`

The instruction \`sar eax, 1\` performs an Arithmetic Shift Right by 1 position. Unlike \`shr\` which shifts in zeroes, \`sar\` replicates the most significant sign bit (MSB).

Calculate the resulting 32-bit hexadecimal value stored in \`eax\` after the shift.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex value, e.g. 0xC0000000).`,
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
    flag: 'HTG{0xC0000000}',
    hints: [
      {
        hintIndex: 1,
        content: "Binary: 1000... shifted right arithmetically becomes 1100... which in hex is 0xC0000000.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE17',
      seedId: 'HTG-L05-OE17',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "SAR preserves sign by filling vacated MSBs with the sign bit. Shifting 0x80000000 right by 1 bit yields 0xC0000000.",
      essentialKeyPoints: [
        "SAR is used for signed integer division by powers of two.",
        "SHR is used for unsigned bit shifting and zero-fills the MSB."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xC0000000}', '0xC0000000', or 'C0000000'.",
        partialCredit: "Submits lowercase '0xc0000000'.",
        noCredit: "Submits unsigned shift result 0x40000000."
      },
      acceptableAlternatives: [
        'HTG{0xC0000000}',
        '0xC0000000',
        'C0000000',
        '0xc0000000',
        'c0000000',
        'HTG{c0000000}'
      ]
    }
  },
  {
    stableId: 'HTG-L05-OE18',
    order: 18,
    levelNumber: 5,
    title: 'Microsoft x64 Calling Convention Second Argument Register',
    prompt: `Under Microsoft Windows x64 fastcall calling convention specifications, function parameters are passed in specific 64-bit registers:

1. First Argument:  rcx
2. Second Argument: [REDACTED]
3. Third Argument:  r8
4. Fourth Argument: r9

Identify the 3-letter general-purpose register designated to pass the second argument to a function in Windows 64-bit binaries (e.g. rdx).

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
    flag: 'HTG{rdx}',
    hints: [
      {
        hintIndex: 1,
        content: "The register is RDX (%rdx).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE18',
      seedId: 'HTG-L05-OE18',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "Microsoft x64 calling convention uses RCX, RDX, R8, R9 for the first four integer/pointer arguments. The second register is RDX.",
      essentialKeyPoints: [
        "Windows x64 differs from System V ABI by using RCX, RDX, R8, R9 instead of RDI, RSI, RDX, RCX, R8, R9.",
        "Windows x64 also requires a 32-byte shadow space (spill area) allocated on the stack."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rdx}' or 'rdx'.",
        partialCredit: "Submits uppercase 'RDX'.",
        noCredit: "Submits System V second argument register rsi."
      },
      acceptableAlternatives: ['HTG{rdx}', 'rdx', 'RDX', 'HTG{RDX}']
    }
  },
  {
    stableId: 'HTG-L05-OE19',
    order: 19,
    levelNumber: 5,
    title: 'RIP-Relative Addressing Effective Target Calculation',
    prompt: `In position-independent 64-bit code, an instruction at memory address \`0x401050\` references global data:

\`\`\`nasm
0x401050: 48 8b 05 20 00 00 00    mov rax, [rip + 0x20]
\`\`\`

The instruction length is 7 bytes. During execution of RIP-relative addressing, the base pointer \`rip\` points to the address of the immediately following instruction (\`0x401050 + 7 = 0x401057\`).

Calculate the absolute virtual target address referenced by \`[rip + 0x20]\`.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex address, e.g. 0x401077).`,
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
    flag: 'HTG{0x401077}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 0x401057 + 0x20 = 0x401077.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE19',
      seedId: 'HTG-L05-OE19',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "In x86_64, RIP-relative displacement is added to the address of the next instruction: 0x401050 + 7 bytes = 0x401057. Target = 0x401057 + 0x20 = 0x401077.",
      essentialKeyPoints: [
        "RIP-relative addressing enables Position Independent Executables (PIE).",
        "Displacement is always calculated relative to the start of the next instruction."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x401077}', '0x401077', or '401077'.",
        partialCredit: "Submits lowercase '0x401077'.",
        noCredit: "Submits address without adding instruction length (0x401070)."
      },
      acceptableAlternatives: ['HTG{0x401077}', '0x401077', '401077', '0x00401077', 'HTG{401077}']
    }
  },
  {
    stableId: 'HTG-L05-OE20',
    order: 20,
    levelNumber: 5,
    title: 'Near Return Instruction Control Flow Register Restoration',
    prompt: `An analyst analyzes the control flow transition of the x86 near return instruction:

\`\`\`nasm
ret
\`\`\`

When \`ret\` executes, the CPU pops the top quadword off the call stack (\`[rsp]\`), increments \`rsp\` by 8, and transfers execution control flow by loading the popped return address into which instruction pointer register?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the register name, e.g. rip).`,
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
        content: "The 64-bit instruction pointer is RIP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE20',
      seedId: 'HTG-L05-OE20',
      subtopic: 'Assembly instructions, registers, and control flow',
      explanation: "The ret instruction pops the saved return address from the stack into the instruction pointer register (RIP in 64-bit mode, EIP in 32-bit mode).",
      essentialKeyPoints: [
        "Control flow hijacking targets the saved return address on the stack.",
        "Overwriting stack return addresses redirects RIP execution to attacker-controlled gadgets."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rip}' or 'rip'.",
        partialCredit: "Submits uppercase 'RIP' or 32-bit 'eip'.",
        noCredit: "Submits stack pointer rsp or base pointer rbp."
      },
      acceptableAlternatives: ['HTG{rip}', 'rip', 'RIP', 'eip', 'EIP', 'HTG{RIP}']
    }
  }
];

module.exports = subtopic2Questions;

