/**
 * ResQMeals AI Voice Assistant
 * - Multilingual (14 languages via Web Speech API)
 * - Domain-locked Q&A with language-aware answers (EN/HI/TA)
 * - Word-level fuzzy matching for robust recognition
 * - Animated avatar, waveform bars, live subtitles
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, PhoneOff, Bot, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { findBestEntry, OFF_TOPIC } from './vaKnowledge';
import { detectNavigation, detectAction, detectFieldFill, dispatchFieldFill, UserRole } from './vaCommands';

// ─────────────────────────────────────────────
//  MYMEMORY TRANSLATION (free, no API key)
// ─────────────────────────────────────────────
const LANG_TO_MM: Record<string, string> = {
  'en-IN': 'en', 'en-US': 'en',
  'hi-IN': 'hi', 'ta-IN': 'ta', 'te-IN': 'te',
  'bn-IN': 'bn', 'mr-IN': 'mr', 'kn-IN': 'kn',
  'ml-IN': 'ml', 'gu-IN': 'gu', 'pa-IN': 'pa',
  'ur-IN': 'ur', 'fr-FR': 'fr', 'es-ES': 'es', 'de-DE': 'de',
};

async function translateText(text: string, targetLangCode: string): Promise<string> {
  const target = LANG_TO_MM[targetLangCode] || targetLangCode.split('-')[0];
  if (!target || target === 'en') return text;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (_) { /* Fallback to English on network error */ }
  return text;
}

const LANGUAGES = [
  { label: 'English', code: 'en-IN' },
  { label: 'हिंदी (Hindi)', code: 'hi-IN' },
  { label: 'தமிழ் (Tamil)', code: 'ta-IN' },
  { label: 'తెలుగు (Telugu)', code: 'te-IN' },
  { label: 'বাংলা (Bengali)', code: 'bn-IN' },
  { label: 'मराठी (Marathi)', code: 'mr-IN' },
  { label: 'ಕನ್ನಡ (Kannada)', code: 'kn-IN' },
  { label: 'മലയാളം (Malayalam)', code: 'ml-IN' },
  { label: 'ગુજરાતી (Gujarati)', code: 'gu-IN' },
  { label: 'ਪੰਜਾਬੀ (Punjabi)', code: 'pa-IN' },
  { label: 'اردو (Urdu)', code: 'ur-IN' },
  { label: 'Français (French)', code: 'fr-FR' },
  { label: 'Español (Spanish)', code: 'es-ES' },
  { label: 'Deutsch (German)', code: 'de-DE' },
];

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking';


