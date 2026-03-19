import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function uploadImage(file) {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('wiki-images')
    .upload(filename, file, { cacheControl: '3600', upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage
    .from('wiki-images')
    .getPublicUrl(filename);
  return data.publicUrl;
}