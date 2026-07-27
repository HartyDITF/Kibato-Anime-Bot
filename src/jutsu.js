import * as cheerio from "cheerio";


const JUTSU_URL =
"https://jut-su.net/anime/";



export async function getNewEpisodes(){


console.log(
"🔎 Открываем:",
JUTSU_URL
);



const response =
await fetch(
JUTSU_URL,
{
headers:{
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36",

"Accept":
"text/html"
}
}
);



if(!response.ok){

throw new Error(
`Jut-su ошибка: ${response.status}`
);

}



const html =
await response.text();



const $ =
cheerio.load(html);


console.log(
"Первые div:"
);


$("div").slice(0,30).each((i,el)=>{

    console.log(
        i,
        $(el).attr("class")
    );

});



console.log(
"Ссылок:",
$("a").length
);



const episodes=[];



$(".shortstory, .anime-card, .item, article, .card")
.each(
(_,el)=>{


const item =
$(el);



const title =
item
.find(
"h2,h3,.title,.name"
)
.first()
.text()
.trim();



const link =
item
.find("a")
.first()
.attr("href");



const image =
item
.find("img")
.first()
.attr("src");



if(
title &&
link
){

episodes.push({

title,

episode:
findEpisode(
item.text()
),

voice:
findVoice(
item.text()
),

url:
absoluteUrl(
link
),

image:
absoluteUrl(
image
),

description:
item.text()
.trim()
.substring(
0,
300
)

});


}


}
);



console.log(
"Найдено карточек:",
episodes.length
);



return episodes.slice(
0,
10
);


}





function findEpisode(text){


const match =
text.match(
/(\d+)\s*(серия|эпизод)/i
);



return match
?
match[1]
:
"?";


}





function findVoice(text){


const voices=[

"AniLibria",
"AniDUB",
"AnimeVost",
"Jaskier",
"Субтитры"

];



for(
const voice of voices
){

if(
text
.toLowerCase()
.includes(
voice.toLowerCase()
)
){

return voice;

}

}


return "Не указана";


}




function absoluteUrl(url){


if(!url)
return null;


if(
url.startsWith("http")
)
return url;



return (
"https://jut-su.net/" +
url.replace(
/^\//,
""
)
);


}
