import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import nebula from '../img/nebula.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 12);
orbit.update();

// add Sun
const geo = new THREE.PlaneGeometry(10, 10, 30, 30);
const mat = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexShader')?.textContent || '',
  fragmentShader: document.getElementById('fragmentShader')?.textContent || '',
  wireframe: true
});

const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
