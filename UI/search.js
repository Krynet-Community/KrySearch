"use strict";

// Fixed: Using the exact relative path matching your folder tree screenshot
import { KrySecurityRouter } from './Modules/security-router.js';

(async () => {
  const p = new URLSearchParams(location.search);
  const q = p.get("q");      // search query
  const u = p.get("url");    // direct URL
  const forcedEngine = p.get("engine");

  // 1. Initialize router and activate baseline hardening layers immediately
  const router = new KrySecurityRouter(forcedEngine || "default");
  router.initializeFingerprintHardening();
  router.enforceRuntimePrivacySanitizer();

  // 🚀 Direct URL mode
  if (u) {
    let target = u.startsWith("http") ? u : "https://" + u;
    try { 
      // Scrub potential tracking parameters from the direct redirect URL
      target = router.cleanTrackingParams(target);
      target = new URL(target).href;
    } 
    catch { return console.warn("[KrySearch] Invalid URL:", u) }
    
    // Clear navigation history tracking before redirecting
    try { history.replaceState(null, "", "/"); } catch {}
    return location.replace(target); 
  }

  // ❌ No search query → nothing to do
  if (!q) return;

  // 🔧 Load config
  let CONFIG;
  try {
    // Fixed: Based on the screenshot, Config is a sibling folder to index.html/search.js
    const res = await fetch("./Config/config.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    CONFIG = await res.json();
  } catch (e) { return console.error("[KrySearch] Failed to load config.json", e) }

  // 🔍 Determine engine (Matches flat engine configurations)
  const engines = CONFIG.engines || {};
  const engineKey = (forcedEngine && engines[forcedEngine]) ? forcedEngine : CONFIG.search.defaultEngine;
  const engine = engines[engineKey];
  if (!engine?.url) return console.error("[KrySearch] Missing engine URL");

  // 2. Clear out query parameters and tracking junk using the router toolset
  const cleanQuery = router.cleanTrackingParams(q);
  try { history.replaceState(null, "", "/"); } catch {}

  // 🌐 Redirect using the search engine
  location.replace(engine.url.replace("{query}", encodeURIComponent(cleanQuery)));
})();
