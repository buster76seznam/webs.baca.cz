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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agentura_users: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          last_login: string | null
          password_suffix: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          last_login?: string | null
          password_suffix: string
          role: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          last_login?: string | null
          password_suffix?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      client_conversions: {
        Row: {
          converted_at: string
          currency: string
          id: string
          partner_id: string
          status: Database["public"]["Enums"]["conversion_status"]
          subscription_price: number
          updated_at: string
        }
        Insert: {
          converted_at?: string
          currency: string
          id?: string
          partner_id: string
          status?: Database["public"]["Enums"]["conversion_status"]
          subscription_price: number
          updated_at?: string
        }
        Update: {
          converted_at?: string
          currency?: string
          id?: string
          partner_id?: string
          status?: Database["public"]["Enums"]["conversion_status"]
          subscription_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_conversions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          advantage: string
          authorized_signatory: string | null
          company_address: string
          company_country: string | null
          company_email: string
          company_name: string
          company_phone: string
          contract_email: string | null
          created_at: string | null
          deleted_at: string | null
          description: string
          domain: string
          facebook_url: string | null
          feedback_history: Json | null
          generated_site_json: Json | null
          google_maps_url: string | null
          id: string
          images: string[] | null
          industry: string
          instagram_url: string | null
          ip_address: string | null
          language: string | null
          legal_business_name: string | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          price: number | null
          price_list: string | null
          preview_url: string | null
          primary_color: string | null
          principal_place_of_business: string | null
          ref_code: string | null
          revision_count: number
          secondary_color: string | null
          state_of_incorporation: string | null
          status: string
          status_updated_at: string | null
          working_hours: string
        }
        Insert: {
          advantage: string
          authorized_signatory?: string | null
          company_address: string
          company_country?: string | null
          company_email: string
          company_name: string
          company_phone: string
          contract_email?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description: string
          domain: string
          facebook_url?: string | null
          feedback_history?: Json | null
          generated_site_json?: Json | null
          google_maps_url?: string | null
          id?: string
          images?: string[] | null
          industry: string
          instagram_url?: string | null
          ip_address?: string | null
          language?: string | null
          legal_business_name?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          price?: number | null
          price_list?: string | null
          preview_url?: string | null
          primary_color?: string | null
          principal_place_of_business?: string | null
          ref_code?: string | null
          revision_count?: number
          secondary_color?: string | null
          state_of_incorporation?: string | null
          status?: string
          status_updated_at?: string | null
          working_hours: string
        }
        Update: {
          advantage?: string
          authorized_signatory?: string | null
          company_address?: string
          company_country?: string | null
          company_email?: string
          company_name?: string
          company_phone?: string
          contract_email?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          domain?: string
          facebook_url?: string | null
          feedback_history?: Json | null
          generated_site_json?: Json | null
          google_maps_url?: string | null
          id?: string
          images?: string[] | null
          industry?: string
          instagram_url?: string | null
          ip_address?: string | null
          language?: string | null
          legal_business_name?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          price?: number | null
          price_list?: string | null
          preview_url?: string | null
          primary_color?: string | null
          principal_place_of_business?: string | null
          ref_code?: string | null
          revision_count?: number
          secondary_color?: string | null
          state_of_incorporation?: string | null
          status?: string
          status_updated_at?: string | null
          working_hours?: string
        }
        Relationships: []
      }
      partner_clicks: {
        Row: {
          clicked_at: string | null
          id: string
          ip_address: string | null
          partner_id: string
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          partner_id: string
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          partner_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_clicks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          partner_id: string
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["payout_status"]
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          partner_id: string
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          partner_id?: string
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Relationships: [
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_referrals: {
        Row: {
          amount: number | null
          client_email: string
          client_name: string | null
          created_at: string | null
          id: string
          partner_id: string
          status: string | null
        }
        Insert: {
          amount?: number | null
          client_email: string
          client_name?: string | null
          created_at?: string | null
          id?: string
          partner_id: string
          status?: string | null
        }
        Update: {
          amount?: number | null
          client_email?: string
          client_name?: string | null
          created_at?: string | null
          id?: string
          partner_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          active: boolean | null
          active_clients: number | null
          approved_at: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          payout_method: Json | null
          referral_code: string
          social_links: string | null
          total_earned: number | null
          user_id: string | null
          verification_token: string | null
          verified: boolean | null
        }
        Insert: {
          active?: boolean | null
          active_clients?: number | null
          approved_at?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          payout_method?: Json | null
          referral_code: string
          social_links?: string | null
          total_earned?: number | null
          user_id?: string | null
          verification_token?: string | null
          verified?: boolean | null
        }
        Update: {
          active?: boolean | null
          active_clients?: number | null
          approved_at?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          payout_method?: Json | null
          referral_code?: string
          social_links?: string | null
          total_earned?: number | null
          user_id?: string | null
          verification_token?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          clicked_at: string
          id: string
          landing_page: string | null
          partner_id: string
          visitor_id: string
        }
        Insert: {
          clicked_at?: string
          id?: string
          landing_page?: string | null
          partner_id: string
          visitor_id: string
        }
        Update: {
          clicked_at?: string
          id?: string
          landing_page?: string | null
          partner_id?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      conversion_status: "trial" | "active" | "cancelled"
      payout_status: "pending" | "paid" | "failed"
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
      conversion_status: ["trial", "active", "cancelled"],
      payout_status: ["pending", "paid", "failed"],
    },
  },
} as const
