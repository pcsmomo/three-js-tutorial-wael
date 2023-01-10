import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';

const fileUrl = new URL('../assets/Donkey.gltf', import.meta.url);

// Renderer
const renderer = new THREE.WebGLRenderer();

// renderer options
renderer.setClearColor(0xa3a3a3);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// orbit
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update(); // everytime camera position changes

// add Helpers
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

// Lights
const ambientLight = new THREE.AmbientLight(0xededded, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

// GUI
const gui = new dat.GUI();

// GLTF
const assetLoader = new GLTFLoader();

// GLTFLoader.load(
//   url: string,
//   onLoad: (gltf: GLTF) => void,
//   onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined,
//   onError?: ((event: ErrorEvent) => void) | undefined): void
assetLoader.load(
  fileUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // inefficient way to find materials
    // console.log(model);
    // console.log(model.children[0].children[0]);
    // console.log(model.children[0].children[0].children[1]);

    // efficient way to find materials
    console.log(model.getObjectByName('Donkey')); // => console.log(model.children[0].children[0]);
    console.log(model.getObjectByName('Cube_1')); // => console.log(model.children[0].children[0].children[1]);
    // const cube1 = model.getObjectByName('Cube_1') as THREE.SkinnedMesh;
    // cube1.material.color.setHex(0x00ff00);
    model.getObjectByName('Cube_1')?.material.color.setHex(0x00ff00);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// resize
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
