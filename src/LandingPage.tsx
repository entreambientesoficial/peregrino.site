import React, { useRef, useState, useEffect } from 'react';
import { I18nProvider, useT, AVAILABLE_LANGS } from './i18n';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
  MapPin, ShieldAlert,
  CloudSun, Activity, QrCode as QrIcon, Scroll,
  Camera, X,
  Apple, PlayCircle, ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <I18nProvider>
      <LandingPageInner />
    </I18nProvider>
  );
}

const LanguageSwitcher = () => {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const current = AVAILABLE_LANGS.find(l => l.code === lang)!;

  return (
    <div className="fixed top-5 right-5 z-[200]">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-black/10 shadow-lg rounded-full px-3 py-1.5 text-sm font-sans font-medium text-[#2D3A27] hover:bg-white transition-colors"
      >
        <span>{current.flag}</span>
        <span className="text-xs tracking-wide">{current.label}</span>
        <span className="text-[#2D3A27]/40 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-10 right-0 bg-white/95 backdrop-blur-md border border-black/10 shadow-2xl rounded-2xl overflow-hidden w-52"
          >
            {AVAILABLE_LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-left hover:bg-[#E8E4D9]/60 transition-colors ${l.code === lang ? 'bg-[#E8E4D9]/80 font-semibold' : ''}`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="text-[#2D3A27]">{l.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function LandingPageInner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isCJK } = useT();

  return (
    <div
      className="min-h-screen bg-[#FDFCF8] font-sans selection:bg-[#2D3A27] selection:text-[#E8E4D9]"
      style={isCJK ? { fontFamily: "'Noto Sans JP', 'Noto Sans KR', 'Noto Sans SC', sans-serif" } : {}}
    >
      <LanguageSwitcher />
      <HeroSection onOpenModal={() => setIsModalOpen(true)} />
      <FeaturesSection />
      <JourneySection />
      <BookSection />

      <AnimatePresence>
        {isModalOpen && (
          <DownloadModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const HeroSection = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const { t } = useT();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleLines = t('hero.title').split('\n');

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="video-apoio/2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#E8E4D9] mb-8 tracking-tight drop-shadow-md">
          {titleLines[0]}{titleLines[1] && <><br />{titleLines[1]}</>}
        </h1>
        <motion.button
          onClick={onOpenModal}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(232,228,217,1)', color: '#2D3A27' }}
          whileTap={{ scale: 0.95 }}
          className="border border-[#E8E4D9] text-[#E8E4D9] px-8 py-4 rounded-full text-lg font-medium tracking-wide transition-colors duration-300 backdrop-blur-sm"
        >
          {t('hero.cta')}
        </motion.button>
      </motion.div>
    </section>
  );
};

const DownloadModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useT();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1B2616]/60 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-[#F4F1EA] w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full bg-[#2D3A27]/5 text-[#2D3A27] hover:bg-[#2D3A27]/10 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Buttons */}
          <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.3em] text-[#2D3A27]/40 font-sans font-black mb-4 block">
              {t('modal.tagline')}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2D3A27] mb-10 leading-tight italic">
              {t('modal.title')}
            </h2>

            <div className="flex flex-col gap-4">
              <DownloadButton
                store="App Store"
                icon={<Apple className="w-6 h-6" />}
                sub={t('modal.ios')}
              />
              <DownloadButton
                store="Google Play"
                icon={<PlayCircle className="w-6 h-6" />}
                sub={t('modal.android')}
              />
            </div>
          </div>

          {/* Right Side: QR Code (Desktop Only) */}
          <div className="hidden md:flex w-[240px] bg-[#2D3A27] p-10 flex-col items-center justify-center text-center border-l border-black/5">
            <div className="p-4 bg-white rounded-3xl shadow-xl mb-6">
              <QrIcon className="w-32 h-32 text-[#2D3A27]" strokeWidth={1.5} />
            </div>
            <p className="text-[#E8E4D9]/80 text-sm font-sans leading-relaxed">
              {t('modal.qr')}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DownloadButton = ({ store, icon, sub }: { store: string, icon: React.ReactNode, sub: string }) => (
  <motion.button
    whileHover={{ x: 8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-4 bg-[#2D3A27] text-[#E8E4D9] p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full text-left group"
  >
    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-[#E8E4D9]/40 leading-none mb-1">{sub}</span>
      <span className="text-xl font-medium tracking-tight leading-none">{store}</span>
    </div>
  </motion.button>
);

const FeaturesSection = () => {
  const { t } = useT();
  const cards = [
    { titleKey: 'features.sos.title',     descKey: 'features.sos.desc',     icon: <ShieldAlert className="w-8 h-8 text-[#E8E4D9]" strokeWidth={1} />, className: "md:col-span-2 bg-gradient-to-br from-[#2D4F3C] to-[#1E3A2B] border-[#ffffff10]" },
    { titleKey: 'features.weather.title', descKey: 'features.weather.desc', icon: <CloudSun    className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#3E4A33] to-[#2D3A27] border-[#ffffff10]" },
    { titleKey: 'features.terrain.title', descKey: 'features.terrain.desc', icon: <Activity    className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#4A3728] to-[#2D1B12] border-[#ffffff10]" },
    { titleKey: 'features.legacy.title',  descKey: 'features.legacy.desc',  icon: <Scroll      className="w-8 h-8 text-[#E8E4D9]" strokeWidth={1} />, className: "md:col-span-2 bg-gradient-to-br from-[#1E3A2B] to-[#0F1A13] border-[#ffffff10]" },
    { titleKey: 'features.stamps.title',  descKey: 'features.stamps.desc',  icon: <QrIcon      className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#2D3327] to-[#1B2616] border-[#ffffff10]" },
    { titleKey: 'features.guide.title',   descKey: 'features.guide.desc',   icon: <MapPin      className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#3E4A33] to-[#2D3A27] border-[#ffffff10]" },
    { titleKey: 'features.camera.title',  descKey: 'features.camera.desc',  icon: <Camera      className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#4A3728] to-[#2D1B12] border-[#ffffff10]" },
  ];

  return (
    <section className="py-32 px-4 md:px-8 relative bg-[#1B2616] overflow-hidden">
      {/* Organic Background Textures */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-topography opacity-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.4em] text-[#E8E4D9]/40 font-sans font-bold mb-4 block"
          >
            {t('features.eyebrow')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl text-[#E8E4D9] leading-tight text-balance"
          >
            {t('features.title')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
                transition: { duration: 0.4, ease: "easeOut" } 
              }}
              className={`group relative rounded-[3rem] border border-white/5 shadow-tactile flex flex-col min-h-[340px] transition-all duration-700 overflow-hidden ${card.className}`}
            >
              {/* Inner Gradient Glow */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none" />
              
              {/* Header Space (Compact) */}
              <div className="relative z-10 flex items-center gap-4 px-10 pt-10 mb-2">
                <div className="p-3 rounded-full bg-black/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shrink-0">
                  {/* Matching the icon size from the previous 'compact' version */}
                  {React.cloneElement(card.icon as React.ReactElement, { className: 'w-6 h-6 text-[#E8E4D9]' })}
                </div>
                <h3 className="font-serif text-2xl font-medium tracking-tight leading-tight text-[#E8E4D9]">
                  {t(card.titleKey)}
                </h3>
              </div>

              {/* Centralization Space (Visual Symmetry) */}
              <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-4">
                <p className="font-sans leading-relaxed text-lg md:text-xl font-normal text-[#E8E4D9] group-hover:text-white transition-colors duration-500">
                  {t(card.descKey)}
                </p>
              </div>

              {/* Decorative Shine */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2D4F3C]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4A3728]/20 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

const JourneySection = () => {
  const { t } = useT();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const total = 12;
    const idx = Math.min(Math.floor(latest * total), total - 1);
    setActiveIndex(idx);
  });

  const routes = [
    { name: "Caminho Francês",           tagKey: "journey.tag.frances",           start: "St-Jean-Pied-de-Port / Somport", dist: "765km", steps: 33, img: "/img-apoio/card1-St-Jean-Pied-de-Port.jpg" },
    { name: "Caminho Português (Central)",tagKey: "journey.tag.portugues.central", start: "Porto",                          dist: "274km", steps: 11, img: "/img-apoio/card2-porto.png" },
    { name: "Caminho Português (Lisboa)", tagKey: "journey.tag.portugues.lisboa",  start: "Lisboa",                         dist: "625km", steps: 25, img: "/img-apoio/card10-caminho-portugues-lisboa.png" },
    { name: "Caminho Português (Costa)",  tagKey: "journey.tag.portugues.costa",   start: "Porto (variante litoral)",        dist: "281km", steps: 13, img: "/img-apoio/card3-Porto-litoral.png" },
    { name: "Português Interior",         tagKey: "journey.tag.interior",          start: "Viseu",                          dist: "426km", steps: 17, img: "/img-apoio/card9-viseu.png" },
    { name: "Caminho Primitivo",          tagKey: "journey.tag.primitivo",         start: "Oviedo",                         dist: "321km", steps: 14, img: "/img-apoio/card4-oviedo.webp" },
    { name: "Caminho do Norte",           tagKey: "journey.tag.norte",             start: "Irún",                           dist: "817km", steps: 35, img: "/img-apoio/card5-norte.png" },
    { name: "Caminho Inglês",             tagKey: "journey.tag.ingles",            start: "Ferrol / A Coruña",              dist: "126km", steps:  6, img: "/img-apoio/card6-ferrol.png" },
    { name: "Caminho Aragonês",           tagKey: "journey.tag.aragones",          start: "Somport",                        dist: "166km", steps:  6, img: "/img-apoio/card11-caminho-aragones.png" },
    { name: "Vía de la Plata",            tagKey: "journey.tag.plata",             start: "Sevilha",                        dist: "990km", steps: 36, img: "/img-apoio/card7-via-de-la-plata.png" },
    { name: "Caminho Sanabrês",           tagKey: "journey.tag.sanabres",          start: "Granja de Moreruela",            dist: "340km", steps: 11, img: "/img-apoio/card8-granja-de-moreruela.png" },
    { name: "Caminho de Inverno",         tagKey: "journey.tag.inverno",           start: "Ponferrada",                     dist: "269km", steps: 10, img: "/img-apoio/card12-caminho-de-inverno.png" },
  ];


  const total = routes.length;

  return (
    <section ref={sectionRef} className="h-[740vh] relative z-20 bg-[#E8E4D9]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center">

        <div className="relative z-30 pt-8 md:pt-10 text-center px-4 w-full bg-transparent pb-4">
          <motion.h2
            className="font-serif text-4xl md:text-7xl text-[#2D3A27] tracking-tight italic"
          >
            {t('journey.title')}
          </motion.h2>
          <div className="mt-2 h-px w-24 bg-[#2D3A27]/20 mx-auto" />
        </div>

        <div className="relative w-full max-w-5xl h-[420px] md:h-[500px] px-4 md:px-0 mt-6 md:mt-8 z-10">
          {routes.map((route, idx) => (
            <SequentialCard
              key={idx}
              route={route}
              index={idx}
              total={total}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Indicador de progresso */}
        <div className="flex items-center gap-3 mt-6 z-30">
          <div className="flex gap-1.5">
            {routes.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === activeIndex ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: idx === activeIndex ? '#2D3A27' : '#2D3A2740',
                }}
              />
            ))}
          </div>
          <span className="font-sans text-xs text-[#2D3A27]/50 tabular-nums tracking-wider">
            {activeIndex + 1} / {total}
          </span>
        </div>

      </div>
    </section>
  );
};

const SequentialCard = ({ route, index, total, progress }: { route: any, index: number, total: number, progress: any }) => {
  const { t } = useT();
  const isLast = index === total - 1;
  const segment = 1.0 / total;
  const start = index * segment;
  const end = (index + 1) * segment;

  // Último card nunca sai — fica fixo até a próxima seção cobri-lo
  const y = useTransform(progress, [start, isLast ? 1 : end], [0, isLast ? 0 : -1000]);
  const opacity = useTransform(progress, [start, isLast ? 1 : end], [1, 1]);
  const scale = useTransform(progress, [start, isLast ? 1 : end], [1, isLast ? 1 : 0.9]);
  const rotate = useTransform(progress, [start, isLast ? 1 : end], [0, isLast ? 0 : -10]);

  return (
    <motion.div
      style={{ 
        y, 
        opacity, 
        scale,
        rotate,
        zIndex: total - index,
        position: 'absolute',
        paddingTop: '0', // Reset any padding
        transform: 'translate(-50%, -50%)', // Use standard transform for static centering
        marginTop: y, // Using marginTop for the vertical movement animation
      }}
      className="w-full max-w-5xl h-[450px] md:h-[500px] rounded-[3.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-end p-8 md:p-16 group border border-white/10 bg-[#1B2616]"
    >
      {/* Nature Image */}
      <div className="absolute inset-0 z-0 scale-105 group-hover:scale-110 transition-transform duration-[5s] ease-out">
        <img 
          src={route.img} 
          alt={route.name}
          className="w-full h-full object-cover"
        />
        {/* Dark transparency overlay requested by user */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Gradient shadow for text emphasis */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-20" />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 text-left">
        <div className="max-w-2xl">
          <span className="text-[#E8E4D9]/60 text-xs md:text-sm uppercase tracking-[0.4em] font-sans font-black mb-4 block">
            {t(route.tagKey)}
          </span>
          <h3 className="font-serif text-4xl md:text-7xl text-[#E8E4D9] mb-8 tracking-tighter leading-none group-hover:text-white transition-colors">
            {route.name}
          </h3>
          <div className="flex flex-wrap gap-8 text-[#E8E4D9]/80 font-sans text-sm md:text-base border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('journey.label.start')}</span>
              <span className="font-medium font-serif italic text-lg text-[#E8E4D9]">{route.start}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('journey.label.dist')}</span>
              <span className="font-medium font-serif italic text-lg text-white">{route.dist}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('journey.label.stages')}</span>
              <span className="font-medium font-serif italic text-lg text-[#E8E4D9]">{route.steps}</span>
            </div>
          </div>
        </div>
        
        {/* Removido o emblema ícone conforme solicitado */}
        <div className="hidden md:flex flex-col items-end pb-2">
        </div>
      </div>
    </motion.div>
  );
};

const BookSection = () => {
  const { t } = useT();
  const sectionRef = useRef(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phraseKeys = ['book.phrase1', 'book.phrase2', 'book.phrase3', 'book.phrase4', 'book.phrase5'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex(i => (i + 1) % phraseKeys.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section ref={sectionRef} className="pt-8 pb-10 px-4 relative z-30 bg-[#FDFCF8]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#E8E4D9_0%,_#FDFCF8_70%)]" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-4 md:mb-5">
          <h2 className="font-serif text-4xl md:text-6xl text-[#2D1B14] mb-3 italic">
            {t('book.title')}
          </h2>

          {/* Frases animadas */}
          <div className="relative h-8 md:h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                className="absolute font-serif text-lg md:text-2xl text-[#2D1B14]/50 italic"
              >
                {t(phraseKeys[phraseIndex])}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Vídeo */}
        <motion.div
          style={{ opacity, y, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.22))" }}
          className="w-full overflow-hidden rounded-2xl md:rounded-3xl"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block"
          >
            <source src="/img-apoio/video-site-peregrino.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* CTA */}
        <motion.div
          style={{ opacity, y }}
          className="mt-10 md:mt-14 flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2D1B14] text-[#FDFCF8] px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-lg font-bold shadow-2xl flex items-center gap-3 border border-white/5"
          >
            {t('book.cta')}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};
