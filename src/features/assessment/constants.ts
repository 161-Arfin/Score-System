import type { AssessmentSection } from "./types";

export const assessmentEndpoint = "/v1/assessment";
export const assessmentValidatePhoneEndpoint = "/v1/keluarga/checkbyphone";

export const assessmentWelcome = {
  title: "Sakinah Score Assessment - LAZ MKU",
  description: [
    "Assalamu'alaikum warahmatullahi wabarakatuh,",
    "Terima kasih telah berpartisipasi dalam Sakinah Score Assessment.",
    "Ini adalah alat ukur kesejahteraan keluarga berbasis Maqashid Syariah (5 Dimensi: Agama, Jiwa, Akal, Keturunan, Harta).",
    "Waktu pengisian: +-10-15 menit",
    "Update: Setiap 3 bulan (kuartalan)",
    "Data Anda dijaga kerahasiaannya dan hanya diakses oleh konselor yang ditunjuk LAZ MKU.",
    "Wassalamu'alaikum warahmatullahi wabarakatuh,",
    "Direktorat Program LAZ MKU",
  ],
};

export const assessmentConfirmation = {
  title: "Assessment Tersimpan",
  description: [
    "Jazakumullah khairan!",
    "Assessment Anda telah tersimpan. Hasil Sakinah Score akan dikirim via WhatsApp dalam 1x24 jam bersama dengan rekomendasi program pendampingan.",
    "Konselor akan menghubungi Anda untuk jadwal pendampingan.",
    "Untuk pertanyaan, hubungi: 0819-0371-9603 (LAZ MKU)",
  ],
};

export const assessmentUnitBmtOptions = [
  { label: "Unit BMT A", value: "1" },
  { label: "Unit BMT B", value: "2" },
  { label: "Unit BMT C", value: "3" },
  { label: "Unit BMT D", value: "4" },
];

export const assessmentFamilyMemberOptions = Array.from(
  { length: 10 },
  (_, index) => {
    const value = String(index + 1);

    return {
      label: value,
      value,
    };
  },
);

