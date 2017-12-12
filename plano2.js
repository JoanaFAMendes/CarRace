var car, cameraPositionLookAt, cameraPositionTPV;
var cameraFrente, camera, camara1;
var objetoCone, objetoCone2, objetoCone3;
var objetoBola1, objetoBola2, objetoBola3, objetoBola4;
var mundo;
var scene;
var renderer;
//teclado
var forward;
var backward;
var right;
var left;
var ang = 0;
var velocidade = 0;
var carObstaculo, carObstaculo2;
var boxCar, boxCone, boxCone2, BBoxCar, boxBola1, boxBola2, boxBola3, boxBola4;
var boxCarObstaculo1, boxCarObstaculo2;
var tempoPartida;
//aumenta a velocidade ao cilindro
var velForward = 0;

window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();
    // add the lights
    createLights();
    // add the objects
    // createPlane();
    // createSea();
    // createSky();
    createRoad();

    criaMeta();

    //criarBancada();
    criarBancada(10050, 1800, 1000, 0, 0, -Math.cos(10));//bancada direita
    criarBancada(10050, -1800, 1000, Math.PI, 0, -Math.cos(10));//bancada esquerda


    // HANDLE MOUSE EVENTS
    /*var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () { renderer.render(scene, camera); });*/

    document.addEventListener("keydown", doKey, false);
    document.addEventListener("keyup", upKey, false);

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);



    // start a loop that will update the objects' positions
    // and render the scene on each frame
    animate();
}


function createScene() {
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();
    var axisScene = new THREE.AxisHelper(3000);
    //  scene.add(axisScene); adiciona eixos à cena

    //camera mais atrás
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000); //10000


    camera.position.x = 0;
    camera.position.y = 800;
    camera.position.z = 1200;
    //camera.lookAt(0, 0, -1);

    //camera da frente
    camera1 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000); //10000
    camera1.position.set(0, 250, -70);
    cameraPositionLookAt = function animateCamera() {
        // camera1.position.set(0, 250, -70);
        camera1.lookAt(0, 0, -1);

    }


    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // configure renderer clear color
    renderer.setClearColor("#80DAEB");





    //cria o objeto carro
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./models/toycar.mtl', function (materials) {
        materials.preload();
        var loader = new THREE.OBJLoader();
        loader.setMaterials(materials);
        loader.load('./models/toycar.obj', function (object) {
            car = object;
            car.scale.set(5, 5, 5);
            car.rotation.y = -Math.PI;
            car.position.set(0, 0, 0);
            //car.material.color.set(0x666666);
            boxCar = new THREE.BoxHelper(car, 0xffff00);
            boxCar.scale.set(0.2, 0.2, 0.2);
            boxCar.rotation.y = -Math.PI;
            boxCar.position.set(0, 0, 0);//(y;z;x)

            //altera as cores do carro
            car.children[1].material.color = new THREE.Color(0xFF0000);
            car.children[2].material.color = new THREE.Color(0xFFFF00);
            car.children[3].material.color = new THREE.Color(0x000000);
            car.children[4].material.color = new THREE.Color(0x00FFFF);
            car.children[5].material.color = new THREE.Color(0x00FFFF);
            car.children[6].material.color = new THREE.Color(0x000000);
            car.children[8].material.color = new THREE.Color(0xFFCC00);
            //car.add(boxCar);
            scene.add(car);


        });
    });
}

function createLights() {

    //Adicionar Luz à scena
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 2000, 1000);
    scene.add(pointLight);

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

}

