const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    "stableId": "HTG-L02-OE51",
    "order": 61,
    "levelNumber": 2,
    "title": "DevTools Elements Panel Live DOM Editing",
    "prompt": "Web browsers include built-in DevTools that display the active Document Object Model.\n\nBy selecting 'Edit as HTML' or modifying attributes directly, security analysts can alter disabled states, unhide hidden containers, and bypass client-side form restrictions.\n\nWhat primary panel tab in browser DevTools (Chrome, Edge, Firefox) displays and enables live editing of the page DOM tree? Submit the 1-word panel name.",
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
    "flag": "Elements",
    "hints": [
      {
        "hintIndex": 1,
        "content": "First tab in Chrome DevTools; in Firefox it is also called Inspector.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE51",
      "seedId": "HTG-L02-OE51",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "The 'Elements' panel (called 'Inspector' in Firefox) allows live inspection, styling, and structural editing of DOM nodes in real time.",
      "essentialKeyPoints": [
        "Elements panel DOM tree manipulation.",
        "Live client-side testing of UI modifications."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'Elements' or 'Inspector'.",
        "partialCredit": "Submits 'Elements panel'.",
        "noCredit": "Submits Console or Network."
      },
      "acceptableAlternatives": [
        "Elements",
        "elements",
        "Inspector",
        "inspector",
        "Elements panel"
      ],
      "safetyNotes": "DevTools UI analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE52",
    "order": 62,
    "levelNumber": 2,
    "title": "Network Panel Asynchronous Request Filter",
    "prompt": "In modern single-page applications, dynamic data exchanges occur in the background via 'fetch()' or 'XMLHttpRequest' rather than full-page reloads.\n\nIn browser DevTools Network panel, what filter button/tab isolates background API data calls from static images, stylesheets, and scripts? Submit the filter label (e.g. Fetch/XHR).\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{Fetch/XHR}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Combines 'Fetch' with 'XHR'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE52",
      "seedId": "HTG-L02-OE52",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "The 'Fetch/XHR' filter in the Network tab isolates asynchronous XMLHttpRequests and Fetch API requests, allowing testers to inspect API payloads and backend responses.",
      "essentialKeyPoints": [
        "Network tab filtering.",
        "Isolating asynchronous REST/GraphQL API traffic."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'Fetch/XHR' or 'XHR'.",
        "partialCredit": "Submits 'Fetch' or 'Fetch / XHR'.",
        "noCredit": "Submits JS, CSS, or Doc."
      },
      "acceptableAlternatives": [
        "HTG{Fetch/XHR}",
        "Fetch/XHR",
        "XHR",
        "Fetch",
        "Fetch / XHR",
        "fetch/xhr",
        "xhr"
      ],
      "safetyNotes": "Network traffic analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE53",
    "order": 63,
    "levelNumber": 2,
    "title": "HTTP Bearer Authorization Token Extraction",
    "prompt": "An authenticated API request captured in the Network panel displays the following request headers:\n\n```http\nGET /api/v1/user/telemetry HTTP/1.1\nHost: app.grid.internal\nAuthorization: Bearer jwt_auth_token_993812\nAccept: application/json\n```\n\nWhat exact credential token string follows the 'Bearer' scheme in the 'Authorization' header?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{jwt_auth_token_993812}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the token following 'Bearer '.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE53",
      "seedId": "HTG-L02-OE53",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "RFC 6750 specifies the OAuth 2.0 Bearer Token authentication scheme. Here the client sends 'jwt_auth_token_993812' in the Authorization header.",
      "essentialKeyPoints": [
        "HTTP Authorization header inspection.",
        "Bearer token authentication mechanics."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'jwt_auth_token_993812'.",
        "partialCredit": "Submits 'Bearer jwt_auth_token_993812'.",
        "noCredit": "Submits header name or host."
      },
      "acceptableAlternatives": [
        "HTG{jwt_auth_token_993812}",
        "jwt_auth_token_993812"
      ],
      "safetyNotes": "HTTP header credential auditing."
    }
  },
  {
    "stableId": "HTG-L02-OE54",
    "order": 64,
    "levelNumber": 2,
    "title": "Network JSON Response Body Field Extraction",
    "prompt": "An analyst monitors an asynchronous API query to '/api/v1/status' and views the Response tab in the Network panel:\n\n```json\n{\n  \"status\": \"ok\",\n  \"system_health\": 98.6,\n  \"master_signal_key\": \"sig_alpha_8820\"\n}\n```\n\nWhat is the string value assigned to the 'master_signal_key' field in this JSON response?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{sig_alpha_8820}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Extract the string value associated with master_signal_key.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE54",
      "seedId": "HTG-L02-OE54",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "The Network panel's Response subtab shows raw JSON responses from API endpoints. The value of 'master_signal_key' is 'sig_alpha_8820'.",
      "essentialKeyPoints": [
        "Inspecting HTTP response bodies in DevTools.",
        "Finding sensitive keys leaked in extraneous JSON attributes."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'sig_alpha_8820'.",
        "partialCredit": "Submits with quotes: '\"sig_alpha_8820\"'.",
        "noCredit": "Submits system_health or status ok."
      },
      "acceptableAlternatives": [
        "HTG{sig_alpha_8820}",
        "sig_alpha_8820"
      ],
      "safetyNotes": "API response body auditing."
    }
  },
  {
    "stableId": "HTG-L02-OE55",
    "order": 65,
    "levelNumber": 2,
    "title": "DevTools Application Tab Storage Inspector",
    "prompt": "In Chromium-based browsers (Chrome, Edge, Brave), client-side state storage is grouped under a dedicated top-level DevTools panel.\n\nThis panel provides dedicated viewers for Cookies, Local Storage, Session Storage, IndexedDB, and Web SQL.\n\nWhat is the 1-word name of this DevTools panel tab? (In Firefox this tab is called 'Storage'). Submit the Chromium panel name.",
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
    "flag": "Application",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Starts with 'App': Application.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE55",
      "seedId": "HTG-L02-OE55",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "The 'Application' panel in Chrome DevTools manages web app manifests, service workers, and all forms of client storage (cookies, local storage, indexedDB).",
      "essentialKeyPoints": [
        "DevTools Application panel utilities.",
        "Centralized client storage auditing."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'Application' or 'Storage'.",
        "partialCredit": "Submits 'Application tab'.",
        "noCredit": "Submits Elements or Sources."
      },
      "acceptableAlternatives": [
        "Application",
        "application",
        "Storage",
        "storage",
        "Application tab"
      ],
      "safetyNotes": "Client storage inspection."
    }
  },
  {
    "stableId": "HTG-L02-OE56",
    "order": 66,
    "levelNumber": 2,
    "title": "DevTools Console Selected Element Variable Shortcut",
    "prompt": "When inspecting a page in browser DevTools, clicking on any element in the Elements/Inspector tree assigns a reference to that element to a built-in console shortcut variable:\n\n`$0`\n\nIn browser DevTools, what does the shortcut '$0' refer to? Submit the 3-word phrase (e.g. currently selected element).\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{currently selected element}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Three words: currently + selected + element.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE56",
      "seedId": "HTG-L02-OE56",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "'$0' returns the most recently selected element in the Elements panel, allowing instant JavaScript interaction ('$0.value', '$0.click()') in the Console.",
      "essentialKeyPoints": [
        "DevTools console command-line API shortcuts ($0 to $4).",
        "Direct manipulation of active DOM elements."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'currently selected element'.",
        "partialCredit": "Submits 'selected element' or 'selected DOM node'.",
        "noCredit": "Submits jQuery or undefined."
      },
      "acceptableAlternatives": [
        "HTG{currently selected element}",
        "currently selected element",
        "selected element",
        "selected DOM element",
        "the currently selected element"
      ],
      "safetyNotes": "DevTools console shortcuts."
    }
  },
  {
    "stableId": "HTG-L02-OE57",
    "order": 67,
    "levelNumber": 2,
    "title": "Debugger Execution Pause Breakpoint Concept",
    "prompt": "In the DevTools Sources (Debugger) panel, an analyst clicks on line 42 of an authentication script to freeze execution right before client-side validation logic executes.\n\nWhat single-word programming term denotes this deliberate pausing place set in the debugger to halt execution and inspect variables at runtime?",
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
    "flag": "breakpoint",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Combines 'break' with 'point'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE57",
      "seedId": "HTG-L02-OE57",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "A 'breakpoint' halts JavaScript execution at a specified line, enabling inspection of scope variables, the call stack, and step-by-step code stepping.",
      "essentialKeyPoints": [
        "Client-side debugging with breakpoints.",
        "Overcoming obfuscated validation by pausing execution."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'breakpoint' or 'breakpoints'.",
        "partialCredit": "Submits 'DOM breakpoint' or 'line breakpoint'.",
        "noCredit": "Submits pause or stop."
      },
      "acceptableAlternatives": [
        "breakpoint",
        "breakpoints",
        "Breakpoint"
      ],
      "safetyNotes": "Client debugging fundamentals."
    }
  },
  {
    "stableId": "HTG-L02-OE58",
    "order": 68,
    "levelNumber": 2,
    "title": "HTTP 302 Temporary Redirection Status Code",
    "prompt": "When an unauthenticated visitor attempts to access a protected dashboard, the server responds with a redirection response header:\n\n```http\nHTTP/1.1 [STATUS_CODE] Found\nLocation: /login.html\n```\n\nWhat 3-digit integer HTTP status code represents this classic temporary redirection? Submit the 3-digit integer.",
    "type": "Numeric Answer",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "302",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The status code is explicit in the response line: 302.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE58",
      "seedId": "HTG-L02-OE58",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "HTTP 302 Found indicates that the resource resides temporarily under a different URI specified by the 'Location' header.",
      "essentialKeyPoints": [
        "HTTP redirection status codes (3xx).",
        "Inspecting redirect chains in Network panel."
      ],
      "gradingRubric": {
        "fullCredit": "Submits integer 302.",
        "partialCredit": "Submits '302 Found'.",
        "noCredit": "Submits 200, 301, or 404."
      },
      "acceptableAlternatives": [
        "302",
        "302 Found"
      ],
      "safetyNotes": "HTTP status code analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE59",
    "order": 69,
    "levelNumber": 2,
    "title": "HTTP 304 Not Modified Caching Status Code",
    "prompt": "A client issues a conditional request with 'If-None-Match'. The web server verifies that the resource has not changed and returns an empty response body with a 3xx caching code.\n\nWhat 3-digit HTTP status code denotes 'Not Modified', informing the client to reuse its cached copy? Submit the 3-digit integer.",
    "type": "Numeric Answer",
    "options": [],
    "points": 100,
    "attempts": 5,
    "required": true,
    "status": "Published",
    "isActive": true,
    "isCaseSensitive": false,
    "category": "WEB_INSPECTION",
    "difficulty": "EASY",
    "flag": "304",
    "hints": [
      {
        "hintIndex": 1,
        "content": "HTTP status code 304 stands for Not Modified.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE59",
      "seedId": "HTG-L02-OE59",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "HTTP 304 Not Modified indicates that there is no need to retransmit the resource because the client's cached copy is fresh and valid.",
      "essentialKeyPoints": [
        "HTTP 304 Not Modified caching semantics.",
        "Conditional HTTP requests with ETags."
      ],
      "gradingRubric": {
        "fullCredit": "Submits integer 304.",
        "partialCredit": "Submits '304 Not Modified'.",
        "noCredit": "Submits 200 or 302."
      },
      "acceptableAlternatives": [
        "304",
        "304 Not Modified"
      ],
      "safetyNotes": "Web caching mechanics."
    }
  },
  {
    "stableId": "HTG-L02-OE60",
    "order": 70,
    "levelNumber": 2,
    "title": "WebSocket Protocol URL Scheme",
    "prompt": "In the Network tab, an analyst filters for real-time bidirectional messaging streams.\n\nUnlike traditional HTTP which uses 'http://' or 'https://', what protocol scheme prefix is used for standard unencrypted WebSockets connections? (Submit with or without '://').",
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
    "flag": "ws://",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Two letters: 'w' and 's' (for WebSocket).",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE60",
      "seedId": "HTG-L02-OE60",
      "subtopic": "Browser Developer Tools & Network Inspection",
      "explanation": "RFC 6455 establishes the 'ws' URI scheme for unencrypted WebSocket communication and 'wss' for TLS-encrypted WebSocket connections.",
      "essentialKeyPoints": [
        "WebSocket protocol URI schemes (ws:// and wss://).",
        "Inspecting WebSocket frames in DevTools Network panel."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'ws://' or 'ws'.",
        "partialCredit": "Submits encrypted 'wss://' or 'wss'.",
        "noCredit": "Submits http:// or tcp://."
      },
      "acceptableAlternatives": [
        "ws://",
        "ws",
        "wss://",
        "wss",
        "WS://"
      ],
      "safetyNotes": "WebSocket protocol analysis."
    }
  }
];

module.exports = subtopic6Questions;
