const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L05-OE31',
    order: 31,
    levelNumber: 5,
    title: 'PE Import Address Table Win32 Memory Management API',
    prompt: `An investigator parses the Import Address Table (IAT) of a suspicious executable:

\`\`\`text
Import Module: KERNEL32.DLL
  Thunk RVA:  0x00003010
  Hint:       0x028A
  Name:       VirtualProtect
\`\`\`

The \`VirtualProtect\` Win32 API is frequently imported by packers and shellcode loaders to modify memory page protections (such as changing \`PAGE_READONLY\` to \`PAGE_EXECUTE_READWRITE\`).

Extract the exact function name imported from \`KERNEL32.DLL\`.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name, e.g. VirtualProtect).`,
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
    flag: 'HTG{VirtualProtect}',
    hints: [
      {
        hintIndex: 1,
        content: "The API function name is 'VirtualProtect'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE31',
      seedId: 'HTG-L05-OE31',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "VirtualProtect is a core Windows memory API. Its presence in import tables often indicates self-modifying code or runtime unpackers.",
      essentialKeyPoints: [
        "Import directory analysis provides immediate clues regarding binary capabilities.",
        "APIs like VirtualProtect, VirtualAlloc, and WriteProcessMemory are common indicators of dynamic code execution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{VirtualProtect}' or 'VirtualProtect'.",
        partialCredit: "Submits lowercase 'virtualprotect'.",
        noCredit: "Submits module name KERNEL32.DLL."
      },
      acceptableAlternatives: ['HTG{VirtualProtect}', 'VirtualProtect', 'virtualprotect', 'VIRTUALPROTECT']
    }
  },
  {
    stableId: 'HTG-L05-OE32',
    order: 32,
    levelNumber: 5,
    title: 'Single-Byte XOR Encrypted String Decryption',
    prompt: `A static string extractor locates a sequence of four encrypted bytes in the \`.rodata\` section of an ELF binary:

\`\`\`text
Ciphertext Bytes: 65 6F 62 64 (hexadecimal)
\`\`\`

Decompilation reveals that each byte was obfuscated using a single-byte bitwise XOR operation with key \`0x23\`:
\`\`\`c
char plaintext[4];
plaintext[i] = ciphertext[i] ^ 0x23;
\`\`\`

Decode this 4-byte sequence to recover the original 4-character ASCII string (hint: 0x65 ^ 0x23 = 0x46 = 'F').

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-character string).`,
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
    flag: 'HTG{FLAG}',
    hints: [
      {
        hintIndex: 1,
        content: "0x65^0x23='F', 0x6F^0x23='L', 0x62^0x23='A', 0x64^0x23='G': 'FLAG'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE32',
      seedId: 'HTG-L05-OE32',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "Bitwise XOR with 0x23 reverses the obfuscation: 0x65^0x23=0x46 (F), 0x6F^0x23=0x4C (L), 0x62^0x23=0x41 (A), 0x64^0x23=0x47 (G). Result is FLAG.",
      essentialKeyPoints: [
        "Single-byte XOR is the most common rudimentary string obfuscation technique.",
        "Automated tools (FLOSS, XORSearch) brute-force single-byte keys across binary images."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{FLAG}' or 'FLAG'.",
        partialCredit: "Submits lowercase 'flag'.",
        noCredit: "Submits raw hex bytes."
      },
      acceptableAlternatives: ['HTG{FLAG}', 'FLAG', 'flag', 'HTG{flag}']
    }
  },
  {
    stableId: 'HTG-L05-OE33',
    order: 33,
    levelNumber: 5,
    title: 'Executable Section High Entropy and UPX Packer Identification',
    prompt: `An analyst calculates the Shannon entropy of sections in a Windows binary:

\`\`\`text
Section Name    Virtual Size    Raw Size    Entropy (0-8 scale)
UPX0            0x00012000      0x00000000  0.00 (Unmapped memory)
UPX1            0x00008000      0x00007E00  7.92 (High compressed entropy)
.rsrc           0x00001000      0x00000C00  4.15 (Normal resource entropy)
\`\`\`

A Shannon entropy score close to 8.0 indicates high randomness typical of compression or encryption. The section names directly disclose the packer utilized.

Identify the 3-letter uppercase acronym of the popular open-source executable packer identified (UPX).

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
    flag: 'HTG{UPX}',
    hints: [
      {
        hintIndex: 1,
        content: "The packer is 'UPX' (Ultimate Packer for eXecutables).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE33',
      seedId: 'HTG-L05-OE33',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "UPX compresses binaries and unpacks them into memory at runtime. High entropy (7.92) and section names UPX0/UPX1 identify UPX.",
      essentialKeyPoints: [
        "Packer detection combines entropy analysis with characteristic section header signatures.",
        "Unpacking is necessary to analyze the true underlying executable code."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{UPX}' or 'UPX'.",
        partialCredit: "Submits lowercase 'upx'.",
        noCredit: "Submits entropy score 7.92."
      },
      acceptableAlternatives: ['HTG{UPX}', 'UPX', 'upx', 'HTG{upx}']
    }
  },
  {
    stableId: 'HTG-L05-OE34',
    order: 34,
    levelNumber: 5,
    title: 'CodeView Debug Directory PDB Path Extraction',
    prompt: `An auditor parses the Debug Directory of a compiled PE binary using a header analysis tool:

\`\`\`text
Debug Directory Type: 0x00000002 (IMAGE_DEBUG_TYPE_CODEVIEW)
  Format:     RSDS (CodeView 7.0)
  Signature:  {A1B2C3D4-E5F6-0718-293A-B1C2D3E4F5A6}
  Age:        1
  PDB Path:   C:\\Dev\\GridCore\\x64\\Release\\grid_sensor.pdb
\`\`\`

Program Database (PDB) paths inadvertently disclose developer usernames, internal project names, and directory structures.

Extract the specific filename of the PDB debug file (e.g. grid_sensor.pdb).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the filename).`,
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
    flag: 'HTG{grid_sensor.pdb}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the last path component: 'grid_sensor.pdb'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE34',
      seedId: 'HTG-L05-OE34',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "The CodeView debug record stores the local filesystem path where symbol PDBs were generated. The filename is grid_sensor.pdb.",
      essentialKeyPoints: [
        "PDB paths reveal internal host paths and build environment hierarchies.",
        "Stripping debug records is a standard hardening measure before software release."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{grid_sensor.pdb}' or 'grid_sensor.pdb'.",
        partialCredit: "Submits full absolute path.",
        noCredit: "Submits GUID signature."
      },
      acceptableAlternatives: [
        'HTG{grid_sensor.pdb}',
        'grid_sensor.pdb',
        'GRID_SENSOR.PDB',
        'grid_sensor'
      ]
    }
  },
  {
    stableId: 'HTG-L05-OE35',
    order: 35,
    levelNumber: 5,
    title: 'Linux File Command Stripped Binary Classification',
    prompt: `An engineer runs the standard Linux \`file\` utility on a target binary:

\`\`\`text
$ file target_app
target_app: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=8a7b6c5d, stripped
\`\`\`

What 8-letter lowercase adjective at the end of the output indicates that local symbol tables, function names, and debugging line records have been removed from the binary?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the adjective, e.g. stripped).`,
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
    flag: 'HTG{stripped}',
    hints: [
      {
        hintIndex: 1,
        content: "The keyword is 'stripped' (produced by the 'strip' command).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE35',
      seedId: 'HTG-L05-OE35',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "Stripped binaries lack .symtab and .strtab symbol sections, requiring reverse engineers to identify functions by analysis rather than symbol names.",
      essentialKeyPoints: [
        "The strip utility removes non-essential symbol tables and DWARF debug data.",
        "Dynamically linked binaries retain .dynsym so the dynamic linker can resolve shared library symbols."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{stripped}' or 'stripped'.",
        partialCredit: "Submits uppercase 'STRIPPED'.",
        noCredit: "Submits dynamically linked or x86-64."
      },
      acceptableAlternatives: ['HTG{stripped}', 'stripped', 'STRIPPED', 'HTG{STRIPPED}']
    }
  },
  {
    stableId: 'HTG-L05-OE36',
    order: 36,
    levelNumber: 5,
    title: 'UTF-16LE Wide Character String Extraction',
    prompt: `A static analysis scanner examines a binary that stores user interface prompts as 2-byte wide characters (UTF-16 Little-Endian):

\`\`\`text
Offset  00 01 02 03 04 05 06 07 08 09
0x4080  47 00 52 00 49 00 44 00 00 00
\`\`\`

Standard ASCII \`strings\` filters fail to capture this string because of the alternating null bytes (\`0x00\`).

Reconstruct the 4-character ASCII string represented by this UTF-16LE byte sequence.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter word).`,
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
    flag: 'HTG{GRID}',
    hints: [
      {
        hintIndex: 1,
        content: "0x0047='G', 0x0052='R', 0x0049='I', 0x0044='D': 'GRID'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE36',
      seedId: 'HTG-L05-OE36',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "Windows APIs commonly use UTF-16LE (wchar_t). In UTF-16LE, Latin characters are represented by their ASCII byte followed by 0x00. The string is GRID.",
      essentialKeyPoints: [
        "Running 'strings -e l' extracts 16-bit little-endian wide strings.",
        "Many security checks only search for 8-bit ASCII, missing wide-string indicators."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GRID}' or 'GRID'.",
        partialCredit: "Submits lowercase 'grid'.",
        noCredit: "Submits raw bytes or partial string."
      },
      acceptableAlternatives: ['HTG{GRID}', 'GRID', 'grid', 'HTG{grid}']
    }
  },
  {
    stableId: 'HTG-L05-OE37',
    order: 37,
    levelNumber: 5,
    title: 'ELF Dynamic Symbol Table C Library Function Binding',
    prompt: `An analyst inspects dynamic symbol references using \`readelf -s --dyn-syms\`:

\`\`\`text
Symbol table '.dynsym' contains 14 entries:
   Num:    Value          Size Type    Bind   Vis      Ndx Name
     4: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND puts@@GLIBC_2.2.5
\`\`\`

The \`UND\` section index indicates an undefined external symbol dynamically resolved at runtime from the C standard library.

Extract the function name being resolved from GLIBC.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name, e.g. puts).`,
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
    flag: 'HTG{puts}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the function identifier preceding the '@@' delimiter.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE37',
      seedId: 'HTG-L05-OE37',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "puts is the standard C library function for printing strings with a trailing newline. The symbol versioning suffix @@GLIBC_2.2.5 binds it to GLIBC.",
      essentialKeyPoints: [
        "ELF symbol versioning ensures compatibility across different shared library versions.",
        "Dynamic symbols in .dynsym remain intact even after stripping debugging symbols."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{puts}' or 'puts'.",
        partialCredit: "Submits uppercase 'PUTS'.",
        noCredit: "Submits full versioned string puts@@GLIBC_2.2.5."
      },
      acceptableAlternatives: ['HTG{puts}', 'puts', 'PUTS', 'HTG{PUTS}']
    }
  },
  {
    stableId: 'HTG-L05-OE38',
    order: 38,
    levelNumber: 5,
    title: 'PE Export Directory Function Ordinal Resolution',
    prompt: `An examiner reviews the Export Address Table of a dynamic link library (\`grid_core.dll\`):

\`\`\`text
Export Directory:
  Ordinal Base: 1
  Number of Functions: 2
  Number of Names: 2

  Ordinal   RVA         Name
  1         0x00001020  InitializeGrid
  2         0x00001150  StartTelemetry
\`\`\`

Windows PE export directories map function names to 16-bit integer ordinals using \`Ordinal Base + NameIndex\`.

What integer ordinal number is assigned to the exported function \`StartTelemetry\`?

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
        content: "Read the Ordinal column for 'StartTelemetry': 2.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE38',
      seedId: 'HTG-L05-OE38',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "Functions can be imported or exported by name or by ordinal. StartTelemetry is exported with ordinal 2.",
      essentialKeyPoints: [
        "Importing by ordinal hides function names from static string inspection.",
        "The Ordinal Base (commonly 1) offsets the raw index array."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2}' or '2'.",
        partialCredit: "Submits text 'two'.",
        noCredit: "Submits ordinal 1 or function RVA."
      },
      acceptableAlternatives: ['HTG{2}', '2', 'two']
    }
  },
  {
    stableId: 'HTG-L05-OE39',
    order: 39,
    levelNumber: 5,
    title: 'Go Language Compiler Version Metadata Extraction',
    prompt: `An analyst analyzes a statically linked binary compiled with the Go programming language using the built-in \`go version\` utility:

\`\`\`text
$ go version telemetry_agent
telemetry_agent: go1.21.5
\`\`\`

Go executables embed runtime version metadata and dependency module paths inside the binary structure (in the \`.go.buildinfo\` section).

Extract the Go compiler version string reported for this binary (e.g. go1.21.5).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the version string).`,
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
    flag: 'HTG{go1.21.5}',
    hints: [
      {
        hintIndex: 1,
        content: "The version string is 'go1.21.5'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE39',
      seedId: 'HTG-L05-OE39',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "Go binaries contain build info metadata including compiler version and package dependencies. The version is go1.21.5.",
      essentialKeyPoints: [
        "Go's runtime embeds rich metadata that survives symbol stripping.",
        "Compiler version identification assists in matching standard library disassembly patterns."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{go1.21.5}' or 'go1.21.5'.",
        partialCredit: "Submits '1.21.5'.",
        noCredit: "Submits binary name telemetry_agent."
      },
      acceptableAlternatives: ['HTG{go1.21.5}', 'go1.21.5', '1.21.5']
    }
  },
  {
    stableId: 'HTG-L05-OE40',
    order: 40,
    levelNumber: 5,
    title: 'Rust Symbol Name Demangling Identification',
    prompt: `A reverse engineer inspects the symbol table of a binary compiled with Rust using the v0 name mangling scheme (RFC 2603):

\`\`\`text
Mangled Symbol: _RNvCs1234_7mycrate3foo
\`\`\`

In the Rust v0 mangling grammar:
- \`_R\` identifies the Rust v0 mangling prefix
- \`N\` indicates a nested namespace path
- \`v\` precedes a disambiguator
- \`7mycrate\` specifies the 7-character crate identifier (\`mycrate\`)
- \`3foo\` specifies the 3-character function name identifier (\`foo\`)

What is the demangled base function name?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name, e.g. foo).`,
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
    flag: 'HTG{foo}',
    hints: [
      {
        hintIndex: 1,
        content: "The 3-character function name is 'foo'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE40',
      seedId: 'HTG-L05-OE40',
      subtopic: 'Strings, symbols, imports, and binary metadata',
      explanation: "Rust v0 mangling encodes lengths before identifiers. '3foo' represents the function name foo inside crate mycrate.",
      essentialKeyPoints: [
        "Name mangling encodes namespaces, types, and crate hashes into unique linker symbols.",
        "Demangling tools (rustfilt) reconstruct original Rust function signatures."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{foo}' or 'foo'.",
        partialCredit: "Submits uppercase 'FOO'.",
        noCredit: "Submits crate name mycrate."
      },
      acceptableAlternatives: ['HTG{foo}', 'foo', 'FOO', 'HTG{FOO}']
    }
  }
];

module.exports = subtopic4Questions;

