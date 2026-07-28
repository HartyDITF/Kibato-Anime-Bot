import { getNewEpisodes } from "./jutsu.js";
import { sendDiscordEpisode } from "./discord.js";
import {
    getLastEpisode,
    updateEpisode,
    hasData
} from "./storage.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

    console.log("🌸 Kibato Anime запуск");

    const webhook = process.env.DISCORD_WEBHOOK;

    if (!webhook) {
        throw new Error("Нет DISCORD_WEBHOOK");
    }

    const episodes = await getNewEpisodes();

    console.log("Найдено серий:", episodes.length);

    const firstRun = !hasData();

    if (firstRun) {
        console.log("🆕 Первый запуск. Заполняем базу...");
    }

    let sent = 0;

    for (const episode of episodes) {

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

        // Первый запуск
        if (firstRun) {

            updateEpisode(id, episode.episode);

            console.log(
                "💾 Сохранено:",
                episode.title
            );

            continue;
        }

        if (episode.episode <= last) {

            console.log(
                "⏭ Без изменений:",
                episode.title
            );

            continue;
        }

        try {

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
                episode.title
            );

            await sleep(1500);

        } catch (e) {

            console.log(
                "Ошибка:",
                e.message
            );

        }

    }

    console.log(
        `🌸 Готово. Отправлено: ${sent}`
    );

}

main().catch(console.error);
