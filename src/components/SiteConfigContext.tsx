import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteConfig {
  landingPageOrder: string[];
  manufacturerHeroVideoUrl?: string;
  heroBanners: {
    id: string;
    labelFa: string;
    labelEn: string;
    numFa: string;
    numEn: string;
    badgeFa: string;
    badgeEn: string;
    headingFa: string;
    headingEn: string;
    descFa: string;
    descEn: string;
    bgImage: string;
    overlay: string;
  }[];
  footer: {
    phone: string;
    email: string;
    addressFa: string;
    addressEn: string;
    instagram: string;
    linkedin: string;
    telegram: string;
    website: string;
  };
  faq: {
    qFa: string;
    qEn: string;
    aFa: string;
    aEn: string;
  }[];
}

interface SiteConfigContextType {
  siteConfig: SiteConfig | null;
  loading: boolean;
  updateSiteConfig: (newConfig: SiteConfig) => Promise<boolean>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Load configuration from API at startup
  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        setSiteConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load site config:', err);
        setLoading(false);
      });
  }, []);

  const updateSiteConfig = async (newConfig: SiteConfig): Promise<boolean> => {
    try {
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
      const data = await res.json();
      if (data.success) {
        setSiteConfig(newConfig);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save site config:', err);
      return false;
    }
  };

  return (
    <SiteConfigContext.Provider value={{ siteConfig, loading, updateSiteConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
