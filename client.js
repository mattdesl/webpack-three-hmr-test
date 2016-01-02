global.THREE = require('three')
const createOrbitViewer = require('three-orbit-viewer')(THREE)
const createBackground = require('three-vignette-background')
const noiseMaterial = require('./materials/noise')
const inlineMaterial = require('./materials/inline')

const app = createOrbitViewer({
  clearColor: 0x000000,
  clearAlpha: 1.0,
  fov: 45,
  position: new THREE.Vector3(3, 2, -3)
})

const bg = createBackground()
app.scene.add(bg)

const boxGeo = new THREE.BoxGeometry(1, 1, 1)
const mat1 = noiseMaterial()
const box = new THREE.Mesh(boxGeo, mat1)
app.scene.add(box)

const sphereGeo = new THREE.SphereGeometry(1, 64, 64)
const mat2 = inlineMaterial()
const sphere = new THREE.Mesh(sphereGeo, mat2)
sphere.scale.multiplyScalar(0.5)
app.scene.add(sphere)

let angle = 0
app.on('tick', dt => {
  var width = window.innerWidth
  var height = window.innerHeight
  bg.style({
    aspect: width / height,
    aspectCorrection: true,
    scale: 2.5,
    grainScale: 0
  })
  
  box.rotation.y += dt * 0.0002
  const r = 2
  angle += dt * 0.0006
  sphere.position.x = Math.cos(angle) * r
  sphere.position.z = Math.sin(angle) * r
})