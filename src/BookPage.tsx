import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import {
  ArrowLeft, ArrowRight, MapPin, Camera, Route,
  CreditCard, Check, ChevronLeft, ChevronRight,
  Shield, Globe, Package, BookOpen, Type, Image,
} from 'lucide-react';
import { useT } from './i18n';

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

const CAMINO_QUOTES = [
  'O caminho faz o peregrino.',
  'Não importa o quão devagar você vai, desde que não pare.',
  'Cada passo é uma oração.',
  'Santiago não é o destino — é onde o Caminho termina, não você.',
  'Buen Camino.',
  'Perguntas e não respostas — é o que o Caminho oferece.',
];

interface BookData {
  title: string;
  route: string;
  coverPhoto: string;
  openingPhrase: string;
  reflectionText: string;
  selectedPhotos: string[];
  caption1: string;
  caption2: string;
  caption3: string;
}

const DEFAULT_BOOK_DATA: BookData = {
  title: `${DEMO_USER.route}, ${new Date().getFullYear()}`,
  route: DEMO_USER.route,
  coverPhoto: DEMO_USER.allPhotos[0],
  openingPhrase: 'Comecei sem saber o que encontraria. Terminei diferente do que era.',
  reflectionText: 'Cada passo foi uma escolha. Cada noite foi um presente. O Caminho me ensinou que o destino não é Santiago — é quem você se torna ao longo dele.',
  selectedPhotos: DEMO_USER.allPhotos.slice(0, 8),
  caption1: 'Os primeiros passos foram os mais difíceis — e os mais inesquecíveis.',
  caption2: 'No meio do caminho, percebi que não estava mais sozinho.',
  caption3: 'Santiago chegou antes do esperado. Ou talvez eu é que tivesse chegado.',
};

type Step = 'reveal' | 'customize' | 'order';
type CustomizeTab = 'cover' | 'texts' | 'photos';
type ModelId = 'essential' | 'journey' | 'legacy';

const BOOK_MODELS: { id: ModelId; label: string; pages: number; price: string; desc: string; featured?: true }[] = [
  { id: 'essential', label: 'Essencial', pages: 50,  price: '€49,90', desc: 'As melhores memórias da sua jornada' },
  { id: 'journey',   label: 'Jornada',   pages: 100, price: '€74,90', desc: 'Uma narrativa completa do Caminho', featured: true },
  { id: 'legacy',    label: 'Legado',    pages: 150, price: '€99,90', desc: 'O registro definitivo da sua história' },
];

// ---------------------------------------------------------------------------
// Estrutura das 54 páginas — 50 layouts fotográficos + prefácio + selos
// ---------------------------------------------------------------------------
type PageKind =
  | 'cover' | 'preface' | 'back-cover' | 'stamps'
  | 'full-dark' | 'centered-dark' | 'large-white' | 'stacked-2'
  | 'grid-4-white' | 'stagger-4' | 'trio-h' | 'trio-v'
  | 'panorama-L' | 'panorama-R';

interface PageDef { kind: PageKind; p?: number | number[]; ck?: 'c1' | 'c2' | 'c3' }

const PAGE_DEFS: PageDef[] = [
  { kind: 'cover' },                              // 0
  { kind: 'preface' },                            // 1
  // ── Bloco 1 — spread 1/2 a 7/8
  { kind: 'stagger-4',    p: [0,1,2,3] },        // 2
  { kind: 'full-dark',    p: 4 },                // 3
  { kind: 'centered-dark',p: 5 },                // 4
  { kind: 'centered-dark',p: 6 },                // 5
  { kind: 'stacked-2',    p: [7,8] },            // 6
  { kind: 'large-white',  p: 9,  ck: 'c1' },     // 7  ← legenda 1
  { kind: 'panorama-L',   p: 10 },               // 8
  { kind: 'panorama-R',   p: 10 },               // 9
  // ── Bloco 2 — spread 9/10 a 15/16
  { kind: 'grid-4-white', p: [0,1,2,3] },        // 10
  { kind: 'grid-4-white', p: [4,5,6,7] },        // 11
  { kind: 'large-white',  p: 8 },                // 12
  { kind: 'stacked-2',    p: [9,10] },           // 13
  { kind: 'full-dark',    p: 0 },                // 14
  { kind: 'full-dark',    p: 1 },                // 15
  { kind: 'full-dark',    p: 2 },                // 16
  { kind: 'grid-4-white', p: [3,4,5,6] },        // 17
  // ── Bloco 3 — spread 17/18 a 23/24
  { kind: 'stagger-4',    p: [7,8,9,10] },       // 18
  { kind: 'full-dark',    p: 0 },                // 19
  { kind: 'full-dark',    p: 1 },                // 20
  { kind: 'full-dark',    p: 2 },                // 21
  { kind: 'stacked-2',    p: [3,4] },            // 22
  { kind: 'large-white',  p: 5,  ck: 'c2' },     // 23  ← legenda 2
  { kind: 'panorama-L',   p: 6 },                // 24
  { kind: 'panorama-R',   p: 6 },                // 25
  // ── Bloco 4 — spread 25/26 a 31/32
  { kind: 'trio-h',       p: [7,8,9] },          // 26
  { kind: 'trio-v',       p: [10,0,1] },         // 27
  { kind: 'large-white',  p: 2 },                // 28
  { kind: 'stacked-2',    p: [3,4] },            // 29
  { kind: 'full-dark',    p: 5 },                // 30
  { kind: 'full-dark',    p: 6 },                // 31
  { kind: 'full-dark',    p: 7 },                // 32
  { kind: 'grid-4-white', p: [8,9,10,0] },       // 33
  // ── Bloco 5 — spread 33/34 a 39/40
  { kind: 'grid-4-white', p: [1,2,3,4] },        // 34
  { kind: 'full-dark',    p: 5 },                // 35
  { kind: 'full-dark',    p: 6 },                // 36
  { kind: 'full-dark',    p: 7 },                // 37
  { kind: 'stacked-2',    p: [8,9] },            // 38
  { kind: 'large-white',  p: 10, ck: 'c3' },     // 39  ← legenda 3
  { kind: 'panorama-L',   p: 0 },                // 40
  { kind: 'panorama-R',   p: 0 },                // 41
  // ── Bloco 6 — spread 41/42 a 49/50
  { kind: 'grid-4-white', p: [1,2,3,4] },        // 42
  { kind: 'grid-4-white', p: [5,6,7,8] },        // 43
  { kind: 'large-white',  p: 9 },                // 44
  { kind: 'stacked-2',    p: [10,0] },           // 45
  { kind: 'full-dark',    p: 1 },                // 46
  { kind: 'full-dark',    p: 2 },                // 47
  { kind: 'full-dark',    p: 3 },                // 48
  { kind: 'grid-4-white', p: [4,5,6,7] },        // 49
  { kind: 'grid-4-white', p: [8,9,10,0] },       // 50
  { kind: 'large-white',  p: 1 },                // 51
  // ── Fechamento
  { kind: 'stamps' },                             // 52
  { kind: 'back-cover' },                         // 53
];

