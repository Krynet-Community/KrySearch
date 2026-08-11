"use strict";

// KrySearch - Privacy-focused search router
// This module handles secure search redirection with anti-fingerprinting protection

// Only run if we have search parameters
const params = new URLSearchParams(location.search);
const query = params.get("q");
const directUrl = params.get("url");

if (!query && !directUrl) {
  // No search parameters, don't run
  console.log("[KrySearch] No search parameters, skipping initialization");
} else {
  // Early error handler for graceful degradation
  window.addEventListener('unhandledrejection', function(e) {
    console.warn('[KrySearch] Unhandled promise:', e.reason);
    e.preventDefault();
  });
  
  const init = async () => {
      // Dynamically import the security router
      let KrySecurityRouter;
      try {
        const module = await import('./Modules/security-router.js');
        KrySecurityRouter = module.KrySecurityRouter;
      } catch (err) {
        console.error("[KrySearch] Failed to load security module:", err);
        // Use fallback without security features
        runSearchFallback();
        return;
      }

      const forcedEngine = params.get("engine");

      // Initialize router with privacy hardening
      const router = new KrySecurityRouter(forcedEngine || "default");

      // Direct URL mode - fast path
      if (directUrl) {
        router.initializeFingerprintHardening();
        router.enforceRuntimePrivacySanitizer();

        let target = directUrl.startsWith("http") ? directUrl : "https://" + directUrl;
        try {
          target = router.cleanTrackingParams(target);
          target = new URL(target).href;
        } catch {
          return console.warn("[KrySearch] Invalid URL:", directUrl);
        }

        try { history.replaceState(null, "", "/"); } catch {}
        return location.replace(target);
      }

      // Load config with timeout protection
      let CONFIG;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch("./Config/config.json", {
          cache: "no-store",
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        CONFIG = await res.json();
      } catch (e) {
        console.error("[KrySearch] Failed to load config.json:", e.message);
        // Fallback: use default engine
        CONFIG = {
          search: { defaultEngine: "default" },
          engines: {
            default: { url: "https://www.google.com/search?q={query}" }
          }
        };
      }

      // Initialize security layers
      router.initializeFingerprintHardening();
      router.enforceRuntimePrivacySanitizer();

      // Determine engine with validation
      const engines = CONFIG.engines || {};
      const engineKey = (forcedEngine && engines[forcedEngine]) ? forcedEngine : (CONFIG.search?.defaultEngine || "default");
      const engine = engines[engineKey];

      if (!engine?.url) {
        console.error("[KrySearch] Missing engine URL, using fallback");
        return location.replace(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
      }

      // Clean query and redirect
      const cleanQuery = router.cleanTrackingParams(query);
      try { history.replaceState(null, "", "/"); } catch {}

      location.replace(engine.url.replace("{query}", encodeURIComponent(cleanQuery)));
    };

    // Execute initialization
    init().catch(err => {
      console.error("[KrySearch] Initialization failed:", err);
      runSearchFallback();
    });

    function runSearchFallback() {
      if (!query) {
        location.href = "./index.html";
        return;
      }
      
      // Simple fallback without security features
      location.replace(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }
}
