import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://jut-su.net";


export async function getNewEpisodes() {

    console.log("🔎 Проверяем JUT-SU онгоинги");


    const html = await axios.get(
        BASE + "/ongoing/",
        {
            headers:{
                "User-Agent":
                "Mozilla/5.0"
            }
        }
    );


    const $ = cheerio.load(
        html.data
    );


    const animeLinks = [];


    $("a").each(
        (_,el)=>{

            const href =
                $(el).attr("href");


            const title =
                $(el).text().trim();


            if(
                href &&
                href.includes("/anime/") &&
                title.length > 2
            ){

                animeLinks.push({

                    title,
                    url:
                    BASE + href

                });

            }

        }
    );



    const unique =
        animeLinks.filter(
            (v,i,a)=>
            a.findIndex(
                x=>x.url===v.url
            )===i
        );


    console.log(
        "Найдено аниме:",
        unique.length
    );



    let result = [];



    for(
        const anime of unique.slice(0,30)
    ){

        try{


            const page =
            await axios.get(
                anime.url,
                {
                    headers:{
                        "User-Agent":
                        "Mozilla/5.0"
                    }
                }
            );



            const $page =
            cheerio.load(
                page.data
            );



            const text =
            $page.text();



            /*
              Ищем номера серий
              в тексте страницы
            */


            const episodes =
            [
                ...text.matchAll(
                    /(\d+)\s*серия/gi
                )
            ];



            if(
                episodes.length===0
            ){

                continue;

            }



            const last =
            episodes
            .map(
                x=>Number(x[1])
            )
            .sort(
                (a,b)=>b-a
            )[0];



            if(
                !last
            ){

                continue;

            }



            result.push({

                title:
                anime.title,

                episode:
                last,

                voice:
                "JUT-SU",

                image:
                getImage($page),

                url:
                anime.url

            });



            console.log(
                "Найдена серия:",
                anime.title,
                last
            );


        }
        catch(e){

            console.log(
                "Ошибка:",
                anime.title,
                e.message
            );

        }

    }



    return result;

}



function getImage($){


    let img =
    $("img")
    .first()
    .attr("src");


    if(
        !img
    ){

        return null;

    }


    if(
        img.startsWith("//")
    ){

        img =
        "https:" + img;

    }


    if(
        img.startsWith("/")
    ){

        img =
        BASE + img;

    }


    return img;

}
