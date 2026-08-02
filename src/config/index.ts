/**
 * إعدادات مشروع مود ويب للمصادقة
 */
export interface AuthConfig {
  googleClientId: string;
  adminEmail: string;
  projectName: string;
  bloggerDomain: string;
  allowedDomains: string[];
}

const defaultConfig: AuthConfig = {
  googleClientId: '36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com',
  adminEmail: 'modweeb3@gmail.com',
  projectName: 'مود ويب',
  bloggerDomain: '',
  allowedDomains: [
    'localhost',
    '127.0.0.1',
    'modweeb.com',
    'mdwnplus.blogspot.com',
    'zerootem.github.io',
  ],
};

export function getConfig(): AuthConfig {
  if (typeof window !== 'undefined' && window.__MOD_AUTH_CONFIG__) {
    return { ...defaultConfig, ...window.__MOD_AUTH_CONFIG__ };
  }
  return defaultConfig;
}

export const CONFIG = getConfig();
