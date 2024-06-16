export const fallbackLng = 'en'
export const languages = [fallbackLng, 'de', 'fr', 'ru']
export const defaultNS = 'common'
export const cookieName = 'i18next'



export function getOptions (lng = fallbackLng, ns: string = defaultNS) {
    return {
        debug: true,
        supportedLngs: languages,
        fallbackLng,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns
    }
}