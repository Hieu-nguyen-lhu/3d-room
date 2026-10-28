import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {findCatPath,isCatPositionSafe,CAT_DESTINATIONS} from './cat-navigation.js';

export function createRoamingCat(scene){
 const root=new THREE.Group();root.name='RoamingCat';root.position.set(-1.25,.03,.2);scene.add(root);
 const heading=new THREE.Group();root.add(heading);
 const state={loaded:false,error:null,mode:'loading',distance:0,walkClip:null};
 let model,mixer,walk,idle,route=[],cursor=0,stopTime=0,destinationIndex=0,gaitMeshes=[],gaitPhase=0,gaitBlend=0;
 const gaitFeet=[[-.03,.10,0],[.03,.10,Math.PI],[-.03,-.10,Math.PI],[.03,-.10,0]];
 const clamp01=value=>Math.max(0,Math.min(1,value));
 const smoothstep=(a,b,value)=>{const t=clamp01((value-a)/(b-a));return t*t*(3-2*t);};
 function prepareGait(){
  model.updateMatrixWorld(true);
  model.traverse(mesh=>{
   if(!mesh.isMesh||mesh.name!=='Muchkin1')return;
   const attribute=mesh.geometry.attributes.position,base=new Float32Array(attribute.array),weights=new Float32Array(attribute.count*4),point=new THREE.Vector3();
   for(let i=0;i<attribute.count;i++){
    point.fromBufferAttribute(attribute,i);mesh.localToWorld(point);heading.worldToLocal(point);
    for(let foot=0;foot<gaitFeet.length;foot++){
     const [x,z]=gaitFeet[foot],radius=Math.hypot((point.x-x)/.027,(point.z-z)/.047);
     weights[i*4+foot]=(1-smoothstep(.72,1.38,radius))*(1-smoothstep(.31,.435,point.y));
    }
   }
   gaitMeshes.push({mesh,attribute,base,weights});
  });
 }
 function updateGait(distance,delta){
  const moving=distance>0;gaitBlend=THREE.MathUtils.damp(gaitBlend,moving?1:0,10,delta);
  if(moving)gaitPhase+=distance/.30*Math.PI*2;
  if(!gaitMeshes.length)return;
  for(const item of gaitMeshes){
   const {mesh,attribute,base,weights}=item,offsets=[];
   for(let foot=0;foot<gaitFeet.length;foot++){
    const phase=gaitPhase+gaitFeet[foot][2],lift=Math.max(0,Math.sin(phase))*.012*gaitBlend,stride=-Math.cos(phase)*.026*gaitBlend;
    const origin=heading.localToWorld(new THREE.Vector3()),end=heading.localToWorld(new THREE.Vector3(0,lift,stride));
    const localOrigin=mesh.worldToLocal(origin),localEnd=mesh.worldToLocal(end);offsets.push(localEnd.sub(localOrigin));
   }
   const array=attribute.array;
   for(let i=0;i<attribute.count;i++)for(let axis=0;axis<3;axis++){
    const at=i*3+axis;let value=base[at];for(let foot=0;foot<4;foot++)value+=offsets[foot].getComponent(axis)*weights[i*4+foot];array[at]=value;
   }
   attribute.needsUpdate=true;
  }
 }
 const routeToNext=()=>{for(let attempts=0;attempts<CAT_DESTINATIONS.length;attempts++){destinationIndex=(destinationIndex+1)%CAT_DESTINATIONS.length;route=findCatPath([root.position.x,root.position.z],CAT_DESTINATIONS[destinationIndex]);if(route.length>1){cursor=0;return}}};
 const floorBounds=new THREE.Box3();
 function setMode(mode){if(state.mode===mode)return;state.mode=mode;const action=mode==='walking'?walk:idle;if(action){const old=mode==='walking'?idle:walk;if(old===action)return;old?.fadeOut(.22);action.reset().fadeIn(.22).play();}}
 new GLTFLoader().load('./munchkin_cat.glb',gltf=>{
  model=gltf.scene;heading.add(model);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  mixer=new THREE.AnimationMixer(model);const source=gltf.animations[0];if(!source)throw new Error('Cat GLB has no animation');
  // This non-skinned model has one 13-second morph/rotation clip, not separate walk and idle clips.
  walk=mixer.clipAction(source);idle=walk;walk.play();mixer.update(.1);model.updateMatrixWorld(true);
  let bounds=new THREE.Box3().setFromObject(model);const size=bounds.getSize(new THREE.Vector3());model.scale.multiplyScalar(.85/Math.max(size.x,size.z));model.updateMatrixWorld(true);bounds=new THREE.Box3().setFromObject(model);const center=bounds.getCenter(new THREE.Vector3());model.position.x-=center.x-root.position.x;model.position.z-=center.z-root.position.z;model.position.y+=root.position.y-bounds.min.y;
  prepareGait();
  // This asset has no skeletal root translation; navigation controls movement.
  state.error=null;state.loaded=true;state.walkClip=source.name;state.mode='walking';routeToNext();
 },undefined,error=>{state.error=error.message;console.error('Unable to load roaming cat',error);});
 function update(delta){
  if(!state.loaded)return;
  let travelled=0;
  if(stopTime>0){stopTime-=delta;setMode('resting');if(stopTime<=0){setMode('walking');routeToNext();}}
  else if(cursor<route.length){
   setMode('walking');let remaining=.36*delta;
   while(remaining>0&&cursor<route.length){const [x,z]=route[cursor],dx=x-root.position.x,dz=z-root.position.z,d=Math.hypot(dx,dz);if(d<.004){cursor++;continue;}
    const travel=Math.min(remaining,d);const nx=root.position.x+dx/d*travel,nz=root.position.z+dz/d*travel;
    if(!isCatPositionSafe(nx,nz)){routeToNext();break;}root.position.x=nx;root.position.z=nz;state.distance+=travel;travelled+=travel;remaining-=travel;
    // This Munchkin mesh faces +Z at zero rotation.
    const angle=Math.atan2(dx,dz),difference=Math.atan2(Math.sin(angle-heading.rotation.y),Math.cos(angle-heading.rotation.y));heading.rotation.y+=difference*Math.min(1,delta*9);
    if(travel>=d-.0001)cursor++;
   }
   if(cursor>=route.length)stopTime=1.6+(destinationIndex%3)*.6;
  }else routeToNext();
  // Keep the source clip in real time; the added paw stride is paced by distance traveled.
  mixer.update(delta);
  model.updateMatrixWorld(true);
  updateGait(travelled,delta);
  model.updateMatrixWorld(true);floorBounds.setFromObject(model,true);model.position.y+=root.position.y-floorBounds.min.y;
 }
 return {root,update,diagnostics:()=>({...state,position:root.position.toArray(),safe:isCatPositionSafe(root.position.x,root.position.z),routeRemaining:route.length-cursor})};
}