// ─────────────────────────────────────────────
//  WAVEFORM BARS
// ─────────────────────────────────────────────
function WaveformBars({ state }: { state: AssistantState }) {
  const bars = Array.from({ length: 40 });
  const colors = {
    speaking: ['#059669','#10b981','#34d399','#6ee7b7','#34d399','#10b981'],
    listening: ['#0284c7','#0ea5e9','#38bdf8','#7dd3fc','#38bdf8','#0ea5e9'],
    processing:['#d97706','#f59e0b','#fbbf24','#f59e0b','#d97706','#d97706'],
    idle:      ['#1e293b','#1e293b','#1e293b','#1e293b','#1e293b','#1e293b'],
  };
  const palette = colors[state] || colors.idle;
  return (
    <div className="flex items-end justify-center gap-[2.5px]" style={{height:48}}>
      {bars.map((_, i) => {
        const isActive = state === 'listening' || state === 'speaking' || state === 'processing';
        const delay = `${(i * 0.045).toFixed(2)}s`;
        const color = palette[i % palette.length];
        return (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              minHeight: 4,
              height: isActive ? undefined : 4,
              background: isActive ? `linear-gradient(to top, ${color}, ${color}80)` : '#1e293b',
              animation: isActive
                ? `va-wave ${0.7 + (i % 4) * 0.15}s ${delay} ease-in-out infinite alternate`
                : 'none',
              transition: 'background 0.5s',
            }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  AVATAR
// ─────────────────────────────────────────────
function Avatar({ state }: { state: AssistantState }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Outer pulse rings */}
      {(state === 'listening' || state === 'speaking') && (
        <>
          <div
            className="absolute rounded-full border-2 opacity-30"
            style={{
              width: 150,
              height: 150,
              borderColor: state === 'speaking' ? '#059669' : '#0ea5e9',
              animation: 'va-ring 1.6s 0s ease-out infinite',
            }}
          />
          <div
            className="absolute rounded-full border-2 opacity-20"
            style={{
              width: 150,
              height: 150,
              borderColor: state === 'speaking' ? '#059669' : '#0ea5e9',
              animation: 'va-ring 1.6s 0.5s ease-out infinite',
            }}
          />
        </>
      )}
      {/* Inner glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 118,
          height: 118,
          background:
            state === 'speaking'
              ? 'radial-gradient(circle, #05966940 0%, transparent 70%)'
              : state === 'listening'
                ? 'radial-gradient(circle, #0ea5e940 0%, transparent 70%)'
                : 'radial-gradient(circle, #ffffff10 0%, transparent 70%)',
          animation: state !== 'idle' ? 'va-breathe 1.8s ease-in-out infinite' : 'none',
        }}
      />
      {/* Avatar circle */}
      <div
        className="relative flex items-center justify-center rounded-full shadow-2xl z-10"
        style={{
          width: 100,
          height: 100,
          background:
            state === 'speaking'
              ? 'linear-gradient(135deg, #059669, #047857)'
              : state === 'listening'
                ? 'linear-gradient(135deg, #0ea5e9, #0369a1)'
                : 'linear-gradient(135deg, #1f2937, #374151)',
          boxShadow:
            state === 'speaking'
              ? '0 0 30px #05966960, 0 8px 32px #00000060'
              : state === 'listening'
                ? '0 0 30px #0ea5e960, 0 8px 32px #00000060'
                : '0 8px 32px #00000060',
          transition: 'all 0.4s ease',
        }}
      >
        <Bot className="w-12 h-12 text-white" strokeWidth={1.5} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function VoiceAssistant() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const pageRole = (user?.role ?? 'ngo') as UserRole;
  const [isOpen, setIsOpen] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [subtitle, setSubtitle] = useState('Tap the mic to ask a question');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const synthRef = useRef(window.speechSynthesis);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load available TTS voices (they load async in browsers)
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Check support
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  // Scroll subtitle into view
  useEffect(() => {
    if (subtitleRef.current) {
      subtitleRef.current.scrollTop = subtitleRef.current.scrollHeight;
    }
  }, [subtitle]);

  // speak(nativeText, englishText)
  // Shows nativeText in subtitle always.
  // Speaks nativeText if a native voice is available, otherwise speaks englishText with English voice.
  const speak = useCallback(
    (nativeText: string, englishText?: string) => {
      const synth = synthRef.current;
      synth.cancel();

      // Find a voice that matches the selected language
      const voices = voicesRef.current;
      const langPrefix = selectedLang.code.split('-')[0].toLowerCase();
      const nativeVoice =
        voices.find(v => v.lang.toLowerCase() === selectedLang.code.toLowerCase()) ||
        voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
        null;

      // Decide what to actually speak aloud
      const hasNativeVoice = !!nativeVoice;
      const textToSpeak = hasNativeVoice ? nativeText : (englishText ?? nativeText);

      const utter = new SpeechSynthesisUtterance(textToSpeak);
      if (hasNativeVoice) {
        utter.voice = nativeVoice;
        utter.lang = selectedLang.code;
      } else {
        // Fallback: use default English voice
        const enVoice = voices.find(v => v.lang.startsWith('en')) || null;
        if (enVoice) utter.voice = enVoice;
        utter.lang = 'en-IN';
      }
      utter.rate = 0.95;
      utter.pitch = 1;

      setAssistantState('speaking');
      // Always show native text in subtitle so user can read it
      setSubtitle(nativeText);

      utter.onend = () => {
        setAssistantState('idle');
        setSubtitle('Tap the mic to ask another question');
        setIsMicOn(false);
      };
      utter.onerror = () => {
        setAssistantState('idle');
        setIsMicOn(false);
      };
      synth.speak(utter);
    },
    [selectedLang.code]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) { /* noop */ }
      recognitionRef.current = null;
    }
    setIsMicOn(false);
    setAssistantState('idle');
  }, []);

  const startListening = useCallback(() => {
    if (!supported) {
      setSubtitle('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    synthRef.current.cancel();

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = selectedLang.code;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    setAssistantState('listening');
    setIsMicOn(true);
    transcriptRef.current = '';
    setSubtitle('Listening…');

    recognition.onresult = (e: any) => {
      const interim = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join('');
      transcriptRef.current = interim;
      setSubtitle(interim);
    };

    recognition.onend = () => {
      const final = transcriptRef.current || '';
      if (final.trim().length > 0) {
        setAssistantState('processing');
        setSubtitle('Processing…');

        // ── 1. Navigation commands ──────────────────────────────────
        const navRoute = detectNavigation(final, pageRole);
        if (navRoute) {
          const msg = `Navigating to ${navRoute.replace(/\//g, ' ').trim()}`;
          speak(msg, msg);
          setTimeout(() => navigate(navRoute), 1200);
          return;
        }

        // ── 2. Action commands ──────────────────────────────────────
        const actionKey = detectAction(final, pageRole);
        if (actionKey) {
          if (actionKey === 'go-back') {
            speak('Going back.', 'Going back.');
            setTimeout(() => navigate(-1 as any), 1000);
          } else if (actionKey === 'logout') {
            speak('Logging you out. Goodbye!', 'Logging you out. Goodbye!');
            setTimeout(() => { logout(); navigate('/login'); }, 1400);
          } else {
            // Extract item name from query for specific-item actions
            // e.g. "track donation rice and curry" -> itemName = "rice and curry"
            const itemNameMatch = final.match(
              /(?:track|delete|remove|edit|modify)\s+(?:donation|item)?\s+(.{3,})/i
            );
            const itemName = itemNameMatch ? itemNameMatch[1].trim().toLowerCase() : undefined;

            // Actions that open their own dialog should close VA modal first
            const dialogActions = ['track-latest', 'track-item'];
            if (dialogActions.includes(actionKey)) {
              setIsOpen(false);
            }

            // Dispatch with optional itemName
            window.dispatchEvent(new CustomEvent('va-action', {
              detail: { key: actionKey, itemName },
            }));

            const actionMessages: Record<string, string> = {
              'submit-form':      'Submitting the form now.',
              'get-location':     'Getting your current location.',
              'claim-first':      'Claiming the top donation.',
              'complete-task':    'Marking task as completed.',
              'set-veg':          'Food type set to vegetarian.',
              'set-nonveg':       'Food type set to non-vegetarian.',
              'set-vegan':        'Food type set to vegan.',
              'track-latest':     'Opening the tracking timeline.',
              'delete-latest':    'Deleting the latest available donation.',
              'edit-latest':      'Opening edit for the latest donation.',
              'filter-available': 'Showing available donations.',
              'filter-reserved':  'Showing reserved donations.',
              'filter-collected': 'Showing collected donations.',
              'filter-all':       'Showing all donations.',
              'refresh-list':     'Refreshing your donations list.',
              'accept-task':      'Accepting the task.',
              'decline-task':     'Declining the task.',
              'mark-picked':      'Marking task as picked up.',
              'mark-delivered':   'Marking task as delivered.',
              'show-map':         'Switching to map view.',
              'show-list':        'Switching to list view.',
              'impact-report':    'Opening impact report.',
              'ngo-filter-all':   'Showing all collections.',
              'ngo-filter-collected': 'Showing collected items.',
              'ngo-filter-reserved':  'Showing reserved items.',
              'filter-active':    'Showing active tasks.',
              'filter-completed': 'Showing completed tasks.',
            };
            const msg = actionMessages[actionKey] ?? 'Done!';
            speak(msg, msg);
          }
          return;
        }

        // ── 2.5. Field fill ("food name is X", "quantity 50 plates", etc.) ────
        const fieldFill = detectFieldFill(final);
        if (fieldFill) {
          dispatchFieldFill(fieldFill);
          const fieldLabels: Record<string, string> = {
            title:     `Food name set to: ${fieldFill.value}`,
            quantity:  `Quantity set to: ${fieldFill.value}`,
            unit:      `Unit set to: ${fieldFill.value}`,
            address:   `Address set to: ${fieldFill.value}`,
            preparedAt:`Prepared time set.`,
            foodType:  `Food type set to: ${fieldFill.value}`,
          };
          const msg = fieldLabels[fieldFill.field] ?? 'Field updated!';
          speak(msg, msg);
          return;
        }

        // ── 3. Q&A + translation ────────────────────────────────────
        setSubtitle('Translating…');
        const entry = findBestEntry(final);
        const englishAnswer = entry ? entry.en : OFF_TOPIC['en-IN'];

        if (selectedLang.code.startsWith('en')) {
          setTimeout(() => speak(englishAnswer, englishAnswer), 300);
          return;
        }

        translateText(englishAnswer, selectedLang.code).then((translated) => {
          speak(translated, englishAnswer);
        }).catch(() => {
          speak(englishAnswer, englishAnswer);
        });
      } else {
        setAssistantState('idle');
        setSubtitle('No speech detected. Tap mic to try again.');
        setIsMicOn(false);
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'no-speech') {
        setSubtitle('No speech detected. Tap the mic to try again.');
      } else if (e.error === 'not-allowed') {
        setSubtitle('Microphone access was denied. Please allow mic access in browser settings.');
      } else {
        setSubtitle(`Error: ${e.error}. Please try again.`);
      }
      setAssistantState('idle');
      setIsMicOn(false);
    };

    recognition.start();
  }, [supported, selectedLang.code, speak]);

  const handleMicToggle = () => {
    if (isMicOn) {
      stopListening();
      setSubtitle('Mic off. Tap to start again.');
    } else {
      startListening();
    }
  };

  const handleClose = () => {
    stopListening();
    synthRef.current.cancel();
    setIsOpen(false);
    setAssistantState('idle');
    setSubtitle('Tap the mic to ask a question');
    transcriptRef.current = '';
    setIsMicOn(false);
  };

  const statusLabel =
    assistantState === 'listening'
      ? 'Listening…'
      : assistantState === 'speaking'
        ? 'Speaking…'
        : assistantState === 'processing'
          ? 'Processing…'
          : 'Ready';

  return (
    <>
      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes va-ring {
          0%   { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        @keyframes va-breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.12); }
        }
        @keyframes va-wave {
          0%   { height: 4px; }
          100% { height: 34px; }
        }
        @keyframes va-fab-pulse {
          0%, 100% { box-shadow: 0 0 0 0 #05966940, 0 4px 20px #05966960; }
          50%       { box-shadow: 0 0 0 14px #05966900, 0 4px 24px #05966980; }
        }
        @keyframes va-modal-in {
          from { opacity: 0; transform: translateY(32px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes va-orb1 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33%     { transform: translate(30px, -20px) scale(1.1); }
          66%     { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes va-orb2 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33%     { transform: translate(-25px, 20px) scale(1.08); }
          66%     { transform: translate(20px, -15px) scale(0.92); }
        }
        @keyframes va-orb3 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          50%     { transform: translate(15px, 25px) scale(1.15); }
        }
        @keyframes va-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes va-rotate-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes va-shimmer {
          0%,100% { border-color: rgba(255,255,255,0.07); }
          50%     { border-color: rgba(52,211,153,0.35); }
        }
        @keyframes va-shimmer-blue {
          0%,100% { border-color: rgba(255,255,255,0.07); }
          50%     { border-color: rgba(56,189,248,0.35); }
        }
        @keyframes va-dot-pop {
          0%,100% { transform: scale(1); opacity:0.4; }
          50%     { transform: scale(1.8); opacity:1; }
        }
        .va-fab-btn:hover .va-fab-label { opacity:1; transform:translateX(0); }
        .va-fab-label { opacity:0; transform:translateX(8px); transition: all 0.25s; }
      `}</style>

      {/* ── Floating Action Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Ask ResQMeals AI Assistant"
          className="va-fab-btn fixed bottom-6 right-6 z-50 flex items-center gap-2 pr-4 pl-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            height: 52,
            background: 'linear-gradient(135deg, #059669, #047857)',
            animation: 'va-fab-pulse 2.4s ease-in-out infinite',
          }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="va-fab-label text-white text-xs font-bold tracking-wide">Ask AI</span>
        </button>
      )}

      {/* ── Modal Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
        {/* Modal Panel */}
          <div
            className="relative flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            style={{
              width: '100%',
              maxWidth: 420,
              background: 'linear-gradient(180deg, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)',
              animation: 'va-modal-in 0.38s cubic-bezier(0.34,1.56,0.64,1) both',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{zIndex:0}}>
              <div style={{
                position:'absolute', width:220, height:220, borderRadius:'50%', top:-60, left:-60,
                background: assistantState==='speaking'
                  ? 'radial-gradient(circle, #05966930, transparent 70%)'
                  : assistantState==='listening'
                  ? 'radial-gradient(circle, #0ea5e930, transparent 70%)'
                  : 'radial-gradient(circle, #1e293b40, transparent 70%)',
                animation:'va-orb1 8s ease-in-out infinite',
                transition:'background 0.8s ease',
              }}/>
              <div style={{
                position:'absolute', width:180, height:180, borderRadius:'50%', bottom:-40, right:-40,
                background: assistantState==='speaking'
                  ? 'radial-gradient(circle, #34d39928, transparent 70%)'
                  : assistantState==='listening'
                  ? 'radial-gradient(circle, #7dd3fc28, transparent 70%)'
                  : 'radial-gradient(circle, #1e293b30, transparent 70%)',
                animation:'va-orb2 10s ease-in-out infinite',
                transition:'background 0.8s ease',
              }}/>
              <div style={{
                position:'absolute', width:140, height:140, borderRadius:'50%', top:'40%', right:-20,
                background: assistantState==='speaking'
                  ? 'radial-gradient(circle, #059669, transparent 70%)'
                  : 'radial-gradient(circle, #0ea5e918, transparent 70%)',
                animation:'va-orb3 12s ease-in-out infinite',
                transition:'background 0.8s ease',
              }}/>
            </div>
            {/* ── Header (with aurora stripe) ── */}
            <div style={{position:'relative', zIndex:1}}>
              {/* Aurora top stripe */}
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:3,
                background: assistantState==='speaking'
                  ? 'linear-gradient(90deg,#059669,#34d399,#059669)'
                  : assistantState==='listening'
                  ? 'linear-gradient(90deg,#0ea5e9,#38bdf8,#0ea5e9)'
                  : 'linear-gradient(90deg,#334155,#475569,#334155)',
                transition:'background 0.8s',
                animation:'va-aurora 3s ease-in-out infinite',
              }}/>
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow:'0 4px 14px #05966950' }}>
                    <Bot className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base leading-tight tracking-tight">ResQMeals AI</p>
                    <p style={{color:'#34d399', fontSize:10, fontWeight:600, letterSpacing:'0.08em'}}>VOICE ASSISTANT</p>
                  </div>
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest"
                    style={{ background: 'linear-gradient(135deg,#05966920,#34d39920)', border:'1px solid #34d39940', color:'#34d399' }}>
                    LIVE
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-px mx-5" style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)'}}/>
            </div>

            {/* ── Language Selector ── */}
            <div className="px-5 pt-3 relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                🌐 {selectedLang.label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {langOpen && (
                <div
                  className="absolute left-5 top-10 z-20 rounded-xl overflow-hidden shadow-2xl"
                  style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', minWidth: 200, maxHeight: 240, overflowY: 'auto' }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/10"
                      style={{ color: selectedLang.code === lang.code ? '#34d399' : '#cbd5e1' }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          {/* ── Avatar ── */}
            <div className="flex flex-col items-center pt-4 pb-2" style={{position:'relative',zIndex:1}}>
              {/* Rotating ring (only during listening/speaking) */}
              {(assistantState==='listening'||assistantState==='speaking') && (
                <div style={{
                  position:'absolute',
                  width:164, height:164,
                  borderRadius:'50%',
                  top:14,
                  border: `2px dashed ${assistantState==='speaking'?'#059669':'#0ea5e9'}40`,
                  animation:'va-rotate 8s linear infinite',
                }}/>
              )}
              {(assistantState==='listening'||assistantState==='speaking') && (
                <div style={{
                  position:'absolute',
                  width:148, height:148,
                  borderRadius:'50%',
                  top:22,
                  border: `1px solid ${assistantState==='speaking'?'#34d399':'#38bdf8'}30`,
                  animation:'va-rotate-rev 5s linear infinite',
                }}/>
              )}
              <Avatar state={assistantState} />
              {/* Status label */}
              <div className="mt-3 flex items-center gap-1.5">
                {assistantState!=='idle' && (
                  <span style={{
                    width:6, height:6, borderRadius:'50%',
                    background: assistantState==='speaking'?'#34d399':assistantState==='listening'?'#38bdf8':'#f59e0b',
                    animation:'va-dot-pop 1s ease-in-out infinite',
                    display:'inline-block',
                  }}/>
                )}
                <p className="text-sm font-semibold"
                  style={{ color: assistantState==='speaking'?'#34d399':assistantState==='listening'?'#38bdf8':assistantState==='processing'?'#f59e0b':'#64748b' }}>
                  {statusLabel}
                </p>
              </div>
            </div>

            {/* ── Subtitle ── */}
            <div
              ref={subtitleRef}
              className="mx-5 mb-4 px-4 py-3 rounded-xl text-sm font-medium leading-relaxed text-center overflow-y-auto"
              style={{
                minHeight: 68,
                maxHeight: 96,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid transparent',
                animation: assistantState==='speaking'
                  ? 'va-shimmer 1.5s ease-in-out infinite'
                  : assistantState==='listening'
                  ? 'va-shimmer-blue 1.5s ease-in-out infinite'
                  : 'none',
                borderColor: 'rgba(255,255,255,0.07)',
                color: assistantState==='speaking'?'#e2e8f0':assistantState==='listening'?'#7dd3fc':'#94a3b8',
                position:'relative', zIndex:1,
              }}
            >
              {subtitle}
            </div>

            {/* ── Waveform ── */}
            <div className="px-5 mb-5">
              <WaveformBars state={assistantState} />
            </div>

            {/* ── Controls ── */}
            <div className="flex items-center justify-center gap-5 pb-8">
              {/* Mic button */}
              <button
                onClick={handleMicToggle}
                disabled={assistantState === 'processing' || assistantState === 'speaking'}
                className="flex items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  width: 64,
                  height: 64,
                  background: isMicOn
                    ? 'linear-gradient(135deg,#0ea5e9,#0369a1)'
                    : 'rgba(255,255,255,0.12)',
                  boxShadow: isMicOn ? '0 0 24px #0ea5e960' : 'none',
                  border: '2px solid rgba(255,255,255,0.12)',
                }}
              >
                {isMicOn
                  ? <Mic className="w-7 h-7 text-white" strokeWidth={2} />
                  : <MicOff className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
                }
              </button>

              {/* End / hang-up */}
              <button
                onClick={handleClose}
                className="flex items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                  boxShadow: '0 0 20px #ef444440',
                  border: '2px solid rgba(255,255,255,0.12)',
                }}
              >
                <PhoneOff className="w-7 h-7 text-white" strokeWidth={2} />
              </button>
            </div>

            {/* ── Browser support warning ── */}
            {!supported && (
              <p className="text-center text-xs text-red-400 pb-4 px-5">
                ⚠️ Your browser doesn't support Speech Recognition. Please use Chrome or Edge.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
