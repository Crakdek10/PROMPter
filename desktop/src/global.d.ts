export {};

type SystemSource = { id: string; name: string };

declare global {
  interface Window {
    prompter: {
      ping: () => string;
      minimize: () => void;
      maximize: () => void;
      close: () => void;

      // NUEVO
      listSystemAudioSources: () => Promise<SystemSource[]>;
      setWindowOpacity: (value01: number) => void;
    };
  }
}
