import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Map, MapPin, ShieldAlert, BookOpen, 
  CloudSun, Activity, QrCode as QrIcon, Scroll, 
  Wind, Navigation, Zap, Bell, Landmark, UserCheck, Camera, X,
  Apple, PlayCircle
} from 'lucide-react';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans selection:bg-[#2D3A27] selection:text-[#E8E4D9]">
      <HeroSection onOpenModal={() => setIsModalOpen(true)} />
      <FeaturesSection />
      <JourneySection onOpenModal={() => setIsModalOpen(true)} />
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
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="video-apoio/2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#E8E4D9] mb-8 tracking-tight drop-shadow-md">
          Sua jornada merece<br />ser eterna.
        </h1>
        <motion.button 
          onClick={onOpenModal}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(232,228,217,1)', color: '#2D3A27' }}
          whileTap={{ scale: 0.95 }}
          className="border border-[#E8E4D9] text-[#E8E4D9] px-8 py-4 rounded-full text-lg font-medium tracking-wide transition-colors duration-300 backdrop-blur-sm"
        >
          Comece o Caminho
        </motion.button>
      </motion.div>
    </section>
  );
};

const DownloadModal = ({ onClose }: { onClose: () => void }) => {
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
              Peregrino App
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2D3A27] mb-10 leading-tight italic">
              Sua jornada começa aqui.
            </h2>
            
            <div className="flex flex-col gap-4">
              <DownloadButton 
                store="App Store" 
                icon={<Apple className="w-6 h-6" />} 
                sub="Baixe para iOS"
              />
              <DownloadButton 
                store="Google Play" 
                icon={<PlayCircle className="w-6 h-6" />} 
                sub="Baixe para Android"
              />
            </div>
          </div>

          {/* Right Side: QR Code (Desktop Only) */}
          <div className="hidden md:flex w-[240px] bg-[#2D3A27] p-10 flex-col items-center justify-center text-center border-l border-black/5">
            <div className="p-4 bg-white rounded-3xl shadow-xl mb-6">
              <QrIcon className="w-32 h-32 text-[#2D3A27]" strokeWidth={1.5} />
            </div>
            <p className="text-[#E8E4D9]/80 text-sm font-sans leading-relaxed">
              Aponte a câmera para baixar direto no seu celular.
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
  const cards = [
    {
      id: 1,
      title: "Segurança em Tempo Real",
      desc: "Sinta a proteção de uma comunidade conectada. Com o SOS inteligente, você sinaliza sua urgência e mobiliza peregrinos ao seu redor instantaneamente.",
      icon: <ShieldAlert className="w-8 h-8 text-[#E8E4D9]" strokeWidth={1} />,
      className: "md:col-span-2 bg-gradient-to-br from-[#2D4F3C] to-[#1E3A2B] border-[#ffffff10]",
    },
    {
      id: 2,
      title: "Clima da Trilha",
      desc: "Alertas meteorológicos precisos para sua localização exata. Saiba quando se proteger antes da primeira gota cair.",
      icon: <CloudSun className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />,
      className: "bg-gradient-to-br from-[#3E4A33] to-[#2D3A27] border-[#ffffff10]",
    },
    {
      id: 3,
      title: "Domine o Terreno",
      desc: "Gráficos de elevação e progresso da etapa para você gerenciar sua energia como um veterano.",
      icon: <Activity className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />,
      className: "bg-gradient-to-br from-[#4A3728] to-[#2D1B12] border-[#ffffff10]",
    },
    {
      id: 4,
      title: "Sua Jornada Eternizada",
      desc: "Colecione selos digitais em cada etapa e, ao chegar em Santiago, transforme suas memórias em um álbum físico exclusivo de colecionador.",
      icon: <Scroll className="w-8 h-8 text-[#E8E4D9]" strokeWidth={1} />,
      className: "md:col-span-2 bg-gradient-to-br from-[#1E3A2B] to-[#0F1A13] border-[#ffffff10]",
    },
    {
      id: 5,
      title: "Selos e Conquistas",
      desc: "Registre sua evolução oficial no Caminho. Escaneie os QR Codes em cada etapa para validar sua passagem e completar sua Credencial Digital.",
      icon: <QrIcon className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />,
      className: "bg-gradient-to-br from-[#2D3327] to-[#1B2616] border-[#ffffff10]",
    },
    {
      id: 6,
      title: "Guia de Essenciais",
      desc: "Localize fontes, pontos de descanso e albergues abertos conforme você caminha. O essencial, sempre à mão.",
      icon: <MapPin className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />,
      className: "bg-gradient-to-br from-[#3E4A33] to-[#2D3A27] border-[#ffffff10]",
    },
    {
      id: 7,
      title: "Câmera da Trilha",
      desc: "Capture a essência da jornada. Use a nossa câmera integrada para organizar suas fotos automaticamente por etapa e localização.",
      icon: <Camera className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />,
      className: "bg-gradient-to-br from-[#4A3728] to-[#2D1B12] border-[#ffffff10]",
    }
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
            Experiência Completa
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl text-[#E8E4D9] leading-tight text-balance"
          >
            Tudo o que você precisa para o seu Caminho.
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
                  {card.title}
                </h3>
              </div>
              
              {/* Centralization Space (Visual Symmetry) */}
              <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-4">
                <p className="font-sans leading-relaxed text-lg md:text-xl font-normal text-[#E8E4D9] group-hover:text-white transition-colors duration-500">
                  {card.desc}
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

const JourneySection = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const routes = [
    { 
      name: "Caminho Francês", 
      tag: "O Clássico dos Pirineus", 
      start: "St-Jean-Pied-de-Port / Somport", 
      dist: "780km", 
      steps: "31 a 39 dias",
      img: "/img-apoio/card1-St-Jean-Pied-de-Port.jpg"
    },
    { 
      name: "Caminho Português (Central)", 
      tag: "A Herança de Santiago", 
      start: "Porto", 
      dist: "240km", 
      steps: "10 a 12 dias",
      img: "/img-apoio/card2-porto.png"
    },
    { 
      name: "Caminho Português (Costa)", 
      tag: "O Som do Atlântico", 
      start: "Porto (variante litoral)", 
      dist: "260km", 
      steps: "11 a 13 dias",
      img: "/img-apoio/card3-Porto-litoral.png"
    },
    { 
      name: "Caminho Primitivo", 
      tag: "A Primeira Rota", 
      start: "Oviedo", 
      dist: "320km", 
      steps: "13 a 16 dias",
      img: "/img-apoio/card4-oviedo.webp"
    },
    { 
      name: "Caminho do Norte", 
      tag: "O Caminho do Mar", 
      start: "Irún", 
      dist: "825km", 
      steps: "33 a 41 dias",
      img: "/img-apoio/card5-norte.png"
    },
    { 
      name: "Caminho Inglês", 
      tag: "A Rota Marítima", 
      start: "Ferrol / A Coruña", 
      dist: "112km", 
      steps: "5 a 6 dias",
      img: "/img-apoio/card6-ferrol.png"
    },
    { 
      name: "Vía de la Plata", 
      tag: "O Gigante do Sul", 
      start: "Sevilha", 
      dist: "1.000km", 
      steps: "40 a 50 dias",
      img: "/img-apoio/card7-via-de-la-plata.png"
    },
    { 
      name: "Caminho Sanabrés", 
      tag: "Conexão Galega", 
      start: "Granja de Moreruela", 
      dist: "370km", 
      steps: "15 a 19 dias",
      img: "/img-apoio/card8-granja-de-moreruela.png"
    },
    { 
      name: "Português Interior", 
      tag: "A Rota das Aldeias", 
      start: "Viseu", 
      dist: "385km", 
      steps: "15 a 20 dias",
      img: "/img-apoio/card9-viseu.png"
    },
  ];

  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.98], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.85, 0.98], [0.9, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.98], [100, 0]);

  return (
    <section ref={sectionRef} className="h-[600vh] relative z-20 bg-[#E8E4D9]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center">
        
        <div className="relative z-30 pt-8 md:pt-10 text-center px-4 w-full bg-transparent pb-4">
          <motion.h2 
            className="font-serif text-4xl md:text-7xl text-[#2D3A27] tracking-tight italic"
          >
            Escolha o seu destino.
          </motion.h2>
          <div className="mt-2 h-px w-24 bg-[#2D3A27]/20 mx-auto" />
        </div>

        <div className="relative w-full max-w-5xl h-[420px] md:h-[500px] px-4 md:px-0 mt-6 md:mt-8 z-10">
          {routes.map((route, idx) => (
            <SequentialCard 
              key={idx} 
              route={route} 
              index={idx} 
              total={routes.length} 
              progress={scrollYProgress} 
            />
          ))}

          <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
            <motion.div 
              style={{ opacity: ctaOpacity, scale: ctaScale, y: ctaY }}
              className="w-full max-w-4xl bg-[#1B2616] p-12 md:p-24 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] text-center relative z-50 pointer-events-auto border border-white/10"
            >
              <h3 className="font-serif text-5xl md:text-8xl text-[#E8E4D9] mb-8 italic">
                Sua história começa agora.
              </h3>
              <p className="text-[#E8E4D9]/60 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-sans leading-relaxed">
                Escolha um dos 9 caminhos, baixe os mapas offline e junte-se à nossa comunidade de peregrinos.
              </p>
              <div className="flex justify-center">
                <motion.button
                  onClick={onOpenModal}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#E8E4D9] text-[#1B2616] px-12 py-5 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Baixar o App Agora
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SequentialCard = ({ route, index, total, progress }: { route: any, index: number, total: number, progress: any }) => {
  // Card 1: 0.0 -> 0.14
  // Card 2: 0.14 -> 0.28...
  const segment = 0.85 / total;
  const start = index * segment;
  const end = (index + 1) * segment;

  // Animação de Saída (Slide Up e Fade)
  const y = useTransform(progress, [start, end], [0, -1000]);
  const opacity = useTransform(progress, [start, end], [1, 0]);
  const scale = useTransform(progress, [start, end], [1, 0.9]);
  const rotate = useTransform(progress, [start, end], [0, -10]);

  return (
    <motion.div
      style={{ 
        y, 
        opacity, 
        scale,
        rotate,
        zIndex: total - index,
        position: 'absolute',
        top: '50%',
        left: '50%',
        x: '-50%',
        y: '-50%',
        marginTop: y, // Using marginTop for the vertical movement to keep the initial 'y' transform free for centering
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
            {route.tag}
          </span>
          <h3 className="font-serif text-4xl md:text-7xl text-[#E8E4D9] mb-8 tracking-tighter leading-none group-hover:text-white transition-colors">
            {route.name}
          </h3>
          <div className="flex flex-wrap gap-8 text-[#E8E4D9]/80 font-sans text-sm md:text-base border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Início</span>
              <span className="font-medium font-serif italic text-lg text-[#E8E4D9]">{route.start}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Distância</span>
              <span className="font-medium font-serif italic text-lg text-white">{route.dist}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Etapas</span>
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
  const ref = useRef(null);
  
  // Track scroll inside this specific section to rotate the page
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"]
  });

  // Rotates from 0 to -180 across the scroll
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <section ref={ref} className="h-[150vh] flex flex-col items-center relative overflow-visible bg-[#2D3A27]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3A4A33] to-[#2D3A27]" />
        
        <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center">
          <h2 className="font-serif text-4xl md:text-6xl text-[#E8E4D9] mb-4">O Legado</h2>
          <p className="font-sans text-lg md:text-xl text-[#E8E4D9]/80 max-w-2xl mb-16 font-light">
            Transforme suas memórias em um livro de arte físico.
          </p>

          {/* Book Wrapper */}
          <div className="relative w-[320px] h-[450px] md:w-[450px] md:h-[600px] mb-16" style={{ perspective: '2000px' }}>
            
            {/* Back cover (Left side) */}
            <div className="absolute top-0 right-1/2 w-full h-full bg-[#E8E4D9] rounded-l-2xl shadow-2xl border-r border-black/10 origin-right p-6 flex flex-col">
               <div className="h-[60%] w-full rounded bg-[url('https://images.unsplash.com/photo-1598004141512-421774e142e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')] bg-cover bg-center mix-blend-multiply" />
               <div className="mt-8 flex gap-4">
                 <div className="w-16 h-16 rounded-full border-2 border-[#8B4513] flex items-center justify-center flex-shrink-0 opacity-80 mix-blend-multiply">
                   <span className="text-[12px] font-serif font-bold text-[#8B4513] -rotate-12">STAMP</span>
                 </div>
                 <p className="text-sm font-serif text-[#2D3A27] leading-relaxed italic">
                   "O caminho se faz caminhando. As memórias ficam guardadas para a eternidade."
                 </p>
               </div>
            </div>

            {/* Front cover (Right side) that rotates */}
            <motion.div 
              style={{ rotateY, transformStyle: "preserve-3d" }}
              className="absolute top-0 left-1/2 w-full h-full origin-left"
            >
              {/* Front Face (Outside) */}
              <div 
                className="absolute inset-0 bg-[#8B4513] rounded-r-2xl shadow-2xl flex items-center justify-center p-8 border-l-8 border-black/30"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="border border-[#E8E4D9]/40 w-full h-full p-4 flex flex-col items-center justify-center gap-6 rounded-sm relative">
                  <BookOpen className="w-16 h-16 text-[#E8E4D9]/90" strokeWidth={1.5} />
                  <h3 className="font-serif text-3xl text-[#E8E4D9] text-center tracking-wide leading-snug">
                    Diário do<br/>Peregrino
                  </h3>
                  <div className="absolute bottom-10 w-12 h-px bg-[#E8E4D9]/40" />
                </div>
              </div>
              
              {/* Back Face (Inside page) */}
              <div 
                className="absolute inset-0 bg-[#E8E4D9] rounded-l-2xl shadow-xl p-8 flex flex-col items-center justify-center border-l border-white/40" 
                style={{ backfaceVisibility: "hidden", transform: 'rotateY(180deg)' }}
              >
                <p className="font-serif text-[#2D3A27] text-2xl text-center leading-relaxed">
                  Suas milhas.<br />Sua história.<br />Seu legado.
                </p>
              </div>
            </motion.div>
            
            {/* Book Spine Shadow */}
            <div className="absolute top-0 left-1/2 w-4 h-full bg-gradient-to-r from-black/40 to-transparent -translate-x-full z-0" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#A0522D" }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#8B4513] text-[#E8E4D9] px-10 py-5 rounded-full text-lg font-medium shadow-[0_10px_40px_rgba(139,69,19,0.4)] hover:shadow-[0_10px_50px_rgba(139,69,19,0.6)] transition-all duration-300"
          >
            Garanta seu Livro de Recordações
          </motion.button>
        </div>
      </div>
    </section>
  );
};
