import { createSignal, onMount, createEffect, onCleanup } from 'solid-js';
import { authStore } from '@/stores/auth.store';
import { storageService } from '@/services/storage.service';
import { toastService } from '@/services/toast.service';
import type { UserSession } from '@/types';

export function DashboardPage() {
  const [showSettings, setShowSettings] = createSignal(false);
  let editForm: HTMLFormElement | undefined;
  let nameInput: HTMLInputElement | undefined;
  let picFileInput: HTMLInputElement | undefined;
  let picUrlInput: HTMLInputElement | undefined;
  let bioInput: HTMLTextAreaElement | undefined;
  let settingsPanel: HTMLDivElement | undefined;
  let settingsButton: HTMLButtonElement | undefined;

  const ensureCurrentSession = async () => {
    let sessions = storageService.getSessions();
    const hasCurrent = sessions.some(s => s.isCurrent);
    if (!hasCurrent) {
      let ip = 'غير معروف';
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip || 'غير معروف';
      } catch (e) {
        console.warn('تعذر جلب IP');
      }

      const newSession: UserSession = {
        id: Date.now(),
        time: new Date().toLocaleString('en-US', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        os: navigator.userAgent.includes('Win') ? 'Windows' :
            navigator.userAgent.includes('Mac') ? 'Mac' :
            navigator.userAgent.includes('Linux') ? 'Linux' : 'Android/iOS',
        ip: ip,
        isCurrent: true
      };
      storageService.addSession(newSession);
    }
    authStore.refreshSessions();
  };

  createEffect(() => {
    if (!authStore.isSheetOpen()) {
      setShowSettings(false);
    }
  });

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      showSettings() &&
      settingsPanel &&
      !settingsPanel.contains(target) &&
      settingsButton &&
      !settingsButton.contains(target)
    ) {
      setShowSettings(false);
    }
  };

  onMount(() => {
    ensureCurrentSession();
    document.addEventListener('click', handleOutsideClick);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleOutsideClick);
  });

  const sessions = () => authStore.sessions().slice().sort((a, b) => b.id - a.id);

  const handleRemoveSession = (idx: number) => {
    const sessionToRemove = sessions()[idx];
    const allSessions = storageService.getSessions();
    const realIndex = allSessions.findIndex(s => s.id === sessionToRemove.id);
    if (realIndex !== -1) {
      storageService.removeSession(realIndex);
      authStore.refreshSessions();
      toastService.show('تم إزالة الجلسة');
    }
  };

  const handleLogout = () => {
    authStore.logout();
    toastService.show('تم تسجيل الخروج بنجاح!');
  };

  const handleEditSubmit = (e: Event) => {
    e.preventDefault();
    const name = nameInput?.value.trim() || authStore.userName();
    const bio = bioInput?.value.trim() || authStore.userBio();
    const file = picFileInput?.files?.[0];
    const url = picUrlInput?.value.trim();

    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const picture = ev.target?.result as string;
        authStore.updateProfile(name, picture, bio);
        toastService.show('تم حفظ التعديلات!');
      };
      reader.readAsDataURL(file);
    } else if (url) {
      authStore.updateProfile(name, url, bio);
      toastService.show('تم حفظ التعديلات!');
    } else {
      authStore.updateProfile(name, authStore.userPicture(), bio);
      toastService.show('تم حفظ التعديلات!');
    }
  };

  return (
    <div style="display:flex; flex-direction:column; min-height:100%;">
      <div style="flex:1;">
        <p style="font-size:0.9rem;font-weight:500;margin-bottom:10px;color:var(--headC)">عرض حسابك وإدارته.</p>
        <div class="acctCard">
          <div class="acctUser">
            <div class="acctAvatar" style="border-radius:8px;">
              <img src={authStore.userPicture() || `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.userName())}&background=0D8ABC&color=fff`} alt={authStore.userName()} />
            </div>
            <div class="acctInfo">
              <div class="acctName">{authStore.userName()}</div>
              <div class="acctEmail">{authStore.userEmail()}</div>
              {authStore.userBio() && <div style="font-size:0.7rem;color:var(--bodyCa);margin-top:4px;">{authStore.userBio()}</div>}
              <div class="acctMeta">انضم: {authStore.joinDate() ? new Date(authStore.joinDate()).toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' }) : 'غير محدد'}</div>
            </div>
            <button ref={settingsButton} class="settingsTrigger" onClick={() => setShowSettings(!showSettings())} title="الإعدادات">
              <svg class="line" viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/>
                <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"/>
              </svg>
            </button>
          </div>

          <div class="acctSessions">
            <label>الجلسات النشطة</label>
            {sessions().length === 0 ? (
              <div style="font-size:.65rem;color:var(--bodyCa)">لا توجد جلسات</div>
            ) : (
              sessions().map((session, idx) => (
                <div class="sessionItem">
                  <div class="info">
                    <div style="display:flex;align-items:center;gap:3px;">
                      <svg class="line" viewBox="0 0 24 24" width="10" height="10"><path d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"/><path d="M12 8V13"/><path d="M9 2H15" stroke-miterlimit="10"/></svg>
                      <b>الوقت:</b> <span dir="ltr">{session.time}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:3px;">
                      <svg class="line" viewBox="0 0 24 24" width="10" height="10"><path d="M10 16.95H6.21C2.84 16.95 2 16.11 2 12.74V6.74003C2 3.37003 2.84 2.53003 6.21 2.53003H16.74C20.11 2.53003 20.95 3.37003 20.95 6.74003"/><path d="M10 21.4699V16.95"/><path d="M2 12.95H10"/><path d="M6.73999 21.47H9.99999"/><path d="M22 12.8V18.51C22 20.88 21.41 21.47 19.04 21.47H15.49C13.12 21.47 12.53 20.88 12.53 18.51V12.8C12.53 10.43 13.12 9.83997 15.49 9.83997H19.04C21.41 9.83997 22 10.43 22 12.8Z"/><path d="M17.2445 18.25H17.2535"/></svg>
                      <b>النظام:</b> {session.os}
                    </div>
                    <div style="display:flex;align-items:center;gap:3px;">
                      <svg class="line" viewBox="0 0 24 24" width="10" height="10"><path d="M12 13.4299C13.7231 13.4299 15.12 12.0331 15.12 10.3099C15.12 8.58681 13.7231 7.18994 12 7.18994C10.2769 7.18994 8.88 8.58681 8.88 10.3099C8.88 12.0331 10.2769 13.4299 12 13.4299Z"/><path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z"/></svg>
                      <b>IP:</b> {session.ip || "غير معروف"}
                    </div>
                    <div style="display:flex;align-items:center;gap:3px;">
                      <svg class="line" viewBox="0 0 24 24" width="10" height="10"><path d="M14.4399 19.05L15.9599 20.57L18.9999 17.53"/><path d="M12.16 10.87C12.06 10.86 11.94 10.86 11.83 10.87C9.44997 10.79 7.55997 8.84 7.55997 6.44C7.54997 3.99 9.53997 2 11.99 2C14.44 2 16.43 3.99 16.43 6.44C16.43 8.84 14.53 10.79 12.16 10.87Z"/><path d="M11.99 21.8101C10.17 21.8101 8.36004 21.3501 6.98004 20.4301C4.56004 18.8101 4.56004 16.1701 6.98004 14.5601C9.73004 12.7201 14.24 12.7201 16.99 14.5601"/></svg>
                      {session.isCurrent ? <b>الجلسة الحالية.</b> : <span style="opacity:.7">جلسة سابقة</span>}
                    </div>
                  </div>
                  <div class="actions">
                    {session.isCurrent ? (
                      <button class="btnLogout" onClick={handleLogout} title="تسجيل الخروج">
                        <svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M17.4399 14.62L19.9999 12.06L17.4399 9.5"/><path d="M9.76001 12.0601H19.93"/><path d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4"/></svg>
                      </button>
                    ) : (
                      <button class="btnRemove" onClick={() => handleRemoveSession(idx)}>✕</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div ref={settingsPanel} class="editPanel" style={{ display: showSettings() ? 'block' : 'none' }}>
            <form onSubmit={handleEditSubmit}>
              <label for="editName">الاسم:</label>
              <input type="text" id="editName" name="name" ref={nameInput} class="input" value={authStore.userName()} maxlength="32" required />
              <label for="editBio">النبذة / الوصف:</label>
              <textarea id="editBio" name="bio" ref={bioInput} class="input" style="height:60px;resize:vertical;" placeholder="أضف نبذة قصيرة عنك">{authStore.userBio()}</textarea>
              <div class="border-t my-2" />
              <div class="text-sm">تغيير الصورة:</div>
              <label for="editPicFile" class="block mb-1">(رفع صورة من جهازك)</label>
              <input type="file" id="editPicFile" name="pictureFile" ref={picFileInput} accept="image/*" class="input" />
              <label for="editPicUrl" class="block">(أو رابط مباشر للصورة)</label>
              <input type="url" id="editPicUrl" name="pictureUrl" ref={picUrlInput} class="input" placeholder="https://example.com/avatar.jpg" />
              <button type="submit" class="button primary w-full mt-2">حفظ التعديلات</button>
            </form>
          </div>
        </div>
      </div>
      <div class="lgnFooter"></div>
    </div>
  );
}
