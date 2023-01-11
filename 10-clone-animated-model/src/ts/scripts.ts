import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const modelUrl = new URL('../assets/Stag.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setClearColor(0xa3a3a3);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 6, 10);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(3, 3, 3);

// GLTF
const assetLoader = new GLTFLoader();

// let mixer: THREE.AnimationMixer;
// GLTFLoader.load(
//   url: string,
//   onLoad: (gltf: GLTF) => void,
//   onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined,
//   onError?: ((event: ErrorEvent) => void) | undefined): void
assetLoader.load(
  modelUrl.href,
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    scene.add(model);
    // mixer = new THREE.AnimationMixer(model);
    // const clips = gltf.animations;
    // const clip = THREE.AnimationClip.findByName(clips, 'Idle_2');
    // const action = mixer.clipAction(clip);
    // action.play();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    visible: false
  })
);
scene.add(planeMesh);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.name = 'ground';

// add helper
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

// sphereMesh
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
      highlightMesh.material.color.setHex(0xff0000);
    }
  });
  // console.log(scene.children.length);
});

const clock = new THREE.Clock();
function animate(time: number) {
  highlightMesh.material.opacity = 1 + Math.sin(time / 120);
  objects.forEach(function (object) {
    object.rotation.x = time / 1000;
    object.rotation.z = time / 1000;
    object.rotation.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
  });

  // Update the mixer on each frame
  // if (mixer) mixer.update(clock.getDelta());

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});