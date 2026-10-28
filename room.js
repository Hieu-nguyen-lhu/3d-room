import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';
import {dressRoom, woodMaterial} from './studio-details.js';
import {createRoamingCat} from './roaming-cat.js';
import {createOnePieceDisplay} from './onepiece-display.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const scene=new THREE.Scene();scene.background=new THREE.Color('#a8b0a2');
const frame=8.5,aspect=innerWidth/innerHeight;const camera=new THREE.OrthographicCamera(-frame*aspect/2,frame*aspect/2,frame/2,-frame/2,.1,80);camera.position.set(8,7,10);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;document.body.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.8,0);controls.enableDamping=true;controls.maxPolarAngle=Math.PI/2-.025;controls.minZoom=.65;controls.maxZoom=5.5;controls.autoRotateSpeed=.5;
const pmrem=new THREE.PMREMGenerator(renderer);const environment=new RoomEnvironment();const envMap=pmrem.fromScene(environment,.04);scene.environment=envMap.texture;scene.environmentIntensity=.32;environment.dispose();pmrem.dispose();
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const ao=new SSAOPass(scene,camera,innerWidth,innerHeight,16);ao.ssaoMaterial.defines.PERSPECTIVE_CAMERA=0;ao.depthRenderMaterial.defines.PERSPECTIVE_CAMERA=0;ao.kernelRadius=.20;ao.minDistance=.0002;ao.maxDistance=.025;composer.addPass(ao);const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.12,.35,1.65);composer.addPass(bloom);composer.addPass(new OutputPass());
const mat=(color,roughness=.6,metalness=.1)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const dark=mat('#343b37'),wall=mat('#a7b4a0'),metal=mat('#4b514c',.38,.5),black=mat('#202a2c'),wood=woodMaterial(),purple=mat('#788b7b'),fabric=mat('#4c625b');
function box(w,h,d,x,y,z,m,parent=scene){const o=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(.055,w*.16,h*.16,d*.16)),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function cylinder(r1,r2,h,x,y,z,m,parent=scene){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,24),m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o}
function rod(a,b,r,m,parent=scene){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b);const o=cylinder(r,r,av.distanceTo(bv),0,0,0,m,parent);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).normalize());return o}
const rgbParts=[];const rainbow=['#ff264b','#ff8a21','#ffe33b','#41ff67','#22e5ff','#3955ff','#ba3bff'];
function glow(color){const m=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.4,roughness:.35});m.userData.rgbGlow=true;return m;}
function strip(points){for(let j=0;j<points.length-1;j++){const a=new THREE.Vector3(...points[j]),b=new THREE.Vector3(...points[j+1]);const count=Math.ceil(a.distanceTo(b)/.24);for(let i=0;i<count;i++){const m=glow(rainbow[(rgbParts.length)%7]);const p=a.clone().lerp(b,i/count),q=a.clone().lerp(b,(i+1)/count);rod(p.toArray(),q.toArray(),.016,m);rgbParts.push(m)}}}
box(7.15,.26,6.15,0,-.17,0,wood);box(7,2.85,.13,0,1.36,-3,wall);box(.13,2.85,6,-3.5,1.36,0,wall);
// Deliberately open the two camera-facing walls, like an architectural cutaway.
dressRoom({scene,box,cylinder,rod,mat,glow,wood,metal,black,wall});
box(7,.12,.08,0,.04,-2.9,black);box(.08,.12,6,-3.4,.04,0,black);
strip([[-3.38,2.73,2.9],[-3.38,2.73,-2.88],[3.38,2.73,-2.88]]);
strip([[-3.35,.12,2.85],[-3.35,.12,-2.85],[3.35,.12,-2.85],[3.35,.12,2.85],[-3.35,.12,2.85]]);
for(let x=-1.9;x<1.9;x+=.12){box(.045,.82,.055,x,1.75,-2.89,wood)}
// Desk: front faces +Z, seated character faces -Z.
box(4,.1,1.15,0,.86,-1.8,wood);for(const x of [-1.75,1.75]){box(.09,.81,.85,x,.405,-1.8,metal);box(.5,.06,.95,x,.04,-1.8,black)}
strip([[-1.95,.82,-1.2],[1.95,.82,-1.2]]);
box(2,.012,.49,-.15,.93,-1.46,black);
const screenTextures=[];
function screenTexture(kind){const c=document.createElement('canvas');c.width=768;c.height=432;const ctx=c.getContext('2d');const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;screenTextures.push({c,ctx,tex,kind});return tex}
function monitor(x,angle,kind){const g=new THREE.Group();g.userData.cameraOccluder=true;g.position.set(x,1.49,-2.03);g.rotation.y=angle;scene.add(g);box(1.12,.67,.065,0,0,0,black,g);const sm=new THREE.MeshBasicMaterial({map:screenTexture(kind),toneMapped:false});box(1.055,.596,.009,0,.015,.039,sm,g);box(.055,.28,.055,0,-.44,0,metal,g);box(.4,.025,.23,0,-.575,.04,metal,g);box(.15,.014,.01,0,-.32,.04,glow('#8c5cff'),g)}
monitor(-1.17,.22,0);monitor(0,0,1);monitor(1.17,-.22,2);
// Keyboard with RGB backlit keys, mouse and controller.
box(.68,.035,.23,-.19,.96,-1.35,metal);for(let row=0;row<4;row++)for(let col=0;col<14;col++){const km=glow(rainbow[Math.floor(col/2)%7]);km.emissiveIntensity=.7;box(.037,.015,.037,-.49+col*.047,.985,-1.43+row*.049,km)}
const mouse=new THREE.Mesh(new THREE.SphereGeometry(.065,20,12),black);mouse.scale.set(.75,.4,1.3);mouse.position.set(.32,.965,-1.34);scene.add(mouse);rod([.32,.99,-1.38],[.32,.99,-1.33],.004,glow('#49efff'));
// Glass-sided PC with three RGB fans and visible interior.
box(.47,.73,.65,2.37,.39,-1.85,black);box(.44,.035,.64,2.37,.77,-1.85,metal);
const glass=new THREE.MeshPhysicalMaterial({color:'#8295bd',transparent:true,opacity:.13,roughness:.1,metalness:.2,side:THREE.DoubleSide,depthWrite:false});box(.008,.65,.58,2.61,.41,-1.85,glass);box(.28,.29,.04,2.37,.49,-1.62,metal);box(.3,.07,.38,2.39,.32,-1.82,metal);
for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.078,.012,8,32),glow(rainbow[i*2]));ring.position.set(2.37,.2+i*.22,-1.515);scene.add(ring);rgbParts.push(ring.material);for(let j=0;j<5;j++){const blade=box(.022,.105,.012,0,0,0,metal,ring);blade.rotation.z=j*Math.PI*2/5}}
strip([[2.6,.12,-2.12],[2.6,.69,-2.12],[2.6,.69,-1.57]]);
// Gaming chair: low seat, side bolsters, neck cushion and five-star caster base.
const chair=new THREE.Group();chair.position.set(0,0,-1.01);scene.add(chair);
box(.66,.13,.64,0,.53,0,black,chair);box(.52,.04,.52,0,.61,-.025,fabric,chair);
const back=box(.65,.99,.14,0,1.08,.31,black,chair);back.rotation.x=-.1;
for(const x of [-.28,.28]){const bolster=box(.095,.96,.17,x,1.1,.27,purple,chair);bolster.rotation.z=-Math.sign(x)*.08;box(.06,.06,.38,x,.64,-.04,purple,chair);box(.08,.28,.08,x*1.35,.69,.02,metal,chair);box(.14,.055,.39,x*1.35,.85,-.03,black,chair)}
box(.32,.14,.10,0,1.43,.20,fabric,chair);box(.35,.14,.11,0,.86,.19,fabric,chair);cylinder(.065,.08,.38,0,.26,0,metal,chair);
for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const x=Math.sin(a)*.43,z=Math.cos(a)*.43;rod([0,.16,0],[x,.1,z],.035,metal,chair);const wheel=cylinder(.058,.058,.055,x,.065,z,black,chair);wheel.rotation.z=Math.PI/2}
// Microphone boom, webcam, speakers and headphones.
rod([-1.65,.94,-1.47],[-1.65,1.63,-1.4],.018,metal);rod([-1.65,1.63,-1.4],[-.85,1.45,-1.31],.018,metal);rod([-.85,1.45,-1.31],[-.68,1.24,-1.22],.015,metal);const mic=cylinder(.046,.046,.18,-.68,1.19,-1.22,black);mic.rotation.z=-.3;const micRing=cylinder(.048,.048,.016,-.68,1.23,-1.22,glow('#ae5aff'));
box(.15,.07,.08,0,1.87,-2.02,black);const webcam=new THREE.Mesh(new THREE.SphereGeometry(.022,16,12),glow('#60cfff'));webcam.position.set(0,1.87,-1.975);scene.add(webcam);
for(const x of [-1.83,1.83]){box(.18,.29,.18,x,1.07,-2.05,black);const cone=cylinder(.055,.055,.012,x,1.09,-1.951,metal);cone.rotation.x=Math.PI/2}
// Rug and lounge details keep the room grounded.
box(3.6,.018,2.12,0,.007,-.25,mat('#7b8a7d'));for(const x of [-1.72,1.72])box(.012,.021,2.0,x,.014,-.25,mat('#b7bd9e'));
const onePieceDisplay=createOnePieceDisplay(scene,rgbParts);

