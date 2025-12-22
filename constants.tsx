
export interface VoiceProfile {
  name: string;
  gender: 'male' | 'female';
  voiceType: string;
  category: string;
  categoryKey: 'doc' | 'ads' | 'cartoon' | 'podcast' | 'novels' | 'youtube' | 'drama' | 'edu' | 'corporate';
  description: string;
}

export interface DialectInfo {
  id: string;
  title: string;
  description: string;
  profiles: VoiceProfile[];
}

export interface VoiceField {
  id: string;
  title: string;
  description: string;
  color: string;
  glow: string;
}

export const CATEGORY_STYLES = {
  doc: { color: 'from-purple-900 to-black', icon: 'mic-documentary' },
  ads: { color: 'from-purple-400 to-fuchsia-600', icon: 'mic-ads' },
  cartoon: { color: 'from-violet-400 via-purple-500 to-indigo-600', icon: 'mic-kids' },
  podcast: { color: 'from-purple-800 to-violet-950', icon: 'mic-podcast' },
  novels: { color: 'from-purple-600 to-fuchsia-950', icon: 'mic-book' },
  youtube: { color: 'from-purple-600 to-indigo-800', icon: 'mic-youtube' },
  drama: { color: 'from-purple-700 to-fuchsia-900', icon: 'mic-drama' },
  edu: { color: 'from-purple-500 to-violet-600', icon: 'mic-edu' },
  corporate: { color: 'from-purple-500 to-slate-800', icon: 'mic-corp' }
};

