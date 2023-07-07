//Resizer 
/*
    É utilizado uma implementação do JIMP para realizar
    o redimencionamento da imagem
*/

const fs = require('fs');
const jimp = require('jimp');

async function main()
{
    let files = fs.readdirSync("./PNG_images");
    for(let file of files)
    {
        jimp.read(`./F_PNG/${file}`)
        .then(image =>
        {
            image.resize(64,64)
            .write(`./RESIZED_PNG/${file}`)
        })
        .catch(err =>
        {
            console.log(err);
        })
        
    }
}

main();