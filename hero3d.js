/* Data Learners · Hero 3D "Skill morph" particles (Three.js)
 * 입자 하나의 덩어리가 4개 스킬의 형태로 차례대로 모핑합니다.
 *   0 SQL      → 데이터베이스 실린더        (cyan)
 *   1 Python   → </> 코드 글리프            (violet)
 *   2 Tableau  → 3D 막대그래프 + 추세선      (orange)
 *   3 AI       → 레이어드 신경망            (lime)
 * 각 형태는 같은 개수의 점으로 샘플링해 attribute 4개로 올리고, 셰이더에서 from→to를 보간합니다.
 * 전환 중에는 입자마다 지연을 두고 흩어졌다 모이며, 색도 스킬 카드 색으로 바뀝니다.
 * onStage(i)로 현재 스킬을 알려 카드 하이라이트와 연동하고, go(i)로 특정 형태로 바로 전환할 수 있습니다.
 * still:true(모션 감소)이면 Tableau 형태의 정지 프레임만 그립니다.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const HOLD = 3.4, MORPH = 1.7;                    // 형태 유지·전환 시간(초)
const COLORS = [0x66dbff, 0xa896ff, 0xff9a51, 0xc8ff3d];

/* ---------- Shape samplers: each returns N points (Float32Array N*3) ---------- */
const rnd = (a, b) => a + Math.random() * (b - a);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

