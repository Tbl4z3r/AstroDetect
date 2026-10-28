import {
  AdditiveBlending, AmbientLight, BufferGeometry, CanvasTexture, Color, Float32BufferAttribute, Group, Line, LineBasicMaterial,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PointLight, Points, PointsMaterial, Scene, SphereGeometry,
  Sprite, SpriteMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface OrbitView {
  setBodies: (planetToStarRatio: number, angle: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  resetCamera: () => void;
  dispose: () => void;
}

export const VISUAL_ORBIT_RADIUS = 4;
const CAMERA_HOME = new Vector3(0, 0.8, 9);

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function paintTexture(width: number, height: number, paint: (context: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D no disponible.');
  paint(context);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function starTexture(): CanvasTexture {
  const random = seededRandom(7);
  return paintTexture(512, 256, context => {
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#ffb347');
    gradient.addColorStop(0.5, '#ffd27a');
    gradient.addColorStop(1, '#ffb347');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 256);
    for (let index = 0; index < 5000; index++) {
      const radius = 0.6 + random() * 1.8;
      context.fillStyle = random() > 0.5 ? 'rgba(255, 246, 210, 0.22)' : 'rgba(214, 110, 20, 0.16)';
      context.beginPath();
      context.arc(random() * 512, random() * 256, radius, 0, Math.PI * 2);
      context.fill();
    }
  });
}

function planetTexture(): CanvasTexture {
  const random = seededRandom(42);
  return paintTexture(512, 256, context => {
    const colors = ['#1d3f73', '#2f6ea8', '#3f8fb8', '#22507f', '#5aa9c9', '#16345f'];
    let y = 0;
    while (y < 256) {
      const band = 6 + random() * 22;
      context.fillStyle = colors[Math.floor(random() * colors.length)];
      context.fillRect(0, y, 512, band);
      y += band;
    }
    for (let index = 0; index < 160; index++) {
      context.fillStyle = 'rgba(220, 240, 255, 0.12)';
      context.beginPath();
      context.ellipse(random() * 512, random() * 256, 8 + random() * 30, 2 + random() * 4, 0, 0, Math.PI * 2);
      context.fill();
    }
  });
}

function glowTexture(): CanvasTexture {
  return paintTexture(256, 256, context => {
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 210, 120, 0.9)');
    gradient.addColorStop(0.35, 'rgba(255, 180, 80, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 160, 60, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  });
}

function backgroundStars(): Points {
  const random = seededRandom(2026);
  const positions: number[] = [];
  for (let index = 0; index < 900; index++) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 45;
    positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return new Points(geometry, new PointsMaterial({ color: 0xcfe6ff, size: 0.12, sizeAttenuation: true }));
}

function orbitLine(): Line {
  const points: number[] = [];
  for (let index = 0; index <= 256; index++) {
    const angle = index / 256 * Math.PI * 2;
    points.push(VISUAL_ORBIT_RADIUS * Math.sin(angle), 0, VISUAL_ORBIT_RADIUS * Math.cos(angle));
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  return new Line(geometry, new LineBasicMaterial({ color: 0x5cc8ff, transparent: true, opacity: 0.4 }));
}

export function createOrbitView(canvas: HTMLCanvasElement, container: HTMLElement): OrbitView {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(new Color('#060a1a'));
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 16 / 9, 0.1, 200);
  camera.position.copy(CAMERA_HOME);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.target.set(0, 0, 0);

  const textures = [starTexture(), planetTexture(), glowTexture()];
  const star = new Mesh(new SphereGeometry(1, 64, 64), new MeshBasicMaterial({ map: textures[0] }));
  const glow = new Sprite(new SpriteMaterial({ map: textures[2], blending: AdditiveBlending, depthWrite: false, transparent: true }));
  glow.scale.set(4.2, 4.2, 1);
  const planet = new Mesh(new SphereGeometry(1, 48, 48), new MeshStandardMaterial({ map: textures[1], roughness: 0.85, metalness: 0 }));
  const system = new Group();
  system.add(star, glow, planet, orbitLine());
  scene.add(system, backgroundStars(), new AmbientLight(0xffffff, 0.06));
  const sunlight = new PointLight(0xfff1d0, 4, 0, 0);
  scene.add(sunlight);

  let reducedMotion = false;
  let frame = 0;
  let disposed = false;

  function resize() {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, Math.round(width * 9 / 16));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  function resetCamera() {
    camera.position.copy(CAMERA_HOME);
    controls.target.set(0, 0, 0);
    controls.update();
  }
  canvas.addEventListener('dblclick', resetCamera);
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  function loop() {
    if (disposed) return;
    if (!reducedMotion) star.rotation.y += 0.0015;
    controls.update();
    renderer.render(scene, camera);
    frame = requestAnimationFrame(loop);
  }
  loop();

  return {
    setBodies(planetToStarRatio, angle) {
      const radius = Math.max(planetToStarRatio, 0.04);
      planet.scale.setScalar(radius);
      planet.position.set(VISUAL_ORBIT_RADIUS * Math.sin(angle), 0, VISUAL_ORBIT_RADIUS * Math.cos(angle));
    },
    setReducedMotion(reduced) {
      reducedMotion = reduced;
    },
    resetCamera,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('dblclick', resetCamera);
      controls.dispose();
      scene.traverse(object => {
        if (object instanceof Mesh || object instanceof Line || object instanceof Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of materials) material.dispose();
        }
      });
      glow.material.dispose();
      for (const texture of textures) texture.dispose();
      renderer.dispose();
    },
  };
}
