import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// camera.position.z = 5
// camera.position.y = 2
camera.position.set(0, 2, 5)

// add Helper Axes
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// add Box
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

renderer.render(scene, camera)
