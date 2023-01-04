import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);
orbit.update();

// add meshes
const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

// World
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0) // m/s²
});

const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(),
  // mass: 10,
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)), // same size as groundGeo or half..?
  type: CANNON.Body.STATIC
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), // same size as boxGeo
  position: new CANNON.Vec3(1, 20, 0)
});
world.addBody(boxBody);

boxBody.angularVelocity.set(0, 5, 0);
boxBody.angularDamping = 0.2;

const sphereBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Sphere(2), // same radius as sphereGeo
  position: new CANNON.Vec3(0, 15, 0)
});
world.addBody(sphereBody);

sphereBody.linearDamping = 0.312;

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);

  groundMesh.position.copy(groundBody.position as any); // those types aren't exactly same
  groundMesh.quaternion.copy(groundBody.quaternion as any);
  boxMesh.position.copy(boxBody.position as any); // those types aren't exactly same
  boxMesh.quaternion.copy(boxBody.quaternion as any);
  sphereMesh.position.copy(sphereBody.position as any); // those types aren't exactly same
  sphereMesh.quaternion.copy(sphereBody.quaternion as any);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