function criaMeta() { //função que cria a meta de partida
    // upload image para textura da meta
    var textureMeta = new THREE.TextureLoader().load('checkeredHorizontal.png');
    var materialMeta = new THREE.MeshBasicMaterial({ map: textureMeta });
    var texturePilar = new THREE.TextureLoader().load('checkeredVertical.png');
    var materialPilar = new THREE.MeshBasicMaterial({ map: texturePilar });

    var geomPilarEsquerdo = new THREE.BoxGeometry(200, 800, 50);
    var geomPilarDireito = new THREE.BoxGeometry(200, 800, 50);
    var geomMetaChao = new THREE.BoxGeometry(1930, 200, 0);
    var geomMeta = new THREE.BoxGeometry(2600, 200, 50);

    var meta = new THREE.Mesh(geomMeta, materialMeta);
    var metaChao = new THREE.Mesh(geomMetaChao, materialMeta);
    var pilarEsquerdo = new THREE.Mesh(geomPilarEsquerdo, materialPilar);
    var pilarDireito = new THREE.Mesh(geomPilarDireito, materialPilar);

    pilarEsquerdo.position.set(-1200, -500, 0);
    pilarDireito.position.set(1200, -500, 0);


    meta.add(pilarEsquerdo);
    meta.add(pilarDireito);


    var axesMeta = new THREE.AxisHelper(2);
    mundo.add(axesMeta);
    meta.position.set(10550, 0, 900);
    meta.rotation.z = -Math.PI / 2;
    meta.rotation.y = -0.4;

    metaChao.position.set(10000, 0, 500);
    metaChao.rotation.z = -Math.PI / 2;
    metaChao.rotation.y = -Math.PI / 2;


    mundo.add(metaChao);
    mundo.add(meta);
}

function criarBancada(posX, posY, posZ, rotX, rotY, rotZ) { //função que cria as bancadas

    var materialBase = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    var geomBase = new THREE.BoxGeometry(300, 400, 3000);
    var base = new THREE.Mesh(geomBase, materialBase);
    var posX, posY, posZ;
    var rotX, rotY, rotZ;
    base.position.set(posX, posY, posZ);
    //base.position.set(10050, -1800, 1000);
    base.rotation.set(rotX, rotY, rotZ);
    //base.rotation.z = -Math.cos(10);
    //base.rotation.set = (0,-0.1,0);
    //base.rotation.y = -0.1;
    //base.rotation.set = (Math.PI,0,0);

    var textureBancada = new THREE.TextureLoader().load('coloredPattern.jpg', function (texture) {

        textureBancada.wrapS = textureBancada.wrapT = THREE.RepeatWrapping;
        textureBancada.offset.set(0, 0);
        textureBancada.repeat.set(4, 4);
    });
    //var textureBancada = new THREE.TextureLoader().load('./coloredPatternCortada.jpg');
    var materialBancada = new THREE.MeshBasicMaterial({ map: textureBancada });
    var geomBancada = new THREE.BoxGeometry(1300, 20, 3000);
    var bancada = new THREE.Mesh(geomBancada, materialBancada);

    bancada.position.set(0, -200, 0);

    base.add(bancada);
    mundo.add(base);
}

