-- =====================================================================
-- SUMITRA KELANA WISATA + PEMBAGIAN PERAN ADMIN
-- Jalankan sekali di Supabase > SQL Editor (project yang dipakai website).
-- Aman dijalankan ulang: semua perintah memakai IF NOT EXISTS / DROP IF EXISTS.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PERAN ADMIN
--    sekolah             : admin sekolah, boleh mengelola semua konten
--    sumitra             : admin Sumitra (Pak Roy), hanya menu Sumitra
--    kontributor_sumitra : siswa, hanya unggah galeri perjalanan
-- ---------------------------------------------------------------------
create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  nama text not null default '',
  peran text not null check (peran in ('sekolah', 'sumitra', 'kontributor_sumitra')),
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

-- Akun admin yang SUDAH ADA sebelum fitur peran dijadikan admin sekolah.
-- Hanya berjalan sekali (saat tabel peran masih kosong) supaya akun yang
-- nanti dibuat lewat menu Kelola Akun tidak ikut berubah perannya.
do $$
begin
  if not exists (select 1 from public.admin_roles) then
    insert into public.admin_roles (user_id, email, peran)
    select id, email, 'sekolah' from auth.users
    on conflict (user_id) do nothing;
  end if;
end $$;

create or replace function public.peran_saya()
returns text language sql stable security definer set search_path = public as $$
  select peran from public.admin_roles where user_id = auth.uid() and aktif
$$;

create or replace function public.is_admin_sekolah()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.peran_saya() = 'sekolah', false)
$$;

create or replace function public.is_admin_sumitra()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.peran_saya() in ('sekolah', 'sumitra'), false)
$$;

create or replace function public.is_tim_sumitra()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.peran_saya() in ('sekolah', 'sumitra', 'kontributor_sumitra'), false)
$$;

grant execute on function public.peran_saya(), public.is_admin_sekolah(), public.is_admin_sumitra(), public.is_tim_sumitra()
  to anon, authenticated;

alter table public.admin_roles enable row level security;
drop policy if exists "baca peran sendiri" on public.admin_roles;
drop policy if exists "admin sekolah baca semua peran" on public.admin_roles;
create policy "baca peran sendiri" on public.admin_roles for select to authenticated
  using (user_id = auth.uid());
create policy "admin sekolah baca semua peran" on public.admin_roles for select to authenticated
  using (public.is_admin_sekolah());
-- Tambah/ubah peran hanya lewat server (menu Kelola Akun memakai service role key).
grant select on public.admin_roles to authenticated;

-- ---------------------------------------------------------------------
-- 2. KUNCI KONTEN SEKOLAH & KADOEA HANYA UNTUK ADMIN SEKOLAH
--    Policy RESTRICTIVE ditambahkan di atas policy lama (tidak menghapusnya),
--    sehingga akun Sumitra tidak bisa menambah/mengubah/menghapus konten sekolah.
--    Pengunjung (anon) tetap bisa mengirim pertanyaan/ulasan seperti biasa.
-- ---------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['berita', 'prestasi', 'kalender', 'guru', 'testimonials', 'faq_questions',
                           'kadoea_paket', 'kadoea_faq', 'kadoea_ulasan']
  loop
    if to_regclass('public.' || t) is not null then
      execute format('drop policy if exists "khusus admin sekolah (tambah)" on public.%I', t);
      execute format('drop policy if exists "khusus admin sekolah (ubah)" on public.%I', t);
      execute format('drop policy if exists "khusus admin sekolah (hapus)" on public.%I', t);
      execute format('create policy "khusus admin sekolah (tambah)" on public.%I as restrictive for insert to authenticated with check (public.is_admin_sekolah())', t);
      execute format('create policy "khusus admin sekolah (ubah)" on public.%I as restrictive for update to authenticated using (public.is_admin_sekolah()) with check (public.is_admin_sekolah())', t);
      execute format('create policy "khusus admin sekolah (hapus)" on public.%I as restrictive for delete to authenticated using (public.is_admin_sekolah())', t);
    end if;
  end loop;
