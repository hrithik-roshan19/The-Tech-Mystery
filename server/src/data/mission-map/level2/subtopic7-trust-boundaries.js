const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic7Questions = [
  {
    "stableId": "HTG-L02-OE61",
    "order": 71,
    "levelNumber": 2,
    "title": "CSS Concealment as an Authorization Boundary",
    "prompt": "An enterprise web portal hides an 'Administrative Controls' menu item by applying 'style=\"display: none;\"' whenever a regular non-admin user logs in.\n\nBecause the client device is fully controlled by the user (who can inspect, modify, or override any local CSS or DOM structure), can hiding client-side elements with CSS ever be considered an effective authorization boundary? Submit 'yes' or 'no'.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{no}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "CSS affects rendering only; users can unhide any element via DevTools.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE61",
      "seedId": "HTG-L02-OE61",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "Client-side hiding provides UI customization, not security. Authorization boundaries can only be enforced by backend servers controlling data and actions.",
      "essentialKeyPoints": [
        "Client-side UI is under user control.",
        "Security through obscurity in CSS is completely ineffective."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'no'.",
        "partialCredit": "Submits 'false'.",
        "noCredit": "Submits 'yes'."
      },
      "acceptableAlternatives": [
        "HTG{no}",
        "no",
        "NO",
        "false",
        "False"
      ],
      "safetyNotes": "Core web authorization principle."
    }
  },
  {
    "stableId": "HTG-L02-OE62",
    "order": 72,
    "levelNumber": 2,
    "title": "Disabled Attribute Removal Authorization Flaw",
    "prompt": "A financial app disables a transfer button for unauthorized users:\n\n```html\n<button id=\"transfer-funds\" disabled>Transfer Funds</button>\n```\n\nA user opens DevTools, removes the 'disabled' attribute, and clicks the button. The browser sends 'POST /api/v1/transfer', and the backend executes the transfer without checking permissions.\n\nWhat fundamental OWASP Top 10 category flaw is present on the backend API server? Submit the category name (e.g. Broken Access Control).\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{Broken Access Control}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "OWASP category A01: Broken Access Control.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE62",
      "seedId": "HTG-L02-OE62",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "Disabling a button in the UI is not security. Failing to enforce permissions on the server endpoint is 'Broken Access Control' (OWASP A01).",
      "essentialKeyPoints": [
        "OWASP Top 10 Broken Access Control.",
        "Server-side authorization enforcement is mandatory."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'Broken Access Control'.",
        "partialCredit": "Submits 'broken access control' or 'missing authorization'.",
        "noCredit": "Submits injection or XSS."
      },
      "acceptableAlternatives": [
        "HTG{Broken Access Control}",
        "Broken Access Control",
        "broken access control",
        "missing authorization",
        "broken authorization",
        "Missing Authorization"
      ],
      "safetyNotes": "OWASP access control principles."
    }
  },
  {
    "stableId": "HTG-L02-OE63",
    "order": 73,
    "levelNumber": 2,
    "title": "Hidden Form Parameter Tampering Vulnerability",
    "prompt": "An eCommerce checkout page passes the product price in a hidden form field:\n\n```html\n<form action=\"/checkout\" method=\"POST\">\n  <input type=\"hidden\" name=\"price\" value=\"199.99\">\n  <button type=\"submit\">Purchase</button>\n</form>\n```\n\nA buyer modifies the DOM value from '199.99' to '0.01' and completes the purchase.\n\nWhat two-word security term describes the manipulation of client-controlled parameters sent in HTTP requests?",
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
    "flag": "parameter tampering",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Two words: parameter + tampering.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE63",
      "seedId": "HTG-L02-OE63",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "'Parameter tampering' occurs when an application relies on client-supplied data without authoritative server-side validation or recalculation.",
      "essentialKeyPoints": [
        "Parameter tampering mechanics.",
        "Prices and privileges must always be looked up server-side."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'parameter tampering'.",
        "partialCredit": "Submits 'price tampering' or 'form tampering'.",
        "noCredit": "Submits SQL injection or CSRF."
      },
      "acceptableAlternatives": [
        "parameter tampering",
        "Parameter Tampering",
        "price tampering",
        "form tampering"
      ],
      "safetyNotes": "Input integrity and pricing analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE64",
    "order": 74,
    "levelNumber": 2,
    "title": "Client-Side Role Storage Trust Violation",
    "prompt": "A single-page application checks user privileges as follows:\n\n```javascript\nconst profile = JSON.parse(localStorage.getItem('user_profile'));\nif (profile && profile.role === 'admin') {\n  renderAdminTools();\n}\n```\n\nA regular user opens the browser console and runs 'localStorage.setItem(\"user_profile\", JSON.stringify({role: \"admin\"}))', instantly revealing the admin controls.\n\nWhat core software security maxim was violated by basing authorization on client-stored data? Submit the principle (e.g. never trust client data).\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{never trust client data}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Fundamental rule: never trust client data / never trust user input.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE64",
      "seedId": "HTG-L02-OE64",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "'Never trust client data' is a foundational tenet of application security. Any state stored in LocalStorage is fully controllable by the client.",
      "essentialKeyPoints": [
        "Insecure client-side authorization state.",
        "Role checks must occur on the server."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'never trust client data' or 'never trust user input'.",
        "partialCredit": "Submits 'do not trust client' or 'client-side authorization flaw'.",
        "noCredit": "Submits incorrect principle."
      },
      "acceptableAlternatives": [
        "HTG{never trust client data}",
        "never trust client data",
        "never trust user input",
        "do not trust client data",
        "do not trust client",
        "Never Trust Client Data"
      ],
      "safetyNotes": "Client trust boundary violation."
    }
  },
  {
    "stableId": "HTG-L02-OE65",
    "order": 75,
    "levelNumber": 2,
    "title": "JSON Web Token Signature Integrity Verification",
    "prompt": "A web application stores an access token in the format 'header.payload.signature'.\n\nA frontend script decodes the payload using 'JSON.parse(atob(token.split(\".\")[1]))' to read the user's role.\n\nTo guarantee that the claims inside the payload have not been tampered with or modified by the user, what 1-word cryptographic component of the JWT must the backend server verify? Submit the component name.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{signature}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The third part of a JWT: header.payload.[?].",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE65",
      "seedId": "HTG-L02-OE65",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "A JWT's payload is only Base64Url-encoded, not encrypted or tamper-proof on its own. The cryptographic 'signature' (verified using HMAC or RSA) guarantees integrity.",
      "essentialKeyPoints": [
        "JWT tripartite structure: header, payload, signature.",
        "Server-side cryptographic signature verification."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'signature'.",
        "partialCredit": "Submits 'JWT signature'.",
        "noCredit": "Submits header or payload."
      },
      "acceptableAlternatives": [
        "HTG{signature}",
        "signature",
        "Signature",
        "JWT signature",
        "the signature"
      ],
      "safetyNotes": "JWT integrity analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE66",
    "order": 76,
    "levelNumber": 2,
    "title": "Frontend Route Guards Backend Data Exposure",
    "prompt": "A React single-page application protects sensitive views using client-side route guards:\n\n```javascript\n<ProtectedRoute path=\"/admin\" component={AdminDashboard} />\n```\n\nIf a user bypasses the React router and directly queries the backend API ('GET /api/v1/admin/data') which lacks server-side session checks, does the client-side ProtectedRoute guard protect the server data? Submit 'yes' or 'no'.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{no}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Route guards control UI rendering only; they cannot protect HTTP API endpoints.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE66",
      "seedId": "HTG-L02-OE66",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "Client-side route guards prevent navigation within the browser UI. They provide zero protection for underlying HTTP REST endpoints.",
      "essentialKeyPoints": [
        "Client route guards vs API authorization.",
        "Direct API querying bypasses all client routers."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'no'.",
        "partialCredit": "Submits 'false'.",
        "noCredit": "Submits 'yes'."
      },
      "acceptableAlternatives": [
        "HTG{no}",
        "no",
        "NO",
        "false",
        "False"
      ],
      "safetyNotes": "SPA routing security."
    }
  },
  {
    "stableId": "HTG-L02-OE67",
    "order": 77,
    "levelNumber": 2,
    "title": "Client-Side Secret Key Exposure Restriction",
    "prompt": "In web development, cloud services and payment gateways issue paired credentials: a publishable public key and a secret private key.\n\nWhich type of API key ('public' or 'secret') must NEVER be embedded inside client-side JavaScript source bundles? Submit the 1-word key type.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{secret}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The opposite of public: secret (or private).",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE67",
      "seedId": "HTG-L02-OE67",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "Secret API keys (e.g. AWS access secret, Stripe secret key) confer full administrative access and must only reside on secure backend servers.",
      "essentialKeyPoints": [
        "Secret key leakage in frontend assets.",
        "Public vs private API key architectures."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'secret' or 'private'.",
        "partialCredit": "Submits 'secret key' or 'private key'.",
        "noCredit": "Submits 'public'."
      },
      "acceptableAlternatives": [
        "HTG{secret}",
        "secret",
        "SECRET",
        "private",
        "secret key",
        "private key"
      ],
      "safetyNotes": "API credential safety."
    }
  },
  {
    "stableId": "HTG-L02-OE68",
    "order": 78,
    "levelNumber": 2,
    "title": "Cosmetic Client-Side Access Denied Evaluation",
    "prompt": "A tester visits an internal URL. The web page renders a pop-up modal stating \"Access Denied: Insufficient Clearance\".\n\nHowever, inspecting the browser DevTools Network tab reveals that the background request 'GET /api/v1/confidential' returned HTTP 200 OK with the complete data payload in the response body.\n\nIn this scenario, is the access restriction genuine server-side security, or is it merely a 'cosmetic' client-side indicator? Submit 'cosmetic' or 'genuine'.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{cosmetic}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Because the data was already transmitted to the client, the modal is merely cosmetic.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE68",
      "seedId": "HTG-L02-OE68",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "If the backend returns data with status 200, the data has already crossed the network boundary. A client modal claiming 'Access Denied' is purely cosmetic.",
      "essentialKeyPoints": [
        "Misleading client-side indicators.",
        "Verifying true authorization state via raw HTTP responses."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'cosmetic'.",
        "partialCredit": "Submits 'client-side' or 'false security'.",
        "noCredit": "Submits 'genuine'."
      },
      "acceptableAlternatives": [
        "HTG{cosmetic}",
        "cosmetic",
        "COSMETIC",
        "client-side",
        "insecure"
      ],
      "safetyNotes": "UI deception vs API reality."
    }
  },
  {
    "stableId": "HTG-L02-OE69",
    "order": 79,
    "levelNumber": 2,
    "title": "Principle of Least Privilege in Client Data Delivery",
    "prompt": "An API endpoint '/api/v1/user' queries the database and sends the entire user row to the frontend:\n\n```json\n{\n  \"id\": 4,\n  \"username\": \"analyst1\",\n  \"password_hash\": \"$2b$12$...\",\n  \"internal_notes\": \"VIP customer\"\n}\n```\n\nThe frontend component only displays 'analyst1'.\n\nWhat fundamental cybersecurity design principle states that applications should share only the minimum necessary information required for a component to perform its function? Submit the 2-word or 4-word principle (e.g. Least Privilege).\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{Least Privilege}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Principle of 'Least Privilege' (or minimal data exposure).",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE69",
      "seedId": "HTG-L02-OE69",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "The 'Principle of Least Privilege' (and data minimization) requires limiting access and data exposure to strictly what is necessary. Over-fetching exposes hashes and private notes.",
      "essentialKeyPoints": [
        "Principle of Least Privilege.",
        "Data minimization in REST API serialization (preventing mass assignment / over-exposure)."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'Least Privilege' or 'Principle of Least Privilege'.",
        "partialCredit": "Submits 'data minimization'.",
        "noCredit": "Submits defense in depth or fail-safe defaults."
      },
      "acceptableAlternatives": [
        "HTG{Least Privilege}",
        "Least Privilege",
        "least privilege",
        "Principle of Least Privilege",
        "principle of least privilege",
        "data minimization"
      ],
      "safetyNotes": "Security design principle."
    }
  },
  {
    "stableId": "HTG-L02-OE70",
    "order": 80,
    "levelNumber": 2,
    "title": "Hidden in Plain Sight Capstone Flag Synthesis",
    "prompt": "A comprehensive client-side security audit across a synthetic challenge portal recovers two hidden indicators:\n\nIndicator 1: A hidden DOM span element contains text:\n`DOM`\n\nIndicator 2: A custom data attribute on the document body:\n`data-action=\"INSPECT\"`\n\nFollowing standard tournament rules, format these two indicators separated by an underscore into the official flag structure with namespace prefix HTG and enclosing curly braces '{' and '}'.\n\nCombine Indicator 1 and Indicator 2 to generate the final Level 2 completion flag.",
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
    "flag": "HTG{DOM_INSPECT}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Indicator 1 is DOM, Indicator 2 is INSPECT. Format with HTG prefix and curly braces.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE70",
      "seedId": "HTG-L02-OE70",
      "subtopic": "Client-Side vs Server-Side Trust & Authorization Boundaries",
      "explanation": "Combining Indicator 1 ('DOM') and Indicator 2 ('INSPECT') into the canonical template 'HTG{<IND1>_<IND2>}' produces 'HTG{DOM_INSPECT}'.",
      "essentialKeyPoints": [
        "Synthesizing multiple client-side indicators.",
        "Capstone flag generation for Level 2."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{DOM_INSPECT}'.",
        "partialCredit": "Submits lowercase 'HTG{dom_inspect}' or 'DOM_INSPECT'.",
        "noCredit": "Submits unformatted tokens."
      },
      "acceptableAlternatives": [
        "HTG{DOM_INSPECT}",
        "htg{dom_inspect}",
        "HTG{dom_inspect}",
        "DOM_INSPECT"
      ],
      "safetyNotes": "Capstone synthesis drill."
    }
  }
];

module.exports = subtopic7Questions;
