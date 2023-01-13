import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xa3a3a3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(6, 6, 6);
orbit.update();

// add helper
const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

// remove lights as it's a HDR background reflecting light
// const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight);
// directionalLight.position.set(10, 11, 7);

// loaders
const gltfLoader = new GLTFLoader();

const rgbeLoader = new RGBELoader();

// apply sRGB encoding (HDR background)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

let car: THREE.Group;

// load background
rgbeLoader.load('./assets/MR_INT-005_WhiteNeons_NAD.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  // load model
  gltfLoader.load('./assets/porsche/scene.gltf', function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    car = model;
  });
});

let isAnimating = true;
function animate(time: number) {
  if (car && isAnimating) {
    // car.rotation.y = -time / 5000;
    car.rotation.y -= 0.003;
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', function (e) {
  // alt or cmd key was pressed
  if (e.altKey || e.metaKey) {
    isAnimating = !isAnimating;
  }
});