export const assessmentSections: AssessmentSection[] = [
  {
    id: "hifz_ad_din",
    title: "Dimensi 1: Hifz Ad-Din",
    subtitle: "Melindungi keimanan & ketaatan keluarga",
    weight: "25%",
    questions: [
      {
        id: "q8",
        indicator: "Shalat 5 waktu berjamaah (suami di masjid)",
        scoreRange: "0-20",
        options: [
          { label: "5x", value: 20 },
          { label: "4x", value: 16 },
          { label: "3x", value: 12 },
          { label: "2x", value: 8 },
          { label: "1x", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q9",
        indicator: "Shalat 5 waktu tepat waktu (istri & anak)",
        scoreRange: "0-20",
        options: [
          { label: "5x", value: 20 },
          { label: "4x", value: 16 },
          { label: "3x", value: 12 },
          { label: "2x", value: 8 },
          { label: "1x", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q10",
        indicator: "Tahfizh Al-Qur'an (anak/orang tua)",
        scoreRange: "0-15",
        options: [
          { label: "> 5 juz", value: 15 },
          { label: "3-5 juz", value: 12 },
          { label: "1-2 juz", value: 8 },
          { label: "Doa harian", value: 4 },
          { label: "Tidak ada", value: 0 },
        ],
      },
      {
        id: "q11",
        indicator: "Sedekah rutin (zakat, infak, shadaqah)",
        scoreRange: "0-15",
        options: [
          { label: "Rutin cukup", value: 15 },
          { label: "Rutin kurang", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Jarang", value: 4 },
          { label: "Tidak Pernah", value: 0 },
        ],
      },
      {
        id: "q12",
        indicator: "Kajian keislaman keluarga per bulan",
        scoreRange: "0-15",
        options: [
          { label: "> 4x", value: 15 },
          { label: "3-4x", value: 12 },
          { label: "2x", value: 8 },
          { label: "1x", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q13",
        indicator: "Puasa sunnah (Senin-Kamis, Ayyamul Bidh)",
        scoreRange: "0-15",
        options: [
          { label: "Rutin", value: 15 },
          { label: "Sering", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Jarang", value: 4 },
          { label: "Tidak pernah", value: 0 },
        ],
      },
    ],
  },
  {
    id: "hifz_an_nafs",
    title: "Dimensi 2: Hifz An-Nafs",
    subtitle: "Melindungi kesehatan fisik & mental keluarga",
    weight: "15%",
    questions: [
      {
        id: "q14",
        indicator: "Cek kesehatan rutin per tahun",
        scoreRange: "0-20",
        options: [
          { label: "Semua anggota", value: 20 },
          { label: "Sebagian", value: 16 },
          { label: "Kadang", value: 12 },
          { label: "Jarang", value: 8 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q15",
        indicator: "Aktivitas fisik/olahraga per minggu",
        scoreRange: "0-15",
        options: [
          { label: ">5x", value: 15 },
          { label: "3-4x", value: 12 },
          { label: "2x", value: 8 },
          { label: "1x", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q16",
        indicator: "Pola makan sehat (gizi seimbang, halal)",
        scoreRange: "0-15",
        options: [
          { label: "Selalu", value: 15 },
          { label: "Sering", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Jarang", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q17",
        indicator: "Tidur cukup (7-8 jam/hari)",
        scoreRange: "0-15",
        options: [
          { label: "Semua", value: 15 },
          { label: "Sebagian", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Jarang", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q18",
        indicator: "Kesehatan mental (stres, cemas, depresi)",
        scoreRange: "0-20",
        options: [
          { label: "Sehat", value: 20 },
          { label: "Mild", value: 16 },
          { label: "Moderate", value: 12 },
          { label: "High", value: 8 },
          { label: "Severe", value: 0 },
        ],
      },
      {
        id: "q19",
        indicator: "Akses layanan kesehatan (BPJS/asuransi)",
        scoreRange: "0-15",
        options: [
          { label: "Semua punya", value: 15 },
          { label: "Sebagian", value: 12 },
          { label: "Tidak", value: 0 },
        ],
      },
    ],
  },
  {
    id: "hifz_al_aql",
    title: "Dimensi 3: Hifz Al-Aql",
    subtitle: "Melindungi & mengembangkan intelektualitas keluarga",
    weight: "15%",
    questions: [
      {
        id: "q20",
        indicator: "Pendidikan formal anak (sesuai kemampuan)",
        scoreRange: "0-15",
        options: [
          { label: "Berkelanjutan", value: 15 },
          { label: "Lancar", value: 12 },
          { label: "Kadang terkendala", value: 8 },
          { label: "Putus", value: 0 },
        ],
      },
      {
        id: "q21",
        indicator: "Waktu belajar bersama orang tua per minggu",
        scoreRange: "0-15",
        options: [
          { label: "> 5 jam", value: 15 },
          { label: "3-5 jam", value: 12 },
          { label: "1-2 jam", value: 8 },
          { label: "< 1 jam", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q22",
        indicator: "Literasi keluarga (baca buku, kajian)",
        scoreRange: "0-15",
        options: [
          { label: "> 5 buku/tahun", value: 15 },
          { label: "3-5", value: 12 },
          { label: "1-2", value: 8 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q23",
        indicator: "Manajemen screen time & gadget",
        scoreRange: "0-15",
        options: [
          { label: "Terkontrol", value: 15 },
          { label: "Cukup", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Tidak", value: 0 },
        ],
      },
      {
        id: "q24",
        indicator: "Keterlibatan orang tua di sekolah anak",
        scoreRange: "0-15",
        options: [
          { label: "Aktif", value: 15 },
          { label: "Cukup", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Tidak", value: 0 },
        ],
      },
      {
        id: "q25",
        indicator: "Pengembangan skill orang tua (training, kursus)",
        scoreRange: "0-15",
        options: [
          { label: "Rutin", value: 15 },
          { label: "Sering", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Tidak", value: 0 },
        ],
      },
      {
        id: "q26",
        indicator: "Prestasi/progress anak (akademik & akhlak)",
        scoreRange: "0-10",
        options: [
          { label: "Meningkat", value: 10 },
          { label: "Stabil", value: 8 },
          { label: "Fluktuatif", value: 6 },
          { label: "Menurun", value: 0 },
        ],
      },
    ],
  },
  {
    id: "hifz_an_nasl",
    title: "Dimensi 4: Hifz An-Nasl",
    subtitle: "Melindungi keharmonisan rumah tangga & kualitas generasi",
    weight: "20%",
    questions: [
      {
        id: "q27",
        indicator: "Frekuensi konflik suami-istri per bulan",
        scoreRange: "0-15",
        options: [
          { label: "0", value: 15 },
          { label: "1-2x", value: 12 },
          { label: "3-4x", value: 8 },
          { label: "5-6x", value: 4 },
          { label: ">6x", value: 0 },
        ],
      },
      {
        id: "q28",
        indicator: "Cara resolusi konflik",
        scoreRange: "0-15",
        options: [
          { label: "Musyawarah", value: 15 },
          { label: "Diam dulu", value: 12 },
          { label: "Mengalah", value: 8 },
          { label: "Emosi", value: 4 },
          { label: "Kekerasan", value: 0 },
        ],
      },
      {
        id: "q29",
        indicator: "Quality time suami-istri per minggu",
        scoreRange: "0-15",
        options: [
          { label: ">10 jam", value: 15 },
          { label: "7-10 jam", value: 12 },
          { label: "4-6 jam", value: 8 },
          { label: "1-3 jam", value: 4 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q30",
        indicator: "Komunikasi efektif (saling mendengar)",
        scoreRange: "0-15",
        options: [
          { label: "Sangat baik", value: 15 },
          { label: "Baik", value: 12 },
          { label: "Cukup", value: 8 },
          { label: "Kurang", value: 4 },
          { label: "Buruk", value: 0 },
        ],
      },
      {
        id: "q31",
        indicator: "Pola asuh anak (otoritatif, islami)",
        scoreRange: "0-15",
        options: [
          { label: "Otoritatif", value: 15 },
          { label: "Campuran", value: 12 },
          { label: "Keras", value: 8 },
          { label: "Abai", value: 0 },
        ],
      },
      {
        id: "q32",
        indicator: "Hubungan antar saudara (jika >1 anak)",
        scoreRange: "0-15",
        options: [
          { label: "Harmonis", value: 15 },
          { label: "Baik", value: 12 },
          { label: "Cukup", value: 8 },
          { label: "Bertengkar", value: 4 },
          { label: "Konflik", value: 0 },
        ],
      },
      {
        id: "q33",
        indicator: "Kepuasan pernikahan (self-assessment 1-10)",
        scoreRange: "0-10",
        options: [
          { label: "9-10", value: 10 },
          { label: "7-8", value: 8 },
          { label: "5-6", value: 6 },
          { label: "3-4", value: 2 },
          { label: "1-2", value: 0 },
        ],
      },
    ],
  },
  {
    id: "hifz_al_mal",
    title: "Dimensi 5: Hifz Al-Mal",
    subtitle: "Melindungi & mengembangkan kekayaan keluarga secara syariah",
    weight: "25%",
    questions: [
      {
        id: "q34",
        indicator: "Stabilitas income (3 bulan terakhir)",
        scoreRange: "0-20",
        options: [
          { label: "Stabil", value: 20 },
          { label: "Fluktuatif ringan", value: 16 },
          { label: "Fluktuatif", value: 12 },
          { label: "Menurun", value: 8 },
          { label: "Tidak", value: 0 },
        ],
      },
      {
        id: "q35",
        indicator: "Debt-to-income ratio (utang/pendapatan)",
        scoreRange: "0-20",
        options: [
          { label: "<10%", value: 20 },
          { label: "10-20%", value: 16 },
          { label: "20-30%", value: 12 },
          { label: "30-40%", value: 8 },
          { label: ">40%", value: 0 },
        ],
      },
      {
        id: "q36",
        indicator: "Emergency fund (dana darurat)",
        scoreRange: "0-20",
        options: [
          { label: ">6 bulan", value: 20 },
          { label: "4-6 bulan", value: 16 },
          { label: "2-3 bulan", value: 12 },
          { label: "1 bulan", value: 8 },
          { label: "0", value: 0 },
        ],
      },
      {
        id: "q37",
        indicator: "Pencatatan keuangan keluarga",
        scoreRange: "0-15",
        options: [
          { label: "Rutin detail", value: 15 },
          { label: "Rutin sederhana", value: 12 },
          { label: "Kadang", value: 8 },
          { label: "Tidak", value: 0 },
        ],
      },
      {
        id: "q38",
        indicator: "Kepatuhan syariah (no riba, halal income)",
        scoreRange: "0-15",
        options: [
          { label: "100%", value: 15 },
          { label: "Ada sedikit", value: 12 },
          { label: "Campuran", value: 8 },
          { label: "Banyak", value: 4 },
          { label: "Semua riba", value: 0 },
        ],
      },
      {
        id: "q39",
        indicator: "Kepemilikan aset produktif",
        scoreRange: "0-10",
        options: [
          { label: "Ada & berkembang", value: 10 },
          { label: "Stabil", value: 8 },
          { label: "Menurun", value: 6 },
          { label: "Tidak", value: 0 },
        ],
      },
    ],
  },
];
