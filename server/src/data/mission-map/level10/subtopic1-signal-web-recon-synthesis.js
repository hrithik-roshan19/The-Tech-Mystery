const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic1Questions = [
  {
    stableId: 'HTG-L10-OE01',
    order: 1,
    levelNumber: 10,
    title: 'Digital Signal Frequency Shift Keying Demodulation',
    prompt: `In reconstructing the initial distress beacon that initiated the grid investigation, analysts examine an audio-frequency radio recording.

The signal alternates between two discrete carrier frequencies: $1200\\text{ Hz}$ representing binary 0 (space) and $2200\\text{ Hz}$ representing binary 1 (mark).

What 3-letter uppercase acronym represents this fundamental digital modulation technique where frequency shifts encode discrete binary states?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{FSK}',
    hints: [
      {
        hintIndex: 1,
        content: "Frequency Shift Keying is abbreviated FSK.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE01',
      seedId: 'HTG-L10-OE01',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "Frequency Shift Keying (FSK) shifts carrier frequencies to transmit binary data over radio/audio channels.",
      essentialKeyPoints: [
        "Bell 202 and standard audio telemetry use 1200/2200 Hz FSK.",
        "Synthesizing the initial beacon requires FSK frequency discrimination."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{FSK}' or 'FSK'.",
        partialCredit: "Submits lowercase 'fsk'.",
        noCredit: "Submits PSK or ASK."
      },
      acceptableAlternatives: ['HTG{FSK}', 'FSK', 'fsk', 'HTG{fsk}']
    }
  },
  {
    stableId: 'HTG-L10-OE02',
    order: 2,
    levelNumber: 10,
    title: 'HTML5 Custom Data Attribute Prefix Convention',
    prompt: `During web reconnaissance on the citadel portal, an operative discovers client-side secrets embedded directly into Document Object Model (DOM) tags.

According to the W3C HTML5 specification, all custom data attributes intended to store private page data without affecting presentation must begin with what 5-character prefix (including the trailing hyphen)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 5-character prefix).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{data-}',
    hints: [
      {
        hintIndex: 1,
        content: "Custom DOM attributes start with data- (e.g. data-secret).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE02',
      seedId: 'HTG-L10-OE02',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "HTML5 custom data attributes must begin with 'data-' (accessible via dataset in JavaScript).",
      essentialKeyPoints: [
        "Web developers frequently stash state in data-* attributes.",
        "DOM inspection tools enumerate dataset keys to reveal hidden client metadata."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{data-}' or 'data-'.",
        partialCredit: "Submits 'data'.",
        noCredit: "Submits aria or custom."
      },
      acceptableAlternatives: ['HTG{data-}', 'data-', 'DATA-', 'data', 'HTG{data}']
    }
  },
  {
    stableId: 'HTG-L10-OE03',
    order: 3,
    levelNumber: 10,
    title: 'Browser Persistent Web Storage Interface',
    prompt: `Web applications store client tokens across two primary Web Storage interfaces: one that is cleared when the browser tab closes, and one that persists indefinitely across browser restarts and multiple tabs under the same origin.

What is the JavaScript window property name for this persistent client-side key-value storage mechanism?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the property name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{localStorage}',
    hints: [
      {
        hintIndex: 1,
        content: "window.localStorage persists data indefinitely.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE03',
      seedId: 'HTG-L10-OE03',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "localStorage stores data persistently with no expiration date across browser sessions.",
      essentialKeyPoints: [
        "Unlike sessionStorage, localStorage data survives tab and browser closures.",
        "Token theft via XSS frequently targets localStorage."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{localStorage}' or 'localStorage'.",
        partialCredit: "Submits 'localstorage' or 'window.localStorage'.",
        noCredit: "Submits sessionStorage or indexedDB."
      },
      acceptableAlternatives: ['HTG{localStorage}', 'localStorage', 'localstorage', 'window.localStorage', 'LOCALSTORAGE', 'HTG{localstorage}']
    }
  },
  {
    stableId: 'HTG-L10-OE04',
    order: 4,
    levelNumber: 10,
    title: 'JSON Web Token (JWT) Header Algorithm Parameter',
    prompt: `In validating cryptographic session claims within JSON Web Tokens (RFC 7519), the decoded header JSON object specifies token metadata:
\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`
Which 3-letter key in the JWT header dictionary specifies the cryptographic signature algorithm used to sign the token?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-letter key).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{alg}',
    hints: [
      {
        hintIndex: 1,
        content: "The algorithm header parameter is 'alg'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE04',
      seedId: 'HTG-L10-OE04',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "The 'alg' parameter in the JWT header indicates the signature or encryption algorithm.",
      essentialKeyPoints: [
        "Tampering with 'alg' (e.g. 'none' algorithm attack) is a classic JWT exploitation vector.",
        "JWT tokens consist of Header.Payload.Signature encoded in Base64URL."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{alg}' or 'alg'.",
        partialCredit: "Submits uppercase 'ALG'.",
        noCredit: "Submits typ or kid."
      },
      acceptableAlternatives: ['HTG{alg}', 'alg', 'ALG', 'HTG{ALG}']
    }
  },
  {
    stableId: 'HTG-L10-OE05',
    order: 5,
    levelNumber: 10,
    title: 'Cascading Style Sheets Layout Removal Declaration',
    prompt: `Web authors attempting to hide secrets in DOM nodes often apply styling rules to remove elements from sight.

While \`visibility: hidden\` hides an element but preserves its physical layout box in the viewport, which CSS property declaration completely removes the element from the document layout flow so that it takes up zero screen space?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the declaration).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{display: none}',
    hints: [
      {
        hintIndex: 1,
        content: "The property and value are display: none.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE05',
      seedId: 'HTG-L10-OE05',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "'display: none' removes elements from the rendered layout flow while retaining them in the DOM tree.",
      essentialKeyPoints: [
        "Elements with display: none remain fully visible to DOM parsers and DevTools.",
        "Contrast with visibility: hidden which still occupies spatial dimensions."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{display: none}' or 'display: none'.",
        partialCredit: "Submits 'display:none' or 'none'.",
        noCredit: "Submits visibility: hidden or opacity: 0."
      },
      acceptableAlternatives: ['HTG{display: none}', 'display: none', 'display:none', 'DISPLAY: NONE', 'HTG{display:none}']
    }
  },
  {
    stableId: 'HTG-L10-OE06',
    order: 6,
    levelNumber: 10,
    title: 'JavaScript DOM MutationObserver Interface',
    prompt: `Client-side obfuscation scripts on the citadel gateway dynamically inject flag fragments into the document tree only when specific user interactions occur.

Which modern browser Web API interface provides developers and analysts with the ability to listen for and react to additions, deletions, and attribute changes within the DOM tree?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the interface name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{MutationObserver}',
    hints: [
      {
        hintIndex: 1,
        content: "The interface is MutationObserver.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE06',
      seedId: 'HTG-L10-OE06',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "MutationObserver detects changes to the DOM (childList, attributes, characterData).",
      essentialKeyPoints: [
        "MutationObserver replaces legacy DOM mutation events.",
        "Forensic instrumentation hooks MutationObserver to catch transient DOM injections."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{MutationObserver}' or 'MutationObserver'.",
        partialCredit: "Submits lowercase 'mutationobserver'.",
        noCredit: "Submits EventListener or Proxy."
      },
      acceptableAlternatives: ['HTG{MutationObserver}', 'MutationObserver', 'mutationobserver', 'mutationObserver', 'HTG{mutationobserver}']
    }
  },
  {
    stableId: 'HTG-L10-OE07',
    order: 7,
    levelNumber: 10,
    title: 'HTTP Basic Authentication Scheme Keyword',
    prompt: `In standard HTTP basic authentication (RFC 7617), the client submits credentials by encoding the string \`username:password\` in Base64.

This encoded token is transmitted in the \`Authorization\` request header prefixed by what scheme keyword?
\`\`\`http
Authorization: <SCHEME> dXNlcm5hbWU6cGFzc3dvcmQ=
\`\`\`
What 5-letter scheme keyword represents this authentication scheme?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the keyword).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{Basic}',
    hints: [
      {
        hintIndex: 1,
        content: "The scheme is Basic (e.g. Authorization: Basic ...).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE07',
      seedId: 'HTG-L10-OE07',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "HTTP Basic Authentication uses the scheme keyword 'Basic'.",
      essentialKeyPoints: [
        "Basic authentication transmits unencrypted Base64-encoded credentials.",
        "Decoders extract username and password by splitting on the first colon."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Basic}' or 'Basic'.",
        partialCredit: "Submits lowercase 'basic'.",
        noCredit: "Submits Bearer or Digest."
      },
      acceptableAlternatives: ['HTG{Basic}', 'Basic', 'basic', 'BASIC', 'HTG{basic}']
    }
  },
  {
    stableId: 'HTG-L10-OE08',
    order: 8,
    levelNumber: 10,
    title: 'Web Cryptography API SubtleCrypto Interface Property',
    prompt: `The W3C Web Cryptography API provides client-side JavaScript applications with secure cryptographic operations (such as SHA-256 hashing, AES encryption, and HMAC generation).

Which property on the \`window.crypto\` object exposes the \`SubtleCrypto\` interface that implements these cryptographic primitives?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the property name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{subtle}',
    hints: [
      {
        hintIndex: 1,
        content: "crypto.subtle exposes the SubtleCrypto interface.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE08',
      seedId: 'HTG-L10-OE08',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "window.crypto.subtle provides access to the SubtleCrypto API.",
      essentialKeyPoints: [
        "SubtleCrypto handles digest, encrypt, decrypt, sign, and verify operations.",
        "It operates asynchronously returning Promises resolving to ArrayBuffers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{subtle}' or 'subtle'.",
        partialCredit: "Submits 'crypto.subtle' or 'Subtle'.",
        noCredit: "Submits getRandomValues."
      },
      acceptableAlternatives: ['HTG{subtle}', 'subtle', 'Subtle', 'crypto.subtle', 'HTG{Subtle}']
    }
  },
  {
    stableId: 'HTG-L10-OE09',
    order: 9,
    levelNumber: 10,
    title: 'Cross-Origin Resource Sharing (CORS) Origin Allow Header',
    prompt: `To protect internal citadel APIs against unauthorized cross-site requests, servers implement Cross-Origin Resource Sharing (CORS).

Which HTTP response header is sent by the server to inform the browser that requests from a specific origin (or wildcard \`*\`) are permitted to read the response?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the header name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{Access-Control-Allow-Origin}',
    hints: [
      {
        hintIndex: 1,
        content: "The CORS origin header is Access-Control-Allow-Origin.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE09',
      seedId: 'HTG-L10-OE09',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "Access-Control-Allow-Origin dictates cross-origin access permissions in modern browsers.",
      essentialKeyPoints: [
        "Misconfigured CORS headers (e.g. reflecting arbitrary origins with credentials) allow data exfiltration.",
        "Browsers enforce Same-Origin Policy (SOP) unless overridden by CORS headers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Access-Control-Allow-Origin}' or 'Access-Control-Allow-Origin'.",
        partialCredit: "Submits lowercase 'access-control-allow-origin'.",
        noCredit: "Submits Origin or Host."
      },
      acceptableAlternatives: ['HTG{Access-Control-Allow-Origin}', 'Access-Control-Allow-Origin', 'access-control-allow-origin', 'ACCESS-CONTROL-ALLOW-ORIGIN', 'HTG{access-control-allow-origin}']
    }
  },
  {
    stableId: 'HTG-L10-OE10',
    order: 10,
    levelNumber: 10,
    title: 'Reconstructed Client DOM Telemetry Signal Token',
    prompt: `An investigator parses an obfuscated HTML element discovered on the central administrative console:
\`\`\`html
<div id="citadel-telemetry"
     data-beacon="CITADEL"
     data-node="ALPHA"
     data-channel="7"
     style="display:none">
</div>
\`\`\`
Concatenating the values of \`data-beacon\`, \`data-node\`, and \`data-channel\` with underscore delimiters produces the telemetry token:
\`\`\`text
CITADEL_ALPHA_7
\`\`\`
What is the complete competition flag for this reconstructed DOM telemetry token?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value.`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Mixed',
    difficulty: 'EXPERT',
    flag: 'HTG{CITADEL_ALPHA_7}',
    hints: [
      {
        hintIndex: 1,
        content: "Assemble the three attribute values: CITADEL_ALPHA_7.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L10-OE10',
      seedId: 'HTG-L10-OE10',
      subtopic: 'Cross-synthesis of Signal Breaker & Web Client Recon',
      explanation: "Concatenating CITADEL, ALPHA, and 7 produces 'CITADEL_ALPHA_7'.",
      essentialKeyPoints: [
        "Web client recon uncovers metadata attributes stashed in hidden DOM nodes.",
        "Reconstructed token provides the first sub-key for the citadel entrance."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{CITADEL_ALPHA_7}'.",
        partialCredit: "Submits 'CITADEL_ALPHA_7' without curly braces.",
        noCredit: "Submits incorrect concatenation."
      },
      acceptableAlternatives: ['HTG{CITADEL_ALPHA_7}', 'CITADEL_ALPHA_7', 'citadel_alpha_7', 'HTG{citadel_alpha_7}']
    }
  }
];

module.exports = subtopic1Questions;
