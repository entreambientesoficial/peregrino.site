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
// Estrutura das 48 páginas do livro
// ---------------------------------------------------------------------------
type PageKind =
  | 'cover' | 'endpaper-front' | 'half-title' | 'phrase'
  | 'route-intro' | 'stats'
  | 'photo-full' | 'photo-editorial' | 'photo-statement' | 'photo-framed'
  | 'collage-2' | 'collage-2-v' | 'grid-3' | 'grid-3-v' | 'grid-4'
  | 'quote' | 'milestone' | 'reflection' | 'closing'
  | 'endpaper-back' | 'back-cover';

interface PageDef { kind: PageKind; p?: number | number[]; q?: number }

const PAGE_DEFS: PageDef[] = [
  { kind: 'cover' },                              // 0
  { kind: 'endpaper-front' },                     // 1
  { kind: 'half-title' },                         // 2
  { kind: 'phrase' },                             // 3
  { kind: 'route-intro' },                        // 4
  { kind: 'stats' },                              // 5
  { kind: 'photo-full', p: 0 },                  // 6
  { kind: 'photo-editorial', p: 1 },             // 7
  { kind: 'collage-2', p: [2, 3] },             // 8
  { kind: 'grid-3', p: [4, 5, 6] },             // 9
  { kind: 'quote', q: 0 },                       // 10
  { kind: 'photo-statement', p: 7 },             // 11
  { kind: 'photo-framed', p: 8 },               // 12
  { kind: 'milestone' },                          // 13
  { kind: 'grid-4', p: [9, 10, 0, 1] },         // 14
  { kind: 'collage-2-v', p: [2, 3] },           // 15
  { kind: 'photo-full', p: 4 },                  // 16
  { kind: 'quote', q: 1 },                       // 17
  { kind: 'grid-3-v', p: [5, 6, 7] },           // 18
  { kind: 'photo-editorial', p: 8 },             // 19
  { kind: 'photo-statement', p: 9 },             // 20
  { kind: 'grid-3', p: [10, 0, 1] },            // 21
  { kind: 'photo-full', p: 2 },                  // 22
  { kind: 'quote', q: 2 },                       // 23
  { kind: 'grid-4', p: [3, 4, 5, 6] },          // 24
  { kind: 'photo-framed', p: 7 },               // 25
  { kind: 'collage-2', p: [8, 9] },            // 26
  { kind: 'photo-statement', p: 10 },            // 27
  { kind: 'photo-full', p: 0 },                  // 28
  { kind: 'grid-3', p: [1, 2, 3] },             // 29
  { kind: 'quote', q: 3 },                       // 30
  { kind: 'photo-full', p: 4 },                  // 31
  { kind: 'grid-4', p: [5, 6, 7, 8] },          // 32
  { kind: 'photo-editorial', p: 9 },             // 33
  { kind: 'collage-2-v', p: [10, 0] },          // 34
  { kind: 'photo-statement', p: 1 },             // 35
  { kind: 'photo-full', p: 2 },                  // 36
  { kind: 'grid-3-v', p: [3, 4, 5] },           // 37
  { kind: 'quote', q: 4 },                       // 38
  { kind: 'grid-3', p: [6, 7, 8] },             // 39
  { kind: 'photo-full', p: 9 },                  // 40
  { kind: 'photo-framed', p: 10 },              // 41
  { kind: 'collage-2', p: [0, 1] },            // 42
  { kind: 'quote', q: 5 },                       // 43
  { kind: 'reflection' },                         // 44
  { kind: 'closing' },                            // 45
  { kind: 'endpaper-back' },                      // 46
  { kind: 'back-cover' },                         // 47
];