function wallText(text,x,y,z,size,color){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.clearRect(0,0,1024,256);ctx.font='bold 140px sans-serif';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,512,180);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const o=new THREE.Mesh(new THREE.PlaneGeometry(size,size/4),new THREE.MeshStandardMaterial({map:t,transparent:true,depthWrite:false,roughness:1}));o.position.set(x,y,z);scene.add(o)}
wallText('HIEU / STUDIO',0,2.43,-2.88,2.05,'#344b41');
const ambient=new THREE.HemisphereLight('#fff5df','#797b66',1.35);scene.add(ambient);const key=new THREE.DirectionalLight('#fff0d4',3.0);key.position.set(-3,8,5);key.castShadow=true;key.shadow.mapSize.set(3072,3072);key.shadow.bias=-.0002;key.shadow.radius=4;key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.normalBias=.025;scene.add(key);
const lights=[];for(const [x,y,z,c,p] of [[-2.7,2.8,-2,0xab45ff,.8],[2.7,2.8,-2,0x23cfff,.8],[0,1.5,-1.7,0x62caff,.4],[-3,1,1,0xff376d,.5]]){const l=new THREE.PointLight(c,p,7,2);l.position.set(x,y,z);scene.add(l);lights.push(l)}
const roamingCat=createRoamingCat(scene);
let mixer,character,clip,poseReady=false;let rgbOn=true;const clock=new THREE.Clock();const hipPosition=new THREE.Vector3();
new GLTFLoader().load('./Hieu/base_basic_pbr.glb',gltf=>{character=gltf.scene;scene.add(character);mixer=new THREE.AnimationMixer(character);clip=gltf.animations.find(a=>a.name==='HumanSitting')||gltf.animations.find(a=>a.name.includes('Sitting'));if(!clip)throw new Error('Model không có hoạt ảnh ngồi');mixer.clipAction(clip).play();mixer.update(.1);character.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(character);const scale=1.55/(bounds.max.y-bounds.min.y);character.scale.setScalar(scale);character.rotation.y=Math.PI;character.updateMatrixWorld(true);const hips=character.getObjectByName('Hips');hips.getWorldPosition(hipPosition);character.position.add(new THREE.Vector3(0,.64,-1.04).sub(hipPosition));mixer.timeScale=0;applyGamingPose();poseReady=true;document.querySelector('#loader').style.opacity='0';setTimeout(()=>document.querySelector('#loader').remove(),750);window.roomState={modelLoaded:true,animation:clip.name,monitorCount:3,rgbColors:7};},e=>{if(e.total){document.querySelector('#progress').value=e.loaded/e.total*100;document.querySelector('#loadingText').textContent=`Đang tải nhân vật… ${Math.round(e.loaded/e.total*100)}%`}},e=>{console.error(e);document.querySelector('#error').textContent='Không tải được model. Hãy mở bằng Mo-phong-3D.cmd và tải lại trang.'});
function drawScreens(t){for(const s of screenTextures){const {ctx:c,tex,kind}=s;c.fillStyle='#0c1224';c.fillRect(0,0,768,432);if(kind===1){const sky=c.createLinearGradient(0,0,0,432);sky.addColorStop(0,'#14234c');sky.addColorStop(1,'#58518c');c.fillStyle=sky;c.fillRect(0,0,768,432);c.fillStyle='#0d1631';for(let i=0;i<18;i++){const x=(i*73+t*12)%900-80;const h=90+Math.sin(i*3.1)*65;c.fillRect(x,235-h,60,h+200)}c.strokeStyle='#5deaff';c.lineWidth=2;for(let i=0;i<12;i++){c.beginPath();c.moveTo(384,210);c.lineTo(i*100-180,432);c.stroke()}c.strokeStyle='#ffffff';c.beginPath();c.moveTo(374,216);c.lineTo(394,216);c.moveTo(384,206);c.lineTo(384,226);c.stroke();c.fillStyle='#77ffd4';c.font='bold 17px monospace';c.fillText('NEON ARENA',24,32);c.fillText('100 HP',24,405);c.fillStyle='#ecf4ff';c.fillText('ROUND 07     12 : 04',480,32);c.fillStyle='#1a253d';c.fillRect(300,325,180,107);c.fillStyle='#637994';c.fillRect(350,290,50,142)}else{c.fillStyle='#171f35';c.fillRect(0,0,768,50);c.fillStyle=kind===0?'#a58aff':'#ff6d91';c.font='bold 24px sans-serif';c.fillText(kind===0?'STREAM CONTROL':'LIVE CHAT',24,34);if(kind===0){c.fillStyle='#293654';c.fillRect(24,76,460,235);c.fillStyle='#566098';c.fillRect(40,92,428,200);c.fillStyle='#b8a2ff';c.font='bold 40px sans-serif';c.fillText('HIEU / LIVE',95,205);c.font='18px monospace';c.fillStyle='#64efb0';c.fillText('● LIVE  02:34:18',28,350);c.fillText('1080p  /  60 FPS',28,387);for(let i=0;i<13;i++){c.fillStyle=rainbow[i%7];c.fillRect(525+i*14,280,9,-30-Math.abs(Math.sin(t*2+i))*140)}}else{const lines=['Chào Hieu! 👋','Setup RGB đẹp quá','Ba màn hình xịn ghê','Let’s go!','GG WP 🔥','Nhạc chill quá','Chơi tiếp nào!'];c.font='21px sans-serif';for(let i=0;i<7;i++){c.fillStyle=rainbow[i];c.fillText('viewer_'+(102+i*17),25,92+i*44);c.fillStyle='#c6d2ec';c.fillText(lines[i],225,92+i*44)}c.fillStyle='#273149';c.fillRect(20,385,728,30);c.font='16px sans-serif';c.fillStyle='#91a4be';c.fillText('Gửi tin nhắn…',32,406)}}tex.needsUpdate=true}}
let followCat=false;let transition=null;const views={wide:[[8,7,10],[0,.8,0]],desk:[[5,4.2,5],[0,1.08,-1.1]],front:[[2.4,2.0,-3.4],[0,1.12,-1.04]],collection:[[4.5,2.7,1.0],[-2.82,1.16,.68]],cat:[[2,2.4,4],[-1.25,.25,.2]]};
for(const id of Object.keys(views))document.getElementById(id).onclick=()=>{followCat=id==='cat';setCameraCutaway(id==='front');transition={from:camera.position.clone(),targetFrom:controls.target.clone(),to:new THREE.Vector3(...views[id][0]),target:new THREE.Vector3(...views[id][1]),zoomFrom:camera.zoom,zoomTo:id==='wide'?1:id==='front'?2.65:id==='collection'?3.0:id==='cat'?3.8:1.85,start:performance.now()};for(const k of Object.keys(views))document.getElementById(k).classList.toggle('active',k===id)};
const emissiveSources=[];scene.traverse(o=>{if(o.isMesh){for(const material of [].concat(o.material)){if(material.userData.rgbGlow&&!emissiveSources.some(s=>s.material===material))emissiveSources.push({material,dayIntensity:material.emissiveIntensity});}}});
const screenLights=[];for(const x of [-1.17,0,1.17]){const l=new THREE.PointLight('#8ebdff',0,2.2,2);l.position.set(x,1.5,-1.92);scene.add(l);screenLights.push(l);}
function updateLighting(){
 const night=document.body.classList.contains('night');ambient.intensity=night?0:1.35;key.intensity=night?0:3;scene.environmentIntensity=night?0:.32;renderer.toneMappingExposure=night?1.1:.95;
 scene.background.set(night?'#000000':'#a8b0a2');const backdrop=scene.getObjectByName('Backdrop');if(backdrop)backdrop.visible=!night;
 const lamp=scene.getObjectByName('ReadingLamp');if(lamp)lamp.intensity=night?0:1.3;
 const windowPane=scene.getObjectByName('WindowPane');if(windowPane)windowPane.material.emissiveIntensity=night?0:.15;
 bloom.strength=night?.46:.12;bloom.radius=night?.40:.35;bloom.threshold=night?1.05:1.65;
 for(const source of emissiveSources)source.material.emissiveIntensity=rgbOn?(night?3.8:source.dayIntensity):0;
 lights.forEach((l,i)=>l.intensity=rgbOn?(night?[3.5,3.5,1.2,2]:[.8,.8,.4,.5])[i]:0);screenLights.forEach(l=>l.intensity=night?.4:0);
 window.roomState.night=night;window.roomState.rgbOn=rgbOn;
}
document.getElementById('rgb').onclick=e=>{rgbOn=!rgbOn;e.target.textContent=`RGB: ${rgbOn?'Bật':'Tắt'}`;e.target.setAttribute('aria-pressed',rgbOn);updateLighting();};
document.getElementById('daylight').onclick=e=>{const night=document.body.classList.toggle('night');e.target.textContent=night?'Ban ngày':'Buổi tối';e.target.setAttribute('aria-pressed',night);updateLighting();};
document.getElementById('rotate').onclick=e=>{controls.autoRotate=!controls.autoRotate;e.target.classList.toggle('active',controls.autoRotate);e.target.setAttribute('aria-pressed',controls.autoRotate)};
document.getElementById('capture').onclick=()=>{composer.render();const a=document.createElement('a');a.download='Hieu-RGB-room.png';a.href=renderer.domElement.toDataURL('image/png');a.click()};
addEventListener('resize',()=>{const a=innerWidth/innerHeight;const f=a<.8?10/a:8.5;camera.left=-f*a/2;camera.right=f*a/2;camera.top=f/2;camera.bottom=-f/2;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});
function aimArm(side,target){
 const upper=character.getObjectByName(side+'Arm'),fore=character.getObjectByName(side+'ForeArm'),hand=character.getObjectByName(side+'Hand');
 if(!upper||!fore||!hand)return;
 const goal=new THREE.Vector3(...target);
 for(let i=0;i<30;i++)for(const bone of [fore,upper]){
  character.updateMatrixWorld(true);const origin=bone.getWorldPosition(new THREE.Vector3());const end=hand.getWorldPosition(new THREE.Vector3());
  const from=end.sub(origin).normalize(),to=goal.clone().sub(origin).normalize();const delta=new THREE.Quaternion().setFromUnitVectors(from,to);
  const parentQ=bone.parent.getWorldQuaternion(new THREE.Quaternion());const worldQ=bone.getWorldQuaternion(new THREE.Quaternion());bone.quaternion.copy(parentQ.invert().multiply(delta.multiply(worldQ)));
 }
}
let lastScreen=0;renderer.setAnimationLoop(()=>{const delta=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;roamingCat.update(delta);if(character&&poseReady)character.updateMatrixWorld(true);if(rgbOn)rgbParts.forEach((m,i)=>{m.color.setHSL((i/42+t*.035)%1,.9,.58);m.emissive.copy(m.color)});if(rgbOn){for(let i=0;i<lights.length;i++)lights[i].color.setHSL((i*.23+t*.085)%1,1,.57);}if(t-lastScreen>.1){drawScreens(t);lastScreen=t}if(transition){const p=Math.min((performance.now()-transition.start)/1100,1),s=p*p*(3-2*p);camera.position.lerpVectors(transition.from,transition.to,s);camera.zoom=THREE.MathUtils.lerp(transition.zoomFrom,transition.zoomTo,s);camera.updateProjectionMatrix();controls.target.lerpVectors(transition.targetFrom,transition.target,s);if(p===1)transition=null}if(followCat&&!transition&&roamingCat.diagnostics().loaded){const p=roamingCat.root.position;controls.target.lerp(new THREE.Vector3(p.x,.24,p.z),1-Math.exp(-delta*4));camera.position.lerp(new THREE.Vector3(p.x+2.0,2.4,p.z+3.2),1-Math.exp(-delta*4));}controls.update();ao.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(camera.projectionMatrix);ao.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(camera.projectionMatrixInverse);composer.render()});

