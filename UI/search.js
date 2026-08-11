"use strict";

import { KrySecurityRouter } from './Modules/security-router.js';

(function() {
  // Early error handler for graceful degradation
  window.addEventListener('unhandledrejection', function(e) {
    console.warn('[KrySearch] Unhandled promise:', e.reason);
    e.preventDefault();
  });

  const init = async () => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    const directUrl = params.get("url");
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

    // No search query - exit early without errors
    if (!query) return;

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
  });
})();
