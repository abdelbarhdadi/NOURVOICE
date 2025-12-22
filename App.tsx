
import React, { useState, useRef, useEffect } from 'react';
import { DIALECTS, VOICE_TYPES, VOICE_FIELDS, STUDIO_CONTROLS, CATEGORY_STYLES, getBaseVoiceForType, DialectInfo, VoiceProfile, VoiceField } from './constants';
import { GenerationHistory, VoiceControls } from './types';
import { nourishService } from './services/geminiService';

// --- Cinematic Intro Component ---
const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'titles' | 'reveal' | 'fadeout'>('titles');
  const [particles] = useState(() => 
    [...Array(40)].map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5
    }))
  );

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('reveal'), 2500);
    const timer2 = setTimeout(() => setStage('fadeout'), 5000);
    const timer3 = setTimeout(onComplete, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#050505] overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${stage === 'fadeout' ? 'opacity-0 blur-2xl' : 'opacity-100'}`}>
      <div className="absolute inset-0 perspective-[1000px]">
        {particles.map(p => (
          <div 
            key={p.id}
            className="particle animate-float-slow"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>
      <div className="fog-layer"></div>
      <div className="relative z-10 text-center scale-up">
        <div className={`${stage === 'titles' ? 'animate-cinematic' : 'opacity-0 transition-opacity duration-1000'}`}>
          <h2 className="tech-logo text-6xl md:text-8xl">NOUR VOICE</h2>
          <div className="tech-subtitle text-sm md:text-base">PROFESSIONAL VOICE ENGINE</div>
        </div>
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${stage === 'reveal' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="relative flex flex-col items-center">
            <h2 className="tech-logo text-5xl md:text-7xl">NOUR VOICE</h2>
            <div className="tech-subtitle text-xs md:text-sm">PROFESSIONAL VOICE ENGINE</div>
            <div className="mt-12 flex gap-1 h-12 justify-center">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-[#9333ea]/40 rounded-full animate-pulse" 
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: '1s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Icons ---
const FloatingMic = () => (
  <div className="absolute -top-10 -left-10 w-32 h-32 opacity-10 pointer-events-none animate-float">
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#9333ea] drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
    </svg>
  </div>
);

const FloatingHeadphones = () => (
  <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 pointer-events-none animate-float-slow">
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#9333ea] drop-shadow-[0_0_20px_rgba(147,51,234,0.4)]">
      <path d="M12 2C6.48 2 2 6.48 2 12v7c0 1.1.9 2 2 2h3v-8H4v-1c0-4.41 3.59-8 8-8s8 3.59 8 8v1h-3v8h3c1.1 0 2-.9 2-2v-7c0-5.52-4.48-10-10-10z"/>
    </svg>
  </div>
);

const GenderIcon = ({ gender, className }: { gender: string, className?: string }) => {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );
};

const CategoryIcon = ({ type, className }: { type: string, className?: string }) => {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
};

const SelectionBlock: React.FC<{
  title: string;
  options: string[];
  current: string;
  set: (s: string) => void;
}> = ({ title, options, current, set }) => (
  <div className="w-full space-y-6">
    <h3 className="text-xs font-bold text-[#9333ea] uppercase tracking-[0.4em] text-center mb-8">{title}</h3>
    <div className="flex flex-wrap justify-center gap-3">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => set(opt)}
          className={`px-8 py-3.5 rounded-[22px] border transition-all duration-500 text-sm font-bold shadow-sm ${
            current === opt 
              ? 'purple-bg text-white scale-105 shadow-[#9333ea]/30' 
              : 'border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const ControlGroup: React.FC<{
  id: string;
  title: string;
  options: { label: string; desc: string }[];
  current: string;
  onChange: (val: string) => void;
}> = ({ id, title, options, current, onChange }) => (
  <div className="space-y-4 text-right group">
    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] group-hover:text-[#9333ea]/50 transition-colors">{title}</label>
    <div className="grid grid-cols-1 gap-2.5">
      {options.map(opt => (
        <button
          key={opt.label}
          onClick={() => onChange(opt.label)}
          className={`relative p-4 rounded-2xl border text-right transition-all duration-500 overflow-hidden ${
            current === opt.label 
              ? 'border-[#9333ea]/50 bg-[#9333ea]/10 text-white shadow-lg' 
              : 'border-white/5 bg-white/5 text-white/30 hover:bg-white/10 hover:border-white/10'
          }`}
        >
          {current === opt.label && <div className="absolute top-0 right-0 w-1 h-full bg-[#9333ea]"></div>}
          <div className="flex justify-between items-center mb-1 flex-row-reverse">
            <span className={`text-sm font-bold ${current === opt.label ? 'text-[#9333ea]' : 'text-white/60'}`}>{opt.label}</span>
          </div>
          <p className="text-[10px] text-white/30 leading-relaxed line-clamp-2">{opt.desc}</p>
        </button>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    const played = sessionStorage.getItem('nour_voice_intro_played');
    return played !== 'true';
  });

  const [selectedDialectId, setSelectedDialectId] = useState<string>(DIALECTS[0].id);
  const [selectedType, setSelectedType] = useState<string>(VOICE_TYPES[0]);
  const [selectedGender, setSelectedGender] = useState<string>('ذكر');
  const [selectedFieldId, setSelectedFieldId] = useState<string>(VOICE_FIELDS[0].id);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  
  const [voiceControls, setVoiceControls] = useState<VoiceControls>({
    temp: 'Chaleureux', emotion: 'Calme', speed: 'Normale', depth: 'متوسطة', pitch: 'متوسطة', drama: 'Légère', narration: 'Narrative'
  });

  const [inputText, setInputText] = useState<string>('');
  const [processedText, setProcessedText] = useState<string>('');
  const [isPreprocessing, setIsPreprocessing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<GenerationHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedDialect = DIALECTS.find(d => d.id === selectedDialectId) || DIALECTS[0];
  const selectedField = VOICE_FIELDS.find(f => f.id === selectedFieldId) || VOICE_FIELDS[0];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const filteredProfiles = selectedDialect.profiles.filter(p => {
    const matchesGender = p.gender === (selectedGender === 'ذكر' ? 'male' : 'female');
    return matchesGender;
  });

  const handlePreprocess = async () => {
    if (!inputText.trim()) {
      setError("Veuillez saisir un texte.");
      return;
    }
    setError(null);
    setIsPreprocessing(true);
    try {
      const refined = await nourishService.preprocessText(inputText, {
        dialect: selectedDialect.title,
        field: selectedField.title,
        personality: selectedVoiceName,
        controls: voiceControls
      });
      setProcessedText(refined);
    } catch (err) {
      setError("Échec de l'optimisation IA.");
    } finally {
      setIsPreprocessing(false);
    }
  };

  const handleGenerate = async () => {
    const textToUse = processedText || inputText;
    if (!textToUse.trim()) {
      setError("Veuillez saisir un texte.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setCurrentResult(null);
    setIsPlaying(false);
    try {
      const activeVoice = filteredProfiles.find(p => p.name === selectedVoiceName) || filteredProfiles[0];
      const performanceNote = `
Language: ${selectedDialect.title}
Gender: ${activeVoice?.gender}
Category: ${selectedField.title}
Voice: ${selectedVoiceName || 'Default'}
Controls: Temp(${voiceControls.temp}), Speed(${voiceControls.speed}), Drama(${voiceControls.drama}), Narration(${voiceControls.narration})
      `;
      const baseVoice = getBaseVoiceForType(selectedType, activeVoice?.gender || 'male');
      const audioUrl = await nourishService.generateVoiceOver(textToUse, baseVoice, performanceNote);
      const result: GenerationHistory = {
        id: Math.random().toString(36).substr(2, 9),
        text: textToUse,
        selection: { 
          dialect: selectedDialect.title, type: activeVoice?.category || 'Standard', field: selectedField.title,
          controls: { ...voiceControls }
        },
        timestamp: Date.now(),
        audioBlobUrl: audioUrl
      };
      setCurrentResult(result);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      setError("Erreur de génération. Réessayez.");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const finishIntro = () => {
    sessionStorage.setItem('nour_voice_intro_played', 'true');
    setShowIntro(false);
  };

  if (showIntro) return <CinematicIntro onComplete={finishIntro} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-24 px-6 font-arabic overflow-hidden relative animate-in fade-in duration-1000" dir="ltr">
      
      <div className="bg-light-blob top-[10%] left-[5%]"></div>
      <div className="bg-light-blob bottom-[10%] right-[5%]" style={{ animationDelay: '-5s', background: 'radial-gradient(circle, rgba(147, 51, 234, 0.05) 0%, transparent 70%)' }}></div>
      
      <FloatingMic />
      <FloatingHeadphones />

      <header className="mb-24 text-center relative z-10 group">
        <div className="flex flex-col items-center gap-6 mb-6">
          <div className="h-20 w-20 purple-bg rounded-[24px] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-6xl font-bold purple-text tracking-tight leading-tight">NOUR VOICE</h1>
            <p className="text-white/30 text-xs uppercase tracking-[0.4em] font-medium mt-2">PROFESSIONAL VOICE ENGINE</p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-5xl space-y-24 relative z-10">
        
        {/* Step 1: Text Content */}
        <section className="glass-3d p-12 md:p-16 rounded-[45px] space-y-12">
          <h3 className="text-xs font-bold text-[#9333ea] uppercase tracking-[0.4em] text-center">1. Engineering the Script / هندسة المخطوطة</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-5">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block">Input Draft / مسودة النص</label>
              <textarea
                className="w-full h-80 bg-black/40 border border-white/5 rounded-[40px] p-8 text-xl text-white placeholder-white/5 focus:outline-none focus:border-[#9333ea]/20 transition-all leading-relaxed resize-none shadow-2xl"
                placeholder="Tapez votre texte ici..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                onClick={handlePreprocess}
                disabled={isPreprocessing || !inputText.trim()}
                className="w-full py-5 rounded-[24px] border border-[#9333ea]/20 bg-[#9333ea]/5 text-[#9333ea] text-sm font-bold hover:bg-[#9333ea] hover:text-white transition-all disabled:opacity-20 flex items-center justify-center gap-4 group shadow-lg"
              >
                {isPreprocessing ? <div className="w-4 h-4 border-2 border-[#9333ea]/30 border-t-[#9333ea] rounded-full animate-spin"></div> : null}
                <span className="tracking-widest">IA REFINEMENT / تحسين ذكي</span>
              </button>
            </div>
            <div className="space-y-5">
              <label className="text-[10px] font-bold text-[#9333ea]/50 uppercase tracking-widest block">Production Ready / المخطوطة النهائية</label>
              <textarea
                className="w-full h-80 bg-[#9333ea]/5 border border-[#9333ea]/10 rounded-[40px] p-8 text-xl text-purple-100 placeholder-white/5 focus:outline-none focus:border-[#9333ea]/30 transition-all leading-relaxed resize-none shadow-2xl"
                placeholder="Resultat optimisé..."
                value={processedText}
                onChange={(e) => setProcessedText(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Step 2: Language */}
        <section className="glass-3d p-12 md:p-16 rounded-[45px]">
          <h3 className="text-xs font-bold text-[#9333ea] uppercase tracking-[0.4em] text-center mb-14">2. Language & Dialect / اللغة واللهجة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DIALECTS.map((dialect) => (
              <button
                key={dialect.id}
                onClick={() => setSelectedDialectId(dialect.id)}
                className={`relative p-8 rounded-[35px] transition-all duration-500 border-2 group ${
                  selectedDialectId === dialect.id 
                    ? 'border-[#9333ea]/50 bg-[#9333ea]/5 shadow-2xl scale-[1.02]' 
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <h4 className={`text-2xl font-bold ${selectedDialectId === dialect.id ? 'text-[#9333ea]' : 'text-white/80'}`}>
                    {dialect.title}
                  </h4>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${selectedDialectId === dialect.id ? 'purple-bg text-white rotate-0' : 'bg-white/5 text-white/10 rotate-12'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${selectedDialectId === dialect.id ? 'text-white/70' : 'text-white/30'}`}>
                  {dialect.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Personality */}
        <section className="glass-3d p-12 md:p-16 rounded-[45px] space-y-16">
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-xs font-bold text-[#9333ea] uppercase tracking-[0.4em]">Voice Signature / البصمة الصوتية</h3>
            <div className="flex gap-4">
              {['ذكر', 'أنثى'].map(gender => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-14 py-4 rounded-full border-2 transition-all duration-500 text-sm font-bold shadow-xl ${
                    selectedGender === gender 
                      ? 'border-[#9333ea] bg-[#9333ea]/10 text-white scale-105' 
                      : 'border-white/5 bg-white/5 text-white/30 hover:bg-white/10'
                  }`}
                >
                  {gender === 'ذكر' ? 'Homme / Male' : 'Femme / Female'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-16 border-t border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProfiles.map((profile, idx) => {
                const style = CATEGORY_STYLES[profile.categoryKey as keyof typeof CATEGORY_STYLES];
                const isActive = selectedVoiceName === profile.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedVoiceName(profile.name)}
                    className={`relative overflow-hidden p-6 rounded-[35px] border-2 transition-all duration-700 h-full flex flex-col items-center justify-center gap-5 text-center ${
                      isActive 
                        ? `border-white/20 bg-gradient-to-br ${style.color} ring-8 ring-[#9333ea]/10 shadow-2xl` 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${isActive ? 'bg-white/20 rotate-3 scale-110' : 'bg-white/5'}`}>
                      <CategoryIcon type={style.icon} className={`w-7 h-7 ${isActive ? 'text-white' : 'text-white/20'}`} />
                    </div>
                    <div className="space-y-1">
                      <h5 className={`text-lg font-bold ${isActive ? 'text-white' : 'text-white/70'}`}>{profile.name}</h5>
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${isActive ? 'bg-black/40 text-white' : 'bg-white/5 text-white/20'}`}>
                        {profile.category}
                      </span>
                    </div>
                    <p className={`text-[10px] leading-relaxed line-clamp-2 px-2 ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                      {profile.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Step 4: Controls */}
        <section className="glass-3d p-12 md:p-16 rounded-[45px]">
          <h3 className="text-xs font-bold text-[#9333ea] uppercase tracking-[0.4em] text-center mb-16">3. Studio Controls / غرفة التحكم</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(STUDIO_CONTROLS).map(([key, control]) => (
              <ControlGroup 
                key={key} 
                id={key} 
                title={control.title} 
                options={control.options} 
                current={(voiceControls as any)[key]} 
                onChange={(val) => setVoiceControls(v => ({ ...v, [key]: val }))} 
              />
            ))}
          </div>
        </section>

        {/* Generate Button */}
        <section className="flex justify-center pb-12">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!processedText.trim() && !inputText.trim())}
            className={`w-full max-w-2xl py-10 rounded-full font-bold text-2xl flex items-center justify-center gap-6 transition-all relative overflow-hidden shadow-2xl group ${
              isGenerating || (!processedText.trim() && !inputText.trim()) ? 'bg-white/5 text-white/10 grayscale' : 'purple-bg text-white hover:scale-105 active:scale-95 shadow-[#9333ea]/40'
            }`}
          >
            {isGenerating ? (
              <><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div><span>PRODUCING...</span></>
            ) : (
              <><svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>GENERATE VOICE</>
            )}
          </button>
        </section>

        {/* Result Area */}
        {currentResult && (
          <section className="glass-3d p-12 md:p-16 rounded-[60px] border-[#9333ea]/20 shadow-2xl animate-in zoom-in duration-700">
            <h3 className="text-xs font-bold text-[#9333ea] uppercase tracking-[0.4em] text-center mb-12">Mastering Suite / الإخراج النهائي</h3>
            <div className="w-full flex flex-col items-center gap-14">
              <div className="w-full max-w-4xl p-10 rounded-[50px] bg-white/5 border border-white/10 space-y-10 shadow-3xl relative backdrop-blur-3xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-10">
                  <div>
                    <h4 className="font-bold text-3xl text-white mb-2">{currentResult.selection.dialect}</h4>
                    <p className="text-[10px] text-[#9333ea] font-bold tracking-[0.2em] uppercase">{currentResult.selection.type} — {currentResult.selection.field}</p>
                  </div>
                  <button className="h-16 w-16 rounded-full purple-bg text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg" onClick={togglePlay}>
                    {isPlaying ? (
                      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="h-8 w-8 translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-white/40">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full purple-bg" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                  </div>
                  <span className="text-[10px] text-white/40">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="mt-40 text-center relative z-10">
        <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mb-10"></div>
        <p className="text-xs text-white/20 uppercase tracking-[0.8em] font-light">&copy; 2024 NOUR VOICE</p>
        <p className="text-[9px] text-white/10 mt-2 tracking-widest uppercase">Professional Voice Engine Powered by Gemini AI</p>
      </footer>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default App;
