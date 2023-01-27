import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xa3a3a3);

camera.position.set(-1.7, 0, 8.7);
camera.lookAt(1.7, 0, 8.7);

// GUI
const gui = new dat.GUI();

const options = {
  'position X': -1.7,
  'position Y': 0,
  'position Z': 8.7,
  'rotation X': 0,
  'rotation Y': -1.57,
  'rotation Z': 0
};

gui.add(options, 'position X', -5, 5);
gui.add(options, 'position Y', -2, 3);
gui.add(options, 'position Z', -2, 16);
gui.add(options, 'rotation X', -10, 10);
gui.add(options, 'rotation Y', -4.7, 1.7);
gui.add(options, 'rotation Z', -3.5, 3.5);

// loaders
const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar') as HTMLProgressElement;

loadingManager.onProgress = function (_url, itemsLoaded, itemsTotal) {
  // console.info('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  const progress = (itemsLoaded / itemsTotal) * 100;
  progressBar.value = progress;
};

const progressBarContainer = document.querySelector('.progress-bar-container') as HTMLElement;
loadingManager.onLoad = function () {
  console.info('Loading complete!');
  progressBarContainer.style.display = 'none';
};

// load models
const gltfLoader = new GLTFLoader(loadingManager);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// load model
gltfLoader.load('./assets/kings-hall/scene.gltf', function (gltf) {
  const model = gltf.scene;
  scene.add(model);
});

window.addEventListener('keypress', function () {
  const { x: pX, y: pY, z: pZ } = camera.position;
  const { x: rX, y: rY, z: rZ } = camera.rotation;
  console.info(`pos: (${pX}, ${pY}, ${pZ}), rotate: (${rX}, ${rY}, ${rZ})`);
});

function animate() {
  renderer.render(scene, camera);

  const pX = options['position X'];
  const pY = options['position Y'];
  const pZ = options['position Z'];
  const rX = options['rotation X'];
  const rY = options['rotation Y'];
  const rZ = options['rotation Z'];

  camera.position.set(pX, pY, pZ);
  camera.rotation.set(rX, rY, rZ);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
