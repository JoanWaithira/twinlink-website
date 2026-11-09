/**
 * Glittering dust: thousands of soft points with depth around the model, in the style of
 * activetheory.net. Small sharp specks and a few large, blurred ones (out of focus) drift and
 * twinkle; near the pointer they light up and move aside.
 */
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, NormalBlending, Points, ShaderMaterial, Vector3 } from 'three';

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHeight;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  uniform float uSizeScale;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * (0.12 + aSeed * 0.2);
    // Slow drift, and a gentle rise that wraps round.
    p.x += sin(t + aSeed * 20.0) * 1.2;
    p.z += cos(t * 0.8 + aSeed * 13.0) * 1.2;
    p.y = mod(p.y + uTime * (0.08 + aSeed * 0.22), uHeight) - 1.0;

    // Pointer: specks close to it move aside and light up.
    vec3 d = p - uPointer;
    float near = exp(-dot(d, d) / 22.0) * uPointerStrength;
    p += normalize(d + vec3(0.0001)) * near * 3.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = aSize * uSizeScale * uPixelRatio * (70.0 / depth);

    float twinkle = 0.45 + 0.55 * sin(uTime * (1.2 + aSeed * 3.5) + aSeed * 40.0);
    // Large points are out of focus: softer and fainter.
    float focus = mix(1.0, 0.3, smoothstep(3.5, 12.0, aSize));
    float fadeEdges = smoothstep(-1.0, 1.5, p.y) * smoothstep(uHeight - 1.0, uHeight - 5.0, p.y);
    vAlpha = (twinkle * focus + near * 1.5) * fadeEdges * smoothstep(190.0, 70.0, depth);
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`;

export function createDust(opts: { count: number; spread: number; height: number; pixelRatio: number }) {
  const { count, spread, height } = opts;
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const tone = new Float32Array(count); // 0..1, picks the colour
  for (let i = 0; i < count; i++) {
    // Denser near the model, thinning out further away.
    const r = Math.pow(Math.random(), 0.7) * spread;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * height;
    pos[i * 3 + 2] = Math.sin(a) * r;
    const big = Math.random() < 0.06;
    size[i] = big ? 6 + Math.random() * 10 : 1.2 + Math.random() * 3;
    seed[i] = Math.random();
    tone[i] = Math.random();
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  const colors = new Float32Array(count * 3);
  geo.setAttribute('aColor', new BufferAttribute(colors, 3));

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: opts.pixelRatio },
      uHeight: { value: height },
      uPointer: { value: new Vector3(0, -100, 0) },
      uPointerStrength: { value: 0 },
      uOpacity: { value: 1 },
      uSizeScale: { value: 1 },
    },
  });
  const points = new Points(geo, material);
  points.frustumCulled = false;

  /** Colours: mostly the accent blues, some cyan and a few warm specks. */
  const setColors = (palette: string[], dark: boolean) => {
    const c = new Color();
    for (let i = 0; i < count; i++) {
      const t = tone[i];
      c.set(t < 0.55 ? palette[0] : t < 0.8 ? palette[1] : t < 0.93 ? palette[2] : palette[3]);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.attributes.aColor.needsUpdate = true;
    material.blending = dark ? AdditiveBlending : NormalBlending; // additive glow only works on dark
    // Light theme: a fine, soft blue shimmer (dark specks on white read as dust on the screen).
    material.uniforms.uOpacity.value = dark ? 0.9 : 0.32;
    material.uniforms.uSizeScale.value = dark ? 1 : 0.75;
    material.needsUpdate = true;
  };

  return {
    points,
    setColors,
    update(time: number, pointer: Vector3 | null) {
      material.uniforms.uTime.value = time;
      const s = material.uniforms.uPointerStrength;
      if (pointer) material.uniforms.uPointer.value.lerp(pointer, 0.15);
      s.value += ((pointer ? 1 : 0) - s.value) * 0.05;
    },
    dispose() { geo.dispose(); material.dispose(); },
  };
}
