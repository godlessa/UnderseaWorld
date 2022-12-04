import Experience from "../Experience";
import Environment from "./Environment";
import Shark from "./Shark"
import Snake from "./Snake"
import Octopus from "./Octopus"
import Jellyfish from "./Jellyfish";
import Slope from "./Slope";
import Crystal from "./Crystal";
import CrystalLight from "./CrystalLight";
import LittleJellyfish from "./LittleJellyfish"
import * as THREE from "three";

export default class World{
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.shark = new Shark(-10,5,20)
            this.snake = new Snake(30,-70,80)
            this.octopus = new Octopus(-30, -55, 0)
            this.jellyfish = new Jellyfish(80, 25, 30)
            this.slope = new Slope(100,-20,10)
            this.crystal = new Crystal()
            this.crystalLights = new CrystalLight(-40,-40,90)
            this.crystalLights2 = new CrystalLight(-10,0,-10)

            const textureLoader = new THREE.TextureLoader()

            const flagTexture1 = textureLoader.load('/textures/snake/pexels-jelly.jpg')
            const flagTexture2 = textureLoader.load('/textures/snake/snake_color.jpg')
            const flagTexture3 = textureLoader.load('/textures/snake/snake_normal.jpg')

            this.littleJellyfish1 = new LittleJellyfish(-1,3,5, flagTexture1)
            this.littleJellyfish2 = new LittleJellyfish(60,20,-10, flagTexture2)
            this.littleJellyfish3 = new LittleJellyfish(40,3,-10, flagTexture3)
            this.environment = new Environment()
        })

    }

}