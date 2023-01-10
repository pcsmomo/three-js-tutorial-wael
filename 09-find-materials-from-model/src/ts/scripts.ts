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

const options = {
  Main: 0x2f3130,
  'Main light': 0x7c7c7c,
  'Main dark': 0x0a0a0a,
  Hooves: 0x0f0b0d,
  Hair: 0x0a0a0a,
  Muzzle: 0x0b0804,
  'Eye dark': 0x020202,
  'Eye white': 0xbebebe
};

// GLTF
const assetLoader = new GLTFLoader();

type CustomMaterial = THREE.Material & { color: THREE.Color };
type CustomMesh = THREE.SkinnedMesh<THREE.BufferGeometry, CustomMaterial>;

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
    // console.log(model.getObjectByName('Donkey')); // => console.log(model.children[0].children[0]);
    console.log(model.getObjectByName('Cube_1')); // => console.log(model.children[0].children[0].children[1]);
    // const cube1 = model.getObjectByName('Cube_1') as CustomMesh;
    // cube1.material.color.setHex(0x00ff00);
    // model.getObjectByName('Cube_1')?.material.color.setHex(0x00ff00);

    const cube = model.getObjectByName('Cube') as CustomMesh;
    const cube1 = model.getObjectByName('Cube_1') as CustomMesh;
    const cube2 = model.getObjectByName('Cube_2') as CustomMesh;
    const cube3 = model.getObjectByName('Cube_3') as CustomMesh;
    const cube4 = model.getObjectByName('Cube_4') as CustomMesh;
    const cube5 = model.getObjectByName('Cube_5') as CustomMesh;
    const cube6 = model.getObjectByName('Cube_6') as CustomMesh;
    const cube7 = model.getObjectByName('Cube_7') as CustomMesh;

    gui.addColor(options, 'Main').onChange(function (value) {
      cube.material.color.setHex(value);
    });
    gui.addColor(options, 'Main light').onChange(function (value) {
      cube1.material.color.setHex(value);
    });
    gui.addColor(options, 'Main dark').onChange(function (value) {
      cube2.material.color.setHex(value);
    });
    gui.addColor(options, 'Hooves').onChange(function (value) {
      cube3.material.color.setHex(value);
    });
    gui.addColor(options, 'Hair').onChange(function (value) {
      cube4.material.color.setHex(value);
    });
    gui.addColor(options, 'Muzzle').onChange(function (value) {
      cube5.material.color.setHex(value);
    });
    gui.addColor(options, 'Eye dark').onChange(function (value) {
      cube6.material.color.setHex(value);
    });
    gui.addColor(options, 'Eye white').onChange(function (value) {
      cube7.material.color.setHex(value);
    });
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
