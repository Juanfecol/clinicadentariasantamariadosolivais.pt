import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Team from './pages/Team';
import Clinic from './pages/Clinic';
import Contact from './pages/Contact';
import Appointments from './pages/Appointments';
import Campaigns from './pages/Campaigns';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';
import { ContentProvider } from './context/ContentContext';

// CONTROL POINT: ROUTING SETUP
const App: React.FC = () => {
  return (
    <ContentProvider>
      <HashRouter>
        <ScrollToTop />
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