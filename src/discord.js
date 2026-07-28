import axios from "axios";

export async function sendDiscordEpisode(webhook, episode) {

    const embed = {

        color: 0xff66cc,

        title: `🎬 ${episode.title}`,

        url: episode.url,

        description:
`## 📺 ${episode.episode} серия

🎙 **Озвучка:** ${episode.voice}

⭐ **Рейтинг:** ${episode.rating}

🕒 **Добавлено:** ${episode.time}`,

        image: {
            url: episode.image
        },

        footer: {
            text: "🌸 Kibato Anime • JUT-SU"
        },

        timestamp: new Date().toISOString()
    };

    const components = [
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 5,
                    label: "▶ Смотреть на JUT-SU",
                    url: episode.url
                }
            ]
        }
    ];

    const response = await axios.post(
        webhook,
        {
            embeds: [embed],
            components
        },
        {
            headers: {
                "Content-Type": "application/json"
            },
            validateStatus: () => true
        }
    );

    if (response.status !== 204) {
        console.log(response.data);
        throw new Error(`Discord ошибка: ${response.status}`);
    }

    console.log("✅ Отправлено в Discord:", episode.title);
}
