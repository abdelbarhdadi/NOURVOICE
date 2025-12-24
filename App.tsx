import React, { useState, useRef, useEffect } from 'react';
import { DIALECTS, VOICE_TYPES, getBaseVoiceForType } from './constants';
import { GenerationHistory } from './types';
import { nourService } from './services/geminiService';

// --- Intro Ultra-Light (Plus de calculs inutiles) ---
const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'titles' | 'fadeout'>('titles');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('fadeout'), 2500);
    const t2 = setTimeout(onComplete, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex items-center justify-center transition-opacity duration-500 ${stage === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-center">
        <h2 className="text-4xl font-black text-[#9333ea] tracking-tighter animate-pulse">NOUR VOICE</h2>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(() => sessionStorage.getItem('v4_final') !== 'true');
  const [selectedDialectId, setSelectedDialectId] = useState(DIALECTS[0].id);
  const [selectedGender, setSelectedGender] = useState('ذكر');
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<GenerationHistory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedDialect = DIALECTS.find(d => d.id === selectedDialectId) || DIALECTS[0];
  const filteredProfiles = selectedDialect.profiles.filter(p => p.gender === (selectedGender === 'ذكر' ? 'male' : 'female'));

  // Empêche le rebond élastique et les blocages de scroll
  useEffect(() => {
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.documentElement.style.overscrollBehavior = 'auto';
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    try {
      const activeVoice = filteredProfiles.find(p => p.name === selectedVoiceName) || filteredProfiles[0];
      const baseVoice = getBaseVoiceForType(VOICE_TYPES[0], activeVoice?.gender || 'male');
      const audioUrl = await nourService.generateVoiceOver(inputText, baseVoice, "Professional");
      
      setCurrentResult({
        id: Math.random().toString(),
        text: inputText,
        selection: { dialect: selectedDialect.title, type: 'Standard', field: 'Production', controls: {} as any },
        timestamp: Date.now(),
        audioBlobUrl: audioUrl
      });
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
  };

  return (
    /* L'astuce ici : h-screen + overflow-y-auto sur un div interne */
    <div className="fixed inset-0 bg-white overflow-hidden select-none">
      {showIntro && <CinematicIntro onComplete={() => { setShowIntro(false); sessionStorage.setItem('v4_final', 'true'); }} />}
      
      {/* Ce div gère tout le scroll vertical de manière indépendante */}
      <div className="h-full w-full overflow-y-auto touch-pan-y" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
        <div className="w-full max-w-lg mx-auto px-5 py-10 space-y-8">
          
          <header className="text-center">
            <img src="https://i.postimg.cc/h4YZvfBr/unnamed-8.jpg" alt="Logo" className="h-20 w-20 mx-auto rounded-full mb-4 shadow-sm" />
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">NOUR VOICE</h1>
          </header>

          <main className="space-y-6">
            {/* TEXTAREA - Optimisé focus */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <textarea 
                className="w-full h-32 bg-transparent text-gray-800 text-lg outline-none resize-none"
                placeholder="Votre texte..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {/* DIALECTES - Liste simple sans effets lourds */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase text-center tracking-widest">Dialecte</p>
              {DIALECTS.map(d => (
                <button 
                  key={d.id} 
                  onClick={() => setSelectedDialectId(d.id)}
                  className={`w-full p-4 rounded-xl border flex justify-between items-center transition-colors ${selectedDialectId === d.id ? 'border-[#9333ea] bg-[#9333ea]/5' : 'border-gray-100 bg-white'}`}
                >
                  <div className={`h-3 w-3 rounded-full ${selectedDialectId === d.id ? 'bg-[#9333ea]' : 'bg-gray-200'}`}></div>
                  <span className="font-bold text-sm">{d.title}</span>
                </button>
              ))}
            </div>

            {/* VOIX - Grille stable */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <div className="flex bg-white rounded-full p-1 border border-gray-100">
                {['ذكر', 'أنثى'].map(g => (
                  <button key={g} onClick={() => setSelectedGender(g)} className={`flex-1 py-2 rounded-full text-xs font-bold ${selectedGender === g ? 'bg-[#9333ea] text-white' : 'text-gray-400'}`}>
                    {g === 'ذكر' ? 'Homme' : 'Femme'}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredProfiles.map(p => (
                  <button 
                    key={p.name} 
                    onClick={() => setSelectedVoiceName(p.name)}
                    className={`p-3 rounded-lg border text-[11px] font-bold truncate ${selectedVoiceName === p.name ? 'border-[#9333ea] bg-white text-[#9333ea]' : 'border-transparent bg-white text-gray-400'}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* BOUTON GÉNÉRER */}
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || !inputText}
              className={`w-full py-5 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-transform ${isGenerating ? 'bg-gray-200' : 'bg-[#9333ea]'}`}
            >
              {isGenerating ? 'TRAITEMENT...' : 'GÉNÉRER'}
            </button>

            {/* PLAYER */}
            {currentResult && (
              <div className="bg-gray-900 rounded-2xl p-4 flex items-center gap-4 text-white">
                <button onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()} className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center">
                  {isPlaying ? '||' : '▶'}
                </button>
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                   <div className={`h-full bg-[#9333ea] ${isPlaying ? 'w-full duration-[10s]' : 'w-0'} transition-all`}></div>
                </div>
                <a href={currentResult.audioBlobUrl} download className="text-xs font-bold text-[#9333ea]">DOWNLOAD</a>
              </div>
            )}
          </main>

          <footer className="text-center py-6 opacity-20 text-[8px] font-black tracking-[0.4em]">
            NOUR VOICE LABS
          </footer>
        </div>
        <audio ref={audioRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} className="hidden" />
      </div>
    </div>
  );
};

export default App;