end $$;

-- Gambar berita/prestasi/tendik (bucket "gambar coba") juga hanya untuk admin sekolah
drop policy if exists "gambar sekolah khusus admin sekolah (tambah)" on storage.objects;
drop policy if exists "gambar sekolah khusus admin sekolah (ubah)" on storage.objects;
drop policy if exists "gambar sekolah khusus admin sekolah (hapus)" on storage.objects;
create policy "gambar sekolah khusus admin sekolah (tambah)" on storage.objects as restrictive for insert to authenticated
  with check (bucket_id <> 'gambar coba' or public.is_admin_sekolah());
create policy "gambar sekolah khusus admin sekolah (ubah)" on storage.objects as restrictive for update to authenticated
  using (bucket_id <> 'gambar coba' or public.is_admin_sekolah());
create policy "gambar sekolah khusus admin sekolah (hapus)" on storage.objects as restrictive for delete to authenticated
  using (bucket_id <> 'gambar coba' or public.is_admin_sekolah());

-- ---------------------------------------------------------------------
-- 3. TABEL SUMITRA
-- ---------------------------------------------------------------------
create table if not exists public.sumitra_pengaturan (
  id int primary key default 1 check (id = 1),
  nomor_wa text not null default '',          -- format 628xxxxxxxxxx
  instagram text not null default '',
  facebook text not null default '',
  jam_buka text not null default '',
  besaran_dp text not null default '',
  aturan_tambahan text not null default '',   -- satu baris = satu poin syarat
  logo_url text,
  hero_foto_url text,
  tentang_foto_url text,
  updated_at timestamptz not null default now()
);
insert into public.sumitra_pengaturan (id) values (1) on conflict (id) do nothing;

