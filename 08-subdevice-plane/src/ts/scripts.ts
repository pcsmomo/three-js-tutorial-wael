import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 15, -22);
orbit.update();

// basic meshes
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    visible: false
  })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.name = 'ground';

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true
  })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

// mouse and raycaster
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = [];

window.addEventListener('mousemove', function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach(function (intersect) {
    if (intersect.object.name === 'ground') {
      const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
      highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);

      // change color of highlightMesh if object exists
      const objectExists = doesObjectExists();
      highlightMesh.material.color.setHex(objectExists ? 0xff0000 : 0xffffff);
    }
  });
});

// sphereMesh that will be generated on mouse click
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 4, 2),
  new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffea00
  })
);

const objects: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
function doesObjectExists() {
  return objects.find(function (object) {
    return object.position.x === highlightMesh.position.x && object.position.z === highlightMesh.position.z;
  });
}

window.addEventListener('mousedown', function () {
  const objectExists = doesObjectExists();
  if (objectExists) return;

  intersects.forEach(function (intersect) {
    if (intersect.object.name === 'ground') {
      const sphereClone = sphereMesh.clone();
      // sphereClone.position.copy(highlightMesh.position);
      sphereClone.position.set(highlightMesh.position.x, highlightMesh.position.y + 0.4, highlightMesh.position.z);
      scene.add(sphereClone);
      objects.push(sphereClone);
    }
  });
  // console.log(scene.children.length);
});

function animate(time: number) {
  highlightMesh.material.opacity = 1 + Math.sin(time / 120);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
