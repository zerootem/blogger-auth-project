import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/supabase';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SessionRecord {
  session_id: string;
  time: string;
  os: string;
  ip: string;
  is_current: boolean;
}

export const supabaseService = {
  // ---- الملف الشخصي ----
  async getProfile(email: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    if (error) return null;
    return data;
  },

  async upsertProfile(profile: { email: string; name: string; picture: string; bio?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
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

  async updateProfile(email: string, updates: { name?: string; picture?: string; bio?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('email', email)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async incrementLoginCount(email: string) {
    const profile = await this.getProfile(email);
    if (profile) {
      const newCount = (profile.login_count || 0) + 1;
      await supabase.from('profiles').update({ login_count: newCount }).eq('email', email);
    }
  },

  async setSessionStart(email: string) {
    await supabase.from('profiles').update({ session_start: new Date().toISOString() }).eq('email', email);
  },

  async setLastVisitedArticle(email: string, article: { title: string; url: string }) {
    await supabase.from('profiles').update({ last_visited_article: article }).eq('email', email);
  },

  async getLoginHistory(email: string): Promise<Record<string, number>> {
    const profile = await this.getProfile(email);
    return profile?.login_history || {};
  },

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

  // ---- الجلسات ----
  async createSession(session: SessionRecord & { user_email: string }) {
    const { data, error } = await supabase
      .from('sessions')
      .upsert(session, { onConflict: 'session_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getSessions(user_email: string): Promise<SessionRecord[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_email', user_email)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data as SessionRecord[];
  },

  async deleteSession(session_id: string) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('session_id', session_id);
    if (error) throw error;
  },

  async deleteAllSessions(user_email: string) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('user_email', user_email);
    if (error) throw error;
  },
};
