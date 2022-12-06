# Game Super Mario

🇧🇷

## Tecnologias Usadas
HTML, CSS, e JavaScript.

## Como visualizar o projeto?
Disponível do link https://jonathancosta746.github.io/Game-SuperMario/


##


![Captura de tela 2022-05-30 213120](https://user-images.githubusercontent.com/26524921/171071258-e496dfb3-7057-41a8-9ecb-f32eecf8cbcc.png)


https://user-images.githubusercontent.com/26524921/171072382-3a5b913e-b549-43a6-9d60-dd8f03fdb272.mp4


## Como funciona o projeto?
Game simples utilizando DOM para fazer a manipulação do HTML para criar interatividade.

### DOM - Manipulação do HTML alterando classes:
Inicialmente as imagens foram inseridas separadas das classes onde contém as animações.

![image](https://user-images.githubusercontent.com/26524921/171273778-20c75c76-3070-4817-8026-48959ae9acdb.png)


Onde as animações foram criadas dentro do CSS em classes distintas.

![image](https://user-images.githubusercontent.com/26524921/171272666-9321b567-54f8-4085-b1e6-6535034fd511.png)

#

Sendo inserido no JavaScript a função onde irá unir as duas classes no HTML criando o efeito visual do salto. Sendo utilizado a função setTimeOut para que após o determinado tempo que dura a animação de salto, seja excluido do html a classe Jump, finalizando assim a animação.

![image](https://user-images.githubusercontent.com/26524921/171273041-5b767406-14e3-466c-9d99-9387b444f4dc.png)

#

Após a função ser ativada o HTML terá o seguinte comportamento a baixo. Onde a classe Jump é removida pelo JavaScript após o tempo configurado que durará a animação do salto.
![image](https://user-images.githubusercontent.com/26524921/171273246-d1fb0aa7-8122-42ae-b53b-27f4d1ea2423.png)

#

A Função Start será iniciada com o pressionamento de alguma tecla do teclado, onde irá substituir a imagem do Mario para um gif com o mesmo correndo, e iniciar as animações e som de fundo. 

![image](https://user-images.githubusercontent.com/26524921/171681920-e2802252-9263-4f2b-b2cb-14ce30adca9d.png)

#

Foi utilizada a função .offsetLeft para monitoramento da posição das imagens, desta forma foi possivel criar regras para que o JavaScript entenda quando a imagem do Mario está sobre a imagem da tubução, assim parando as animações quando todas as condições do IF forem verdadeiras.

![image](https://user-images.githubusercontent.com/26524921/171683017-702fac2f-000c-426e-92d1-2c7ae681d266.png)

# Lógica utilizada na animação do piso

Foram adicionadas 3 imagens, ao iniciar o game o javaScript iniciará a animação das imagens, no CSS está configurada um tempo para que a primeira e segunda imagem iniciem juntas, quando o canto superior direito da segunda imagem chegar ao final da tela, a primeira imagem ficará abaixo das demais sem animação e a animação da terceira imagem será iniciada, ficando assim em loop com a segunda imagem até o game-over.




https://user-images.githubusercontent.com/26524921/175052502-61a5a651-1361-4359-b771-1fbc63ae0b49.mp4



#


Um pouco mais sobre o projeto neste [link](https://www.youtube.com/watch?v=4WDCv1O13AY) no youtube.
Para dúvidas ou sugestões poderá me contatar através do meu [email](mailto:jonathancosta746@gmail.com) ou [Linkedin](https://www.linkedin.com/in/jonathansantos-costa/).








