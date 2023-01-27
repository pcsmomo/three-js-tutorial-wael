import * as THREE from 'three';
import * as YUKA from 'yuka';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

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

// Path
const path = new YUKA.Path();
path.add(new YUKA.Vector3(-4, 0, 4));
path.add(new YUKA.Vector3(-6, 0, 0));
path.add(new YUKA.Vector3(-4, 0, -4));
path.add(new YUKA.Vector3(0, 0, 0));
path.add(new YUKA.Vector3(4, 0, -4));
path.add(new YUKA.Vector3(6, 0, 0));
path.add(new YUKA.Vector3(4, 0, 4));
path.add(new YUKA.Vector3(0, 0, 6));

vehicle.position.copy(path.current());

const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
vehicle.steering.add(followPathBehavior);

// Entity Manager
const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

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