function sampleDatabase(N) {
  const out = new Float32Array(N * 3), r = 1.45, h = 2.3, y0 = -h / 2, bands = [0, 1 / 3, 2 / 3, 1];
  for (let i = 0; i < N; i++) {
    const u = Math.random(), a = Math.random() * Math.PI * 2;
    let x, y, z;
    if (u < 0.42) {                                // 디스크 경계 링(실린더를 3단으로 나눔)
      const b = bands[(Math.random() * 4) | 0], rr = r + gauss() * 0.025;
      x = Math.cos(a) * rr; z = Math.sin(a) * rr; y = y0 + b * h + gauss() * 0.02;
    } else if (u < 0.78) {                         // 옆면
      x = Math.cos(a) * r; z = Math.sin(a) * r; y = y0 + Math.random() * h;
    } else if (u < 0.95) {                         // 윗면
      const rr = Math.sqrt(Math.random()) * r; x = Math.cos(a) * rr; z = Math.sin(a) * rr; y = y0 + h;
    } else {                                       // 내부 데이터 먼지
      const rr = Math.sqrt(Math.random()) * r * 0.9; x = Math.cos(a) * rr; z = Math.sin(a) * rr; y = y0 + Math.random() * h;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function sampleGlyph(N, text) {
  const W = 320, H = 160, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 128px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  g.fillText(text, W / 2, H / 2 + 4);
  const d = g.getImageData(0, 0, W, H).data, px = [];
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (d[(y * W + x) * 4 + 3] > 140) px.push(x, y);
  const out = new Float32Array(N * 3), n = px.length / 2;
  for (let i = 0; i < N; i++) {
    const k = ((Math.random() * n) | 0) * 2;
    out.set([(px[k] + Math.random() - W / 2) / W * 4.6, -(px[k + 1] + Math.random() - H / 2) / W * 4.6, gauss() * 0.12], i * 3);
  }
  return out;
}

function sampleBars(N) {
  const out = new Float32Array(N * 3), hs = [0.9, 1.45, 1.15, 2.05, 2.75], w = 0.52, base = -1.4;
  const xs = hs.map((_, i) => (i - 2) * 0.86);
  const area = hs.map(h => 4 * w * h + 2 * w * w), tot = area.reduce((a, b) => a + b, 0);
  for (let i = 0; i < N; i++) {
    const u = Math.random();
    let x, y, z;
    if (u < 0.8) {                                  // 막대 표면
      let r = Math.random() * tot, b = 0; while (r > area[b]) r -= area[b++];
      const h = hs[b], f = Math.random() * (4 * h + 2 * w), s = rnd(-w / 2, w / 2);
      if (f < 4 * h) { const side = (f / h) | 0, t = base + (f % h);
        x = xs[b] + (side === 0 ? -w / 2 : side === 1 ? w / 2 : s); z = side < 2 ? s : (side === 2 ? -w / 2 : w / 2); y = t;
      } else { x = xs[b] + s; z = rnd(-w / 2, w / 2); y = base + h; }
    } else if (u < 0.93) {                          // 꼭대기를 잇는 추세선
      const t = Math.random() * 4, k = Math.min(3, t | 0), f = t - k;
      x = xs[k] + (xs[k + 1] - xs[k]) * f; y = base + 0.45 + hs[k] + (hs[k + 1] - hs[k]) * f; z = gauss() * 0.03;
      y += gauss() * 0.02;
    } else {                                        // 바닥 축
      x = rnd(-2.2, 2.2); y = base; z = rnd(-0.5, 0.5) * 0.3;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function sampleNetwork(N) {
  const layers = [3, 5, 5, 2], nodes = [];
  layers.forEach((n, l) => { for (let i = 0; i < n; i++) nodes.push({l, x: (l - 1.5) * 1.3, y: (i - (n - 1) / 2) * 0.68, z: rnd(-0.35, 0.35)}); });
  const edges = [];
  nodes.forEach(a => nodes.forEach(b => { if (b.l === a.l + 1) edges.push([a, b]); }));
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    let x, y, z;
    if (Math.random() < 0.38) {                     // 노드: 작은 구 형태로 뭉침
      const n = nodes[(Math.random() * nodes.length) | 0], r = 0.13 * Math.cbrt(Math.random());
      const th = Math.random() * Math.PI * 2, ph = Math.acos(rnd(-1, 1));
      x = n.x + r * Math.sin(ph) * Math.cos(th); y = n.y + r * Math.cos(ph); z = n.z + r * Math.sin(ph) * Math.sin(th);
    } else {                                        // 엣지
      const [a, b] = edges[(Math.random() * edges.length) | 0], t = Math.random();
      x = a.x + (b.x - a.x) * t; y = a.y + (b.y - a.y) * t + gauss() * 0.012; z = a.z + (b.z - a.z) * t;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

export function start({canvas, host, hero, small, still, onStage}) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: false, powerPreference: 'high-performance'});
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.9, 11.5); camera.lookAt(0, 0.1, 0);

  const N = small ? 6000 : 13000;
  const shapes = [sampleDatabase(N), sampleGlyph(N, '</>'), sampleBars(N), sampleNetwork(N)];
  const seed = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(rnd(-1, 1));
    seed.set([Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th), Math.random()], i * 4);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(shapes[0], 3));
  shapes.forEach((s, i) => geo.setAttribute('aS' + i, new THREE.BufferAttribute(s, 3)));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));

  const U = {
    uTime: {value: 0}, uProg: {value: 0}, uDpr: {value: 1}, uRes: {value: new THREE.Vector2(1, 1)}, uIntro: {value: still ? 1 : 0},
    uFrom: {value: new THREE.Vector4(1, 0, 0, 0)}, uTo: {value: new THREE.Vector4(1, 0, 0, 0)},
    uColA: {value: new THREE.Color(COLORS[0])}, uColB: {value: new THREE.Color(COLORS[0])},
  };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uProg, uDpr; uniform vec4 uFrom, uTo;
      attribute vec3 aS0, aS1, aS2, aS3; attribute vec4 aSeed;
      varying float vMix; varying float vA;
      vec3 pick(vec4 w){ return aS0 * w.x + aS1 * w.y + aS2 * w.z + aS3 * w.w; }
      void main(){
        // 입자마다 시작 시점을 조금씩 다르게 → 물결처럼 번지는 전환
        float t = clamp((uProg - aSeed.w * 0.35) / 0.65, 0.0, 1.0);
        float e = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        vec3 p = mix(pick(uFrom), pick(uTo), e);
        float burst = sin(3.14159 * t);
        p += aSeed.xyz * burst * (0.55 + aSeed.w * 0.9);                   // 흩어졌다 모임
        float sw = burst * 1.1;                                            // 전환 중 소용돌이
        p.xz = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * p.xz;
        p += aSeed.xyz * 0.025 * sin(uTime * (1.2 + aSeed.w * 2.0) + aSeed.w * 30.0);   // 미세한 호흡
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vMix = e;
        float tw = 0.75 + 0.25 * sin(uTime * 2.3 + aSeed.w * 60.0);
        vA = tw * (1.0 - burst * 0.35);
        gl_PointSize = (2.3 + step(0.985, aSeed.w) * 2.8 + burst * 1.2) * uDpr * (11.5 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColA, uColB; uniform vec2 uRes; uniform float uIntro;
      varying float vMix; varying float vA;
      void main(){
        float r = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, r) * vA * 1.35 * uIntro;
        a *= smoothstep(0.0, 0.28, gl_FragCoord.x / uRes.x);
        vec3 c = mix(mix(uColA, uColB, vMix), vec3(1.0), smoothstep(0.18, 0.0, r) * 0.55);
        gl_FragColor = vec4(c * a, a);
      }`,
  }));
  points.frustumCulled = false;

  // 형태 뒤에 깔리는 은은한 컬러 헤일로
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uColA, uColB; uniform float uProg, uIntro; uniform vec2 uRes; varying vec2 vUv;
      void main(){ float r = length(vUv - 0.5) * 2.0; float a = exp(-r * r * 4.0) * 0.1 * uIntro * smoothstep(0.0, 0.28, gl_FragCoord.x / uRes.x);
        vec3 c = mix(uColA, uColB, smoothstep(0.2, 0.9, uProg)); gl_FragColor = vec4(c * a, a); }`,
  }));
  halo.position.z = -2.5;

  const world = new THREE.Group();
  world.add(points);
  scene.add(halo, world);

  /* ---------- Stage control ---------- */
  const W4 = i => new THREE.Vector4(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0, i === 3 ? 1 : 0);
  let cur = still ? 2 : 0, next = cur, phase = 'hold', clock = 0, pinned = false;
  const setStage = (from, to) => {
    U.uFrom.value.copy(W4(from)); U.uTo.value.copy(W4(to));
    U.uColA.value.setHex(COLORS[from]); U.uColB.value.setHex(COLORS[to]);
  };
  setStage(cur, cur);
  onStage && onStage(cur);
  const go = (i, pin) => {
    if (pin !== undefined) pinned = pin;            // 카드에 마우스를 올린 동안은 자동 전환을 멈춤
    if (still || i === next) return;
    if (phase === 'morph') cur = next;              // 전환 도중이면 현재 목표에서 다시 출발
    next = i; setStage(cur, next); U.uProg.value = 0; phase = 'morph'; clock = 0; onStage && onStage(next);
  };

  /* ---------- Sizing ---------- */
  const size = () => {
    const w = host.offsetWidth, h = host.offsetHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    U.uRes.value.set(w * dpr, h * dpr); U.uDpr.value = dpr;
    world.position.x = small ? 0 : 0.35; halo.position.x = world.position.x;
    world.position.y = small ? -0.1 : 0.15;
    world.scale.setScalar(small ? 0.92 : 0.9);
  };

  /* ---------- Pointer / scroll ---------- */
  const cam = {x: 0, y: 0, tx: 0, ty: 0};
  if (!still && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      cam.tx = (e.clientX - r.left) / r.width - 0.5; cam.ty = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener('pointerleave', () => { cam.tx = 0; cam.ty = 0; });
  }
  const draw = dt => {
    const k = 1 - Math.exp(-dt * 3);
    cam.x += (cam.tx - cam.x) * k; cam.y += (cam.ty - cam.y) * k;
    const t = U.uTime.value, s = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight || 1)));
    world.rotation.y = (still ? -0.25 : Math.sin(t * 0.32) * 0.38) + cam.x * 0.5;   // 형태가 읽히도록 회전은 좌우 흔들림으로 제한
    world.rotation.x = 0.12 + cam.y * 0.3 + s * 0.3;
    renderer.render(scene, camera);
  };

  size();
  let rs; addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(() => { size(); if (still) draw(0); }, 150); });
  const release = () => { pinned = false; clock = 0; };
  if (still) { draw(0); return {go, release}; }

  /* ---------- Loop (paused off-screen / hidden tab) ---------- */
  let running = false, raf = 0, last = 0, intro = 0;
  const frame = now => {
    raf = 0; if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    U.uTime.value += dt; clock += dt;
    intro = Math.min(1, intro + dt / 1.6); U.uIntro.value = intro * intro * (3 - 2 * intro);
    if (phase === 'hold' && clock > HOLD && !pinned) go((cur + 1) % 4);
    else if (phase === 'morph') {
      U.uProg.value = Math.min(1, clock / MORPH);
      if (U.uProg.value >= 1) { cur = next; setStage(cur, cur); U.uProg.value = 0; phase = 'hold'; clock = 0; }
    }
    draw(dt);
    raf = requestAnimationFrame(frame);
  };
  let inView = true;
  const play = () => { running = inView && !document.hidden; if (running && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(es => { inView = es[0].isIntersecting; play(); }).observe(hero);
  document.addEventListener('visibilitychange', play);
  play();
  return {go, release};
}
