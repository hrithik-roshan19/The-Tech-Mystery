const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L09-OE51',
    order: 51,
    levelNumber: 9,
    title: 'Standard Portable Network Graphics (PNG) 8-Byte Magic Header',
    prompt: `Every compliant Portable Network Graphics (PNG) file begins with an immutable 8-byte magic sequence that detects transmission corruption, carriage-return conversion issues, and file type misidentification:
\`\`\`text
Offset 0x00: 89 50 4E 47 0D 0A 1A 0A
ASCII:       .   P  N  G  \\r \\n ^Z \\n
\`\`\`
What is the first byte (in 2-digit hexadecimal) of this PNG signature that has the high bit set to prevent 7-bit ASCII transmission?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hexadecimal byte).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{0x89}',
    hints: [
      {
        hintIndex: 1,
        content: "The signature starts with 0x89 (137 in decimal).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE51',
      seedId: 'HTG-L09-OE51',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "PNG files begin with 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A, starting with byte 0x89.",
      essentialKeyPoints: [
        "The 0x89 byte catches systems that strip the 8th bit.",
        "File carving tools search for 0x89504E470D0A1A0A to identify PNG start-of-file offsets."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x89}' or '0x89'.",
        partialCredit: "Submits '89'.",
        noCredit: "Submits 0xFF or 0x50."
      },
      acceptableAlternatives: ['HTG{0x89}', '0x89', '89', 'HTG{89}']
    }
  },
  {
    stableId: 'HTG-L09-OE52',
    order: 52,
    levelNumber: 9,
    title: 'PNG Mandatory Terminal Chunk Identifier',
    prompt: `PNG files are composed of a sequence of chunks. The image begins with the mandatory \`IHDR\` header chunk, followed by image data chunks (\`IDAT\`), and terminates with a mandatory empty chunk indicating that no further image data follows.

Adversaries frequently append covert archive files (e.g., RAR, ZIP) directly after this final chunk because standard image renderers stop parsing at this marker.

What 4-letter uppercase name designates this terminal PNG chunk?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter chunk name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{IEND}',
    hints: [
      {
        hintIndex: 1,
        content: "The terminal chunk is IEND (Image End).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE52',
      seedId: 'HTG-L09-OE52',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "The IEND chunk marks the formal conclusion of a PNG stream; trailing data past IEND is file slack/overlay.",
      essentialKeyPoints: [
        "IEND has 0 data bytes and a fixed CRC (0xAE426082).",
        "Payloads appended after IEND do not corrupt visual rendering."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{IEND}' or 'IEND'.",
        partialCredit: "Submits lowercase 'iend'.",
        noCredit: "Submits EOF or IDAT."
      },
      acceptableAlternatives: ['HTG{IEND}', 'IEND', 'iend', 'HTG{iend}']
    }
  },
  {
    stableId: 'HTG-L09-OE53',
    order: 53,
    levelNumber: 9,
    title: 'JPEG End of Image (EOI) Trailer Marker',
    prompt: `In the JPEG (JFIF) standard, every image stream begins with the Start of Image (SOI) marker \`0xFFD8\` and concludes with the End of Image (EOI) marker.

In file overlay steganography, data appended past the EOI marker is ignored by standard JPEG decoders, allowing large executable or archive payloads to be concealed inside the file slack.

Which 4-digit hexadecimal marker code (beginning with \`0xFF\`) represents the JPEG End of Image (EOI) marker?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-digit hex code).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{0xFFD9}',
    hints: [
      {
        hintIndex: 1,
        content: "JPEG End of Image is marker 0xFFD9.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE53',
      seedId: 'HTG-L09-OE53',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "0xFFD9 is the JPEG End of Image (EOI) marker; data appended after 0xFFD9 constitutes overlay steganography.",
      essentialKeyPoints: [
        "Carving tools scan for 0xFFD9 to detect overlay file length discrepancies.",
        "Antivirus tools flag JPEGs where the file size exceeds the EOI offset."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xFFD9}' or '0xFFD9'.",
        partialCredit: "Submits 'FFD9' or '0xffd9'.",
        noCredit: "Submits 0xFFD8 or 0xFFFF."
      },
      acceptableAlternatives: ['HTG{0xFFD9}', '0xFFD9', '0xffd9', 'FFD9', 'ffd9', 'HTG{ffd9}']
    }
  },
  {
    stableId: 'HTG-L09-OE54',
    order: 54,
    levelNumber: 9,
    title: 'ZIP Archive Local File Header Magic Signature',
    prompt: `When carving embedded archive payloads from corrupted or polyglot files, carving utilities look for the 4-byte magic signature that prefixes each local file entry within a ZIP archive.