// ---------------------------------------------------------------------------
// Renderizador de páginas
// ---------------------------------------------------------------------------
function renderBookPage(
  def: PageDef,
  idx: number,
  bookData: BookData,
  S: number,
  sp: (n: number) => string,
  fs: (n: number) => string,
) {
  const photos = bookData.selectedPhotos;
  const ph = (n: number) => photos[(n as number) % photos.length];
  const phArr = (arr: number[]) => arr.map(n => ph(n));

  switch (def.kind) {

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

    case 'endpaper-front':
      return (
        <div className="w-full h-full bg-[#2D3A27] flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #1B2616 0%, #2D3A27 60%, #1e2d1a 100%)' }}>
          <div className="opacity-10 absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(232,228,217,0.15) 20px, rgba(232,228,217,0.15) 21px)' }} />
          <div className="text-center" style={{ padding: sp(20) }}>
            <p className="font-serif italic text-[#E8E4D9]/30" style={{ fontSize: fs(1.8) }}>P</p>
          </div>
        </div>
      );

    case 'half-title':
      return (
        <div className="w-full h-full bg-[#FDFCF8] flex flex-col justify-center items-center text-center" style={{ padding: sp(24) }}>
          <div style={{ width: sp(20), height: '1px', background: 'rgba(45,58,39,0.2)', marginBottom: sp(16) }} />
          <p className="text-[#2D3A27]/25 uppercase tracking-[0.35em]" style={{ fontSize: fs(0.5) }}>Coffee Table Book</p>
          <p className="font-serif italic text-[#2D3A27] leading-tight" style={{ fontSize: fs(1.15), marginTop: sp(10) }}>{bookData.title}</p>
          <div style={{ width: sp(20), height: '1px', background: 'rgba(45,58,39,0.2)', margin: `${sp(16)} auto` }} />
          <p className="text-[#2D3A27]/40" style={{ fontSize: fs(0.6) }}>{DEMO_USER.name}</p>
          <p className="text-[#2D3A27]/25" style={{ fontSize: fs(0.52), marginTop: sp(4) }}>{DEMO_USER.startDate} — {DEMO_USER.endDate}</p>
        </div>
      );

    case 'phrase':
      return (
        <div className="w-full h-full bg-[#FDFCF8] flex flex-col justify-center" style={{ padding: sp(22) }}>
          <p className="text-[#2D3A27]/20 uppercase tracking-[0.3em]" style={{ fontSize: fs(0.48) }}>Abertura</p>
          <div style={{ width: sp(24), height: '1px', background: 'rgba(45,58,39,0.12)', margin: `${sp(12)} 0` }} />
          <p className="font-serif italic text-[#2D3A27] leading-relaxed" style={{ fontSize: fs(0.92) }}>
            "{bookData.openingPhrase}"
          </p>
          <div style={{ width: sp(24), height: '1px', background: 'rgba(45,58,39,0.12)', margin: `${sp(14)} 0 ${sp(10)}` }} />
          <p className="text-[#2D3A27]/35" style={{ fontSize: fs(0.55) }}>— {DEMO_USER.name}</p>
        </div>
      );

    case 'route-intro':
      return (
        <div className="w-full h-full bg-[#F5F2EA] flex flex-col justify-center" style={{ padding: sp(20) }}>
          <p className="text-[#2D3A27]/30 uppercase tracking-[0.3em]" style={{ fontSize: fs(0.48) }}>A rota</p>
          <p className="font-serif italic text-[#2D3A27]" style={{ fontSize: fs(1.3), marginTop: sp(8), lineHeight: 1.1 }}>{DEMO_USER.route}</p>
          <div style={{ width: '100%', height: '1px', background: 'rgba(45,58,39,0.12)', margin: `${sp(14)} 0` }} />
          <p className="text-[#2D3A27]/50 leading-relaxed" style={{ fontSize: fs(0.62) }}>
            Uma das rotas mais antigas do Caminho de Santiago, atravessando os Pireneus desde Saint-Jean-Pied-de-Port até a Catedral de Santiago de Compostela.
          </p>
          <div style={{ marginTop: sp(14) }}>
            <p className="text-[#2D3A27]/35" style={{ fontSize: fs(0.55) }}>{DEMO_USER.startDate}</p>
            <p className="text-[#2D3A27]/25" style={{ fontSize: fs(0.5) }}>Partida · St-Jean-Pied-de-Port</p>
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className="w-full h-full flex flex-col justify-center bg-[#2D3A27]" style={{ padding: sp(20) }}>
          <p className="text-[#E8E4D9]/30 uppercase tracking-[0.25em] text-center" style={{ fontSize: fs(0.48) }}>Sua jornada em números</p>
          <div style={{ width: sp(24), height: '1px', background: 'rgba(232,228,217,0.15)', margin: `${sp(12)} auto` }} />
          <div className="flex flex-col" style={{ gap: sp(8) }}>
            {[
              ['Rota',       DEMO_USER.route],
              ['Distância',  `${DEMO_USER.km} km`],
              ['Duração',    `${DEMO_USER.days} dias`],
              ['Início',     DEMO_USER.startDate],
              ['Chegada',    DEMO_USER.endDate],
              ['Carimbos',   `${DEMO_USER.stamps}`],
              ['Fotos',      `${DEMO_USER.photos}`],
            ].map(([k, v], i) => (
              <div key={i} className="flex justify-between" style={{ borderBottom: '1px solid rgba(232,228,217,0.1)', paddingBottom: sp(6) }}>
                <span className="text-[#E8E4D9]/35" style={{ fontSize: fs(0.58) }}>{k}</span>
                <span className="text-[#E8E4D9]" style={{ fontSize: fs(0.58) }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'photo-full':
      return (
        <div className="w-full h-full relative">
          <img src={ph(def.p as number)} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 35%)' }} />
          <p className="absolute text-white/40 uppercase tracking-widest" style={{ bottom: sp(10), right: sp(12), fontSize: fs(0.48) }}>
            {String(idx).padStart(2, '0')}
          </p>
        </div>
      );

    case 'photo-editorial':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDFCF8]" style={{ padding: sp(14) }}>
          <div className="w-full overflow-hidden" style={{ flex: '0 0 76%', boxShadow: '0 6px 24px rgba(0,0,0,0.18)' }}>
            <img src={ph(def.p as number)} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="w-full flex justify-between items-end" style={{ marginTop: sp(8) }}>
            <p className="font-serif italic text-[#2D3A27]/55" style={{ fontSize: fs(0.58) }}>{DEMO_USER.route}</p>
            <p className="text-[#2D3A27]/25" style={{ fontSize: fs(0.5) }}>{String(idx).padStart(2, '0')}</p>
          </div>
        </div>
      );

    case 'photo-statement':
      return (
        <div className="w-full h-full flex flex-col bg-white">
          <div className="relative overflow-hidden" style={{ flex: '0 0 83%' }}>
            <img src={ph(def.p as number)} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 65%, rgba(0,0,0,0.22) 100%)' }} />
          </div>
          <div className="flex items-center justify-between bg-white" style={{ flex: '0 0 17%', padding: `0 ${sp(14)}` }}>
            <p className="font-serif italic text-[#2D3A27]/60" style={{ fontSize: fs(0.6) }}>{DEMO_USER.route}</p>
            <p className="text-[#2D3A27]/25" style={{ fontSize: fs(0.5) }}>{String(idx).padStart(2, '0')}</p>
          </div>
        </div>
      );

    case 'photo-framed':
      return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#FDFCF8]" style={{ padding: sp(14) }}>
          <div className="w-full h-full overflow-hidden" style={{
            border: `${sp(8)} solid white`,
            outline: '1px solid rgba(45,58,39,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(45,58,39,0.06)',
          }}>
            <img src={ph(def.p as number)} className="w-full h-full object-cover" alt="" />
          </div>
          <p className="text-[#2D3A27]/30 italic text-center" style={{ fontSize: fs(0.52), marginTop: sp(6) }}>
            {DEMO_USER.route}, {new Date().getFullYear()}
          </p>
        </div>
      );

    case 'collage-2':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateRows: '60% 38%', gap: sp(4), padding: sp(4) }}>
          {phArr(def.p as number[]).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-sm">
              <img src={src} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      );

    case 'collage-2-v':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateColumns: '55% 43%', gap: sp(4), padding: sp(4) }}>
          {phArr(def.p as number[]).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-sm">
              <img src={src} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      );

    case 'grid-3':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateColumns: '58% 40%', gridTemplateRows: '1fr 1fr', gap: sp(4), padding: sp(4) }}>
          <div className="overflow-hidden rounded-sm" style={{ gridRow: '1 / 3' }}>
            <img src={ph((def.p as number[])[0])} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="overflow-hidden rounded-sm">
            <img src={ph((def.p as number[])[1])} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="overflow-hidden rounded-sm">
            <img src={ph((def.p as number[])[2])} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      );

    case 'grid-3-v':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateRows: '55% 43%', gridTemplateColumns: '1fr 1fr', gap: sp(4), padding: sp(4) }}>
          <div className="overflow-hidden rounded-sm" style={{ gridColumn: '1 / 3' }}>
            <img src={ph((def.p as number[])[0])} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="overflow-hidden rounded-sm">
            <img src={ph((def.p as number[])[1])} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="overflow-hidden rounded-sm">
            <img src={ph((def.p as number[])[2])} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      );

    case 'grid-4':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: sp(4), padding: sp(4) }}>
          {phArr(def.p as number[]).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-sm">
              <img src={src} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      );

    case 'quote': {
      const q = CAMINO_QUOTES[(def.q ?? 0) % CAMINO_QUOTES.length];
      return (
        <div className="w-full h-full flex flex-col justify-center items-center text-center bg-[#F5F2EA]" style={{ padding: sp(24) }}>
          <p className="text-[#2D3A27]/20 uppercase tracking-[0.3em]" style={{ fontSize: fs(0.48), marginBottom: sp(14) }}>—</p>
          <p className="font-serif italic text-[#2D3A27] leading-relaxed" style={{ fontSize: fs(0.88) }}>
            "{q}"
          </p>
          <div style={{ width: sp(22), height: '1px', background: 'rgba(45,58,39,0.18)', margin: `${sp(16)} auto` }} />
          <p className="text-[#2D3A27]/30" style={{ fontSize: fs(0.5) }}>{DEMO_USER.route}</p>
        </div>
      );
    }

    case 'milestone':
      return (
        <div className="w-full h-full flex flex-col justify-center bg-[#1B2616]" style={{ padding: sp(20) }}>
          <p className="text-[#E8E4D9]/20 uppercase tracking-[0.3em]" style={{ fontSize: fs(0.48) }}>Marco</p>
          <div style={{ width: sp(20), height: '1px', background: 'rgba(232,228,217,0.15)', margin: `${sp(12)} 0` }} />
          <p className="font-serif italic text-[#E8E4D9]" style={{ fontSize: fs(2.2), lineHeight: 1 }}>{DEMO_USER.km}</p>
          <p className="text-[#E8E4D9]/50 uppercase tracking-widest" style={{ fontSize: fs(0.55) }}>quilômetros</p>
          <div style={{ width: sp(20), height: '1px', background: 'rgba(232,228,217,0.15)', margin: `${sp(14)} 0` }} />
          <p className="text-[#E8E4D9]/30" style={{ fontSize: fs(0.58) }}>{DEMO_USER.days} dias · {DEMO_USER.stamps} carimbos</p>
        </div>
      );

    case 'reflection':
      return (
        <div className="w-full h-full flex flex-col justify-center bg-[#FDFCF8]" style={{ padding: sp(22) }}>
          <p className="text-[#2D3A27]/20 uppercase tracking-[0.3em]" style={{ fontSize: fs(0.48) }}>Reflexão</p>
          <div style={{ width: sp(24), height: '1px', background: 'rgba(45,58,39,0.12)', margin: `${sp(12)} 0` }} />
          <p className="font-serif italic text-[#2D3A27] leading-relaxed" style={{ fontSize: fs(0.75) }}>
            "{bookData.reflectionText}"
          </p>
          <div style={{ width: sp(24), height: '1px', background: 'rgba(45,58,39,0.12)', margin: `${sp(14)} 0 ${sp(10)}` }} />
          <p className="text-[#2D3A27]/35" style={{ fontSize: fs(0.55) }}>— {DEMO_USER.name}</p>
        </div>
      );

    case 'closing':
      return (
        <div className="w-full h-full flex flex-col justify-center items-center text-center bg-[#2D3A27]" style={{ padding: sp(22) }}>
          <p className="font-serif italic text-[#E8E4D9]/60" style={{ fontSize: fs(1.5) }}>Ultreia</p>
          <p className="font-serif italic text-[#E8E4D9]/35" style={{ fontSize: fs(0.85), marginTop: sp(4) }}>et Suseia</p>
          <div style={{ width: sp(26), height: '1px', background: 'rgba(232,228,217,0.2)', margin: `${sp(16)} auto` }} />
          <p className="text-[#E8E4D9]/25 uppercase tracking-widest" style={{ fontSize: fs(0.5) }}>{DEMO_USER.route}</p>
          <p className="text-[#E8E4D9]/18" style={{ fontSize: fs(0.48), marginTop: sp(4) }}>{DEMO_USER.km} km · {DEMO_USER.days} dias</p>
        </div>
      );

    case 'endpaper-back':
      return (
        <div className="w-full h-full bg-[#1B2616] flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #2D3A27 0%, #1B2616 60%, #131e10 100%)' }}>
          <div className="opacity-10 absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(232,228,217,0.12) 20px, rgba(232,228,217,0.12) 21px)' }} />
        </div>
      );

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
      if (vw < 640)       setSize({ w: 150, h: 200 });
      else if (vw < 1024) setSize({ w: 240, h: 320 });
      else                setSize({ w: 340, h: 453 });
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
  const [step, setStep] = useState<Step>('reveal');
  const [bookData, setBookData] = useState<BookData>(DEFAULT_BOOK_DATA);
  const update = (patch: Partial<BookData>) => setBookData(p => ({ ...p, ...patch }));

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1B2616]/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-[#E8E4D9]/50 hover:text-[#E8E4D9] transition-colors text-sm">
          <ArrowLeft size={15} /><span className="hidden sm:inline">Voltar ao site</span>
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
            const cur = ['reveal', 'customize', 'order'].indexOf(step);
            const done = i < cur; const active = i === cur;
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${done ? 'bg-[#E8E4D9] text-[#1B2616]' : active ? 'bg-[#E8E4D9]/20 border border-[#E8E4D9]/60 text-[#E8E4D9]' : 'bg-[#E8E4D9]/10 text-[#E8E4D9]/30'}`}>
                    {done ? <Check size={10} /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block transition-colors ${active ? 'text-[#E8E4D9]' : done ? 'text-[#E8E4D9]/60' : 'text-[#E8E4D9]/25'}`}>{labels[i]}</span>
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
// FlipPage wrapper
// ---------------------------------------------------------------------------
const FlipPage = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
  ({ children }, ref) => (
    <div ref={ref} className="overflow-hidden" style={{ background: '#FDFCF8' }}>{children}</div>
  )
);
FlipPage.displayName = 'FlipPage';

