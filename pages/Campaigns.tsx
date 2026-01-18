import React from 'react';
import { useContent } from '../context/ContentContext';

const Campaigns: React.FC = () => {
  const { content } = useContent();
  const campaigns = content.campaigns || [];
  const global = content.global || {};

  return (
    <div className="animate-fade-in-up max-w-[1400px] mx-auto px-4 py-12 flex flex-col items-center">
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-clinic-blue mb-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <span>Transforme o seu</span>
          <div className="w-[120px] h-[80px] rounded-xl overflow-hidden border-4 border-white shadow-xl rotate-3 hover:rotate-0 transition-transform">
              <img src="https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/05/Sem-titulo-68.png" alt="Sonho" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif italic text-clinic-purple">sorriso</span>
          <span>hoje!</span>
        </h2>
        
        <a 
          href={global.socials?.whatsapp || "#"}
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-3 bg-[#c2a9eb] text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-clinic-blue hover:-translate-y-1 transition-all transform"
        >
          Mais informações aqui
          <span className="animate-pulse">♥</span>
        </a>
      </div>

      <div className="bg-white/40 p-10 rounded-3xl border border-white/50 text-center max-w-2xl mb-16">
        <h3 className="text-2xl font-bold text-clinic-blue mb-4">Fique atento!</h3>
        <p className="text-lg text-gray-700">Novas campanhas e promoções especiais serão anunciadas aqui. Siga-nos nas redes sociais para não perder nenhuma oportunidade.</p>
      </div>

      {/* Campaigns Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {campaigns.map((camp: any, index: number) => (
           <div key={index} className="group overflow-hidden rounded-xl shadow-lg border border-white/30 bg-white">
            <img 
              src={camp.src} 
              className="w-full h-auto object-contain transform transition-transform duration-500 group-hover:scale-105" 
              alt={camp.title || `Campanha ${index+1}`}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Campaigns;