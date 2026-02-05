
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
  
  // Visibility State for Stories (to prevent audio overlap when scrolling)
  const [isStoriesVisible, setIsStoriesVisible] = useState(false);
  const storiesSectionRef = useRef<HTMLElement>(null);

  // CONTROL POINT: V12 - EXPERIENCE VIDEO UPDATE (PROTESISFIXAS)
  const [isExpMuted, setIsExpMuted] = useState(true); 

  // Observer for Stories Section visibility (Strict Audio Management)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStoriesVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } 
    );
    if (storiesSectionRef.current) observer.observe(storiesSectionRef.current);
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
    // Fix: Using clearInterval to correctly release the interval reference.
    return () => clearInterval(interval);
  }, [stories.length, isInteracting, centerIndex]);

  // Audio Control, Playback Sync & RESET Logic for Stories
  useEffect(() => {
    const optimizeVideos = () => {
      const indexChanged = prevCenterIndex.current !== centerIndex;
      
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        const isCenter = idx === centerIndex;
        
        if (isCenter) {
          if (indexChanged) {
            v.currentTime = 0;
            v.preload = "auto";
          }
          v.muted = !isStoriesVisible;
          const playPromise = v.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              v.muted = true; 
            });
          }
        } else {
          v.muted = true;
          v.preload = "metadata";
          v.play().catch(() => {});
        }
      });
      prevCenterIndex.current = centerIndex;
    };
    optimizeVideos();
  }, [centerIndex, isStoriesVisible, stories.length]);

  // Handle Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsInteracting(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        setCenterIndex((prev) => (prev + 1) % stories.length);
      } else {
        setCenterIndex((prev) => (prev - 1 + stories.length) % stories.length);
      }
    }
    touchStartX.current = null;
    setTimeout(() => setIsInteracting(false), 3500);
  };

  const getStoryStyle = (index: number) => {
    let diff = index - centerIndex;
    if (diff > stories.length / 2) diff -= stories.length;
    if (diff < -stories.length / 2) diff += stories.length;
    const absDiff = Math.abs(diff);
    const scale = absDiff === 0 ? 1.25 : Math.max(0.7, 0.85 - (absDiff * 0.1));
    const opacity = absDiff === 0 ? 1 : Math.max(0, 0.6 - (absDiff * 0.2));
    const zIndex = 100 - Math.floor(absDiff * 20);
    const translateX = diff * 125; 
    return {
      transform: `translate3d(${translateX}%, 0, 0) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      willChange: 'transform, opacity',
      transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)' 
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
          aria-label="Marcar consulta na Clínica Santa Maria dos Olivais"
        >
          Marque a Sua Consulta Hoje
        </Link>
      </section>

      {/* Stories Section */}
      <section 
        ref={storiesSectionRef}
        className="relative h-[300px] md:h-[450px] max-w-[1400px] mx-auto overflow-hidden mb-20 flex justify-center items-center"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Destaques e Casos Clínicos"
      >
        <div className="relative w-full h-full flex justify-center items-center perspective-[1200px]">
          {stories.map((story: any, index: number) => {
            const isCenter = centerIndex === index;
            return (
              <div 
                key={story.id} 
                className={`absolute w-[110px] h-[180px] md:w-[170px] md:h-[290px] rounded-[1.5rem] md:rounded-[2rem] border-[3px] md:border-[6px] border-white shadow-2xl overflow-hidden bg-black cursor-pointer select-none transition-shadow duration-700 ${isCenter ? 'ring-4 md:ring-8 ring-clinic-lime/20 shadow-clinic-lime/40' : 'hover:border-clinic-lime/40'}`}
                style={getStoryStyle(index)}
                onClick={() => setCenterIndex(index)} 
              >
                {story.type === 'video' ? (
                  <>
                    <video 
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={story.src} 
                      poster={story.thumbnail}
                      className="w-full h-full object-cover"
                      muted 
                      loop={!isCenter} 
                      playsInline
                      webkit-playsinline="true"
                      preload="auto"
                      onTimeUpdate={(e) => {
                        if (isCenter) {
                          const progress = (e.currentTarget.currentTime / e.currentTarget.duration) * 100;
                          setVideoProgress(progress);
                        }
                      }}
                      onEnded={() => {
                        if (isCenter) {
                          setCenterIndex((prev) => (prev + 1) % stories.length);
                        }
                      }}
                    />
                    {isCenter && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-white z-50 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                        style={{ width: `${videoProgress}%` }}
                      ></div>
                    )}
                  </>
                ) : (
                  <img 
                    src={story.thumbnail || story.src} 
                    alt={story.title} 
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
                <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-700 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center drop-shadow-lg">{story.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience Section - Refined Cinematographic Video with B-CDN Source */}
      <section className="px-4 py-16 md:py-32 relative overflow-hidden" aria-labelledby="experience-heading">
        <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 pointer-events-none z-0 opacity-[0.05]">
           <i className="fas fa-plane text-[300px] md:text-[600px] text-clinic-blue transform -rotate-12 translate-x-[-10%]"></i>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
          <div className="flex flex-col items-center lg:items-end order-2 lg:order-1 gap-8">
             <div className="relative group/video w-full max-w-[235px] md:max-w-[320px] aspect-[9/16] rounded-[2.5rem] md:rounded-[4rem] p-[2px] overflow-visible will-change-transform">
                <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-tr from-clinic-blue via-clinic-lime to-clinic-purple rounded-[3rem] md:rounded-[5rem] opacity-70 blur-2xl animate-pulse group-hover/video:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-1 bg-gradient-to-tr from-clinic-blue via-clinic-lime to-clinic-purple rounded-[2.8rem] md:rounded-[4.5rem] opacity-30 animate-spin-slow"></div>
                <div className="relative w-full h-full rounded-[2.4rem] md:rounded-[3.8rem] overflow-hidden border-[6px] md:border-[12px] border-white shadow-2xl bg-black transform transition-all duration-700 group-hover/video:scale-[1.03]">
                  
                  {/* Native Video Tag: Optimized for mobile with zero borders and infinite loop */}
                  <video 
                    src="https://clinica-santa-maria-dos-olivais.b-cdn.net/PROTESISFIXAS.mp4"
                    autoPlay
                    loop
                    muted={isExpMuted}
                    playsInline
                    webkit-playsinline="true"
                    className="w-full h-full object-cover scale-[1.02] transform origin-center"
                    poster="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/393562f5162f9e7b1dda9718a868fcd1.jpg"
                    title="Vídeo institucional Clínica Santa Maria dos Olivais"
                  />
                  
                  {/* Aesthetic Audio Button */}
                  <button 
                    onClick={() => setIsExpMuted(!isExpMuted)}
                    className="absolute bottom-6 right-6 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-clinic-blue transition-all shadow-xl active:scale-90 group/btn"
                    aria-label={isExpMuted ? "Ativar som do vídeo" : "Desactivar som do vídeo"}
                  >
                    <i className={`fas ${isExpMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-lg md:text-xl group-hover/btn:scale-110 transition-transform`}></i>
                  </button>
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]"></div>
                </div>
             </div>
             <Link 
                to="/campanhas" 
                className="bg-clinic-purple text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-clinic-blue transition-all transform hover:-translate-y-1"
                aria-label="Ver campanhas e promoções especiales"
             >
                Ver Mais <i className="fas fa-arrow-right ml-2 text-sm"></i>
             </Link>
          </div>
          <div className="text-center lg:text-left order-1 lg:order-2">
            <h2 id="experience-heading" className="text-4xl sm:text-5xl md:text-7xl font-bold text-clinic-blue leading-[1.1] flex flex-col gap-2 md:gap-4">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 md:gap-4">
                <span className="font-sans">Com</span>
                <span className="font-serif italic text-clinic-lime text-6xl md:text-[10rem]">10</span>
                <span className="font-sans">anos de</span>
              </div>
              <div className="font-serif italic text-clinic-purple drop-shadow-sm">Experiência</div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 md:gap-4">
                <span className="font-sans">o seu</span>
                <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Logo dentista Olivais" className="h-[45px] md:h-[70px] object-contain animate-float" />
                <span className="font-serif italic">sorriso</span>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 md:gap-4">
                <span className="font-sans">de sonho</span>
                <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Clínica Dentária Lisboa" className="h-[45px] md:h-[70px] object-contain animate-float" />
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 md:gap-4">
                <span className="font-sans">é o</span>
                <span className="font-serif italic">nosso cuidado</span>
                <div className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-clinic-blue text-white flex items-center justify-center text-xs md:text-xl shadow-lg animate-pulse-slow">♥</div>
              </div>
            </h2>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-[1100px] mx-auto px-4 py-20" aria-labelledby="services-heading">
        <h2 id="services-heading" className="text-3xl md:text-6xl font-serif italic text-center mb-16 border-b-4 border-clinic-lime inline-block pb-4 mx-auto block w-fit">
          Nossos Serviços Dentários
        </h2>
        <div className="grid gap-6">
          {[
            { title: "IMPLANTOLOGIA", img: "https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/07/393562f5162f9e7b1dda9718a868fcd1.jpg", text: "A nossa clínica oferece serviços avançados de implantologia, proporcionando soluciones duradouras para a substituição de dentes perdidos." },
            { title: "ORTODONTIA, ALINHADORES INVISÍVEIS", img: "https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0011_Facetas-Dentarias-Transformacao_simple_compose_01jww0yg08fd4v06v62e7dt8p0.png", text: "Transforme o seu sorriso con os nuestros servicios de alinhadores invisíveis e facetas dentárias." },
            { title: "LIMPEZA E DESTARTARIZAÇÃO", img: "https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0026_Dentes_-Antes-e-Depois_remix_01jww1s370fgaarpev9hgjy2sy.png", text: "Limpeza profesional realizada por higienistas experientes, utilizando equipamentos de última generación." },
            { title: "CONSULTA DE ROTINA", img: "https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0035_Dental-Check-Up-Scene_remix_01jww2a4dje96a82m4vvcjxp2x.png", text: "As nossas consultas de rotina são fundamentais para a manutenção da saúde oral a longo prazo." },
            { title: "ODONTOPEDIATRIA", img: "https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0029_Transformacao-Dental_remix_01jww1y448fddbtbyk3cqykdpg.png", text: "Cuidado oral especializado de crianças e adolescentes num ambiente amigável." },
            { title: "BRANQUEAMENTO", img: "https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0033_Sorriso-Renovado_simple_compose_01jww26ejefp7tnbyjrddt1d0y.png", text: "Tratamentos de branqueamento dentário seguros e con resultados imediatos." }
          ].map((service, index) => (
            <details key={index} className="group bg-white rounded-3xl border border-clinic-blue/5 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl open:border-clinic-lime">
              <summary className="flex justify-between items-center cursor-pointer p-6 md:p-8 list-none transition-colors">
                <div className="flex items-center gap-6">
                  <span className="text-3xl md:text-5xl font-serif italic text-clinic-lime/20 font-bold group-open:text-clinic-lime transition-colors">
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
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 w-full">
                        <p className="text-lg leading-relaxed text-gray-600 mb-8">{service.text}</p>
                        <Link to="/marcacoes" state={{ service: service.title }} className="inline-block bg-clinic-lime text-clinic-blue font-black px-8 py-3 rounded-full shadow-md hover:bg-clinic-blue hover:text-white transition-all uppercase text-sm tracking-widest">
                          Agendar Avaliação
                        </Link>
                    </div>
                    {/* Image removed per request - structure remains ready for future additions */}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 text-center">
        <div className="max-w-[1100px] mx-auto px-4">
          <h2 className="text-3xl md:text-6xl font-bold text-clinic-blue mb-12 flex flex-wrap justify-center items-center gap-4">
            <span>Transforme o seu</span>
            <div className="w-[100px] h-[70px] md:w-[180px] md:h-[120px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center bg-white/10 will-change-transform">
                <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Logo Clínica Santa Maria dos Olivais" className="w-[85%] h-[85%] object-contain animate-float" />
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
