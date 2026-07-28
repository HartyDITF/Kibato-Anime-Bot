import axios from "axios";
import * as cheerio from "cheerio";


const BASE="https://jut-su.net";


async function get(url){

const res =
await axios.get(url,{
headers:{
"User-Agent":
"Mozilla/5.0"
},
timeout:20000
});

return res.data;

}



export async function getNewEpisodes(){


console.log(
"🔎 Проверяем JUT-SU"
);



const html =
await get(
BASE+"/ongoing"
);



const $=
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



const link =
$(img)
.closest("a")
.attr("href");



if(!link)
return;



let title =
$(img)
.closest("a")
.text()
.trim();



title =
title
.replace(/\s+/g," ");



if(
!title ||
title.length < 3
)
return;



anime.push({

title,

url:
link.startsWith("http")
?
link
:
BASE+link,


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



const result=[];



for(
const item of anime
){


try{


const page =
await get(item.url);



const $$=
cheerio.load(page);



const text =
$$
.text()
.replace(/\s+/g," ");



/*
ищем последний номер серии
*/


const matches =
[
...text.matchAll(
/(\d+)\s*(?:серия|серии|эпизод)/gi
)
];



if(
matches.length===0
)
continue;



const episode =
Number(
matches[matches.length-1][1]
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
