import React from 'react';
import { useContent } from '../context/ContentContext';

// CONTROL POINT: ACTUALIZACION POLITICAS
const PrivacyPolicy: React.FC = () => {
  const { content } = useContent();
  const email = content.global?.email || "clinicasmod@gmail.com";
  const address = content.global?.address || "Lisboa, Portugal";

  return (
    <div className="animate-fade-in-up max-w-[1000px] mx-auto px-6 py-12 text-clinic-blue">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif italic border-2 border-clinic-lime inline-block px-8 py-3 rounded-full mb-6">Política de Privacidade</h1>
        <p className="text-gray-600">Em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).</p>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-xl border border-white space-y-8 leading-relaxed text-justify">
        
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">01</span>
            Responsável pelo Tratamento
          </h2>
          <p>
            A <strong>Clínica Santa Maria dos Olivais</strong> é a entidade responsável pela recolha e tratamento dos seus dados pessoais.
            Estamos empenhados em proteger a sua privacidade e em cumprir todas as obrigações legais decorrentes do Regulamento (UE) 2016/679 (RGPD) e demais legislação portuguesa aplicável.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            <strong>Endereço:</strong> {address}<br/>
            <strong>Contacto:</strong> {email}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">02</span>
            Dados Recolhidos e Finalidade
          </h2>
          <p>
            Recolhemos apenas os dados estritamente necessários para a prestação dos nossos serviços de saúde e para a gestão da relação com o paciente. Os dados podem incluir:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Dados de Identificação:</strong> Nome, número de contribuinte, data de nascimento.</li>
            <li><strong>Dados de Contacto:</strong> Email, número de telefone/telemóvel, morada.</li>
            <li><strong>Dados de Saúde:</strong> Historial clínico, tratamentos realizados, exames complementares (recolhidos presencialmente sob sigilo médico).</li>
            <li><strong>Dados de Navegação:</strong> Endereço IP, cookies (conforme Política de Cookies) para efeitos de marketing e análise estatística.</li>
          </ul>
          <p className="mt-4">
            <strong>Finalidades:</strong> Gestão de marcações, prestação de cuidados de saúde, faturação, cumprimento de obrigações legais e, mediante consentimento, envio de comunicações informativas ou promocionais.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">03</span>
            Partilha de Dados
          </h2>
          <p>
            Os seus dados pessoais não serão transmitidos a terceiros, exceto nos casos estritamente necessários para:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Cumprimento de obrigações legais (ex: Autoridade Tributária, ERS).</li>
            <li>Prestadores de serviços subcontratados (ex: laboratórios de prótese, fornecedores de software clínico), que atuam sob nossas instruções e medidas de segurança.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">04</span>
            Prazos de Conservação
          </h2>
          <p>
            Os dados pessoais serão conservados apenas durante o período necessário para as finalidades para as quais foram recolhidos.
            No caso de dados de saúde, aplicam-se os prazos legais de conservação de processos clínicos vigentes em Portugal. Dados para efeitos de faturação são conservados durante 10 anos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">05</span>
            Direitos do Titular
          </h2>
          <p>
            Nos termos do RGPD, tem o direito de solicitar a qualquer momento:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
                <h3 className="font-bold">Acesso e Retificação</h3>
                <p className="text-sm">Consultar os seus dados e corrigir informações imprecisas.</p>
             </div>
             <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
                <h3 className="font-bold">Esquecimento</h3>
                <p className="text-sm">Solicitar o apagamento dos dados (salvo imposições legais de arquivo clínico).</p>
             </div>
             <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
                <h3 className="font-bold">Portabilidade</h3>
                <p className="text-sm">Receber os dados num formato estruturado.</p>
             </div>
             <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
                <h3 className="font-bold">Oposição</h3>
                <p className="text-sm">Opor-se ao tratamento de dados para fins de marketing.</p>
             </div>
          </div>
          <p className="mt-4">
            Para exercer os seus direitos, contacte-nos através de <a href={`mailto:${email}`} className="text-clinic-purple font-bold">{email}</a>. Tem ainda o direito de apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD).
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
