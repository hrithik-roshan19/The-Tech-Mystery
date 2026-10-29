const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic2Questions = [
  {
    "stableId": "HTG-L02-OE11",
    "order": 21,
    "levelNumber": 2,
    "title": "HTML5 Custom Data Attribute Extraction",
    "prompt": "An administrative control button in a web dashboard contains custom HTML5 metadata:\n\n```html\n<button id=\"btn-exec\" class=\"action-btn\" data-auth-tier=\"commander_level_3\">Execute Protocol</button>\n```\n\nWhat is the exact string value stored inside the 'data-auth-tier' attribute?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{commander_level_3}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the exact value from data-auth-tier=\"...\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE11",
      "seedId": "HTG-L02-OE11",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "HTML5 'data-*' attributes store private custom data on DOM elements. The 'data-auth-tier' attribute contains 'commander_level_3'.",
      "essentialKeyPoints": [
        "HTML5 data-* attribute mechanics.",
        "Custom attributes often leak role or authorization metadata."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'commander_level_3'.",
        "partialCredit": "Submits with quotes: '\"commander_level_3\"'.",
        "noCredit": "Submits button text or id."
      },
      "acceptableAlternatives": [
        "HTG{commander_level_3}",
        "commander_level_3"
      ],
      "safetyNotes": "DOM attribute inspection."
    }
  },
  {
    "stableId": "HTG-L02-OE12",
    "order": 22,
    "levelNumber": 2,
    "title": "DOM dataset CamelCase Property Mapping",
    "prompt": "A profile container element is declared with a hyphenated data attribute:\n\n```html\n<div id=\"profile\" data-secret-token=\"alpha_77\"></div>\n```\n\nIn the browser DOM API, HTML 'data-*' attributes are automatically converted to camelCase properties on the 'element.dataset' object (e.g. data-foo-bar becomes dataset.fooBar).\n\nWhat exact camelCase property name on 'element.dataset' corresponds to 'data-secret-token'?",
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
    "flag": "secretToken",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Convert hyphenated 'secret-token' to camelCase: secret + Token.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE12",
      "seedId": "HTG-L02-OE12",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "The DOM dataset interface strips 'data-' and transforms hyphen-separated names to camelCase: 'data-secret-token' maps to 'dataset.secretToken'.",
      "essentialKeyPoints": [
        "dataset property name conversion algorithm.",
        "Hyphens are stripped and the subsequent letter is capitalized."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'secretToken' (case-sensitive).",
        "partialCredit": "Submits 'dataset.secretToken'.",
        "noCredit": "Leaves hyphens intact ('secret-token')."
      },
      "acceptableAlternatives": [
        "secretToken",
        "dataset.secretToken"
      ],
      "safetyNotes": "JavaScript dataset API standards."
    }
  },
  {
    "stableId": "HTG-L02-OE13",
    "order": 23,
    "levelNumber": 2,
    "title": "Hidden Form Input Secret Key Extraction",
    "prompt": "A transaction confirmation form contains a hidden input element:\n\n```html\n<form id=\"transfer-form\" method=\"POST\" action=\"/confirm\">\n  <input type=\"hidden\" name=\"csrf_bypass_key\" value=\"sec_key_4412\">\n  <input type=\"text\" name=\"recipient\" value=\"admin\">\n  <button type=\"submit\">Send</button>\n</form>\n```\n\nWhat is the string value stored inside the 'value' attribute of the hidden input named 'csrf_bypass_key'?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{sec_key_4412}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Inspect the value attribute on the input where type=\"hidden\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE13",
      "seedId": "HTG-L02-OE13",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "Hidden inputs are not rendered visually on the page, but their attributes are readily viewable in the DOM tree. Here value is 'sec_key_4412'.",
      "essentialKeyPoints": [
        "<input type=\"hidden\"> is completely visible in page source and DevTools.",
        "Hidden inputs do not provide confidentiality."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'sec_key_4412'.",
        "partialCredit": "Submits 'sec_key_4412' with quotes.",
        "noCredit": "Submits input name 'csrf_bypass_key'."
      },
      "acceptableAlternatives": [
        "HTG{sec_key_4412}",
        "sec_key_4412"
      ],
      "safetyNotes": "Hidden form field reconnaissance."
    }
  },
  {
    "stableId": "HTG-L02-OE14",
    "order": 24,
    "levelNumber": 2,
    "title": "Form File Upload Enctype Header Specification",
    "prompt": "An evidence submission form allows participants to upload binary packet captures.\n\nBy default, HTML forms encode data as 'application/x-www-form-urlencoded'.\n\nWhat exact MIME encoding type must be specified in the form's 'enctype' attribute to enable multi-part binary file uploads?",
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
    "flag": "multipart/form-data",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Starts with 'multipart/' followed by 'form-data'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE14",
      "seedId": "HTG-L02-OE14",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "'enctype=\"multipart/form-data\"' is required when using '<input type=\"file\">' so that file contents are transmitted in discrete MIME body parts with individual headers.",
      "essentialKeyPoints": [
        "Form enctype options: application/x-www-form-urlencoded vs multipart/form-data.",
        "Binary file transmission protocol requirements."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'multipart/form-data'.",
        "partialCredit": "Submits 'multipart/formdata'.",
        "noCredit": "Submits application/json or text/plain."
      },
      "acceptableAlternatives": [
        "multipart/form-data",
        "multipart/formdata",
        "MULTIPART/FORM-DATA"
      ],
      "safetyNotes": "HTTP form specification."
    }
  },
  {
    "stableId": "HTG-L02-OE15",
    "order": 25,
    "levelNumber": 2,
    "title": "Input Constraint Regular Expression Extraction",
    "prompt": "A registration field enforces client-side pattern validation:\n\n```html\n<input type=\"text\" id=\"voucher-code\" name=\"voucher\" pattern=\"^[A-Z]{3}-[0-9]{4}$\" title=\"3 uppercase letters, hyphen, 4 digits\">\n```\n\nWhat exact regular expression string is configured in the 'pattern' attribute?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{^[A-Z]{3}-[0-9]{4}$}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the verbatim pattern regex between the pattern=\"...\" quotes.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE15",
      "seedId": "HTG-L02-OE15",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "The 'pattern' attribute specifies a client-side regular expression: '^[A-Z]{3}-[0-9]{4}$'. Inspecting patterns reveals the expected format of credentials or vouchers.",
      "essentialKeyPoints": [
        "HTML5 input pattern constraints.",
        "Extracting format regex directly from client markup."
      ],
      "gradingRubric": {
        "fullCredit": "Submits '^[A-Z]{3}-[0-9]{4}$'.",
        "partialCredit": "Submits '[A-Z]{3}-[0-9]{4}' (without anchors).",
        "noCredit": "Submits title text or id."
      },
      "acceptableAlternatives": [
        "HTG{^[A-Z]{3}-[0-9]{4}$}",
        "^[A-Z]{3}-[0-9]{4}$",
        "[A-Z]{3}-[0-9]{4}"
      ],
      "safetyNotes": "Regex constraint analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE16",
    "order": 26,
    "levelNumber": 2,
    "title": "Disabled Form Control Submission Omission",
    "prompt": "In HTML form submission semantics, there is a key operational distinction between form controls marked with 'readonly' versus 'disabled':\n- Fields marked with 'readonly' cannot be modified by the user, but their values ARE sent in the submitted form request.\n- Another attribute completely omits the form control's value from the submitted form data body.\n\nWhich boolean attribute causes an input's data to be completely excluded from the HTTP POST payload? Submit the single attribute name.\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{disabled}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The attribute name is 'disabled'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE16",
      "seedId": "HTG-L02-OE16",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "In standard HTML, disabled controls do not participate in form submission (they are not 'submittable elements'). Readonly controls ARE submitted.",
      "essentialKeyPoints": [
        "disabled vs readonly form behavior.",
        "Disabled fields are never sent in the POST body."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'disabled'.",
        "partialCredit": "Submits 'disabled=\"disabled\"'.",
        "noCredit": "Submits 'readonly'."
      },
      "acceptableAlternatives": [
        "HTG{disabled}",
        "disabled",
        "DISABLED",
        "disabled=\"true\""
      ],
      "safetyNotes": "Form semantics standard."
    }
  },
  {
    "stableId": "HTG-L02-OE17",
    "order": 27,
    "levelNumber": 2,
    "title": "Accessibility ARIA Label Metadata Extraction",
    "prompt": "An administrative toolbar includes an icon-only button without visible text:\n\n```html\n<button id=\"override-btn\" class=\"icon-btn\" aria-label=\"telemetry_override_active\"><svg>...</svg></button>\n```\n\nAssistive technologies read accessibility attributes to describe elements to screen readers.\n\nWhat is the exact text value assigned to the 'aria-label' attribute on this button?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{telemetry_override_active}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Read the exact string inside aria-label=\"...\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE17",
      "seedId": "HTG-L02-OE17",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "The 'aria-label' attribute defines a string that labels the current element for accessibility trees. Here it holds 'telemetry_override_active'.",
      "essentialKeyPoints": [
        "ARIA accessibility attributes often contain descriptive state metadata.",
        "aria-label inspection in CTF reconnaissance."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'telemetry_override_active'.",
        "partialCredit": "Submits 'telemetry override active'.",
        "noCredit": "Submits button class or id."
      },
      "acceptableAlternatives": [
        "HTG{telemetry_override_active}",
        "telemetry_override_active",
        "telemetry override active"
      ],
      "safetyNotes": "Accessibility metadata inspection."
    }
  },
  {
    "stableId": "HTG-L02-OE18",
    "order": 28,
    "levelNumber": 2,
    "title": "Cross-Origin Window Opener Protection Attribute",
    "prompt": "When linking to an untrusted external site using '<a href=\"...\" target=\"_blank\">', the newly opened window receives a reference to the originating page via 'window.opener', potentially enabling reverse tabnabbing.\n\nWhat security keyword added to the 'rel' attribute instructs the browser to nullify the 'window.opener' reference? Submit the keyword.",
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
    "flag": "noopener",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Denies opener access; starts with 'no' and ends with 'opener'.",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE18",
      "seedId": "HTG-L02-OE18",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "'rel=\"noopener\"' prevents the new page from accessing the 'window.opener' property, isolating process contexts and preventing reverse tabnabbing.",
      "essentialKeyPoints": [
        "Reverse tabnabbing mitigation.",
        "rel=\"noopener\" vs rel=\"noreferrer\"."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'noopener'.",
        "partialCredit": "Submits 'noreferrer' or 'noopener noreferrer'.",
        "noCredit": "Submits '_blank' or 'nofollow'."
      },
      "acceptableAlternatives": [
        "noopener",
        "NOOPENER",
        "noreferrer",
        "noopener noreferrer"
      ],
      "safetyNotes": "Web client security standard."
    }
  },
  {
    "stableId": "HTG-L02-OE19",
    "order": 29,
    "levelNumber": 2,
    "title": "Anchor Download Filename Override Extraction",
    "prompt": "An archive export link uses the HTML5 'download' attribute:\n\n```html\n<a href=\"/export/raw_stream.bin\" download=\"grid_backup_2026.bin\">Download Archive</a>\n```\n\nWhen a user clicks this link, what local file name does the 'download' attribute instruct the browser to use when saving the downloaded asset?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{grid_backup_2026.bin}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "The requested filename is specified inside download=\"...\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE19",
      "seedId": "HTG-L02-OE19",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "The 'download' attribute specifies the filename that will be suggested to the user when downloading the linked resource: 'grid_backup_2026.bin'.",
      "essentialKeyPoints": [
        "HTML5 <a> download attribute functionality.",
        "Overriding server-provided Content-Disposition filename."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'grid_backup_2026.bin'.",
        "partialCredit": "Submits 'raw_stream.bin'.",
        "noCredit": "Submits anchor text or URL path."
      },
      "acceptableAlternatives": [
        "HTG{grid_backup_2026.bin}",
        "grid_backup_2026.bin",
        "grid_backup_2026"
      ],
      "safetyNotes": "Download attribute analysis."
    }
  },
  {
    "stableId": "HTG-L02-OE20",
    "order": 30,
    "levelNumber": 2,
    "title": "Non-Standard Attribute Routing Key Extraction",
    "prompt": "A legacy enterprise web interface injects custom proprietary attributes directly into HTML tags:\n\n```html\n<div class=\"banner\" internal-routing-key=\"routing_node_88\">System Operational</div>\n```\n\nWhat string value is assigned to the non-standard attribute 'internal-routing-key'?\n\nFormat your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.",
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
    "flag": "HTG{routing_node_88}",
    "hints": [
      {
        "hintIndex": 1,
        "content": "Copy the value assigned to internal-routing-key=\"...\".",
        "penaltyPoints": 10
      }
    ],
    "metadata": {
      "stableId": "HTG-L02-OE20",
      "seedId": "HTG-L02-OE20",
      "subtopic": "Client-Side Attributes & Data Attributes",
      "explanation": "While HTML5 recommends 'data-*', developers frequently invent arbitrary custom attributes. Here 'internal-routing-key' contains 'routing_node_88'.",
      "essentialKeyPoints": [
        "Custom non-standard attributes in legacy codebases.",
        "All HTML attributes are accessible via getAttribute()."
      ],
      "gradingRubric": {
        "fullCredit": "Submits 'routing_node_88'.",
        "partialCredit": "Submits 'routing_node_88' with quotes.",
        "noCredit": "Submits class 'banner' or element text."
      },
      "acceptableAlternatives": [
        "HTG{routing_node_88}",
        "routing_node_88"
      ],
      "safetyNotes": "Custom attribute inspection."
    }
  }
];

module.exports = subtopic2Questions;
