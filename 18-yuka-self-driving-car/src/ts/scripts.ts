import * as THREE from 'three';
import * as YUKA from 'yuka';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x777777);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 10, 15);
camera.lookAt(scene.position);

// Add lights
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Vehicle Yuka
const vehicle = new YUKA.Vehicle();

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
path.add(new YUKA.Vector3(-6, 0, 4));
path.add(new YUKA.Vector3(-11, 0, 0));
path.add(new YUKA.Vector3(-6, 0, -11));
path.add(new YUKA.Vector3(0, 0, 0));
path.add(new YUKA.Vector3(8, 0, -8));
path.add(new YUKA.Vector3(10, 0, 0));
path.add(new YUKA.Vector3(4, 0, 4));
path.add(new YUKA.Vector3(0, 0, 6));

path.loop = true;

const position = []; // (x, y, z)[]
for (let i = 0; i < path._waypoints.length; i++) {
  const waypoint = path._waypoints[i];
  position.push(waypoint.x, waypoint.y, waypoint.z);
}

vehicle.position.copy(path.current());

vehicle.maxSpeed = 3;

const followPathBehavior = new YUKA.FollowPathBehavior(path, 3); // steering looks more natural
vehicle.steering.add(followPathBehavior);

// follow the path closely
const onPathBehavior = new YUKA.OnPathBehavior(path);
// onPathBehavior.radius = 0.8;
vehicle.steering.add(onPathBehavior);

// Entity Manager
const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

// Loader
const loader = new GLTFLoader();
loader.load('./assets/SUV.glb', function (glb) {
  const model = glb.scene;
  // model.scale.set(0.5, 0.5, 0.5);
  scene.add(model);
  model.matrixAutoUpdate = false;
  vehicle.scale = new YUKA.Vector3(0.3, 0.3, 0.3);
  vehicle.setRenderComponent(model, sync);
});

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
