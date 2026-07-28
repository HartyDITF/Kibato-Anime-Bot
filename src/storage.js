import fs from "fs";


const FILE = "./sent.json";



function load(){

    if(!fs.existsSync(FILE)){
        return {};
    }


    try{

        return JSON.parse(
            fs.readFileSync(
                FILE,
                "utf8"
            )
        );

    }
    catch{

        return {};

    }

}



function save(data){

    fs.writeFileSync(
        FILE,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}




export function getLastEpisode(title){

    const data = load();

    return data[title] || 0;

}




export function updateEpisode(title, episode){

    const data = load();


    data[title] = episode;


    save(data);

}
