import fs from "fs";

const FILE = "./sent.json";

function load() {
    if (!fs.existsSync(FILE)) return {};

    try {
        return JSON.parse(fs.readFileSync(FILE, "utf8"));
    } catch {
        return {};
    }
}

function save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function getLastEpisode(id) {
    const data = load();
    return data[id] || 0;
}

export function updateEpisode(id, episode) {
    const data = load();
    data[id] = episode;
    save(data);
}

export function hasData() {
    const data = load();
    return Object.keys(data).length > 0;
}
