
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

const PixelRouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('marcacoes')) {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('trackCustom', 'Solicitud_Cita');
      }
    }
  }, [location]);

  useEffect(() => {
    let scrollTracked = false;
    const handleScroll = () => {
      if (!scrollTracked) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const scrollPercent = (window.scrollY / scrollHeight) * 100;
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
          {/* Painel Administrativo */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Site Principal */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/equipa" element={<Layout><Team /></Layout>} />
          <Route path="/clinica" element={<Layout><Clinic /></Layout>} />
          <Route path="/contactos" element={<Layout><Contact /></Layout>} />
          <Route path="/marcacoes" element={<Layout><Appointments /></Layout>} />
          <Route path="/campanhas" element={<Layout><Campaigns /></Layout>} />
          <Route path="/cookies" element={<Layout><CookiesPolicy /></Layout>} />
          <Route path="/privacidade" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/termos" element={<Layout><TermsAndConditions /></Layout>} />
          <Route path="/obrigado" element={<Layout><ThankYou /></Route>} />
          
          {/* Fallback para Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ContentProvider>
  );
};

export default App;
