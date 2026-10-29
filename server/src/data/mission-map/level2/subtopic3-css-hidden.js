const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic3Questions = [
  {
    "stableId": "HTG-L02-OE21",
    "order": 31,
    "levelNumber": 2,
    "title": "CSS display none DOM Tree Queryability",
    "prompt": "An administrative panel conceals sensitive elements using CSS:\n\n```html\n<div id=\"secret-panel\" style=\"display: none;\">FLAG_VAL_ALPHA_12</div>\n```\n\nWhen an element has 'display: none;' applied, it is excluded from the browser render tree.\n\nIs the element still fully present and retrievable via DOM query methods (such as 'document.getElementById(\"secret-panel\")')? Submit 'yes' or 'no'.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{yes}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "display: none affects visual rendering only; the node remains in the DOM.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE21",
      "seedId": "HTG-L02-OE21",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "'display: none;' removes an element from the visual formatting structure (the render tree), but the node remains fully instantiated in the DOM tree and accessible via JavaScript and DevTools.",
      "essentialKeyPoints": [
        "Render tree vs DOM tree distinction.",
        "display: none provides zero confidentiality."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'yes'.",
        "partialCredit": "Submits 'true'.",
        "noCredit": "Submits 'no' or 'false'."
      },
      "acceptableAlternatives": [
        "HTG{yes}",
        "yes",
        "YES",
        "true",
        "True"
      ],
      "safetyNotes": "Client-side visibility concepts."
    }
  },
  {
    "stableId": "HTG-L02-OE22",
    "order": 32,
    "levelNumber": 2,
    "title": "CSS visibility hidden Layout Preservation",
    "prompt": "Web developers frequently confuse different methods of hiding HTML elements:\n- 'display: none;' removes the element from both visual presentation and document layout flow.\n- Another CSS property and value makes an element completely invisible while preserving its exact physical dimensions and layout space on the page.\n\nWhat exact CSS declaration (property and value) achieves this layout-preserving invisibility? (Format: property: value).\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{visibility: hidden}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Property is 'visibility', value is 'hidden'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE22",
      "seedId": "HTG-L02-OE22",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "'visibility: hidden' hides an element but leaves an empty placeholder of identical dimensions in the document layout flow.",
      "essentialKeyPoints": [
        "visibility: hidden vs display: none.",
        "Layout box retention during concealment."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'HTG{visibility: hidden}' or 'visibility: hidden'.",
        "partialCredit": "Submits 'visibility:hidden' or 'visibility'.",
        "noCredit": "Submits display: none or opacity: 0."
      },
      "acceptableAlternatives": [
        "HTG{visibility: hidden}",
        "visibility: hidden",
        "visibility:hidden",
        "visibility",
        "VISIBILITY: HIDDEN"
      ],
      "safetyNotes": "CSS box model behavior."
    }
  },
  {
    "stableId": "HTG-L02-OE23",
    "order": 33,
    "levelNumber": 2,
    "title": "CSS opacity Zero Click Event Interaction",
    "prompt": "In UI security and clickjacking analysis, elements can be styled with 100% transparency:\n\n```css\n.overlay {\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n```\n\nAssuming default styling ('pointer-events: auto;'), can an element styled with 'opacity: 0;' still intercept user mouse clicks and trigger click event listeners? Submit 'yes' or 'no'.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{yes}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Opacity controls transparency only. Invisible elements remain interactive unless pointer-events is disabled.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE23",
      "seedId": "HTG-L02-OE23",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "An element with 'opacity: 0' is transparent but completely interactive. It captures clicks and hover events unless 'pointer-events: none;' is specified.",
      "essentialKeyPoints": [
        "Opacity does not disable event hit-testing.",
        "Core mechanism of client-side clickjacking attacks."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'yes'.",
        "partialCredit": "Submits 'true'.",
        "noCredit": "Submits 'no'."
      },
      "acceptableAlternatives": [
        "HTG{yes}",
        "yes",
        "YES",
        "true",
        "True"
      ],
      "safetyNotes": "Clickjacking transparency mechanics."
    }
  },
  {
    "stableId": "HTG-L02-OE24",
    "order": 34,
    "levelNumber": 2,
    "title": "Offscreen Absolute Positioning Coordinate Offset",
    "prompt": "A web application conceals a canary element by positioning it far outside the browser viewport:\n\n```html\n<div id=\"canary\" style=\"position: absolute; left: -9999px; top: -9999px;\">OFFSCREEN_PAYLOAD_88</div>\n```\n\nWhat integer pixel offset value is assigned to the 'left' style property to position this element off-screen? Submit the signed integer.",
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
    "flag": "-9999",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Include the negative sign: -9999.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE24",
      "seedId": "HTG-L02-OE24",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "Absolute positioning with 'left: -9999px' moves an element 9,999 pixels to the left of the document origin, rendering it invisible to human viewers while remaining accessible to screen readers and DOM scrapers.",
      "essentialKeyPoints": [
        "Off-screen positioning pattern.",
        "Detecting elements pushed beyond viewport boundaries."
      ],
      "gradingRubric": {
        "fullCredit": "Submits integer -9999.",
        "partialCredit": "Submits '-9999px'.",
        "noCredit": "Submits positive 9999 or wrong integer."
      },
      "acceptableAlternatives": [
        "-9999",
        "-9999px"
      ],
      "safetyNotes": "CSS off-screen positioning."
    }
  },
  {
    "stableId": "HTG-L02-OE25",
    "order": 35,
    "levelNumber": 2,
    "title": "HTML5 Native Hidden Boolean Attribute",
    "prompt": "An operations panel contains a confidential container using an HTML5 semantic hiding attribute:\n\n```html\n<div id=\"classified-box\" hidden>CONFIDENTIAL_KEY_707</div>\n```\n\nWhat single-word native HTML5 boolean attribute instructs the browser user agent to conceal this element by default without requiring an explicit CSS class?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{hidden}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Look at the attribute placed directly after the id on <div id='classified-box' ...>.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE25",
      "seedId": "HTG-L02-OE25",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "The HTML5 'hidden' attribute is a global boolean attribute. User agent stylesheets map '[hidden]' to 'display: none !important;' by default.",
      "essentialKeyPoints": [
        "HTML5 global hidden attribute.",
        "Overridable by custom CSS display declarations."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'hidden'.",
        "partialCredit": "Submits 'hidden=\"true\"'.",
        "noCredit": "Submits 'invisible' or 'none'."
      },
      "acceptableAlternatives": [
        "HTG{hidden}",
        "hidden",
        "HIDDEN",
        "hidden=\"hidden\""
      ],
      "safetyNotes": "HTML5 global attribute standards."
    }
  },
  {
    "stableId": "HTG-L02-OE26",
    "order": 36,
    "levelNumber": 2,
    "title": "Zero Font Size Text Content Extraction",
    "prompt": "A CTF author hid text inside an inline element by collapsing its font metrics and setting transparency:\n\n```html\n<span style=\"font-size: 0px; color: transparent;\">ZERO_FONT_PAYLOAD</span>\n```\n\nWhat exact text string is contained within this concealed span element?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{ZERO_FONT_PAYLOAD}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Read the inner text between <span> and </span>.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE26",
      "seedId": "HTG-L02-OE26",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "Setting 'font-size: 0px' renders characters with zero height and width, rendering them invisible on screen. The DOM text node 'ZERO_FONT_PAYLOAD' remains intact.",
      "essentialKeyPoints": [
        "Font metric text concealment.",
        "Inspecting DOM text nodes via Elements panel."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'ZERO_FONT_PAYLOAD'.",
        "partialCredit": "Submits lowercase 'zero_font_payload'.",
        "noCredit": "Submits CSS properties."
      },
      "acceptableAlternatives": [
        "HTG{ZERO_FONT_PAYLOAD}",
        "ZERO_FONT_PAYLOAD",
        "zero_font_payload"
      ],
      "safetyNotes": "Typography-based concealment."
    }
  },
  {
    "stableId": "HTG-L02-OE27",
    "order": 37,
    "levelNumber": 2,
    "title": "Negative Z-Index Layering Stacking Context",
    "prompt": "An element is hidden behind the root container background by configuring a negative stacking index:\n\n```html\n<div id=\"sub-layer\" style=\"position: relative; z-index: -1;\">BACKGROUND_TOKEN_91</div>\n```\n\nWhat signed integer value is assigned to 'z-index' to place this element behind standard stacking contexts? Submit the signed integer.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{-1}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The value is minus one.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE27",
      "seedId": "HTG-L02-OE27",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "A negative z-index (-1) places a positioned element behind its parent element's content and normal block-level descendants in the stacking context.",
      "essentialKeyPoints": [
        "CSS stacking context hierarchy.",
        "Negative z-index concealment."
      ],
      "gradingRubric": {
        "fullCredit": "Submits integer -1.",
        "partialCredit": "Submits 'minus one'.",
        "noCredit": "Submits positive 1 or 0."
      },
      "acceptableAlternatives": [
        "HTG{-1}",
        "-1",
        "minus one"
      ],
      "safetyNotes": "CSS stacking context analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE28",
    "order": 38,
    "levelNumber": 2,
    "title": "CSS Pseudo-Element Generated Content Extraction",
    "prompt": "An external stylesheet inserts dynamic text into a placeholder element using a CSS pseudo-element:\n\n```css\n#beacon::after {\n  content: \"PSEUDO_SIGNAL_55\";\n  display: inline;\n}\n```\n\nWhat exact string is generated by the 'content' property of this '::after' pseudo-element?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{PSEUDO_SIGNAL_55}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the string between the quotes in content: \"...\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE28",
      "seedId": "HTG-L02-OE28",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "The CSS 'content' property within '::before' or '::after' pseudo-elements injects generated text that renders on screen but does not appear in the static HTML source.",
      "essentialKeyPoints": [
        "CSS generated content mechanics.",
        "Pseudo-element text is inspectable in computed styles and DOM tree in DevTools."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'PSEUDO_SIGNAL_55'.",
        "partialCredit": "Submits lowercase 'pseudo_signal_55'.",
        "noCredit": "Submits selector '#beacon::after'."
      },
      "acceptableAlternatives": [
        "HTG{PSEUDO_SIGNAL_55}",
        "PSEUDO_SIGNAL_55",
        "pseudo_signal_55"
      ],
      "safetyNotes": "Pseudo-element inspection."
    }
  },
  {
    "stableId": "HTG-L02-OE29",
    "order": 39,
    "levelNumber": 2,
    "title": "CSS Clip-Path Geometric Concealment Property",
    "prompt": "A UI security component crops an element's visible boundary down to zero area:\n\n```css\n.masked-element {\n  clip-path: circle(0% at 0 0);\n}\n```\n\nWhat CSS property uses geometric shaping functions (such as circle, polygon, or inset) to clip the visible rendering area of an element? Submit the property name.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{clip-path}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The CSS property name is hyphenated: clip + path.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE29",
      "seedId": "HTG-L02-OE29",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "The 'clip-path' property creates a clipping region that determines which parts of an element should show. Setting 'circle(0%)' clips out 100% of the element.",
      "essentialKeyPoints": [
        "Modern CSS clipping techniques.",
        "Clipped elements remain queryable in the DOM."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'clip-path'.",
        "partialCredit": "Submits camelCase 'clipPath'.",
        "noCredit": "Submits 'clip' (deprecated) or 'mask'."
      },
      "acceptableAlternatives": [
        "HTG{clip-path}",
        "clip-path",
        "clipPath",
        "CLIP-PATH"
      ],
      "safetyNotes": "CSS clipping region analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE30",
    "order": 40,
    "levelNumber": 2,
    "title": "DOM textContent Property Retrieval",
    "prompt": "An element is hidden with CSS declarations:\n\n```html\n<p id=\"vault\" style=\"display: none; opacity: 0;\">RECON_DOM_TARGET_2026</p>\n```\n\nUnlike 'element.innerText' (which is layout-aware and returns an empty string for hidden elements), which standard DOM property returns the raw text content of an element and all its descendants regardless of CSS visibility? Submit the property name.",
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
    "flag": "textContent",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Property name starts with 'text' and ends with 'Content'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE30",
      "seedId": "HTG-L02-OE30",
      "subtopic": "Hidden DOM Elements & CSS Visibility Mechanisms",
      "explanation": "'Node.textContent' returns the text content of every node in the subtree regardless of styling, whereas 'HTMLElement.innerText' is layout-aware and respects 'display: none'.",
      "essentialKeyPoints": [
        "textContent vs innerText distinction in security scraping.",
        "textContent ignores all CSS visibility rules."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'textContent'.",
        "partialCredit": "Submits 'textcontent' or 'node.textContent'.",
        "noCredit": "Submits innerText or innerHTML."
      },
      "acceptableAlternatives": [
        "textContent",
        "textcontent",
        "TEXTCONTENT",
        "Node.textContent"
      ],
      "safetyNotes": "DOM text extraction standard."
    }
  }
];

module.exports = subtopic3Questions;
