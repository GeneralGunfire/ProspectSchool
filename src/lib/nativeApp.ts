import { Capacitor } from '@capacitor/core';

// True when running wrapped as a native app shell — either the Tauri
// desktop build (window.isTauri, Tauri 2's official runtime flag) or the
// Capacitor Android build (Capacitor.isNativePlatform()). False on the
// regular web app. Use this instead of checking window.isTauri directly
// so desktop- and mobile-specific UI (e.g. hiding the marketing nav,
// skipping straight to the portal) applies consistently to both wrappers.
export function isNativeApp(): boolean {
  if (typeof window !== 'undefined' && window.isTauri) return true;
  return Capacitor.isNativePlatform();
}
