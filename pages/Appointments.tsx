
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (isSending) return;
    setIsSending(true);

    const formData = new FormData(form);
    const dataObj = Object.fromEntries(formData.entries());
    const payload = { ...dataObj, _subject: `Nova Marcação: ${dataObj.nome}`, _replyto: dataObj.email, destination_email_hint: "clinicasmod@gmail.com" };

    try {
      const response = await fetch(`https://formspree.io/f/xwvlagzr`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // RASTREO GOOGLE ADS CONVERSION
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', { 'send_to': 'AW-1135006626/form_submission', 'value': 10.0, 'currency': 'EUR' });
          if ((window as any).trackEvent) { (window as any).trackEvent('form_submission', { 'event_category': 'conversion' }); }
        }
        
        // RASTREO META PIXEL
        if (typeof (window as any).fbq === 'function') {
          (window as any).fbq('track', 'Lead', { content_name: dataObj.servico || 'Consulta Geral', status: 'Pending' });
          (window as any).fbq('trackCustom', 'Envio_Formulario');
        }
        
        navigate('/obrigado', { state: dataObj });
      } else {
        alert("Ocorreu um erro ao enviar o formulário.");
      }
    } catch (error) {
      alert("Erro de ligação. Verifique a sua internet.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-[1400px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
           <img className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" src={appointmentsData.heroImage || "https://clinica-santa-maria-dos-olivais.b-cdn.net/Carrusel%201-06%20(1).png"} alt="Marcações" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
           <div className="absolute bottom-8 left-8 text-white max-w-xs pointer-events-none"><h3 className="text-2xl font-serif italic mb-2">O seu sorriso começa aqui.</h3></div>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white relative overflow-hidden">
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-4 flex items-center gap-3"><i className="far fa-calendar-check text-clinic-lime"></i>Preencha o Formulário</h1>
            <p className="text-lg text-gray-600">A nossa equipa irá contactá-lo brevemente.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-5 relative z-10">
            <div className="group">
              <label className="block text-gray-700 font-medium mb-2 text-sm uppercase">Nome Completo *</label>
              <input name="nome" type="text" placeholder="Seu nome" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-clinic-blue outline-none transition-all shadow-sm" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-gray-700 font-medium mb-2 text-sm uppercase">Email *</label>
                <input name="email" type="email" placeholder="exemplo@email.com" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-clinic-blue outline-none transition-all shadow-sm" required />
              </div>
              <div className="group">
                <label className="block text-gray-700 font-medium mb-2 text-sm uppercase">Telemóvel *</label>
                <input name="telemovel" type="tel" placeholder="919 999 999" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-clinic-blue outline-none transition-all shadow-sm" required />
              </div>
            </div>
            <div className="group">
              <label className="block text-gray-700 font-medium mb-2 text-sm uppercase">Serviço</label>
              <select name="servico" defaultValue={initialService} className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-clinic-blue outline-none transition-all appearance-none cursor-pointer shadow-sm text-gray-700">
                <option value="" disabled>Selecione...</option>
                {services.map((s: string, i: number) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="group"><label className="block text-gray-700 font-medium mb-2 text-sm uppercase">Mensagem</label><textarea name="mensagem" placeholder="Sua mensagem..." rows={3} className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-clinic-blue outline-none transition-all shadow-sm resize-none"></textarea></div>
            <button type="submit" disabled={isSending} className={`w-full bg-clinic-blue text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${isSending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-clinic-purple active:scale-[0.98]'}`}>
              {isSending ? <><i className="fas fa-circle-notch animate-spin"></i> A enviar...</> : <>Enviar Marcação <i className="fas fa-paper-plane text-sm"></i></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
