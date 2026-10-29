const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    "stableId": "HTG-L02-OE01",
    "order": 11,
    "levelNumber": 2,
    "title": "Semantic HTML5 Main Element Identification",
    "prompt": "An analyst inspects the high-level semantic markup of an internal operations portal:\n\n```html\n<header><h1>Operations Portal</h1></header>\n<nav><ul><li>Home</li><li>Telemetry</li></ul></nav>\n<main id=\"challenge-core\">\n  <section class=\"signal\">Telemetry Feed Active</section>\n</main>\n<footer>&copy; 2026 Grid Operations</footer>\n```\n\nIn semantic HTML5, which tag name designates the primary unique content container of the document (marked here with id 'challenge-core')? Submit the tag name or tag.",
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
    "flag": "<main>",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Look at the tag enclosing id='challenge-core'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE01",
      "seedId": "HTG-L02-OE01",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "The '<main>' element represents the dominant content of the '<body>' of a document. It isolates unique content from repeated components like headers, footers, and navbars.",
      "essentialKeyPoints": [
        "Semantic HTML5 hierarchy.",
        "The <main> tag isolates central document payload."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '<main>' or 'main'.",
        "partialCredit": "Submits uppercase 'MAIN'.",
        "noCredit": "Submits <header>, <nav>, or <footer>."
      },
      "acceptableAlternatives": [
        "<main>",
        "main",
        "MAIN",
        "<MAIN>"
      ],
      "safetyNotes": "DOM semantic structure analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE02",
    "order": 12,
    "levelNumber": 2,
    "title": "DOM Child Element Node Cardinality",
    "prompt": "An administrative dashboard renders an unordered list of telemetry channels:\n\n```html\n<ul id=\"signal-list\">\n  <li class=\"active\">Channel Alpha</li>\n  <li class=\"idle\">Channel Beta</li>\n  <li class=\"active\">Channel Gamma</li>\n  <li class=\"active\">Channel Delta</li>\n  <li class=\"idle\">Channel Epsilon</li>\n</ul>\n```\n\nWhen querying 'document.getElementById(\"signal-list\").children', how many direct element child nodes exist inside this list? Submit the integer count.",
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
    "flag": "5",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Count the number of <li> items inside <ul id='signal-list'>.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE02",
      "seedId": "HTG-L02-OE02",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "There are exactly 5 direct '<li>' elements enclosed inside '<ul id=\"signal-list\">'. The 'children' property returns an HTMLCollection of length 5.",
      "essentialKeyPoints": [
        "DOM tree parent-child relationship.",
        "Element.children returns element nodes, ignoring whitespace text nodes."
      ],
      "gradingRubric": {
        "fullCredit": "Submits integer 5.",
        "partialCredit": "Submits 'five'.",
        "noCredit": "Submits incorrect count."
      },
      "acceptableAlternatives": [
        "5",
        "five"
      ],
      "safetyNotes": "DOM traversal basics."
    }
  },
  {
    "stableId": "HTG-L02-OE03",
    "order": 13,
    "levelNumber": 2,
    "title": "HTML Entity Encoding Translation",
    "prompt": "A web application source snippet contains escaped character entities:\n\n`&lt;flag_node&gt;`\n\nConvert the entities '&lt;' and '&gt;' into their literal ASCII delimiter characters to produce the unescaped XML/HTML element tag.",
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
    "flag": "<flag_node>",
    "hints": [
      {
        "hintIndex": 1,
        "content": "&lt; is '<' and &gt; is '>'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE03",
      "seedId": "HTG-L02-OE03",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "'&lt;' represents 'less than' ('<') and '&gt;' represents 'greater than' ('>'). Substituting yields '<flag_node>'.",
      "essentialKeyPoints": [
        "HTML character entity translation.",
        "Preventing XSS and raw tag interpretation via entity encoding."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '<flag_node>'.",
        "partialCredit": "Submits 'flag_node' without angle brackets.",
        "noCredit": "Submits unescaped entities."
      },
      "acceptableAlternatives": [
        "<flag_node>",
        "flag_node"
      ],
      "safetyNotes": "Entity decoding verification."
    }
  },
  {
    "stableId": "HTG-L02-OE04",
    "order": 14,
    "levelNumber": 2,
    "title": "HTML Table Matrix Coordinate Value Extraction",
    "prompt": "A diagnostics table in a training dashboard is structured as follows:\n\n```html\n<table id=\"matrix-tbl\">\n  <tr><td>ROW0_COL0</td><td>ROW0_COL1</td></tr>\n  <tr><td>STATUS_ONLINE</td><td>TARGET_KEY_99</td></tr>\n</table>\n```\n\nIn zero-based indexing, query the cell located at Row index 1, Column index 1 ('table.rows[1].cells[1]'). What text content is contained in that cell?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{TARGET_KEY_99}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Row 1 is the second <tr>. Cell 1 is the second <td> in that row.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE04",
      "seedId": "HTG-L02-OE04",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "Row index 1 refers to the second '<tr>', and cell index 1 refers to the second '<td>' within that row, which contains 'TARGET_KEY_99'.",
      "essentialKeyPoints": [
        "Table row and cell zero-based coordinate indexing.",
        "HTMLTableElement DOM interface navigation."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'TARGET_KEY_99'.",
        "partialCredit": "Submits lowercase 'target_key_99'.",
        "noCredit": "Submits cell from row 0 or cell 0."
      },
      "acceptableAlternatives": [
        "HTG{TARGET_KEY_99}",
        "TARGET_KEY_99",
        "target_key_99"
      ],
      "safetyNotes": "Structured DOM navigation."
    }
  },
  {
    "stableId": "HTG-L02-OE05",
    "order": 15,
    "levelNumber": 2,
    "title": "CSS Inline Display Property Value",
    "prompt": "In standard CSS layout, block-level elements (like '<div>' and '<p>') break onto new lines, whereas text-level elements (like '<span>' and '<a>') flow horizontally without causing a line break.\n\nWhat is the standard CSS 'display' property value used for text-level elements that flow horizontally within text lines? Submit the property value name.",
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
    "flag": "inline",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Opposite of 'block'; elements sit in line with adjacent text.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE05",
      "seedId": "HTG-L02-OE05",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "'display: inline' allows an element to sit on the same line as surrounding text and other inline elements without forcing line breaks.",
      "essentialKeyPoints": [
        "Inline formatting context.",
        "Contrast with block formatting context."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'inline'.",
        "partialCredit": "Submits 'display: inline'.",
        "noCredit": "Submits 'block' or 'flex'."
      },
      "acceptableAlternatives": [
        "inline",
        "display: inline",
        "INLINE"
      ],
      "safetyNotes": "CSS layout model inspection."
    }
  },
  {
    "stableId": "HTG-L02-OE06",
    "order": 16,
    "levelNumber": 2,
    "title": "HTML Specification Void Elements Classification",
    "prompt": "Certain HTML elements can neither contain content nor have closing tags (for example: '<img>', '<input>', '<br>', and '<hr>').\n\nIn the W3C and WHATWG HTML specifications, what two-word official terminology denotes these self-closing elements that strictly prohibit end tags?",
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
    "flag": "void elements",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The first word is 'void', meaning empty.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE06",
      "seedId": "HTG-L02-OE06",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "HTML specification section 13.1.2 defines 'void elements' as elements that can never have child nodes (e.g. area, base, br, col, embed, hr, img, input, link, meta, source, track, wbr).",
      "essentialKeyPoints": [
        "Void elements specification in HTML5.",
        "Syntactic differences between void elements and self-closing XML tags."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'void elements' or 'void element'.",
        "partialCredit": "Submits 'void' or 'void tags'.",
        "noCredit": "Submits 'empty' or 'empty tags'."
      },
      "acceptableAlternatives": [
        "void elements",
        "void element",
        "void tags",
        "void"
      ],
      "safetyNotes": "HTML parser specification rules."
    }
  },
  {
    "stableId": "HTG-L02-OE07",
    "order": 17,
    "levelNumber": 2,
    "title": "Iframe Embedded Document Source Path",
    "prompt": "An administrative audit of an internal application discovers an embedded frame in a template:\n\n```html\n<iframe id=\"secret-frame\" src=\"/sandbox/v2/telemetry_viewer.html\" width=\"400\" height=\"300\"></iframe>\n```\n\nWhat URL path is configured as the embedded document source in the 'src' attribute?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{/sandbox/v2/telemetry_viewer.html}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the exact value inside the src=\"...\" attribute.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE07",
      "seedId": "HTG-L02-OE07",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "The 'src' attribute of the iframe specifies the location of the embedded resource: '/sandbox/v2/telemetry_viewer.html'.",
      "essentialKeyPoints": [
        "Embedded nested browsing contexts (iframes).",
        "Inspecting iframe source attributes for hidden views."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '/sandbox/v2/telemetry_viewer.html'.",
        "partialCredit": "Submits 'telemetry_viewer.html'.",
        "noCredit": "Submits iframe id or dimensions."
      },
      "acceptableAlternatives": [
        "HTG{/sandbox/v2/telemetry_viewer.html}",
        "/sandbox/v2/telemetry_viewer.html",
        "sandbox/v2/telemetry_viewer.html"
      ],
      "safetyNotes": "Iframe inspection in CTF reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE08",
    "order": 18,
    "levelNumber": 2,
    "title": "DOM Node Parent Tag Traversal",
    "prompt": "Consider the following nested markup structure:\n\n```html\n<div id=\"wrapper\">\n  <p class=\"summary\"><span id=\"crumb\">Audit Marker</span></p>\n</div>\n```\n\nWhen inspecting 'document.getElementById(\"crumb\").parentElement', what is the HTML tag name (tagName) of its immediate direct parent element?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{P}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The immediate parent enclosing <span id='crumb'> is the paragraph element.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE08",
      "seedId": "HTG-L02-OE08",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "The immediate parent of 'span#crumb' is the '<p class=\"summary\">' element. In the DOM, 'element.tagName' returns uppercase 'P'.",
      "essentialKeyPoints": [
        "DOM parent-child node relationships.",
        "Distinguishing direct parent ('<p>') from ancestor ('<div>')."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'P' or '<p>' or 'p'.",
        "partialCredit": "Submits 'paragraph'.",
        "noCredit": "Submits 'DIV' or 'wrapper'."
      },
      "acceptableAlternatives": [
        "HTG{P}",
        "P",
        "<p>",
        "p",
        "<P>",
        "paragraph"
      ],
      "safetyNotes": "DOM tree climbing."
    }
  },
  {
    "stableId": "HTG-L02-OE09",
    "order": 19,
    "levelNumber": 2,
    "title": "Form Action Submission Endpoint",
    "prompt": "An authentication testing form is declared in the page source:\n\n```html\n<form id=\"portal-form\" action=\"/api/v1/auth/verify_token\" method=\"POST\">\n  <input type=\"text\" name=\"token_input\">\n</form>\n```\n\nWhat API endpoint path is designated to receive this form's data according to its 'action' attribute?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{/api/v1/auth/verify_token}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Read the URL specified in action=\"...\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE09",
      "seedId": "HTG-L02-OE09",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "The 'action' attribute specifies the destination URL where the form payload is submitted: '/api/v1/auth/verify_token'.",
      "essentialKeyPoints": [
        "Form submission target resolution.",
        "Inspecting form actions to identify backend endpoints."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '/api/v1/auth/verify_token'.",
        "partialCredit": "Submits 'verify_token'.",
        "noCredit": "Submits method POST or input name."
      },
      "acceptableAlternatives": [
        "HTG{/api/v1/auth/verify_token}",
        "/api/v1/auth/verify_token",
        "api/v1/auth/verify_token"
      ],
      "safetyNotes": "Form action reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE10",
    "order": 20,
    "levelNumber": 2,
    "title": "Shadow DOM Encapsulation Mechanism",
    "prompt": "A custom Web Component invokes 'this.attachShadow({ mode: \"open\" })' to isolate its internal subtree, styles, and event handling from the outer page DOM.\n\nWhat 2-word browser standard feature provides this isolated DOM subtree and scoped CSS encapsulation?",
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
    "flag": "Shadow DOM",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Attached via attachShadow(); combines 'Shadow' with 'DOM'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE10",
      "seedId": "HTG-L02-OE10",
      "subtopic": "HTML Structure, DOM Hierarchy & Tag Inspection",
      "explanation": "The 'Shadow DOM' API attaches an encapsulated shadow tree to an element, scoping styling and hiding internal nodes from ordinary document queries.",
      "essentialKeyPoints": [
        "Web Components Shadow DOM architecture.",
        "Open vs closed shadow root inspection."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'Shadow DOM' (case-insensitive).",
        "partialCredit": "Submits 'shadow dom' or 'shadow root'.",
        "noCredit": "Submits Virtual DOM or iframe."
      },
      "acceptableAlternatives": [
        "Shadow DOM",
        "shadow dom",
        "shadow-dom",
        "Shadow-DOM",
        "shadow root"
      ],
      "safetyNotes": "Modern Web Component architecture."
    }
  }
];

module.exports = subtopic1Questions;
