import * as cheerio from "cheerio";

const BASE_URL = "https://jut-su.net";

const PAGES = [
    "/anime/",
    "/anime/page/2/",
    "/anime/page/3/"
];


export async function getNewEpisodes() {

    console.log("🔎 Проверяем Jut-su обновления");


    const animeLinks = new Set();


    for (const page of PAGES) {

        try {

            const html = await fetchPage(
                BASE_URL + page
            );

            const $ = cheerio.load(html);


            $("a[href$='.html']").each(
                (_, el)=>{

                    const href =
                        $(el).attr("href");


                    if (
                        href &&
                        !href.includes("/page/")
                    ){

                        animeLinks.add(
                            normalizeUrl(href)
                        );

                    }

                }
            );


        } catch(error){

            console.log(
                "Ошибка страницы:",
                page,
                error.message
            );

        }

    }


    console.log(
        "Найдено аниме:",
        animeLinks.size
    );


    const result = [];


    for (
        const url of [...animeLinks].slice(0,30)
    ){

        try {


            const episode =
                await parseAnime(url);


            if(episode){

                result.push(
                    episode
                );

            }


        }catch(error){

            console.log(
                "Ошибка аниме:",
                url
            );

        }

    }


    console.log(
        "Найдено серий:",
        result.length
    );


    return result;

}




async function parseAnime(url){


    const html =
        await fetchPage(url);


    const $ =
        cheerio.load(html);



    let title =
        $("h1")
        .first()
        .text()
        .trim();



    if(!title){

        return null;

    }



    const text =
        $("body")
        .text()
        .replace(/\s+/g," ")
        .trim();



    const episode =
        findEpisode(text);



    if(
        episode === "?"
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
            findVoice(text),


        image:
            normalizeImage(image),


        url,


        description:
            "Новая серия доступна на JUT-SU"

    };


}




function findEpisode(text){


    const matches =
        [
            ...text.matchAll(
                /(\d+)\s*(серия|эпизод)/gi
            )
        ];


    if(
        matches.length === 0
    ){

        return "?";

    }


    return matches[
        matches.length - 1
    ][1];

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
                    "Mozilla/5.0 Kibato Anime Bot"
                }
            }
        );


    if(!response.ok){

        throw new Error(
            response.status
        );

    }


    return await response.text();

}





function normalizeUrl(url){


    if(
        url.startsWith("http")
    ){

        return url;

    }


    return (
        BASE_URL +
        url
    );

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


    return (
        BASE_URL +
        img
    );

}
