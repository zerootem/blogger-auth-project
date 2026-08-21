import { createSignal, onMount } from 'solid-js';
import { communityService } from '@/services/community.service';
import { authStore } from '@/stores/auth.store';
import type { CommunityMember } from '@/types';

const BackIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M9.57 5.92993L3.5 11.9999L9.57 18.0699" stroke-miterlimit="10"/><path d="M20.5 12H3.67004" stroke-miterlimit="10"/></svg>
);

export function MembersPage() {
  const [membersList, setMembersList] = createSignal<CommunityMember[]>([]);

  onMount(() => {
    communityService.addCurrentUserToCommunity();
    setMembersList(communityService.getMembers());
  });

  const handleViewProfile = (email: string) => {
    localStorage.setItem('viewProfileEmail', email);
    authStore.setSheetView('profile');
    authStore.openSheet('profile');
  };

  const truncateBio = (bio: string, maxLength = 40) => {
    if (!bio) return 'لا يوجد وصف';
    return bio.length > maxLength ? bio.slice(0, maxLength) + '...' : bio;
  };

  return (
    <div style="padding:4px 0; display:flex; flex-direction:column; min-height:100%;">
      <div style="font-size:.7rem;color:var(--bodyCa);margin-bottom:8px;text-align:center">{membersList().length} عضو نشط</div>
      {membersList().length === 0 ? (
        <div style="text-align:center;padding:20px 0;color:var(--bodyCa);font-size:.8rem">لا يوجد أعضاء بعد</div>
      ) : (
        membersList().map((member) => {
          const pic = member.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D8ABC&color=fff`;
          const statusClass = member.online ? 'online' : 'offline';
          const statusText = member.online ? ' نشط' : ' غير متصل';
          return (
            <div class="memberItem" onClick={() => handleViewProfile(member.email)} style="cursor:pointer;">
              <div class="avatar"><img src={pic} alt={member.name} /></div>
              <div class="info">
                <div class="name">{member.name}</div>
                <div class={`status ${statusClass}`}>{statusText} • {truncateBio(member.bio)}</div>
              </div>
            </div>
          );
        })
      )}
      <div class="sheet-footer">
        <button onClick={() => authStore.openSheet('dashboard')} class="backBtn"><BackIcon /> الرجوع للوحة</button>
      </div>
    </div>
  );
}
