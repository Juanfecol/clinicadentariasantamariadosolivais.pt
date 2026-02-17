
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const Home: React.FC = () => {
  const { content } = useContent();
  const { heroTitle, heroSubtitle } = content.home;
  const stories = content.stories || [];

  const [centerIndex, setCenterIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const [isStoriesVisible, setIsStoriesVisible] = useState(true);
  const storiesSectionRef = useRef<HTMLElement>(null);
  const expVideoRef = useRef<HTMLVideoElement>(null);
  const campVideoRef = useRef<HTMLVideoElement>(null);
  const [isExpMuted, setIsExpMuted] = useState(true); 
  const [isCampMuted, setIsCampMuted] = useState(true);

  const servicesList = [
    {
      id: "01",
      category: "IMPLANTOLOGIA",
      title: "Reabilitação Oral e Implantes",
      description: "Recupere o seu sorriso fixo. Implantes de titânio e coroas de cerâmica com a Dra. Ana Mata. Solução completa em Lisboa, sem necessidade de viagens de risco.",
      highlight: "A nossa diferença: Tratamento realizado em Portugal, com acompanhamento permanente presencial.",
      transparency: [
        "Implante Unitário + Coroa: desde 745€",
        "Protocolo Superior (Arcada Completa): 4.800€"
      ],
      buttonText: "Agendar Avaliação Implantologia"
    },
    {
      id: "02",
      category: "ORTODONTIA, ALINHADORES INVISÍVEIS",
      title: "Ortodontia e Alinhamento Dentário",
      description: "Alinhamento dentário para crianças e adultos. Aparelhos fixos convencionais e as soluções mais modernas de alinhadores invisíveis com a Dra. Mariana Aberto.",
      highlight: "Especialista em Alinhadores Spark e Ortodontia Clínica.",
      transparency: [
        "Estudo Ortodôntico Completo: 60€",
        "Aparelho Fixo Convencional: desde 450€ (por arcada)",
        "Alinhadores Invisíveis: Sob consulta médica."
      ],
      buttonText: "Marcar Estudo Ortodôntico"
    },
    {
      id: "03",
      category: "LIMPEZA E DESTARTARIZAÇÃO",
      title: "Higiene Oral e Prevenção",
      description: "A base de um sorriso saudável é a prevenção. Consultas de higiene com ultrassons para remover tártaro e manchas, prevenindo doenças gengivais e mau hálito.",
      highlight: "Inclui: Destartarização completa e polimento profissional.",
      transparency: [
        "Preço Fechado: 40€"
      ],
      buttonText: "Agendar Higiene Oral"
    },
    {
      id: "04",
      category: "CONSULTA DE ROTINA",
      title: "Consulta de Avaliação e Diagnóstico",
      description: "Diferente das consultas grátis comerciais, realizamos um ato médico rigoroso para avaliar a sua saúde real e diagnosticar necessidades honestas, sem orçamentos desnecessários.",
      highlight: "Diagnóstico médico rigoroso com tecnologia digital.",
      transparency: [
        "Valor da Consulta: 20€",
        "Inclui:",
        "- Raios-X digitais",
        "- Diagnóstico Completo",
        "- Plano de tratamento personalizado",
        "- Aconselhamento profissional"
      ],
      buttonText: "Marcar Consulta 20€"
    },
    {
      id: "05",
      category: "ODONTOPEDIATRIA",
      title: "Medicina Dentária Pediátrica",
      description: "Cuidamos dos sorrisos dos mais pequenos num ambiente tranquilo. A Dra. Orizanda Claret é especialista em tornar a visita ao dentista numa experiência positiva e sem medos.",
      highlight: "Foco na prevenção e acompanhamento do crescimento.",
      transparency: [
        "Aplicação de Selantes",
        "Restauração de Dentes de Leite (45€)",
        "Extração de Dentes de Leite (35€)"
      ],
      buttonText: "Agendar para o meu Filho"
    },
    {
      id: "06",
      category: "BRANQUEAMENTO",
      title: "Estética e Branqueamento Dentário",
      description: "Ilumine o seu sorriso de forma segura. Opções adaptadas à sua sensibilidade, sempre sob supervisão médica para garantir resultados naturais sem danificar o esmalte.",
      highlight: "Resultados visíveis sob monitorização clínica.",
      transparency: [
        "Kit Ambulatório (Casa): Moldes + Gel (150€)",
        "Em Consultório: Sessão intensiva (200€)"
      ],
      buttonText: "Quero um Sorriso Mais Branco"
    }
  ];

  const trackGtagEvent = (name: string, params: any) => {
    if ((window as any).trackEvent) {
      (window as any).trackEvent(name, params);
    }
  };

  const handleNextStory = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % stories.length);
  }, [stories.length]);

  useEffect(() => {
    const enableAudio = () => {
      setHasInteracted(true);
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
    };
    window.addEventListener('click', enableAudio);
    window.addEventListener('touchstart', enableAudio);
    return () => {
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
    };
  }, []);

  useEffect(() => {
    if (videoRefs.current.length > 0) {
      videoRefs.current.forEach((v) => { if (v) { v.preload = "auto"; v.load(); } });
    }
    if (expVideoRef.current) { expVideoRef.current.preload = "auto"; expVideoRef.current.load(); }
    if (campVideoRef.current) { campVideoRef.current.preload = "auto"; campVideoRef.current.load(); }
  }, [stories]);

  useEffect(() => {
    if (!isStoriesVisible || stories[centerIndex]?.type === 'video') return;
    const timer = setTimeout(() => { handleNextStory(); }, 5000);
    return () => clearTimeout(timer);
  }, [centerIndex, isStoriesVisible, stories, handleNextStory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === storiesSectionRef.current) {
            setIsStoriesVisible(entry.isIntersecting);
          }
          
          if (entry.target === expVideoRef.current) {
            if (entry.isIntersecting) {
              expVideoRef.current?.play().catch(() => {});
            } else {
              expVideoRef.current?.pause();
              setIsExpMuted(true);
              if (expVideoRef.current) expVideoRef.current.muted = true;
            }
          }

          if (entry.target === campVideoRef.current) {
            if (entry.isIntersecting) {
              campVideoRef.current?.play().catch(() => {});
            } else {
              campVideoRef.current?.pause();
              setIsCampMuted(true);
              if (campVideoRef.current) campVideoRef.current.muted = true;
            }
          }
        });
      },
      { threshold: 0.6 } // Aumentado para 60% para garantir que o vídeo está em "primer plano"
    );
    if (storiesSectionRef.current) observer.observe(storiesSectionRef.current);
    if (expVideoRef.current) observer.observe(expVideoRef.current);
    if (campVideoRef.current) observer.observe(campVideoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncPlayback = async () => {
      if (!isStoriesVisible) {
        videoRefs.current.forEach(v => {
          if (v) {
            v.pause();
            v.muted = true; // Silencia imediatamente ao sair do foco
          }
        });
        return;
      }

      for (let i = 0; i < videoRefs.current.length; i++) {
        const v = videoRefs.current[i];
        if (!v) continue;
        const isCenter = i === centerIndex;

        if (isCenter) {
          v.currentTime = 0;
          v.muted = !hasInteracted; // Só ativa áudio se houve interação e está visível
          v.loop = false;
        } else {
          v.muted = true;
          v.loop = true;
        }

        try {
          await v.play();
        } catch (e) {
          v.muted = true;
          v.play().catch(() => {});
        }
      }
    };
    syncPlayback();
  }, [centerIndex, isStoriesVisible, hasInteracted]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handleNextStory();
      else setCenterIndex((prev) => (prev - 1 + stories.length) % stories.length);
    }
    touchStartX.current = null;
  };

  const getStoryStyle = (index: number) => {
    let diff = index - centerIndex;
    if (diff > stories.length / 2) diff -= stories.length;
    if (diff < -stories.length / 2) diff += stories.length;
    const absDiff = Math.abs(diff);
    const opacity = absDiff === 0 ? 1 : Math.max(0.45, 0.75 - (absDiff * 0.1));
    const scale = absDiff === 0 ? 1.3 : Math.max(0.75, 0.9 - (absDiff * 0.12));
    const translateZ = absDiff === 0 ? 80 : 0;
    const zIndex = 100 - Math.floor(absDiff * 20);
    const translateX = diff * 80; 

    return {
      transform: `translate3d(${translateX}%, 0, ${translateZ}px) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      transformStyle: 'preserve-3d' as const,
      willChange: 'transform, opacity'
    };
  };

  const toggleExpMute = () => {
    if (!expVideoRef.current) return;
    const newMuted = !isExpMuted;
    expVideoRef.current.muted = newMuted;
    setIsExpMuted(newMuted);
    if (!newMuted && !hasInteracted) setHasInteracted(true);
  };

  const toggleCampMute = () => {
    if (!campVideoRef.current) return;
    const newMuted = !isCampMuted;
    campVideoRef.current.muted = newMuted;
    setIsCampMuted(newMuted);
    if (!newMuted && !hasInteracted) setHasInteracted(true);
  };

  return (
    <div className="relative animate-fade-in-up overflow-x-hidden bg-clinic-bg">
      {/* Hero Section */}
      <section className="relative z-30 text-center px-4 mb-4 md:mb-8">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold text-clinic-blue mb-6 leading-tight">
          <span className="font-body text-clinic-purple text-xl md:text-4xl font-medium mr-2">Clínica Dentária</span>
          {heroTitle.replace('Clínica', '')}
        </h1>
        <p className="text-base md:text-xl text-gray-800 max-w-3xl mx-auto font-light px-4">{heroSubtitle}</p>
      </section>

      {/* Stories Section */}
      <section ref={storiesSectionRef} className="relative h-[340px] md:h-[500px] max-w-[1400px] mx-auto overflow-visible mb-8 flex justify-center items-center" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
           <div className="absolute inset-[5%] rounded-full blur-[90px] md:blur-[250px] animate-glow-cycle opacity-[0.48]" style={{ background: 'radial-gradient(circle, currentColor 0%, currentColor 12%, #f2f2f2 35%)', willChange: 'filter' }}></div>
        </div>

        <div className="relative z-20 w-full h-full flex justify-center items-center perspective-[1500px]">
          {stories.map((story: any, index: number) => {
            const isCenter = centerIndex === index;
            return (
              <div 
                key={story.id} 
                className={`absolute w-[125px] h-[210px] md:w-[200px] md:h-[330px] rounded-[2.2rem] md:rounded-[3.2rem] border-[4px] md:border-[8px] border-white overflow-hidden bg-black cursor-pointer transition-all duration-500 ${isCenter ? 'ring-4 ring-clinic-lime/70 shadow-[0_45px_100px_-10px_rgba(0,0,0,0.75)]' : 'shadow-xl'}`}
                style={getStoryStyle(index)} onClick={() => setCenterIndex(index)} 
              >
                {story.type === 'video' ? (
                  <video key={story.src} ref={(el) => (videoRefs.current[index] = el)} src={story.src} poster={story.thumbnail} className="w-full h-full object-cover" muted playsInline webkit-playsinline="true" onEnded={isCenter ? handleNextStory : undefined} />
                ) : (
                  <img src={story.thumbnail || story.src} className="w-full h-full object-cover" alt={story.title} />
                )}
                {isCenter && <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent"><p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest text-center drop-shadow-md">{story.title}</p></div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Campanha Sorriso Sem Escalas - Versão Compacta */}
      <section className="relative z-30 max-w-[1200px] mx-auto px-4 py-12 md:py-16 mb-4 bg-white/40 backdrop-blur-md rounded-[40px] border border-white shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 lg:pl-16 xl:pl-24">
            <span className="inline-block bg-clinic-purple text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">Campanha Exclusiva</span>
            <h2 className="text-3xl md:text-5xl font-bold text-clinic-blue mb-6 leading-tight">Sorriso Sem Escalas:<br /><span className="text-clinic-purple font-serif italic">Excelência em Portugal</span></h2>
            
            <div className="text-base text-gray-700 mb-8 leading-relaxed space-y-3 font-light">
              <p>Não arrisque a sua saúde em viagens longas. Oferecemos preços justos com a garantia da medicina portuguesa.</p>
              <p>A grande vantagem? Se precisar de nós no dia seguinte, estamos à distância de um telefonema, não de um voo. Sem barreiras de língua e com a segurança de um acompanhamento médico contínuo em Lisboa.</p>
            </div>
            
            {/* Tabela de Preços Compacta */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-clinic-lime transition-transform hover:scale-[1.01]">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Implante Unitário + Coroa</p>
                  <p className="text-xl font-bold text-clinic-blue whitespace-nowrap">Desde 745 €*</p>
                </div>
                <p className="text-[10px] text-clinic-purple font-medium italic leading-tight">(Inclui fase cirúrgica e coroa metalo-cerâmica)</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-clinic-purple transition-transform hover:scale-[1.01]">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Protocolo Superior (Dentes Fixos)</p>
                  <p className="text-xl font-bold text-clinic-blue whitespace-nowrap">Desde 4.800 €*</p>
                </div>
                <p className="text-[10px] text-clinic-purple font-medium italic leading-tight">(Reabilitação total de arcada)</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-clinic-blue transition-transform hover:scale-[1.01]">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Facetas Estéticas (Pack 4 dentes)</p>
                  <p className="text-xl font-bold text-clinic-blue whitespace-nowrap">Desde 1.800 €*</p>
                </div>
                <p className="text-[10px] text-clinic-purple font-medium italic leading-tight">(Zona estética frontal)</p>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 mb-8 italic leading-tight">
              *Nota Legal: Valores de referência para casos standard, sujeitos a avaliação médica presencial. Não inclui enxertos ósseos se necessários.
            </p>
            <Link to="/marcacoes" onClick={() => trackGtagEvent('click_agendar_consulta', { 'event_category': 'engagement' })} className="inline-block bg-clinic-blue text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-clinic-purple transition-all transform hover:scale-105">Marque a Sua Consulta</Link>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full max-w-[240px] md:max-w-[320px] aspect-[9/16] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[4px] border-white bg-black">
              <video 
                ref={campVideoRef}
                src="https://clinica-santa-maria-dos-olivais.b-cdn.net/GUION%2004%20-%20TURQUIA.mp4" 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={toggleCampMute}
                className="absolute bottom-4 right-4 z-40 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-clinic-blue transition-all"
              >
                <i className={`fas ${isCampMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-sm`}></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 10 Anos de Experiência */}
      <section className="px-4 py-6 md:py-10 relative overflow-visible border-t border-clinic-lime/10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-20">
          <div className="flex flex-col items-center lg:items-end order-2 lg:order-1 gap-4">
             <div className="relative w-full max-w-[245px] md:max-w-[340px] aspect-[9/16] rounded-[2.8rem] md:rounded-[4.5rem] flex items-center justify-center overflow-visible">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] rounded-full blur-[90px] md:blur-[250px] animate-glow-cycle opacity-[0.48] -z-10" style={{ background: 'radial-gradient(circle, currentColor 0%, currentColor 12%, #f2f2f2 38%)' }}></div>
                <div className="relative z-20 w-full h-full rounded-[2.6rem] md:rounded-[4.2rem] overflow-hidden border-[6px] md:border-[12px] border-white shadow-[0_55px_120px_-15px_rgba(0,0,0,0.8)] bg-black">
                  <video ref={expVideoRef} src="https://clinica-santa-maria-dos-olivais.b-cdn.net/clinicadentaria-santamariadosolivais.mp4" loop muted playsInline className="w-full h-full object-cover" />
                  <button onClick={toggleExpMute} className="absolute bottom-6 right-6 z-40 w-12 h-12 bg-white/25 backdrop-blur-lg rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-clinic-blue transition-all"><i className={`fas ${isExpMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i></button>
                </div>
             </div>
             <Link to="/campanhas" className="bg-clinic-purple text-white px-8 py-3 rounded-full text-lg font-bold shadow-xl hover:bg-clinic-blue transition-all transform hover:scale-105">Ver Mais <i className="fas fa-arrow-right ml-2 text-sm"></i></Link>
          </div>
          <div className="relative z-30 text-center lg:text-left order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-clinic-blue leading-[1.1]"><div className="flex flex-wrap justify-center lg:justify-start items-center gap-2"><span>Com</span><span className="font-serif italic text-clinic-lime text-6xl md:text-[10rem]">10</span><span>anos de</span></div><div className="font-serif italic text-clinic-purple">Experiência</div></h2>
            <div className="mt-8 md:mt-12 space-y-4"><p className="text-xl sm:text-2xl md:text-4xl font-bold text-clinic-blue tracking-tight">Implantes | Estética Dentária | Ortodontia</p><p className="text-lg sm:text-xl md:text-2xl font-serif italic text-clinic-purple">Tratamentos personalizados para toda a família👇</p></div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="relative z-30 max-w-[1100px] mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-6xl font-serif italic text-center mb-16 border-b-4 border-clinic-lime inline-block pb-4 mx-auto block w-fit">Nossos Serviços Dentários</h2>
        <div className="grid gap-6">
          {servicesList.map((service, index) => (
            <details key={index} className="group bg-white rounded-3xl border border-clinic-blue/5 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.20)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.40)] open:border-clinic-lime"
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) {
                  trackGtagEvent('view_service_detail', { 'event_category': 'engagement', 'event_label': service.category });
                }
              }}
            >
              <summary className="flex justify-between items-center cursor-pointer p-6 md:p-8 list-none">
                <div className="flex items-center gap-6">
                  <span className="text-3xl md:text-5xl font-serif italic text-clinic-lime/20 font-bold group-open:text-clinic-lime">{service.id}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold text-clinic-purple tracking-widest uppercase mb-1">{service.category}</span>
                    <span className="text-lg md:text-3xl font-semibold text-clinic-blue group-open:text-clinic-purple transition-colors uppercase leading-tight">{service.title}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-clinic-bg flex items-center justify-center text-clinic-blue transition-all group-open:rotate-180 group-open:bg-clinic-blue group-open:text-white"><i className="fas fa-chevron-down"></i></div>
              </summary>
              <div className="px-8 pb-10 pt-2 md:px-16">
                <div className="max-w-3xl space-y-6">
                  <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                    {service.description}
                  </p>
                  
                  <div className="p-5 bg-clinic-bg rounded-2xl border-l-4 border-clinic-lime">
                    <p className="font-bold text-clinic-blue mb-4 italic">{service.highlight}</p>
                    <div className="space-y-2">
                       <p className="text-xs font-bold uppercase tracking-wider text-clinic-purple mb-2">Transparência:</p>
                       {service.transparency.map((line, idx) => (
                         <p key={idx} className={`text-base md:text-lg font-semibold text-clinic-blue ${line.startsWith('-') ? 'ml-4 font-normal text-gray-700' : ''}`}>{line}</p>
                       ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link to="/marcacoes" state={{ service: service.category }} onClick={() => trackGtagEvent('click_service_cta', { 'event_category': 'engagement', 'event_label': service.buttonText })} className="inline-block bg-clinic-lime text-clinic-blue font-black px-10 py-4 rounded-full shadow-lg hover:bg-clinic-blue hover:text-white transition-all uppercase text-sm md:text-base transform hover:scale-105 active:scale-95">
                      {service.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Seção Seguros e Reembolsos */}
      <section className="relative z-30 max-w-[1100px] mx-auto px-4 py-16 md:py-24 border-t border-clinic-lime/20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-clinic-blue mb-4">Aceitamos o seu Seguro em <span className="text-clinic-purple italic font-serif">Regime de Reembolso</span></h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Na Clínica Santa Maria dos Olivais, escolhe o seu médico pela qualidade, não pela lista da seguradora.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[30px] shadow-xl border-t-4 border-clinic-lime flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-clinic-bg rounded-full flex items-center justify-center text-clinic-blue mb-6 text-2xl"><i className="fas fa-stethoscope"></i></div>
            <h3 className="text-xl font-bold text-clinic-blue mb-4">1. Tratamento</h3>
            <p className="text-gray-600 text-sm">Realiza o tratamento com os nossos especialistas com total liberdade de escolha clínica.</p>
          </div>
          <div className="bg-white p-8 rounded-[30px] shadow-xl border-t-4 border-clinic-lime flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-clinic-bg rounded-full flex items-center justify-center text-clinic-blue mb-6 text-2xl"><i className="fas fa-file-invoice-dollar"></i></div>
            <h3 className="text-xl font-bold text-clinic-blue mb-4">2. Faturação</h3>
            <p className="text-gray-600 text-sm">Efetuamos a fatura detalhada com todos os códigos OMD exigidos pelas seguradoras como a ADSE, Médis, Allianz ou Multicare.</p>
          </div>
          <div className="bg-white p-8 rounded-[30px] shadow-xl border-t-4 border-clinic-lime flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-clinic-bg rounded-full flex items-center justify-center text-clinic-blue mb-6 text-2xl"><i className="fas fa-mobile-alt"></i></div>
            <h3 className="text-xl font-bold text-clinic-blue mb-4">3. Reembolso</h3>
            <p className="text-gray-600 text-sm">O reembolso é processado pela sua seguradora de acordo com as condições específicas da sua apólice e prazos determinados pela mesma.</p>
          </div>
        </div>

        <div className="bg-clinic-blue text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-bold mb-4">Nota importante sobre pagamentos</h4>
              <p className="text-white/80 leading-relaxed italic">
                Não realizamos financiamento bancário direto. O pagamento é feito no ato, garantindo-lhe o melhor preço final sem juros e transparência total sobre o valor investido na sua saúde.
              </p>
            </div>
            <div className="flex flex-wrap gap-8 items-center justify-center md:justify-end md:border-l-2 border-white/20 md:pl-8">
               <span className="text-3xl font-black tracking-tighter" style={{ color: '#005CA9' }}>ADSE</span>
               <span className="text-2xl font-bold tracking-tight" style={{ color: '#003781' }}>Allianz</span>
               <span className="text-2xl font-semibold italic text-clinic-purple">Médis</span>
               <span className="text-2xl font-bold tracking-widest text-clinic-lime">MULTICARE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-30 py-16 md:py-24 text-center">
        <div className="max-w-[1100px] mx-auto px-4 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-clinic-blue mb-12 flex flex-wrap justify-center items-center gap-4"><span>Transforme o seu</span><div className="w-[80px] h-[55px] md:w-[150px] md:h-[100px] rounded-2xl overflow-hidden border-4 border-white shadow-xl flex items-center justify-center bg-white/10"><img src="https://clinica-santa-maria-dos-olivais.b-cdn.net/Capture-removebg-preview.png" className="w-[85%] h-[85%] object-contain animate-float" alt="Smile Logo" /></div><span className="font-serif italic text-clinic-purple">sorriso</span><span>hoje!</span></h2>
          <Link to="/marcacoes" className="inline-block bg-clinic-blue text-white px-6 py-4 rounded-full text-base font-bold shadow-2xl hover:bg-clinic-purple transition-all transform hover:-translate-y-2 text-center w-full max-w-[320px] sm:w-auto sm:px-12 sm:py-5 sm:text-xl active:scale-95">Agende Sua Consulta <span className="animate-pulse ml-2 inline-block">♥</span></Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
