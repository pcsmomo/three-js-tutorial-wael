import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import gsap from 'gsap';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xa3a3a3);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// add light
const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 20, -20);

// load models
const assetLoader = new GLTFLoader();

let mixer: THREE.AnimationMixer;
let mixer2: THREE.AnimationMixer;
let mixer3: THREE.AnimationMixer;

assetLoader.load(
  '../assets/phoenix/scene.gltf',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    const model2 = SkeletonUtils.clone(model);
    const model3 = SkeletonUtils.clone(model);

    scene.add(model);
    scene.add(model2);
    scene.add(model3);

    model2.position.set(7, -4, 6);
    model3.position.set(-7, 4, -2);

    mixer = new THREE.AnimationMixer(model);
    mixer2 = new THREE.AnimationMixer(model2);
    mixer3 = new THREE.AnimationMixer(model3);

    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Take 001');

    const action = mixer.clipAction(clip);
    const action2 = mixer2.clipAction(clip);
    const action3 = mixer3.clipAction(clip);

    action.play();
    action.timeScale = 0.5;
    action2.play();
    action2.startAt(0.2);
    action2.timeScale = 0.5;
    action3.play();
    action2.startAt(0.35);
    action3.timeScale = 0.5;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const clock = new THREE.Clock();
function animate() {
  // model animation
  const delta = clock.getDelta();
  if (mixer && mixer2 && mixer3) {
    mixer.update(delta);
    mixer2.update(delta);
    mixer3.update(delta);
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
