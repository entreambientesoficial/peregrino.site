import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Map, MapPin, ShieldAlert, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#E8E4D9] text-[#2D3A27] font-sans antialiased overflow-x-hidden selection:bg-[#8B4513] selection:text-[#E8E4D9]">
      <HeroSection />
      <FeaturesSection />
      <JourneySection />
      <BookSection />
    </div>
  );
}

const HeroSection = () => {
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

const FeaturesSection = () => {
  const features = [
    {
      icon: <Map className="w-8 h-8 text-[#8B4513]" />,
      title: "Mapa Offline Seguro",
      desc: "Navegue sem sinal nos trechos mais isolados."
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#8B4513]" />,
      title: "Scanner de Albergues",
      desc: "Check-in instantâneo e gestão de camas."
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-[#8B4513]" />,
      title: "Botão SOS Realtime",
      desc: "Segurança conectada em cada etapa da trilha."
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            whileHover={{ y: -10 }}
            className="bg-white/40 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-start gap-4 transition-all duration-300"
          >
            <div className="p-4 bg-[#E8E4D9]/80 rounded-2xl shadow-inner">
              {feat.icon}
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#2D3A27]">{feat.title}</h3>
            <p className="font-sans text-[#2D3A27]/80 leading-relaxed font-light">
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const JourneySection = () => {
  const cards = [
    { stage: "Pirineus", dist: "24.2km", diff: "Extrema", time: "1 dia" },
    { stage: "La Rioja", dist: "74km", diff: "Fácil", time: "3 dias" },
    { stage: "A Meseta", dist: "120km", diff: "Média", time: "5 dias" },
    { stage: "Galiza", dist: "46km", diff: "Alta", time: "2 dias" },
    { stage: "Santiago", dist: "Últimos 100km", diff: "O abraço final na Catedral.", time: null },
  ];

  return (
    <section className="py-24 relative z-10 w-full bg-[#E8E4D9]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-24 text-[#2D3A27]">O Caminho Passo a Passo</h2>
        <div className="flex flex-col gap-12 pb-32">
          {cards.map((card, idx) => (
            <StickyCard key={idx} card={card} index={idx} total={cards.length} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StickyCard = ({ card, index, total }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 20%"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  // Creates the sticky stacking effect
  const topPosition = `calc(100px + ${index * 24}px)`;

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, top: topPosition }}
      className="sticky w-full h-auto md:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row bg-[#2D3A27] text-[#E8E4D9] border border-white/10"
    >
      <div className="w-full md:w-[60%] h-[300px] md:h-full bg-gray-800 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8B4513]/60 to-transparent z-10 mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
        <img 
          src={`https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`} 
          alt={card.stage}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out"
        />
      </div>
      
      <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center gap-6 z-20 bg-[#2D3A27]">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#E8E4D9]/50 font-sans font-semibold">Etapa {index + 1}</span>
          <h3 className="font-serif text-4xl mt-3">{card.stage}</h3>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-[#E8E4D9]/20 to-transparent" />
        
        <ul className="space-y-5 font-sans text-sm md:text-base">
          <li className="flex justify-between items-center group">
            <span className="text-[#E8E4D9]/60 group-hover:text-[#E8E4D9] transition-colors">Distância</span>
            <span className="font-semibold text-lg">{card.dist}</span>
          </li>
          <li className="flex justify-between items-center group">
            <span className="text-[#E8E4D9]/60 group-hover:text-[#E8E4D9] transition-colors">Dificuldade</span>
            <span className="font-semibold px-3 py-1 rounded-full bg-[#8B4513]/20 text-[#8B4513] border border-[#8B4513]/30">{card.diff}</span>
          </li>
          {card.time && (
            <li className="flex justify-between items-center group">
              <span className="text-[#E8E4D9]/60 group-hover:text-[#E8E4D9] transition-colors">Tempo Estimado</span>
              <span className="font-medium">{card.time}</span>
            </li>
          )}
        </ul>
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