create table if not exists public.sumitra_paket (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  jenis text not null check (jenis in ('open_trip', 'private_trip', 'internasional')),
  nama text not null check (char_length(nama) between 2 and 120),
  ringkasan text not null default '',
  durasi text not null default '',
  jadwal text not null default '',
  harga_mulai bigint check (harga_mulai is null or harga_mulai >= 0),
  satuan_harga text not null default 'orang',
  catatan_harga text not null default '',
  termasuk text not null default '',          -- satu baris = satu fasilitas
  susunan_acara text not null default '',     -- satu baris = satu kegiatan
  foto_url text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sumitra_layanan (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 80),
  ikon text not null default 'pemandu' check (ikon in ('pemandu', 'mobil', 'pesawat', 'tiket', 'trail', 'kereta')),
  deskripsi text not null default '',
  harga_mulai bigint check (harga_mulai is null or harga_mulai >= 0),
  satuan_harga text not null default '',
  label_harga text not null default '',       -- jika diisi, menggantikan tampilan harga (mis. "Tanpa biaya layanan")
  field_wa text[] not null default array['tanggal', 'jumlah']
    check (field_wa <@ array['tanggal', 'jumlah', 'lokasi', 'lama', 'bayar']),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create sequence if not exists public.sumitra_pesanan_seq;
create table if not exists public.sumitra_pesanan (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique default ('SKW-' || lpad(nextval('public.sumitra_pesanan_seq')::text, 4, '0')),
  jenis text not null check (jenis in ('paket', 'layanan')),
  item_id uuid,
  item_nama text not null,
  nama text not null,
  no_wa text not null,
  tanggal date,
  jumlah int check (jumlah is null or jumlah between 1 and 500),
  lokasi text not null default '',
  lama text not null default '',
  cara_bayar text not null default '',
  catatan text not null default '',
  setuju_syarat boolean not null default false,
  status text not null default 'baru' check (status in ('baru', 'dp', 'lunas', 'selesai', 'batal')),
  catatan_admin text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sumitra_galeri (
  id uuid primary key default gen_random_uuid(),
  foto_url text not null,
  keterangan text not null default '',
  paket_id uuid references public.sumitra_paket (id) on delete set null,
  is_published boolean not null default true,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.sumitra_testimoni (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  perjalanan text not null default '',        -- mis. "Open Trip Bromo"
  rating int not null default 5 check (rating between 1 and 5),
  isi text not null,
  foto_url text,
  balasan text,
  dibalas_at timestamptz,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sumitra_faq (
  id uuid primary key default gen_random_uuid(),
  nama_penanya text,                          -- null = dibuat admin, '' = pengunjung tanpa nama
  pertanyaan text not null,
  jawaban text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sumitra_mitra (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 80),
  logo_url text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- updated_at otomatis
create or replace function public.sumitra_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists sumitra_pesanan_updated on public.sumitra_pesanan;
create trigger sumitra_pesanan_updated before update on public.sumitra_pesanan
  for each row execute function public.sumitra_set_updated_at();
drop trigger if exists sumitra_pengaturan_updated on public.sumitra_pengaturan;
create trigger sumitra_pengaturan_updated before update on public.sumitra_pengaturan
  for each row execute function public.sumitra_set_updated_at();

-- ---------------------------------------------------------------------
-- 4. PEMESANAN DARI WEBSITE (dipanggil formulir pemesanan)
--    Pengunjung tidak bisa membaca tabel pesanan; fungsi ini menyimpan
--    pesanan lalu mengembalikan kode pesanan untuk pesan WhatsApp.
-- ---------------------------------------------------------------------
create or replace function public.buat_pesanan_sumitra(
  p_jenis text,
  p_item_id uuid,
  p_nama text,
  p_no_wa text,
  p_tanggal date default null,
  p_jumlah int default null,
  p_lokasi text default '',
  p_lama text default '',
  p_cara_bayar text default '',
  p_catatan text default '',
  p_setuju boolean default false
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_item text;
  v_kode text;
  v_wa text := regexp_replace(coalesce(p_no_wa, ''), '[^0-9+]', '', 'g');
begin
  if not coalesce(p_setuju, false) then
    raise exception 'Syarat pembayaran dan pembatalan harus disetujui';
  end if;
  if char_length(trim(coalesce(p_nama, ''))) not between 2 and 80 then
    raise exception 'Nama tidak valid';
  end if;
  if v_wa !~ '^\+?[0-9]{9,15}$' then
    raise exception 'Nomor WhatsApp tidak valid';
  end if;
  if p_jumlah is not null and p_jumlah not between 1 and 500 then
    raise exception 'Jumlah peserta tidak valid';
  end if;

  if p_jenis = 'paket' then
    select nama into v_item from public.sumitra_paket where id = p_item_id and is_published;
  elsif p_jenis = 'layanan' then
    select nama into v_item from public.sumitra_layanan where id = p_item_id and is_published;
  else
    raise exception 'Jenis pesanan tidak valid';
  end if;
  if v_item is null then
    raise exception 'Paket atau layanan tidak ditemukan';
  end if;

  -- Pembatas sederhana: maksimal 5 pesanan per nomor dalam 1 jam
  if (select count(*) from public.sumitra_pesanan
      where no_wa = v_wa and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Terlalu banyak pesanan dari nomor ini. Coba lagi nanti';
  end if;

  insert into public.sumitra_pesanan
    (jenis, item_id, item_nama, nama, no_wa, tanggal, jumlah, lokasi, lama, cara_bayar, catatan, setuju_syarat)
  values
    (p_jenis, p_item_id, v_item, left(trim(p_nama), 80), v_wa, p_tanggal, p_jumlah,
     left(coalesce(p_lokasi, ''), 200), left(coalesce(p_lama, ''), 60), left(coalesce(p_cara_bayar, ''), 30),
     left(coalesce(p_catatan, ''), 500), true)
  returning kode into v_kode;

  return v_kode;
end $$;

revoke all on function public.buat_pesanan_sumitra(text, uuid, text, text, date, int, text, text, text, text, boolean) from public;
grant execute on function public.buat_pesanan_sumitra(text, uuid, text, text, date, int, text, text, text, text, boolean)
  to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. HAK AKSES & RLS TABEL SUMITRA
-- ---------------------------------------------------------------------
grant select on public.sumitra_pengaturan, public.sumitra_paket, public.sumitra_layanan, public.sumitra_galeri,
  public.sumitra_testimoni, public.sumitra_faq, public.sumitra_mitra to anon, authenticated;
grant insert on public.sumitra_testimoni, public.sumitra_faq to anon;
grant select, insert, update, delete on public.sumitra_pengaturan, public.sumitra_paket, public.sumitra_layanan,
  public.sumitra_pesanan, public.sumitra_galeri, public.sumitra_testimoni, public.sumitra_faq, public.sumitra_mitra
  to authenticated;
grant usage on sequence public.sumitra_pesanan_seq to authenticated;

alter table public.sumitra_pengaturan enable row level security;
alter table public.sumitra_paket enable row level security;
alter table public.sumitra_layanan enable row level security;
alter table public.sumitra_pesanan enable row level security;
alter table public.sumitra_galeri enable row level security;
alter table public.sumitra_testimoni enable row level security;
alter table public.sumitra_faq enable row level security;
alter table public.sumitra_mitra enable row level security;

-- Hapus policy lama agar bisa dijalankan ulang
do $$
declare
  r record;
begin
  for r in select tablename, policyname from pg_policies
           where schemaname = 'public' and tablename like 'sumitra\_%'
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Pengunjung: membaca yang tayang
create policy "publik baca pengaturan" on public.sumitra_pengaturan for select to anon, authenticated using (true);
create policy "publik baca paket" on public.sumitra_paket for select to anon, authenticated using (is_published);
create policy "publik baca layanan" on public.sumitra_layanan for select to anon, authenticated using (is_published);
create policy "publik baca galeri" on public.sumitra_galeri for select to anon, authenticated using (is_published);
create policy "publik baca testimoni" on public.sumitra_testimoni for select to anon, authenticated using (is_published);
create policy "publik baca faq" on public.sumitra_faq for select to anon, authenticated using (is_published and jawaban is not null);
create policy "publik baca mitra" on public.sumitra_mitra for select to anon, authenticated using (is_published);

-- Pengunjung: mengirim testimoni dan pertanyaan (tayang setelah disetujui/dijawab admin)
create policy "publik kirim testimoni" on public.sumitra_testimoni for insert to anon, authenticated
  with check (
    is_published = false and balasan is null and dibalas_at is null
    and rating between 1 and 5
    and char_length(isi) between 5 and 1500
    and char_length(nama) between 1 and 80
    and char_length(perjalanan) <= 120
    and (foto_url is null or foto_url like '%/storage/v1/object/public/sumitra/testimoni/%')
  );
create policy "publik kirim pertanyaan" on public.sumitra_faq for insert to anon, authenticated
  with check (
    jawaban is null and is_published = false
    and nama_penanya is not null and char_length(nama_penanya) <= 80
    and char_length(pertanyaan) between 5 and 500
  );

-- Admin Sumitra (dan admin sekolah): kelola semuanya
create policy "admin sumitra kelola pengaturan" on public.sumitra_pengaturan for all to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());
create policy "admin sumitra kelola paket" on public.sumitra_paket for all to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());
create policy "admin sumitra kelola layanan" on public.sumitra_layanan for all to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());
create policy "admin sumitra kelola pesanan" on public.sumitra_pesanan for all to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());
create policy "admin sumitra kelola testimoni" on public.sumitra_testimoni for all to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());
create policy "admin sumitra kelola faq" on public.sumitra_faq for all to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());
create policy "admin sumitra kelola mitra" on public.sumitra_mitra for all to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());

