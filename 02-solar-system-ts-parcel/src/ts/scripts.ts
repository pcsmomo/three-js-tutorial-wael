import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import starsTexture from '../assets/img/stars.jpg'; // global.d.ts is needed
import sunTexture from '../assets/img/sun.jpg';
import mercuryTexture from '../assets/img/mercury.jpg';
import venusTexture from '../assets/img/venus.jpg';
import earthTexture from '../assets/img/earth.jpg';
import marsTexture from '../assets/img/mars.jpg';
import jupiterTexture from '../assets/img/jupiter.jpg';
import saturnTexture from '../assets/img/saturn.jpg';
import saturnRingTexture from '../assets/img/saturn ring.png';
import uranusTexture from '../assets/img/uranus.jpg';
import uranusRingTexture from '../assets/img/uranus ring.png';
import neptuneTexture from '../assets/img/neptune.jpg';
import plutoTexture from '../assets/img/pluto.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture
]);

const textureLoader = new THREE.TextureLoader();

// add Sun
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// create planets
type Ring = { innerRadius: number; outerRadius: number; texture: string };
function createPlanet(size: number, texture: string, position: number, ring?: Ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  // create a ring
  if (ring) {
    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  scene.add(obj);
  mesh.position.x = position;

  return { mesh, obj };
}

// create all planets in the galaxy
const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturnRing = {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
};
const saturn = createPlanet(10, saturnTexture, 138, saturnRing);
const uranusRing = {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture
};
const uranus = createPlanet(7, uranusTexture, 176, uranusRing);
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

// Light
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
  // // Self-rotation
  // sun.rotateY(0.004);
  // mercury.mesh.rotateY(0.004);
  // venus.mesh.rotateY(0.002);
  // earth.mesh.rotateY(0.02);
  // mars.mesh.rotateY(0.018);
  // jupiter.mesh.rotateY(0.04);
  // saturn.mesh.rotateY(0.038);
  // uranus.mesh.rotateY(0.03);
  // neptune.mesh.rotateY(0.032);
  // pluto.mesh.rotateY(0.008);

  // // Orbital revolution (Around-sun-rotation)
  // mercury.obj.rotateY(0.04);
  // venus.obj.rotateY(0.015);
  // earth.obj.rotateY(0.01);
  // mars.obj.rotateY(0.008);
  // jupiter.obj.rotateY(0.002);
  // saturn.obj.rotateY(0.0009);
  // uranus.obj.rotateY(0.0004);
  // neptune.obj.rotateY(0.0001);
  // pluto.obj.rotateY(0.00007);

  // Noah's calculation
  // Self-rotation
  sun.rotateY(0.00073);
  mercury.mesh.rotateY(0.00034);
  venus.mesh.rotateY(0.00008);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.01922);
  jupiter.mesh.rotateY(0.04829);
  saturn.mesh.rotateY(0.044);
  uranus.mesh.rotateY(0.0275);
  neptune.mesh.rotateY(0.02955);
  pluto.mesh.rotateY(0.0031);

  // Orbital revolution (Around-sun-rotation)
  mercury.obj.rotateY(0.04167);
  venus.obj.rotateY(0.01639);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.00532);
  jupiter.obj.rotateY(0.00084);
  saturn.obj.rotateY(0.00034);
  uranus.obj.rotateY(0.00012);
  neptune.obj.rotateY(0.00006);
  pluto.obj.rotateY(0.00004);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
