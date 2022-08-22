import Movements from "./movement.js";
import ropsten from "./Web3.js";
import abi from "./abi/abi.json" assert { type: "json" };

// contract Metaverse.sol deployed at  0x08e9cadc107893c306dfa3fc77525cafb1116935

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient_light = new THREE.AmbientLight(0x404040);
const directional_light = new THREE.DirectionalLight(0xffffff, 0.5);
ambient_light.add(directional_light);
scene.add(ambient_light);
const ambient_light2 = new THREE.AmbientLight(0x404040);
const directional_light2 = new THREE.DirectionalLight(0xffffff, 1);
ambient_light2.add(directional_light2);
ambient_light2.position.set(40, 10, -50);
scene.add(ambient_light2);

const geometry_area = new THREE.BoxGeometry(100, 1, 100);
const material_area = new THREE.MeshPhongMaterial({ color: "#98c64b" });
const area = new THREE.Mesh(geometry_area, material_area);
scene.add(area);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// cube.position.set(0, 5, 25);
camera.position.z = 5;
camera.position.set(0, 5, 40);

function animate() {
  // cube.rotation.y += 0.05;
  // cube.rotation.x += 0.05;
  // cube.rotation.z += 0.05;

  requestAnimationFrame(animate);

  if (Movements.isPressed(37)) {
    //left
    camera.position.x -= 0.5;
  }
  if (Movements.isPressed(38)) {
    //up
    camera.position.x += 0.5;
    camera.position.y += 0.5;
  }
  if (Movements.isPressed(39)) {
    //right
    camera.position.x += 0.5;
  }
  if (Movements.isPressed(40)) {
    //down
    camera.position.x -= 0.5;
    camera.position.y -= 0.5;
  }

  camera.lookAt(area.position);

  renderer.render(scene, camera);
}
animate();

const button = document.querySelector("#mint");
button.addEventListener("click", mintNFT);

function mintNFT() {
  let nft_name = document.querySelector("#nft_name").value;
  let nft_width = document.querySelector("#nft_width").value;
  let nft_height = document.querySelector("#nft_height").value;
  let nft_depth = document.querySelector("#nft_depth").value;
  let nft_x = document.querySelector("#nft_x").value;
  let nft_y = document.querySelector("#nft_y").value;
  let nft_z = document.querySelector("#nft_z").value;

  if (typeof window.ethereum == "undefined") {
    ("You should install Metamask");
  }
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    "0xc9f66495367b0895b1fc366fe5d229159788d570"
  );

  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .mint(nft_name, nft_width, nft_height, nft_depth, nft_x, nft_y, nft_z)
      .send({ from: accounts[0], value: "10" })
      .then(() => {
        console.log("NFT is created");
      });
  });
}

//using ropsten promise
//this promise after resolving return an object { supply: supply, nft: data } data is object array
ropsten.then((result) => {
  result.nft.forEach((object, index) => {
    if (index <= result.supply) {
      const geometry = new THREE.BoxGeometry(object.w, object.h, object.d);
      // let color_code = document.querySelector("#color_code").value;
      const material = new THREE.MeshPhongMaterial({ color: "#BFD0BC" });
      const nft = new THREE.Mesh(geometry, material);
      nft.position.set(object.x, object.y, object.z);
      scene.add(nft);
    }
  });
});
