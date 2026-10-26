# !! DILARANG KERAS MENGGUNAKAN CSS BIASA!! PAKAI TAILWIND!!!!!!!

# Arsitektur LaporUnsri

Dokumen ini menjadi acuan untuk perubahan dan refactor seluruh proyek: kode aplikasi, aset, konfigurasi, dokumentasi, dan berkas pendukung. Perubahan struktur harus menjaga tanggung jawab tiap lapisan tetap jelas dan memperbarui dokumen ini bila struktur berubah.

## Struktur sumber

```text
public/                         # Aset statis yang disajikan apa adanya
src/
├── assets/                     # Aset visual yang diimpor oleh aplikasi
├── components/
│   ├── common/                 # Komponen UI generik lintas fitur
│   ├── home/                   # Komponen khusus landing page
│   ├── layout/                 # Kerangka dan navigasi per role
│   └── report/                 # Komponen UI yang khusus untuk laporan
├── pages/
│   ├── auth/                   # Halaman autentikasi
│   ├── public/                 # Halaman publik
│   ├── student/                # Halaman mahasiswa
│   ├── officer/                # Halaman petugas
│   └── admin/                  # Halaman admin
├── routes/                     # Deklarasi rute dan penjagaan akses
├── context/                    # State global yang dibutuhkan lintas rute
├── hooks/                      # Hook React yang digunakan ulang
├── services/                   # Akses Supabase dan operasi data
├── schemas/                    # Validasi input per fitur
├── types/                      # Kontrak data TypeScript
├── constants/                  # Nilai tetap dan label domain
├── lib/                        # Inisialisasi klien pihak ketiga
└── utils/                      # Fungsi murni lintas fitur
```

CSS yang hanya dipakai satu komponen atau halaman diletakkan bersama pemiliknya. CSS global dan token desain berada di `src/index.css`; `src/App.css` ditujukan untuk aturan kerangka aplikasi dan pola UI yang benar-benar lintas halaman. Selector halaman yang masih berada di `App.css` adalah utang refactor: pindahkan ke stylesheet pemiliknya sambil mempertahankan hasil tampilannya. Jangan menyimpan stylesheet halaman di `components/layout`.

## Batas tanggung jawab

- `pages` mengatur alur halaman dan menghubungkan UI ke hook atau service; hindari query Supabase langsung di halaman.
- `components` merender UI dan menerima data lewat props; komponen umum tidak boleh bergantung pada role atau rute tertentu.
- `services` menjadi satu-satunya lapisan untuk query/mutasi Supabase dan menerjemahkan hasilnya ke tipe aplikasi.
- `schemas` memvalidasi input pengguna sebelum service dipanggil. Validasi browser tetap dipakai untuk aksesibilitas dan umpan balik cepat.
- `types` mendefinisikan kontrak domain bersama; hindari `any` dan type assertion yang menutupi bentuk data yang belum tervalidasi.
- `constants` menyimpan label status, batas ukuran, dan nilai domain yang digunakan lebih dari satu tempat.
- `utils` berisi fungsi murni tanpa state React, akses DOM, atau jaringan.
- `context` hanya untuk state lintas rute. State formulir dan filter tetap lokal atau berada dalam hook fitur.
- Navbar landing berada di `components/layout/LandingNavbar`; navigasi setelah login tetap dimiliki layout masing-masing role, seperti `StudentLayout`.
- Penjagaan role di rute adalah perlindungan UI. Hak akses data tetap wajib dijamin oleh Supabase RLS dan fungsi database.

## Aturan refactor

1. Ikuti susunan di atas dan gunakan nama berkas yang menjelaskan fungsi.
2. Letakkan logika domain yang terduplikasi di satu helper atau hook dengan tipe eksplisit.
3. Pertahankan pemisahan fitur berdasarkan peran dan penggunaan ulang berdasarkan tanggung jawab, bukan membuat abstraksi generik tanpa kebutuhan nyata.
4. Impor aset lokal melalui `src/assets`; gunakan `public` hanya untuk berkas yang perlu URL tetap.
5. Jangan menyimpan rahasia server di aplikasi klien. Variabel `VITE_*` bersifat publik.
6. Perbarui dokumentasi dan konfigurasi bersama perubahan struktur, termasuk `README.md` bila instruksi menjalankan aplikasi berubah.
7. Pertahankan perilaku, aksesibilitas, dan tampilan responsif saat memindahkan atau menyederhanakan kode.

## Urutan refactor lintas proyek

1. Benahi kontrak data, validasi input, serta penanganan error di service dan schema.
2. Satukan aturan domain berulang (status, filter, format, dan hitungan) di constants/utilities.
3. Pindahkan UI yang berulang ke komponen fitur yang menerima data dan aksi melalui props.
4. Pisahkan stylesheet halaman dari aturan global dan hapus selector lama setelah pemakaian diverifikasi.
5. Rapikan route, dokumentasi, konfigurasi, serta aset tanpa mengubah perilaku fitur.
6. Setelah tiap kelompok perubahan, jalankan pemeriksaan build dan lint, lalu perbarui dokumen ini bila batas folder berubah.

## Konvensi domain laporan

- Komponen bersama untuk laporan berada di `components/report`.
- UI lintas role yang punya perilaku sama (misalnya filter, ringkasan metrik, dan kartu tindak lanjut) dijadikan komponen props-driven; perbedaan role dinyatakan lewat props, bukan salinan markup.
- Label status terpusat di `constants/report.ts`; nilai status tetap cocok dengan nilai database.
- Format tanggal berbahasa Indonesia berada di `utils/date.ts`.
- Filter, pengurutan, hitungan status, dan aturan keterlambatan yang dipakai beberapa halaman berada di `utils/report.ts`.
- Operasi laporan, kategori, vote, komentar, dan unggahan berada di `services/reportService.ts`.

## Alur data

```text
Route → Page → Hook/utility → Service → Supabase
                    ↓
               Components
```

Komponen tidak memanggil Supabase. Service mengembalikan data bertipe atau melempar error yang dapat ditampilkan halaman. Mutasi yang mengubah status harus melewati operasi database yang memeriksa role; validasi klien bukan pengganti RLS.
