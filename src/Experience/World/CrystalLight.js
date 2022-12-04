import * as THREE from 'three'
import Experience from "../Experience"
import * as dat from 'lil-gui'
import crystalVertexShader from '/src/shaders/crystal/vertexCrystal.glsl'
import  crystalFragmentShader from '/src/shaders/crystal/fragmentCrystal.glsl'

export default class CrystalLight {
    constructor(x,y,z) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.camera = this.experience.camera
        this.controls = this.camera.controls
        this.renderer = this.experience.renderer
        this.gui = this.experience.gui.gui

        this.clock = this.experience.gui.clock

        // Debug
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('crystalLight')
        }

        this.parameters = {}
        this.parameters.count = 200000
        this.parameters.size = 7
        this.parameters.radius = 20
        this.parameters.branches = 30
        this.parameters.spin = 10
        this.parameters.randomness = 20
        this.parameters.randomnessPower = 3
        this.parameters.insideColor = '#ffffff'
        this.parameters.outsideColor = '#1b3984'

        this.geometry = null
        this.material = null
        this.points = null

        this.x = x
        this.y = y
        this.z = z

        this.setModel()
        this.tick()

        this.gui = new dat.GUI()

        this.gui.add(this.parameters, 'count').min(100).max(1000000).step(100).onFinishChange(this.setModel)
        this.gui.add(this.parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(this.setModel)
        this.gui.add(this.parameters, 'branches').min(2).max(20).step(1).onFinishChange(this.setModel)
        this.gui.add(this.parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(this.setModel)
        this.gui.add(this.parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(this.setModel)
        this.gui.addColor(this.parameters, 'insideColor').onFinishChange(this.setModel)
        this.gui.addColor(this.parameters, 'outsideColor').onFinishChange(this.setModel)


    }

    setModel = () => {
        if (this.points !== null) {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.points)
        }

        /**
         * Geometry
         */
        this.geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(this.parameters.count * 3)
        const randomness = new Float32Array(this.parameters.count * 3)
        const colors = new Float32Array(this.parameters.count * 3)
        const scales = new Float32Array(this.parameters.count * 1)

        const insideColor = new THREE.Color(this.parameters.insideColor)
        const outsideColor = new THREE.Color(this.parameters.outsideColor)

        for (let i = 0; i < this.parameters.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * this.parameters.radius

            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius

            positions[i3] = -Math.cos(branchAngle) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = -Math.sin(branchAngle) * radius

            randomness[i3] = randomX
            randomness[i3 + 1] = randomY
            randomness[i3 + 2] = randomZ

            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / this.parameters.radius)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scale
            scales[i] = Math.random() * 2
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

        /**
         * Material
         */
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: crystalVertexShader,
            fragmentShader: crystalFragmentShader,
            uniforms: {
                uTime: {value: 0},
                uSize: {value: 30 * this.renderer.instance.getPixelRatio()}
            }
        })

        /**
         * Points
         */
        this.points = new THREE.Points(this.geometry, this.material)
        this.points.position.set(this.x, this.y, this.z)
        this.points.rotateX(0.3)
        this.scene.add(this.points)
    }

    tick = () =>
    {
        const elapsedTime = this.clock.getElapsedTime()

        // Update material
        this.material.uniforms.uTime.value = elapsedTime

        // Update controls
        this.controls.update()

        // Render
        this.renderer.instance.render(this.scene, this.camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick)
    }


}