import * as Localization from 'expo-localization';
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

const locale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18next
  .use(ICU)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    lng: locale,
    react: { useSuspense: false },
    resources: {
      en: { translation: en },
    },
  });

export default i18next;
