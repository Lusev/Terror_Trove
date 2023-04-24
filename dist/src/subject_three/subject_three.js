import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


// console.log(GLTFLoader)




/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

/**
 * Fog
 */
// const fog = new THREE.Fog('#262837', 1, 15)
// scene.fog = fog

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            //child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

// debugObject.envMapIntensity = 2.5
//gui.add(debugObject, 'envMapIntensity').min(0).max(5).step(0.001).onChange(updateAllMaterials)

/**
 * Models
 */

let mixer = null
gltfLoader.load(
        '/models/subject_three/subject_three.glb',
        (gltf) => {
            mixer = new THREE.AnimationMixer(gltf.scene)
            const action = mixer.clipAction(gltf.animations[0])

            action.play()
            gltf.scene.scale.set(14, 14, 14)
            gltf.scene.position.set(0, -4, 0)
            gltf.scene.rotation.y = -1.265
            gltf.scene.traverse(function(obj) { obj.frustumCulled = false })

            // console.log(gltf.scene.rotation.y)
            scene.add(gltf.scene)
                // gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
            updateAllMaterials()

        }

    )
    /**
     * Lights
     */
const directionalLight = new THREE.DirectionalLight('#7177b0', 3)
const directionLightColor = { color: directionalLight.color.getHex() }
directionalLight.position.set(-5, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

/**
 * GUI
 */
// gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('lightIntensity')
// gui.addColor(directionLightColor, 'color').onChange((value) => directionalLight.color.set(value)).name('dlColor')
// gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
// gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
// gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(-8, 2, -6.25)
    // gui.add(camera.position, 'x').min(-10).max(10).step(0.001).name('cameraX')
    // gui.add(camera.position, 'y').min(-10).max(10).step(0.001).name('cameraY')
    // gui.add(camera.position, 'z').min(-10).max(10).step(0.001).name('cameraZ')
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// gui.add(renderer, 'toneMapping', {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping
// })
// gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer !== null) {
        mixer.update(deltaTime)

    }





    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()