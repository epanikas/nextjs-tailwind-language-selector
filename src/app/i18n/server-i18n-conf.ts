import {createInstance, i18n, Resource, TFunction} from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import {getOptions} from './settings'
import LanguageDef from "@/app/i18n/language-def";
import {ResourceLanguage} from "i18next/typescript/options";


export const projectToken = process.env.SIMPLELOCALIZE_PROJECT_TOKEN;
export const apiKey = process.env.SIMPLELOCALIZE_API_KEY_;
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
    return await resp.json()
}

export const allLanguages = async (): Promise<LanguageDef[]> => {
    const resp = await fetch(`${loadPathBase}/_languages`);
    console.log("fetching languages :", `${loadPathBase}/_languages`)
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

async function getTranslation(lng: string, ns: string): Promise<ResourceLanguage> {
    const resp = await fetch(`${loadPathBase}/${lng}/${ns}`)
    const res = {} as ResourceLanguage;
    res[ns] = await resp.json();
    return res;
}

export async function getTranslationResources(): Promise<Resource> {

    const languages: LanguageDef[] = await allLanguages();

    const res = {} as Resource;

    for (const l of languages) {
        res[l.key] = await getTranslation(l.key, 'common')
    }

    console.log("translations", res);

    return res;
}

const initI18next = async (lng: string, ns: string): Promise<i18n> => {
    const i18nInstance = createInstance()
    await i18nInstance
        .use(resourcesToBackend(translationToResource))
        .init(getOptions(lng, ns, (await allLanguages()).map(l => l.key)))
    return i18nInstance
}

export async function useTranslationServer(lng: string, ns: string): Promise<{t: TFunction<any, string>, i18n: i18n}> {
    const i18nextInstance = await initI18next(lng, ns)
    return {
        t: i18nextInstance.t,
        i18n: i18nextInstance
    }
}