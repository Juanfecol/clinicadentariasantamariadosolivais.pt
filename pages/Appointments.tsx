import React from 'react';
import { useContent } from '../context/ContentContext';
import { useLocation } from 'react-router-dom';

const Appointments: React.FC = () => {
  const { content } = useContent();
  const appointmentsData = content.appointments || { heroImage: "", services: [] };
  const services = appointmentsData.services || [];
  
  // LOGIC FOR 'REDIRECCION' CHANGE
  const location = useLocation();
  const incomingService = location.state?.service;

  // Attempt to match incoming service string (from Home) with the list options (from Context)
  // This handles case-sensitivity issues (e.g. "IMPLANTOLOGIA" vs "Implantologia")
  const initialService = incomingService 
    ? services.find((s: string) => s.toLowerCase() === incomingService.toLowerCase()) || "" 
    : "";

  return (
    <div className="animate-fade-in-up max-w-[1400px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Video/Image - DYNAMIC */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[250px] sm:h-[500px] lg:h-auto">
           <img 
             className="absolute inset-0 w-full h-full object-cover"
             src={appointmentsData.heroImage || "https://res.cloudinary.com/dgvavcxlz/image/upload/v1768688431/Carrusel_1-06_xvexhy.png"}
             alt="Marcações Imagem"
           />
           <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-4">Preencha o Formulário</h1>
            <p className="text-lg text-gray-600">A nossa equipa irá contactá-lo brevemente.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nome Completo <span className="text-red-500">*</span></label>
              <input type="text" placeholder="O seu nome" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-clinic-blue focus:ring-2 focus:ring-clinic-blue/20 outline-none transition-all" required />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email <span className="text-red-500">*</span></label>
              <input type="email" placeholder="O seu email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-clinic-blue focus:ring-2 focus:ring-clinic-blue/20 outline-none transition-all" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Telemóvel <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="O seu número" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-clinic-blue focus:ring-2 focus:ring-clinic-blue/20 outline-none transition-all" required />
            </div>

            {/* Dynamic Service Selection Field - MODIFIED FOR 'REDIRECCION' */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Serviço de Interesse <span className="text-gray-400 text-sm font-normal">(Opcional)</span></label>
              <div className="relative">
                <select 
                   defaultValue={initialService} 
                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-clinic-blue focus:ring-2 focus:ring-clinic-blue/20 outline-none transition-all appearance-none bg-white text-gray-700 cursor-pointer"
                >
                  <option value="" disabled>Selecione uma opção...</option>
                  {services.map((service: string, index: number) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
                {/* Custom Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-clinic-blue">
                  <i className="fas fa-chevron-down text-sm"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Mensagem</label>
              <textarea placeholder="Como podemos ajudar?" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-clinic-blue focus:ring-2 focus:ring-clinic-blue/20 outline-none transition-all"></textarea>
            </div>

            <button type="submit" className="w-full bg-clinic-blue text-white font-bold text-lg py-4 rounded-xl hover:bg-clinic-lime hover:text-clinic-blue transition-all shadow-md">
              Enviar Marcação
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointments;