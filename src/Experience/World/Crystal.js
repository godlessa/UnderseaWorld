import * as THREE from 'three'
import Experience from "../Experience";

export default class Crystal {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug


        // Debug
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('crystal')
        }

        // Setup
        this.resource = this.resources.items.crystalModel

        this.setModel()
    }

    setModel(){
        this.model = this.resource.scene
        this.model.scale.set(0.7, 0.7, 0.7)
        this.model.position.set(100,-80,60)
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh){
                child.receiveShadow = true
            }
        })
    }
}