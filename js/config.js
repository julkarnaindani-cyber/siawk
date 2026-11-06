/**
 * SI AWK - Konfigurasi Aplikasi Frontend
 * Terhubung ke Google Apps Script REST API via gas-pro-api
 */

const CONFIG = {
  // Masukkan URL Web App Google Apps Script hasil deploy (akhiran /exec)
  // Biarkan kosong untuk menggunakan mode simulasi lokal/demo berkecepatan 0ms
  GAS_URL: 'https://script.google.com/macros/s/AKfycbyv1jUqqSeqzv59lJqCEEoQViQdjdH5yYVbl2oGBEw/dev', 

  APP_NAME: 'SI AWK',
  APP_LONG_NAME: 'Sistem Informasi Administrasi Wali Kelas',
  APP_VERSION: 'v2.4-turbo',

  // Nama Kelas & Tahun Pelajaran Default
  DEFAULT_CLASS: 'VII-B',
  DEFAULT_ACADEMIC_YEAR: '2026/2027',
  DEFAULT_SEMESTER: 'Ganjil',
  DEFAULT_TEACHER: 'Bpk. Ahmad, S.Pd.',
  DEFAULT_NIP: '19880412 201402 1 003',

  // Pengaturan Kuota & Cache Sisi Klien (gas-scale-turbo)
  CACHE_TTL_MS: 300000, // 5 menit client TTL
  MAX_ZIP_UPLOAD_MB: 40,
  
  // Status Kategori Presensi
  ATTENDANCE_TYPES: {
    H: { code: 'H', label: 'Hadir', bg: '#ECFDF5', text: '#059669', badgeBg: 'bg-status-present-bg', badgeText: 'text-status-present-emerald' },
    S: { code: 'S', label: 'Sakit', bg: '#F0F9FF', text: '#0284C7', badgeBg: 'bg-status-sick-bg', badgeText: 'text-status-sick-sky' },
    I: { code: 'I', label: 'Izin',  bg: '#FFFBEB', text: '#D97706', badgeBg: 'bg-status-permission-bg', badgeText: 'text-status-permission-amber' },
    A: { code: 'A', label: 'Alpa',  bg: '#FEF2F2', text: '#DC2626', badgeBg: 'bg-status-absent-bg', badgeText: 'text-status-absent-rose' }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

