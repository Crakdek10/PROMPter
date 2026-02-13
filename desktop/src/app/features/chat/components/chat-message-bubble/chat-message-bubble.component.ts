import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from "../../../../core/models/chat.model";

@Component({
  selector: 'app-chat-message-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message-bubble.component.html',
})
export class ChatMessageBubbleComponent {
  @Input({ required: true }) message!: ChatMessage;
  @Input() isAi: boolean = false;
}