function createRoad() {
    var texture = new THREE.TextureLoader().load('road2.jpg', function (texture) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(50, 1);
    });


    var material = new THREE.MeshBasicMaterial({ map: texture });
    var geometry = new THREE.CylinderGeometry(10000, 10000, 4500, 250, 1, false, 0, 2 * Math.PI); //(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)

    mundo = new THREE.Mesh(geometry, material);
    mundo.rotation.z = Math.PI / 2;
    mundo.rotation.y = Math.PI;
    mundo.position.y = -10000;

    //mundo.add(objetoCone);
    scene.add(mundo);

    //var axis = new THREE.AxisHelper(30000);
    //mundo.add(axis); //The X axis is red. The Y axis is green. The Z axis is blue.

    //CRIA O OBJETO CARRO OBSTACULO 1
    var mtlLoaderObstaculo = new THREE.MTLLoader();
    mtlLoaderObstaculo.load('./models/toycar.mtl', function (materials) {
        materials.preload();
        var loaderObstaculo = new THREE.OBJLoader();
        loaderObstaculo.setMaterials(materials);
        loaderObstaculo.load('./models/toycar.obj', function (object2) {
            carObstaculo = object2;
            carObstaculo.scale.set(5, 5, 5);
            carObstaculo.rotation.set(0, -20, 11);
            carObstaculo.position.z = 10000 * Math.sin(20);
            carObstaculo.position.x = 10000 * Math.cos(20);
            carObstaculo.position.y = 600;

            // var axescarObstaculo = new THREE.AxisHelper(30000);
            // axescarObstaculo.position.set(10000 * Math.cos(20), 600, 10000 * Math.sin(20));
            boxCarObstaculo1 = new THREE.BoxHelper(carObstaculo, 0xffff00);
            // boxCarObstaculo1.add(axescarObstaculo);
            // boxCarObstaculo1.position.set(-10000 * Math.cos(20), 600, -10000);
           
            // boxCarObstaculo1.rotation.set(0, -20, 11);
            boxCarObstaculo1.position.set(-5, -900, 0);
             boxCarObstaculo1.scale.set(0.2, 0.2, 0.2);
            carObstaculo.add(boxCarObstaculo1);

            mundo.add(carObstaculo);
        });
    });
    //FIM OBJETO CARRO OBSTACULO 1
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //CRIA O OBJETO CARRO OBSTACULO 2
    var mtlLoaderObstaculo2 = new THREE.MTLLoader();
    mtlLoaderObstaculo2.load('./models/toycar.mtl', function (materials) {
        materials.preload();
        var loaderObstaculo2 = new THREE.OBJLoader();
        loaderObstaculo2.setMaterials(materials);
        loaderObstaculo2.load('./models/toycar.obj', function (object3) {
            carObstaculo2 = object3;

            carObstaculo2.position.z = 10000 * Math.sin(-21);
            carObstaculo2.position.x = 10000 * Math.cos(-21);
            carObstaculo2.position.y = 0;
            console.log(carObstaculo2.position);

            carObstaculo2.scale.set(5, 5, 5);
            carObstaculo2.rotation.set(0, -4.15, 11);

            boxCarObstaculo2 = new THREE.BoundingBoxHelper(carObstaculo2, 0xff0000);
            boxCarObstaculo2.scale.set(0, 0, 0);
            boxCarObstaculo2.position.set(600, -20, 600);
            //carObstaculo2.add(boxCarObstaculo2);

            mundo.add(carObstaculo2);
        });
    });
    var objetoArvore;
    var nArvores = 100;
    var zteste = 2550;
    var xteste = 10000;

    var objetoArvore;
    var nArvores = 13;
    var zteste = 2550;
    var xteste = 10000;
    // var ang = 360 // nArvorepor fila
    //se quiseres podes criar um array como no aviator para as nuvens
    var angulo = 45;
    function criaArvore() {
        // create an object 3D - a cone de estrada
        var cont = 0;
        for (var i = 0; i < nArvores; i++) {
            objetoArvore = new THREE.Object3D();
            var geometryT = new THREE.CylinderGeometry(0, 1, 5);
            var materialT = new THREE.MeshBasicMaterial({ color: 0x196619, side: THREE.DoubleSide });
            var tree = new THREE.Mesh(geometryT, materialT);
            var geometryTronco = new THREE.CylinderGeometry(0.2, 0.2, 1);
            var materialTronco = new THREE.MeshBasicMaterial({ color: 0x6E2C00, side: THREE.DoubleSide });
            var tronco = new THREE.Mesh(geometryTronco, materialTronco);
            tronco.position.y = -3;
            objetoArvore.add(tree);
            objetoArvore.add(tronco);
            objetoArvore.position.set(xteste, 1100, zteste);
            //  objetoArvore.position.set(xteste, 10000 + 10000 * Math.cos(Math.PI / 180 * ((Math.PI/180)*(angulo+i))), 10000 * Math.sin(Math.PI / 180 * ((Math.PI/180)*(angulo+i))));
            objetoArvore.rotation.z = -Math.PI / 2;


            objetoArvore.scale.set(100, 100, 100);
            var axescarObstaculo = new THREE.AxisHelper(30000);
            axescarObstaculo.position.set(0, 0, 0);

            mundo.add(objetoArvore);
            zteste = zteste + 550;

            cont++;

            if (cont < 3) {

                xteste = xteste - 160;
                objetoArvore.rotation.y = -Math.PI / (6.5 + 0.1);
            } else if (cont > 2 && cont < 6) {

                xteste = xteste - 260;
                objetoArvore.rotation.y = -Math.PI / (6.5 + 0.1);
            } else if (cont > 5 && cont < 8) {

                xteste = xteste - 390;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 0.5);
            } else if (cont > 7 && cont < 10) {

                xteste = xteste - 500;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 1.5);
            } else if (cont > 9 && cont < 12) {

                xteste = xteste - 680;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 3);
            } else if (cont > 11 && cont < 14) {

                xteste = xteste - 1000;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 3.4);
            } else if (cont > 13 && cont < 15) {

                xteste = xteste - 1650;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 4);
            }
        }

    }
    criaArvore();

    var zteste2 = 2550;
    var xteste2 = 10000;
    function criaArvore2() {
        // create an object 3D - a cone de estrada
        var cont = 0;
        for (var i = 0; i < nArvores; i++) {
            objetoArvore = new THREE.Object3D();
            var geometryT = new THREE.CylinderGeometry(0, 1, 5);
            var materialT = new THREE.MeshBasicMaterial({ color: 0x196619, side: THREE.DoubleSide });
            var tree = new THREE.Mesh(geometryT, materialT);
            var geometryTronco = new THREE.CylinderGeometry(0.2, 0.2, 1);
            var materialTronco = new THREE.MeshBasicMaterial({ color: 0x6E2C00, side: THREE.DoubleSide });
            var tronco = new THREE.Mesh(geometryTronco, materialTronco);
            tronco.position.y = -3;
            objetoArvore.add(tree);
            objetoArvore.add(tronco);
            objetoArvore.position.set(xteste2, -1100, zteste2);
            //  objetoArvore.position.set(xteste, 10000 + 10000 * Math.cos(Math.PI / 180 * ((Math.PI/180)*(angulo+i))), 10000 * Math.sin(Math.PI / 180 * ((Math.PI/180)*(angulo+i))));
            objetoArvore.rotation.z = -Math.PI / 2;


            
            objetoArvore.scale.set(100, 100, 100);
            var axescarObstaculo = new THREE.AxisHelper(30000);
            axescarObstaculo.position.set(0, 0, 0);

            mundo.add(objetoArvore);
            zteste2 = zteste2 + 550;

            cont++;

            if (cont < 3) {

                xteste2 = xteste2 - 160;
                objetoArvore.rotation.y = -Math.PI / (6.5 + 0.1);
            } else if (cont > 2 && cont < 6) {

                xteste2 = xteste2 - 260;
                objetoArvore.rotation.y = -Math.PI / (6.5 + 0.1);
            } else if (cont > 5 && cont < 8) {

                xteste2 = xteste2 - 390;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 0.5);
            } else if (cont > 7 && cont < 10) {

                xteste2 = xteste2 - 500;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 1.5);
            } else if (cont > 9 && cont < 12) {

                xteste2 = xteste2 - 680;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 3);
            } else if (cont > 11 && cont < 14) {

                xteste2 = xteste2 - 1000;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 3.4);
            } else if (cont > 13 && cont < 15) {

                xteste2 = xteste2 - 1650;
                objetoArvore.rotation.y = -Math.PI / (6.5 - 4);
            }
        }

    }
    criaArvore2();

    //INICIO CRIAR CONES
    objetoCone = new THREE.Object3D();
    objetoCone2 = new THREE.Object3D();
    objetoCone3 = new THREE.Object3D();
    function criaCone(name, x2, y2, z2, r1, r2) {
        // create an object 3D - a cone de estrada
        var textureCone3 = new THREE.TextureLoader().load('cone.png');
        var geometryCone3 = new THREE.CylinderGeometry(0.2, 0.8, 2);
        var materialCone3 = new THREE.MeshBasicMaterial({ map: textureCone3, side: THREE.DoubleSide });
        var cone3 = new THREE.Mesh(geometryCone3, materialCone3);
        name.add(cone3);

        var geometryCone3 = new THREE.BoxGeometry(2, 0.1, 2);
        var materialCone3 = new THREE.MeshBasicMaterial({ color: 0xf39c12, side: THREE.DoubleSide });
        var botom3 = new THREE.Mesh(geometryCone3, materialCone3);

        name.add(cone3);
        //add the botom to the objetoCone
        name.add(botom3);
        botom3.position.y = -0.95;
        name.scale.set(100, 100, 100);
        var axesCone3 = new THREE.AxisHelper(30000);

        name.position.z = z2;
        name.position.x = x2;
        name.position.y = y2;

        name.rotation.x = r1;
        name.rotation.z = r2;
        mundo.add(name);

    }
    criaCone(objetoCone, 0, -700, -10100, -Math.PI / 2, 0);
    criaCone(objetoCone2, 10100 * Math.sin(30), 0, 10100 * Math.cos(30), Math.PI / 2, Math.PI / 2);
    criaCone(objetoCone3, 0, -700, 10100, Math.PI / 2, 0);

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


    //INICIO CRIAR BOLAS
    objetoBola1 = new THREE.Object3D();
    objetoBola2 = new THREE.Object3D();
    objetoBola3 = new THREE.Object3D();
    objetoBola4 = new THREE.Object3D();
    function criarBola(name, x1, y1, z1) {

        var textureBola4 = new THREE.TextureLoader().load('bola.jpg');
        var geometryBola4 = new THREE.SphereGeometry(0.8, 100, 100);
        var materialBola4 = new THREE.MeshBasicMaterial({ map: textureBola4, side: THREE.DoubleSide });
        var bola4 = new THREE.Mesh(geometryBola4, materialBola4);
        name.add(bola4);


        name.scale.set(100, 100, 100);
        var axesBola4 = new THREE.AxisHelper(10000);
        //objetoBola4.add(axesBola4);

        name.position.z = z1;
        name.position.x = x1;
        name.position.y = y1;

        name.rotation.y = Math.PI / 4;

        boxBola4 = new THREE.BoxHelper(axesBola4, 0xffff00);
        boxBola4.scale.set(0.00001, 0.00001, 0.00001);
        axesBola4.add(boxBola4);

        // add the objetoBola1 to the scene
        mundo.add(name);
    } //FIM função criaBola
    criarBola(objetoBola1, 10063 * Math.cos(57), 0, 10068 * Math.sin(57));
    criarBola(objetoBola2, 10063 * Math.cos(40), 700, 10068 * Math.sin(40));
    criarBola(objetoBola3, 10063 * Math.cos(12), 700, 10068 * Math.sin(12));
    criarBola(objetoBola4, 10063 * Math.cos(10), -700, 10100 * Math.sin(10));
    //FIM CRIAR BOLA 4


}

