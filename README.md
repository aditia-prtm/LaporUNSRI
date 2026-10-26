# LaporUnsri

Platform pelaporan fasilitas kampus Universitas Sriwijaya. Mahasiswa dapat membuat dan mendukung laporan, lalu memantau tindak lanjut petugas.

## Menjalankan aplikasi

1. Pasang dependensi dengan `npm install`.
2. Salin `.env.example` menjadi `.env` dan isi kredensial proyek Supabase.
3. Jalankan `npm run dev`.

Perintah yang tersedia:

- `npm run dev` menjalankan server pengembangan Vite.
- `npm run build` menjalankan pemeriksaan TypeScript lalu membuat build produksi.
- `npm run lint` menjalankan ESLint.
- `npm run preview` menyajikan build produksi secara lokal.

## Konfigurasi Supabase

Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dengan URL proyek dan publishable/anon key dari Supabase. Variabel berawalan `VITE_` disertakan dalam aplikasi browser; jangan menaruh service role key atau rahasia server di dalamnya.

Aplikasi memerlukan autentikasi Supabase dan tabel `profiles`, `reports`, `categories`, `report_votes`, serta `report_comments`. Foto laporan memakai storage bucket `report-photos`. Pastikan RLS, relasi, dan fungsi database untuk mutasi status sudah dikonfigurasi pada proyek Supabase.

## Struktur dan kontribusi

Susunan folder, batas antar lapisan, serta aturan refactor dijelaskan di [ARCHITECTURE.md](./ARCHITECTURE.md). Ringkasan tujuan dan fitur produk ada di [PROJECT.md](./PROJECT.md).

Sebelum mengubah struktur, ikuti panduan arsitektur dan perbarui dokumentasi yang terdampak. Jangan menambahkan rahasia atau data pengguna ke repository.
