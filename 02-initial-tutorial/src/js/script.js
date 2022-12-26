import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// orbit
const orbit = new OrbitControls(camera, renderer.domElement)

// camera.position.z = 5
// camera.position.y = 2
camera.position.set(-10, 20, 20)
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
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI

// add Sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff
  // wireframe: true
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 10, 0)

// GUI
const gui = new dat.GUI()
const options = {
  sphereColor: '#ffea00'
}

gui.addColor(options, 'sphereColor').onChange(function (e) {
  sphere.material.color.set(e)
})

function animate(time) {
  box.rotation.x = time / 1000
  box.rotation.y = time / 1000
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
