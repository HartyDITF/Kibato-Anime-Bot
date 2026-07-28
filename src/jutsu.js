import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://jut-su.net";


async function get(url){

    const res = await axios.get(url,{
        headers:{
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        timeout:20000
    });

    return res.data;
}



export async function getNewEpisodes(){

    console.log("🔎 Проверяем JUT-SU онгоинги");


    const html = await get(
        BASE + "/ongoing"
    );


    const $ = cheerio.load(html);


    const anime = new Map();



    $("a").each((i,el)=>{


        const href=$(el).attr("href");


        const img=$(el)
        .find("img")
        .attr("src");


        let title=$(el)
        .find("img")
        .attr("alt");


        if(!title){

            title=$(el)
            .text()
            .trim();

        }


        if(
            href &&
            img &&
            title &&
            title.length > 3 &&
            !title.includes("год") &&
            !title.includes("Все") &&
            !title.includes("Суб") &&
            !title.includes("Китай")
        ){


            const url =
            href.startsWith("http")
            ?
            href
            :
            BASE+href;



            anime.set(url,{

                title,
                url,
                image:
                img.startsWith("http")
                ?
                img
                :
                BASE+img

            });


        }


    });



    console.log(
        "Найдено аниме:",
        anime.size
    );



    const result=[];



    for(
        const item of anime.values()
    ){


        try{


            const page =
            await get(item.url);


            const $$ =
            cheerio.load(page);



            const text =
            $$
            .text()
            .replace(/\s+/g," ");



            /*
             ищем реальные серии:
             "Серия 12"
             "12 серия"
             "12 серий"
            */


            const episodes = [
                ...text.matchAll(
                    /(\d+)\s*(?:серия|серии|эпизод)/gi
                )
            ];



            if(
                episodes.length === 0
            )
                continue;



            const last =
            Number(
                episodes
                [episodes.length-1][1]
            );



            result.push({

                title:item.title,

                episode:last,

                voice:
                "JUT-SU",

                image:item.image,

                url:item.url

            });



            console.log(
                "Найдена серия:",
                item.title,
                last
            );


        }
        catch(e){

            console.log(
                "Ошибка страницы:",
                item.title
            );

        }


    }



    console.log(
        "Найдено серий:",
        result.length
    );



    return result;

}
