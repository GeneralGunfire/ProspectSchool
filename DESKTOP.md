# Prospect Desktop (Windows)

The desktop app is the existing web app wrapped in [Tauri](https://tauri.app) —
Tauri loads the same Vite build (`dist/`) into a native window via WebView2,
so nothing in `src/` changes to support it. Styling, layout, and behavior are
identical to the web app; see `src-tauri/` for the wrapper config.

**Scope: Windows only.** No Mac or Linux build targets are configured.

## Prerequisites

- Node (already required for the web app)
- Rust toolchain — https://www.rust-lang.org/tools/install
- On Windows, the [Tauri prerequisites](https://tauri.app/start/prerequisites/) (WebView2, MSVC build tools) — most Windows 10/11 machines already have WebView2 installed

## Local development

```bash
npm install
npm run desktop:dev
```

This runs the Vite dev server and opens it in a Tauri window (hot reload works the same as `npm run dev`).

## Local build

```bash
npx @tauri-apps/cli icon public/logo3.png   # regenerate icons (icon.ico isn't committed)
npm run desktop:build
```

Produces an NSIS installer at `src-tauri/target/release/bundle/nsis/*.exe`.

## CI build

`.github/workflows/desktop-windows.yml` builds the Windows installer on:
- pushing a tag matching `desktop-v*` (e.g. `desktop-v0.1.0`)
- manual trigger (Actions tab → "Desktop (Windows)" → Run workflow — note: this does NOT publish a Release, since there's no tag to attach one to; use a tag push for a real distributable build)

**Required repo secrets** (Settings → Secrets and variables → Actions):
- `VITE_SITE_URL` — the production site URL (`https://prospect-school.vercel.app`), used so links generated inside the desktop app (like the quiz share link) point at the real site instead of a local Tauri address
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Same values as `.env.local`. On a tag push, the built `.exe` is both uploaded as a workflow artifact (`prospect-windows-installer` — requires a signed-in GitHub session to download, not user-facing) **and** attached to a published GitHub Release matching the tag (publicly downloadable, no login required — this is what the Downloads page links to).

### Cutting a new release

```bash
git tag desktop-v0.1.2
git push origin desktop-v0.1.2
```

The Downloads page (`src/pages/DownloadPage.tsx`) links to
`.../releases/latest/download/Prospect_0.1.0_x64-setup.exe`, which always
resolves to the newest release automatically — **except** the filename
segment is derived from `src-tauri/tauri.conf.json`'s `"version"` field, not
the git tag. If that version field is ever bumped (e.g. to `0.2.0`), update
the filename in `DOWNLOAD_URLS.windows` to match, or the link will 404
even though a newer release exists.

## External links (past papers, resources, attachments)

All `window.open(url, '_blank')` calls across the portal (teacher/student
resources, past papers, memos, calendar attachments) go through
`src/lib/openExternal.ts` instead — shared with the Android app, see
`MOBILE.md`. On the web build it's a plain `window.open` — unchanged.
Inside Tauri it detects `window.isTauri` (Tauri 2's official runtime flag)
and hands off to `@tauri-apps/plugin-shell`'s `open()`, which opens the URL
in the OS default browser rather than relying on WebView2's new-tab
behavior. The Rust side is registered in `src-tauri/src/lib.rs`
(`tauri_plugin_shell::init()`) with permission granted via
`src-tauri/capabilities/default.json` (`shell:allow-open`).

## Shared native-app detection

`src/lib/nativeApp.ts`'s `isNativeApp()` is true for either this Tauri
desktop build or the Capacitor Android build (see `MOBILE.md`) — used in
`App.tsx` (skip the marketing landing page, open straight to the portal)
and `PortalEntry.tsx` (hide the "back to website" nav). Prefer this over
checking `window.isTauri` directly so desktop- and mobile-specific UI stays
in sync across both wrappers.

## Known items still open

- Builds are **unsigned** — Windows SmartScreen will warn users on first run (expected for now; code-signing is a future phase, not yet planned).
- Auto-updates are not wired up yet (Tauri's updater, checking a version feed) — planned for later, not part of this scaffold.
- No code-signing certificate yet, so SmartScreen bypass instructions are what's shown on the Downloads page in the meantime.
