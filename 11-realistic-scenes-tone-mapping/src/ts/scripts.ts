import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const hrdImages = [
  'MR_INT-001_NaturalStudio_NAD.hdr',
  'MR_INT-002_BathroomHard_Pierre.hdr',
  'MR_INT-003_Kitchen_Pierre.hdr',
  'MR_INT-004_BigWindowTree_Thea.hdr',
  'MR_INT-005_WhiteNeons_NAD.hdr',
  'MR_INT-006_LoftIndustrialWindow_Griffintown.hdr'
];

const hrdTextureUrl = new URL(`../img/${hrdImages[2]}`, import.meta.url);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 7);
orbit.update();

const loader = new RGBELoader();
loader.load(hrdTextureUrl.href, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
