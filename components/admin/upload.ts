import { createUploadUrl } from '@/app/admin/actions';
import { browserClient } from '@/lib/supabase-browser';

export async function uploadFile(file: File, folder: 'images' | 'videos') {
  const { path, token, publicUrl } = await createUploadUrl(folder, file.name);
  const { error } = await browserClient()
    .storage.from('media')
    .uploadToSignedUrl(path, token, file, { contentType: file.type });
  if (error) throw error;
  return publicUrl;
}
