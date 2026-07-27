import * as cheerio from "cheerio";


const BASE =
"https://jut-su.net";


const LIST =
"https://jut-su.net/anime/";


export async function getNewEpisodes(){


console.log(
"🔎 Проверяем Jut-su"
);



const html =
await getPage(LIST);



const $ =
cheerio.load(html);



const links=[];


$(".grid-items a")
.each(
(_,el)=>{


const href =
$(el).attr("href");


if(
!href
) return;



const url =
fixUrl(href);



if(
url &&
isAnimePage(url)
){

links.push(url);

}


}
);



const unique =
[...new Set(links)]
.slice(
0,
10
);



const episodes=[];



for(
const url of unique
){


try{


const data =
await parseAnime(url);


if(data){

episodes.push(data);

}


}catch(e){

console.log(
"Ошибка:",
url
);

}


}



console.log(
"Найдено:",
episodes.length
);



return episodes;


}





async function parseAnime(url){


const html =
await getPage(url);



const $ =
cheerio.load(html);



const title =
$("h1")
.first()
.text()
.trim();



if(!title)
return null;



const text =
$("body")
.text()
.replace(
(/\s+/g),
" "
);



const image =
$("img")
.first()
.attr("src");



return {


title,


episode:
findEpisode(text),


voice:
findVoice(text),


url,


image:
fixUrl(image),


description:
text.substring(
0,
300
)


};


}





function findEpisode(text){


const match =
text.match(
/(\d+)\s*сер(ия|ии|ий)/i
);


if(match)
return match[1];


const total =
text.match(
/(\d+)\s*серии/i
);


return total
?
total[1]
:
"?";


}




function findVoice(text){


const voices=[

"AniLibria",
"AniDUB",
"AnimeVost",
"Jaskier",
"SHIZA Project"

];


for(
const v of voices
){

if(
text.includes(v)
)
return v;


}


return "Не указана";

}





async function getPage(url){


const response =
await fetch(
url,
{

headers:{

"User-Agent":
"Mozilla/5.0 Chrome/120",

"Accept":
"text/html"

}

}
);



if(!response.ok){

throw new Error(
response.status
);

}



return await response.text();


}





function fixUrl(url){

if(!url)
return null;


if(
url.startsWith("http")
){

return url;

}


return BASE + "/" + url.replace(
/^\//,
""
);

}



function isAnimePage(url){

return (

url.includes("/anime/") &&

!url.includes("/anime/page") &&

!url.endsWith("/anime/")

);

}
