import React, { createContext, useContext, useState, useEffect } from 'react';

// --- INITIAL DEFAULT DATA (Expanded for full control) ---
const defaultData = {
  global: {
    email: "clinicasmod@gmail.com",
    phone: "211350066",
    mobile: "+351 919 861 310",
    address: "Estrada de Moscavide N 32C, 1800-279, Lisboa",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Estrada+de+Moscavide+N+32C,+1800-279,+Lisboa",
    socials: {
      instagram: "https://www.instagram.com/clinicasantamariaolivais/",
      facebook: "https://www.facebook.com/clinicasmod/",
      whatsapp: "https://wa.me/351919861310"
    }
  },
  navigation: [
    { label: "Início", path: "/" },
    { label: "Equipa", path: "/equipa" },
    { label: "Clínica", path: "/clinica" },
    { label: "Contactos", path: "/contactos" },
    { label: "Marcações", path: "/marcacoes" },
    { label: "Campanhas", path: "/campanhas" }
  ],
  home: {
    heroTitle: "Clínica Santa Maria dos Olivais",
    heroSubtitle: "Não tratamos apenas dentes — cultivamos confiança, autoestima e bem-estar. Oferecemos conforto e a liberdade de sorrir sem reservas. Porque cada sorriso conta uma história — e a sua merece ser contada com brilho.",
  },
  stories: [
    {
      id: 5,
      type: 'video',
      title: 'Implantes',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768688473/IMPLANTES_LISTO_1_xecafc.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    },
    {
      id: 1,
      type: 'video',
      title: 'Generalista',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768690614/GENERALISTA_lsfxvn.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    },
    {
      id: 2,
      type: 'video',
      title: 'Sorrisos',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768687687/2026_fxdiy1.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    },
    {
      id: 3,
      type: 'video',
      title: 'Sorriso Sem Escalas',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768689757/AD07_1_bnr9fg.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    },
    {
      id: 4,
      type: 'video',
      title: 'Estética',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768688469/MARIANAINVITACION03_co7kvb.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    },
    {
      id: 6,
      type: 'video',
      title: 'Avaliação',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768693224/ALEXINVITACION2_a1nbuo.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    },
    {
      id: 7,
      type: 'video',
      title: 'Escalas',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768688477/SORRISOSEMESCALASvs2_sv97vj.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    },
    {
      id: 8,
      type: 'video',
      title: 'Prevenção',
      src: 'https://res.cloudinary.com/dgvavcxlz/video/upload/f_auto:video,q_auto/v1768696692/DJI_20250902154919_0145_D_cuaup7.mp4',
      thumbnail: 'https://res.cloudinary.com/dgvavcxlz/image/upload/v1768690936/508747630_18362956543176973_7863955725928205386_n_1_gkhbk1.jpg'
    }
  ],
  team: {
    medical: [
      {
        name: "Dra. Ana Mata",
        title: "Implantologia e Direção Clínica",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/Clinica-Santa-Maria-Olivais-100-scaled.jpg",
        bio: "Especialista em implantologia dentária, com formação avançada em implantes e reabilitação oral."
      },
      {
        name: "Dr. Tomás Machado",
        title: "Dentisteria",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-7A390FD7-42CA-4F33-A5B7-800ABBBCDF8B.jpeg",
        bio: "Mestre em Medicina Dentária pela Universidade Egas Moniz, com Pós-Graduação em Endodontia."
      },
      {
        name: "Dra. Alexandra Telo",
        title: "Periodontologia",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-882A385B-218D-47B8-AA16-EB091B83A480.jpeg",
        bio: "Com quase 10 anos na clínica, formou-se em Medicina Dentária na FMDUL (2017).",
        imgPosition: "object-[75%_25%]"
      },
      {
        name: "Dra. Mariana Alberto",
        title: "Ortodontia",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/Clinica-Santa-Maria-Olivais-136-scaled.jpg",
        bio: "Especialista em Ortodontia, com formação em Ortodontia Clínica e Alinhadores Spark."
      },
      {
        name: "Dra. Orizandy Claret",
        title: "Odontopediatria",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/Clinica-Santa-Maria-Olivais-48-scaled.jpg",
        bio: "Especialista em odontopediatria, com formação em cuidados dentários para crianças."
      }
    ],
    assistants: [
      {
        name: "Karina Palmeira",
        title: "Assistente de Implantologia",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/Clinica-Santa-Maria-Olivais-126-scaled.jpg",
        bio: "Assistente dedicada, com formação em assistência dentária."
      },
      {
        name: "Andiara Ribeiro",
        title: "Assistente Geral",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/Clinica-Santa-Maria-Olivais-84-scaled.jpg",
        bio: "Com grande atenção ao detalhe, auxilia os dentistas em todos os procedimentos."
      },
      {
        name: "Mila Lageira",
        title: "Esterilização",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/Clinica-Santa-Maria-Olivais-88-scaled.jpg",
        bio: "Especialista em esterilização, contribui para a eficiência dos tratamentos."
      }
    ],
    reception: [
       {
        name: "Carla Claro",
        title: "Rececionista",
        img: "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/07/Clinica-Santa-Maria-Olivais-94-scaled.jpg",
        bio: "Responsável por acolher os pacientes com simpatia e eficiência."
      }
    ]
  },
  clinic: {
    gallery: [
      "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-ED6902D9-49FF-45AD-8791-0E8562B72DC5.jpeg",
      "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-4F79FCF4-E755-4E07-A623-F71696A930EB.jpeg",
      "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-D089534F-903E-476C-BB13-26CAB404F1F3.jpeg",
      "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-EAA32118-B8DB-4848-ABC0-210B0ACBFDC2.jpeg",
      "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-02681D85-34D8-48E6-BE2D-7E8D2827571E.jpeg",
      "https://clinicasantamariadosolivais.pt/wp-content/uploads/2025/06/original-BA8B4A41-1D6A-44A9-AD46-A79BBAE94C63.jpeg"
    ]
  },
  campaigns: [
    { src: "https://res.cloudinary.com/dgvavcxlz/image/upload/v1768688412/POST-01_gzupdo.jpg", title: "Campanha 1" },
    { src: "https://res.cloudinary.com/dgvavcxlz/image/upload/v1768688410/POST-03_slqhla.jpg", title: "Campanha 2" },
    { src: "https://res.cloudinary.com/dgvavcxlz/image/upload/v1768688428/carrusel_3-01_tkdxsi.jpg", title: "Campanha 3" }
  ],
  appointments: {
    heroImage: "https://res.cloudinary.com/dgvavcxlz/image/upload/v1768688431/Carrusel_1-06_xvexhy.png",
    services: [
      "Implantologia",
      "Ortodontia, Alinhadores Invisíveis",
      "Limpeza e Destartarização",
      "Consulta de Rotina",
      "Odontopediatria",
      "Branqueamento",
      "Urgências",
      "Avaliação",
      "Outros"
    ]
  }
};

const ContentContext = createContext<any>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('site_content_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Simple structural check - if parsed doesn't have 'global', it's likely old/corrupt
        if (parsed && parsed.global) {
           return parsed;
        }
      }
    } catch (e) {
      console.error("Content load failed, reverting to default", e);
    }
    return defaultData;
  });

  const updateContent = (newContent: any) => {
    setContent(newContent);
    localStorage.setItem('site_content_v2', JSON.stringify(newContent));
  };

  const resetContent = () => {
    setContent(defaultData);
    localStorage.setItem('site_content_v2', JSON.stringify(defaultData));
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);