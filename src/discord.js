export async function sendDiscordEpisode(
    webhook,
    episode
) {

    if (!webhook) {

        throw new Error(
            "DISCORD_WEBHOOK отсутствует"
        );

    }


    const embed = {

        title:
        `🎬 ${episode.title} — ${episode.episode} серия`,


        description:
        `
🎙 Озвучка: **${episode.voice}**

${episode.description || ""}
        `,


        url:
        episode.url,


        color:
        16733696,


        footer: {

            text:
            "🌸 Kibato Anime"

        }

    };



    if (
        episode.image
    ) {

        embed.thumbnail = {

            url:
            episode.image

        };

    }



    const response =
        await fetch(
            webhook,
            {

                method:
                "POST",


                headers: {

                    "Content-Type":
                    "application/json"

                },


                body:
                JSON.stringify({

                    username:
                    "Kibato Anime",


                    embeds: [
                        embed
                    ],


                    components: [

                        {

                            type:
                            1,


                            components: [

                                {

                                    type:
                                    2,

                                    style:
                                    5,

                                    label:
                                    "▶ Смотреть",

                                    url:
                                    episode.url

                                }

                            ]

                        }

                    ]

                })

            }
        );



    if (
        !response.ok
    ) {

        throw new Error(
            `Discord ошибка: ${response.status}`
        );

    }


    console.log(
        "✅ Отправлено в Discord:",
        episode.title
    );

}
