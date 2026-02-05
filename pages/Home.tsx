
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const Home: React.FC = () => {
  const { content } = useContent();
  const { heroTitle, heroSubtitle } = content.home;
  const stories = content.stories || [];

  // Carousel State
  const [centerIndex, setCenterIndex] = useState(0);
  const prevCenterIndex = useRef(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); 
  const touchStartX = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  // Visibility State for Global Management
  const [isStoriesVisible, setIsStoriesVisible] = useState(false);
  const storiesSectionRef = useRef<HTMLElement>(null);
  const expVideoRef = useRef<HTMLVideoElement>(null);

  // EXPERIENCE VIDEO CONTROL
  const [isExpMuted, setIsExpMuted] = useState(true); 

  // Intersection Observer for both Sections
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
            }
          }
        });
      },
      { threshold: 0.2 } 
    );

    if (storiesSectionRef.current) observer.observe(storiesSectionRef.current);
    if (expVideoRef.current) observer.observe(expVideoRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Infinite Auto-Rotate Logic (Only for non-video stories)
  useEffect(() => {
    if (stories.length === 0 || isInteracting) return;
    const currentStory = stories[centerIndex];
    if (currentStory && currentStory.type === 'video') return;
    
    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [stories.length, isInteracting, centerIndex]);

  // STRICT VIDEO ENGINE: Ensures ONLY the center video plays and has sound
  useEffect(() => {
    const syncPlayback = () => {
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        const isCenter = idx === centerIndex;
        
        if (isCenter && isStoriesVisible) {
          // Force Focus: Only center video plays
          v.muted = false;
          v.preload = "auto";
          const playPromise = v.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              v.muted = true; // Fallback for browsers blocking sound
              v.play().catch(() => {});
            });
          }
        } else {
          // Performance: Pause and mute everything else
          v.muted = true;
          v.pause();
          if (!isCenter) {
            v.currentTime = 0; // Reset lateral videos to save memory
            v.preload = "metadata";
          }
        }
      });
      prevCenterIndex.current = centerIndex;
    };
    syncPlayback();
  }, [centerIndex, isStoriesVisible]);

  // Handle Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsInteracting(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        setCenterIndex((prev) => (prev + 1) % stories.length);
      } else {
        setCenterIndex((prev) => (prev - 1 + stories.length) % stories.length);
      }
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
    const translateX = diff * 120; 

    return {
      transform: `translate3d(${translateX}%, 0, 0) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      pointerEvents: absDiff === 0 ? 'auto' : 'none',
      willChange: 'transform, opacity',
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
    };
  };

  return (
    <div className="animate-fade-in-up">
      {/* Hero Header */}
      <section className="text-center px-4 mb-16 md:mb-24">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold text-clinic-blue mb-6 leading-tight">
          {heroTitle.includes('Clínica') ? (
            <>
              <span className="font-body text-clinic-purple text-xl md:text-4xl font-medium mr-2">Clínica Dentária</span>
              {heroTitle.replace('Clínica', '')}
            </>
          ) : heroTitle}
        </h1>
        <p className="text-base md:text-xl text-gray-800 max-w-3xl mx-auto mb-10 font-light px-4">
          {heroSubtitle}
        </p>
        <Link 
          to="/contactos" 
          data-tracking="hero-cta"
          className="inline-block bg-clinic-lime text-clinic-blue font-bold text-lg px-10 py-4 rounded-full hover:bg-clinic-purple hover:text-white transition-all transform hover:-translate-y-1 shadow-xl"
        >
          Marque a Sua Consulta Hoje
        </Link>
      </section>

      {/* Stories Section */}
      <section 
        ref={storiesSectionRef}
        className="relative h-[320px] md:h-[480px] max-w-[1400px] mx-auto overflow-hidden mb-16 flex justify-center items-center"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex justify-center items-center perspective-[1500px]">
          {stories.map((story: any, index: number) => {
            const isCenter = centerIndex === index;
            return (
              <div 
                key={story.id} 
                className={`absolute w-[120px] h-[200px] md:w-[190px] md:h-[320px] rounded-[2rem] md:rounded-[3rem] border-[4px] md:border-[8px] border-white shadow-2xl overflow-hidden bg-black cursor-pointer select-none ${isCenter ? 'ring-4 ring-clinic-lime/40' : ''}`}
                style={getStoryStyle(index)}
                onClick={() => setCenterIndex(index)} 
              >
                {story.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video 
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={story.src} 
                      poster={story.thumbnail}
                      className="w-full h-full object-cover"
                      muted={!isCenter} 
                      playsInline
                      webkit-playsinline="true"
                      preload={isCenter ? "auto" : "metadata"}
                      onTimeUpdate={(e) => {
                        if (isCenter) {
                          const progress = (e.currentTarget.currentTime / e.currentTarget.duration) * 100;
                          setVideoProgress(progress);
                        }
                      }}
                      onEnded={() => {
                        if (isCenter) setCenterIndex((prev) => (prev + 1) % stories.length);
                      }}
                    />
                    {isCenter && (
                      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20 z-20">
                        <div 
                          className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                          style={{ width: `${videoProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <img src={story.thumbnail || story.src} alt={story.title} className="w-full h-full object-cover" loading="lazy" />
                )}
                <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">{story.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience Section - RESTORED AND FIXED FOR MOBILE */}
      <section className="px-4 py-16 md:py-32 relative overflow-hidden" aria-labelledby="experience-heading">
        <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 pointer-events-none z-0 opacity-[0.05]">
           <i className="fas fa-plane text-[300px] md:text-[600px] text-clinic-blue transform -rotate-12 translate-x-[-10%]"></i>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
          <div className="flex flex-col items-center lg:items-end order-2 lg:order-1 gap-8">
             <div className="relative group/video w-full max-w-[235px] md:max-w-[320px] aspect-[9/16] rounded-[2.5rem] md:rounded-[4rem] p-[2px] overflow-visible">
                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-tr from-clinic-blue via-clinic-lime to-clinic-purple rounded-[3rem] md:rounded-[5rem] opacity-70 blur-2xl animate-pulse"></div>
                <div className="relative w-full h-full rounded-[2.4rem] md:rounded-[3.8rem] overflow-hidden border-[6px] md:border-[12px] border-white shadow-2xl bg-black">
                  <video 
                    ref={expVideoRef}
                    src="https://clinica-santa-maria-dos-olivais.b-cdn.net/PROTESISFIXAS.mp4"
                    autoPlay
                    loop
                    muted={isExpMuted}
                    playsInline
                    webkit-playsinline="true"
                    className="w-full h-full object-cover scale-[1.01]"
                    poster="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/393562f5162f9e7b1dda9718a868fcd1.jpg"
                    preload="auto"
                  />
                  <button 
                    onClick={() => setIsExpMuted(!isExpMuted)}
                    className="absolute bottom-6 right-6 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-clinic-blue transition-all shadow-xl"
                  >
                    <i className={`fas ${isExpMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-lg`}></i>
                  </button>
                </div>
             </div>
             <Link to="/campanhas" className="bg-clinic-purple text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-clinic-blue transition-all">
                Ver Mais <i className="fas fa-arrow-right ml-2 text-sm"></i>
             </Link>
          </div>
          <div className="text-center lg:text-left order-1 lg:order-2">
            <h2 id="experience-heading" className="text-4xl sm:text-5xl md:text-7xl font-bold text-clinic-blue leading-[1.1]">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                <span>Com</span>
                <span className="font-serif italic text-clinic-lime text-6xl md:text-[10rem]">10</span>
                <span>anos de</span>
              </div>
              <div className="font-serif italic text-clinic-purple">Experiência</div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                <span>o seu</span>
                <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Logo" className="h-[45px] md:h-[70px] animate-float" />
                <span className="font-serif italic">sorriso</span>
              </div>
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
          {[
            { title: "IMPLANTOLOGIA", text: "A nossa clínica oferece serviços avançados de implantologia, proporcionando soluciones duradouras para a substituição de dentes perdidos." },
            { title: "ORTODONTIA, ALINHADORES INVISÍVEIS", text: "Transforme o seu sorriso con os nuestros servicios de alinhadores invisíveis e facetas dentárias." },
            { title: "LIMPEZA E DESTARTARIZAÇÃO", text: "Limpeza profesional realizada por higienistas experientes, utilizando equipamentos de última generación." },
            { title: "CONSULTA DE ROTINA", text: "As nossas consultas de rotina são fundamentais para a manutenção da saúde oral a longo prazo." },
            { title: "ODONTOPEDIATRIA", text: "Cuidado oral especializado de crianças e adolescentes num ambiente amigável." },
            { title: "BRANQUEAMENTO", text: "Tratamentos de branqueamento dentário seguros e con resultados imediatos." }
          ].map((service, index) => (
            <details key={index} className="group bg-white rounded-3xl border border-clinic-blue/5 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl open:border-clinic-lime">
              <summary className="flex justify-between items-center cursor-pointer p-6 md:p-8 list-none">
                <div className="flex items-center gap-6">
                  <span className="text-3xl md:text-5xl font-serif italic text-clinic-lime/20 font-bold group-open:text-clinic-lime">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  <span className="text-lg md:text-3xl font-semibold text-clinic-blue group-open:text-clinic-purple transition-colors uppercase tracking-tight">
                    {service.title}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-clinic-bg flex items-center justify-center text-clinic-blue group-open:rotate-180 group-open:bg-clinic-blue group-open:text-white transition-all">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </summary>
              <div className="px-8 pb-8 pt-2">
                <p className="text-lg leading-relaxed text-gray-600 mb-8">{service.text}</p>
                <Link to="/marcacoes" state={{ service: service.title }} className="inline-block bg-clinic-lime text-clinic-blue font-black px-8 py-3 rounded-full shadow-md hover:bg-clinic-blue transition-all uppercase text-sm tracking-widest">
                  Agendar Avaliação
                </Link>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 text-center">
        <div className="max-w-[1100px] mx-auto px-4">
          <h2 className="text-3xl md:text-6xl font-bold text-clinic-blue mb-12 flex flex-wrap justify-center items-center gap-4">
            <span>Transforme o seu</span>
            <div className="w-[100px] h-[70px] md:w-[180px] md:h-[120px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center bg-white/10">
                <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Logo" className="w-[85%] h-[85%] object-contain animate-float" />
            </div>
            <span className="font-serif italic text-clinic-purple">sorriso</span>
            <span>hoje!</span>
          </h2>
          <Link to="/marcacoes" className="bg-clinic-blue text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:bg-clinic-purple transition-all transform hover:-translate-y-2">
            Agende Sua Consulta <span className="animate-pulse ml-2">♥</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
