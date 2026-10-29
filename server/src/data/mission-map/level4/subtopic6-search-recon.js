const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic6Questions = [
  {
    stableId: 'HTG-L04-OE51',
    order: 51,
    levelNumber: 4,
    title: 'Search Engine Dorking File Extension Operator',
    prompt: `A penetration tester conducts open-source reconnaissance to find exposed configuration files:

\`\`\`text
site:griddefense.test filetype:env "DB_PASSWORD"
\`\`\`

Which specific search operator is utilized in this query to restrict returned web results to documents matching a particular file extension (submit the operator keyword without the colon)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the operator name, e.g. filetype).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{filetype}',
    hints: [
      {
        hintIndex: 1,
        content: "The operator is 'filetype' (or its synonym 'ext').",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE51',
      seedId: 'HTG-L04-OE51',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "Google and Bing support the 'filetype:' operator to filter search results by specific file extensions like pdf, env, sql, or log.",
      essentialKeyPoints: [
        "Advanced search operators (Google dorks) isolate exposed files indexed by search spiders.",
        "The filetype operator targets high-risk extensions commonly deployed without access control."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{filetype}' or 'filetype'.",
        partialCredit: "Submits uppercase 'FILETYPE' or 'filetype:'.",
        noCredit: "Submits other operators like site: or inurl:."
      },
      acceptableAlternatives: ['HTG{filetype}', 'filetype', 'FILETYPE', 'filetype:', 'ext']
    }
  },
  {
    stableId: 'HTG-L04-OE52',
    order: 52,
    levelNumber: 4,
    title: 'Robots Exclusion Standard Directory Discovery',
    prompt: `An auditor fetches the \`/robots.txt\` file from a target web server:

\`\`\`text
User-agent: *
Disallow: /admin-console-secret-994/
Disallow: /temp-uploads/
Allow: /public/
\`\`\`

While \`robots.txt\` requests that compliant search web crawlers refrain from indexing listed paths, it inadvertently publishes sensitive paths to attackers.

Extract the administrative path specified in the first \`Disallow:\` directive (including leading and trailing slashes).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the path).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{/admin-console-secret-994/}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the exact string following 'Disallow: ' on line 2.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE52',
      seedId: 'HTG-L04-OE52',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "Robots.txt is an advisory protocol for web crawlers. Disallow rules are public and frequently highlight sensitive, unlinked directories.",
      essentialKeyPoints: [
        "Robots.txt provides no access control or confidentiality guarantees.",
        "Parsing robots.txt is a standard preliminary step in OSINT web reconnaissance."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{/admin-console-secret-994/}' or '/admin-console-secret-994/'.",
        partialCredit: "Submits 'admin-console-secret-994' without surrounding slashes.",
        noCredit: "Submits /temp-uploads/ or /public/."
      },
      acceptableAlternatives: [
        'HTG{/admin-console-secret-994/}',
        '/admin-console-secret-994/',
        '/admin-console-secret-994',
        'admin-console-secret-994',
        'HTG{admin-console-secret-994}'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE53',
    order: 53,
    levelNumber: 4,
    title: 'RFC 9116 Security Policy Contact Extraction',
    prompt: `An ethical hacker queries the standardized security policy endpoint at \`https://griddefense.test/.well-known/security.txt\`:

\`\`\`text
Contact: mailto:security-response@griddefense.test
Expires: 2027-01-01T00:00:00.000Z
Preferred-Languages: en
Policy: https://griddefense.test/security-policy.html
Canonical: https://griddefense.test/.well-known/security.txt
\`\`\`

Under RFC 9116, the \`Contact:\` directive publishes authorized channels for vulnerability reporting.

Extract the security contact email address specified in this file (excluding the 'mailto:' prefix).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the email address).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{security-response@griddefense.test}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the email text following 'mailto:'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE53',
      seedId: 'HTG-L04-OE53',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "RFC 9116 defines the format of /.well-known/security.txt for responsible vulnerability disclosure. The contact email is security-response@griddefense.test.",
      essentialKeyPoints: [
        "security.txt provides a machine-readable declaration of security reporting channels.",
        "Security.txt discovery is an OSINT method for identifying authorized security POCs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{security-response@griddefense.test}' or 'security-response@griddefense.test'.",
        partialCredit: "Submits 'mailto:security-response@griddefense.test'.",
        noCredit: "Submits policy URL or canonical URL."
      },
      acceptableAlternatives: [
        'HTG{security-response@griddefense.test}',
        'security-response@griddefense.test',
        'mailto:security-response@griddefense.test'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE54',
    order: 54,
    levelNumber: 4,
    title: 'Internet Archive Wayback Machine Timestamp Extraction',
    prompt: `An investigator examines an archived historical snapshot of an adversary landing page on the Internet Archive Wayback Machine:

\`\`\`text
https://web.archive.org/web/20260215183000/http://target.griddefense.test/
\`\`\`

In Wayback Machine URL syntax, the numerical path segment between \`/web/\` and the target URL represents the capture timestamp in \`YYYYMMDDhhmmss\` format.

Extract this 14-digit capture timestamp string.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 14-digit number).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{20260215183000}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the 14-digit number: 20260215183000.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE54',
      seedId: 'HTG-L04-OE54',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "Wayback Machine URLs embed timestamps formatted as YYYYMMDDhhmmss (Feb 15, 2026 at 18:30:00 UTC). The timestamp is 20260215183000.",
      essentialKeyPoints: [
        "Wayback Machine timestamps establish when a specific web page version was scraped.",
        "Historical web archiving enables temporal recovery of deleted content and indicators."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{20260215183000}' or '20260215183000'.",
        partialCredit: "Submits ISO date representation.",
        noCredit: "Submits target URL or incomplete timestamp."
      },
      acceptableAlternatives: ['HTG{20260215183000}', '20260215183000']
    }
  },
  {
    stableId: 'HTG-L04-OE55',
    order: 55,
    levelNumber: 4,
    title: 'XML Sitemap Sensitive Documentation Discovery',
    prompt: `An analyst parses an unlinked \`sitemap.xml\` file discovered on an exposed web server:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://grid.test/internal-docs/architecture-v3.html</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
\`\`\`

Extract the filename of the internal architecture document listed in the \`<loc>\` tag (e.g. filename with extension).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the filename).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{architecture-v3.html}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the last path segment: 'architecture-v3.html'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE55',
      seedId: 'HTG-L04-OE55',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "XML sitemaps designed for search engines frequently index non-public documentation pages left accessible by developers. The file is architecture-v3.html.",
      essentialKeyPoints: [
        "Sitemaps provide comprehensive catalogs of site hierarchy without requiring active crawlers.",
        "Internal staging documents inadvertently published to sitemaps create information disclosures."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{architecture-v3.html}' or 'architecture-v3.html'.",
        partialCredit: "Submits full URL path.",
        noCredit: "Submits base domain."
      },
      acceptableAlternatives: [
        'HTG{architecture-v3.html}',
        'architecture-v3.html',
        'ARCHITECTURE-V3.HTML'
      ]
    }
  },
  {
    stableId: 'HTG-L04-OE56',
    order: 56,
    levelNumber: 4,
    title: 'Web Server Directory Listing Software Banner Disclosure',
    prompt: `A web reconnaissance scan encounters an open directory listing page displaying the default server signature banner at the bottom:

\`\`\`text
Index of /backups
[ICO] Name                    Last modified      Size
[DIR] Parent Directory        -                  -
[   ] grid-dump-2026.sql      2026-03-12 14:00   12M

Apache/2.4.52 (Ubuntu) Server at repo.grid.local Port 80
\`\`\`

Identify the exact software version of the Apache HTTP Server reported in this footer signature.

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the version number, e.g. 2.4.52).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{2.4.52}',
    hints: [
      {
        hintIndex: 1,
        content: "Extract the version number directly following 'Apache/'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE56',
      seedId: 'HTG-L04-OE56',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "Default Apache directory listings append ServerSignature banners disclosing web server software and operating system versions (Apache 2.4.52 on Ubuntu).",
      essentialKeyPoints: [
        "ServerSignature and ServerTokens directives should be disabled to prevent version disclosure.",
        "Directory indexing (Options +Indexes) leaks internal files and software configurations."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{2.4.52}' or '2.4.52'.",
        partialCredit: "Submits 'Apache 2.4.52'.",
        noCredit: "Submits Ubuntu or Port 80."
      },
      acceptableAlternatives: ['HTG{2.4.52}', '2.4.52', 'Apache/2.4.52']
    }
  },
  {
    stableId: 'HTG-L04-OE57',
    order: 57,
    levelNumber: 4,
    title: 'Search Engine Title Operator Dorking Syntax',
    prompt: `A penetration testing team constructs a targeted search query to discover unindexed directory listings containing database dumps:

\`\`\`text
intitle:"Index of /" "backup.sql"
\`\`\`

Which search engine operator keyword searches exclusively within the HTML \`<title>\` element of indexed web pages (submit the operator keyword without the colon)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the operator keyword).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{intitle}',
    hints: [
      {
        hintIndex: 1,
        content: "The keyword is 'intitle'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE57',
      seedId: 'HTG-L04-OE57',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "The 'intitle:' operator forces search engines to match strings exclusively inside the HTML <title> tag.",
      essentialKeyPoints: [
        "Default web server directory listings have titles beginning with 'Index of /'.",
        "Targeted title searching efficiently locates misconfigured web servers."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{intitle}' or 'intitle'.",
        partialCredit: "Submits 'intitle:' with colon.",
        noCredit: "Submits inurl or site."
      },
      acceptableAlternatives: ['HTG{intitle}', 'intitle', 'INTITLE', 'intitle:']
    }
  },
  {
    stableId: 'HTG-L04-OE58',
    order: 58,
    levelNumber: 4,
    title: 'Wayback CDX API HTTP Success Status Code',
    prompt: `An OSINT researcher uses the Internet Archive CDX Server API to programmatically search historical URLs:

\`\`\`json
[
  ["urlkey", "timestamp", "original", "mimetype", "statuscode", "digest", "length"],
  ["org,grid)/path", "20260215183000", "http://grid.org/path", "text/html", "200", "HASH31", "4120"]
]
\`\`\`

In standard HTTP (RFC 9110) specifications, which 3-digit status code represents a successful \`OK\` response recorded in the \`statuscode\` column?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 3-digit status code).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{200}',
    hints: [
      {
        hintIndex: 1,
        content: "The standard HTTP status code for 'OK' is 200.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE58',
      seedId: 'HTG-L04-OE58',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "HTTP status code 200 signifies success (OK). CDX indexes record the exact HTTP response code returned during crawler archiving.",
      essentialKeyPoints: [
        "CDX APIs allow programmatic querying of massive historical web snapshots.",
        "Filtering by statuscode=200 excludes 404 Not Found and redirect pages."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{200}' or '200'.",
        partialCredit: "Submits 'HTTP 200'.",
        noCredit: "Submits 404 or 301."
      },
      acceptableAlternatives: ['HTG{200}', '200', 'HTTP 200']
    }
  },
  {
    stableId: 'HTG-L04-OE59',
    order: 59,
    levelNumber: 4,
    title: 'Reverse Proxy Response Header Software Attribution',
    prompt: `During an active web reconnaissance probe, an investigator inspects the raw HTTP response headers returned by an endpoint:

\`\`\`http
HTTP/1.1 200 OK
Date: Mon, 16 Mar 2026 12:00:00 GMT
Content-Type: text/html; charset=utf-8
Server: Caddy/v2.7.4
Strict-Transport-Security: max-age=31536000; includeSubDomains
Connection: keep-alive
\`\`\`

Identify the name of the modern Go-based web server and reverse proxy identified in the \`Server:\` header (excluding the version string).

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the server name, e.g. Caddy).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{Caddy}',
    hints: [
      {
        hintIndex: 1,
        content: "The web server name is 'Caddy'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE59',
      seedId: 'HTG-L04-OE59',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "The Server response header often discloses the backend web daemon. Caddy is an open-source web server with automatic HTTPS written in Go.",
      essentialKeyPoints: [
        "Server header disclosures reveal technology stacks and potential version vulnerabilities.",
        "Fingerprinting web servers guides exploit selection during vulnerability assessments."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Caddy}' or 'Caddy'.",
        partialCredit: "Submits lowercase 'caddy' or uppercase 'CADDY'.",
        noCredit: "Submits version string v2.7.4."
      },
      acceptableAlternatives: ['HTG{Caddy}', 'Caddy', 'caddy', 'CADDY']
    }
  },
  {
    stableId: 'HTG-L04-OE60',
    order: 60,
    levelNumber: 4,
    title: 'Flash Cross-Domain Policy Wildcard Vulnerability',
    prompt: `A legacy web reconnaissance check against an internal management interface retrieves the file \`/crossdomain.xml\`:

\`\`\`xml
<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/crossdomain.dtd">
<cross-domain-policy>
  <site-control permitted-cross-domain-policies="all"/>
  <allow-access-from domain="*"/>
</cross-domain-policy>
\`\`\`

Which single wildcard character configured in the \`domain\` attribute unsafely permits arbitrary domains to read authenticated responses via legacy browser plugins?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the character, e.g. *).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Forensics',
    difficulty: 'MEDIUM',
    flag: 'HTG{*}',
    hints: [
      {
        hintIndex: 1,
        content: "The universal wildcard symbol is the asterisk (*).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L04-OE60',
      seedId: 'HTG-L04-OE60',
      subtopic: 'Advanced Search Operators & Web Reconnaissance',
      explanation: "Setting domain='*' in crossdomain.xml grants universal read access to any origin, enabling cross-site data theft and session hijacking.",
      essentialKeyPoints: [
        "Cross-domain policy files define permissions for plugin-based cross-origin interactions.",
        "Overly permissive wildcard configurations represent severe information disclosure risks."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{*}' or '*'.",
        partialCredit: "Submits 'asterisk' or 'wildcard'.",
        noCredit: "Submits 'all'."
      },
      acceptableAlternatives: ['HTG{*}', '*', 'asterisk', 'wildcard', 'HTG{asterisk}']
    }
  }
];

module.exports = subtopic6Questions;

