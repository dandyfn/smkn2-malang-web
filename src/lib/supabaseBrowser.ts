// lib/supabaseBrowser.ts
// Jika proyekmu sudah punya klien Supabase untuk browser (misalnya lib/supabase.ts),
// boleh pakai itu saja dan ubah import di dua komponen ulasan.
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Testimonial = {
  id: string;
  author_name: string;
  rating: number;
  body: string;
  profile_url: string | null;
  time_label: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};