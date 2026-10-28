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
- Status terlihat jelas: Belum Diproses > Diproses > Selesai.
- Dukungan dari mahasiswa lain membuat prioritas naik
  otomatis.
- Dashboard petugas untuk mengelola semua laporan.


4. FITUR PEMBEDA (bukan sekadar CRUD)
--------------------------------------------------
a. Tombol "Saya juga mengalami"
   Masalah yang banyak dialami naik prioritas otomatis.

b. Deteksi laporan duplikat
   Saat mengetik judul/lokasi, sistem menyarankan laporan
   serupa yang sudah ada (pencarian teks di Supabase).

c. Penanda laporan terlambat
   Laporan yang tidak ditanggapi lebih dari X hari muncul
   di dashboard admin sebagai "perlu eskalasi".


5. ROLE DAN HAK AKSES
--------------------------------------------------
MAHASISWA (user)
- Register, login, logout
- Buat, lihat, ubah, hapus laporan miliknya
- Vote laporan orang lain
- Pantau status laporan
- Berkomunikasi dengan petugas

PETUGAS
- Register, login, logout
- Mengubah status laporan yang ia pegang (harus disertai bukti foto)
- Berkomunikasi dengan pelapor

ADMIN 
- Lihat semua laporan
- Ubah status dan beri komentar/tindak lanjut
- Kelola kategori
- Lihat laporan terlambat dan statistik

6. RANCANGAN DATABASE


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
- Alur status (Belum Diproses > Diproses > Selesai)
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