import { createEffect, onCleanup } from 'solid-js';
import { communityService } from '@/services/community.service';
import { authStore } from '@/stores/auth.store';
import { toastService } from '@/services/toast.service';
import type { ChatMessage } from '@/types';

export function ChatPage() {
  let messagesContainer: HTMLDivElement | undefined;
  let chatInput: HTMLInputElement | undefined;

  const messages = () => communityService.getMessages();
  const currentEmail = () => authStore.userEmail();

  const sendMessage = () => {
    const text = chatInput?.value.trim();
    if (!text) return;
    if (!authStore.isLoggedIn()) {
      toastService.show('يجب تسجيل الدخول أولاً');
      return;
    }
    communityService.sendMessage(text);
    if (chatInput) chatInput.value = '';
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // تحديث تلقائي للرسائل كل 3 ثوان
  const interval = setInterval(() => {
    // لا شيء، فقط لإعادة التصيير
  }, 3000);

  onCleanup(() => clearInterval(interval));

  return (
    <div class="chatContainer">
      <div
        class="chatMessages"
        ref={messagesContainer}
        style={{ 'max-height': '320px' }}
      >
        {messages().length === 0 ? (
          <div class="chatEmpty"> لا توجد رسائل بعد. كن أول من يكتب!</div>
        ) : (
          messages().map((msg) => {
            const isMe = msg.senderEmail === currentEmail();
            const cls = isMe ? 'chatMsg me' : 'chatMsg other';
            const senderDisplay = isMe ? 'أنت' : msg.senderName || 'زائر';
            return (
              <div class={cls}>
                <div>{msg.text}</div>
                <div class="meta">
                  <span class="name">{senderDisplay}</span>
                  <span>{formatTime(msg.time)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div class="chatInputRow">
        <input
          type="text"
          ref={chatInput}
          placeholder="اكتب رسالتك..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>إرسال</button>
      </div>
    </div>
  );
}
