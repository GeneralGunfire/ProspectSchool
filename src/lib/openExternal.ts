import { Capacitor } from '@capacitor/core';

// Opens a URL in a new tab on the web, or the OS default browser when
// running inside a native app shell — window.open() doesn't reliably
// behave like a real browser tab in either Tauri's WebView2 or Capacitor's
// Android WebView, so past papers/resources/attachments need to hand off
// to the system browser instead. Native shells are detected at runtime
// (window.isTauri for Tauri 2, Capacitor.isNativePlatform() for Android),
// so this file has no effect on the web build.
export function openExternal(url: string): void {
  if (typeof window !== 'undefined' && window.isTauri) {
    import('@tauri-apps/plugin-shell').then(({ open }) => open(url));
    return;
  }
  if (Capacitor.isNativePlatform()) {
    import('@capacitor/browser').then(({ Browser }) => Browser.open({ url }));
    return;
  }
  window.open(url, '_blank');
}
