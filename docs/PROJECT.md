LAPORUNSRI
Lihat rusak, lapor, pantau.
Final Project Web Programming | HMIF UNSRI 2026
---

1. RINGKASAN
--------------------------------------------------
LaporUnsri adalah platform pelaporan fasilitas kampus
Universitas Sriwijaya. Mahasiswa melaporkan kerusakan
fasilitas lengkap dengan bukti foto dan lokasi (fakultas, gedung, kelas), memantau
status penanganannya, dan mendukung laporan yang sama
agar masalah yang paling banyak dialami diprioritaskan.


2. MASALAH
--------------------------------------------------
Siapa yang terdampak:
- Mahasiswa UNSRI (pelapor)
- Petugas/pengelola fasilitas (penerima laporan)

Apa masalahnya:
- Tidak ada jalur pelaporan yang jelas untuk AC rusak,
  lampu mati, toilet bermasalah, dan sejenisnya.
- Laporan tersebar lewat chat dan mulut ke mulut,
  sehingga tidak terlacak.
- Laporan yang sama diulang-ulang oleh banyak orang.
- Pelapor tidak tahu laporannya sudah ditangani atau belum.
- Petugas kesulitan menentukan mana yang paling mendesak.

Kenapa penting:
- Fasilitas rusak mengganggu kegiatan belajar dan
  keselamatan.
- Tanpa data yang rapi, kerusakan yang sering terjadi
  tidak pernah terlihat polanya.


3. SOLUSI
--------------------------------------------------
Satu tempat untuk melapor, memantau, dan memprioritaskan:
- Laporan dengan judul, deskripsi, foto, dan lokasi.
- Status terlihat jelas & transparan: Belum Diproses > Diproses > Menunggu Konfirmasi > Selesai.
- Dukungan dari mahasiswa lain membuat prioritas naik
  otomatis.
- Dashboard petugas untuk mengelola dan menindaklanjuti semua laporan dengan bukti foto.
- Mahasiswa pelapor memiliki hak verifikasi akhir sebelum laporan dinyatakan benar-benar selesai.


4. FITUR PEMBEDA (bukan sekadar CRUD)
--------------------------------------------------
a. Alur Status Satu Arah & Konfirmasi Pelapor
   Status tidak bisa diakali atau dimundurkan oleh siapa pun.
   Ketika petugas menyelesaikan tugas, laporan tidak langsung
   selesai melainkan berpindah ke status "Menunggu Konfirmasi".
   Hanya mahasiswa pelapor yang berhak mengonfirmasi bahwa
   fasilitas sudah benar-benar berfungsi normal kembali.

b. Tombol "Saya juga mengalami"
   Masalah yang banyak dialami naik prioritas otomatis.

c. Deteksi laporan duplikat
   Saat mengetik judul/lokasi, sistem menyarankan laporan
   serupa yang sudah ada (pencarian teks di Supabase).

d. Penanda laporan terlambat
   Laporan yang tidak ditanggapi lebih dari X hari muncul
   di dashboard petugas/admin sebagai "perlu eskalasi".


5. ROLE DAN HAK AKSES
--------------------------------------------------
MAHASISWA (user)
- Register, login, logout
- Buat, lihat, pantau laporan fasilitas kampus
- Ubah & hapus laporan miliknya (hanya saat status masih Belum Diproses)
- Vote/dukung laporan pengguna lain
- Berkomunikasi dan berdiskusi pada kolom komentar tindak lanjut
- Mengonfirmasi penyelesaian laporan saat petugas selesai memperbaiki

PETUGAS
- Register, login, logout
- Mengubah status laporan yang dipegang: Belum Diproses -> Diproses
- Menyelesaikan pengerjaan dengan bukti foto & catatan: Diproses -> Menunggu Konfirmasi
- Berkomunikasi dengan pelapor melalui catatan tindak lanjut

ADMIN 
- Lihat semua laporan
- Ubah status dan beri komentar/tindak lanjut
- Kelola kategori fasilitas
- Lihat laporan terlambat dan statistik sarpras


6. RANCANGAN DATABASE
--------------------------------------------------
Seluruh berkas query dan skema SQL tersimpan rapi di folder:
`supabase/migrations/` dan `supabase/full_schema_setup.sql`.

