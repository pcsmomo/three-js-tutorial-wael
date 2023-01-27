import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xa3a3a3);

// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.movementSpeed = 8;
// controls.lookSpeed = 0.08;

camera.position.set(-1.7, 0, 8.7);
camera.lookAt(1.7, 0, 8.7);

// loaders
const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar') as HTMLProgressElement;

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
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

  window.addEventListener('mouseup', function () {
    console.log(camera.position);
    gsap.to(camera.position, {
      x: -1.8,
      y: 1.6,
      z: 5,
      duration: 3
    });

    gsap.to(camera.rotation, {
      x: 0,
      y: 0.1,
      z: 0,
      duration: 3.2
    });
  });
});

// const clock = new THREE.Clock();
function animate() {
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
