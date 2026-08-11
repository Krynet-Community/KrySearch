# 🔍 KrySearch 🇮🇸

[![LibreJS Compatible](https://img.shields.io/badge/LibreJS-OK-success?style=flat)](https://www.gnu.org/software/librejs/)   
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)   
[![GitHub stars](https://img.shields.io/github/stars/Krynet-LLC/KrySearch?style=social)](https://github.com/Krynet-LLC/KrySearch/stargazers)   

**KrySearch** is a **privacy-first, open-source search router** built by **Krynet, LLC**. It safely routes your internet searches through multiple engines **without logging or storing any personal data**. It is fully **GPL 3.0 licensed** and operates out of **Iceland** 🇮🇸 to leverage premium European data sovereignty and strict privacy legal structures.

Search privately, strip corporate tracking telemetry, neutralize active browser tracking, and regain control over your online identity.

🌐 **Official Instance:** [https://krysearch.io](https://krysearch.io)

---

## ⚡ Features & Recent Enhancements

| Feature | Description |
|---------|-------------|
| ✅ LibreJS Compatible | Fully compatible with LibreJS |
| 🟢 Free Software | GPL-3.0-or-later, self-hosted JS |
| 🛡️ Advanced Fingerprint Protection | **[New]** Comprehensive anti-fingerprinting suite: Canvas noise injection (2% randomization), WebGL vendor/renderer spoofing, timezone standardization (UTC), language/locale normalization, AudioContext fingerprint protection, and hardware concurrency masking. Blocks 50+ tracking parameters including `utm_*`, `fbclid`, `gclid`, and platform-specific identifiers. |
| 🧼 Telemetry Sanitizer | Flushes active tracking URL parameters, strips speculative pre-fetching links via `MutationObserver`, blocks Resource Timing API, disables `navigator.sendBeacon`, and implements multi-domain/path cookie clearing. |
| 🔑 Zero-Dependency Architecture | **[New]** Complete removal of external CDN dependencies (esm.sh). All cryptographic operations use native Web Crypto API (AES-GCM, ECDH). Native implementations replace DOMPurify, query-string, IDNA/UTS46, and HTML entities libraries. Works fully offline. |
| 🌐 Native Search Interface | **[New]** Dedicated `search.html` page eliminates GitHub Pages MIME-type issues. Inline script execution prevents code display bugs. Guard clauses prevent infinite reload loops on home page. |
| 🔀 Multiple Engines | Open-source & closed-source backend options |
| ⚡ Performance Optimized | Deferred security initialization, O(1) Set-based parameter lookups, DNS prefetching removed (no external deps), lazy/eager image loading optimization, cached property access. |

---

## 🔧 How It Works

**KrySearch** acts as a secure processing gateway layer:

1. **User Input** – The user inputs a query or direct tracking link via `index.html`.
2. **Native Search Routing** – Request is directed to `search.html`, which executes inline JavaScript without external dependencies.
3. **Environment Normalization** – Core runtime elements are immediately overridden: Canvas noise injected, WebGL spoofed, timezone/language standardized, AudioContext protected.
4. **Telemetry Cleansing** – 50+ tracking parameters scrubbed, cookies flushed across domains/paths, Resource Timing API blocked, sendBeacon disabled.
5. **Zero-Knowledge Processing** – Input sanitized using native implementations, encrypted via Web Crypto API (AES-GCM), and forwarded to target engine.
6. **Search Routing** – The clean request is forwarded directly to the selected target engine with no logging or retention.

---

## 🚀 Installation & Deployment

> [!NOTE]
> **GitHub Pages Compatibility**
> KrySearch now includes `search.html` with inline JavaScript to resolve GitHub Pages MIME-type issues that previously caused `.js` files to display as plain text. However, for full privacy protection and anti-fingerprinting isolation, deployment on a dedicated domain (e.g., `krysearch.io`) with proper HTTPS headers is still recommended over standard GitHub Pages hosting.

### Prerequisites

- A modern web browser supporting native ES Modules (Chrome, Firefox, Safari, Edge)
- Python 3+, Node.js (for `http-server`), or any standard static web server tool

### Local Implementation Steps

```bash
# Clone the official repository
git clone https://github.com/Krynet-LLC/KrySearch.git

# Enter the project directory
cd KrySearch/UI

# Start a local self-contained web server:
# Option A: Python 3
python3 -m http.server 8080

# Option B: Node.js http-server
npx http-server -p 8080

# Option C: Direct GitHub Pages deployment
# Upload contents of UI/ folder to your GitHub repository
# Enable GitHub Pages in repository settings
# Access via: https://yourusername.github.io/KrySearch/search.html
```

Open your browser and navigate to `http://localhost:8080` to access the interface.

---

## 📝 Usage

| Action | Description |
| --- | --- |
| 🔍 Search | Enter queries or URLs into the routing input bar |
| ⚙️ Select Engine | Define your preferred alternative engine using the parameters |
| 🕵️ Privacy Mode | All queries execute without saving tracking states |

### Query Parameters

| Parameter | Use |
| --- | --- |
| `?q=<query>` | Cleaned search query input |
| `?url=<url>` | Sanitized direct web route redirection |
| `?engine=<engine>` | Overrides default engine selection mapping |

**Example URLs (Production Formatting):**

```
https://krysearch.io/?q=privacy+sovereignty
https://krysearch.io/?url=example.com&engine=tor
https://yourusername.github.io/KrySearch/search.html?q=test
```

---

## 🛡️ Privacy & Jurisdictional Security 🇮🇸

* **Icelandic Jurisdiction** – Krynet, LLC operates out of Iceland 🇮🇸, utilizing the region's robust data protection laws, freedom of expression protections, and isolation from invasive multi-national bulk surveillance data sharing programs.
* **No Data Retention** – Queries are structurally handled purely at runtime; no query tracking database, transaction logs, or cookie structures exist.
* **Comprehensive Fingerprint Protection** – Canvas noise injection (2% randomization), WebGL vendor/renderer spoofing, timezone standardization (UTC), language/locale normalization, AudioContext protection, hardware concurrency masking, and blocking of 50+ tracking parameters.
* **Zero External Dependencies** – All cryptographic operations use native Web Crypto API. No CDN connections, no third-party libraries, works fully offline.
* **Advanced Telemetry Blocking** – Resource Timing API disabled, navigator.sendBeacon blocked, multi-domain/path cookie clearing, MutationObserver strips tracking links dynamically.

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Clone your personal fork:

```bash
git clone [https://github.com/YourName/KrySearch.git](https://github.com/YourName/KrySearch.git)

```

3. Initialize a working branch:

```bash
git checkout -b feature/hardened-privacy-layer

```

4. Implement your changes and perform console verification checks.
5. Commit and push:

```bash
git commit -am "Implement advanced input normalization logic"
git push origin feature/hardened-privacy-layer

```

6. Open a pull request against our `main` branch.

---

## ⚙️ Extending KrySearch

Edit your local `./Config/config.json` file to update your search routing mapping matrix:

```json
{
  "search": {
    "defaultEngine": "open_source_target"
  },
  "engines": {
    "my_engine": {
      "name": "Custom Engine",
      "url": "https://customengine.org/search?q={query}"
    }
  }
}

```

### File Structure

```
UI/
├── index.html          # Home page with search form
├── search.html         # Search processor (inline JS, no external deps)
├── security-router.js  # Core privacy & fingerprint protection module
├── lgoo.png            # Logo image
└── Config/
    └── config.json     # Search engine configuration
```

If you introduce additional localized script assets into the `/UI/` workspace, map their aliases within the `importmap` block inside `index.html`:

```html
<script type="importmap">
  {
    "imports": {
      "security-router": "./security-router.js",
      "new-module": "./new-module.js"
    }
  }
</script>
```

---

## 🏢 About Krynet, LLC

Krynet, LLC is a privacy-first tech company building secure, decentralized, and audited alternatives to mainstream infrastructure. Based out of Iceland 🇮🇸, our ecosystem focuses on delivering performance-optimized utility applications that respect individual human data rights.

* 🌐 Corporate Portal: [https://krynet.ai](https://krynet.ai)
* 🔍 Application Domain: [https://krysearch.io](https://www.google.com/url?sa=E&source=gmail&q=https://krysearch.io)
* ✉️ Secure Communications: contact@krynet.ai

---

## 🔑 License

KrySearch is free software licensed under the terms of the **GNU GPL v3**. See the [Official GNU License Portal](https://www.gnu.org/licenses/gpl-3.0) for detailed rights, distribution rules, and copyleft specifications.


```