In ASCII, the first two bytes are \`PK\` (the initials of PKZIP creator Phil Katz), followed by two control bytes:
\`\`\`text
Byte 0: 0x50 ('P')
Byte 1: 0x4B ('K')
Byte 2: 0x03
Byte 3: 0x04
\`\`\`
What 8-digit hexadecimal value (in big-endian byte order: \`0x504B0304\`) represents this standard ZIP local header magic signature?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 8-digit hex value).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{0x504B0304}',
    hints: [
      {
        hintIndex: 1,
        content: "The signature is 0x504B0304 (PK\\x03\\x04).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE54',
      seedId: 'HTG-L09-OE54',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "0x504B0304 is the magic signature for ZIP local file headers.",
      essentialKeyPoints: [
        "Carving tools scan for 0x504B0304 to locate embedded ZIP archives.",
        "Appended ZIP archives are extracted using tools like 'unzip' or 'binwalk'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x504B0304}' or '0x504B0304'.",
        partialCredit: "Submits '504B0304' or '0x504b0304'.",
        noCredit: "Submits 0x504B0506 (EOCD)."
      },
      acceptableAlternatives: ['HTG{0x504B0304}', '0x504B0304', '504B0304', '0x504b0304', '504b0304', 'HTG{504B0304}']
    }
  },
  {
    stableId: 'HTG-L09-OE55',
    order: 55,
    levelNumber: 9,
    title: 'PNG Chunk Cyclic Redundancy Check (CRC-32) Integrity Algorithm',
    prompt: `In the PNG file specification, every chunk consists of four contiguous fields:
