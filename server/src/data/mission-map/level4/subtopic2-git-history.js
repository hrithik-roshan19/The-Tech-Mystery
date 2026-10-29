const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    stableId: 'HTG-L04-OE11',
    order: 11,
    levelNumber: 4,
    title: 'Dangling Git Commit Recovery via Reflog',
    prompt: `A developer pushed an accidental commit containing hardcoded secrets and attempted to expunge it using \`git reset --hard HEAD~1\`. An investigator clones the full repository metadata and inspects \`git reflog\`:

\`\`\`text
4a9f82d1 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
b8e210ca HEAD@{1}: commit: remove debug scripts
4a9f82d1c6e7b30a5814e9f72c10b48a12345678 HEAD@{2}: commit: staging deployment and hardcoded credentials
901c44fa HEAD@{3}: commit: initial release
\`\`\`

Extract the 8-character abbreviated commit SHA-1 identifier for the orphaned commit where credentials were committed.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 8-character hash).`,
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
    flag: 'HTG{4a9f82d1}',
    hints: [
      {
        hintIndex: 1,
        content: "Take the first 8 hexadecimal characters of the commit hash at HEAD@{2}.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE11',
      seedId: 'HTG-L04-OE11',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "Git commit resets modify branch pointers but leave commit objects in the object store until garbage collected. Reflog and fsck recover dangling commits such as 4a9f82d1.",
      essentialKeyPoints: [
        "Git history resets do not destroy commit objects immediately.",
        "Reflog provides an audit trail of HEAD pointer movements."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{4a9f82d1}' or '4a9f82d1'.",
        partialCredit: "Submits full 40-character SHA.",
        noCredit: "Submits previous or subsequent commit hashes."
      },
      acceptableAlternatives: [
        'HTG{4a9f82d1}',
        '4a9f82d1',
        'HTG{4a9f82d1c6e7b30a5814e9f72c10b48a12345678}',
        '4a9f82d1c6e7b30a5814e9f72c10b48a12345678'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE12',
    order: 12,
    levelNumber: 4,
    title: 'Git Commit Object Raw Header Attribution',
    prompt: `An incident response engineer inspects a suspect Git commit directly using \`git cat-file -p HEAD\`:

\`\`\`text
tree e3b0c44298fc1c149afbf4c8996fb92427ae41e4
parent 7d8f92a10b4c5e6f
author Devon Vance <dvance@synthetic-corp.local> 1711929600 +0000
committer Devon Vance <dvance@synthetic-corp.local> 1711929600 +0000

Update primary telemetry routing tables
\`\`\`

Extract the local-part username of the author's email address (the identifier preceding the '@' symbol).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the username).`,
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
    flag: 'HTG{dvance}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the author line between '<' and '@'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE12',
      seedId: 'HTG-L04-OE12',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "Git commit headers store author identity in the format 'Name <user@domain> timestamp timezone'. The username is dvance.",
      essentialKeyPoints: [
        "Git commit metadata preserves author name, email, timestamp, and timezone.",
        "Commit parsing provides direct pivot points for identity profiling."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{dvance}' or 'dvance'.",
        partialCredit: "Submits full email 'dvance@synthetic-corp.local'.",
        noCredit: "Submits display name 'Devon Vance'."
      },
      acceptableAlternatives: ['HTG{dvance}', 'dvance', 'DVANCE']
    }
  },
  {
    stableId: 'HTG-L04-OE13',
    order: 13,
    levelNumber: 4,
    title: 'Git Diff Forensics on Deleted Sensitive Strings',
    prompt: `A code audit compares a commit diff using \`git diff HEAD~1 HEAD -- src/config.js\`:

\`\`\`diff
@@ -14,3 +14,2 @@
 function getTelemetryConfig() {
-  const API_TOKEN = "sk-mock-9988112233aabbcc";
   return { endpoint: "https://api.grid.test/v1" };
\`\`\`

Extract the sensitive token value removed in this commit.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the token string).`,
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
    flag: 'HTG{sk-mock-9988112233aabbcc}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the exact string literal between the quotes in the removed line.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE13',
      seedId: 'HTG-L04-OE13',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "Git diff forensics exposes lines prefixed with '-' that were removed. The removed API token was sk-mock-9988112233aabbcc.",
      essentialKeyPoints: [
        "Deleting sensitive code does not purge it from Git commit history.",
        "Diff inspection reveals historical credentials and configuration changes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{sk-mock-9988112233aabbcc}' or 'sk-mock-9988112233aabbcc'.",
        partialCredit: "Submits token with surrounding quotation marks.",
        noCredit: "Submits whole assignment statement or endpoint URL."
      },
      acceptableAlternatives: ['HTG{sk-mock-9988112233aabbcc}', 'sk-mock-9988112233aabbcc']
    }
  },
  {
    stableId: 'HTG-L04-OE14',
    order: 14,
    levelNumber: 4,
    title: 'Git Commit Author Timestamp Timezone Geolocation',
    prompt: `Analyzing an unauthorized commit pushed to a public repository reveals the following raw author timestamp string:

\`\`\`text
1711929600 +0530
\`\`\`

In Git internal metadata, the second token represents the committer's local timezone offset relative to Coordinated Universal Time (UTC).

Submit the exact 5-character timezone offset string including the sign.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the offset).`,
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
    flag: 'HTG{+0530}',
    hints: [
      {
        hintIndex: 1,
        content: "The offset string begins with '+' or '-' followed by four digits representing hours and minutes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE14',
      seedId: 'HTG-L04-OE14',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "Git timestamps encode UTC seconds followed by a timezone offset string like +0530 (representing UTC+05:30, used in India and Sri Lanka).",
      essentialKeyPoints: [
        "Git timezone offsets reflect the committer's system clock configuration.",
        "Timezone analysis provides geographic hints for threat actor attribution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{+0530}' or '+0530'.",
        partialCredit: "Submits '+05:30' or 'UTC+5:30'.",
        noCredit: "Submits the Unix epoch timestamp."
      },
      acceptableAlternatives: ['HTG{+0530}', '+0530', '+05:30', 'UTC+05:30', 'UTC+5:30']
    }
  },
  {
    stableId: 'HTG-L04-OE15',
    order: 15,
    levelNumber: 4,
    title: 'Cryptographic Git Commit GPG Signature Verification',
    prompt: `An auditor verifies the authenticity of a signed commit using \`git verify-commit HEAD\`:

\`\`\`text
gpg: Signature made Tue Mar 31 16:00:00 2026 UTC
gpg:                using RSA key E52B079F
gpg: Good signature from "Grid Lead <lead@griddefense.test>" [ultimate]
Primary key fingerprint: 8A12 34BC 56DE 78FA E52B 079F
\`\`\`

Extract the 8-character hexadecimal GPG key ID used to sign this commit.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 8-character ID).`,
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
    flag: 'HTG{E52B079F}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the 8-character string following 'using RSA key'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE15',
      seedId: 'HTG-L04-OE15',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "GPG-signed commits contain detached OpenPGP signatures verifying author identity. The key ID reported in the signature block is E52B079F.",
      essentialKeyPoints: [
        "GPG commit verification guards against identity spoofing in Git author fields.",
        "The short key ID corresponds to the lower 32 bits (8 hex characters) of the fingerprint."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{E52B079F}' or 'E52B079F'.",
        partialCredit: "Submits lowercase 'e52b079f'.",
        noCredit: "Submits the full fingerprint or email address."
      },
      acceptableAlternatives: ['HTG{E52B079F}', 'E52B079F', 'e52b079f', 'HTG{e52b079f}']
    }
  },
  {
    stableId: 'HTG-L04-OE16',
    order: 16,
    levelNumber: 4,
    title: 'Git Local Config Remote Repository Leak',
    prompt: `During an endpoint inspection of a suspect developer workstation, an analyst reads the \`.git/config\` configuration file:

\`\`\`ini
[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
[remote "origin"]
    url = https://nexus-deploy.corp.internal/scm/grid/core-engine.git
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
    remote = origin
    merge = refs/heads/main
\`\`\`

Identify the base name of the target repository (without the \`.git\` suffix).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the repository name).`,
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
    flag: 'HTG{core-engine}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the tail of the URL: strip the protocol, path, and '.git' extension.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE16',
      seedId: 'HTG-L04-OE16',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "The .git/config file stores remote repository coordinates. The URL points to core-engine.git, making 'core-engine' the repository base name.",
      essentialKeyPoints: [
        "Local git configuration files disclose internal server hostnames and repository naming conventions.",
        "Examining remotes is a primary discovery step in repository triage."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{core-engine}' or 'core-engine'.",
        partialCredit: "Submits 'core-engine.git'.",
        noCredit: "Submits the full URL or remote name 'origin'."
      },
      acceptableAlternatives: ['HTG{core-engine}', 'core-engine', 'core-engine.git', 'HTG{core-engine.git}']
    }
  },
  {
    stableId: 'HTG-L04-OE17',
    order: 17,
    levelNumber: 4,
    title: 'Git Stash Reference Forensics',
    prompt: `An investigator examines the reference log in \`.git/logs/refs/stash\` on a seized repository:

\`\`\`text
0000000 9f1a2b3 Devon Vance <dvance@grid.test> 1711930000 +0000	WIP on dev-sandbox: 9f1a2b3 temporary bypass config
\`\`\`

When a developer runs \`git stash\`, Git automatically generates a commit message recording the active branch name.

Identify the working branch name on which the stashed changes were authored.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the branch name).`,
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
    flag: 'HTG{dev-sandbox}',
    hints: [
      {
        hintIndex: 1,
        content: "The branch name follows the phrase 'WIP on ' in the default stash message.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE17',
      seedId: 'HTG-L04-OE17',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "Default git stash messages follow the format 'WIP on <branch>: <sha> <subject>'. The branch recorded is dev-sandbox.",
      essentialKeyPoints: [
        "Stashed changes reside in commit objects referenced by refs/stash.",
        "Stash logs provide visibility into uncommitted and abandoned developer branches."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{dev-sandbox}' or 'dev-sandbox'.",
        partialCredit: "Submits uppercase 'DEV-SANDBOX'.",
        noCredit: "Submits commit hash 9f1a2b3 or developer name."
      },
      acceptableAlternatives: ['HTG{dev-sandbox}', 'dev-sandbox', 'DEV-SANDBOX']
    }
  },
  {
    stableId: 'HTG-L04-OE18',
    order: 18,
    levelNumber: 4,
    title: 'Git Annotated Tag Vulnerability Attribution',
    prompt: `Inspecting release tags in a repository using \`git cat-file -p refs/tags/v1.4.2-hotfix\` reveals the following annotated tag object:

\`\`\`text
object 77a1bc34e56f7890
type commit
tag v1.4.2-hotfix
tagger SecurityTeam <sec@grid.test> 1712000000 +0000

Emergency release for vulnerability CVE-2026-9011
\`\`\`

Identify the Common Vulnerabilities and Exposures (CVE) identifier referenced in this tag message.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the CVE string).`,
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
    flag: 'HTG{CVE-2026-9011}',
    hints: [
      {
        hintIndex: 1,
        content: "Look for the string starting with 'CVE-'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE18',
      seedId: 'HTG-L04-OE18',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "Annotated tags contain independent tagger metadata, timestamps, and commit messages. The referenced vulnerability is CVE-2026-9011.",
      essentialKeyPoints: [
        "Annotated tags are full Git objects with cryptographic verification capability.",
        "Release tag messages often inadvertently document internal vulnerability remediation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CVE-2026-9011}' or 'CVE-2026-9011'.",
        partialCredit: "Submits lowercase 'cve-2026-9011'.",
        noCredit: "Submits tag name v1.4.2-hotfix."
      },
      acceptableAlternatives: ['HTG{CVE-2026-9011}', 'CVE-2026-9011', 'cve-2026-9011']
    }
  },
  {
    stableId: 'HTG-L04-OE19',
    order: 19,
    levelNumber: 4,
    title: 'Git Packfile Largest Object Audit',
    prompt: `An auditor scans a packed Git repository for large embedded assets using \`git verify-pack -v .git/objects/pack/*.idx\`:

\`\`\`text
SHA-1                                    TYPE  SIZE   SIZE-IN-PACK OFFSET
fa102b3c4d5e6f708192a3b4c5d6e7f8091a2b3c commit 284   192          12
99b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0 tree   812   410          204
8c7b6a5d4e3f210987654321fedcba0987654321 blob   142857 65432       614
\`\`\`

Identify the uncompressed byte size of the largest blob object detected in the packfile index.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer size).`,
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
    flag: 'HTG{142857}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the SIZE column for the 'blob' object.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE19',
      seedId: 'HTG-L04-OE19',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "Git verify-pack reports uncompressed object sizes. The largest blob in this packfile is 142857 bytes.",
      essentialKeyPoints: [
        "Git stores history in compressed packfiles containing commits, trees, and blobs.",
        "Inspecting packfile indices isolates large files such as database dumps or binary blobs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{142857}' or '142857'.",
        partialCredit: "Submits compressed pack size 65432.",
        noCredit: "Submits tree or commit sizes."
      },
      acceptableAlternatives: ['HTG{142857}', '142857']
    }
  },
  {
    stableId: 'HTG-L04-OE20',
    order: 20,
    levelNumber: 4,
    title: 'Git Submodule Configuration Path Extraction',
    prompt: `A code audit inspects the repository root \`.gitmodules\` file mapping external dependencies:

\`\`\`ini
[submodule "external/telemetry-core"]
	path = external/telemetry-core
	url = https://github.com/mock-grid/telemetry-core.git
	branch = stable-v2
\`\`\`

Identify the local directory path configured for this submodule within the repository worktree.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the path).`,
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
    flag: 'HTG{external/telemetry-core}',
    hints: [
      {
        hintIndex: 1,
        content: "Read the value assigned to 'path = ' in the submodule definition.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE20',
      seedId: 'HTG-L04-OE20',
      subtopic: 'Public Git Repository Investigation & Commit History',
      explanation: "The .gitmodules file defines submodules and maps remote repositories to local worktree directory paths. The path is external/telemetry-core.",
      essentialKeyPoints: [
        "Git submodules link independent repositories into parent projects.",
        "Submodule configurations disclose external dependency hierarchies and repository locations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{external/telemetry-core}' or 'external/telemetry-core'.",
        partialCredit: "Submits 'telemetry-core'.",
        noCredit: "Submits the remote URL or branch name."
      },
      acceptableAlternatives: [
        'HTG{external/telemetry-core}',
        'external/telemetry-core',
        'telemetry-core',
        'HTG{telemetry-core}'
      ]
    }
  }
];

module.exports = subtopic2Questions;

