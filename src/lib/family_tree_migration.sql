-- Criação da tabela de membros da família
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    photo_url TEXT,
    description TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    birth_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (Permissivas para facilitar o protótipo - idealmente restringir escrita)
CREATE POLICY "Enable read access for all users" ON family_members FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON family_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON family_members FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON family_members FOR DELETE USING (true);

-- IMPORTANTE:
-- Você também precisará criar um Bucket de Storage chamado 'family-photos'
-- com acesso público habilitado no painel do Supabase.
