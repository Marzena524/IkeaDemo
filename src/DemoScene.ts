import * as THREE from 'three';

export default class DemoScene extends THREE.Scene
{
    create()
    {   
        // create a prop to see something on a screen 
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({color: 0xFF0000});
        const prop = new THREE.Mesh(geometry, material);
        prop.position.set(0, 0, -4); 

        // add prop to the scene
        this.add(prop);

        // add light and position it above and between camera and a prop
        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(0, 5, 1);

        // add light to the scene
        this.add(light);
    }
}