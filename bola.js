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
    var texture = new THREE.TextureLoader().load ('bola.jpg');
    var geometry3 = new THREE.SphereGeometry( 0.5, 32, 32 );
    var material3 = new THREE.MeshBasicMaterial( {map: texture} );
    var bola = new THREE.Mesh( geometry3, material3 );
    scene.add(bola);

    
    function animate() {
        // animate using requestAnimationFrame
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // call the animate function
    animate();

}