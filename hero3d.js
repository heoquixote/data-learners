/* Data Learners · Hero 3D "Data → Insight" sculpture (Three.js)
 * 히어로 오른쪽에 절차적으로 모델링한 3D 데이터 조형물을 렌더링합니다.
 *  - 데이터 필드: 원형으로 배치한 홀로그램 글래스 막대(인스턴싱). 높이가 파동처럼 바뀌는 3D 막대그래프
 *  - 인사이트 코어: 숨 쉬듯 변형되는 지오데식 네트워크(노드 + 엣지) + 프레넬 글로우 구체
 *  - 데이터 플로우: 막대 꼭대기에서 코어로 나선을 그리며 모이는 입자 (데이터 → 인사이트)
 *  - 궤도 링·바닥 레이더 그리드, 포인터·스크롤을 따라가는 카메라
 * 모든 애니메이션은 셰이더에서 시간 uniform으로 계산합니다(프레임당 CPU 작업 최소).
 * still:true(모션 감소)이면 정지 프레임 한 장만 그립니다.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

export function start({canvas, host, hero, small, still}) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'high-performance'});
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const U = {
    uTime: {value: still ? 6.5 : 0},
    uRes: {value: new THREE.Vector2(1, 1)},
    uDpr: {value: 1},
    uIntro: {value: still ? 1 : 0},
  };
  const LIME = 'vec3(0.784, 1.0, 0.239)', CYAN = 'vec3(0.4, 0.86, 1.0)';
  const FADE = `uniform vec2 uRes; uniform float uIntro;
    float edgeFade(){ vec2 f = gl_FragCoord.xy / uRes; return smoothstep(0.0, 0.3, f.x) * uIntro; }`;
  const add = (vs, fs) => new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: vs, fragmentShader: fs,
  });

  const world = new THREE.Group();
  scene.add(world);

  /* ---------- Data field: holographic glass bars ---------- */
  const R = 2.7, step = small ? 0.36 : 0.3, bw = step * 0.58;
  const cells = [];
  for (let x = -R; x <= R + 1e-6; x += step) for (let z = -R; z <= R + 1e-6; z += step) {
    if (Math.hypot(x, z) <= R) cells.push(x, z, Math.random());
  }
  const box = new THREE.BoxGeometry(bw, 1, bw); box.translate(0, 0.5, 0);
  const barGeo = new THREE.InstancedBufferGeometry().copy(box);
  barGeo.instanceCount = cells.length / 3;
  barGeo.setAttribute('aCell', new THREE.InstancedBufferAttribute(new Float32Array(cells), 3));
  const HEIGHT = `
    float barH(vec2 c, float s, float t){
      float r = length(c);
      float wave = 0.5 + 0.5 * sin(r * 1.9 - t * 1.15);
      float crs = 0.55 + 0.45 * sin(c.x * 1.4 + t * 0.55) * cos(c.y * 1.2 - t * 0.42);
      float h = (0.18 + 1.75 * wave * crs) * (1.0 - r / ${R.toFixed(2)} * 0.6);
      return h * (0.85 + 0.3 * s);
    }`;
  const bars = new THREE.Mesh(barGeo, add(
    `uniform float uTime; attribute vec3 aCell; ${HEIGHT}
     varying vec3 vN; varying vec3 vV; varying vec2 vUv; varying float vY; varying float vH;
     void main(){
       float h = barH(aCell.xy, aCell.z, uTime);
       vec3 p = position * vec3(1.0, h, 1.0) + vec3(aCell.x, 0.0, aCell.y);
       vec4 mv = modelViewMatrix * vec4(p, 1.0);
       vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
       vUv = uv; vY = position.y; vH = clamp(h / 1.6, 0.0, 1.0);
       gl_Position = projectionMatrix * mv;
     }`,
    `${FADE} varying vec3 vN; varying vec3 vV; varying vec2 vUv; varying float vY; varying float vH;
     void main(){
       vec3 accent = mix(${CYAN}, ${LIME}, smoothstep(0.25, 0.85, vH));
       float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
       vec2 e = min(vUv, 1.0 - vUv);
       float edge = 1.0 - smoothstep(0.0, 0.07, min(e.x, e.y));      // 유리 모서리 하이라이트
       float top = step(0.98, vY);                                        // 윗면 캡
       float body = 0.06 + 0.22 * vY;                                     // 아래는 어둡고 위로 갈수록 밝게
       float lift = 0.35 + 0.65 * vH;                                   // 키 큰 막대일수록 강조
       float a = (body * 0.8 + fres * 0.35 + edge * 0.45 * lift + top * (0.2 + 0.8 * vH * vH)) * edgeFade();
       gl_FragColor = vec4(accent * a, a);
     }`));
  bars.frustumCulled = false;
  world.add(bars);

  /* ---------- Floor: radar grid under the field ---------- */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), add(
    `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    `${FADE} uniform float uTime; varying vec2 vP;
     float line(float v, float w){ float d = fwidth(v); return 1.0 - smoothstep(w * d, (w + 1.0) * d, abs(fract(v - 0.5) - 0.5)); }
     void main(){
       float r = length(vP), ang = atan(vP.y, vP.x);
       float rings = line(r * 2.2, 0.6) * 0.5;
       float spokes = line(ang / 6.2832 * 24.0, 0.6) * 0.25 * smoothstep(0.6, 1.4, r);
       float sweep = pow(max(0.0, cos(ang - uTime * 0.6)), 24.0) * 0.6;   // 레이더 스윕
       float glow = exp(-r * 1.1) * 0.35;
       float fall = 1.0 - smoothstep(2.6, 4.4, r);
       float a = ((rings + spokes) * (0.55 + sweep) + glow + sweep * 0.12) * fall * edgeFade();
       gl_FragColor = vec4(mix(${CYAN}, ${LIME}, 0.55) * a, a);
     }`));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.01;
  world.add(floor);

  /* ---------- Insight core: breathing geodesic network ---------- */
  const CORE_Y = 2.85, CORE_R = 0.95;
  const core = new THREE.Group(); core.position.y = CORE_Y; world.add(core);
  const MORPH = `uniform float uTime;
    vec3 morph(vec3 p){ float k = 1.0 + 0.11 * sin(dot(p, vec3(3.1, 2.7, 1.9)) + uTime * 1.3) + 0.05 * sin(p.y * 6.0 - uTime * 2.0); return p * k; }`;
  const ico = new THREE.IcosahedronGeometry(CORE_R, small ? 2 : 3);
  core.add(new THREE.LineSegments(new THREE.WireframeGeometry(ico), add(
    `${MORPH} varying float vF; void main(){ vec3 p = morph(position); vec4 mv = modelViewMatrix * vec4(p, 1.0);
       vF = 0.35 + 0.65 * smoothstep(-1.0, 1.0, normalize(p).y); gl_Position = projectionMatrix * mv; }`,
    `${FADE} varying float vF; void main(){ float a = 0.42 * vF * edgeFade(); gl_FragColor = vec4(${LIME} * a, a); }`)));
  // 노드: 지오데식 꼭짓점(중복 제거)
  const seen = new Map(), pos = ico.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const k = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    if (!seen.has(k)) seen.set(k, [pos.getX(i), pos.getY(i), pos.getZ(i), Math.random()]);
  }
  const nodeArr = [...seen.values()];
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodeArr.flatMap(v => v.slice(0, 3))), 3));
  nodeGeo.setAttribute('aS', new THREE.BufferAttribute(new Float32Array(nodeArr.map(v => v[3])), 1));
  core.add(new THREE.Points(nodeGeo, add(
    `${MORPH} uniform float uDpr; attribute float aS; varying float vA;
     void main(){ vec4 mv = modelViewMatrix * vec4(morph(position), 1.0);
       float pulse = pow(0.5 + 0.5 * sin(uTime * (1.5 + aS * 2.0) + aS * 40.0), 6.0);
       vA = 0.45 + pulse * 0.9;
       gl_PointSize = (4.0 + pulse * 7.0 + step(0.93, aS) * 5.0) * uDpr * (11.0 / -mv.z);
       gl_Position = projectionMatrix * mv; }`,
    `${FADE} varying float vA; void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r) * vA * edgeFade();
       gl_FragColor = vec4(mix(${LIME}, vec3(1.0), 0.35) * a, a); }`)));
  // 프레넬 글로우 셸 + 중심 광원
  core.add(new THREE.Mesh(new THREE.SphereGeometry(CORE_R * 0.86, 48, 32), add(
    `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
       vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    `${FADE} varying vec3 vN; varying vec3 vV;
     void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.0); float a = (f * 1.5 + 0.06) * edgeFade();
       gl_FragColor = vec4(mix(${CYAN}, ${LIME}, f) * a, a); }`)));
  // 코어 발광(블룸 대용): 항상 카메라를 향하는 평면
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), add(
    `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    `${FADE} uniform float uTime; varying vec2 vUv;
     void main(){ float r = length(vUv - 0.5) * 2.0; float b = 1.0 + 0.08 * sin(uTime * 1.3);
       float a = (exp(-r * r * 22.0) * 0.9 + exp(-r * r * 5.0) * 0.28 + exp(-r * 2.6) * 0.08) * b * edgeFade();
       gl_FragColor = vec4(mix(${LIME}, vec3(1.0), exp(-r * r * 30.0) * 0.6) * a, a); }`));
  scene.add(glow);

  /* ---------- Orbit rings ---------- */
  const ringMat = add(
    `uniform float uTime, uDpr; attribute float aA; varying float vA;
     void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
       vA = 0.4 + 0.9 * pow(0.5 + 0.5 * sin(aA * 3.0 - uTime * 1.6), 8.0);       // 링을 따라 흐르는 하이라이트
       gl_PointSize = (2.2 + vA * 3.2) * uDpr * (11.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
    `${FADE} varying float vA; void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r) * vA * edgeFade();
       gl_FragColor = vec4(mix(${CYAN}, vec3(1.0), 0.3) * a, a); }`);
  const rings = [[1.55, 0.35, 0.2], [1.95, -0.5, 1.1], [2.35, 0.15, 2.2]].map(([rad, tilt, rot]) => {
    const n = small ? 140 : 260, p = new Float32Array(n * 3), a = new Float32Array(n);
    for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; p.set([Math.cos(t) * rad, 0, Math.sin(t) * rad], i * 3); a[i] = t; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('aA', new THREE.BufferAttribute(a, 1));
    const ring = new THREE.Group(); ring.rotation.set(tilt, rot, tilt * 0.6);
    const m = new THREE.Points(g, ringMat); ring.add(m); core.add(ring); return m;
  });

  /* ---------- Data flow: particles rising from bars into the core ---------- */
  const F = small ? 220 : 520, fs = new Float32Array(F * 4);
  for (let i = 0; i < F; i++) {
    const c = (Math.random() * (cells.length / 3)) | 0;
    fs.set([cells[c * 3], cells[c * 3 + 1], cells[c * 3 + 2], Math.random()], i * 4);
  }
  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(F * 3), 3));
  flowGeo.setAttribute('aSeed', new THREE.BufferAttribute(fs, 4));
  const flow = new THREE.Points(flowGeo, add(
    `uniform float uTime, uDpr; attribute vec4 aSeed; ${HEIGHT} varying float vA; varying float vL;
     void main(){
       float life = fract(aSeed.w + uTime * (0.09 + aSeed.z * 0.06));
       float e = life * life * (3.0 - 2.0 * life);
       float h = barH(aSeed.xy, aSeed.z, uTime);
       vec3 a = vec3(aSeed.x, h + 0.05, aSeed.y), b = vec3(0.0, ${CORE_Y.toFixed(2)}, 0.0);
       vec3 p = mix(a, b, e);
       float sw = (1.0 - e) * 0.9 * sin(e * 3.1416);                     // 코어 쪽으로 나선을 그리며 수렴
       float ang = e * 5.0 + aSeed.w * 6.2832;
       p.xz += vec2(cos(ang), sin(ang)) * sw;
       vec4 mv = modelViewMatrix * vec4(p, 1.0);
       vA = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.8, 1.0, life)); vL = e;
       gl_PointSize = (3.0 + 3.0 * (1.0 - e)) * uDpr * (11.0 / -mv.z);
       gl_Position = projectionMatrix * mv;
     }`,
    `${FADE} varying float vA; varying float vL; void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r) * vA * 1.2 * edgeFade();
       gl_FragColor = vec4(mix(${CYAN}, ${LIME}, vL) * a, a); }`));
  flow.frustumCulled = false;
  world.add(flow);

  /* ---------- Ambient dust ---------- */
  const D = small ? 160 : 380, dp = new Float32Array(D * 3);
  for (let i = 0; i < D; i++) dp.set([(Math.random() - 0.5) * 16, Math.random() * 7 - 1.5, (Math.random() - 0.5) * 12 - 2], i * 3);
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dustGeo, add(
    `uniform float uTime, uDpr; varying float vA; void main(){
       vec3 p = position; p.y = mod(position.y + uTime * 0.12 + 1.5, 7.0) - 1.5;   // 천천히 떠오름
       vec4 mv = modelViewMatrix * vec4(p, 1.0);
       vA = 0.35 + 0.35 * sin(uTime * 1.7 + position.z * 9.0);
       gl_PointSize = 1.8 * uDpr * (11.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
    `${FADE} varying float vA; void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r) * vA * 0.6 * edgeFade();
       gl_FragColor = vec4(vec3(0.85, 0.95, 0.9) * a, a); }`));
  dust.frustumCulled = false;
  scene.add(dust);

  /* ---------- Sizing & framing ---------- */
  const size = () => {
    const W = host.offsetWidth, H = host.offsetHeight;                // transform 영향 없는 레이아웃 크기
    if (!W || !H) return;
    const dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    U.uRes.value.set(W * dpr, H * dpr); U.uDpr.value = dpr;
    world.position.x = small ? 0 : 0.55;                              // 데스크톱은 헤드라인 반대편으로 살짝 밀기
  };

  /* ---------- Camera ---------- */
  const cam = {x: 0, y: 0, tx: 0, ty: 0, s: 0};
  if (!still && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      cam.tx = (e.clientX - r.left) / r.width - 0.5; cam.ty = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener('pointerleave', () => { cam.tx = 0; cam.ty = 0; });
  }
  let spin = 0.6;
  const draw = dt => {
    const k = 1 - Math.exp(-dt * 3);
    cam.x += (cam.tx - cam.x) * k; cam.y += (cam.ty - cam.y) * k;
    const s = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight || 1)));
    cam.s += (s - cam.s) * (still ? 1 : k);
    spin += dt * 0.14;
    world.rotation.y = spin + cam.x * 0.5;
    core.rotation.y = -spin * 1.6; core.rotation.x = Math.sin(spin * 0.7) * 0.15;
    rings.forEach((r, i) => { r.rotation.y += dt * (0.18 + i * 0.07) * (i % 2 ? -1 : 1); });
    const dist = (small ? 13.5 : 12.2) - cam.s * 2.5;
    camera.position.set(0, 3.0 + cam.y * 1.6 + cam.s * 1.2, dist);
    camera.lookAt(0, 1.15 - cam.s * 0.4, 0);
    core.getWorldPosition(glow.position); glow.quaternion.copy(camera.quaternion);
    renderer.render(scene, camera);
  };

  size();
  let rs; addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(() => { size(); if (still) draw(0); }, 150); });
  if (still) { draw(0); return {renderer}; }

  /* ---------- Loop (paused off-screen / hidden tab) ---------- */
  let running = false, raf = 0, last = 0, intro = 0;
  const frame = now => {
    raf = 0; if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    U.uTime.value += dt;
    intro = Math.min(1, intro + dt / 1.8); U.uIntro.value = intro * intro * (3 - 2 * intro);
    draw(dt);
    raf = requestAnimationFrame(frame);
  };
  let inView = true;
  const play = () => { running = inView && !document.hidden; if (running && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(es => { inView = es[0].isIntersecting; play(); }).observe(hero);
  document.addEventListener('visibilitychange', play);
  play();
  return {renderer};
}
