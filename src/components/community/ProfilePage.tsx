import { createSignal, onMount } from 'solid-js';
import { communityService } from '@/services/community.service';
import { authStore } from '@/stores/auth.store';
import type { CommunityMember } from '@/types';

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
    <div>
      {member() === undefined ? (
        <div style="text-align:center;padding:20px 0;color:var(--bodyCa)">جاري التحميل...</div>
      ) : member() === null ? (
        <div style="text-align:center;padding:30px 0;color:var(--bodyCa)">
          العضو غير موجود
          <br />
          <button class="backBtn" onClick={goBackToMembers} style="margin-top:12px">↩ الرجوع للأعضاء</button>
        </div>
      ) : (
        <div class="profileView">
          <div class="avatar">
            <img src={member()!.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(member()!.name)}&background=0D8ABC&color=fff`} alt={member()!.name} />
          </div>
          <div class="name">{member()!.name}</div>
          {member()!.bio && (
            <div style="font-size:.8rem;color:var(--bodyCa);margin:4px 0;line-height:1.5;">
              {member()!.bio}
            </div>
          )}
          <div class="joinDate">
            انضم:{' '}
            {member()!.joinDate
              ? new Date(member()!.joinDate).toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'غير محدد'}
          </div>
          <div style="margin-top:8px;font-size:.7rem;color:var(--bodyCa)">
            {member()!.online ? ' نشط حالياً' : ' غير متصل'}
          </div>
          <button class="backBtn" onClick={goBackToMembers}>↩ الرجوع للأعضاء</button>
        </div>
      )}
    </div>
  );
}
