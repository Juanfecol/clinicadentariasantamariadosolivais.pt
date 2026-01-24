import React from 'react';
import { useContent } from '../context/ContentContext';

// CONTROL POINT: ACTUALIZACION POLITICAS
const CookiesPolicy: React.FC = () => {
  const { content } = useContent();
  const email = content.global?.email || "clinicasmod@gmail.com";

  return (
    <div className="animate-fade-in-up max-w-[1000px] mx-auto px-6 py-12 text-clinic-blue">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif italic border-2 border-clinic-lime inline-block px-8 py-3 rounded-full mb-6">Política de Cookies</h1>
        <p className="text-gray-600">Em conformidade com a Lei n.º 41/2004 e o RGPD.</p>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-xl border border-white space-y-8 leading-relaxed text-justify">
        
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">01</span>
            O que são Cookies?
          </h2>
          <p>
            Os cookies são pequenos ficheiros de texto que um website, ao ser visitado pelo utilizador, coloca no seu computador ou no seu dispositivo móvel através do navegador de internet (browser). A colocação de cookies ajudará o website a reconhecer o seu dispositivo na próxima vez que o visitar.
          </p>
          <p className="mt-2">
            Utilizamos o termo "cookies" nesta política para referir todos os ficheiros que recolhem informações desta forma. Alguns cookies são essenciais para garantir as funcionalidades disponibilizadas, enquanto outros são destinados a melhorar o desempenho e a experiência do utilizador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">02</span>
            Categorias de Cookies Utilizados
          </h2>
          <div className="grid gap-4">
            <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
              <h3 className="font-bold mb-2">Cookies Estritamente Necessários</h3>
              <p className="text-sm">Permitem a navegação no website e a utilização das suas aplicações, bem como aceder a áreas seguras do website. Sem estes cookies, os serviços que tenha requerido não podem ser prestados.</p>
            </div>
            <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
              <h3 className="font-bold mb-2">Cookies Analíticos</h3>
              <p className="text-sm">São utilizados anonimamente para efeitos de criação e análise de estatísticas, no sentido de melhorar o funcionamento do website (ex: Google Analytics).</p>
            </div>
            <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
              <h3 className="font-bold mb-2">Cookies de Funcionalidade</h3>
              <p className="text-sm">Guardam as preferências do utilizador relativamente à utilização do site, para que não seja necessário voltar a configurar o site cada vez que o visita.</p>
            </div>
             <div className="p-4 bg-white/40 rounded-xl border border-clinic-blue/10">
              <h3 className="font-bold mb-2">Cookies de Publicidade (Marketing)</h3>
              <p className="text-sm">Direcionam a publicidade em função dos interesses de cada utilizador, limitando a quantidade de vezes que vê o anúncio, ajudando a medir a eficácia da publicidade e o sucesso da organização do website (ex: Meta Pixel, Google Ads).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">03</span>
            Gestão dos Cookies
          </h2>
          <p>
            Todos os browsers permitem ao utilizador aceitar, recusar ou apagar cookies, nomeadamente através da seleção das definições apropriadas no respetivo navegador. Pode configurar os cookies no menu "opções" ou "preferências" do seu browser.
          </p>
          <p className="mt-4">
            No entanto, ao desativar cookies, pode impedir que alguns serviços da web funcionem corretamente, afetando, parcial ou totalmente, a navegação no website.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-gray-700">
            <li><strong>Microsoft Edge:</strong> Definições e mais &gt; Definições &gt; Permissões do site &gt; Cookies e dados do site.</li>
            <li><strong>Google Chrome:</strong> Definições &gt; Privacidade e segurança &gt; Cookies e outros dados do site.</li>
            <li><strong>Mozilla Firefox:</strong> Opções &gt; Privacidade e Segurança &gt; Cookies e dados de sites.</li>
            <li><strong>Apple Safari:</strong> Preferências &gt; Privacidade.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-clinic-lime flex items-center justify-center text-sm">04</span>
            Legislação Aplicável
          </h2>
          <p>
            O tratamento de dados pessoais realizado através de cookies baseia-se no seu consentimento (exceto para cookies estritamente necessários), nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD) e da Lei da Privacidade nas Comunicações Eletrónicas (Lei n.º 41/2004, de 18 de agosto, alterada pela Lei n.º 46/2012, de 29 de agosto).
          </p>
          <p className="mt-4">
             Para qualquer questão relacionada com a nossa política de cookies, por favor contacte-nos através do e-mail: <a href={`mailto:${email}`} className="text-clinic-purple hover:underline font-bold">{email}</a>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default CookiesPolicy;
