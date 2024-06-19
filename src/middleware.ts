import {NextRequest, NextResponse} from "next/server";
import {allLanguages} from "@/app/i18n/server-i18n-conf";

export async function middleware(request: NextRequest) {

    console.log("received host ", request.nextUrl.host)
    console.log("received pathname ", request.nextUrl.pathname)
    console.log("received cookies ", request.cookies)

    const languages = await allLanguages();

    if (request.nextUrl.pathname.startsWith("/api")) {
        /*
         * don't redirect for api calls
         */
        return NextResponse.next();
    }

    const langsPattern = languages.map(l => l.key).join("|");
    console.log("middleware langsPattern", langsPattern, request.nextUrl.pathname)
    const regex = new RegExp(`\/(${langsPattern})(.*)`);

    const chunkedUrl = regex.exec(request.nextUrl.pathname);

    let resp: NextResponse;
    let lang: string;
    if (chunkedUrl) {
        resp = NextResponse.next();
        lang = chunkedUrl[1]
    } else {
        const langCookie = request.cookies.get("language");
        lang = langCookie ? langCookie.value : 'en';
        const destination = `${request.nextUrl.origin}/${lang}${request.nextUrl.pathname}`;
        console.log("rewriting to ", destination);
        resp = NextResponse.rewrite(destination);
    }
    console.log("setting language cookie", lang, "domain", request.nextUrl.hostname);
    resp.cookies.set("language", lang, {path: "/", domain: request.nextUrl.hostname});
    return resp;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}