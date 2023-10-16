import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// --- Tạo Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- Tạo Camera ---
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);

// --- Tạo Scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);

// --- Tạo Lights ---
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 4, 4);
dirLight.castShadow = true;

dirLight.shadow.camera.top = 5;
dirLight.shadow.camera.bottom = -5;
dirLight.shadow.camera.left = -5;
dirLight.shadow.camera.right = 5;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 20;

scene.add(dirLight);

// --- Tạo Cube ---
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00cc88 });
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.y = 0.5; // Đặt tâm của cube ở mức y = 0.5, giúp nó "đứng" trên nền
// cube.castShadow = true;
// scene.add(cube);

// --- Tạo Plane (Nền) ---
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// --- Tạo Controls (để có thể điều khiển camera) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- Tạo modal di chuyển

var mainCharGLTF;
const loader = new GLTFLoader();
var mixers = [];
var model1;
var mixer1;
let clock = new THREE.Clock();


loader.load('models/gltf/Soldier.glb', function (gltf) {
    mainCharGLTF = gltf;
    gltf.scene.traverse(function (object) {

        if (object.isMesh) object.castShadow = true;

    });

    model1 = SkeletonUtils.clone(mainCharGLTF.scene);

    mixer1 = new THREE.AnimationMixer(model1);

    mixer1.clipAction(mainCharGLTF.animations[0]).play(); // idle

    scene.add(model1)
    mixers.push(mixer1);

    animate();
});

// --- Xử lý hoạt ảnh model

function walk() {
    mixers = []
    scene.remove(model1);
    model1 = SkeletonUtils.clone(mainCharGLTF.scene);

    mixer1 = new THREE.AnimationMixer(model1);

    mixer1.clipAction(mainCharGLTF.animations[3]).play(); // idle
    scene.add(model1);
    mixers.push(mixer1);
    camera.lookAt(model1)
}

function standUp() {
    mixers = []
    scene.remove(model1);
    model1 = SkeletonUtils.clone(mainCharGLTF.scene);

    mixer1 = new THREE.AnimationMixer(model1);

    mixer1.clipAction(mainCharGLTF.animations[0]).play(); // idle
    scene.add(model1);
    mixers.push(mixer1);
}

// --- Hàm render/animation ---
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    const delta = clock.getDelta();

    for (const mixer of mixers) mixer.update(delta);

    renderer.render(scene, camera);
}

animate();

// --- Bắt sự kiện các nút ---

window.addEventListener("keydown", (e) => {
    console.log(e);
    switch (e.code) {
        case 'ArrowUp':
            model1.lookAt(camera.position.x, 0, camera.position.z)
            if (e.repeat) return;
            walk();
            break;
        case 'ArrowDown':
            model1.lookAt(-camera.position.x, 0, -camera.position.z)
            break;
        case 'ArrowRight':
            model1.rotation.y = -Math.PI / 2;
            break;
        case 'ArrowLeft':
            model1.rotation.y = Math.PI / 2;
            break;
    }
})


window.addEventListener("keyup", (e) => {
    console.log('keyup');
    switch (e.code) {
        case 'ArrowUp':
            standUp();
            break;
        case 'ArrowDown':
            model1.lookAt(-camera.position.x, 0, -camera.position.z)
            break;
        case 'ArrowRight':
            model1.rotation.y = -Math.PI / 2;
            break;
        case 'ArrowLeft':
            model1.rotation.y = Math.PI / 2;
            break;
    }
})
