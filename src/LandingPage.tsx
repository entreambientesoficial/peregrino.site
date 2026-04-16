import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { 
  Map, MapPin, ShieldAlert, BookOpen, 
  CloudSun, Activity, QrCode as QrIcon, Scroll, 
  Wind, Navigation, Zap, Bell, Landmark, UserCheck, Camera, X,
  Apple, PlayCircle, ArrowRight
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
      dist: "765km",
      steps: "33 etapas",
      img: "/img-apoio/card1-St-Jean-Pied-de-Port.jpg"
    },
    {
      name: "Caminho Português (Central)",
      tag: "A Herança de Santiago",
      start: "Porto",
      dist: "274km",
      steps: "11 etapas",
      img: "/img-apoio/card2-porto.png"
    },
    {
      name: "Caminho Português (Lisboa)",
      tag: "A Grande Peregrinação",
      start: "Lisboa",
      dist: "625km",
      steps: "25 etapas",
      img: "/img-apoio/card10-caminho-portugues-lisboa.png"
    },
    {
      name: "Caminho Português (Costa)",
      tag: "O Som do Atlântico",
      start: "Porto (variante litoral)",
      dist: "281km",
      steps: "13 etapas",
      img: "/img-apoio/card3-Porto-litoral.png"
    },
    {
      name: "Português Interior",
      tag: "A Rota das Aldeias",
      start: "Viseu",
      dist: "426km",
      steps: "17 etapas",
      img: "/img-apoio/card9-viseu.png"
    },
    {
      name: "Caminho Primitivo",
      tag: "A Primeira Rota",
      start: "Oviedo",
      dist: "321km",
      steps: "14 etapas",
      img: "/img-apoio/card4-oviedo.webp"
    },
    {
      name: "Caminho do Norte",
      tag: "O Caminho do Mar",
      start: "Irún",
      dist: "817km",
      steps: "35 etapas",
      img: "/img-apoio/card5-norte.png"
    },
    {
      name: "Caminho Inglês",
      tag: "A Rota Marítima",
      start: "Ferrol / A Coruña",
      dist: "126km",
      steps: "6 etapas",
      img: "/img-apoio/card6-ferrol.png"
    },
    {
      name: "Caminho Aragonês",
      tag: "Pelos Passos de Aragão",
      start: "Somport",
      dist: "166km",
      steps: "6 etapas",
      img: "/img-apoio/card11-caminho-aragones.png"
    },
    {
      name: "Vía de la Plata",
      tag: "O Gigante do Sul",
      start: "Sevilha",
      dist: "990km",
      steps: "36 etapas",
      img: "/img-apoio/card7-via-de-la-plata.png"
    },
    {
      name: "Caminho Sanabrês",
      tag: "Conexão Galega",
      start: "Granja de Moreruela",
      dist: "340km",
      steps: "11 etapas",
      img: "/img-apoio/card8-granja-de-moreruela.png"
    },
    {
      name: "Caminho de Inverno",
      tag: "A Rota do Fogo e Neve",
      start: "Ponferrada",
      dist: "269km",
      steps: "10 etapas",
      img: "/img-apoio/card12-caminho-de-inverno.png"
    },
  ];

  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.98], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.85, 0.98], [0.9, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.98], [100, 0]);

  return (
    <section ref={sectionRef} className="h-[800vh] relative z-20 bg-[#E8E4D9]">
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
  const sectionRef = useRef(null);
  const [activePage, setActivePage] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevPage = useRef(0);

  const spreads = [
    {
      label: "A Partida",
      stage: "St-Jean-Pied-de-Port · Etapa 1",
      date: "Dia 1 de 33",
      text: '"Mochila nas costas, coração aberto. O primeiro passo é o mais difícil — e o mais sagrado. Os Pirineus ainda fumegavam de névoa quando cruzei a fronteira."',
      pageNum: "Página 12",
      photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      caption: "Pirineus, amanhecer",
    },
    {
      label: "Os Dias de Chuva",
      stage: "Pamplona · Etapa 5",
      date: "Dia 5 de 33",
      text: '"A chuva não parou em três dias. Aprendi que ter os pés molhados não é o mesmo que se perder. Cada poça refletia um céu que eu ainda não entendia."',
      pageNum: "Página 38",
      photo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
      caption: "Navarra, outono",
    },
    {
      label: "A Meseta",
      stage: "Burgos · Etapa 14",
      date: "Dia 14 de 33",
      text: '"Trezentos quilômetros de planície e silêncio. Aqui o Caminho vira espelho — você se enxerga sem desculpas, sem distrações, apenas você e o horizonte."',
      pageNum: "Página 89",
      photo: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
      caption: "Castela, meio-dia",
    },
    {
      label: "O Cebreiro",
      stage: "O Cebreiro · Etapa 28",
      date: "Dia 28 de 33",
      text: '"Galícia começa entre nuvens baixas e pedras antigas. O fim já pode ser sentido nas pernas, mas a alma ainda está em marcha."',
      pageNum: "Página 156",
      photo: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=800&q=80",
      caption: "Galícia, neblina",
    },
    {
      label: "A Chegada",
      stage: "Santiago de Compostela · Km 0",
      date: "Dia 33 de 33",
      text: '"Na Praza do Obradoiro, com lágrimas e sorriso, entendi: não cheguei ao fim. Cheguei a mim. O Caminho não termina aqui — começa."',
      pageNum: "Página 198",
      photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
      caption: "Santiago, catedral",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const raw = (latest / 0.82) * (spreads.length - 1);
    const page = Math.max(0, Math.min(spreads.length - 1, Math.round(raw)));
    if (page !== prevPage.current) {
      setDirection(page > prevPage.current ? 1 : -1);
      prevPage.current = page;
      setActivePage(page);
    }
  });

  const bookOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const bookY = useTransform(scrollYProgress, [0, 0.08], [40, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.84, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.84, 0.95], [20, 0]);

  const pageVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
  };

  return (
    <section ref={sectionRef} className="h-[350vh] relative z-30 bg-[#FDFCF8]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center py-10 px-4">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#E8E4D9_0%,_#FDFCF8_70%)]" />

        {/* Header — sem whileInView: dentro de sticky container causa corte na transição */}
        <div className="relative z-10 text-center mb-8">
          <span className="text-[#2D1B14]/40 uppercase tracking-[0.5em] text-xs font-bold mb-3 block">
            O Legado Físico
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#2D1B14] mb-3 italic">
            Sua história em mãos.
          </h2>
          <p className="text-[#2D1B14]/55 text-base md:text-lg max-w-lg mx-auto font-light leading-relaxed">
            Cada foto, cada carimbo, cada dia — reunidos em um livro de arte exclusivo do seu Caminho.
          </p>
        </div>

        {/* Livro */}
        <motion.div
          style={{ opacity: bookOpacity, y: bookY }}
          className="relative z-10 w-full max-w-[320px] md:max-w-[680px]"
        >
          {/* Frame do livro */}
          <div className="relative h-[200px] md:h-[400px] rounded-2xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.28)] flex overflow-hidden border border-black/[0.06]">

            {/* Página esquerda — conteúdo textual */}
            <div className="w-1/2 h-full bg-[#F5F0E8] border-r border-black/[0.08] relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activePage}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 p-3 md:p-9 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2 md:mb-4 pb-2 md:pb-3 border-b border-[#2D1B14]/10">
                      <div className="w-6 h-6 md:w-9 md:h-9 rounded-full bg-[#2D1B14]/8 border border-[#2D1B14]/15 flex items-center justify-center shrink-0">
                        <span className="text-[5px] md:text-[8px] font-black text-[#2D1B14]/40 uppercase tracking-tight">QR</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-[#2D1B14] italic text-[8px] md:text-[13px] leading-tight truncate">
                          {spreads[activePage].stage}
                        </p>
                        <p className="text-[6px] md:text-[9px] uppercase tracking-widest text-[#2D1B14]/35 font-bold">
                          {spreads[activePage].date}
                        </p>
                      </div>
                    </div>
                    <p className="font-serif text-[#2D1B14]/40 uppercase tracking-[0.2em] text-[6px] md:text-[10px] font-bold mb-1 md:mb-2">
                      {spreads[activePage].label}
                    </p>
                    <p className="font-serif text-[#2D1B14]/72 italic leading-relaxed text-[8px] md:text-[13px]">
                      {spreads[activePage].text}
                    </p>
                  </div>
                  <div className="text-[6px] md:text-[9px] uppercase tracking-widest text-[#2D1B14]/25 font-bold border-t border-[#2D1B14]/8 pt-1.5 md:pt-2">
                    {spreads[activePage].pageNum}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Página direita — fotografia */}
            <div className="w-1/2 h-full relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0"
                >
                  <div
                    className="w-full h-full bg-cover bg-center scale-[1.03]"
                    style={{ backgroundImage: `url('${spreads[activePage].photo}')` }}
                  />
                  <div className="absolute inset-0 bg-black/12" />
                  <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-white/75 font-serif italic text-[6px] md:text-[10px] bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    {spreads[activePage].caption}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sombra da lombada */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[6px] md:w-[10px] h-full bg-gradient-to-r from-black/10 via-black/25 to-black/10 blur-[2px] z-10 pointer-events-none" />
          </div>

          {/* Indicador de páginas */}
          <div className="flex items-center justify-center gap-1.5 mt-4 md:mt-5">
            {spreads.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === activePage
                    ? 'w-6 md:w-8 h-1.5 bg-[#2D1B14]'
                    : 'w-1.5 h-1.5 bg-[#2D1B14]/20'
                }`}
              />
            ))}
            <span className="ml-2 text-[#2D1B14]/30 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
              {activePage + 1} / {spreads.length}
            </span>
          </div>
        </motion.div>

        {/* CTA — aparece no final do scroll */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="relative z-10 mt-6 md:mt-10 flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2D1B14] text-[#FDFCF8] px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-lg font-bold shadow-2xl flex items-center gap-3 border border-white/5"
          >
            Encomendar meu Livro de Recordações
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <p className="text-[#2D1B14]/40 text-center mt-3 text-xs tracking-widest uppercase font-bold">
            Edição Limitada & Artesanal
          </p>
        </motion.div>

      </div>
    </section>
  );
};
