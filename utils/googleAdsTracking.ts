// Google Ads Conversion Tracking Utility
// This file handles all Google Ads event tracking throughout the website

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const ADS_ID = 'AW-434250599';

/**
 * Track a generic event with Google Ads
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      send_to: ADS_ID,
      ...eventData,
    });
  }
};

/**
 * Track phone call click
 */
export const trackPhoneClick = (phoneNumber?: string) => {
  trackEvent('call', {
    phone_number: phoneNumber,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track WhatsApp/Mobile contact
 */
export const trackWhatsAppClick = () => {
  trackEvent('whatsapp_click', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track appointment/scheduling click
 */
export const trackScheduleClick = (doctor?: string, service?: string) => {
  trackEvent('schedule_appointment', {
    doctor,
    service,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formType: string, data?: Record<string, any>) => {
  trackEvent('form_submit', {
    form_type: formType,
    ...data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track section view
 */
export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', {
    section: sectionName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track social media click
 */
export const trackSocialClick = (platform: 'facebook' | 'instagram' | 'youtube') => {
  trackEvent('social_click', {
    platform,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track page view for specific pages
 */
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page: pageName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track clinic location/maps click
 */
export const trackMapClick = () => {
  trackEvent('map_click', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track email click
 */
export const trackEmailClick = (email?: string) => {
  trackEvent('email_click', {
    email,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track service/procedure view
 */
export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', {
    service: serviceName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track doctor profile view
 */
export const trackDoctorView = (doctorName: string) => {
  trackEvent('doctor_view', {
    doctor: doctorName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track button click (generic CTA)
 */
export const trackCTAClick = (ctaName: string, ctaType?: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_type: ctaType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: 'top' | 'middle' | 'bottom') => {
  trackEvent('scroll_depth', {
    depth,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (pageName: string, timeInSeconds: number) => {
  trackEvent('time_on_page', {
    page: pageName,
    time_seconds: timeInSeconds,
    timestamp: new Date().toISOString(),
  });
};

export default {
  trackEvent,
  trackPhoneClick,
  trackWhatsAppClick,
  trackScheduleClick,
  trackFormSubmission,
  trackSectionView,
  trackSocialClick,
  trackPageView,
  trackMapClick,
  trackEmailClick,
  trackServiceView,
  trackDoctorView,
  trackCTAClick,
  trackScrollDepth,
  trackTimeOnPage,
};
