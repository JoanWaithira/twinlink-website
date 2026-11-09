/**
 * Shared 3D engine for the ClarionIQ "digital twin" scenes (three.js).
 *
 * Provides what every scene has in common: renderer with glow (bloom), light/dark colours,
 * an eased camera with pointer parallax and scroll pull-back, buildings that rise on load,
 * labels that follow the model, pulsing rings, drifting data particles and a scan beam.
 * Scenes (city.ts, park.ts, portfolio.ts, campus.ts, region.ts) build their own content on top.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Fog,
  GridHelper,
  Group,
  LineBasicMaterial,
  LineSegments,
  type Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NormalBlending,
  PCFSoftShadowMap,
  ShadowMaterial,
  HemisphereLight,
  PerspectiveCamera,
  Plane,
  Raycaster,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { createDust } from './dust';

export type View = { a: number; r: number; h: number; lx: number; lz: number };

export interface Palette {
  ground: string; grid: string; road: string; building: string; edge: string; edgeHi: string;
  accent: string; pulse: string; tree: string; treeHi: string; water: string; car: string; fog: string;
  /** Three-step scale, low to high (for priority and capacity). */
  scale: [string, string, string, string];
  ambient: number; sun: number; shadow: number; edgeOpacity: number; buildingOpacity: number; gridOpacity: number; bloom: number;
  dark: boolean;
}
const DARK: Palette = {
  ground: '#0b1d3a', grid: '#2f5a94', road: '#14305a', building: '#173d73', edge: '#6bb3ff',
  edgeHi: '#bfe0ff', accent: '#6bb3ff', pulse: '#d6ebff', tree: '#2c8f68', treeHi: '#5fe0a8', water: '#2f6fc0',
  car: '#e6ebf3', fog: '#07152b', scale: ['#163763', '#2c62a3', '#4d93e6', '#bfe0ff'],
  ambient: 0.9, sun: 1.1, shadow: 0.35, edgeOpacity: 0.85, buildingOpacity: 0.72, gridOpacity: 0.45, bloom: 0.9, dark: true,
};
const LIGHT: Palette = {
  ground: '#fafaf7', grid: '#cddcee', road: '#e6eef8', building: '#f7faff', edge: '#2d5e9e',
  edgeHi: '#0b1830', accent: '#1f63c6', pulse: '#1f63c6', tree: '#6cc196', treeHi: '#1f9d62', water: '#3d8ee0',
  car: '#1d3f6e', fog: '#fafaf7', scale: ['#e3edf9', '#a9c6ee', '#5a92df', '#1f5bb8'],
  ambient: 0.5, sun: 2.0, shadow: 0.4, edgeOpacity: 1, buildingOpacity: 1, gridOpacity: 0.7, bloom: 0, dark: false,
};

