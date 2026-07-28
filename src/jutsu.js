import axios from "axios";
import * as cheerio from "cheerio";


const BASE = "https://jut-su.net";


async function get(url){

    const {data} = await axios.get(url,{
        headers:{
            "User-Agent":"Mozilla/5.0"
        },
        timeout:20000
    });

    return data;

}



export async function getNewEpisodes(){

console.log(
"🔎 Проверяем JUT-SU"
);



const html =
await get(
BASE + "/ongoing"
);



const $ =
cheerio.load(html);



const anime = [];



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



if(
title &&
url
){

anime.push({

title,

url:

url.startsWith("http")
?
url
:
BASE+url,


image:

image
?
(
image.startsWith("http")
?
image
:
BASE+image
)
:
null


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


try{


const page =
await get(item.url);



const $$ =
cheerio.load(page);



let episode = 0;



$$(".jutsu-episode")
.each((i,el)=>{


const text =
$$(el)
.text();



const match =
text.match(
/(\d+)\s*сер/
);



if(match){

episode =
Math.max(
episode,
Number(match[1])
);

}


});



if(
episode === 0
){

const body =
$$.text();


const matches =
[
...body.matchAll(
/(\d+)\s*серия/g
)
];


for(
const m of matches
){

episode =
Math.max(
episode,
Number(m[1])
);

}


}



if(
episode>0
){


result.push({

title:item.title,

episode,

voice:"JUT-SU",

image:item.image,

url:item.url


});


console.log(
"Найдена серия:",
item.title,
episode
);


}



}
catch(e){

console.log(
"Ошибка:",
item.title,
e.message
);


}



}



console.log(
"Итого:",
result.length
);



return result;


}
