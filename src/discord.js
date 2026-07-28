import axios from "axios";


function sleep(ms){
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}



export async function sendDiscordEpisode(
    webhook,
    episode
){


    const embed = {

        title:
        `🎬 ${episode.title} — ${episode.episode} серия`,

        description:
        `🎙 Озвучка: ${episode.voice || "JUT-SU"}\n\n🔥 Новая серия появилась на JUT-SU`,

        color:
        0xff69b4,

        footer:{
            text:
            "🌸 Kibato Anime"
        }

    };



    if(episode.image){

        embed.thumbnail={
            url:
            episode.image
        };

    }



    let tries = 0;


    while(tries < 5){


        const response =
        await axios.post(
            webhook,
            {
                embeds:[
                    embed
                ]
            },
            {
                headers:{
                    "Content-Type":
                    "application/json"
                },
                validateStatus:
                ()=>true
            }
        );



        if(response.status === 204){

            console.log(
                "✅ Отправлено в Discord:",
                episode.title
            );

            await sleep(1500);

            return;

        }



        if(response.status === 429){

            const wait =
            response.data.retry_after * 1000 || 3000;


            console.log(
                "⏳ Discord лимит, ждём:",
                wait
            );


            await sleep(wait);

            tries++;

            continue;

        }



        console.log(
            response.data
        );


        throw new Error(
            `Discord ошибка: ${response.status}`
        );


    }


}
