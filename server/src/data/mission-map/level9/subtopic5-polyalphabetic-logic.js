const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    stableId: 'HTG-L09-OE41',
    order: 41,
    levelNumber: 9,
    title: 'Foundational Polyalphabetic Vigenère Cipher',
    prompt: `In classical cryptography, monoalphabetic substitution ciphers were rendered obsolete by frequency analysis. To obscure single-letter frequencies, cryptographers introduced polyalphabetic substitution where each character is shifted according to a repeating key word:
$$C_i = (P_i + K_{i \\pmod L}) \\pmod{26}$$
Although originally described by Giovan Battista Bellaso in 1553, this famous cipher became historically known by the name of which 16th-century French diplomat and cryptographer?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the surname).`,
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
    flag: 'HTG{Vigenere}',
    hints: [
      {
        hintIndex: 1,
        content: "Blaise de Vigenère gave his name to the Vigenère cipher.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE41',
      seedId: 'HTG-L09-OE41',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "Blaise de Vigenère is the namesake of the Vigenère cipher.",
      essentialKeyPoints: [
        "Vigenère ciphers employ multiple interleaved Caesar shifts determined by a keyword.",
        "For centuries it was considered unbreakable ('le chiffre indéchiffrable')."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Vigenere}' or 'Vigenere'.",
        partialCredit: "Submits 'Vigenère' or 'vigenere'.",
        noCredit: "Submits Caesar or Playfair."
      },
      acceptableAlternatives: ['HTG{Vigenere}', 'Vigenere', 'vigenere', 'Vigenère', 'vigenère', 'HTG{vigenere}']
    }
  },
  {
    stableId: 'HTG-L09-OE42',
    order: 42,
    levelNumber: 9,
    title: 'Kasiski Examination Greatest Common Divisor Period Recovery',
    prompt: `In 1863, Prussian military officer Friedrich Kasiski published the first general method for breaking polyalphabetic ciphers with repeating keywords.

Kasiski observed that identical plaintext n-grams encrypted with the identical key segment yield identical ciphertext n-grams. The distance $\\Delta$ between recurring ciphertext blocks must therefore be an integer multiple of the keyword length $L$.

What mathematical operator (abbreviated in 3 uppercase letters) is computed on the set of observed separation intervals $\\{\\Delta_1, \\Delta_2, \\dots, \\Delta_m\\}$ to deduce the candidate keyword length?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
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
    flag: 'HTG{GCD}',
    hints: [
      {
        hintIndex: 1,
        content: "Greatest Common Divisor is abbreviated GCD.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE42',
      seedId: 'HTG-L09-OE42',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "The Greatest Common Divisor (GCD) of distances between repeated ciphertext strings reveals the keyword length.",
      essentialKeyPoints: [
        "Kasiski examination identifies repeating sequences of 3 or more ciphertext characters.",
        "The GCD of the intervals points directly to the periodic key length L."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{GCD}' or 'GCD'.",
        partialCredit: "Submits lowercase 'gcd' or 'Greatest Common Divisor'.",
        noCredit: "Submits LCM or MOD."
      },
      acceptableAlternatives: ['HTG{GCD}', 'GCD', 'gcd', 'Greatest Common Divisor', 'greatest common divisor', 'HTG{gcd}']
    }
  },
  {
    stableId: 'HTG-L09-OE43',
    order: 43,
    levelNumber: 9,
    title: 'Friedman Index of Coincidence Natural English Baseline',
    prompt: `In 1922, US cryptanalyst William F. Friedman defined the Index of Coincidence ($I_C$ or $\\kappa$), measuring the probability that two letters chosen at random from a text are identical:
$$I_C = \\frac{\\sum_{i=A}^Z f_i(f_i - 1)}{N(N - 1)}$$
While completely random, uniformly distributed ciphertext produces an expected $I_C \\approx 0.0385$, natural English plain text produces an elevated $I_C$ due to non-uniform letter distributions (e.g., frequent E, T, A, O, I, N).

What is the standard theoretical Index of Coincidence value for natural English text, rounded to three decimal places (e.g. 0.067)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the decimal value).`,
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
    flag: 'HTG{0.067}',
    hints: [
      {
        hintIndex: 1,
        content: "Natural English produces an Index of Coincidence of approximately 0.067 (or 0.0667).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE43',
      seedId: 'HTG-L09-OE43',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "Standard English prose has an expected Index of Coincidence of approximately 0.0667 (0.067).",
      essentialKeyPoints: [
        "Polyalphabetic substitution lowers the IoC toward the random baseline (0.0385).",
        "Dividing ciphertext into L cosets restores the single-alphabet IoC (~0.067), revealing key length."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{0.067}' or '0.067'.",
        partialCredit: "Submits '0.0667' or '0.066'.",
        noCredit: "Submits 0.0385."
      },
      acceptableAlternatives: ['HTG{0.067}', '0.067', '0.0667', '0.066', 'HTG{0.0667}']
    }
  },
  {
    stableId: 'HTG-L09-OE44',
    order: 44,
    levelNumber: 9,
    title: 'Autokey Cipher Keystream Generation Source',
    prompt: `To eliminate the vulnerability of repeating periodic keywords exposed by Kasiski and Friedman, Blaise de Vigenère created the Autokey cipher.

After an initial secret primer keyword is consumed, the keystream does not loop back to the beginning. Instead, what data stream is appended directly to form the remainder of the keystream?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the source name).`,
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
    flag: 'HTG{plaintext}',
    hints: [
      {
        hintIndex: 1,
        content: "The keystream incorporates the plaintext message itself (plaintext autokey).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE44',
      seedId: 'HTG-L09-OE44',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "The autokey cipher uses the plaintext message itself to generate the keystream after the initial primer word.",
      essentialKeyPoints: [
        "Autokey eliminates periodic key repetitions, preventing Kasiski GCD analysis.",
        "Autokey ciphers are attacked using n-gram word dictionaries or Friedman's symmetry of position."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{plaintext}' or 'plaintext'.",
        partialCredit: "Submits capitalized 'Plaintext'.",
        noCredit: "Submits ciphertext or random."
      },
      acceptableAlternatives: ['HTG{plaintext}', 'plaintext', 'Plaintext', 'plaintext stream', 'HTG{Plaintext}']
    }
  },
  {
    stableId: 'HTG-L09-OE45',
    order: 45,
    levelNumber: 9,
    title: 'Beaufort Cipher Involutory / Reciprocal Property',
    prompt: `In 1857, Sir Francis Beaufort introduced a polyalphabetic substitution variant that modifies the modular subtraction order:
$$C_i = (K_i - P_i) \\pmod{26}$$
Because subtracting ciphertext from the key yields the exact original plaintext:
$$(K_i - C_i) \\pmod{26} = (K_i - (K_i - P_i)) = P_i$$
the encryption and decryption mathematical operations are completely identical.

What algebraic or cryptanalytic term (such as "involutory" or "self-reciprocal") describes a cipher that is its own inverse?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the property term).`,
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
    flag: 'HTG{involutory}',
    hints: [
      {
        hintIndex: 1,
        content: "A mathematical function that is its own inverse is called an involution (or involutory / self-reciprocal).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE45',
      seedId: 'HTG-L09-OE45',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "The Beaufort cipher is involutory (self-reciprocal), meaning the same function encrypts and decrypts.",
      essentialKeyPoints: [
        "Involutory ciphers eliminate the need for separate encryption and decryption algorithms or hardware circuits.",
        "The Beaufort cipher shifts characters by subtracting the plaintext from the key letter."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{involutory}' or 'involutory'.",
        partialCredit: "Submits 'self-reciprocal' or 'reciprocal'.",
        noCredit: "Submits commutative or associative."
      },
      acceptableAlternatives: ['HTG{involutory}', 'involutory', 'Involutory', 'self-reciprocal', 'reciprocal', 'HTG{self-reciprocal}']
    }
  },
  {
    stableId: 'HTG-L09-OE46',
    order: 46,
    levelNumber: 9,
    title: 'Running Key Cipher Book Keystream Paradigm',
    prompt: `To achieve extreme key lengths without relying on algorithmic pseudorandom generators, classical operatives utilized a long passage of text excerpted from an agreed-upon book or literary work as a continuous, non-repeating key.

Because the key text does not repeat, Kasiski examination fails completely.

What is the common cryptographic name for this cipher (known as the "... Key cipher")?

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
    flag: 'HTG{running key}',
    hints: [
      {
        hintIndex: 1,
        content: "A cipher using continuous book text is a running key cipher.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE46',
      seedId: 'HTG-L09-OE46',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "A running key cipher uses a continuous passage from a book or document as a non-repeating keystream.",
      essentialKeyPoints: [
        "Running key ciphers avoid key repetition.",
        "They remain susceptible to cryptanalysis because both plaintext and keystream exhibit natural language statistical redundancy."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{running key}' or 'running key'.",
        partialCredit: "Submits 'Running Key' or 'running key cipher'.",
        noCredit: "Submits one-time pad or stream cipher."
      },
      acceptableAlternatives: ['HTG{running key}', 'running key', 'Running Key', 'running key cipher', 'Running Key Cipher', 'HTG{Running Key}']
    }
  },
  {
    stableId: 'HTG-L09-OE47',
    order: 47,
    levelNumber: 9,
    title: 'Gronsfeld Cipher Decimal Digit Key Variant',
    prompt: `Count Gronsfeld introduced a simplified variant of the Vigenère cipher that replaces alphabetical keyword shifts with a sequence of decimal digits ($0$ through $9$).

Each plaintext letter is shifted down the alphabet by the numeric value of the corresponding key digit (e.g., a key digit of 3 shifts 'A' to 'D').

Which historical cipher bears the name of Count Gronsfeld?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the surname).`,
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
    flag: 'HTG{Gronsfeld}',
    hints: [
      {
        hintIndex: 1,
        content: "The cipher is named after Count Gronsfeld.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE47',
      seedId: 'HTG-L09-OE47',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "The Gronsfeld cipher uses a sequence of digits (0–9) rather than letters to determine alphabet shifts.",
      essentialKeyPoints: [
        "Gronsfeld has a maximum shift of 9, making it significantly easier to break than standard Vigenère (shifts up to 25).",
        "It was widely used in early continental European diplomatic correspondence."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Gronsfeld}' or 'Gronsfeld'.",
        partialCredit: "Submits lowercase 'gronsfeld' or 'Gronsfeld cipher'.",
        noCredit: "Submits Playfair or Hill."
      },
      acceptableAlternatives: ['HTG{Gronsfeld}', 'Gronsfeld', 'gronsfeld', 'Gronsfeld cipher', 'Gronsfeld Cipher', 'HTG{gronsfeld}']
    }
  },
  {
    stableId: 'HTG-L09-OE48',
    order: 48,
    levelNumber: 9,
    title: 'Tabula Recta 26x26 Square Grid Terminology',
    prompt: `In 1508, the German abbot Johannes Trithemius published *Steganographia* and *Polygraphia*, introducing the foundational square grid containing 26 progressive Caesar-shifted alphabets:
\`\`\`text
   A B C D E ... Z
A  A B C D E ... Z
B  B C D E F ... A
C  C D E F G ... B
...
\`\`\`
What 2-word Latin phrase translates to "square table" and serves as the universal name for this $26 \\times 26$ grid?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word Latin phrase).`,
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
    flag: 'HTG{tabula recta}',
    hints: [
      {
        hintIndex: 1,
        content: "The Latin phrase is tabula recta.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE48',
      seedId: 'HTG-L09-OE48',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "The Tabula Recta is a 26x26 grid of shifted alphabets invented by Johannes Trithemius.",
      essentialKeyPoints: [
        "Tabula Recta facilitates manual lookup for Vigenère, Beaufort, and Trithemius ciphers.",
        "Each consecutive row is cyclically shifted by one position."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{tabula recta}' or 'tabula recta'.",
        partialCredit: "Submits capitalized 'Tabula Recta'.",
        noCredit: "Submits Scytale or Caesar square."
      },
      acceptableAlternatives: ['HTG{tabula recta}', 'tabula recta', 'Tabula Recta', 'tabula-recta', 'HTG{Tabula Recta}']
    }
  },
  {
    stableId: 'HTG-L09-OE49',
    order: 49,
    levelNumber: 9,
    title: 'Porta Cipher Dual-Alphabet Substitution Tableau',
    prompt: `In 1563, Italian scholar Giambattista della Porta devised a polyalphabetic cipher that groups the 26 letters into two halves: the first half ($A$ through $M$) and the second half ($N$ through $Z$).

Depending on the keyword letter, the second half of the alphabet is shifted relative to the first half, creating 13 reciprocal character pairs per key state.

What is the surname of this Italian cryptographer who invented this dual-alphabet substitution system?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the surname).`,
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
    flag: 'HTG{Porta}',
    hints: [
      {
        hintIndex: 1,
        content: "Giambattista della Porta: Porta cipher.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE49',
      seedId: 'HTG-L09-OE49',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "The Porta cipher uses 11 distinct substitution alphabets based on paired letter tables.",
      essentialKeyPoints: [
        "Porta groups keys in pairs (AB, CD, EF, GH, IJ, KL, MN, OP, QR, ST, UV, WX, YZ).",
        "It provides reciprocal substitution within each alphabet."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Porta}' or 'Porta'.",
        partialCredit: "Submits lowercase 'porta' or 'della Porta'.",
        noCredit: "Submits Cardano or Alberti."
      },
      acceptableAlternatives: ['HTG{Porta}', 'Porta', 'porta', 'della Porta', 'della porta', 'HTG{porta}']
    }
  },
  {
    stableId: 'HTG-L09-OE50',
    order: 50,
    levelNumber: 9,
    title: 'Canonical Vigenère Decryption of Historic Milestone Ciphertext',
    prompt: `An analyst intercepts a polyalphabetic message encrypted with the standard Vigenère algorithm:
\`\`\`text
Ciphertext: LXFOPVEFRNHR
Key:        LEMONLEMONLE
\`\`\`
Using the standard modular subtraction rule $P_i = (C_i - K_i) \\pmod{26}$:
\`\`\`text
L (11) - L (11) = 0   -> A
X (23) - E (4)  = 19  -> T
F (5)  - M (12) = 19  -> T
O (14) - O (14) = 0   -> A
P (15) - N (13) = 2   -> C
V (21) - L (11) = 10  -> K
E (4)  - E (4)  = 0   -> A
F (5)  - M (12) = 19  -> T
R (17) - O (14) = 3   -> D
N (13) - N (13) = 0   -> A
H (7)  - L (11) = 22  -> W
R (17) - E (4)  = 13  -> N
\`\`\`
What is the complete 12-letter uppercase plaintext message?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the plaintext message).`,
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
    flag: 'HTG{ATTACKATDAWN}',
    hints: [
      {
        hintIndex: 1,
        content: "Assemble the decrypted characters: ATTACKATDAWN.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE50',
      seedId: 'HTG-L09-OE50',
      subtopic: 'Polyalphabetic & classical cryptanalytic logic',
      explanation: "Decrypting 'LXFOPVEFRNHR' with key 'LEMON' produces 'ATTACKATDAWN'.",
      essentialKeyPoints: [
        "Modular subtraction recovers Vigenère plaintext.",
        "'LXFOPVEFRNHR' is the historic textbook example of Vigenère encryption."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{ATTACKATDAWN}' or 'ATTACKATDAWN'.",
        partialCredit: "Submits lowercase 'attackatdawn' or 'ATTACK AT DAWN'.",
        noCredit: "Submits incorrect plaintext."
      },
      acceptableAlternatives: ['HTG{ATTACKATDAWN}', 'ATTACKATDAWN', 'attackatdawn', 'ATTACK AT DAWN', 'attack at dawn', 'HTG{attackatdawn}']
    }
  }
];

module.exports = subtopic5Questions;

