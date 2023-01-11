import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

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

let stag: THREE.Group;
let clips: THREE.AnimationClip[];
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
    // scene.add(model);
    stag = model;
    clips = gltf.animations;
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

const objects: THREE.Object3D<THREE.Event>[] = [];
const mixers: THREE.AnimationMixer[] = [];
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
      const stagClone = SkeletonUtils.clone(stag);
      stagClone.position.copy(highlightMesh.position);
      // stagClone.position.set(highlightMesh.position.x, highlightMesh.position.y + 0.4, highlightMesh.position.z);
      scene.add(stagClone);
      objects.push(stagClone);
      highlightMesh.material.color.setHex(0xff0000);

      const mixer = new THREE.AnimationMixer(stagClone);
      const clip = THREE.AnimationClip.findByName(clips, 'Idle_2');
      const action = mixer.clipAction(clip);
      action.play();
      mixers.push(mixer);
    }
  });
  // console.log(scene.children.length);
});

const clock = new THREE.Clock();
function animate(time: number) {
  highlightMesh.material.opacity = 1 + Math.sin(time / 120);
  // objects.forEach(function (object) {
  //   object.rotation.x = time / 1000;
  //   object.rotation.z = time / 1000;
  //   object.rotation.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
  // });

  const delta = clock.getDelta();
  mixers.forEach(function (mixer) {
    // Update the mixer on each frame
    mixer.update(delta);
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
