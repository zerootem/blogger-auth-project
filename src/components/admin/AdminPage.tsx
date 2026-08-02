import { communityService } from '@/services/community.service';
import { storageService } from '@/services/storage.service';
import { toastService } from '@/services/toast.service';
import { authStore } from '@/stores/auth.store';

export function AdminPage() {
  const members = () => communityService.getMembers();
  const messages = () => communityService.getMessages();
  const sessions = () => storageService.getSessions();

  const handleDeleteUser = (email: string) => {
    if (confirm(`هل أنت متأكد من حذف العضو "${email}"؟`)) {
      communityService.deleteMember(email);
      toastService.show(' تم حذف العضو');
    }
  };

  const handleDeleteMessage = (index: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      communityService.deleteMessage(index);
      toastService.show(' تم حذف الرسالة');
    }
  };

  const handleClearAllMessages = () => {
    if (confirm(' هل أنت متأكد من مسح جميع الرسائل نهائياً؟')) {
      communityService.clearAllMessages();
      toastService.show(' تم مسح جميع الرسائل');
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div style="padding:4px 0">
      <div class="adminStats">
        <div class="stat">
          <div class="num">{members().length}</div>
          <div class="label"> الأعضاء</div>
        </div>
        <div class="stat">
          <div class="num">{messages().length}</div>
          <div class="label"> الرسائل</div>
        </div>
        <div class="stat">
          <div class="num">{sessions().length}</div>
          <div class="label"> الجلسات</div>
        </div>
      </div>

      <div style="font-weight:600;font-size:.75rem;color:var(--headC);margin:8px 0 4px">
         إدارة الأعضاء
      </div>
      {members().length === 0 ? (
        <div class="adminEmpty">لا يوجد أعضاء</div>
      ) : (
        <table class="adminTable">
          <thead>
            <tr>
              <th>الإجراء</th>
              <th>البريد</th>
              <th>الاسم</th>
            </tr>
          </thead>
          <tbody>
            {members().map((member) => {
              const pic =
                member.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D8ABC&color=fff`;
              return (
                <tr>
                  <td>
                    <button class="delBtn" onClick={() => handleDeleteUser(member.email)}>
                      ✕
                    </button>
                  </td>
                  <td style="font-size:.6rem">{member.email}</td>
                  <td>
                    <div class="userCell">
                      <img src={pic} alt={member.name} />
                      <span>{member.name}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div style="font-weight:600;font-size:.75rem;color:var(--headC);margin:12px 0 4px">
         إدارة الرسائل
      </div>
      {messages().length === 0 ? (
        <div class="adminEmpty">لا توجد رسائل</div>
      ) : (
        <table class="adminTable">
          <thead>
            <tr>
              <th>الإجراء</th>
              <th>المرسل</th>
              <th>النص</th>
              <th>الوقت</th>
            </tr>
          </thead>
          <tbody>
            {messages().map((msg, index) => (
              <tr>
                <td>
                  <button class="delBtn" onClick={() => handleDeleteMessage(index)}>
                    ✕
                  </button>
                </td>
                <td style="font-size:.6rem">{msg.senderName || 'زائر'}</td>
                <td>
                  <span class="msgTxt">{msg.text}</span>
                </td>
                <td style="font-size:.6rem">{formatTime(msg.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div class="adminActions">
        <button class="danger" onClick={handleClearAllMessages}>
          🗑️ مسح كل الرسائل
        </button>
        <button onClick={() => authStore.openSheet('dashboard')}>↩ الرجوع</button>
      </div>
    </div>
  );
}
