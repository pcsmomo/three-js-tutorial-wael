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

// @types/yuka version is outdated
type Path = YUKA.Path & {
  _waypoints: YUKA.Vector3[];
  _index: number;
};

// Path
// @ts-ignore
const path: Path = new YUKA.Path();
path.add(new YUKA.Vector3(-4, 0, 4));
path.add(new YUKA.Vector3(-6, 0, 0));
path.add(new YUKA.Vector3(-4, 0, -4));
path.add(new YUKA.Vector3(0, 0, 0));
path.add(new YUKA.Vector3(4, 0, -4));
path.add(new YUKA.Vector3(6, 0, 0));
path.add(new YUKA.Vector3(4, 0, 4));
path.add(new YUKA.Vector3(0, 0, 6));

path.loop = true;

vehicle.position.copy(path.current());

const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
vehicle.steering.add(followPathBehavior);

vehicle.maxSpeed = 3;

// Entity Manager
const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const position = []; // (x, y, z)[]
for (let i = 0; i < path._waypoints.length; i++) {
  const waypoint = path._waypoints[i];
  position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
const lines = new THREE.LineLoop(lineGeo, lineMat);
scene.add(lines);

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
