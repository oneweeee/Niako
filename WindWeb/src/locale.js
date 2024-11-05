import { initReactI18next } from 'react-i18next';
import { storage } from './config';
import i18n from 'i18next';

i18n.use(initReactI18next).init({
    fallbackLng: storage.locale,
    lng: storage.locale,
    resources: {
        ru: { translations: require('./assets/locales/ru') },
        en: { translations: require('./assets/locales/en') }
    },
    ns: ['translations'],
    defaultNS: 'translations'
})

export default i18n