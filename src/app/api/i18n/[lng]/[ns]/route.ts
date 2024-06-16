import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, { params }: { params: { lng: string, ns: string } }): Promise<NextResponse> {


    const projectToken = process.env.SIMPLELOCALIZE_PROJECT_TOKEN;
    const cdnBaseUrl = "https://cdn.simplelocalize.io";
    const environment = "_latest"; // or "_production"
    const loadPathBase = `${cdnBaseUrl}/${projectToken}/${environment}`;

    const { lng, ns } = params;

    console.log("querying the language ", lng, " on namespace ", ns, `${loadPathBase}/${lng}/${ns}`);
    const resp = await fetch(`${loadPathBase}/${lng}/${ns}`);

    if (resp.status == 404) {
        return NextResponse.json("[]", {
            status: 200
        })
    }

    const json =  await resp.json()

    return NextResponse.json(json, {
        status: 200
    })


}
