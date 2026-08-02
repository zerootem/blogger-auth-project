export interface AuthConfig {
  googleClientId: string;
  adminEmail: string;
  projectName: string;
  bloggerDomain: string;
}

const defaultConfig: AuthConfig = {
  googleClientId: '36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com',
  adminEmail: 'modweeb3@gmail.com',
  projectName: 'مود ويب',
  bloggerDomain: '',
};

export function getConfig(): AuthConfig {
  if (typeof window !== 'undefined' && window.__MOD_AUTH_CONFIG__) {
    return { ...defaultConfig, ...window.__MOD_AUTH_CONFIG__ };
  }
  return defaultConfig;
}

export const CONFIG = getConfig();
