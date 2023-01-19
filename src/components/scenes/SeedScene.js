import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Flower, Land, Shape } from 'objects';
import { BasicLights } from 'lights';
import CHUNG from './textures/chung/00.png';

class SeedScene extends THREE.Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 3,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new THREE.Color(0x000000);

        // Add meshes to scene
        const lights = new BasicLights();
        // this.add(land, flower, lights);
        this.add(lights);

        // front
        // const shape = new Shape(this, 11);
        // shape.draw_cube(0xff0000, -1, 1, 1, 1);
        // shape.draw_cube(0xff0000, 1, 1, 1, 1);
        // shape.draw_cube(0xff0000, -1, -1, 1, 1);
        // shape.draw_cube(0xff0000, 1, -1, 1, 1);
        // shape.draw_cube(0xff0000, -1, 1, -1, 1);
        // shape.draw_cube(0xff0000, 1, 1, -1, 1);
        // shape.draw_cube(0xff0000, -1, -1, -1, 1);
        // shape.draw_cube(0xff0000, 1, -1, -1, 1);

        // shape.draw_cube(0xff0000, -3, 2, 1, 1);
        // shape.draw_cube(0xff0000, 5, 1, 2, 1);
        // shape.draw_cube(0xff0000, -2, -1, 3, 1);
        // shape.draw_cube(0xff0000, 1, -4, 0, 1);
        // shape.draw_cube(0xff0000, -1, 3, -1, 1);
        // shape.draw_cube(0xff0000, 2, 2, -2, 1);
        // shape.draw_cube(0xff0000, -4, -4, -2, 1);
        // shape.draw_cube(0xff0000, 3, -5, -3, 1);

        // this.add(shape);

        const start = 2.0;
        const factor = 0.2;
        const shape = new Shape(this, 13);
        // shape.draw_cube(0xffffff, 0, 0, 0, start);
        // shape.draw_cube(0x00ff00, 0, 0, 0, start + factor);
        // shape.draw_cube(0x0000ff, 0, 0, 0, start + factor * 1);
        // shape.draw_cube(0xffff00, 0, 0, 0, start + factor * 2);
        // shape.draw_cube(0xff0000, 0, 0, 0, start + factor * 3);
        shape.draw_cube(0xff0000, 0, 0, 0, start + factor);

        this.add(shape);


        // var envMap = new THREE.CubeTextureLoader()
        // .load([
        //     CHUNG, CHUNG,
        //     CHUNG, CHUNG,
        //     CHUNG, CHUNG
        // ]);

        // const loader = new THREE.TextureLoader();
        // let texture = loader.load(CHUNG);
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.anisotropy = 16;
        // const patternMaterial = new THREE.MeshBasicMaterial({
        //     color: 0xff0000,
        //     map: texture,
        //     transparent: true,
        //     opacity: 0.5
        // });

        // const geometry = new THREE.BoxGeometry(3, 3, 3);
        // const cube = new THREE.Mesh(geometry, patternMaterial);
        // this.add(cube);

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 5000;
        // this.rotation.x = (rotationSpeed * timeStamp) / 5000;
        // this.rotation.z = (rotationSpeed * timeStamp) / 5000;
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;