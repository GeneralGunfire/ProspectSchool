import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { checkForAndroidUpdate, type UpdateInfo } from '../../lib/updateCheck';
import { openExternal } from '../../lib/openExternal';

// Sideloaded APKs can't silently auto-update — this checks once per app
// launch and shows a dismissible banner when a newer android-v* release
// exists. No-ops entirely on web/desktop (checkForAndroidUpdate returns
// null there). Dismissing hides it for the rest of this session only —
// intentionally not persisted, so it resurfaces next launch until the
// user actually updates.
export function AndroidUpdateBanner() {
  const [update, setUpdate] = useState<UpdateInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkForAndroidUpdate().then(info => {
      if (info?.available) setUpdate(info);
    });
  }, []);

  if (!update || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 pointer-events-none">
      <div
        className="pointer-events-auto max-w-md mx-auto rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-lg shadow-slate-900/20"
        style={{
          background: 'color-mix(in srgb, #050708 92%, transparent)',
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-bold leading-tight">Update available</p>
          <p className="text-white/50 text-[11.5px] font-medium leading-snug mt-0.5">A newer version of Prospect is ready to install.</p>
        </div>
        <button
          onClick={() => openExternal(update.downloadUrl)}
          className="shrink-0 rounded-full px-3.5 py-2 text-[11.5px] font-bold text-white bg-linear-to-r from-sky-500 to-blue-600 hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer"
        >
          Update
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
