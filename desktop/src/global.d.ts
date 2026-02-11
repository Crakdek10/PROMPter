export {};

declare global {
  interface Window {
    prompter: {
      ping: () => string;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}
