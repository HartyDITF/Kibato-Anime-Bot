import * as cheerio from "cheerio";

const BASE = "https://jut-su.net";
const ONGOING_URL = "https://jut-su.net/ongoing/";

export async function getNewEpisodes() {

    console.log("🔎 Проверяем Jut-su онгоинги");

    const html = await fetchPage(ONGOING_URL);

    const $ = cheerio.load(html);

    const anime = [];


    $("a[href$='.html']").each((_, el)=>{

        const link = $(el).attr("href");
        const title = $(el).text().trim();


        if(
            !link ||
            !title ||
            title.length < 2
        ){
            return;
        }


        const url =
            link.startsWith("http")
            ? link
            : BASE + link;


        if(
            !anime.find(x=>x.url===url)
        ){

            anime.push({
                title,
                url
            });

        }

    });


    console.log(
        "Найдено онгоингов:",
        anime.length
    );


    const episodes = [];


    for(
        const item of anime.slice(0,50)
    ){

        try {

            const episode =
                await parseAnime(item);


            if(episode){

                episodes.push(episode);

            }


        } catch(e){

            console.log(
                "Ошибка:",
                item.title
            );

        }

    }


    console.log(
        "Найдено серий:",
        episodes.length
    );


    return episodes;

}



async function parseAnime(item){


    const html =
        await fetchPage(item.url);


    const $ =
        cheerio.load(html);



    const text =
        $("body")
        .text()
        .replace(/\s+/g," ")
        .trim();


    
console.log(
    "СТРАНИЦА:",
    item.title
);

console.log(
    text.slice(0,1500)
);

    

    const episode =
        findEpisode(text);



    if(!episode){

        return null;

    }



    return {

        title:
            cleanTitle(item.title),


        episode,


        voice:
            findVoice(text),


        image:
            getImage($),


        url:
            item.url,


        description:
            "🔥 Новая серия появилась на JUT-SU"

    };

}




function findEpisode(text){

    const matches =
        [
            /(\d+)\s*серия/i,
            /серия\s*(\d+)/i
        ];



    for(
        const regex of matches
    ){

        const m =
            text.match(regex);


        if(m){

            return m[1];

        }

    }


    return null;

}



function findVoice(text){

    const voices=[
        "AniLibria",
        "AniDUB",
        "AniLibria.TV",
        "StudioBand",
        "Jaskier"
    ];


    for(
        const v of voices
    ){

        if(
            text.includes(v)
        ){

            return v;

        }

    }


    return "Не указана";

}



function getImage($){

    let img =
        $("meta[property='og:image']")
        .attr("content");


    if(!img){

        img =
        $("img")
        .first()
        .attr("src");

    }


    if(
        !img
    ){

        return null;

    }


    if(
        img.startsWith("http")
    ){

        return img;

    }


    return BASE + img;

}



function cleanTitle(title){

    return title
    .replace(/\s+/g," ")
    .trim();

}



async function fetchPage(url){

    const res =
        await fetch(
            url,
            {
                headers:{
                    "User-Agent":
                    "Mozilla/5.0 Kibato Anime Bot"
                }
            }
        );


    if(!res.ok){

        throw new Error(
            res.status
        );

    }


    return await res.text();

}
