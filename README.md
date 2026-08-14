# 🔍 KrySearch 🇮🇸

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,35:1E3A8A,70:2563EB,100:38BDF8&height=220&section=header&text=KrySearch&fontSize=46&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Independent%20Community%20Continuation&descAlignY=58" />
</p>

<p align="center">
  <strong>🔎 Search • 🛡️ Privacy • 🔓 Open Source • 🌍 Community</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-GPL--3.0-blue.svg">
  <img src="https://img.shields.io/badge/LibreJS-Compatible-success.svg">
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E.svg">
  <img src="https://img.shields.io/badge/Status-Community%20Maintained-success.svg">
  <img src="https://img.shields.io/badge/Origin-Krynet%2C%20LLC-2563EB.svg">
</p>

> [!NOTE]
> **KrySearch was originally created by Krynet, LLC.**
>
> This repository is an **independent community-maintained fork and continuation** of the original KrySearch project.
>
> It is **not an official Krynet, LLC repository, product, partner project, or UGC Program project.**

---

## ⚠️ Important

The original KrySearch project was created by **Krynet, LLC**.

This repository is maintained independently by **Krynet Community** and may differ from the original project in implementation, security practices, quality standards, features, dependencies, and development direction.

Nothing in this repository should be interpreted as:

* ❌ Official Krynet software
* ❌ An official Krynet release
* ❌ Official Krynet documentation
* ❌ An official Krynet API
* ❌ An official Krynet security recommendation
* ❌ A Krynet partnership
* ❌ Krynet, LLC endorsement
* ❌ Official Krynet UGC Program participation
* ❌ An official Krynet Store listing

> [!CAUTION]
>
> ### 🔐 Different Security & Quality Practices
>
> **Krynet Community does not follow the same security practices or quality practices as the official Krynet Team.**
>
> Community-maintained changes may not receive the same review, testing, auditing, release validation, or security processes used by Krynet, LLC.
>
> Review source code and changes before deploying KrySearch, particularly when operating your own instance or integrating it into another application.

---

## 📖 About

**KrySearch** is a privacy-focused, open-source search router originally created by **Krynet, LLC**.

This community continuation exists to preserve and continue development of the project while allowing independent contributors to maintain, improve, harden, and extend the software.

The project focuses on:

* 🛡️ Privacy-oriented search routing
* 🔓 Free and open-source software
* 🌍 Self-hosting
* 🧱 Lightweight architecture
* ⚡ Minimal dependencies
* 🤝 Community development
* 🧹 Tracking and telemetry reduction

---

## ✨ Features

### 🔍 Privacy-Focused Search Routing

KrySearch can provide configurable search routing through supported search engines.

Features include:

* 🔎 Configurable search engines
* 🔀 Search-engine routing
* 🧹 Query normalization
* 🔗 Direct URL routing
* ⚙️ Configurable engine mappings
* 🧩 Runtime-only request processing

---

### 🛡️ Browser Privacy Protection

The client-side privacy layer provides protections against several common browser tracking and fingerprinting techniques.

Current functionality includes:

* 🎨 Canvas fingerprint noise injection
* 🖥️ WebGL vendor and renderer spoofing
* 🌍 Timezone normalization
* 🗣️ Language and locale normalization
* 🎧 AudioContext fingerprint protection
* 🧠 Hardware-concurrency masking
* 🧹 Tracking-parameter filtering
* 🍪 Cookie-clearing mechanisms
* ⏱️ Resource Timing API protection
* 🚫 `navigator.sendBeacon` blocking
* 🔗 Dynamic tracking-link removal
* 👁️ MutationObserver-based telemetry cleanup

> [!NOTE]
> These mechanisms are intended to **reduce certain tracking and fingerprinting surfaces**. They do not provide complete anonymity.

---

### 🧼 Telemetry Sanitization

KrySearch can remove common tracking mechanisms before requests are processed.

The privacy layer can:

* 🧹 Strip common tracking parameters
* 🚫 Remove `utm_*` parameters
* 🚫 Remove identifiers such as `fbclid` and `gclid`
* 🔗 Detect dynamically inserted tracking links
* ⏱️ Restrict Resource Timing exposure
* 📡 Disable Beacon-based telemetry
* 🍪 Clear configured cookies

---

### 🔑 Minimal-Dependency Architecture

The community continuation favors browser-native APIs wherever practical.

This includes:

* 🔐 Web Crypto API
* 🔒 AES-GCM
* 🔑 ECDH
* 🔗 Native URL APIs
* 🧱 Native DOM APIs
* 🌐 Native browser networking APIs

