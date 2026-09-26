// ─── Local Offline Database (Replaces Supabase) ───
// This file simulates a cloud database using your browser's localStorage
// so you don't have to set up any API keys or external services!

export interface DBChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  session_id: string;
}

export interface DBUserProfile {
  id: string;
  email: string;
  full_name: string;
  risk_profile?: string;
  monthly_income?: number;
  created_at?: string;
}

class LocalSupabaseMock {
  private getTable(table: string) {
    return JSON.parse(localStorage.getItem(`db_${table}`) || '[]');
  }

  private setTable(table: string, data: any[]) {
    localStorage.setItem(`db_${table}`, JSON.stringify(data));
  }

  from(table: string) {
    return {
      insert: async (data: any) => {
        const currentData = this.getTable(table);
        const newData = { 
          id: `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
          created_at: new Date().toISOString(),
          ...data 
        };
        this.setTable(table, [...currentData, newData]);
        return { data: [newData], error: null };
      },
      select: async (query?: string) => {
        return { data: this.getTable(table), error: null };
      },
      update: async (data: any) => {
        // Simplified update for mock
        return { data, error: null };
      }
    };
  }
}

// Export the mock client instead of the real Supabase client
export const supabase = new LocalSupabaseMock();
