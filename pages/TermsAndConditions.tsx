import React from 'react';
import { useContent } from '../context/ContentContext';

// CONTROL POINT: ACTUALIZACION POLITICAS
const TermsAndConditions: React.FC = () => {
  const { content } = useContent();
  const email = content.global?.email || "clinicasmod@gmail.com";

  return (
    <div className="animate-fade-in-up max-w-[1000px] mx-auto px-6 py-12 text-clinic-blue">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif italic border-2 border-clinic-lime inline-block px-8 py-3 rounded-full mb-6">Termos e Condições</h1>
        <p className="text-gray-600">Regras de utilização do website da Clínica Santa Maria dos Olivais.</p>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-xl border border-white space-y-8 leading-relaxed text-justify">
        
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">01</span>
            Âmbito de Aplicação
          </h2>
          <p>
            Estes Termos e Condições regulam o acesso e a utilização do website da <strong>Clínica Santa Maria dos Olivais</strong>. Ao navegar neste site, o utilizador aceita expressamente as condições aqui descritas. Caso não concorde com as mesmas, deve cessar imediatamente a utilização deste website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">02</span>
            Direitos de Propriedade Intelectual
          </h2>
          <p>
            Todos os conteúdos presentes neste site (textos, imagens, vídeos, logótipos e design gráfico) são propriedade exclusiva da Clínica Santa Maria dos Olivais ou de terceiros que autorizaram a sua utilização, estando protegidos pelo Código do Direito de Autor e dos Direitos Conexos e pelo Código da Propriedade Industrial vigentes em Portugal.
          </p>
          <p className="mt-2">
            É expressamente proibida a cópia, reprodução, modificação ou difusão, total ou parcial, do conteúdo deste website sem a prévia autorização por escrito da Clínica.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">03</span>
            Caráter Informativo (Não Clínico)
          </h2>
          <p>
            As informações contidas neste website têm caráter meramente informativo e de divulgação dos serviços prestados. <strong>Não substituem, em circunstância alguma, o aconselhamento médico profissional.</strong>
          </p>
          <p className="mt-2">
            O utilizador não deve utilizar a informação aqui disponibilizada para diagnosticar ou tratar qualquer problema de saúde sem consultar previamente um médico dentista qualificado.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">04</span>
            Limitação de Responsabilidade
          </h2>
          <p>
            A Clínica Santa Maria dos Olivais envida os melhores esforços para manter a informação do site atualizada e precisa. No entanto, não nos responsabilizamos por:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Erros ou omissões nos conteúdos disponibilizados.</li>
            <li>Danos resultantes da utilização ou da impossibilidade de utilização do site.</li>
            <li>Links para sites de terceiros que possam existir na nossa página, sobre os quais não temos controlo.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">05</span>
            Marcações Online
          </h2>
          <p>
            A funcionalidade de pedido de marcação online não garante a confirmação imediata da consulta. Todas as marcações estão sujeitas a confirmação posterior por parte da nossa equipa administrativa, via telefone ou e-mail.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">06</span>
            Lei Aplicável e Foro
          </h2>
          <p>
            A estes Termos e Condições aplica-se a Lei Portuguesa. Para a resolução de quaisquer litígios emergentes da utilização deste site, será competente o Tribunal da Comarca de Lisboa, com expressa renúncia a qualquer outro.
          </p>
          <p className="mt-4">
            Em caso de litígio de consumo, o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo (Centro de Arbitragem de Conflitos de Consumo de Lisboa - <a href="http://www.centroarbitragemlisboa.pt" target="_blank" rel="noreferrer" className="text-clinic-purple hover:underline">www.centroarbitragemlisboa.pt</a>).
          </p>
        </section>

        <div className="mt-8 pt-8 border-t border-clinic-blue/20 text-center">
           <p className="text-sm text-gray-500">Dúvidas? Contacte-nos: <a href={`mailto:${email}`} className="font-bold text-clinic-blue">{email}</a></p>
        </div>

      </div>
    </div>
  );
};

export default TermsAndConditions;
