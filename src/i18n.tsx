import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {DEFAULT_LANGUAGE, LANGUAGES, NAMESPACES} from './app/Constants';
import {getLang} from './app/utils/getLang';
import translation from './locales/translation.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGES,
    ns: NAMESPACES.filter(e => e !== 'main'),
    defaultNS: 'translation',
    lowerCaseLng: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false,
    },
    lng: getLang(),
    compatibilityJSON: 'v3',
    resources: translation,
  } as any)
  .then(() => {})
  .catch(err => {
    console.error(err);
  });