export const DIALECTS: DialectInfo[] = [
  {
    id: 'french',
    title: 'Français (L’élégance)',
    description: 'Voix sophistiquées, claires et mélodieuses pour le marché francophone.',
    profiles: [
      { name: 'Claire', gender: 'female', voiceType: 'بالغ', category: 'Narratrice Douce', categoryKey: 'novels', description: 'Une voix française élégante et apaisante, parfaite pour les livres audio et les documentaires.' },
      { name: 'Nicolas', gender: 'male', voiceType: 'بالغ', category: 'Voix Corporate', categoryKey: 'corporate', description: 'Une voix masculine posée et professionnelle pour vos présentations d’entreprise.' },
      { name: 'Léa', gender: 'female', voiceType: 'شخصية كارتونية', category: 'Enfantine / Pub', categoryKey: 'cartoon', description: 'Une voix pétillante et dynamique pour les publicités et les contenus jeunesse.' },
      { name: 'Antoine', gender: 'male', voiceType: 'بالغ', category: 'Documentaire Profond', categoryKey: 'doc', description: 'Voix grave et assurée pour des récits historiques ou scientifiques captivants.' }
    ]
  },
  {
    id: 'english',
    title: 'English (The Global Standard)',
    description: 'Universal, professional English voices for international audiences.',
    profiles: [
      { name: 'Sarah', gender: 'female', voiceType: 'بالغ', category: 'Warm Storyteller', categoryKey: 'novels', description: 'Clear British accent with a touch of warmth for storytelling.' },
      { name: 'John', gender: 'male', voiceType: 'بالغ', category: 'Deep Corporate', categoryKey: 'corporate', description: 'Authoritative American voice for business and leadership content.' },
      { name: 'Emily', gender: 'female', voiceType: 'بالغ', category: 'Modern Podcast', categoryKey: 'podcast', description: 'Friendly and conversational tone, ideal for interviews and tech updates.' },
      { name: 'Michael', gender: 'male', voiceType: 'بالغ', category: 'Action Trailer', categoryKey: 'ads', description: 'Powerful, cinematic voice for high-energy trailers and commercials.' }
    ]
  },
  {
    id: 'egyptian',
    title: 'اللهجة المصرية',
    description: 'صوت خفيف الظل، سريع الوتيرة، مثالي للإعلانات والدراما والكوميديا.',
    profiles: [
      { name: 'يوسف', gender: 'male', voiceType: 'بالغ', category: 'وثائقي قوي', categoryKey: 'doc', description: 'صوت رجولي عميق يناسب الأفلام الوثائقية والروايات التاريخية بنبرة حاكمة مؤثرة.' },
      { name: 'مالك', gender: 'male', voiceType: 'بالغ', category: 'إعلاني سريع', categoryKey: 'ads', description: 'صوت سريع وجذاب مخصص لصناعة الإعلانات والمؤثرات التسويقية بأسلوب مرحّب لامع.' },
      { name: 'ليلى', gender: 'female', voiceType: 'بالغ', category: 'إعلان وتسويق', categoryKey: 'ads', description: 'لهجة مصرية أنثوية واضحة ونشيطة، مناسبة للإعلانات التجارية السريعة والفواصل الترويجية.' }
    ]
  },
  {
    id: 'moroccan',
    title: 'اللهجة المغربية',
    description: 'نبرة مغاربية فريدة، تمزج بين الأصالة والحداثة، مثالية للمحتوى التسويقي والسينمائي.',
    profiles: [
      { name: 'أمين', gender: 'male', voiceType: 'بالغ', category: 'سرد مغربي', categoryKey: 'doc', description: 'صوت مغربي دافئ ومميز، مثالي للسرد القصصي والأفلام الوثائقية.' },
      { name: 'كنزة', gender: 'female', voiceType: 'بالغ', category: 'إعلان مغربي', categoryKey: 'ads', description: 'نبرة مغربية عصرية، حيوية ومناسبة جداً لإعلانات الراديو والتواصل الاجتماعي.' }
    ]
  },
  {
    id: 'levantine',
    title: 'اللهجة الشامية',
    description: 'لهجة بلاد الشام العريقة (سوريا، لبنان، الأردن، فلسطين)، دافئة وناعمة، مثالية للدراما.',
    profiles: [
      { name: 'سامر', gender: 'male', voiceType: 'بالغ', category: 'دراما شامية', categoryKey: 'drama', description: 'صوت شامي أصيل، قوي ومؤثر، ممتاز للأعمال الدرامية والدوبلاج.' },
      { name: 'نور', gender: 'female', voiceType: 'بالغ', category: 'رواية ناعمة', categoryKey: 'novels', description: 'صوت شامي هادئ وشفاف، يضفي لمسة من الجمال على الكتب الصوتية.' }
    ]
  },
  {
    id: 'tunisian',
    title: 'اللهجة التونسية',
    description: 'لهجة تونسية عذبة، سريعة ورقيقة، تعكس روح المتوسط بلمسة فنية.',
    profiles: [
      { name: 'مهدي', gender: 'male', voiceType: 'بالغ', category: 'بودكاست تونسي', categoryKey: 'podcast', description: 'صوت تونسي مثقف ومنطلق، مثالي للبودكاست والمحتوى التعليمي.' },
      { name: 'إيناس', gender: 'female', voiceType: 'بالغ', category: 'تسويق تونسي', categoryKey: 'ads', description: 'لهجة تونسية واضحة وجذابة، مناسبة جداً للعلامات التجارية الشبابية.' }
    ]
  },
  {
    id: 'saudi',
    title: 'اللهجة السعودية',
    description: 'رصين، فخم، يعكس الهوية السعودية بوضوح واتزان عالي.',
    profiles: [
      { name: 'ناصر', gender: 'male', voiceType: 'بالغ', category: 'وثائقي رسمي', categoryKey: 'doc', description: 'صوت سعودي ذكوري عميق ورسمي يناسب الأفلام الوثائقية والتقارير الجادة.' },
      { name: 'الجوهرة', gender: 'female', voiceType: 'بالغ', category: 'وثائقي أنثوي', categoryKey: 'doc', description: 'نبرة رسمية قوية، مناسبة للروايات والقصص الوثائقية.' }
    ]
  },
  {
    id: 'fusha',
    title: 'فصحى',
    description: 'لغة الضاد، معايير النطق السليم، للوثائقيات والتعليم والكتب الصوتية العالمية.',
    profiles: [
      { name: 'طارق', gender: 'male', voiceType: 'بالغ', category: 'روايات', categoryKey: 'novels', description: 'صوت عربي فصيح ثابت وواضح مناسب للكتب والروايات الصوتية الطويلة.' },
      { name: 'سلمى', gender: 'female', voiceType: 'بالغ', category: 'تعليم ودروس', categoryKey: 'edu', description: 'صوت أنثوي فصيح واضح مناسب للشرح والتدريس والسرد الأكاديمي.' }
    ]
  }
];

