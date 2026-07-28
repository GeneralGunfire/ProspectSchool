export {};

declare global {
  interface Window {
    // Injected by the Tauri runtime when running inside the desktop app —
    // see @tauri-apps/api/core.js's isTauri(). Undefined on the web.
    isTauri?: boolean;
  }
}
