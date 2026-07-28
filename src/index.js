import { getNewEpisodes } from "./jutsu.js";
import { sendDiscordEpisode } from "./discord.js";
import { getLastEpisode, updateEpisode } from "./storage.js";


async function main(){

    console.log(
        "🌸 Kibato Anime запуск"
    );


    const webhook =
    process.env.DISCORD_WEBHOOK;


    if(!webhook){

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



    for(
        const episode of episodes
    ){


        try{


            const last =
            getLastEpisode(
                episode.title
            );



            console.log(
                "Проверка:",
                episode.title,
                "было:",
                last,
                "сейчас:",
                episode.episode
            );



            if(
                episode.episode <= last
            ){

                console.log(
                    "⏭ Пропуск:",
                    episode.title
                );

                continue;

            }



            await sendDiscordEpisode(
                webhook,
                episode
            );



            updateEpisode(
                episode.title,
                episode.episode
            );



            sent++;



        }
        catch(error){


            console.log(
                "Ошибка:",
                episode.title,
                error.message
            );


        }


    }



    console.log(
        `🌸 Готово. Отправлено: ${sent}`
    );

}



main()
.catch(
    error=>{

        console.error(
            error
        );

        process.exit(1);

    }
);
