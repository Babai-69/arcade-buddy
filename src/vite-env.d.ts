/// <reference types="vite/client" />
declare module "*.jpg" {
  const value: string;
  export default value;
}

declare const __BUILD_TIME__: string;
