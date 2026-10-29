const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    "stableId": "HTG-L02-OE31",
    "order": 41,
    "levelNumber": 2,
    "title": "Developer Staging Endpoint Comment Extraction",
    "prompt": "An analyst audits the HTML source of a staging portal and discovers a developer comment:\n\n```html\n<!-- TODO: remove staging endpoint before production: /stage/internal_auth -->\n```\n\nWhat internal endpoint path was left documented in this developer TODO comment?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{/stage/internal_auth}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Look at the path beginning with '/' after the colon.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE31",
      "seedId": "HTG-L02-OE31",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "Developers frequently leave sensitive administrative paths, temporary debug routes, or architectural notes in HTML comments. Here the path is '/stage/internal_auth'.",
      "essentialKeyPoints": [
        "Information disclosure via HTML comments.",
        "Identifying non-public API routes through static source analysis."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '/stage/internal_auth'.",
        "partialCredit": "Submits 'internal_auth'.",
        "noCredit": "Submits 'TODO' or unrelated text."
      },
      "acceptableAlternatives": [
        "HTG{/stage/internal_auth}",
        "/stage/internal_auth",
        "stage/internal_auth"
      ],
      "safetyNotes": "Comment-based reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE32",
    "order": 42,
    "levelNumber": 2,
    "title": "HTML Comment Closing Delimiter Syntax",
    "prompt": "In standard HTML and XML documents, comments begin with the 4-character opening delimiter '<!--'.\n\nWhat exact 3-character delimiter string terminates an HTML comment block? Submit the 3 characters.",
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
    "flag": "-->",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Two hyphens followed by a greater-than angle bracket.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE32",
      "seedId": "HTG-L02-OE32",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "HTML comments are delimited by '<!--' at the start and '-->' at the end. Everything between these markers is ignored by the HTML parser.",
      "essentialKeyPoints": [
        "HTML comment delimiter syntax.",
        "Closing delimiter is exactly '-->'."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '-->'.",
        "partialCredit": "Submits '--->'.",
        "noCredit": "Submits '//' or '/*'."
      },
      "acceptableAlternatives": [
        "-->",
        "->"
      ],
      "safetyNotes": "HTML syntax specifications."
    }
  },
  {
    "stableId": "HTG-L02-OE33",
    "order": 43,
    "levelNumber": 2,
    "title": "JavaScript Source Map Directive Extraction",
    "prompt": "The final line of a production minified bundle 'app.min.js' contains a source map pragma:\n\n```javascript\n//# sourceMappingURL=bundle.min.js.map\n```\n\nWhat filename is specified as the external source map target in this directive?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{bundle.min.js.map}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the exact filename after 'sourceMappingURL='.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE33",
      "seedId": "HTG-L02-OE33",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "The 'sourceMappingURL' directive tells browser DevTools where to download the source map file, which maps minified code back to original unminified source code.",
      "essentialKeyPoints": [
        "Source map directive recognition.",
        "Source maps enable recovering full original TypeScript/JavaScript source trees."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'bundle.min.js.map'.",
        "partialCredit": "Submits 'bundle.min.js'.",
        "noCredit": "Submits pragma prefix 'sourceMappingURL'."
      },
      "acceptableAlternatives": [
        "HTG{bundle.min.js.map}",
        "bundle.min.js.map"
      ],
      "safetyNotes": "Source map discovery in web reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE34",
    "order": 44,
    "levelNumber": 2,
    "title": "Inline Script Commented Token Extraction",
    "prompt": "A script tag inside an authenticated administrative view contains commented-out initialization code:\n\n```html\n<script>\n  const config = { api: \"/v1/telemetry\" };\n  // debug_override_token = \"dbg_9901_alpha\";\n  initApp(config);\n</script>\n```\n\nWhat exact string token is assigned inside the quotes on the commented-out 'debug_override_token' line?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{dbg_9901_alpha}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the string between the quotation marks in the comment.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE34",
      "seedId": "HTG-L02-OE34",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "Developers often comment out hardcoded debug tokens during testing. JavaScript comments ('//') within script tags remain completely exposed in client-side HTML.",
      "essentialKeyPoints": [
        "JavaScript comments in inline scripts.",
        "Leaked debug credentials."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'dbg_9901_alpha'.",
        "partialCredit": "Submits with quotes: '\"dbg_9901_alpha\"'.",
        "noCredit": "Submits variable name or config path."
      },
      "acceptableAlternatives": [
        "HTG{dbg_9901_alpha}",
        "dbg_9901_alpha"
      ],
      "safetyNotes": "Script inspection analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE35",
    "order": 45,
    "levelNumber": 2,
    "title": "Webpack Chunk Magic Comment Name Extraction",
    "prompt": "An application bundle utilizes dynamic imports with Webpack magic comments:\n\n```javascript\nconst AdminView = () => import(/* webpackChunkName: \"admin-analytics\" */ './views/AdminAnalytics.js');\n```\n\nWhat chunk name is specified inside the 'webpackChunkName' comment?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{admin-analytics}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Extract the value inside webpackChunkName: \"...\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE35",
      "seedId": "HTG-L02-OE35",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "Webpack magic comments name dynamically split script chunks. The chunk name 'admin-analytics' reveals the existence of an admin chunk file ('admin-analytics.chunk.js').",
      "essentialKeyPoints": [
        "Webpack magic comments in code-split bundles.",
        "Discovering hidden module bundles through bundle naming patterns."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'admin-analytics'.",
        "partialCredit": "Submits 'admin-analytics.js'.",
        "noCredit": "Submits file path './views/AdminAnalytics.js'."
      },
      "acceptableAlternatives": [
        "HTG{admin-analytics}",
        "admin-analytics"
      ],
      "safetyNotes": "Build artifact reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE36",
    "order": 46,
    "levelNumber": 2,
    "title": "Multiline HTML Comment Base64 Flag Decoding",
    "prompt": "A multiline HTML comment block in a challenge page preserves a Base64-encoded string:\n\n```html\n<!--\n  STAGING_VERIFICATION_PAYLOAD:\n  SFRHe2NvbW1lbnRfYXVkaXR9\n-->\n```\n\nDecode this Base64 payload to retrieve the complete competition flag string.",
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
    "flag": "HTG{comment_audit}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Base64-decode the string 'SFRHe2NvbW1lbnRfYXVkaXR9'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE36",
      "seedId": "HTG-L02-OE36",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "Base64 decoding 'SFRHe2NvbW1lbnRfYXVkaXR9' yields the flag 'HTG{comment_audit}'.",
      "essentialKeyPoints": [
        "Multiline comment inspection.",
        "Base64 payloads embedded in HTML comments."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{comment_audit}'.",
        "partialCredit": "Submits 'comment_audit'.",
        "noCredit": "Submits unencoded base64 string."
      },
      "acceptableAlternatives": [
        "HTG{comment_audit}",
        "htg{comment_audit}"
      ],
      "safetyNotes": "Comment payload decoding drill."
    }
  },
  {
    "stableId": "HTG-L02-OE37",
    "order": 47,
    "levelNumber": 2,
    "title": "SVG Graphic XML Comment Key Extraction",
    "prompt": "An inline SVG vector badge embedded in a page template includes an XML metadata comment:\n\n```xml\n<svg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\">\n  <!-- SVG_CREATOR_KEY: vector_glyph_42 -->\n  <circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#00FF88\"/>\n</svg>\n```\n\nWhat key string is recorded after 'SVG_CREATOR_KEY:' inside this SVG comment?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{vector_glyph_42}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Extract the token 'vector_glyph_42'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE37",
      "seedId": "HTG-L02-OE37",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "SVG is an XML-based format. Comments embedded in SVG elements remain readable in the DOM and often leak tool signatures or design keys.",
      "essentialKeyPoints": [
        "XML comments in inline SVGs.",
        "DOM exploration beyond standard HTML div/span tags."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'vector_glyph_42'.",
        "partialCredit": "Submits with label: 'SVG_CREATOR_KEY: vector_glyph_42'.",
        "noCredit": "Submits fill color or circle attributes."
      },
      "acceptableAlternatives": [
        "HTG{vector_glyph_42}",
        "vector_glyph_42"
      ],
      "safetyNotes": "SVG DOM inspection."
    }
  },
  {
    "stableId": "HTG-L02-OE38",
    "order": 48,
    "levelNumber": 2,
    "title": "Deprecated API Endpoint Route Discovery",
    "prompt": "An HTML comment left in an account settings page documents a legacy decommission plan:\n\n```html\n<!-- DEPRECATED: /api/v0/unauthenticated_export is slated for decommissioning in Q3 -->\n```\n\nWhat deprecated API endpoint path is revealed in this comment?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{/api/v0/unauthenticated_export}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the full path starting with '/api/v0/'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE38",
      "seedId": "HTG-L02-OE38",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "Legacy API routes described in comments often remain active on backend servers even after frontend links are removed, creating unauthenticated attack surfaces.",
      "essentialKeyPoints": [
        "Shadow and deprecated API discovery.",
        "Comments revealing unauthenticated endpoints."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '/api/v0/unauthenticated_export'.",
        "partialCredit": "Submits 'unauthenticated_export'.",
        "noCredit": "Submits 'Q3' or 'DEPRECATED'."
      },
      "acceptableAlternatives": [
        "HTG{/api/v0/unauthenticated_export}",
        "/api/v0/unauthenticated_export",
        "api/v0/unauthenticated_export"
      ],
      "safetyNotes": "Legacy endpoint discovery."
    }
  },
  {
    "stableId": "HTG-L02-OE39",
    "order": 49,
    "levelNumber": 2,
    "title": "Feature Flag State Value Extraction",
    "prompt": "An administrative template comments out an experimental feature toggle:\n\n```html\n<!-- FEATURE_FLAG: beta_terminal_access=ENABLED -->\n```\n\nWhat state value ('ENABLED' or 'DISABLED') is assigned to the feature flag 'beta_terminal_access' in this comment?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{ENABLED}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Look at the value following the '=' sign.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE39",
      "seedId": "HTG-L02-OE39",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "Feature flags in templates reveal hidden features and client capabilities. Here 'beta_terminal_access' is configured as 'ENABLED'.",
      "essentialKeyPoints": [
        "Feature toggle disclosure.",
        "Template metadata inspection."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'ENABLED'.",
        "partialCredit": "Submits lowercase 'enabled'.",
        "noCredit": "Submits 'DISABLED'."
      },
      "acceptableAlternatives": [
        "HTG{ENABLED}",
        "ENABLED",
        "enabled"
      ],
      "safetyNotes": "Feature toggle reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE40",
    "order": 50,
    "levelNumber": 2,
    "title": "Browser View Page Source Access Mechanism",
    "prompt": "A novice developer stores secret instructions inside an HTML comment, incorrectly assuming that because comments do not render visually on the screen, users cannot see them.\n\nWhat common 3-word browser menu command (or URL scheme 'view-source:') allows any visitor to inspect the raw HTML document received by the browser? Submit the 3-word command phrase.",
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
    "flag": "View Page Source",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Three words: View + Page + Source.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE40",
      "seedId": "HTG-L02-OE40",
      "subtopic": "HTML Comments, Build Artifacts & Source Code Inspection",
      "explanation": "'View Page Source' (Ctrl+U / Cmd+Option+U) displays the raw markup sent from the web server before DOM parsing, exposing all developer comments.",
      "essentialKeyPoints": [
        "View Page Source fundamentals.",
        "Comments are delivered to the client in cleartext."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'View Page Source'.",
        "partialCredit": "Submits 'View Source' or 'view-source'.",
        "noCredit": "Submits DevTools or Inspect."
      },
      "acceptableAlternatives": [
        "View Page Source",
        "view page source",
        "View Source",
        "view source",
        "view-source"
      ],
      "safetyNotes": "Web fundamentals standard."
    }
  }
];

module.exports = subtopic4Questions;
