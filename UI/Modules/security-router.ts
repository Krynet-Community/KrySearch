"use strict";

import { z } from 'zod';

/* ==========================================================================
   1. TYPE DEFINITIONS & SCHEMAS
   ========================================================================== */

export interface EngineProfile {
  vendor: string;
  renderer: string;
  perfRes: number;
}

export interface ZKEncryptedPacket {
  iv: number[];
  payload: string;
}

export interface DoHResponseAnswer {
  data: string;
  type: number;
}

export interface DoHResponse {
  Answer?: DoHResponseAnswer[];
}

// Runtime validation schema for search inputs
const QuerySchema = z.string().max(256).transform(val => 
  val.normalize("NFKC").replace(/[^\x20-\x7E]/g, "").trim()
);

/* ==========================================================================
   2. CONFIGURATION STRIP
   ========================================================================== */

const TRACKING_PARAMS: string[] = ["utm_", "fbclid", "gclid", "_ga", "_gl", "_gid"];

const DOH_SERVERS: string[] = [
  "https://dns.quad9.net/dns-query",
  "https://dns.google/dns-query",
  "https://cloudflare-dns.com/dns-query"
];

/* ==========================================================================
   3. CORE SECURITY ENGINE CLASS
   ========================================================================== */

export class KrySecurityRouter {
  private engineProfile: string;
  private profiles: Record<string, EngineProfile> = {
    default: { vendor: "KrySearch", renderer: "KrySearch Renderer", perfRes: 100 },
    tor: { vendor: "Mozilla", renderer: "Gecko", perfRes: 100 },
    chromium: { vendor: "Google Inc.", renderer: "ANGLE", perfRes: 50 }
  };

  constructor(engineProfile: string = "default") {
    this.engineProfile = engineProfile;
  }

  /**
   * Enforces strict canvas, geometry layout, and high-risk API normalization
   */
  public initializeFingerprintHardening(): void {
    const profile = this.profiles[this.engineProfile] || this.profiles.default;

    // Normalize Canvas surface responses
    if (globalThis.HTMLCanvasElement?.prototype.toDataURL) {
      globalThis.HTMLCanvasElement.prototype.toDataURL = (): string => 
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";
    }
    
    if (globalThis.CanvasRenderingContext2D?.prototype.getImageData) {
      globalThis.CanvasRenderingContext2D.prototype.getImageData = (x: number, y: number, w: number, h: number): ImageData => 
        new ImageData(w, h);
    }

    // Flatten DOM rect measurements to neutralize font/rendering side-channels
    if (globalThis.Element?.prototype.getBoundingClientRect) {
      const originalGetBoundingClientRect = globalThis.Element.prototype.getBoundingClientRect;
      globalThis.Element.prototype.getBoundingClientRect = function (this: Element): DOMRect {
        const rect = originalGetBoundingClientRect.call(this);
        return {
          x: Math.round(rect.x), y: Math.round(rect.y),
          width: Math.round(rect.width), height: Math.round(rect.height),
          top: Math.round(rect.top), left: Math.round(rect.left),
          right: Math.round(rect.right), bottom: Math.round(rect.bottom),
          toJSON: () => rect.toJSON()
        } as DOMRect;
      };
    }

    // Hardware specifications lock
    try {
      Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 4, configurable: true });
      if (navigator.connection) {
        Object.defineProperty(navigator, "connection", {
          get: () => ({ effectiveType: "4g", rtt: 100, downlink: 10, saveData: false }),
          configurable: true
        });
      }
    } catch {}

    // Immediate lockdown of high-risk browser subsystems
    const highRiskApis: string[] = ["geolocation", "mediaDevices", "bluetooth", "usb", "serial", "vibrate"];
    highRiskApis.forEach((api) => {
      if (api in navigator) {
        try { Object.defineProperty(navigator, api, { get: () => undefined, configurable: true }); } catch {}
      }
    });

    // Reduce Web API performance clock resolution
    if (globalThis.performance?.now) {
      globalThis.performance.now = (): number => 
        Math.floor(Date.now() / profile.perfRes) * profile.perfRes;
    }
  }

  /**
   * Flushes standard client tracking properties and browser link pre-fetching vectors
   */
  public enforceRuntimePrivacySanitizer(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(cookie => {
        const eqIdx = cookie.indexOf("=");
        const name = eqIdx > -1 ? cookie.substring(0, eqIdx) : cookie;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      });
    } catch {}

    const clearSpeculativeLinks = (): void => {
      document.querySelectorAll('link[rel*="prefetch"], link[rel*="prerender"], link[rel*="preconnect"]')
        .forEach(element => element.remove());
    };

    clearSpeculativeLinks();
    new MutationObserver(() => clearSpeculativeLinks()).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Fast parameter cleaning pass using strong schema filtering
   */
  public cleanTrackingParams(rawUrlString: string): string {
    try {
      const url = new URL(rawUrlString);
      const keysToDrop = [...url.searchParams.keys()].filter(key => 
        TRACKING_PARAMS.some(prefix => key.startsWith(prefix)) || !["url", "q", "engine"].includes(key)
      );
      keysToDrop.forEach(key => url.searchParams.delete(key));
      return url.toString();
    } catch {
      return rawUrlString;
    }
  }

  /**
   * Hybrid Async Zero-Knowledge encryption layer (ECDH Curve25519 + AES-GCM 256)
   */
  public async sealQueryZK(queryText: string): Promise<ZKEncryptedPacket> {
    const encoder = new TextEncoder();
    const cleanText = QuerySchema.parse(queryText);

    const ephemeralKeyPair = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "X25519" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      { name: "ECDH", public: ephemeralKeyPair.publicKey },
      ephemeralKeyPair.privateKey,
      256
    );

    const keyMaterial = await crypto.subtle.digest("SHA-512", derivedBits);
    const aesKey = await crypto.subtle.importKey(
      "raw",
      keyMaterial.slice(0, 32),
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encoder.encode(cleanText)
    );

    return {
      iv: Array.from(iv),
      payload: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
  }

  /**
   * Parallel racing Multi-Provider DNS over HTTPS lookup resolution
   */
  public async resolveDomainDoH(domain: string, recordType: "A" | "AAAA" | "MX" = "A"): Promise<string[]> {
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return [];

    return Promise.any(DOH_SERVERS.map(async provider => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);

      try {
        const response = await fetch(`${provider}?name=${encodeURIComponent(domain)}&type=${recordType}`, {
          signal: controller.signal,
          cache: "no-store"
        });
        clearTimeout(timer);
        if (!response.ok) return [];
        
        const data = (await response.json()) as DoHResponse;
        return Array.isArray(data.Answer) ? data.Answer.map(item => item.data) : [];
      } catch {
        clearTimeout(timer);
        return [];
      }
    }));
  }
}
