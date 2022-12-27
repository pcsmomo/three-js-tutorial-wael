import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const renderer = new THREE.WebGLRenderer()

// renderer options
renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// orbit
const orbit = new OrbitControls(camera, renderer.domElement)

// camera.position.z = 5
// camera.position.y = 2
camera.position.set(-10, 30, 30)
orbit.update() // everytime camera position changes

// add Helpers
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

// add Box
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

// add Plane
const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
plane.receiveShadow = true

// add Sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff
  // wireframe: true
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 10, 0)
sphere.castShadow = true

// Lights
// const ambientLight = new THREE.AmbientLight(0x33333)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12 // make shadow camera size bigger

// // light/shadow helpers
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

const spotLight = new THREE.SpotLight(0xffffff)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true
spotLight.angle = 0.2

const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

// GUI
const gui = new dat.GUI()
const options = {
  sphereColor: '#ffea00',
  wireframe: false,
  speed: 0.01,
  angle: 0.1,
  penumbra: 0.2,
  intensity: 1
}

gui.addColor(options, 'sphereColor').onChange(function (e) {
  sphere.material.color.set(e)
})

gui.add(options, 'wireframe').onChange(function (e) {
  sphere.material.wireframe = e
})

gui.add(options, 'speed', 0, 0.1)
gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

let step = 0

function animate(time) {
  box.rotation.x = time / 1000
  box.rotation.y = time / 1000

  step += options.speed
  sphere.position.y = 10 * Math.abs(Math.sin(step))

  spotLight.angle = options.angle
  spotLight.penumbra = options.penumbra
  spotLight.intensity = options.intensity
  sLightHelper.update()

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
