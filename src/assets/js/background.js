import * as THREE from 'three';

export function initializeBackground(backgroundElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  backgroundElement.appendChild(renderer.domElement);

  const NUM_POINTS = 1000;
  const points = [];

  for (let i = 0; i < NUM_POINTS; i++) {
    const p = new THREE.Vector3(
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500
    );
    points.push(p);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0x16b10e })
    );
    sphere.position.copy(p);
    scene.add(sphere);
  }

  let activeLines = [];
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const mouse3D = new THREE.Vector3();
  let lastLineTime = 0;
  const LINE_INTERVAL = 250;

  function createRandomLine(focusPoint = null) {
    let a = null;

    if (focusPoint) {
      const nearby = points.filter(p => p.distanceTo(focusPoint) < 100);
      if (nearby.length < 2) return;

      a = nearby[Math.floor(Math.random() * nearby.length)];
      let b = null;
      let tries = 0;
      const MAX_TRIES = 10;
      while (tries < MAX_TRIES) {
        const candidate = nearby[Math.floor(Math.random() * nearby.length)];
        if (candidate !== a) {
          b = candidate;
          break;
        }
        tries++;
      }

      if (!b) return;
      addLine(a, b);
    } else {
      a = points[Math.floor(Math.random() * points.length)];
      const MAX_DIST = 150;
      let b = null;
      let tries = 0;
      while (tries < 10) {
        const candidate = points[Math.floor(Math.random() * points.length)];
        if (candidate !== a && a.distanceTo(candidate) <= MAX_DIST) {
          b = candidate;
          break;
        }
        tries++;
      }
      if (!b) return;
      addLine(a, b);
    }
  }

  function addLine(a, b) {
    const geom = new THREE.BufferGeometry().setFromPoints([a, b]);
    const mat = new THREE.LineBasicMaterial({ color: 0x16b10e, transparent: true, opacity: 0.0 });
    const line = new THREE.Line(geom, mat);
    line.userData = {
      opacity: 0,
      direction: 1,
      lifetime: Math.random() * 200 + 100,
    };
    scene.add(line);
    activeLines.push(line);
  }

  function updateLines() {
    const now = performance.now();

    activeLines.forEach((line, i) => {
      const ud = line.userData;
      if (ud.direction === 1) {
        ud.opacity += 0.02;
        if (ud.opacity >= 1) ud.direction = -1;
      } else {
        ud.opacity -= 0.01;
      }
      line.material.opacity = ud.opacity;
      ud.lifetime--;
      if (ud.opacity <= 0 || ud.lifetime <= 0) {
        scene.remove(line);
        activeLines.splice(i, 1);
      }
    });

    if (activeLines.length < 25 && now - lastLineTime > LINE_INTERVAL) {
      createRandomLine(mouse3D);
      createRandomLine();
      lastLineTime = now;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.00035;
    scene.rotation.x += 0.0003;
    updateLines();
    console.log(mouse.x, mouse.y);
    renderer.render(scene, camera);
  }

  camera.position.z = 120;
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const rayOrigin = raycaster.ray.origin;
    const rayDirection = raycaster.ray.direction.clone().normalize();
    mouse3D.copy(rayOrigin.clone().add(rayDirection.multiplyScalar(100)));
  });
}
