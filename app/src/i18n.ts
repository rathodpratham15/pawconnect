import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; // React binding for i18next
import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(initReactI18next) // Initialize the react binding
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
