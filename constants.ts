import { FieldDefinition } from './types';

export const RAINBOW_COLORS = [
  '#ff79c6', // Pink
  '#ff6e6e', // Red
  '#ffb86c', // Orange
  '#f1fa8c', // Yellow
  '#50fa7b', // Green
  '#8be9fd', // Cyan
  '#6272a4', // Blue
  '#bd93f9', // Purple
];

export const VEO_FIELDS: FieldDefinition[] = [
  { key: 'subjek', label: 'Subjek', placeholder: 'cth: Seorang astronot, seekor naga' },
  { key: 'usia', label: 'Usia', placeholder: 'cth: Muda, dewasa, tua' },
  { key: 'warna_kulit', label: 'Warna Kulit', placeholder: 'cth: Putih, sawo matang' },
  { key: 'wajah', label: 'Wajah', placeholder: 'cth: Wajah detail, ekspresi bahagia' },
  { key: 'rambut', label: 'Rambut', placeholder: 'cth: Rambut pirang panjang, kuncir kuda' },
  { key: 'pakaian', label: 'Pakaian', placeholder: 'cth: Baju zirah abad pertengahan' },
  { key: 'asal', label: 'Asal (Negara)', placeholder: 'cth: Jepang, Mesir kuno' },
  { key: 'asesoris', label: 'Asesoris', placeholder: 'cth: Kacamata, pedang ajaib' },
  { key: 'aksi', label: 'Aksi', placeholder: 'cth: Berlari melintasi padang bunga' },
  { key: 'ekspresi', label: 'Ekspresi', placeholder: 'cth: Gembira, terkejut, sedih' },
  { key: 'tempat', label: 'Tempt', placeholder: 'cth: Di dalam kastil megah, hutan fantasi' },
  { key: 'waktu', label: 'Waktu', placeholder: 'cth: Matahari terbenam, malam berbintang' },
  { key: 'gerakan_kamera', label: 'Gerakan Kamera', placeholder: 'cth: Dolly zoom, tracking shot' },
  { key: 'pencahayaan', label: 'Pencahayaan', placeholder: 'cth: Sinematik, cahaya lembut' },
  { key: 'gaya_video', label: 'Gaya Video', placeholder: 'cth: Gaya Ghibli, film noir, vaporwave' },
  { key: 'kualitas_video', label: 'Kualitas Video', placeholder: 'cth: 8K, sangat detail, hyperrealistic' },
  { key: 'suasana_video', label: 'Suasana Video', placeholder: 'cth: Ajaib, misterius, ceria' },
  { key: 'suara_atau_musik', label: 'Suara atau Musik', placeholder: 'cth: Musik orkestra epik, suara alam' },
  { key: 'dialog', label: 'Dialog (Maks. 2 Karakter)', placeholder: 'cth: "Aku tidak akan kalah!"\n(Dialog tanpa nama karakter)', type: 'textarea' },
  { key: 'detail_tambahan', label: 'Detail Tambahan', placeholder: 'cth: Partikel debu beterbangan' },
  { key: 'technical_instructions', label: 'Instruksi Teknis (Lip-Sync)', placeholder: 'Akan dibuat otomatis oleh AI jika ada dialog', type: 'textarea' },
  { key: 'negativePrompt', label: 'Negative Prompt', placeholder: 'Akan dibuat otomatis oleh AI' },
];

export const IMAGEN_FIELDS: FieldDefinition[] = [
  { key: 'subjek', label: 'Subjek', placeholder: 'cth: Seekor kucing penyihir' },
  { key: 'usia', label: 'Usia', placeholder: 'cth: Anak kucing, dewasa' },
  { key: 'warna_kulit', label: 'Warna Kulit', placeholder: 'Berlaku jika subjek manusia' },
  { key: 'wajah', label: 'Wajah', placeholder: 'cth: Wajah imut, mata besar' },
  { key: 'rambut', label: 'Rambut', placeholder: 'Berlaku jika subjek manusia/humanoid' },
  { key: 'pakaian', label: 'Pakaian', placeholder: 'cth: Jubah penyihir dengan bintang' },
  { key: 'asal', label: 'Asal (Negara)', placeholder: 'cth: Budaya tertentu' },
  { key: 'asesoris', label: 'Asesoris', placeholder: 'cth: Topi runcing, tongkat sihir' },
  { key: 'aksi', label: 'Aksi', placeholder: 'cth: Membaca buku mantra yang bersinar' },
  { key: 'ekspresi', label: 'Ekspresi', placeholder: 'cth: Penasaran, fokus' },
  { key: 'tempat', label: 'Tempat', placeholder: 'cth: Perpustakaan tua yang nyaman' },
  { key: 'waktu', label: 'Waktu', placeholder: 'cth: Tengah malam, cahaya lilin' },
  { key: 'kamera', label: 'Kamera', placeholder: 'cth: Lensa makro, pandangan mata burung' },
  { key: 'pencahayaan', label: 'Pencahayaan', placeholder: 'cth: Pencahayaan dramatis, rim light' },
  { key: 'gaya', label: 'Gaya', placeholder: 'cth: Seni digital, cat minyak, anime' },
  { key: 'kualitas_gambar', label: 'Kualitas Gambar', placeholder: 'cth: Resolusi tinggi, sangat detail' },
  { key: 'suasana_gambar', label: 'Suasana Gambar', placeholder: 'cth: Mistis, hangat, tenang' },
  { key: 'aspek_rasio', label: 'Aspek Rasio', placeholder: 'cth: 16:9, 1:1, 9:16', type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4'] },
  { key: 'dialog', label: 'Dialog (Opsional, Maks. 2 Karakter)', placeholder: 'cth: "Mantra ini..."\n"...sangat kuat!" (Dialog tanpa nama karakter)', type: 'textarea' },
  { key: 'detail_tambahan', label: 'Detail Tambahan', placeholder: 'cth: Halaman buku beterbangan' },
  { key: 'negativePrompt', label: 'Negative Prompt', placeholder: 'Akan dibuat otomatis oleh AI' },
];