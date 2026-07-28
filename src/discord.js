import axios from "axios";


export async function sendDiscordEpisode(
    webhook,
    episode
){


    const embed = {


        title:
        `🎬 ${episode.title} — ${episode.episode} серия`,


        description:
        `🎙 Озвучка: ${episode.voice || "Не указана"}\n\n🔥 Новая серия появилась на JUT-SU`,


        color: 0xff69b4,


        footer:{
            text:
            "🌸 Kibato Anime"
        }


    };



    if(episode.image){

        embed.thumbnail = {
            url:
            episode.image
        };

    }



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



    if(response.status !== 204){

        console.log(
            response.data
        );


        throw new Error(
            `Discord ошибка: ${response.status}`
        );

    }



    console.log(
        "✅ Отправлено в Discord:",
        episode.title
    );

}
