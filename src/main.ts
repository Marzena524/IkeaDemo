import './style.css'  // todo: remove?
import * as THREE from 'three';
import DemoScene from './DemoScene';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';


// window params
const width = window.innerWidth;
const height = window.innerHeight;

// camera params
const fieldOfView = 75; // todo: play with it: Unity uses 60
const aspectRatio = width / height;
const nearPlane = 0.1;
const farPlane = 100;

const colorLightBlue: THREE.ColorRepresentation = 0xADD8E6;
const colorRed: THREE.ColorRepresentation = 0xFF0000;

// create the rendered and set it to cover whole page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(colorLightBlue);
// todo: what exactly does it do? nothing is drawn if this is commented
document.body.appendChild(renderer.domElement);


// add camera
const mainCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
mainCamera.position.set(0, 2, 4);    
mainCamera.lookAt(0, 0, 0);

// creat controls to move camera and look around
const cameraControls = new OrbitControls( mainCamera, renderer.domElement );

// array to story objects we want to check against during recast
let selectableObjects: THREE.Object3D[] = [];

// add a scene
const scene = new DemoScene();
scene.addFloor();
scene.addLights();
scene.loadAndAddObjectAsync();

// Transform Controls for Gizmos
const transformControls = new TransformControls(mainCamera, renderer.domElement);
transformControls.setMode('translate');
scene.add(transformControls.getHelper());

//Handling selection of an object
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// there's probably a way to define zero vector
const markerProp = scene.addBox(colorRed, new THREE.Vector3(0,0,0), new THREE.Vector3(0.01,10.0,0.01));
scene.add(markerProp);

const box = scene.addBox(colorRed, new THREE.Vector3(2,2,-3), new THREE.Vector3(1,1,1));
scene.add(box);
selectableObjects.push(box);
//todo: would be nice to get rid of any
 function onPointerMove( event: any ) {

	// calculate pointer position in normalized device coordinates (-1 to +1) for both components
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, mainCamera );
  const intersectedObjects = raycaster.intersectObjects( selectableObjects, true);
 
  if( intersectedObjects.length > 0)
  {
    const hitObject = intersectedObjects[ 0 ].object;
    const pos = hitObject.position;
    markerProp.position.set(pos.x, pos.y, pos.z);
    transformControls.attach(hitObject);
  }
  else
  {
    markerProp.position.set(0, 0, 0);
    transformControls.detach();
  }
}

// main loop of application
function loop() {
  // Browser handles timing and throttling
  requestAnimationFrame(loop);

  // todo: considering removing. it worked without update from docs: "required if controls.enableDamping or controls.autoRotate are set to true"
  cameraControls.update();

   // pass scene and camera to renderer and render the scene
  renderer.render(scene, mainCamera);
}



window.addEventListener( 'pointermove', onPointerMove );

requestAnimationFrame(loop);