/* Data Learners · Hero 3D motion layer (Three.js)
 * 러너 이미지 위에 원근감 있는 3D 레이어를 겹칩니다.
 *  - 스피드 스트릭: 러너 등 뒤에서 깊이(z)별로 흩어져 뒤로 흘러가는 빛줄기 + 헤드 글로우
 *  - 데이터 더스트: 앞·뒤 여러 깊이에 떠 있는 입자(카메라가 움직이면 시차가 생김)
 *  - 트랙 그리드: 발밑에서 소실점으로 이어지며 뒤로 흐르는 라인
 *  - 카메라: 포인터·스크롤을 부드럽게 따라감
 * 모든 입자 위치는 셰이더에서 시간으로 계산하므로 CPU 부하가 거의 없습니다.
 * index.html이 reduced-motion이 아니고 WebGL을 쓸 수 있을 때만 동적으로 import합니다.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

export function start({canvas, host, hero, small, onCamera}) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: !small, powerPreference: 'high-performance'});
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 120);
  camera.position.set(0, 0, 10);

  const U = {
    uTime: {value: 0},
    uHalf: {value: new THREE.Vector2(1, 1)},   // z=0 평면에서 보이는 반폭·반높이(월드 단위)
    uRes: {value: new THREE.Vector2(1, 1)},
    uDpr: {value: 1},
    uIntro: {value: 0},
  };
  const PALETTE = [[0.784, 1, 0.239], [0.4, 0.86, 1], [0.96, 0.97, 0.95]];
  const pick = () => PALETTE[Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2];
  const gauss = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;

  /* ---------- Speed streaks (lines + head points share one motion function) ---------- */
  const STREAK = `
    uniform float uTime; uniform vec2 uHalf;
    attribute vec4 aSeed;   // phase, y, z, speed
    attribute vec4 aCol;    // rgb, length
    vec3 streakPos(float tail, out float life){
      float L = uHalf.x * 1.35 + 3.0;                         // 이동 거리
      float xs = -uHalf.x * 0.2 + (fract(aSeed.x * 7.13) - 0.5) * uHalf.x * 0.18;  // 러너 등 뒤 출발점
      float d = mod(aSeed.x * L + uTime * aSeed.w, L);
      life = d / L;
      float y = aSeed.y * uHalf.y + sin(uTime * 0.7 + aSeed.x * 31.0) * 0.05;
      return vec3(min(xs - d + tail * aCol.w * (0.5 + aSeed.w * 0.25), xs), y, aSeed.z);   // 꼬리가 러너 몸 위로 넘어가지 않게
    }`;
  const FADE = `
    uniform vec2 uRes; uniform float uIntro;
    float edgeFade(){ vec2 f = gl_FragCoord.xy / uRes; return smoothstep(0.0, 0.28, f.x) * smoothstep(0.04, 0.22, f.y) * uIntro; }`;

  const N = small ? 240 : 640;
  const seeds = new Float32Array(N * 8), cols = new Float32Array(N * 8), ends = new Float32Array(N * 2);
  const hSeeds = new Float32Array(N * 4), hCols = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const fast = Math.random() < 0.35;
    const s = [Math.random(), -0.02 + gauss() * 0.36, -6 + Math.random() * 8, (fast ? 2.4 : 0.9) + Math.random() * 1.4];
    const c = pick(), len = (fast ? 1.2 : 0.4) + Math.random() * 1.6;
    for (let k = 0; k < 2; k++) {
      seeds.set(s, (i * 2 + k) * 4); cols.set([...c, len], (i * 2 + k) * 4); ends[i * 2 + k] = k;
    }
    hSeeds.set(s, i * 4); hCols.set([...c, len], i * 4);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 6), 3));
  lineGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
  lineGeo.setAttribute('aCol', new THREE.BufferAttribute(cols, 4));
  lineGeo.setAttribute('aEnd', new THREE.BufferAttribute(ends, 1));
  const lines = new THREE.LineSegments(lineGeo, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `${STREAK}
      attribute float aEnd; varying vec3 vCol; varying float vA;
      void main(){
        float life; vec3 p = streakPos(aEnd, life);
        float depth = clamp((p.z + 6.0) / 9.0, 0.0, 1.0);           // 가까울수록 밝게
        vA = smoothstep(0.0, 0.08, life) * (1.0 - smoothstep(0.6, 1.0, life)) * (1.0 - aEnd) * (0.25 + depth * 0.75);
        vCol = aCol.rgb;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `${FADE} varying vec3 vCol; varying float vA;
      void main(){ float a = vA * edgeFade(); gl_FragColor = vec4(vCol * a, a); }`,
  }));
  lines.frustumCulled = false;
  scene.add(lines);

  const headGeo = new THREE.BufferGeometry();
  headGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  headGeo.setAttribute('aSeed', new THREE.BufferAttribute(hSeeds, 4));
  headGeo.setAttribute('aCol', new THREE.BufferAttribute(hCols, 4));
  const heads = new THREE.Points(headGeo, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `${STREAK} uniform float uDpr; varying vec3 vCol; varying float vA;
      void main(){
        float life; vec3 p = streakPos(0.0, life);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vA = smoothstep(0.0, 0.08, life) * (1.0 - smoothstep(0.6, 1.0, life));
        vCol = aCol.rgb;
        gl_PointSize = (2.0 + aSeed.w * 1.6) * uDpr * (10.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `${FADE} varying vec3 vCol; varying float vA;
      void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r) * vA * edgeFade();
        gl_FragColor = vec4(vCol * a, a); }`,
  }));
  heads.frustumCulled = false;
  scene.add(heads);

  // 스트릭 묶음을 y축으로 살짝 돌려, 뒤로 갈수록 카메라 쪽으로 다가오는 원근 궤적을 만듦
  lines.rotation.y = heads.rotation.y = 0.32;

  /* ---------- Data dust: multi-depth floating particles (parallax cue) ---------- */
  const M = small ? 260 : 760;
  const dSeed = new Float32Array(M * 4), dCol = new Float32Array(M * 3);
  for (let i = 0; i < M; i++) {
    dSeed.set([Math.random(), Math.random() * 2 - 1, -10 + Math.random() * 15, 0.08 + Math.random() * 0.5], i * 4);
    dCol.set(Math.random() < 0.65 ? PALETTE[0] : PALETTE[2], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(M * 3), 3));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dSeed, 4));
  dustGeo.setAttribute('aCol', new THREE.BufferAttribute(dCol, 3));
  const dust = new THREE.Points(dustGeo, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uTime, uDpr; uniform vec2 uHalf;
      attribute vec4 aSeed; attribute vec3 aCol; varying vec3 vCol; varying float vA;
      void main(){
        float spread = 1.0 + (-aSeed.z + 5.0) * 0.12;               // 멀수록 넓게 퍼뜨려 화면을 채움
        float W = uHalf.x * 2.6 * spread;
        float x = W * 0.5 - mod(aSeed.x * W + uTime * aSeed.w, W);
        vec3 p = vec3(x, aSeed.y * uHalf.y * 1.1 * spread + sin(uTime * 0.4 + aSeed.x * 40.0) * 0.08, aSeed.z);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float near = clamp((aSeed.z + 10.0) / 15.0, 0.0, 1.0);
        vA = (0.18 + 0.5 * near) * (0.6 + 0.4 * sin(uTime * (1.0 + aSeed.w * 3.0) + aSeed.x * 90.0));
        vCol = aCol;
        gl_PointSize = (1.4 + near * near * 5.0) * uDpr * (10.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `${FADE} varying vec3 vCol; varying float vA;
      void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.05, r) * vA * edgeFade();
        gl_FragColor = vec4(vCol * a, a); }`,
  }));
  dust.frustumCulled = false;
  scene.add(dust);

  /* ---------- Perspective track grid ---------- */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 40, 1, 1), new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `${FADE} uniform float uTime; varying vec3 vW;
      float grid(float v, float w){ float f = abs(fract(v) - 0.5); float d = fwidth(v); return 1.0 - smoothstep(w * d, (w + 1.2) * d, 0.5 - f); }
      void main(){
        float lanes = grid(vW.z * 0.5, 0.5);                           // 진행 방향으로 뻗은 레인
        float ticks = grid((vW.x + uTime * 2.2) * 0.3, 0.5);           // 뒤로 흘러가는 가로 라인
        float dist = smoothstep(-4.0, 0.5, vW.z) * (1.0 - smoothstep(3.0, 5.5, vW.z));   // 발밑 가까운 구간만
        float side = 1.0 - smoothstep(4.0, 16.0, abs(vW.x));
        float a = (lanes * 0.22 + ticks * 0.3) * dist * dist * side * edgeFade();
        gl_FragColor = vec4(vec3(0.784, 1.0, 0.239) * a, a);
      }`,
  }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /* ---------- Sizing ---------- */
  let W = 0, H = 0;
  const size = () => {
    W = host.offsetWidth; H = host.offsetHeight;                     // transform(줌·틸트) 영향 없는 레이아웃 크기
    if (!W || !H) return;
    const dpr = Math.min(devicePixelRatio || 1, small ? 1.25 : 1.6);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const hy = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 10;
    U.uHalf.value.set(hy * camera.aspect, hy);
    U.uRes.value.set(W * dpr, H * dpr); U.uDpr.value = dpr;
    floor.position.y = -hy * 0.78;                                   // 이미지 속 트랙 높이에 맞춤
  };
  size();
  let rs; const onResize = () => { clearTimeout(rs); rs = setTimeout(size, 150); };
  addEventListener('resize', onResize);

  /* ---------- Camera: pointer + scroll, critically damped ---------- */
  const cam = {x: 0, y: 0, tx: 0, ty: 0, s: 0};
  const fine = matchMedia('(pointer:fine)').matches;
  if (fine) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      cam.tx = (e.clientX - r.left) / r.width - 0.5; cam.ty = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener('pointerleave', () => { cam.tx = 0; cam.ty = 0; });
  }

  /* ---------- Loop (paused off-screen / hidden tab) ---------- */
  let running = false, raf = 0, last = 0, t = 0, intro = 0;
  const frame = now => {
    raf = 0; if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    t += dt; U.uTime.value = t;
    intro = Math.min(1, intro + dt / 1.6); U.uIntro.value = intro * intro * (3 - 2 * intro);
    const k = 1 - Math.exp(-dt * 3.2);
    cam.x += (cam.tx - cam.x) * k; cam.y += (cam.ty - cam.y) * k;
    const s = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight || 1)));
    cam.s += (s - cam.s) * k;
    const drift = Math.sin(t * 0.18) * 0.25;                         // 손대지 않아도 살짝 살아있는 핸드헬드 느낌
    camera.position.set(cam.x * 1.4 + drift, -cam.y * 0.9 + cam.s * 0.8, 10 - cam.s * 3);
    camera.lookAt(cam.x * 0.3, -cam.s * 0.6, 0);
    onCamera && onCamera(cam.x + drift * 0.4, cam.y, cam.s);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  let inView = true;
  const play = () => { running = inView && !document.hidden; if (running && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
  const io = new IntersectionObserver(es => { inView = es[0].isIntersecting; play(); });
  io.observe(hero);
  document.addEventListener('visibilitychange', play);
  play();
  return {renderer};
}
