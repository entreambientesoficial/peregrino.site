import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import {
  ArrowLeft, ArrowRight, MapPin, Camera, Route,
  CreditCard, Check, ChevronLeft, ChevronRight,
  Shield, Globe, Package, BookOpen, Type, Image, X, Upload,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';
import { useT } from './i18n';

// ---------------------------------------------------------------------------
// Supabase client — adicionar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env
// ---------------------------------------------------------------------------
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? '',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
);

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
  photos: 89,
  // Ordem otimizada: fotos landscape nos slots panorama/stacked/centered, portrait nos restantes
  allPhotos: [3,6,7,8,10,1,4,5,9,11,12,13,14,17,18,21,22,23,24,26,15,16,28,29,30,32,34,36,37,
    38,41,42,44,46,47,48,19,20,49,25,27,31,33,2,35,39,50,40,45,53,54,55,57,60,62,63,64,65,67,
    68,69,71,72,51,52,73,56,75,76,77,78,80,81,83,84,86,58,59,89,61,66,70,74,79,82,85,87,88,90]
    .map(n => `/img-apoio/img-webp/${n}.webp`),
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
  // Dados do peregrino — substituídos pelos reais após login
  userName: string;
  startDate: string;
  endDate: string;
  km: number;
  days: number;
  stampsCount: number;
  photosCount: number;
  allPhotos: string[];
  uploadedPhotos: string[];
  photoAssignments: Record<number, string>;
  pageTexts: Record<string, PageTextEntry>;
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
  userName:    DEMO_USER.name,
  startDate:   DEMO_USER.startDate,
  endDate:     DEMO_USER.endDate,
  km:          DEMO_USER.km,
  days:        DEMO_USER.days,
  stampsCount: DEMO_USER.stamps,
  photosCount: DEMO_USER.photos,
  allPhotos:        DEMO_USER.allPhotos,
  uploadedPhotos:   [],
  photoAssignments: {},
  pageTexts:        {},
};

type Step = 'reveal' | 'customize' | 'order';
type CustomizeTab = 'cover' | 'texts' | 'photos';
type ModelId = 'essential' | 'journey' | 'legacy';
type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type FontFamily = 'inter' | 'playfair' | 'lora' | 'dancing' | 'montserrat';

interface PageTextEntry {
  text: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
}

const FONT_SIZE_FS: Record<FontSize, number> = { xs: 0.36, sm: 0.50, md: 0.64, lg: 0.80, xl: 1.0 };
const FONT_SIZE_LABEL: Record<FontSize, string> = { xs: 'PP', sm: 'P', md: 'M', lg: 'G', xl: 'GG' };

const FONT_FAMILIES: { id: FontFamily; label: string; css: string }[] = [
  { id: 'inter',      label: 'Inter',          css: "'Inter', sans-serif" },
  { id: 'playfair',   label: 'Playfair',        css: "'Playfair Display', serif" },
  { id: 'lora',       label: 'Lora',            css: "'Lora', serif" },
  { id: 'dancing',    label: 'Dancing',         css: "'Dancing Script', cursive" },
  { id: 'montserrat', label: 'Montserrat',      css: "'Montserrat', sans-serif" },
];

// Layouts que suportam slots de texto personalizados
const PAGE_TEXT_SLOTS: Partial<Record<PageKind, Array<'top' | 'bottom'>>> = {
  'large-white':  ['top', 'bottom'],
  'stacked-2':    ['top', 'bottom'],
  'grid-4-white': ['top', 'bottom'],
};

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

// Bloco de 50 layouts fotográficos — repetido N vezes conforme o modelo escolhido.
// Os valores de `p` não importam; apenas o tipo (single vs array) define o nº de slots.
const PHOTO_BLOCK: PageDef[] = [
  { kind: 'stagger-4',    p: [0,1,2,3] },
  { kind: 'full-dark',    p: 0 },
  { kind: 'centered-dark',p: 0 },
  { kind: 'centered-dark',p: 0 },
  { kind: 'stacked-2',    p: [0,1] },
  { kind: 'large-white',  p: 0 },
  { kind: 'panorama-L',   p: 0 },
  { kind: 'panorama-R',   p: 0 },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'large-white',  p: 0 },
  { kind: 'stacked-2',    p: [0,1] },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'stagger-4',    p: [0,1,2,3] },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'stacked-2',    p: [0,1] },
  { kind: 'large-white',  p: 0 },
  { kind: 'panorama-L',   p: 0 },
  { kind: 'panorama-R',   p: 0 },
  { kind: 'trio-h',       p: [0,1,2] },
  { kind: 'trio-v',       p: [0,1,2] },
  { kind: 'large-white',  p: 0 },
  { kind: 'stacked-2',    p: [0,1] },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'stacked-2',    p: [0,1] },
  { kind: 'large-white',  p: 0 },
  { kind: 'panorama-L',   p: 0 },
  { kind: 'panorama-R',   p: 0 },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'large-white',  p: 0 },
  { kind: 'stacked-2',    p: [0,1] },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'full-dark',    p: 0 },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'grid-4-white', p: [0,1,2,3] },
  { kind: 'large-white',  p: 0 },
];

// Gera as page defs completas para um dado modelo:
// cover + preface + (modelPages foto-layouts repetidos) + stamps + back-cover
function generatePageDefs(modelPages: number): PageDef[] {
  const photoDefs: PageDef[] = [];
  while (photoDefs.length < modelPages) photoDefs.push(...PHOTO_BLOCK);

  // Trim ao tamanho exato; se terminar em panorama-L, remove para não ficar ímpar sem par
  photoDefs.length = modelPages;
  if (photoDefs.at(-1)?.kind === 'panorama-L') photoDefs.pop();

  // react-pageflip exige número par de páginas no total
  const total = photoDefs.length + 4; // +4 = cover, preface, stamps, back-cover
  if (total % 2 !== 0) photoDefs.push({ kind: 'full-dark', p: 0 });

  // Distribui as 3 legendas (c1, c2, c3) nos large-white distribuídos pelo livro
  const lwIdx = photoDefs.reduce<number[]>((acc, d, i) =>
    d.kind === 'large-white' ? [...acc, i] : acc, []);
  (['c1', 'c2', 'c3'] as const).forEach((ck, ci) => {
    const pos = lwIdx[Math.floor(lwIdx.length * (ci + 1) / 4)];
    if (pos !== undefined) photoDefs[pos] = { ...photoDefs[pos], ck };
  });

  return [
    { kind: 'cover' },
    { kind: 'preface' },
    ...photoDefs,
    { kind: 'stamps' },
    { kind: 'back-cover' },
  ];
}

