import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let isMouseDown = false;
let oldX = 0;
let oldY = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.body.addEventListener("mousemove", (e) => {

    if (isMouseDown) {
        cube.rotation.y += (e.screenX - oldX) / 30
        cube.rotation.x += (e.screenY - oldY) / 30
        renderer.render(scene, camera)
        oldX = e.screenX
        oldY = e.screenY
    }
})

document.body.addEventListener("mousedown", function (e) {
    isMouseDown = true
    oldX = e.screenX
    oldY = e.screenY
})

document.body.addEventListener("mouseup", function (event) {
    isMouseDown = false
})

renderer.render(scene, camera);

// cube.rotation.y = 3.14

// renderer.render(scene, camera);



// function animate() {
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// }
// animate();