//Image Parser Versão 3
/*
    Datapoints são corretamentes gerados para PNG
    porém em um limite de batch de 11 datapoints, pois
    o algoritmo não espera imagens serem geradas para
    gerar a proxima depletando a memoria
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
                image.setPixelColor(color, y, x);
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
                //i++;

                plotLine(imageArray, x1, y1, x2, y2);

            }
        }
        ParsePNG(imageArray, `./PNG_images/${index}_${name}.png`);
        index++;
        
        if(index > 11)
            return;
    }
}

function plotLine(imageArray, x1, y1, x2, y2)
{
    if (Math.abs(y2 - y1) < Math.abs(x2 - x1))
    {
        if(x1 > x2)
        {
            plotL(imageArray, x2, y2, x1, y1);
        }
        else
        {
            plotL(imageArray, x1, y1, x2, y2);
        }
    }
    else
    {
        if(y1 > y2)
        {
            plotH(imageArray, x2, y2, x1, y1);
        }
        else
        {
            plotH(imageArray, x1, y1, x2, y2);
        }
    }
}

function plotH(imageArray, x1, y1, x2, y2)
{
    let dx = x2 - x1;
    let dy = y2 - y1;
    xi = 1;
    if(dx < 0)
    {
        xi = -1;
        dx = -dx;
    }
    let d = (2*dx)-dy;

    for(let x=x1,y=y1;y<=y2; y++)
    {
        imageArray[x][y] = 0;
        if(d > 0)
        {
            x += xi;
            d += (2 * (dx - dy));
        }
        else
        {
            d += d + 2*dx;
        }
    }
}

function plotL(imageArray, x1, y1, x2, y2)
{
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