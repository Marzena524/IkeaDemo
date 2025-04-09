import './style.css'  // todo: remove?
import * as THREE from 'three';
import DemoScene from './DemoScene';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';


// window params
const width = window.innerWidth;
const height = window.innerHeight;

// const params
const fieldOfView = 75; // todo: play with it: Unity uses 60
const aspectRatio = width / height;
const nearPlane = 0.1;
const farPlane = 100;

const colorLightBlue: THREE.ColorRepresentation = 0xADD8E6;
const colorRed: THREE.ColorRepresentation = 0xFF0000;

// create global variables
const renderer = new THREE.WebGLRenderer();
const mainCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
const scene = new DemoScene();
const cameraControls = new OrbitControls( mainCamera, renderer.domElement );  // controls to move camera and look around

// array to story objects we want to check against during recast
let selectableObjects: THREE.Object3D[] = [];

// Transform Controls for Gizmos
const transformControls = new TransformControls(mainCamera, renderer.domElement);

//Handling selection of an object
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const markerProp = scene.addBox(colorRed, new THREE.Vector3(0,0,0), new THREE.Vector3(0.01,10.0,0.01));

function Init()
{
  // init renderer and set it to cover whole page
  renderer.setSize(width, height);
  renderer.setClearColor(colorLightBlue);
  document.body.appendChild(renderer.domElement); // todo: what exactly does it do? nothing is drawn if this is commented

  // init camera
  mainCamera.position.set(0, 2, 4);    
  mainCamera.lookAt(0, 0, 0);
  
  // setup for the scene
  scene.addLights();
  scene.addFloor();
  
  // loading and adding table
  scene.loadAndAddObjectAsync();

  // setup gizmo
  transformControls.setMode('translate');
  scene.add(transformControls.getHelper());

  // add mesh prop
  const box = scene.addBox(colorRed, new THREE.Vector3(2,2,-3), new THREE.Vector3(1,1,1));
  scene.add(box);
  selectableObjects.push(box);

  // add debug marker as helper to check recast results 
  scene.add(markerProp);
}

// main loop of application
function loop() 
{
  // todo: considering removing. it worked without update from docs: "required if controls.enableDamping or controls.autoRotate are set to true"
  cameraControls.update();

   // pass scene and camera to renderer and render the scene
  renderer.render(scene, mainCamera);
  // Browser handles timing and throttling
  requestAnimationFrame(loop);
}

// >>>>> start of application <<<<<
Init();
requestAnimationFrame(loop);

// event handlers
function onPointerMove( event: any ) {  //todo: would be nice to get rid of any

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

function onWindowResize()
{
  const width = window.innerWidth;
  const height = window.innerHeight;

  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

// listeners
window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'pointermove', onPointerMove );

