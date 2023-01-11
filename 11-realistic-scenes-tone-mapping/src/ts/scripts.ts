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

// function pickRandomImage() {
//   return hrdImages[Math.floor(Math.random() * hrdImages.length)];
// }

// const hrdTextureUrl = new URL(`../img/${pickRandomImage()}`, import.meta.url);
const hrdTextureUrl = new URL(`../img/${hrdImages[2]}`, import.meta.url);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 12);
orbit.update();

// Gamma correction
renderer.outputEncoding = THREE.sRGBEncoding;

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const loader = new RGBELoader();
loader.load(hrdTextureUrl.href, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture; // this can be omitted
  scene.environment = texture; // this can be applied to the objects

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0, // 0.0 means a smooth mirror reflection, 1.0 means fully diffuse.
      metalness: 0.5, // Non-metallic materials such as wood or stone use 0.0, metallic use 1.0,
      color: 0xffea00
    })
  );
  scene.add(sphere);
  sphere.position.x = -1.5;

  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0, // 0.0 means a smooth mirror reflection, 1.0 means fully diffuse.
      metalness: 0.5, // Non-metallic materials such as wood or stone use 0.0, metallic use 1.0,
      color: 0x00ff00
      // envMap: texture
    })
  );
  scene.add(sphere2);
  sphere2.position.x = 1.5;
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
