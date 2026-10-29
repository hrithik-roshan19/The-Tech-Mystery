const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L07-OE01',
    order: 1,
    levelNumber: 7,
    title: 'x86-64 System V AMD64 ABI First Integer Argument Register',
    prompt: `A binary analyst inspects the disassembly of a 64-bit Linux executable prior to a library call:

\`\`\`assembly
mov    rdi, 0x402010
call   puts@plt
\`\`\`

The System V AMD64 ABI specifies standard register assignments for passing integer and pointer arguments into functions before overflowing to the stack:
- 1st argument: [Register]
- 2nd argument: RSI
- 3rd argument: RDX
- 4th argument: RCX
- 5th argument: R8
- 6th argument: R9

What 3-letter register name holds the first integer or pointer argument in this 64-bit calling convention?

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
        content: "Look at the instruction immediately before call puts@plt: mov rdi, ...",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE01',
      seedId: 'HTG-L07-OE01',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "Under the System V AMD64 ABI (standard for Linux/macOS x86-64), the first function parameter is passed in register RDI.",
      essentialKeyPoints: [
        "System V AMD64 ABI passes the first 6 integer/pointer arguments in RDI, RSI, RDX, RCX, R8, and R9.",
        "Understanding register conventions is required for ROP gadget chain construction."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rdi}' or 'rdi'.",
        partialCredit: "Submits uppercase 'RDI'.",
        noCredit: "Submits rsi or rax."
      },
      acceptableAlternatives: ['HTG{rdi}', 'rdi', 'RDI', 'HTG{RDI}']
    }
  },
  {
    stableId: 'HTG-L07-OE02',
    order: 2,
    levelNumber: 7,
    title: 'Direction of Stack Growth on Standard x86/x64 Hardware',
    prompt: `A debugger monitors stack pointer movements during consecutive function calls:

