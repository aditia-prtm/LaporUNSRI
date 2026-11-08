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

## Konfigurasi Supabase & Database

Aplikasi memerlukan project Supabase baru dengan konfigurasi skema, trigger, fungsi RPC, dan storage bucket.

1. **Panduan Lengkap Setup:**
   Ikuti langkah demi langkah di berkas [docs/Panduan_Setup_Database_Supabase_Baru.docx](./docs/Panduan_Setup_Database_Supabase_Baru.docx).

2. **Eksekusi SQL Migration:**
   - Jalankan skrip penuh [supabase/full_schema_setup.sql](./supabase/full_schema_setup.sql) pada SQL Editor Supabase.
   - Atau jalankan secara bertahap dari folder [supabase/migrations/](./supabase/migrations/).

3. **Konfigurasi Environment Variable (`.env`):**
   Salin `.env.example` menjadi `.env` dan isi kredensial project:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxx... (atau VITE_SUPABASE_ANON_KEY)
   ```

Aplikasi menggunakan autentikasi Supabase, 5 tabel relasional (`profiles`, `categories`, `reports`, `report_comments`, `report_votes`), storage bucket publik `report-photos`, trigger transisi status satu arah, serta RPC `petugas_update_report_status` dan `user_confirm_report_completion`.

## Struktur dan Kontribusi

- Susunan folder, arsitektur data, batas antar lapisan, serta aturan refactor dijelaskan di [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
- Gambaran produk, masalah, solusi, dan spesifikasi fitur ada di [docs/PROJECT.md](./docs/PROJECT.md).
- **Panduan AI Agent:** Aturan wajib bagi AI coding agent (membaca skema `supabase/` sebelum membuat fitur baru, menyimpan query migrasi, aturan status satu arah, dll) tercantum di [AGENTS.md](./AGENTS.md).
