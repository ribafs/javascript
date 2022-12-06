function Iniciar() {

    // * CENA DO APLICATIVO
    var scene = new THREE.Scene()
    , WIDTH = window.innerWidth
    , HEIGHT = window.innerHeight;


    //Camêra
    // * FOV "CAMPO DE VISÃO" = 45
    // * ASPECT RATIO "DIMENSÕES DA JANELA" no caso as variaveis "WIDTH" e "HEIGHT" que contém o tamanho da janela do brownser "window.innerWidth" e "window.innerHeight". Utiliza-se para manter os objetos da cena com a proporção da janela ou seja não ter uma diferença de pixels, assim distorcendo a imagem.
    // * NEAR "DISTÂNCIA" Este terceiro parâmetro, informa qual é a distância em pixels da câmera no eixo Z onde os elementos serão renderizados, ou seja, informamos 0.1, isso significa que os elementos “na cara” da câmera serão renderizados.
    // * FEAR "LIMITE DE DISTÂNCIA DE RENDERIZAÇÃO" Este ultimo parâmetro, serve para o mesmo propósito do parâmetro anterior, porém ele define o limite “distante” da câmera para a renderização.
    //colocamos 1000, isso significa que ele irá renderizar até 1000 pixels de distância da câmera pelo eixo Z, tudo o que estiver além disso, não será renderizado.
    var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);

    // * Posição da camera
    //   Eixo Z - distância do objeto em relação a "lente da camera"
    //   para alterar os valores sobre os eixos Y, X e Z só alterar a ultima letra da sintaxe abaixo:
    camera.position.z = 50;


    // * Estancia do objeto de renderização do WebGl - "WebGLRenderer()"
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT); //Dimensões para renderizar a cena no caso sera fullscreen referente a janela do brownser que definimos as var acima "WIDTH" e "HEIGHT"


    // * atribuindo ao DOM e ao body do html para que seja executado.
    //neste caso sera executado na nossa "body"
    document.getElementsByTagName('body')[0].appendChild(renderer.domElement);


    // * alterando o fundo da cena. 
    //         Primeiro parametro recebe a cor em hexadecimal após "0x".
    //         Segundo parametro é a opacidade do fundo, "Alpha" os valores são somente 1 e 0. 1 é visivel. 0 e o "Alpha channel".
    // Para que o segundo parametro seja abilitado precisamos alterar o nosso construtor do objeto "WeblGlRenderer()" da seguinte forma:
    //         var renderer = new THREE.WebGLRenderer({alpha:true});
    // caso não tenha objetivos de usar o canal "Alpha" não utilize o segundo paramêtro.
    renderer.setClearColor(0x3B3034);


    // * Criando objeto 3D de um cilindro, carregando apenas a "matemática do objeto"
    // as caracteristicas do objeto são em valores em "Pixels".
    // - raio do topo "5"
    // - raio do fundo "5"
    // - altura "20"
    // - número segmentos de altura "32"
     var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);


    // * Criando material do objeto, definindo exibição de wireframe
    //   Cores são inseridas após o "0x" em hexadecimal
     var material = new THREE.MeshBasicMaterial({ color: 0xECE0B6, wireframe: true });


    // * Atribuir o material ao objeto
    //      Primeiro paramêtro é o nossso objeto no caso a var "geometria"
    //      Segundo paramêtro é o nosso material.
    var cylinder = new THREE.Mesh(geometry, material);


    // * Adicionando objeto na cena
    // Utilizamos nossa var que possui o objeto "THREE.scene()" no caso a nossa var scene.
    scene.add(cylinder);

    


    // * RENDERIZANDO 
    //definindo por paramêtros a nossa var que possui o objeto "THREE.scene()" ou seja nossa cena
    //e a var que possui o objeto "THREE.PerspectiveCamera()" ou seja nossa camera
    renderer.render(scene, camera);



    //função para controlar a renderização da cena
    function render() {

        //definindo a cena e a câmera utilizada
        renderer.render(scene, camera);

        //alterando valores dos eixos para executar algum movimento
        cylinder.rotation.z += 0.01;
        cylinder.rotation.y += 0.01;
        cylinder.rotation.x += 0.01;

        //executando recursivamente
        requestAnimationFrame(render);
    }

    //executando a função de renderização
    render();

}