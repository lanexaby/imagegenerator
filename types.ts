
export interface Option {
  id: string;
  label: string;
  value: string;
  indonesianLabel?: string;
}

export interface PromptData {
  subjek: string;
  usia: string;
  warnaKulit: string;
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
  kualitasGambar: string;
  suasanaGambar: string;
  aspekRasio: string;
  detailTambahan: string;
  negativePrompt: string;
}

export enum ImageStyleCategory {
  PHOTOREALISTIC = "Photorealistic",
  CINEMATIC = "Cinematic",
  OIL_PAINTING = "Oil Painting",
  WATERCOLOR = "Watercolor",
  ANIME_STYLE = "Anime Style",
  FANTASY_ART = "Fantasy Art",
  RETRO = "Retro",
  VINTAGE_PHOTOGRAPHY = "Vintage Photography",
  CYBERPUNK = "Cyberpunk",
  STEAMPUNK = "Steampunk",
  MINIMALIST = "Minimalist",
  ABSTRACT = "Abstract",
  IMPRESSIONISTIC = "Impressionistic",
  CONCEPT_ART = "Concept Art",
  DRAMATIC_LIGHTING = "Dramatic Lighting",
  STUDIO_PORTRAIT = "Studio Portrait",
  DOCUMENTARY_STYLE = "Documentary Style",
  SURREAL = "Surreal",
  NEON_PUNK = "Neon Punk",
  DARK_FANTASY = "Dark Fantasy",
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added here if needed
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields can be added
}
