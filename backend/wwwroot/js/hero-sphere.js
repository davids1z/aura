(function () {
  'use strict';

  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var heroSection = document.getElementById('heroSection');
  var mouse = { x: 0, y: 0 };
  var sm = { x: 0, y: 0 };
  var scrollT = 0;

  // Performance tiering
  var cores = navigator.hardwareConcurrency || 4;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isLowEnd = cores <= 2 || reducedMotion;
  var isMidEnd = cores <= 4 && !isLowEnd;
  var pr = Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2);

  // Click interaction state
  var clickT = -10.0;

  // Rapid click easter egg
  var clickCount = 0;
  var clickResetTimer = null;
  var frenzyVal = 0;
  var frenzyPhase = 0; // 0=idle, 1=active, 2=recovering

  // ── Renderer ──
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { canvas.style.display = 'none'; return; }
  renderer.setPixelRatio(pr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x0a0a0a, 1);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6.0);
  var clock = new THREE.Clock();

  // ── GLSL Noise ──
  var NOISE = `
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 perm(vec4 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec3 v){
  vec2 C=vec2(1.0/6.0,1.0/3.0);vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
  vec3 i1=min(g,l.zxy);vec3 i2=max(g,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=perm(perm(perm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 nr=inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=nr.x;p1*=nr.y;p2*=nr.z;p3*=nr.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm3(vec3 p){
  float v=0.0,amp=0.5,freq=1.0;
  for(int i=0;i<3;i++){v+=amp*snoise(p*freq);freq*=2.1;amp*=0.47;}
  return v;
}
vec3 cosPalette(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}`;

  // ── Vertex Shader ──
  var blobVert = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScale;
uniform float uClickT;
uniform float uFrenzy;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vViewDir;
varying float vDisp;
varying float vNoiseVal;
varying vec3 vViewPos;

${NOISE}

vec3 deform(vec3 p, float t, vec2 ms){
  float n = fbm3(p * 0.8 + vec3(t * 0.15)) * 0.45;

  float twistAng = sin(p.y * 2.5 + t * 0.4) * 0.3;
  float ca=cos(twistAng);float sa=sin(twistAng);
  vec3 tw=vec3(p.x*ca-p.z*sa,p.y,p.x*sa+p.z*ca);
  float twistD=length(tw-p)*0.22;

  float detail=(snoise(p*4.0+vec3(t*0.3))*0.07+snoise(p*8.0+vec3(t*0.4))*0.03);

  // Mouse attraction
  vec3 mDir=normalize(vec3(ms*1.8,0.5));
  float mDot=max(0.0,dot(normalize(p),mDir));
  float mousePull=pow(mDot,3.0)*0.18*length(ms);

  float breathe=sin(t*0.5)*0.02;

  // Click pulse — inhale then exhale
  float cAge = t - uClickT;
  float clickDisp = 0.0;
  if(cAge > 0.0 && cAge < 1.8){
    // Gentle inhale (contract) then slow exhale (expand)
    float inhale = -0.10 * exp(-cAge * 6.0);
    float exhale = 0.07 * sin(cAge * 2.5) * exp(-cAge * 1.8);
    clickDisp = inhale + exhale;
    // Soft organic turbulence during pulse
    clickDisp += snoise(p * 3.0 + vec3(t * 3.0)) * 0.04 * exp(-cAge * 2.5);
  }

  // Frenzy mode — wild organic distortion
  float frenzyDisp = 0.0;
  if(uFrenzy > 0.01){
    frenzyDisp += snoise(p * 1.5 + vec3(t * 2.0)) * 0.35 * uFrenzy;
    frenzyDisp += snoise(p * 3.0 + vec3(t * 3.5, t * 1.5, 0.0)) * 0.2 * uFrenzy;
    frenzyDisp += sin(p.y * 6.0 + t * 4.0) * 0.15 * uFrenzy;
  }

  float total = n + twistD + detail + mousePull + breathe + clickDisp + frenzyDisp;
  return p + normalize(p) * total;
}

