import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

// CONTROL POINT: HOME PAGE CONTENT
const Home: React.FC = () => {
  const { content } = useContent();
  const { heroTitle, heroSubtitle } = content.home;

  // Video Control State for "Video Escalas"
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Toggle Mute Function
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Optimized Scroll Observer
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!videoElement) return;

        if (entry.isIntersecting) {
          // Attempt to play
          try {
             // Sync state before playing
             videoElement.muted = isMuted; 
             await videoElement.play();
          } catch (error) {
             console.debug("Autoplay blocked or interrupted, retrying muted.");
             // Fallback: Force mute to allow autoplay if browser blocked audio
             videoElement.muted = true;
             setIsMuted(true);
             try {
               await videoElement.play();
             } catch (e) {
               // Silent fail if interaction completely blocked (rare in this context)
             }
          }
        } else {
          // Pause when out of view
          try {
            videoElement.pause();
          } catch (e) {
            // Ignore pause errors (e.g. if already paused)
          }
        }
      },
      {
        threshold: 0.4 // Trigger when 40% of the video is visible
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, [isMuted]); 

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="text-center px-4 mb-12 md:mb-20">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-semibold text-clinic-blue mb-4 leading-tight">
          {/* Dynamically render title if it includes "Clínica", otherwise just show text */}
          {heroTitle.includes('Clínica') ? (
            <>
              <span className="font-body text-clinic-purple text-xl md:text-3xl font-medium mr-2">Clínica</span>
              {heroTitle.replace('Clínica', '')}
            </>
          ) : (
             heroTitle
          )}
        </h1>
        <p className="text-base md:text-xl text-gray-800 max-w-3xl mx-auto mb-8 font-light">
          {heroSubtitle}
        </p>
        <Link 
          to="/contactos" 
          className="inline-block bg-clinic-lime text-clinic-blue font-semibold text-base md:text-lg px-6 py-3 md:px-8 md:py-3 rounded-full hover:bg-clinic-purple hover:text-white transition-all transform hover:-translate-y-1 shadow-lg"
        >
          Marque a Sua Consulta Hoje
        </Link>
      </section>

      {/* Floating Cards Simulation - OPTIMIZED FOR MOBILE */}
      <div className="relative h-[260px] md:h-[400px] max-w-[1400px] mx-auto overflow-hidden mb-12 md:mb-20 flex justify-center items-center">
        {/* Card 1: Far Left */}
        <div className="absolute transform -rotate-12 translate-x-[-90px] sm:translate-x-[-150px] md:translate-x-[-300px] z-10 w-[90px] h-[130px] sm:w-[150px] sm:h-[220px] md:w-[200px] md:h-[300px] rounded-xl border-[3px] md:border-4 border-white shadow-xl bg-cover bg-center hover:scale-110 hover:z-50 transition-all duration-500 ease-in-out cursor-pointer" style={{ backgroundImage: "url('https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/20250528_1519_Radiant-Elderly-Smile_remix_01jwbm4kh3ecrrhz1rtwxbgrdk.png')" }}></div>
        
        {/* Card 2: Left */}
        <div className="absolute transform -rotate-6 translate-x-[-50px] sm:translate-x-[-80px] md:translate-x-[-150px] z-20 w-[90px] h-[130px] sm:w-[150px] sm:h-[220px] md:w-[200px] md:h-[300px] rounded-xl border-[3px] md:border-4 border-white shadow-xl bg-cover bg-center hover:scale-110 hover:z-50 transition-all duration-500 ease-in-out cursor-pointer" style={{ backgroundImage: "url('https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/20250528_1516_Joyful-Little-Girl_remix_01jwbky6ppfywvxm859vb75m01.png')" }}></div>
        
        {/* Card 3: Center */}
        <div className="absolute transform rotate-0 z-30 w-[100px] h-[150px] sm:w-[160px] sm:h-[240px] md:w-[220px] md:h-[330px] rounded-xl border-[3px] md:border-4 border-white shadow-2xl bg-cover bg-center hover:scale-110 hover:z-50 transition-all duration-500 ease-in-out cursor-pointer" style={{ backgroundImage: "url('https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/20250528_1530_Sorriso-Perfeito_remix_01jwbmq8mnfev9my4ye2ek9xx0.png')" }}></div>
        
        {/* Card 4: Right */}
        <div className="absolute transform rotate-6 translate-x-[50px] sm:translate-x-[80px] md:translate-x-[150px] z-20 w-[90px] h-[130px] sm:w-[150px] sm:h-[220px] md:w-[200px] md:h-[300px] rounded-xl border-[3px] md:border-4 border-white shadow-xl bg-cover bg-center hover:scale-110 hover:z-50 transition-all duration-500 ease-in-out cursor-pointer" style={{ backgroundImage: "url('https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/20250528_1513_Radiant-Smile-Glow_remix_01jwbkrg38f4ka6d4q9zzg1z1y.png')" }}></div>
        
        {/* Card 5: Far Right */}
        <div className="absolute transform rotate-12 translate-x-[90px] sm:translate-x-[150px] md:translate-x-[300px] z-10 w-[90px] h-[130px] sm:w-[150px] sm:h-[220px] md:w-[200px] md:h-[300px] rounded-xl border-[3px] md:border-4 border-white shadow-xl bg-cover bg-center hover:scale-110 hover:z-50 transition-all duration-500 ease-in-out cursor-pointer" style={{ backgroundImage: "url('https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/20250528_1510_Happy-Toothless-Smile_remix_01jwbkk35xf57r1pf4sbherqsf-1.png')" }}></div>
      </div>

      {/* Experience Section - CAMBIO VIDEO ESCALAS */}
      <section className="px-4 py-10 md:py-20 bg-transparent relative overflow-hidden">
        {/* Background Plane Element */}
        <div className="absolute top-1/2 left-0 w-full h-[120%] -translate-y-1/2 overflow-hidden pointer-events-none z-0 opacity-[0.04]">
           <i className="fas fa-plane text-[300px] md:text-[500px] text-clinic-blue transform -rotate-12 translate-x-[-10%] md:translate-x-[5%] translate-y-[-10%]"></i>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
          
          {/* Left: Video Protagonist with Button */}
          <div className="flex flex-col items-center lg:items-end order-2 lg:order-1 gap-6">
             <div className="relative w-[280px] sm:w-[320px] h-auto rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl bg-black group transform transition-transform hover:scale-[1.02] duration-500">
                
                {/* Decorative Sticker */}
                <div className="absolute top-4 right-4 z-20 w-14 h-14 bg-clinic-lime rounded-full flex items-center justify-center shadow-md animate-pulse-slow pointer-events-none">
                   <i className="fas fa-plane text-clinic-blue text-xl transform -rotate-45"></i>
                </div>

                {/* Video Element - AUTO PLAY, NO CONTROLS, DEFAULT SOUND */}
                <video 
                   ref={videoRef}
                   // Optimized URL Updated to new CDN
                   src="https://clinica-santa-maria-dos-olivais.b-cdn.net/GUION%2004%20-%20TURQUIA.mp4"
                   className="w-full h-full object-cover aspect-[9/16]"
                   loop
                   muted={isMuted} // Controlled by React state
                   playsInline
                   preload="auto"
                   // Removed 'controls' attribute as requested
                />

                {/* Custom Mute/Unmute Button */}
                <button 
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 z-30 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-clinic-lime hover:text-clinic-blue transition-colors shadow-lg"
                  aria-label={isMuted ? "Ligar som" : "Desligar som"}
                >
                   <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                </button>
             </div>
             
             {/* Ver Mais Button - NEW ADDITION */}
             <Link 
                to="/campanhas" 
                className="inline-flex items-center gap-2 bg-clinic-purple text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-clinic-blue hover:scale-105 transition-all transform hover:-translate-y-1"
             >
                Ver Mais <i className="fas fa-arrow-right text-sm"></i>
             </Link>
          </div>

          {/* Right: Text Content (Original) - OPTIMIZED TEXT SIZES FOR MOBILE */}
          <div className="text-center lg:text-left order-1 lg:order-2 flex flex-col items-center lg:items-start">
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-clinic-blue leading-tight flex flex-col items-center lg:items-start gap-4">
              <div className="flex flex-wrap justify-center lg:justify-start items-baseline gap-2 md:gap-3">
                <span className="font-sans font-semibold">Com</span>
                <span className="font-serif italic text-clinic-lime text-4xl md:text-8xl">10</span>
                <span className="font-sans font-semibold">anos de</span>
                <span className="font-serif italic">Experiência</span>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 md:gap-3">
                <span>o seu</span>
                {/* Optimized Inline Image Size for Mobile */}
                <div className="w-[60px] h-[45px] sm:w-[100px] sm:h-[70px] md:w-[150px] md:h-[100px] rounded-xl md:rounded-2xl overflow-hidden border-[3px] md:border-4 border-white shadow-lg mx-1 md:mx-2">
                  <img src="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/20250528_1139_Pose-Divertida_remix_01jwb7hqzte4ma70g3g1ezq96d.png" alt="Sorriso" className="w-full h-full object-cover animate-float" loading="lazy" />
                </div>
                <span className="font-serif italic">sorriso</span>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 md:gap-3">
                <span>de sonho</span>
                {/* Optimized Inline Image Size for Mobile */}
                <div className="w-[60px] h-[45px] sm:w-[100px] sm:h-[70px] md:w-[150px] md:h-[100px] rounded-xl md:rounded-2xl overflow-hidden border-[3px] md:border-4 border-white shadow-lg mx-1 md:mx-2">
                  <img src="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/Sem-titulo-68.png" alt="Sonho" className="w-full h-full object-cover animate-float" style={{ animationDelay: '1.5s' }} loading="lazy" />
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 md:gap-3">
                <span>é o</span>
                <span className="font-serif italic">nosso cuidado</span>
                <div className="w-[30px] h-[30px] md:w-[50px] md:h-[50px] rounded-full bg-clinic-blue text-white flex items-center justify-center shadow-lg animate-pulse-slow text-sm md:text-base">♥</div>
              </div>
            </h2>
          </div>

        </div>
      </section>

      {/* Services Accordion - CAMBIO SERVICIO */}
      <section className="max-w-[1000px] mx-auto px-4 py-12 md:py-20 relative">
        {/* Background Blob for subtle prominence */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-clinic-lime/5 blur-3xl rounded-full -z-10 pointer-events-none"></div>

        <h2 className="text-2xl md:text-6xl font-serif italic text-center mb-10 md:mb-16 border-2 border-clinic-lime inline-block px-8 py-3 md:px-10 md:py-4 rounded-full mx-auto block w-fit bg-white/50 backdrop-blur-sm shadow-sm">
          Nossos Serviços
        </h2>
        
        <div className="grid gap-4 md:gap-5">
          {[
            { title: "IMPLANTOLOGIA", img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/393562f5162f9e7b1dda9718a868fcd1.jpg", text: "A nossa clínica oferece serviços avançados de implantologia, proporcionando soluções duradouras para a substituição de dentes perdidos." },
            { title: "ORTODONTIA, ALINHADORES INVISÍVEIS", img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0011_Facetas-Dentarias-Transformacao_simple_compose_01jww0yg08fd4v06v62e7dt8p0.png", text: "Transforme o seu sorriso com os nossos serviços de alinhadores invisíveis e facetas dentárias." },
            { title: "LIMPEZA E DESTARTARIZAÇÃO", img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0026_Dentes_-Antes-e-Depois_remix_01jww1s370fgaarpev9hgjy2sy.png", text: "A nossa limpeza e destartarização profissional é realizada por higienistas experientes, utilizando equipamentos de última geração." },
            { title: "CONSULTA DE ROTINA", img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0035_Dental-Check-Up-Scene_remix_01jww2a4dje96a82m4vvcjxp2x.png", text: "As nossas consultas de rotina são fundamentais para a manutenção da saúde oral a longo prazo." },
            { title: "ODONTOPEDIATRIA", img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0029_Transformacao-Dental_remix_01jww1y448fddbtbyk3cqykdpg.png", text: "A odontopediatria na nossa clínica é dedicada ao cuidado oral especializado de crianças e adolescentes." },
            { title: "BRANQUEAMENTO", img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/20250604_0033_Sorriso-Renovado_simple_compose_01jww26ejefp7tnbyjrddt1d0y.png", text: "Os nossos tratamentos de branqueamento dentário são realizados com produtos de alta qualidade e técnicas seguras." }
          ].map((service, index) => (
            <details key={index} className="group bg-white rounded-2xl border border-clinic-blue/10 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-clinic-lime/50 open:shadow-xl open:border-clinic-lime open:-translate-y-1">
              {/* Reduced padding on mobile summary */}
              <summary className="flex justify-between items-center cursor-pointer p-4 md:p-6 list-none transition-colors relative">
                {/* Accent Line on Left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-clinic-lime opacity-0 group-hover:opacity-100 group-open:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-3 md:gap-6 pl-1 md:pl-2">
                   {/* Numbering */}
                  <span className="text-2xl md:text-4xl font-serif italic text-clinic-lime/30 font-bold group-hover:text-clinic-lime group-open:text-clinic-lime transition-colors">
                    0{index + 1}
                  </span>
                  <span className="text-base md:text-2xl font-semibold text-clinic-blue group-open:text-clinic-purple transition-colors">
                    {service.title}
                  </span>
                </div>

                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-clinic-bg flex items-center justify-center text-clinic-blue transform transition-all group-open:rotate-180 group-open:bg-clinic-blue group-open:text-white group-hover:scale-110 shadow-sm">
                  <i className="fas fa-chevron-down text-sm md:text-base"></i>
                </span>
              </summary>
              <div className="p-6 md:p-8 pt-2 text-clinic-blue bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                    <div className="flex-1">
                        <p className="text-sm md:text-lg leading-relaxed text-gray-600 mb-6">{service.text}</p>
                        
                        {/* BOTÓN CAMBIO REDIRECCION */}
                        <Link 
                          to="/marcacoes" 
                          state={{ service: service.title }}
                          className="inline-block bg-clinic-lime text-clinic-blue font-bold text-xs md:text-sm px-6 py-3 rounded-full shadow-md hover:bg-clinic-blue hover:text-white transition-all transform hover:-translate-y-1"
                        >
                          Agendar Avaliação
                        </Link>
                    </div>
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full md:w-[250px] rounded-xl shadow-lg object-cover h-[150px] md:h-[180px] transition-transform duration-700 hover:scale-105" 
                      loading="lazy"
                    />
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="max-w-[1000px] mx-auto px-4">
          <h2 className="text-2xl md:text-5xl font-bold text-clinic-blue mb-8 flex flex-wrap justify-center items-center gap-3 md:gap-4">
            <span>Transforme seu</span>
            <div className="w-[60px] h-[45px] md:w-[100px] md:h-[70px] rounded-xl overflow-hidden border-2 border-white shadow-lg">
                <img src="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/Sem-titulo-68.png" alt="Sonho" className="w-full h-full object-cover animate-float" loading="lazy" />
            </div>
            <span className="font-serif italic">sorriso</span>
            <span>hoje!</span>
          </h2>
          <Link 
            to="/marcacoes" 
            className="inline-flex items-center gap-2 bg-clinic-purple text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold shadow-lg hover:bg-clinic-blue transition-all hover:-translate-y-1 transform"
          >
            Agende Sua Consulta <span className="animate-pulse">♥</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;