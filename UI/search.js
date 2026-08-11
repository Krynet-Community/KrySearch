"use strict";

import { KrySecurityRouter } from './Modules/security-router.js';

(async () => {
  const params = new URLSearchParams(location.search);
  const query = params.get("q");
  const directUrl = params.get("url");
  const forcedEngine = params.get("engine");

  // Initialize router with privacy hardening (non-blocking)
  const router = new KrySecurityRouter(forcedEngine || "default");
  
  // 🚀 Direct URL mode - fast path
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

  // ❌ No search query → exit early
  if (!query) return;

  // 🔧 Load config and initialize in parallel
  let CONFIG;
  try {
    const res = await fetch("./Config/config.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    CONFIG = await res.json();
  } catch (e) { 
    return console.error("[KrySearch] Failed to load config.json", e); 
  }

  // Initialize security layers while config loads
  router.initializeFingerprintHardening();
  router.enforceRuntimePrivacySanitizer();

  // 🔍 Determine engine
  const engines = CONFIG.engines || {};
  const engineKey = (forcedEngine && engines[forcedEngine]) ? forcedEngine : CONFIG.search.defaultEngine;
  const engine = engines[engineKey];
  if (!engine?.url) return console.error("[KrySearch] Missing engine URL");

  // 🔧 Clean query and redirect
  const cleanQuery = router.cleanTrackingParams(query);
  try { history.replaceState(null, "", "/"); } catch {}

  location.replace(engine.url.replace("{query}", encodeURIComponent(cleanQuery)));
})();
