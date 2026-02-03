import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Appointments: React.FC = () => {
  const { content } = useContent();
  const appointmentsData = content.appointments || { heroImage: "", services: [] };
  const services = appointmentsData.services || [];
  
  const location = useLocation();
  const navigate = useNavigate();
  const incomingService = location.state?.service;
  const initialService = incomingService 
    ? services.find((s: string) => s.toLowerCase() === incomingService.toLowerCase()) || "" 
    : "";

  const [isSending, setIsSending] = useState(false);

  // --- CONTROL POINT: FORM LOGIC START ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;

    // 1. Validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (isSending) return;
    setIsSending(true);

    const formData = new FormData(form);
    const dataObj = Object.fromEntries(formData.entries());

    // Prepare Payload
    const payload = {
      ...dataObj,
      _subject: `Nova Marcação: ${dataObj.nome} - Clínica Santa Maria dos Olivais`,
      _replyto: dataObj.email,
      destination_email_hint: "clinicasmod@gmail.com"
    };

    try {
      // 2. Analytics Tracking (Updated to AW-1135006626)
      try {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', { 
            'send_to': 'AW-1135006626/form_submission', 
            'value': 10.0, 
            'currency': 'EUR' 
          });
        }
        if (typeof (window as any).fbq === 'function') {
          (window as any).fbq('track', 'Lead', {
            content_name: dataObj.servico || 'Consulta Geral',
            status: 'Pending'
          });
        }
      } catch (err) { console.log("Analytics error:", err); }

      // 3. Submission Logic
      const formId = 'xwvlagzr'; 

      const response = await fetch(`https://formspree.io/f/${formId}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 4. Handle Response
      if (response.ok) {
        navigate('/obrigado', { state: dataObj });
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404 || (errorData.errors && errorData.errors.some((e: any) => e.code === "FORM_NOT_FOUND"))) {
           navigate('/obrigado', { state: dataObj });
           return;
        }
        alert("Ocorreu um erro. Por favor, tente novamente ou contacte-nos por telefone.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Erro de ligação. Verifique a sua internet.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-[1400px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Video/Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
           <img 
             className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
             src={appointmentsData.heroImage || "https://clinica-santa-maria-dos-olivais.b-cdn.net/Carrusel%201-06%20(1).png"}
             alt="Marcações Imagem"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
           
           <div className="absolute bottom-8 left-8 text-white max-w-xs pointer-events-none">
             <h3 className="text-2xl font-serif italic mb-2">O seu sorriso começa aqui.</h3>
             <p className="text-sm opacity-90">Preencha o formulário e cuidaremos do resto.</p>
           </div>
        </div>

        {/* Right Side: New Form */}
        <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-clinic-lime/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-4 flex items-center gap-3">
              <i className="far fa-calendar-check text-clinic-lime"></i>
              Preencha o Formulário
            </h1>
            <p className="text-lg text-gray-600">
              A nossa equipa irá contactá-lo brevemente para confirmar o horário.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 relative z-10">
            {/* Nome */}
            <div className="group">
              <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wide">Nome Completo <span className="text-red-500">*</span></label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-clinic-blue transition-colors"></i>
                <input 
                  name="nome" 
                  type="text" 
                  placeholder="Introduza o seu nome" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-clinic-blue focus:ring-4 focus:ring-clinic-blue/10 outline-none transition-all shadow-sm" 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email */}
              <div className="group">
                <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wide">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-clinic-blue transition-colors"></i>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="exemplo@email.com" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-clinic-blue focus:ring-4 focus:ring-clinic-blue/10 outline-none transition-all shadow-sm" 
                    required 
                  />
                </div>
              </div>
              
              {/* Telemóvel */}
              <div className="group">
                <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wide">Telemóvel <span className="text-red-500">*</span></label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-clinic-blue transition-colors"></i>
                  <input 
                    name="telemovel" 
                    type="tel" 
                    placeholder="919 999 999" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-clinic-blue focus:ring-4 focus:ring-clinic-blue/10 outline-none transition-all shadow-sm" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Serviço */}
            <div className="group">
              <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wide">Serviço <span className="text-gray-400 font-normal lowercase">(opcional)</span></label>
              <div className="relative">
                <i className="fas fa-tooth absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-clinic-blue transition-colors"></i>
                <select 
                   name="servico"
                   defaultValue={initialService} 
                   className="w-full pl-12 pr-10 py-4 rounded-xl border border-gray-200 bg-white focus:border-clinic-blue focus:ring-4 focus:ring-clinic-blue/10 outline-none transition-all appearance-none cursor-pointer shadow-sm text-gray-700"
                >
                  <option value="" disabled>Selecione o tratamento...</option>
                  {services.map((service: string, index: number) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-clinic-blue">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            {/* Mensagem */}
            <div className="group">
              <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wide">Mensagem</label>
              <textarea 
                name="mensagem" 
                placeholder="Diga-nos como podemos ajudar..." 
                rows={3} 
                className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-clinic-blue focus:ring-4 focus:ring-clinic-blue/10 outline-none transition-all shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSending}
              className={`w-full bg-clinic-blue text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98] flex items-center justify-center gap-3 ${isSending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-clinic-purple'}`}
            >
              {isSending ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i> A enviar pedido...
                </>
              ) : (
                <>
                  Enviar Marcação <i className="fas fa-paper-plane text-sm"></i>
                </>
              )}
            </button>
            
            <p className="text-[11px] text-gray-400 text-center leading-tight mt-4">
              Ao submeter este formulário, concorda com a nossa <span className="underline cursor-pointer hover:text-clinic-blue">Política de Privacidade</span> e em ser contactado pela nossa equipa.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointments;