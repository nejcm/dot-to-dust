import i18next from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import en from '@/translations/en.json';

export type TranslationResource = typeof en;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationResource;
    };
  }
}

// v1 is English-only. lng is forced to 'en' (not the device locale) because
// i18next-icu derives plural rules from the active language — running with
// lng='fr' or 'ru' against English-only resources would pluralize English
// strings using foreign rules (e.g. "0 week ahead" in French, "21 week ahead"
// in Russian). Remove the hard-coding when additional locales ship.
i18next
  .use(ICU)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    lng: 'en',
    react: { useSuspense: false },
    resources: {
      en: { translation: en },
    },
  });

export default i18next;
