import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Oak vitrine holding attributed, original Sketchfab GLB assets.
export function createOnePieceDisplay(scene, rgbMaterials) {
  const cabinet = new THREE.Group();
  cabinet.name = 'OnePieceDisplay';
  cabinet.position.set(-2.82, 0, .68);
  cabinet.rotation.y = Math.PI / 2;
  scene.add(cabinet);
  const material = (color, roughness=.55, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
  const oak=material('#8a6543'), charcoal=material('#24332f'), brass=material('#b89758',.35,.65), cream=material('#e7d8b5');
  const skin=material('#edba8e'), hair=material('#192328'), red=material('#b72d35'), blue=material('#3767ac'), gold=material('#e1b34d');
  const pale=material('#f5e3c0'), black=material('#20252a'), white=material('#f0ece0');
  const sphereGeo=new THREE.SphereGeometry(1,20,14);
  function mesh(geometry, m, x,y,z,parent=cabinet){const o=new THREE.Mesh(geometry,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  function box(w,h,d,x,y,z,m,parent=cabinet){return mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(.025,w*.12,h*.12,d*.12)),m,x,y,z,parent);}
  function ellipsoid(x,y,z,sx,sy,sz,m,parent){const o=mesh(sphereGeo,m,x,y,z,parent);o.scale.set(sx,sy,sz);return o;}
  function cyl(r1,r2,h,x,y,z,m,parent){return mesh(new THREE.CylinderGeometry(r1,r2,h,24),m,x,y,z,parent);}
  function rod(a,b,r,m,parent){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b);const o=cyl(r,r,p.distanceTo(q),0,0,0,m,parent);o.position.copy(p.clone().add(q).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),q.sub(p).normalize());return o;}
  function ring(r,t,x,y,z,m,parent,flat=false){const o=mesh(new THREE.TorusGeometry(r,t,8,32),m,x,y,z,parent);if(flat)o.rotation.x=Math.PI/2;return o;}
  function label(text,w,h,x,y,z,color='#e7d8b5',bg='#24332f',parent=cabinet){
    const c=document.createElement('canvas');c.width=768;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${text.length>14?48:58}px sans-serif`;ctx.fillText(text,384,66);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,roughness:.8}),x,y,z,parent);
  }
  // Three-level oak and brass vitrine, facing the interior of the room.
  box(1.30,.20,.62,0,.13,0,oak);box(1.32,.07,.65,0,.265,0,oak);
  box(1.30,.10,.62,0,2.10,0,oak);box(1.20,1.79,.045,0,1.17,-.278,charcoal);
  for(const x of [-.625,.625])for(const z of [-.28,.28])box(.035,1.82,.035,x,1.18,z,brass);
  for(const y of [.30,1.17,2.04]){box(1.25,.026,.56,0,y,0,oak);box(1.18,.012,.015,0,y+.02,.281,brass);}
  const glass=new THREE.MeshPhysicalMaterial({color:'#d3ecea',transparent:true,opacity:.055,roughness:.12,metalness:.05,depthWrite:false,side:THREE.DoubleSide});
  for(const x of [-.605,.605]){const panel=mesh(new THREE.PlaneGeometry(.54,1.72),glass,x,1.18,0);panel.rotation.y=Math.PI/2;panel.castShadow=false;}
  // Front glass is suggested with a discreet reflection; the figures remain clear.
  const door=mesh(new THREE.PlaneGeometry(1.18,1.72),glass,0,1.18,.293);door.castShadow=false;
  for(const x of [.55])box(.012,.11,.026,x,1.1,.321,brass);
  box(1.15,.065,.025,0,2.105,.322,charcoal);label('ONE PIECE / COLLECTION',1.10,.055,0,2.105,.338);
  const inset=new THREE.MeshStandardMaterial({color:'#9b6aff',emissive:'#9b6aff',emissiveIntensity:1.4});inset.userData.rgbGlow=true;rgbMaterials.push(inset);
  for(const x of [-.57,.57])box(.009,1.72,.009,x,1.18,.22,inset);
  for(const y of [1.13,2.0])box(1.14,.009,.009,0,y,-.22,inset);

  const items=[
    {name:'Monkey D. Luffy',author:'weijie1988',url:'https://sketchfab.com/3d-models/monkey-d-luffy-3381f315bbcc47879f6498ad703ad2d0',file:'./assets/onepiece/luffy-battle.glb',y:1.20,rotation:-Math.PI/2,depth:.50},
    {name:'Devil Fruit',author:'Wendell.doc',url:'https://sketchfab.com/3d-models/devil-fruit-from-onepiece-4fa50ef32813456fbef1672526832427',file:'./assets/onepiece/devilfruit.glb',y:.33,rotation:0}
  ];
  cabinet.userData.characters=items.map(i=>i.name);
  cabinet.userData.loadedModels=0;cabinet.userData.failures=[];
  const loader=new GLTFLoader();
  cabinet.userData.ready=Promise.all(items.map(async item=>{
    const gltf=await loader.loadAsync(item.file);const model=gltf.scene;model.name='Imported_'+item.name;
    const removed=[];model.traverse(o=>{if(o.isLight||o.isCamera)removed.push(o);if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(!o.geometry.getAttribute('normal'))o.geometry.computeVertexNormals();const mats=[].concat(o.material);for(const m of mats){m.envMapIntensity=.35;if(m.emissive)m.emissive.set(0);}}});removed.forEach(o=>o.removeFromParent());
    const standing=gltf.animations.find(c=>c.name==='standing');if(standing){const mixer=new THREE.AnimationMixer(model);mixer.clipAction(standing).play();mixer.update(.4);}
    model.rotation.y=item.rotation;model.updateMatrixWorld(true);
    let bounds=new THREE.Box3().setFromObject(model);const size=bounds.getSize(new THREE.Vector3());const scale=Math.min(.75/size.y,.99/size.x,(item.depth??.43)/size.z);model.scale.multiplyScalar(scale);model.updateMatrixWorld(true);bounds=new THREE.Box3().setFromObject(model);const center=bounds.getCenter(new THREE.Vector3());model.position.set(-center.x,item.y+.039-bounds.min.y,-center.z);cabinet.add(model);
    cyl(.30,.32,.035,0,item.y+.02,0,charcoal);ring(.30,.005,0,item.y+.04,0,brass,cabinet,true);
    label(item.name.toUpperCase(),.96,.055,0,item.y+.025,.314);
    cabinet.userData.loadedModels++;return model;
  })).catch(error=>{cabinet.userData.failures.push(error.message);console.error('One Piece model loading failed',error);return [];});
  return cabinet;
}
