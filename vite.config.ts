import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // Baked in by the Android CI build (mobile-android.yml passes the
      // triggering git tag, e.g. "android-v0.1.2") so the in-app update
      // checker (src/lib/updateCheck.ts) knows what release it shipped
      // from without depending on native versionName/versionCode. Empty
      // string on web/desktop builds — updateCheck.ts no-ops there anyway.
      __ANDROID_RELEASE_TAG__: JSON.stringify(env.ANDROID_RELEASE_TAG || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':    ['react', 'react-dom'],
            'vendor-motion':   ['motion/react'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-lucide':   ['lucide-react'],
            'data-careers':    ['./src/features/careers/data/careers400Final.ts'],
            'data-bursaries':  ['./src/features/careers/data/bursaries.ts'],
          },
        },
      },
    },
  };
});
