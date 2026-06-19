'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import { isClient } from '@/lib/client-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type GoogleTranslationConfig = {
  sourceLanguage: string;
  defaultLanguage: string;
  languages: { name: string; title: string }[];
};

declare global {
  interface Window {
    __GOOGLE_TRANSLATION_CONFIG__?: GoogleTranslationConfig;
  }
}

const COOKIE_NAME = 'googtrans';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const fallbackLanguages = [
  { name: 'de', title: 'Deutsch' },
  { name: 'en', title: 'English' },
];

const LanguageSwitcherComponent = () => {
  const [currentLang, setCurrentLang] = useState('de');
  const [config, setConfig] = useState<GoogleTranslationConfig | null>(null);

  useEffect(() => {
    if (!isClient) return;

    // Function to handle configuration
    const handleConfig = () => {
      const translationConfig = window.__GOOGLE_TRANSLATION_CONFIG__;
      if (!translationConfig) return;

      setConfig(translationConfig);
      const cookie = parseCookies()[COOKIE_NAME];
      const lang = cookie?.split('/')?.[2] || translationConfig.defaultLanguage;
      setCurrentLang(lang);
    };

    // Check if config already exists
    if (window.__GOOGLE_TRANSLATION_CONFIG__) {
      handleConfig();
    }

    // Listen for config ready event
    window.addEventListener('translationConfigReady', handleConfig);
    
    return () => {
      window.removeEventListener('translationConfigReady', handleConfig);
    };
  }, []);

  const switchLang = (lang: string) => {
    const sourceLanguage = config?.sourceLanguage ?? 'en';

    setCookie(undefined, COOKIE_NAME, `/${sourceLanguage}/${lang}`, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    if (isClient) {
      document.documentElement.lang = lang;
      window.location.reload();
    }
  };

  const languages = config?.languages ?? fallbackLanguages;

  return (
    <div className="notranslate inline-flex" translate="no">
      <Select value={currentLang} onValueChange={switchLang}>
        <SelectTrigger className="h-10 w-fit min-w-28 cursor-pointer rounded-xl border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 md:min-w-32">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent
          sideOffset={12}
          className="min-w-32 rounded-lg border-slate-200 bg-white text-slate-700 shadow-md ring-1 ring-slate-900/10"
        >
          {languages.map((language) => (
            <SelectItem
              key={language.name}
              value={language.name}
              className="cursor-pointer rounded-md py-1 pl-1.5 pr-8 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:text-slate-700 focus:bg-primary/15 focus:text-slate-700"
            >
              {language.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const LanguageSwitcher = dynamic(() => Promise.resolve(LanguageSwitcherComponent), { 
  ssr: false 
});

export default LanguageSwitcher;