-- Galeri: seluruh tim (termasuk siswa kontributor) boleh mengunggah;
-- siswa hanya boleh menghapus foto unggahannya sendiri
create policy "tim sumitra baca galeri" on public.sumitra_galeri for select to authenticated
  using (public.is_tim_sumitra());
create policy "tim sumitra unggah galeri" on public.sumitra_galeri for insert to authenticated
  with check (public.is_admin_sumitra() or (public.is_tim_sumitra() and created_by = auth.uid()));
create policy "admin sumitra ubah galeri" on public.sumitra_galeri for update to authenticated
  using (public.is_admin_sumitra()) with check (public.is_admin_sumitra());
create policy "tim sumitra hapus galeri" on public.sumitra_galeri for delete to authenticated
  using (public.is_admin_sumitra() or (public.is_tim_sumitra() and created_by = auth.uid()));

-- ---------------------------------------------------------------------
-- 6. PENYIMPANAN FOTO (bucket "sumitra", publik, maks 3 MB, hanya gambar)
--    Folder: paket/, galeri/, testimoni/, mitra/, situs/
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sumitra', 'sumitra', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Pembatas tambahan (RESTRICTIVE) supaya policy storage lama yang longgar
-- tidak membuka folder Sumitra untuk akun lain
drop policy if exists "sumitra batas unggah" on storage.objects;
drop policy if exists "sumitra batas ubah" on storage.objects;
drop policy if exists "sumitra batas hapus" on storage.objects;
create policy "sumitra batas unggah" on storage.objects as restrictive for insert to anon, authenticated
  with check (
    bucket_id <> 'sumitra'
    or (storage.foldername(name))[1] = 'testimoni'
    or public.is_admin_sumitra()
    or ((storage.foldername(name))[1] = 'galeri' and public.is_tim_sumitra())
  );