// ---------------------------------------------------------------------------
// Mock de locais para os espaços de carimbo
// ---------------------------------------------------------------------------
const STAMP_PLACES = [
  { city: 'Saint-Jean-Pied-de-Port', code: 'SJPP', region: 'França',   day: 'Dia 1'  },
  { city: 'Roncesvalles',            code: 'RVS',  region: 'Navarra',  day: 'Dia 2'  },
  { city: 'Pamplona',                code: 'PNA',  region: 'Navarra',  day: 'Dia 3'  },
  { city: 'Puente la Reina',         code: 'PLR',  region: 'Navarra',  day: 'Dia 4'  },
  { city: 'Logroño',                 code: 'LGN',  region: 'La Rioja', day: 'Dia 7'  },
  { city: 'Burgos',                  code: 'BRG',  region: 'Castilla', day: 'Dia 12' },
  { city: 'León',                    code: 'LEN',  region: 'Castilla', day: 'Dia 18' },
  { city: 'Astorga',                 code: 'AST',  region: 'Castilla', day: 'Dia 20' },
  { city: 'Ponferrada',              code: 'PNF',  region: 'El Bierzo',day: 'Dia 22' },
  { city: 'O Cebreiro',              code: 'OCB',  region: 'Galicia',  day: 'Dia 25' },
  { city: 'Sarria',                  code: 'SAR',  region: 'Galicia',  day: 'Dia 27' },
  { city: 'Portomarín',              code: 'PTM',  region: 'Galicia',  day: 'Dia 28' },
  { city: 'Palas de Rei',            code: 'PDR',  region: 'Galicia',  day: 'Dia 29' },
  { city: 'Arzúa',                   code: 'ARZ',  region: 'Galicia',  day: 'Dia 31' },
  { city: 'O Pedrouzo',              code: 'OPD',  region: 'Galicia',  day: 'Dia 32' },
  { city: 'Santiago de Compostela',  code: 'SCQ',  region: 'Galicia',  day: 'Dia 33' },
];

// ---------------------------------------------------------------------------
// Mapeamento sequencial de slots de fotos
// Cada página recebe slots únicos em ordem — foto 0 nunca repete.
// panorama-R compartilha o mesmo slot do panorama-L anterior (mesma foto, metades opostas).
// ---------------------------------------------------------------------------
function buildPhotoSlotMap(pageDefs: PageDef[]): Map<number, number[]> {
  let slot = 0;
  const map = new Map<number, number[]>();
  for (let i = 0; i < pageDefs.length; i++) {
    const def = pageDefs[i];
    if (def.p === undefined) { map.set(i, []); continue; }
    if (def.kind === 'panorama-R') { map.set(i, map.get(i - 1)!); continue; }
    const indices = Array.isArray(def.p) ? def.p : [def.p];
    map.set(i, indices.map(() => slot++));
  }
  return map;
}

