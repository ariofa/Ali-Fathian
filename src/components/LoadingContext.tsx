import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';

interface LoadingContextType {
  isLoading: boolean;
  loadingTextFa: string;
  loadingTextEn: string;
  showLoading: (textFa?: string, textEn?: string) => void;
  hideLoading: () => void;
  triggerTransition: (action: () => void, textFa?: string, textEn?: string, duration?: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRtl } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [textFa, setTextFa] = useState('در حال بارگذاری...');
  const [textEn, setTextEn] = useState('Loading...');

  const showLoading = (customTextFa?: string, customTextEn?: string) => {
    setTextFa(customTextFa || 'در حال بارگذاری...');
    setTextEn(customTextEn || 'Loading...');
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const triggerTransition = (
    action: () => void,
    customTextFa?: string,
    customTextEn?: string,
    duration: number = 600
  ) => {
    showLoading(customTextFa, customTextEn);
    // Execute action immediately or slightly after
    setTimeout(() => {
      action();
    }, 150);

    // Keep the loading indicator visible for transition effect
    setTimeout(() => {
      hideLoading();
    }, duration);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingTextFa: textFa,
        loadingTextEn: textEn,
        showLoading,
        hideLoading,
        triggerTransition,
      }}
    >
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md select-none"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Spinning BIM Ring Container */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              {/* Outer Glow Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute w-20 h-20 border-3 border-transparent border-t-[#26B6B6] border-r-[#26B6B6]/40 rounded-full shadow-[0_0_15px_rgba(38,182,182,0.3)]"
              />
              
              {/* Inner Counter-rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute w-14 h-14 border-2 border-transparent border-b-[#464E56] dark:border-b-[#a0aec0] border-l-[#26B6B6]/50 rounded-full"
              />

              {/* Central Glowing Core (Representing a BIM node/object) */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-6 h-6 bg-[#26B6B6] rounded-full shadow-[0_0_12px_#26B6B6]"
              />
            </div>

            {/* Loading text with layout animation */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center px-6 max-w-sm"
            >
              <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 mb-1.5 tracking-tight">
                {isRtl ? textFa : textEn}
              </h3>
              <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 tracking-widest uppercase">
                {isRtl ? 'ایران‌بیم‌هاب • IRANBIMHUB' : 'IRANBIMHUB • PLATFORM'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
