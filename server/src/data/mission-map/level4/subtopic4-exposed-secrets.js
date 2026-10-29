const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L04-OE31',
    order: 31,
    levelNumber: 4,
    title: 'AWS IAM Access Key Identifier Prefix Analysis',
    prompt: `A repository scanner flags a hardcoded Amazon Web Services credential string:

\`\`\`text
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
\`\`\`

In AWS identity and access management conventions, which 4-character uppercase alphanumeric prefix designates a standard permanent IAM user access key?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-character prefix).`,
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
    flag: 'HTG{AKIA}',
    hints: [
      {
        hintIndex: 1,
        content: "Permanent IAM keys begin with 'AKIA', while temporary STS keys begin with 'ASIA'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE31',
      seedId: 'HTG-L04-OE31',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "AWS access keys encode key type in their first four characters: AKIA indicates standard IAM user credentials, ASIA denotes temporary STS credentials.",
      essentialKeyPoints: [
        "AWS key prefix structure enables automated regex detection and classification.",
        "Recognizing key patterns speeds up credential triage and revocation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{AKIA}' or 'AKIA'.",
        partialCredit: "Submits lowercase 'akia'.",
        noCredit: "Submits temporary key prefix ASIA or full key string."
      },
      acceptableAlternatives: ['HTG{AKIA}', 'AKIA', 'akia', 'HTG{akia}']
    }
  },
  {
    stableId: 'HTG-L04-OE32',
    order: 32,
    levelNumber: 4,
    title: 'JSON Web Token (JWT) Payload Forensic Decoding',
    prompt: `An analyst intercepts an unencrypted JSON Web Token transmitted in an authorization header:

\`\`\`text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJhZG1pbi1nZXJhbGQiLCJyb2xlIjoiU3VwZXJVc2VyIn0.4a6b2c
\`\`\`

Base64url-decode the middle payload segment to extract the identity claims.

Extract the value assigned to the \`username\` claim.

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
    flag: 'HTG{admin-gerald}',
    hints: [
      {
        hintIndex: 1,
        content: "Decode 'eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJhZG1pbi1nZXJhbGQiLCJyb2xlIjoiU3VwZXJVc2VyIn0' using base64url.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE32',
      seedId: 'HTG-L04-OE32',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "JWTs consist of three dot-separated Base64url-encoded parts: Header, Payload, and Signature. The payload decodes to JSON containing username: admin-gerald.",
      essentialKeyPoints: [
        "JWT payloads are signed, not encrypted, meaning claims are visible to anyone possessing the token.",
        "Token decoding provides immediate visibility into user roles and identifiers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{admin-gerald}' or 'admin-gerald'.",
        partialCredit: "Submits 'admin-gerald' with quotation marks.",
        noCredit: "Submits the role 'SuperUser' or subject ID."
      },
      acceptableAlternatives: ['HTG{admin-gerald}', 'admin-gerald']
    }
  },
  {
    stableId: 'HTG-L04-OE33',
    order: 33,
    levelNumber: 4,
    title: 'Container Image Layer History Secret Exposure',
    prompt: `During a container image security audit, an engineer inspects image layer history using \`docker history --no-trunc grid-auth:latest\`:

\`\`\`text
IMAGE          CREATED BY                                      SIZE
a1b2c3d4e5f6   CMD ["npm" "start"]                             0B
f6e5d4c3b2a1   ENV MONGODB_PASS=P@ssw0rdGrid2026!              0B
0987654321ab   COPY . /app                                     4.5MB
\`\`\`

Extract the plaintext database password inadvertently baked into the container environment layer.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the password).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: true,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{P@ssw0rdGrid2026!}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the exact string following 'ENV MONGODB_PASS='.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE33',
      seedId: 'HTG-L04-OE33',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "Docker container layers are immutable; setting secrets using ENV instructions permanently embeds them in the image metadata even if subsequent layers unset or delete them.",
      essentialKeyPoints: [
        "Dockerfile ENV directives persist indefinitely in image layer history.",
        "Secure build practices require runtime secret injection or build-time mounts."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{P@ssw0rdGrid2026!}' or 'P@ssw0rdGrid2026!'.",
        partialCredit: "Submits password without special characters.",
        noCredit: "Submits variable name MONGODB_PASS."
      },
      acceptableAlternatives: ['HTG{P@ssw0rdGrid2026!}', 'P@ssw0rdGrid2026!']
    }
  },
  {
    stableId: 'HTG-L04-OE34',
    order: 34,
    levelNumber: 4,
    title: 'Standard Secure Shell Daemon Port Identification',
    prompt: `An incident responder reviews a compromised infrastructure automation playbook exposing access parameters:

\`\`\`yaml
- name: Connect to Bastion
  hosts: external_gate
  tasks:
    - name: Establish encrypted tunnel
      command: ssh -i id_rsa -p 22 griduser@bastion.griddefense.test
\`\`\`

What standard integer port assigned by IANA is configured for the Secure Shell (SSH) protocol in this playbook?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer port).`,
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
    flag: 'HTG{22}',
    hints: [
      {
        hintIndex: 1,
        content: "Read the parameter passed to the -p flag.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE34',
      seedId: 'HTG-L04-OE34',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "Port 22 is the standard IANA-assigned TCP port for SSH. Exposure of default management ports on public interfaces invites automated credential stuffing.",
      essentialKeyPoints: [
        "Standard management port defaults should be identified and audited.",
        "Playbooks often disclose network topology and access vectors."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{22}' or '22'.",
        partialCredit: "Submits 'port 22'.",
        noCredit: "Submits incorrect port numbers."
      },
      acceptableAlternatives: ['HTG{22}', '22', 'port 22']
    }
  },
  {
    stableId: 'HTG-L04-OE35',
    order: 35,
    levelNumber: 4,
    title: 'Cloud Service Account Key File Project Attribution',
    prompt: `A secret scanning tool alerts on a committed Google Cloud service account JSON credentials key file:

\`\`\`json
{
  "type": "service_account",
  "project_id": "grid-cloud-99",
  "private_key_id": "8a7b6c5d4e3f2109",
  "client_email": "ci-deployer@grid-cloud-99.iam.gserviceaccount.com",
  "client_id": "109876543210987654321",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth"
}
\`\`\`

Extract the cloud \`project_id\` to which this service account belongs.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the project ID).`,
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
    flag: 'HTG{grid-cloud-99}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the string value for 'project_id'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE35',
      seedId: 'HTG-L04-OE35',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "GCP service account JSON files contain the target project_id directly in the root JSON object. The project ID is grid-cloud-99.",
      essentialKeyPoints: [
        "Service account key exposure provides immediate API access across cloud projects.",
        "The project_id field pinpoints the organization and scope of the cloud footprint."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{grid-cloud-99}' or 'grid-cloud-99'.",
        partialCredit: "Submits uppercase 'GRID-CLOUD-99'.",
        noCredit: "Submits client_email or client_id."
      },
      acceptableAlternatives: ['HTG{grid-cloud-99}', 'grid-cloud-99', 'GRID-CLOUD-99']
    }
  },
  {
    stableId: 'HTG-L04-OE36',
    order: 36,
    levelNumber: 4,
    title: 'Automated Webhook Snowflake Identifier Extraction',
    prompt: `An accidental public paste exposes an automated notification webhook URL:

\`\`\`text
https://discord.com/api/webhooks/123456789012345678/aBcDeFgHiJkLmNoPqRsTuVwXyZ
\`\`\`

The path component immediately following \`/webhooks/\` is an 18-digit unique Snowflake entity identifier.

Extract this 18-digit webhook identifier.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the numeric ID).`,
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
    flag: 'HTG{123456789012345678}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the 18 numbers located between '/webhooks/' and the final slash.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE36',
      seedId: 'HTG-L04-OE36',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "Webhook URLs embed unique resource IDs and secret tokens in their URL paths. The webhook snowflake identifier is 123456789012345678.",
      essentialKeyPoints: [
        "Hardcoded webhook URLs grant unauthenticated message posting permissions.",
        "The snowflake identifier encodes creation timestamp and guild routing metadata."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{123456789012345678}' or '123456789012345678'.",
        partialCredit: "Submits numeric ID in quotation marks.",
        noCredit: "Submits the trailing token string."
      },
      acceptableAlternatives: ['HTG{123456789012345678}', '123456789012345678']
    }
  },
  {
    stableId: 'HTG-L04-OE37',
    order: 37,
    levelNumber: 4,
    title: 'Database Connection String Target Schema Extraction',
    prompt: `A committed configuration file exposes a PostgreSQL database connection URI:

\`\`\`text
DATABASE_URL=postgres://griduser:SecretSentry99@db.grid.local:5432/telemetry_prod
\`\`\`

In standard URI syntax (RFC 3986), the path component following the port identifies the specific database name.

Extract the database name configured in this connection string.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the database name).`,
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
    flag: 'HTG{telemetry_prod}',
    hints: [
      {
        hintIndex: 1,
        content: "Locate the string following ':5432/'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE37',
      seedId: 'HTG-L04-OE37',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "Database connection URIs follow the format 'protocol://user:password@host:port/database'. The target database name is telemetry_prod.",
      essentialKeyPoints: [
        "Connection URIs bundle credentials, hostnames, and database names into a single string.",
        "Parsing URI components identifies high-value targets across enterprise environments."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{telemetry_prod}' or 'telemetry_prod'.",
        partialCredit: "Submits uppercase 'TELEMETRY_PROD'.",
        noCredit: "Submits user 'griduser' or hostname 'db.grid.local'."
      },
      acceptableAlternatives: ['HTG{telemetry_prod}', 'telemetry_prod', 'TELEMETRY_PROD']
    }
  },
  {
    stableId: 'HTG-L04-OE38',
    order: 38,
    levelNumber: 4,
    title: 'Slack Bot User OAuth Token Prefix Identification',
    prompt: `During a triage of leaked operational scripts, an engineer discovers an API token for a workplace communication bot:

\`\`\`text
SLACK_BOT_TOKEN="xoxb-REDACTED_TEAM-REDACTED_USER-REDACTED_SECRET_KEY"
\`\`\`

In Slack platform security token architecture, which 4-character lowercase prefix specifically designates a Bot User OAuth Access Token?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-character prefix).`,
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
    flag: 'HTG{xoxb}',
    hints: [
      {
        hintIndex: 1,
        content: "Slack bot tokens begin with 'xoxb', while user tokens begin with 'xoxp'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE38',
      seedId: 'HTG-L04-OE38',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "Slack prefixes indicate token privileges: 'xoxb' is a Bot token, 'xoxp' is a User token, 'xoxr' is a Refresh token, and 'xoxa' is an App token.",
      essentialKeyPoints: [
        "Token prefix standards facilitate automated secret detection rules.",
        "Knowing token scopes helps responders determine whether an attacker can read private channels."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{xoxb}' or 'xoxb'.",
        partialCredit: "Submits uppercase 'XOXB'.",
        noCredit: "Submits user token prefix xoxp or full token."
      },
      acceptableAlternatives: ['HTG{xoxb}', 'xoxb', 'XOXB', 'HTG{XOXB}']
    }
  },
  {
    stableId: 'HTG-L04-OE39',
    order: 39,
    levelNumber: 4,
    title: 'Automated Git Secret Scanner Engine Identification',
    prompt: `An incident response engineer reviews automated continuous integration security pipeline logs:

\`\`\`text
Running Gitleaks v8.18.0
Finding generic-api-key at commit 4a9f82d1
Entropy score: 4.85 (Exceeds threshold 4.30)
File: src/config.js (Line 15)
Rule: High-entropy string assignment
\`\`\`

Identify the name of the popular open-source Git secret detection engine reported in the log header.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the tool name).`,
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
    flag: 'HTG{Gitleaks}',
    hints: [
      {
        hintIndex: 1,
        content: "The tool name is 'Gitleaks'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE39',
      seedId: 'HTG-L04-OE39',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "Gitleaks is a widely used standalone tool and CI/CD action for detecting hardcoded secrets like passwords, API keys, and tokens in Git repositories.",
      essentialKeyPoints: [
        "Secret scanners combine regex signatures with Shannon entropy calculations.",
        "Pre-commit hooks and CI pipelines stop secrets before they enter remote repositories."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Gitleaks}' or 'Gitleaks'.",
        partialCredit: "Submits lowercase 'gitleaks'.",
        noCredit: "Submits other scanning tools like TruffleHog or GitGuardian."
      },
      acceptableAlternatives: ['HTG{Gitleaks}', 'Gitleaks', 'gitleaks', 'GITLEAKS']
    }
  },
  {
    stableId: 'HTG-L04-OE40',
    order: 40,
    levelNumber: 4,
    title: 'Elliptic Curve Private Key Header Standard',
    prompt: `A forensics specialist recovers a compromised cryptographic private key file:

\`\`\`text
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIB9y482kP5b7L9v8+...[REDACTED]...
-----END EC PRIVATE KEY-----
\`\`\`

In PEM format conventions (RFC 5915), which two-letter abbreviation identifies the Elliptic Curve cryptographic family in the header?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-letter abbreviation).`,
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
    flag: 'HTG{EC}',
    hints: [
      {
        hintIndex: 1,
        content: "The two-letter acronym for Elliptic Curve is 'EC'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE40',
      seedId: 'HTG-L04-OE40',
      subtopic: 'Exposed Secrets & Environmental Configuration Analysis',
      explanation: "PEM headers delineate key types. 'BEGIN EC PRIVATE KEY' indicates an Elliptic Curve private key in RFC 5915 format.",
      essentialKeyPoints: [
        "PEM encapsulation boundaries identify the cryptographic algorithm of key files.",
        "EC keys differ in structure and mathematical foundation from RSA or DSA keys."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{EC}' or 'EC'.",
        partialCredit: "Submits lowercase 'ec' or 'Elliptic Curve'.",
        noCredit: "Submits RSA or DSA."
      },
      acceptableAlternatives: ['HTG{EC}', 'EC', 'ec', 'Elliptic Curve', 'ELLIPTIC CURVE']
    }
  }
];

module.exports = subtopic4Questions;

