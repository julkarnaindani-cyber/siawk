/**
 * SI AWK - Dataset Awal & Mock Data Standar (Kelas VII-B)
 * Menjamin aplikasi 100% interaktif dan responsif instan tanpa menunggu koneksi API
 */

const INITIAL_DATA = {
  profil: {
    idKelas: 'KLS-VIIB-2026',
    namaKelas: 'VII-B',
    tingkatKelas: 'VII (Tujuh)',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil',
    waliKelas: 'Bpk. Ahmad, S.Pd.',
    nipWali: '19880412 201402 1 003',
    kontak: '0812-3456-7890',
    email: 'ahmad.wali7b@sekolah.sch.id',
    targetKehadiran: 95.0,
    totalSiswa: 36,
    lakiLaki: 18,
    perempuan: 18
  },

  siswa: [
    { id: 'SIS-001', noAbsen: 1, nis: '242507001', nisn: '0123456701', nama: 'Aditya Rizky Pratama', jk: 'L', tmpLahir: 'Jakarta', tglLahir: '2013-05-12', agama: 'Islam', ayah: 'Bambang Pratama', ibu: 'Siti Rahayu', hpOrtu: '081298765431', alamat: 'Jl. Melati No. 12, RT 02/05', status: 'Aktif' },
    { id: 'SIS-002', noAbsen: 2, nis: '242507002', nisn: '0123456702', nama: 'Bella Nur Aini', jk: 'P', tmpLahir: 'Bandung', tglLahir: '2013-08-20', agama: 'Islam', ayah: 'Nur Hidayat', ibu: 'Eni Kurnia', hpOrtu: '081387654321', alamat: 'Jl. Anggrek Indah No. 45', status: 'Aktif' },
    { id: 'SIS-003', noAbsen: 3, nis: '242507003', nisn: '0123456703', nama: 'Daffa Kusuma Wardana', jk: 'L', tmpLahir: 'Semarang', tglLahir: '2013-02-14', agama: 'Islam', ayah: 'Kusuma Wijaya', ibu: 'Dewi Lestari', hpOrtu: '081576543210', alamat: 'Komplek Permata Blok B-7', status: 'Aktif' },
    { id: 'SIS-004', noAbsen: 4, nis: '242507004', nisn: '0123456704', nama: 'Fatimah Zahra Al-Habsyi', jk: 'P', tmpLahir: 'Surabaya', tglLahir: '2013-11-09', agama: 'Islam', ayah: 'Ali Al-Habsyi', ibu: 'Khadijah', hpOrtu: '081965432109', alamat: 'Jl. Kenanga Mas No. 8', status: 'Aktif' },
    { id: 'SIS-005', noAbsen: 5, nis: '242507005', nisn: '0123456705', nama: 'Galih Firmansyah', jk: 'L', tmpLahir: 'Yogyakarta', tglLahir: '2013-04-18', agama: 'Islam', ayah: 'Firmansyah', ibu: 'Retno Wati', hpOrtu: '081254321098', alamat: 'Jl. Cendrawasih No. 23', status: 'Aktif' },
    { id: 'SIS-006', noAbsen: 6, nis: '242507006', nisn: '0123456706', nama: 'Hana Maria Simanjuntak', jk: 'P', tmpLahir: 'Medan', tglLahir: '2013-07-25', agama: 'Kristen', ayah: 'Toga Simanjuntak', ibu: 'Marta Siregar', hpOrtu: '082143210987', alamat: 'Gg. Damai No. 10', status: 'Aktif' },
    { id: 'SIS-007', noAbsen: 7, nis: '242507007', nisn: '0123456707', nama: 'Ihsan Maulana', jk: 'L', tmpLahir: 'Bogor', tglLahir: '2013-01-30', agama: 'Islam', ayah: 'Maulana Yusuf', ibu: 'Aisyah', hpOrtu: '085732109876', alamat: 'Jl. Flamboyan No. 3', status: 'Aktif' },
    { id: 'SIS-008', noAbsen: 8, nis: '242507008', nisn: '0123456708', nama: 'Jessica Natalia', jk: 'P', tmpLahir: 'Surabaya', tglLahir: '2013-12-19', agama: 'Katolik', ayah: 'Antonius Susanto', ibu: 'Maria Veronica', hpOrtu: '081821098765', alamat: 'Jl. Surya Kencana No. 17', status: 'Aktif' },
    { id: 'SIS-009', noAbsen: 9, nis: '242507009', nisn: '0123456709', nama: 'Kenzo Alvaro Gunawan', jk: 'L', tmpLahir: 'Bandung', tglLahir: '2013-03-05', agama: 'Buddha', ayah: 'David Gunawan', ibu: 'Linda Wijaya', hpOrtu: '087810987654', alamat: 'Taman Kencana Blok C-2', status: 'Aktif' },
    { id: 'SIS-010', noAbsen: 10, nis: '242507010', nisn: '0123456710', nama: 'Larasati Sekar Arum', jk: 'P', tmpLahir: 'Solo', tglLahir: '2013-09-15', agama: 'Islam', ayah: 'Surya Wibowo', ibu: 'Endang Tri', hpOrtu: '081390876543', alamat: 'Jl. Merpati Putih No. 9', status: 'Aktif' },
    { id: 'SIS-011', noAbsen: 11, nis: '242507011', nisn: '0123456711', nama: 'Muhammad Fadhil Ramadhan', jk: 'L', tmpLahir: 'Jakarta', tglLahir: '2013-06-08', agama: 'Islam', ayah: 'Hendra Gunawan', ibu: 'Fitri Handayani', hpOrtu: '081289765432', alamat: 'Jl. Kemuning Raya No. 4', status: 'Aktif' },
    { id: 'SIS-012', noAbsen: 12, nis: '242507012', nisn: '0123456712', nama: 'Nadia Putri Maharani', jk: 'P', tmpLahir: 'Malang', tglLahir: '2013-10-11', agama: 'Islam', ayah: 'Agus Subagyo', ibu: 'Sri Wahyuni', hpOrtu: '081778654321', alamat: 'Perumahan Asri Lestari B-1', status: 'Aktif' },
    { id: 'SIS-013', noAbsen: 13, nis: '242507013', nisn: '0123456713', nama: 'Oliver Tanuwijaya', jk: 'L', tmpLahir: 'Jakarta', tglLahir: '2013-04-03', agama: 'Kristen', ayah: 'Steven Tan', ibu: 'Grace Chandra', hpOrtu: '081967543210', alamat: 'Jl. Boulevard Raya No. 88', status: 'Aktif' },
    { id: 'SIS-014', noAbsen: 14, nis: '242507014', nisn: '0123456714', nama: 'Praditya Arya Sena', jk: 'L', tmpLahir: 'Cirebon', tglLahir: '2013-07-17', agama: 'Islam', ayah: 'Sena Nugraha', ibu: 'Wulan Sari', hpOrtu: '085656432109', alamat: 'Jl. Raya Veteran No. 14', status: 'Aktif' },
    { id: 'SIS-015', noAbsen: 15, nis: '242507015', nisn: '0123456715', nama: 'Qonita Salma Salsabila', jk: 'P', tmpLahir: 'Bandung', tglLahir: '2013-05-29', agama: 'Islam', ayah: 'Lukman Hakim', ibu: 'Nurul Huda', hpOrtu: '081345321098', alamat: 'Gg. Bhakti No. 5', status: 'Aktif' },
    { id: 'SIS-016', noAbsen: 16, nis: '242507016', nisn: '0123456716', nama: 'Rafi Ahmad Fauzan', jk: 'L', tmpLahir: 'Tangerang', tglLahir: '2013-08-04', agama: 'Islam', ayah: 'Fauzan Mansyur', ibu: 'Rina Marlina', hpOrtu: '081234210987', alamat: 'Jl. Mawar No. 30', status: 'Aktif' },
    { id: 'SIS-017', noAbsen: 17, nis: '242507017', nisn: '0123456717', nama: 'Siti Sarah Nurhaliza', jk: 'P', tmpLahir: 'Jakarta', tglLahir: '2013-09-22', agama: 'Islam', ayah: 'Junaedi', ibu: 'Halimah', hpOrtu: '087723109876', alamat: 'Jl. Cempaka Baru No. 2', status: 'Aktif' },
    { id: 'SIS-018', noAbsen: 18, nis: '242507018', nisn: '0123456718', nama: 'Taufiq Hidayatulloh', jk: 'L', tmpLahir: 'Bekasi', tglLahir: '2013-11-16', agama: 'Islam', ayah: 'Hidayat', ibu: 'Siti Aminah', hpOrtu: '085812098765', alamat: 'Perum Bintang Timur No. 19', status: 'Aktif' },
    { id: 'SIS-019', noAbsen: 19, nis: '242507019', nisn: '0123456719', nama: 'Ulyana Putri Cantika', jk: 'P', tmpLahir: 'Depok', tglLahir: '2013-03-27', agama: 'Islam', ayah: 'Budi Santoso', ibu: 'Yanti Susanti', hpOrtu: '081301987654', alamat: 'Jl. Margonda Gg. Kober No. 11', status: 'Aktif' },
    { id: 'SIS-020', noAbsen: 20, nis: '242507020', nisn: '0123456720', nama: 'Vino Bastian Pratama', jk: 'L', tmpLahir: 'Jakarta', tglLahir: '2013-10-02', agama: 'Islam', ayah: 'Bastian Hadi', ibu: 'Novita Sari', hpOrtu: '081290876541', alamat: 'Jl. Teratai Putih No. 6', status: 'Aktif' },
    { id: 'SIS-021', noAbsen: 21, nis: '242507021', nisn: '0123456721', nama: 'Wahyu Tri Atmojo', jk: 'L', tmpLahir: 'Klaten', tglLahir: '2013-06-14', agama: 'Islam', ayah: 'Tri Atmojo', ibu: 'Sulastri', hpOrtu: '081389765430', alamat: 'Jl. Siliwangi No. 41', status: 'Aktif' },
    { id: 'SIS-022', noAbsen: 22, nis: '242507022', nisn: '0123456722', nama: 'Xaviera Alyssa Putri', jk: 'P', tmpLahir: 'Bandung', tglLahir: '2013-01-08', agama: 'Islam', ayah: 'Rudi Hartono', ibu: 'Maya Indriati', hpOrtu: '081578654329', alamat: 'Pondok Kelapa Blok G No. 12', status: 'Aktif' },
    { id: 'SIS-023', noAbsen: 23, nis: '242507023', nisn: '0123456723', nama: 'Yudha Bima Perkasa', jk: 'L', tmpLahir: 'Semarang', tglLahir: '2013-12-05', agama: 'Islam', ayah: 'Bima Perkasa', ibu: 'Indah Kusuma', hpOrtu: '081967543218', alamat: 'Jl. Garuda No. 7A', status: 'Aktif' },
    { id: 'SIS-024', noAbsen: 24, nis: '242507024', nisn: '0123456724', nama: 'Zahra Anindya Kirana', jk: 'P', tmpLahir: 'Jakarta', tglLahir: '2013-07-01', agama: 'Islam', ayah: 'Anindyo', ibu: 'Kirana Dewi', hpOrtu: '085656432107', alamat: 'Jl. Pahlawan Karya No. 21', status: 'Aktif' },
    { id: 'SIS-025', noAbsen: 25, nis: '242507025', nisn: '0123456725', nama: 'Alvaro Arya Diputra', jk: 'L', tmpLahir: 'Medan', tglLahir: '2013-04-21', agama: 'Islam', ayah: 'Diputra Syah', ibu: 'Farida', hpOrtu: '081345321096', alamat: 'Jl. Pinus Raya No. 15', status: 'Aktif' },
    { id: 'SIS-026', noAbsen: 26, nis: '242507026', nisn: '0123456726', nama: 'Carissa Aurelia Salsabila', jk: 'P', tmpLahir: 'Bandung', tglLahir: '2013-08-16', agama: 'Islam', ayah: 'Ahmad Salsabila', ibu: 'Reni Anggraini', hpOrtu: '081234210985', alamat: 'Jl. Dahlia Hijau No. 29', status: 'Aktif' },
    { id: 'SIS-027', noAbsen: 27, nis: '242507027', nisn: '0123456727', nama: 'Danendra Bintang Ramadhan', jk: 'L', tmpLahir: 'Surabaya', tglLahir: '2013-02-28', agama: 'Islam', ayah: 'Ramadhan Sukses', ibu: 'Dina Mariana', hpOrtu: '087723109874', alamat: 'Gg. Kancil No. 18', status: 'Aktif' },
    { id: 'SIS-028', noAbsen: 28, nis: '242507028', nisn: '0123456728', nama: 'Elvira Kirana Putri', jk: 'P', tmpLahir: 'Solo', tglLahir: '2013-11-23', agama: 'Islam', ayah: 'Suratno', ibu: 'Kustini', hpOrtu: '085812098763', alamat: 'Jl. Palem Asri No. 5', status: 'Aktif' },
    { id: 'SIS-029', noAbsen: 29, nis: '242507029', nisn: '0123456729', nama: 'Farrel Dylan Alamsyah', jk: 'L', tmpLahir: 'Jakarta', tglLahir: '2013-05-19', agama: 'Islam', ayah: 'Alamsyah Putra', ibu: 'Fani Oktaviani', hpOrtu: '081301987652', alamat: 'Jl. Kebon Jeruk No. 34', status: 'Aktif' },
    { id: 'SIS-030', noAbsen: 30, nis: '242507030', nisn: '0123456730', nama: 'Gisella Amira Zahra', jk: 'P', tmpLahir: 'Bogor', tglLahir: '2013-09-07', agama: 'Islam', ayah: 'Amiruddin', ibu: 'Zahrotun', hpOrtu: '081290876540', alamat: 'Jl. Sukajadi Indah No. 8', status: 'Aktif' },
    { id: 'SIS-031', noAbsen: 31, nis: '242507031', nisn: '0123456731', nama: 'Haekal Rayhan Al-Fatih', jk: 'L', tmpLahir: 'Bekasi', tglLahir: '2013-07-11', agama: 'Islam', ayah: 'Rayhan Fatih', ibu: 'Mutia Hasanah', hpOrtu: '081389765429', alamat: 'Komplek Harapan Mulia A-4', status: 'Aktif' },
    { id: 'SIS-032', noAbsen: 32, nis: '242507032', nisn: '0123456732', nama: 'Indira Callista Maharani', jk: 'P', tmpLahir: 'Semarang', tglLahir: '2013-03-31', agama: 'Hindu', ayah: 'I Wayan Sudarma', ibu: 'Ni Made Suci', hpOrtu: '081578654328', alamat: 'Jl. Balai Pustaka No. 60', status: 'Aktif' },
    { id: 'SIS-033', noAbsen: 33, nis: '242507033', nisn: '0123456733', nama: 'Jonathan Edward Silalahi', jk: 'L', tmpLahir: 'Medan', tglLahir: '2013-10-24', agama: 'Kristen', ayah: 'Edward Silalahi', ibu: 'Ruth Sinaga', hpOrtu: '081967543217', alamat: 'Jl. Gajah Mada No. 102', status: 'Aktif' },
    { id: 'SIS-034', noAbsen: 34, nis: '242507034', nisn: '0123456734', nama: 'Kayla Salsabila Azzahra', jk: 'P', tmpLahir: 'Bandung', tglLahir: '2013-06-03', agama: 'Islam', ayah: 'Zulkifli', ibu: 'Aida Fitria', hpOrtu: '085656432106', alamat: 'Jl. Antapani No. 77', status: 'Aktif' },
    { id: 'SIS-035', noAbsen: 35, nis: '242507035', nisn: '0123456735', nama: 'Leonel Messi Hutapea', jk: 'L', tmpLahir: 'Pematang Siantar', tglLahir: '2013-01-15', agama: 'Katolik', ayah: 'Robert Hutapea', ibu: 'Theresia Tampubolon', hpOrtu: '081345321095', alamat: 'Jl. Sudirman No. 12', status: 'Aktif' },
    { id: 'SIS-036', noAbsen: 36, nis: '242507036', nisn: '0123456736', nama: 'Meisya Aurelia Ramadhani', jk: 'P', tmpLahir: 'Jakarta', tglLahir: '2013-08-30', agama: 'Islam', ayah: 'Ramadhani', ibu: 'Lilis Suryani', hpOrtu: '081234210984', alamat: 'Jl. Pisangan Baru No. 14', status: 'Aktif' }
  ],

  // Rekam Presensi Hari Ini (Default 34 Hadir, 1 Sakit, 1 Izin)
  presensiHariIni: {
    tanggal: new Date().toISOString().slice(0, 10),
    data: {
      '242507001': { status: 'H', ket: '' },
      '242507002': { status: 'S', ket: 'Surat dokter terlampir (Flu Demam)' },
      '242507003': { status: 'H', ket: '' },
      '242507004': { status: 'I', ket: 'Izin lomba Olimpiade Matematika' },
      '242507005': { status: 'H', ket: '' },
      '242507006': { status: 'H', ket: '' },
      '242507007': { status: 'H', ket: '' },
      '242507008': { status: 'H', ket: '' },
      '242507009': { status: 'H', ket: '' },
      '242507010': { status: 'H', ket: '' },
      '242507011': { status: 'H', ket: '' },
      '242507012': { status: 'H', ket: '' },
      '242507013': { status: 'H', ket: '' },
      '242507014': { status: 'H', ket: '' },
      '242507015': { status: 'H', ket: '' },
      '242507016': { status: 'H', ket: '' },
      '242507017': { status: 'H', ket: '' },
      '242507018': { status: 'H', ket: '' },
      '242507019': { status: 'H', ket: '' },
      '242507020': { status: 'H', ket: '' },
      '242507021': { status: 'H', ket: '' },
      '242507022': { status: 'H', ket: '' },
      '242507023': { status: 'H', ket: '' },
      '242507024': { status: 'H', ket: '' },
      '242507025': { status: 'H', ket: '' },
      '242507026': { status: 'H', ket: '' },
      '242507027': { status: 'H', ket: '' },
      '242507028': { status: 'H', ket: '' },
      '242507029': { status: 'H', ket: '' },
      '242507030': { status: 'H', ket: '' },
      '242507031': { status: 'H', ket: '' },
      '242507032': { status: 'H', ket: '' },
      '242507033': { status: 'H', ket: '' },
      '242507034': { status: 'H', ket: '' },
      '242507035': { status: 'H', ket: '' },
      '242507036': { status: 'H', ket: '' }
    }
  },

  // Jurnal Karakter, Prestasi & Bimbingan Konseling Siswa
  jurnal: [
    { id: 'JRN-001', tanggal: '2026-11-04', nis: '242507004', nama: 'Fatimah Zahra Al-Habsyi', kategori: 'Prestasi', judul: 'Juara 1 OSN Matematika Tingkat Kota', uraian: 'Meraih medali emas pada seleksi Olimpiade Sains Nasional jenjang SMP/MTs.', tindakLanjut: 'Diusulkan reward piagam dari Kepala Sekolah dan pendampingan tahap Provinsi.', status: 'Selesai' },
    { id: 'JRN-002', tanggal: '2026-11-02', nis: '242507003', nama: 'Daffa Kusuma Wardana', kategori: 'Bimbingan', judul: 'Konseling Motivasi Belajar & Kesiapan Tugas', uraian: 'Nilai formatif mata pelajaran IPA menurun, tampak sering mengantuk di kelas.', tindakLanjut: 'Dialog bersama orang tua untuk mengatur jadwal istirahat malam dan pendampingan belajar di rumah.', status: 'Dalam Pemantauan' },
    { id: 'JRN-003', tanggal: '2026-10-28', nis: '242507011', nama: 'Muhammad Fadhil Ramadhan', kategori: 'Prestasi', judul: 'Juara 2 Lomba Puisi Bulan Bahasa', uraian: 'Menampilkan puisi bertema Kebangsaan dengan artikulasi dan penghayatan luar biasa.', tindakLanjut: 'Diberikan poin prestasi sikap dan apresiasi di upacara bendera.', status: 'Selesai' },
    { id: 'JRN-004', tanggal: '2026-10-25', nis: '242507001', nama: 'Aditya Rizky Pratama', kategori: 'Bimbingan', judul: 'Koordinasi Kepengurusan Kelas (Ketua Kelas)', uraian: 'Diskusi mingguan pemeliharaan kebersihan kelas dan efektivitas jadwal piket harian.', tindakLanjut: 'Dilakukan pergantian rotasi koordinator piket harian.', status: 'Selesai' },
    { id: 'JRN-005', tanggal: '2026-10-20', nis: '242507016', nama: 'Rafi Ahmad Fauzan', kategori: 'Pelanggaran', judul: 'Keterlambatan Masuk Jam Pertama (3x Berturut-turut)', uraian: 'Tiga kali tiba di sekolah setelah bel pukul 07.00 berbunyi.', tindakLanjut: 'Penandatanganan komitmen disiplin dan pembiasaan membaca di perpustakaan saat jam istirahat.', status: 'Dalam Pemantauan' }
  ],

  // Arsip Dokumen Digital Kelas VII-B
  arsip: [
    { id: 'DOC-001', tanggal: '2026-07-15', kategori: 'Administrasi Pokok', nama: 'SK Penetapan Wali Kelas & Pembagian Tugas VII-B.pdf', ukuran: '1.4 MB', tipe: 'PDF', urlDrive: 'https://drive.google.com/file/d/demo1/view' },
    { id: 'DOC-002', tanggal: '2026-07-20', kategori: 'Administrasi Pokok', nama: 'Struktur Organisasi & Kepengurusan Kelas VII-B.pdf', ukuran: '850 KB', tipe: 'PDF', urlDrive: 'https://drive.google.com/file/d/demo2/view' },
    { id: 'DOC-003', tanggal: '2026-07-22', kategori: 'Administrasi Pokok', nama: 'Denah Tempat Duduk Siswa Semester Ganjil.pdf', ukuran: '620 KB', tipe: 'PDF', urlDrive: 'https://drive.google.com/file/d/demo3/view' },
    { id: 'DOC-004', tanggal: '2026-07-25', kategori: 'Administrasi Pokok', nama: 'Jadwal Regu Piket 7K & Pembiasaan Pagi.xlsx', ukuran: '120 KB', tipe: 'Excel', urlDrive: 'https://drive.google.com/file/d/demo4/view' },
    { id: 'DOC-005', tanggal: '2026-10-10', kategori: 'Surat Izin & Dispensasi', nama: 'Kumpulan Surat Keterangan Sakit & Dispensasi Oktober.pdf', ukuran: '2.1 MB', tipe: 'PDF', urlDrive: 'https://drive.google.com/file/d/demo5/view' },
    { id: 'DOC-006', tanggal: '2026-10-18', kategori: 'Laporan Wali Kelas', nama: 'Laporan Perkembangan Akademik & Karakter Tengah Semester.docx', ukuran: '1.8 MB', tipe: 'Word', urlDrive: 'https://drive.google.com/file/d/demo6/view' }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = INITIAL_DATA;
}

