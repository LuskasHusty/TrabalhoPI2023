// Image Parser Versão 1
/*
    Carregam as imagens do formato do Dataset simplificado do Quick, Draw!
    Primeira versão em que os vetores são tratados como pixels unicos

*/

const fs = require('fs');
const ndjson = require('ndjson');
const jimp = require('jimp');


/*
    Carrega as informações de um arquivo ndjson
*/
function parseDrawings(file, callback)
{
    let data = [];
    let stream = fs.createReadStream(file);
    stream.pipe(ndjson.parse())
    .on('data', (obj) =>
    {
        data.push(obj)
    })
    .on("error", (err) =>
    {
        console.log(err);
        return [];
    }
    )
    .on("end", () =>
    {
        callback(data);
    })
}

/*
    Usando um Array de valores de pixel monta uma imagem e salva com o nome especificado
*/

function ParsePNG(imageArray, name)
{
    let image = new jimp(256,256, (err,image)=>
    {
        if(err) throw err;
        imageArray.forEach((row, y) =>
        {
            row.forEach((color, x) =>
            {
                image.setPixelColor(color, x, y);
            })
        })

        
        image.write(name, (err) =>
        {
            if(err) throw err;
        })
    });
}

/*
    Função de parse incorreta que le os vetores de um datapoint
*/  
function ParseImages(imagesData, name)
{
    let index = 0;
    for(let imageData of imagesData)
    {
        let imageArray = [];
        for(let i = 0; i < 256; i++)
        {
            imageArray[i] = [];
            for(let j = 0; j < 256; j++)
            {
                imageArray[i][j] = 0xFFFFFFFF;
            }
        }


        for(let stroke of imageData.drawing)
        {
            for(let i = 0; i < stroke[0].length;i++)
            {
                let x1 = stroke[0][i];
                let y1 = stroke[1][i];
                
                imageArray[x1][y1] = 0;
            }
        }
        ParsePNG(imageArray, `./PNG_images/${index}_${name}.png`);
        index++;
        if(index > 11)
            return;
    }
}

/*
    EntryPoint
*/
async function main()
{
    let files = fs.readdirSync("./RawDataSet");
    for(let file of files)
    {
        parseDrawings(`./RawDataSet/${file}`, (data)=>
        {
            ParseImages(data, file);
        });
        
    }
}

main();