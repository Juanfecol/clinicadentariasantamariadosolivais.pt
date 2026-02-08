
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Team from './pages/Team';
import Clinic from './pages/Clinic';
import Contact from './pages/Contact';
import Appointments from './pages/Appointments';
import Campaigns from './pages/Campaigns';
import Admin from './pages/Admin';
import CookiesPolicy from './pages/CookiesPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ThankYou from './pages/ThankYou';
import ScrollToTop from './components/ScrollToTop';
import { ContentProvider } from './context/ContentContext';

// Componente auxiliar para rastrear eventos de ruta (Meta Pixel y GTAG)
const PixelRouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Evento Solicitud_Cita
    if (location.pathname.includes('marcacoes')) {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('trackCustom', 'Solicitud_Cita');
      }
    }
  }, [location]);

  // Eventos globales: Scroll (75%) y Tiempo (30s)
  useEffect(() => {
    let scrollTracked = false;
    const handleScroll = () => {
      if (!scrollTracked) {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= 75) {
          if ((window as any).trackEvent) {
            (window as any).trackEvent('scroll_75_percent', {
              'event_category': 'engagement',
              'event_label': 'Scroll Depth 75%'
            });
          }
          scrollTracked = true;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const timer = setTimeout(() => {
      if ((window as any).trackEvent) {
        (window as any).trackEvent('time_on_page_30s', {
          'event_category': 'engagement',
          'event_label': 'User engaged 30+ seconds'
        });
      }
    }, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <ContentProvider>
      <HashRouter>
        <ScrollToTop />
        <PixelRouteTracker />
        <Routes>
          {/* Admin Route (No Layout) */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Main Website Routes (With Layout) */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/equipa" element={<Team />} />
                  <Route path="/clinica" element={<Clinic />} />
                  <Route path="/contactos" element={<Contact />} />
                  <Route path="/marcacoes" element={<Appointments />} />
                  <Route path="/campanhas" element={<Campaigns />} />
                  <Route path="/cookies" element={<CookiesPolicy />} />
                  <Route path="/privacidade" element={<PrivacyPolicy />} />
                  <Route path="/termos" element={<TermsAndConditions />} />
                  <Route path="/obrigado" element={<ThankYou />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </HashRouter>
    </ContentProvider>
  );
};

export default App;
