import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { gsap } from 'gsap'

// console.log(GLTFLoader)

// Debug
// const gui = new dat.GUI()
// const debugObject = {}

/**
 * Loaders
 */


const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')


/**
 * Fonts
 */

const fontLoader = new FontLoader()

fontLoader.load(
        '/fonts/Shlop_Regular.json',
        (font) => {
            const textGeometry = new TextGeometry(
                'Terror Trove', {
                    font: font,
                    size: 5,
                    height: 0.2,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 4
                },

            )



            // textGeometry.computeBoundingBox()
            // textGeometry.translate(-(textGeometry.boundingBox.max.x - 0.02) * 0.5, -(textGeometry.boundingBox.max.y - 0.02) * 0.5, -(textGeometry.boundingBox.max.z - 0.03) * 0.5, )
            textGeometry.center()

            const textMaterial = new THREE.MeshMatcapMaterial()
            textMaterial.matcap = matcapTexture
                // textMaterial.wireframe = true
            const text = new THREE.Mesh(textGeometry, textMaterial)
            scene.add(text)
            text.rotation.y = -1.802
            text.position.set(0, -3.258, 0)
            console.log(text.rotation.y)
                // gui.add(text.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001).name('font')
                // gui.add(text.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('font')
                // gui.add(text.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.001).name('font')
                // gui.add(text.position, 'x').min(-100).max(100).step(0.001).name('fontPosX')
                // gui.add(text.position, 'y').min(-100).max(100).step(0.001).name('fontPosY')
                // gui.add(text.position, 'z').min(-100).max(100).step(0.001).name('fontPosZ')
        }
    )
    /**
     * Base
     */



// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()


const fog = new THREE.Fog('#18251d', 1, 80)
scene.fog = fog

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
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
scene.background = new THREE.Color(0x101813)
scene.environment = environmentMap

// debugObject.envMapIntensity = 2.5
// gui.add(debugObject, 'envMapIntensity').min(0).max(5).step(0.001).onChange(updateAllMaterials)

/**
 * Models
 */



let mixer = null
gltfLoader.load(
    '/models/mainPage/mainPageMerged2.glb',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)

        gltf.scene.scale.set(20, 20, 20)
        gltf.scene.position.set(-15, 1, 0)
        gltf.scene.rotation.set(0, 2.446, -Math.PI / 2)
            // const helper = new THREE.AxesHelper(10)
            // scene.add(helper)

        // gltf.scene.rotation.y = 0.361
        gltf.scene.traverse(function(obj) { obj.frustumCulled = false })


        // console.log(gltf.scene.rotation.y)
        scene.add(gltf.scene)
            // gui.add(gltf.scene.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001).name('rotationX')
            // gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotationYG')
            // gui.add(gltf.scene.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.001).name('rotationZ')
        updateAllMaterials()

    }

)

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
const points = [{
    position: new THREE.Vector3(-16, -12, 2),
    element: document.querySelector('.point-0')
}]



/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ff2227', 3)
const directionLightColor = { color: directionalLight.color.getHex() }
directionalLight.position.set(-5, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(directionalLight)



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
camera.position.set(-36.62, -10.91, -8.16)
    // gui.add(camera.position, 'x').min(-50).max(10).step(0.001).name('cameraX')
    // gui.add(camera.position, 'y').min(-50).max(10).step(0.001).name('cameraY')
    // gui.add(camera.position, 'z').min(-50).max(10).step(0.001).name('cameraZ')
scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(-16, -12, 2)

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
renderer.toneMappingExposure = 0.758
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#18251d')

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


    // Update points only when the scene is ready

    // Go through each point
    for (const point of points) {
        // Get 2D screen position
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        // Set the raycaster
        raycaster.setFromCamera(screenPosition, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)

        // No intersect found
        if (intersects.length === 0) {
            // Show
            point.element.classList.add('visible')
        }

        // Intersect found
        else {
            // Get the distance of the intersection and the distance of the point
            const intersectionDistance = intersects[0].distance
            const pointDistance = point.position.distanceTo(camera.position)

            // Intersection is close than the point
            if (intersectionDistance < pointDistance) {
                // Hide
                point.element.classList.remove('visible')
            }
            // Intersection is further than the point
            else {
                // Show
                point.element.classList.add('visible')
            }


            const translateX = screenPosition.x * sizes.width * 0.5
            const translateY = -screenPosition.y * sizes.height * 0.5
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()