export const VOICE_TYPES = [
  'بالغ', 'كبار السن', 'شخصية كارتونية'
];

export const VOICE_FIELDS: VoiceField[] = [
  { id: 'ads', title: 'Publicité / الإعلانات', description: 'Dynamique et énergique. صوت سريع ومباشر مليء بالطاقة.', color: 'from-purple-500 to-fuchsia-500', glow: 'shadow-purple-500/20' },
  { id: 'doc', title: 'Documentaire / الوثائقي', description: 'Profond et formel. صوت عميق ورسمي للسرد التاريخي.', color: 'from-indigo-700 to-purple-900', glow: 'shadow-indigo-500/20' },
  { id: 'novels', title: 'Livre Audio / الروايات', description: 'Fluide et riche en émotions. أداء سلس طويل المدى، غني بالتعبير والعمق.', color: 'from-violet-600 to-purple-900', glow: 'shadow-violet-500/20' },
  { id: 'corporate', title: 'Corporate / الشركات', description: 'Professionnel et clair. صوت رسمي واضح للعروض المهنية.', color: 'from-purple-600 to-slate-800', glow: 'shadow-purple-500/20' }
];

export const STUDIO_CONTROLS = {
  temp: {
    title: 'Ton / حرارة الصوت',
    options: [
      { label: 'Chaleureux', desc: 'Une voix humaine et enveloppante. دافئ مُشبع بالإحساس.' },
      { label: 'Neutre', desc: 'Équilibré et objectif. متوازن وموضوعي.' },
      { label: 'Froid', desc: 'Direct et analytique. حاد محايد.' }
    ]
  },
  emotion: {
    title: 'Emotion / الانفعال',
    options: [
      { label: 'Calme', desc: 'Fluide et posé. إلقاء سلس هادئ.' },
      { label: 'Expressif', desc: 'Vibrant et vivant. نبرة مؤثرة مليئة بالحيوية.' }
    ]
  },
  speed: {
    title: 'Vitesse / السرعة',
    options: [
      { label: 'Lente', desc: 'Pour les récits profonds. للروايات المركزة.' },
      { label: 'Normale', desc: 'Standard et polyvalent. متوازنة لمعظم المحتوى.' },
      { label: 'Rapide', desc: 'Idéal pour le marketing. للإعلانات السريعة.' }
    ]
  },
  drama: {
    title: 'Intensité / الدراما',
    options: [
      { label: 'Légère', desc: 'Réaliste. مناسب للمحتوى الواقعي.' },
      { label: 'Épique', desc: 'Héroïque et cinématique. ملحمي وقوي.' }
    ]
  },
  narration: {
    title: 'Narration / السرد',
    options: [
      { label: 'Sérieuse', desc: 'Style informatif et factuel. أسلوب إخباري واقعي.' },
      { label: 'Narrative', desc: 'Storytelling fluide. سرد قصصي انسيابي.' },
      { label: 'Poétique', desc: 'Lyrique et inspirant. أسلوب أدبي ملهم.' }
    ]
  }
};

export const getBaseVoiceForType = (type: string, gender: string) => {
  if (gender === 'female' || gender === 'أنثى') return 'Kore';
  if (type === 'كبار السن') return 'Charon';
  if (type === 'شخصية كارتونية') return 'Kore';
  return 'Fenrir';
};
