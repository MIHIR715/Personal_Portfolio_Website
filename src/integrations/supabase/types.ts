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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          display_order: number
          end_date: string | null
          grade: string | null
          id: string
          institution: string
          start_date: string | null
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          grade?: string | null
          id?: string
          institution: string
          start_date?: string | null
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          grade?: string | null
          id?: string
          institution?: string
          start_date?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          end_date: string | null
          id: string
          organization: string | null
          start_date: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          organization?: string | null
          start_date?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          organization?: string | null
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          design_exploration: string[]
          design_system: string | null
          display_order: number
          featured: boolean
          final_ui: string[]
          gallery: string[]
          goal: string | null
          hero_image_url: string | null
          id: string
          learnings: string | null
          outcome: string | null
          problem: string | null
          prototype_url: string | null
          published: boolean
          research: string | null
          role: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          subtitle: string | null
          tags: string[]
          thumbnail_url: string | null
          title: string
          tools: string[]
          updated_at: string
          user_flow: string[]
          wireframes: string[]
          year: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          design_exploration?: string[]
          design_system?: string | null
          display_order?: number
          featured?: boolean
          final_ui?: string[]
          gallery?: string[]
          goal?: string | null
          hero_image_url?: string | null
          id?: string
          learnings?: string | null
          outcome?: string | null
          problem?: string | null
          prototype_url?: string | null
          published?: boolean
          research?: string | null
          role?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          subtitle?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title: string
          tools?: string[]
          updated_at?: string
          user_flow?: string[]
          wireframes?: string[]
          year?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          design_exploration?: string[]
          design_system?: string | null
          display_order?: number
          featured?: boolean
          final_ui?: string[]
          gallery?: string[]
          goal?: string | null
          hero_image_url?: string | null
          id?: string
          learnings?: string | null
          outcome?: string | null
          problem?: string | null
          prototype_url?: string | null
          published?: boolean
          research?: string | null
          role?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          subtitle?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          tools?: string[]
          updated_at?: string
          user_flow?: string[]
          wireframes?: string[]
          year?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_text: string | null
          availability: string | null
          avatar_url: string | null
          email: string | null
          hero_description: string | null
          hero_headline: string | null
          id: string
          location: string | null
          name: string
          philosophy: string | null
          phone: string | null
          professional_title: string | null
          resume_url: string | null
          updated_at: string
        }
        Insert: {
          about_text?: string | null
          availability?: string | null
          avatar_url?: string | null
          email?: string | null
          hero_description?: string | null
          hero_headline?: string | null
          id?: string
          location?: string | null
          name?: string
          philosophy?: string | null
          phone?: string | null
          professional_title?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Update: {
          about_text?: string | null
          availability?: string | null
          avatar_url?: string | null
          email?: string | null
          hero_description?: string | null
          hero_headline?: string | null
          id?: string
          location?: string | null
          name?: string
          philosophy?: string | null
          phone?: string | null
          professional_title?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          display_order: number
          id: string
          platform: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          platform: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          platform?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
