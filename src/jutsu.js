import axios from "axios";
import * as cheerio from "cheerio";


const BASE = "https://jut-su.net";



async function get(url){

    const {data} =
    await axios.get(url,{
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
BASE+"/ongoing"
);



const $ =
cheerio.load(html);



const anime=[];



$(".jutsu-item")
.each((i,el)=>{


const title =
$(el)
.find(".jutsu-item__title")
.text()
.trim();



const url =
$(el)
.find(".jutsu-item__title")
.attr("href");



const image =
$(el)
.find("img")
.attr("src");



const seriesText =
$(el)
.find(".jutsu-item__label-series")
.text()
.trim();



if(
title &&
url &&
seriesText
){


const match =
seriesText.match(
/(\d+)/
);



anime.push({

title,

url,

image:
image.startsWith("http")
?
image
:
BASE+image,

episode:
match
?
Number(match[1])
:
0

});


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



if(
item.episode <=0
)
continue;



result.push({

title:item.title,

episode:item.episode,

voice:"JUT-SU",

image:item.image,

url:item.url

});



console.log(
"Найдена серия:",
item.title,
item.episode
);


}



console.log(
"Найдено серий:",
result.length
);



return result;


}
