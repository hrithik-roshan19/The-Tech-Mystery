const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L06-OE51',
    order: 51,
    levelNumber: 6,
    title: 'NTFS Master File Table (MFT) Record Magic Signature',
    prompt: `A disk forensics investigator carves raw disk sectors to recover corrupted NTFS metadata structures. Examining the first 4 bytes of an allocated 1024-byte Master File Table record reveals:

\`\`\`text
00000000  46 49 4c 45 30 00 03 00  ... |FILE0...|
\`\`\`

Valid MFT records begin with a standard 4-byte ASCII magic identifier (while corrupt records marked with a fixup error begin with \`BAAD\`).

What is the 4-byte ASCII magic signature located at offset 0 of every valid NTFS Master File Table entry?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-character signature).`,
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
    flag: 'HTG{FILE}',
    hints: [
      {
        hintIndex: 1,
        content: "The 4 ASCII letters correspond to hex bytes 0x46, 0x49, 0x4C, 0x45: FILE.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE51',
      seedId: 'HTG-L06-OE51',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "Every valid NTFS MFT record begins with the 4-byte signature 'FILE' (0x46 0x49 0x4C 0x45).",
      essentialKeyPoints: [
        "MFT records store metadata, timestamps, and data runs for every file on an NTFS volume.",
        "The 'FILE' magic signature allows carving tools to reconstruct MFT entries from unallocated clusters."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{FILE}' or 'FILE'.",
        partialCredit: "Submits lowercase 'file'.",
        noCredit: "Submits BAAD or NTFS."
      },
      acceptableAlternatives: ['HTG{FILE}', 'FILE', 'file', 'HTG{file}']
    }
  },
  {
    stableId: 'HTG-L06-OE52',
    order: 52,
    levelNumber: 6,
    title: 'JPEG Image File Carving End of Image (EOI) Marker',
    prompt: `A forensic analyst writes a custom file carver to extract deleted image evidence from unallocated disk space. The JPEG specification defines standardized two-byte delimiters for file boundaries:

- Start of Image (SOI): \`0xFFD8\`
- [End of Image Marker]: Terminating the image stream

What is the 2-byte hexadecimal End of Image (EOI) marker used to identify the end of a valid JPEG stream?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex marker with leading 0x).`,
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
    flag: 'HTG{0xFFD9}',
    hints: [
      {
        hintIndex: 1,
        content: "SOI is 0xFFD8 and EOI is 0xFFD9.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE52',
      seedId: 'HTG-L06-OE52',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "The JPEG standard marks the End of Image with bytes 0xFF 0xD9 (EOI marker).",
      essentialKeyPoints: [
        "File carving algorithms use header (SOI) and footer (EOI) signatures to carve contiguous image blocks.",
        "0xFFD9 terminates valid JFIF and EXIF JPEG images."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xFFD9}' or '0xFFD9'.",
        partialCredit: "Submits 'FFD9' or '0xffd9'.",
        noCredit: "Submits 0xFFD8 or 0x0000."
      },
      acceptableAlternatives: ['HTG{0xFFD9}', '0xFFD9', 'FFD9', 'ffd9', '0xffd9', 'HTG{FFD9}']
    }
  },
  {
    stableId: 'HTG-L06-OE53',
    order: 53,
    levelNumber: 6,
    title: 'NTFS $DATA Attribute Type Code',
    prompt: `In the NTFS file system, file contents and metadata are organized into attribute streams inside the Master File Table record. Each attribute header contains a numeric type code:

- \`$STANDARD_INFORMATION\`: \`0x10\`
- \`$FILE_NAME\`: \`0x30\`
- \`$OBJECT_ID\`: \`0x40\`
- \`$DATA\`: [Type Code]

The \`$DATA\` attribute contains either the resident bytes or the non-resident cluster runlist representing the actual file contents.

What is the standard hexadecimal attribute type code for the NTFS \`$DATA\` attribute?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex code with leading 0x).`,
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
    flag: 'HTG{0x80}',
    hints: [
      {
        hintIndex: 1,
        content: "The hexadecimal type code is 0x80 (128 in decimal).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE53',
      seedId: 'HTG-L06-OE53',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "In NTFS, attribute type 0x80 identifies the $DATA stream holding primary file content or alternate data streams (ADS).",
      essentialKeyPoints: [
        "$DATA (0x80) stores file payloads in either resident or non-resident form.",
        "Alternate Data Streams (ADS) share the 0x80 type code with custom stream names."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x80}' or '0x80'.",
        partialCredit: "Submits '80' or '0x00000080'.",
        noCredit: "Submits 0x10 or 0x30."
      },
      acceptableAlternatives: ['HTG{0x80}', '0x80', '80', '0x00000080', 'HTG{80}']
    }
  },
  {
    stableId: 'HTG-L06-OE54',
    order: 54,
    levelNumber: 6,
    title: 'Windows Volume Shadow Copy Administrative CLI Tool',
    prompt: `An adversary pre-stages ransomware deployment by deleting local volume snapshots to prevent data recovery. The command history captures:

\`\`\`text
vssadmin delete shadows /all /quiet
\`\`\`

What is the name of this native Windows administrative command-line utility used to manage Volume Shadow Copies?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the command name).`,
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
    flag: 'HTG{vssadmin}',
    hints: [
      {
        hintIndex: 1,
        content: "Short for Volume Shadow Copy Service Administration: vssadmin.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE54',
      seedId: 'HTG-L06-OE54',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "vssadmin.exe is the built-in Windows utility used to administer Volume Shadow Copies, heavily abused by ransomware operators.",
      essentialKeyPoints: [
        "vssadmin delete shadows inhibits point-in-time snapshot recovery.",
        "Monitoring invocations of vssadmin provides high-confidence early ransomware detection."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{vssadmin}' or 'vssadmin'.",
        partialCredit: "Submits 'vssadmin.exe'.",
        noCredit: "Submits bcdedit or wbadmin."
      },
      acceptableAlternatives: ['HTG{vssadmin}', 'vssadmin', 'vssadmin.exe', 'VSSADMIN.EXE', 'HTG{vssadmin.exe}']
    }
  },
  {
    stableId: 'HTG-L06-OE55',
    order: 55,
    levelNumber: 6,
    title: 'Windows Prefetch File Run Count Extraction',
    prompt: `An investigator parses a Windows prefetch artifact (\`CMD.EXE-A1B2C3D4.pf\`) from \`C:\\Windows\\Prefetch\` to establish execution frequency:

\`\`\`text
Executable Name:       CMD.EXE
Prefetch Hash:         0xA1B2C3D4
Run Count:             42
Last Run Time:         2026-10-24 14:22:18 UTC
Previous Run Time 1:   2026-10-24 11:05:40 UTC
Previous Run Time 2:   2026-10-23 09:12:05 UTC
\`\`\`

According to this parsed prefetch file, how many total times has this binary been executed on the target host?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer run count).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'HARD',
    flag: 'HTG{42}',
    hints: [
      {
        hintIndex: 1,
        content: "Check the Run Count value in the parsed prefetch table: 42.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE55',
      seedId: 'HTG-L06-OE55',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "Windows Prefetch files record the exact execution count in their header metadata. Here, the count is 42.",
      essentialKeyPoints: [
        "Windows Prefetch files (.pf) confirm program execution even if the original binary was deleted.",
        "Prefetch header stores execution run counts and up to 8 historical execution timestamps (on Win 8+)."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{42}' or '42'.",
        partialCredit: "Submits '42 times'.",
        noCredit: "Submits hash value or timestamp."
      },
      acceptableAlternatives: ['HTG{42}', '42']
    }
  },
  {
    stableId: 'HTG-L06-OE56',
    order: 56,
    levelNumber: 6,
    title: 'Windows Vista/7/10/11 Recycle Bin Metadata File Prefix',
    prompt: `In modern Windows versions (Vista through Windows 11), files deleted to the Recycle Bin are renamed into paired files in the \`$Recycle.Bin\\<User_SID>\` directory:

1. \`$<PREFIX><RandomString>.<ext>\`: Contains deletion timestamp, file size, and original absolute path.
2. \`$R<RandomString>.<ext>\`: Contains the actual raw file data.

Which 2-character prefix (beginning with a dollar sign) identifies the metadata index file in the modern Recycle Bin?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-character prefix).`,
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
    flag: 'HTG{$I}',
    hints: [
      {
        hintIndex: 1,
        content: "The metadata file uses '$I' (Index) while raw data uses '$R'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE56',
      seedId: 'HTG-L06-OE56',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "$I files store metadata including original file path, file size, and deletion time, while $R files store the recovered content.",
      essentialKeyPoints: [
        "$I files are critical forensic artifacts for proving file provenance and user deletion intent.",
        "Modern $Recycle.Bin structure replaces the legacy INFO2 file from Windows XP."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{$I}' or '$I'.",
        partialCredit: "Submits '$i'.",
        noCredit: "Submits $R or INFO2."
      },
      acceptableAlternatives: ['HTG{$I}', '$I', '$i', 'HTG{$i}']
    }
  },
  {
    stableId: 'HTG-L06-OE57',
    order: 57,
    levelNumber: 6,
    title: 'Application Compatibility Cache (Shimcache) Registry Hive',
    prompt: `The Application Compatibility Cache (Shimcache / AppCompatCache) tracks executable file names, file sizes, and last modified timestamps to detect backward compatibility issues.

Because it persists records across reboots, it is one of the most reliable forensic artifacts for tracking program execution and presence.

The Shimcache is stored under the registry key:
\`HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache\`

Under which standard Windows Registry hive file (\`SYSTEM\`, \`SOFTWARE\`, \`SAM\`, or \`SECURITY\`) is this key maintained?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the uppercase hive name).`,
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
    flag: 'HTG{SYSTEM}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the HKLM root subkey: HKLM\\SYSTEM.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE57',
      seedId: 'HTG-L06-OE57',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "Shimcache is located in the SYSTEM hive file under CurrentControlSet\\Control\\Session Manager\\AppCompatCache.",
      essentialKeyPoints: [
        "Shimcache resides in the SYSTEM hive and commits to disk during system shutdown or restart.",
        "Shimcache proves execution and presence of tools even after files are unlinked from the MFT."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SYSTEM}' or 'SYSTEM'.",
        partialCredit: "Submits lowercase 'system'.",
        noCredit: "Submits SOFTWARE or SAM."
      },
      acceptableAlternatives: ['HTG{SYSTEM}', 'SYSTEM', 'system', 'HTG{system}']
    }
  },
  {
    stableId: 'HTG-L06-OE58',
    order: 58,
    levelNumber: 6,
    title: 'Windows Shellbags User Registry Hive File',
    prompt: `Windows Shellbags track user folder browsing preferences, window sizes, and icon positions in Windows Explorer. Even if an attacker deletes a folder after accessing it, the Shellbags entry remains to prove folder existence and traversal.

In modern Windows (Windows 7, 10, and 11), desktop and Explorer Shellbags are stored in the user-specific class registry hive located at:
\`C:\\Users\\<Username>\\AppData\\Local\\Microsoft\\Windows\\UsrClass.dat\`

What is the filename of this dedicated user registry hive file?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hive filename).`,
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
    flag: 'HTG{UsrClass.dat}',
    hints: [
      {
        hintIndex: 1,
        content: "The file is UsrClass.dat.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE58',
      seedId: 'HTG-L06-OE58',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "In modern Windows, Shellbags are primarily stored in UsrClass.dat under the user's Local AppData directory.",
      essentialKeyPoints: [
        "Shellbags establish evidence of folder access, network share navigation, and removable drive access.",
        "UsrClass.dat holds per-user shell bag artifacts across modern Windows versions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{UsrClass.dat}' or 'UsrClass.dat'.",
        partialCredit: "Submits lowercase 'usrclass.dat'.",
        noCredit: "Submits NTUSER.DAT."
      },
      acceptableAlternatives: ['HTG{UsrClass.dat}', 'UsrClass.dat', 'usrclass.dat', 'USRCLASS.DAT', 'HTG{usrclass.dat}']
    }
  },
  {
    stableId: 'HTG-L06-OE59',
    order: 59,
    levelNumber: 6,
    title: 'Windows Amcache Program Execution Artifact Hive',
    prompt: `Located at \`C:\\Windows\\appcompat\\Programs\\Amcache.hve\`, the Amcache hive is a crucial forensic repository created by the Application Experience service.

It records unexecuted and executed applications, compilation timestamps, SHA-1 file hashes, and publisher metadata, surviving binary deletion and timestomping.

What is the exact filename (including the \`.hve\` extension) of this application compatibility hive?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the filename).`,
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
    flag: 'HTG{Amcache.hve}',
    hints: [
      {
        hintIndex: 1,
        content: "It combines Amcache and .hve: Amcache.hve.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE59',
      seedId: 'HTG-L06-OE59',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "Amcache.hve stores rich program metadata including SHA-1 hashes and installation details.",
      essentialKeyPoints: [
        "Amcache provides cryptographic hashes (SHA-1) of executed programs for threat correlation.",
        "Amcache records survive executable deletion from the filesystem."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Amcache.hve}' or 'Amcache.hve'.",
        partialCredit: "Submits lowercase 'amcache.hve'.",
        noCredit: "Submits AppCompatCache or SYSTEM."
      },
      acceptableAlternatives: ['HTG{Amcache.hve}', 'Amcache.hve', 'amcache.hve', 'AMCACHE.HVE', 'HTG{amcache.hve}']
    }
  },
  {
    stableId: 'HTG-L06-OE60',
    order: 60,
    levelNumber: 6,
    title: 'NTFS USN Journal Reason Flag for File Deletion',
    prompt: `The NTFS Update Sequence Number (USN) change journal (\`$Extend\\$UsnJrnl:$J\`) logs filesystem modifications. A parsed record from the change journal shows:

\`\`\`text
RecordLength:              88
FileReferenceNumber:       0x000200000001f420
ParentFileReferenceNumber: 0x0001000000000005
Usn:                       14920480
Reason:                    FILE_DELETE | CLOSE
FileName:                  exfil_temp.zip
\`\`\`

What is the primary USN journal reason flag indicating that the file \`exfil_temp.zip\` was deleted?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the exact reason flag name).`,
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
    flag: 'HTG{FILE_DELETE}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the Reason field: FILE_DELETE.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L06-OE60',
      seedId: 'HTG-L06-OE60',
      subtopic: 'Raw disk artifacts, deleted-file recovery, and filesystem timelines',
      explanation: "The USN reason flag USN_REASON_FILE_DELETE (abbreviated FILE_DELETE) indicates file unlinking and deletion.",
      essentialKeyPoints: [
        "USN Journal records file creation, renaming, and deletion events.",
        "FILE_DELETE | CLOSE confirms the file handle was closed after being marked for deletion."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{FILE_DELETE}' or 'FILE_DELETE'.",
        partialCredit: "Submits lowercase 'file_delete'.",
        noCredit: "Submits CLOSE or FILE_CREATE."
      },
      acceptableAlternatives: ['HTG{FILE_DELETE}', 'FILE_DELETE', 'file_delete', 'HTG{file_delete}']
    }
  }
];

module.exports = subtopic6Questions;
