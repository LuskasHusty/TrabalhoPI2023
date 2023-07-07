//Filtro de Suavização
/*
    Havia sido implementado um filtro gaussiano, porém
    era muito lento e não foi possivel obter resultados bons
    e nem otimiza-lo suficientemente
    Logo é usado a implementação do JIMP
*/

const fs = require('fs');
const jimp = require('jimp');


/*
    Implementação não funcional antiga
*/
async function Smoothfilter(image, sigma, file)
{
    let smoothImage = new jimp(256,256);

    let h =[];

    for(let i=0; i < 3; i++)
    {
        h[i] = []
        for(let j=0; j < 3; j++)
        {
            h[i][j] = (1/ (2*Math.PI*Math.pow(sigma,2)))*Math.exp(-1*(Math.pow(i,2)+Math.pow(j,2))/(2*Math.pow(sigma,2)));      
        }
    }
    
    let imageArray = [];
        for(let i = 0; i < 257; i++)
        {
            imageArray[i] = [];
            for(let j = 0; j < 257; j++)
            {
                if(i == 0 || i == 256 || j == 0 || j == 256)
                    imageArray[i][j] = 0;
                else
                    imageArray[i][j] = image[i-1][j-1];
            }
        }


    let new_image = new jimp(256,256, (err,image)=>
    {
        if(err) throw err;
        for(let x=1; x < 256; x++)
        {
            for(let y=1; y < 256; y++)
            {
                for(let i=-1; i < 1; i++)
                {
                    for(let j=-1; j < 1; j++)
                    {
                        new_image[x][y] = imageArray[x+i][y+j]*h[i+1][j+1];
                    }
                }
            }
        }
        
        new_image.write(name, (err) =>
        {
            if(err) throw err;
        })
    });
}

async function main()
{
    let files = fs.readdirSync("./PNG_images");
    for(let file of files)
    {
        jimp.read(`./PNG_images/${file}`)
        .then(image =>
        {
            image.blur(3)
            .write(`./F_PNG/${file}`)
        })
        .catch(err =>
        {
            console.log(err);
        })
        
    }
}

main();