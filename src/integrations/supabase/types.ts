export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      admin_wallet_configs: {
        Row: {
          address: string
          admin_id: string
          id: string
          network: string
          symbol: string
        }
        Insert: {
          address: string
          admin_id: string
          id?: string
          network: string
          symbol: string
        }
        Update: {
          address?: string
          admin_id?: string
          id?: string
          network?: string
          symbol?: string
        }
        Relationships: []
      }
      admin_wallets: {
        Row: {
          address: string
          id: string
          network: string
          symbol: string
        }
        Insert: {
          address?: string
          id?: string
          network: string
          symbol: string
        }
        Update: {
          address?: string
          id?: string
          network?: string
          symbol?: string
        }
        Relationships: []
      }
      custom_accounts: {
        Row: {
          created_at: string
          created_by_admin_id: string | null
          custom_id: string
          email: string
          id: string
          password: string | null
          permissions: Json
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          created_by_admin_id?: string | null
          custom_id: string
          email: string
          id?: string
          password?: string | null
          permissions?: Json
          role: string
          username: string
        }
        Update: {
          created_at?: string
          created_by_admin_id?: string | null
          custom_id?: string
          email?: string
          id?: string
          password?: string | null
          permissions?: Json
          role?: string
          username?: string
        }
        Relationships: []
      }
      deposits: {
        Row: {
          address: string
          amount: number
          asset: string
          created_at: string | null
          id: string
          network: string
          screenshot_url: string | null
          status: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          address?: string
          amount: number
          asset: string
          created_at?: string | null
          id?: string
          network: string
          screenshot_url?: string | null
          status?: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          address?: string
          amount?: number
          asset?: string
          created_at?: string | null
          id?: string
          network?: string
          screenshot_url?: string | null
          status?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      kyc_submissions: {
        Row: {
          address: string
          admin_notes: string | null
          date_of_birth: string
          full_name: string
          id: string
          id_back_url: string | null
          id_front_url: string | null
          id_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_url: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          address: string
          admin_notes?: string | null
          date_of_birth: string
          full_name: string
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          id_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          address?: string
          admin_notes?: string | null
          date_of_birth?: string
          full_name?: string
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          id_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          amount: number
          created_at: string | null
          duration_seconds: number
          entry_price: number
          expected_profit_percentage: number
          id: string
          leverage: number
          margin: number
          pair: string
          pnl: number | null
          start_time: number
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          duration_seconds: number
          entry_price: number
          expected_profit_percentage?: number
          id?: string
          leverage: number
          margin: number
          pair: string
          pnl?: number | null
          start_time: number
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          duration_seconds?: number
          entry_price?: number
          expected_profit_percentage?: number
          id?: string
          leverage?: number
          margin?: number
          pair?: string
          pnl?: number | null
          start_time?: number
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_permissions: Json | null
          avatar_url: string | null
          balance: number | null
          created_at: string
          display_name: string | null
          email: string | null
          force_loss: boolean | null
          force_win: boolean | null
          force_win_spot: boolean | null
          ftid: string | null
          futures_balance: number | null
          id: string
          is_admin: boolean | null
          kyc_status: string | null
          staked_balance: number | null
          updated_at: string
          username: string | null
          withdrawal_address: string | null
        }
        Insert: {
          admin_permissions?: Json | null
          avatar_url?: string | null
          balance?: number | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          force_loss?: boolean | null
          force_win?: boolean | null
          force_win_spot?: boolean | null
          ftid?: string | null
          futures_balance?: number | null
          id: string
          is_admin?: boolean | null
          kyc_status?: string | null
          staked_balance?: number | null
          updated_at?: string
          username?: string | null
          withdrawal_address?: string | null
        }
        Update: {
          admin_permissions?: Json | null
          avatar_url?: string | null
          balance?: number | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          force_loss?: boolean | null
          force_win?: boolean | null
          force_win_spot?: boolean | null
          ftid?: string | null
          futures_balance?: number | null
          id?: string
          is_admin?: boolean | null
          kyc_status?: string | null
          staked_balance?: number | null
          updated_at?: string
          username?: string | null
          withdrawal_address?: string | null
        }
        Relationships: []
      }
      support_config: {
        Row: {
          email: string | null
          id: string
          telegram: string | null
          whatsapp: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          telegram?: string | null
          whatsapp?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          telegram?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          sender_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          sender_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          sender_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_assets: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          symbol: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          id?: string
          symbol: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          id: string
          referred_at: string | null
          referred_by_admin_id: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          id?: string
          referred_at?: string | null
          referred_by_admin_id: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          id?: string
          referred_at?: string | null
          referred_by_admin_id?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          address: string
          amount: number
          asset: string
          created_at: string | null
          id: string
          network: string
          note: string | null
          status: string
          user_id: string
        }
        Insert: {
          address: string
          amount: number
          asset: string
          created_at?: string | null
          id?: string
          network: string
          note?: string | null
          status?: string
          user_id: string
        }
        Update: {
          address?: string
          amount?: number
          asset?: string
          created_at?: string | null
          id?: string
          network?: string
          note?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      close_trade_position: {
        Args: { p_pnl: number; p_pos_id: string }
        Returns: boolean
      }
      create_custom_admin: {
        Args: {
          p_custom_id: string
          p_email: string
          p_password: string
          p_permissions: Json
          p_role: string
          p_username: string
        }
        Returns: string
      }
      delete_custom_admin: { Args: { p_email: string }; Returns: boolean }
      generate_ftid: { Args: never; Returns: string }
      get_all_custom_accounts: {
        Args: never
        Returns: {
          created_at: string
          created_by_admin_id: string | null
          custom_id: string
          email: string
          id: string
          password: string | null
          permissions: Json
          role: string
          username: string
        }[]
        SetofOptions: {
          from: "*"
          to: "custom_accounts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
