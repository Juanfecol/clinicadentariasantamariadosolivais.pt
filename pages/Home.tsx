
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const Home: React.FC = () => {
  const { content } = useContent();
  const { heroTitle, heroSubtitle } = content.home;
  const stories = content.stories || [];

  const [centerIndex, setCenterIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); 
  const touchStartX = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const [isStoriesVisible, setIsStoriesVisible] = useState(false);
  const storiesSectionRef = useRef<HTMLElement>(null);
  const expVideoRef = useRef<HTMLVideoElement>(null);
  const [isExpMuted, setIsExpMuted] = useState(true); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === storiesSectionRef.current) {
            setIsStoriesVisible(entry.isIntersecting);
          }
          if (entry.target === expVideoRef.current) {
            if (entry.isIntersecting) {
              expVideoRef.current?.play().catch(() => {});
            } else {
              expVideoRef.current?.pause();
              setIsExpMuted(true);
            }
          }
        });
      },
      { threshold: 0.1 } 
    );
    if (storiesSectionRef.current) observer.observe(storiesSectionRef.current);
    if (expVideoRef.current) observer.observe(expVideoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncPlayback = () => {
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        const isCenter = idx === centerIndex;
        if (isCenter && isStoriesVisible) {
          v.muted = false;
          v.preload = "auto";
          v.play().catch(() => {
            v.muted = true; 
            v.play().catch(() => {});
          });
        } else {
          v.muted = true;
          v.pause();
          if (!isCenter) {
            v.currentTime = 0; 
            v.preload = "metadata";
          }
        }
      });
    };
    syncPlayback();
  }, [centerIndex, isStoriesVisible]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsInteracting(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) setCenterIndex((prev) => (prev + 1) % stories.length);
      else setCenterIndex((prev) => (prev - 1 + stories.length) % stories.length);
    }
    touchStartX.current = null;
    setTimeout(() => setIsInteracting(false), 3000);
  };

  const getStoryStyle = (index: number) => {
    let diff = index - centerIndex;
    if (diff > stories.length / 2) diff -= stories.length;
    if (diff < -stories.length / 2) diff += stories.length;
    const absDiff = Math.abs(diff);
    const scale = absDiff === 0 ? 1.25 : Math.max(0.7, 0.85 - (absDiff * 0.1));
    const opacity = absDiff === 0 ? 1 : Math.max(0, 0.5 - (absDiff * 0.2));
    const zIndex = 100 - Math.floor(absDiff * 20);
    const translateX = diff * 115; 
    return {
      transform: `translate3d(${translateX}%, 0, 0) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      pointerEvents: 'auto' as const, 
      transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' 
    };
  };

  return (
    <div className="animate-fade-in-up">
      {/* Hero Header */}
      <section className="text-center px-4 mb-16 md:mb-24">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold text-clinic-blue mb-6 leading-tight">
          <span className="font-body text-clinic-purple text-xl md:text-4xl font-medium mr-2">Clínica Dentária</span>
          {heroTitle.replace('Clínica', '')}
        </h1>
        <p className="text-base md:text-xl text-gray-800 max-w-3xl mx-auto mb-10 font-light px-4">
          {heroSubtitle}
        </p>
        <Link 
          to="/contactos" 
          className="inline-block bg-clinic-lime text-clinic-blue font-bold text-lg px-8 py-4 rounded-full hover:bg-clinic-purple hover:text-white transition-all transform hover:-translate-y-1 shadow-xl"
        >
          Marque a Sua Consulta Hoje
        </Link>
      </section>

      {/* Stories Section - FIXED GLOW (NO SQUARES) */}
      <section 
        ref={storiesSectionRef}
        className="relative h-[340px] md:h-[500px] max-w-[1400px] mx-auto overflow-hidden mb-16 flex justify-center items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Glow Circular - Sin bordes rectos (Efecto Halo Real) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 pointer-events-none z-0">
           <div className="absolute inset-0 rounded-full blur-[80px] md:blur-[120px] animate-glow-cycle opacity-40"></div>
           <div className="absolute inset-8 rounded-full blur-[60px] md:blur-[100px] animate-glow-cycle opacity-60" style={{ animationDelay: '-6s' }}></div>
        </div>

        <div className="relative w-full h-full flex justify-center items-center perspective-[1500px]">
          {stories.map((story: any, index: number) => {
            const isCenter = centerIndex === index;
            return (
              <div 
                key={story.id} 
                className={`absolute w-[125px] h-[210px] md:w-[200px] md:h-[330px] rounded-[2.2rem] md:rounded-[3.2rem] border-[4px] md:border-[8px] border-white shadow-2xl overflow-hidden bg-black cursor-pointer transition-all duration-500 ${isCenter ? 'ring-4 ring-clinic-lime/50' : ''}`}
                style={getStoryStyle(index)}
                onClick={() => setCenterIndex(index)} 
              >
                {story.type === 'video' ? (
                  <video 
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={story.src} 
                    poster={story.thumbnail}
                    className="w-full h-full object-cover"
                    muted={!isCenter} 
                    playsInline
                    preload={isCenter ? "auto" : "metadata"}
                  />
                ) : (
                  <img src={story.thumbnail || story.src} className="w-full h-full object-cover" loading="lazy" />
                )}
                {isCenter && (
                  <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent`}>
                    <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">{story.title}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience Section - FIXED HALO (NO SQUARES) */}
      <section className="px-4 py-16 md:py-32 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
          <div className="flex flex-col items-center lg:items-end order-2 lg:order-1 gap-8">
             <div className="relative w-full max-w-[245px] md:max-w-[340px] aspect-[9/16] rounded-[2.8rem] md:rounded-[4.5rem] flex items-center justify-center">
                
                {/* Halo Circular Trasero - 100% Orgánico */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full blur-[70px] md:blur-[100px] animate-glow-cycle opacity-40 -z-10"></div>
                
                <div className="relative w-full h-full rounded-[2.6rem] md:rounded-[4.2rem] overflow-hidden border-[6px] md:border-[12px] border-white shadow-2xl bg-black">
                  <video 
                    ref={expVideoRef}
                    src="https://clinica-santa-maria-dos-olivais.b-cdn.net/clinicadentaria-santamariadosolivais.mp4"
                    autoPlay loop muted={isExpMuted} playsInline
                    className="w-full h-full object-cover"
                    preload="auto"
                  />
                  <button 
                    onClick={() => setIsExpMuted(!isExpMuted)}
                    className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-white/25 backdrop-blur-lg rounded-full border border-white/40 flex items-center justify-center text-white"
                  >
                    <i className={`fas ${isExpMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                  </button>
                </div>
             </div>
             <Link to="/campanhas" className="bg-clinic-purple text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:bg-clinic-blue transition-all transform hover:scale-105">
                Ver Mais <i className="fas fa-arrow-right ml-2 text-sm"></i>
             </Link>
          </div>
          <div className="text-center lg:text-left order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-clinic-blue leading-[1.1]">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                <span>Com</span>
                <span className="font-serif italic text-clinic-lime text-6xl md:text-[10rem]">10</span>
                <span>anos de</span>
              </div>
              <div className="font-serif italic text-clinic-purple">Experiência</div>
            </h2>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-[1100px] mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-6xl font-serif italic text-center mb-16 border-b-4 border-clinic-lime inline-block pb-4 mx-auto block w-fit">
          Nossos Serviços Dentários
        </h2>
        <div className="grid gap-6">
          {["IMPLANTOLOGIA", "ORTODONTIA, ALINHADORES INVISÍVEIS", "LIMPEZA E DESTARTARIZAÇÃO", "CONSULTA DE ROTINA", "ODONTOPEDIATRIA", "BRANQUEAMENTO"].map((title, index) => (
            <details key={index} className="group bg-white rounded-3xl border border-clinic-blue/5 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl open:border-clinic-lime">
              <summary className="flex justify-between items-center cursor-pointer p-6 md:p-8 list-none">
                <div className="flex items-center gap-6">
                  <span className="text-3xl md:text-5xl font-serif italic text-clinic-lime/20 font-bold group-open:text-clinic-lime">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                  <span className="text-lg md:text-3xl font-semibold text-clinic-blue group-open:text-clinic-purple transition-colors uppercase">{title}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-clinic-bg flex items-center justify-center text-clinic-blue transition-all group-open:rotate-180 group-open:bg-clinic-blue group-open:text-white">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </summary>
              <div className="px-8 pb-8 pt-2">
                <p className="text-lg leading-relaxed text-gray-600 mb-8">Tratamento especializado com os mais elevados padrões de qualidade clínica.</p>
                <Link to="/marcacoes" state={{ service: title }} className="inline-block bg-clinic-lime text-clinic-blue font-black px-8 py-3 rounded-full shadow-md hover:bg-clinic-blue hover:text-white transition-all uppercase text-sm">
                  Agendar Avaliação
                </Link>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Bottom - MOBILE OPTIMIZED */}
      <section className="py-20 text-center">
        <div className="max-w-[1100px] mx-auto px-4 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-clinic-blue mb-12 flex flex-wrap justify-center items-center gap-4">
            <span>Transforme o seu</span>
            <div className="w-[80px] h-[55px] md:w-[150px] md:h-[100px] rounded-2xl overflow-hidden border-4 border-white shadow-xl flex items-center justify-center bg-white/10">
                <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" className="w-[85%] h-[85%] object-contain animate-float" />
            </div>
            <span className="font-serif italic text-clinic-purple">sorriso</span>
            <span>hoje!</span>
          </h2>
          <Link 
            to="/marcacoes" 
            className="inline-block bg-clinic-blue text-white px-6 py-4 rounded-full text-base font-bold shadow-2xl hover:bg-clinic-purple transition-all transform hover:-translate-y-2 text-center w-auto max-w-[90vw] sm:px-12 sm:py-5 sm:text-xl active:scale-95"
          >
            Agende Sua Consulta <span className="animate-pulse ml-2 inline-block">♥</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