// ---------------------------------------------------------------------------
// Renderizador de páginas
// ---------------------------------------------------------------------------
function renderBookPage(
  def: PageDef,
  _idx: number,
  bookData: BookData,
  S: number,
  sp: (n: number) => string,
  fs: (n: number) => string,
) {
  const photos = bookData.selectedPhotos;
  const ph = (n: number) => photos[n % photos.length];
  const arr = def.p as number[];

  switch (def.kind) {

    // ── Capa ────────────────────────────────────────────────────────────────
    case 'cover':
      return (
        <div className="w-full h-full relative">
          <img src={bookData.coverPhoto} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.3) 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: sp(18) }}>
            <div className="flex justify-end">
              <span className="text-white/45 uppercase tracking-[0.25em]" style={{ fontSize: fs(0.52) }}>Peregrino</span>
            </div>
            <div>
              <div style={{ width: sp(28), height: '1px', background: 'rgba(255,255,255,0.35)', marginBottom: sp(10) }} />
              <p className="font-serif italic text-white leading-tight" style={{ fontSize: fs(1.1) }}>{bookData.title}</p>
              <p className="text-white/50 uppercase tracking-wider" style={{ fontSize: fs(0.58), marginTop: sp(6) }}>{DEMO_USER.name}</p>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 45%)' }} />
        </div>
      );

    // ── Prefácio (pág 1 — verso da capa + dados da jornada) ─────────────────
    case 'preface':
      return (
        <div className="w-full h-full bg-[#F5F2EA] flex flex-col justify-between" style={{ padding: sp(20) }}>
          <div>
            <p className="text-[#2D3A27]/25 uppercase tracking-[0.28em]" style={{ fontSize: fs(0.44) }}>Peregrino · Coffee Table Book</p>
            <div style={{ width: sp(22), height: '1px', background: 'rgba(45,58,39,0.15)', margin: `${sp(10)} 0` }} />
            <p className="font-serif italic text-[#2D3A27] leading-tight" style={{ fontSize: fs(1.25) }}>{bookData.title}</p>
          </div>
          <div className="flex flex-col" style={{ gap: sp(6) }}>
            {([
              ['Peregrino', DEMO_USER.name],
              ['Rota',      bookData.route],
              ['Início',    DEMO_USER.startDate],
              ['Chegada',   DEMO_USER.endDate],
              ['Distância', `${DEMO_USER.km} km`],
              ['Duração',   `${DEMO_USER.days} dias`],
              ['Carimbos',  `${DEMO_USER.stamps}`],
              ['Fotos',     `${DEMO_USER.photos}`],
            ] as [string,string][]).map(([k, v], i) => (
              <div key={i} className="flex justify-between" style={{ borderBottom: '1px solid rgba(45,58,39,0.08)', paddingBottom: sp(4) }}>
                <span className="text-[#2D3A27]/35 uppercase tracking-[0.12em]" style={{ fontSize: fs(0.48) }}>{k}</span>
                <span className="text-[#2D3A27]/70" style={{ fontSize: fs(0.48) }}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ width: sp(18), height: '1px', background: 'rgba(45,58,39,0.15)', marginBottom: sp(7) }} />
            <p className="font-serif italic text-[#2D3A27]/40 leading-relaxed" style={{ fontSize: fs(0.6) }}>
              "{bookData.openingPhrase}"
            </p>
          </div>
        </div>
      );

    // ── Full dark — foto sangrada, fundo escuro ──────────────────────────────
    case 'full-dark':
      return (
        <div className="w-full h-full relative">
          <img src={ph(def.p as number)} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />
        </div>
      );

    // ── Centered dark — 1 foto centralizada em fundo escuro ─────────────────
    case 'centered-dark':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: '#161c14', padding: sp(14) }}>
          <div className="w-full overflow-hidden" style={{ height: '65%' }}>
            <img src={ph(def.p as number)} className="w-full h-full object-cover" alt="" />
          </div>
          <p className="text-[#E8E4D9]/30 uppercase tracking-[0.22em] text-center" style={{ fontSize: fs(0.44), marginTop: sp(10) }}>
            {bookData.route} · {new Date().getFullYear()}
          </p>
        </div>
      );

    // ── Large white — 1 foto grande com margens, fundo creme ────────────────
    case 'large-white': {
      const caption = def.ck === 'c1' ? bookData.caption1 :
                      def.ck === 'c2' ? bookData.caption2 :
                      def.ck === 'c3' ? bookData.caption3 : null;
      return (
        <div className="w-full h-full flex flex-col justify-center bg-[#FDFCF8]" style={{ padding: sp(12) }}>
          <div className="w-full overflow-hidden" style={{ flex: caption ? '0 0 68%' : '0 0 80%', boxShadow: `0 ${sp(3)} ${sp(14)} rgba(0,0,0,0.14)` }}>
            <img src={ph(def.p as number)} className="w-full h-full object-cover" alt="" />
          </div>
          {caption ? (
            <p className="font-serif italic text-[#2D3A27]/60 leading-relaxed text-center" style={{ fontSize: fs(0.62), marginTop: sp(9), padding: `0 ${sp(4)}` }}>
              "{caption}"
            </p>
          ) : (
            <p className="font-serif italic text-[#2D3A27]/25 text-right" style={{ fontSize: fs(0.48), marginTop: sp(5) }}>
              {bookData.route}
            </p>
          )}
        </div>
      );
    }

    // ── Stacked 2 — 2 fotos empilhadas, fundo branco ────────────────────────
    case 'stacked-2':
      return (
        <div className="w-full h-full bg-[#FDFCF8]" style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: sp(4), padding: sp(10) }}>
          {arr.map((pi, i) => (
            <div key={i} className="overflow-hidden">
              <img src={ph(pi)} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      );

    // ── Grid 4 — 2×2 grade, fundo branco ────────────────────────────────────
    case 'grid-4-white':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: sp(3), padding: sp(8) }}>
          {arr.map((pi, i) => (
            <div key={i} className="overflow-hidden">
              <img src={ph(pi)} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      );

    // ── Stagger 4 — collage assimétrica com offset vertical ─────────────────
    case 'stagger-4':
      return (
        <div className="w-full h-full bg-[#FDFCF8]" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp(3), padding: sp(8) }}>
          <div style={{ display: 'grid', gridTemplateRows: '46% 50%', gap: sp(3) }}>
            <div className="overflow-hidden"><img src={ph(arr[0])} className="w-full h-full object-cover" alt="" /></div>
            <div className="overflow-hidden"><img src={ph(arr[2])} className="w-full h-full object-cover" alt="" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '50% 46%', gap: sp(3), marginTop: sp(10) }}>
            <div className="overflow-hidden"><img src={ph(arr[1])} className="w-full h-full object-cover" alt="" /></div>
            <div className="overflow-hidden"><img src={ph(arr[3])} className="w-full h-full object-cover" alt="" /></div>
          </div>
        </div>
      );

    // ── Trio H — 2 fotos em cima + 1 larga embaixo ──────────────────────────
    case 'trio-h':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateRows: '54% 42%', gridTemplateColumns: '1fr 1fr', gap: sp(3), padding: sp(8) }}>
          <div className="overflow-hidden"><img src={ph(arr[0])} className="w-full h-full object-cover" alt="" /></div>
          <div className="overflow-hidden"><img src={ph(arr[1])} className="w-full h-full object-cover" alt="" /></div>
          <div className="overflow-hidden" style={{ gridColumn: '1 / 3' }}>
            <img src={ph(arr[2])} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      );

    // ── Trio V — 1 foto coluna esquerda + 2 empilhadas à direita ────────────
    case 'trio-v':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateColumns: '52% 44%', gridTemplateRows: '1fr 1fr', gap: sp(3), padding: sp(8) }}>
          <div className="overflow-hidden" style={{ gridRow: '1 / 3' }}>
            <img src={ph(arr[0])} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="overflow-hidden"><img src={ph(arr[1])} className="w-full h-full object-cover" alt="" /></div>
          <div className="overflow-hidden"><img src={ph(arr[2])} className="w-full h-full object-cover" alt="" /></div>
        </div>
      );

    // ── Panorama — foto contínua cruzando a lombada (metade L e R) ──────────
    case 'panorama-L':
      return (
        <div className="w-full h-full overflow-hidden" style={{ background: '#141a12' }}>
          <img src={ph(def.p as number)} className="w-full h-full object-cover"
            style={{ objectPosition: '0% center' }} alt="" />
        </div>
      );

    case 'panorama-R':
      return (
        <div className="w-full h-full overflow-hidden" style={{ background: '#141a12' }}>
          <img src={ph(def.p as number)} className="w-full h-full object-cover"
            style={{ objectPosition: '100% center' }} alt="" />
        </div>
      );

    // ── Selos — grade dinâmica de carimbos da credencial ────────────────────
    case 'stamps': {
      const total = DEMO_USER.stamps;
      const cols = total <= 12 ? 3 : total <= 20 ? 4 : total <= 32 ? 5 : 6;
      return (
        <div className="w-full h-full bg-[#FDFCF8] flex flex-col" style={{ padding: sp(14) }}>
          <p className="text-[#2D3A27]/25 uppercase tracking-[0.28em] text-center" style={{ fontSize: fs(0.44), marginBottom: sp(10) }}>
            Carimbos da Credencial
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: sp(3), flex: 1 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="flex items-center justify-center border border-[#2D3A27]/10 bg-[#F5F2EA]"
                style={{ borderRadius: sp(2) }}>
                <p className="font-serif italic text-[#2D3A27]/20" style={{ fontSize: fs(0.5) }}>{i + 1}</p>
              </div>
            ))}
          </div>
          <p className="text-[#2D3A27]/20 text-center" style={{ fontSize: fs(0.42), marginTop: sp(7) }}>
            {bookData.route} · {DEMO_USER.startDate} — {DEMO_USER.endDate}
          </p>
        </div>
      );
    }

    // ── Contracapa ───────────────────────────────────────────────────────────
    case 'back-cover':
      return (
        <div className="w-full h-full flex flex-col justify-between bg-[#1B2616]" style={{ padding: sp(20) }}>
          <div className="flex justify-end">
            <span className="text-[#E8E4D9]/30 uppercase tracking-widest" style={{ fontSize: fs(0.5) }}>Peregrino</span>
          </div>
          <div className="text-center">
            <p className="font-serif italic text-[#E8E4D9]/20" style={{ fontSize: fs(0.8) }}>peregrino.app</p>
          </div>
        </div>
      );

    default:
      return <div className="w-full h-full bg-[#FDFCF8]" />;
  }
}

