import * as cheerio from "cheerio";


const JUTSU_URL = "https://jut-su.net/";



export async function getNewEpisodes() {

    console.log(
        "🔎 Проверяем jut-su.net..."
    );


    const response =
        await fetch(
            JUTSU_URL,
            {
                headers: {

                    "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",

                    "Accept":
                    "text/html,application/xhtml+xml"

                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Jut-su ошибка: ${response.status}`
        );

    }


const html =
    await response.text();


console.log(
    html.substring(0, 1000)
);


const $ =
    cheerio.load(html);


console.log(
    "Ссылок найдено:",
    $("a").length
);


$("a").slice(0,20).each((i,el)=>{

    console.log(
        i,
        $(el).text().trim(),
        $(el).attr("href")
    );

});

    const episodes = [];



    $(".shortstory, article, .th-item")
        .each(
            (_, element) => {


                const item =
                    $(element);



                const title =
                    item
                    .find(
                        "h2, .title, .name"
                    )
                    .first()
                    .text()
                    .trim();



                const link =
                    item
                    .find("a")
                    .first()
                    .attr("href");



                if (
                    !title ||
                    !link
                ) {

                    return;

                }



                const text =
                    item
                    .text()
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();



                episodes.push({

                    title:
                    cleanTitle(title),


                    episode:
                    findEpisode(text),


                    voice:
                    findVoice(text),


                    url:
                    absoluteUrl(link),


                    image:
                    findImage(item),


                    description:
                    text.substring(
                        0,
                        300
                    )

                });


            }
        );



    console.log(
        "📺 Найдено:",
        episodes.length
    );


    return episodes.slice(
        0,
        10
    );

}



function findEpisode(text) {

    const match =
        text.match(
            /(\d+)\s*(серия|эпизод|episode)/i
        );


    return match
        ? match[1]
        : "?";

}



function findVoice(text) {

    const voices = [

        "AniLibria",
        "AniDUB",
        "AnimeVost",
        "Jaskier",
        "Субтитры"

    ];


    for (
        const voice of voices
    ) {

        if (
            text
            .toLowerCase()
            .includes(
                voice.toLowerCase()
            )
        ) {

            return voice;

        }

    }


    return "Не указана";

}



function findImage(item) {

    const img =
        item
        .find("img")
        .first()
        .attr("src");


    if (!img) {

        return null;

    }


    return absoluteUrl(img);

}



function absoluteUrl(url) {

    if (
        !url
    ) {

        return null;

    }


    if (
        url.startsWith("http")
    ) {

        return url;

    }


    return (
        JUTSU_URL +
        url.replace(
            /^\//,
            ""
        )
    );

}



function cleanTitle(title) {

    return title
        .replace(
            /\[.*?\]/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}
