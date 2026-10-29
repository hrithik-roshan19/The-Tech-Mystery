const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L07-OE51',
    order: 51,
    levelNumber: 7,
    title: 'Return-Oriented Programming Acronym',
    prompt: `When memory protections like NX/DEP prevent execution of injected machine code on the stack or heap, security researchers construct execution chains by stringing together short snippets of existing executable instructions that end with a \`ret\` instruction.

By placing a sequence of addresses on the stack, each gadget executes a small operation and returns to the next gadget in the chain.

What 3-letter acronym designates Return-Oriented Programming?

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
    flag: 'HTG{ROP}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Return-Oriented Programming: ROP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE51',
      seedId: 'HTG-L07-OE51',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "ROP (Return-Oriented Programming) chains existing code sequences ending in 'ret' to bypass NX/DEP.",
      essentialKeyPoints: [
        "ROP reuses existing executable code without introducing new instructions.",
        "Each gadget performs a register manipulation or memory access before returning."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ROP}' or 'ROP'.",
        partialCredit: "Submits lowercase 'rop' or 'Return Oriented Programming'.",
        noCredit: "Submits JOP or COP."
      },
      acceptableAlternatives: ['HTG{ROP}', 'ROP', 'rop', 'Return Oriented Programming', 'HTG{rop}']
    }
  },
  {
    stableId: 'HTG-L07-OE52',
    order: 52,
    levelNumber: 7,
    title: 'Function of pop rdi; ret Gadget',
    prompt: `An analyst identifies a common gadget in the binary's code section:

\`\`\`assembly
0x00000000004011cb: pop rdi ; ret
\`\`\`

When execution returns to this gadget address, the CPU pops the 8-byte value residing at the current top of the stack into a general-purpose register, and then executes \`ret\` to jump to the subsequent address on the stack.

What 3-letter register is loaded with the stack value by this gadget?

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
        content: "Look at the operand of the pop instruction: rdi.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE52',
      seedId: 'HTG-L07-OE52',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "The gadget 'pop rdi ; ret' loads the top of the stack into RDI, setting up the 1st parameter for 64-bit function calls.",
      essentialKeyPoints: [
        "'pop rdi ; ret' is the most ubiquitous gadget in x86-64 ROP chains.",
        "Pairing this gadget with a pointer parameter prepares function invocations like puts(got_entry)."
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
    stableId: 'HTG-L07-OE53',
    order: 53,
    levelNumber: 7,
    title: 'Synthetic Gadget Chain Stack Layout Calculation',
    prompt: `An analyst designs a synthetic 3-element ROP chain on a 64-bit architecture to invoke an administrative status reporter:

