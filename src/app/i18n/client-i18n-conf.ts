import i18next from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

export const projectToken = "your project token";
export const cdnBaseUrl = "https://cdn.simplelocalize.io";
export const environment = "_latest"; // or "_production"

export const loadPathBase = `${cdnBaseUrl}/${projectToken}/${environment}`;

const languages = ['en', 'fr', 'de', 'ru']


const translationToResource = async (language: string, ns: string) => {
    console.log("querying the language ", language, " on namespace ", ns);
    const resp = await fetch(`${loadPathBase}/${language}/${ns}`);
    const json =  await resp.json()
    return json;
}

i18next
    .use(initReactI18next)
    .use(resourcesToBackend(translationToResource))
    .init({
        debug: true,
        supportedLngs: languages,
        fallbackLng: 'en',
        detection: {
            order: ['querystring', 'cookie'],
            lookupQuerystring: 'hl',
            lookupCookie: 'language',
            caches: ['cookie']
        },
    })

export function useTranslationClient(lng: string, ns: string)  {
    return useTranslation(ns, {lng});
}