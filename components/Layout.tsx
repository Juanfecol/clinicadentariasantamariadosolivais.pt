import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

interface Story {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail: string;
  title: string;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  
  // CONTROL POINT: STORIES_INTERACTION - State to control animation pause
  const [isPaused, setIsPaused] = useState(false);

  const location = useLocation();
  
  // Connect to CMS Context
  const { content } = useContent();
  const storiesData: Story[] = content.stories || [];
  const navigation = content.navigation || [];
  const global = content.global || {};

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Duplicate stories to create a TRUE infinite scroll effect without gaps on wide screens.
  // We multiply the array x6 to ensure the total width is much larger than any 4K screen.
  // The CSS animation translates -50%, so we need the first half to be wider than the viewport.
  const displayStories = [
    ...storiesData, 
    ...storiesData, 
    ...storiesData, 
    ...storiesData,
    ...storiesData,
    ...storiesData
  ];

  // Robust email and phone sanitization for links
  const contactEmail = (global.email && global.email.trim() !== "") ? global.email.trim() : "clinicasmod@gmail.com";
  const contactPhone = global.phone ? global.phone.replace(/\s+/g, '') : "";

  return (
    <div className="flex flex-col min-h-screen font-sans text-clinic-blue bg-clinic-bg">
      
      {/* Header - Glassmorphism - OPTIMIZED FOR MOBILE HEIGHT */}
      <header className="fixed top-2 md:top-5 left-0 right-0 mx-auto w-[95%] md:w-[90%] max-w-[1400px] h-[85px] md:h-[120px] bg-white/15 backdrop-blur-md border border-white/20 rounded-[25px] md:rounded-[35px] flex justify-between items-center px-3 md:px-[30px] z-50 shadow-lg transition-all hover:bg-white/20 hover:shadow-2xl">
        
        {/* Logo (Left) - OPTIMIZED SIZE */}
        <Link to="/" className="z-50 flex-shrink-0">
          <img 
            src="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/Capture-removebg-preview.png" 
            alt="Clínica Santa Maria dos Olivais" 
            className="h-[45px] w-[45px] md:h-[90px] md:w-[90px] object-contain transition-transform hover:scale-105"
          />
        </Link>

        {/* Stories Container (Center) - VIDEOS PLAYING INSIDE CIRCLES - OPTIMIZED INTERACTION */}
        {/* CONTROL POINT: STORIES_INTERACTION - overflow-x-auto allows manual swipe on mobile when paused */}
        <div 
          className="flex-1 overflow-x-auto no-scrollbar mx-2 md:mx-6 mask-linear h-full flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
           <div 
             className="flex gap-3 md:gap-8 animate-scroll w-max"
             style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
           >
            {displayStories.map((story: Story, index: number) => (
              <div 
                key={`${story.id}-${index}`} 
                className={`flex flex-col items-center cursor-pointer group flex-shrink-0`}
                onClick={() => setViewingStory(story)}
              >
                {/* Circle Size Optimized for Mobile */}
                <div className="w-[50px] h-[50px] md:w-[85px] md:h-[85px] rounded-full p-[2px] md:p-[3px] bg-gradient-to-tr from-clinic-lime to-clinic-blue hover:from-clinic-purple hover:to-clinic-lime transition-all duration-300 transform group-hover:scale-105 shadow-sm">
                  <div className="w-full h-full rounded-full border-[2px] md:border-[3px] border-white overflow-hidden bg-white relative">
                    {/* VIDEO PLAYBACK INSIDE CIRCLE */}
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

        {/* Hamburger Menu Icon (Right) */}
        <div 
          className={`flex flex-col justify-between w-[24px] h-[18px] md:w-[30px] md:h-[22px] cursor-pointer z-50 flex-shrink-0 ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`w-full h-[2px] md:h-[3px] bg-gradient-to-r from-clinic-blue to-clinic-lime rounded-full transition-all duration-300 ${isMenuOpen ? 'translate-y-[8px] md:translate-y-[9px] rotate-45' : ''}`}></span>
          <span className={`w-full h-[2px] md:h-[3px] bg-gradient-to-r from-clinic-blue to-clinic-lime rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-full h-[2px] md:h-[3px] bg-gradient-to-r from-clinic-blue to-clinic-lime rounded-full transition-all duration-300 ${isMenuOpen ? '-translate-y-[8px] md:-translate-y-[9px] -rotate-45' : ''}`}></span>
        </div>
      </header>

      {/* Story Viewer Overlay */}
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

      {/* Full Screen Navigation Overlay */}
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

      {/* Main Content */}
      <main className="flex-grow pt-[110px] md:pt-[160px] relative">
        <div className="fixed inset-0 pointer-events-none opacity-30 z-[-1]" style={{
          backgroundImage: `url('https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/Sem-titulo-7.png')`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
          opacity: 0.05
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
                >
                  {global.phone}
                </a>
                <p className="text-xs md:text-sm text-gray-400 mt-1">(Preço de uma chamada de Rede Nacional)</p>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">Whatsapp</h4>
                <a href={global.socials?.whatsapp || "#"} target="_blank" rel="noreferrer" className="text-base md:text-lg text-clinic-purple font-light hover:text-white transition-colors">{global.mobile}</a>
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

      {/* WhatsApp Floating Button */}
      <a 
        href={global.socials?.whatsapp || "#"}
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-[90] w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping" style={{ animationDuration: '2s' }}></span>
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366]"></span>
        <i className="fab fa-whatsapp text-2xl md:text-3xl text-white relative z-10"></i>
      </a>
    </div>
  );
};

export default Layout;