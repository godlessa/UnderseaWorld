import * as dat from "lil-gui";
import * as THREE from "three";

export default class MyGUI {
    constructor() {
       this.gui = new dat.GUI();
       this.clock = new THREE.Clock()
    }
}