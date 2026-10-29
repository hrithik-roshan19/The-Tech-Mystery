const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L05-OE01',
    order: 1,
    levelNumber: 5,
    title: 'ELF Header Identification Magic ASCII Recovery',
    prompt: `A digital forensics examiner inspects the initial 16-byte identification array (\`e_ident\`) of a compiled Linux binary:

\`\`\`text
Offset  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
000000  7F 45 4C 46 02 01 01 00 00 00 00 00 00 00 00 00
\`\`\`

The first byte (\`0x7F\`) is the non-printable ASCII delete/control character. What 3-character uppercase ASCII string corresponds to the subsequent three identification bytes (\`0x45\`, \`0x4C\`, \`0x46\`)?

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
    flag: 'HTG{ELF}',
    hints: [
      {
        hintIndex: 1,
        content: "Convert the hex values 0x45, 0x4C, 0x46 to ASCII characters: 69='E', 76='L', 70='F'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE01',
      seedId: 'HTG-L05-OE01',
      subtopic: 'Binary formats and executable structure',
      explanation: "The Executable and Linkable Format (ELF) header begins with the 4-byte magic sequence 0x7F, 'E', 'L', 'F'. The 3-character ASCII string is ELF.",
      essentialKeyPoints: [
        "ELF magic signature is 0x7F 0x45 0x4C 0x46 (\\x7fELF).",
        "Magic bytes identify file type independently of file extension."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ELF}' or 'ELF'.",
        partialCredit: "Submits lowercase 'elf'.",
        noCredit: "Submits full magic byte array or incorrect file type."
      },
      acceptableAlternatives: ['HTG{ELF}', 'ELF', 'elf', 'HTG{elf}']
    }
  },
  {
    stableId: 'HTG-L05-OE02',
    order: 2,
    levelNumber: 5,
    title: 'PE Header DOS Stub e_lfanew Offset Resolution',
    prompt: `An analyst analyzes a Windows Portable Executable (PE) binary header. In the legacy MS-DOS header (\`IMAGE_DOS_HEADER\`), offset \`0x3C\` contains the 4-byte little-endian field \`e_lfanew\`:

\`\`\`text
Offset  0x3C: 80 00 00 00
\`\`\`

This field stores the file offset pointing to the beginning of the NT headers (\`PE\\0\\0\` signature).

What is the two-character hexadecimal file offset (including or excluding the 0x prefix) where the NT signature begins?

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
    flag: 'HTG{0x80}',
    hints: [
      {
        hintIndex: 1,
        content: "The 4 bytes '80 00 00 00' in little-endian format represent the 32-bit integer 0x00000080.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE02',
      seedId: 'HTG-L05-OE02',
      subtopic: 'Binary formats and executable structure',
      explanation: "In PE files, e_lfanew at offset 0x3C points to the NT headers. Little-endian '80 00 00 00' evaluates to file offset 0x80.",
      essentialKeyPoints: [
        "e_lfanew decouples the variable-length MS-DOS stub from the modern PE header.",
        "PE parsers rely on offset 0x3C to locate the IMAGE_NT_HEADERS structure."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x80}', '0x80', or '80'.",
        partialCredit: "Submits decimal representation '128'.",
        noCredit: "Submits the offset 0x3C itself."
      },
      acceptableAlternatives: ['HTG{0x80}', '0x80', '80', '0X80', '128', 'HTG{80}']
    }
  },
  {
    stableId: 'HTG-L05-OE03',
    order: 3,
    levelNumber: 4,
    levelNumber: 5,
    title: 'ELF Architecture Class Bit Width Extraction',
    prompt: `Inspecting byte 4 of an ELF header (\`e_ident[EI_CLASS]\`) displays:

\`\`\`text
e_ident[EI_CLASS] = 0x02 (ELFCLASS64)
\`\`\`

In the standard ELF specification (System V ABI), value \`0x01\` denotes a 32-bit target architecture, while value \`0x02\` denotes a 64-bit target architecture.

What integer bit-width does value \`0x02\` represent?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 64).`,
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
    flag: 'HTG{64}',
    hints: [
      {
        hintIndex: 1,
        content: "ELFCLASS64 signifies a 64-bit architecture.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE03',
      seedId: 'HTG-L05-OE03',
      subtopic: 'Binary formats and executable structure',
      explanation: "Byte 4 (EI_CLASS) indicates word size: 1 is 32-bit (ELFCLASS32), 2 is 64-bit (ELFCLASS64).",
      essentialKeyPoints: [
        "EI_CLASS determines pointer and register width throughout the binary structures.",
        "ELF64 structures double field sizes for addresses and offsets compared to ELF32."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{64}' or '64'.",
        partialCredit: "Submits '64-bit' or '64 bit'.",
        noCredit: "Submits 32."
      },
      acceptableAlternatives: ['HTG{64}', '64', '64-bit', '64 bit']
    }
  },
  {
    stableId: 'HTG-L05-OE04',
    order: 4,
    levelNumber: 5,
    title: 'PE Relative Virtual Address (RVA) to File Offset Mapping',
    prompt: `A reverse engineer needs to locate code on disk corresponding to runtime Relative Virtual Address (RVA) \`0x12A0\`. The section header table reports:

\`\`\`text
Section: .text
VirtualAddress:    0x1000
VirtualSize:       0x0800
PointerToRawData:  0x0400
SizeOfRawData:     0x0800
\`\`\`

Using the standard conversion formula:
\`FileOffset = TargetRVA - SectionVirtualAddress + SectionPointerToRawData\`

Calculate the raw hexadecimal file offset where this function begins on disk.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex offset, e.g. 0x6A0).`,
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
    flag: 'HTG{0x6A0}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 0x12A0 - 0x1000 = 0x2A0. Then add 0x0400: 0x2A0 + 0x400 = 0x6A0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE04',
      seedId: 'HTG-L05-OE04',
      subtopic: 'Binary formats and executable structure',
      explanation: "Mapping an RVA to disk requires subtracting the section's VirtualAddress and adding its PointerToRawData. 0x12A0 - 0x1000 + 0x400 = 0x6A0.",
      essentialKeyPoints: [
        "Memory section alignment (e.g. 0x1000) often differs from file alignment (e.g. 0x200).",
        "RVA-to-file offset conversion allows patching binaries directly on disk."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x6A0}', '0x6A0', or '6A0'.",
        partialCredit: "Submits lowercase '0x6a0' or decimal '1696'.",
        noCredit: "Submits RVA without offset translation."
      },
      acceptableAlternatives: ['HTG{0x6A0}', '0x6A0', '6A0', '0x6a0', '6a0', '1696', 'HTG{6A0}']
    }
  },
  {
    stableId: 'HTG-L05-OE05',
    order: 5,
    levelNumber: 5,
    title: 'Apple Mach-O 64-bit Magic Constant Identification',
    prompt: `An analyst inspects the header of a macOS binary compiled for Apple Silicon / x86_64 architecture:

\`\`\`text
Offset 0x00: CF FA ED FE (little-endian byte representation)
\`\`\`

In big-endian hexadecimal representation, this corresponds to the canonical 8-character Mach-O 64-bit magic constant (\`0xfeedfacf\`).

Submit the 8-character hexadecimal string of this magic constant (excluding 0x prefix).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 8-character hex string).`,
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
    flag: 'HTG{feedfacf}',
    hints: [
      {
        hintIndex: 1,
        content: "Reverse the byte order of CF FA ED FE: FE ED FA CF.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE05',
      seedId: 'HTG-L05-OE05',
      subtopic: 'Binary formats and executable structure',
      explanation: "Mach-O 64-bit binaries use magic number 0xFEEDFACF (MH_MAGIC_64), while 32-bit binaries use 0xFEEDFACE.",
      essentialKeyPoints: [
        "Mach-O headers identify Darwin/macOS/iOS executables and dylibs.",
        "Endianness determines how the 4-byte constant appears in raw byte sequences."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{feedfacf}' or 'feedfacf'.",
        partialCredit: "Submits uppercase 'FEEDFACF' or '0xfeedfacf'.",
        noCredit: "Submits 32-bit constant feedface."
      },
      acceptableAlternatives: ['HTG{feedfacf}', 'feedfacf', 'FEEDFACF', '0xfeedfacf', '0xFEEDFACF']
    }
  },
  {
    stableId: 'HTG-L05-OE06',
    order: 6,
    levelNumber: 5,
    title: 'ELF Uninitialized Data BSS Section Identification',
    prompt: `An engineer reviews an ELF section header table (\`readelf -S\`) for an executable:

\`\`\`text
Section Headers:
  [Nr] Name              Type             Address           Offset   Size     Flags
  [ 1] .text             PROGBITS         0000000000401000  00001000 00004820 AX
  [ 2] .rodata           PROGBITS         0000000000406000  00006000 00001140 A
  [ 3] .data             PROGBITS         0000000000408000  00008000 00000210 WA
  [ 4] [REDACTED]        NOBITS           0000000000409000  00008210 00001800 WA
\`\`\`

Section 4 has type \`SHT_NOBITS\` and flags \`SHF_WRITE | SHF_ALLOC\` (\`WA\`), occupying zero bytes in the disk image file while reserving memory for uninitialized global variables at runtime.

What standard section name (beginning with a dot) designates this uninitialized memory section?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the section name).`,
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
    flag: 'HTG{.bss}',
    hints: [
      {
        hintIndex: 1,
        content: "The section is named '.bss' (Block Started by Symbol).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE06',
      seedId: 'HTG-L05-OE06',
      subtopic: 'Binary formats and executable structure',
      explanation: "The .bss section stores uninitialized global and static variables. In ELF binaries, it has type SHT_NOBITS because it takes no disk space.",
      essentialKeyPoints: [
        "SHT_NOBITS sections occupy memory during execution but zero space in the binary file.",
        "The OS loader zero-initializes the .bss page allocations on process startup."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{.bss}' or '.bss'.",
        partialCredit: "Submits 'bss' without the leading dot.",
        noCredit: "Submits .data or .rodata."
      },
      acceptableAlternatives: ['HTG{.bss}', '.bss', 'bss', '.BSS', 'BSS', 'HTG{bss}']
    }
  },
  {
    stableId: 'HTG-L05-OE07',
    order: 7,
    levelNumber: 5,
    title: 'PE Optional Header Subsystem Console Classification',
    prompt: `An auditor parses the Windows \`IMAGE_OPTIONAL_HEADER\` of a suspected malware sample:

\`\`\`text
Subsystem: 0x0003 (IMAGE_SUBSYSTEM_WINDOWS_CUI)
\`\`\`

Under Microsoft PE specifications, subsystem value \`0x0002\` denotes a GUI application (\`WINDOWS_GUI\`), whereas value \`0x0003\` denotes a Character User Interface application that allocates a command-line terminal window upon execution.

What common 7-letter word (beginning with C) describes this terminal interface classification (CONSOLE or GUI)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the word).`,
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
    flag: 'HTG{CONSOLE}',
    hints: [
      {
        hintIndex: 1,
        content: "CUI stands for Console / Character User Interface.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE07',
      seedId: 'HTG-L05-OE07',
      subtopic: 'Binary formats and executable structure',
      explanation: "IMAGE_SUBSYSTEM_WINDOWS_CUI (value 3) indicates a Windows Console application, which attaches to a cmd.exe/terminal window upon launch.",
      essentialKeyPoints: [
        "The Subsystem header field directs the Windows loader on whether to allocate a console console buffer.",
        "Malware often toggles subsystem flags to hide console popups."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CONSOLE}' or 'CONSOLE'.",
        partialCredit: "Submits lowercase 'console' or 'CUI'.",
        noCredit: "Submits GUI or Windows."
      },
      acceptableAlternatives: ['HTG{CONSOLE}', 'CONSOLE', 'console', 'CUI', 'cui']
    }
  },
  {
    stableId: 'HTG-L05-OE08',
    order: 8,
    levelNumber: 5,
    title: 'Little-Endian Hexadecimal Word Reconstruction',
    prompt: `A hexdump at virtual address \`0x402010\` contains four contiguous bytes stored on an x86 little-endian architecture:

\`\`\`text
Address     00 01 02 03
0x402010    EF BE AD DE
\`\`\`

Reconstruct this 4-byte sequence into its canonical 32-bit unsigned hexadecimal representation in standard big-endian display format (e.g. 0xdeadbeef).

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
    flag: 'HTG{0xdeadbeef}',
    hints: [
      {
        hintIndex: 1,
        content: "In little-endian, byte 0 is the least significant byte: DE AD BE EF.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE08',
      seedId: 'HTG-L05-OE08',
      subtopic: 'Binary formats and executable structure',
      explanation: "x86 architecture is little-endian: least significant bytes appear first in memory. 'EF BE AD DE' evaluates to 0xDEADBEEF.",
      essentialKeyPoints: [
        "Understanding byte order is crucial for interpreting memory dumps, pointers, and disassembly.",
        "0xDEADBEEF is a classic hex sentinel pattern used in memory management."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xdeadbeef}', '0xdeadbeef', or 'deadbeef'.",
        partialCredit: "Submits uppercase '0xDEADBEEF'.",
        noCredit: "Submits raw byte order 0xefbeadde."
      },
      acceptableAlternatives: ['HTG{0xdeadbeef}', '0xdeadbeef', 'deadbeef', '0xDEADBEEF', 'DEADBEEF', 'HTG{deadbeef}']
    }
  },
  {
    stableId: 'HTG-L05-OE09',
    order: 9,
    levelNumber: 5,
    title: 'ELF Program Header Loadable Segment Macro',
    prompt: `An auditor parses the Program Header Table (\`readelf -l\`) of a native binary to identify segments loaded directly into the process address space:

\`\`\`text
Program Headers:
  Type           Offset             VirtAddr           PhysAddr           FileSiz            MemSiz              Flags  Align
  PHDR           0x0000000000000040 0x0000000000400040 0x0000000000400040 0x00000000000002d8 0x00000000000002d8  R      0x8
  INTERP         0x0000000000000318 0x0000000000400318 0x0000000000400318 0x000000000000001c 0x000000000000001c  R      0x1
  LOAD           0x0000000000000000 0x0000000000400000 0x0000000000400000 0x0000000000000a60 0x0000000000000a60  R E    0x1000
\`\`\`

In the ELF C header (\`elf.h\`), what symbolic macro name corresponds to program header type \`1\` representing a memory-mapped loadable segment?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the macro name, e.g. PT_LOAD).`,
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
    flag: 'HTG{PT_LOAD}',
    hints: [
      {
        hintIndex: 1,
        content: "Program header type 1 is defined as PT_LOAD.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE09',
      seedId: 'HTG-L05-OE09',
      subtopic: 'Binary formats and executable structure',
      explanation: "PT_LOAD (type 1) describes loadable segments mapped from file into virtual memory by the OS execve loader.",
      essentialKeyPoints: [
        "Program headers govern execution loading, whereas section headers govern linking.",
        "PT_LOAD segments specify virtual address bounds, memory sizes, and access permissions (R/W/X)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PT_LOAD}' or 'PT_LOAD'.",
        partialCredit: "Submits lowercase 'pt_load' or 'LOAD'.",
        noCredit: "Submits PT_DYNAMIC or PT_PHDR."
      },
      acceptableAlternatives: ['HTG{PT_LOAD}', 'PT_LOAD', 'pt_load', 'PT-LOAD', 'LOAD']
    }
  },
  {
    stableId: 'HTG-L05-OE10',
    order: 10,
    levelNumber: 5,
    title: 'PE Absolute Entry Point Virtual Address Calculation',
    prompt: `An executable analysis tool inspects the NT Optional Header of a 32-bit Windows binary:

\`\`\`text
ImageBase:                0x00400000
AddressOfEntryPoint:      0x000015A0
BaseOfCode:               0x00001000
\`\`\`

Assuming default loading at the preferred \`ImageBase\`, calculate the Absolute Virtual Address (VA) where the first instruction of executable code begins execution (\`ImageBase + AddressOfEntryPoint\`).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex address, e.g. 0x004015A0).`,
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
    flag: 'HTG{0x004015A0}',
    hints: [
      {
        hintIndex: 1,
        content: "Add ImageBase 0x00400000 and EntryPoint RVA 0x000015A0: 0x004015A0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE10',
      seedId: 'HTG-L05-OE10',
      subtopic: 'Binary formats and executable structure',
      explanation: "The Absolute Virtual Address (VA) equals the preferred ImageBase plus the Relative Virtual Address (AddressOfEntryPoint): 0x00400000 + 0x000015A0 = 0x004015A0.",
      essentialKeyPoints: [
        "AddressOfEntryPoint is stored as an RVA relative to ImageBase.",
        "Without ASLR, the binary executes directly at this calculated absolute address."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x004015A0}' or '0x004015A0' or '0x4015A0'.",
        partialCredit: "Submits lowercase '0x004015a0'.",
        noCredit: "Submits BaseOfCode or ImageBase."
      },
      acceptableAlternatives: [
        'HTG{0x004015A0}',
        '0x004015A0',
        '0x4015A0',
        '4015A0',
        '004015A0',
        '0x004015a0',
        '0x4015a0',
        'HTG{0x4015A0}'
      ]
    }
  }
];

module.exports = subtopic1Questions;

