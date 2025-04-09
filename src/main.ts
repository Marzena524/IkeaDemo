import './style.css'  // todo: remove?
import * as THREE from 'three';
import DemoScene from './DemoScene';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// window params
const width = window.innerWidth;
const height = window.innerHeight;

// camera params
const fieldOfView = 75; // todo: play with it: Unity uses 60
const aspectRatio = width / height;
const nearPlane = 0.1;
const farPlane = 100;

// create the rendered and set it to cover whole page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
// todo: what exactly does it do? nothing is drawn if this is commented
document.body.appendChild(renderer.domElement);


// add camera
const mainCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
mainCamera.position.set(0, 2, 4);    
mainCamera.lookAt(0, 0, 0);

// creat controlls to move camera and look around
const cameraControls = new OrbitControls( mainCamera, renderer.domElement );

// add a scene
const scene = new DemoScene();
scene.create();

// load table model
const gltfLoader = new GLTFLoader();
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

// main loop of application
function loop() {
  // Browser handles timing and throttling
  requestAnimationFrame(loop);

  // todo: considering removing. it worked without update from docs: "required if controls.enableDamping or controls.autoRotate are set to true"
  cameraControls.update();

   // pass scene and camera to renderer and render the scene
  renderer.render(scene, mainCamera);

}

requestAnimationFrame(loop);