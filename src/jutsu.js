import axios from "axios";
import * as cheerio from "cheerio";


const BASE = "https://jut-su.net";


async function get(url){

    const {data}=await axios.get(url,{
        headers:{
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
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



$(".shortstory").each((i,el)=>{


    const a =
    $(el).find("a").first();


    const href =
    a.attr("href");


    const title =
    $(el)
    .find("img")
    .attr("alt");



    const image =
    $(el)
    .find("img")
    .attr("src");



    if(
        href &&
        title &&
        !title.includes("год")
    ){

        anime.push({

            title,

            href:
            href.startsWith("http")
            ?
            href
            :
            BASE+href,


            image:
            image?.startsWith("http")
            ?
            image
            :
            BASE+image

        });


    }


});



console.log(
"Найдено аниме:",
anime.length
);



const result=[];



for(
const item of anime.slice(0,30)
){

try{


const page =
await get(item.href);



const $$ =
cheerio.load(page);



let episode = null;



$$("a").each((i,el)=>{


const txt =
$$(el).text()
.trim();



const m =
txt.match(
/(\d+)\s*серия/
);



if(m){

episode =
Math.max(
episode || 0,
Number(m[1])
);

}


});



if(!episode)
continue;



console.log(
"Серия:",
item.title,
episode
);



result.push({

title:item.title,

episode,

voice:"JUT-SU",

image:item.image

});


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
