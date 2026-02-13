export type AudioFormat = "pcm16";

export type ClientMsgType = "start" | "audio" | "stop";
export type ServerMsgType = "ready" | "partial" | "final" | "error";

export interface ClientStart {
  type: "start";
  session_id: string;
  config?: Record<string, unknown>;
}

export interface ClientAudio {
  type: "audio";
  format: AudioFormat;
  sample_rate: number;
  data: string;
}

export interface ClientStop {
  type: "stop";
}

export type ClientMessage = ClientStart | ClientAudio | ClientStop;

export interface ServerReady {
  type: "ready";
  session_id: string;
}

export interface ServerPartial {
  type: "partial";
  session_id: string;
  text: string;
}

export interface ServerFinal {
  type: "final";
  session_id: string;
  text: string;
}

export interface ServerError {
  type: "error";
  message: string;
  session_id?: string;
}

export type ServerMessage = ServerReady | ServerPartial | ServerFinal | ServerError;
