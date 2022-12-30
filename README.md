# Three.js Tutorial

Three.js Tutorial by Wael Yasmina

## folder structures

- 01-initial-tutorial
  - everything
- 02-solar-system
- 02-z1-solar-system-ts
- x01-impossibox
  - interesting cube box in TypeScript by [kandabi](https://github.com/kandabi/threejs-impossibox)

# Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## 1. WebGL In A Nutshell

- OpenGL
- WebGL
  - Shaders
    - Vertex Shader
    - Fragment Shader
- GLSL ES
- WebGPU
  - babylon.js

## 2. Three.js Tutorial For Absolute Beginners

```sh
npm install parcel --save-dev
npm install three

parcel ./src/index.html
```

### Camera types

1. Perspective Camera: depending on angle, the sizes are different
2. Orthographic Camera: same size from the front view

### MeshStandardMaterial

MeshStandardMaterial needs

[npm dat.gui](https://www.npmjs.com/package/dat.gui) - A lightweight graphical user interface for changing variables in JavaScript

```sh
npm install dat.gui
```

## 2-1. Solar system in TypeScript

```sh
tsc --init
```

## 3. How To Export 3D Models With Their Animation From Blender And Import Them Into Your Three.js App

[three.js editor(playground)](https://threejs.org/editor)

### Lights

- AmbientLight: e.g. Daylight
- DirectionalLight: e.g. Sunlight
- SpotLight

</details>
