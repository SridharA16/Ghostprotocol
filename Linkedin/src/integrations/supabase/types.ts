export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "ai-sdr": {
        Row: {
          company_description: string | null
          company_website: string | null
          company_website_html_content: string | null
          created_at: string
          customer_sentiment: string | null
          employee_count: number | null
          ig_post_1: Json | null
          ig_post_2: Json | null
          ig_post_3: Json | null
          ig_post_4: Json | null
          ig_post_5: Json | null
          industries: string | null
          instagram_url: string | null
          last_contact_date: string | null
          lead_company: string | null
          lead_email: string | null
          lead_job_title: string | null
          lead_name: string | null
          lead_source: string | null
          linkedin_company_name: string | null
          linkedin_follower_count: number | null
          linkedin_url: string | null
          mail_id: string
          one_email_body: string | null
          one_email_subject: string | null
          pain_points_mentioned: string | null
          status: string | null
          thread_id: string | null
          tweet_1: Json | null
          tweet_2: Json | null
          tweet_3: Json | null
          tweet_4: Json | null
          tweet_5: Json | null
          twitter_url: string | null
        }
        Insert: {
          company_description?: string | null
          company_website?: string | null
          company_website_html_content?: string | null
          created_at?: string
          customer_sentiment?: string | null
          employee_count?: number | null
          ig_post_1?: Json | null
          ig_post_2?: Json | null
          ig_post_3?: Json | null
          ig_post_4?: Json | null
          ig_post_5?: Json | null
          industries?: string | null
          instagram_url?: string | null
          last_contact_date?: string | null
          lead_company?: string | null
          lead_email?: string | null
          lead_job_title?: string | null
          lead_name?: string | null
          lead_source?: string | null
          linkedin_company_name?: string | null
          linkedin_follower_count?: number | null
          linkedin_url?: string | null
          mail_id: string
          one_email_body?: string | null
          one_email_subject?: string | null
          pain_points_mentioned?: string | null
          status?: string | null
          thread_id?: string | null
          tweet_1?: Json | null
          tweet_2?: Json | null
          tweet_3?: Json | null
          tweet_4?: Json | null
          tweet_5?: Json | null
          twitter_url?: string | null
        }
        Update: {
          company_description?: string | null
          company_website?: string | null
          company_website_html_content?: string | null
          created_at?: string
          customer_sentiment?: string | null
          employee_count?: number | null
          ig_post_1?: Json | null
          ig_post_2?: Json | null
          ig_post_3?: Json | null
          ig_post_4?: Json | null
          ig_post_5?: Json | null
          industries?: string | null
          instagram_url?: string | null
          last_contact_date?: string | null
          lead_company?: string | null
          lead_email?: string | null
          lead_job_title?: string | null
          lead_name?: string | null
          lead_source?: string | null
          linkedin_company_name?: string | null
          linkedin_follower_count?: number | null
          linkedin_url?: string | null
          mail_id?: string
          one_email_body?: string | null
          one_email_subject?: string | null
          pain_points_mentioned?: string | null
          status?: string | null
          thread_id?: string | null
          tweet_1?: Json | null
          tweet_2?: Json | null
          tweet_3?: Json | null
          tweet_4?: Json | null
          tweet_5?: Json | null
          twitter_url?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          action_plan_doc_id: string | null
          call_type: string | null
          client_folder_id: string | null
          contact_id: string
          created_at: string | null
          email: string | null
          name: string
          notes: string | null
          phone_number: string | null
          progress_report_doc_id: string | null
          proposal_doc_id: string | null
          updated_at: string | null
        }
        Insert: {
          action_plan_doc_id?: string | null
          call_type?: string | null
          client_folder_id?: string | null
          contact_id: string
          created_at?: string | null
          email?: string | null
          name: string
          notes?: string | null
          phone_number?: string | null
          progress_report_doc_id?: string | null
          proposal_doc_id?: string | null
          updated_at?: string | null
        }
        Update: {
          action_plan_doc_id?: string | null
          call_type?: string | null
          client_folder_id?: string | null
          contact_id?: string
          created_at?: string | null
          email?: string | null
          name?: string
          notes?: string | null
          phone_number?: string | null
          progress_report_doc_id?: string | null
          proposal_doc_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_posts: {
        Row: {
          content: string
          content_type: string
          created_at: string
          edit_history: Json
          id: string
          original_content: string | null
          platform: string | null
          scheduled_date: string | null
          source_data: Json
          status: string
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          edit_history?: Json
          id?: string
          original_content?: string | null
          platform?: string | null
          scheduled_date?: string | null
          source_data: Json
          status?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          edit_history?: Json
          id?: string
          original_content?: string | null
          platform?: string | null
          scheduled_date?: string | null
          source_data?: Json
          status?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          action_items: Json | null
          attendee_emails: Json | null
          attendees: Json | null
          classification: string | null
          client_company_name: string | null
          client_email: string | null
          client_fname: string | null
          client_lname: string | null
          created_at: string | null
          duration: number | null
          fireflies_id: string
          host_email: string | null
          id: string
          meeting_date: string | null
          processed: boolean | null
          sentiment_negative: number | null
          sentiment_neutral: number | null
          sentiment_positive: number | null
          summary: string | null
          title: string
          transcript: string
          updated_at: string | null
        }
        Insert: {
          action_items?: Json | null
          attendee_emails?: Json | null
          attendees?: Json | null
          classification?: string | null
          client_company_name?: string | null
          client_email?: string | null
          client_fname?: string | null
          client_lname?: string | null
          created_at?: string | null
          duration?: number | null
          fireflies_id: string
          host_email?: string | null
          id?: string
          meeting_date?: string | null
          processed?: boolean | null
          sentiment_negative?: number | null
          sentiment_neutral?: number | null
          sentiment_positive?: number | null
          summary?: string | null
          title: string
          transcript: string
          updated_at?: string | null
        }
        Update: {
          action_items?: Json | null
          attendee_emails?: Json | null
          attendees?: Json | null
          classification?: string | null
          client_company_name?: string | null
          client_email?: string | null
          client_fname?: string | null
          client_lname?: string | null
          created_at?: string | null
          duration?: number | null
          fireflies_id?: string
          host_email?: string | null
          id?: string
          meeting_date?: string | null
          processed?: boolean | null
          sentiment_negative?: number | null
          sentiment_neutral?: number | null
          sentiment_positive?: number | null
          summary?: string | null
          title?: string
          transcript?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      viral_ads_submissions: {
        Row: {
          ad_inspiration_url: string | null
          campaign_objective: string
          created_at: string | null
          emotional_tone: string[]
          generated_ad_url_facebook: string | null
          generated_ad_url_instagram: string | null
          generated_ad_url_linkedin: string | null
          generated_ad_url_x: string | null
          id: string
          key_message_cta: string
          process_id: string
          product_image_url: string | null
          product_service_name: string
          social_media: string[]
          status: string | null
          target_audience: string
          webhook_sent: boolean | null
        }
        Insert: {
          ad_inspiration_url?: string | null
          campaign_objective: string
          created_at?: string | null
          emotional_tone?: string[]
          generated_ad_url_facebook?: string | null
          generated_ad_url_instagram?: string | null
          generated_ad_url_linkedin?: string | null
          generated_ad_url_x?: string | null
          id?: string
          key_message_cta: string
          process_id?: string
          product_image_url?: string | null
          product_service_name: string
          social_media?: string[]
          status?: string | null
          target_audience: string
          webhook_sent?: boolean | null
        }
        Update: {
          ad_inspiration_url?: string | null
          campaign_objective?: string
          created_at?: string | null
          emotional_tone?: string[]
          generated_ad_url_facebook?: string | null
          generated_ad_url_instagram?: string | null
          generated_ad_url_linkedin?: string | null
          generated_ad_url_x?: string | null
          id?: string
          key_message_cta?: string
          process_id?: string
          product_image_url?: string | null
          product_service_name?: string
          social_media?: string[]
          status?: string | null
          target_audience?: string
          webhook_sent?: boolean | null
        }
        Relationships: []
      }
      "viral-content-identifier": {
        Row: {
          audience_sentiment_score: number | null
          behavioral_insights: string | null
          created_at: string | null
          engagement_quality_score: number | null
          feedback_themes: string | null
          frequently_asked_questions: string[] | null
          id: string
          perceived_tool_value: number | null
          platform: string | null
          search_query: string | null
          updated_at: string | null
          urls: Json | null
        }
        Insert: {
          audience_sentiment_score?: number | null
          behavioral_insights?: string | null
          created_at?: string | null
          engagement_quality_score?: number | null
          feedback_themes?: string | null
          frequently_asked_questions?: string[] | null
          id?: string
          perceived_tool_value?: number | null
          platform?: string | null
          search_query?: string | null
          updated_at?: string | null
          urls?: Json | null
        }
        Update: {
          audience_sentiment_score?: number | null
          behavioral_insights?: string | null
          created_at?: string | null
          engagement_quality_score?: number | null
          feedback_themes?: string | null
          frequently_asked_questions?: string[] | null
          id?: string
          perceived_tool_value?: number | null
          platform?: string | null
          search_query?: string | null
          updated_at?: string | null
          urls?: Json | null
        }
        Relationships: []
      }
      workflow_bridge: {
        Row: {
          assigned_agent: string | null
          classification: string
          created_at: string
          data_payload: Json
          error_message: string | null
          id: string
          max_retries: number
          meeting_id: string
          priority: number
          processed_at: string | null
          result_payload: Json | null
          retry_count: number
          status: string
          updated_at: string
        }
        Insert: {
          assigned_agent?: string | null
          classification: string
          created_at?: string
          data_payload: Json
          error_message?: string | null
          id?: string
          max_retries?: number
          meeting_id: string
          priority?: number
          processed_at?: string | null
          result_payload?: Json | null
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_agent?: string | null
          classification?: string
          created_at?: string
          data_payload?: Json
          error_message?: string | null
          id?: string
          max_retries?: number
          meeting_id?: string
          priority?: number
          processed_at?: string | null
          result_payload?: Json | null
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      meetings_summary: {
        Row: {
          attendee_emails: Json | null
          classification: string | null
          created_at: string | null
          duration: number | null
          host_email: string | null
          id: string | null
          meeting_date: string | null
          overall_sentiment: string | null
          processed: boolean | null
          title: string | null
          transcript_length: number | null
        }
        Insert: {
          attendee_emails?: Json | null
          classification?: string | null
          created_at?: string | null
          duration?: number | null
          host_email?: string | null
          id?: string | null
          meeting_date?: string | null
          overall_sentiment?: never
          processed?: boolean | null
          title?: string | null
          transcript_length?: never
        }
        Update: {
          attendee_emails?: Json | null
          classification?: string | null
          created_at?: string | null
          duration?: number | null
          host_email?: string | null
          id?: string | null
          meeting_date?: string | null
          overall_sentiment?: never
          processed?: boolean | null
          title?: string | null
          transcript_length?: never
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
