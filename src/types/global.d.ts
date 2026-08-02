export {};

declare global {
  interface Window {
    __MOD_AUTH_CONFIG__?: Partial<{
      googleClientId: string;
      adminEmail: string;
      projectName: string;
      bloggerDomain: string;
    }>;
    google?: {
      accounts: {
        id: {
          initialize: (opts: Record<string, unknown>) => void;
          prompt: (cb?: (m: { isDisplayMoment: () => boolean }) => void) => void;
          cancel: () => void;
        };
        oauth2: {
          initTokenClient: (opts: Record<string, unknown>) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}
