// Opens a URL in a new tab on the web, or the OS default browser when
// running inside the Tauri desktop shell — window.open() inside Tauri's
// WebView2 doesn't reliably behave like a real browser tab, so past
// papers/resources/attachments need to hand off to the system browser
// instead. Tauri's presence is detected at runtime (`window.isTauri`,
// Tauri 2's official check — see @tauri-apps/api/core.js), so this file
// has no effect on the web build.
export function openExternal(url: string): void {
  if (typeof window !== 'undefined' && window.isTauri) {
    import('@tauri-apps/plugin-shell').then(({ open }) => open(url));
    return;
  }
  window.open(url, '_blank');
}