\`\`\`text
Initial RSP:     0x00007fffffffe000
push 0x12345678
New RSP:         0x00007fffffffdff8
\`\`\`

Pushing an 8-byte value onto the stack decrements the stack pointer address by 8 bytes.

Does the standard x86 and x86-64 hardware call stack grow UPWARD (toward higher memory addresses) or DOWNWARD (toward lower memory addresses)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the direction).`,
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
    flag: 'HTG{DOWNWARD}',
    hints: [
      {
        hintIndex: 1,
        content: "The address decreases from 0x...e000 to 0x...dff8, indicating downward growth.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE02',
      seedId: 'HTG-L07-OE02',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "On x86/x64 architectures, the stack grows downwards toward lower numerical memory addresses as items are pushed.",
      essentialKeyPoints: [
        "The call stack grows downward from high to low memory addresses.",
        "Local buffers fill upward toward higher memory, which allows buffer overflows to overwrite saved pointers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{DOWNWARD}' or 'DOWNWARD'.",
        partialCredit: "Submits lowercase 'downward' or 'down'.",
        noCredit: "Submits UPWARD or up."
      },
      acceptableAlternatives: ['HTG{DOWNWARD}', 'DOWNWARD', 'downward', 'HTG{downward}', 'DOWN', 'down']
    }
  },
  {
    stableId: 'HTG-L07-OE03',
    order: 3,
    levelNumber: 7,
    title: 'Standard Function Prologue Base Pointer Preservation',
    prompt: `Disassembly of a compiled C function preamble reveals the standard stack frame initialization sequence:

\`\`\`assembly
55                     push   rbp
48 89 e5               mov    rbp, rsp
48 83 ec 20            sub    rsp, 0x20
\`\`\`

The first instruction saves the caller's base pointer onto the stack before the current stack pointer is copied to establish the new frame boundary.

Which instruction mnemonic and operand performs this preservation step?

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
    flag: 'HTG{push rbp}',
    hints: [
      {
        hintIndex: 1,
        content: "The instruction pushes RBP: push rbp.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE03',
      seedId: 'HTG-L07-OE03',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "'push rbp' saves the caller's frame pointer so it can be restored by 'leave' or 'pop rbp' upon function exit.",
      essentialKeyPoints: [
        "Function prologues preserve the caller's frame pointer before allocating local variable space.",
        "Saved RBP sits immediately adjacent to the saved return address on the stack."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{push rbp}' or 'push rbp'.",
        partialCredit: "Submits 'push ebp' or uppercase.",
        noCredit: "Submits mov rbp, rsp."
      },
      acceptableAlternatives: ['HTG{push rbp}', 'push rbp', 'PUSH RBP', 'push ebp', 'HTG{push ebp}']
    }
  },
  {
    stableId: 'HTG-L07-OE04',
    order: 4,
    levelNumber: 7,
    title: 'Standard Stack Pointer Register Designation',
    prompt: `In the x86-64 architecture, register allocations define specific roles for execution management. The CPU maintains an internal pointer marking the top of the stack (the lowest currently allocated address).

When executing \`push\`, \`pop\`, \`call\`, and \`ret\` instructions, this register is modified automatically by the hardware.

What 3-letter register name designates the 64-bit stack pointer?

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
    flag: 'HTG{rsp}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for 64-bit Stack Pointer: RSP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE04',
      seedId: 'HTG-L07-OE04',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "RSP is the 64-bit stack pointer register on x86-64, automatically decremented on push and incremented on pop.",
      essentialKeyPoints: [
        "RSP tracks the top of the execution stack.",
        "Stack-based exploits manipulate memory relative to RSP and RBP."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rsp}' or 'rsp'.",
        partialCredit: "Submits uppercase 'RSP'.",
        noCredit: "Submits rbp or rip."
      },
      acceptableAlternatives: ['HTG{rsp}', 'rsp', 'RSP', 'HTG{RSP}']
    }
  },
  {
    stableId: 'HTG-L07-OE05',
    order: 5,
    levelNumber: 7,
    title: 'cdecl Calling Convention Stack Cleanup Responsibility',
    prompt: `In 32-bit x86 software development, calling conventions define how parameters are passed and how stack frames are cleaned up. Under the standard \`cdecl\` convention:

\`\`\`assembly
push   eax           ; Argument 2
push   ebx           ; Argument 1
call   calculate_sum ; Function call
add    esp, 8        ; Stack pointer restoration
\`\`\`

Because the \`add esp, 8\` instruction executes in the calling routine after the callee returns, stack cleanup is handled by the calling function.

Under \`cdecl\`, which entity (CALLER or CALLEE) holds responsibility for removing arguments from the stack?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the role).`,
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
    flag: 'HTG{CALLER}',
    hints: [
      {
        hintIndex: 1,
        content: "The calling code adds 8 to ESP, so the caller cleans the stack.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE05',
      seedId: 'HTG-L07-OE05',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "In cdecl, the caller cleans up the arguments from the stack, which allows variable-length argument lists like printf().",
      essentialKeyPoints: [
        "cdecl places stack cleanup on the caller.",
        "stdcall places stack cleanup on the callee via 'ret n'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CALLER}' or 'CALLER'.",
        partialCredit: "Submits lowercase 'caller'.",
        noCredit: "Submits CALLEE or callee."
      },
      acceptableAlternatives: ['HTG{CALLER}', 'CALLER', 'caller', 'HTG{caller}']
    }
  },
  {
    stableId: 'HTG-L07-OE06',
    order: 6,
    levelNumber: 7,
    title: 'System V AMD64 ABI Second Integer Argument Register',
    prompt: `An engineer constructs a synthetic payload to invoke \`write(1, buffer, 64)\` in 64-bit Linux:

\`\`\`assembly
mov    rdi, 1        ; fd = stdout
mov    rsi, 0x4040a0 ; buf pointer
mov    rdx, 64       ; count
call   write@plt
\`\`\`

The second function argument (\`buf\`) is passed directly in a 64-bit general-purpose register according to the System V AMD64 ABI.

What 3-letter register name designates the second argument register in this ABI?

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
    flag: 'HTG{rsi}',
    hints: [
      {
        hintIndex: 1,
        content: "RDI is first, RSI is second.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE06',
      seedId: 'HTG-L07-OE06',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "RSI is the second integer/pointer argument register in the System V AMD64 ABI.",
      essentialKeyPoints: [
        "System V AMD64 ABI ordering: RDI (1st), RSI (2nd), RDX (3rd).",
        "Controlling RSI is essential for multi-argument functions like write, read, and connect."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rsi}' or 'rsi'.",
        partialCredit: "Submits uppercase 'RSI'.",
        noCredit: "Submits rdi or rdx."
      },
      acceptableAlternatives: ['HTG{rsi}', 'rsi', 'RSI', 'HTG{RSI}']
    }
  },
  {
    stableId: 'HTG-L07-OE07',
    order: 7,
    levelNumber: 7,
    title: 'Standard Stack Alignment Boundary at Function Call in System V ABI',
    prompt: `Under the 64-bit System V AMD64 ABI, the stack pointer must satisfy a specific byte alignment boundary immediately prior to executing any \`call\` instruction.

If an attacker constructs a ROP chain where the stack is misaligned by 8 bytes, vector instructions (such as \`movaps\` inside \`printf\` or \`system\`) trigger an unhandled alignment fault (SIGSEGV) and crash the process.

To how many bytes must the stack pointer (\`RSP\`) be aligned before issuing a function call?

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
    flag: 'HTG{16}',
    hints: [
      {
        hintIndex: 1,
        content: "The ABI requires 16-byte stack alignment prior to a call instruction.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE07',
      seedId: 'HTG-L07-OE07',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "The System V AMD64 ABI mandates that RSP + 8 must be a multiple of 16 on function entry (meaning RSP is 16-byte aligned before call).",
      essentialKeyPoints: [
        "16-byte stack alignment is required for SSE instructions.",
        "Inserting a dummy 'ret' gadget in ROP chains is the standard fix for movaps stack misalignment."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{16}' or '16'.",
        partialCredit: "Submits '16 bytes'.",
        noCredit: "Submits 8 or 32."
      },
      acceptableAlternatives: ['HTG{16}', '16', '16 bytes', '16-byte']
    }
  },
  {
    stableId: 'HTG-L07-OE08',
    order: 8,
    levelNumber: 7,
    title: 'Function Epilogue Frame Teardown Instruction',
    prompt: `In compiler-generated function epilogues, the stack frame is dismantled prior to returning. Rather than emitting two separate instructions:

\`\`\`assembly
mov    rsp, rbp
pop    rbp
\`\`\`

compilers frequently emit a single 1-byte opcode (\`0xC9\`) that performs both actions atomically.

What single assembly instruction mnemonic performs this combined stack teardown?

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
    flag: 'HTG{leave}',
    hints: [
      {
        hintIndex: 1,
        content: "The mnemonic is 'leave'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE08',
      seedId: 'HTG-L07-OE08',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "The 'leave' instruction sets RSP to RBP and then pops the saved RBP from the stack.",
      essentialKeyPoints: [
        "'leave' restores the caller's stack frame in a single instruction.",
        "Overwriting saved RBP enables stack pivoting when a 'leave; ret' gadget executes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{leave}' or 'leave'.",
        partialCredit: "Submits uppercase 'LEAVE'.",
        noCredit: "Submits ret or pop."
      },
      acceptableAlternatives: ['HTG{leave}', 'leave', 'LEAVE', 'HTG{LEAVE}']
    }
  },
  {
    stableId: 'HTG-L07-OE09',
    order: 9,
    levelNumber: 7,
    title: 'Return Value Register for Integer Functions in x86-64',
    prompt: `A reverse engineer analyzes a calculation routine in an ELF binary:

\`\`\`assembly
compute_checksum:
    mov    eax, 0x1337
    ret
\`\`\`

When a function returns an integer or pointer value in the x86-64 architecture, the return value is placed in a designated primary accumulator register.

What 3-letter register name (or its 64-bit full name) holds function return values?

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
    flag: 'HTG{rax}',
    hints: [
      {
        hintIndex: 1,
        content: "The accumulator register: RAX (or EAX for 32-bit).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE09',
      seedId: 'HTG-L07-OE09',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "RAX (and EAX for 32-bit integers) is the standard return register in x86/x64 calling conventions.",
      essentialKeyPoints: [
        "Function return values are stored in RAX upon return.",
        "System call status and error codes are similarly returned in RAX."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{rax}' or 'rax'.",
        partialCredit: "Submits 'eax', 'RAX', or 'EAX'.",
        noCredit: "Submits rdi or rbx."
      },
      acceptableAlternatives: ['HTG{rax}', 'rax', 'RAX', 'eax', 'EAX', 'HTG{eax}']
    }
  },
  {
    stableId: 'HTG-L07-OE10',
    order: 10,
    levelNumber: 7,
    title: 'Microsoft x64 Calling Convention Shadow Store Size in Bytes',
    prompt: `In the Microsoft x64 calling convention (standard across 64-bit Windows), arguments are passed in RCX, RDX, R8, and R9.

Regardless of whether the target function takes parameters, the caller is required to reserve an area of stack space immediately preceding the return address known as "shadow space" (or home space), allowing the callee to spill register arguments to the stack if needed.

How many bytes of shadow space (4 eight-byte slots) must the caller allocate on the stack?

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
    flag: 'HTG{32}',
    hints: [
      {
        hintIndex: 1,
        content: "4 quadwords times 8 bytes per quadword equals 32 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE10',
      seedId: 'HTG-L07-OE10',
      subtopic: 'Stack frames, calling conventions, and memory layout',
      explanation: "Microsoft x64 requires 32 bytes (0x20 bytes) of shadow space allocated on the stack before every function call.",
      essentialKeyPoints: [
        "Windows x64 calling convention reserves 32 bytes of shadow store for the first 4 register parameters.",
        "Failure to allocate 32 bytes of shadow space causes stack corruption on Windows x64."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{32}' or '32'.",
        partialCredit: "Submits '32 bytes' or '0x20'.",
        noCredit: "Submits 16 or 64."
      },
      acceptableAlternatives: ['HTG{32}', '32', '32 bytes', '0x20']
    }
  }
];

module.exports = subtopic1Questions;
