import axios from "axios";
import * as cheerio from "cheerio";


const BASE = "https://jut-su.net";


export async function getNewEpisodes(){


const html = await axios.get(
BASE+"/ongoing",
{
headers:{
"User-Agent":"Mozilla/5.0"
}
}
).then(r=>r.data);



const $ = cheerio.load(html);



const img =
$("img")
.filter((i,e)=>{

return $(e)
.attr("src")
?.includes("/uploads/");

})
.first();



console.log(
"Нашёл постер:"
);



console.log(
img.toString()
);



console.log(
"\nРОДИТЕЛЬ:"
);



console.log(
img.parent().toString()
);



console.log(
"\nВЫШЕ:"
);



console.log(
img.parent().parent().toString()
);



return [];

}