void main(){
  vec3 pos = position * uScale;
  vec3 def = deform(pos, uTime, uMouse);

  float e = 0.005;
  vec3 T = normalize(cross(abs(normal.y)<0.99 ? vec3(0,1,0) : vec3(1,0,0), normal));
  vec3 B = cross(normal, T);
  vec3 d1 = deform(pos+T*e, uTime, uMouse);
  vec3 d2 = deform(pos+B*e, uTime, uMouse);
  vec3 compN = normalize(cross(d1-def, d2-def));

  vec4 wp = modelMatrix * vec4(def, 1.0);
  vWorldPos = wp.xyz;
  vNormal = normalize((modelMatrix * vec4(compN, 0.0)).xyz);
  vViewDir = normalize(cameraPosition - wp.xyz);
  vDisp = length(def - pos);
  vNoiseVal = fbm3(pos * 0.8 + vec3(uTime * 0.15));
  vViewPos = (viewMatrix * wp).xyz;

  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

  // ── Fragment Shader ──
  var blobFrag = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uClickT;
uniform float uFrenzy;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vViewDir;
varying float vDisp;
varying float vNoiseVal;
varying vec3 vViewPos;

${NOISE}

float D_GGX(float NoH,float a2){float d=NoH*NoH*(a2-1.0)+1.0;return a2/(3.14159*d*d+0.0001);}
float G_Smith(float NoV,float NoL,float k){return(NoV/(NoV*(1.0-k)+k))*(NoL/(NoL*(1.0-k)+k));}
vec3 F_Schlick(float HoV,vec3 F0){return F0+(1.0-F0)*pow(1.0-HoV,5.0);}

vec3 envMap(vec3 dir){
  float y=dir.y*0.5+0.5;
  vec3 env=mix(vec3(0.02,0.013,0.007),vec3(0.1,0.07,0.035),pow(y,0.5));
  env+=vec3(1.0,0.93,0.72)*pow(max(dot(dir,normalize(vec3(1.8,2.5,1.2))),0.0),80.0)*5.0;
  env+=vec3(0.85,0.7,0.5)*pow(max(dot(dir,normalize(vec3(-1.5,0.3,-1.0))),0.0),40.0)*2.5;
  env+=vec3(0.65,0.52,0.38)*pow(max(dot(dir,normalize(vec3(0.2,-1.0,1.8))),0.0),20.0)*2.0;
  env+=vec3(0.8,0.65,0.48)*pow(max(dot(dir,normalize(vec3(-0.5,1.8,-0.3))),0.0),60.0)*3.0;
  return env;
}

vec3 pbrLight(vec3 L,vec3 lCol,float lInt,vec3 N,vec3 V,vec3 F0,vec3 alb,float rough){
  vec3 H=normalize(V+L);
  float NoL=max(dot(N,L),0.0);float NoH=max(dot(N,H),0.0);
  float NoV=max(dot(N,V),0.001);float HoV=max(dot(H,V),0.0);
  float a=rough*rough;float a2=a*a;float k=(rough+1.0)*(rough+1.0)/8.0;
  float D=D_GGX(NoH,a2);float G=G_Smith(NoV,NoL,k);vec3 F=F_Schlick(HoV,F0);
  vec3 spec=(D*G*F)/(4.0*NoV*NoL+0.001);
  vec3 kD=(1.0-F)*0.02;
  return(kD*alb/3.14159+spec)*lCol*lInt*NoL;
}

void main(){
  vec3 N=normalize(vNormal);vec3 V=normalize(vViewDir);
  float NoV=max(dot(N,V),0.0);vec3 R=reflect(-V,N);

  // Warm gold palette
  float cDrive=vNoiseVal*0.6+vDisp*2.0+NoV*0.3+uTime*0.04;
  vec3 palA=vec3(0.55,0.43,0.26);vec3 palB=vec3(0.18,0.13,0.07);
  vec3 palC=vec3(1.0,1.0,1.0);vec3 palD=vec3(0.0,0.05,0.12);
  vec3 iri=cosPalette(cDrive,palA,palB,palC,palD);
  vec3 iri2=cosPalette(cDrive*1.2+0.5,vec3(0.50,0.40,0.24),vec3(0.12,0.09,0.05),vec3(1.0,1.0,1.0),vec3(0.1,0.12,0.18));
  iri=mix(iri,iri2,0.3);

  float rough=clamp(0.12+snoise(vWorldPos*6.0+vec3(uTime*0.08))*0.05,0.04,0.35);
  vec3 F0=iri*0.92+0.08;vec3 alb=iri;

  vec3 color=vec3(0.0);
  color+=pbrLight(normalize(vec3(2.0,3.0,1.5)),vec3(1.0,0.95,0.85),2.8,N,V,F0,alb,rough);
  color+=pbrLight(normalize(vec3(-2.5,0.5,1.0)),vec3(0.9,0.75,0.55),1.2,N,V,F0,alb,rough);
  color+=pbrLight(normalize(vec3(0.0,-1.5,-2.0)),vec3(1.0,0.9,0.68),1.5,N,V,F0,alb,rough);
  color+=pbrLight(normalize(vec3(0.3,4.0,0.5)),vec3(1.0,0.95,0.82),1.8,N,V,F0,alb,rough);

  // Mouse-following light
  vec3 mL=normalize(vec3(uMouse*2.0,1.5));
  color+=pbrLight(mL,vec3(1.0,0.93,0.78),0.8+length(uMouse)*1.5,N,V,F0,alb,rough);

  // Mouse proximity glow
  float mProx = max(dot(N, normalize(vec3(uMouse*1.5, 0.8))), 0.0);
  color += iri * pow(mProx, 4.0) * length(uMouse) * 0.35;

  vec3 envF=F_Schlick(NoV,F0);
  color+=envMap(R)*envF*1.5;

  // Rim glow
  float edge=1.0-NoV;
  float rimG=pow(edge,2.8);
  vec3 rimCol=cosPalette(uTime*0.06+edge,palA,palB,palC,palD);
  color+=rimCol*rimG*0.8;

  float sss=pow(max(dot(-V,normalize(vec3(2.0,3.0,1.5))),0.0),3.0)*pow(edge,1.5);
  color+=iri*sss*0.3;
  float emissive=pow(clamp(vDisp*2.5,0.0,1.0),2.0);
  color+=iri*emissive*0.2;

  float sparkle=pow(max(snoise(vWorldPos*50.0+vec3(uTime*0.15)),0.0),14.0);
  color+=vec3(1.0,0.96,0.88)*sparkle*1.2;

  // Click bloom — brief warm glow that fades
  float cAge = uTime - uClickT;
  if(cAge > 0.0 && cAge < 2.0){
    float bloom = exp(-cAge * 2.5) * 0.15;
    color += iri * bloom;
  }

  // Frenzy mode — intense glow + color shift + extra sparkles
  if(uFrenzy > 0.01){
    color += iri * uFrenzy * 0.25;
    color += vec3(1.0, 0.85, 0.5) * pow(edge, 1.5) * uFrenzy * 0.6;
    float fSparkle = pow(max(snoise(vWorldPos * 25.0 + vec3(uTime * 3.0)), 0.0), 6.0) * uFrenzy;
    color += vec3(1.0, 0.95, 0.8) * fSparkle * 0.8;
    color += rimCol * uFrenzy * 0.15;
  }

  gl_FragColor=vec4(color,1.0);
}`;

  // ── Blob Mesh ──
  var blobGeo = new THREE.IcosahedronGeometry(1.2, isLowEnd ? 32 : isMidEnd ? 48 : 64);
  var blobMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScale: { value: 1.0 },
      uClickT: { value: -10.0 },
      uFrenzy: { value: 0.0 }
    },
    vertexShader: blobVert,
    fragmentShader: blobFrag
  });
  var blob = new THREE.Mesh(blobGeo, blobMat);
  scene.add(blob);

  // ── Glow Shell ──
  var glowMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uScale: { value: 1.0 } },
    vertexShader: `uniform float uTime;uniform float uScale;
${NOISE}
varying vec3 vNorm;varying vec3 vView;varying float vN;
void main(){
  vec3 p=position*uScale;float n=fbm3(p*0.8+vec3(uTime*0.15))*0.4;
  p+=normalize(p)*(n+0.15);
  vec4 wp=modelMatrix*vec4(p,1.0);
  vNorm=normalize((modelMatrix*vec4(normalize(p),0.0)).xyz);
  vView=normalize(cameraPosition-wp.xyz);vN=n;
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,
    fragmentShader: `uniform float uTime;
${NOISE}
varying vec3 vNorm;varying vec3 vView;varying float vN;
void main(){
  float f=1.0-max(dot(normalize(vNorm),normalize(vView)),0.0);
  float glow=pow(f,2.5)*0.8;
  vec3 col=cosPalette(vN*2.0+uTime*0.05+f,vec3(0.55,0.43,0.26),vec3(0.18,0.13,0.07),vec3(1.0,1.0,1.0),vec3(0.0,0.05,0.12));
  gl_FragColor=vec4(col*glow,glow*0.6);
}`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide
  });
  var glowMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, isLowEnd ? 16 : 32), glowMat);
  scene.add(glowMesh);

  // ── Outer Haze ──
  var hazeMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uScale: { value: 1.0 } },
    vertexShader: `uniform float uTime;uniform float uScale;
${NOISE}
varying vec3 vN2;varying vec3 vV2;
void main(){vec3 p=position*uScale;float n=fbm3(p*0.5+vec3(uTime*0.12))*0.3;p+=normalize(p)*(n+0.4);
vec4 wp=modelMatrix*vec4(p,1.0);vN2=normalize((modelMatrix*vec4(normalize(p),0.0)).xyz);
vV2=normalize(cameraPosition-wp.xyz);gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader: `varying vec3 vN2;varying vec3 vV2;
void main(){float f=1.0-max(dot(normalize(vN2),normalize(vV2)),0.0);float g=pow(f,4.0)*0.3;
gl_FragColor=vec4(vec3(0.85,0.72,0.45)*g,g*0.35);}`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide
  });
  scene.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 16), hazeMat));

  // ── Particles ──
  var PC = isLowEnd ? 300 : isMidEnd ? 600 : 900;
  var pp = new Float32Array(PC * 3), ps = new Float32Array(PC);
  var pv = new Float32Array(PC), po = new Float32Array(PC);
  var pt = new Float32Array(PC), pTy = new Float32Array(PC);
  for (var i = 0; i < PC; i++) {
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    var isH = i < 300;
    var r = isH ? 1.3 + Math.random() * 0.6 : 1.8 + Math.random() * 3.5;
    pp[i*3] = r * Math.sin(ph) * Math.cos(th);
    pp[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    pp[i*3+2] = r * Math.cos(ph);
    ps[i] = isH ? 0.8 + Math.random() * 1.2 : 0.3 + Math.random() * 2.5;
    pv[i] = 0.15 + Math.random() * 0.85;
    po[i] = Math.random() * 6.283;
    pt[i] = (Math.random() - 0.5) * 2.0;
    pTy[i] = isH ? 1.0 : 0.0;
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(ps, 1));
  pGeo.setAttribute('aSpeed', new THREE.BufferAttribute(pv, 1));
  pGeo.setAttribute('aOff', new THREE.BufferAttribute(po, 1));
  pGeo.setAttribute('aTilt', new THREE.BufferAttribute(pt, 1));
  pGeo.setAttribute('aType', new THREE.BufferAttribute(pTy, 1));

  var pMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPR: { value: pr }, uScale: { value: 1.0 } },
    vertexShader: `uniform float uTime;uniform float uPR;uniform float uScale;
