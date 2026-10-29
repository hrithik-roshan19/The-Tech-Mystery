const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L05-OE21',
    order: 21,
    levelNumber: 5,
    title: 'x86 Architecture No-Operation (NOP) Opcode Byte',
    prompt: `An analyst analyzes shellcode padding in an exploit payload consisting of a slide of single-byte No-Operation (NOP) instructions.

In the x86 and x86_64 instruction set architectures, what single-byte hexadecimal opcode represents the canonical \`NOP\` instruction (e.g. 0x90)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex byte).`,
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
    flag: 'HTG{0x90}',
    hints: [
      {
        hintIndex: 1,
        content: "The x86 NOP opcode is 0x90 (internally encoded as 'xchg eax, eax').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE21',
      seedId: 'HTG-L05-OE21',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "Opcode 0x90 is the 1-byte x86 NOP instruction (alias for xchg eax, eax). NOP sleds use 0x90 to provide safe execution runways for shellcode.",
      essentialKeyPoints: [
        "0x90 is an iconic bytecode signature in software exploitation and reverse engineering.",
        "Patching instructions to 0x90 bytes neutralizes unwanted branches or security checks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x90}', '0x90', or '90'.",
        partialCredit: "Submits uppercase '0X90'.",
        noCredit: "Submits other single-byte opcodes like 0xCC."
      },
      acceptableAlternatives: ['HTG{0x90}', '0x90', '90', '0X90', 'HTG{90}']
    }
  },
  {
    stableId: 'HTG-L05-OE22',
    order: 22,
    levelNumber: 5,
    title: 'Software Breakpoint Trap Opcode Value',
    prompt: `When an interactive debugger (such as GDB, LLDB, or x64dbg) sets a software breakpoint on an instruction in memory, it saves the original byte and overwrites it with a 1-byte interrupt instruction triggering an exception handler.

What single-byte hexadecimal opcode represents the x86 software breakpoint trap instruction (\`INT 3\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex byte, e.g. 0xCC).`,
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
    flag: 'HTG{0xCC}',
    hints: [
      {
        hintIndex: 1,
        content: "INT 3 encodes as the single byte 0xCC.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE22',
      seedId: 'HTG-L05-OE22',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "Opcode 0xCC is the special 1-byte encoding for INT 3. When executed, the CPU raises a STATUS_BREAKPOINT (SIGTRAP) exception caught by the debugger.",
      essentialKeyPoints: [
        "Software breakpoints modify target process memory pages by inserting 0xCC bytes.",
        "Anti-debugging integrity checks scan function memory to detect unexpected 0xCC opcodes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xCC}', '0xCC', or 'CC'.",
        partialCredit: "Submits lowercase '0xcc' or 'cc'.",
        noCredit: "Submits 2-byte interrupt 0xCD 0x03."
      },
      acceptableAlternatives: ['HTG{0xCC}', '0xCC', 'CC', '0xcc', 'cc', 'HTG{CC}']
    }
  },
  {
    stableId: 'HTG-L05-OE23',
    order: 23,
    levelNumber: 5,
    title: 'Python Bytecode Evaluation Stack Simulation',
    prompt: `An analyst inspects disassembled Python 3.11 bytecode from a compiled \`.pyc\` file using the \`dis\` module:

\`\`\`text
  1           0 LOAD_CONST               1 (10)
              2 LOAD_CONST               2 (20)
              4 BINARY_OP                0 (+)
              8 RETURN_VALUE
\`\`\`

Python's virtual machine operates as a stack machine. Following the evaluation of these instructions in sequence, what integer value is returned by this function?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 30).`,
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
    flag: 'HTG{30}',
    hints: [
      {
        hintIndex: 1,
        content: "LOAD_CONST 10, LOAD_CONST 20, then add them: 10 + 20 = 30.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE23',
      seedId: 'HTG-L05-OE23',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "LOAD_CONST pushes operands onto the value stack. BINARY_OP pops 20 and 10, adds them (30), and pushes the result. RETURN_VALUE returns 30.",
      essentialKeyPoints: [
        "Python executes compiled bytecode inside the CPython evaluation loop (ceval.c).",
        "Stack machine operations evaluate postfix operand expressions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{30}' or '30'.",
        partialCredit: "Submits text 'thirty'.",
        noCredit: "Submits intermediate values 10 or 20."
      },
      acceptableAlternatives: ['HTG{30}', '30', 'thirty']
    }
  },
  {
    stableId: 'HTG-L05-OE24',
    order: 24,
    levelNumber: 5,
    title: 'Java Virtual Machine Bytecode Operand Arithmetic',
    prompt: `A security auditor decompiles a suspicious Java \`.class\` file with \`javap -c\`:

\`\`\`text
public static int calculate();
  Code:
     0: iconst_5
     1: bipush        7
     3: imul
     4: ireturn
\`\`\`

In the JVM specification, \`iconst_5\` pushes integer 5 onto the operand stack, \`bipush 7\` pushes integer 7, \`imul\` multiplies the top two integers, and \`ireturn\` returns the integer result.

What integer value is returned by this method?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 35).`,
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
    flag: 'HTG{35}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 5 * 7 = 35.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE24',
      seedId: 'HTG-L05-OE24',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "The JVM operand stack performs 5 * 7 = 35. ireturn pops 35 and passes it to the caller.",
      essentialKeyPoints: [
        "JVM bytecode operates on a typed operand stack with local variable arrays.",
        "iconst_n provides compact 1-byte opcodes for small constants (-1 to 5)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{35}' or '35'.",
        partialCredit: "Submits text 'thirty-five'.",
        noCredit: "Submits 12 (addition) or individual operands."
      },
      acceptableAlternatives: ['HTG{35}', '35']
    }
  },
  {
    stableId: 'HTG-L05-OE25',
    order: 25,
    levelNumber: 5,
    title: '.NET Common Intermediate Language String Loading Opcode',
    prompt: `An analyst disassembles a .NET assembly using ILDasm:

\`\`\`cil
.method public static void PrintSecret() cil managed
{
  .maxstack 8
  IL_0000: ldstr "TelemetryAccessKey"
  IL_0005: call void [mscorlib]System.Console::WriteLine(string)
  IL_000a: ret
}
\`\`\`

In Common Intermediate Language (CIL) bytecode architecture (ECMA-335), which opcode mnemonic pushes a new object reference to a string literal stored in the metadata tables onto the evaluation stack?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the opcode name, e.g. ldstr).`,
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
    flag: 'HTG{ldstr}',
    hints: [
      {
        hintIndex: 1,
        content: "The opcode is 'ldstr' (Load String).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE25',
      seedId: 'HTG-L05-OE25',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "ldstr pushes a reference to a string literal from the user-string (#US) heap onto the evaluation stack in .NET assemblies.",
      essentialKeyPoints: [
        "CIL is a stack-based intermediate representation executed by the CLR.",
        "String references in .NET are indexed via metadata tokens."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ldstr}' or 'ldstr'.",
        partialCredit: "Submits uppercase 'LDSTR'.",
        noCredit: "Submits ldc or call."
      },
      acceptableAlternatives: ['HTG{ldstr}', 'ldstr', 'LDSTR', 'HTG{LDSTR}']
    }
  },
  {
    stableId: 'HTG-L05-OE26',
    order: 26,
    levelNumber: 5,
    title: 'WebAssembly Binary Module Magic Header String',
    prompt: `A compiled WebAssembly module begins with the standardized 4-byte identification sequence:

\`\`\`text
00 61 73 6D
\`\`\`

The first byte is null (\`0x00\`). What 3-character lowercase ASCII string corresponds to the subsequent three byte values (\`0x61\`, \`0x73\`, \`0x6D\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter string).`,
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
    flag: 'HTG{asm}',
    hints: [
      {
        hintIndex: 1,
        content: "0x61='a', 0x73='s', 0x6D='m': 'asm'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE26',
      seedId: 'HTG-L05-OE26',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "WebAssembly binary modules begin with \\0asm (0x00 0x61 0x73 0x6D) followed by the 4-byte version number 0x01 0x00 0x00 0x00.",
      essentialKeyPoints: [
        "Wasm magic bytes identify portable bytecode for browser and server runtimes.",
        "Validating magic headers prevents parsing malformed modules."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{asm}' or 'asm'.",
        partialCredit: "Submits uppercase 'ASM' or '\\0asm'.",
        noCredit: "Submits wasm or webassembly."
      },
      acceptableAlternatives: ['HTG{asm}', 'asm', 'ASM', '\\0asm', 'HTG{ASM}']
    }
  },
  {
    stableId: 'HTG-L05-OE27',
    order: 27,
    levelNumber: 5,
    title: 'WebAssembly Variable-Length LEB128 Integer Decoding',
    prompt: `An auditor parses an unsigned variable-length integer (ULEB128) in a WebAssembly section header:

\`\`\`text
Byte Sequence: E5 8E 26
\`\`\`

ULEB128 encoding packs 7 bits of payload per byte, setting the MSB (bit 7) to 1 if more bytes follow:
1. Byte 1 (\`0xE5\`): MSB=1 -> 7-bit chunk = \`0x65\` (101)
2. Byte 2 (\`0x8E\`): MSB=1 -> 7-bit chunk = \`0x0E\` (14 << 7 = 1,792)
3. Byte 3 (\`0x26\`): MSB=0 -> 7-bit chunk = \`0x26\` (38 << 14 = 622,592)

Summing these weighted values (\`101 + 1792 + 622592\`), calculate the decoded 32-bit unsigned integer value.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 624485).`,
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
    flag: 'HTG{624485}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 101 + (14 * 128) + (38 * 16384) = 101 + 1792 + 622592 = 624485.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE27',
      seedId: 'HTG-L05-OE27',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "ULEB128 decodes 7-bit groups in little-endian order: 0x65 | (0x0E << 7) | (0x26 << 14) = 624485.",
      essentialKeyPoints: [
        "LEB128 achieves compact variable-length integer representation in Wasm and DWARF.",
        "Continuous 7-bit extraction terminates when the MSB is 0."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{624485}' or '624485'.",
        partialCredit: "Submits hex representation '0x98765'.",
        noCredit: "Submits individual chunk sums."
      },
      acceptableAlternatives: ['HTG{624485}', '624485']
    }
  },
  {
    stableId: 'HTG-L05-OE28',
    order: 28,
    levelNumber: 5,
    title: 'x86 ModR/M Byte Destination Register Decoding',
    prompt: `An analyst decodes the machine code bytes for an x86 register copy instruction:

\`\`\`text
Machine Code: 89 C3
Instruction:  mov ebx, eax
\`\`\`

The first byte (\`0x89\`) is the opcode for \`mov r/m32, r32\`. The second byte (\`0xC3\`) is the ModR/M byte:
- \`mod = 11\` (register addressing mode)
- \`reg = 000\` (source register: eax)
- \`r/m = 011\` (destination register: ebx)

Which register receives the copied value as the destination operand?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the register name, e.g. ebx).`,
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
    flag: 'HTG{ebx}',
    hints: [
      {
        hintIndex: 1,
        content: "In 'mov ebx, eax', the destination register is ebx.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE28',
      seedId: 'HTG-L05-OE28',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "Opcode 0x89 copies 'reg' to 'r/m'. With ModR/M 0xC3 (mod=11, reg=eax, r/m=ebx), the destination register is ebx.",
      essentialKeyPoints: [
        "The ModR/M byte splits into 2-bit mod, 3-bit reg, and 3-bit r/m fields.",
        "Instruction decoders rely on ModR/M to determine addressing modes and operand registers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ebx}' or 'ebx'.",
        partialCredit: "Submits uppercase 'EBX'.",
        noCredit: "Submits source register eax."
      },
      acceptableAlternatives: ['HTG{ebx}', 'ebx', 'EBX', 'HTG{EBX}']
    }
  },
  {
    stableId: 'HTG-L05-OE29',
    order: 29,
    levelNumber: 5,
    title: 'Android Dalvik Bytecode Return Void Mnemonic',
    prompt: `A reverse engineer inspects the disassembled Smali / Dalvik bytecode of an Android APK method:

\`\`\`smali
.method public static clearState()V
    .registers 0

    return-void
.end method
\`\`\`

In the official Dalvik Executable (DEX) instruction format specifications, what is the hyphenated mnemonic for opcode \`0x0E\` that returns void from a method?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the mnemonic, e.g. return-void).`,
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
    flag: 'HTG{return-void}',
    hints: [
      {
        hintIndex: 1,
        content: "The mnemonic is 'return-void'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE29',
      seedId: 'HTG-L05-OE29',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "In Dalvik bytecode, opcode 0x0E corresponds to return-void, terminating execution of methods with void return types.",
      essentialKeyPoints: [
        "Dalvik is a register-based virtual machine executing inside Android ART.",
        "return-void is the standard epilogue instruction for void methods."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{return-void}' or 'return-void'.",
        partialCredit: "Submits uppercase 'RETURN-VOID' or underscore 'return_void'.",
        noCredit: "Submits generic 'return'."
      },
      acceptableAlternatives: ['HTG{return-void}', 'return-void', 'RETURN-VOID', 'return_void', 'HTG{return_void}']
    }
  },
  {
    stableId: 'HTG-L05-OE30',
    order: 30,
    levelNumber: 5,
    title: 'x86 Near Relative Call Target Address Calculation',
    prompt: `An instruction at virtual memory address \`0x401000\` initiates a subroutine call:

\`\`\`nasm
0x401000: E8 0B 00 00 00    call 0x401010
\`\`\`

The \`E8\` opcode encodes a 32-bit relative near call (\`call rel32\`). The instruction occupies 5 bytes, so the instruction pointer after fetching is \`0x401005\` (\`NextEIP = 0x401000 + 5\`).

The 4-byte little-endian displacement operand is \`0x0000000B\`.

Calculate the resulting absolute virtual address where execution jumps (\`NextEIP + Displacement\`).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex address, e.g. 0x401010).`,
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
    flag: 'HTG{0x401010}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 0x401005 + 0x0000000B = 0x401010.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE30',
      seedId: 'HTG-L05-OE30',
      subtopic: 'Bytecode inspection and instruction decoding',
      explanation: "Relative call displacements are relative to the instruction immediately following the call. 0x401005 + 0x0B = 0x401010.",
      essentialKeyPoints: [
        "Relative call operands do not store absolute target pointers.",
        "Calculating call targets requires accounting for the 5-byte instruction length."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x401010}', '0x401010', or '401010'.",
        partialCredit: "Submits lowercase '0x401010'.",
        noCredit: "Submits address calculated without adding instruction length (0x40100B)."
      },
      acceptableAlternatives: ['HTG{0x401010}', '0x401010', '401010', '0x00401010', 'HTG{401010}']
    }
  }
];

module.exports = subtopic3Questions;

