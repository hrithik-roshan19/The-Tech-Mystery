const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L10-OE61',
    order: 61,
    levelNumber: 10,
    title: 'Shamir Secret Sharing (k, n) Reconstruction Threshold Variable',
    prompt: `In Shamir's $(k, n)$ Secret Sharing scheme, a master secret is encoded as the constant term $a_0$ of a polynomial of degree $k - 1$.

The master secret is divided into $n$ separate shares distributed among participants. Any subset of shares strictly less than the threshold reveals zero information about the secret.

What single-letter variable represents the minimum number of distinct shares mathematically required to reconstruct the polynomial via Lagrange interpolation?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single letter).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{k}',
    hints: [
      {
        hintIndex: 1,
        content: "The threshold parameter is k (in a (k, n) scheme).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE61',
      seedId: 'HTG-L10-OE61',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "In a (k, n) Shamir scheme, exactly k shares are required to reconstruct the degree k-1 polynomial.",
      essentialKeyPoints: [
        "Lagrange interpolation recovers the secret constant term when k shares are combined.",
        "k-1 or fewer shares leak zero information."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{k}' or 'k'.",
        partialCredit: "Submits uppercase 'K'.",
        noCredit: "Submits n or m."
      },
      acceptableAlternatives: ['HTG{k}', 'k', 'K', 'HTG{K}']
    }
  },
  {
    stableId: 'HTG-L10-OE62',
    order: 62,
    levelNumber: 10,
    title: 'Keyed-Hash Message Authentication Code (HMAC) Architecture',
    prompt: `In verifying the integrity and authenticity of citadel communications, systems construct cryptographic tokens using a hash-based message authentication code defined in RFC 2104.

