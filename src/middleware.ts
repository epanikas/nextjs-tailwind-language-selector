import {NextRequest, NextResponse} from "next/server";

const languages = ['en', 'fr', 'de', 'ru']

export async function middleware(request: NextRequest) {

    console.log("received host ", request.nextUrl.host)
    console.log("received pathname ", request.nextUrl.pathname)
    console.log("received cookies ", request.cookies)

    if (request.nextUrl.pathname.startsWith("/api")) {
        /*
         * don't redirect for api calls
         */
        return NextResponse.next();
    }

    const existingLang = request.nextUrl.pathname.substring(1, 3);
    console.log("existingLang ", existingLang);

    const hasLang = languages.find(l => l == existingLang)

    let newLang = 'en';
    const langCookie = request.cookies.get("language");
    if (langCookie) {
        newLang = langCookie.value;
    }

    if (existingLang == newLang) {
        return NextResponse.next();
    }

    const path: string = hasLang ? request.nextUrl.pathname.substring(3) : request.nextUrl.pathname;

    return NextResponse.redirect(`${request.nextUrl.origin}/${newLang}/${path}`);
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