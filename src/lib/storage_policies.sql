-- O comando abaixo geralmente não é necessário pois o RLS já vem ativado no Storage do Supabase.
-- Se der erro de permissão, é porque você não precisa rodá-lo.
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow PUBLIC Read Access (Anyone can view photos)
CREATE POLICY "Public Access Family Photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'family-photos' );

-- Policy: Allow Authenticated Users to Upload (Insert)
CREATE POLICY "Authenticated Insert Family Photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'family-photos' 
  AND auth.role() = 'authenticated'
  -- Optional: Restrict file size or type here if needed
);

-- Policy: Allow Authenticated Users to Update
CREATE POLICY "Authenticated Update Family Photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'family-photos' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow Authenticated Users to Delete
CREATE POLICY "Authenticated Delete Family Photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'family-photos' 
  AND auth.role() = 'authenticated'
);
