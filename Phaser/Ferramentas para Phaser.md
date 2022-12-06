## Ferramentas para Phaser

## cordova-phaser
template do cordova para phaser, que cria um projeto cordova com uma estrutura adequada para um projeto Phaser
https://github.com/amex4152/cordova-phaser

## Usando:
cordova create hello com.example.hello HelloWorld --template cordova-phaser

cd hello

cordova prepare


## phaser-cli
https://github.com/nerdenough/phaser-cli

## Cliente de phaser para node.js

## Instalação
sudo npm install -g phaser-cli

## Usando:
```js
phaser init <template-name> <project-name>

phaser init webpack meu-projeto
```

webpack - template em https://github.com/phaser-templates/webpack

Repositório de templates - https://github.com/phaser-templates

## Templates atualmente:

Usando um template customizado:
```js
phaser init username/repo my-project
```
username/repo é o username do github e o repositório. Ex: ribafs/repositorio1

## Instalar com tempalte local:

phaser init ~/fs/path/to-custom-template my-project

Mais detalhes em:
https://github.com/nerdenough/phaser-cli


## phaser-component-library
https://github.com/SaFrMo/phaser-component-library
```js
phaser-mario - npm install phaser-mario - https://github.com/SaFrMo/phaser-mario

phaser-link - npm install phaser-link - https://github.com/SaFrMo/phaser-link

phaser-percent-bar - npm install phaser-percent-bar - https://github.com/SaFrMo/phaser-percent-bar

data-uri-snippets - npm install data-uri-snippets - https://github.com/SaFrMo/data-uri-snippets
```

## gui component for phaser
https://github.com/redsheep/RSGUI

https://redsheep.github.io/RSGUI-Examples/


## Editor para Phaser e outras ferramentas HTML5
http://mightyeditor.mightyfingers.com/

## Phaser Sprite GUI
https://samme.github.io/phaser-sprite-gui/

## Phaser Plugin Game GUI
https://samme.github.io/phaser-plugin-game-gui/

## Phaser Debug
Plugin simples de debug para Phaser
https://github.com/englercj/phaser-debug/

- Faça o download do projeto acima
- Descompacte
- Copie o arquivo phaser-debug.js que se encontra na pasta dist para seu projeto
- Faça o include do mesmo no index.html
```html
<script src="phaser.js"></script>
<script src="phaser-debug.js"></script>
```
## Habilitando o plugin:
game.add.plugin(Phaser.Plugin.Debug);

Agora ele agirá sempre que for solicitado.

Como o debug é algo muito importante, este plugin pode ser útil usado paralelamente com o Inspetor do navegador.

## Phaser Multiscreen Example

Uso de escala. Opção para lidar com várias dimensões de dispositivos no seu game
https://github.com/vinod8990/Phaser_Multiscreen_Example

https://github.com/photonstorm/phaser/blob/master/v2/resources/Project%20Templates/Full%20Screen%20Mobile/index.html

## Phaser starter
Projeto inicial de game com Phaser para ter o ambiente funcionando com facilidade. 
Com Webpack, ES6 transpiling, page reloading and Github page publishing.
https://github.com/oliverbenns/phaser-starter/releases

- Faça o download do site acima e execute:
- Descompacte
- cd phaser-starter
- nvm install
- npm install

## Final Android Resizer

Algo chato é criar todas as imagens para um projeto android. Uma mesma imagem em várias dimensões.
Esta ferramenta nos ajuda nisso: Redimensionar todas as imagens de um projeto mobile para android
https://github.com/asystat/Final-Android-Resizer

## Faça o download e Descompacte
Execute o arquivo Executable Jar/Final Android Resizer.jar

No linux clique com o botão direito sobre o arquivo - Abrir Com - Oracle Java 8 Runtime

## Phaser Editor
IDE para criação de jogos HTML 5
http://phasereditor.boniatillo.com/blog/downloads

