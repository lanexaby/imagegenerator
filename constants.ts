
import { Option, ImageStyleCategory } from './types';

export const DEFAULT_NEGATIVE_PROMPT = "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, grain, pixelated, jpeg artifacts";

export const KAMERA_OPTIONS: Option[] = [
  { id: 'extreme_closeup', label: 'Extreme Close-up', value: 'Extreme close-up shot' },
  { id: 'closeup', label: 'Close-up', value: 'Close-up shot' },
  { id: 'medium_closeup', label: 'Medium Close-up', value: 'Medium close-up shot' },
  { id: 'medium_shot', label: 'Medium Shot', value: 'Medium shot, waist up' },
  { id: 'cowboy_shot', label: 'Cowboy Shot', value: 'Cowboy shot, mid-thigh up'},
  { id: 'full_shot', label: 'Full Shot', value: 'Full body shot, long shot' },
  { id: 'wide_shot', label: 'Wide Shot', value: 'Wide angle shot, establishing shot' },
  { id: 'low_angle', label: 'Low Angle', value: 'Low angle shot' },
  { id: 'high_angle', label: 'High Angle', value: 'High angle shot' },
  { id: 'dutch_angle', label: 'Dutch Angle', value: 'Dutch angle, dutch tilt' },
  { id: 'pov_shot', label: 'Point of View (POV)', value: 'Point of view shot (POV)' },
];

export const WAKTU_OPTIONS: Option[] = [
  { id: 'pagi', label: 'Pagi Hari (Sunrise)', value: 'Sunrise glow, early morning light' },
  { id: 'siang', label: 'Siang Hari (Daylight)', value: 'Bright daylight, midday sun' },
  { id: 'sore', label: 'Sore Hari (Golden Hour)', value: 'Golden hour, late afternoon sun' },
  { id: 'senja', label: 'Senja (Twilight)', value: 'Twilight, dusk, blue hour' },
  { id: 'malam', label: 'Malam Hari (Night)', value: 'Night time, deep night' },
];

export const PENCAHAYAAN_OPTIONS: Option[] = [
  { id: 'natural', label: 'Alami & Lembut', value: 'Soft natural light' },
  { id: 'studio', label: 'Studio Profesional', value: 'Professional studio lighting, three-point lighting' },
  { id: 'dramatic', label: 'Dramatis', value: 'Dramatic lighting, chiaroscuro, strong contrast' },
  { id: 'lowkey', label: 'Remang (Low Key)', value: 'Low key lighting, moody shadows' },
  { id: 'silhouette', label: 'Siluet', value: 'Silhouette against a bright background' },
  { id: 'neon', label: 'Neon', value: 'Neon glow, vibrant artificial lights' },
  { id: 'backlit', label: 'Backlit', value: 'Backlit, rim lighting, halo effect' },
  { id: 'candlelight', label: 'Cahaya Lilin', value: 'Warm candlelight, intimate glow' },
  { id: 'moonlight', label: 'Cahaya Bulan', value: 'Ethereal moonlight' },
];

export const GAYA_OPTIONS: Option[] = [
  { id: 'photorealistic', label: ImageStyleCategory.PHOTOREALISTIC, value: 'Photorealistic, hyper-detailed, lifelike' },
  { id: 'cinematic', label: ImageStyleCategory.CINEMATIC, value: 'Cinematic, film look, moody color grading' },
  { id: 'oil_painting', label: ImageStyleCategory.OIL_PAINTING, value: 'Oil painting, textured brushstrokes' },
  { id: 'watercolor', label: ImageStyleCategory.WATERCOLOR, value: 'Watercolor, soft washes, flowing colors' },
  { id: 'anime', label: ImageStyleCategory.ANIME_STYLE, value: 'Anime style, vibrant, cel-shaded' },
  { id: 'fantasy', label: ImageStyleCategory.FANTASY_ART, value: 'Fantasy art, epic, detailed, mythical' },
  { id: 'vintage', label: ImageStyleCategory.VINTAGE_PHOTOGRAPHY, value: 'Vintage photo, retro, old film look' },
  { id: 'cyberpunk', label: ImageStyleCategory.CYBERPUNK, value: 'Cyberpunk, neon, futuristic, dystopian' },
  { id: 'steampunk', label: ImageStyleCategory.STEAMPUNK, value: 'Steampunk, victorian, gears, mechanical' },
  { id: 'minimalist', label: ImageStyleCategory.MINIMALIST, value: 'Minimalist, clean, simple, negative space' },
];

export const SUASANA_OPTIONS: Option[] = [
  { id: 'joyful', label: 'Ceria & Enerjik', value: 'Joyful, energetic, vibrant' },
  { id: 'mysterious', label: 'Misterius & Intrig', value: 'Mysterious, intriguing, enigmatic' },
  { id: 'romantic', label: 'Romantis & Lembut', value: 'Romantic, tender, soft' },
  { id: 'melancholic', label: 'Melankolis & Tenang', value: 'Melancholic, calm, serene, pensive' },
  { id: 'powerful', label: 'Kuat & Berani', value: 'Powerful, bold, confident, epic' },
  { id: 'nostalgic', label: 'Nostalgia', value: 'Nostalgic, wistful, reminiscent' },
  { id: 'dreamy', label: 'Melamun (Dreamy)', value: 'Dreamy, ethereal, whimsical' },
  { id: 'intense', label: 'Intens & Dramatis', value: 'Intense, dramatic, suspenseful' },
];

export const KUALITAS_GAMBAR_OPTIONS: Option[] = [
    { id: 'standard', label: 'Standar', value: 'standard quality, sharp focus' },
    { id: 'high', label: 'Tinggi', value: 'high quality, highly detailed, sharp focus' },
    { id: 'ultra', label: 'Ultra Realistis', value: 'ultra realistic, 8k, UHD, photorealistic' },
];

export const ASPEK_RASIO_OPTIONS: Option[] = [
    { id: '1:1', label: 'Persegi (1:1)', value: '1:1 aspect ratio' },
    { id: '16:9', label: 'Lanskap (16:9)', value: '16:9 aspect ratio' },
    { id: '9:16', label: 'Potret (9:16)', value: '9:16 aspect ratio' },
    { id: '4:3', label: 'Klasik (4:3)', value: '4:3 aspect ratio' },
    { id: '3:4', label: 'Potret Klasik (3:4)', value: '3:4 aspect ratio' },
];

export const GEMINI_MODEL_NAME = "gemini-2.5-flash";
