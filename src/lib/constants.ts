import { StylePreset, PromptTemplate } from './types';

export const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1', width: 1024, height: 1024 },
  { label: '16:9', value: '16:9', width: 1344, height: 768 },
  { label: '9:16', value: '9:16', width: 768, height: 1344 },
  { label: '4:3', value: '4:3', width: 1152, height: 896 },
  { label: '3:4', value: '3:4', width: 896, height: 1152 },
  { label: '3:2', value: '3:2', width: 1216, height: 832 },
  { label: '2:3', value: '2:3', width: 832, height: 1216 },
  { label: '21:9', value: '21:9', width: 1536, height: 640 },
] as const;

export const STYLE_PRESETS: StylePreset[] = [
  { id: 'cinematic', name: 'Cinematic', category: 'Photography', suffix: ', cinematic lighting, dramatic atmosphere, film grain, anamorphic lens, 8K quality' },
  { id: 'anime', name: 'Anime', category: 'Anime', suffix: ', anime style, vibrant colors, detailed anime art, studio ghibli inspired, cel shading' },
  { id: 'realistic', name: 'Photorealistic', category: 'Photography', suffix: ', photorealistic, ultra detailed, DSLR, 85mm lens, natural lighting, RAW photo quality' },
  { id: 'cyberpunk', name: 'Cyberpunk', category: 'Sci-Fi', suffix: ', cyberpunk aesthetic, neon lights, futuristic cityscape, rain-soaked streets, holographic displays' },
  { id: 'fantasy', name: 'Epic Fantasy', category: 'Fantasy', suffix: ', epic fantasy art, magical atmosphere, ethereal lighting, enchanted landscape, mythical creatures' },
  { id: '3d-render', name: '3D Render', category: '3D', suffix: ', 3D render, octane render, unreal engine 5, volumetric lighting, PBR materials, ray tracing' },
  { id: 'watercolor', name: 'Watercolor', category: 'Art', suffix: ', watercolor painting, soft washes, flowing pigments, wet on wet technique, delicate transparency' },
  { id: 'oil-painting', name: 'Oil Painting', category: 'Art', suffix: ', oil painting, rich impasto, chiaroscuro, masterwork, gallery quality, museum piece' },
  { id: 'pixar', name: 'Pixar Style', category: '3D', suffix: ', Pixar style, 3D animated, expressive characters, vibrant colors, soft lighting, detailed textures' },
  { id: 'ghibli', name: 'Studio Ghibli', category: 'Anime', suffix: ', Studio Ghibli style, hand-painted background, whimsical, serene atmosphere, Hayao Miyazaki' },
  { id: 'noir', name: 'Film Noir', category: 'Photography', suffix: ', film noir, high contrast black and white, dramatic shadows, hard-boiled detective aesthetic' },
  { id: 'vaporwave', name: 'Vaporwave', category: 'Digital', suffix: ', vaporwave aesthetic, pastel gradients, retro 80s, glitch art, neon pink and cyan' },
  { id: 'minimalist', name: 'Minimalist', category: 'Design', suffix: ', minimalist design, clean lines, negative space, modern aesthetic, simple elegance' },
  { id: 'baroque', name: 'Baroque', category: 'Art', suffix: ', baroque style, ornate details, dramatic lighting, rich colors, classical composition' },
  { id: 'synthwave', name: 'Synthwave', category: 'Digital', suffix: ', synthwave, retrowave, 80s retro future, chrome, sunset gradient, grid landscape' },
  { id: 'isometric', name: 'Isometric', category: '3D', suffix: ', isometric view, isometric illustration, cute miniature world, detailed diorama, low poly' },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  { id: 'portrait', name: 'Portrait', prompt: 'A stunning portrait of {subject}, dramatic lighting, shallow depth of field, professional photography', category: 'Photography', ratio: '3:4' },
  { id: 'landscape', name: 'Epic Landscape', prompt: 'Breathtaking landscape of {subject}, golden hour lighting, vast scenery, National Geographic quality', category: 'Nature', ratio: '16:9' },
  { id: 'character', name: 'Character Design', prompt: 'Detailed character design of {subject}, full body, dynamic pose, concept art style, detailed armor and accessories', category: 'Design', ratio: '3:4' },
  { id: 'architecture', name: 'Architecture', prompt: 'Architectural visualization of {subject}, ultra modern, dramatic perspective, twilight ambiance, photorealistic rendering', category: 'Architecture', ratio: '16:9' },
  { id: 'product', name: 'Product Shot', prompt: 'Professional product photography of {subject}, studio lighting, clean background, commercial quality, 8K detail', category: 'Commercial', ratio: '1:1' },
  { id: 'abstract', name: 'Abstract Art', prompt: 'Abstract digital art of {subject}, flowing forms, vibrant color palette, contemporary style, high resolution', category: 'Art', ratio: '1:1' },
  { id: 'fashion', name: 'Fashion Editorial', prompt: 'High fashion editorial of {subject}, Vogue style, avant-garde styling, dramatic lighting, luxury aesthetic', category: 'Fashion', ratio: '3:4' },
  { id: 'food', name: 'Food Photography', prompt: 'Gourmet food photography of {subject}, styled plating, natural lighting, shallow DOF, Michelin star presentation', category: 'Food', ratio: '1:1' },
  { id: 'vehicle', name: 'Vehicle Render', prompt: 'Photorealistic render of {subject}, automotive photography, studio lighting, reflective surfaces, luxury car commercial', category: 'Automotive', ratio: '16:9' },
  { id: 'creature', name: 'Creature Design', prompt: 'Fantasy creature design of {subject}, detailed anatomy, mythological inspiration, atmospheric lighting, concept art', category: 'Fantasy', ratio: '1:1' },
];

