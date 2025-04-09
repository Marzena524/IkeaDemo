import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader(); //todo: find a better place for it
//export let loadedObject: Object;

export default class DemoScene extends THREE.Scene
{
    addFloor()
    {   
        // create a prop to see something on a screen 
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
        const floor = new THREE.Mesh(geometry, material);
        floor.position.set(0, 0, 0); 
        floor.scale.set(10, 0.1, 10);
        // add prop to the scene
        this.add(floor);       
    }
    
    addBox(color: THREE.ColorRepresentation, position: THREE.Vector3, scale: THREE.Vector3) : THREE.Object3D
    {   
        // create a prop to see something on a screen 
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({color: color});
        const box = new THREE.Mesh(geometry, material);
        box.position.set(position.x, position.y, position.z); 
        box.scale.set(scale.x, scale.y, scale.z);
        
        // add prop to the scene
        this.add(box);
        return box;
    }

    addLights()
    {
         // add light and position it above and between camera and a prop
         const light = new THREE.DirectionalLight(0xFFFFFF, 1);
         light.position.set(0, 5, 1);
 
         // add light to the scene
         this.add(light);
    }

    // todo: remove one of them loadAndAddObjectAsync or loadAndAddObject
    async loadAndAddObjectAsync()
    {   
        const gltf = await gltfLoader.loadAsync('assets/Wooden_Table.glb');
        const model = gltf.scene;
        model.position.set(0, 0, -1);
        model.scale.set(3,3,3);
        this.add( model );
    } 

    loadAndAddObject()
    {   
        const scene = this; //todo: reconsider, passed scene to a callback function some other way
        gltfLoader.load('assets/Wooden_Table.glb', 
          function (gltf){ 
              const model = gltf.scene;
              model.position.set(0, 0, -1);
              model.scale.set(3,3,3);
              scene.add( model );
          },
        
          // called while loading is progressing
          function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },

          // called when loading has errors
          function ( error ) {
            console.log( 'An error happened' + error );
          }
        )
    }
}