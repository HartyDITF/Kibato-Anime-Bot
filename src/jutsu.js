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



const anime = [];



// ищем только блоки с постерами
$("img").each((i,el)=>{


    const img =
    $(el);



    const src =
    img.attr("src");


    const alt =
    img.attr("alt");



    const parent =
    img.closest("a");



    const href =
    parent.attr("href");



    if(
        !href ||
        !src ||
        !alt
    )
        return;



    // убираем мусор
    if(
        alt.length < 3 ||
        alt.includes("JUT") ||
        alt.includes("Все") ||
        alt.includes("202")
    )
        return;



    if(
        !href.includes("/anime/")
    )
        return;



    anime.push({

        title: alt.trim(),

        href:
        href.startsWith("http")
        ?
        href
        :
        BASE + href,


        image:
        src.startsWith("http")
        ?
        src
        :
        BASE + src

    });


});



// убираем дубли

const unique =
[
...new Map(
anime.map(
x=>[
x.href,
x
]
)
).values()
];



console.log(
"Найдено аниме:",
unique.length
);



const result=[];



for(
const item of unique
){


try{


const page =
await get(item.href);



const $$ =
cheerio.load(page);



const text =
$$.text()
.replace(
(/\s+/g),
" "
);



/*
ищем:
12 серий
24 серии
1171 серия
*/

const match =
text.match(
/(\d+)\s*(серий|серия|эпизодов)/
);



if(!match)
continue;



const episode =
Number(match[1]);



if(
episode <= 0
)
continue;



// озвучка

let voice =
"Не указана";


const voiceMatch =
text.match(
/Озвучка от:\s*([^]+?)Тип/
);



if(
voiceMatch
){

voice =
voiceMatch[1]
.trim()
.replace(/\s+/g," ");

}



result.push({

title:item.title,

episode,

voice,

image:item.image

});



console.log(
"Найдено:",
item.title,
episode
);



}

catch(e){

console.log(
"Ошибка страницы:",
item.title
);

}


}



return result;

}