The goal is to keep the client lightweight and reduce unnecessary third-party dependencies and CDN requirements.

---

### 🟢 LibreJS Compatibility

KrySearch is designed with LibreJS compatibility in mind.

The project favors:

* 📦 Locally hosted JavaScript
* 📜 Explicit script assets
* 🧩 Minimal third-party dependencies
* 🧱 Self-contained browser functionality
* 🔍 Transparent source code

---

### ⚡ Performance

Privacy functionality is implemented with performance in mind.

Current optimizations include:

* ⏳ Deferred security initialization
* ⚡ Efficient tracking-parameter lookups
* 💾 Cached property access
* 🖼️ Image-loading optimization
* 🚫 Reduced unnecessary DNS prefetching
* 📦 Reduced external dependency overhead

---

## 🔧 How It Works

KrySearch operates primarily as a **client-side search routing and privacy layer**.

```text
                 👤 User
                   │
                   ▼
              🏠 index.html
                   │
                   │ Search / URL
                   ▼
              🔎 search.html
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
     🧹 Clean    🛡️ Privacy  🔍 Engine
     Request     Protection  Selection
        │          │          │
        └──────────┼──────────┘
                   │
                   ▼
          🌐 Configured Engine
```

### 🔄 Processing Flow

1. **👤 User Input**

   * A search query or URL is entered.

2. **🧹 Input Normalization**

   * The request is parsed and normalized.

3. **🛡️ Privacy Layer**

   * Tracking parameters and telemetry mechanisms are handled.

4. **🔐 Browser Protection**

   * Supported fingerprinting surfaces are normalized or protected.

5. **🔍 Engine Selection**

   * The configured search engine is selected.

6. **🌐 Request Routing**

   * The processed request is routed to the selected engine.

---

## 🌐 Configuration

Search routing is configured through:

```text
Config/config.json
```

Example:

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

This allows self-hosters and contributors to modify supported search providers without changing the core routing implementation.

---

## 🚀 Installation & Deployment

### 📋 Prerequisites

A modern browser supporting:

* 📦 ES Modules
* 🔐 Web Crypto API
* 🌐 Fetch APIs
* 🧱 Modern DOM APIs
* 🔗 Standard URL APIs

A standard static web server is sufficient for deployment.

### 📥 Local Development

```bash
git clone https://github.com/YourName/KrySearch.git
cd KrySearch/UI

python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Any static web server capable of correctly serving JavaScript modules can be used.

> [!IMPORTANT]
> JavaScript modules must be served with the correct MIME type.
>
> If a `.js` module is returned as `text/html`, browsers such as Firefox will reject it.

---

## 📝 Usage

| Action                  | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| 🔍 **Search**           | Enter a query and route it through the configured search engine |
| 🌐 **URL Routing**      | Process a direct URL through the routing layer                  |
| ⚙️ **Engine Selection** | Select or override the configured search engine                 |
| 🛡️ **Privacy Mode**    | Apply browser privacy and telemetry protections                 |

### 🔗 Query Parameters

| Parameter          | Description                   |
| ------------------ | ----------------------------- |
| `?q=<query>`       | 🔍 Search query               |
| `?url=<url>`       | 🌐 Direct URL routing         |
| `?engine=<engine>` | ⚙️ Override configured engine |

### 💡 Examples

```text
https://krysearch.io/?q=privacy+sovereignty
```

```text
https://krysearch.io/?url=example.com&engine=tor
```

```text
https://yourusername.github.io/KrySearch/search.html?q=test
```

---

## 🛡️ Privacy

KrySearch is designed around minimizing unnecessary browser telemetry and application-level data collection.

### 🔒 Client-Side Protections

The privacy layer includes mechanisms for:

* 🎨 Canvas fingerprinting
* 🖥️ WebGL fingerprinting
* 🎧 AudioContext fingerprinting
* 🧠 Hardware-concurrency fingerprinting
* 🌍 Timezone fingerprinting
* 🗣️ Language and locale fingerprinting
* 🔗 Tracking URL parameters
* ⏱️ Resource Timing
* 📡 Beacon telemetry
* 🧹 Dynamically inserted tracking links
* 🍪 Cookie persistence

### 💾 No Required Application Tracking Database

Core routing functionality does not require a centralized query-history database.

Search processing is intended to occur at runtime rather than through a persistent application-level search-history system.

> [!WARNING]
> **Privacy protection is not anonymity.**
>
> Search engines, hosting providers, ISPs, networks, browsers, extensions, operating systems, and other infrastructure may maintain their own logs or telemetry.
>
> KrySearch cannot control the privacy practices of external services that users choose to access.

---

## 📁 Project Structure

```text
UI/
├── 🏠 index.html
├── 🔎 search.html
├── 🛡️ security-router.js
├── 🖼️ lgoo.png
│
└── ⚙️ Config/
    └── config.json
