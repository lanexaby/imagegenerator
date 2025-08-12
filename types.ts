export type GeneratorType = 'veo' | 'imagen';

export interface PromptData {
  [key: string]: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
}

export interface VeoPromptData extends PromptData {
  ide_prompt: string;
  subjek: string;
  usia: string;
  warna_kulit: string;
  wajah: string;
  rambut: string;
  pakaian: string;
  asal: string;
  asesoris: string;
  aksi: string;
  ekspresi: string;
  tempat: string;
  waktu: string;
  gerakan_kamera: string;
  pencahayaan: string;
  gaya_video: string;
  kualitas_video: string;
  suasana_video: string;
  suara_atau_musik: string;
  dialog: string;
  detail_tambahan: string;
  technical_instructions: string;
  negativePrompt: string;
}

export interface ImagenPromptData extends PromptData {
  ide_prompt: string;
  subjek: string;
  usia: string;
  warna_kulit: string;
  wajah: string;
  rambut: string;
  pakaian: string;
  asal: string;
  asesoris: string;
  aksi: string;
  ekspresi: string;
  tempat: string;
  waktu: string;
  kamera: string;
  pencahayaan: string;
  gaya: string;
  kualitas_gambar: string;
  suasana_gambar: string;
  aspek_rasio: string;
  dialog: string;
  detail_tambahan: string;
  negativePrompt: string;
}
