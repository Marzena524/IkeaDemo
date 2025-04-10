import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader(); //todo: find a better place for it
const gltTablePath = 'assets/Wooden_Table.glb';

export default class DemoScene extends THREE.Scene {
    addBox(color: THREE.ColorRepresentation, position: THREE.Vector3, scale: THREE.Vector3): THREE.Object3D {
        // create box
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: color });
        const box = new THREE.Mesh(geometry, material);
        box.position.set(position.x, position.y, position.z);
        box.scale.set(scale.x, scale.y, scale.z);
        // box.userData.randomInfo = 2; // todo: remove if not used, hacky way to store extra info in the objects.
        // add box to the scene
        this.add(box);
        return box;
    }

    addFloor() {
        this.addBox(0xFFFFFF, new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0.1, 10))
    }

    addLights() {

        this.add(new THREE.AmbientLight(0xffffff, 0.5));

        // add light and position it above and between camera and a prop
        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(0, 5, 1);
        //light.castShadow = true;
        // add light to the scene
        this.add(light);
    }


    async loadObjectAsync(onLoaded: (model: THREE.Group | null) => void) {
        const gltf = gltfLoader.loadAsync(gltTablePath);
        gltf.then((result) => {
            const model = result.scene;
            model.position.set(0, 0, -1);
            model.scale.set(3, 3, 3);
            onLoaded(model);
        })

        gltf.catch((error) => {
            console.log('Loading ' + gltTablePath + ' resulted in error: ' + error);
            onLoaded(null);
        })
    }
}