-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    funding_goal DECIMAL(12,2),
    current_funding DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create investments table
CREATE TABLE public.investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Enable RLS on investments
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view all projects" 
    ON public.projects FOR SELECT 
    USING (true);

CREATE POLICY "Users can create their own projects" 
    ON public.projects FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
    ON public.projects FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
    ON public.projects FOR DELETE 
    USING (auth.uid() = user_id);

-- Investments policies
CREATE POLICY "Users can view their own investments" 
    ON public.investments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investments" 
    ON public.investments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments" 
    ON public.investments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments" 
    ON public.investments FOR DELETE 
    USING (auth.uid() = user_id);