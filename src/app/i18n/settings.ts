export const defaultNS = 'common'

export function getOptions (lng: string, ns: string, languages: string[]) {
    return {
        debug: true,
        supportedLngs: languages,
        fallbackLng: 'en',
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns
    }
}