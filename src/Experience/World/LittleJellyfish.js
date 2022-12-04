import * as THREE from 'three'
import Experience from "../Experience"
import jellyfishVertexShader from '/src/shaders/animateJellyfish/vertexJellyfish.glsl'
import jellyfishFragmentShader from '/src/shaders/animateJellyfish/fragmentJellyfish.glsl'

export default class Jellyfish{
    constructor(x,y,z, flagTextures) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.controls = this.camera.controls
        this.gui = this.experience.gui.gui
        this.renderer = this.experience.renderer
        this.clock = this.experience.gui.clock

        this.x = x
        this.y = y
        this.z = z
        this.flagTexture = flagTextures

        this.setModel()
        this.setAnimation()

    }

    setModel(){
        // Geometry
        this.geometry = new THREE.SphereGeometry(3,32,32)
        const count = this.geometry.attributes.position.count
        const randoms = new Float32Array(count)


        for (let i=0; i < count; i++){
            randoms[i] = Math.random()
        }

        this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

        // Material
        this.material = new THREE.RawShaderMaterial(
            {
                vertexShader: jellyfishVertexShader,
                fragmentShader: jellyfishFragmentShader,
                uniforms:
                    {
                        uFrequency: { value: new THREE.Vector2(20,10) },
                        uTime: {value: 0},
                        uColor: {value: new THREE.Color('orange')},
                        uTexture: {value: this.flagTexture}
                    }
            }
        )


        this.gui.add(this.material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
        this.gui.add(this.material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');

        // Mesh
        const mesh = new THREE.Mesh(this.geometry, this.material)
        mesh.position.set(this.x, this.y, this.z)
        this.scene.add(mesh)

    }

    setAnimation = () => {
        const elapsedTime = this.clock.getElapsedTime()

        // Update material
        this.material.uniforms.uTime.value = elapsedTime
        this.controls.update()

        this.renderer.instance.render(this.scene, this.camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.setAnimation)
    }
}