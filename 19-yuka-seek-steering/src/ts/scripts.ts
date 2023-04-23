import * as THREE from 'three';
import * as YUKA from 'yuka';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 20, 0);
camera.lookAt(scene.position);

// Vehicle Mesh
const vehicleGeo = new THREE.ConeGeometry(0.1, 0.5, 8);
vehicleGeo.rotateX(Math.PI * 0.5);
const vehicleMat = new THREE.MeshNormalMaterial();
const vehicleMesh = new THREE.Mesh(vehicleGeo, vehicleMat);
vehicleMesh.matrixAutoUpdate = false;
scene.add(vehicleMesh);

// Vehicle Yuka
const vehicle = new YUKA.Vehicle();
vehicle.setRenderComponent(vehicleMesh, sync);

function sync(entity: YUKA.GameEntity, renderComponent: any) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

// Target
const targetGeo = new THREE.SphereGeometry(0.1);
const targetMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
const targetMesh = new THREE.Mesh(targetGeo, targetMat);
targetMesh.matrixAutoUpdate = false; // it will be handled by YUKA entity manager
scene.add(targetMesh);

const target = new YUKA.GameEntity();
target.setRenderComponent(targetMesh, sync);

// Entity Manager
const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);
entityManager.add(target);

// seek behavior
const seekBehavior = new YUKA.SeekBehavior(target.position);
vehicle.steering.add(seekBehavior);

// initial vehicle position
vehicle.position.set(-2, 0, -2);

// random target position
setInterval(function () {
  const x = Math.random() * 3;
  const y = Math.random() * 3;
  const z = Math.random() * 3;

  target.position.set(x, y, z);
}, 2000);

const time = new YUKA.Time();
function animate() {
  const delta = time.update().getDelta();
  entityManager.update(delta);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
