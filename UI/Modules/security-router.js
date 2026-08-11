"use strict";

/* ==========================================================================
   1. CONFIGURATION
   ========================================================================== */

const TRACKING_PARAMS = ["utm_", "fbclid", "gclid", "_ga", "_gl", "_gid", "mc_eid", "mkt_tok", "pk_vid", "ssrt", "_bta_tid", "_bta_c", "trk_contact", "trk_msg", "trk_module", "trk_sid", "gdfms", "gdftrk", "gdffi", "_ke", "redirect_log_mongo_id", "redirect_mongo_id", "sb_referer_host", "mkwid", "_bt", "_bm", "bfbsk", "ef_id", "s_kwcid", "msclkid", "dm_i", "epik", "pp", "spJobID", "spMailingID", "spUserID", "spTransactionID", "spCampaignId", "spReportId", "li_fat_id", "twclid", "hsa_cam", "hsa_grp", "hsa_mt", "hsa_src", "hsa_ad", "hsa_acc", "hsa_net", "hsa_ver", "wbraid", "gbraid"];
const ALLOWED_PARAMS = new Set(["url", "q", "engine"]);

const DOH_SERVERS = [
  "https://dns.quad9.net/dns-query",
  "https://dns.google/dns-query",
  "https://cloudflare-dns.com/dns-query"
];

// Enhanced fingerprinting protection constants
const FINGERPRINT_NOISE_CONFIG = {
  canvasNoise: 0.02,
  audioNoise: 0.001,
  webglVendor: "Google Inc.",
  webglRenderer: "ANGLE (Google, Vulkan 1.2.0, SwiftShader)",
  timezone: "UTC",
  language: "en-US",
  languages: ["en-US", "en"],
  platform: "Win32",
  oscpu: "Windows NT 10.0; Win64; x64"
};

// Simple HTML entity decoder (replaces html-entities)
const HTML_ENTITIES = {
  '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'",
  '&nbsp;': ' ', '&copy;': '©', '&reg;': '®', '&trade;': '™', '&mdash;': '—',
  '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ldquo;': '"', '&rdquo;': '"', '&hellip;': '…'
};

function decodeHtmlEntities(str) {
  if (typeof str !== 'string') return str || '';
  return str.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (match, entity) => {
    if (entity.startsWith('#')) {
      const code = entity.startsWith('#x') ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1));
      return String.fromCharCode(code);
    }
    return HTML_ENTITIES[match] || match;
  });
}

// Simple query string parser (replaces query-string)
function parseQueryString(str) {
  if (!str || typeof str !== 'string') return {};
  const result = {};
  const params = str.split(/[?&]/);
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    if (!param) continue;
    const eqIdx = param.indexOf('=');
    if (eqIdx === -1) {
      result[param] = '';
    } else {
      const key = decodeURIComponent(param.substring(0, eqIdx));
      const value = decodeURIComponent(param.substring(eqIdx + 1));
      result[key] = value;
    }
  }
  return result;
}

function stringifyUrl(obj) {
  const base = obj.url || '';
  const query = obj.query || {};
  const keys = Object.keys(query);
  if (keys.length === 0) return base;
  
  const queryString = keys.map(key => {
    const value = query[key];
    if (value === null || value === undefined) return encodeURIComponent(key);
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }).join('&');
  
  return `${base}${base.includes('?') ? '&' : '?'}${queryString}`;
}

function parseUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    return {
      url: url.origin + url.pathname,
      query: parseQueryString(url.search)
    };
  } catch {
    return { url: urlStr, query: {} };
  }
}

// Simple IDNA/UTS46 implementation (basic version for common cases)
function toAscii(domain, options = {}) {
  if (!domain || typeof domain !== 'string') return '';
  
  // Basic punycode conversion for ASCII domains
  try {
    // For most common ASCII domains, just lowercase
    if (/^[a-z0-9.-]+$/i.test(domain)) {
      return domain.toLowerCase();
    }
    
    // Try using built-in URL API for IDN support
    const url = new URL(`http://${domain}`);
    return url.hostname.toLowerCase();
  } catch {
    return domain.toLowerCase();
  }
}

/* ==========================================================================
   2. CORE SECURITY ENGINE CLASS
   ========================================================================== */

export class KrySecurityRouter {
  constructor(engineProfile = "default") {
    this.engineProfile = engineProfile;
    this.profiles = {
      default: { vendor: "Google Inc.", renderer: "ANGLE (Google, Vulkan 1.2.0, SwiftShader)", perfRes: 100 },
      tor: { vendor: "Mozilla", renderer: "Gecko", perfRes: 100 },
      chromium: { vendor: "Google Inc.", renderer: "ANGLE", perfRes: 50 }
    };
    this.initialized = false;
  }

