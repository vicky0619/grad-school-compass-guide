-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for status and tag types
CREATE TYPE application_status AS ENUM ('researching', 'applied', 'admitted', 'rejected', 'pending');
CREATE TYPE university_tag AS ENUM ('reach', 'target', 'safety');
CREATE TYPE deadline_type AS ENUM ('application', 'document', 'recommendation', 'other');
CREATE TYPE document_type AS ENUM ('sop', 'cv', 'recommendation', 'transcript', 'other');

-- Universities table
CREATE TABLE universities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  url TEXT,
  location TEXT NOT NULL,
  deadline DATE NOT NULL,
  status application_status DEFAULT 'researching',
  tag university_tag DEFAULT 'target',
  application_fee INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements table
CREATE TABLE requirements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gre INTEGER DEFAULT 0,
  toefl INTEGER DEFAULT 0,
  gpa DECIMAL(3,2) DEFAULT 0,
  background TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deadlines table
CREATE TABLE deadlines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type deadline_type DEFAULT 'application',
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type document_type DEFAULT 'other',
  content TEXT,
  file_url TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post graduation info table
CREATE TABLE post_grad_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opt_eligible BOOLEAN DEFAULT TRUE,
  stem_designated BOOLEAN DEFAULT FALSE,
  h1b_sponsorship BOOLEAN DEFAULT FALSE,
  average_salary INTEGER DEFAULT 0,
  top_employers TEXT[],
  job_placement_rate INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User test scores table
CREATE TABLE user_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gre_total INTEGER,
  gre_verbal INTEGER,
  gre_quant INTEGER,
  gre_writing DECIMAL(2,1),
  toefl_total INTEGER,
  ielts_total DECIMAL(2,1),
  gpa DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_grad_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;

-- Policies for universities table
CREATE POLICY "Users can view their own universities" ON universities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own universities" ON universities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own universities" ON universities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own universities" ON universities
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for requirements table
CREATE POLICY "Users can view their own requirements" ON requirements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requirements" ON requirements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requirements" ON requirements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requirements" ON requirements
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for deadlines table
CREATE POLICY "Users can view their own deadlines" ON deadlines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deadlines" ON deadlines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deadlines" ON deadlines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deadlines" ON deadlines
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for documents table
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for post_grad_info table
CREATE POLICY "Users can view their own post grad info" ON post_grad_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own post grad info" ON post_grad_info
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own post grad info" ON post_grad_info
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own post grad info" ON post_grad_info
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_scores table
CREATE POLICY "Users can view their own scores" ON user_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" ON user_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores" ON user_scores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scores" ON user_scores
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deadlines_updated_at BEFORE UPDATE ON deadlines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_grad_info_updated_at BEFORE UPDATE ON post_grad_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_scores_updated_at BEFORE UPDATE ON user_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO universities (user_id, name, program_name, location, deadline, status, tag, application_fee, url) VALUES
  (auth.uid(), 'Stanford University', 'MS in Computer Science', 'Stanford, CA', '2024-12-15', 'researching', 'reach', 125, 'https://cs.stanford.edu'),
  (auth.uid(), 'UC Berkeley', 'MS in Computer Science', 'Berkeley, CA', '2024-12-01', 'applied', 'target', 120, 'https://eecs.berkeley.edu'),
  (auth.uid(), 'Georgia Tech', 'MS in Computer Science', 'Atlanta, GA', '2025-01-01', 'researching', 'target', 85, 'https://cc.gatech.edu');