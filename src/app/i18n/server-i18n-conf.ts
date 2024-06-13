import {createInstance, i18n, TFunction} from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import {getOptions} from './settings'
import LanguageDef from "@/app/i18n/language-def";
import LanguageDetector from "i18next-browser-languagedetector";


export const projectToken = "YOUR simplelocalize.io PROJECT TOKEN";
export const apiKey = "YOUR simplelocalize.io API KEY";
export const cdnBaseUrl = "https://cdn.simplelocalize.io";
export const environment = "_latest"; // or "_production"

export const loadPathBase = `${cdnBaseUrl}/${projectToken}/${environment}`;
export const loadPathLng = `${loadPathBase}/{{lng}}`;


const runsOnServerSide = typeof window === 'undefined'

if (!runsOnServerSide) {
    throw new Error("this config is intended on server side only")
}

const translationToResource = async (language: string, ns: string) => {
    console.log("querying the language ", language, " on namespace ", ns);
    const resp = await fetch(`${loadPathBase}/${language}/${ns}`);
    const json =  await resp.json()
    return json;
}

export const allLanguages = async (): Promise<LanguageDef[]> => {
    console.log("getting all languages ");
    const resp = await fetch(`${loadPathBase}/_languages`);
    if (!resp.ok) {
        throw new Error("can't load languages: " + resp.status + ", " + (await resp.text()));
    }
    const json =  (await resp.json()).map((l: LanguageDef) => {
        if (!l.icon) {
            l.icon = l.key;
        }
        if (l.key == 'en') {
            l.icon = 'gb';
        }
        return l;
    })
    console.log("found languages: ", json)
    return json;
}

const initI18next = async (lng: string, ns?: string): Promise<i18n> => {
    const i18nInstance = createInstance()
    await i18nInstance
        .use(LanguageDetector)
        .use(resourcesToBackend(translationToResource))
        .init(getOptions(lng, ns))
    return i18nInstance
}

export async function useTranslation(lng: string, ns?: string, options: {keyPrefix?: string} = {}): Promise<{t: TFunction<any, string>, i18n: i18n}> {
    const i18nextInstance = await initI18next(lng, ns)
    return {
        t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
        i18n: i18nextInstance
    }
}