import axios from "axios";
import * as cheerio from "cheerio";


const BASE = "https://jut-su.net";


async function get(url){

    const {data}=await axios.get(url,{
        headers:{
            "User-Agent":
            "Mozilla/5.0"
        },
        timeout:20000
    });

    return data;
}



export async function getNewEpisodes(){


console.log(
"🔎 Проверяем JUT-SU онгоинги"
);



const html =
await get(
BASE + "/ongoing"
);


const $ =
cheerio.load(html);



const anime=[];



$("a").each((i,el)=>{


    const href =
    $(el).attr("href");


    const title =
    $(el)
    .find("img")
    .attr("alt")
    ||
    $(el)
    .text()
    .trim();



    const image =
    $(el)
    .find("img")
    .attr("src");



    if(
        href &&
        image &&
        title &&
        title.length > 3
    ){


        if(
            ![
                "Все аниме",
                "Субтитры",
                "Китайские",
                "2024 год",
                "2025 год",
                "2026 год"
            ]
            .includes(title)
        ){


            anime.push({

                title,

                href:
                href.startsWith("http")
                ?
                href
                :
                BASE+href,

                image

            });


        }


    }


});



console.log(
"Найдено аниме:",
anime.length
);



const result=[];



for(
const item of anime
){


try{


const page =
await get(item.href);



const $$ =
cheerio.load(page);



const text =
$$.text()
.replace(/\s+/g," ");



const series =
text.match(
/(\d+)\s*серий/
);



if(!series)
continue;



result.push({

title:item.title,

episode:Number(series[1]),

voice:"JUT-SU",

image:
item.image.startsWith("http")
?
item.image
:
BASE+item.image

});



console.log(
"Найдено:",
item.title,
series[1]
);



}
catch(e){

console.log(
"Ошибка:",
item.title
);

}


}



return result;


}
