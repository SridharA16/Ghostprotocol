/*
  # Create content_posts table for LinkedIn content management

  1. New Tables
    - `content_posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `title` (varchar) - Title of the post
      - `content` (text) - Main content of the post
      - `content_type` (varchar) - Type of content (create_post or lead_magnet)
      - `status` (varchar) - Current status (draft, scheduled, published, archived)
      - `source_data` (jsonb) - Original data used to generate the post
      - `original_content` (text) - Original unedited content
      - `edit_history` (jsonb) - Array of edit history entries
      - `scheduled_date` (timestamptz) - When the post is scheduled to be published
      - `platform` (varchar) - Target platform for the post
      - `tags` (text[]) - Array of tags for categorization
      - `created_at` (timestamptz) - Timestamp when the post was created
      - `updated_at` (timestamptz) - Timestamp when the post was last updated

  2. Security
    - Enable RLS on `content_posts` table
    - Add policy to allow all operations (no auth required for now)

  3. Performance
    - Create indexes on frequently queried columns:
      - content_type for filtering by type
      - status for filtering by status
      - scheduled_date for calendar queries
      - created_at for sorting recent posts

  4. Automation
    - Create trigger to automatically update `updated_at` timestamp on row updates
*/

-- Create content_posts table
CREATE TABLE IF NOT EXISTS public.content_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255),
  content TEXT NOT NULL,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('create_post', 'lead_magnet')),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  source_data JSONB NOT NULL DEFAULT '{}',
  original_content TEXT,
  edit_history JSONB NOT NULL DEFAULT '[]',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  platform VARCHAR(50),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since no auth is implemented yet)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'content_posts' 
    AND policyname = 'Allow all operations on content_posts'
  ) THEN
    CREATE POLICY "Allow all operations on content_posts" 
    ON public.content_posts 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_posts_content_type ON public.content_posts(content_type);
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON public.content_posts(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_scheduled_date ON public.content_posts(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_posts_created_at ON public.content_posts(created_at DESC);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_content_posts_updated_at ON public.content_posts;
CREATE TRIGGER update_content_posts_updated_at
  BEFORE UPDATE ON public.content_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
