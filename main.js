import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Add a light source
const light = new THREE.AmbientLight(0x404040);
scene.add(light);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Add controls for better viewing experience
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/sun/textures/suncyl1.jpg", (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
});

// Load the FBX model
let sunModel;
const fbxLoader = new FBXLoader();
fbxLoader.load(
  "/sun/source/UnstableStar.fbx",
  function (object) {
    object.position.set(-2, 0, 0);
    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          emissiveIntensity: 40,
        });
      }
    });

    scene.add(object);
    sunModel = object;

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    scene.add(pointLight);
    pointLight.position.set(
      object.position.x,
      object.position.y,
      object.position.z
    );
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const gltfModel = new GLTFLoader();
let earth;
gltfModel.load(
  "./earth/earth.glb",
  function (object) {
    const earthModel = object.scene;
    if (earthModel) earth = earthModel;

    scene.add(earthModel);
    earthModel.position.set(2, 0, -1);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.set(5, 0, 0);
camera.lookAt(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);

  if (sunModel) {
    sunModel.rotation.y += 0.01;
  }

  if (earth) {
    earth.rotation.y += 0.001;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);
