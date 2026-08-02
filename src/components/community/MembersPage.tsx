import { createSignal, onMount } from 'solid-js';
import { communityService } from '@/services/community.service';
import { authStore } from '@/stores/auth.store';
import type { CommunityMember } from '@/types';

export function MembersPage() {
  const [membersList, setMembersList] = createSignal<CommunityMember[]>([]);

  onMount(() => {
    // إضافة المستخدم الحالي إذا لم يكن موجوداً
    communityService.addCurrentUserToCommunity();
    // تحديث القائمة مباشرة
    setMembersList(communityService.getMembers());
  });

  const handleViewProfile = (email: string) => {
    localStorage.setItem('viewProfileEmail', email);
    authStore.setSheetView('profile');
    authStore.openSheet('profile');
  };

  return (
    <div style="padding:4px 0">
      <div style="font-size:.7rem;color:var(--bodyCa);margin-bottom:8px;text-align:center">
        {membersList().length} عضو نشط
      </div>
      {membersList().length === 0 ? (
        <div style="text-align:center;padding:20px 0;color:var(--bodyCa);font-size:.8rem">
          لا يوجد أعضاء بعد
        </div>
      ) : (
        membersList().map((member) => {
          const pic = member.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D8ABC&color=fff`;
          const statusClass = member.online ? 'online' : 'offline';
          const statusText = member.online ? ' نشط' : ' غير متصل';
          return (
            <div class="memberItem" onClick={() => handleViewProfile(member.email)} style="cursor:pointer;">
              <div class="avatar">
                <img src={pic} alt={member.name} />
              </div>
              <div class="info">
                <div class="name">{member.name}</div>
                <div class={`status ${statusClass}`}>{statusText}</div>
              </div>
            </div>
          );
        })
      )}
      <div style="margin-top:10px;text-align:center">
        <button onClick={() => authStore.openSheet('dashboard')} class="gBtn gBtn-outline" style="display:inline-flex;width:auto;padding:6px 16px;font-size:.7rem">
          ↩ الرجوع للوحة
        </button>
      </div>
    </div>
  );
}
