import fs from "fs";


const FILE =
"./sent.json";



function loadStorage(){

    if(
        !fs.existsSync(FILE)
    ){

        return {};

    }


    try {

        return JSON.parse(
            fs.readFileSync(
                FILE,
                "utf8"
            )
        );


    } catch {

        return {};

    }

}




function saveStorage(data){

    fs.writeFileSync(
        FILE,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}




export function wasSent(id){


    const data =
        loadStorage();


    return Boolean(
        data[id]
    );

}




export function markSent(id){


    const data =
        loadStorage();


    data[id] =
        Date.now();


    saveStorage(
        data
    );

}
