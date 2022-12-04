import * as THREE from 'three'
import Experience from "../Experience"


export default class Jellyfish{
    constructor(x,y,z) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debug = this.experience.debug


        // Debug
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('jellyfish')
        }

        // Setup
        this.resource = this.resources.items.jellyfishModel

        this.x = x
        this.y = y
        this.z = z

        this.setModel()
    }


    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(0.9, 0.9, 0.9)
        this.model.position.set(this.x, this.y, this.z)

        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })

    }

}
