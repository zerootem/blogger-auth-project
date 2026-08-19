import { createClient, User } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/supabase';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ProfileData {
  id?: string;
  email: string;
  name: string;
  picture: string;
  bio: string;
  login_count: number;
  login_history: Record<string, number>;
  session_start: string | null;
  last_visited_article: { title: string; url: string } | null;
}

export const supabaseService = {
  // تسجيل الدخول عبر Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  },

  // الحصول على المستخدم الحالي
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // تسجيل الخروج
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // قراءة الملف الشخصي من الجدول
  async getProfile(email: string): Promise<ProfileData | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    if (error) return null;
    return data as ProfileData;
  },

  // إنشاء أو تحديث الملف الشخصي
  async upsertProfile(profile: Partial<ProfileData> & { email: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          email: profile.email,
          name: profile.name || '',
          picture: profile.picture || '',
          bio: profile.bio || '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // تحديث بيانات الملف الشخصي
  async updateProfile(email: string, updates: Partial<ProfileData>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('email', email)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // زيادة عداد تسجيل الدخول
  async incrementLoginCount(email: string) {
    const profile = await this.getProfile(email);
    if (profile) {
      const newCount = (profile.login_count || 0) + 1;
      await supabase.from('profiles').update({ login_count: newCount }).eq('email', email);
    }
  },

  // إضافة تاريخ تسجيل دخول
  async addLoginToHistory(email: string) {
    const profile = await this.getProfile(email);
    if (profile) {
      const history: Record<string, number> = profile.login_history || {};
      const today = new Date().toISOString().slice(0, 10);
      history[today] = (history[today] || 0) + 1;
      const keys = Object.keys(history).sort().slice(-7);
      const trimmed: Record<string, number> = {};
      keys.forEach(k => trimmed[k] = history[k]);
      await supabase.from('profiles').update({ login_history: trimmed }).eq('email', email);
    }
  },

  // ضبط وقت بدء الجلسة
  async setSessionStart(email: string) {
    await supabase.from('profiles').update({ session_start: new Date().toISOString() }).eq('email', email);
  },

  // حفظ آخر مقال تمت زيارته
  async setLastVisitedArticle(email: string, article: { title: string; url: string }) {
    await supabase.from('profiles').update({ last_visited_article: article }).eq('email', email);
  },

  // الاستماع لتغيرات المصادقة
  onAuthStateChange(callback: (user: User | null) => void) {
    supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  },
};
