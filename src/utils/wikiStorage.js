import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'wikime-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function saveWiki(slug, data, password = null) {
  const passwordHash = password ? await hashPassword(password) : null;
  const row = {
    slug,
    data: { ...data, slug },
    password_hash: passwordHash,
    has_password: !!password,
    saved_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from('wikis')
    .upsert(row, { onConflict: 'slug' });
  if (error) throw new Error(error.message);
  return row;
}

export async function loadWiki(slug) {
  const { data, error } = await supabase
    .from('wikis')
    .select('data, has_password, password_hash')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return {
    ...data.data,
    hasPassword: data.has_password,
    passwordHash: data.password_hash,
  };
}

export async function verifyPassword(slug, attempt) {
  const wiki = await loadWiki(slug);
  if (!wiki || !wiki.passwordHash) return false;
  const hash = await hashPassword(attempt);
  return hash === wiki.passwordHash;
}

export async function slugExists(slug) {
  const { count } = await supabase
    .from('wikis')
    .select('slug', { count: 'exact', head: true })
    .eq('slug', slug);
  return count > 0;
}

export function listWikis() {
  return supabase.from('wikis').select('slug, data, saved_at');
}