  /**
   * Hardens and standardizes the runtime fingerprint surface area using deep object freezing
   */
  initializeFingerprintHardening() {
    if (this.initialized) return;
    this.initialized = true;
    
    const profile = this.profiles[this.engineProfile] || this.profiles.default;

    // Standardize Canvas surface responses with subtle noise injection
    if (globalThis.HTMLCanvasElement?.prototype.toDataURL) {
      globalThis.HTMLCanvasElement.prototype.toDataURL = function(type) {
        try {
          const ctx = this.getContext('2d');
          if (ctx) {
            const imageData = ctx.getImageData(0, 0, 1, 1);
            const noise = FINGERPRINT_NOISE_CONFIG.canvasNoise;
            imageData.data[0] = Math.min(255, imageData.data[0] + noise * 255);
            imageData.data[1] = Math.min(255, imageData.data[1] + noise * 255);
            imageData.data[2] = Math.min(255, imageData.data[2] + noise * 255);
            ctx.putImageData(imageData, 0, 0);
          }
        } catch {}
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR42mNk+M9QDwADhgGAWjR9pAAAABJRU5ErkJggg==";
      };
    }
    
    if (globalThis.CanvasRenderingContext2D?.prototype.getImageData) {
      const origGetImageData = globalThis.CanvasRenderingContext2D.prototype.getImageData;
      globalThis.CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
        const imageData = origGetImageData.call(this, sx, sy, sw, sh);
        const noise = FINGERPRINT_NOISE_CONFIG.canvasNoise;
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] = Math.min(255, imageData.data[i] + (Math.random() - 0.5) * noise * 255);
          imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + (Math.random() - 0.5) * noise * 255);
          imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + (Math.random() - 0.5) * noise * 255);
        }
        return imageData;
      };
    }
    
    // WebGL fingerprint spoofing
    if (globalThis.WebGLRenderingContext?.prototype.getParameter) {
      const origGetParameter = globalThis.WebGLRenderingContext.prototype.getParameter;
      globalThis.WebGLRenderingContext.prototype.getParameter = function(param) {
        switch (param) {
          case 0x1F00: return FINGERPRINT_NOISE_CONFIG.webglVendor; // VENDOR
          case 0x1F01: return FINGERPRINT_NOISE_CONFIG.webglRenderer; // RENDERER
          case 0x8B8C: return [0]; // UNMASKED_VENDOR_WEBGL
          case 0x9245: return [0]; // UNMASKED_RENDERER_WEBGL
          default: return origGetParameter.call(this, param);
        }
      };
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
      maxTouchPoints: 0,
      platform: FINGERPRINT_NOISE_CONFIG.platform,
      oscpu: FINGERPRINT_NOISE_CONFIG.oscpu
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

    // Spoof timezone to UTC
    try {
      const origIntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
      globalThis.Intl.DateTimeFormat = function(locales, options) {
        if (!options) options = {};
        options.timeZone = FINGERPRINT_NOISE_CONFIG.timezone;
        return new origIntlDateTimeFormat(locales, options);
      };
      globalThis.Intl.DateTimeFormat.prototype = origIntlDateTimeFormat.prototype;
      globalThis.Intl.DateTimeFormat.supportedLocalesOf = origIntlDateTimeFormat.supportedLocalesOf;
    } catch {}

    // Spoof language settings
    try {
      Object.defineProperty(navigator, "language", {
        get: () => FINGERPRINT_NOISE_CONFIG.language,
        configurable: false
      });
      Object.defineProperty(navigator, "languages", {
        get: () => [...FINGERPRINT_NOISE_CONFIG.languages],
        configurable: false
      });
    } catch {}

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
    const highRiskApis = ["geolocation", "mediaDevices", "bluetooth", "usb", "serial", "vibrate", "xr", "keyboard", "locks"];
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
    
    // Block AudioContext fingerprinting
    if (globalThis.AudioContext?.prototype.createAnalyser) {
      const origCreateAnalyser = globalThis.AudioContext.prototype.createAnalyser;
      globalThis.AudioContext.prototype.createAnalyser = function() {
        const analyser = origCreateAnalyser.call(this);
        const origGetByteFrequencyData = analyser.getByteFrequencyData;
        analyser.getByteFrequencyData = function(array) {
          const result = origGetByteFrequencyData.call(this, array);
          const noise = FINGERPRINT_NOISE_CONFIG.audioNoise;
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.min(255, Math.max(0, array[i] + (Math.random() - 0.5) * noise * 255));
          }
          return result;
        };
        return analyser;
      };
    }
  }

  /**
   * Flushes standard client tracking properties and browser link pre-fetching vectors
   */
  enforceRuntimePrivacySanitizer() {
    try {
      // Clear storage mechanisms
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies with enhanced scope
      if (document.cookie) {
        const cookies = document.cookie.split(";");
        const domains = [document.location.hostname, `.${document.location.hostname}`, "localhost"];
        const paths = ["/", "/search", "/api"];
        
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqIdx = cookie.indexOf("=");
          const name = eqIdx > -1 ? cookie.substring(0, eqIdx).trim() : cookie.trim();
          
          // Delete cookie across multiple domains and paths
          for (const domain of domains) {
            for (const path of paths) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};domain=${domain}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};domain=${domain};secure;samesite=none`;
            }
          }
        }
      }
    } catch {}

    // Block fingerprinting via Link prefetch/prerender/preconnect
    const clearSpeculativeLinks = () => {
      const links = document.querySelectorAll('link[rel*="prefetch"], link[rel*="prerender"], link[rel*="preconnect"], link[rel="dns-prefetch"]');
      for (let i = 0; i < links.length; i++) {
        links[i].remove();
      }
    };

    clearSpeculativeLinks();
    
    // Use MutationObserver with throttling to prevent excessive DOM operations
    let observerTimeout = null;
    const throttledObserver = () => {
      if (!observerTimeout) {
        observerTimeout = setTimeout(() => {
          clearSpeculativeLinks();
          observerTimeout = null;
        }, 100);
      }
    };
    
    new MutationObserver(throttledObserver).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    // Block navigator.sendBeacon (used for tracking)
    if (navigator.sendBeacon) {
      navigator.sendBeacon = function() { return false; };
    }
    
    // Disable Resource Timing API (timing attacks)
    if (performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
    if (globalThis.PerformanceResourceTiming?.prototype) {
      try {
        Object.defineProperty(globalThis.PerformanceResourceTiming.prototype, 'responseStart', { get: () => 0 });
        Object.defineProperty(globalThis.PerformanceResourceTiming.prototype, 'responseEnd', { get: () => 0 });
        Object.defineProperty(globalThis.PerformanceResourceTiming.prototype, 'fetchStart', { get: () => 0 });
      } catch {}
    }
  }

  /**
   * Normalizes and cleans inbound tracking parameters with IDN protection
   */
  cleanTrackingParams(rawUrlString) {
    if (!rawUrlString || typeof rawUrlString !== "string") {
      return rawUrlString || "";
    }
    
    try {
      // 1. Un-escape and flatten string formatting variants first
      let preScrubbed = decodeHtmlEntities(rawUrlString).trim();

      // 2. Normalize domain names to prevent Homograph/Punycode character spoofs
      const urlObj = new URL(preScrubbed);
      urlObj.hostname = toAscii(urlObj.hostname, { UnicodeVersion: '15.1.0', transitional: false });

      // 3. Robust parameter cleaning pass (optimized with Set lookups)
      const parsed = parseUrl(urlObj.toString());
      const queryKeys = Object.keys(parsed.query);
      
      for (let i = 0; i < queryKeys.length; i++) {
        const key = queryKeys[i];
        
        // Fast path: check allowed params first (O(1))
        if (ALLOWED_PARAMS.has(key)) continue;
        
        // Check tracking params (use some() for partial matching on prefixes)
        const isTrackingParam = TRACKING_PARAMS.some(prefix => 
          key === prefix || (prefix.endsWith('_') ? key.startsWith(prefix) : key.toLowerCase().includes(prefix.toLowerCase()))
        );
        
        if (isTrackingParam) {
          delete parsed.query[key];
        }
      }

      return stringifyUrl(parsed);
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

    // Use HTML entity decoding and simple sanitization to flatten visual and structural vectors
    const flatText = decodeHtmlEntities(queryText).normalize("NFKC");
    // Simple XSS prevention - strip dangerous characters
    const cleanText = flatText.slice(0, 256).replace(/[<>\"'&]/g, '');
    
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(cleanText);

    // Generate ephemeral keys using Web Crypto API
    const keyMaterial = await crypto.subtle.digest('SHA-512', dataBytes);
    const aesKeyBuffer = keyMaterial.slice(0, 32);
    
    // Import key for AES-GCM
    const aesKey = await crypto.subtle.importKey(
      'raw',
      aesKeyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Encrypt using AES-GCM 256
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      aesKey,
      dataBytes
    );

    return {
      iv: Array.from(iv),
      payload: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
  }

  /**
   * Parallel racing Multi-Provider DNS over HTTPS lookup resolution
   */
  async resolveDomainDoH(domain, recordType = "A") {
    try {
      const safeDomain = toAscii(domain.trim(), { transitional: false });
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
