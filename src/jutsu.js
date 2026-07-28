import axios from "axios";
import * as cheerio from "cheerio";


const URL =
    "https://jut-su.net/ongoing";


export async function getNewEpisodes() {

    console.log("🔎 Проверяем JUT-SU онгоинги");


    const {data} = await axios.get(URL,{
        headers:{
            "User-Agent":
            "Mozilla/5.0"
        },
        timeout:15000
    });


    const $ = cheerio.load(data);


    const anime = [];


    $(".shortstory").each((i,el)=>{


        const title =
            $(el)
            .find(".shortstorytitle")
            .text()
            .trim();


        const link =
            $(el)
            .find("a")
            .first()
            .attr("href");


        if(title && link){

            anime.push({
                title,
                link
            });

        }


    });



    console.log(
        "Найдено аниме:",
        anime.length
    );



    const episodes=[];



    for(const item of anime){


        try{


            const page =
            await axios.get(
                item.link,
                {
                    headers:{
                        "User-Agent":
                        "Mozilla/5.0"
                    }
                }
            );


            const $$ =
            cheerio.load(
                page.data
            );



            const text =
            $$
            .text()
            .replace(/\s+/g," ");



            const match =
            text.match(
                /(\d+)\s*серий/
            );



            if(match){


                const count =
                Number(match[1]);


                episodes.push({

                    title:item.title,

                    episode:count,

                    voice:
                    "JUT-SU",

                    image:
                    $$("meta[property='og:image']")
                    .attr("content")

                });


                console.log(
                    "Найдено:",
                    item.title,
                    count
                );

            }



        }catch(e){

            console.log(
                "Ошибка страницы:",
                item.title
            );

        }


    }


    return episodes;

}
