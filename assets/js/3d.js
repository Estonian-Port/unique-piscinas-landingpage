import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const MODELS = [
    'assets/models/pileta/SEBAobj2.gltf',
    'assets/models/cocacola/scene.gltf',
    'assets/models/crappychair/Chair.gltf',
];

function initViewer(el, src) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(2, 1.2, 2.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    const loader = new GLTFLoader();
    loader.load(
        src,
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            // Frame model
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3()).length();
            const center = box.getCenter(new THREE.Vector3());
            controls.target.copy(center);
            camera.position.copy(center).add(new THREE.Vector3(size * 0.6, size * 0.4, size * 0.6));
            controls.update();
        },
        undefined,
        (err) => console.error('GLTF load error:', src, err)
    );

    const ro = new ResizeObserver(() => {
        const w = el.clientWidth || 300;
        const h = el.clientHeight || 280;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
    ro.observe(el);

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}

document.querySelectorAll('.container3D').forEach((el, i) => {
    initViewer(el, MODELS[i] || MODELS[MODELS.length - 1]);
});
