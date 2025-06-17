// @ts-nocheck

/// <reference types="react-scripts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVOLUTION_API_KEY: string;
  readonly VITE_EVOLUTION_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
