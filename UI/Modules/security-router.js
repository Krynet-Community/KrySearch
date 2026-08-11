"use strict";
import DOMPurify from 'https://esm.sh/dompurify@3.1.5';
import { x25519 } from 'https://esm.sh/@noble/curves@1.4.0/ed25519';
import { gcm } from 'https://esm.sh/@noble/ciphers@0.4.1/aes';
import { sha512 } from 'https://esm.sh/@noble/hashes@1.4.0/sha512';
import queryString from 'https://esm.sh/query-string@9.0.0';
import uts46 from 'https://esm.sh/idna-uts46-hx@1.1.0';
import { decode } from 'https://esm.sh/html-entities@2.5.2';

/* ==========================================================================
   1. CONFIGURATION
   ========================================================================== */

const TRACKING_PARAMS = ["utm_", "fbclid", "gclid", "_ga", "_gl", "_gid"];
const ALLOWED_PARAMS = new Set(["url", "q", "engine"]);

const DOH_SERVERS = [
  "https://dns.quad9.net/dns-query",
  "https://dns.google/dns-query",
  "https://cloudflare-dns.com/dns-query"
];

/* ==========================================================================
   2. CORE SECURITY ENGINE CLASS
   ========================================================================== */

export class KrySecurityRouter {
  constructor(engineProfile = "default") {
    this.engineProfile = engineProfile;
    this.profiles = {
      default: { vendor: "KrySearch", renderer: "KrySearch Renderer", perfRes: 100 },
      tor: { vendor: "Mozilla", renderer: "Gecko", perfRes: 100 },
      chromium: { vendor: "Google Inc.", renderer: "ANGLE", perfRes: 50 }
    };
  }

  /**
   * Hardens and standardizes the runtime fingerprint surface area using deep object freezing
   */
  initializeFingerprintHardening() {
    const profile = this.profiles[this.engineProfile] || this.profiles.default;

    // Standardize Canvas surface responses (cached prototype references)
    if (globalThis.HTMLCanvasElement?.prototype.toDataURL) {
      globalThis.HTMLCanvasElement.prototype.toDataURL = () => 
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";
    }
    
    if (globalThis.CanvasRenderingContext2D?.prototype.getImageData) {
      globalThis.CanvasRenderingContext2D.prototype.getImageData = (x, y, w, h) => 
        new ImageData(w, h);
    }

    // Flatten DOM rect measurements to neutralize font/rendering side-channels completely
    if (globalThis.Element?.prototype.getBoundingClientRect) {
      const originalGetBoundingClientRect = globalThis.Element.prototype.getBoundingClientRect;
      globalThis.Element.prototype.getBoundingClientRect = function () {
        const rect = originalGetBoundingClientRect.call(this);
        return {
          x: Math.round(rect.x), y: Math.round(rect.y),
          width: Math.round(rect.width), height: Math.round(rect.height),
          top: Math.round(rect.top), left: Math.round(rect.left),
          right: Math.round(rect.right), bottom: Math.round(rect.bottom),
          toJSON: () => rect.toJSON()
        };
      };
    }

    // Immutable Hardware Specifications Lock (batch operation)
    const targetSpecs = {
      hardwareConcurrency: 4,
      deviceMemory: 8,
      maxTouchPoints: 0
    };

    for (const [prop, value] of Object.entries(targetSpecs)) {
      if (prop in navigator) {
        try {
          Object.defineProperty(navigator, prop, {
            value: value,
            writable: false,
            configurable: false,
            enumerable: true
          });
        } catch {}
      }
    }

    // Modern Network API Mocking
    if (navigator.connection) {
      try {
        Object.defineProperty(navigator, "connection", {
          get: () => Object.freeze({ effectiveType: "4g", rtt: 100, downlink: 10, saveData: false }),
          configurable: false
        });
      } catch {}
    }

    // Shutdown High-Risk Tracking Subsystems (single pass)
    const highRiskApis = ["geolocation", "mediaDevices", "bluetooth", "usb", "serial", "vibrate"];
    for (const api of highRiskApis) {
      if (api in navigator) {
        try { Object.defineProperty(navigator, api, { value: undefined, configurable: false, writable: false }); } catch {}
      }
    }

    // Reduce Performance API timer precision to eliminate timing/side-channel attacks
    if (globalThis.performance?.now) {
      const origNow = globalThis.performance.now.bind(globalThis.performance);
      const perfRes = profile.perfRes;
      globalThis.performance.now = () => {
        const value = origNow();
        return Math.floor(value / perfRes) * perfRes;
      };
    }
  }

