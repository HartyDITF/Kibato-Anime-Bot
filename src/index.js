import { getNewEpisodes } from "./jutsu.js";
import { sendDiscordEpisode } from "./discord.js";
import { getLastEpisode, updateEpisode } from "./storage.js";

async function main() {

    console.log("🌸 Kibato Anime запуск");

    const webhook = process.env.DISCORD_WEBHOOK;

    if (!webhook) {
        throw new Error("Нет DISCORD_WEBHOOK");
    }

    const episodes = await getNewEpisodes();

    console.log("Найдено серий:", episodes.length);

    let sent = 0;

    for (const episode of episodes) {

        try {

            // Используем URL как уникальный ID
            const id = episode.url;

            const last = getLastEpisode(id);

            console.log(
                "Проверка:",
                episode.title,
                "было:",
                last,
                "сейчас:",
                episode.episode
            );

            if (episode.episode <= last) {

                console.log("⏭ Пропуск:", episode.title);

                continue;
            }

            await sendDiscordEpisode(
                webhook,
                episode
            );

            updateEpisode(
                id,
                episode.episode
            );

            sent++;

            console.log(
                "✅ Отправлено:",
                episode.title,
                episode.episode
            );

            // Чтобы не словить Discord Rate Limit
            await new Promise(resolve =>
                setTimeout(resolve, 1500)
            );

        } catch (error) {

            console.log(
                "❌ Ошибка:",
                episode.title,
                error.message
            );

        }

    }

    console.log(`🌸 Готово. Отправлено: ${sent}`);

}

main().catch(error => {

    console.error("Ошибка:", error);

    process.exit(1);

});
