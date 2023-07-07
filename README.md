# Trabalho Processamento de Imagens

## Grupo
Lucas Sanchez Silva<br>
João Pedro Alves Januário<br>
Guilherme Branco Peres Salami<br>

## Objetivo
O Objetivo deste Trabalho era realizar o pré-processamento das imagens do dataset Quick, Draw! (https://github.com/googlecreativelab/quickdraw-dataset/) para realizar o treinamento em uma rede neural implementada em C++

## Conteúdo
### Parser 
Contém 4 versões (app1.js, app2_0.js, app2_1.js, app3.js) do Parser de imagens no formato ndjson, em que ocorrem iterações no processo de gerar as imagens em formato PNG, onde o app3.js é o funcional final onde as imagens as imagens são salvas na pasta PNG_images

### Blur
Contém smoothingFilter.js com uma implementação não funcional do filtro gaussiano de suavização e a utilização do filtro da biblioteca JIMP, lê imagens na pasta PNG_images e salva seu resultado na pasta F_PNG

### Resize
Contém resizer.js com o uso do Resize da Biblioteca JIMP, lê imagens do F_PNG e salva em RESIZED_PNG, convertendo as imagens de 256x256 para 64x64

## Utilização
Para utilizar os códigos é necessário ter instalado NodeJS e Node Package Manager
Execute no diretório de trabalho `npm install` para instalar os pacotes necessários e `node <nome do script>` para executar os scripts
