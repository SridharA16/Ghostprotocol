export interface ContentPost {
  id: string;
  title?: string;
  content: string;
  content_type: 'create_post' | 'lead_magnet';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  source_data: Record<string, any>;
  original_content?: string;
  edit_history: Array<{
    timestamp: string;
    changes: string;
    content: string;
  }>;
  scheduled_date?: string;
  platform?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateContentPostRequest {
  title?: string;
  content: string;
  content_type: 'create_post' | 'lead_magnet';
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
  source_data: Record<string, any>;
  original_content?: string;
  scheduled_date?: string;
  platform?: string;
  tags?: string[];
}

export interface UpdateContentPostRequest extends Partial<ContentPost> {
  id?: never; // Prevent updating ID
  created_at?: never; // Prevent updating created_at
}