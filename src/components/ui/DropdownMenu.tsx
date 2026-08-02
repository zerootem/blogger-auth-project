import { authStore } from '@/stores/auth.store';
import type { SheetView } from '@/types';

interface MenuItem {
  label: string;
  icon: string;
  view: SheetView;
  adminOnly?: boolean;
}

export function DropdownMenu() {
  const menuItems: MenuItem[] = [
    {
      label: 'الحساب',
      icon: '<svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"/><path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"/></svg>',
      view: 'dashboard',
    },
    {
      label: 'لوحة التحكم',
      icon: '<svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/><path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"/></svg>',
      view: 'admin',
      adminOnly: true,
    },
    {
      label: 'أعضاء المجتمع',
      icon: '<svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/><path d="M23 21V19C22.735 17.6175 21.6864 16.4738 20.28 16.12"/><path d="M16 3.13C17.4112 3.45279 18.6081 4.39075 19.2096 5.6806C19.8112 6.97045 19.7533 8.4493 19.05 9.69"/></svg>',
      view: 'members',
    },
    {
      label: 'مجتمع مود ويب',
      icon: '<svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"/></svg>',
      view: 'chat',
    },
  ];

  const handleClick = (view: SheetView) => {
    authStore.openSheet(view);
    const toggle = document.getElementById('acntToggle') as HTMLInputElement;
    if (toggle) toggle.checked = false;
  };

  const handleLogout = () => {
    authStore.logout();
    const toggle = document.getElementById('acntToggle') as HTMLInputElement;
    if (toggle) toggle.checked = false;
  };

  return (
    <div class="acntW" data-text="">
      {authStore.isLoggedIn() ? (
        <>
          {menuItems
            .filter((item) => !item.adminOnly || authStore.isAdmin())
            .map((item) => (
              <button
                type="button"
                aria-label={item.label}
                onClick={() => handleClick(item.view)}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  padding: '8px 12px',
                  display: 'flex',
                  'align-items': 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  'border-radius': '6px',
                  color: 'inherit',
                  'font-family': 'inherit',
                  'font-size': 'inherit',
                }}
              >
                <span innerHTML={item.icon} />
                <span style={{ 'white-space': 'nowrap' }} />
              </button>
            ))}
          <button
            type="button"
            aria-label="تسجيل الخروج"
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              width: '100%',
              padding: '8px 12px',
              display: 'flex',
              'align-items': 'center',
              gap: '8px',
              cursor: 'pointer',
              'border-radius': '6px',
              color: 'inherit',
              'font-family': 'inherit',
              'font-size': 'inherit',
            }}
          >
            <svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;">
              <path d="M17.4399 14.62L19.9999 12.06L17.4399 9.5" />
              <path d="M9.76001 12.0601H19.93" />
              <path d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4" />
            </svg>
            <span style={{ 'white-space': 'nowrap' }} />
          </button>
        </>
      ) : (
        <button
          type="button"
          aria-label="تسجيل الدخول"
          onClick={() => {
            const toggle = document.getElementById('acntToggle') as HTMLInputElement;
            if (toggle) toggle.checked = false;
            authStore.openSheet('dashboard');
          }}
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
            padding: '8px 12px',
            display: 'flex',
            'align-items': 'center',
            gap: '8px',
            cursor: 'pointer',
            'border-radius': '6px',
            color: 'inherit',
            'font-family': 'inherit',
            'font-size': 'inherit',
          }}
        >
          <svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;">
            <path d="M11.6801 14.62L14.2401 12.06L11.6801 9.5" />
            <path d="M4 12.0601H14.17" />
            <path d="M12 4C16.42 4 20 7 20 12C20 17 16.42 20 12 20" />
          </svg>
          <span style={{ 'white-space': 'nowrap' }} />
        </button>
      )}
    </div>
  );
}
