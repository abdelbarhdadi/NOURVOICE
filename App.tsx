
import React, { useState, useRef, useEffect } from 'react';
import { DIALECTS, VOICE_TYPES, VOICE_FIELDS, STUDIO_CONTROLS, CATEGORY_STYLES, getBaseVoiceForType, DialectInfo, VoiceProfile, VoiceField } from './constants';
import { GenerationHistory, VoiceControls } from './types';
import { nourService } from './services/geminiService';

// --- Cinematic Intro Component ---
const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'titles' | 'reveal' | 'fadeout'>('titles');
  const [particles] = useState(() => 
    [...Array(30)].map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 5 + 2,
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
    <div className={`fixed inset-0 z-[100] bg-white overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${stage === 'fadeout' ? 'opacity-0 blur-2xl' : 'opacity-100'}`}>
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
      <div className="relative z-10 text-center scale-up px-4">
        <div className={`${stage === 'titles' ? 'animate-cinematic' : 'opacity-0 transition-opacity duration-1000'}`}>
          <h2 className="tech-logo text-5xl md:text-9xl leading-tight">NOUR VOICE</h2>
          <div className="tech-subtitle text-lg md:text-3xl font-extrabold mt-4">PROFESSIONAL VOICE ENGINE</div>
        </div>
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${stage === 'reveal' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="relative flex flex-col items-center">
            <div className="h-48 w-48 md:h-80 md:w-80 relative">
               <img src="https://i.postimg.cc/h4YZvfBr/unnamed-8.jpg" alt="NOUR VOICE Logo" className="w-full h-full object-contain drop-shadow-2xl animate-pulse rounded-full" />
            </div>
            <div className="mt-8 flex gap-1 h-12 md:h-16 justify-center">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1.5 md:w-2 bg-[#9333ea]/40 rounded-full animate-pulse" 
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
  <div className="absolute -top-10 -left-10 w-32 md:w-48 h-32 md:h-48 opacity-10 pointer-events-none animate-float">
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#9333ea]">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
    </svg>
  </div>
);

const FloatingHeadphones = () => (
  <div className="absolute -bottom-10 -right-10 w-36 md:w-56 h-36 md:h-56 opacity-10 pointer-events-none animate-float-slow">
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#9333ea]">
      <path d="M12 2C6.48 2 2 6.48 2 12v7c0 1.1.9 2 2 2h3v-8H4v-1c0-4.41 3.59-8 8-8s8 3.59 8 8v1h-3v8h3c1.1 0 2-.9 2-2v-7c0-5.52-4.48-10-10-10z"/>
    </svg>
  </div>
);

const CategoryIcon = ({ type, className }: { type: string, className?: string }) => {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
};

const ControlGroup: React.FC<{
  id: string;
  title: string;
  options: { label: string; desc: string }[];
  current: string;
  onChange: (val: string) => void;
}> = ({ id, title, options, current, onChange }) => (
  <div className="space-y-4 md:space-y-6 text-right group">
    <label className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest group-hover:text-[#9333ea] transition-colors">{title}</label>
    <div className="grid grid-cols-1 gap-3 md:gap-4">
      {options.map(opt => (
        <button
          key={opt.label}
          onClick={() => onChange(opt.label)}
          className={`relative p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 text-right transition-all duration-500 overflow-hidden ${
            current === opt.label 
              ? 'border-[#9333ea]/40 bg-[#9333ea]/10 text-gray-900 shadow-lg' 
              : 'border-gray-200 bg-gray-50/50 text-gray-500 hover:bg-gray-100 hover:border-gray-300'
          }`}
        >
          {current === opt.label && <div className="absolute top-0 right-0 w-1 md:w-2 h-full bg-[#9333ea]"></div>}
          <div className="flex justify-between items-center mb-1 md:mb-3 flex-row-reverse">
            <span className={`text-lg md:text-2xl font-bold ${current === opt.label ? 'text-[#9333ea]' : 'text-gray-700'}`}>{opt.label}</span>
          </div>
          <p className="text-xs md:text-base text-gray-600 leading-relaxed line-clamp-2">{opt.desc}</p>
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedDialect = DIALECTS.find(d => d.id === selectedDialectId) || DIALECTS[0];
  const selectedField = VOICE_FIELDS[0];

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
      const refined = await nourService.preprocessText(inputText, {
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
Category: Standard
Voice: ${selectedVoiceName || 'Default'}
Controls: Temp(${voiceControls.temp}), Speed(${voiceControls.speed}), Drama(${voiceControls.drama}), Narration(${voiceControls.narration})
      `;
      const baseVoice = getBaseVoiceForType(selectedType, activeVoice?.gender || 'male');
      const audioUrl = await nourService.generateVoiceOver(textToUse, baseVoice, performanceNote);
      const result: GenerationHistory = {
        id: Math.random().toString(36).substr(2, 9),
        text: textToUse,
        selection: { 
          dialect: selectedDialect.title, type: activeVoice?.category || 'Standard', field: 'Production',
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-12 md:py-32 px-4 md:px-10 font-arabic overflow-x-hidden relative animate-in fade-in duration-1000" dir="ltr">
      
      <div className="bg-light-blob top-[10%] left-[5%]"></div>
      <div className="bg-light-blob bottom-[10%] right-[5%] opacity-40"></div>
      
      <FloatingMic />
      <FloatingHeadphones />

      <header className="mb-16 md:mb-32 text-center relative z-10 group px-2">
        <div className="flex flex-col items-center gap-6 md:gap-10 mb-6 md:mb-10">
          <div className="h-24 w-24 md:h-40 md:w-40 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <img src="https://i.postimg.cc/h4YZvfBr/unnamed-8.jpg" alt="NOUR VOICE Logo" className="w-full h-full object-contain drop-shadow-xl rounded-full" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-9xl font-black purple-text tracking-tighter leading-tight mb-2 md:mb-6">NOUR VOICE</h1>
            <p className="text-gray-600 text-sm md:text-2xl uppercase tracking-[0.2em] md:tracking-[0.5em] font-black">PROFESSIONAL VOICE ENGINE</p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl space-y-16 md:space-y-32 relative z-10">
        
        {/* Step 1: Text Content */}
        <section className="glass-3d p-6 md:p-24 rounded-3xl md:rounded-[60px] space-y-8 md:space-y-16">
          <h3 className="text-lg md:text-3xl font-black text-gray-800 uppercase tracking-widest text-center">1. Script Engineering / هندسة المخطوطة</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-4 md:space-y-8">
              <label className="text-sm md:text-lg font-black text-gray-600 uppercase tracking-widest block pl-2">Input Draft / مسودة النص</label>
              <textarea
                className="w-full h-[250px] md:h-[500px] bg-gray-50/50 border-2 border-gray-200 rounded-3xl md:rounded-[50px] p-6 md:p-12 text-lg md:text-4xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#9333ea]/30 transition-all leading-relaxed resize-none shadow-sm"
                placeholder="Tapez votre texte ici..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                onClick={handlePreprocess}
                disabled={isPreprocessing || !inputText.trim()}
                className="w-full py-6 md:py-10 rounded-2xl md:rounded-[35px] border-2 border-[#9333ea]/20 bg-[#9333ea]/5 text-[#9333ea] text-lg md:text-2xl font-black hover:bg-[#9333ea] hover:text-white transition-all disabled:opacity-20 flex items-center justify-center gap-4 md:gap-8 group shadow-lg"
              >
                {isPreprocessing ? <div className="w-5 h-5 md:w-8 md:h-8 border-4 border-[#9333ea]/20 border-t-[#9333ea] rounded-full animate-spin"></div> : null}
                <span className="tracking-widest">AI REFINEMENT / تحسين ذكي</span>
              </button>
            </div>
            <div className="space-y-4 md:space-y-8">
              <label className="text-sm md:text-lg font-black text-[#9333ea] uppercase tracking-widest block pl-2">Master Script / المخطوطة النهائية</label>
              <textarea
                className="w-full h-[250px] md:h-[500px] bg-purple-50/20 border-2 border-purple-100 rounded-3xl md:rounded-[50px] p-6 md:p-12 text-lg md:text-4xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#9333ea]/40 transition-all leading-relaxed resize-none shadow-sm"
                placeholder="Resultat optimisé..."
                value={processedText}
                onChange={(e) => setProcessedText(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Step 2: Language */}
        <section className="glass-3d p-6 md:p-24 rounded-3xl md:rounded-[60px]">
          <h3 className="text-lg md:text-3xl font-black text-gray-800 uppercase tracking-widest text-center mb-10 md:mb-20">2. Language & Accents / اللغة واللهجات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {DIALECTS.map((dialect) => (
              <button
                key={dialect.id}
                onClick={() => setSelectedDialectId(dialect.id)}
                className={`relative p-6 md:p-12 rounded-[30px] md:rounded-[50px] transition-all duration-500 border-2 group ${
                  selectedDialectId === dialect.id 
                    ? 'border-[#9333ea]/50 bg-[#9333ea]/5 shadow-xl md:scale-[1.03]' 
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-4 md:mb-8 text-center md:text-left">
                  <h4 className={`text-xl md:text-5xl font-black leading-tight ${selectedDialectId === dialect.id ? 'text-[#9333ea]' : 'text-gray-800'}`}>
                    {dialect.title}
                  </h4>
                  <div className={`h-10 w-10 md:h-14 md:w-14 rounded-full flex items-center justify-center transition-all mt-4 md:mt-0 ${selectedDialectId === dialect.id ? 'purple-bg text-white' : 'bg-gray-300 text-gray-500'}`}>
                    <svg className="w-5 h-5 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <p className={`text-sm md:text-lg leading-relaxed font-bold text-center md:text-right ${selectedDialectId === dialect.id ? 'text-gray-700' : 'text-gray-500'}`}>
                  {dialect.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Personality */}
        <section className="glass-3d p-6 md:p-24 rounded-3xl md:rounded-[60px] space-y-12 md:space-y-24">
          <div className="flex flex-col items-center gap-6 md:gap-12">
            <h3 className="text-lg md:text-3xl font-black text-gray-800 uppercase tracking-widest text-center">Voice Archetypes / البصمة الصوتية</h3>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {['ذكر', 'أنثى'].map(gender => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-8 md:px-24 py-4 md:py-8 rounded-full border-2 transition-all duration-500 text-lg md:text-3xl font-black shadow-lg ${
                    selectedGender === gender 
                      ? 'border-[#9333ea] bg-[#9333ea]/5 text-[#9333ea] md:scale-105' 
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {gender === 'ذكر' ? 'Homme / Male' : 'Femme / Female'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-12 md:pt-24 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {filteredProfiles.map((profile, idx) => {
                const style = CATEGORY_STYLES[profile.categoryKey as keyof typeof CATEGORY_STYLES];
                const isActive = selectedVoiceName === profile.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedVoiceName(profile.name)}
                    className={`relative overflow-hidden p-6 md:p-12 rounded-[30px] md:rounded-[60px] border-2 transition-all duration-700 h-full flex flex-col items-center justify-center gap-4 md:gap-10 text-center ${
                      isActive 
                        ? `border-[#9333ea]/40 bg-white ring-8 md:ring-[16px] ring-[#9333ea]/5 shadow-2xl` 
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 shadow-inner ${isActive ? 'bg-[#9333ea]/10 scale-110' : 'bg-gray-200'}`}>
                      <CategoryIcon type={style.icon} className={`w-8 h-8 md:w-12 md:h-12 ${isActive ? 'text-[#9333ea]' : 'text-gray-400'}`} />
                    </div>
                    <div className="space-y-2">
                      <h5 className={`text-xl md:text-4xl font-black ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{profile.name}</h5>
                      <span className={`inline-block px-4 py-1 rounded-full text-xs md:text-base font-black uppercase tracking-wider ${isActive ? 'bg-[#9333ea]/10 text-[#9333ea]' : 'bg-gray-200 text-gray-500'}`}>
                        {profile.category}
                      </span>
                    </div>
                    <p className={`text-xs md:text-lg leading-relaxed line-clamp-2 px-2 font-bold ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                      {profile.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Step 4: Controls */}
        <section className="glass-3d p-6 md:p-24 rounded-3xl md:rounded-[60px]">
          <h3 className="text-lg md:text-3xl font-black text-gray-800 uppercase tracking-widest text-center mb-10 md:mb-24">3. Studio Controls / غرفة التحكم</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
        <section className="flex justify-center pb-12 md:pb-24 px-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!processedText.trim() && !inputText.trim())}
            className={`w-full max-w-4xl py-10 md:py-16 rounded-full font-black text-3xl md:text-6xl flex items-center justify-center gap-6 md:gap-12 transition-all relative overflow-hidden shadow-2xl group ${
              isGenerating || (!processedText.trim() && !inputText.trim()) ? 'bg-gray-200 text-gray-400' : 'purple-bg text-white hover:scale-105 active:scale-95 shadow-purple-500/40'
            }`}
          >
            {isGenerating ? (
              <><div className="w-8 h-8 md:w-16 md:h-16 border-4 md:border-8 border-white/20 border-t-white rounded-full animate-spin"></div><span>PRODUCING...</span></>
            ) : (
              <><svg className="h-10 w-10 md:h-20 md:w-20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>GENERATE VOICE</>
            )}
          </button>
        </section>

        {/* Result Area */}
        {currentResult && (
          <section className="glass-3d p-6 md:p-24 rounded-3xl md:rounded-[80px] border-[#9333ea]/20 shadow-2xl animate-in zoom-in duration-700">
            <h3 className="text-lg md:text-3xl font-black text-gray-800 uppercase tracking-widest text-center mb-10 md:mb-20">Final Master / الإخراج النهائي</h3>
            <div className="w-full flex flex-col items-center gap-10 md:gap-20">
              <div className="w-full max-w-6xl p-8 md:p-20 rounded-3xl md:rounded-[70px] bg-gray-50 border-2 border-gray-200 space-y-8 md:space-y-16 shadow-lg relative">
                <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-gray-100 pb-8 md:pb-16 gap-6 md:gap-0">
                  <div className="text-center md:text-left">
                    <h4 className="font-black text-3xl md:text-7xl text-gray-900 mb-2 md:mb-6">{currentResult.selection.dialect}</h4>
                    <p className="text-sm md:text-lg text-[#9333ea] font-black tracking-widest uppercase">{currentResult.selection.type} — {currentResult.selection.field}</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="h-20 w-20 md:h-32 md:w-32 rounded-full purple-bg text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl" onClick={togglePlay}>
                      {isPlaying ? (
                        <svg className="h-10 w-10 md:h-16 md:w-16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                        <svg className="h-10 w-10 md:h-16 md:w-16 translate-x-1 md:translate-x-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>
                    {/* Download Button */}
                    <a 
                      href={currentResult.audioBlobUrl} 
                      download={`nour-voice-${Date.now()}.wav`}
                      title="Télécharger la voix off"
                      className="h-20 w-20 md:h-32 md:w-32 rounded-full bg-gray-100 text-[#9333ea] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl border-2 border-[#9333ea]/10"
                    >
                      <svg className="h-8 w-8 md:h-14 md:w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-10">
                  <span className="text-sm md:text-2xl text-gray-600 font-mono font-black">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-2 md:h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full purple-bg transition-all duration-300" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                  </div>
                  <span className="text-sm md:text-2xl text-gray-600 font-mono font-black">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="mt-24 md:mt-64 text-center relative z-10 px-4">
        <div className="h-1 w-40 md:w-80 bg-gray-200 mx-auto mb-8 md:mb-16 rounded-full"></div>
        <p className="text-sm md:text-2xl text-gray-600 uppercase tracking-[0.2em] md:tracking-[1em] font-black">&copy; 2026 NOUR VOICE</p>
      </footer>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default App;
