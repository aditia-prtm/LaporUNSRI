<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.agents/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.agents/skills/antislop-copywriting/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

## Aturan Pengembangan & Konvensi Database (Wajib untuk Semua AI Agent)

Setiap AI agent yang bekerja pada repositori ini WAJIB mematuhi aturan berikut secara mandiri tanpa perlu instruksi berulang dari pengguna:

### 1. Wajib Baca Folder `supabase/` Sebelum Mengerjakan Fitur Terkait Database
- Sebelum membuat atau memodifikasi fitur yang melibatkan data, query, relasi, hak akses, atau tipe data, **BACA TERLEBIH DAHULU** berkas di folder [`supabase/`](./supabase/) dan [`supabase/migrations/`](./supabase/migrations/).
- Jangan membuat asumsi struktur database tanpa memeriksa skema SQL yang ada di berkas migrasi tersebut.

### 2. Disiplin Migrasi & Penyimpanan Query Baru
- **Dilarang keras mengeksekusi atau membuat query perubahan database tanpa mencatatnya.**
- Jika ada penambahan tabel, kolom, enum, trigger, fungsi RPC, policy RLS, atau indeks baru:
  1. Buat berkas migrasi baru di folder `supabase/migrations/` dengan format penamaan urut, misalnya `07_<nama_perubahan>.sql`.
  2. Perbarui berkas gabungan `supabase/full_schema_setup.sql` agar skrip *full setup* tetap sinkron dan dapat dieksekusi sekali jalan pada database baru.
  3. Perbarui tipe data TypeScript di `src/types/` dan service terkait di `src/services/`.

### 3. Aturan Alur Status Laporan (State Machine Satu Arah)
- LaporUNSRI menerapkan siklus hidup status satu arah yang dijaga ketat di level PostgreSQL Trigger (`trg_enforce_report_status_transition`):
  `belum_diproses` ➔ `diproses` ➔ `menunggu_konfirmasi` ➔ `selesai`
- **Aturan Transisi Mutlak:**
  - Status **TIDAK BISA DIMUNDURKAN** (misal: `diproses` dilarang kembali ke `belum_diproses`).
  - Laporan yang berstatus `selesai` bersifat final dan terkunci (tidak dapat diubah statusnya lagi).
  - Mahasiswa pelapor hanya boleh mengedit/menghapus laporannya saat status masih `belum_diproses`.

### 4. Workflow Verifikasi & Konfirmasi Penyelesaian
- Saat petugas menyelesaikan penanganan di lapangan, petugas memanggil RPC `petugas_update_report_status`. Status di database **TIDAK LANGSUNG MENJADI SELESAI**, melainkan berpindah ke `menunggu_konfirmasi`.
- Status hanya boleh berubah menjadi `selesai` setelah mahasiswa pelapor asli (`user_id = auth.uid()`) melakukan konfirmasi verifikasi melalui fungsi RPC `user_confirm_report_completion(p_report_id, p_feedback)`.

### 5. Arsitektur Akses Data & Supabase Client
- Akses Supabase dilakukan **hanya melalui lapisan service** (`src/services/`), tidak boleh melakukan pemanggilan query Supabase langsung di dalam komponen UI (`src/pages/` atau `src/components/`).
- File upload foto bukti memakai bucket `report-photos` (Public Bucket). Upload wajib divalidasi ukuran dan formatnya di schema sebelum dikirim ke Supabase Storage.
