import type { CommunityMember, ChatMessage } from '@/types';
import { storageService } from './storage.service';

export const communityService = {
  addCurrentUserToCommunity(): void {
    if (!storageService.isLoggedIn()) return;
    const name = storageService.getUserName();
    const email = storageService.getUserEmail();
    const picture = storageService.getUserPicture();
    const joinDate = storageService.getUserJoinDate();

    const members = storageService.getCommunityMembers();
    const existingIndex = members.findIndex((m) => m.email === email);

    if (existingIndex === -1) {
      members.push({
        name,
        email,
        picture,
        joinDate,
        lastSeen: new Date().toISOString(),
        online: true,
      });
    } else {
      members[existingIndex] = {
        ...members[existingIndex],
        lastSeen: new Date().toISOString(),
        online: true,
      };
    }

    storageService.saveCommunityMembers(members);
  },

  getMembers(): CommunityMember[] {
    return storageService.getCommunityMembers();
  },

  deleteMember(email: string): void {
    const members = storageService.getCommunityMembers().filter((m) => m.email !== email);
    storageService.saveCommunityMembers(members);
  },

  getMemberByEmail(email: string): CommunityMember | null {
    return storageService.getCommunityMembers().find((m) => m.email === email) || null;
  },

  getMessages(): ChatMessage[] {
    return storageService.getMessages();
  },

  sendMessage(text: string): void {
    const messages = storageService.getMessages();
    messages.push({
      senderName: storageService.getUserName() || 'زائر',
      senderEmail: storageService.getUserEmail(),
      text,
      time: new Date().toISOString(),
    });
    storageService.saveMessages(messages);
  },

  deleteMessage(index: number): void {
    const messages = storageService.getMessages();
    messages.splice(index, 1);
    storageService.saveMessages(messages);
  },

  clearAllMessages(): void {
    storageService.saveMessages([]);
  },
};