1. Length (4 bytes, big-endian)
2. Chunk Type (4 ASCII characters, e.g. \`IDAT\`)
3. Chunk Data (variable length specified by Length)
4. CRC checksum (4 bytes)

What specific 32-bit cyclic redundancy check algorithm (abbreviated in 3 uppercase letters followed by hyphen and bit width) is calculated across the Chunk Type and Chunk Data bytes?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the algorithm name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{CRC-32}',
    hints: [
      {
        hintIndex: 1,
        content: "The checksum algorithm is CRC-32 (Cyclic Redundancy Check 32-bit).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE55',
      seedId: 'HTG-L09-OE55',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "PNG utilizes CRC-32 to detect transmission errors in chunk headers and payloads.",
      essentialKeyPoints: [
        "Modifying PNG chunk data without recalculating CRC-32 causes decoders to reject the image.",
        "Forensic tools use CRC mismatches to pinpoint tampered chunks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CRC-32}' or 'CRC-32'.",
        partialCredit: "Submits 'CRC32' or 'crc-32'.",
        noCredit: "Submits MD5 or SHA-256."
      },
      acceptableAlternatives: ['HTG{CRC-32}', 'CRC-32', 'CRC32', 'crc-32', 'crc32', 'HTG{CRC32}']
    }
  },
  {
    stableId: 'HTG-L09-OE56',
    order: 56,
    levelNumber: 9,
    title: 'Dual-Format Polyglot File Classification',
    prompt: `A single binary file can be crafted such that its header satisfies the specification of an image container (like GIF89a), while its trailing data structures or overlapping headers satisfy the specification of an archive format (like a ZIP archive) or an executable script (like JavaScript).

Such files can be rendered normally as images by web browsers while simultaneously executing as archives or scripts when processed by other applications.

What domain-specific term (originating from the Greek for "speaking many languages") classifies these multi-format dual-nature files?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{polyglot}',
    hints: [
      {
        hintIndex: 1,
        content: "Files valid in multiple formats are called polyglots.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE56',
      seedId: 'HTG-L09-OE56',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "A polyglot file is valid in two or more distinct file formats simultaneously.",
      essentialKeyPoints: [
        "GIF-ZIP and JPG-PDF polyglots bypass content-type inspection filters.",
        "Detecting polyglots involves checking for multiple independent file magic signatures."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{polyglot}' or 'polyglot'.",
        partialCredit: "Submits capitalized 'Polyglot' or 'polyglot file'.",
        noCredit: "Submits hybrid or chameleon."
      },
      acceptableAlternatives: ['HTG{polyglot}', 'polyglot', 'Polyglot', 'polyglot file', 'Polyglot File', 'HTG{Polyglot}']
    }
  },
  {
    stableId: 'HTG-L09-OE57',
    order: 57,
    levelNumber: 9,
    title: 'BMP Bitmap File Header Pixel Array Offset (bfOffBits)',
    prompt: `In the 14-byte file header of a Windows Device Independent Bitmap (BMP) file, bytes 0–1 contain the magic ASCII letters \`BM\` (\`0x42 0x4D\`).

Bytes 10–13 contain a 32-bit unsigned little-endian integer specifying the exact byte offset from the start of the file where the raster pixel array actually begins:
\`\`\`c
typedef struct {
    uint16_t bfType;       // 0x4D42 ('BM')
    uint32_t bfSize;       // Size of the BMP file in bytes
    uint16_t bfReserved1;  // 0
    uint16_t bfReserved2;  // 0
    uint32_t bfOffBits;    // Offset to start of pixel data
} BITMAPFILEHEADER;
\`\`\`
What is the structural field name (as designated in Microsoft Win32 SDK headers) for this pixel data offset field?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the field name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{bfOffBits}',
    hints: [
      {
        hintIndex: 1,
        content: "The Win32 structure field is bfOffBits.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE57',
      seedId: 'HTG-L09-OE57',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "bfOffBits defines the byte offset from file start to the pixel array; inflating bfOffBits creates hidden gap space.",
      essentialKeyPoints: [
        "Steganographers insert payloads between the header and bfOffBits.",
        "The image renders without visual corruption because the parser jumps directly to bfOffBits."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{bfOffBits}' or 'bfOffBits'.",
        partialCredit: "Submits lowercase 'bfoffbits'.",
        noCredit: "Submits bfSize or biSize."
      },
      acceptableAlternatives: ['HTG{bfOffBits}', 'bfOffBits', 'bfoffbits', 'BFOFFBITS', 'HTG{bfoffbits}']
    }
  },
  {
    stableId: 'HTG-L09-OE58',
    order: 58,
    levelNumber: 9,
    title: 'PDF Incremental Update Shadowing Mechanism',
    prompt: `The Portable Document Format (PDF) specification permits appending modifications to a document without rewriting earlier sections.

An appended revision appends new objects, an updated cross-reference table (\`xref\`), and a new trailer pointing to previous trailers via the \`/Prev\` tag:
\`\`\`text
trailer
<< /Size 42 /Root 1 0 R /Prev 12450 >>
startxref
24890
%%EOF
\`\`\`
What architectural feature of the PDF specification allows new revisions to shadow or conceal older document layers in this manner?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word phrase).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{incremental update}',
    hints: [
      {
        hintIndex: 1,
        content: "The feature is called incremental update (or incremental updates).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE58',
      seedId: 'HTG-L09-OE58',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "Incremental updates append new revisions to a PDF, allowing previous layers to remain hidden inside earlier bodies.",
      essentialKeyPoints: [
        "Forensic inspection parses all %%EOF and xref tables to unearth shadowed historical revisions.",
        "Adversaries use incremental updates to present benign content while retaining hidden data."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{incremental update}' or 'incremental update'.",
        partialCredit: "Submits 'incremental updates' or 'Incremental Update'.",
        noCredit: "Submits linearization or streams."
      },
      acceptableAlternatives: ['HTG{incremental update}', 'incremental update', 'Incremental Update', 'incremental updates', 'Incremental Updates', 'HTG{incremental updates}']
    }
  },
  {
    stableId: 'HTG-L09-OE59',
    order: 59,
    levelNumber: 9,
    title: 'Graphics Interchange Format (GIF) Logical Screen Width Field',
    prompt: `In the Graphics Interchange Format specification (GIF87a / GIF89a), the 6-byte header signature (\`GIF87a\` or \`GIF89a\`) is immediately followed by the 7-byte Logical Screen Descriptor.

Bytes 6 and 7 (offsets +6 and +7 from file start) specify what dimension of the logical display area as a 16-bit little-endian unsigned integer?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the dimension name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{width}',
    hints: [
      {
        hintIndex: 1,
        content: "Bytes 6-7 specify the Logical Screen Width; bytes 8-9 specify height.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE59',
      seedId: 'HTG-L09-OE59',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "Offsets +6 and +7 in a GIF define the Logical Screen Width.",
      essentialKeyPoints: [
        "Cropping image dimensions in the header conceals rows of pixels from normal display.",
        "Restoring the original width/height reveals cropped steganographic strips."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{width}' or 'width'.",
        partialCredit: "Submits 'Logical Screen Width' or 'Width'.",
        noCredit: "Submits height or depth."
      },
      acceptableAlternatives: ['HTG{width}', 'width', 'Width', 'Logical Screen Width', 'logical screen width', 'HTG{Width}']
    }
  },
  {
    stableId: 'HTG-L09-OE60',
    order: 60,
    levelNumber: 9,
    title: 'Carved JPEG Trailer Archive Filename Extraction',
    prompt: `A malware analyst carves an evidence JPEG image using \`binwalk\` and identifies a ZIP archive appended past the \`0xFFD9\` End of Image marker:
\`\`\`text
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
137792        0x21A40         Zip archive data, at least v2.0 to extract,
                              compressed size: 842, uncompressed size: 2480,
                              name: credential_cache.db
138814        0x21E3E         End of Zip archive
\`\`\`
What is the filename of the database file extracted from this carved ZIP archive?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the filename).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{credential_cache.db}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the archive member filename: credential_cache.db.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE60',
      seedId: 'HTG-L09-OE60',
      subtopic: 'Layered media payloads, file signatures & structural carving',
      explanation: "Binwalk extracts the ZIP archive containing 'credential_cache.db' from the JPEG trailer.",
      essentialKeyPoints: [
        "File trailer injection leaves the carrier image completely viewable.",
        "Carving isolates embedded payloads cleanly."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{credential_cache.db}' or 'credential_cache.db'.",
        partialCredit: "Submits 'credential_cache'.",
        noCredit: "Submits wrong filename."
      },
      acceptableAlternatives: ['HTG{credential_cache.db}', 'credential_cache.db', 'CREDENTIAL_CACHE.DB', 'HTG{CREDENTIAL_CACHE.DB}']
    }
  }
];

module.exports = subtopic6Questions;

