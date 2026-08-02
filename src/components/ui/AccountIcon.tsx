import { authStore } from '@/stores/auth.store';

export function AccountIcon() {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    authStore.toggleDropdown();
  };

  return (
    <span class="tAcnt" onClick={handleClick} style="cursor:pointer;">
      <span>
        {authStore.isLoggedIn() && authStore.userPicture() ? (
          <img
            src={authStore.userPicture()}
            alt={authStore.userName()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              'object-fit': 'cover',
              'object-position': 'center',
            }}
          />
        ) : authStore.isLoggedIn() ? (
          <b style={{ 'font-size': '13px', 'font-weight': 'bold', color: 'var(--linkB)' }}>
            {authStore.userInitial()}
          </b>
        ) : (
          <i />
        )}
      </span>
    </span>
  );
}