```

### 🧩 Core Components

| Component            | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `index.html`         | 🏠 Main search interface                           |
| `search.html`        | 🔎 Search processing interface                     |
| `security-router.js` | 🛡️ Privacy, telemetry, and fingerprint protection |
| `Config/config.json` | ⚙️ Search-engine configuration                     |
| `lgoo.png`           | 🎨 Project branding                                |

If additional modules are introduced, keep imports explicit and document their purpose.

---

## 🛣️ Roadmap

Community development may include:

* 🔍 Additional search providers
* 🛡️ Stronger browser privacy protections
* 🧹 Expanded telemetry filtering
* ⚡ Performance improvements
* 🌐 Improved routing
* 🔐 Additional cryptographic functionality
* ♿ Accessibility improvements
* 📱 Mobile UI improvements
* 🧪 Automated testing
* 📚 Documentation improvements
* 🐛 Compatibility fixes
* 🤝 Contributor tooling

Roadmap items are **community goals**, not commitments from Krynet, LLC.

---

## 🤝 Contributing

KrySearch is maintained as a community continuation of the original project.

Contributions are welcome.

### 🔄 Development Workflow

1. 🍴 Fork the repository.
2. 📥 Clone your fork.
3. 🌿 Create a focused branch.
4. 🛠️ Implement your changes.
5. 🧪 Test the changes.
6. 🔍 Check browser-console behavior.
7. 💾 Commit your changes.
8. 🚀 Push the branch.
9. 🔀 Open a pull request.

Example:

```bash
git clone https://github.com/YourName/KrySearch.git
cd KrySearch

git checkout -b feature/privacy-improvement

git add .
git commit -m "Improve privacy routing"
git push origin feature/privacy-improvement
```

Keep contributions:

* 📖 Readable
* 🧩 Focused
* 📝 Documented
* 🔍 Reviewable
* ⚡ Lightweight
* 🤝 Compatible with the existing architecture

---

## 🏛️ Original Project

The original **KrySearch** project was created by **Krynet, LLC**.

### 🔗 Official Krynet Resources

* 🌐 [https://krynet.ai](https://krynet.ai)
* 📦 [https://codeberg.org/Krynet-LLC](https://codeberg.org/Krynet-LLC)
* 💻 [https://gitlab.com/Krynet-Team](https://gitlab.com/Krynet-Team)

The original project's code, trademarks, branding, and other applicable rights remain subject to their respective owners and licenses.

This repository is an **independent community fork and continuation**.

---

## 🧩 Krynet Community

KrySearch is part of a broader community effort around software originating from or related to the Krynet ecosystem.

The community focuses on:

* 🔓 Preserving available source code
* 🛠️ Continuing inactive or abandoned components
* 🧑‍💻 Supporting independent contributors
* 🌍 Supporting self-hosted deployments
* 🛡️ Maintaining privacy-oriented functionality
* 📚 Preserving technical documentation
* 🔬 Experimenting with alternative implementations

The goal is **not to impersonate Krynet, LLC**, but to provide an independent place where community members can continue working on related open-source software.

---

## ⚠️ Community Status

> [!CAUTION]
> KrySearch is **community-maintained software**.
>
> It is not maintained, reviewed, audited, or supported by the official Krynet Team.

Krynet Community does **not follow the same security or quality practices as Krynet, LLC**.

Do not assume that functionality, security behavior, compatibility, or implementation quality is equivalent to an official Krynet product.

---

## 🏪 UGC Program & Partnership Status

> [!IMPORTANT]
> KrySearch is **not an official Krynet UGC Program project** and Krynet Community is **not a Krynet, LLC partner**.
>
> Nothing in this repository should be interpreted as participation in, approval under, or acceptance into Krynet's official creator or UGC programs.

Official Krynet UGC opportunities, creator programs, Store policies, and related information should be obtained directly from **Krynet, LLC**.

---

## 📄 License

KrySearch is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

See [`LICENSE`](LICENSE) for the complete license terms.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,35:1E3A8A,70:2563EB,100:38BDF8&height=120&section=footer" />
</p>

<p align="center">
  🔍 <strong>KrySearch</strong> · 🛡️ Privacy · 🔓 Open Source · 🤝 Community Maintained
</p>

<p align="center">
  <strong>Not Official Krynet Software · Not a Krynet Partner · Not Part of the Krynet UGC Program</strong>
</p>
