import { Capacitor } from '@capacitor/core';

// Sideloaded APKs can't silently auto-update (Android blocks that outside
// Play Store/a device-owner context) — this checks GitHub's latest
// android-v* release tag against the installed app's own tag (baked in at
// build time via BUILD_INFO.md / the android:sync script, see below) and,
// if newer, hands back a URL to the release asset so the UI can prompt the
// user to download it. No signing infrastructure needed since this is a
// manual "here's the new version" prompt, not a silent auto-install.
//
// Comparing against the git tag directly (not Android's versionName/
// versionCode) avoids keeping two separate version schemes in sync —
// android/app/build.gradle's versionName still needs bumping per release
// for Android's own internal requirements (must strictly increase), but
// isn't used for this comparison.
const REPO = 'GeneralGunfire/ProspectSchool';

// Set by the Android CI build to the tag this build was cut from, e.g.
// "android-v0.1.2" — baked into the bundle at build time via Vite's
// define (see vite.config.ts), not read at runtime from anywhere native.
// Empty string on web/desktop builds.
declare const __ANDROID_RELEASE_TAG__: string;

export interface UpdateInfo {
  available: boolean;
  currentTag: string;
  latestTag: string;
  downloadUrl: string;
}

export async function checkForAndroidUpdate(): Promise<UpdateInfo | null> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return null;

  const currentTag = __ANDROID_RELEASE_TAG__;
  if (!currentTag) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const releases: { tag_name: string; assets: { name: string; browser_download_url: string }[]; published_at: string }[] = await res.json();

    // Releases are per-platform (desktop-v*, android-v*) on this repo —
    // find the newest android-v* one specifically, not just the newest
    // release overall (that fixed the earlier "latest" 404 bug on the
    // Downloads page — same trap applies here).
    const androidReleases = releases
      .filter(r => r.tag_name.startsWith('android-v'))
      .sort((a, b) => b.published_at.localeCompare(a.published_at));
    const latest = androidReleases[0];
    if (!latest) return null;

    const asset = latest.assets.find(a => a.name.endsWith('.apk'));
    if (!asset) return null;

    return {
      available: latest.tag_name !== currentTag,
      currentTag,
      latestTag: latest.tag_name,
      downloadUrl: asset.browser_download_url,
    };
  } catch {
    return null;
  }
}
