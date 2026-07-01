export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      consultations: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          message: string | null;
          mode: string | null;
          phone: string;
          preferred_date: string;
          preferred_time: string;
          status: string;
          topic: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          message?: string | null;
          mode?: string | null;
          phone: string;
          preferred_date: string;
          preferred_time: string;
          status?: string;
          topic?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          message?: string | null;
          mode?: string | null;
          phone?: string;
          preferred_date?: string;
          preferred_time?: string;
          status?: string;
          topic?: string | null;
        };
        Relationships: [];
      };
      follow_ups: {
        Row: {
          completed: boolean;
          created_at: string;
          created_by: string | null;
          due_date: string;
          id: string;
          lead_id: string | null;
          note: string | null;
        };
        Insert: {
          completed?: boolean;
          created_at?: string;
          created_by?: string | null;
          due_date: string;
          id?: string;
          lead_id?: string | null;
          note?: string | null;
        };
        Update: {
          completed?: boolean;
          created_at?: string;
          created_by?: string | null;
          due_date?: string;
          id?: string;
          lead_id?: string | null;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "follow_ups_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      investor_notes: {
        Row: {
          author_id: string | null;
          content: string;
          created_at: string;
          id: string;
          investor_id: string | null;
          lead_id: string | null;
        };
        Insert: {
          author_id?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          investor_id?: string | null;
          lead_id?: string | null;
        };
        Update: {
          author_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          investor_id?: string | null;
          lead_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "investor_notes_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          assigned_to: string | null;
          city: string | null;
          created_at: string;
          email: string;
          full_name: string;
          goal: string | null;
          id: string;
          investment_amount: number | null;
          message: string | null;
          phone: string;
          source: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          city?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          goal?: string | null;
          id?: string;
          investment_amount?: number | null;
          message?: string | null;
          phone: string;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          goal?: string | null;
          id?: string;
          investment_amount?: number | null;
          message?: string | null;
          phone?: string;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      meetings: {
        Row: {
          created_at: string;
          duration_min: number;
          id: string;
          investor_id: string | null;
          lead_id: string | null;
          link: string | null;
          mode: string | null;
          scheduled_at: string;
          status: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          duration_min?: number;
          id?: string;
          investor_id?: string | null;
          lead_id?: string | null;
          link?: string | null;
          mode?: string | null;
          scheduled_at: string;
          status?: string;
          title: string;
        };
        Update: {
          created_at?: string;
          duration_min?: number;
          id?: string;
          investor_id?: string | null;
          lead_id?: string | null;
          link?: string | null;
          mode?: string | null;
          scheduled_at?: string;
          status?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meetings_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      mutual_funds: {
        Row: {
          amc: string | null;
          aum_crore: number | null;
          category: string;
          created_at: string;
          expense_ratio: number | null;
          id: string;
          name: string;
          nav: number;
          return_1y: number | null;
          return_3y: number | null;
          return_5y: number | null;
          risk_level: string | null;
        };
        Insert: {
          amc?: string | null;
          aum_crore?: number | null;
          category: string;
          created_at?: string;
          expense_ratio?: number | null;
          id?: string;
          name: string;
          nav?: number;
          return_1y?: number | null;
          return_3y?: number | null;
          return_5y?: number | null;
          risk_level?: string | null;
        };
        Update: {
          amc?: string | null;
          aum_crore?: number | null;
          category?: string;
          created_at?: string;
          expense_ratio?: number | null;
          id?: string;
          name?: string;
          nav?: number;
          return_1y?: number | null;
          return_3y?: number | null;
          return_5y?: number | null;
          risk_level?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          kind: string;
          read: boolean;
          title: string;
          user_id: string | null;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          read?: boolean;
          title: string;
          user_id?: string | null;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          read?: boolean;
          title?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      portfolios: {
        Row: {
          created_at: string;
          current_value: number;
          fund_id: string;
          id: string;
          invested_amount: number;
          units: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_value?: number;
          fund_id: string;
          id?: string;
          invested_amount?: number;
          units?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_value?: number;
          fund_id?: string;
          id?: string;
          invested_amount?: number;
          units?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolios_fund_id_fkey";
            columns: ["fund_id"];
            isOneToOne: false;
            referencedRelation: "mutual_funds";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          pan: string | null;
          phone: string | null;
          risk_profile: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          pan?: string | null;
          phone?: string | null;
          risk_profile?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          pan?: string | null;
          phone?: string | null;
          risk_profile?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      sips: {
        Row: {
          amount: number;
          created_at: string;
          frequency: string;
          fund_id: string;
          id: string;
          next_date: string | null;
          start_date: string;
          status: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          frequency?: string;
          fund_id: string;
          id?: string;
          next_date?: string | null;
          start_date?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          frequency?: string;
          fund_id?: string;
          id?: string;
          next_date?: string | null;
          start_date?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sips_fund_id_fkey";
            columns: ["fund_id"];
            isOneToOne: false;
            referencedRelation: "mutual_funds";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          created_at: string;
          fund_id: string;
          id: string;
          nav: number;
          txn_date: string;
          type: string;
          units: number;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          fund_id: string;
          id?: string;
          nav?: number;
          txn_date?: string;
          type: string;
          units?: number;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          fund_id?: string;
          id?: string;
          nav?: number;
          txn_date?: string;
          type?: string;
          units?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_fund_id_fkey";
            columns: ["fund_id"];
            isOneToOne: false;
            referencedRelation: "mutual_funds";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "advisor" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "advisor", "user"],
    },
  },
} as const;