attribute float aSize;attribute float aSpeed;attribute float aOff;attribute float aTilt;attribute float aType;
varying float vAlpha;varying float vType;
void main(){
  vec3 pos=position*uScale;
  float a=uTime*0.1*aSpeed+aOff;float ca=cos(a);float sa=sin(a);
  pos.xz=mat2(ca,-sa,sa,ca)*pos.xz;
  float b=uTime*0.06*aSpeed*aTilt;float cb=cos(b);float sb=sin(b);
  pos.yz=mat2(cb,-sb,sb,cb)*pos.yz;
  pos.y+=sin(uTime*0.35*aSpeed+aOff)*0.1;
  pos*=1.0+sin(uTime*0.25+aOff)*0.03;
  vec4 mv=modelViewMatrix*vec4(pos,1.0);
  gl_PointSize=aSize*uPR*(90.0/(-mv.z));
  gl_Position=projectionMatrix*mv;
  float flicker=0.3+0.5*sin(uTime*1.2*aSpeed+aOff*3.0);
  vAlpha=flicker*(aType>0.5?1.3:0.8);
  vType=aType;
}`,
    fragmentShader: `varying float vAlpha;varying float vType;
void main(){
  float d=length(gl_PointCoord-0.5)*2.0;if(d>1.0)discard;
  float alpha=smoothstep(1.0,0.0,d)*vAlpha;
  float core=smoothstep(0.5,0.0,d);
  vec3 col=mix(vec3(0.85,0.72,0.45),vec3(1.0,0.96,0.85),core*0.8);
  col*=vType>0.5?1.3:1.0;
  gl_FragColor=vec4(col,alpha*0.5);
}`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.Points(pGeo, pMat));

  // ── Orbital Rings ──
  function mkRing(rad, rx, rz, op) {
    var m = new THREE.MeshBasicMaterial({
      color: 0xc9a96e, transparent: true, opacity: op,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    var mesh = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.002, 8, 200), m);
    mesh.rotation.x = rx; mesh.rotation.z = rz;
    scene.add(mesh);
    return mesh;
  }
  var ring1 = mkRing(2.0, Math.PI * 0.42, 0, 0.1);
  var ring2 = mkRing(2.3, Math.PI * 0.55, Math.PI * 0.25, 0.06);
  var ring3 = mkRing(1.7, Math.PI * 0.3, Math.PI * 0.65, 0.08);

  // ── Light Streaks ──
  var lineGroup = new THREE.Group();
  scene.add(lineGroup);
  for (var li = 0; li < 6; li++) {
    var pts = [];
    var ba = (li / 6) * Math.PI * 2;
    var lr = 1.6 + Math.random() * 0.6;
    for (var lj = 0; lj < 40; lj++) {
      var la = ba + (lj / 40) * Math.PI * 0.4;
      pts.push(new THREE.Vector3(Math.cos(la) * lr, (Math.random() - 0.5) * 0.4, Math.sin(la) * lr));
    }
    var line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.06 + Math.random() * 0.06, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    line.rotation.x = Math.random() * Math.PI;
    line.rotation.z = Math.random() * Math.PI;
    lineGroup.add(line);
  }

  // ── Inner Core ──
  var coreMat = new THREE.MeshBasicMaterial({
    color: 0xdfc598, transparent: true, opacity: 0.15,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  var coreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), coreMat);
  scene.add(coreMesh);

  // ── Events ──
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Click on sphere only (raycaster with generous invisible hitbox)
  var raycaster = new THREE.Raycaster();
  var clickVec = new THREE.Vector2();
  var hitSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 16, 16),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  scene.add(hitSphere);

  document.addEventListener('click', function (e) {
    if (scrollT > 0.7) return;
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('nav')) return;

    clickVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    clickVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(clickVec, camera);

    // Sync hitSphere with blob transform
    hitSphere.position.copy(blob.position);
    hitSphere.rotation.copy(blob.rotation);
    hitSphere.scale.copy(blob.scale);

    if (raycaster.intersectObject(hitSphere).length === 0) return;

    clickT = clock.getElapsedTime();

    // Rapid click tracking
    clickCount++;
    if (clickResetTimer) clearTimeout(clickResetTimer);
    clickResetTimer = setTimeout(function () { clickCount = 0; }, 800);

    if (clickCount >= 30 && frenzyPhase === 0) {
      frenzyPhase = 1;
      clickCount = 0;
    }
  });

  function onScroll() {
    if (!heroSection) return;
    var rect = heroSection.getBoundingClientRect();
    scrollT = Math.max(0, -rect.top / heroSection.clientHeight);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Visibility pause (IntersectionObserver) ──
  var isVisible = true;
  if ('IntersectionObserver' in window) {
    var visObs = new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    visObs.observe(canvas);
  }

  // ── Animation ──
  var rotY = 0, rotX = 0;
  var curScale = 1.0, curOpacity = 1.0;

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    var t = clock.getElapsedTime();
    if (reducedMotion) t *= 0.15;

    // Fast smooth mouse tracking
    sm.x += (mouse.x - sm.x) * 0.12;
    sm.y += (mouse.y - sm.y) * 0.12;

    // Frenzy animation
    if (frenzyPhase === 1) {
      frenzyVal += (1.0 - frenzyVal) * 0.06;
      if (frenzyVal > 0.95) { frenzyVal = 1.0; frenzyPhase = 2; }
    } else if (frenzyPhase === 2) {
      frenzyVal -= 0.008;
      if (frenzyVal <= 0) { frenzyVal = 0; frenzyPhase = 0; }
    }

    // Rotation follows mouse direction (+ frenzy spin boost)
    var frenzySpinBoost = frenzyVal * 0.03;
    rotY += sm.x * 0.003 + 0.0008 + frenzySpinBoost;
    rotX += sm.y * 0.0015 + frenzySpinBoost * 0.3;

    // Scroll fade
    var dimStart = 0.3, dimEnd = 1.2;
    var dimT = Math.max(0, Math.min(1, (scrollT - dimStart) / (dimEnd - dimStart)));
    dimT = dimT * dimT * (3.0 - 2.0 * dimT);
    curScale += (1.0 - dimT * 0.4 - curScale) * 0.08;
    curOpacity += (1.0 - dimT * 0.8 - curOpacity) * 0.08;
    canvas.style.opacity = curOpacity;

    // Blob uniforms
    blobMat.uniforms.uTime.value = t;
    blobMat.uniforms.uMouse.value.set(sm.x, sm.y);
    blobMat.uniforms.uScale.value = curScale;
    blobMat.uniforms.uClickT.value = clickT;
    blobMat.uniforms.uFrenzy.value = frenzyVal;
    blob.rotation.y = rotY + scrollT * 1.0;
    blob.rotation.x = rotX;
    blob.rotation.z = Math.sin(t * 0.1) * 0.05;

    // Shells
    glowMat.uniforms.uTime.value = t;
    glowMat.uniforms.uScale.value = curScale;
    glowMesh.rotation.copy(blob.rotation);
    hazeMat.uniforms.uTime.value = t;
    hazeMat.uniforms.uScale.value = curScale;

    // Particles
    pMat.uniforms.uTime.value = t;
    pMat.uniforms.uScale.value = curScale;

    // Rings
    ring1.rotation.y = t * 0.08; ring1.scale.setScalar(curScale);
    ring2.rotation.y = -t * 0.05; ring2.scale.setScalar(curScale);
    ring3.rotation.y = t * 0.06; ring3.scale.setScalar(curScale);

    // Streaks
    lineGroup.rotation.y = t * 0.03;
    lineGroup.rotation.x = Math.sin(t * 0.06) * 0.08;
    lineGroup.scale.setScalar(curScale);

    // Core
    coreMat.opacity = 0.12 + Math.sin(t * 1.5) * 0.06;
    coreMesh.scale.setScalar(curScale * (0.3 + Math.sin(t * 0.8) * 0.1));

    // Slow scene auto-rotation
    scene.rotation.y = t * 0.015;

    // Camera parallax follows mouse
    camera.position.x = sm.x * 0.35;
    camera.position.y = sm.y * 0.25;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
