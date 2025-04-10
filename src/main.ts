import './style.css'  // todo: remove?
import * as THREE from 'three';
import DemoScene from './DemoScene';
//import { meshWarpOnClick } from './MeshWarp';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

// predefine colors for readability
const colorLightBlue: THREE.ColorRepresentation = 0xADD8E6;
const colorRed: THREE.ColorRepresentation = 0xFF0000;

// predefine camera params for readability
const fieldOfView = 60; // todo: play with it: Unity uses 60
const aspectRatio = 1; // default, will be set to proper value in Init
const nearPlane = 0.1;
const farPlane = 100;

// create global variables
const renderer = new THREE.WebGLRenderer();
const mainCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
const scene = new DemoScene();
const cameraControls = new OrbitControls(mainCamera, renderer.domElement);  // controls to move camera and look around

// array to store objects we want to check against during recast
let selectableObjects: THREE.Object3D[] = []; // todo: make sure to add the object loaded from glb

// Transform Controls for Gizmos
const transformControls = new TransformControls(mainCamera, renderer.domElement);

//Handling selection of an object
const raycaster = new THREE.Raycaster();
const mouseCoords = new THREE.Vector2();
const markerProp = scene.addBox(colorRed, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.01, 10.0, 0.01)); // todo: .computeBoundingBox ()  can use it highlight selected mesh instead of using marker 

function onLoadedObject(model: (THREE.Group | null)) {
  if (model) {
    selectableObjects.push(model);
    scene.add(model);
  }
}

function handleWindowSize() {
  // window params
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();
}

// sets up most of the things that need to be setup only once in after loading
function init() {
  handleWindowSize();

  // init renderer and set it to cover whole page
  renderer.setClearColor(colorLightBlue);
  renderer.shadowMap.enabled = true
  document.body.appendChild(renderer.domElement); // todo: what exactly does it do? nothing is drawn if this is commented

  // init camera
  mainCamera.position.set(0, 2, 4);
  mainCamera.lookAt(0, 0, 0);

  cameraControls.enablePan = false;
  cameraControls.maxPolarAngle = Math.PI / 2;
  cameraControls.enableDamping = true;

  // setup for the scene
  scene.background = new THREE.Color(0xa8def0);
  scene.addLights();
  scene.addFloor();

  // loading and adding table
  scene.loadObjectAsync(onLoadedObject);
  scene.addPlaneMesh();

  // setup gizmo
  transformControls.setMode('translate');
  scene.add(transformControls.getHelper());

  // add mesh prop
  const box = scene.addBox(colorRed, new THREE.Vector3(2, 2, -3), new THREE.Vector3(1, 1, 1));
  scene.add(box);
  selectableObjects.push(box);

  // add debug marker as helper to check recast results 
  scene.add(markerProp);
  requestAnimationFrame(loop);
}

// checks intersation every frame using mouseCoords updated base on input 
function updateSelection()  // todo: it's still very slugish
{
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouseCoords, mainCamera);
  const intersectedObjects = raycaster.intersectObjects(selectableObjects, true);

  if (intersectedObjects.length > 0) {
    const hitObject = intersectedObjects[0].object;
    const pos = hitObject.position;
    markerProp.position.set(pos.x, pos.y, pos.z);
  }
  else {
    markerProp.position.set(0, 0, 0);
  }
}

function OnMeshClick() {
  const positionInLocal = new THREE.Vector3();
  const clickDistanceRangeSquared = 0.5 * 0.5;
  const clickOffset = 1;

  // todo: fix doing recast twice in each click 
  raycaster.setFromCamera(mouseCoords, mainCamera);
  const hitObjects = raycaster.intersectObjects(scene.children);
  // making sure recast hit mesh
  if (hitObjects.length > 0 && (hitObjects[0].object as THREE.Mesh).geometry) {
    const mesh = hitObjects[0].object as THREE.Mesh;
    const geometry = mesh.geometry;
    const point = hitObjects[0].point;
    const atribute = geometry.attributes.position;

    // iterating through vertices, checking which are close to point that was hit 
    for (let i = 0; i < atribute.count; i++) {
      positionInLocal.set(atribute.getX(i), atribute.getY(i), atribute.getZ(i));
      const positionInWorld = mesh.localToWorld(positionInLocal);
      const distanceSquared = point.distanceToSquared(positionInWorld);
      // adding extra offset to vertices that are in range
      if (distanceSquared < clickDistanceRangeSquared) {
        atribute.setZ(i, atribute.getZ(i) + clickOffset); //todo: moves vertices along Z in local, should change world position, convert to local and then set
      }
    }
    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;
  }
}


// main loop of application
function loop() {
  cameraControls.update();
  updateSelection();
  // pass scene and camera to renderer and render the scene
  renderer.render(scene, mainCamera);
  // Browser handles timing and throttling
  requestAnimationFrame(loop);
}

// event handlers
function onMouseMove(event: any)  //todo: would be nice to get rid of any
{
  // calculate mouseCoor position in normalized device coordinates (-1 to +1) for both components
  mouseCoords.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseCoords.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onClick(event: any) {

  mouseCoords.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseCoords.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
  OnMeshClick();

  raycaster.setFromCamera(mouseCoords, mainCamera);
  const hitObjects = raycaster.intersectObjects(selectableObjects, true);

  if (hitObjects.length > 0) {
    const selectedObject = hitObjects[0].object;
    transformControls.attach(selectedObject);
  }
  else {
    transformControls.detach();
  }
}

function onWindowResize() {
  handleWindowSize();
}

// listeners
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onClick);
window.onload = init;
