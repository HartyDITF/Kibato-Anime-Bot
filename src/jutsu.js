import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://jut-su.net";

async function get(url) {
    const { data } = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        },
        timeout: 20000
    });

    return data;
}

export async function getNewEpisodes() {

    console.log("🔎 Проверяем обновления JUT-SU");

    const html = await get(BASE);

    const $ = cheerio.load(html);

    const result = [];

    $(".upd2").each((i, el) => {

        const title = $(el)
            .find(".jutsu-item__title")
            .text()
            .trim();

        const href = $(el)
            .find(".jutsu-item__title")
            .attr("href");

        const image = $(el)
            .find("img")
            .attr("src");

        const voice = $(el)
            .find(".jutsu-item__subtitle")
            .text()
            .replace("Озвучка:", "")
            .trim();

        const episode = Number(
            $(el)
                .find(".upd2__newseries div")
                .text()
                .trim()
        );

        if (!title || !episode)
            return;

        result.push({
            title,
            episode,
            voice,
            image: image
                ? BASE + image
                : null,
            url: href
                ? BASE + href
                : null
        });

        console.log(
            "Новая серия:",
            title,
            episode,
            voice
        );

    });

    console.log("Найдено серий:", result.length);

    return result;
}
