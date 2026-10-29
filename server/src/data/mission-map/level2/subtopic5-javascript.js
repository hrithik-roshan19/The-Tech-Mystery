const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic5Questions = [
  {
    "stableId": "HTG-L02-OE41",
    "order": 51,
    "levelNumber": 2,
    "title": "Global Window Configuration Object Inspection",
    "prompt": "An enterprise single-page application bootstraps by populating global configuration variables on the browser 'window' object:\n\n```javascript\nwindow.__APP_CONFIG__ = {\n  env: \"production\",\n  adminEndpoint: \"/api/v2/admin_panel_88\",\n  telemetryInterval: 5000\n};\n```\n\nWhat URL path is assigned to the 'adminEndpoint' property inside 'window.__APP_CONFIG__'?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "HTG{/api/v2/admin_panel_88}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the value of adminEndpoint starting with '/api/v2/'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE41",
      "seedId": "HTG-L02-OE41",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "Global window variables are immediately accessible in the browser console. Inspecting window configuration objects frequently reveals private routes and API keys.",
      "essentialKeyPoints": [
        "Global window namespace exposure.",
        "Single-page application configuration inspection."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '/api/v2/admin_panel_88'.",
        "partialCredit": "Submits 'admin_panel_88'.",
        "noCredit": "Submits environment name or interval."
      },
      "acceptableAlternatives": [
        "HTG{/api/v2/admin_panel_88}",
        "/api/v2/admin_panel_88",
        "api/v2/admin_panel_88"
      ],
      "safetyNotes": "Client-side state inspection."
    }
  },
  {
    "stableId": "HTG-L02-OE42",
    "order": 52,
    "levelNumber": 2,
    "title": "Client-Side Validation Bypass Architecture Requirement",
    "prompt": "A web form validates inputs using HTML attributes:\n\n```html\n<input type=\"text\" id=\"pin\" required maxlength=\"4\" pattern=\"^[0-9]{4}$\">\n```\n\nAn attacker opens browser DevTools, removes 'required', 'maxlength', and 'pattern', and submits arbitrary string data directly to the server.\n\nBecause client-side validation can always be modified or bypassed, what system tier must ALWAYS perform authoritative validation of all incoming data? Submit the 2-word tier (e.g. ...-side).",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "server-side",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Two words: 'server' + '-side'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE42",
      "seedId": "HTG-L02-OE42",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "Client-side validation is solely for user convenience. Authoritative security boundaries require robust server-side validation on every input.",
      "essentialKeyPoints": [
        "Never trust client-side validation.",
        "Server-side enforcement is mandatory."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'server-side' or 'server side'.",
        "partialCredit": "Submits 'server' or 'backend'.",
        "noCredit": "Submits 'client-side' or 'frontend'."
      },
      "acceptableAlternatives": [
        "server-side",
        "server side",
        "server",
        "backend"
      ],
      "safetyNotes": "Secure architecture baseline."
    }
  },
  {
    "stableId": "HTG-L02-OE43",
    "order": 53,
    "levelNumber": 2,
    "title": "Browser LocalStorage Token Retrieval Value",
    "prompt": "An authentication script persists a session token in browser storage:\n\n```javascript\nlocalStorage.setItem('auth_debug_token', 'tok_local_9918');\n```\n\nWhen executing 'localStorage.getItem(\"auth_debug_token\")' in the browser console, what exact string value is returned?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "HTG{tok_local_9918}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Look at the second parameter passed to setItem.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE43",
      "seedId": "HTG-L02-OE43",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "LocalStorage stores persistent key-value string pairs. 'localStorage.getItem(\"auth_debug_token\")' returns 'tok_local_9918'.",
      "essentialKeyPoints": [
        "LocalStorage API access.",
        "LocalStorage is vulnerable to XSS and lacks HttpOnly protection."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'tok_local_9918'.",
        "partialCredit": "Submits with quotes: '\"tok_local_9918\"'.",
        "noCredit": "Submits the key name 'auth_debug_token'."
      },
      "acceptableAlternatives": [
        "HTG{tok_local_9918}",
        "tok_local_9918"
      ],
      "safetyNotes": "Web storage security analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE44",
    "order": 54,
    "levelNumber": 2,
    "title": "Hardcoded Client-Side Password Comparison Extraction",
    "prompt": "A client-side authentication gate evaluates user input using inline JavaScript:\n\n```javascript\nfunction verifyAccess(input) {\n  if (input === \"SuperSecretAdminPass2026\") {\n    grantAccess();\n  }\n}\n```\n\nWhat exact hardcoded password string satisfies this client-side equality check?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": true,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "HTG{SuperSecretAdminPass2026}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the exact string compared against input inside the if condition.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE44",
      "seedId": "HTG-L02-OE44",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "Hardcoded credentials in client scripts are completely visible to end users. Here the password is 'SuperSecretAdminPass2026'.",
      "essentialKeyPoints": [
        "Insecure client-side password verification.",
        "Hardcoded credentials in JavaScript source."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'SuperSecretAdminPass2026' (case-sensitive).",
        "partialCredit": "Submits with quotes.",
        "noCredit": "Submits function names."
      },
      "acceptableAlternatives": [
        "HTG{SuperSecretAdminPass2026}",
        "SuperSecretAdminPass2026"
      ],
      "safetyNotes": "Credential disclosure vulnerability."
    }
  },
  {
    "stableId": "HTG-L02-OE45",
    "order": 55,
    "levelNumber": 2,
    "title": "Console Log Output String Extraction",
    "prompt": "A web application startup script executes diagnostic logging:\n\n```javascript\nconsole.log(\"Telemetry initialization key:\", \"telemetry_boot_key_77\");\n```\n\nWhat key string value is printed to the browser DevTools console as the second argument?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "HTG{telemetry_boot_key_77}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the string in the second argument of console.log.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE45",
      "seedId": "HTG-L02-OE45",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "console.log statements left in production code emit sensitive internal data directly to the browser console. The key is 'telemetry_boot_key_77'.",
      "essentialKeyPoints": [
        "Console logging information leakage.",
        "Monitoring browser console during web testing."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'telemetry_boot_key_77'.",
        "partialCredit": "Submits with quotes.",
        "noCredit": "Submits first argument 'Telemetry initialization key:'."
      },
      "acceptableAlternatives": [
        "HTG{telemetry_boot_key_77}",
        "telemetry_boot_key_77"
      ],
      "safetyNotes": "Console log auditing."
    }
  },
  {
    "stableId": "HTG-L02-OE46",
    "order": 56,
    "levelNumber": 2,
    "title": "JavaScript Hexadecimal Character Escape Decoding",
    "prompt": "An obfuscated variable assignment in an event handler uses hexadecimal character escapes:\n\n```javascript\nconst secretWord = \"\\x47\\x52\\x49\\x44\";\n```\n\nConvert this 4-byte hexadecimal escape sequence into its ASCII text word.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "GRID",
    "hints": [
      {
        "hintIndex": 1,
        "content": "\\x47='G', \\x52='R', \\x49='I', \\x44='D'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE46",
      "seedId": "HTG-L02-OE46",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "\\xHH represents a character with hexadecimal ASCII code HH. 0x47='G', 0x52='R', 0x49='I', 0x44='D'. Word: 'GRID'.",
      "essentialKeyPoints": [
        "Hexadecimal string literal escapes in JavaScript.",
        "Deobfuscating client-side string arrays."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'GRID'.",
        "partialCredit": "Submits lowercase 'grid'.",
        "noCredit": "Submits incorrect word."
      },
      "acceptableAlternatives": [
        "GRID",
        "grid",
        "Grid"
      ],
      "safetyNotes": "String literal deobfuscation."
    }
  },
  {
    "stableId": "HTG-L02-OE47",
    "order": 57,
    "levelNumber": 2,
    "title": "Function Source Code Decompilation Method",
    "prompt": "In the browser JavaScript runtime, calling a specific built-in method on a custom function (e.g. 'calculateHash.toString()') returns the complete original source code of that function as a string.\n\nWhat built-in JavaScript method name (without parentheses) decompiles an object or function into its string representation? Submit the method name.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "HTG{toString}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "CamelCase method: 'to' + 'String'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE47",
      "seedId": "HTG-L02-OE47",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "'Function.prototype.toString()' returns a string representing the source code of the function. In DevTools, typing 'funcName.toString()' prints its logic.",
      "essentialKeyPoints": [
        "Function decompilation via toString().",
        "Inspecting closures and event handler logic."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'toString'.",
        "partialCredit": "Submits 'toString()' or 'tostring'.",
        "noCredit": "Submits valueOf or toJSON."
      },
      "acceptableAlternatives": [
        "HTG{toString}",
        "toString",
        "toString()",
        "tostring"
      ],
      "safetyNotes": "Runtime inspection techniques."
    }
  },
  {
    "stableId": "HTG-L02-OE48",
    "order": 58,
    "levelNumber": 2,
    "title": "Double Click DOM Event Listener Type",
    "prompt": "A hidden trigger is attached to an administrative icon:\n\n```javascript\ndocument.getElementById(\"auth-icon\").addEventListener(\"dblclick\", launchTerminal);\n```\n\nWhat standard DOM event type name (the first argument to 'addEventListener') triggers 'launchTerminal' upon two rapid mouse clicks? Submit the event name.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "HTG{dblclick}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The event name abbreviates 'double' to 'dbl': dblclick.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE48",
      "seedId": "HTG-L02-OE48",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "The 'dblclick' event fires when a pointing device button is clicked twice on a single element. Developers often attach easter eggs to double-click events.",
      "essentialKeyPoints": [
        "DOM event listeners discovery.",
        "Event listener inspection in DevTools Elements tab (Event Listeners pane)."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'dblclick'.",
        "partialCredit": "Submits 'doubleclick' or 'double click'.",
        "noCredit": "Submits 'click'."
      },
      "acceptableAlternatives": [
        "HTG{dblclick}",
        "dblclick",
        "doubleclick",
        "double click"
      ],
      "safetyNotes": "Event listener reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE49",
    "order": 59,
    "levelNumber": 2,
    "title": "Browser Session Storage Lifetime Scope",
    "prompt": "Web applications use two primary client-side key-value storage mechanisms:\n- 'localStorage' persists data permanently across browser restarts until explicitly cleared.\n- Another Web Storage API stores data strictly for the duration of the current page session, automatically purging all keys when the browser tab is closed.\n\nWhat is the JavaScript object name for this tab-scoped session storage mechanism? Submit the object name.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "sessionStorage",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Combines 'session' with 'Storage' in camelCase.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE49",
      "seedId": "HTG-L02-OE49",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "'window.sessionStorage' maintains a separate storage area for each given origin that is available for the duration of the page session (as long as the browser tab remains open).",
      "essentialKeyPoints": [
        "sessionStorage vs localStorage lifecycle.",
        "Tab-scoped ephemeral storage inspection."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'sessionStorage'.",
        "partialCredit": "Submits 'session storage' or 'window.sessionStorage'.",
        "noCredit": "Submits 'cookies' or 'localStorage'."
      },
      "acceptableAlternatives": [
        "sessionStorage",
        "session storage",
        "window.sessionStorage",
        "SESSIONSTORAGE"
      ],
      "safetyNotes": "Web storage lifecycle analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE50",
    "order": 60,
    "levelNumber": 2,
    "title": "JavaScript Unicode Character Escape Decoding",
    "prompt": "An obfuscated token string uses 4-digit Unicode hexadecimal escape sequences:\n\n```javascript\nconst prefix = \"\\u0048\\u0054\\u0047\";\n```\n\nConvert this 3-character Unicode escape sequence into its plaintext ASCII acronym.",
    "type": "Short Text",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "HTG",
    "hints": [
      {
        "hintIndex": 1,
        "content": "\\u0048 is 0x48 ('H'), \\u0054 is 0x54 ('T'), \\u0047 is 0x47 ('G').",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE50",
      "seedId": "HTG-L02-OE50",
      "subtopic": "JavaScript Variables, State & Client-Side Validation",
      "explanation": "\\uXXXX denotes a UTF-16 code unit in hexadecimal. 0x48='H', 0x54='T', 0x47='G'. The acronym is 'HTG'.",
      "essentialKeyPoints": [
        "Unicode character escapes in JavaScript.",
        "Translating encoded string identifiers."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG'.",
        "partialCredit": "Submits lowercase 'htg'.",
        "noCredit": "Submits incorrect letters."
      },
      "acceptableAlternatives": [
        "HTG",
        "htg"
      ],
      "safetyNotes": "Unicode escape decoding."
    }
  }
];

module.exports = subtopic5Questions;
