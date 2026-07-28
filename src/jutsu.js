import * as cheerio from "cheerio";

const BASE_URL = "https://jut-su.net";

const PAGES = Array.from(
    { length: 10 },
    (_, i) =>
        i === 0
            ? "/anime/"
            : `/anime/page/${i + 1}/`
);


export async function getNewEpisodes() {

    console.log("🔎 Проверяем Jut-su обновления");


    const links = new Set();


    for (const page of PAGES) {

        try {

            const html =
                await fetchPage(
                    BASE_URL + page
                );


            const $ =
                cheerio.load(html);


            $("a[href$='.html']").each(
                (_, el)=>{

                    const href =
                        $(el).attr("href");


                    if(
                        href &&
                        !href.includes("/page/")
                    ){

                        links.add(
                            normalizeUrl(href)
                        );

                    }

                }
            );


        } catch(e){

            console.log(
                "Ошибка страницы",
                page,
                e.message
            );

        }

    }


    console.log(
        "Найдено аниме:",
        links.size
    );


    const episodes = [];


    for(
        const url of [...links].slice(0,80)
    ){

        try {

            const anime =
                await parseAnime(url);


            if(anime){

                episodes.push(
                    anime
                );

            }


        } catch(e){

            console.log(
                "Ошибка:",
                url
            );

        }

    }


    console.log(
        "Найдено новых:",
        episodes.length
    );


    return episodes.slice(0,10);

}




async function parseAnime(url){


    const html =
        await fetchPage(url);


    const $ =
        cheerio.load(html);



    const title =
        $("h1")
        .first()
        .text()
        .trim();



    if(!title){

        return null;

    }



    const body =
        $("body")
        .text()
        .replace(/\s+/g," ")
        .trim();



    const episode =
        getLastEpisode(body);



    if(
        episode === null
    ){

        return null;

    }



    const updated =
    getUpdateDate(body);


/*
  Старые страницы не отправляем.
  Если дата не найдена,
  пропускаем.
*/

if(
    !updated
){

    return null;

}



    const image =
        $("img")
        .first()
        .attr("src");



    return {

        title,

        episode,

        voice:
            findVoice(body),

        image:
            normalizeImage(image),

        url,

        description:
            "🔥 Новая серия появилась на JUT-SU"

    };

}




function getLastEpisode(text){


    const matches =
        [
            ...text.matchAll(
                /(\d+)\s*(серия|эпизод)/gi
            )
        ];


    if(
        matches.length === 0
    ){

        return null;

    }


    return matches[
        matches.length - 1
    ][1];

}




function getUpdateDate(text){


    const date =
        text.match(
            /\d{2}\.\d{2}\.\d{4}/
        );


    if(
        date
    ){

        return date[0];

    }


    return null;

}




function findVoice(text){

    const voices = [

        "AniLibria",
        "AniDUB",
        "Jaskier",
        "StudioBand",
        "Dream Cast"

    ];


    for(
        const voice of voices
    ){

        if(
            text
            .toLowerCase()
            .includes(
                voice.toLowerCase()
            )
        ){

            return voice;

        }

    }


    return "Не указана";

}




async function fetchPage(url){


    const response =
        await fetch(
            url,
            {
                headers:{
                    "User-Agent":
                    "Mozilla/5.0 Kibato Anime"
                }
            }
        );


    if(
        !response.ok
    ){

        throw new Error(
            response.status
        );

    }


    return response.text();

}




function normalizeUrl(url){

    if(
        url.startsWith("http")
    ){

        return url;

    }


    return BASE_URL + url;

}




function normalizeImage(img){

    if(!img){

        return null;

    }


    if(
        img.startsWith("http")
    ){

        return img;

    }


    return BASE_URL + img;

}