export const isDark = () => getComputedStyle(document.documentElement).colorScheme.includes('dark');
export const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOut = (x: number) => { const t = clamp01(x); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

export interface EngineOptions {
  /** Starting camera (the intro swoops from here to the first view). */
  intro: View;
  /** Size of the ground and the area the particles and scan beam cover. */
  size?: number;
  /** Draw ground plane and grid. */
  ground?: boolean;
  /** Vertical field of view for wide and for tall stages. */
  fov?: [wide: number, tall: number];
  /** Opacity of labels that are not the focus (default 0.12; 0 hides them). */
  labelFloor?: number;
  /** Camera distance factor for a stage size (default: closer on small screens). */
  zoomFor?: (w: number, h: number) => number;
  /** A soft dark vignette around the frame (full-screen scenes). */
  vignette?: boolean;
}

export interface Label {
  el: HTMLElement;
  anchor: Vector3;
  /** 0..1; dims the label when it is not the focus. */
  emphasis: number;
  /** Delay (s) before it fades in. */
  delay: number;
  side: 'left' | 'right' | 'below';
}

type FrameFn = (t: number, dt: number, now: number) => void;
type PaletteFn = (pal: Palette) => void;

export function createEngine(stage: HTMLElement, opts: EngineOptions) {
  const size = opts.size ?? 34;
  const labelFloor = opts.labelFloor ?? 0.12;
  const [fovWide, fovTall] = opts.fov ?? [30, 38];

  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  // Shadows are recalculated only while buildings move (intro, scenes that animate heights);
  // scenes call keepShadowsLive() for that. Saves work on modest devices.
  renderer.shadowMap.autoUpdate = false;
  let shadowsLive = false;
  stage.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.fog = new Fog('#000', 95, 180);
  const camera = new PerspectiveCamera(fovWide, 1, 0.1, 240);

  // Glow (bloom): bright outlines, pulses, beam and particles light up the scene.
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(pixelRatio);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.9, 0.45, 0.4);
  composer.addPass(bloom);
  // Optional vignette: darkens the corners a little, for a more cinematic frame.
  const vignette = opts.vignette
    ? new ShaderPass({
        uniforms: { tDiffuse: { value: null }, uStrength: { value: 0.55 } },
        vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: 'uniform sampler2D tDiffuse; uniform float uStrength; varying vec2 vUv; void main() { vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; float v = smoothstep(0.85, 0.2, length(d * vec2(1.1, 1.0))); gl_FragColor = vec4(c.rgb * mix(1.0 - uStrength, 1.0, v), c.a); }',
      })
    : null;
  if (vignette) composer.addPass(vignette);
  composer.addPass(new OutputPass());

  const ambient = new AmbientLight(0xffffff, 0.7);
  const sky = new HemisphereLight(0xffffff, 0x86ade3, 0);
  const sun = new DirectionalLight(0xffffff, 1.1);
  sun.position.set(14, 26, 8);
  // Soft shadows on the ground make the buildings read as solid objects.
  sun.castShadow = true;
  const shadowRes = window.innerWidth < 768 ? 1024 : 2048;
  sun.shadow.mapSize.set(shadowRes, shadowRes);
  sun.shadow.camera.left = -size * 0.65; sun.shadow.camera.right = size * 0.65;
  sun.shadow.camera.top = size * 0.65; sun.shadow.camera.bottom = -size * 0.65;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 80;
  sun.shadow.bias = -0.0008;
  sun.shadow.radius = 4;
  scene.add(ambient, sky, sun);
  const shadowMat = new ShadowMaterial({ opacity: 0.3 });

  const world = new Group();
  scene.add(world);

  // Shared materials (themed below).
  const mats = {
    ground: new MeshStandardMaterial({ roughness: 1 }),
    road: new MeshStandardMaterial({ roughness: 1, emissiveIntensity: 0 }),
    building: new MeshStandardMaterial({ roughness: 0.85, metalness: 0.05, transparent: true, opacity: 0.94 }),
    edge: new LineBasicMaterial({ transparent: true }),
    accent: new MeshStandardMaterial({ roughness: 0.5, emissiveIntensity: 0.6 }),
    accentEdge: new LineBasicMaterial({ transparent: true, opacity: 0.9 }),
    pulse: new MeshBasicMaterial({ transparent: true }),
    line: new LineBasicMaterial({ transparent: true, opacity: 0.35 }),
    ring: new MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0.85 }),
  };

  let gridMat: LineBasicMaterial | null = null;
  if (opts.ground !== false) {
    const ground = new Mesh(new PlaneGeometry(size, size), mats.ground);
    ground.rotation.x = -Math.PI / 2;
    world.add(ground);
    // A separate plane that only shows shadows (the ground itself glows to the page colour in light).
    const shadowPlane = new Mesh(new PlaneGeometry(size, size), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.012;
    shadowPlane.receiveShadow = true;
    world.add(shadowPlane);
    const grid = new GridHelper(size, size);
    gridMat = grid.material as LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.vertexColors = false;
    gridMat.needsUpdate = true;
    grid.position.y = 0.01;
    world.add(grid);
  }

  /** A flat strip on the ground (road, plot). */
  const addPlane = (cx: number, cz: number, w: number, d: number, y = 0.02, mat: Material = mats.road) => {
    const m = new Mesh(new PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(cx, y, cz);
    world.add(m);
    return m;
  };

  // Buildings rise on load.
  const rising: { mesh: Mesh; delay: number; target: number }[] = [];
  /** A box standing on the ground at (cx, cz), with glowing outlines; rises on load. */
  const addBox = (cx: number, cz: number, w: number, d: number, h: number, mat = mats.building, edges: LineBasicMaterial | null = mats.edge, delay?: number) => {
    const geo = new BoxGeometry(w, h, d);
    geo.translate(0, h / 2, 0);
    const mesh = new Mesh(geo, mat);
    mesh.position.set(cx, 0, cz);
    mesh.castShadow = true;
    if (edges) {
      // Outlines are drawn after the (see-through) faces, so the faces never paint over them.
      const lines = new LineSegments(new EdgesGeometry(geo), edges);
      lines.renderOrder = 2;
      mesh.add(lines);
    }
    world.add(mesh);
    rising.push({ mesh, delay: delay ?? Math.max(cx + cz + size * 0.7, 0) * 0.022, target: 1 });
    return mesh;
  };

  // Labels that follow the model, and pulsing rings at their anchors.
  const labels: Label[] = [];
  const addLabel = (anchor: Vector3, el: HTMLElement, side: 'left' | 'right' | 'below' = 'right', delay = 1.4) => {
    el.classList.add('twin-label', `twin-label--${side}`);
    stage.appendChild(el);
    const label: Label = { el, anchor, emphasis: 1, delay, side };
    labels.push(label);
    return label;
  };
  const ringGeo = new RingGeometry(0, 0.2, 32);
  const rings: Mesh[] = [];
  const addRing = (anchor: Vector3) => {
    const ring = new Mesh(ringGeo, mats.ring);
    ring.position.copy(anchor);
    world.add(ring);
    rings.push(ring);
    return ring;
  };

  // Data particles drifting up.
  const PARTICLES = 380;
  const partPos = new Float32Array(PARTICLES * 3);
  const partSpeed = new Float32Array(PARTICLES);
  const spread = size * 0.9;
  for (let i = 0; i < PARTICLES; i++) {
    partPos[i * 3] = (Math.random() - 0.5) * spread;
    partPos[i * 3 + 1] = Math.random() * 16;
    partPos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    partSpeed[i] = 0.25 + Math.random() * 0.7;
  }
  const partGeo = new BufferGeometry();
  partGeo.setAttribute('position', new BufferAttribute(partPos, 3));
  const partMat = new PointsMaterial({ size: 0.11, transparent: true, opacity: 0.75, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true });
  world.add(new Points(partGeo, partMat));

  // Glittering dust with depth around the model; reacts to the pointer (see dust.ts).
  const dust = createDust({ count: window.innerWidth < 768 ? 900 : 2600, spread: size * 1.5, height: 22, pixelRatio });
  scene.add(dust.points);

  // Scan beam: a wall of light sweeping across the scene.
  const SCAN_MS = 1500;
  const scanMat = new MeshBasicMaterial({ transparent: true, opacity: 0, side: DoubleSide, depthWrite: false, blending: AdditiveBlending });
  const scan = new Mesh(new PlaneGeometry(size, 9), scanMat);
  scan.rotation.y = Math.PI / 2;
  scan.position.y = 4.5;
  const scanLineMat = new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
  const scanLine = new Mesh(new PlaneGeometry(0.22, size), scanLineMat);
  scanLine.rotation.x = -Math.PI / 2;
  scanLine.position.y = 0.08;
  world.add(scan, scanLine);
  let scanAt = -1e9;

  // Colours follow the light/dark theme.
  let pal = isDark() ? DARK : LIGHT;
  const paletteFns: PaletteFn[] = [];
  const applyPalette = () => {
    pal = isDark() ? DARK : LIGHT;
    mats.ground.color.set(pal.ground);
    // Light theme: the lit ground would read as a grey slab; let it glow to the page colour so
    // only the grid shows. (The dark ground already matches the dark page.)
    mats.ground.emissive.set(pal.dark ? '#000000' : pal.ground);
    mats.ground.emissiveIntensity = pal.dark ? 0 : 0.6;
    mats.road.color.set(pal.road); mats.road.emissive.set(pal.accent);
    mats.building.color.set(pal.building); mats.building.opacity = pal.buildingOpacity;
    // Light theme: a gentle self-light so faces read as bright glass rather than flat grey.
    mats.building.emissive.set(pal.dark ? '#000000' : pal.building);
    mats.building.emissiveIntensity = pal.dark ? 0 : 0.08;
    // Dark: glassy and see-through; light: solid.
    mats.building.transparent = pal.dark;
    mats.building.depthWrite = true;
    mats.building.needsUpdate = true;
    mats.edge.color.set(pal.edge);
    mats.accent.color.set(pal.accent); mats.accent.emissive.set(pal.accent);
    mats.accentEdge.color.set(pal.edgeHi);
    mats.pulse.color.set(pal.pulse);
    mats.line.color.set(pal.accent);
    mats.ring.color.set(pal.accent);
    if (gridMat) { gridMat.color.set(pal.grid); gridMat.opacity = pal.gridOpacity; }
    ambient.intensity = pal.ambient;
    sky.intensity = pal.dark ? 0 : 0.9;
    sun.intensity = pal.sun;
    shadowMat.opacity = pal.shadow;
    (scene.fog as Fog).color.set(pal.fog);
    // The bloom pipeline encodes the background colour once more on output; convert it back
    // first so the 3D background matches the page colour exactly.
    renderer.setClearColor(new Color(pal.fog).convertSRGBToLinear(), 1);
    bloom.strength = pal.bloom;
    // No glow on white: it would brighten the background into a visible box.
    bloom.enabled = pal.bloom > 0;
    partMat.color.set(pal.pulse);
    partMat.opacity = pal.dark ? 0.75 : 0.45;
    partMat.blending = pal.dark ? AdditiveBlending : NormalBlending; // additive glow only works on dark
    partMat.needsUpdate = true;
    dust.setColors(pal.dark ? ['#6bb3ff', '#7fe3ff', '#d6ebff', '#ffd27a'] : ['#5b9bea', '#7ab8f2', '#9cc4f0', '#4f8fe0'], pal.dark);
    scanMat.color.set(pal.accent);
    scanLineMat.color.set(pal.pulse);
    // Additive (light-adding) effects only show on dark; use normal blending on light.
    for (const m of [scanMat, scanLineMat]) { m.blending = pal.dark ? AdditiveBlending : NormalBlending; m.needsUpdate = true; }
    for (const fn of paletteFns) fn(pal);
  };
  const themeObserver = new MutationObserver(applyPalette);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', applyPalette);

  // Camera: eased moves between views, pointer parallax, scroll pull-back.
  const cam: View = { ...opts.intro };
  let camFrom: View = { ...cam };
  let camTo: View = { ...cam };
  let camAt = 0;
  let camDur = 1;
  const moveTo = (view: View, ms: number, now = performance.now()) => {
    camFrom = { ...cam }; camTo = view; camAt = now; camDur = ms;
  };
  let scroll = 0;
  let edgeFactor = 1;
  let zoom = 1; // camera distance factor for small screens (set on resize)
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false, movedAt: 0 };
  const onPointer = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    pointer.inside = e.pointerType === 'mouse' && Math.abs(pointer.tx) <= 1 && Math.abs(pointer.ty) <= 1;
    pointer.movedAt = performance.now();
  };
  // Where the pointer meets a level just above the ground (for the dust).
  const ray = new Raycaster();
  const dustLevel = new Plane(new Vector3(0, 1, 0), -4);
  const ndc = new Vector2();
  const pointerWorld = new Vector3();
  window.addEventListener('pointermove', onPointer, { passive: true });

  // Size.
  let w = 0, h = 0;
  const resize = () => {
    w = stage.clientWidth; h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? fovTall : fovWide;
    // Small screens: bring the camera closer so the model fills the view.
    zoom = opts.zoomFor ? opts.zoomFor(w, h) : w < 520 ? 0.68 : w < 760 ? 0.8 : w < 1000 ? 0.92 : 1;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);

  // Render only while visible.
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(stage);

  const frameFns: FrameFn[] = [];
  const v = new Vector3();
  let start = 0;
  let last = 0;
  let raf = 0;
  const step = (now: number) => {
    if (!start) { start = now; last = now; }
    const t = (now - start) / 1000;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    for (const b of rising) b.mesh.scale.y = Math.max(easeOut((t - 0.2 - b.delay) / 0.9) * b.target, 0.001);
    // Outline brightness is reset every frame; scenes may adjust it, the scan beam adds to it.
    mats.edge.opacity = pal.edgeOpacity * edgeFactor;

    for (const fn of frameFns) fn(t, dt, now);
    // Update shadows during the intro rise, or every frame when a scene asks for it.
    if (shadowsLive || t < 2.6) renderer.shadowMap.needsUpdate = true;

    const k = easeInOut((now - camAt) / camDur);
    (Object.keys(cam) as (keyof View)[]).forEach((key) => { cam[key] = MathUtils.lerp(camFrom[key], camTo[key], k); });
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    const angle = cam.a + pointer.x * 0.12;
    const pull = easeInOut(scroll);
    const radius = (cam.r + pull * 26) * zoom;
    camera.position.set(cam.lx + Math.cos(angle) * radius, (cam.h + pull * 22) * zoom - pointer.y * 1.5, cam.lz + Math.sin(angle) * radius);
    camera.lookAt(cam.lx, 0.5, cam.lz);

    rings.forEach((ring) => {
      ring.lookAt(camera.position);
    });
    for (const l of labels) {
      v.copy(l.anchor).project(camera);
      let x = (v.x + 1) / 2 * w;
      const y = (1 - v.y) / 2 * h;
      // Keep the whole label inside the view (matters on narrow screens).
      const lw = l.el.offsetWidth, pad = Math.max(8, w * 0.09);
      const left = l.side === 'left' ? -20 - lw : l.side === 'right' ? 20 : -lw / 2;
      x = Math.min(Math.max(x, pad - left), w - pad - left - lw);
      l.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      l.el.style.opacity = String(easeOut((t - l.delay) / 0.6) * (labelFloor + (1 - labelFloor) * l.emphasis) * (v.z < 1 ? 1 : 0));
    }

    for (let i = 0; i < PARTICLES; i++) {
      let y = partPos[i * 3 + 1] + partSpeed[i] * dt;
      if (y > 16) y -= 16;
      partPos[i * 3 + 1] = y;
    }
    partGeo.attributes.position.needsUpdate = true;

    let hit: Vector3 | null = null;
    if (pointer.inside && now - pointer.movedAt < 2500) {
      ray.setFromCamera(ndc.set(pointer.tx, -pointer.ty), camera);
      hit = ray.ray.intersectPlane(dustLevel, pointerWorld);
    }
    dust.update(t, hit);

    const sp = (now - scanAt) / SCAN_MS;
    if (sp >= 0 && sp <= 1) {
      const x = MathUtils.lerp(-size / 2, size / 2, easeInOut(sp));
      const fade = Math.sin(sp * Math.PI);
      scan.position.x = x; scanLine.position.x = x;
      scanMat.opacity = fade * (pal.dark ? 0.16 : 0.14);
      scanLineMat.opacity = fade * (pal.dark ? 0.9 : 0.7);
      mats.edge.opacity = Math.min(1, mats.edge.opacity + fade * 0.25);
    } else {
      scanMat.opacity = 0; scanLineMat.opacity = 0;
    }

    composer.render();
  };
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // Browsers already pause animation frames in background tabs.
    if (!visible) { last = now; return; }
    step(now);
  };

  return {
    stage, scene, world, camera, mats,
    get pal() { return pal; },
    /** Register colours that depend on the theme; called now and on every theme change. */
    onPalette(fn: PaletteFn) { paletteFns.push(fn); fn(pal); },
    /** Called every frame with time since start (s), frame time (s) and timestamp (ms). */
    onFrame(fn: FrameFn) { frameFns.push(fn); },
    addPlane, addBox, addLabel, addRing,
    moveTo,
    /** Sweep the scan beam, optionally after a delay. */
    scanNow(delayMs = 0, now = performance.now()) { scanAt = now + delayMs; },
    setScroll(p: number) { scroll = clamp01(p); },
    /** Keep shadows updating every frame (for scenes whose shapes keep moving). */
    keepShadowsLive() { shadowsLive = true; },
    /** Scale the outline brightness for this scene (1 = default). */
    setEdgeFactor(f: number) { edgeFactor = f; },
    /** Start rendering (after the scene has added its content). */
    start() {
      resize();
      applyPalette();
      raf = requestAnimationFrame(frame);
    },
    /** Draw one frame now (used only by the development test hook). */
    renderNow() { step(performance.now()); },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); themeObserver.disconnect();
      mq.removeEventListener('change', applyPalette);
      window.removeEventListener('pointermove', onPointer);
      dust.dispose();
      composer.dispose();
      renderer.dispose();
      stage.replaceChildren();
    },
  };
}

export type Engine = ReturnType<typeof createEngine>;

/** Builds a standard data label: small label, large value, tag. */
export function dataLabel(label: string, value: string, tag?: string) {
  const el = document.createElement('div');
  const l = document.createElement('span'); l.className = 'twin-label__label'; l.textContent = label;
  const v = document.createElement('span'); v.className = 'twin-label__value'; v.textContent = value;
  el.append(l, v);
  if (tag) { const g = document.createElement('span'); g.className = 'twin-label__tag'; g.textContent = tag; el.append(g); }
  return { el, value: v };
}
