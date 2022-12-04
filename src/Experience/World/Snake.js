import * as THREE from 'three'
import Experience from "../Experience";

export default class Snake{
    constructor(x,y,z) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('snake')
        }

        // Setup
        this.resource = this.resources.items.snakeModel

        this.x = x
        this.y = y
        this.z = z
        this.setModel()
    }


    setModel(){
        this.model = this.resource.scene
        this.model.scale.set(2, 2, 2)
        this.model.position.set(this.x, this.y, this.z)
        this.model.rotateY(1.0)

        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh){
                child.castShadow = true
            }
        })
    }


}