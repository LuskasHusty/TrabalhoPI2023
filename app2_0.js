//Image Parser Versão 2.0
/*
    Versão em que foi utilizado o algoritmo de Bresenham
    para rasterizar uma linha entre cada dois vetores
    Incorreto pois as pré condições do algoritmo não foram
    validadas
*/

const fs = require('fs');
const ndjson = require('ndjson');
const jimp = require('jimp');

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
    .on("end", function()
    {
        callback(data);
    })
}

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
            for(let i = 0; i < stroke[0].length;)
            {
                let x1 = stroke[0][i];
                let y1 = stroke[1][i];

                i++;

                let x2 = stroke[0][i];
                let y2 = stroke[1][i];

                //Algoritmo de linha de Bresenham

                let dx = x2 - x1;
                let dy = y2 - y1;
                yi = 1;
                if(dy < 0)
                {
                    yi = -1;
                    dy = -dy;
                }
                let d = (2*dy)-dx;
            
                for(let x=x1,y=y1;x<=x2; x++)
                {
                    imageArray[x][y] = 0;
                    if(d > 0)
                    {
                        y += yi;
                        d += (2 * (dy - dx));
                    }
                    else
                    {
                        d += d + 2*dy;
                    }
                }

                //

            }
        }
        ParsePNG(imageArray, `./PNG_images/${index}_${name}.png`);
        index++;
        
        if(index > 11)
            return;
    }
}

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