\`\`\`text
Element 1: Address of 'pop rdi ; ret' gadget (8 bytes)
Element 2: Parameter value to load into RDI (8 bytes)
Element 3: Address of 'print_status' function (8 bytes)
\`\`\`

On a 64-bit architecture, each pointer and register value occupies exactly 8 bytes on the stack.

How many total bytes does this complete 3-element ROP chain occupy on the stack?

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
    flag: 'HTG{24}',
    hints: [
      {
        hintIndex: 1,
        content: "3 elements times 8 bytes per element equals 24 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE53',
      seedId: 'HTG-L07-OE53',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "In 64-bit mode, each stack slot is 8 bytes wide. 3 elements * 8 bytes = 24 bytes (0x18).",
      essentialKeyPoints: [
        "64-bit ROP chains consist of 8-byte aligned quadwords.",
        "Total payload size equals buffer padding + saved RBP + gadget chain byte length."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{24}' or '24'.",
        partialCredit: "Submits '24 bytes' or '0x18'.",
        noCredit: "Submits 16 or 32."
      },
      acceptableAlternatives: ['HTG{24}', '24', '24 bytes', '0x18']
    }
  },
  {
    stableId: 'HTG-L07-OE54',
    order: 54,
    levelNumber: 7,
    title: 'Syscall Number for sys_write on x86-64 Linux',
    prompt: `To construct a pure ROP payload that executes system calls directly via the \`syscall\` instruction, the system call number must be loaded into register \`RAX\`:

- \`sys_read\`  : \`RAX = 0\`
- \`sys_write\` : \`RAX = [Syscall Number]\`
- \`sys_open\`  : \`RAX = 2\`
- \`sys_close\` : \`RAX = 3\`

What decimal integer represents the system call number for \`sys_write\` on x86-64 Linux?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer syscall number).`,
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
    flag: 'HTG{1}',
    hints: [
      {
        hintIndex: 1,
        content: "sys_read is 0 and sys_write is 1 on x86-64.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE54',
      seedId: 'HTG-L07-OE54',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "On x86-64 Linux, system call 1 corresponds to sys_write(unsigned int fd, const char *buf, size_t count).",
      essentialKeyPoints: [
        "x86-64 system call numbers are specified in RAX.",
        "sys_write (1) takes parameters in RDI (fd), RSI (buf), and RDX (count)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{1}' or '1'.",
        partialCredit: "Submits '0x1' or 'sys_write=1'.",
        noCredit: "Submits 0 or 4."
      },
      acceptableAlternatives: ['HTG{1}', '1', '0x1', 'sys_write=1']
    }
  },
  {
    stableId: 'HTG-L07-OE55',
    order: 55,
    levelNumber: 7,
    title: 'Gadget Search CLI Tool',
    prompt: `To discover usable gadgets in an executable binary without manual disassembly, reverse engineers use automated tools that scan executable sections for useful instruction sequences ending in \`ret\`:

\`\`\`text
$ [TOOL_NAME] --binary ./service --rop
0x00000000004011cb : pop rdi ; ret
0x00000000004011c9 : pop rsi ; pop r15 ; ret
0x0000000000401016 : ret
\`\`\`

What is the name of this widely used Python-based ROP gadget finder tool (e.g. \`ROPgadget\` or \`ropper\`)?

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
    flag: 'HTG{ROPgadget}',
    hints: [
      {
        hintIndex: 1,
        content: "The command-line tool is ROPgadget (or ropper).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE55',
      seedId: 'HTG-L07-OE55',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "ROPgadget searches ELF/PE/Mach-O binaries for gadget sequences and can auto-generate execve chains.",
      essentialKeyPoints: [
        "ROPgadget scans executable sections for valid instruction sequences ending in ret or jmp.",
        "Filtering gadgets by register simplifies constructing argument pipelines."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ROPgadget}' or 'ROPgadget'.",
        partialCredit: "Submits lowercase 'ropgadget' or 'ropper'.",
        noCredit: "Submits objdump or readelf."
      },
      acceptableAlternatives: ['HTG{ROPgadget}', 'ROPgadget', 'ropgadget', 'ropper', 'HTG{ropper}']
    }
  },
  {
    stableId: 'HTG-L07-OE56',
    order: 56,
    levelNumber: 7,
    title: 'Ret2libc Technique Core Concept',
    prompt: `In classic return-to-libc attacks, the adversary bypasses non-executable stack protections by returning into existing shared C library functions rather than executing shellcode.

The most common target in educational demonstrations is the standard C library function that parses and executes a command string passed in the first parameter:

\`\`\`c
int system(const char *command);
\`\`\`

What is the name of this standard library command execution function?

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
    flag: 'HTG{system}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the function signature in the prompt: system.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE56',
      seedId: 'HTG-L07-OE56',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "system() in libc executes shell commands, making it a primary destination in ret2libc exploits.",
      essentialKeyPoints: [
        "ret2libc leverages existing code in libc to execute desired routines without shellcode injection.",
        "Executing system('/bin/sh') requires placing the pointer to '/bin/sh' in RDI (on x86-64)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{system}' or 'system'.",
        partialCredit: "Submits 'system()'.",
        noCredit: "Submits execve or fork."
      },
      acceptableAlternatives: ['HTG{system}', 'system', 'system()', 'SYSTEM', 'HTG{system()}']
    }
  },
  {
    stableId: 'HTG-L07-OE57',
    order: 57,
    levelNumber: 7,
    title: 'ret2win Function Identification in Synthetic Challenge',
    prompt: `In beginner binary exploitation puzzles, the binary often contains an uncalled helper function designed to print the flag when execution is successfully redirected to it:

\`\`\`assembly
00000000004011b6 <win>:
  push   rbp
  mov    rbp, rsp
  lea    rdi, [rip + 0xe54]  ; Pointer to flag string
  call   puts@plt
  pop    rbp
  ret
\`\`\`

What is the function symbol name (conventionally representing the winning target) defined in this disassembly?

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
    flag: 'HTG{win}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the symbol name between angle brackets: <win>.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE57',
      seedId: 'HTG-L07-OE57',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "ret2win challenges feature a 'win' function that prints the flag once the return address is redirected.",
      essentialKeyPoints: [
        "ret2win demonstrates basic return address hijacking without requiring complex argument setup.",
        "Overwriting saved RIP with 0x4011b6 executes the win function."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{win}' or 'win'.",
        partialCredit: "Submits uppercase 'WIN' or 'win()'.",
        noCredit: "Submits main or puts."
      },
      acceptableAlternatives: ['HTG{win}', 'win', 'WIN', 'win()', 'HTG{win()}']
    }
  },
  {
    stableId: 'HTG-L07-OE58',
    order: 58,
    levelNumber: 7,
    title: 'Linux x86-64 Syscall Instruction Byte Sequence',
    prompt: `On legacy 32-bit x86 Linux, transitioning from user space into kernel space was performed via software interrupt \`int 0x80\` (\`0xCD 0x80\`).

In modern 64-bit x86-64 long mode, the CPU provides a dedicated hardware instruction represented by the 2-byte opcode sequence \`0x0F 0x05\`.

What 2-byte hexadecimal sequence represents this modern 64-bit system call instruction?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex sequence with leading 0x).`,
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
    flag: 'HTG{0x0F05}',
    hints: [
      {
        hintIndex: 1,
        content: "The two bytes are 0x0F and 0x05: 0x0F05.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE58',
      seedId: 'HTG-L07-OE58',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "0x0F 0x05 is the machine opcode for the x86-64 'syscall' instruction.",
      essentialKeyPoints: [
        "'syscall' is the standard kernel entry instruction in x86-64 Linux.",
        "Locating 'syscall ; ret' gadgets enables arbitrary kernel requests in ROP chains."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x0F05}' or '0x0F05'.",
        partialCredit: "Submits '0F05' or lowercase '0x0f05'.",
        noCredit: "Submits 0xCD80 or 0xCC."
      },
      acceptableAlternatives: ['HTG{0x0F05}', '0x0F05', '0F05', '0x0f05', '0f05', 'HTG{0f05}']
    }
  },
  {
    stableId: 'HTG-L07-OE59',
    order: 59,
    levelNumber: 7,
    title: 'Stack Pivot Instruction for Shifting RSP',
    prompt: `When the vulnerable stack buffer is too small to accommodate a full ROP chain, an attacker stages the ROP chain in a larger memory region (such as the heap or BSS) and executes a "stack pivot" to redirect \`RSP\` to the new buffer.

One common pivot gadget swaps the values of the stack pointer and an address held in \`RAX\`:

\`\`\`assembly
xchg   rsp, rax
ret
\`\`\`

What assembly instruction mnemonic and operand sequence performs this register exchange?

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
    flag: 'HTG{xchg rsp, rax}',
    hints: [
      {
        hintIndex: 1,
        content: "The instruction swaps RSP and RAX: xchg rsp, rax.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE59',
      seedId: 'HTG-L07-OE59',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "'xchg rsp, rax' swaps the contents of RSP and RAX, moving the active stack pointer to the controlled buffer.",
      essentialKeyPoints: [
        "Stack pivoting relocates RSP to a larger controlled memory segment.",
        "Pivot gadgets include 'xchg rsp, reg', 'mov rsp, reg', and 'leave ; ret'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{xchg rsp, rax}' or 'xchg rsp, rax'.",
        partialCredit: "Submits 'xchg rax, rsp' or uppercase.",
        noCredit: "Submits mov rsp, rax."
      },
      acceptableAlternatives: ['HTG{xchg rsp, rax}', 'xchg rsp, rax', 'xchg rax, rsp', 'XCHG RSP, RAX', 'HTG{xchg rax, rsp}']
    }
  },
  {
    stableId: 'HTG-L07-OE60',
    order: 60,
    levelNumber: 7,
    title: 'BOP / Jump-Oriented Programming Counterpart',
    prompt: `While Return-Oriented Programming relies exclusively on code sequences terminating in the \`ret\` instruction, an alternative exploitation paradigm achieves Turing-complete computation without using \`ret\`.

Instead, it utilizes gadgets ending in indirect jumps (such as \`jmp [rax]\` or \`jmp rbx\`), coordinated through a central "dispatcher gadget" that manages execution flow.

What 3-letter acronym designates Jump-Oriented Programming?

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
    flag: 'HTG{JOP}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Jump-Oriented Programming: JOP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE60',
      seedId: 'HTG-L07-OE60',
      subtopic: 'ROP concepts and safe, synthetic gadget-chain reasoning',
      explanation: "JOP (Jump-Oriented Programming) chains gadgets ending in indirect jumps, bypassing defenses that monitor stack ret patterns.",
      essentialKeyPoints: [
        "JOP does not rely on the stack pointer or return instructions.",
        "Hardware defenses like Intel CET Indirect Branch Tracking (IBT) are designed to mitigate JOP."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{JOP}' or 'JOP'.",
        partialCredit: "Submits lowercase 'jop' or 'Jump Oriented Programming'.",
        noCredit: "Submits ROP or COP."
      },
      acceptableAlternatives: ['HTG{JOP}', 'JOP', 'jop', 'Jump Oriented Programming', 'HTG{jop}']
    }
  }
];

module.exports = subtopic6Questions;

