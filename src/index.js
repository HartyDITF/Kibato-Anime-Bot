import { getNewEpisodes } from "./jutsu.js";
import { sendDiscordEpisode } from "./discord.js";
import { wasSent, markSent } from "./storage.js";


async function main() {

    console.log("🌸 Kibato Anime запуск");


    const webhook =
        process.env.DISCORD_WEBHOOK;


    if (!webhook) {

        throw new Error(
            "Нет DISCORD_WEBHOOK"
        );

    }


    const episodes =
        await getNewEpisodes();


    console.log(
        "Найдено серий:",
        episodes.length
    );


    let sent = 0;


   for (
 const episode of episodes
){

    try{


        const id =
        createId(
            episode
        );


        if(
            wasSent(id)
        ){

            console.log(
                "Дубликат:",
                episode.title
            );

            continue;

        }



        await sendDiscordEpisode(
            webhook,
            episode
        );


        markSent(id);


        sent++;


    }
    catch(error){

        console.log(
            "Ошибка отправки:",
            episode.title,
            error.message
        );

    }


}


        const id =
            createId(
                episode
            );


        if (
            wasSent(id)
        ) {

            console.log(
                "Дубликат:",
                episode.title,
                episode.episode
            );

            continue;

        }



        await sendDiscordEpisode(
            webhook,
            episode
        );


        markSent(id);


        sent++;


        console.log(
            "Отправлено:",
            episode.title,
            episode.episode
        );

    }


    console.log(
        `🌸 Готово. Отправлено: ${sent}`
    );

}



function createId(ep){

    return (

        ep.title +
        "_" +
        ep.episode +
        "_" +
        ep.voice

    )
    .toLowerCase()
    .replace(
        /[^a-z0-9а-яё]/gi,
        "-"
    );

}



main()
.catch(
    error => {

        console.error(
            "Ошибка:",
            error
        );

        process.exit(1);

    }
);
