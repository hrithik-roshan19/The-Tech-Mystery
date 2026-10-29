const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L05-OE41',
    order: 41,
    levelNumber: 5,
    title: 'Character Transformation Loop Reversal',
    prompt: `An analyst reverses a key check function inside a challenge binary:

\`\`\`c
// input is a 4-character ASCII string
const unsigned char expected[4] = { 0x41, 0x47, 0x4A, 0x51 };

for (int i = 0; i < 4; i++) {
    if ((input[i] + (i * 3)) != expected[i]) {
        return 0; // Failure
    }
}
return 1; // Success
\`\`\`

Reverse the index-based addition (\`input[i] = expected[i] - (i * 3)\`) for each position to recover the 4-character ASCII string (hint: i=0 -> 0x41='A').

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
    flag: 'HTG{ADDH}',
    hints: [
      {
        hintIndex: 1,
        content: "i=0: 0x41-0=0x41('A'); i=1: 0x47-3=0x44('D'); i=2: 0x4A-6=0x44('D'); i=3: 0x51-9=0x48('H'): 'ADDH'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE41',
      seedId: 'HTG-L05-OE41',
      subtopic: 'Reverse engineering validation routines',
      explanation: "Subtracting (i * 3) from each expected byte yields ASCII codes 0x41 ('A'), 0x44 ('D'), 0x44 ('D'), and 0x48 ('H'). The input string is ADDH.",
      essentialKeyPoints: [
        "Position-dependent arithmetic transformations are common in crackme validation loops.",
        "Reversing linear operations simply inverts addition to subtraction."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ADDH}' or 'ADDH'.",
        partialCredit: "Submits lowercase 'addh'.",
        noCredit: "Submits raw hex bytes."
      },
      acceptableAlternatives: ['HTG{ADDH}', 'ADDH', 'addh', 'HTG{addh}']
    }
  },
  {
    stableId: 'HTG-L05-OE42',
    order: 42,
    levelNumber: 5,
    title: 'Bitwise XOR and Arithmetic Addition Inversion',
    prompt: `A decompiled function validates an authorization byte using combined arithmetic and bitwise logic:

\`\`\`c
if (((input_byte ^ 0x33) + 7) == 0x5A) {
    grant_access();
}
\`\`\`

Reverse the operations in reverse order:
1. Subtract 7 from \`0x5A\`
2. XOR the result with \`0x33\`

Calculate the resulting hexadecimal value of \`input_byte\` (format as hex, e.g. 0x60).

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
    flag: 'HTG{0x60}',
    hints: [
      {
        hintIndex: 1,
        content: "0x5A - 7 = 0x53. Then: 0x53 ^ 0x33 = 0x60 (96 in decimal).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE42',
      seedId: 'HTG-L05-OE42',
      subtopic: 'Reverse engineering validation routines',
      explanation: "Inverting the equation: input_byte = (0x5A - 7) ^ 0x33 = 0x53 ^ 0x33 = 0x60.",
      essentialKeyPoints: [
        "Inverting mixed Boolean-arithmetic expressions requires respecting operator precedence.",
        "XOR is its own mathematical inverse."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x60}', '0x60', or '60'.",
        partialCredit: "Submits decimal '96'.",
        noCredit: "Submits intermediate value 0x53."
      },
      acceptableAlternatives: ['HTG{0x60}', '0x60', '60', '0X60', '96', 'HTG{60}']
    }
  },
  {
    stableId: 'HTG-L05-OE43',
    order: 43,
    levelNumber: 5,
    title: 'Bitwise Circular Left Rotation (ROL) Inversion',
    prompt: `An encryption subroutine validates a key byte using an 8-bit circular bitwise left rotation:

\`\`\`c
unsigned char rol(unsigned char b, int n) {
    return (b << n) | (b >> (8 - n));
}

if (rol(input_byte, 3) == 0xB4) {
    unlock();
}
\`\`\`

The target value is \`0xB4\` (\`1011 0100\` in binary). Invert the operation by rotating \`0xB4\` right by 3 bit positions (\`ror(0xB4, 3)\`).

What is the resulting 8-bit hexadecimal value of \`input_byte\` (e.g. 0x96)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex byte).`,
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
    flag: 'HTG{0x96}',
    hints: [
      {
        hintIndex: 1,
        content: "Binary 10110100 rotated right by 3 bits becomes 10010110, which is 0x96.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE43',
      seedId: 'HTG-L05-OE43',
      subtopic: 'Reverse engineering validation routines',
      explanation: "Rotating 0xB4 (10110100b) right by 3 bits moves the lowest 3 bits (100) to the highest positions: 10010110b = 0x96.",
      essentialKeyPoints: [
        "Bitwise rotation (ROL/ROR) preserves total bit count and is completely reversible.",
        "Compilers map circular shifts directly to x86 ROL and ROR machine instructions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0x96}', '0x96', or '96'.",
        partialCredit: "Submits uppercase '0X96' or decimal '150'.",
        noCredit: "Submits rotated left result."
      },
      acceptableAlternatives: ['HTG{0x96}', '0x96', '96', '0X96', '150', 'HTG{96}']
    }
  },
  {
    stableId: 'HTG-L05-OE44',
    order: 44,
    levelNumber: 5,
    title: 'Character Accumulator Checksum Equation Constraint',
    prompt: `A crackme checks an input string using an accumulator sum constraint:

\`\`\`c
// input is a 4-character ASCII string
int sum = input[0] + input[1] + input[2] + input[3];
if (sum == 300) {
    validate();
}
\`\`\`

The first three characters are known to be 'A' (ASCII 65), 'B' (ASCII 66), and 'C' (ASCII 67).

Calculate the required 4th character that satisfies \`sum == 300\` (\`300 - (65 + 66 + 67)\`) and identify its ASCII character representation.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the single character (or submit the character, e.g. f).`,
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
    flag: 'HTG{f}',
    hints: [
      {
        hintIndex: 1,
        content: "65 + 66 + 67 = 198. 300 - 198 = 102. ASCII 102 is lowercase 'f'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE44',
      seedId: 'HTG-L05-OE44',
      subtopic: 'Reverse engineering validation routines',
      explanation: "Sum of first three characters is 65 + 66 + 67 = 198. To reach 300, input[3] must be 300 - 198 = 102, which is 'f'.",
      essentialKeyPoints: [
        "Checksum validation sums byte values across buffer inputs.",
        "Under-constrained validation routines allow multiple valid character solutions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{f}' or 'f'.",
        partialCredit: "Submits ASCII decimal code '102'.",
        noCredit: "Submits uppercase 'F' (which is ASCII 70)."
      },
      acceptableAlternatives: ['HTG{f}', 'f', 'F', '102', 'HTG{102}']
    }
  },
  {
    stableId: 'HTG-L05-OE45',
    order: 45,
    levelNumber: 5,
    title: 'Simultaneous Linear Equation Constraint Solving',
    prompt: `An obfuscated serial number validator sets up a system of two linear equations governing two positive integer key parameters \`x\` and \`y\`:

\`\`\`text
Equation 1: 2*x + y  = 14
Equation 2:   x + 3*y = 22
\`\`\`

Solve this system of equations for integer values \`x\` and \`y\`.

Then calculate the product of \`x\` and \`y\` (\`x * y\`).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer product, e.g. 24).`,
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
    flag: 'HTG{24}',
    hints: [
      {
        hintIndex: 1,
        content: "From Eq 1: y = 14 - 2x. Substitute into Eq 2: x + 3(14 - 2x) = 22 -> -5x = -20 -> x = 4, y = 6. Product: 4 * 6 = 24.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE45',
      seedId: 'HTG-L05-OE45',
      subtopic: 'Reverse engineering validation routines',
      explanation: "Solving the system yields x = 4 and y = 6. The product x * y is 4 * 6 = 24.",
      essentialKeyPoints: [
        "SMT solvers (e.g. Z3) are widely used to automate solving linear constraint systems in reverse engineering.",
        "Manual linear substitution resolves small algebraic validation systems."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{24}' or '24'.",
        partialCredit: "Submits 'x=4, y=6'.",
        noCredit: "Submits sum x+y=10."
      },
      acceptableAlternatives: ['HTG{24}', '24']
    }
  },
  {
    stableId: 'HTG-L05-OE46',
    order: 46,
    levelNumber: 5,
    title: 'Substitution Box (S-Box) Inversion Lookup',
    prompt: `A cryptographic validation routine passes an integer input through a small lookup substitution table (S-Box):

\`\`\`c
const int S[5] = { 4, 2, 0, 3, 1 };

if (S[input] == 3) {
    grant_access();
}
\`\`\`

What integer index \`input\` (between 0 and 4) satisfies the condition \`S[input] == 3\`?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 3).`,
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
    flag: 'HTG{3}',
    hints: [
      {
        hintIndex: 1,
        content: "Examine the array: S[0]=4, S[1]=2, S[2]=0, S[3]=3, S[4]=1. Index 3 contains value 3.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE46',
      seedId: 'HTG-L05-OE46',
      subtopic: 'Reverse engineering validation routines',
      explanation: "Looking up value 3 in the array S reveals that S[3] == 3. The required input index is 3.",
      essentialKeyPoints: [
        "S-Boxes introduce non-linearity into cryptographic and obfuscated algorithms.",
        "Inverting an S-Box requires creating an inverse lookup table where InvS[S[x]] = x."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{3}' or '3'.",
        partialCredit: "Submits text 'three'.",
        noCredit: "Submits index 0, 1, 2, or 4."
      },
      acceptableAlternatives: ['HTG{3}', '3', 'three']
    }
  },
  {
    stableId: 'HTG-L05-OE47',
    order: 47,
    levelNumber: 5,
    title: 'String Length Pre-Condition Disassembly Audit',
    prompt: `An analyst disassembles the entry validation gate of a license key checker:

\`\`\`nasm
lea rdi, [rsp + 0x20]    ; pointer to input string
call strlen
cmp eax, 0x10
jne loc_reject_length
\`\`\`

The hexadecimal literal \`0x10\` specifies the exact character length required for the input key buffer.

What exact integer length in decimal format is required by this condition?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 16).`,
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
    flag: 'HTG{16}',
    hints: [
      {
        hintIndex: 1,
        content: "Convert 0x10 hexadecimal to decimal: 16.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE47',
      seedId: 'HTG-L05-OE47',
      subtopic: 'Reverse engineering validation routines',
      explanation: "The condition cmp eax, 0x10 checks if strlen is 16 in decimal (0x10).",
      essentialKeyPoints: [
        "Length checks act as early guardrails before deeper cryptographic loops.",
        "Disassembly tools display immediate constants in hexadecimal by default."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{16}' or '16'.",
        partialCredit: "Submits '16 characters'.",
        noCredit: "Submits 10 (misinterpreting hex as decimal)."
      },
      acceptableAlternatives: ['HTG{16}', '16', '16 characters']
    }
  },
  {
    stableId: 'HTG-L05-OE48',
    order: 48,
    levelNumber: 5,
    title: 'Bitwise Nibble Swap Function Reversal',
    prompt: `A reverse engineer analyzes a byte permutation function:

\`\`\`c
unsigned char swap_nibbles(unsigned char b) {
    return (b >> 4) | (b << 4);
}
\`\`\`

This function swaps the 4 high bits with the 4 low bits of an 8-bit byte.

If the output byte resulting from this function is observed to be \`0x4A\` (high nibble 4, low nibble A), what was the original input byte before swapping?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hex byte, e.g. 0xA4).`,
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
    flag: 'HTG{0xA4}',
    hints: [
      {
        hintIndex: 1,
        content: "Swapping nibbles is symmetric: swap nibbles of 0x4A to get 0xA4.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE48',
      seedId: 'HTG-L05-OE48',
      subtopic: 'Reverse engineering validation routines',
      explanation: "Nibble swapping is an involution (f(f(x)) = x). Swapping the nibbles of 0x4A places 'A' in the high nibble and '4' in the low nibble: 0xA4.",
      essentialKeyPoints: [
        "Nibble swapping reorders half-bytes without losing information.",
        "Involutive functions serve as their own mathematical inverse."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0xA4}', '0xA4', or 'A4'.",
        partialCredit: "Submits lowercase '0xa4' or 'a4'.",
        noCredit: "Submits unswapped 0x4A."
      },
      acceptableAlternatives: ['HTG{0xA4}', '0xA4', 'A4', '0xa4', 'a4', 'HTG{A4}']
    }
  },
  {
    stableId: 'HTG-L05-OE49',
    order: 49,
    levelNumber: 5,
    title: 'Modular Multiplicative Inverse Key Check',
    prompt: `A license key validation subroutine evaluates an integer parameter \`k\` (between 0 and 25) under modular arithmetic:

\`\`\`c
if ((k * 3) % 26 == 1) {
    key_valid();
}
\`\`\`

The integer \`k\` is the modular multiplicative inverse of 3 modulo 26.

What integer value between 0 and 25 satisfies \`(k * 3) % 26 == 1\` (hint: 3 * 9 = 27 = 26 * 1 + 1)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 9).`,
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
    flag: 'HTG{9}',
    hints: [
      {
        hintIndex: 1,
        content: "Calculate: 3 * 9 = 27. 27 mod 26 is 1.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE49',
      seedId: 'HTG-L05-OE49',
      subtopic: 'Reverse engineering validation routines',
      explanation: "The modular multiplicative inverse of 3 modulo 26 is 9, because (3 * 9) % 26 = 27 % 26 = 1.",
      essentialKeyPoints: [
        "Modular inverses exist if and only if gcd(a, m) == 1 (coprime).",
        "The Extended Euclidean Algorithm calculates modular inverses in cryptographic algorithms like RSA."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{9}' or '9'.",
        partialCredit: "Submits text 'nine'.",
        noCredit: "Submits 27 or 3."
      },
      acceptableAlternatives: ['HTG{9}', '9', 'nine']
    }
  },
  {
    stableId: 'HTG-L05-OE50',
    order: 50,
    levelNumber: 5,
    title: 'Fibonacci Sequence Iteration Gate Verification',
    prompt: `An algorithm contains a mathematical barrier function that checks whether an input integer equals the 10th Fibonacci number:

\`\`\`c
int fib(int n) {
    if (n <= 2) return 1;
    int a = 1, b = 1, c;
    for (int i = 3; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}

if (input_value == fib(10)) {
    pass();
}
\`\`\`

The standard sequence begins: F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13, F(8)=21, F(9)=34...

What integer value is F(10)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer, e.g. 55).`,
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
    flag: 'HTG{55}',
    hints: [
      {
        hintIndex: 1,
        content: "F(9) is 34, F(8) is 21. F(10) = 34 + 21 = 55.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L05-OE50',
      seedId: 'HTG-L05-OE50',
      subtopic: 'Reverse engineering validation routines',
      explanation: "F(10) = F(9) + F(8) = 34 + 21 = 55.",
      essentialKeyPoints: [
        "Recursive and iterative sequence generators are frequently embedded as mathematical barriers in challenges.",
        "Recognizing standard mathematical sequences speeds up reverse engineering analysis."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{55}' or '55'.",
        partialCredit: "Submits text 'fifty-five'.",
        noCredit: "Submits F(9)=34 or F(11)=89."
      },
      acceptableAlternatives: ['HTG{55}', '55', 'fifty-five']
    }
  }
];

module.exports = subtopic5Questions;