window.dispatchEvent(new Event("resize"));

window.getPoseDiagnostics=()=>{const out={};for(const side of ['Left','Right'])for(const n of ['Shoulder','Arm','ForeArm','Hand','HandMiddle1','HandIndex1','HandPinky1']){const b=character.getObjectByName(side+n);if(b)out[side+n]=b.getWorldPosition(new THREE.Vector3()).toArray()}return out};

function applyGamingPose(){
 for(const side of ['Left','Right']){
  const target=side==='Left'?[-.19,1.018,-1.21]:[.32,1.013,-1.20];aimArm(side,target);
  const hand=character.getObjectByName(side+'Hand');const middle=character.getObjectByName(side+'HandMiddle1');const index=character.getObjectByName(side+'HandIndex1');const pinky=character.getObjectByName(side+'HandPinky1');
  character.updateMatrixWorld(true);
  const inv=hand.matrixWorld.clone().invert();const localZ=middle.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv).normalize();const localX=index.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv).sub(pinky.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv));localX.addScaledVector(localZ,-localX.dot(localZ)).normalize();
  const localY=new THREE.Vector3().crossVectors(localZ,localX).normalize();const localFrame=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(localX,localY,localZ));
  const worldZ=new THREE.Vector3(0,-.09,-1).normalize(),worldX=new THREE.Vector3(side==='Left'?1:-1,0,0),worldY=new THREE.Vector3().crossVectors(worldZ,worldX).normalize();const targetFrame=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(worldX,worldY,worldZ));
  const worldRotation=targetFrame.multiply(localFrame.invert());hand.quaternion.copy(hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(worldRotation));
  character.updateMatrixWorld(true);
  for(const finger of ['Index','Middle','Ring','Pinky'])for(const segment of [2,3]){const bone=character.getObjectByName(side+'Hand'+finger+segment);if(!bone)continue;const axis=new THREE.Vector3(-1,0,0).applyQuaternion(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert());const angle=side==='Right'?(finger==='Index'||finger==='Middle'?.22:.45):.14;bone.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axis,angle));character.updateMatrixWorld(true);}
 }
 character.updateMatrixWorld(true);
}
let cameraCutaway=[];
function setCameraCutaway(enabled){if(!cameraCutaway.length)cameraCutaway=scene.children.filter(o=>o.userData.cameraOccluder||(!o.isLight&&o.position.z< -2.70&&o.position.y>.1));for(const o of cameraCutaway)o.visible=!enabled;}

window.getLightingDiagnostics=()=>({background:scene.background.getHexString(),ambient:ambient.intensity,sun:key.intensity,environment:scene.environmentIntensity,readingLamp:scene.getObjectByName('ReadingLamp').intensity,windowGlow:scene.getObjectByName('WindowPane').material.emissiveIntensity,backdropVisible:scene.getObjectByName('Backdrop').visible,rgbLights:lights.map(l=>l.intensity),rgbColor:lights[0].color.getHexString(),screenLights:screenLights.map(l=>l.intensity)});

window.getCollectionDiagnostics=()=>({name:onePieceDisplay.name,characters:onePieceDisplay.userData.characters,figureCount:onePieceDisplay.userData.loadedModels,source:'Sketchfab via Objaverse',failures:onePieceDisplay.userData.failures});

window.getCatDiagnostics=()=>roamingCat.diagnostics();
