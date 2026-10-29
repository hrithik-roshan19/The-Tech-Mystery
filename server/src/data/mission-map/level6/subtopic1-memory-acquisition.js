const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L06-OE01',
    order: 1,
    levelNumber: 6,
    title: 'RFC 3227 Order of Volatility Forensics Priority',
    prompt: `An incident response team arrives on-site to triage an actively compromised industrial workstation. According to RFC 3227 (Guidelines for Evidence Collection and Archiving), digital evidence must be acquired in order of volatility from most ephemeral to least ephemeral:

1. [Most Volatile Component: CPU Cache and Registers]
2. Routing tables, ARP cache, process table, kernel statistics, memory
3. Temporary file systems
4. Disk
5. Remote logging and monitoring data
6. Physical configuration and network topology
7. Archival media

Which hardware component resides at the pinnacle of volatility and must be triaged first before main system memory (RAM)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the component name, e.g. REGISTERS).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{REGISTERS}',
    hints: [
      {
        hintIndex: 1,
        content: "RFC 3227 lists 'Registers, cache' as the most volatile digital artifacts.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE01',
      seedId: 'HTG-L06-OE01',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "RFC 3227 defines the order of volatility. CPU registers and caches are lost immediately upon state change, ranking higher in volatility than main memory (RAM).",
      essentialKeyPoints: [
        "Order of volatility prioritizes evidence collection based on lifespan and destruction risk.",
        "Capturing volatile data precedes powering down or altering system state."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{REGISTERS}' or 'REGISTERS'.",
        partialCredit: "Submits lowercase 'registers' or 'CPU Registers'.",
        noCredit: "Submits RAM, disk, or routing table."
      },
      acceptableAlternatives: ['HTG{REGISTERS}', 'REGISTERS', 'registers', 'cpu registers', 'CPU Registers']
    }
  },
  {
    stableId: 'HTG-L06-OE02',
    order: 2,
    levelNumber: 6,
    title: 'Cryptographic Memory Image Hash Verification Standard',
    prompt: `An evidence intake log for an acquired physical memory dump (\`memdump.raw\`) records its cryptographic checksum:

\`\`\`text
File:   memdump.raw
Size:   17179869184 bytes (16 GB)
Digest: 9f8e7d6c5b4a3120efbeaddeadbeef0123456789abcdef0123456789abcdef01
\`\`\`

The digest contains 64 hexadecimal characters (256 bits), representing the industry standard cryptographic secure hash algorithm used to establish evidence integrity.

What standard algorithm name (including hyphen) produced this 256-bit checksum (e.g. SHA-256)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the algorithm name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{SHA-256}',
    hints: [
      {
        hintIndex: 1,
        content: "A 64-character hex string represents a 256-bit hash: SHA-256.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE02',
      seedId: 'HTG-L06-OE02',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "64 hexadecimal characters equal 32 bytes (256 bits). SHA-256 is the standard cryptographic hash function for evidence integrity.",
      essentialKeyPoints: [
        "Cryptographic hashes verify that forensic images have not been modified post-acquisition.",
        "SHA-256 is mandatory in legal and regulatory forensic chains of custody."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SHA-256}' or 'SHA-256'.",
        partialCredit: "Submits unhyphenated 'SHA256' or lowercase 'sha-256'.",
        noCredit: "Submits MD5 or SHA-1."
      },
      acceptableAlternatives: ['HTG{SHA-256}', 'SHA-256', 'sha-256', 'SHA256', 'sha256']
    }
  },
  {
    stableId: 'HTG-L06-OE03',
    order: 3,
    levelNumber: 6,
    title: 'Linux Memory Extractor (LiME) Header Magic String',
    prompt: `An investigator examines the binary header of a raw physical memory dump acquired from an embedded Linux appliance using a kernel module:

\`\`\`text
Offset  00 01 02 03
000000  4C 69 4D 45
\`\`\`

In the Linux Memory Extractor (LiME) acquisition format, the file begins with a 4-byte magic signature in big-endian representation.

Convert these four hexadecimal bytes (\`0x4C\`, \`0x69\`, \`0x4D\`, \`0x45\`) into their 4-character mixed-case ASCII string equivalent.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the tool name, e.g. LiME).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{LiME}',
    hints: [
      {
        hintIndex: 1,
        content: "0x4C='L', 0x69='i', 0x4D='M', 0x45='E': 'LiME'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE03',
      seedId: 'HTG-L06-OE03',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "LiME produces dumps with a 4-byte header magic sequence 'LiME' (0x4C 0x69 0x4D 0x45) followed by version and range metadata.",
      essentialKeyPoints: [
        "LiME is the standard Loadable Kernel Module (LKM) for volatile memory acquisition on Linux and Android.",
        "Recognizing container headers differentiates raw memory from structured capture formats."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{LiME}' or 'LiME'.",
        partialCredit: "Submits uppercase 'LIME' or lowercase 'lime'.",
        noCredit: "Submits raw hex bytes."
      },
      acceptableAlternatives: ['HTG{LiME}', 'LiME', 'lime', 'LIME']
    }
  },
  {
    stableId: 'HTG-L06-OE04',
    order: 4,
    levelNumber: 6,
    title: 'Windows Complete Crash Dump Header Magic Signature',
    prompt: `A forensic examiner inspects the first four bytes of a Windows complete crash dump file (\`MEMORY.DMP\`):

\`\`\`text
Offset  00 01 02 03
000000  50 41 47 45
\`\`\`

In Microsoft Windows crash dump architecture, a full memory dump uses a signature indicating paged kernel memory.

Convert the four hexadecimal bytes (\`0x50\`, \`0x41\`, \`0x47\`, \`0x45\`) to their 4-character uppercase ASCII string representation.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter word).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{PAGE}',
    hints: [
      {
        hintIndex: 1,
        content: "0x50='P', 0x41='A', 0x47='G', 0x45='E': 'PAGE'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE04',
      seedId: 'HTG-L06-OE04',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "Windows crash dump headers begin with 'PAGE' (0x50414745) for full kernel memory dumps, or 'DUMP' for minidumps.",
      essentialKeyPoints: [
        "Windows crash dumps are generated automatically by KeBugCheck during Blue Screen (BSOD) events.",
        "Volatility and WinDbg parse PAGE headers to extract physical memory runs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{PAGE}' or 'PAGE'.",
        partialCredit: "Submits lowercase 'page'.",
        noCredit: "Submits minidump signature DUMP."
      },
      acceptableAlternatives: ['HTG{PAGE}', 'PAGE', 'page']
    }
  },
  {
    stableId: 'HTG-L06-OE05',
    order: 5,
    levelNumber: 6,
    title: 'Advanced Forensic Format 4 (AFF4) Container Extension',
    prompt: `Modern physical memory acquisition utilities (such as WinPmem and LinPmem) support packaging captured RAM streams and hardware memory maps into the open-source Advanced Forensic Format 4 container.

What 4-character lowercase file extension identifies files encapsulated in this structured container format (e.g. aff4)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the extension).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{aff4}',
    hints: [
      {
        hintIndex: 1,
        content: "The format extension is 'aff4'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE05',
      seedId: 'HTG-L06-OE05',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "AFF4 (Advanced Forensic Format version 4) uses the .aff4 extension to store forensic disk and memory images with compression and hash verification.",
      essentialKeyPoints: [
        "AFF4 supports linear streams, non-contiguous physical ranges, and embedded metadata.",
        "AFF4 overcomes file size limitations of legacy raw image formats."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{aff4}' or 'aff4'.",
        partialCredit: "Submits '.aff4' or uppercase 'AFF4'.",
        noCredit: "Submits raw or dd."
      },
      acceptableAlternatives: ['HTG{aff4}', 'aff4', '.aff4', 'AFF4', '.AFF4']
    }
  },
  {
    stableId: 'HTG-L06-OE06',
    order: 6,
    levelNumber: 6,
    title: 'Windows Kernel Executable Symbol Target Identification',
    prompt: `When Volatility 3 initializes an analysis session against a Windows memory dump, it queries Intermediate Symbol Format (ISF) tables to resolve kernel structures like \`_EPROCESS\`.

These symbol tables are derived from Microsoft debugging symbols (PDBs) matching the core Windows NT operating system kernel executable.

What is the filename of the primary Windows kernel image binary (located in \`System32\`) from which these symbols are generated (e.g. ntoskrnl.exe)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the kernel filename).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{ntoskrnl.exe}',
    hints: [
      {
        hintIndex: 1,
        content: "The core kernel image is 'ntoskrnl.exe'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE06',
      seedId: 'HTG-L06-OE06',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "ntoskrnl.exe is the Windows NT OS kernel binary. Volatility 3 builds symbol tables by downloading ntkrnlmp.pdb matching the ntoskrnl.exe build ID.",
      essentialKeyPoints: [
        "Kernel symbol tables define member offsets inside opaque OS structures.",
        "Volatility 3 uses automated symbol generation eliminating manual profiles."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ntoskrnl.exe}' or 'ntoskrnl.exe'.",
        partialCredit: "Submits 'ntoskrnl' without extension or 'ntkrnlmp.pdb'.",
        noCredit: "Submits hal.dll or win32k.sys."
      },
      acceptableAlternatives: ['HTG{ntoskrnl.exe}', 'ntoskrnl.exe', 'ntoskrnl', 'ntkrnlmp.pdb', 'NTOSKRNL.EXE']
    }
  },
  {
    stableId: 'HTG-L06-OE07',
    order: 7,
    levelNumber: 6,
    title: 'Live Memory Acquisition RAM Smear Inconsistency Artifact',
    prompt: `During software-based live memory acquisition of a production server, the operating system continues scheduling threads and allocating pages while the physical memory space is read sequentially.

This continuous background activity causes memory pages recorded at the end of the acquisition to be out-of-sync with memory structures read at the beginning.

What standard 2-word forensic term describes this temporal inconsistency artifact (format: two words separated by a space or underscore, e.g. RAM smear)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{RAM_SMEAR}',
    hints: [
      {
        hintIndex: 1,
        content: "The phenomenon is known as 'RAM smear' or 'memory smear'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE07',
      seedId: 'HTG-L06-OE07',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "RAM smear occurs when live memory changes during the acquisition window, creating minor inconsistencies across pointers or page tables.",
      essentialKeyPoints: [
        "Live software acquisition cannot achieve an instantaneous atomic snapshot.",
        "Forensic frameworks account for RAM smear by verifying bidirectional pointer linkages."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{RAM_SMEAR}' or 'RAM smear'.",
        partialCredit: "Submits 'memory smear' or lowercase 'ram smear'.",
        noCredit: "Submits buffer overflow or race condition."
      },
      acceptableAlternatives: [
        'HTG{RAM_SMEAR}',
        'RAM_SMEAR',
        'ram smear',
        'RAM smear',
        'memory smear',
        'MEMORY_SMEAR',
        'RAM SMEAR'
      ]
    }
  },
  {
    stableId: 'HTG-L06-OE08',
    order: 8,
    levelNumber: 6,
    title: 'Hardware Direct Memory Access Protection Unit (IOMMU)',
    prompt: `Hardware-based physical memory acquisition techniques connect specialized devices (such as PCIe cards or Thunderbolt dongles) to read host memory directly without CPU involvement.

To protect operating systems against rogue DMA devices reading arbitrary memory, modern CPU architectures implement hardware virtualization memory translation units.

What 5-letter uppercase acronym designates the hardware unit responsible for restricting Direct Memory Access page mappings (e.g. IOMMU)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{IOMMU}',
    hints: [
      {
        hintIndex: 1,
        content: "The acronym stands for Input-Output Memory Management Unit.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE08',
      seedId: 'HTG-L06-OE08',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "The IOMMU (Input-Output Memory Management Unit) maps device-visible virtual addresses to physical addresses, blocking untrusted DMA peripherals.",
      essentialKeyPoints: [
        "IOMMU mitigates physical Thunderbolt/PCIe DMA attacks.",
        "Modern OS features (Kernel DMA Protection) enable IOMMU by default."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{IOMMU}' or 'IOMMU'.",
        partialCredit: "Submits lowercase 'iommu'.",
        noCredit: "Submits MMU (which manages CPU virtual memory, not device I/O)."
      },
      acceptableAlternatives: ['HTG{IOMMU}', 'IOMMU', 'iommu']
    }
  },
  {
    stableId: 'HTG-L06-OE09',
    order: 9,
    levelNumber: 6,
    title: 'Windows Hibernation File Magic Header Signature',
    prompt: `An analyst analyzes an uncompressed Windows hibernation file (\`hiberfil.sys\`) extracted from an enterprise laptop:

\`\`\`text
Offset  00 01 02 03
000000  48 49 42 52
\`\`\`

The first four bytes identify the file format used by the Windows power management subsystem to serialize physical memory to disk during hibernation.

Convert these four hexadecimal bytes (\`0x48\`, \`0x49\`, \`0x42\`, \`0x52\`) into their 4-character uppercase ASCII string equivalent.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter signature, e.g. HIBR).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{HIBR}',
    hints: [
      {
        hintIndex: 1,
        content: "0x48='H', 0x49='I', 0x42='B', 0x48='R': 'HIBR'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE09',
      seedId: 'HTG-L06-OE09',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "Windows hibernation files use the magic signature 'HIBR' (or 'POWR' in legacy versions) at offset 0. hiberfil.sys contains compressed physical memory.",
      essentialKeyPoints: [
        "hiberfil.sys preserves memory contents from the last hibernation event.",
        "Volatility's imagecopy converts hiberfil.sys into standard raw memory dumps."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{HIBR}' or 'HIBR'.",
        partialCredit: "Submits lowercase 'hibr' or legacy signature 'POWR'.",
        noCredit: "Submits PAGE or DUMP."
      },
      acceptableAlternatives: ['HTG{HIBR}', 'HIBR', 'hibr', 'POWR', 'powr']
    }
  },
  {
    stableId: 'HTG-L06-OE10',
    order: 10,
    levelNumber: 6,
    title: 'Digital Forensic Chain of Custody Intake Identifier',
    prompt: `During evidence intake logging following the acquisition of a volatile memory dump, an examiner fills out standard chain-of-custody documentation:

\`\`\`text
Case Number:      2026-GRID-SEC
Item Identifier:  EV-0104
Description:      16GB DDR4 Physical Memory Capture (LiME raw format)
Acquiring Agent:  Lead Examiner
Acquisition Date: 2026-04-12 11:20:00 UTC
Hash (SHA-256):   9f8e7d...
\`\`\`

In standardized forensic evidence management procedures, what specific alphanumeric string represents the unique \`Item Identifier\` assigned to track this physical evidence artifact?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the identifier string, e.g. EV-0104).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{EV-0104}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the value of 'Item Identifier': 'EV-0104'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE10',
      seedId: 'HTG-L06-OE10',
      subtopic: 'Memory acquisition, integrity, and evidence handling',
      explanation: "The unique Item Identifier (EV-0104) binds physical and digital artifacts to the chain-of-custody record.",
      essentialKeyPoints: [
        "Chain of custody accounts for evidence custody, transfer, and analysis chronology.",
        "Item identifiers prevent cross-contamination across forensic cases."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{EV-0104}' or 'EV-0104'.",
        partialCredit: "Submits lowercase 'ev-0104'.",
        noCredit: "Submits case number 2026-GRID-SEC."
      },
      acceptableAlternatives: ['HTG{EV-0104}', 'EV-0104', 'ev-0104']
    }
  }
];

module.exports = subtopic1Questions;

