import { useEffect } from 'react';
import { trackPageView, trackSectionView, trackTimeOnPage } from '../utils/googleAdsTracking';

/**
 * Hook personalizado para rastrear vistas de página automáticamente
 * @param pageName - Nombre de la página para rastreo
 * @param sections - Array de secciones (opcional) para rastrear vistas de secciones
 */
export const usePageTracker = (pageName: string, sections?: string[]) => {
  useEffect(() => {
    // Rastrear vista de página
    trackPageView(pageName);

    // Rastrear cada sección proporcionada
    if (sections && sections.length > 0) {
      sections.forEach((section) => {
        trackSectionView(section);
      });
    }

    // Rastrear tiempo en página
    const startTime = Date.now();
    return () => {
      const timeInSeconds = Math.round((Date.now() - startTime) / 1000);
      if (timeInSeconds > 3) {
        // Solo rastrear si pasó más de 3 segundos en la página
        trackTimeOnPage(pageName, timeInSeconds);
      }
    };
  }, [pageName, sections]);
};

/**
 * Hook para rastrear elementos con scroll
 * @param elementId - ID del elemento HTML a monitorear
 * @param sectionName - Nombre de la sección para rastreo
 */
export const useSectionVisibility = (elementId: string, sectionName: string) => {
  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView(sectionName);
          // Opcional: dejar de observar después del primer rastreo
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementId, sectionName]);
};

export default usePageTracker;
