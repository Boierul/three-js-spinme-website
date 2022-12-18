import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

import gsap from "gsap";

import './style.css'

// Create the Scene
const scene = new THREE.Scene()

// Create the object
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
    color: '#8e55ff',
    roughness: 0.1
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 25)
light.intensity = 1.35
scene.add(light)

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100)
camera.position.z = 15
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(3)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 10

// Resize
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})


const loop = () => {
    controls.update()
    mesh.rotation.x += 0.2
    renderer.render(scene, camera)
    window.requestIdleCallback(loop)
}

loop()

// Timeline orchestration with gsap
const tl = gsap.timeline({
    defaults:
        {duration: 1.5}
})
tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1})
tl.fromTo('nav', {y: '-100%'}, {y: '0%'})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

// Mouse animations colors
let mouseDown = false
let rgbColors = [12, 23, 55]

window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        rgbColors = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150
        ]

        //    Animate
        let newColor = new THREE.Color(`rgb(${rgbColors.join(",")})`)
        // new THREE.Color(`rgb(0,100,150)`)
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        })
    }
})
