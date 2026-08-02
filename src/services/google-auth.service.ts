import { CONFIG } from '@/config';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

// استخراج نوع Token Client من النافذة العامة
type GoogleTokenClient = ReturnType<NonNullable<typeof window.google>['accounts']['oauth2']['initTokenClient']>;

let tokenClient: GoogleTokenClient | null = null;

function decodeJwtResponse(token: string): GoogleUserInfo {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload) as GoogleUserInfo;
}

export const googleAuthService = {
  initOneTap(callback: (user: GoogleUserInfo) => void): void {
    if (!window.google?.accounts) return;
    window.google.accounts.id.initialize({
      client_id: CONFIG.googleClientId,
      callback: (response: { credential: string }) => {
        const user = decodeJwtResponse(response.credential);
        callback(user);
      },
      auto_select: false,
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isDisplayMoment()) {
        console.log('OneTap Displayed');
      }
    });
  },

  login(callback: (user: GoogleUserInfo) => void): void {
    if (!tokenClient) {
      this.initTokenClient(callback);
    }
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  },

  initTokenClient(callback: (user: GoogleUserInfo) => void): void {
    if (!window.google?.accounts) return;
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.googleClientId,
      scope: 'openid profile email',
      callback: async (tokenResponse: TokenResponse) => {
        if (tokenResponse?.access_token) {
          try {
            const user = await this.fetchUserInfo(tokenResponse.access_token);
            callback(user);
          } catch {
            console.error('Failed to fetch user info');
          }
        }
      },
    });
  },

  async fetchUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user info');
    return (await response.json()) as GoogleUserInfo;
  },

  cancelOneTap(): void {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
    }
  },
};
