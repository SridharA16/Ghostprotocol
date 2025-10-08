-- Create content_posts table
CREATE TABLE public.content_posts (
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
CREATE POLICY "Allow all operations on content_posts" 
ON public.content_posts 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_content_posts_content_type ON public.content_posts(content_type);
CREATE INDEX idx_content_posts_status ON public.content_posts(status);
CREATE INDEX idx_content_posts_scheduled_date ON public.content_posts(scheduled_date);
CREATE INDEX idx_content_posts_created_at ON public.content_posts(created_at DESC);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_content_posts_updated_at
  BEFORE UPDATE ON public.content_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();