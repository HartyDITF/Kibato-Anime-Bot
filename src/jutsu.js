import axios from "axios";
import * as cheerio from "cheerio";


const BASE = "https://jut-su.net";


async function request(url){

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


console.log("🔎 Проверяем JUT-SU онгоинги");


const html =
await request(
BASE + "/ongoing"
);


const $ =
cheerio.load(html);



const links=[];



$("a").each((i,el)=>{


    const href =
    $(el).attr("href");


    const title =
    $(el).text().trim();



    /*
       Настоящие страницы JUT-SU имеют:
       /anime/....
       и название длиннее
    */


    if(
        href &&
        href.includes("/anime/")
        &&
        title.length > 5
        &&
        ![
            "Все аниме",
            "С субтитрами",
            "Китайские"
        ].includes(title)
    ){

        links.push({
            title,
            href:
            href.startsWith("http")
            ?
            href
            :
            BASE+href
        });

    }


});



console.log(
"Найдено аниме:",
links.length
);



const result=[];



for(
const anime of links
){


try{


const page =
await request(
anime.href
);


const $$ =
cheerio.load(page);



const text =
$$.text()
.replace(/\s+/g," ");



/*
 Берем только:
 "Озвучка от"
 и количество серий
*/


const series =
text.match(
/(\d+)\s*серий/
);



if(!series)
continue;



const image =
$$(
"meta[property='og:image']"
)
.attr("content");



result.push({

title:
anime.title,

episode:
Number(series[1]),

voice:
"JUT-SU",

image

});


console.log(
"Найдено:",
anime.title,
series[1]
);



}
catch(e){

console.log(
"Ошибка страницы",
anime.title
);

}


}



return result;


}