a. Tipe Enum:
   - user_role: 'mahasiswa', 'petugas', 'admin'
   - report_status: 'belum_diproses', 'diproses', 'menunggu_konfirmasi', 'selesai'

b. Tabel Utama:
   1. `profiles`:
      - id (uuid, PK, references auth.users)
      - full_name (text), nim_nip (text), role (user_role), created_at (timestamptz)
   2. `categories`:
      - id (uuid, PK), name (text, unique), created_at (timestamptz)
   3. `reports`:
      - id (uuid, PK)
      - user_id (uuid, FK ke profiles)
      - category_id (uuid, FK ke categories)
      - assigned_officer_id (uuid, FK ke profiles)
      - title, description, faculty, building, room, photo_url (text)
      - status (report_status, default 'belum_diproses')
      - confirmation_requested_at, completed_at (timestamptz)
      - created_at, updated_at (timestamptz)
   4. `report_comments`:
      - id (uuid, PK), report_id (uuid, FK), user_id (uuid, FK)
      - message (text), photo_url (text), created_at (timestamptz)
   5. `report_votes`:
      - id (uuid, PK), report_id (uuid, FK), user_id (uuid, FK)
      - unique(report_id, user_id), created_at (timestamptz)

c. Triggers & Functions:
   - `on_auth_user_created`: Otomatis membuat baris di `profiles` saat sign up.
   - `trg_reports_updated_at`: Otomatis update timestamp `updated_at`.
   - `trg_enforce_report_status_transition`: Menjaga state machine status satu arah agar tidak dapat dimundurkan atau dilompati.

d. RPC Stored Procedures:
   - `petugas_update_report_status`: Petugas mengunggah bukti foto dan catatan (status berubah ke 'diproses' atau 'menunggu_konfirmasi').
   - `user_confirm_report_completion`: Mahasiswa pelapor mengonfirmasi penanganan tuntas (status resmi menjadi 'selesai').


7. DAFTAR HALAMAN
--------------------------------------------------
Publik   : Landing page (CTA "Laporkan Masalah"),
           Login, Register, 404
Mahasiswa: Daftar laporan (filter, sorting, pencarian),
           Detail laporan, Buat laporan, Laporan saya
Admin    : Dashboard, Kelola laporan, Kelola kategori,
           Laporan terlambat


8. OPERASI TAMBAHAN (di luar CRUD)
--------------------------------------------------
- Filter berdasarkan kategori dan status
- Sorting berdasarkan jumlah vote atau terbaru
- Pencarian laporan
- Alur status satu arah (Belum Diproses > Diproses > Menunggu Konfirmasi > Selesai) dengan verifikasi konfirmasi penyelesaian oleh pelapor
- Voting dan deteksi duplikat
- Penanda laporan terlambat


9. TECH STACK
--------------------------------------------------
- React + Tailwind CSS
- Supabase (Auth, Database, Storage, RLS)
- react-router-dom (routing)
- React Hook Form + Zod (form dan validasi)
- react-icons (ikon)
- Opsional: Gemini API


10. KESESUAIAN DENGAN SYARAT PROJECT
--------------------------------------------------
[x] Auth Supabase (register, login, logout, sesi)
[x] Landing page dengan CTA
[x] Multi-page + React Router + halaman 404
[x] CRUD di semua tabel utama
[x] 5 tabel yang saling berhubungan
[x] 2 role dengan hak akses berbeda
[x] Operasi tambahan (filter, sort, search, approval)
[x] Responsive dengan Tailwind
[x] RLS + policy di setiap tabel

11. PENGEMBANGAN LANJUTAN (jika ada waktu)
--------------------------------------------------
- Notifikasi saat status laporan berubah
- Peta lokasi laporan
- Statistik kerusakan per gedung/fakultas
- Laporan bulanan untuk pengelola kampus

12. PENUTUP
--------------------------------------------------
LaporUnsri mengubah keluhan yang tercecer menjadi data
yang terlacak dan bisa ditindaklanjuti, sehingga
mahasiswa tahu laporannya diproses dan petugas tahu
mana yang harus dikerjakan lebih dulu.