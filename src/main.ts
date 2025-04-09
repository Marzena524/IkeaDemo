import './style.css'  // todo: remove?
import * as THREE from 'three';

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

// add camera
const mainCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
mainCamera.position.set(0, 2, 4);    
mainCamera.lookAt(0, 0, 0);

// add a scene
const scene = new THREE.Scene();

// create a prop to see something on a screen 
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({color: 0xFF0000});
const prop = new THREE.Mesh(geometry, material);
prop.position.set(0, 0, -4); 

// add prop to the scene
scene.add(prop);

// add light and position it above and between camera and a prop
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 5, 1);

// add light to the scene
scene.add(light);

// pass scene and camera to renderer and render the scene
renderer.render(scene, mainCamera);

// todo: what exactly does it do? nothing is drawn if this is commented
document.body.appendChild(renderer.domElement);