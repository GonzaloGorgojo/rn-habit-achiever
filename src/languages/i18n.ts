import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import espanol from '@src/languages/espanol.json';
import english from '@src/languages/english.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      es: espanol,
      en: english,
    },
    lng: 'es',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  })
  .catch((e) => console.log(e));

export default i18n;
