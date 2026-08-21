import { createSignal, onMount } from 'solid-js';
import { communityService } from '@/services/community.service';
import { authStore } from '@/stores/auth.store';
import type { CommunityMember } from '@/types';

const BackIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M9.57 5.92993L3.5 11.9999L9.57 18.0699" stroke-miterlimit="10"/><path d="M20.5 12H3.67004" stroke-miterlimit="10"/></svg>
);

export function ProfilePage() {
  const [member, setMember] = createSignal<CommunityMember | null | undefined>(undefined);

  onMount(() => {
    const email = localStorage.getItem('viewProfileEmail') || '';
    const found = communityService.getMemberByEmail(email);
    setMember(found);
  });

  const goBackToMembers = () => {
    authStore.setSheetView('members');
    authStore.openSheet('members');
  };

  return (
    <div style="display:flex; flex-direction:column; min-height:100%;">
      {member() === undefined ? (
        <div style="text-align:center;padding:20px 0;color:var(--bodyCa)">جاري التحميل...</div>
      ) : member() === null ? (
        <div style="text-align:center;padding:30px 0;color:var(--bodyCa)">
          العضو غير موجود
          <div class="sheet-footer" style="justify-content:flex-start; margin-top:16px;">
            <button class="backBtn" onClick={goBackToMembers}><BackIcon /> الرجوع للأعضاء</button>
          </div>
        </div>
      ) : (
        <div class="profileView">
          <div class="avatar"><img src={member()!.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(member()!.name)}&background=0D8ABC&color=fff`} alt={member()!.name} /></div>
          <div class="name">{member()!.name}</div>
          {member()!.bio && <div style="font-size:.8rem;color:var(--bodyCa);margin:4px 0;line-height:1.5;">{member()!.bio}</div>}
          <div class="joinDate">انضم: {member()!.joinDate ? new Date(member()!.joinDate).toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' }) : 'غير محدد'}</div>
          <div style="margin-top:8px;font-size:.7rem;color:var(--bodyCa)">{member()!.online ? ' نشط حالياً' : ' غير متصل'}</div>
          <div class="sheet-footer" style="justify-content:flex-start; margin-top:16px;">
            <button class="backBtn" onClick={goBackToMembers}><BackIcon /> الرجوع للأعضاء</button>
          </div>
        </div>
      )}
    </div>
  );
}