// ---------------------------------------------------------------------------
// Hook — contagem animada
// ---------------------------------------------------------------------------
function useCountUp(target: number, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return value;
}

// ---------------------------------------------------------------------------
// Hook — tamanho do livro
// ---------------------------------------------------------------------------
function useBookSize() {
  const [size, setSize] = useState({ w: 340, h: 453 });
  useEffect(() => {
    const upd = () => {
      const vw = window.innerWidth;
      if (vw < 640)       setSize({ w: 165, h: 220 });
      else if (vw < 1024) setSize({ w: 270, h: 360 });
      else                setSize({ w: 440, h: 587 });
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);
  return size;
}

// ---------------------------------------------------------------------------
// BookPage root
// ---------------------------------------------------------------------------
export default function BookPage() {
  const { t } = useT();
  const [step, setStep] = useState<Step>('reveal');
  const [bookData, setBookData] = useState<BookData>(() => {
    const route = t('bp.demo.route');
    return {
      ...DEFAULT_BOOK_DATA,
      route,
      title: `${route}, ${new Date().getFullYear()}`,
    };
  });
  const [selectedModel, setSelectedModel] = useState<ModelId>('journey');
  const [hasCustomized, setHasCustomized] = useState(false);
  const update = (patch: Partial<BookData>) => setBookData(p => ({ ...p, ...patch }));

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1B2616]/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#E8E4D9]/50 hover:text-[#E8E4D9] transition-colors text-sm">
          <ArrowLeft size={15} /><span className="hidden sm:inline">{t('bp.back')}</span>
        </Link>
        <img src="/img-apoio/logo-sf.png" alt="Peregrino" className="h-8 object-contain" style={{ filter: 'brightness(0) invert(1) opacity(0.85)' }} />
        <div className="w-24" />
      </header>

      <div className="pt-[56px]">
        <AnimatePresence mode="wait">
          {step === 'reveal' && (
            <StepReveal key="r" bookData={bookData}
              selectedModel={selectedModel} onSelectModel={setSelectedModel}
              hasCustomized={hasCustomized}
              onCustomize={() => setStep('customize')}
              onOrder={() => setStep('order')} />
          )}
          {step === 'customize' && (
            <StepCustomize key="c" bookData={bookData} onChange={update}
              selectedModel={selectedModel} onSelectModel={setSelectedModel}
              onDone={() => { setHasCustomized(true); setStep('reveal'); }}
              onBack={() => setStep('reveal')} />
          )}
          {step === 'order' && (
            <StepOrder key="o" bookData={bookData}
              selectedModel={selectedModel}
              onBack={() => setStep('reveal')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FlipPage wrapper
// ---------------------------------------------------------------------------
const FlipPage = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
  ({ children }, ref) => (
    <div ref={ref} className="overflow-hidden" style={{ background: '#FDFCF8' }}>{children}</div>
  )
);
FlipPage.displayName = 'FlipPage';

// ---------------------------------------------------------------------------
// Livro interativo — 50 páginas
// ---------------------------------------------------------------------------
function InteractiveBook({ bookData }: { bookData: BookData }) {
  const { t } = useT();
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const { w, h } = useBookSize();
  const TOTAL = PAGE_DEFS.length;

  const goNext = () => bookRef.current?.pageFlip().flipNext();
  const goPrev = () => bookRef.current?.pageFlip().flipPrev();

  const S = w / 400;
  const sp = (n: number) => `${n * S}px`;
  const fs = (n: number) => `${n * S}rem`;

  return (
    <div className="flex flex-col items-center gap-6 w-full">

      {/* ── Wrapper com altura mínima para não colapsar durante a transição ── */}
      <div className="relative flex flex-col items-center" style={{ minWidth: `${w * 2 + 40}px`, minHeight: `${h}px` }}>

        {/* ── LIVRO FECHADO — sempre montado, visível apenas quando fechado ── */}
        <motion.div
          animate={{ opacity: bookOpen ? 0 : 1, scale: bookOpen ? 0.92 : 1, y: bookOpen ? -20 : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-7"
          style={{ pointerEvents: bookOpen ? 'none' : 'auto', position: bookOpen ? 'absolute' : 'relative' }}
        >
          <motion.button
            onClick={() => setBookOpen(true)}
            className="relative cursor-pointer"
            whileHover={{ y: -14, transition: { duration: 0.35, ease: 'easeOut' } }}
            whileTap={{ scale: 0.97 }}
            style={{ filter: 'drop-shadow(-20px 32px 80px rgba(0,0,0,0.8)) drop-shadow(-6px 10px 24px rgba(0,0,0,0.45))' }}
          >
            {/* Lombada */}
            <div className="absolute left-0 top-0 bottom-0 z-10 rounded-l-sm" style={{
              width: `${Math.round(w * 0.054)}px`,
              background: 'linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.22) 40%, rgba(255,255,255,0.08) 65%, rgba(0,0,0,0.15))',
            }} />
            {/* Capa */}
            <div className="relative rounded-r-xl rounded-l-sm overflow-hidden" style={{ width: `${w}px`, height: `${h}px` }}>
              <img src={bookData.coverPhoto} className="w-full h-full object-cover" alt="Capa" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.22) 100%)' }} />
              <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: sp(22) }}>
                <span className="self-end text-white/40 uppercase tracking-[0.25em]" style={{ fontSize: fs(0.5) }}>Peregrino</span>
                <div>
                  <div style={{ width: sp(30), height: '1px', background: 'rgba(255,255,255,0.28)', marginBottom: sp(12) }} />
                  <p className="font-serif italic text-white leading-tight" style={{ fontSize: fs(1.05) }}>{bookData.title}</p>
                  <p className="text-white/45 uppercase tracking-wider" style={{ fontSize: fs(0.56), marginTop: sp(8) }}>{DEMO_USER.name}</p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%)' }} />
            </div>
          </motion.button>

          <div className="flex flex-col items-center gap-3">
            <motion.button
              onClick={() => setBookOpen(true)}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="text-[#E8E4D9] text-xs uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
            >
              {t('bp.click_book')}
            </motion.button>
            <p className="text-[#E8E4D9]/60 text-xs max-w-[220px] text-center leading-relaxed">
              {t('bp.pages_desc')}
            </p>
          </div>
        </motion.div>

        {/* ── LIVRO ABERTO — sempre montado, visível apenas quando aberto ── */}
        <motion.div
          animate={{ opacity: bookOpen ? 1 : 0, scale: bookOpen ? 1 : 0.96 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-5"
          style={{ pointerEvents: bookOpen ? 'auto' : 'none', position: bookOpen ? 'relative' : 'absolute' }}
        >
          <div style={{ filter: 'drop-shadow(0 50px 100px rgba(0,0,0,0.72)) drop-shadow(0 12px 24px rgba(0,0,0,0.35))' }}>
            {/* @ts-ignore */}
            <HTMLFlipBook
              ref={bookRef} width={w} height={h} size="fixed"
              minWidth={w} maxWidth={w} minHeight={h} maxHeight={h}
              drawShadow={true} flippingTime={700} usePortrait={false}
              startZIndex={10} autoSize={false} clickEventForward={true}
              useMouseEvents={true} swipeDistance={30} showPageCorners={true}
              disableFlipByClick={false} style={{}} className="" startPage={0}
              onFlip={(e: any) => setPage(e.data)}
            >
              {PAGE_DEFS.map((def, idx) => (
                <FlipPage key={idx}>
                  {renderBookPage(def, idx + 1, bookData, S, sp, fs)}
                </FlipPage>
              ))}
            </HTMLFlipBook>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={page === 0 ? () => setBookOpen(false) : goPrev}
              className="w-10 h-10 rounded-full bg-[#E8E4D9]/15 flex items-center justify-center hover:bg-[#E8E4D9]/30 transition-colors"
            >
              <ChevronLeft size={18} className="text-[#E8E4D9]" />
            </button>
            <span className="text-[#E8E4D9]/70 text-xs tabular-nums min-w-[5.5rem] text-center">
              {page === 0 ? 'Capa' : page >= TOTAL - 1 ? 'Contracapa' : `pág. ${page + 1} / ${TOTAL}`}
            </span>
            <button onClick={goNext} disabled={page >= TOTAL - 1}
              className="w-10 h-10 rounded-full bg-[#E8E4D9]/15 flex items-center justify-center hover:bg-[#E8E4D9]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} className="text-[#E8E4D9]" />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Revelação
// ---------------------------------------------------------------------------
function StepReveal({ bookData, selectedModel, onSelectModel, hasCustomized, onCustomize, onOrder }: {
  bookData: BookData;
  selectedModel: ModelId;
  onSelectModel: (m: ModelId) => void;
  hasCustomized: boolean;
  onCustomize: () => void;
  onOrder: () => void;
}) {
  const { t } = useT();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const aKm     = useCountUp(DEMO_USER.km,     1200, statsVisible);
  const aDays   = useCountUp(DEMO_USER.days,   900,  statsVisible);
  const aStamps = useCountUp(DEMO_USER.stamps, 800,  statsVisible);
  const aPhotos = useCountUp(DEMO_USER.photos, 1100, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>

      {/* ── Bloco único: headline + livro + stats ── */}
      <div className="bg-[#1B2616] bg-noise relative overflow-hidden">
        {/* Luz ambiente */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C8A96E]/6 rounded-full blur-[140px] pointer-events-none" />

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative z-10 text-center px-6 pt-8 md:pt-10 pb-8"
        >
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#E8E4D9] italic leading-[1.08] tracking-tight">
            {t('bp.headline')}
          </h1>
        </motion.div>

        {/* Livro */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1, type: 'spring', damping: 16 }}
          className="relative z-10 flex justify-center px-4 pb-6"
        >
          <InteractiveBook bookData={bookData} />
        </motion.div>

        {/* Botão Personalizar — logo abaixo do livro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="relative z-10 flex justify-center pb-10"
        >
          <motion.button
            onClick={onCustomize}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(232,228,217,0.18)' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-3 rounded-full border border-[#E8E4D9]/25 bg-[#E8E4D9]/10 text-[#E8E4D9] text-sm font-medium transition-colors"
          >
            <Type size={14} /> {t('bp.customize')}
          </motion.button>
        </motion.div>

        {/* Stats — tipografia editorial, sem cards */}
        <div
          ref={statsRef}
          className="relative z-10 border-t px-6 py-10"
          style={{ borderColor: 'rgba(200,169,110,0.15)' }}
        >
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x"
            style={{ divideColor: 'rgba(200,169,110,0.12)' } as React.CSSProperties}
          >
            {[
              { value: aKm,     unit: 'km', label: t('bp.stat.km') },
              { value: aDays,   unit: '',   label: t('bp.stat.days') },
              { value: aStamps, unit: '',   label: t('bp.stat.stamps') },
              { value: aPhotos, unit: '',   label: t('bp.stat.photos') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: statsVisible ? 1 : 0, y: statsVisible ? 0 : 12 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center py-4 px-4"
              >
                <span
                  className="font-serif italic tabular-nums leading-none"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#C8A96E' }}
                >
                  {stat.value}
                  {stat.unit && <span style={{ fontSize: '55%', marginLeft: '0.2em' }}>{stat.unit}</span>}
                </span>
                <span className="text-[#E8E4D9]/55 text-xs uppercase tracking-widest mt-2">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modelos — clicáveis para selecionar e personalizar ── */}
      <div className="bg-[#0D1509] px-6 py-16 flex flex-col items-center gap-6 text-center">
        <p className="text-[#C8A96E]/50 text-xs uppercase tracking-[0.35em]">
          {t('bp.format')}
        </p>
        <p className="text-[#E8E4D9]/50 text-sm">{t('bp.choose')}</p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          {BOOK_MODELS.map((m) => {
            const active = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { onSelectModel(m.id); onCustomize(); }}
                className={`flex-1 flex flex-col items-center gap-1 rounded-2xl py-5 px-3 transition-all duration-200 cursor-pointer ${
                  active
                    ? 'scale-[1.04]'
                    : 'hover:border-[#C8A96E]/30'
                }`}
                style={{
                  background: active ? 'rgba(200,169,110,0.16)' : 'rgba(255,255,255,0.04)',
                  border: active ? '1px solid rgba(200,169,110,0.45)' : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {m.featured && <span className="text-[#C8A96E]/55 text-[0.55rem] uppercase tracking-widest mb-0.5">{t('bp.popular')}</span>}
                <p className="text-[#C8A96E]/70 text-xs uppercase tracking-[0.2em]">{m.label}</p>
                <p className="font-serif italic text-[#E8E4D9]" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>{m.price}</p>
                <p className="text-[#E8E4D9]/60 text-xs">{m.pages} páginas</p>
              </button>
            );
          })}
        </div>

        <p className="text-[#E8E4D9]/50 text-xs">{t('bp.shipping')}</p>

        {hasCustomized ? (
          <motion.button
            onClick={onOrder}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04, backgroundColor: '#ffffff' }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#E8E4D9] text-[#0D1509] px-14 py-5 rounded-full font-bold text-lg flex items-center gap-3 mt-2 transition-colors"
            style={{ boxShadow: '0 0 60px rgba(200,169,110,0.25), 0 8px 32px rgba(0,0,0,0.5)' }}
          >
            {t('bp.order')} <ArrowRight size={20} />
          </motion.button>
        ) : (
          <p className="text-[#E8E4D9]/30 text-xs max-w-xs">
            {t('bp.hint')}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Personalizar (3 abas)
// ---------------------------------------------------------------------------
function StepCustomize({ bookData, onChange, selectedModel, onSelectModel, onDone, onBack }: {
  bookData: BookData;
  onChange: (p: Partial<BookData>) => void;
  selectedModel: ModelId;
  onSelectModel: (m: ModelId) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const { t } = useT();
  const [tab, setTab] = useState<CustomizeTab>('cover');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">{t('bp.s2.title')}</h2>
        <p className="text-[#2D3A27]/50 text-sm">{t('bp.s2.sub')}</p>
      </div>

      {/* Seletor de modelo */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">{t('bp.s2.model')}</p>
        <div className="flex gap-3">
          {BOOK_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectModel(m.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 rounded-2xl py-3 px-2 border transition-all duration-200 ${
                selectedModel === m.id
                  ? 'bg-[#2D3A27] border-[#2D3A27] text-[#E8E4D9]'
                  : 'bg-[#F5F2EA] border-[#2D3A27]/10 text-[#2D3A27]/50 hover:border-[#2D3A27]/30'
              }`}
            >
              <span className="text-xs font-semibold">{m.label}</span>
              <span className={`text-[0.65rem] ${selectedModel === m.id ? 'text-[#E8E4D9]/60' : 'text-[#2D3A27]/35'}`}>{m.price} · {m.pages} pág.</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex bg-[#F5F2EA] rounded-2xl p-1 gap-1">
        {([
          { id: 'cover' as const,  label: t('bp.s2.tab.cover'),  icon: <BookOpen size={14} /> },
          { id: 'texts' as const,  label: t('bp.s2.tab.texts'),  icon: <Type size={14} /> },
          { id: 'photos' as const, label: t('bp.s2.tab.photos'), icon: <Image size={14} /> },
        ]).map(tab_ => (
          <button key={tab_.id} onClick={() => setTab(tab_.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === tab_.id ? 'bg-white text-[#2D3A27] shadow-sm' : 'text-[#2D3A27]/40 hover:text-[#2D3A27]/70'}`}
          >
            {tab_.icon}{tab_.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'cover' && (
          <motion.div key="cover" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
            <div className="flex justify-center">
              <div style={{ filter: 'drop-shadow(-10px 20px 50px rgba(0,0,0,0.35))' }}>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-5 z-10 rounded-l-sm" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.18) 40%, rgba(255,255,255,0.06) 65%, rgba(0,0,0,0.12))' }} />
                  <div className="relative w-52 md:w-60 rounded-r-lg rounded-l-sm overflow-hidden">
                    <img src={bookData.coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
                    <div className="absolute inset-0 flex flex-col justify-between p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.2) 100%)' }}>
                      <span className="text-white/60 text-xs uppercase tracking-widest self-end">Peregrino</span>
                      <div>
                        <p className="text-white font-serif italic text-sm leading-tight">{bookData.title}</p>
                        <p className="text-white/50 text-xs mt-1.5 uppercase tracking-wider">{DEMO_USER.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">{t('bp.s2.cover_photo')}</p>
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
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">{t('bp.s2.title_label')}</p>
              <input type="text" value={bookData.title} maxLength={60} onChange={e => onChange({ title: e.target.value })}
                placeholder="Ex: Caminho Francês, 2026"
                className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-4 font-serif italic text-[#2D3A27] text-lg focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20"
              />
              <p className="text-xs text-[#2D3A27]/25 mt-2 text-right">{bookData.title.length}/60</p>
            </div>
          </motion.div>
        )}

        {tab === 'texts' && (
          <motion.div key="texts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Frase de abertura</p>
              <p className="text-xs text-[#2D3A27]/30 mb-3">Aparece na página 4, logo após a capa</p>
              <div className="bg-[#F5F2EA] rounded-2xl p-5 mb-3 border border-[#2D3A27]/5">
                <p className="text-[#2D3A27]/25 text-xs uppercase tracking-widest mb-2">Prévia</p>
                <p className="font-serif italic text-[#2D3A27] text-base leading-relaxed">"{bookData.openingPhrase}"</p>
                <p className="text-[#2D3A27]/30 text-xs mt-2">— {DEMO_USER.name}</p>
              </div>
              <textarea value={bookData.openingPhrase} maxLength={160} onChange={e => onChange({ openingPhrase: e.target.value })} rows={3}
                placeholder="Uma frase que resume o que o Caminho significou para você..."
                className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-4 font-serif italic text-[#2D3A27] text-base focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20 resize-none"
              />
              <p className="text-xs text-[#2D3A27]/25 mt-1 text-right">{bookData.openingPhrase.length}/160</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Sua reflexão</p>
              <p className="text-xs text-[#2D3A27]/30 mb-3">Aparece na página 45, próxima à contracapa</p>
              <div className="bg-[#F5F2EA] rounded-2xl p-5 mb-3 border border-[#2D3A27]/5">
                <p className="text-[#2D3A27]/25 text-xs uppercase tracking-widest mb-2">Prévia</p>
                <p className="font-serif italic text-[#2D3A27] text-sm leading-relaxed">"{bookData.reflectionText}"</p>
              </div>
              <textarea value={bookData.reflectionText} maxLength={400} onChange={e => onChange({ reflectionText: e.target.value })} rows={5}
                placeholder="Escreva sobre o que viveu, aprendeu ou sentiu durante o Caminho..."
                className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-2xl px-5 py-4 font-serif italic text-[#2D3A27] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20 resize-none"
              />
              <p className="text-xs text-[#2D3A27]/25 mt-1 text-right">{bookData.reflectionText.length}/400</p>
            </div>
            <div className="border-t border-[#2D3A27]/8 pt-6">
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Legendas das fotos</p>
              <p className="text-xs text-[#2D3A27]/35 mb-5">Três frases curtas distribuídas ao longo do livro, ao lado das fotos em destaque.</p>
              {([
                { key: 'caption1' as const, label: 'Legenda 1', hint: 'Início da jornada — págs. 7–8', val: bookData.caption1 },
                { key: 'caption2' as const, label: 'Legenda 2', hint: 'Meio do caminho — págs. 23–24', val: bookData.caption2 },
                { key: 'caption3' as const, label: 'Legenda 3', hint: 'Chegada — págs. 39–40', val: bookData.caption3 },
              ]).map(({ key, label, hint, val }) => (
                <div key={key} className="mb-5">
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-xs font-medium text-[#2D3A27]/50">{label}</p>
                    <p className="text-[0.6rem] text-[#2D3A27]/25">{hint}</p>
                  </div>
                  <textarea value={val} maxLength={120} onChange={e => onChange({ [key]: e.target.value })} rows={2}
                    placeholder="Uma frase sobre este momento..."
                    className="w-full bg-[#F5F2EA] border border-[#2D3A27]/10 rounded-xl px-4 py-3 font-serif italic text-[#2D3A27] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20 resize-none"
                  />
                  <p className="text-xs text-[#2D3A27]/25 mt-1 text-right">{val.length}/120</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'photos' && (
          <motion.div key="photos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Fotos interiores</p>
              <p className="text-xs text-[#2D3A27]/35">Selecione de 4 a 8 fotos favoritas. Serão distribuídas pelos layouts internos do livro.</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {DEMO_USER.allPhotos.map((photo, i) => {
                const selected = bookData.selectedPhotos.includes(photo);
                const idx = bookData.selectedPhotos.indexOf(photo);
                return (
                  <button key={i} onClick={() => {
                    if (selected) {
                      if (bookData.selectedPhotos.length > 4) onChange({ selectedPhotos: bookData.selectedPhotos.filter(p => p !== photo) });
                    } else if (bookData.selectedPhotos.length < 8) {
                      onChange({ selectedPhotos: [...bookData.selectedPhotos, photo] });
                    }
                  }} className={`relative aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-200 ${selected ? 'ring-[#2D3A27] scale-105' : 'ring-transparent hover:ring-[#2D3A27]/25'}`}>
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    {selected && (
                      <div className="absolute inset-0 bg-[#2D3A27]/40 flex items-center justify-center">
                        <span className="w-7 h-7 bg-[#2D3A27] rounded-full flex items-center justify-center text-[#E8E4D9] text-xs font-bold">{idx + 1}</span>
                      </div>
                    )}
                    {!selected && bookData.selectedPhotos.length >= 8 && <div className="absolute inset-0 bg-black/30" />}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-[#2D3A27]/40">
              {bookData.selectedPhotos.length} de 8 selecionadas
              {bookData.selectedPhotos.length >= 8 && <span className="text-[#2D3A27]/60 ml-1">· máximo atingido</span>}
              {bookData.selectedPhotos.length < 4 && <span className="text-amber-600/70 ml-1">· mínimo 4</span>}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-4 border-t border-[#2D3A27]/8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors">
          <ArrowLeft size={15} /> {t('bp.s2.back')}
        </button>
        <motion.button onClick={onDone} disabled={bookData.selectedPhotos.length < 4}
          whileHover={bookData.selectedPhotos.length >= 4 ? { scale: 1.03 } : {}}
          whileTap={bookData.selectedPhotos.length >= 4 ? { scale: 0.97 } : {}}
          className="bg-[#2D3A27] text-[#E8E4D9] px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 hover:bg-[#1B2616] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('bp.s2.done')} <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Resumo e checkout
// ---------------------------------------------------------------------------
function StepOrder({ bookData, selectedModel, onBack }: { bookData: BookData; selectedModel: ModelId; onBack: () => void }) {
  const { t } = useT();
  const model = BOOK_MODELS.find(m => m.id === selectedModel) ?? BOOK_MODELS[1];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ successUrl: `${window.location.origin}/sucesso`, cancelUrl: `${window.location.origin}/book` }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(t('bp.s3.error')); }
    } catch { setError(t('bp.s3.error_conn')); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-lg mx-auto px-6 py-12 flex flex-col gap-7">
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">{t('bp.s3.title')}</h2>
        <p className="text-[#2D3A27]/50 text-sm">{t('bp.s3.sub')}</p>
      </div>

      <div className="bg-[#F5F2EA] rounded-3xl p-6 flex gap-5">
        <div className="w-20 rounded-xl overflow-hidden shrink-0" style={{ boxShadow: '-4px 6px 20px rgba(0,0,0,0.25)' }}>
          <img src={bookData.coverPhoto} alt="Capa" className="w-full aspect-[3/4] object-cover" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-serif italic text-[#2D3A27] text-lg leading-tight">{bookData.title}</p>
          <p className="text-xs text-[#2D3A27]/40 uppercase tracking-wider">{DEMO_USER.name}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">📸 {DEMO_USER.photos} {t('bp.stat.photos')}</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">🗺️ {DEMO_USER.km} km</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">{t('bp.s3.ondemand')}</span>
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">{model.pages} p. · A4</span>
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">{model.label}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#2D3A27]/8">
        <div className="flex justify-between text-sm text-[#2D3A27] mb-2"><span>Coffee Table Book — {model.label}</span><span>{model.price}</span></div>
        <div className="flex justify-between text-xs text-[#2D3A27]/40 mb-1"><span>{model.pages} p. · A4</span><span></span></div>
        <div className="flex justify-between text-xs text-[#2D3A27]/40 mb-4"><span>{t('bp.s3.shipping')}</span><span>{t('bp.s3.shipping_val')}</span></div>
        <div className="border-t border-[#2D3A27]/8 pt-4 flex justify-between font-semibold text-[#2D3A27]">
          <span>{t('bp.s3.subtotal')}</span><span className="font-serif italic text-xl">{model.price}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Shield size={15} />, label: t('bp.s3.secure'),   sub: 'via Stripe' },
          { icon: <Globe size={15} />,  label: t('bp.s3.global'),   sub: '140+ países' },
          { icon: <Package size={15} />,label: t('bp.s3.ondemand'), sub: 'Lulu.com' },
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
        {loading
          ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{t('bp.s3.preparing')}</>
          : <><CreditCard size={18} />{t('bp.s3.confirm')}</>
        }
      </motion.button>

      <button onClick={onBack} className="text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors text-center">{t('bp.s3.back')}</button>
    </motion.div>
  );
}
