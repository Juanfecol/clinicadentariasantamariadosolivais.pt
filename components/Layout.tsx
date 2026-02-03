import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

interface Story {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail: string;
  title: string;
}

// CHECKPOINT: CARNIVAL DECORATION COMPONENT
// OPTIMIZED & AESTHETIC: Single continuous rope with hyper-realistic physics
// RESIZED: Scaled down to 70% of original size
const CarnivalBunting: React.FC = React.memo(() => {
  
  // Calculate points for the single rope and flags
  const { points, pathD } = useMemo(() => {
    const count = 26; 
    const pts = [];
    
    // Create a continuous wave curve (Sine wave style) across the screen
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * 100; // X position in %
      
      const rad = (x / 100) * Math.PI * 3.5; 
      
      // SCALED DOWN AMPLITUDE (70%): 
      // Original was 30 + 15. New is approx 22 + 10.
      const y = Math.abs(Math.sin(rad)) * 22 + 10; 
      
      const rotation = Math.cos(rad) * 12;

      pts.push({
         i,
         x,
         y,
         rotation,
         duration: 3 + Math.random() * 2, 
         delay: Math.random() * -5
      });
    }

    // SVG Path
    const d = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    
    return { points: pts, pathD: d };
  }, []);

  return (
    // SCALED HEIGHT: Reduced from 140px to 100px
    <div className="absolute top-[88%] left-0 w-full h-[100px] overflow-visible pointer-events-none z-[40]">
       
       {/* THE SINGLE ROPE (SVG) */}
       <svg className="absolute top-0 left-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
             <filter id="ropeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="rgba(0,0,0,0.4)"/>
             </filter>
          </defs>
          
          {/* Rope Shadow */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="transparent" 
            strokeWidth="1.5" 
            vectorEffect="non-scaling-stroke" 
            filter="url(#ropeShadow)"
          />

          {/* Rope Main Body - Scaled thickness */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="#8d7857" 
            strokeWidth="1.8" 
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke" 
          />

          {/* Rope Twist Highlight */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="#cbbfa8" 
            strokeWidth="0.8" 
            strokeDasharray="1.5 2"
            vectorEffect="non-scaling-stroke" 
            style={{ opacity: 0.7 }}
          />
       </svg>

       {/* THE FLAGS */}
       {points.map((flag) => (
         <div
           key={flag.i}
           className="absolute origin-top animate-sway"
           style={{
             left: `${flag.x}%`,
             top: `${flag.y}%`, 
             animationDuration: `${flag.duration}s`,
             animationDelay: `${flag.delay}s`,
             transform: 'translateX(-50%)',
             zIndex: 10 
           }}
         >
            {/* Flag Visuals - SCALED DOWN SIZES (70%) */}
            <div className="relative group perspective-500" style={{ transform: `rotate(${flag.rotation}deg)` }}>
               
               {/* The Fabric:
                   Mobile: 38x54 -> 27x38
                   Desktop: 48x72 -> 34x51
               */}
               <div 
                  className="w-[27px] h-[38px] md:w-[34px] md:h-[51px] shadow-lg transition-transform"
                  style={{
                     backgroundImage: `
                        linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 15%), 
                        linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(0,0,0,0.1) 100%),
                        linear-gradient(90deg, #166D38 40%, #E2211D 40%)
                     `,
                     clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                     boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)', 
                  }}
               >
                 {/* Fabric Weave Texture Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-20 mix-blend-overlay"></div>
               </div>
               
               {/* The Gold Button (Pin) - Scaled Down */}
               <div 
                  className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] md:w-[9px] md:h-[9px] rounded-full z-20 shadow-sm"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #fffebb, #ffd700, #b8860b)', 
                    border: '1px solid rgba(184, 134, 11, 0.8)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
               ></div>

            </div>
         </div>
       ))}
    </div>
  );
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const location = useLocation();
  const { content } = useContent();
  
  const storiesData: Story[] = useMemo(() => content.stories || [], [content.stories]);
  const navigation = useMemo(() => content.navigation || [], [content.navigation]);
  const global = useMemo(() => content.global || {}, [content.global]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const trackContact = useMemo(() => (method: string) => {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Contact', { content_name: method });
    }
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'contact_click', {
        'send_to': 'AW-1135006626',
        'event_category': 'Contact',
        'event_label': method
      });
    }
  }, []);

  const displayStories = useMemo(() => [
    ...storiesData, ...storiesData, ...storiesData, 
    ...storiesData, ...storiesData, ...storiesData
  ], [storiesData]);

  const contactEmail = (global.email && global.email.trim() !== "") ? global.email.trim() : "clinicasmod@gmail.com";
  const contactPhone = global.phone ? global.phone.replace(/\s+/g, '') : "";

  return (
    <div className="flex flex-col min-h-screen font-sans text-clinic-blue bg-clinic-bg">
      
      {/* Header */}
      <header className="fixed top-2 md:top-5 left-0 right-0 mx-auto w-[95%] md:w-[90%] max-w-[1400px] h-[85px] md:h-[120px] bg-white/15 backdrop-blur-md border border-white/20 rounded-[25px] md:rounded-[35px] flex justify-between items-center px-3 md:px-[30px] z-50 shadow-lg transition-all hover:bg-white/20 hover:shadow-2xl">
        
        <Link to="/" className="z-50 flex-shrink-0">
          <img 
            src="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/Capture-removebg-preview.png" 
            alt="Clínica Santa Maria dos Olivais" 
            className="h-[45px] w-[45px] md:h-[90px] md:w-[90px] object-contain transition-transform hover:scale-105"
            width="90"
            height="90"
            loading="eager" 
            fetchPriority="high"
          />
        </Link>

        {/* Stories */}
        <div 
          className="flex-1 overflow-x-auto no-scrollbar mx-2 md:mx-6 mask-linear h-full flex items-center relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
           <div 
             className="flex gap-3 md:gap-8 animate-scroll w-max"
             style={{ 
               animationPlayState: isPaused ? 'paused' : 'running',
               willChange: 'transform'
             }}
           >
            {displayStories.map((story: Story, index: number) => (
              <div 
                key={`${story.id}-${index}`} 
                className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                onClick={() => setViewingStory(story)}
              >
                <div className="w-[50px] h-[50px] md:w-[85px] md:h-[85px] rounded-full p-[2px] md:p-[3px] bg-gradient-to-tr from-clinic-lime to-clinic-blue hover:from-clinic-purple hover:to-clinic-lime transition-all duration-300 transform group-hover:scale-105 shadow-sm">
                  <div className="w-full h-full rounded-full border-[2px] md:border-[3px] border-white overflow-hidden bg-white relative">
                    {story.type === 'video' ? (
                      <video 
                        src={story.src} 
                        poster={story.thumbnail}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img 
                        src={story.thumbnail || story.src} 
                        alt={story.title} 
                        className="w-full h-full object-cover"
                        loading="lazy" 
                      />
                    )}
                  </div>
                </div>
                <span className="text-[9px] md:text-sm font-semibold text-clinic-blue mt-1 truncate max-w-[55px] md:max-w-[70px] drop-shadow-sm">{story.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hamburger */}
        <div 
          className={`flex flex-col justify-between w-[24px] h-[18px] md:w-[30px] md:h-[22px] cursor-pointer z-50 flex-shrink-0 ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`w-full h-[2px] md:h-[3px] bg-gradient-to-r from-clinic-blue to-clinic-lime rounded-full transition-all duration-300 ${isMenuOpen ? 'translate-y-[8px] md:translate-y-[9px] rotate-45' : ''}`}></span>
          <span className={`w-full h-[2px] md:h-[3px] bg-gradient-to-r from-clinic-blue to-clinic-lime rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-full h-[2px] md:h-[3px] bg-gradient-to-r from-clinic-blue to-clinic-lime rounded-full transition-all duration-300 ${isMenuOpen ? '-translate-y-[8px] md:-translate-y-[9px] -rotate-45' : ''}`}></span>
        </div>

        {/* Bunting Placement */}
        <CarnivalBunting />
      </header>

      {/* Story Overlay */}
      {viewingStory && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col justify-center items-center animate-fade-in-up">
          <button 
            className="absolute top-6 right-6 text-white text-3xl md:text-4xl hover:text-clinic-lime transition-colors z-[101]"
            onClick={() => setViewingStory(null)}
          >
            &times;
          </button>
          
          <div className="relative w-full max-w-lg aspect-[9/16] md:aspect-auto md:h-[80vh] bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
            {viewingStory.type === 'video' ? (
              <video 
                src={viewingStory.src} 
                className="w-full h-full object-contain" 
                controls 
                autoPlay 
                playsInline
                preload="auto"
              />
            ) : (
              <img 
                src={viewingStory.src} 
                alt={viewingStory.title} 
                className="w-full h-full object-contain"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-serif italic text-xl">{viewingStory.title}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className={`fixed inset-0 bg-white/90 backdrop-blur-xl z-40 flex flex-col justify-center items-center transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav>
          <ul className="text-center space-y-4 md:space-y-6">
            {navigation.map((item: any, index: number) => (
              <li key={index} style={{ transitionDelay: `${index * 100}ms` }} className={`transform transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {item.path.startsWith('http') ? (
                  <a href={item.path} target="_blank" rel="noreferrer" className="font-sans text-2xl md:text-3xl font-semibold text-clinic-blue hover:text-clinic-lime transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.path} className="font-sans text-2xl md:text-3xl font-semibold text-clinic-blue hover:text-clinic-lime transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content - Increased padding to avoid bunting overlap */}
      <main className="flex-grow pt-[200px] md:pt-[260px] relative">
        <div className="fixed inset-0 pointer-events-none opacity-30 z-[-1] bg-fixed" style={{
          backgroundImage: `url('https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/Sem-titulo-7.png')`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
          willChange: 'transform'
        }}></div>
        
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-clinic-blue text-[#f2f2f2] pt-[40px] md:pt-[60px] pb-[40px] px-[20px] md:px-[40px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-[30px] md:mb-[50px]">
             <div className="inline-block mb-6 md:mb-8">
               <img src="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/Recurso-6.png" alt="Logo Footer" className="max-w-[120px] md:max-w-[200px] mx-auto" loading="lazy" />
             </div>
             <h2 className="text-2xl md:text-5xl font-semibold leading-tight">
               Criamos <span className="text-clinic-purple font-serif italic">sorrisos</span> perfeitos,<br />
               combinando excelência médica<br />
               com <span className="text-clinic-purple font-serif italic">conforto</span> absoluto.
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 mb-10 text-center md:text-left">
            <div className="flex flex-col gap-6 md:gap-8 md:items-start items-center">
              <div>
                <h4 className="text-lg md:text-xl font-medium text-clinic-purple mb-2">Redes sociais</h4>
                <div className="flex gap-4 justify-center md:justify-start">
                  {global.socials?.instagram && (
                    <a href={global.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-clinic-lime flex items-center justify-center text-clinic-blue hover:bg-clinic-purple hover:-translate-y-1 transition-all">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {global.socials?.facebook && (
                    <a href={global.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-clinic-lime flex items-center justify-center text-clinic-blue hover:bg-clinic-purple hover:-translate-y-1 transition-all">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">Localização</h4>
                <a href={global.mapsLink || "#"} target="_blank" rel="noreferrer" className="text-base md:text-lg text-clinic-purple font-light hover:text-white transition-colors">
                  {global.address}
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:gap-8 md:items-end items-center text-center md:text-right">
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">E-mail para contacto</h4>
                <a 
                  href={`mailto:${contactEmail}`} 
                  target="_self"
                  className="text-base md:text-lg text-clinic-purple font-light hover:text-white transition-colors break-all"
                  onClick={() => trackContact('Email Footer')}
                >
                  {contactEmail}
                </a>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">Número de telefone</h4>
                <a 
                  href={`tel:${contactPhone}`} 
                  target="_self"
                  className="text-base md:text-lg text-clinic-purple font-light hover:text-white transition-colors"
                  onClick={() => trackContact('Phone Footer')}
                >
                  {global.phone}
                </a>
                <p className="text-xs md:text-sm text-gray-400 mt-1">(Preço de uma chamada de Rede Nacional)</p>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">Whatsapp</h4>
                <a 
                  href={global.socials?.whatsapp || "#"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-base md:text-lg text-clinic-purple font-light hover:text-white transition-colors"
                  onClick={() => trackContact('WhatsApp Footer')}
                >
                  {global.mobile}
                </a>
                <p className="text-xs md:text-sm text-gray-400 mt-1">(Preço de uma chamada de Rede Móvel Nacional)</p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-clinic-lime pt-8 flex flex-col md:flex-row justify-center gap-4 md:gap-10 text-center text-xs md:text-sm font-medium">
            <Link to="/termos" className="hover:text-clinic-purple transition-colors uppercase">Termos e Condições</Link>
            <Link to="/cookies" className="hover:text-clinic-purple transition-colors uppercase">Política de Cookies</Link>
            <Link to="/privacidade" className="hover:text-clinic-purple transition-colors uppercase">Política de Privacidade</Link>
            <a href="https://www.livroreclamacoes.pt/Inicio/" target="_blank" rel="noreferrer" className="hover:text-clinic-purple transition-colors uppercase">Livro de Reclamações</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a 
        href={global.socials?.whatsapp || "#"}
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-[90] w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
        aria-label="Contact us on WhatsApp"
        onClick={() => trackContact('WhatsApp Floating')}
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping" style={{ animationDuration: '2s' }}></span>
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366]"></span>
        <i className="fab fa-whatsapp text-2xl md:text-3xl text-white relative z-10"></i>
      </a>
    </div>
  );
};

export default Layout;