// ---------------------------------------------------------------------------
// Renderizador de páginas
// ---------------------------------------------------------------------------
function renderBookPage(
  def: PageDef,
  pageIdx: number,
  bookData: BookData,
  S: number,
  sp: (n: number) => string,
  fs: (n: number) => string,
  slotMap: Map<number, number[]>,
) {
  const photos = bookData.allPhotos;
  const slots = slotMap.get(pageIdx) ?? [];
  const ph = (n: number) => {
    if (bookData.photoAssignments[n] !== undefined) return bookData.photoAssignments[n];
    return n < photos.length ? photos[n] : `__stamp__:${n}`;
  };
  const getTextEntry = (slot: 'top' | 'bottom'): PageTextEntry | undefined =>
    bookData.pageTexts[`${pageIdx}-${slot}`];
  const renderTextSlot = (slot: 'top' | 'bottom', fallback?: string | null) => {
    const entry = getTextEntry(slot);
    const text = entry?.text?.trim() || fallback || '';
    if (!text) return null;
    const fsNum = FONT_SIZE_FS[entry?.fontSize ?? 'sm'];
    const fontCss = FONT_FAMILIES.find(f => f.id === entry?.fontFamily)?.css ?? "'Inter', sans-serif";
    return (
      <p style={{ fontFamily: fontCss, fontSize: fs(fsNum), color: 'rgba(45,58,39,0.68)', lineHeight: 1.5 }}>
        {text}
      </p>
    );
  };
  // Helper: retorna <img> real ou placeholder de carimbo escalado com S
  // fit='cover' para sangrias full-bleed; fit='contain' para layouts emoldurados
  const img = (n: number, cls: string, sty?: React.CSSProperties, fit: 'cover' | 'contain' = 'cover') => {
    const src = ph(n);
    if (!src.startsWith('__stamp__')) {
      const fitCls = fit === 'contain'
        ? cls.replace('object-cover', 'object-contain')
        : cls;
      return <img src={src} className={fitCls} alt="" style={sty} />;
    }
    const place = STAMP_PLACES[n % STAMP_PLACES.length];
    return (
      <div className={cls} style={{ ...sty, background: '#F0EDE4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: sp(3), padding: sp(6) }}>
        <div style={{ width: sp(68), height: sp(68), border: '1.5px dashed rgba(45,58,39,0.22)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: sp(2), flexShrink: 0 }}>
          <span style={{ fontSize: fs(0.3), letterSpacing: '0.18em', color: 'rgba(45,58,39,0.3)', textTransform: 'uppercase' }}>{place.code}</span>
          <span className="font-serif italic" style={{ fontSize: fs(0.42), color: 'rgba(45,58,39,0.5)', textAlign: 'center', lineHeight: 1.1, padding: `0 ${sp(3)}` }}>{place.city}</span>
          <span style={{ fontSize: fs(0.27), color: 'rgba(45,58,39,0.22)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{place.day}</span>
        </div>
        {[0, 1, 2].map(i => <div key={i} style={{ width: '72%', height: '1px', background: `rgba(45,58,39,${0.1 - i * 0.025})`, marginTop: sp(2) }} />)}
        <span style={{ fontSize: fs(0.24), color: 'rgba(45,58,39,0.18)', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: sp(1) }}>Espaço para Carimbo</span>
      </div>
    );
  };

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
              <p className="text-white/50 uppercase tracking-wider" style={{ fontSize: fs(0.58), marginTop: sp(6) }}>{bookData.userName}</p>
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
              ['Peregrino', bookData.userName],
              ['Rota',      bookData.route],
              ['Início',    bookData.startDate],
              ['Chegada',   bookData.endDate],
              ['Distância', `${bookData.km} km`],
              ['Duração',   `${bookData.days} dias`],
              ['Carimbos',  `${bookData.stampsCount}`],
              ['Fotos',     `${bookData.photosCount}`],
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
          {img(slots[0], 'w-full h-full object-cover')}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />
        </div>
      );

    // ── Centered dark — 1 foto centralizada em fundo escuro ─────────────────
    case 'centered-dark':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: '#161c14', padding: sp(14) }}>
          <div className="w-full overflow-hidden" style={{ height: '65%' }}>
            {img(slots[0], 'w-full h-full object-cover')}
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
      const topText = renderTextSlot('top');
      const botText = renderTextSlot('bottom', caption);
      return (
        <div className="w-full h-full flex flex-col bg-[#FDFCF8]" style={{ padding: sp(12), gap: sp(6) }}>
          {topText && (
            <div style={{ borderBottom: `1px solid rgba(45,58,39,0.08)`, paddingBottom: sp(5) }}>
              {topText}
            </div>
          )}
          <div className="w-full overflow-hidden bg-[#FDFCF8]" style={{ flex: 1, boxShadow: `0 ${sp(3)} ${sp(14)} rgba(0,0,0,0.14)` }}>
            {img(slots[0], 'w-full h-full object-cover', undefined, 'contain')}
          </div>
          {botText ? (
            <div style={{ borderTop: `1px solid rgba(45,58,39,0.08)`, paddingTop: sp(5) }}>
              {botText}
            </div>
          ) : (
            <p className="font-serif italic text-[#2D3A27]/25 text-right" style={{ fontSize: fs(0.48) }}>
              {bookData.route}
            </p>
          )}
        </div>
      );
    }

    // ── Stacked 2 — 2 fotos empilhadas, fundo branco ────────────────────────
    case 'stacked-2': {
      const topText = renderTextSlot('top');
      const botText = renderTextSlot('bottom');
      return (
        <div className="w-full h-full bg-[#FDFCF8] flex flex-col" style={{ padding: sp(10), gap: sp(5) }}>
          {topText && (
            <div style={{ borderBottom: `1px solid rgba(45,58,39,0.08)`, paddingBottom: sp(4) }}>
              {topText}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: sp(4), flex: 1 }}>
            {slots.map((s, i) => (
              <div key={i} className="overflow-hidden bg-[#FDFCF8]">
                {img(s, 'w-full h-full object-cover', undefined, 'contain')}
              </div>
            ))}
          </div>
          {botText && (
            <div style={{ borderTop: `1px solid rgba(45,58,39,0.08)`, paddingTop: sp(4) }}>
              {botText}
            </div>
          )}
        </div>
      );
    }

    // ── Grid 4 — 2×2 grade, fundo branco ────────────────────────────────────
    case 'grid-4-white': {
      const topText = renderTextSlot('top');
      const botText = renderTextSlot('bottom');
      return (
        <div className="w-full h-full bg-white flex flex-col" style={{ padding: sp(8), gap: sp(4) }}>
          {topText && (
            <div style={{ borderBottom: `1px solid rgba(45,58,39,0.08)`, paddingBottom: sp(4) }}>
              {topText}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: sp(3), flex: 1 }}>
            {slots.map((s, i) => (
              <div key={i} className="overflow-hidden bg-white">
                {img(s, 'w-full h-full object-cover', undefined, 'contain')}
              </div>
            ))}
          </div>
          {botText && (
            <div style={{ borderTop: `1px solid rgba(45,58,39,0.08)`, paddingTop: sp(4) }}>
              {botText}
            </div>
          )}
        </div>
      );
    }

    // ── Stagger 4 — collage assimétrica com offset vertical ─────────────────
    case 'stagger-4':
      return (
        <div className="w-full h-full bg-[#FDFCF8]" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp(3), padding: sp(8) }}>
          <div style={{ display: 'grid', gridTemplateRows: '46% 50%', gap: sp(3) }}>
            <div className="overflow-hidden bg-[#FDFCF8]">{img(slots[0], 'w-full h-full object-cover', undefined, 'contain')}</div>
            <div className="overflow-hidden bg-[#FDFCF8]">{img(slots[2], 'w-full h-full object-cover', undefined, 'contain')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '50% 46%', gap: sp(3), marginTop: sp(10) }}>
            <div className="overflow-hidden bg-[#FDFCF8]">{img(slots[1], 'w-full h-full object-cover', undefined, 'contain')}</div>
            <div className="overflow-hidden bg-[#FDFCF8]">{img(slots[3], 'w-full h-full object-cover', undefined, 'contain')}</div>
          </div>
        </div>
      );

    // ── Trio H — 2 fotos em cima + 1 larga embaixo ──────────────────────────
    case 'trio-h':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateRows: '54% 42%', gridTemplateColumns: '1fr 1fr', gap: sp(3), padding: sp(8) }}>
          <div className="overflow-hidden bg-white">{img(slots[0], 'w-full h-full object-cover', undefined, 'contain')}</div>
          <div className="overflow-hidden bg-white">{img(slots[1], 'w-full h-full object-cover', undefined, 'contain')}</div>
          <div className="overflow-hidden bg-white" style={{ gridColumn: '1 / 3' }}>
            {img(slots[2], 'w-full h-full object-cover', undefined, 'contain')}
          </div>
        </div>
      );

    // ── Trio V — 1 foto coluna esquerda + 2 empilhadas à direita ────────────
    case 'trio-v':
      return (
        <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateColumns: '52% 44%', gridTemplateRows: '1fr 1fr', gap: sp(3), padding: sp(8) }}>
          <div className="overflow-hidden bg-white" style={{ gridRow: '1 / 3' }}>
            {img(slots[0], 'w-full h-full object-cover', undefined, 'contain')}
          </div>
          <div className="overflow-hidden bg-white">{img(slots[1], 'w-full h-full object-cover', undefined, 'contain')}</div>
          <div className="overflow-hidden bg-white">{img(slots[2], 'w-full h-full object-cover', undefined, 'contain')}</div>
        </div>
      );

    // ── Panorama — foto contínua cruzando a lombada (metade L e R) ──────────
    case 'panorama-L':
      return (
        <div className="w-full h-full overflow-hidden" style={{ background: '#141a12' }}>
          {img(slots[0], 'w-full h-full object-cover', { objectPosition: '0% center' })}
        </div>
      );

    case 'panorama-R':
      return (
        <div className="w-full h-full overflow-hidden" style={{ background: '#141a12' }}>
          {img(slots[0], 'w-full h-full object-cover', { objectPosition: '100% center' })}
        </div>
      );

    // ── Selos — grade dinâmica de carimbos da credencial ────────────────────
    case 'stamps': {
      const realCount = bookData.stampsCount;
      const displayCount = Math.max(realCount, 28);
      const cols = displayCount <= 12 ? 3 : displayCount <= 20 ? 4 : displayCount <= 32 ? 5 : 6;
      return (
        <div className="w-full h-full bg-[#FDFCF8] flex flex-col" style={{ padding: sp(14) }}>
          <p className="text-[#2D3A27]/25 uppercase tracking-[0.28em] text-center" style={{ fontSize: fs(0.44), marginBottom: sp(10) }}>
            Carimbos da Credencial
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: sp(3), flex: 1 }}>
            {Array.from({ length: displayCount }).map((_, i) => {
              const isReal = i < realCount;
              const mock = STAMP_PLACES[i % STAMP_PLACES.length];
              return (
                <div key={i} className="flex flex-col items-center justify-center border border-[#2D3A27]/10 bg-[#F5F2EA]"
                  style={{ borderRadius: sp(2), padding: sp(3), gap: sp(1) }}>
                  {isReal ? (
                    <p className="font-serif italic text-[#2D3A27]/40" style={{ fontSize: fs(0.5) }}>{i + 1}</p>
                  ) : (
                    <>
                      <span style={{ fontSize: fs(0.28), letterSpacing: '0.14em', color: 'rgba(45,58,39,0.25)', textTransform: 'uppercase' }}>{mock.code}</span>
                      <span className="font-serif italic" style={{ fontSize: fs(0.32), color: 'rgba(45,58,39,0.35)', textAlign: 'center', lineHeight: 1.1 }}>{mock.city}</span>
                      <span style={{ fontSize: fs(0.24), color: 'rgba(45,58,39,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{mock.day}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[#2D3A27]/20 text-center" style={{ fontSize: fs(0.42), marginTop: sp(7) }}>
            {bookData.route} · {bookData.startDate} — {bookData.endDate}
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
// URL de redirect OAuth — dinâmica, funciona em dev e produção
// ⚠️  Deve estar cadastrada em: Supabase → Auth → URL Configuration → Redirect URLs
//     Adicione: http://localhost:5173/** (dev) e https://peregrino-site.pages.dev/** (prod)
// ---------------------------------------------------------------------------
const OAUTH_REDIRECT_URL = `${window.location.origin}/book`;

// ---------------------------------------------------------------------------
// Auth Modal — intercepta "Personalizar livro" quando user é null
// ---------------------------------------------------------------------------
function AuthModal({ onClose, onGuestMode }: { onClose: () => void; onGuestMode: () => void }) {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Iniciando login OAuth para:', OAUTH_REDIRECT_URL);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: OAUTH_REDIRECT_URL, skipBrowserRedirect: false },
      });
      if (authError) throw authError;
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao conectar com Google');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1B2616]/70 backdrop-blur-xl" onClick={onClose} />

      {/* Card */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="relative z-10 w-full sm:max-w-md bg-[#FDFCF8] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl px-8 pt-8 pb-10"
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#2D3A27]/8 hover:bg-[#2D3A27]/15 transition-colors text-[#2D3A27]/50"
        >
          <X size={14} />
        </button>

        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-6">
          <img src="/img-apoio/vieira.png" alt="" className="h-10 object-contain mb-4" />
          <h2 className="font-serif text-2xl text-[#2D3A27] italic mb-3">{t('bp.auth.title')}</h2>
          {/* Aviso de instrução */}
          <div className="px-4 py-2.5 bg-[#2D3A27]/6 rounded-2xl border border-[#2D3A27]/10 w-full">
            <p className="text-[#2D3A27]/70 text-xs leading-relaxed text-center">
              Utilize a <span className="font-semibold text-[#2D3A27]">mesma conta do App Peregrino</span> para carregar suas fotos automaticamente.
            </p>
          </div>
        </div>

        {/* Botão Google — ação principal destaque */}
        <motion.button
          onClick={handleGoogle}
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="w-full flex items-center justify-center gap-3 bg-[#2D3A27] rounded-2xl py-4 text-[#E8E4D9] font-semibold text-sm shadow-lg hover:bg-[#1B2616] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-5"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {t('bp.auth.connecting')}
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
              </svg>
              {t('bp.auth.google')}
            </>
          )}
        </motion.button>

        {/* Divisor */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#2D3A27]/10" />
          <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[#2D3A27]/30">ou entre com e-mail</span>
          <div className="flex-1 h-px bg-[#2D3A27]/10" />
        </div>

        {/* Formulário e-mail + senha */}
        <EmailPasswordForm onError={setError} />

        {error && <p className="text-red-500/80 text-xs text-center mt-3 mb-1">{error}</p>}

        {/* Modo convidado */}
        <button
          onClick={onGuestMode}
          className="w-full text-xs text-[#2D3A27]/35 hover:text-[#2D3A27]/60 transition-colors text-center py-1.5"
        >
          {t('bp.auth.guest')}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Formulário e-mail + senha — para usuários que não usam Google
// ---------------------------------------------------------------------------
function EmailPasswordForm({ onError }: { onError: (msg: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange no BookPage detecta o login automaticamente
    } catch (err: any) {
      onError(err?.message ?? 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#2D3A27]/15 rounded-xl px-4 py-3 text-sm text-[#2D3A27] placeholder-[#2D3A27]/30 focus:outline-none focus:border-[#2D3A27]/40 focus:ring-1 focus:ring-[#2D3A27]/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={inputClass}
        autoComplete="email"
        required
      />
      <div className="relative">
        <input
          type={showPass ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={inputClass}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPass(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D3A27]/30 hover:text-[#2D3A27]/60 transition-colors text-xs"
        >
          {showPass ? 'ocultar' : 'mostrar'}
        </button>
      </div>
      <motion.button
        type="submit"
        disabled={loading || !email || !password}
        whileHover={!loading ? { scale: 1.01 } : {}}
        whileTap={!loading ? { scale: 0.99 } : {}}
        className="w-full bg-[#E8E4D9] text-[#2D3A27] font-semibold text-sm rounded-xl py-3 hover:bg-[#ddd9cc] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : 'Entrar'}
      </motion.button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Modal de Gap — aparece ao clicar "Ver resultado" quando fotos < páginas do plano
// ---------------------------------------------------------------------------
function GapModal({
  gap,
  planName,
  planPages,
  currentPhotos,
  uploadProgress,
  onUpload,
  onKeepStamps,
  onClose,
}: {
  gap: number;
  planName: string;
  planPages: number;
  currentPhotos: number;
  uploadProgress: number | null;
  onUpload: (files: FileList) => void;
  onKeepStamps: () => void;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploading = uploadProgress !== null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onUpload(files);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-[#1B2616]/75 backdrop-blur-xl" onClick={onClose} />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="relative z-10 w-full sm:max-w-md bg-[#FDFCF8] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl px-8 pt-8 pb-10"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#2D3A27]/8 hover:bg-[#2D3A27]/15 transition-colors text-[#2D3A27]/50"
        >
          <X size={14} />
        </button>

        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#C8A96E]/15 flex items-center justify-center mb-4">
            <Camera size={20} className="text-[#C8A96E]" />
          </div>
          <h3 className="font-serif text-2xl text-[#2D3A27] italic mb-2">Assistente de Preenchimento</h3>
          <p className="text-[#2D3A27]/55 text-sm leading-relaxed">
            O seu plano <span className="font-semibold text-[#2D3A27]">{planName}</span> tem{' '}
            <span className="font-semibold text-[#2D3A27]">{planPages} páginas</span>, mas você tem{' '}
            <span className="font-semibold text-[#2D3A27]">{currentPhotos} fotos</span>.
          </p>
        </div>

        {/* Destaque do gap */}
        <div className="bg-[#2D3A27]/6 border border-[#2D3A27]/10 rounded-2xl px-5 py-4 text-center mb-6">
          <p className="text-[#2D3A27]/40 text-xs uppercase tracking-widest mb-1">Fotos em falta</p>
          <p className="font-serif italic text-[#2D3A27] text-4xl">{gap}</p>
          <p className="text-[#2D3A27]/40 text-xs mt-1">para preencher o álbum completo</p>
        </div>

        {/* Opção 1 — Upload */}
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          whileHover={!uploading ? { scale: 1.02 } : {}}
          whileTap={!uploading ? { scale: 0.98 } : {}}
          className="w-full flex items-center gap-3 bg-[#2D3A27] rounded-2xl py-4 px-5 text-[#E8E4D9] font-semibold text-sm mb-3 hover:bg-[#1B2616] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <Upload size={16} className="shrink-0" />
          )}
          <div className="text-left flex-1">
            <p className="font-semibold">Upload de Fotos</p>
            <p className="text-[#E8E4D9]/55 text-xs font-normal">
              {uploading ? `Processando… ${uploadProgress}%` : 'Adicione fotos do PC ou celular'}
            </p>
          </div>
        </motion.button>
        {uploading && (
          <div className="w-full bg-[#2D3A27]/10 rounded-full h-1.5 mb-3">
            <div
              className="bg-[#2D3A27] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {/* Opção 2 — Espaços para carimbos */}
        <motion.button
          onClick={onKeepStamps}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 bg-[#F5F2EA] border border-[#2D3A27]/12 rounded-2xl py-4 px-5 text-[#2D3A27] hover:bg-[#EDE9DF] transition-all"
        >
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#2D3A27]/25 flex items-center justify-center shrink-0">
            <span className="text-[#2D3A27]/40 text-xs font-serif italic">✦</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Manter espaços em branco</p>
            <p className="text-[#2D3A27]/45 text-xs">As páginas restantes ficam com layout de Espaço para Notas (os carimbos da rota já ocupam a última página)</p>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
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
  const [selectedModel, setSelectedModel] = useState<ModelId>('essential');
  const [hasCustomized, setHasCustomized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [noPhotosWarning, setNoPhotosWarning] = useState(false);
  const update = (patch: Partial<BookData>) => setBookData(p => ({ ...p, ...patch }));

  // Mapeamento route_id → chave i18n (conforme STATUS.md do App Peregrino)
  const ROUTE_KEY: Record<string, string> = {
    frances:          'journey.name.frances',
    portugues:        'journey.name.portugues.central',
    portugues_lisboa: 'journey.name.portugues.lisboa',
    costa:            'journey.name.portugues.costa',
    interior:         'journey.name.interior',
    primitivo:        'journey.name.primitivo',
    norte:            'journey.name.norte',
    ingles:           'journey.name.ingles',
    aragones:         'journey.name.aragones',
    plata:            'journey.name.plata',
    sanabres:         'journey.name.sanabres',
    inverno:          'journey.name.inverno',
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('pt-BR', { month: 'short' })} ${d.getFullYear()}`;
  };

  const loadUserData = async (userId: string) => {
    setDataLoading(true);
    try {
      // Todas as queries em paralelo para reduzir latência
      const [
        { data: profile },
        { data: journeyRows },
        { data: latestStamps, count: stampCount },
        { data: firstStamps },
        { data: photos, count: photoCount, error: photosError },
      ] = await Promise.all([
        // Perfil — nome e route_id cadastrado
        supabase.from('profiles').select('full_name, route_id').eq('id', userId).single(),

        // Jornada ativa — fonte primária de route_id e km total da rota
        // Tenta `journeys`; se a tabela não existir, retorna [] sem lançar erro
        supabase
          .from('journeys')
          .select('route_id, total_km, started_at, finished_at, status')
          .eq('pilgrim_id', userId)
          .order('created_at', { ascending: false })
          .limit(1),

        // Stamp mais recente: km acumulado + data final
        supabase
          .from('stamps')
          .select('km_accumulated, stamped_at, route_id', { count: 'exact' })
          .eq('pilgrim_id', userId)
          .order('stamped_at', { ascending: false })
          .limit(1),

        // Stamp mais antigo: data de início
        supabase
          .from('stamps')
          .select('stamped_at')
          .eq('pilgrim_id', userId)
          .order('stamped_at', { ascending: true })
          .limit(1),

        // Fotos: thumb_url ordenado cronologicamente
        supabase
          .from('photos')
          .select('thumb_url, taken_at', { count: 'exact' })
          .eq('pilgrim_id', userId)
          .not('thumb_url', 'is', null)
          .order('taken_at', { ascending: false })
          .limit(50),
      ]);

      console.log('[Peregrino/data]', { profile, journeyRows, stampCount, photoCount, photosError });

      const journey     = (journeyRows as any)?.[0] ?? null;
      const latestStamp = (latestStamps as any)?.[0] ?? null;
      const firstStamp  = (firstStamps as any)?.[0] ?? null;

      // Prioridade de route_id: jornada ativa → perfil → último stamp → fallback 'frances'
      const routeId  = journey?.route_id ?? (profile as any)?.route_id ?? latestStamp?.route_id ?? 'frances';
      const routeKey = ROUTE_KEY[routeId] ?? 'journey.name.frances';
      const route    = t(routeKey);

      const userName = (profile as any)?.full_name ?? DEMO_USER.name;

      // km: distância total da rota (journeys.total_km) → km percorrido (stamps) → 0
      // NÃO cair em DEMO_USER.km para não exibir 765 de outra rota
      const km = Math.round(journey?.total_km ?? latestStamp?.km_accumulated ?? 0);

      const totalStamps = stampCount ?? 0;
      const totalPhotos = photoCount ?? 0;

      // Datas: usa dados reais ou indica que ainda não iniciada
      const startDate = journey?.started_at
        ? fmtDate(journey.started_at)
        : firstStamp ? fmtDate(firstStamp.stamped_at) : '—';
      const endDate = journey?.finished_at
        ? fmtDate(journey.finished_at)
        : latestStamp ? fmtDate(latestStamp.stamped_at) : '—';
      const days = firstStamp && latestStamp
        ? Math.max(1, Math.round(
            (new Date(latestStamp.stamped_at).getTime() - new Date(firstStamp.stamped_at).getTime())
            / (1000 * 60 * 60 * 24)
          ) + 1)
        : 0;

      const photoUrls: string[] = ((photos as any[]) ?? [])
        .map((p: any) => p.thumb_url)
        .filter(Boolean);

      setNoPhotosWarning(photoUrls.length === 0);
      const allPhotos = photoUrls.length >= 4 ? photoUrls : DEFAULT_BOOK_DATA.allPhotos;

      update({
        route,
        title:          `${route}, ${new Date().getFullYear()}`,
        coverPhoto:     allPhotos[0] ?? DEFAULT_BOOK_DATA.coverPhoto,
        selectedPhotos: allPhotos.slice(0, 8),
        allPhotos,
        userName,
        startDate,
        endDate,
        km,
        days,
        stampsCount: totalStamps,
        photosCount: totalPhotos,
      });
    } finally {
      setDataLoading(false);
    }
  };

  // Listener de auth — detecta login inclusive após redirect OAuth
  useEffect(() => {
    // Verificação inicial de sessão — cobre o caso de redirect pós-OAuth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log('[Auth] Sessão existente detectada, carregando dados do usuário:', session.user.email);
        setUser(session.user);
        loadUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Guard: ignora eventos que não sejam de sessão web válida.
      // O parâmetro auth_type=web no redirect URL já bloqueia deep links,
      // mas este guard é uma camada extra de segurança.
      if (event === 'SIGNED_OUT') {
        console.log('[Auth] Usuário desconectado.');
        setUser(null);
        return;
      }

      console.log('[Auth] Evento recebido:', event, '| Usuário:', session?.user?.email ?? 'nenhum');

      setUser(session?.user ?? null);
      if (session?.user) {
        // Sessão web confirmada — carrega dados e avança o fluxo
        console.log('[Auth] Sessão web confirmada. Carregando dados e avançando para personalizar.');
        loadUserData(session.user.id);
        setShowAuthModal(false);
        setStep('customize');
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling removido — o onAuthStateChange acima já detecta todos os logins
  // (Google OAuth redirect + email/senha) de forma confiável no mesmo browser.

  const handleCustomize = () => {
    if (!user) { setShowAuthModal(true); return; }
    setStep('customize');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStep('reveal');
    setHasCustomized(false);
    setNoPhotosWarning(false);
    const route = t('bp.demo.route');
    setBookData({ ...DEFAULT_BOOK_DATA, route, title: `${route}, ${new Date().getFullYear()}` });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1B2616]/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#E8E4D9]/50 hover:text-[#E8E4D9] transition-colors text-sm">
          <ArrowLeft size={15} /><span className="hidden sm:inline">{t('bp.back')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <img src="/img-apoio/vieira.png" alt="" className="h-8 object-contain" />
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#E8E4D9' }} className="text-2xl tracking-tight">Peregrino</span>
        </div>
        <div className="w-24 flex justify-end">
          {user && (
            <button
              onClick={handleSignOut}
              className="text-[#E8E4D9]/40 hover:text-[#E8E4D9]/70 transition-colors text-xs uppercase tracking-widest"
            >
              Sair
            </button>
          )}
        </div>
      </header>

      <div className="pt-[56px]">
        <AnimatePresence mode="wait">
          {step === 'reveal' && (
            <StepReveal key="r" bookData={bookData}
              selectedModel={selectedModel} onSelectModel={setSelectedModel}
              hasCustomized={hasCustomized}
              dataLoading={dataLoading}
              noPhotosWarning={noPhotosWarning}
              user={user}
              onCustomize={handleCustomize}
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

      {/* Auth Gate Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onGuestMode={() => { setShowAuthModal(false); setStep('customize'); }}
          />
        )}
      </AnimatePresence>
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
function InteractiveBook({ bookData, selectedModel }: { bookData: BookData; selectedModel: ModelId }) {
  const { t } = useT();
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const { w, h } = useBookSize();

  const model = BOOK_MODELS.find(m => m.id === selectedModel) ?? BOOK_MODELS[1];
  const pageDefs = React.useMemo(() => generatePageDefs(model.pages), [model.pages]);
  const slotMap  = React.useMemo(() => buildPhotoSlotMap(pageDefs), [pageDefs]);
  const TOTAL = pageDefs.length;

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
                  <p className="text-white/45 uppercase tracking-wider" style={{ fontSize: fs(0.56), marginTop: sp(8) }}>{bookData.userName}</p>
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
              {pageDefs.map((def, idx) => (
                <FlipPage key={idx}>
                  {renderBookPage(def, idx, bookData, S, sp, fs, slotMap)}
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
function StepReveal({ bookData, selectedModel, onSelectModel, hasCustomized, dataLoading, noPhotosWarning, user, onCustomize, onOrder }: {
  bookData: BookData;
  selectedModel: ModelId;
  onSelectModel: (m: ModelId) => void;
  hasCustomized: boolean;
  dataLoading: boolean;
  noPhotosWarning: boolean;
  user: any;
  onCustomize: () => void;
  onOrder: () => void;
}) {
  const { t } = useT();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const aKm     = useCountUp(bookData.km,          1200, statsVisible && !dataLoading);
  const aDays   = useCountUp(bookData.days,         900,  statsVisible && !dataLoading);
  const aStamps = useCountUp(bookData.stampsCount,  800,  statsVisible && !dataLoading);
  const aPhotos = useCountUp(bookData.photosCount,  1100, statsVisible && !dataLoading);

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
          {dataLoading ? (
            <div className="flex flex-col items-center gap-6">
              {/* Skeleton do livro */}
              <div className="relative animate-pulse"
                style={{ width: 'clamp(165px,27vw,440px)', height: 'clamp(220px,36vw,587px)' }}>
                <div className="absolute left-0 top-0 bottom-0 w-[5%] rounded-l-sm bg-[#E8E4D9]/10" />
                <div className="w-full h-full rounded-r-xl rounded-l-sm bg-[#E8E4D9]/8"
                  style={{ boxShadow: '-20px 32px 80px rgba(0,0,0,0.8)' }} />
                <div className="absolute inset-0 flex flex-col justify-end p-8 gap-2">
                  <div className="h-px w-12 bg-[#E8E4D9]/20 mb-2" />
                  <div className="h-4 w-3/4 rounded-full bg-[#E8E4D9]/15" />
                  <div className="h-3 w-1/3 rounded-full bg-[#E8E4D9]/10" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#E8E4D9]/40 text-xs">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <span className="uppercase tracking-widest">A carregar a tua jornada...</span>
              </div>
            </div>
          ) : (
            <InteractiveBook bookData={bookData} selectedModel={selectedModel} />
          )}
        </motion.div>

        {/* Aviso: utilizador autenticado mas sem fotos */}
        {user && !dataLoading && noPhotosWarning && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 flex justify-center px-6 pb-4"
          >
            <div className="flex items-start gap-3 bg-[#C8A96E]/10 border border-[#C8A96E]/25 rounded-2xl px-5 py-4 max-w-sm">
              <Camera size={15} className="text-[#C8A96E]/70 mt-0.5 shrink-0" />
              <p className="text-[#E8E4D9]/60 text-xs leading-relaxed">
                Não encontramos fotos na tua jornada. Usa o app para registar os teus momentos.
              </p>
            </div>
          </motion.div>
        )}

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
  const [showGapModal, setShowGapModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pickedPhoto, setPickedPhoto] = useState<string | null>(null);
  const [pickedSlot, setPickedSlot] = useState<number | null>(null);

  const model = BOOK_MODELS.find(m => m.id === selectedModel) ?? BOOK_MODELS[1];
  const totalAvailable = bookData.allPhotos.length;
  const gap = Math.max(0, model.pages - totalAvailable);

  // Computa slots de foto e texto para o modelo atual
  const { pageDefs: customPageDefs, slotMap: customSlotMap, photoSlots, pageTextSlots } = useMemo(() => {
    const pageDefs = generatePageDefs(model.pages);
    const slotMap = buildPhotoSlotMap(pageDefs);
    const photoSlots: { pageIdx: number; slotIdx: number; slotPos: number }[] = [];
    const pageTextSlots: { pageIdx: number; kind: PageKind; slots: Array<'top' | 'bottom'> }[] = [];
    pageDefs.forEach((def, pageIdx) => {
      if (def.p === undefined || def.kind === 'panorama-R') return;
      const slots = slotMap.get(pageIdx) ?? [];
      slots.forEach((slotIdx, slotPos) => {
        photoSlots.push({ pageIdx, slotIdx, slotPos });
      });
    });
    pageDefs.forEach((def, pageIdx) => {
      const textSlots = PAGE_TEXT_SLOTS[def.kind];
      if (textSlots) pageTextSlots.push({ pageIdx, kind: def.kind, slots: textSlots });
    });
    return { pageDefs, slotMap, photoSlots, pageTextSlots };
  }, [model.pages]);

  const currentPhotoForSlot = useCallback((slotIdx: number): string | null => {
    if (bookData.photoAssignments[slotIdx] !== undefined) return bookData.photoAssignments[slotIdx];
    return slotIdx < bookData.allPhotos.length ? bookData.allPhotos[slotIdx] : null;
  }, [bookData.photoAssignments, bookData.allPhotos]);

  const assignPhoto = useCallback((slotIdx: number, photoUrl: string) => {
    onChange({ photoAssignments: { ...bookData.photoAssignments, [slotIdx]: photoUrl } });
    setPickedPhoto(null);
    setPickedSlot(null);
  }, [bookData.photoAssignments, onChange]);

  const removeAssignment = useCallback((slotIdx: number) => {
    const next = { ...bookData.photoAssignments };
    delete next[slotIdx];
    onChange({ photoAssignments: next });
  }, [bookData.photoAssignments, onChange]);

  const handleDone = () => {
    if (gap > 0) { setShowGapModal(true); return; }
    onDone();
  };

  // Redimensiona imagem via Canvas para max 1200px — evita data URLs gigantes que travam o browser
  const resizeForBook = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement;
      const blobUrl = URL.createObjectURL(file);
      img.onload = () => {
        const maxW = 1200;
        const scale = img.width > maxW ? maxW / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobUrl);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(); };
      img.src = blobUrl;
    });

  const handleUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadProgress(0);
    const dataUrls: string[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      try {
        const url = await resizeForBook(fileArray[i]);
        dataUrls.push(url);
      } catch { /* ignora arquivos inválidos */ }
      setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
    }
    setUploadProgress(null);
    const newAllPhotos = [...bookData.allPhotos, ...dataUrls];
    onChange({
      uploadedPhotos: [...(bookData.uploadedPhotos ?? []), ...dataUrls],
      allPhotos: newAllPhotos,
      photosCount: bookData.photosCount + dataUrls.length,
      selectedPhotos: newAllPhotos.slice(0, Math.min(newAllPhotos.length, 11)),
    });
    const newGap = Math.max(0, model.pages - newAllPhotos.length);
    if (newGap <= 0) { setShowGapModal(false); onDone(); }
  };

  return (
    <>
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
                        <p className="text-white/50 text-xs mt-1.5 uppercase tracking-wider">{bookData.userName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">{t('bp.s2.cover_photo')}</p>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {bookData.allPhotos.map((photo, i) => (
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
                <p className="text-[#2D3A27]/30 text-xs mt-2">— {bookData.userName}</p>
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

            {/* ── Textos por página ─────────────────────────────────────── */}
            <div className="border-t border-[#2D3A27]/8 pt-6">
              <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Textos das páginas</p>
              <p className="text-xs text-[#2D3A27]/35 mb-4">
                Adicione frases ou textos opcionais por página. Deixe em branco para não exibir. Cada campo permite escolher fonte e tamanho.
              </p>
              <div className="flex flex-col gap-4 max-h-[34rem] overflow-y-auto pr-1">
                {pageTextSlots.map(({ pageIdx, kind, slots: textSlots }) => {
                  const kindLabel: Record<PageKind, string> = {
                    'large-white': 'Foto com margem', 'stacked-2': 'Fotos empilhadas',
                    'grid-4-white': 'Grade 2×2', 'stagger-4': 'Colagem', 'trio-h': 'Trio H',
                    'trio-v': 'Trio V', 'full-dark': 'Foto sangrada', 'centered-dark': 'Foto centrada',
                    'panorama-L': 'Panorama', 'panorama-R': 'Panorama R', 'cover': 'Capa',
                    'preface': 'Prefácio', 'stamps': 'Selos', 'back-cover': 'Contracapa',
                  };
                  return (
                    <div key={pageIdx} className="bg-[#F5F2EA] rounded-2xl p-4 border border-[#2D3A27]/6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[0.6rem] uppercase tracking-widest text-[#2D3A27]/30 bg-[#2D3A27]/8 rounded-full px-2 py-0.5">
                          Pág. {pageIdx + 1}
                        </span>
                        <span className="text-xs text-[#2D3A27]/50">{kindLabel[kind]}</span>
                      </div>
                      {textSlots.map(slotPos => {
                        const key = `${pageIdx}-${slotPos}`;
                        const entry: PageTextEntry = bookData.pageTexts[key] ?? { text: '', fontSize: 'sm', fontFamily: 'inter' };
                        const updateEntry = (patch: Partial<PageTextEntry>) => {
                          const next = { ...bookData.pageTexts, [key]: { ...entry, ...patch } };
                          if (!patch.text && !entry.text) { delete next[key]; }
                          onChange({ pageTexts: next });
                        };
                        return (
                          <div key={slotPos} className="mb-3 last:mb-0">
                            <p className="text-[0.6rem] uppercase tracking-widest text-[#2D3A27]/30 mb-1.5">
                              {slotPos === 'top' ? 'Topo' : 'Rodapé'}
                            </p>
                            <textarea
                              value={entry.text}
                              maxLength={140}
                              rows={2}
                              onChange={e => updateEntry({ text: e.target.value })}
                              placeholder="Espaço para texto ou frase..."
                              className="w-full bg-white border border-[#2D3A27]/10 rounded-xl px-4 py-3 text-[#2D3A27] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3A27]/20 placeholder:text-[#2D3A27]/20 resize-none mb-2"
                              style={{ fontFamily: FONT_FAMILIES.find(f => f.id === entry.fontFamily)?.css }}
                            />
                            <div className="flex gap-2 flex-wrap">
                              {/* Seletor de tipologia */}
                              <div className="flex gap-1">
                                {FONT_FAMILIES.map(f => (
                                  <button key={f.id}
                                    onClick={() => updateEntry({ fontFamily: f.id })}
                                    className={`px-2 py-1 rounded-lg text-[0.6rem] border transition-all ${
                                      entry.fontFamily === f.id
                                        ? 'bg-[#2D3A27] text-[#E8E4D9] border-[#2D3A27]'
                                        : 'bg-white text-[#2D3A27]/50 border-[#2D3A27]/15 hover:border-[#2D3A27]/35'
                                    }`}
                                    style={{ fontFamily: f.css }}
                                  >
                                    {f.label}
                                  </button>
                                ))}
                              </div>
                              {/* Seletor de tamanho */}
                              <div className="flex gap-1">
                                {(Object.keys(FONT_SIZE_LABEL) as FontSize[]).map(sz => (
                                  <button key={sz}
                                    onClick={() => updateEntry({ fontSize: sz })}
                                    className={`w-7 h-7 rounded-lg text-[0.62rem] font-semibold border transition-all ${
                                      entry.fontSize === sz
                                        ? 'bg-[#2D3A27] text-[#E8E4D9] border-[#2D3A27]'
                                        : 'bg-white text-[#2D3A27]/50 border-[#2D3A27]/15 hover:border-[#2D3A27]/35'
                                    }`}
                                  >
                                    {FONT_SIZE_LABEL[sz]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'photos' && (
          <motion.div key="photos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">

            {/* — Galeria ————————————————————————————————————————————— */}
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40">Sua galeria</p>
                <p className="text-xs text-[#2D3A27]/30">{bookData.allPhotos.length} fotos</p>
              </div>
              {pickedPhoto ? (
                <div className="mb-2 px-3 py-2 bg-[#2D3A27]/8 rounded-xl flex items-center gap-2">
                  <img src={pickedPhoto} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                  <p className="text-xs text-[#2D3A27]/70 flex-1">Foto selecionada — toque em uma página abaixo para atribuir</p>
                  <button onClick={() => setPickedPhoto(null)} className="text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors"><X size={14} /></button>
                </div>
              ) : (
                <p className="text-xs text-[#2D3A27]/35 mb-2">Toque em uma foto para selecioná-la, depois toque na página desejada.</p>
              )}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-44 overflow-y-auto pr-1">
                {bookData.allPhotos.map((photo, i) => (
                  <button key={i}
                    onClick={() => setPickedPhoto(pickedPhoto === photo ? null : photo)}
                    className={`relative aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-150 ${pickedPhoto === photo ? 'ring-[#2D3A27] scale-105 shadow-md' : 'ring-transparent hover:ring-[#2D3A27]/30'}`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    {pickedPhoto === photo && (
                      <div className="absolute inset-0 bg-[#2D3A27]/30 flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* — Páginas do livro ————————————————————————————————————— */}
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40">Páginas do livro</p>
                <p className="text-xs text-[#2D3A27]/30">{photoSlots.length} slots · {Object.keys(bookData.photoAssignments).length} atribuídos</p>
              </div>
              <p className="text-xs text-[#2D3A27]/35 mb-3">
                {pickedPhoto ? 'Toque em uma página para atribuir a foto selecionada.' : 'Toque em qualquer página para trocar sua foto. Badge amarelo = atribuição manual.'}
              </p>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
                {photoSlots.map(({ slotIdx, pageIdx }) => {
                  const currentPhoto = currentPhotoForSlot(slotIdx);
                  const isManual = bookData.photoAssignments[slotIdx] !== undefined;
                  const isTarget = pickedSlot === slotIdx;
                  return (
                    <div key={slotIdx} className="relative">
                      <button
                        onClick={() => {
                          if (pickedPhoto) {
                            assignPhoto(slotIdx, pickedPhoto);
                          } else {
                            setPickedSlot(isTarget ? null : slotIdx);
                          }
                        }}
                        className={`relative w-full aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-150 ${
                          isTarget ? 'ring-[#2D3A27] scale-105 shadow-md' :
                          pickedPhoto ? 'ring-[#2D3A27]/40 hover:ring-[#2D3A27] hover:scale-105' :
                          'ring-transparent hover:ring-[#2D3A27]/25'
                        }`}
                      >
                        {currentPhoto ? (
                          <img src={currentPhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#F0EDE4] flex items-center justify-center">
                            <Camera size={14} className="text-[#2D3A27]/20" />
                          </div>
                        )}
                        {pickedPhoto && (
                          <div className="absolute inset-0 bg-[#2D3A27]/20 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-[#2D3A27]/70 flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 text-[0.5rem] text-white/70 bg-black/30 rounded px-1">{slotIdx + 1}</span>
                      </button>
                      {isManual && (
                        <button
                          onClick={() => removeAssignment(slotIdx)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 transition-colors z-10"
                          title="Remover atribuição manual"
                        >
                          <X size={8} className="text-white" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {Object.keys(bookData.photoAssignments).length > 0 && (
                <button
                  onClick={() => onChange({ photoAssignments: {} })}
                  className="mt-3 text-xs text-[#2D3A27]/40 hover:text-red-500 transition-colors underline underline-offset-2"
                >
                  Remover todas as atribuições manuais
                </button>
              )}
            </div>

            {/* — Picker inline quando slot selecionado sem foto prévia ——— */}
            {pickedSlot !== null && !pickedPhoto && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="border border-[#2D3A27]/10 rounded-2xl p-4 bg-[#F5F2EA]">
                <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">
                  Escolha uma foto para o slot {pickedSlot + 1}
                </p>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {bookData.allPhotos.map((photo, i) => (
                    <button key={i}
                      onClick={() => assignPhoto(pickedSlot!, photo)}
                      className="aspect-square rounded-lg overflow-hidden ring-1 ring-transparent hover:ring-[#2D3A27]/40 transition-all"
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setPickedSlot(null)} className="mt-3 text-xs text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors">Cancelar</button>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-4 border-t border-[#2D3A27]/8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors">
          <ArrowLeft size={15} /> {t('bp.s2.back')}
        </button>
        <motion.button onClick={handleDone} disabled={bookData.selectedPhotos.length < 4}
          whileHover={bookData.selectedPhotos.length >= 4 ? { scale: 1.03 } : {}}
          whileTap={bookData.selectedPhotos.length >= 4 ? { scale: 0.97 } : {}}
          className="bg-[#2D3A27] text-[#E8E4D9] px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 hover:bg-[#1B2616] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('bp.s2.done')} <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>

    {/* Gap Modal — aparece se fotos < páginas do plano */}
    <AnimatePresence>
      {showGapModal && (
        <GapModal
          gap={gap}
          planName={model.label}
          planPages={model.pages}
          currentPhotos={totalAvailable}
          uploadProgress={uploadProgress}
          onUpload={handleUpload}
          onKeepStamps={() => { setShowGapModal(false); onDone(); }}
          onClose={() => setShowGapModal(false)}
        />
      )}
    </AnimatePresence>
    </>
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
          <p className="text-xs text-[#2D3A27]/40 uppercase tracking-wider">{bookData.userName}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">📸 {bookData.photosCount + (bookData.uploadedPhotos?.length ?? 0)} {t('bp.stat.photos')}</span>
            <span className="text-xs bg-[#2D3A27]/8 text-[#2D3A27]/60 px-2.5 py-1 rounded-full">🗺️ {bookData.km} km</span>
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
