import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './flower.gltf';
import * as THREE from 'three';

class Shape extends Group {
    constructor(parent, iter) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: this.spin.bind(this),
            twirl: 0,
            // rotationSpeed: Math.random(),
            rotationSpeed: 0.3,
            // rotationStart: Math.random() * 1000
            rotationStart: 1000
        };

        // this.points = this.get_points(13, Math.PI / 4, new Vector3(0, 0, 0), 0, 0, 0);
        // Load object
        // const loader = new GLTFLoader();

        // this.name = 'flower';
        // loader.load(MODEL, (gltf) => {
        //     this.add(gltf.scene);
        // });

        this.material = new THREE.LineBasicMaterial({ color: 0xffffff });
        // this.draw_plane(10, Math.PI / 4, new Vector3(0, 0, 0), 0, Math.PI / 20, 0);

        // this.draw_cube(new Vector3(0, 0, 0));
        this.cube = this.calculate_cube(iter);
        // this.draw_cube(0xff0000, 0, 0, 0, 1);

        this.cubes = [];
        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.draw_cube.bind(this.draw_cube);
        // // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    calculate_cube(iter) {
        // call draw_plane once and clone so calculation only runs once
        const line0 = this.get_points(iter, Math.PI / 4, new Vector3(0, 0, 0), 0, 0, 0);
        const line1 = line0.clone();
        const line2 = line0.clone();
        const line3 = line0.clone();
        const line4 = line0.clone();
        const line5 = line0.clone();

        // back
        line0.translateZ(-1);

        // right
        line1.translateX(1);
        line1.rotateY(Math.PI / 2);

        // front
        line2.translateZ(1);

        // left
        line3.translateX(-1);
        line3.rotateY(Math.PI / 2);

        // top
        line4.translateY(1);
        line4.rotateX(Math.PI / 2);

        // bottom
        line5.translateY(-1);
        line5.rotateX(Math.PI / 2);

        const cube = new THREE.Group();
        cube.add(line0, line1, line2, line3, line4, line5);
        // cube.position.set(0, 0, 0);
        // for (let c of cube.children) {
        //     c.material.color = 0xff0000;
        // }
        // this.add(cube)
        return cube;
    }

    draw_cube(color, x, y, z, scale) {
        const cube = this.cube.clone();
        cube.position.set(x, y, z);
        cube.scale.multiplyScalar(scale);
        const material = new THREE.LineBasicMaterial({ color: color });
        for (let c of cube.children) {
            c.material = material;
            // c.material.color.setHex(color);
        }
        this.add(cube);
        this.cubes.push(cube);
    }

    get_points(iter, angle, center, rotX, rotY, rotZ) {
        // lévy curve
        // axiom = F
        // F -> -F++F-
        // angle = 45
        let theta;
        let points = [
            new THREE.Vector3(-0.5, 0, 0),
            new THREE.Vector3(0.5, 0, 0)
        ];


        // let points = [
        //     center.clone().sub(new Vector3(0.5, 0, 0)),
        //     center.clone().add(new Vector3(0.5, 0, 0))
        // ];
        // points.push(new THREE.Vector3(-1, 0, 0));
        // points.push(new THREE.Vector3(0, 1, 0));
        // points.push(new THREE.Vector3(1, 0, 0));

        let len = 1;
        for (let i = 0; i < iter; i++) {
            // Calculate the length of the new line segments
            len = 0.5 * len / Math.cos(angle);
            // This will store all the points of the Levy C curve
            let temp = [];
            // For each line segment, do the following
            for (let j = 0; j < points.length - 1; j++) {
                // Grab the endpoints of the current line segment
                let pt1 = points[j];
                let pt2 = points[j + 1];

                // Subtract one endpoint from the other, so you're dealing with
                // rotations about the origin
                let diff = pt2.clone().sub(pt1);

                // These lines determine the angle theta, which is calculated
                // slightly differently depending on which quadrant you end up in
                if (0 >= diff.x && 0 >= diff.y) {
                    theta = Math.atan(Math.abs(diff.y / diff.x)) + Math.PI;
                } else if (0 >= diff.x) {
                    theta = Math.PI - Math.atan(Math.abs(diff.y / diff.x));
                } else if (0 >= diff.y) {
                    theta = Math.PI * 2 - Math.atan(Math.abs(diff.y / diff.x));
                } else {
                    theta = Math.atan(Math.abs(diff.y / diff.x));
                }

                // Calculate the 'midpoint' -- the vertex of the triangle
                let midpoint = new THREE.Vector3(
                    len * Math.cos(theta - angle) + pt1.x,
                    len * Math.sin(theta - angle) + pt1.y,
                    0);
                // console.log(midpoint);
                temp.push(pt1);
                temp.push(midpoint);

                // console.log(points);
            }
            // console.log(points[points.length - 1])
            temp.push(points[points.length - 1]);
            points = temp;
        }


        // mirror the points to create octagonal shape
        const size = points.length;
        const normal = new Vector3(0, 1, 0)
        for (let i = size - 1; i >= 0; i--) {
            points.push(points[i].clone().reflect(normal));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, this.material);
        line.rotation.x += rotX;
        line.rotation.y += rotY;
        line.rotation.z += rotZ;
        return line;
    }

    spin() {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(timeStamp) {
        const { rotationSpeed, rotationStart, updateList } = this.state;
        // this.shape.rotation.y = (rotationSpeed * timeStamp) / 1000 + rotationStart;
        // this.shape.rotation.x = (rotationSpeed * timeStamp) / 1000 + rotationStart;
        // this.shape.rotation.z = (rotationSpeed * timeStamp) / 1000 + rotationStart;

        if (this.cubes) {
            for (let cube of this.cubes) {
                cube.rotation.y = (rotationSpeed * timeStamp) / 1000 + rotationStart;
                cube.rotation.x = (rotationSpeed * timeStamp) / 1000 + rotationStart;
                cube.rotation.z = (rotationSpeed * timeStamp) / 1000 + rotationStart;
            }
        }

        if (this.state.bob) {
            // Bob back and forth
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            // this.state.twirl -= Math.PI / 8;
            // this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Shape;