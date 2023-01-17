import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

// add Box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.position.y = 0.5;

// let z: number;
// const zFinal = 14;
window.addEventListener('mousedown', function () {
  // z = camera.position.z;
  gsap.to(camera.position, {
    z: 14,
    duration: 1.5,
    onUpdate: function () {
      camera.lookAt(0, 0, 0);
    }
  });

  gsap.to(camera.position, {
    y: 10,
    duration: 1.5,
    onUpdate: function () {
      camera.lookAt(0, 0, 0);
    }
  });
});

function animate() {
  // z += 0.1;
  // if (z < zFinal) {
  //   camera.position.z = z;
  //   camera.lookAt(0, 0, 0);
  // }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