create policy "sumitra batas ubah" on storage.objects as restrictive for update to anon, authenticated
  using (bucket_id <> 'sumitra' or public.is_admin_sumitra());
create policy "sumitra batas hapus" on storage.objects as restrictive for delete to anon, authenticated
  using (bucket_id <> 'sumitra' or public.is_admin_sumitra() or (public.is_tim_sumitra() and owner = auth.uid()));

drop policy if exists "sumitra baca foto" on storage.objects;
drop policy if exists "sumitra publik unggah foto testimoni" on storage.objects;
drop policy if exists "sumitra tim unggah foto galeri" on storage.objects;
drop policy if exists "sumitra admin unggah foto" on storage.objects;
drop policy if exists "sumitra admin ubah foto" on storage.objects;
drop policy if exists "sumitra hapus foto" on storage.objects;

create policy "sumitra baca foto" on storage.objects for select to anon, authenticated
  using (bucket_id = 'sumitra');
create policy "sumitra publik unggah foto testimoni" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'sumitra' and (storage.foldername(name))[1] = 'testimoni');
create policy "sumitra tim unggah foto galeri" on storage.objects for insert to authenticated
  with check (bucket_id = 'sumitra' and (storage.foldername(name))[1] = 'galeri' and public.is_tim_sumitra());
create policy "sumitra admin unggah foto" on storage.objects for insert to authenticated
  with check (bucket_id = 'sumitra' and public.is_admin_sumitra());
create policy "sumitra admin ubah foto" on storage.objects for update to authenticated
  using (bucket_id = 'sumitra' and public.is_admin_sumitra());
create policy "sumitra hapus foto" on storage.objects for delete to authenticated
  using (bucket_id = 'sumitra' and (public.is_admin_sumitra() or (public.is_tim_sumitra() and owner = auth.uid())));