export const LIGHTING_PRESETS = [
  { id: 'golden-hour', name: 'Golden Hour', suffix: ', golden hour lighting, warm sunlight, long shadows, magical atmosphere' },
  { id: 'studio', name: 'Studio Light', suffix: ', professional studio lighting, three-point lighting, soft boxes, clean illumination' },
  { id: 'dramatic', name: 'Dramatic', suffix: ', dramatic lighting, chiaroscuro, strong contrast, cinematic mood' },
  { id: 'neon', name: 'Neon Glow', suffix: ', neon lighting, colorful glow, cyberpunk atmosphere, reflections' },
  { id: 'moonlight', name: 'Moonlight', suffix: ', moonlight, soft blue illumination, night scene, ethereal glow' },
  { id: 'volumetric', name: 'Volumetric', suffix: ', volumetric lighting, god rays, atmospheric haze, light shafts' },
];

export const CAMERA_PRESETS = [
  { id: 'closeup', name: 'Close-Up', suffix: ', close-up shot, macro detail, shallow depth of field' },
  { id: 'wide', name: 'Wide Angle', suffix: ', wide angle shot, expansive view, 16mm lens' },
  { id: 'aerial', name: 'Aerial View', suffix: ', aerial view, birds eye perspective, drone shot' },
  { id: 'low-angle', name: 'Low Angle', suffix: ', low angle shot, looking up, heroic perspective' },
  { id: 'over-shoulder', name: 'Over Shoulder', suffix: ', over the shoulder shot, depth composition' },
  { id: 'tilt-shift', name: 'Tilt Shift', suffix: ', tilt-shift photography, miniature effect, selective focus' },
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out AI image generation',
    features: [
      '50 images per month',
      'Standard quality',
      '1:1 ratio only',
      'Community gallery access',
      'Basic prompt templates',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    period: 'month',
    description: 'For creators who need more power',
    features: [
      '1,000 images per month',
      'HD quality output',
      'All aspect ratios',
      'Bulk generation (up to 20)',
      'JSON workflows',
      'Style presets library',
      'Priority generation',
      'Download in HD',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 79,
    period: 'month',
    description: 'For teams and businesses at scale',
    features: [
      'Unlimited images',
      'Ultra HD quality',
      'All aspect ratios',
      'Bulk generation (up to 50)',
      'Advanced JSON workflows',
      'Custom style training',
      'API access',
      'Team workspaces',
      'Priority support',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const WORKFLOW_PRESETS: { name: string; data: import('./types').WorkflowData }[] = [
  {
    name: 'Character Suite',
    data: {
      name: 'Character Suite',
      prompts: [
        { prompt: 'heroic warrior character portrait, fantasy RPG', ratio: '3:4', style: 'cinematic' },
        { prompt: 'heroic warrior full body, fantasy RPG', ratio: '3:4', style: 'realistic' },
        { prompt: 'heroic warrior in action scene, fantasy RPG', ratio: '16:9', style: 'cinematic' },
        { prompt: 'heroic warrior concept art, fantasy RPG', ratio: '1:1', style: '3d-render' },
      ],
    },
  },
  {
    name: 'Product Showcase',
    data: {
      name: 'Product Showcase',
      prompts: [
        { prompt: 'luxury watch product shot on marble', ratio: '1:1', style: 'realistic' },
        { prompt: 'luxury watch lifestyle shot, wrist', ratio: '3:4', style: 'cinematic' },
        { prompt: 'luxury watch advertisement, hero shot', ratio: '16:9', style: '3d-render' },
        { prompt: 'luxury watch detail macro shot', ratio: '1:1', style: 'realistic' },
      ],
    },
  },
  {
    name: 'Social Media Pack',
    data: {
      name: 'Social Media Pack',
      prompts: [
        { prompt: 'stunning travel destination, Instagram aesthetic', ratio: '1:1', style: 'cinematic' },
        { prompt: 'stunning travel destination, story format', ratio: '9:16', style: 'cinematic' },
        { prompt: 'stunning travel destination, cover photo', ratio: '16:9', style: 'realistic' },
      ],
    },
  },
  {
    name: 'Sci-Fi World',
    data: {
      name: 'Sci-Fi World',
      prompts: [
        { prompt: 'futuristic megacity skyline at dusk', ratio: '21:9', style: 'cyberpunk' },
        { prompt: 'space station interior corridor', ratio: '16:9', style: '3d-render' },
        { prompt: 'alien planet landscape, twin moons', ratio: '16:9', style: 'cinematic' },
        { prompt: 'cyberpunk character with neon implants', ratio: '3:4', style: 'cyberpunk' },
        { prompt: 'spaceship cockpit dashboard', ratio: '16:9', style: '3d-render' },
      ],
    },
  },
];
