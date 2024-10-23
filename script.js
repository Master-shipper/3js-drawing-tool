import * as THREE from 'three';

// Create scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

// Variables to store line and box
let line, box;
let isDrawing = false;
let startPoint = new THREE.Vector3();
let endPoint = new THREE.Vector3();

// Selectors for color input elements
const lineColorInput = document.getElementById('lineColor');
const boxColorInput = document.getElementById('boxColor');

// Function to create a line with dynamic color
function createLine(start, end) {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: lineColorInput.value });
    line = new THREE.Line(geometry, material);
    scene.add(line);
}

// Function to update the line position
function updateLine(start, end) {
    const points = [start, end];
    line.geometry.setFromPoints(points);
    line.material.color.set(lineColorInput.value); // Update color in real-time
}

// Function to create a box with dynamic color
function createBox() {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: boxColorInput.value });
    box = new THREE.Mesh(geometry, material);
    scene.add(box);
}

// Function to update the box position to the midpoint
function updateBoxPosition(start, end) {
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    box.position.copy(midpoint);
    box.material.color.set(boxColorInput.value); // Update color in real-time
}

// Mouse events
function onMouseDown(event) {
    isDrawing = true;
    startPoint = getMousePosition(event);
    createLine(startPoint, startPoint); // Initialize the line at the same point
    createBox(); // Create box at the midpoint
}

function onMouseMove(event) {
    if (isDrawing) {
        endPoint = getMousePosition(event);
        updateLine(startPoint, endPoint); // Update line as mouse moves
        updateBoxPosition(startPoint, endPoint); // Update box position to midpoint
    }
}

function onMouseUp() {
    isDrawing = false;
}

// Helper function to convert screen space mouse position to Three.js world coordinates
function getMousePosition(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(distance));
}

// Event listeners
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
