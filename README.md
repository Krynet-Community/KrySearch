<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,35:1E3A8A,70:2563EB,100:38BDF8&height=200&section=header&text=KrySearch&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Community-maintained%20Krynet%20continuation&descAlignY=58" />
</p>

<h1 align="center">🔍 KrySearch 🇮🇸</h1>

<p align="center">
  Community-maintained continuation of the original <strong>KrySearch</strong> project created by <strong>Krynet, LLC</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-GPL--3.0-blue">
  <img src="https://img.shields.io/badge/LibreJS-Compatible-success">
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E">
  <img src="https://img.shields.io/badge/Status-Community%20Maintained-success">
  <img src="https://img.shields.io/badge/Origin-Krynet%2C%20LLC-2563EB">
</p>

> [!NOTE]
> **KrySearch was originally created by Krynet, LLC as a privacy-first search routing project.**
>
> This repository is a **community-maintained fork and continuation** of the original KrySearch project. It is independently maintained and is **not an official Krynet, LLC repository**.

---

## 📖 About

**KrySearch** is a privacy-focused, open-source search router designed to give users greater control over how search requests are processed.

The original project was created by **Krynet, LLC** with an emphasis on privacy, free software, alternative search engines, and reducing unnecessary tracking.

This community continuation builds upon that foundation while allowing contributors to maintain, improve, harden, and extend the project independently.

The project aims to remain:

* 🛡️ Privacy-focused
* 🔓 Free and open source
* 🌍 Self-hostable
* 🧱 Lightweight
* ⚡ Dependency-conscious
* 🤝 Community maintained

---

## ✨ Features

### 🔍 Privacy-Focused Search Routing

* Route searches through configurable search engines
* Support multiple backend engines
* Clean search parameters before routing
* Support direct URL routing
* Configurable engine mappings
* Runtime-only request processing

### 🛡️ Browser Privacy Protection

The project includes an extensive client-side privacy layer.

Current functionality includes:

* Canvas fingerprint noise injection
* WebGL vendor and renderer spoofing
* Timezone normalization
* Language and locale normalization
* AudioContext fingerprint protection
* Hardware concurrency masking
* Tracking-parameter filtering
* Cookie-clearing mechanisms
* Resource Timing API protection
* `navigator.sendBeacon` blocking
* Dynamic tracking-link removal
* MutationObserver-based telemetry cleanup

The goal is to reduce passive browser fingerprinting and unnecessary telemetry while keeping the implementation understandable and self-hostable.

### 🧼 Telemetry Sanitization

KrySearch actively works to remove common tracking mechanisms.

The privacy layer can:

* Strip common tracking parameters
* Remove `utm_*` parameters
* Remove identifiers such as `fbclid` and `gclid`
* Detect dynamically inserted tracking links
* Prevent speculative resource timing exposure
* Disable Beacon-based telemetry
* Clear cookies across configured domains and paths

### 🔑 Zero-Dependency Architecture

The community continuation emphasizes browser-native functionality wherever practical.

Security and cryptographic functionality can use native Web APIs rather than external libraries.

This includes:

* Native Web Crypto API
* AES-GCM encryption
* ECDH key exchange
* Native URL processing
* Native HTML handling
* Native browser APIs

The architecture is designed to minimize dependency and CDN requirements.

### 🟢 LibreJS Compatibility

KrySearch is designed with LibreJS compatibility in mind.

The project favors:

* Locally hosted JavaScript
* Explicit script assets
* Minimal third-party dependencies
* Self-contained browser functionality
* Transparent source code

### ⚡ Performance

Privacy protections are implemented with performance in mind.

Current optimizations include:

* Deferred security initialization
* Set-based tracking-parameter lookups
* Cached property access
* Lazy/eager image-loading optimization
* Removal of unnecessary DNS prefetching
* Reduced external dependency overhead

---

## 🔧 How It Works

KrySearch operates as a client-side search routing and privacy layer.

```text
User
 │
 ▼
index.html
 │
 │ Search query / URL
 ▼
search.html
 │
 ├── Input normalization
 │
 ├── Tracking cleanup
 │
 ├── Browser privacy protections
 │
 ├── Fingerprint protection
 │
 └── Search engine selection
 │
 ▼
Configured Search Engine
```

### Processing Flow

1. **User Input**

   * A search query or URL is entered through the interface.

2. **Input Normalization**

   * The request is parsed and normalized before routing.

3. **Privacy Layer**

   * Tracking parameters and telemetry mechanisms are handled before the request proceeds.

4. **Browser Protection**

   * Fingerprinting surfaces such as Canvas, WebGL, AudioContext, timezone, and hardware concurrency are normalized or protected.

5. **Engine Selection**

   * The configured search engine is selected according to the routing configuration.

6. **Request Routing**

   * The cleaned request is forwarded to the selected engine.

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

This allows self-hosters and contributors to add or modify supported search providers without changing the core routing logic.

---

