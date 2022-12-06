var scene, camera, renderer;
var  material, mesh;


function Executar() {

    //estancia do objeto de cena
    scene = new THREE.Scene();

    //estancia do objeto de camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

    //posição da camera e a profundidade da lente
    camera.position.z = 1000;

    //estancia do objeto que ira carregar meu aquirvo 3Ds Max
    var loader = new THREE.JSONLoader();

    //estancia do objeto renderizador do THREE.js
    renderer = new THREE.WebGLRenderer();

    //Cor de background
    renderer.setClearColor(0xDDEECD);

    //area de rederização. neste caso as dimensões da janela do browser.
    renderer.setSize(window.innerWidth, window.innerHeight);

    //criação do objeto 3D importado
    var createMesh = function (geometry) {

        var zmesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x342224, wireframe: false }));

        
        //posição
        zmesh.position.set(0, 0, 0);

        zmesh.rotation.x += 0.00;
        zmesh.rotation.y += 0.01;
       
       //tamanho do objeto
        zmesh.scale.set(5, 5, 5);
        //adicionar objeto na cena
        scene.add(zmesh);

       

        renderer.render(scene, camera);

        //função de animação do objeto 3D
        function animate() {

            requestAnimationFrame(animate);

            zmesh.rotation.x += 0.00;
            zmesh.rotation.y += 0.02;
            zmesh.rotation.z += 0.00;
           
            renderer.render(scene, camera);

        }
        //Invocando função
        animate();

    };
    //carregamento do objeto 3D
    loader.load("jonatas.js", createMesh);

   
    //atribuir local de renderização neste caso o elemento do DOM "body"
    document.body.appendChild(renderer.domElement);

   //renderizar
    renderer.render(scene, camera);


   
}