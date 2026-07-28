import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const BASE="https://jut-su.net";


async function get(url){

const r=await axios.get(url,{
headers:{
"User-Agent":
"Mozilla/5.0"
}
});

return r.data;

}



export async function getNewEpisodes(){


console.log(
"🔎 Проверяем JUT-SU"
);


const html =
await get(
BASE+"/ongoing"
);



fs.writeFileSync(
"jutsu.html",
html
);



console.log(
"HTML сохранён:",
html.length
);



const $=
cheerio.load(html);



console.log(
"Все ссылки:",
$("a").length
);


console.log(
"Все картинки:",
$("img").length
);



$("img").slice(0,10)
.each((i,e)=>{

console.log(
"IMG:",
$(e).attr("alt"),
$(e).attr("src")
);

});



return [];

}
