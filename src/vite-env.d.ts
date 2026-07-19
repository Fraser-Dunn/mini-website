/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APIKEY: string;
  readonly VITE_MESSAGESENDERID: string;
  readonly VITE_APPID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
