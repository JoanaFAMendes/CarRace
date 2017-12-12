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
    var geometryT = new THREE.CylinderGeometry(0,1,5);
    var materialT = new THREE.MeshBasicMaterial( {color: 0x196619, side: THREE.DoubleSide} );
    var tree = new THREE.Mesh( geometryT, materialT );
    var geometryTronco = new THREE.CylinderGeometry(0.2,0.2,1);
    var materialTronco = new THREE.MeshBasicMaterial( {color: 0x6E2C00, side: THREE.DoubleSide} );
    var tronco = new THREE.Mesh( geometryTronco, materialTronco );
    tronco.position.y=-3;
    tree.add(tronco);
    tree.position.y=1;
    scene.add( tree );

    
    function animate() {
        // animate using requestAnimationFrame
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // call the animate function
    animate();

}