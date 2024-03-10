import { createI18n } from 'vue-i18n'

    const localeEN = require('./en.json');
    const localeFR = require('./fr.json');

    const i18n = createI18n({
        locale: navigator.language,
        fallbackLocale: 'en',
        messages: {
            en: localeEN,
            'en-US': localeEN,
            fr: localeFR
        }
    });

    export default i18n;