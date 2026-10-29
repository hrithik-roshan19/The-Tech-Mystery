const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    stableId: 'HTG-L04-OE21',
    order: 21,
    levelNumber: 4,
    title: 'EXIF GPS Geolocation Decimal Degrees Conversion',
    prompt: `An investigator extracts EXIF metadata from a surveillance image captured near an electrical sub-facility:

\`\`\`text
GPS Latitude Ref:     North
GPS Latitude:         48 deg 51' 24.12" N
GPS Longitude Ref:    East
GPS Longitude:        2 deg 21' 7.20" E
\`\`\`

Convert the GPS Latitude coordinate (degrees, minutes, seconds) into decimal degrees format, rounded to exactly 4 decimal places (formula: degrees + minutes/60 + seconds/3600).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the decimal number, e.g. 48.8567).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{48.8567}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 48 + (51 / 60) + (24.12 / 3600) = 48 + 0.85 + 0.0067 = 48.8567.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE21',
      seedId: 'HTG-L04-OE21',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "Standard GPS coordinates in DMS format convert to decimal degrees by adding fractional minutes and seconds. 48 deg 51' 24.12\" equals 48.8567.",
      essentialKeyPoints: [
        "EXIF metadata often retains exact photographic GPS coordinates.",
        "Converting DMS to decimal degrees is essential for GIS and mapping queries."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{48.8567}' or '48.8567'.",
        partialCredit: "Submits unrounded decimal representation.",
        noCredit: "Submits longitude coordinate or raw DMS string."
      },
      acceptableAlternatives: ['HTG{48.8567}', '48.8567']
    }
  },
  {
    stableId: 'HTG-L04-OE22',
    order: 22,
    levelNumber: 4,
    title: 'PDF Document Producer Software Fingerprint',
    prompt: `A digital forensics technician runs \`pdfinfo\` against a leaked incident report PDF:

\`\`\`text
Title:          Q1 Network Telemetry Audit
Creator:        Automated Report Daemon
Producer:       ReportLab PDF Library - version 3.5.42
CreationDate:   Mon Mar 16 10:14:02 2026 UTC
Tagged:         no
UserProperties: no
Suspects:       no
\`\`\`

Identify the exact software library version number of the ReportLab PDF producer recorded in this document metadata.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the version string).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{3.5.42}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the version number following '- version ' in the Producer string.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE22',
      seedId: 'HTG-L04-OE22',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "PDF metadata fields Creator and Producer expose the underlying generation pipeline. The software version is 3.5.42.",
      essentialKeyPoints: [
        "Producer tags provide software library fingerprints useful for identifying automated tooling.",
        "Disclosed library versions assist in vulnerability identification and artifact attribution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{3.5.42}' or '3.5.42'.",
        partialCredit: "Submits 'ReportLab 3.5.42'.",
        noCredit: "Submits the Creator field string."
      },
      acceptableAlternatives: ['HTG{3.5.42}', '3.5.42']
    }
  },
  {
    stableId: 'HTG-L04-OE23',
    order: 23,
    levelNumber: 4,
    title: 'Office Open XML (OOXML) Core Metadata Attribution',
    prompt: `An analyst unzips a Microsoft Word document (\`.docx\`) and examines the Dublin Core metadata file \`docProps/core.xml\`:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>Substation Grid Topography</dc:title>
  <dc:creator>Elena Rostova</dc:creator>
  <cp:lastModifiedBy>Marcus Reed</cp:lastModifiedBy>
  <cp:revision>4</cp:revision>
</cp:coreProperties>
\`\`\`

Identify the full name of the user who last modified this document according to the core properties.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the full name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{Marcus Reed}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the value enclosed within the <cp:lastModifiedBy> XML tags.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE23',
      seedId: 'HTG-L04-OE23',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "OOXML packages store Dublin Core and custom properties in XML format. The lastModifiedBy tag records Marcus Reed.",
      essentialKeyPoints: [
        "OOXML documents (docx, xlsx, pptx) are ZIP archives containing structured XML metadata.",
        "Author and editor fields frequently survive format conversion and redaction."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Marcus Reed}' or 'Marcus Reed'.",
        partialCredit: "Submits lowercase 'marcus reed' or 'Marcus_Reed'.",
        noCredit: "Submits initial creator Elena Rostova."
      },
      acceptableAlternatives: ['HTG{Marcus Reed}', 'Marcus Reed', 'marcus reed', 'MARCUS REED', 'Marcus_Reed']
    }
  },
  {
    stableId: 'HTG-L04-OE24',
    order: 24,
    levelNumber: 4,
    title: 'EXIF Camera Body Serial Number Extraction',
    prompt: `A forensic examiner processes an evidentiary JPEG photograph seized from an adversary drop site using \`exiftool photo.jpg\`:

\`\`\`text
Camera Model Name:               EOS 90D
Camera Body Serial Number:        SN-90218-XQ4
Lens Model:                       EF-S 18-135mm f/3.5-5.6 IS USM
Software:                         Digital Photo Professional
Focal Length:                     50.0 mm
\`\`\`

Extract the unique Camera Body Serial Number recorded in the camera's EXIF metadata.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the serial number).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{SN-90218-XQ4}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the string value for 'Camera Body Serial Number'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE24',
      seedId: 'HTG-L04-OE24',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "Camera body serial numbers provide physical device attribution linking photos across multiple disparate online accounts or drop sites.",
      essentialKeyPoints: [
        "Device serial numbers in EXIF data provide hardware-level correlation.",
        "Social media platforms often scrub EXIF, but raw email attachments and file drops preserve it."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SN-90218-XQ4}' or 'SN-90218-XQ4'.",
        partialCredit: "Submits lowercase 'sn-90218-xq4'.",
        noCredit: "Submits camera model EOS 90D."
      },
      acceptableAlternatives: ['HTG{SN-90218-XQ4}', 'SN-90218-XQ4', 'sn-90218-xq4']
    }
  },
  {
    stableId: 'HTG-L04-OE25',
    order: 25,
    levelNumber: 4,
    title: 'PDF Incremental Update Redaction Recovery',
    prompt: `A confidential PDF document appears to have black visual redaction bars applied over classified project codenames. However, analyzing the PDF structure reveals that the redactions were applied via an incremental update (appending a new revision trailer) without flattening the underlying stream:

\`\`\`text
%% Revision 1 Object Stream (Offset 0x0012A0)
14 0 obj
<< /Type /Annot /Subtype /Text /Subject (Operation Cipher: ALPHA-REDACT-774) >>
endobj

%% Revision 2 Appended Incremental Update (Offset 0x0048C0)
22 0 obj
<< /Type /Annot /Subtype /Square /Rect [100 200 300 220] /IC [0 0 0] >>
endobj
\`\`\`

Extract the unredacted operational codename hidden in the original object stream.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the codename).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{ALPHA-REDACT-774}',
    hints: [
      {
        hintIndex: 1,
        content: "Inspect the value following 'Operation Cipher: ' in object 14 0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE25',
      seedId: 'HTG-L04-OE25',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "PDFs support incremental updates by appending changes to the end of the file. Incomplete redaction that merely overlays black rectangles leaves underlying objects intact in earlier revisions.",
      essentialKeyPoints: [
        "PDF incremental saves preserve superseded and obscured document content.",
        "True redaction requires sanitizing and rewriting the PDF object streams entirely."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ALPHA-REDACT-774}' or 'ALPHA-REDACT-774'.",
        partialCredit: "Submits lowercase 'alpha-redact-774'.",
        noCredit: "Submits annotation rectangle coordinates."
      },
      acceptableAlternatives: ['HTG{ALPHA-REDACT-774}', 'ALPHA-REDACT-774', 'alpha-redact-774']
    }
  },
  {
    stableId: 'HTG-L04-OE26',
    order: 26,
    levelNumber: 4,
    title: 'PNG Ancillary Text Chunk Metadata Extraction',
    prompt: `An analyst parses the binary chunks of a suspicious PNG logo image using a chunk inspection tool:

\`\`\`text
Chunk: IHDR (Offset: 0x00008, Length: 13)
Chunk: sRGB (Offset: 0x00021, Length: 1)
Chunk: tEXt (Offset: 0x0002E, Length: 22)
       Keyword: 'Software'
       Text:    'GIMP 2.10.32'
Chunk: IDAT (Offset: 0x0004C, Length: 1024)
Chunk: IEND (Offset: 0x00454, Length: 0)
\`\`\`

Identify the authoring software and version string stored inside the PNG \`tEXt\` ancillary chunk.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the software string).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{GIMP 2.10.32}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the Text string associated with the 'Software' keyword.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE26',
      seedId: 'HTG-L04-OE26',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "PNG specifications define ancillary chunks including tEXt, zTXt, and iTXt for storing arbitrary textual metadata such as authoring software.",
      essentialKeyPoints: [
        "PNG tEXt chunks store uncompressed keyword-text pairs.",
        "Ancillary chunk analysis identifies software environments and editing histories."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GIMP 2.10.32}' or 'GIMP 2.10.32'.",
        partialCredit: "Submits 'GIMP_2.10.32'.",
        noCredit: "Submits chunk names like IHDR or IDAT."
      },
      acceptableAlternatives: ['HTG{GIMP 2.10.32}', 'GIMP 2.10.32', 'GIMP_2.10.32', 'GIMP2.10.32']
    }
  },
  {
    stableId: 'HTG-L04-OE27',
    order: 27,
    levelNumber: 4,
    title: 'NTFS Timestomping Discrepancy Analysis',
    prompt: `Forensic analysis of an NTFS Master File Table (MFT) record for an executable named \`updater.exe\` reveals a classic timestomping anti-forensics anomaly:

\`\`\`text
MFT Record: 10245
$STANDARD_INFORMATION ($SI) Timestamps:
  Created:       2018-01-01 00:00:00 UTC
  Modified:      2018-01-01 00:00:00 UTC

$FILE_NAME ($FN) Timestamps:
  Created:       2026-04-12 11:22:33 UTC
  Modified:      2026-04-12 11:22:33 UTC
\`\`\`

Standard user-mode API timestomping alters the \`$STANDARD_INFORMATION\` attribute while leaving the kernel-maintained \`$FILE_NAME\` attribute intact.

What is the true four-digit calendar year in which this executable was actually created on the volume?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-digit year).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{2026}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the year recorded in the $FILE_NAME attribute.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE27',
      seedId: 'HTG-L04-OE27',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "In NTFS forensics, $FILE_NAME attributes can only be updated by the kernel during file rename or move operations. Discrepancies where $SI precedes $FN indicate timestomping.",
      essentialKeyPoints: [
        "$STANDARD_INFORMATION timestamps can be manipulated via SetFileTime Win32 APIs.",
        "$FILE_NAME timestamps preserve historical file creation integrity."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2026}' or '2026'.",
        partialCredit: "Submits full ISO date '2026-04-12'.",
        noCredit: "Submits spoofed year 2018."
      },
      acceptableAlternatives: ['HTG{2026}', '2026']
    }
  },
  {
    stableId: 'HTG-L04-OE28',
    order: 28,
    levelNumber: 4,
    title: 'High-Precision EXIF Sub-Second Timestamp Analysis',
    prompt: `An incident response team examines metadata from two consecutive digital snapshots taken during an unauthorized facility entry:

\`\`\`text
Snapshot A:
  DateTimeOriginal:       2026:05:10 09:14:22
  SubSecTimeOriginal:     842
  OffsetTimeOriginal:     +00:00

Snapshot B:
  DateTimeOriginal:       2026:05:10 09:14:22
  SubSecTimeOriginal:     915
  OffsetTimeOriginal:     +00:00
\`\`\`

Identify the 3-digit millisecond value recorded for Snapshot A.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-digit number).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{842}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the SubSecTimeOriginal value for Snapshot A.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE28',
      seedId: 'HTG-L04-OE28',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "EXIF SubSecTime tags record sub-second fractional timing (milliseconds) allowing forensic chronological sequencing when images share the same second.",
      essentialKeyPoints: [
        "Sub-second timestamps resolve burst shooting sequences.",
        "Comparing sub-second offsets establishes exact camera timing intervals."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{842}' or '842'.",
        partialCredit: "Submits '0.842'.",
        noCredit: "Submits Snapshot B value 915."
      },
      acceptableAlternatives: ['HTG{842}', '842']
    }
  },
  {
    stableId: 'HTG-L04-OE29',
    order: 29,
    levelNumber: 4,
    title: 'IPTC Photojournalism Metadata Headline Recovery',
    prompt: `An analyst recovers embedded IPTC-NAA metadata from a promotional image posted to a synthetic marketing portal:

\`\`\`text
IPTC Application Record Version: 4
IPTC:Headline:                   Project Borealis Field Test 04
IPTC:By-line:                    K. Lin
IPTC:Credit:                     Grid Defense Communications
IPTC:Source:                     Internal Field Unit
\`\`\`

Extract the overarching project name referenced in the IPTC Headline (the two words preceding 'Field Test').

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the two-word project name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{Project Borealis}',
    hints: [
      {
        hintIndex: 1,
        content: "The two words are 'Project Borealis'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE29',
      seedId: 'HTG-L04-OE29',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "IPTC metadata fields store journalistic and archival context. The project name in the headline is Project Borealis.",
      essentialKeyPoints: [
        "IPTC metadata complements EXIF by storing editorial descriptions, titles, and credit lines.",
        "Publicly released graphics often leak internal project titles through IPTC tags."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Project Borealis}' or 'Project Borealis'.",
        partialCredit: "Submits lowercase 'project borealis' or 'Project_Borealis'.",
        noCredit: "Submits full headline with 'Field Test 04'."
      },
      acceptableAlternatives: [
        'HTG{Project Borealis}',
        'Project Borealis',
        'project borealis',
        'PROJECT BOREALIS',
        'Project_Borealis'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE30',
    order: 30,
    levelNumber: 4,
    title: 'ZIP Archive Central Directory Comment Attribution',
    prompt: `An investigator examines an untrusted ZIP archive using \`zipinfo -v release-bundle.zip\`:

\`\`\`text
Archive:  release-bundle.zip
Zip file size: 1048576 bytes, number of entries: 42
There is a zipfile comment (37 bytes):
  Build artifact signed by CI-Worker-9
End-of-central-directory record:
  Number of entries on this disk: 42
  Size of central directory: 3840 bytes
\`\`\`

Extract the identifier of the automated CI worker node named in the zipfile comment.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the worker identifier).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{CI-Worker-9}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the worker name starting with 'CI-Worker-'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE30',
      seedId: 'HTG-L04-OE30',
      subtopic: 'File Provenance, Timestamps & Document Metadata',
      explanation: "ZIP file formats include an optional global archive comment stored in the End of Central Directory (EOCD) record. The worker node is CI-Worker-9.",
      essentialKeyPoints: [
        "ZIP files contain both local file headers and a central directory with global comments.",
        "Archive comments frequently reveal build automation infrastructure details."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CI-Worker-9}' or 'CI-Worker-9'.",
        partialCredit: "Submits lowercase 'ci-worker-9'.",
        noCredit: "Submits the entire comment string."
      },
      acceptableAlternatives: ['HTG{CI-Worker-9}', 'CI-Worker-9', 'ci-worker-9']
    }
  }
];

module.exports = subtopic3Questions;

