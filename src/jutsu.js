import axios from "axios";
import * as cheerio from "cheerio";


const BASE = "https://jut-su.net";


async function get(url){

    const {data} = await axios.get(url,{
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
"🔎 Проверяем JUT-SU"
);



const html =
await get(
BASE + "/ongoing"
);



const $ =
cheerio.load(html);



const anime=[];



$("img").each((i,img)=>{


const src =
$(img).attr("src");



if(
!src ||
!src.includes("/uploads/")
)
return;



let block =
$(img)
.parent();



let title =
block
.text()
.trim();



if(
title.length < 3
){

title =
$(img)
.closest("div")
.text()
.trim();

}



title =
title
.replace(/\s+/g," ");



let href =
$(img)
.closest("a")
.attr("href");



if(!href){


href =
$(img)
.parent()
.attr("href");


}



if(
!href ||
!title
)
return;



if(
title.includes("Все аниме") ||
title.includes("Онгоинги") ||
title.includes("2025") ||
title.includes("2026")
)
return;



anime.push({

title,

url:
href.startsWith("http")
?
href
:
BASE+href,


image:
src.startsWith("http")
?
src
:
BASE+src

});


});



console.log(
"Найдено аниме:",
anime.length
);



for(const a of anime){

console.log(
"КАРТОЧКА:",
a.title,
a.url
);

}



const result=[];



for(
const item of anime
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



const numbers =
[
...text.matchAll(
/(\d+)\s*(?:серия|серии|эпизод)/gi
)
];



if(!numbers.length)
continue;



const episode =
Number(
numbers[numbers.length-1][1]
);



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
catch(e){

console.log(
"Ошибка:",
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
