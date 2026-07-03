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
| 🛡️ Fingerprint Hardening | **[New]** Normalizes Canvas data, flattens `getBoundingClientRect` DOM vectors, masks network connection types, and caps `performance.now()` precision to mitigate hardware timing/side-channel attacks. |
| 🧼 Telemetry Sanitizer | **[New]** Flushes active tracking URL parameters (`utm_*`, `fbclid`, `gclid`), strips out speculative pre-fetching links dynamically via a unified `MutationObserver`, and flushes storage states on navigation. |
| 🔑 Zero-Knowledge Relay | **[New]** Structural input sanitization coupled with an asynchronous cryptographic sealing process using localized ECDH and AES-GCM 256. |
| 🌐 Multi-Provider DoH | **[New]** Integrates a parallel racing DNS over HTTPS lookup engine checking across Quad9, Google, and Cloudflare. |
| 🔀 Multiple Engines | Open-source & closed-source backend options |
| 🧱 No Cloud Dependencies | **[New]** Zero-dependency design. All core cryptographic and sanitation primitives execute via hardened local logic to remain independent of external network CDNs. |

---

## 🔧 How It Works

**KrySearch** acts as a secure processing gateway layer:

1. **User Input** – The user inputs a query or direct tracking link.
2. **Environment Normalization** – Core runtime elements are immediately overridden to obscure the specific browser fingerprint profile.
3. **Telemetry Cleansing** – Tracking query parameters are scrubbed, and domain lookups are validated.
4. **Search Routing** – The clean request is forwarded directly to the selected target engine.

---

## 🚀 Installation & Deployment

> [!CRITICAL]
> **Hosting on Standard GitHub Pages is Not Supported**
> GitHub Pages enforces content-type handling restrictions that serve internal script files as `text/plain`, which triggers strict browser MIME type blocking on native ES Modules. Furthermore, GitHub Pages cannot handle the cross-origin headers required to preserve deep anti-fingerprinting isolations. KrySearch **must** be run using a local web server, containerized instance, or dedicated host mapped to a domain like `krysearch.io`.

### Prerequisites

- A modern web browser supporting native ES Modules (Chrome, Firefox, Safari, Edge)
- Python 3+, Node.js (for `http-server`), or any standard static web server tool

### Local Implementation Steps

```bash
# Clone the official repository
git clone [https://github.com/Krynet-LLC/KrySearch.git](https://github.com/Krynet-LLC/KrySearch.git)

# Enter the project directory
cd KrySearch/UI

# Start a local self-contained web server to process the module imports:
# Option A: Python
python3 -m http-server 8080

# Option B: Node.js http-server
npx http-server -p 8080

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
[https://krysearch.io/?q=privacy+sovereignty](https://krysearch.io/?q=privacy+sovereignty)
[https://krysearch.io/?url=example.com&engine=tor](https://krysearch.io/?url=example.com&engine=tor)

```

---

## 🛡️ Privacy & Jurisdictional Security 🇮🇸

* **Icelandic Jurisdiction** – Krynet, LLC operates out of Iceland 🇮🇸, utilizing the region's robust data protection laws, freedom of expression protections, and isolation from invasive multi-national bulk surveillance data sharing programs.
* **No Data Retention** – Queries are structurally handled purely at runtime; no query tracking database, transaction logs, or cookie structures exist.
* **Hardware Footprint Masking** – Standardizes `hardwareConcurrency` to uniform thresholds, effectively blending your request profile into a massive crowd of generic devices.

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
      "url": "[https://customengine.org/search?q=](https://customengine.org/search?q=){query}"
    }
  }
}

```

If you introduce additional localized script assets into the `/UI/Modules/` workspace, map their aliases within the `importmap` block inside `index.html`:

```html
<script type="importmap">
  {
    "imports": {
      "security-router": "./Modules/security-router.js",
      "new-module": "./Modules/new-module.js"
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
