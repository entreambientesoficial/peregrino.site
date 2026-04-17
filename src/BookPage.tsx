import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft, ArrowRight, MapPin, Camera, Route, CreditCard, Check, ChevronLeft, ChevronRight } from 'lucide-react';

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

      {/* Steps indicator */}
      <div className="fixed top-[60px] left-0 right-0 z-40 bg-[#1B2616]/80 backdrop-blur-sm">
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
  const [isOpen, setIsOpen] = useState(false);
  const [bookSize, setBookSize] = useState({ width: 320, height: 426 });

  const totalPages = 12; // capa + páginas de conteúdo + contracapa

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setBookSize({ width: 155, height: 207 });
      } else if (w < 1024) {
        setBookSize({ width: 220, height: 293 });
      } else {
        setBookSize({ width: 280, height: 373 });
      }
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
      {/* Hint inicial */}
      <AnimatePresence>
        {!isOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[#E8E4D9]/40 text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <span>Clique no livro para folhear</span>
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>→</motion.span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Livro */}
      <div className="relative" style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}>
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef}
          width={bookSize.width}
          height={bookSize.height}
          size="fixed"
          minWidth={bookSize.width}
          maxWidth={bookSize.width}
          minHeight={bookSize.height}
          maxHeight={bookSize.height}
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
          style={{}}
          className=""
          startPage={0}
          onFlip={(e: any) => {
            setPage(e.data);
            if (e.data > 0) setIsOpen(true);
          }}
        >
          {/* Página 0 — Capa */}
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

          {/* Página 1 — Folha de rosto */}
          <FlipPage className="flex flex-col justify-center items-center text-center p-6 bg-[#FDFCF8]">
            <div className="w-full h-full flex flex-col justify-center items-center gap-3 p-4">
              <div className="w-8 h-px bg-[#2D3A27]/20" />
              <p className="text-[#2D3A27]/30 uppercase tracking-[0.3em]" style={{ fontSize: bookSize.width < 200 ? '0.5rem' : '0.6rem' }}>Peregrino</p>
              <p className="font-serif italic text-[#2D3A27] leading-tight" style={{ fontSize: bookSize.width < 200 ? '0.8rem' : '1.2rem' }}>{bookTitle}</p>
              <p className="text-[#2D3A27]/40" style={{ fontSize: bookSize.width < 200 ? '0.5rem' : '0.65rem' }}>{DEMO_USER.name}</p>
              <div className="w-8 h-px bg-[#2D3A27]/20" />
              <p className="text-[#2D3A27]/30" style={{ fontSize: bookSize.width < 200 ? '0.45rem' : '0.6rem' }}>
                {DEMO_USER.startDate} — {DEMO_USER.endDate}
              </p>
            </div>
          </FlipPage>

          {/* Página 2 — Stats da jornada */}
          <FlipPage className="bg-[#2D3A27] flex flex-col justify-center items-center p-4 md:p-6">
            <div className="w-full h-full flex flex-col justify-center gap-3 p-2">
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

          {/* Páginas 3 a 10 — Fotos */}
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

          {/* Página 11 — Contracapa */}
          <FlipPage className="bg-[#1B2616] flex flex-col justify-center items-center p-6">
            <div className="w-full h-full flex flex-col justify-center items-center gap-4">
              <p className="font-serif italic text-[#E8E4D9]/60" style={{ fontSize: bookSize.width < 200 ? '0.9rem' : '1.3rem' }}>Ultreia et Suseia</p>
              <div className="w-8 h-px bg-[#E8E4D9]/20" />
              <p className="text-[#E8E4D9]/30 text-center" style={{ fontSize: bookSize.width < 200 ? '0.45rem' : '0.6rem' }}>peregrino.app</p>
            </div>
          </FlipPage>
        </HTMLFlipBook>
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center gap-6">
        <button
          onClick={goPrev}
          disabled={page === 0}
          className="w-10 h-10 rounded-full bg-[#E8E4D9]/10 flex items-center justify-center hover:bg-[#E8E4D9]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} className="text-[#E8E4D9]" />
        </button>
        <span className="text-[#E8E4D9]/30 text-xs tabular-nums">
          {page === 0 ? 'Capa' : `${page} / ${totalPages - 1}`}
        </span>
        <button
          onClick={goNext}
          disabled={page >= totalPages - 1}
          className="w-10 h-10 rounded-full bg-[#E8E4D9]/10 flex items-center justify-center hover:bg-[#E8E4D9]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} className="text-[#E8E4D9]" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Revelação do livro
// ---------------------------------------------------------------------------
function StepReveal({ coverPhoto, bookTitle, onNext }: { coverPhoto: string; bookTitle: string; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero — fundo escuro com livro interativo */}
      <div className="bg-[#1B2616] px-6 py-12 md:py-20 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[#E8E4D9]/40 text-xs uppercase tracking-[0.3em] mb-3">Olá, {DEMO_USER.name}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#E8E4D9] italic leading-tight">
            Seu livro<br />está pronto.
          </h1>
          <p className="text-[#E8E4D9]/50 mt-4 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Montamos automaticamente seu Coffee Table Book com os registros da sua jornada pelo {DEMO_USER.route}.
          </p>
        </motion.div>

        {/* Livro interativo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="w-full flex flex-col items-center"
        >
          <InteractiveBook coverPhoto={coverPhoto} bookTitle={bookTitle} />
        </motion.div>
      </div>

      {/* Stats da jornada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-[#F5F2EA] px-6 py-10"
      >
        <p className="text-center text-xs uppercase tracking-[0.25em] text-[#2D3A27]/40 mb-8">O que está no seu livro</p>
        <div className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Route size={20} />, value: `${DEMO_USER.km} km`, label: 'percorridos' },
            { icon: <MapPin size={20} />, value: `${DEMO_USER.days} dias`, label: 'de caminhada' },
            { icon: <span className="text-lg">🔖</span>, value: `${DEMO_USER.stamps}`, label: 'carimbos' },
            { icon: <Camera size={20} />, value: `${DEMO_USER.photos}`, label: 'fotos' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + i * 0.1 }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 text-center shadow-sm"
            >
              <div className="text-[#2D3A27]/40">{stat.icon}</div>
              <span className="font-serif text-2xl text-[#2D3A27] italic">{stat.value}</span>
              <span className="text-xs text-[#2D3A27]/40 uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <div className="bg-[#FDFCF8] px-6 py-12 flex flex-col items-center gap-4">
        <div className="text-center mb-2">
          <p className="text-[#2D3A27]/40 text-sm">Impresso em capa dura · Enviado para qualquer país</p>
          <p className="font-serif text-4xl text-[#2D3A27] italic mt-1">€49</p>
        </div>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#2D3A27] text-[#E8E4D9] px-10 py-4 rounded-full font-semibold flex items-center gap-3 shadow-lg hover:bg-[#1B2616] transition-colors text-base"
        >
          Personalizar e encomendar
          <ArrowRight size={18} />
        </motion.button>
        <p className="text-xs text-[#2D3A27]/30 text-center max-w-xs">
          Pode ajustar a capa e o título antes de confirmar
        </p>
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
        <h2 className="font-serif text-3xl text-[#2D3A27] italic mb-2">Personalize a capa</h2>
        <p className="text-[#2D3A27]/50 text-sm">Escolha a foto de capa e o título do seu livro.</p>
      </div>

      {/* Preview da capa */}
      <div className="flex justify-center">
        <div className="relative w-48 rounded-lg overflow-hidden shadow-2xl">
          <img src={coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-4">
            <span className="text-white/60 text-xs uppercase tracking-widest self-end">Peregrino</span>
            <div>
              <p className="text-white font-serif italic text-sm leading-tight">{bookTitle}</p>
              <p className="text-white/50 text-xs mt-1">{DEMO_USER.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Escolha de foto */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">Foto de capa</p>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {allPhotos.map((photo, i) => (
            <button key={i} onClick={() => onChangeCover(photo)}
              className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all ${
                coverPhoto === photo ? 'ring-[#2D3A27] scale-105' : 'ring-transparent hover:ring-[#2D3A27]/30'
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
          type="text" value={bookTitle} onChange={e => onChangeTitle(e.target.value)} maxLength={60}
          className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-3 font-serif italic text-[#2D3A27] text-lg focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20"
        />
        <p className="text-xs text-[#2D3A27]/30 mt-1 text-right">{bookTitle.length}/60</p>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors">
          <ArrowLeft size={15} /> Voltar
        </button>
        <motion.button onClick={onNext} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="bg-[#2D3A27] text-[#E8E4D9] px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-[#1B2616] transition-colors"
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
      className="max-w-lg mx-auto px-6 py-12 flex flex-col gap-8"
    >
      <div className="text-center">
        <h2 className="font-serif text-3xl text-[#2D3A27] italic mb-2">Resumo do pedido</h2>
        <p className="text-[#2D3A27]/50 text-sm">Confirme os detalhes antes de pagar.</p>
      </div>

      <div className="bg-[#F5F2EA] rounded-3xl p-6 flex gap-5">
        <div className="w-20 rounded-xl overflow-hidden shadow-md shrink-0">
          <img src={coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-serif italic text-[#2D3A27] text-lg leading-tight">{bookTitle}</p>
          <p className="text-xs text-[#2D3A27]/40">{DEMO_USER.name}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <span className="text-xs text-[#2D3A27]/50">📸 {DEMO_USER.photos} fotos</span>
            <span className="text-xs text-[#2D3A27]/50">🗺️ {DEMO_USER.km} km</span>
            <span className="text-xs text-[#2D3A27]/50">🔖 {DEMO_USER.stamps} carimbos</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2 py-0.5 rounded-full">Capa dura</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2 py-0.5 rounded-full">~50 páginas</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2 py-0.5 rounded-full">Impressão A4</span>
          </div>
        </div>
      </div>

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

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <motion.button
        onClick={handleCheckout} disabled={loading}
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
      <p className="text-xs text-[#2D3A27]/30 text-center">
        Pagamento seguro via Stripe · Endereço de entrega solicitado no checkout
      </p>
    </motion.div>
  );
}
