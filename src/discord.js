import axios from "axios";

export async function sendDiscordEpisode(webhook, episode) {

    const embed = {
        title: `🎬 ${episode.title} — ${episode.episode} серия`,
        description:
`🎙 Озвучка: ${episode.voice}

🔥 Вышла новая серия!`,
        color: 0xff69b4,
        image: {
            url: episode.image
        },
        footer: {
            text: "🌸 Kibato Anime"
        }
    };

    const payload = {
        embeds: [embed],
        components: [
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
        ]
    };

    while (true) {

        const response = await axios.post(
            webhook,
            payload,
            {
                validateStatus: () => true
            }
        );

        if (response.status === 204) {

            console.log("✅ Отправлено в Discord:", episode.title);
            return;
        }

        if (response.status === 429) {

            const wait =
                (response.data.retry_after || 1) * 1000;

            console.log(
                `⏳ Discord ограничил запросы. Ждем ${wait} мс`
            );

            await new Promise(r => setTimeout(r, wait));

            continue;
        }

        console.log(response.data);

        throw new Error(`Discord ошибка ${response.status}`);
    }

}