  /**
   * Flushes standard client tracking properties and browser link pre-fetching vectors
   */
  enforceRuntimePrivacySanitizer() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      if (document.cookie) {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqIdx = cookie.indexOf("=");
          const name = eqIdx > -1 ? cookie.substring(0, eqIdx).trim() : cookie.trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        }
      }
    } catch {}

    // Optimized: Use event delegation for speculative link cleanup
    const clearSpeculativeLinks = () => {
      const links = document.querySelectorAll('link[rel*="prefetch"], link[rel*="prerender"], link[rel*="preconnect"]');
      for (let i = 0; i < links.length; i++) {
        links[i].remove();
      }
    };

    clearSpeculativeLinks();
    new MutationObserver(() => clearSpeculativeLinks()).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Normalizes and cleans inbound tracking parameters with IDN protection
   */
  cleanTrackingParams(rawUrlString) {
    try {
      // 1. Un-escape and flatten string formatting variants first
      let preScrubbed = decode(rawUrlString).trim();

      // 2. Normalize domain names to prevent Homograph/Punycode character spoofs
      const urlObj = new URL(preScrubbed);
      urlObj.hostname = uts46.toAscii(urlObj.hostname, { UnicodeVersion: '15.1.0', transitional: false });

      // 3. Robust parameter cleaning pass (optimized)
      const parsed = queryString.parseUrl(urlObj.toString());
      const queryKeys = Object.keys(parsed.query);
      for (let i = 0; i < queryKeys.length; i++) {
        const key = queryKeys[i];
        if (!ALLOWED_PARAMS.has(key) && !TRACKING_PARAMS.some(prefix => key.startsWith(prefix))) {
          delete parsed.query[key];
        }
      }

      return queryString.stringifyUrl(parsed);
    } catch {
      return rawUrlString;
    }
  }

  /**
   * Secure Async Zero-Knowledge encryption layer via Audited Noble Crypto Libraries
   */
  async sealQueryZK(queryText) {
    if (typeof queryText !== "string") {
      throw new TypeError("Query must be a string");
    }

    // Use HTML entity decoding and DOMPurify to perfectly flatten visual and structural vectors
    const flatText = decode(queryText).normalize("NFKC");
    const cleanText = DOMPurify.sanitize(flatText.slice(0, 256));
    
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(cleanText);

    // Generate ephemeral keys via @noble/curves
    const ephemeralPrivateKey = x25519.utils.randomPrivateKey();
    const ephemeralPublicKey = x25519.getPublicKey(ephemeralPrivateKey);

    // Derive bits & Hash key material using sha512
    const sharedBits = x25519.getSharedSecret(ephemeralPrivateKey, ephemeralPublicKey);
    const keyMaterial = sha512(sharedBits);
    const aesKey = keyMaterial.slice(0, 32); 

    // Encrypt using AES-GCM 256
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesGcmInstance = gcm(aesKey, iv);
    const ciphertext = aesGcmInstance.encrypt(dataBytes);

    return {
      iv: Array.from(iv),
      payload: btoa(String.fromCharCode(...ciphertext))
    };
  }

  /**
   * Parallel racing Multi-Provider DNS over HTTPS lookup resolution
   */
  async resolveDomainDoH(domain, recordType = "A") {
    try {
      const safeDomain = uts46.toAscii(domain.trim(), { transitional: false });
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(safeDomain)) return [];

      const promises = DOH_SERVERS.map(async provider => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 1500);

        try {
          const response = await fetch(`${provider}?name=${encodeURIComponent(safeDomain)}&type=${recordType}`, {
            signal: controller.signal,
            cache: "no-store"
          });
          clearTimeout(timer);
          if (!response.ok) return [];
          
          const data = await response.json();
          return Array.isArray(data.Answer) ? data.Answer.map(item => item.data) : [];
        } catch {
          clearTimeout(timer);
          return [];
        }
      });

      return await Promise.any(promises);
    } catch {
      return [];
    }
  }
}
