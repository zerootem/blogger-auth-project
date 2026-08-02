import { communityService } from '@/services/community.service';
import { authStore } from '@/stores/auth.store';

export function ProfilePage() {
  const email = localStorage.getItem('viewProfileEmail') || '';
  const member = () => communityService.getMemberByEmail(email);

  const goBackToMembers = () => {
    authStore.setSheetView('members');
    authStore.openSheet('members');
  };

  return (
    <div>
      {!member() ? (
        <div style="text-align:center;padding:30px 0;color:var(--bodyCa)"> العضو غير موجود</div>
      ) : (
        <div class="profileView">
          <div class="avatar">
            <img
              src={
                member()!.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(member()!.name)}&background=0D8ABC&color=fff`
              }
              alt={member()!.name}
            />
          </div>
          <div class="name">{member()!.name}</div>
          <div class="email"> {member()!.email}</div>
          <div class="joinDate">
            انضم:{' '}
            {member()!.joinDate
              ? new Date(member()!.joinDate).toLocaleDateString('ar-EG', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'غير محدد'}
          </div>
          <div style="margin-top:8px;font-size:.7rem;color:var(--bodyCa)">
            {member()!.online ? ' نشط حالياً' : ' غير متصل'}
          </div>
          <button class="btnBack" onClick={goBackToMembers}>
            ↩ الرجوع للأعضاء
          </button>
        </div>
      )}
    </div>
  );
}