// car position
var pos = new THREE.Vector3(0, 0, 0);

// car angle
// by default, the car is facing +Z direction
// so, add a rotation of PI/2 to make the car facing -Z direction
var angle = Math.PI;
var teste;
var tempo=0;
var time;

function animate() {
    // console.log(camera.position.x)

    if (car != undefined) {

         time = document.getElementById("clock");
        BBoxCar = new THREE.Box3().setFromObject(car);
        var colidiu;

        //direcciona a camera para o carro
        cameraPositionLookAt();
        //cameraPositionTPV();
        if (right == true) {
            //limita a posição do carro à direita
            if (car.position.x < 750) {
                if (velocidade > 0) {
                    car.position.x += 30;
                    teste += 10;
                    camera.position.x += 30;
                    camera1.position.x += 30;
                    // camera.position.set(teste, 250, -70);
                    // console.log(car.position.x)
                }
            }

        }
        if (left == true) {
            //limita a posição do carro à esquerda
            if (car.position.x > -750) {
                if (velocidade > 0) {
                    car.position.x -= 30;
                    camera.position.x -= 30;
                    camera1.position.x -= 30;
                    //camera.position.set(teste, 250, -70);
                }
            }

        }
        if (forward == true) {
            //aumentar velocidade do carro
            velocidade += 0.00002;
            if (velocidade >= 0 && velocidade <= 0.005) {
                mundo.rotation.x += velocidade;
                // console.log(mundo.rotation.x);
            }
            else if (velocidade = 0.01) {
                mundo.rotation.x += 0.01;
            }

        }

        if (forward == false) {

            if (velocidade >= 0 && velocidade <= 0.01) {
                //diminuir velocidade do carro
                velocidade -= 0.00002;
                mundo.rotation.x += velocidade;
                // console.log(velocidade);
            }

        }

    }



    // animate using requestAnimationFrame
    // mundo.rotation.x += 0.01;
    // renderer.render(scene, camera1);
    if (cameraFrente == true)
        renderer.render(scene, camera1);
    else
        renderer.render(scene, camera);
    requestAnimationFrame(animate);

    BBoxCar = new THREE.Box3().setFromObject(car);
    BBoxObjetoCone = new THREE.Box3().setFromObject(objetoCone);
    BBoxObjetoCone2 = new THREE.Box3().setFromObject(objetoCone2);
    BBoxObjetoCone3 = new THREE.Box3().setFromObject(objetoCone3);

    BBoxObjetoBola1 = new THREE.Box3().setFromObject(objetoBola1);
    BBoxObjetoBola2 = new THREE.Box3().setFromObject(objetoBola2);
    BBoxObjetoBola3 = new THREE.Box3().setFromObject(objetoBola3);
    BBoxObjetoBola4 = new THREE.Box3().setFromObject(objetoBola4);

    BBoxcarObstaculo1 = new THREE.Box3().setFromObject(carObstaculo);
    BBoxcarObstaculo2 = new THREE.Box3().setFromObject(carObstaculo2);

    var collision, collision2, collision3; // checks collision between carro and cone
    var collision4, collision5, collision6, collision7; // checks collision between carro and bola
    var collision8, collision9;// checks collision between carro and carroObstáculo

    collision = BBoxCar.intersectsBox(BBoxObjetoCone);
    collision2 = BBoxCar.intersectsBox(BBoxObjetoCone2);
    collision3 = BBoxCar.intersectsBox(BBoxObjetoCone3);

    collision4 = BBoxCar.intersectsBox(BBoxObjetoBola1);
    collision5 = BBoxCar.intersectsBox(BBoxObjetoBola2);
    collision6 = BBoxCar.intersectsBox(BBoxObjetoBola3);
    collision7 = BBoxCar.intersectsBox(BBoxObjetoBola4);

    collision8 = BBoxCar.intersectsBox(BBoxcarObstaculo1);
    collision9 = BBoxCar.intersectsBox(BBoxcarObstaculo2);

    // console.log(collision3);

    if (collision == true) {
        //console.log('colidiu');
        velocidade = 0;

    
    }
    if (collision2 == true) {
        console.log('colidiu');
        velocidade = 0;
     

    }
    if (collision3 == true) {
        console.log('colidiu');
        velocidade = 0;
      

    }
    if (collision4 == true) {
        console.log('colidiu');
        velocidade = 0;
      
    }
    if (collision5 == true) {
        console.log('colidiu');
        velocidade = 0;
       
    }
    if (collision6 == true) {
        console.log('colidiu');
        velocidade = 0;
       
    }
    if (collision7 == true) {
        console.log('colidiu');
        velocidade = 0;
   
    }
    if (collision8 == true) {
        console.log('colidiu');
        // velocidade = 0;

    }
    if (collision9 == true) {
        console.log('colidiu');
        // velocidade = 0; 

    }
    if (collision7 == true ||collision6 == true || collision5 == true || collision4 == true || collision3 == true || collision2 == true || collision == true  ) {
        console.log('colidiu');
        swal(
            'Game Over!',
            'O jogo terminou!',
            'error'
        )
    }
}


function doKey(evt) {

    if (evt.keyCode == 87) {
        forward = true;

    }

    if (evt.keyCode == 68) {
        right = true;
    }

    if (evt.keyCode == 65) {
        left = true;

    }
    //teclas k e l para as cameras
    if (evt.keyCode == 76) {
        cameraFrente = true;

    }
    if (evt.keyCode == 75) {
        cameraFrente = false;

    }//

}

//quando largamos
function upKey(evt) {
    if (evt.keyCode == 87) {

        forward = false;

    }
    if (evt.keyCode == 68) {
        right = false;
    }

    if (evt.keyCode == 65) {
        left = false;
    }
}
