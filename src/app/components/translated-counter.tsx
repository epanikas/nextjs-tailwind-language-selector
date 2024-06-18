"use client"

import {useState} from "react";
import {useTranslationClient} from "@/app/i18n/client-i18n-conf";

export default function TranslatedCounter({lng, languages}: { lng: string, languages: string[] }): JSX.Element {

    const { t, i18n} = useTranslationClient(lng, 'common', languages);

    const [counter, setCounter] = useState(0);

    return (
        <div className={"flex flex-col z-40 m-5"}>

            <div>title {t("TITLE")}</div>
            <h3 className={"p-4"}>{t("counter_value")} {counter} {t("items")}</h3>

            <div className={"grid grid-cols-3 gap-2 z-40"}>
                <button
                    className={"p-4 text-center text-black inline-flex rounded-md bg-white border border-red-900 text-xl"}
                    onClick={() => setCounter(counter + 1)}>
                    +
                </button>

                <span className={"text-red-900 text-center"}>{counter}</span>

                <button className={"p-4 text-black inline-flex rounded-md bg-white border border-red-900 text-xl"}
                        onClick={() => setCounter(counter - 1)}>
                    -
                </button>
            </div>
        </div>
    )

}