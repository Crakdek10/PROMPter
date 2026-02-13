import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type SessionStatus = 'idle' | 'recording' | 'paused' | 'processing';

type SessionState = {
  status: SessionStatus;
};

const initialState: SessionState = {
  status: 'idle',
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    startSession() {
      patchState(store, { status: 'recording' });
    },
    stopSession() {
      patchState(store, { status: 'idle' });
    },
    setProcessing() {
      patchState(store, { status: 'processing' });
    }
  }))
);
