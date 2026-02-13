import { Component, inject } from '@angular/core';
import { SessionStore } from '../../../../core/stores/session.store';
import { ChatPlaceholderComponent } from '../../components/chat-placeholder/chat-placeholder.component';
import { ChatFeedComponent } from '../../components/chat-feed/chat-feed.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [ChatPlaceholderComponent, ChatFeedComponent],
  templateUrl: './chat-page.component.html',
})
export class ChatPageComponent {
  readonly sessionStore = inject(SessionStore);
}