What 4-letter uppercase acronym designates this standard Keyed-Hash Message Authentication Code?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{HMAC}',
    hints: [
      {
        hintIndex: 1,
        content: "Keyed-Hash Message Authentication Code is abbreviated HMAC.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE62',
      seedId: 'HTG-L10-OE62',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "HMAC combines a secret key with a cryptographic hash function (e.g. HMAC-SHA256).",
      essentialKeyPoints: [
        "HMAC prevents length extension attacks that affect plain hash(key || message).",
        "It provides both message integrity and origin authentication."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{HMAC}' or 'HMAC'.",
        partialCredit: "Submits lowercase 'hmac'.",
        noCredit: "Submits CMAC or CBC-MAC."
      },
      acceptableAlternatives: ['HTG{HMAC}', 'HMAC', 'hmac', 'HTG{hmac}']
    }
  },
  {
    stableId: 'HTG-L10-OE63',
    order: 63,
    levelNumber: 10,
    title: 'PBKDF2 Work Factor Iteration Count Parameter',
    prompt: `In password-based key derivation standards (such as PBKDF2, RFC 8018), passwords are stretched into cryptographic keys by repeatedly executing pseudorandom functions with a cryptographic salt.

What parameter (governing the repetition count and execution time, e.g. 100,000 or 600,000 rounds) increases the computational cost for attackers attempting GPU or ASIC brute forcing?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{iterations}',
    hints: [
      {
        hintIndex: 1,
        content: "The work factor parameter is the iteration count (or iterations).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE63',
      seedId: 'HTG-L10-OE63',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "The iteration count in PBKDF2 dictates how many times the pseudorandom function is repeated.",
      essentialKeyPoints: [
        "Higher iteration counts slow down offline dictionary and brute-force attacks.",
        "OWASP recommends hundreds of thousands of iterations for PBKDF2-HMAC-SHA256."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{iterations}' or 'iterations'.",
        partialCredit: "Submits 'iteration count' or capitalized 'Iterations'.",
        noCredit: "Submits salt or rounds."
      },
      acceptableAlternatives: ['HTG{iterations}', 'iterations', 'Iterations', 'iteration count', 'Iteration Count', 'HTG{iteration count}']
    }
  },
  {
    stableId: 'HTG-L10-OE64',
    order: 64,
    levelNumber: 10,
    title: 'Cryptographic Nonce Replay Prevention Parameter',
    prompt: `In authenticated protocols, stream ciphers (such as ChaCha20), and block cipher modes (such as AES-GCM), a unique value must be used only once per encryption key to guarantee security and prevent replay attacks.

What 5-letter cryptographic term (derived from "number used once") represents this single-use value?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 5-letter term).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{nonce}',
    hints: [
      {
        hintIndex: 1,
        content: "Number used once: nonce.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE64',
      seedId: 'HTG-L10-OE64',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "A nonce is a number used once to ensure freshness and defeat replay attacks.",
      essentialKeyPoints: [
        "Reusing a nonce in AES-GCM leaks the authentication key and breaks confidentiality.",
        "Nonces need not be secret, but must never repeat under the same key."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{nonce}' or 'nonce'.",
        partialCredit: "Submits capitalized 'Nonce'.",
        noCredit: "Submits salt or IV."
      },
      acceptableAlternatives: ['HTG{nonce}', 'nonce', 'Nonce', 'NONCE', 'HTG{Nonce}']
    }
  },
  {
    stableId: 'HTG-L10-OE65',
    order: 65,
    levelNumber: 10,
    title: 'Diffie-Hellman Key Exchange Mathematical Hard Problem',
    prompt: `The Diffie-Hellman key exchange protocol allows two parties to establish a shared secret over an insecure channel.

Its security in finite cyclic groups relies on the computational difficulty of calculating the exponent $x$ given base $g$, prime modulus $p$, and value $g^x \\pmod p$.

What mathematical problem (commonly abbreviated DLP) forms the computational foundation of this protocol?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the problem name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{Discrete Logarithm}',
    hints: [
      {
        hintIndex: 1,
        content: "The problem is the Discrete Logarithm Problem (DLP).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE65',
      seedId: 'HTG-L10-OE65',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "The Discrete Logarithm Problem (DLP) underpins Diffie-Hellman and ElGamal cryptography.",
      essentialKeyPoints: [
        "Computing g^x mod p is efficient (modular exponentiation).",
        "Finding x from g^x mod p is computationally intractable for sufficiently large primes."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Discrete Logarithm}' or 'Discrete Logarithm'.",
        partialCredit: "Submits 'DLP' or 'discrete logarithm problem'.",
        noCredit: "Submits integer factorization or RSA."
      },
      acceptableAlternatives: [
        'HTG{Discrete Logarithm}',
        'Discrete Logarithm',
        'discrete logarithm',
        'DLP',
        'dlp',
        'Discrete Logarithm Problem',
        'HTG{DLP}'
      ]
    }
  },
  {
    stableId: 'HTG-L10-OE66',
    order: 66,
    levelNumber: 10,
    title: 'Authenticated Encryption with Associated Data (AEAD) Paradigm',
    prompt: `In modern cryptographic engineering, utilizing unauthenticated encryption modes (such as AES-CBC) without a separate MAC enables padding oracle attacks and ciphertext tampering.

Modern standards mandate cipher modes (such as AES-GCM and ChaCha20-Poly1305) that simultaneously provide confidentiality, integrity, and authenticity for both ciphertext and unencrypted metadata.

What 4-letter uppercase acronym designates this Authenticated Encryption with Associated Data paradigm?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{AEAD}',
    hints: [
      {
        hintIndex: 1,
        content: "Authenticated Encryption with Associated Data is abbreviated AEAD.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE66',
      seedId: 'HTG-L10-OE66',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "AEAD (Authenticated Encryption with Associated Data) unifies encryption and MAC authentication.",
      essentialKeyPoints: [
        "AEAD modes produce an authentication tag that fails decryption if ciphertext or header data is altered.",
        "TLS 1.3 deprecates all non-AEAD cipher suites."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{AEAD}' or 'AEAD'.",
        partialCredit: "Submits lowercase 'aead'.",
        noCredit: "Submits GCM or CBC."
      },
      acceptableAlternatives: ['HTG{AEAD}', 'AEAD', 'aead', 'HTG{aead}']
    }
  },
  {
    stableId: 'HTG-L10-OE67',
    order: 67,
    levelNumber: 10,
    title: 'Zero-Knowledge Proof (ZKP) Verification Architecture',
    prompt: `In advanced cryptographic authentication, a user must demonstrate to the citadel gatekeeper that they possess the secret master password without transmitting, revealing, or exposing any bits of the password itself.

What 3-letter uppercase acronym represents the cryptographic protocol class (Zero-Knowledge Proof) that achieves this verification property?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{ZKP}',
    hints: [
      {
        hintIndex: 1,
        content: "Zero-Knowledge Proof is abbreviated ZKP.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE67',
      seedId: 'HTG-L10-OE67',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "ZKP (Zero-Knowledge Proof) allows proving possession of knowledge without disclosing the knowledge.",
      essentialKeyPoints: [
        "ZKPs satisfy completeness, soundness, and zero-knowledge properties.",
        "ZK-SNARKs and ZK-STARKs provide succinct non-interactive zero-knowledge verification."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ZKP}' or 'ZKP'.",
        partialCredit: "Submits lowercase 'zkp' or 'Zero-Knowledge Proof'.",
        noCredit: "Submits PKI or MFA."
      },
      acceptableAlternatives: ['HTG{ZKP}', 'ZKP', 'zkp', 'Zero-Knowledge Proof', 'zero-knowledge proof', 'HTG{zkp}']
    }
  },
  {
    stableId: 'HTG-L10-OE68',
    order: 68,
    levelNumber: 10,
    title: 'Citadel Core Override Vault Authorization Code',
    prompt: `To unlock the primary access airlock guarding the final citadel core, the operative inputs the master protocol override authorization code:
\`\`\`text
CITADEL_CORE_OVERRIDE
\`\`\`
What is the complete competition flag for this core override authorization code?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{CITADEL_CORE_OVERRIDE}',
    hints: [
      {
        hintIndex: 1,
        content: "Enclose CITADEL_CORE_OVERRIDE inside HTG{...}.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE68',
      seedId: 'HTG-L10-OE68',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "The core override code is 'CITADEL_CORE_OVERRIDE'.",
      essentialKeyPoints: [
        "Authorizes primary access into the inner citadel core chamber.",
        "Synthesizes access controls from the first 67 questions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CITADEL_CORE_OVERRIDE}'.",
        partialCredit: "Submits 'CITADEL_CORE_OVERRIDE' without curly braces.",
        noCredit: "Submits incorrect token."
      },
      acceptableAlternatives: [
        'HTG{CITADEL_CORE_OVERRIDE}',
        'CITADEL_CORE_OVERRIDE',
        'citadel_core_override',
        'HTG{citadel_core_override}'
      ]
    }
  },
  {
    stableId: 'HTG-L10-OE69',
    order: 69,
    levelNumber: 10,
    title: 'Penultimate Citadel Sentinel Validation Key',
    prompt: `Before the central mainframe disengages its final cryptographic seal, it queries the perimeter defense sentinel for confirmation that all prior 68 security checkpoints and synthesis tracks have been conquered.

The sentinel responds with its signed validation key:
\`\`\`text
SENTINEL_VALIDATED_2026
\`\`\`
What is the complete competition flag for this penultimate sentinel validation key?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{SENTINEL_VALIDATED_2026}',
    hints: [
      {
        hintIndex: 1,
        content: "Enclose SENTINEL_VALIDATED_2026 inside HTG{...}.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE69',
      seedId: 'HTG-L10-OE69',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "The sentinel validation key is 'SENTINEL_VALIDATED_2026'.",
      essentialKeyPoints: [
        "Represents the penultimate gate in Level 10.",
        "Unlocks the final question of the 700-question Mission Map."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{SENTINEL_VALIDATED_2026}'.",
        partialCredit: "Submits 'SENTINEL_VALIDATED_2026' without curly braces.",
        noCredit: "Submits incorrect token."
      },
      acceptableAlternatives: [
        'HTG{SENTINEL_VALIDATED_2026}',
        'SENTINEL_VALIDATED_2026',
        'sentinel_validated_2026',
        'HTG{sentinel_validated_2026}'
      ]
    }
  },
  {
    stableId: 'HTG-L10-OE70',
    order: 70,
    levelNumber: 10,
    title: 'The Ultimate Master Flag Citadel Conquest Flag',
    prompt: `You stand at the heart of The Master Flag Citadel. All ten operational levels of The Tech Mystery / Hack The Grid — from Signal Breaker through Polyalphabetic Steganography — have been systematically unraveled.

Synthesizing all ten security keys into the ultimate master competition flag:
\`\`\`text
HACK_THE_GRID_CITADEL_CONQUERED_2026
\`\`\`
Submitting this final flag conquers the grid, solves Level 10, completes the entire event, and claims absolute victory!

What is the ultimate Master Flag?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{HACK_THE_GRID_CITADEL_CONQUERED_2026}',
    hints: [
      {
        hintIndex: 1,
        content: "Prefix HACK_THE_GRID_CITADEL_CONQUERED_2026 with HTG{...}.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE70',
      seedId: 'HTG-L10-OE70',
      subtopic: 'Final Citadel Flag Synthesis & Master Flag Breach',
      explanation: "Concludes the 700-question Mission Map of Hack The Grid (Utkrisht 2026), completing Level 10 and crowning the squad as master champions.",
      essentialKeyPoints: [
        "The ultimate Master Flag of the Hack The Grid competition.",
        "Marks complete mastery across all 10 cyber domains."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{HACK_THE_GRID_CITADEL_CONQUERED_2026}'.",
        partialCredit: "Submits 'HACK_THE_GRID_CITADEL_CONQUERED_2026' or with 'MASTER_FLAG{...}'.",
        noCredit: "Submits partial string."
      },
      acceptableAlternatives: [
        'HTG{HACK_THE_GRID_CITADEL_CONQUERED_2026}',
        'HACK_THE_GRID_CITADEL_CONQUERED_2026',
        'hack_the_grid_citadel_conquered_2026',
        'MASTER_FLAG{HACK_THE_GRID_CITADEL_CONQUERED_2026}',
        'HTG{hack_the_grid_citadel_conquered_2026}'
      ]
    }
  }
];

module.exports = subtopic7Questions;

