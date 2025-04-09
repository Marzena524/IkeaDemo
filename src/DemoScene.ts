import * as THREE from 'three';

export default class DemoScene extends THREE.Scene
{
    create()
    {   
        // create a prop to see something on a screen 
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
        const floor = new THREE.Mesh(geometry, material);
        floor.position.set(0, 0, 0); 
        floor.scale.set(10, 0.1, 10);
        // add prop to the scene
        this.add(floor);

        // add light and position it above and between camera and a prop
        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(0, 5, 1);

        // add light to the scene
        this.add(light);
    }
}