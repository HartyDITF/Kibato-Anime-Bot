import axios from "axios";
import * as cheerio from "cheerio";


const URL = "https://jut-su.net/ongoing";


async function getPage(url){

    const {data} = await axios.get(url,{
        headers:{
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        timeout:20000
    });

    return data;
}



export async function getNewEpisodes(){


    console.log("🔎 Проверяем JUT-SU онгоинги");


    const html =
        await getPage(URL);


    const $ =
        cheerio.load(html);



    const animeLinks = new Map();



    $("a").each((i,el)=>{


        const href =
            $(el).attr("href");


        const title =
            $(el).text()
            .trim();



        if(
            href &&
            href.includes("/anime/")
            &&
            title.length > 2
        ){

            animeLinks.set(
                href,
                title
            );

        }


    });



    console.log(
        "Найдено аниме:",
        animeLinks.size
    );



    const result=[];



    for(
        const [link,title]
        of animeLinks
    ){


        try{


            const page =
                await getPage(
                    link.startsWith("http")
                    ?
                    link
                    :
                    "https://jut-su.net"+link
                );



            const $$ =
                cheerio.load(page);



            const body =
                $$
                .text()
                .replace(/\s+/g," ");



            let episode=null;



            const matches =
                body.match(
                    /\d+\s*сер(?:ия|ии|ий|ий)/gi
                );



            if(matches){

                const nums =
                    matches
                    .map(x=>
                        Number(
                            x.match(/\d+/)[0]
                        )
                    )
                    .filter(Boolean);


                episode =
                    Math.max(...nums);

            }



            if(episode){


                const image =
                    $$
                    ("meta[property='og:image']")
                    .attr("content");



                console.log(
                    "Найдена серия:",
                    title,
                    episode
                );


                result.push({

                    title,

                    episode,

                    voice:
                    "JUT-SU",

                    image

                });


            }



        }
        catch(err){

            console.log(
                "Ошибка:",
                title
            );

        }


    }



    return result;

}
