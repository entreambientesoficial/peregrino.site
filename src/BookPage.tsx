import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import {
  ArrowLeft, ArrowRight, MapPin, Camera, Route,
  CreditCard, Check, ChevronLeft, ChevronRight,
  Shield, Globe, Package,
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
  coverPhoto: '/img-apoio/card1-St-Jean-Pied-de-Port.webp',
  photos_preview: [
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

type Step = 'reveal' | 'customize' | 'order';

// ---------------------------------------------------------------------------
// Hook de contagem animada
// ---------------------------------------------------------------------------
function useCountUp(target: number, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return value;
}

// ---------------------------------------------------------------------------
// BookPage
// ---------------------------------------------------------------------------
export default function BookPage() {
  const [step, setStep] = useState<Step>('reveal');
  const [coverPhoto, setCoverPhoto] = useState(DEMO_USER.coverPhoto);
  const [bookTitle, setBookTitle] = useState(`${DEMO_USER.route}, ${new Date().getFullYear()}`);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans">

      {/* Header */}
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

      {/* Barra de progresso */}
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

      {/* Content */}
      <div className="pt-[108px]">
        <AnimatePresence mode="wait">
          {step === 'reveal'    && <StepReveal    key="reveal"    coverPhoto={coverPhoto} bookTitle={bookTitle} onNext={() => setStep('customize')} />}
          {step === 'customize' && <StepCustomize key="customize" coverPhoto={coverPhoto} bookTitle={bookTitle} onChangeCover={setCoverPhoto} onChangeTitle={setBookTitle} onNext={() => setStep('order')} onBack={() => setStep('reveal')} />}
          {step === 'order'     && <StepOrder     key="order"     coverPhoto={coverPhoto} bookTitle={bookTitle} onBack={() => setStep('customize')} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente de página do livro (usado pelo HTMLFlipBook)
// ---------------------------------------------------------------------------
const FlipPage = React.forwardRef<HTMLDivElement, { children?: React.ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} className={`bg-[#FDFCF8] overflow-hidden ${className}`}>
      {children}
    </div>
  )
);
FlipPage.displayName = 'FlipPage';

// ---------------------------------------------------------------------------
// Livro interativo com page-flip
// ---------------------------------------------------------------------------
function InteractiveBook({ coverPhoto, bookTitle }: { coverPhoto: string; bookTitle: string }) {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [bookSize, setBookSize] = useState({ width: 280, height: 373 });

  const totalPages = 12;

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 640)       setBookSize({ width: 155, height: 207 });
      else if (w < 1024) setBookSize({ width: 220, height: 293 });
      else               setBookSize({ width: 280, height: 373 });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const goNext = () => bookRef.current?.pageFlip().flipNext();
  const goPrev = () => bookRef.current?.pageFlip().flipPrev();
  const photos = DEMO_USER.photos_preview;

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence>
        {!hasFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-2 text-[#E8E4D9]/35 text-xs uppercase tracking-widest"
          >
            <motion.span animate={{ x: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>←</motion.span>
            <span>Clique para folhear</span>
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.1 }}>→</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Livro */}
      <div style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.65)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef}
          width={bookSize.width}
          height={bookSize.height}
          size="fixed"
          minWidth={bookSize.width} maxWidth={bookSize.width}
          minHeight={bookSize.height} maxHeight={bookSize.height}
          drawShadow={true}
          flippingTime={700}
          usePortrait={false}
          startZIndex={10}
          autoSize={false}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          style={{}} className="" startPage={0}
          onFlip={(e: any) => {
            setPage(e.data);
            if (e.data > 0) setHasFlipped(true);
          }}
        >
          {/* Capa */}
          <FlipPage>
            <div className="w-full h-full relative">
              <img src={coverPhoto} alt="Capa" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-4 md:p-6">
                <span className="text-white/60 text-xs uppercase tracking-[0.2em] self-end">Peregrino</span>
                <div>
                  <p className="text-white font-serif italic leading-tight" style={{ fontSize: bookSize.width < 200 ? '0.75rem' : '1.1rem' }}>{bookTitle}</p>
                  <p className="text-white/50 uppercase tracking-widest mt-1" style={{ fontSize: bookSize.width < 200 ? '0.55rem' : '0.7rem' }}>{DEMO_USER.name}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />
            </div>
          </FlipPage>

          {/* Folha de rosto */}
          <FlipPage>
            <div className="w-full h-full flex flex-col justify-center items-center gap-3 p-4 bg-[#FDFCF8]">
              <div className="w-8 h-px bg-[#2D3A27]/20" />
              <p className="text-[#2D3A27]/30 uppercase tracking-[0.3em]" style={{ fontSize: bookSize.width < 200 ? '0.5rem' : '0.6rem' }}>Peregrino</p>
              <p className="font-serif italic text-[#2D3A27] leading-tight text-center" style={{ fontSize: bookSize.width < 200 ? '0.8rem' : '1.2rem' }}>{bookTitle}</p>
              <p className="text-[#2D3A27]/40" style={{ fontSize: bookSize.width < 200 ? '0.5rem' : '0.65rem' }}>{DEMO_USER.name}</p>
              <div className="w-8 h-px bg-[#2D3A27]/20" />
              <p className="text-[#2D3A27]/30 text-center" style={{ fontSize: bookSize.width < 200 ? '0.45rem' : '0.6rem' }}>
                {DEMO_USER.startDate} — {DEMO_USER.endDate}
              </p>
            </div>
          </FlipPage>

          {/* Stats */}
          <FlipPage className="bg-[#2D3A27]">
            <div className="w-full h-full flex flex-col justify-center gap-3 p-3">
              <p className="text-[#E8E4D9]/40 uppercase tracking-widest text-center" style={{ fontSize: bookSize.width < 200 ? '0.45rem' : '0.55rem' }}>Sua jornada</p>
              {[
                { label: 'Rota', value: DEMO_USER.route },
                { label: 'Distância', value: `${DEMO_USER.km} km` },
                { label: 'Duração', value: `${DEMO_USER.days} dias` },
                { label: 'Carimbos', value: `${DEMO_USER.stamps}` },
                { label: 'Fotos', value: `${DEMO_USER.photos}` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[#E8E4D9]/10 pb-2">
                  <span className="text-[#E8E4D9]/40" style={{ fontSize: bookSize.width < 200 ? '0.5rem' : '0.65rem' }}>{item.label}</span>
                  <span className="text-[#E8E4D9] font-medium" style={{ fontSize: bookSize.width < 200 ? '0.5rem' : '0.65rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </FlipPage>

          {/* Fotos */}
          {photos.slice(0, 8).map((photo, i) => (
            <FlipPage key={`photo-${i}`}>
              <div className="w-full h-full relative">
                <img src={photo} alt={`Página ${i + 3}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                  <p className="text-white/60 text-right" style={{ fontSize: bookSize.width < 200 ? '0.45rem' : '0.6rem' }}>
                    {DEMO_USER.route} · {i + 1}
                  </p>
                </div>
              </div>
            </FlipPage>
          ))}

          {/* Contracapa */}
          <FlipPage className="bg-[#1B2616]">
            <div className="w-full h-full flex flex-col justify-center items-center gap-4">
              <p className="font-serif italic text-[#E8E4D9]/60" style={{ fontSize: bookSize.width < 200 ? '0.9rem' : '1.3rem' }}>Ultreia et Suseia</p>
              <div className="w-8 h-px bg-[#E8E4D9]/20" />
              <p className="text-[#E8E4D9]/30" style={{ fontSize: bookSize.width < 200 ? '0.45rem' : '0.6rem' }}>peregrino.app</p>
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
          {page === 0 ? 'Capa' : `${page} / ${totalPages - 1}`}
        </span>
        <button onClick={goNext} disabled={page >= totalPages - 1}
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
function StepReveal({ coverPhoto, bookTitle, onNext }: { coverPhoto: string; bookTitle: string; onNext: () => void }) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const animKm     = useCountUp(DEMO_USER.km,     1200, statsVisible);
  const animDays   = useCountUp(DEMO_USER.days,    900,  statsVisible);
  const animStamps = useCountUp(DEMO_USER.stamps,  800,  statsVisible);
  const animPhotos = useCountUp(DEMO_USER.photos,  1100, statsVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>

      {/* Hero */}
      <div className="bg-[#1B2616] bg-noise bg-topography relative overflow-hidden px-6 py-16 md:py-24 flex flex-col items-center text-center gap-10">
        {/* Luz ambiente */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[#E8E4D9]/4 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative z-10 flex flex-col items-center"
        >
          <p className="text-[#E8E4D9]/40 text-xs uppercase tracking-[0.35em] mb-5">
            Olá, {DEMO_USER.name} · {DEMO_USER.route}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#E8E4D9] italic leading-[1.1] tracking-tight">
            Seu livro<br />está pronto.
          </h1>
          <div className="w-10 h-px bg-[#E8E4D9]/20 my-6" />
          <p className="text-[#E8E4D9]/50 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            Montamos automaticamente seu Coffee Table Book com os registros da sua jornada.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, type: 'spring', damping: 18 }}
          className="relative z-10 w-full flex flex-col items-center"
        >
          <InteractiveBook coverPhoto={coverPhoto} bookTitle={bookTitle} />
        </motion.div>
      </div>

      {/* Stats com contagem animada */}
      <div ref={statsRef} className="bg-[#F5F2EA] px-6 py-14">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#2D3A27]/40 mb-10">O que está no seu livro</p>
        <div className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Route size={18} />,   value: animKm,     unit: ' km',   label: 'percorridos' },
            { icon: <MapPin size={18} />,   value: animDays,   unit: ' dias', label: 'de caminhada' },
            { icon: <span className="text-base">🔖</span>, value: animStamps, unit: '', label: 'carimbos' },
            { icon: <Camera size={18} />,   value: animPhotos, unit: '',      label: 'fotos' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: statsVisible ? 1 : 0, y: statsVisible ? 0 : 16 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 text-center shadow-sm"
            >
              <div className="text-[#2D3A27]/40">{stat.icon}</div>
              <span className="font-serif text-2xl text-[#2D3A27] italic tabular-nums">
                {stat.value}<span className="text-lg">{stat.unit}</span>
              </span>
              <span className="text-xs text-[#2D3A27]/40 uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Prévia das páginas — scroll horizontal */}
      <div className="bg-[#FDFCF8] py-12 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#2D3A27]/40 mb-7 px-6">Prévia das páginas</p>
        <div
          className="flex gap-3 overflow-x-auto px-6 pb-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Capa */}
          <PageThumb label="Capa" page="p. 1">
            <div className="relative w-full h-full">
              <img src={coverPhoto} alt="Capa" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="text-white/70 text-[0.55rem] uppercase tracking-wider">Capa</span>
              </div>
            </div>
          </PageThumb>

          {/* Stats page */}
          <PageThumb label="Sua jornada" page="p. 3">
            <div className="w-full h-full bg-[#2D3A27] flex flex-col justify-center items-center gap-1.5 p-3">
              <span className="text-[#E8E4D9]/30 text-[0.5rem] uppercase tracking-widest text-center">Sua jornada</span>
              <div className="w-6 h-px bg-[#E8E4D9]/20 my-0.5" />
              {[`${DEMO_USER.km} km`, `${DEMO_USER.days} dias`, `${DEMO_USER.stamps} carimbos`].map((t, i) => (
                <span key={i} className="text-[#E8E4D9]/60 text-[0.55rem] text-center">{t}</span>
              ))}
            </div>
          </PageThumb>

          {/* Fotos */}
          {DEMO_USER.photos_preview.slice(0, 6).map((photo, i) => (
            <PageThumb key={i} label={`Foto ${i + 1}`} page={`p. ${i + 4}`}>
              <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </PageThumb>
          ))}

          {/* Contracapa */}
          <PageThumb label="Contracapa" page="final">
            <div className="w-full h-full bg-[#1B2616] flex flex-col justify-center items-center gap-2 p-3">
              <span className="font-serif italic text-[#E8E4D9]/50 text-xs text-center leading-tight">Ultreia et Suseia</span>
              <div className="w-5 h-px bg-[#E8E4D9]/15" />
              <span className="text-[#E8E4D9]/20 text-[0.5rem]">peregrino.app</span>
            </div>
          </PageThumb>
        </div>
      </div>

      {/* CTA — fundo escuro, botão claro */}
      <div className="bg-[#2D3A27] bg-noise px-6 py-16 flex flex-col items-center gap-5">
        <div className="text-center">
          <p className="text-[#E8E4D9]/35 text-xs uppercase tracking-[0.25em] mb-4">
            Capa dura · Impressão A4 · Envio para qualquer país
          </p>
          <p className="font-serif text-6xl text-[#E8E4D9] italic leading-none">€49</p>
          <p className="text-[#E8E4D9]/25 text-xs mt-2">impressão + frete internacional inclusos</p>
        </div>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#E8E4D9] text-[#1B2616] px-12 py-4 rounded-full font-semibold flex items-center gap-3 shadow-2xl text-base hover:bg-white transition-colors mt-2"
        >
          Personalizar e encomendar
          <ArrowRight size={18} />
        </motion.button>
        <p className="text-xs text-[#E8E4D9]/20 text-center max-w-xs">
          Pode ajustar a foto de capa e o título antes de pagar
        </p>
      </div>
    </motion.div>
  );
}

// Sub-componente para miniatura de página
function PageThumb({ children, label, page }: { children: React.ReactNode; label: string; page: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="shrink-0 flex flex-col items-center gap-2"
    >
      <div className="w-[90px] h-[122px] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
        {children}
      </div>
      <div className="text-center">
        <span className="block text-[#2D3A27]/50 text-[0.6rem] leading-tight">{label}</span>
        <span className="block text-[#2D3A27]/25 text-[0.55rem]">{page}</span>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Personalização da capa
// ---------------------------------------------------------------------------
function StepCustomize({ coverPhoto, bookTitle, onChangeCover, onChangeTitle, onNext, onBack }: {
  coverPhoto: string; bookTitle: string;
  onChangeCover: (p: string) => void; onChangeTitle: (t: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  const allPhotos = [DEMO_USER.coverPhoto, ...DEMO_USER.photos_preview];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-10"
    >
      <div className="text-center">
        <p className="text-[#2D3A27]/35 text-xs uppercase tracking-[0.3em] mb-2">Passo 2 de 3</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">Personalize a capa</h2>
        <p className="text-[#2D3A27]/50 text-sm">Escolha a foto de capa e o título do seu livro.</p>
      </div>

      {/* Preview da capa com efeito 3D */}
      <div className="flex justify-center">
        <div
          className="relative"
          style={{ filter: 'drop-shadow(-10px 20px 50px rgba(0,0,0,0.35)) drop-shadow(-3px 6px 12px rgba(0,0,0,0.2))' }}
        >
          {/* Lombada simulada */}
          <div
            className="absolute left-0 top-0 bottom-0 w-5 z-10 rounded-l-sm"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.18) 40%, rgba(255,255,255,0.06) 65%, rgba(0,0,0,0.12))',
            }}
          />
          {/* Capa */}
          <div className="relative w-52 md:w-60 rounded-r-lg rounded-l-sm overflow-hidden">
            <img src={coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-5">
              <span className="text-white/60 text-xs uppercase tracking-widest self-end">Peregrino</span>
              <div>
                <p className="text-white font-serif italic text-sm leading-tight">{bookTitle}</p>
                <p className="text-white/50 text-xs mt-1.5 uppercase tracking-wider">{DEMO_USER.name}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Seleção de foto */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-4">Foto de capa</p>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {allPhotos.map((photo, i) => (
            <button
              key={i}
              onClick={() => onChangeCover(photo)}
              className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-200 ${
                coverPhoto === photo
                  ? 'ring-[#2D3A27] scale-105 shadow-md'
                  : 'ring-transparent hover:ring-[#2D3A27]/30'
              }`}
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
          type="text"
          value={bookTitle}
          onChange={e => onChangeTitle(e.target.value)}
          maxLength={60}
          placeholder="Ex: Caminho Francês, 2026"
          className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-4 font-serif italic text-[#2D3A27] text-lg focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20 transition-shadow"
        />
        <p className="text-xs text-[#2D3A27]/25 mt-2 text-right">{bookTitle.length}/60</p>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors">
          <ArrowLeft size={15} /> Voltar
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#2D3A27] text-[#E8E4D9] px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 hover:bg-[#1B2616] transition-colors shadow-md"
        >
          Confirmar capa <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Resumo e checkout
// ---------------------------------------------------------------------------
function StepOrder({ coverPhoto, bookTitle, onBack }: { coverPhoto: string; bookTitle: string; onBack: () => void }) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-6 py-12 flex flex-col gap-7"
    >
      <div className="text-center">
        <p className="text-[#2D3A27]/35 text-xs uppercase tracking-[0.3em] mb-2">Passo 3 de 3</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">Resumo do pedido</h2>
        <p className="text-[#2D3A27]/50 text-sm">Confirme os detalhes antes de pagar.</p>
      </div>

      {/* Produto */}
      <div className="bg-[#F5F2EA] rounded-3xl p-6 flex gap-5">
        <div
          className="w-20 rounded-xl overflow-hidden shrink-0"
          style={{ boxShadow: '-4px 6px 20px rgba(0,0,0,0.25)' }}
        >
          <img src={coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-serif italic text-[#2D3A27] text-lg leading-tight">{bookTitle}</p>
          <p className="text-xs text-[#2D3A27]/40 uppercase tracking-wider">{DEMO_USER.name}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">📸 {DEMO_USER.photos} fotos</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">🗺️ {DEMO_USER.km} km</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">🔖 {DEMO_USER.stamps} carimbos</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">Capa dura</span>
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">~50 págs</span>
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">Formato A4</span>
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

      {/* Trust indicators */}
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

      <motion.button
        onClick={handleCheckout}
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        className="w-full bg-[#2D3A27] text-[#E8E4D9] py-4 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-[#1B2616] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-base"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            A preparar pagamento...
          </>
        ) : (
          <><CreditCard size={18} />Pagar €49,00 com cartão</>
        )}
      </motion.button>

      <button onClick={onBack} className="text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors text-center">
        ← Voltar e ajustar capa
      </button>

      <p className="text-xs text-[#2D3A27]/25 text-center -mt-2">
        Endereço de entrega solicitado no checkout · Pagamento processado pelo Stripe
      </p>
    </motion.div>
  );
}
