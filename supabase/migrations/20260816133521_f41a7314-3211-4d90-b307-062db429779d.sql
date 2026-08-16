CREATE POLICY "Users manage own kyc files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins read kyc files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'kyc-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users manage own support files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'support-attachments' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'support-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins manage support files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'support-attachments' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'support-attachments' AND public.has_role(auth.uid(), 'admin'));