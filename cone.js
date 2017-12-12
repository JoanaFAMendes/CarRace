// once everything is loaded, we run our Three.js stuff
window.onload = function init() {

    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at
    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(scene.position); //point the camera to the center of the scene (default)

    

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    // create an object 3D - a cone de estrada
    var texture = new THREE.TextureLoader().load ('cone.png');
    var geometry = new THREE.CylinderGeometry(0.2, 0.8, 2);
    var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
    var cone = new THREE.Mesh( geometry, material );

    var geometry2 = new THREE.BoxGeometry(2, 0.1, 2);
    var material2 = new THREE.MeshBasicMaterial( {color: 0xf39c12, side: THREE.DoubleSide} );
    var botom = new THREE.Mesh( geometry2, material2 );
    // add the cube to the scene
    botom.position.y=-0.9;
    cone.add(botom);
    scene.add(cone);

    
    function animate() {
        // animate using requestAnimationFrame
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // call the animate function
    animate();

}