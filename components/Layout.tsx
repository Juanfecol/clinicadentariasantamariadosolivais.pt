import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const { content } = useContent();
  const navigation = content.navigation || [];
  const global = content.global || {};

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const contactEmail = (global.email && global.email.trim() !== "") ? global.email.trim() : "clinicasmod@gmail.com";
  const contactPhone = global.phone ? global.phone.replace(/\s+/g, '') : "";

  return (
    <div className="flex flex-col min-h-screen font-sans text-clinic-blue bg-clinic-bg">
      
      {/* Header - Glassmorphism */}
      <header className="fixed top-2 md:top-5 left-0 right-0 mx-auto w-[95%] md:w-[90%] max-w-[1400px] h-[70px] md:h-[90px] bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] md:rounded-[30px] flex justify-between items-center px-4 md:px-[40px] z-50 shadow-lg transition-all hover:bg-white/20 hover:shadow-2xl">
        
        {/* Logo (Left) - Punto de Control: Logo Refinado */}
        <Link to="/" className="z-50 flex-shrink-0">
          <img 
            src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" 
            alt="Clínica Santa Maria dos Olivais" 
            className="h-[48px] md:h-[68px] w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>

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

      {/* Navigation Overlay */}
      <div className={`fixed inset-0 bg-white/90 backdrop-blur-xl z-40 flex flex-col justify-center items-center transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav>
          <ul className="text-center space-y-4 md:space-y-6">
            {navigation.map((item: any, index: number) => (
              <li key={index} style={{ transitionDelay: `${index * 100}ms` }} className={`transform transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <Link to={item.path} className="font-sans text-2xl md:text-3xl font-semibold text-clinic-blue hover:text-clinic-lime transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <main className="flex-grow pt-[100px] md:pt-[130px] relative">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{
          backgroundImage: `url('https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/05/Sem-titulo-7.png')`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat'
        }}></div>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-clinic-blue text-[#f2f2f2] pt-[40px] md:pt-[60px] pb-[40px] px-[20px] md:px-[40px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
             <div className="inline-block mb-8">
               <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Logo Footer" className="max-w-[120px] md:max-w-[200px] mx-auto" loading="lazy" />
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
                    <a href={global.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-clinic-lime flex items-center justify-center text-clinic-blue hover:bg-clinic-purple transition-all">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {global.socials?.facebook && (
                    <a href={global.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-clinic-lime flex items-center justify-center text-clinic-blue hover:bg-clinic-purple transition-all">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">Localização</h4>
                <a href={global.mapsLink || "#"} target="_blank" rel="noreferrer" className="text-base md:text-lg text-clinic-purple font-light hover:text-white">
                  {global.address}
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:gap-8 md:items-end items-center text-center md:text-right">
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">E-mail para contacto</h4>
                <a href={`mailto:${contactEmail}`} className="text-base md:text-lg text-clinic-purple font-light hover:text-white break-all">{contactEmail}</a>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">Número de telefone</h4>
                <a href={`tel:${contactPhone}`} className="text-base md:text-lg text-clinic-purple font-light hover:text-white">{global.phone}</a>
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium mb-2">Whatsapp</h4>
                <a href={global.socials?.whatsapp || "#"} target="_blank" rel="noreferrer" className="text-base md:text-lg text-clinic-purple font-light hover:text-white">{global.mobile}</a>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-clinic-lime pt-8 flex flex-wrap justify-center gap-4 md:gap-10 text-center text-xs md:text-sm font-medium">
            <Link to="/termos" className="hover:text-clinic-purple uppercase">Termos e Condiciones</Link>
            <Link to="/cookies" className="hover:text-clinic-purple uppercase">Política de Cookies</Link>
            <Link to="/privacidade" className="hover:text-clinic-purple uppercase">Política de Privacidade</Link>
            <a href="https://www.livroreclamacoes.pt/Inicio/" target="_blank" rel="noreferrer" className="hover:text-clinic-purple uppercase">Livro de Reclamações</a>
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
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping"></span>
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366]"></span>
        <i className="fab fa-whatsapp text-2xl md:text-3xl text-white relative z-10"></i>
      </a>
    </div>
  );
};

export default Layout;