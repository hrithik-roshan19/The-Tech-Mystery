const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    stableId: 'HTG-L05-OE61',
    order: 61,
    levelNumber: 5,
    title: 'Two-Stage Product Key Verification Reversal',
    prompt: `An analyst reverses an 8-character product activation key validation routine:

\`\`\`c
// Key format: 8 ASCII characters
if (strlen(key) != 8) return 0;

// Stage 1: Prefix check
if (strncmp(key, "GRID", 4) != 0) return 0;

// Stage 2: Suffix accumulator check
int sum = key[4] + key[5] + key[6] + key[7];
if (sum != 200) return 0;
\`\`\`

The license specification requires that the four suffix characters (\`key[4..7]\`) must all be identical digits.

Calculating \`200 / 4 = 50\`, ASCII code 50 corresponds to the character '2'.

Reconstruct the complete 8-character product key string.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 8-character key).`,
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
    flag: 'HTG{GRID2222}',
    hints: [
      {
        hintIndex: 1,
        content: "Prefix is 'GRID'. Suffix is four '2's (ASCII 50 * 4 = 200): 'GRID2222'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE61',
      seedId: 'HTG-L05-OE61',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "Stage 1 requires prefix 'GRID'. Stage 2 requires four identical characters summing to 200 (200 / 4 = 50 = '2'). Key is GRID2222.",
      essentialKeyPoints: [
        "Product key routines combine static signature prefixes with algorithmic checksum suffixes.",
        "Keygenning involves deducing valid suffix combinations from constraints."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GRID2222}' or 'GRID2222'.",
        partialCredit: "Submits lowercase 'grid2222'.",
        noCredit: "Submits prefix GRID only."
      },
      acceptableAlternatives: ['HTG{GRID2222}', 'GRID2222', 'grid2222', 'HTG{grid2222}']
    }
  },
  {
    stableId: 'HTG-L05-OE62',
    order: 62,
    levelNumber: 5,
    title: 'Finite State Machine Transition Sequence Path',
    prompt: `A decompiled parsing function implements an input state machine:

\`\`\`text
Initial State: S0
Transitions:
  S0 + 'A' -> S1
  S1 + 'B' -> S2
  S2 + 'C' -> S3 (Accept State)
  Any other character -> S_ERR (Dead state)
\`\`\`

Only reaching state \`S3\` prints the success validation flag.

What 3-character uppercase ASCII string drives this state machine along the path from initial state S0 to accept state S3?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter string, e.g. ABC).`,
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
    flag: 'HTG{ABC}',
    hints: [
      {
        hintIndex: 1,
        content: "Trace the sequence of inputs: 'A', then 'B', then 'C': 'ABC'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE62',
      seedId: 'HTG-L05-OE62',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "Input 'A' moves from S0 to S1; 'B' moves from S1 to S2; 'C' moves from S2 to S3 (Accept). The valid input string is ABC.",
      essentialKeyPoints: [
        "State machines structure protocol parsers and complex key validators.",
        "Graph traversal through state diagrams isolates valid paths to accept states."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ABC}' or 'ABC'.",
        partialCredit: "Submits lowercase 'abc'.",
        noCredit: "Submits individual state names S0-S3."
      },
      acceptableAlternatives: ['HTG{ABC}', 'ABC', 'abc', 'HTG{abc}']
    }
  },
  {
    stableId: 'HTG-L05-OE63',
    order: 63,
    levelNumber: 5,
    title: 'Multi-Byte XOR Decryption Loop Plaintext Recovery',
    prompt: `An embedded string decryption routine decrypts 4 bytes of ciphertext at runtime:

\`\`\`c
const unsigned char enc[4] = { 0x67, 0x61, 0x6A, 0x6D };
const unsigned char key = 0x22;

char recovered[5];
for (int i = 0; i < 4; i++) {
    recovered[i] = enc[i] ^ key;
}
recovered[4] = '\\0';
\`\`\`

XOR each ciphertext byte with key \`0x22\`:
- \`0x67 ^ 0x22 = 0x45 ('E')\`
- \`0x61 ^ 0x22 = 0x43 ('C')\`
- \`0x6A ^ 0x22 = 0x48 ('H')\`
- \`0x6D ^ 0x22 = 0x4F ('O')\`

Reconstruct the resulting 4-character uppercase ASCII plaintext string.

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
    flag: 'HTG{ECHO}',
    hints: [
      {
        hintIndex: 1,
        content: "The characters decode to 'E', 'C', 'H', 'O': 'ECHO'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE63',
      seedId: 'HTG-L05-OE63',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "0x67^0x22=0x45 ('E'), 0x61^0x22=0x43 ('C'), 0x6A^0x22=0x48 ('H'), 0x6D^0x22=0x4F ('O'). The plaintext is ECHO.",
      essentialKeyPoints: [
        "XOR loops are standard mechanisms for hiding sensitive strings from strings tools.",
        "Emulating or scripting decryption loops extracts all protected strings automatically."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ECHO}' or 'ECHO'.",
        partialCredit: "Submits lowercase 'echo'.",
        noCredit: "Submits raw hex codes."
      },
      acceptableAlternatives: ['HTG{ECHO}', 'ECHO', 'echo', 'HTG{echo}']
    }
  },
  {
    stableId: 'HTG-L05-OE64',
    order: 64,
    levelNumber: 5,
    title: 'Algebraic Inverse Constraint Solver',
    prompt: `A crackme checks an integer password \`X\` against an arithmetic constraint:

\`\`\`c
if (((X * 13) ^ 85) == 150) {
    access_granted();
}
\`\`\`

Reverse this mathematical operation to solve for positive integer \`X\`:
1. Invert XOR: Calculate \`150 ^ 85\`
2. Invert multiplication: Divide the result by 13

Calculate the integer value of \`X\`.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 15).`,
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
    flag: 'HTG{15}',
    hints: [
      {
        hintIndex: 1,
        content: "150 ^ 85 = 195. 195 / 13 = 15.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE64',
      seedId: 'HTG-L05-OE64',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "Inverting: X * 13 = 150 ^ 85 = 195. X = 195 / 13 = 15.",
      essentialKeyPoints: [
        "Symbolic execution models expressions algebraically to solve for input values.",
        "Linear integer arithmetic is directly invertible."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{15}' or '15'.",
        partialCredit: "Submits text 'fifteen'.",
        noCredit: "Submits intermediate value 195."
      },
      acceptableAlternatives: ['HTG{15}', '15', 'fifteen']
    }
  },
  {
    stableId: 'HTG-L05-OE65',
    order: 65,
    levelNumber: 5,
    title: 'Custom Base64 Alphabet Alphabetical Origin Character',
    prompt: `An obfuscated binary implements a non-standard Base64 encoding table with a reversed alphabet:

\`\`\`text
Custom Alphabet:
zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA9876543210+/
\`\`\`

Standard Base64 maps index 0 to 'A'. In this custom reversed table, which single ASCII character corresponds to 6-bit index 0 (the first character in the string)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the character, e.g. z).`,
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
    flag: 'HTG{z}',
    hints: [
      {
        hintIndex: 1,
        content: "The first character at index 0 of the custom alphabet is 'z'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE65',
      seedId: 'HTG-L05-OE65',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "Malware and custom protocols frequently substitute custom alphabets into standard Base64 algorithms. The character at index 0 is 'z'.",
      essentialKeyPoints: [
        "Custom Base64 schemes defeat generic decoders (CyberChef standard base64).",
        "Extracting custom substitution tables enables decoding proprietary payloads."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{z}' or 'z'.",
        partialCredit: "Submits uppercase 'Z'.",
        noCredit: "Submits standard Base64 character 'A'."
      },
      acceptableAlternatives: ['HTG{z}', 'z', 'Z', 'HTG{Z}']
    }
  },
  {
    stableId: 'HTG-L05-OE66',
    order: 66,
    levelNumber: 5,
    title: 'RC4 Stream Cipher State Array Permutation Size',
    prompt: `An analyst analyzes an embedded stream cipher implementation:

\`\`\`c
// Key-Scheduling Algorithm (KSA)
unsigned char S[256];
for (int i = 0; i < 256; i++) {
    S[i] = i;
}
\`\`\`

This loop initializes the identity permutation state array of the Rivest Cipher 4 (RC4) stream cipher algorithm before key permutation.

How many bytes in integer format is the total length of the RC4 permutation array \`S\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 256).`,
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
    flag: 'HTG{256}',
    hints: [
      {
        hintIndex: 1,
        content: "The S-box array contains 256 bytes (0 to 255).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE66',
      seedId: 'HTG-L05-OE66',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "RC4 uses a 256-byte internal state array representing a permutation of all 256 possible byte values.",
      essentialKeyPoints: [
        "Recognizing standard cryptographic algorithms by their constants/loop bounds speeds up analysis.",
        "A 256-byte loop initializing S[i]=i is a textbook RC4 signature."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{256}' or '256'.",
        partialCredit: "Submits '256 bytes'.",
        noCredit: "Submits 255 or 128."
      },
      acceptableAlternatives: ['HTG{256}', '256', '256 bytes']
    }
  },
  {
    stableId: 'HTG-L05-OE67',
    order: 67,
    levelNumber: 5,
    title: 'Linear Feedback Shift Register (LFSR) Feedback Bit',
    prompt: `A pseudorandom generator uses a 4-bit Fibonacci Linear Feedback Shift Register (LFSR). The 4-bit state vector is:

\`\`\`text
State: [b3, b2, b1, b0] = [1, 0, 1, 1]
\`\`\`

The feedback polynomial uses taps at bit 3 (\`b3\`) and bit 0 (\`b0\`):
\`\`\`text
feedback_bit = b3 XOR b0
\`\`\`

Calculate the resulting single feedback bit value (\`1 XOR 1\`).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the single bit, e.g. 0).`,
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
    flag: 'HTG{0}',
    hints: [
      {
        hintIndex: 1,
        content: "1 XOR 1 is 0.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE67',
      seedId: 'HTG-L05-OE67',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "b3 is 1, b0 is 1. The feedback bit is 1 XOR 1 = 0.",
      essentialKeyPoints: [
        "LFSRs are hardware-efficient pseudorandom number generators.",
        "Feedback tap configurations determine maximal-length sequence properties."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0}' or '0'.",
        partialCredit: "Submits text 'zero'.",
        noCredit: "Submits 1."
      },
      acceptableAlternatives: ['HTG{0}', '0', 'zero']
    }
  },
  {
    stableId: 'HTG-L05-OE68',
    order: 68,
    levelNumber: 5,
    title: 'Custom Stack Virtual Machine Execution Result',
    prompt: `An obfuscated binary interprets instructions using an internal stack-based virtual machine:

\`\`\`text
Opcode 0x01: PUSH <val>  (Pushes immediate integer onto stack)
Opcode 0x02: SUB         (Pops operand B, pops operand A, pushes A - B)
Opcode 0x03: HALT        (Terminates execution and returns top of stack)

Bytecode Stream:
0x01 0x0A    ; PUSH 10
0x01 0x04    ; PUSH 4
0x02         ; SUB (10 - 4 = 6)
0x03         ; HALT
\`\`\`

Simulate the virtual machine execution. What integer value remains at the top of the stack when the VM terminates?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 6).`,
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
    flag: 'HTG{6}',
    hints: [
      {
        hintIndex: 1,
        content: "PUSH 10, PUSH 4, SUB: 10 - 4 = 6.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE68',
      seedId: 'HTG-L05-OE68',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "The VM pushes 10, pushes 4, and performs 10 - 4 = 6. The top of the stack is 6.",
      essentialKeyPoints: [
        "Virtual Machine protectors (VMProtect, CodeVirtualizer) translate native instructions into proprietary bytecode.",
        "Devirtualization requires analyzing the interpreter loop and mapping custom bytecode semantics."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{6}' or '6'.",
        partialCredit: "Submits text 'six'.",
        noCredit: "Submits 14 (addition) or raw operands."
      },
      acceptableAlternatives: ['HTG{6}', '6', 'six']
    }
  },
  {
    stableId: 'HTG-L05-OE69',
    order: 69,
    levelNumber: 5,
    title: 'Self-Modifying Code Runtime Decryption Double Word',
    prompt: `A self-modifying code routine decrypts an encrypted function in memory prior to jumping to it:

\`\`\`c
unsigned int encrypted_dword = 0xEA55AA55;
unsigned int decryption_key  = 0xAA55AA55;

unsigned int decrypted_code = encrypted_dword ^ decryption_key;
\`\`\`

Calculate the resulting 32-bit hexadecimal value of \`decrypted_code\` (hint: 0xEA55AA55 ^ 0xAA55AA55).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex dword, e.g. 0x40000000).`,
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
    flag: 'HTG{0x40000000}',
    hints: [
      {
        hintIndex: 1,
        content: "0xEA55AA55 ^ 0xAA55AA55: The lower 28 bits match (0x55AA55 ^ 0x55AA55 = 0). 0xE ^ 0xA = 0x4 -> 0x40000000.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE69',
      seedId: 'HTG-L05-OE69',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "0xEA55AA55 ^ 0xAA55AA55 = 0x40000000. Self-modifying code decrypts blocks in-place before transferring execution.",
      essentialKeyPoints: [
        "Self-modifying code alters machine code in memory at runtime.",
        "Static disassemblers show obfuscated bytes until the decryption routine is simulated."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x40000000}', '0x40000000', or '40000000'.",
        partialCredit: "Submits uppercase '0X40000000'.",
        noCredit: "Submits un-XORed encrypted value."
      },
      acceptableAlternatives: ['HTG{0x40000000}', '0x40000000', '40000000', '0X40000000', 'HTG{40000000}']
    }
  },
  {
    stableId: 'HTG-L05-OE70',
    order: 70,
    levelNumber: 5,
    title: 'Master Binary Reverse Engineering Flag Synthesis',
    prompt: `Synthesizing the complete reverse engineering engagement across all investigative milestones:

\`\`\`text
1. Executable Structure: ELF 64-bit loadable binary analyzed
2. Control Flow: Function prologue and calling conventions mapped
3. Bytecode Triage: Custom VM dispatch loop devirtualized
4. Metadata & Symbols: Stripped binary string encryption identified
5. Routine Validation: Inverse algebraic constraints resolved
6. Debugging Trace: Anti-debugging bypass confirmed
\`\`\`

Upon satisfying all validation criteria and solving the final constraint solver, the binary emits the master operational token:

\`\`\`text
BINARY_ECHO_UNLOCKED
\`\`\`

Submit the master operational token to conclude Level 5.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the token (or submit the token string).`,
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
    flag: 'HTG{BINARY_ECHO_UNLOCKED}',
    hints: [
      {
        hintIndex: 1,
        content: "Submit the operational token 'BINARY_ECHO_UNLOCKED'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE70',
      seedId: 'HTG-L05-OE70',
      subtopic: 'Multi-step binary analysis and flag recovery',
      explanation: "Final flag synthesis compiles all subtopics into the operational token BINARY_ECHO_UNLOCKED.",
      essentialKeyPoints: [
        "End-to-end binary analysis requires combining static analysis, dynamic debugging, and symbolic deobfuscation.",
        "Capturing the final token marks mastery of binary reverse engineering fundamentals."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{BINARY_ECHO_UNLOCKED}' or 'BINARY_ECHO_UNLOCKED'.",
        partialCredit: "Submits lowercase 'binary_echo_unlocked' or spaced 'binary echo unlocked'.",
        noCredit: "Submits incomplete token."
      },
      acceptableAlternatives: [
        'HTG{BINARY_ECHO_UNLOCKED}',
        'BINARY_ECHO_UNLOCKED',
        'binary_echo_unlocked',
        'binary echo unlocked',
        'BINARY ECHO UNLOCKED'
      ]
    }
  }
];

module.exports = subtopic7Questions;

