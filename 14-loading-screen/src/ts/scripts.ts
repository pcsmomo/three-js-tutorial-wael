import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xa3a3a3);

// Controls
const controls = new FirstPersonControls(camera, renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);

controls.lookSpeed = 0.08;
orbit.update();

camera.position.set(5, 8, 30);

// loaders
const gltfLoader = new GLTFLoader();

const rgbeLoader = new RGBELoader();

// apply sRGB encoding (HDR background)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// load background
rgbeLoader.load('./assets/MR_INT-006_LoftIndustrialWindow_Griffintown.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  // load model
  gltfLoader.load('./assets/mars-one-mission/scene.gltf', function (gltf) {
    const model = gltf.scene;
    scene.add(model);
  });
});

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