## 🚀 Installation & Deployment

### Prerequisites

A modern browser supporting:

* ES Modules
* Web Crypto API
* Standard Fetch APIs
* Modern DOM APIs

A standard static web server can be used for local deployment.

### Local Development

```bash
git clone https://github.com/YourName/KrySearch.git
cd KrySearch/UI

python3 -m http.server 8080
```

Alternatively, use any standard static web server capable of serving JavaScript modules correctly.

Then open:

```text
http://localhost:8080
```

> [!IMPORTANT]
> GitHub Pages and other static hosting providers must serve JavaScript files with the correct MIME type. If a module is returned as `text/html`, the browser will reject it.

---

## 📝 Usage

| Action              | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| 🔍 Search           | Enter a query and route it through the configured search engine |
| 🌐 URL Routing      | Process a direct URL through the routing layer                  |
| ⚙️ Engine Selection | Select or override the configured search engine                 |
| 🛡️ Privacy Mode    | Apply the browser privacy and telemetry protections             |

### Query Parameters

| Parameter          | Description                           |
| ------------------ | ------------------------------------- |
| `?q=<query>`       | Search query                          |
| `?url=<url>`       | Direct URL routing                    |
| `?engine=<engine>` | Override the configured search engine |

### Examples

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

KrySearch is designed around minimizing unnecessary data collection and browser telemetry.

### Client-Side Protections

The privacy layer includes protections for:

* Canvas fingerprinting
* WebGL fingerprinting
* AudioContext fingerprinting
* Hardware-concurrency fingerprinting
* Timezone fingerprinting
* Language/locale fingerprinting
* Tracking URL parameters
* Resource Timing
* Beacon telemetry
* Dynamically inserted tracking links
* Cookie persistence

### No Application Tracking Database

The project does not require a centralized query-history database for its core routing functionality.

Search processing is intended to happen at runtime rather than through a persistent application-level search history system.

> [!NOTE]
> Browser privacy protections are not equivalent to anonymity. Search engines, hosting providers, networks, browsers, extensions, and other infrastructure can still have their own logging and tracking policies.

---

## 🧩 Project Structure

```text
UI/
├── index.html
├── search.html
├── security-router.js
├── lgoo.png
└── Config/
    └── config.json
```

### Core Components

| Component            | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `index.html`         | Main search interface                          |
| `search.html`        | Search processing interface                    |
| `security-router.js` | Privacy, telemetry, and fingerprint protection |
| `Config/config.json` | Search engine configuration                    |
| `lgoo.png`           | Project branding                               |

If additional local modules are introduced, keep their imports explicit and document their purpose within the project structure.

---

## 🛣️ Roadmap

Community development may include:

* 🔍 Additional search providers
* 🛡️ Stronger browser privacy protections
* 🧹 Expanded telemetry filtering
* ⚡ Performance improvements
* 🌐 Improved routing capabilities
* 🔐 Additional cryptographic functionality
* ♿ Accessibility improvements
* 📱 Mobile UI improvements
* 🧪 Automated testing
* 📚 Better documentation
* 🐞 Compatibility fixes
* 🤝 Contributor tooling

---

## 🤝 Contributing

KrySearch is maintained as a community continuation of the original project.

Contributions are welcome.

### Development Workflow

1. Fork the repository.
2. Clone your fork.
3. Create a focused feature branch.
4. Implement and test your changes.
5. Verify browser-console behavior.
6. Commit your changes.
7. Push the branch.
8. Open a pull request.

Example:

```bash
git clone https://github.com/YourName/KrySearch.git
cd KrySearch

git checkout -b feature/privacy-improvement

git add .
git commit -m "Improve privacy routing"
git push origin feature/privacy-improvement
```

Keep changes focused, readable, and compatible with the project's lightweight architecture.

---

## 🏢 About the Original Krynet Project

The original **KrySearch** project was created by **Krynet, LLC**.

Official Krynet resources:

* 🌐 https://krynet.ai
* 📦 https://codeberg.org/Krynet-LLC
* 💻 https://gitlab.com/Krynet-Team

KrySearch's original project and branding belong to their respective owners.

This repository is a **community-maintained fork/continuation** and should not be interpreted as an official Krynet, LLC project.

---

## 🇮🇸 Krynet Community

This project is part of a broader community effort to preserve, maintain, and extend open-source software originating from the Krynet ecosystem.

The community approach focuses on:

* 🔓 Keeping source code available
* 🛠️ Continuing abandoned or inactive components
* 🧑‍💻 Encouraging independent contributors
* 🌍 Supporting self-hosted deployments
* 🛡️ Preserving privacy-oriented functionality
* 📚 Maintaining clear technical documentation

The goal is not to impersonate the original organization, but to **keep useful open-source work alive and make continued development possible**.

---

## 📄 License

KrySearch is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

See the official GNU license text for the complete terms.

---

<p align="center">

❤️ Preserving privacy-focused open-source software through community development.

</p>
