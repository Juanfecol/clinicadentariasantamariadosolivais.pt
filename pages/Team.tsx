import React from 'react';
import { useContent } from '../context/ContentContext';
import { trackDoctorView, trackCTAClick } from '../utils/googleAdsTracking';
import { usePageTracker } from '../hooks/usePageTracker';

interface Member {
  name: string;
  title: string;
  img: string;
  bio: string;
  imgPosition?: string; // Optional property for custom image positioning
}

const MemberCard: React.FC<{ member: Member }> = ({ member }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300 h-full">
    <img 
      src={member.img || "https://via.placeholder.com/150"} 
      alt={member.name} 
      className={`w-[180px] h-[180px] rounded-full object-cover ${member.imgPosition || 'object-top'} border-4 border-clinic-lime mb-4 shadow-md`} 
    />
    <h3 className="text-xl font-bold text-clinic-blue mb-1">{member.name}</h3>
    <p className="text-clinic-purple font-medium mb-3">{member.title}</p>
    <p className="text-sm text-gray-700 leading-relaxed">{member.bio}</p>
  </div>
);

const Team: React.FC = () => {
  const { content } = useContent();
    
  // Track page view
  usePageTracker('equipo');
  const medicalTeam: Member[] = content.team?.medical || [];
  const assistantTeam: Member[] = content.team?.assistants || [];
  const receptionTeam: Member[] = content.team?.reception || [];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif italic text-clinic-blue border-2 border-clinic-lime inline-block px-8 py-3 rounded-full mb-6">A Nossa Equipa</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Conheça os nossos dentistas altamente qualificados, rececionista e assistentes dentárias, todos dedicados a proporcionar cuidados dentários excecionais com paixão, profissionalismo e um toque de carinho.
        </p>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-serif italic text-center text-clinic-blue mb-10 border-2 border-clinic-lime inline-block px-6 py-2 rounded-full mx-auto block w-fit">Equipa Médica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicalTeam.map((member, idx) => <MemberCard key={idx} member={member} />)}
        </div>
      </div>

      {assistantTeam.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-serif italic text-center text-clinic-blue mb-10 border-2 border-clinic-lime inline-block px-6 py-2 rounded-full mx-auto block w-fit">Assistentes Dentárias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {assistantTeam.map((member, idx) => <MemberCard key={idx} member={member} />)}
          </div>
        </div>
      )}

      {receptionTeam.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-serif italic text-center text-clinic-blue mb-10 border-2 border-clinic-lime inline-block px-6 py-2 rounded-full mx-auto block w-fit">Receção</h2>
          <div className="flex justify-center flex-wrap gap-8">
             {receptionTeam.map((member, idx) => (
                <div key={idx} className="w-full max-w-sm">
                   <MemberCard member={member} />
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
