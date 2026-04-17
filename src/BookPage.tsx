import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import {
  ArrowLeft, ArrowRight, MapPin, Camera, Route,
  CreditCard, Check, ChevronLeft, ChevronRight,
  Shield, Globe, Package, BookOpen, Type, Image,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Demo data — substituir pelos dados reais do Supabase após login SSO
// ---------------------------------------------------------------------------
const DEMO_USER = {
  name: 'Anderson',
  route: 'Caminho Francês',
  startDate: '01 Mar 2026',
  endDate: '02 Abr 2026',
  days: 33,
  km: 765,
  stamps: 28,
  photos: 147,
  allPhotos: [
    '/img-apoio/card1-St-Jean-Pied-de-Port.webp',
    '/img-apoio/card2-porto.webp',
    '/img-apoio/card3-Porto-litoral.webp',
    '/img-apoio/card5-norte.webp',
    '/img-apoio/card6-ferrol.webp',
    '/img-apoio/card7-via-de-la-plata.webp',
    '/img-apoio/card8-granja-de-moreruela.webp',
    '/img-apoio/card9-viseu.webp',
    '/img-apoio/card10-caminho-portugues-lisboa.webp',
    '/img-apoio/card11-caminho-aragones.webp',
    '/img-apoio/card12-caminho-de-inverno.webp',
  ],
};

interface BookData {
  title: string;
  coverPhoto: string;
  openingPhrase: string;
  reflectionText: string;
  selectedPhotos: string[];
}

const DEFAULT_BOOK_DATA: BookData = {
  title: `${DEMO_USER.route}, ${new Date().getFullYear()}`,
  coverPhoto: DEMO_USER.allPhotos[0],
  openingPhrase: 'Comecei sem saber o que encontraria. Terminei diferente do que era.',
  reflectionText: 'Cada passo foi uma escolha. Cada noite foi um presente. O Caminho me ensinou que o destino não é Santiago — é quem você se torna ao longo dele.',
  selectedPhotos: DEMO_USER.allPhotos.slice(0, 8),
};

type Step = 'reveal' | 'customize' | 'order';
type CustomizeTab = 'cover' | 'texts' | 'photos';

// ---------------------------------------------------------------------------
// Hook de contagem animada
// ---------------------------------------------------------------------------
function useCountUp(target: number, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return value;
}

// ---------------------------------------------------------------------------
// BookPage root
// ---------------------------------------------------------------------------
export default function BookPage() {
  const [step, setStep] = useState<Step>('reveal');
  const [bookData, setBookData] = useState<BookData>(DEFAULT_BOOK_DATA);

  const update = (patch: Partial<BookData>) =>
    setBookData(prev => ({ ...prev, ...patch }));

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1B2616]/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-[#E8E4D9]/50 hover:text-[#E8E4D9] transition-colors text-sm">
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Voltar ao site</span>
        </a>
        <span className="font-serif text-[#E8E4D9] italic text-lg tracking-tight">Peregrino</span>
        <div className="text-right">
          <span className="text-[#E8E4D9]/40 text-xs uppercase tracking-widest hidden sm:block">Coffee Table Book</span>
          <span className="text-[#E8E4D9] text-sm font-semibold">€49</span>
        </div>
      </header>

      <div className="fixed top-[60px] left-0 right-0 z-40 bg-[#1B2616]/80 backdrop-blur-sm border-b border-[#E8E4D9]/5">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          {(['reveal', 'customize', 'order'] as Step[]).map((s, i) => {
            const labels = ['Seu livro', 'Personalizar', 'Finalizar'];
            const current = ['reveal', 'customize', 'order'].indexOf(step);
            const done = i < current;
            const active = i === current;
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                    done   ? 'bg-[#E8E4D9] text-[#1B2616]' :
                    active ? 'bg-[#E8E4D9]/20 border border-[#E8E4D9]/60 text-[#E8E4D9]' :
                             'bg-[#E8E4D9]/10 text-[#E8E4D9]/30'
                  }`}>
                    {done ? <Check size={10} /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block transition-colors ${
                    active ? 'text-[#E8E4D9]' : done ? 'text-[#E8E4D9]/60' : 'text-[#E8E4D9]/25'
                  }`}>{labels[i]}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-px transition-colors ${done ? 'bg-[#E8E4D9]/40' : 'bg-[#E8E4D9]/10'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="pt-[108px]">
        <AnimatePresence mode="wait">
          {step === 'reveal'    && <StepReveal    key="r" bookData={bookData} onNext={() => setStep('customize')} />}
          {step === 'customize' && <StepCustomize key="c" bookData={bookData} onChange={update} onNext={() => setStep('order')} onBack={() => setStep('reveal')} />}
          {step === 'order'     && <StepOrder     key="o" bookData={bookData} onBack={() => setStep('customize')} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FlipPage — wrapper obrigatório para cada página do HTMLFlipBook
// ---------------------------------------------------------------------------
const FlipPage = React.forwardRef<HTMLDivElement, { children?: React.ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} className={`overflow-hidden ${className}`} style={{ background: '#FDFCF8' }}>
      {children}
    </div>
  )
);
FlipPage.displayName = 'FlipPage';

// ---------------------------------------------------------------------------
// Helpers de escala para o livro
// ---------------------------------------------------------------------------
function useBookSize() {
  const [size, setSize] = useState({ w: 280, h: 373 });
  useEffect(() => {
    const upd = () => {
      const vw = window.innerWidth;
      if (vw < 640)       setSize({ w: 150, h: 200 });
      else if (vw < 1024) setSize({ w: 215, h: 287 });
      else                setSize({ w: 280, h: 373 });
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);
  return size;
}

// ---------------------------------------------------------------------------
// Livro interativo — 14 páginas com layouts variados
// ---------------------------------------------------------------------------
function InteractiveBook({ bookData }: { bookData: BookData }) {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [hasFlipped, setHasFlipped] = useState(false);
  const { w, h } = useBookSize();
  const TOTAL = 14;

  const goNext = () => bookRef.current?.pageFlip().flipNext();
  const goPrev = () => bookRef.current?.pageFlip().flipPrev();

  // Escala relativa ao tamanho desktop (280px)
  const S = w / 280;
  const fs = (base: number) => `${base * S}rem`;
  const sp = (base: number) => `${base * S}px`;

  // Distribui fotos selecionadas ciclicamente pelos slots
  const ph = bookData.selectedPhotos;
  const p = (i: number) => ph[i % ph.length];

  return (
    <div className="flex flex-col items-center gap-5">
      <AnimatePresence>
        {!hasFlipped && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-2 text-[#E8E4D9]/35 text-xs uppercase tracking-widest"
          >
            <motion.span animate={{ x: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>←</motion.span>
            <span>Clique para folhear</span>
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.65)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef}
          width={w} height={h}
          size="fixed"
          minWidth={w} maxWidth={w} minHeight={h} maxHeight={h}
          drawShadow={true} flippingTime={700} usePortrait={false}
          startZIndex={10} autoSize={false} clickEventForward={true}
          useMouseEvents={true} swipeDistance={30} showPageCorners={true}
          disableFlipByClick={false} style={{}} className="" startPage={0}
          onFlip={(e: any) => { setPage(e.data); if (e.data > 0) setHasFlipped(true); }}
        >

          {/* ── 0 · CAPA ── */}
          <FlipPage>
            <div className="w-full h-full relative">
              <img src={bookData.coverPhoto} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.25) 100%)' }} />
              <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: sp(16) }}>
                <span className="self-end text-white/50 uppercase tracking-widest" style={{ fontSize: fs(0.55) }}>Peregrino</span>
                <div>
                  <div className="w-6 bg-white/30 mb-2" style={{ height: '1px' }} />
                  <p className="font-serif italic text-white leading-tight" style={{ fontSize: fs(1.05) }}>{bookData.title}</p>
                  <p className="text-white/50 uppercase tracking-wider mt-1" style={{ fontSize: fs(0.6) }}>{DEMO_USER.name}</p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)' }} />
            </div>
          </FlipPage>

          {/* ── 1 · FRASE DE ABERTURA ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col justify-center items-center text-center bg-[#FDFCF8]" style={{ padding: sp(20) }}>
              <div className="w-8 bg-[#2D3A27]/15 mb-4" style={{ height: '1px' }} />
              <p className="text-[#2D3A27]/25 uppercase tracking-[0.3em]" style={{ fontSize: fs(0.52) }}>Peregrino</p>
              <p className="font-serif italic text-[#2D3A27] leading-snug mt-3 mb-4" style={{ fontSize: fs(0.88) }}>
                "{bookData.openingPhrase}"
              </p>
              <div className="w-6 bg-[#2D3A27]/15 mb-3" style={{ height: '1px' }} />
              <p className="text-[#2D3A27]/40" style={{ fontSize: fs(0.58) }}>{DEMO_USER.name}</p>
              <p className="text-[#2D3A27]/30 mt-1" style={{ fontSize: fs(0.52) }}>{DEMO_USER.startDate} — {DEMO_USER.endDate}</p>
            </div>
          </FlipPage>

          {/* ── 2 · JORNADA (stats) ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col justify-center bg-[#2D3A27]" style={{ padding: sp(18) }}>
              <p className="text-[#E8E4D9]/30 uppercase tracking-[0.25em] text-center mb-3" style={{ fontSize: fs(0.5) }}>Sua jornada</p>
              <p className="font-serif italic text-[#E8E4D9] text-center mb-4 leading-tight" style={{ fontSize: fs(0.85) }}>{DEMO_USER.route}</p>
              <div className="flex flex-col gap-2">
                {[
                  ['Partida', DEMO_USER.startDate],
                  ['Chegada', DEMO_USER.endDate],
                  ['Distância', `${DEMO_USER.km} km`],
                  ['Duração', `${DEMO_USER.days} dias`],
                  ['Carimbos', `${DEMO_USER.stamps}`],
                  ['Fotos', `${DEMO_USER.photos}`],
                ].map(([k, v], i) => (
                  <div key={i} className="flex justify-between items-center" style={{ borderBottom: '1px solid rgba(232,228,217,0.1)', paddingBottom: sp(6) }}>
                    <span className="text-[#E8E4D9]/40" style={{ fontSize: fs(0.58) }}>{k}</span>
                    <span className="text-[#E8E4D9] font-medium" style={{ fontSize: fs(0.58) }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </FlipPage>

          {/* ── 3 · FOTO STATEMENT (grande + legenda) ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col bg-[#FDFCF8]">
              <div className="relative flex-1" style={{ flex: '0 0 82%' }}>
                <img src={p(0)} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.25) 100%)' }} />
              </div>
              <div className="flex items-center justify-between bg-[#FDFCF8]" style={{ padding: `${sp(8)} ${sp(12)}`, flex: '0 0 18%' }}>
                <p className="font-serif italic text-[#2D3A27]" style={{ fontSize: fs(0.62) }}>{DEMO_USER.route}</p>
                <p className="text-[#2D3A27]/35" style={{ fontSize: fs(0.52) }}>01</p>
              </div>
            </div>
          </FlipPage>

          {/* ── 4 · FOTO EDITORIAL (moldura branca) ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDFCF8]" style={{ padding: sp(14) }}>
              <div className="w-full overflow-hidden" style={{ flex: '0 0 75%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <img src={p(1)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="w-full flex justify-between items-end mt-2" style={{ padding: `0 ${sp(2)}` }}>
                <p className="font-serif italic text-[#2D3A27]/60" style={{ fontSize: fs(0.58) }}>{DEMO_USER.name}</p>
                <p className="text-[#2D3A27]/30" style={{ fontSize: fs(0.5) }}>02</p>
              </div>
            </div>
          </FlipPage>

          {/* ── 5 · COLAGEM DUPLA (2 fotos empilhadas) ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col bg-white" style={{ gap: sp(3), padding: sp(3) }}>
              <div className="overflow-hidden rounded-sm" style={{ flex: '0 0 58%' }}>
                <img src={p(2)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="overflow-hidden rounded-sm" style={{ flex: '0 0 38%' }}>
                <img src={p(3)} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </FlipPage>

          {/* ── 6 · GRADE 3 FOTOS (1 coluna + 2 coluna) ── */}
          <FlipPage>
            <div className="w-full h-full flex bg-white" style={{ gap: sp(3), padding: sp(3) }}>
              <div className="overflow-hidden rounded-sm" style={{ flex: '0 0 58%' }}>
                <img src={p(4)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col" style={{ flex: 1, gap: sp(3) }}>
                <div className="overflow-hidden rounded-sm" style={{ flex: 1 }}>
                  <img src={p(5)} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="overflow-hidden rounded-sm" style={{ flex: 1 }}>
                  <img src={p(6)} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>
          </FlipPage>

          {/* ── 7 · CITAÇÃO / FRASE INTERMEDIÁRIA ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col justify-center items-center text-center bg-[#F5F2EA]" style={{ padding: sp(22) }}>
              <p className="text-[#2D3A27]/20 uppercase tracking-[0.3em] mb-4" style={{ fontSize: fs(0.48) }}>— {DEMO_USER.days} dias —</p>
              <p className="font-serif italic text-[#2D3A27] leading-relaxed" style={{ fontSize: fs(0.95) }}>
                "O Caminho<br />começa onde<br />o asfalto termina."
              </p>
              <div className="mt-5 bg-[#2D3A27]/15" style={{ width: sp(24), height: '1px' }} />
              <p className="text-[#2D3A27]/35 mt-3" style={{ fontSize: fs(0.52) }}>{DEMO_USER.route}</p>
            </div>
          </FlipPage>

          {/* ── 8 · FOTO PAISAGEM full bleed ── */}
          <FlipPage>
            <div className="w-full h-full relative">
              <img src={p(7 % ph.length)} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 40%)' }} />
              <p className="absolute bottom-0 right-0 text-white/50 uppercase tracking-widest" style={{ fontSize: fs(0.5), padding: sp(10) }}>
                {DEMO_USER.route} · {DEMO_USER.days} dias
              </p>
            </div>
          </FlipPage>

          {/* ── 9 · REFLEXÃO PESSOAL ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col justify-center bg-[#FDFCF8]" style={{ padding: sp(20) }}>
              <p className="text-[#2D3A27]/25 uppercase tracking-[0.25em] mb-4" style={{ fontSize: fs(0.48) }}>Reflexão</p>
              <div className="bg-[#2D3A27]/10 mb-4" style={{ height: '1px', width: sp(32) }} />
              <p className="font-serif italic text-[#2D3A27] leading-relaxed" style={{ fontSize: fs(0.72) }}>
                "{bookData.reflectionText}"
              </p>
              <div className="bg-[#2D3A27]/10 mt-4" style={{ height: '1px', width: sp(32) }} />
              <p className="text-[#2D3A27]/35 mt-3" style={{ fontSize: fs(0.52) }}>{DEMO_USER.name}</p>
            </div>
          </FlipPage>

          {/* ── 10 · MOSAICO 2×2 ── */}
          <FlipPage>
            <div className="w-full h-full grid bg-white" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: sp(3), padding: sp(3) }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="overflow-hidden rounded-sm">
                  <img src={p(i)} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </FlipPage>

          {/* ── 11 · FOTO COM MOLDURA (estilo galeria) ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDFCF8]" style={{ padding: sp(12) }}>
              <div className="w-full h-full relative overflow-hidden" style={{
                border: `${sp(6)} solid #FDFCF8`,
                boxShadow: 'inset 0 0 0 1px rgba(45,58,39,0.08), 0 8px 30px rgba(0,0,0,0.12)',
              }}>
                <img src={p(4 % ph.length)} className="w-full h-full object-cover" alt="" />
              </div>
              <p className="text-[#2D3A27]/35 italic mt-2 text-center" style={{ fontSize: fs(0.55) }}>
                {DEMO_USER.route}, {new Date().getFullYear()}
              </p>
            </div>
          </FlipPage>

          {/* ── 12 · GRADE ASSIMÉTRICA (foto grande + 2 pequenas) ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col bg-white" style={{ gap: sp(3), padding: sp(3) }}>
              <div className="overflow-hidden rounded-sm" style={{ flex: '0 0 55%' }}>
                <img src={p(5 % ph.length)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex" style={{ flex: 1, gap: sp(3) }}>
                <div className="overflow-hidden rounded-sm flex-1">
                  <img src={p(6 % ph.length)} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="overflow-hidden rounded-sm flex-1">
                  <img src={p(7 % ph.length)} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>
          </FlipPage>

          {/* ── 13 · CONTRACAPA ── */}
          <FlipPage>
            <div className="w-full h-full flex flex-col justify-center items-center text-center bg-[#1B2616]" style={{ padding: sp(20) }}>
              <p className="font-serif italic text-[#E8E4D9]/55 mb-3" style={{ fontSize: fs(1.2) }}>Ultreia</p>
              <p className="font-serif italic text-[#E8E4D9]/35" style={{ fontSize: fs(0.75) }}>et Suseia</p>
              <div className="bg-[#E8E4D9]/15 my-4" style={{ width: sp(28), height: '1px' }} />
              <p className="text-[#E8E4D9]/25 uppercase tracking-widest" style={{ fontSize: fs(0.48) }}>{DEMO_USER.route}</p>
              <p className="text-[#E8E4D9]/20 mt-1" style={{ fontSize: fs(0.48) }}>{DEMO_USER.km} km · {DEMO_USER.days} dias</p>
              <p className="text-[#E8E4D9]/15 mt-5" style={{ fontSize: fs(0.45) }}>peregrino.app</p>
            </div>
          </FlipPage>

        </HTMLFlipBook>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-6">
        <button onClick={goPrev} disabled={page === 0}
          className="w-10 h-10 rounded-full bg-[#E8E4D9]/10 flex items-center justify-center hover:bg-[#E8E4D9]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} className="text-[#E8E4D9]" />
        </button>
        <span className="text-[#E8E4D9]/30 text-xs tabular-nums min-w-[4rem] text-center">
          {page === 0 ? 'Capa' : page === TOTAL - 1 ? 'Contracapa' : `${page} / ${TOTAL - 2}`}
        </span>
        <button onClick={goNext} disabled={page >= TOTAL - 1}
          className="w-10 h-10 rounded-full bg-[#E8E4D9]/10 flex items-center justify-center hover:bg-[#E8E4D9]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} className="text-[#E8E4D9]" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Revelação
// ---------------------------------------------------------------------------
function StepReveal({ bookData, onNext }: { bookData: BookData; onNext: () => void }) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const animKm     = useCountUp(DEMO_USER.km,     1200, statsVisible);
  const animDays   = useCountUp(DEMO_USER.days,   900,  statsVisible);
  const animStamps = useCountUp(DEMO_USER.stamps, 800,  statsVisible);
  const animPhotos = useCountUp(DEMO_USER.photos, 1100, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const pageTypes = [
    { label: 'Capa',           color: 'bg-[#2D3A27]' },
    { label: 'Frase de abertura', color: 'bg-[#FDFCF8] border border-[#2D3A27]/10' },
    { label: 'Sua jornada',    color: 'bg-[#2D3A27]' },
    { label: 'Foto destaque',  color: 'bg-stone-400' },
    { label: 'Foto editorial', color: 'bg-stone-300' },
    { label: 'Colagem dupla',  color: 'bg-stone-500' },
    { label: 'Grade 3 fotos',  color: 'bg-stone-400' },
    { label: 'Citação',        color: 'bg-[#F5F2EA] border border-[#2D3A27]/8' },
    { label: 'Foto paisagem',  color: 'bg-stone-600' },
    { label: 'Reflexão',       color: 'bg-[#FDFCF8] border border-[#2D3A27]/10' },
    { label: 'Mosaico 2×2',   color: 'bg-stone-400' },
    { label: 'Foto galeria',   color: 'bg-stone-300' },
    { label: 'Grade assimétrica', color: 'bg-stone-500' },
    { label: 'Contracapa',     color: 'bg-[#1B2616]' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>

      {/* Hero */}
      <div className="bg-[#1B2616] bg-noise bg-topography relative overflow-hidden px-6 py-16 md:py-24 flex flex-col items-center text-center gap-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[#E8E4D9]/4 rounded-full blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="relative z-10">
          <p className="text-[#E8E4D9]/40 text-xs uppercase tracking-[0.35em] mb-5">Olá, {DEMO_USER.name} · {DEMO_USER.route}</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#E8E4D9] italic leading-[1.1] tracking-tight">
            Seu livro<br />está pronto.
          </h1>
          <div className="w-10 h-px bg-[#E8E4D9]/20 mx-auto my-6" />
          <p className="text-[#E8E4D9]/50 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            Montamos automaticamente seu Coffee Table Book com os registros da sua jornada.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, type: 'spring', damping: 18 }} className="relative z-10 w-full flex flex-col items-center">
          <InteractiveBook bookData={bookData} />
        </motion.div>
      </div>

      {/* Estrutura do livro */}
      <div className="bg-[#FDFCF8] py-12">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#2D3A27]/40 mb-6 px-6">14 páginas · 7 layouts diferentes</p>
        <div className="flex gap-1.5 overflow-x-auto px-6 pb-2" style={{ scrollbarWidth: 'none' }}>
          {pageTypes.map((pt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="shrink-0 flex flex-col items-center gap-1.5"
            >
              <div className={`w-12 h-16 rounded-md ${pt.color} flex items-end justify-end p-1`}>
                <span className="text-white/40 text-[0.5rem] tabular-nums">{i + 1}</span>
              </div>
              <span className="text-[#2D3A27]/35 text-[0.52rem] text-center leading-tight max-w-[3rem]">{pt.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="bg-[#F5F2EA] px-6 py-14">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#2D3A27]/40 mb-10">O que está no seu livro</p>
        <div className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Route size={18} />,   value: animKm,     unit: ' km',   label: 'percorridos' },
            { icon: <MapPin size={18} />,   value: animDays,   unit: ' dias', label: 'de caminhada' },
            { icon: <span className="text-base">🔖</span>, value: animStamps, unit: '', label: 'carimbos' },
            { icon: <Camera size={18} />,   value: animPhotos, unit: '',      label: 'fotos' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: statsVisible ? 1 : 0, y: statsVisible ? 0 : 16 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 text-center shadow-sm"
            >
              <div className="text-[#2D3A27]/40">{stat.icon}</div>
              <span className="font-serif text-2xl text-[#2D3A27] italic tabular-nums">{stat.value}<span className="text-lg">{stat.unit}</span></span>
              <span className="text-xs text-[#2D3A27]/40 uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#2D3A27] bg-noise px-6 py-16 flex flex-col items-center gap-5">
        <div className="text-center">
          <p className="text-[#E8E4D9]/35 text-xs uppercase tracking-[0.25em] mb-4">Capa dura · Impressão A4 · Envio para qualquer país</p>
          <p className="font-serif text-6xl text-[#E8E4D9] italic leading-none">€49</p>
          <p className="text-[#E8E4D9]/25 text-xs mt-2">impressão + frete internacional inclusos</p>
        </div>
        <motion.button onClick={onNext} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="bg-[#E8E4D9] text-[#1B2616] px-12 py-4 rounded-full font-semibold flex items-center gap-3 shadow-2xl text-base hover:bg-white transition-colors mt-2"
        >
          Personalizar e encomendar <ArrowRight size={18} />
        </motion.button>
        <p className="text-xs text-[#E8E4D9]/20 text-center max-w-xs">Pode ajustar fotos, textos e título antes de pagar</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Personalizar (3 abas)
// ---------------------------------------------------------------------------
function StepCustomize({ bookData, onChange, onNext, onBack }: {
  bookData: BookData;
  onChange: (patch: Partial<BookData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<CustomizeTab>('cover');

  const tabs: { id: CustomizeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'cover',  label: 'Capa',   icon: <BookOpen size={15} /> },
    { id: 'texts',  label: 'Textos', icon: <Type size={15} /> },
    { id: 'photos', label: 'Fotos',  icon: <Image size={15} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">

      <div className="text-center">
        <p className="text-[#2D3A27]/35 text-xs uppercase tracking-[0.3em] mb-2">Passo 2 de 3</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">Personalize seu livro</h2>
        <p className="text-[#2D3A27]/50 text-sm">Fotos, textos e capa — tudo do seu jeito.</p>
      </div>

      {/* Abas */}
      <div className="flex bg-[#F5F2EA] rounded-2xl p-1 gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white text-[#2D3A27] shadow-sm' : 'text-[#2D3A27]/40 hover:text-[#2D3A27]/70'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Aba Capa ── */}
        {tab === 'cover' && (
          <motion.div key="cover" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
            {/* Preview 3D */}
            <div className="flex justify-center">
              <div style={{ filter: 'drop-shadow(-10px 20px 50px rgba(0,0,0,0.35)) drop-shadow(-3px 6px 12px rgba(0,0,0,0.2))' }}>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-5 z-10 rounded-l-sm" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.18) 40%, rgba(255,255,255,0.06) 65%, rgba(0,0,0,0.12))' }} />
                  <div className="relative w-52 md:w-60 rounded-r-lg rounded-l-sm overflow-hidden">
                    <img src={bookData.coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
                    <div className="absolute inset-0 flex flex-col justify-between p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)' }}>
                      <span className="text-white/60 text-xs uppercase tracking-widest self-end">Peregrino</span>
                      <div>
                        <p className="text-white font-serif italic text-sm leading-tight">{bookData.title}</p>
                        <p className="text-white/50 text-xs mt-1.5 uppercase tracking-wider">{DEMO_USER.name}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Seleção de foto */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">Foto de capa</p>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {DEMO_USER.allPhotos.map((photo, i) => (
                  <button key={i} onClick={() => onChange({ coverPhoto: photo })}
                    className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-200 ${bookData.coverPhoto === photo ? 'ring-[#2D3A27] scale-105 shadow-md' : 'ring-transparent hover:ring-[#2D3A27]/30'}`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            {/* Título */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">Título do livro</p>
              <input
                type="text" value={bookData.title} maxLength={60}
                onChange={e => onChange({ title: e.target.value })}
                placeholder="Ex: Caminho Francês, 2026"
                className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-4 font-serif italic text-[#2D3A27] text-lg focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20"
              />
              <p className="text-xs text-[#2D3A27]/25 mt-2 text-right">{bookData.title.length}/60</p>
            </div>
          </motion.div>
        )}

        {/* ── Aba Textos ── */}
        {tab === 'texts' && (
          <motion.div key="texts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">

            {/* Frase de abertura */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40">Frase de abertura</p>
                  <p className="text-xs text-[#2D3A27]/30 mt-0.5">Aparece na 2ª página do livro, após a capa</p>
                </div>
              </div>
              <div className="bg-[#F5F2EA] rounded-2xl p-5 mb-3 border border-[#2D3A27]/5">
                <p className="text-[#2D3A27]/30 text-xs uppercase tracking-widest mb-2">Prévia</p>
                <p className="font-serif italic text-[#2D3A27] text-base leading-relaxed">"{bookData.openingPhrase}"</p>
                <p className="text-[#2D3A27]/35 text-xs mt-2">— {DEMO_USER.name}</p>
              </div>
              <textarea
                value={bookData.openingPhrase} maxLength={160}
                onChange={e => onChange({ openingPhrase: e.target.value })}
                rows={3}
                placeholder="Uma frase que resume o que o Caminho significou para você..."
                className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-4 font-serif italic text-[#2D3A27] text-base focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20 resize-none"
              />
              <p className="text-xs text-[#2D3A27]/25 mt-1 text-right">{bookData.openingPhrase.length}/160</p>
            </div>

            {/* Reflexão */}
            <div>
              <div className="mb-3">
                <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40">Sua reflexão</p>
                <p className="text-xs text-[#2D3A27]/30 mt-0.5">Aparece na página 10 do livro, em tipografia elegante</p>
              </div>
              <div className="bg-[#F5F2EA] rounded-2xl p-5 mb-3 border border-[#2D3A27]/5">
                <p className="text-[#2D3A27]/30 text-xs uppercase tracking-widest mb-2">Prévia</p>
                <p className="font-serif italic text-[#2D3A27] text-sm leading-relaxed">"{bookData.reflectionText}"</p>
              </div>
              <textarea
                value={bookData.reflectionText} maxLength={400}
                onChange={e => onChange({ reflectionText: e.target.value })}
                rows={5}
                placeholder="Escreva sobre o que viveu, aprendeu ou sentiu durante o Caminho..."
                className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-4 font-serif italic text-[#2D3A27] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20 resize-none"
              />
              <p className="text-xs text-[#2D3A27]/25 mt-1 text-right">{bookData.reflectionText.length}/400</p>
            </div>
          </motion.div>
        )}

        {/* ── Aba Fotos ── */}
        {tab === 'photos' && (
          <motion.div key="photos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Fotos interiores</p>
              <p className="text-xs text-[#2D3A27]/35">Selecione de 4 a 8 fotos favoritas. Serão distribuídas pelos 7 layouts internos.</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {DEMO_USER.allPhotos.map((photo, i) => {
                const selected = bookData.selectedPhotos.includes(photo);
                const idx = bookData.selectedPhotos.indexOf(photo);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (selected) {
                        if (bookData.selectedPhotos.length > 4) {
                          onChange({ selectedPhotos: bookData.selectedPhotos.filter(p => p !== photo) });
                        }
                      } else if (bookData.selectedPhotos.length < 8) {
                        onChange({ selectedPhotos: [...bookData.selectedPhotos, photo] });
                      }
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-200 ${selected ? 'ring-[#2D3A27] scale-105' : 'ring-transparent hover:ring-[#2D3A27]/25'}`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    {selected && (
                      <div className="absolute inset-0 bg-[#2D3A27]/40 flex items-center justify-center">
                        <span className="w-7 h-7 bg-[#2D3A27] rounded-full flex items-center justify-center text-[#E8E4D9] text-xs font-bold">{idx + 1}</span>
                      </div>
                    )}
                    {!selected && bookData.selectedPhotos.length >= 8 && (
                      <div className="absolute inset-0 bg-black/30" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-[#2D3A27]/40">
              {bookData.selectedPhotos.length} de 8 selecionadas
              {bookData.selectedPhotos.length >= 8 && <span className="text-[#2D3A27]/60 ml-1">· máximo atingido</span>}
              {bookData.selectedPhotos.length < 4 && <span className="text-amber-600/70 ml-1">· mínimo 4 fotos</span>}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-4 border-t border-[#2D3A27]/8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors">
          <ArrowLeft size={15} /> Voltar
        </button>
        <motion.button
          onClick={onNext}
          disabled={bookData.selectedPhotos.length < 4}
          whileHover={bookData.selectedPhotos.length >= 4 ? { scale: 1.03 } : {}}
          whileTap={bookData.selectedPhotos.length >= 4 ? { scale: 0.97 } : {}}
          className="bg-[#2D3A27] text-[#E8E4D9] px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 hover:bg-[#1B2616] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Resumo e checkout
// ---------------------------------------------------------------------------
function StepOrder({ bookData, onBack }: { bookData: BookData; onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/sucesso`,
          cancelUrl:  `${window.location.origin}/book`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Não foi possível iniciar o pagamento. Tente novamente.');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-lg mx-auto px-6 py-12 flex flex-col gap-7">
      <div className="text-center">
        <p className="text-[#2D3A27]/35 text-xs uppercase tracking-[0.3em] mb-2">Passo 3 de 3</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">Resumo do pedido</h2>
        <p className="text-[#2D3A27]/50 text-sm">Confirme os detalhes antes de pagar.</p>
      </div>

      {/* Produto */}
      <div className="bg-[#F5F2EA] rounded-3xl p-6 flex gap-5">
        <div className="w-20 rounded-xl overflow-hidden shrink-0" style={{ boxShadow: '-4px 6px 20px rgba(0,0,0,0.25)' }}>
          <img src={bookData.coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-serif italic text-[#2D3A27] text-lg leading-tight">{bookData.title}</p>
          <p className="text-xs text-[#2D3A27]/40 uppercase tracking-wider">{DEMO_USER.name}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">📸 {DEMO_USER.photos} fotos</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">🗺️ {DEMO_USER.km} km</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">🔖 {DEMO_USER.stamps} carimbos</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">Capa dura</span>
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">14 págs · A4</span>
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">7 layouts</span>
          </div>
        </div>
      </div>

      {/* Preço */}
      <div className="bg-white rounded-3xl p-6 border border-[#2D3A27]/8">
        <div className="flex justify-between text-sm text-[#2D3A27] mb-2">
          <span>Coffee Table Book</span><span>€49,00</span>
        </div>
        <div className="flex justify-between text-xs text-[#2D3A27]/40 mb-4">
          <span>Impressão + envio internacional</span><span>incluso</span>
        </div>
        <div className="border-t border-[#2D3A27]/8 pt-4 flex justify-between font-semibold text-[#2D3A27]">
          <span>Total</span>
          <span className="font-serif italic text-xl">€49,00</span>
        </div>
      </div>

      {/* Trust */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Shield size={15} />, label: 'Pagamento seguro', sub: 'via Stripe' },
          { icon: <Globe size={15} />,  label: 'Envio global',     sub: '140+ países' },
          { icon: <Package size={15} />,label: 'Sob encomenda',    sub: 'Lulu.com' },
        ].map((item, i) => (
          <div key={i} className="bg-[#F5F2EA] rounded-2xl p-3 flex flex-col items-center gap-1 text-center">
            <div className="text-[#2D3A27]/40">{item.icon}</div>
            <span className="text-[0.62rem] text-[#2D3A27]/60 font-medium leading-tight">{item.label}</span>
            <span className="text-[0.58rem] text-[#2D3A27]/35">{item.sub}</span>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <motion.button onClick={handleCheckout} disabled={loading}
        whileHover={loading ? {} : { scale: 1.02 }} whileTap={loading ? {} : { scale: 0.98 }}
        className="w-full bg-[#2D3A27] text-[#E8E4D9] py-4 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-[#1B2616] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-base"
      >
        {loading ? (
          <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> A preparar...</>
        ) : (
          <><CreditCard size={18} /> Pagar €49,00 com cartão</>
        )}
      </motion.button>

      <button onClick={onBack} className="text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors text-center">
        ← Voltar e personalizar
      </button>
      <p className="text-xs text-[#2D3A27]/25 text-center -mt-2">
        Endereço de entrega solicitado no checkout · Processado pelo Stripe
      </p>
    </motion.div>
  );
}