// ---------------------------------------------------------------------------
// Livro interativo — 48 páginas
// ---------------------------------------------------------------------------
function InteractiveBook({ bookData }: { bookData: BookData }) {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [hasFlipped, setHasFlipped] = useState(false);
  const { w, h } = useBookSize();
  const TOTAL = PAGE_DEFS.length; // 48

  const goNext = () => bookRef.current?.pageFlip().flipNext();
  const goPrev = () => bookRef.current?.pageFlip().flipPrev();

  const S = w / 340;
  const sp = (n: number) => `${n * S}px`;
  const fs = (n: number) => `${n * S}rem`;

  return (
    <div className="flex flex-col items-center gap-5">
      <AnimatePresence>
        {!hasFlipped && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.0 }}
            className="flex items-center gap-2 text-[#E8E4D9]/35 text-xs uppercase tracking-widest"
          >
            <motion.span animate={{ x: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>←</motion.span>
            <span>Clique para folhear</span>
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ filter: 'drop-shadow(0 50px 100px rgba(0,0,0,0.7)) drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef} width={w} height={h} size="fixed"
          minWidth={w} maxWidth={w} minHeight={h} maxHeight={h}
          drawShadow={true} flippingTime={700} usePortrait={false}
          startZIndex={10} autoSize={false} clickEventForward={true}
          useMouseEvents={true} swipeDistance={30} showPageCorners={true}
          disableFlipByClick={false} style={{}} className="" startPage={0}
          onFlip={(e: any) => { setPage(e.data); if (e.data > 0) setHasFlipped(true); }}
        >
          {PAGE_DEFS.map((def, idx) => (
            <FlipPage key={idx}>
              {renderBookPage(def, idx + 1, bookData, S, sp, fs)}
            </FlipPage>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-6">
        <button onClick={goPrev} disabled={page === 0}
          className="w-10 h-10 rounded-full bg-[#E8E4D9]/10 flex items-center justify-center hover:bg-[#E8E4D9]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} className="text-[#E8E4D9]" />
        </button>
        <span className="text-[#E8E4D9]/30 text-xs tabular-nums min-w-[5rem] text-center">
          {page === 0 ? 'Capa' : page >= TOTAL - 1 ? 'Contracapa' : `pág. ${page + 1} / ${TOTAL}`}
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
          className="relative z-10 text-center px-6 pt-16 md:pt-20 pb-8"
        >
          <p className="text-[#C8A96E]/70 text-xs uppercase tracking-[0.4em] mb-5">
            {DEMO_USER.name} · {DEMO_USER.route}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#E8E4D9] italic leading-[1.08] tracking-tight">
            Seu livro<br />está pronto.
          </h1>
          <div className="w-12 h-px mx-auto my-7" style={{ background: 'rgba(200,169,110,0.3)' }} />
          <p className="text-[#E8E4D9]/40 text-sm max-w-xs mx-auto leading-relaxed">
            48 páginas com os registros da sua jornada, montadas automaticamente.
          </p>
        </motion.div>

        {/* Livro — centro absoluto */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1, type: 'spring', damping: 16 }}
          className="relative z-10 flex justify-center px-4 pb-10"
        >
          <InteractiveBook bookData={bookData} />
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
              { value: aKm,     unit: 'km',   label: 'percorridos' },
              { value: aDays,   unit: 'dias', label: 'de caminhada' },
              { value: aStamps, unit: '',     label: 'carimbos' },
              { value: aPhotos, unit: '',     label: 'fotos' },
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
                <span className="text-[#E8E4D9]/30 text-xs uppercase tracking-widest mt-2">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA — máximo contraste ── */}
      <div className="bg-[#0D1509] px-6 py-20 flex flex-col items-center gap-6 text-center">
        <p className="text-[#C8A96E]/50 text-xs uppercase tracking-[0.35em]">
          Capa dura · 48 páginas · Formato A4 · Envio mundial
        </p>
        <p
          className="font-serif italic text-[#E8E4D9] leading-none"
          style={{ fontSize: 'clamp(4rem, 14vw, 7rem)' }}
        >
          €49
        </p>
        <p className="text-[#E8E4D9]/20 text-xs -mt-2">impressão + frete internacional inclusos</p>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.04, backgroundColor: '#ffffff' }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#E8E4D9] text-[#0D1509] px-14 py-5 rounded-full font-bold text-lg flex items-center gap-3 mt-2 transition-colors"
          style={{ boxShadow: '0 0 60px rgba(200,169,110,0.25), 0 8px 32px rgba(0,0,0,0.5)' }}
        >
          Personalizar e encomendar <ArrowRight size={20} />
        </motion.button>
        <p className="text-[#E8E4D9]/15 text-xs max-w-xs">
          Ajuste fotos, textos e título antes de confirmar
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Personalizar (3 abas)
// ---------------------------------------------------------------------------
function StepCustomize({ bookData, onChange, onNext, onBack }: {
  bookData: BookData; onChange: (p: Partial<BookData>) => void; onNext: () => void; onBack: () => void;
}) {
  const [tab, setTab] = useState<CustomizeTab>('cover');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="text-center">
        <p className="text-[#2D3A27]/35 text-xs uppercase tracking-[0.3em] mb-2">Passo 2 de 3</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">Personalize seu livro</h2>
        <p className="text-[#2D3A27]/50 text-sm">Fotos, textos e capa — tudo do seu jeito.</p>
      </div>

      <div className="flex bg-[#F5F2EA] rounded-2xl p-1 gap-1">
        {([
          { id: 'cover' as const,  label: 'Capa',   icon: <BookOpen size={14} /> },
          { id: 'texts' as const,  label: 'Textos', icon: <Type size={14} /> },
          { id: 'photos' as const, label: 'Fotos',  icon: <Image size={14} /> },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-[#2D3A27] shadow-sm' : 'text-[#2D3A27]/40 hover:text-[#2D3A27]/70'}`}
          >
            {t.icon}{t.label}
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
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">Título do livro</p>
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
          <ArrowLeft size={15} /> Voltar
        </button>
        <motion.button onClick={onNext} disabled={bookData.selectedPhotos.length < 4}
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
    setLoading(true); setError(null);
    try {
      const res = await fetch('/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ successUrl: `${window.location.origin}/sucesso`, cancelUrl: `${window.location.origin}/book` }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError('Não foi possível iniciar o pagamento. Tente novamente.'); }
    } catch { setError('Erro de conexão. Tente novamente.'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-lg mx-auto px-6 py-12 flex flex-col gap-7">
      <div className="text-center">
        <p className="text-[#2D3A27]/35 text-xs uppercase tracking-[0.3em] mb-2">Passo 3 de 3</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] italic mb-2">Resumo do pedido</h2>
        <p className="text-[#2D3A27]/50 text-sm">Confirme os detalhes antes de pagar.</p>
      </div>

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
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">Capa dura</span>
            <span className="text-xs bg-white text-[#2D3A27]/50 px-2 py-0.5 rounded-full border border-[#2D3A27]/8">48 págs · A4</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#2D3A27]/8">
        <div className="flex justify-between text-sm text-[#2D3A27] mb-2"><span>Coffee Table Book</span><span>€49,00</span></div>
        <div className="flex justify-between text-xs text-[#2D3A27]/40 mb-4"><span>Impressão + envio internacional</span><span>incluso</span></div>
        <div className="border-t border-[#2D3A27]/8 pt-4 flex justify-between font-semibold text-[#2D3A27]">
          <span>Total</span><span className="font-serif italic text-xl">€49,00</span>
        </div>
      </div>

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
        {loading
          ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>A preparar...</>
          : <><CreditCard size={18} />Pagar €49,00 com cartão</>
        }
      </motion.button>

      <button onClick={onBack} className="text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors text-center">← Voltar e personalizar</button>
      <p className="text-xs text-[#2D3A27]/25 text-center -mt-2">Endereço de entrega solicitado no checkout · Processado pelo Stripe</p>
    </motion.div>
  );
}
