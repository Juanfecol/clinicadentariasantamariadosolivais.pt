
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
    const payload = { ...dataObj, _subject: `Nova Marcação: ${dataObj.nome}`, destination_email_hint: "clinicasmod@gmail.com" };

    try {
      const response = await fetch(`https://formspree.io/f/xwvlagzr`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // --- GOOGLE ADS ---
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', { 
            'send_to': 'AW-434250599', 
            'value': 25.0, 
            'currency': 'EUR'
          });
        }
        
        // --- META PIXEL ---
        if ((window as any).trackMeta) {
          (window as any).trackMeta('Lead', { 
            content_name: dataObj.servico || 'Consulta Clínica',
            value: 25.0,
            currency: 'EUR'
          }, true);
        }

        navigate('/obrigado', { state: dataObj });
      } else {
        alert("Ocorreu um erro ao enviar.");
      }
    } catch (error) {
      alert("Erro de ligação.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-[1300px] mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="hidden lg:block sticky top-[130px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
           <img className="w-full h-auto min-h-[600px] object-cover" src={appointmentsData.heroImage} alt="Marcações" />
        </div>

        <div className="bg-white/70 backdrop-blur-2xl p-6 sm:p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white relative">
          <h1 className="text-3xl md:text-5xl font-bold text-clinic-blue mb-8">Marque a sua <span className="text-clinic-purple italic font-serif">Consulta</span></h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-clinic-purple uppercase tracking-widest ml-2">Nome Completo</label>
              <input name="nome" type="text" placeholder="Ex: João Silva" className="w-full px-6 py-4 rounded-2xl border border-gray-100 outline-none" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-clinic-purple uppercase tracking-widest ml-2">Email</label>
                <input name="email" type="email" placeholder="nome@exemplo.pt" className="w-full px-6 py-4 rounded-2xl border border-gray-100 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-clinic-purple uppercase tracking-widest ml-2">Telemóvel</label>
                <input name="telemovel" type="tel" placeholder="912 345 678" className="w-full px-6 py-4 rounded-2xl border border-gray-100 outline-none" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-clinic-purple uppercase tracking-widest ml-2">Serviço</label>
              <select name="servico" defaultValue={initialService} className="w-full px-6 py-4 rounded-2xl border border-gray-100 outline-none bg-white">
                <option value="" disabled>Escolha o tratamento...</option>
                {services.map((s: string, i: number) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>

            <button type="submit" disabled={isSending} className="w-full bg-clinic-blue text-white font-bold text-xl py-5 rounded-2xl shadow-2xl hover:bg-clinic-purple transition-all">
              {isSending ? "A Enviar..." : "Agendar Agora"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
