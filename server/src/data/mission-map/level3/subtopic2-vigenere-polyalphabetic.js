const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    "stableId": "HTG-L03-OE11",
    "order": 21,
    "levelNumber": 3,
    "title": "Vigenère Polyalphabetic Cipherstream Decryption",
    "prompt": "An orbital monitoring station intercepted a polyalphabetic transmission:\n\n```text\nGRUMEZZUML\n```\n\nThe operational keyword is confirmed to be:\n\n```text\nORBIT\n```\n\nUsing standard Vigenère decryption (P_i = (C_i - K_i + 26) mod 26), decrypt the 10-letter transmission payload.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{SATELLITES}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "First letter: G (6) - O (14) + 26 = 18 (S). Second letter: R (17) - R (17) = 0 (A).",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE11",
      "seedId": "HTG-L03-OE11",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "Applying Vigenère decryption with key 'ORBIT' (repeated as 'ORBITORBIT') across 'GRUMEZZUML' produces 'SATELLITES'.",
      "essentialKeyPoints": [
        "Vigenère decryption formula: P_i = (C_i - K_i) mod 26.",
        "Periodic key expansion across message length."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{SATELLITES}' or 'SATELLITES'.",
        "partialCredit": "Submits lowercase 'satellites'.",
        "noCredit": "Submits Caesar shifted text."
      },
      "acceptableAlternatives": [
        "HTG{SATELLITES}",
        "SATELLITES",
        "satellites",
        "HTG{satellites}"
      ],
      "safetyNotes": "Vigenère cryptanalysis."
    }
  },
  {
    "stableId": "HTG-L03-OE12",
    "order": 22,
    "levelNumber": 3,
    "title": "Polyalphabetic Cipher Classification Definition",
    "prompt": "Unlike monoalphabetic ciphers which use a single static substitution alphabet throughout the entire message, what classical cipher classification utilizes multiple varying substitution alphabets cyclically controlled by a keyword?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing polyalphabetic).",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{polyalphabetic}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Starts with 'poly-' (many) and 'alphabetic'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE12",
      "seedId": "HTG-L03-OE12",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "A polyalphabetic cipher is any cipher based on substitution, using multiple substitution alphabets. The Vigenère cipher is the classic historical example.",
      "essentialKeyPoints": [
        "Polyalphabetic vs monoalphabetic distinction.",
        "Suppression of simple unigram frequency patterns."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{polyalphabetic}' or 'polyalphabetic'.",
        "partialCredit": "Submits 'polyalphabetic cipher'.",
        "noCredit": "Submits transposition or polygraphic."
      },
      "acceptableAlternatives": [
        "HTG{polyalphabetic}",
        "polyalphabetic",
        "POLYALPHABETIC",
        "polyalphabetic cipher",
        "poly-alphabetic",
        "HTG{polyalphabetic cipher}"
      ],
      "safetyNotes": "Cipher taxonomy."
    }
  },
  {
    "stableId": "HTG-L03-OE13",
    "order": 23,
    "levelNumber": 3,
    "title": "Tabula Recta Intersection Character Lookup",
    "prompt": "In traditional hand-ciphers, the Vigenère square (Tabula Recta) consists of 26 rows of Caesar-shifted alphabets.\n\nTo encipher a letter, the sender locates the row corresponding to the plaintext letter and the column corresponding to the key letter.\n\nWhen plaintext letter 'F' (alphabet index 5) intersects with key letter 'M' (alphabet index 12), what ciphertext character is produced at their intersection (5 + 12 mod 26)?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the single letter.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{R}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "5 + 12 = 17. The 17th letter of the alphabet (zero-indexed, where A=0) is R.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE13",
      "seedId": "HTG-L03-OE13",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "(5 + 12) mod 26 = 17, which corresponds to the letter 'R'.",
      "essentialKeyPoints": [
        "Tabula Recta matrix lookups.",
        "Modular addition representation of Vigenère."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{R}' or 'R'.",
        "partialCredit": "Submits lowercase 'r'.",
        "noCredit": "Submits incorrect letter."
      },
      "acceptableAlternatives": [
        "HTG{R}",
        "R",
        "r",
        "HTG{r}"
      ],
      "safetyNotes": "Tabula Recta operations."
    }
  },
  {
    "stableId": "HTG-L03-OE14",
    "order": 24,
    "levelNumber": 3,
    "title": "Beaufort Variant Cipher Character Transformation",
    "prompt": "The Beaufort cipher is a polyalphabetic substitution variant closely related to Vigenère, but it calculates the ciphertext character by subtracting the plaintext index from the key index:\n\nC = (K - P) mod 26 (with values adjusted modulo 26 to stay positive)\n\nGiven:\n- Plaintext character: 'W' (index 22)\n- Key character: 'D' (index 3)\n\nCalculate C = (3 - 22 + 26) mod 26 to determine the resulting Beaufort ciphertext letter.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the single letter.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{H}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "3 - 22 = -19. -19 + 26 = 7. Index 7 is letter H.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE14",
      "seedId": "HTG-L03-OE14",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "3 - 22 + 26 = 7. In zero-indexed alphabet (A=0, B=1, ...), 7 is 'H'.",
      "essentialKeyPoints": [
        "Beaufort cipher variant formula: C = (K - P) mod 26.",
        "Involutory characteristics of the Beaufort transformation."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{H}' or 'H'.",
        "partialCredit": "Submits lowercase 'h'.",
        "noCredit": "Submits Vigenère addition result."
      },
      "acceptableAlternatives": [
        "HTG{H}",
        "H",
        "h",
        "HTG{h}"
      ],
      "safetyNotes": "Beaufort variant mechanics."
    }
  },
  {
    "stableId": "HTG-L03-OE15",
    "order": 25,
    "levelNumber": 3,
    "title": "Autokey Cipher Keystream Extension Source",
    "prompt": "To eliminate the periodicity flaw caused by repeating a short keyword, Blaise de Vigenère originally invented the Autokey cipher.\n\nIn an Autokey cipher, after the initial short keyword is used for the first few characters, what text stream is immediately appended to serve as the remaining key stream?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing plaintext).",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{plaintext}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The original unencrypted message itself: plaintext.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE15",
      "seedId": "HTG-L03-OE15",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "The Autokey cipher uses the plaintext itself (or in some variants, the ciphertext) to extend the key stream once the initial primer key is exhausted.",
      "essentialKeyPoints": [
        "Autokey keystream generation mechanism.",
        "Overcoming fixed-period repetition in classical ciphers."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{plaintext}' or 'plaintext'.",
        "partialCredit": "Submits 'plain text' or 'the plaintext'.",
        "noCredit": "Submits random or ciphertext."
      },
      "acceptableAlternatives": [
        "HTG{plaintext}",
        "plaintext",
        "PLAINTEXT",
        "plain text",
        "the plaintext",
        "HTG{plain text}"
      ],
      "safetyNotes": "Autokey cipher theory."
    }
  },
  {
    "stableId": "HTG-L03-OE16",
    "order": 26,
    "levelNumber": 3,
    "title": "Vigenère Short Keyword Decryption",
    "prompt": "An emergency beacon intercept contains a 7-letter ciphertext:\n\n```text\nFMPZHZX\n```\n\nAnalysis of the transmission header reveals that the encryption key was:\n\n```text\nVECTOR\n```\n\nDecrypt the ciphertext to recover the original 7-letter technical term.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{KINETIC}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Key repeats as VECTORV. First letter: F (5) - V (21) + 26 = 10 (K). Second letter: M (12) - E (4) = 8 (I).",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE16",
      "seedId": "HTG-L03-OE16",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "'FMPZHZX' decrypted with key 'VECTORV' yields 'KINETIC'.",
      "essentialKeyPoints": [
        "Standard Vigenère decryption with key wrap-around.",
        "Modular character subtraction."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{KINETIC}' or 'KINETIC'.",
        "partialCredit": "Submits lowercase 'kinetic'.",
        "noCredit": "Submits incorrect decryption."
      },
      "acceptableAlternatives": [
        "HTG{KINETIC}",
        "KINETIC",
        "kinetic",
        "HTG{kinetic}"
      ],
      "safetyNotes": "Vigenère practical decryption."
    }
  },
  {
    "stableId": "HTG-L03-OE17",
    "order": 27,
    "levelNumber": 3,
    "title": "Running Key Cipher Long-Text Keystream Concept",
    "prompt": "When communicating parties agree to use a continuous passage from a shared book (such as a specific page of a dictionary or technical manual) rather than a short repeating keyword, the resulting Vigenère variant has no short period.\n\nWhat is the standard cryptographic terminology for this type of cipher?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing running key).",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{running key}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Two words: 'running key' (or running key cipher).",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE17",
      "seedId": "HTG-L03-OE17",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "A Running Key cipher uses a long non-repeating text stream (such as a book) as the Vigenère key, eliminating the periodic repetitions that enable Kasiski examination.",
      "essentialKeyPoints": [
        "Running key cipher structure.",
        "Elimination of periodicity while retaining natural language statistical bias."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{running key}' or 'running key'.",
        "partialCredit": "Submits 'running-key' or 'book cipher'.",
        "noCredit": "Submits One-Time Pad."
      },
      "acceptableAlternatives": [
        "HTG{running key}",
        "running key",
        "RUNNING KEY",
        "running-key",
        "running key cipher",
        "book cipher"
      ],
      "safetyNotes": "Running key cipher fundamentals."
    }
  },
  {
    "stableId": "HTG-L03-OE18",
    "order": 28,
    "levelNumber": 3,
    "title": "Polyalphabetic Letter Frequency Flattening Effect",
    "prompt": "In a monoalphabetic substitution cipher, the sharp peaks and troughs of the language letter frequency distribution remain intact.\n\nWhen a Vigenère cipher encrypts text with a diverse keyword, each plaintext letter is mapped to multiple different ciphertext letters depending on its position.\n\nWhat happens to the overall unigram frequency distribution curve of the resulting ciphertext? (It flattens out, smooths, or equalizes).\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing flattens distribution).",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{flattens distribution}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Accepts phrases like 'flattens distribution', 'flattens frequency', or 'smooths distribution'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE18",
      "seedId": "HTG-L03-OE18",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "Polyalphabetic substitution spreads high-frequency letters (like E and T) across multiple ciphertext letters, flattening the unigram frequency distribution toward uniformity.",
      "essentialKeyPoints": [
        "Frequency flattening in polyalphabetic ciphers.",
        "Why simple unigram histograms fail against Vigenère."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{flattens distribution}' or 'flattens distribution'.",
        "partialCredit": "Submits 'flattens frequency' or 'equalizes distribution'.",
        "noCredit": "Submits inverts or increases."
      },
      "acceptableAlternatives": [
        "HTG{flattens distribution}",
        "flattens distribution",
        "flattens frequency",
        "flattens the distribution",
        "smooths distribution",
        "equalizes distribution",
        "flattened distribution"
      ],
      "safetyNotes": "Frequency dispersion dynamics."
    }
  },
  {
    "stableId": "HTG-L03-OE19",
    "order": 29,
    "levelNumber": 3,
    "title": "Vigenère Coset Periodic Structure",
    "prompt": "Suppose a ciphertext was generated by a Vigenère cipher using a keyword of length L = 5.\n\nIf an analyst extracts every 5th character of the ciphertext (that is, positions 1, 6, 11, 16, 21...), all of these extracted characters were enciphered using the exact same single key letter.\n\nWhat classical monoalphabetic cipher governs each of these individual periodic slices?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (e.g. prefix HTG enclosing Caesar cipher).",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{Caesar cipher}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "A fixed shift by a single key letter is a Caesar cipher.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE19",
      "seedId": "HTG-L03-OE19",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "A Vigenère cipher with key length L is mathematically composed of L interleaved Caesar ciphers. Isolating each coset allows standard frequency analysis.",
      "essentialKeyPoints": [
        "Vigenère coset decomposition.",
        "Decomposing polyalphabetic ciphers into independent monoalphabetic streams."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{Caesar cipher}' or 'Caesar cipher'.",
        "partialCredit": "Submits 'Caesar' or 'shift cipher'.",
        "noCredit": "Submits transposition or affine."
      },
      "acceptableAlternatives": [
        "HTG{Caesar cipher}",
        "Caesar cipher",
        "caesar cipher",
        "Caesar",
        "caesar",
        "shift cipher",
        "monoalphabetic shift"
      ],
      "safetyNotes": "Periodic coset structure."
    }
  },
  {
    "stableId": "HTG-L03-OE20",
    "order": 30,
    "levelNumber": 3,
    "title": "Vigenère Key Character Derivation from Intercept Pair",
    "prompt": "In an intercepted telemetry stream encrypted with Vigenère, an analyst confirms that plaintext letter 'D' (index 3) was enciphered into ciphertext letter 'V' (index 21).\n\nUsing the relation K = (C - P) mod 26, what key letter was applied at this position?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the single letter.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "Crypto",
    "difficulty": "MEDIUM",
    "flag": "HTG{S}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "21 - 3 = 18. In 0-indexed alphabet, index 18 is 'S'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L03-OE20",
      "seedId": "HTG-L03-OE20",
      "subtopic": "Vigenère-Style Polyalphabetic Encryption & Decryption",
      "explanation": "K = (21 - 3) mod 26 = 18, which corresponds to the letter 'S'.",
      "essentialKeyPoints": [
        "Key recovery in polyalphabetic substitution.",
        "Subtracting known plaintext to expose the keystream."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{S}' or 'S'.",
        "partialCredit": "Submits lowercase 's'.",
        "noCredit": "Submits incorrect letter."
      },
      "acceptableAlternatives": [
        "HTG{S}",
        "S",
        "s",
        "HTG{s}"
      ],
      "safetyNotes": "Key reconstruction."
    }
  }
];

module.exports = subtopic2Questions;
