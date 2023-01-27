import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xa3a3a3);

camera.position.set(-1.7, 0, 8.7);
camera.lookAt(1.7, 0, 8.7);

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

let position = 0;

// load model
gltfLoader.load('./assets/kings-hall/scene.gltf', function (gltf) {
  const model = gltf.scene;
  scene.add(model);

  window.addEventListener('mouseup', function () {
    switch (position) {
      case 0:
        moveCamera(-1.8, 1.6, 5);
        rotateCamera(0, 0.1, 0);
        position = 1;
        break;
      case 1:
        moveCamera(2.8, 0, 3.6);
        rotateCamera(0, -2, 0);
        position = 2;
        break;
      case 2:
        moveCamera(2.5, -0.9, 12.2);
        rotateCamera(0.9, 0.6, -0.6);
        position = 3;
        break;
      case 3:
        moveCamera(-2.7, 0.6, 3.7);
        rotateCamera(0.6, 1.9, -0.6);
        position = 4;
        break;
      case 4:
        moveCamera(-1.7, 0, 8.7);
        rotateCamera(0, 4.7, 0);
        position = 5;
        break;
      case 5:
        moveCamera(0.5, 0.8, 10);
        rotateCamera(0.3, 1.65, -0.3);
        position = 0;
        break;
    }
  });

  window.addEventListener('keypress', function () {
    const { x: pX, y: pY, z: pZ } = camera.position;
    const { x: rX, y: rY, z: rZ } = camera.rotation;
    console.info(`pos: (${pX}, ${pY}, ${pZ}), rotate: (${rX}, ${rY}, ${rZ})`);
  });

  function moveCamera(x: number, y: number, z: number) {
    gsap.to(camera.position, {
      x,
      y,
      z,
      duration: 3
    });
  }

  function rotateCamera(x: number, y: number, z: number) {
    gsap.to(camera.rotation, {
      x,
      y,
      z,
      duration: 3.2
    });
  }
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
