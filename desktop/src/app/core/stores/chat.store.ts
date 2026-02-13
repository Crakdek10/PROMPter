import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ChatMessage } from '../models/chat.model';

type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
};

const initialState: ChatState = {
  messages: [
    { id: '1', author: 'user', text: 'Hola, quiero empezar a grabar.', createdAt: Date.now() },
    { id: '2', author: 'ai', text: 'Claro, presiona el botón de reproducir abajo.', createdAt: Date.now() }
  ],
  isLoading: false,
};

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    addMessage(msg: ChatMessage) {
      patchState(store, { messages: [...store.messages(), msg] });
    },
    clearMessages() {
      patchState(store, { messages: [] });
    }
  }))
);
