
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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const contactEmail = "clinicasmod@gmail.com";
  const contactPhone = "211 350 066";
  const cleanPhone = contactPhone.replace(/\s+/g, '');

  const trackWhatsAppClick = () => {
    if ((window as any).trackMeta) {
      (window as any).trackMeta('Contact', { content_name: 'WhatsApp' }, true);
    }
  };

  const trackPhoneClick = () => {
    if ((window as any).trackMeta) {
      (window as any).trackMeta('Contact', { content_name: 'Phone' }, true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-clinic-blue bg-clinic-bg overflow-x-hidden">
      <header className="fixed top-2 md:top-5 left-0 right-0 mx-auto w-[92%] md:w-[90%] max-w-[1400px] h-[65px] md:h-[90px] bg-white/20 backdrop-blur-md border border-white/30 rounded-[20px] md:rounded-[30px] flex justify-between items-center px-4 md:px-[40px] z-[100] shadow-lg transition-all hover:bg-white/30">
        <Link to="/" className="z-[110] flex-shrink-0">
          <img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Clínica Santa Maria dos Olivais" className="h-[40px] sm:h-[48px] md:h-[68px] w-auto object-contain transition-transform hover:scale-105" />
        </Link>
        <button 
          className="flex flex-col justify-between w-[24px] h-[16px] md:w-[30px] md:h-[22px] cursor-pointer z-[110] flex-shrink-0 transition-all" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`w-full h-[2px] md:h-[3px] bg-clinic-blue rounded-full transition-all duration-300 ${isMenuOpen ? 'translate-y-[7px] md:translate-y-[9px] rotate-45' : ''}`}></span>
          <span className={`w-full h-[2px] md:h-[3px] bg-clinic-blue rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-full h-[2px] md:h-[3px] bg-clinic-blue rounded-full transition-all duration-300 ${isMenuOpen ? '-translate-y-[7px] md:-translate-y-[9px] -rotate-45' : ''}`}></span>
        </button>
      </header>

      <div className={`fixed inset-0 bg-white/95 backdrop-blur-2xl z-[90] flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav className="w-full">
          <ul className="text-center space-y-5 md:space-y-8 px-6">
            {navigation.map((item: any, index: number) => (
              <li key={index} style={{ transitionDelay: `${index * 75}ms` }} className={`transform transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <Link 
                  to={item.path} 
                  className="font-sans text-base sm:text-xl md:text-2xl font-bold text-clinic-blue hover:text-clinic-purple transition-all inline-block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <main className="flex-grow pt-[90px] md:pt-[130px] relative">
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[-1]" style={{ backgroundImage: `url('https://clinicadentariasantamariadosolivais.pt/wp-content/uploads/2025/05/Sem-titulo-7.png')`, backgroundSize: '250px', backgroundRepeat: 'repeat' }}></div>
        {children}
      </main>

      <footer className="bg-clinic-blue text-[#f2f2f2] pt-[60px] pb-[40px] px-[20px] md:px-[60px]">
        <div className="max-w-[1400px] mx-auto text-center">
             <div className="inline-block mb-8"><img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" alt="Logo Footer" className="max-w-[100px] md:max-w-[180px] mx-auto" /></div>
             <h2 className="text-xl sm:text-2xl md:text-5xl font-semibold leading-tight px-4 mb-12">Criamos <span className="text-clinic-purple font-serif italic">sorrisos</span> perfeitos.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-16">
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-clinic-purple mb-4 font-bold uppercase tracking-wider">Redes sociais</h4>
                <div className="flex gap-4">
                  <a href={global.socials?.instagram} target="_blank" className="w-10 h-10 rounded-full bg-clinic-lime flex items-center justify-center text-clinic-blue"><i className="fab fa-instagram"></i></a>
                  <a href={global.socials?.facebook} target="_blank" className="w-10 h-10 rounded-full bg-clinic-lime flex items-center justify-center text-clinic-blue"><i className="fab fa-facebook-f"></i></a>
                </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-clinic-purple mb-4 font-bold uppercase tracking-wider">Localização</h4>
                <p className="text-sm opacity-80">{global.address}</p>
            </div>
            <div className="flex flex-col items-center md:items-end md:text-right">
                <h4 className="text-clinic-purple mb-4 font-bold uppercase tracking-wider">Contactos</h4>
                <a href={`tel:${cleanPhone}`} onClick={trackPhoneClick} className="block font-bold hover:text-clinic-lime transition-colors">{contactPhone}</a>
                <a href={global.socials?.whatsapp} onClick={trackWhatsAppClick} target="_blank" className="block font-bold hover:text-clinic-lime transition-colors">WhatsApp</a>
            </div>
          </div>

          <div className="border-t border-clinic-lime/30 pt-8 flex flex-wrap justify-center gap-6 text-[10px] uppercase">
            <Link to="/termos" className="hover:text-clinic-purple">Termos</Link>
            <Link to="/cookies" className="hover:text-clinic-purple">Cookies</Link>
            <Link to="/privacidade" className="hover:text-clinic-purple">Privacidade</Link>
          </div>
        </div>
      </footer>
      
      <a href={global.socials?.whatsapp} onClick={trackWhatsAppClick} target="_blank" className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110">
        <i className="fab fa-whatsapp text-3xl text-white"></i>
      </a>
    </div>
  );
};

export default Layout;
