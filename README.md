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

## 4. GLSL & Shaders Tutorial - Understanding The Syntax And The Idea Behind The Vertex & Fragment Shaders

- GLSL: OpenGL Shading Language
- Browser (Javascript) -> GPU (Monitor)

### Math for game devs such as vectors, and so on

https://www.youtube.com/@Acegikmo/playlists

### Vectors

- vec
  - vec2
  - vec3
  - vec4
- ivec
  - ivec2
  - ivec3
  - ivec4
- bvec
  - bvec2
  - bvec3
  - bvec4

```js
vec2 vectA = vec2(1.0, 6.0);
bvec4 vectB = bvec4(true, true, false, false);

// Same as: vec3 vectC = vec3(0.0, 0.0, 0.0);
vec3 vectC = vec3(0.0);

// vectD value is: vec2(0.0, 0.0);
vec2 vectD = vec2(vectC);

//vectE value is: vec4(0.0, 0.0, 1.0, 6.0);
vec4 vectE = vec4(vectC, vectA);
```

### Vectors2

```js
vec4 vect = vec4(1.0, 2.0, 3.0, 4.0);

// a1 == a2 == a3 == 1.0
flaot a1 = vect.x;
flaot a2 = vect.r;
flaot a3 = vect.s;

// b1 == b2 == b3 == 2.0
flaot b1 = vect.y;
flaot b2 = vect.g;
flaot b3 = vect.t;

// c1 == c2 == c3 == 3.0
flaot c1 = vect.z;
flaot c2 = vect.b;
flaot c3 = vect.p;

// d1 == d2 == d3 == 4.0
flaot d1 = vect.w;
flaot d2 = vect.a;
flaot d3 = vect.q;
```

> can choose right alphabet depending on the context

- Vertices: xyzw
- Colors: rgba
- Textures: stpq

```js
vec3 vectA = vec3(1.0, 2.0, 3.0);

// vectB value is: vec2(1.0, 3.0);
vec2 vectB = vectA.xz

// vectC value is: vec3(1.0, 1.0, 1.0);
vec3 vectC = vectA.rrr

// vectD value is: vec2(3.0, 1.0);
vec2 vectD = vectA.br
```

</details>