-- ---------------------------------------------------------------------
-- 7. DATA AWAL DARI WAWANCARA (hanya jika tabel masih kosong)
-- ---------------------------------------------------------------------
insert into public.sumitra_paket (slug, jenis, nama, ringkasan, jadwal, harga_mulai, satuan_harga, catatan_harga, termasuk, sort_order)
select * from (values
  ('open-trip-bromo', 'open_trip', 'Open Trip Bromo',
   'Bergabung bersama peserta lain menikmati matahari terbit di Gunung Bromo.',
   'Berangkat hampir setiap hari', 300000::bigint, 'orang', '', '', 1),
  ('open-trip-tumpak-sewu', 'open_trip', 'Open Trip Tumpak Sewu',
   'Menjelajah air terjun Tumpak Sewu bersama peserta lain.', '', null::bigint, 'orang', '', '', 2),
  ('private-trip-bromo', 'private_trip', 'Private Trip Bromo',
   'Perjalanan ke Bromo khusus untuk rombonganmu sendiri, jadwal bisa disesuaikan.', '', null::bigint, 'rombongan', '', '', 3),
  ('tur-korea', 'internasional', 'Tur Korea',
   'Paket tur Korea melalui konsorsium travel agency Indonesia.', '', 10000000::bigint, 'orang', 'Harga musim sepi (low season)',
   E'Tiket pesawat\nHotel\nTransportasi di Korea\nPemandu wisata', 4),
  ('tur-jepang', 'internasional', 'Tur Jepang',
   'Paket tur Jepang melalui konsorsium travel agency Indonesia.', '', 18000000::bigint, 'orang', 'Harga musim sepi (low season)',
   E'Tiket pesawat\nHotel\nTransportasi di Jepang\nPemandu wisata', 5)
) as v (slug, jenis, nama, ringkasan, jadwal, harga_mulai, satuan_harga, catatan_harga, termasuk, sort_order)
where not exists (select 1 from public.sumitra_paket);

insert into public.sumitra_layanan (nama, ikon, deskripsi, harga_mulai, satuan_harga, label_harga, field_wa, sort_order)
select * from (values
  ('Pemandu Wisata', 'pemandu', 'Pemandu berbahasa Indonesia, Inggris, Mandarin, dan Jepang untuk tur di Jawa Timur.',
   500000::bigint, 'hari', '', array['tanggal', 'jumlah', 'lama'], 1),
  ('Rent Car', 'mobil', 'Dua armada sendiri, ditambah armada mitra alumni saat ramai. Untuk keliling Malang dan Batu.',
   500000::bigint, '', '', array['tanggal', 'jumlah', 'lama', 'lokasi'], 2),
  ('Shuttle Bandara', 'pesawat', 'Antar dan jemput ke bandara, misalnya Juanda. Bayar ke sopir atau lewat transfer.',
   150000::bigint, '', '', array['tanggal', 'jumlah', 'lokasi', 'bayar'], 3),
  ('Tiket Pesawat & Kereta', 'tiket', 'Reservasi tiket pesawat dan kereta api (KAI) dibantu tim kami.',
   null::bigint, '', 'Tanpa biaya layanan', array['tanggal', 'jumlah'], 4),
  ('Sewa Trail', 'trail', 'Motor trail untuk petualangan di kawasan Bromo.',
   null::bigint, '', '', array['tanggal', 'jumlah', 'lama'], 5)
) as v (nama, ikon, deskripsi, harga_mulai, satuan_harga, label_harga, field_wa, sort_order)
where not exists (select 1 from public.sumitra_layanan);

insert into public.sumitra_faq (pertanyaan, jawaban, is_published, sort_order)
select * from (values
  ('Bagaimana cara memesan paket?',
   'Buka paket pilihanmu, isi formulir pemesanan, lalu tekan "Kirim pesanan via WhatsApp". Admin Sumitra akan membalas dengan rincian pembayaran DP.', true, 1),
  ('Kalau batal ikut, apakah uang kembali?',
   'Untuk paket tur, uang yang sudah dibayarkan termasuk DP tidak dapat dikembalikan. Aturan lengkapnya tercantum di halaman setiap paket.', true, 2),
  ('Apakah ada biaya tambahan untuk pesan tiket pesawat atau kereta?',
   'Tidak ada biaya layanan tambahan.', true, 3)
) as v (pertanyaan, jawaban, is_published, sort_order)
where not exists (select 1 from public.sumitra_faq);

insert into public.sumitra_mitra (nama, sort_order)
select * from (values
  ('Konsorsium Travel Agency Indonesia', 1),
  ('Raja Holiday Indonesia', 2),
  ('King Travel', 3),
  ('Akcaya', 4),
  ('Alumni penyedia rent car', 5)
) as v (nama, sort_order)
where not exists (select 1 from public.sumitra_mitra);

-- Muat ulang cache skema API Supabase
notify pgrst, 'reload schema';
