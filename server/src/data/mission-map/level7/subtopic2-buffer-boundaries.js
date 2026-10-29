const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    stableId: 'HTG-L07-OE11',
    order: 11,
    levelNumber: 7,
    title: 'Inherently Dangerous C Standard Library Input Function',
    prompt: `An audit of legacy network services flags an unsafe input routine:

\`\`\`c
void read_input() {
    char buffer[64];
    gets(buffer);
}
\`\`\`

The ISO C11 standard officially removed this C standard library function because it provides no mechanism to specify a maximum buffer size, making buffer overflow unavoidable whenever input length exceeds buffer capacity.

What is the name of this deprecated standard library input function?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name).`,
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
    flag: 'HTG{gets}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the function call in the code snippet: gets(buffer).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE11',
      seedId: 'HTG-L07-OE11',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "gets() reads characters until a newline or EOF is reached without bounds checking, making it inherently unsafe.",
      essentialKeyPoints: [
        "gets() cannot prevent buffer overflow because it lacks a buffer size parameter.",
        "Secure code replaces gets() with fgets() or getline()."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{gets}' or 'gets'.",
        partialCredit: "Submits 'gets()'.",
        noCredit: "Submits fgets or scanf."
      },
      acceptableAlternatives: ['HTG{gets}', 'gets', 'gets()', 'GETS', 'HTG{gets()}']
    }
  },
  {
    stableId: 'HTG-L07-OE12',
    order: 12,
    levelNumber: 7,
    title: 'Calculating Exact Byte Offset from Buffer to Saved Base Pointer',
    prompt: `A local array \`char buffer[64]\` is allocated at offset \`[rbp - 0x40]\` in a 64-bit stack frame. No other local variables or padding bytes are placed between the buffer and the saved frame pointer:

\`\`\`text
[rbp - 0x40 to rbp - 0x01] : 64-byte local buffer
[rbp + 0x00 to rbp + 0x07] : 8-byte saved RBP
\`\`\`

How many total bytes must an input stream contain to completely fill the local buffer and reach the first byte of the saved base pointer (\`RBP\`)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer byte count).`,
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
    flag: 'HTG{64}',
    hints: [
      {
        hintIndex: 1,
        content: "Hex 0x40 equals 64 bytes.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE12',
      seedId: 'HTG-L07-OE12',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "The buffer is 64 bytes (0x40 bytes) long; providing exactly 64 bytes reaches the saved RBP.",
      essentialKeyPoints: [
        "Offset calculation requires determining distance from buffer start to control data.",
        "64 bytes fills the buffer, after which subsequent bytes overwrite RBP."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{64}' or '64'.",
        partialCredit: "Submits '64 bytes' or '0x40'.",
        noCredit: "Submits 72 or 80."
      },
      acceptableAlternatives: ['HTG{64}', '64', '64 bytes', '0x40']
    }
  },
  {
    stableId: 'HTG-L07-OE13',
    order: 13,
    levelNumber: 7,
    title: 'Off-by-One Null Byte Poisoning Vulnerability',
    prompt: `A programmer writes a loop with a boundary condition error:

\`\`\`c
char buffer[128];
for (int i = 0; i <= 128; i++) {
    buffer[i] = read_input_byte();
}
\`\`\`

Because array indices range from \`0\` to \`127\`, writing to \`buffer[128]\` writes a single byte beyond the allocated boundary, corrupting the least significant byte of the adjacent saved base pointer with \`0x00\`.

What classic vulnerability classification term describes this flaw where an iteration boundary exceeds an array by exactly one index?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hyphenated term).`,
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
    flag: 'HTG{off-by-one}',
    hints: [
      {
        hintIndex: 1,
        content: "The error is an off-by-one boundary flaw.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE13',
      seedId: 'HTG-L07-OE13',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "An off-by-one error occurs when a loop condition (like <= instead of <) writes one element past the buffer end.",
      essentialKeyPoints: [
        "Off-by-one overflows can overwrite the LSB of saved RBP, altering stack frame alignment.",
        "Poisoning RBP with null bytes can shift RSP to attacker-controlled memory upon leave; ret."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{off-by-one}' or 'off-by-one'.",
        partialCredit: "Submits 'off by one' or 'Off-by-one'.",
        noCredit: "Submits buffer overflow or out of bounds."
      },
      acceptableAlternatives: ['HTG{off-by-one}', 'off-by-one', 'off by one', 'Off-by-one', 'HTG{off by one}']
    }
  },
  {
    stableId: 'HTG-L07-OE14',
    order: 14,
    levelNumber: 7,
    title: 'Safe Alternative to strcpy in POSIX/C99',
    prompt: `To remediate an unbounded \`strcpy(dest, src)\` vulnerability, a developer selects a standard C library function that enforces a maximum character count:

\`\`\`c
char *strncpy(char *dest, const char *src, size_t n);
\`\`\`

Which standard C library function name provides this bounded string copy operation?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name).`,
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
    flag: 'HTG{strncpy}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the function signature in the prompt: strncpy.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE14',
      seedId: 'HTG-L07-OE14',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "strncpy accepts a size_t parameter n to limit the number of bytes copied, mitigating unbounded buffer overflows.",
      essentialKeyPoints: [
        "strncpy bounds copy length but does not guarantee null termination if length equals n.",
        "Secure coding standards recommend strlcpy or explicit null termination following strncpy."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{strncpy}' or 'strncpy'.",
        partialCredit: "Submits 'strncpy()'.",
        noCredit: "Submits strcpy or memcpy."
      },
      acceptableAlternatives: ['HTG{strncpy}', 'strncpy', 'strncpy()', 'STRNCPY', 'HTG{strncpy()}']
    }
  },
  {
    stableId: 'HTG-L07-OE15',
    order: 15,
    levelNumber: 7,
    title: 'Integer Underflow in Allocation Size Parameter',
    prompt: `An input processing routine calculates buffer sizes using unsigned arithmetic:

\`\`\`c
size_t length = get_user_length(); // Returns 0
size_t alloc_size = length - 1;    // Underflow calculation
char *buffer = malloc(alloc_size);
\`\`\`

When \`0\` is decremented in an unsigned 64-bit integer type, the value wraps around to \`0xFFFFFFFFFFFFFFFF\` (\`SIZE_MAX\`).

What specific type of arithmetic condition (overflow or underflow) occurs when decrementing an unsigned integer past zero?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the condition name).`,
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
    flag: 'HTG{underflow}',
    hints: [
      {
        hintIndex: 1,
        content: "Subtracting below the minimum representable value causes an underflow.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE15',
      seedId: 'HTG-L07-OE15',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "An integer underflow occurs when an arithmetic operation results in a value lower than the minimum representable number, wrapping to maximum.",
      essentialKeyPoints: [
        "Unsigned integer underflow wraps to large positive numbers (e.g. 0 - 1 = 2^64 - 1).",
        "Subsequent memory copy routines using this wrapped size lead to out-of-bounds heap memory access."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{underflow}' or 'underflow'.",
        partialCredit: "Submits 'integer underflow' or uppercase.",
        noCredit: "Submits overflow or truncation."
      },
      acceptableAlternatives: ['HTG{underflow}', 'underflow', 'UNDERFLOW', 'integer underflow', 'HTG{integer underflow}']
    }
  },
  {
    stableId: 'HTG-L07-OE16',
    order: 16,
    levelNumber: 7,
    title: 'Format String Specifier Writing Bytes to Memory',
    prompt: `In format string vulnerabilities (\`printf(user_string)\`), most format specifiers read data from the stack or registers (\`%x\`, \`%p\`, \`%s\`).

However, the C standard library includes one specific format specifier that writes the number of characters emitted so far into an integer pointer supplied as an argument:

\`\`\`c
int count;
printf("Bytes written: %d%n", 42, &count);
\`\`\`

Adversaries abuse this specifier to achieve arbitrary memory write primitives.

What format specifier (including the \`%\` symbol) writes byte counts to memory?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the format specifier).`,
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
    flag: 'HTG{%n}',
    hints: [
      {
        hintIndex: 1,
        content: "The format specifier is %n.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE16',
      seedId: 'HTG-L07-OE16',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "%n writes the number of bytes formatted so far to the address pointed to by the matching argument.",
      essentialKeyPoints: [
        "%n is the only standard printf specifier that performs a memory write operation.",
        "Format string exploits pair %n with width specifiers to write controlled 4-byte or 8-byte integers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{%n}' or '%n'.",
        partialCredit: "Submits 'n' or '%N'.",
        noCredit: "Submits %p or %s."
      },
      acceptableAlternatives: ['HTG{%n}', '%n', 'n', '%N', 'HTG{n}']
    }
  },
  {
    stableId: 'HTG-L07-OE17',
    order: 17,
    levelNumber: 7,
    title: 'Heap Chunk Metadata Header Overwrite in dlmalloc',
    prompt: `In standard glibc and dlmalloc heap implementations, chunks of dynamic memory are preceded by metadata headers:

\`\`\`text
+-----------------------+-----------------------+
| prev_size (8 bytes)   | size & flags (8 bytes)|
+-----------------------+-----------------------+
| user data payload ...                         |
+-----------------------------------------------+
\`\`\`

When a heap buffer overflow occurs, input data spills into the adjacent chunk header.

What is the name of the first 8-byte metadata field in the chunk header that records the size of the immediately preceding free chunk?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the field name).`,
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
    flag: 'HTG{prev_size}',
    hints: [
      {
        hintIndex: 1,
        content: "Look at the diagram header: prev_size.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE17',
      seedId: 'HTG-L07-OE17',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "prev_size stores the byte size of the previous contiguous chunk, used during chunk coalescing.",
      essentialKeyPoints: [
        "Heap chunk metadata fields (prev_size and size) manage allocation states.",
        "Overwriting prev_size and clearing the PREV_INUSE flag triggers heap consolidation exploits."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{prev_size}' or 'prev_size'.",
        partialCredit: "Submits uppercase 'PREV_SIZE' or 'prev size'.",
        noCredit: "Submits size or flags."
      },
      acceptableAlternatives: ['HTG{prev_size}', 'prev_size', 'PREV_SIZE', 'prev size', 'HTG{prev size}']
    }
  },
  {
    stableId: 'HTG-L07-OE18',
    order: 18,
    levelNumber: 7,
    title: 'Use-After-Free (UAF) Flaw Classification Acronym',
    prompt: `Consider the following dynamic memory sequence:

\`\`\`c
Session *session = malloc(sizeof(Session));
// ... operations ...
free(session); // Memory deallocated

// Pointer remains dangling without being set to NULL
session->authenticate(); // Memory dereferenced after release
\`\`\`

When a program continues to read from or write to a memory pointer after that memory block has been released back to the heap allocator, it creates a dangerous condition.

What standard 3-letter acronym designates this Use-After-Free vulnerability?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{UAF}',
    hints: [
      {
        hintIndex: 1,
        content: "Acronym for Use-After-Free: UAF.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE18',
      seedId: 'HTG-L07-OE18',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "UAF stands for Use-After-Free, where dangling pointers are utilized after memory has been freed.",
      essentialKeyPoints: [
        "UAF allows attackers to reallocate memory blocks with controlled object data, hijacking virtual dispatch.",
        "Mitigation requires setting pointers to NULL immediately upon deallocation."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{UAF}' or 'UAF'.",
        partialCredit: "Submits lowercase 'uaf' or 'Use After Free'.",
        noCredit: "Submits OOB or ROP."
      },
      acceptableAlternatives: ['HTG{UAF}', 'UAF', 'uaf', 'Use After Free', 'HTG{uaf}']
    }
  },
  {
    stableId: 'HTG-L07-OE19',
    order: 19,
    levelNumber: 7,
    title: 'Bounded Formatted String Output Function',
    prompt: `Unchecked calls to \`sprintf(target, "%s", input)\` can cause buffer overflows if \`input\` exceeds \`target\` capacity.

To prevent buffer overflow while formatting strings, developers use the length-bounded variant that accepts a maximum buffer size parameter \`n\`:

\`\`\`c
int snprintf(char *str, size_t size, const char *format, ...);
\`\`\`

What is the name of this standard C library function?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the function name).`,
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
    flag: 'HTG{snprintf}',
    hints: [
      {
        hintIndex: 1,
        content: "The bounded printf variant is snprintf.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE19',
      seedId: 'HTG-L07-OE19',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "snprintf guarantees that at most size bytes (including terminating null) are written to the output buffer.",
      essentialKeyPoints: [
        "snprintf mitigates format buffer overflows by enforcing explicit output bounds.",
        "Return value of snprintf indicates how many bytes would have been written, facilitating truncation detection."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{snprintf}' or 'snprintf'.",
        partialCredit: "Submits 'snprintf()'.",
        noCredit: "Submits sprintf or printf."
      },
      acceptableAlternatives: ['HTG{snprintf}', 'snprintf', 'snprintf()', 'SNPRINTF', 'HTG{snprintf()}']
    }
  },
  {
    stableId: 'HTG-L07-OE20',
    order: 20,
    levelNumber: 7,
    title: 'Double Free Vulnerability Condition',
    prompt: `An error-handling branch in an authentication server executes the following deallocation code:

\`\`\`c
free(token);
// ... error handling logic ...
free(token); // Deallocating the same pointer a second time
\`\`\`

Calling the memory deallocator twice on the exact same allocated pointer corrupts the allocator's internal free-list data structures (such as tcache or fastbin singly-linked lists), creating cyclical pointer loops.

What hyphenated term names the vulnerability of freeing an already-freed pointer?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the hyphenated term).`,
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
    flag: 'HTG{double-free}',
    hints: [
      {
        hintIndex: 1,
        content: "Freeing twice is called a double-free.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L07-OE20',
      seedId: 'HTG-L07-OE20',
      subtopic: 'Buffer boundaries and memory-safety reasoning',
      explanation: "A double free occurs when free() is called more than once with the same memory address without reallocation.",
      essentialKeyPoints: [
        "Double-free corrupts memory metadata and can trick the allocator into returning arbitrary pointers.",
        "Modern allocators implement fastbin/tcache integrity checks to detect consecutive double frees."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{double-free}' or 'double-free'.",
        partialCredit: "Submits 'double free' or 'Double Free'.",
        noCredit: "Submits memory leak or buffer overflow."
      },
      acceptableAlternatives: ['HTG{double-free}', 'double-free', 'double free', 'Double Free', 'HTG{double free}']
    }
  }
];

module.exports = subtopic2Questions;

