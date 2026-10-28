import * as THREE from 'three';

// All textures are generated locally; no remote model or image dependencies.
export function woodMaterial(){
 const c=document.createElement('canvas');c.width=256;c.height=512;
 const ctx=c.getContext('2d');ctx.fillStyle='#b58a57';ctx.fillRect(0,0,256,512);
 let seed=17;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<480;i++){const x=rand()*256;ctx.strokeStyle=`rgba(${rand()>.5?'81,48,20':'247,223,171'},${.04+rand()*.09})`;ctx.lineWidth=.4+rand()*1.7;ctx.beginPath();ctx.moveTo(x,0);for(let y=0;y<=512;y+=16)ctx.lineTo(x+Math.sin(y*.016+i)*2,y);ctx.stroke()}
 const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;
 return new THREE.MeshStandardMaterial({map,color:'#ebd4af',roughness:.77});
}

export function dressRoom({scene,box,cylinder,rod,mat,glow,wood,metal,black}){
 const cream=mat('#e7dfca'),trim=mat('#88613d'),sage=mat('#879b85'),linen=mat('#c2c6ae'),terra=mat('#b67658'),gold=mat('#b39153',.3,.65);
 let seed=711;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 // Alternating timber floorboards, seams and a solid, chamfered plinth.
 for(let row=0;row<18;row++)for(let col=0;col<4;col++){
  const z=-2.8+row*.325;const x=-2.61+col*1.74;
  const m=wood.clone();m.color.setHSL(.093,.27,.64+(random()-.5)*.09);
  const plank=box(1.728,.034,.316,x,-.023,z,m);plank.receiveShadow=true;
 }
 box(7.27,.08,6.27,0,-.34,0,trim);box(7.05,.08,.07,0,-.045,3.02,trim);box(.07,.08,6.06,3.51,-.045,0,trim);
 const ground=box(200,.08,200,0,-.49,0,mat('#a8b0a2'));ground.name='Backdrop';ground.receiveShadow=true;ground.castShadow=false;
 // Architectural joinery: wainscot, mullions, cornice and posts.
 for(const y of [.13,.93,2.78]){box(7.04,.07,.08,0,y,-2.9,trim);box(.08,.07,5.95,-3.4,y,0,trim)}
 for(const x of [-3.43,-2.25,2.25,3.43])box(.085,2.76,.12,x,1.37,-2.88,trim);
 for(const z of [-2.91,-1.75,1.4,2.96])box(.12,2.76,.085,-3.39,1.37,z,trim);
 for(let i=0;i<24;i++)box(.022,.66,.025,-3.23+i*.28,.52,-2.89,cream);
 for(let i=0;i<20;i++)box(.025,.66,.022,-3.39,.52,-2.8+i*.29,cream);
 // Large window on the left wall: sky, wooden frame, glazing and blinds.
 box(.04,1.5,2.56,-3.4,1.81,-.2,cream);
 const glass=mat('#b6cbd0',.24,.12);glass.emissive=new THREE.Color('#b2cfcd');glass.emissiveIntensity=.15;
 const windowPane=box(.055,1.31,2.36,-3.35,1.81,-.2,glass);windowPane.name='WindowPane';
 for(const y of [1.10,1.79,2.52])box(.11,.055,2.54,-3.28,y,-.2,trim);
 for(const z of [-1.43,-.2,1.03])box(.11,1.44,.055,-3.28,1.81,z,trim);
 box(.24,.07,2.68,-3.25,1.06,-.2,wood);
 for(let i=0;i<7;i++)box(.12,.035,2.42,-3.23,2.48-i*.07,-.2,cream);
 // Side cabinet / record shelf with drawers, handles, albums and ceramics.
 box(.58,.83,1.88,-2.97,.43,-1.92,wood);box(.63,.065,1.97,-2.95,.88,-1.92,wood);
 for(let i=0;i<3;i++){box(.028,.22,.52,-2.66,.23+i*.24,-2.49,cream);box(.04,.025,.13,-2.63,.25+i*.24,-2.49,gold)}
 box(.035,.035,1.05,-2.65,.42,-1.53,wood);
 for(let i=0;i<12;i++){const b=box(.25,.23+random()*.09,.042,-2.79,.6,-1.98+i*.073,mat(['#5f796e','#b66f54','#d7c7a4','#626e72'][i%4]));b.rotation.x=(random()-.5)*.1}
 for(let i=0;i<4;i++)box(.27,.035,.35,-2.78,.12+i*.04,-1.54,mat(i%2?'#e0d4b6':'#698679'));
 // A compact sofa in the foreground with piping, cushions and timber legs.
 const sofa=new THREE.Group();sofa.position.set(1.72,0,1.8);scene.add(sofa);
 for(const x of [-.82,.82])for(const z of [-.26,.27])cylinder(.035,.025,.20,x,.10,z,trim,sofa);
 box(2.04,.25,.81,0,.30,0,sage,sofa);box(2.08,.56,.18,0,.65,.36,sage,sofa);
 for(const x of [-.96,.96])box(.18,.48,.88,x,.5,.01,sage,sofa);
 for(const x of [-.44,.44]){box(.83,.14,.66,x,.49,-.035,linen,sofa);const b=box(.8,.37,.16,x,.76,.24,linen,sofa);b.rotation.x=-.12;box(.78,.012,.012,x,.56,-.35,cream,sofa)}
 const cushion=box(.34,.31,.13,-.64,.74,.15,terra,sofa);cushion.rotation.z=.22;
 const cushion2=box(.36,.33,.12,.63,.74,.15,mat('#d8c6a0'),sofa);cushion2.rotation.z=-.23;
 // Woven rug, low coffee table, a book, cup and ceramic tray.
 box(2.5,.018,1.62,1.48,.001,.91,mat('#d2c7a8'));
 for(let i=0;i<32;i++)box(2.43,.002,.008,1.48,.013,.16+i*.047,mat(i%4?'#c5b999':'#a59e7d'));
 for(let i=0;i<24;i++)for(const z of [.075,1.735])box(.012,.008,.08,.30+i*.10,.01,z,cream);
 cylinder(.52,.52,.055,1.33,.47,.72,wood);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;rod([1.33+Math.sin(a)*.28,.45,.72+Math.cos(a)*.28],[1.33+Math.sin(a)*.39,.035,.72+Math.cos(a)*.39],.025,trim)}
 const book=box(.24,.035,.32,1.19,.515,.65,mat('#67796f'));book.rotation.y=.25;box(.215,.018,.285,1.19,.517,.65,cream);
 cylinder(.064,.048,.085,1.52,.535,.77,cream);cylinder(.05,.05,.004,1.52,.579,.77,mat('#4a3529'));
 const cupHandle=new THREE.Mesh(new THREE.TorusGeometry(.032,.009,7,16),cream);cupHandle.position.set(1.588,.545,.77);scene.add(cupHandle);
 // Framed artwork on the rear wall, built from an actual canvas print.
 function art(x,y,w,h,variant){
  box(w+.10,h+.10,.065,x,y,-2.84,trim);box(w,h,.017,x,y,-2.795,cream);
  const c=document.createElement('canvas');c.width=384;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#e1d5b9';ctx.fillRect(0,0,384,512);
  if(variant){ctx.fillStyle='#bb7455';ctx.beginPath();ctx.arc(245,160,75,0,Math.PI*2);ctx.fill();for(let i=0;i<4;i++){ctx.fillStyle=['#a1ad86','#718b73','#476e60','#325044'][i];ctx.beginPath();ctx.moveTo(0,512);ctx.lineTo(0,300+i*40);for(let x=0;x<=384;x+=16)ctx.lineTo(x,300+i*40+Math.sin(x*.011+i)*50);ctx.lineTo(384,512);ctx.fill()}}
  else{ctx.fillStyle='#4c6a58';ctx.font='bold 60px serif';ctx.fillText('PLAY.',28,116);ctx.fillText('CREATE.',28,196);ctx.fillText('REPEAT.',28,276);ctx.fillStyle='#b27c55';ctx.fillRect(28,322,322,5);ctx.font='21px sans-serif';ctx.fillStyle='#4c6a58';ctx.fillText('HIEU / STUDIO',30,383)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const p=new THREE.Mesh(new THREE.PlaneGeometry(w*.92,h*.93),new THREE.MeshStandardMaterial({map:t,roughness:1}));p.position.set(x,y,-2.778);scene.add(p);
 }
 art(2.72,1.95,.69,.86,true);art(-2.72,1.97,.64,.85,false);
 // Natural plants with curved stems and individual leaves.
 function plant(x,z,size=1,y=0){
  cylinder(.16*size,.12*size,.27*size,x,y+.135*size,z,terra);cylinder(.146*size,.146*size,.025*size,x,y+.27*size,z,mat('#4b4133'));
  for(let i=0;i<10;i++){const a=i*2.399;const height=(.39+random()*.42)*size;const dx=Math.sin(a)*.20*size,dz=Math.cos(a)*.20*size;rod([x,y+.25*size,z],[x+dx,y+height,z+dz],.009*size,mat('#4c6840'));
   const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),mat(['#6c8b50','#849b62','#4c754e'][i%3]));leaf.scale.set(.095*size,.24*size,.037*size);leaf.position.set(x+dx,y+height,z+dz);leaf.rotation.set(Math.cos(a)*.55, a,Math.sin(a)*.65);leaf.castShadow=true;scene.add(leaf);
  }
 }
 plant(2.95,2.3,1.45);plant(-2.98,2.25,1.55);plant(-3.19,-.85,.58,1.1);plant(-2.94,-2.40,.58,.92);
 // Open oak display shelf to the right of the desk.
 for(const x of [2.69,3.22])box(.045,1.48,.47,x,.75,.9,trim);
 for(let i=0;i<4;i++)box(.65,.045,.51,2.95,.10+i*.45,.9,wood);
 for(let i=0;i<6;i++){box(.055,.25+random()*.07,.24,2.77+i*.062,.24,.9,mat(['#a66d50','#c2b28c','#6a8472'][i%3]))}
 cylinder(.12,.085,.20,2.95,1.10,.9,cream);cylinder(.065,.095,.16,2.95,1.27,.9,cream);
 for(let i=0;i<3;i++)box(.33,.045,.24,2.95,.57+i*.045,.9,mat(i%2?'#cbb58d':'#7b8d78'));
 // Tall reading lamp, warm shade and practical brass details.
 cylinder(.19,.21,.045,.24,.035,2.02,metal);rod([.24,.05,2.02],[.24,1.52,2.02],.018,gold);
 cylinder(.22,.35,.31,.24,1.60,2.02,mat('#e6d7b5'));const bulb=new THREE.PointLight('#ffd797',1.3,3,2);bulb.name='ReadingLamp';bulb.position.set(.24,1.47,2.02);scene.add(bulb);
 // Desk drawer pedestal, small pad, mug, cable routing and acoustic tile seams.
 box(.42,.68,.78,-1.50,.37,-1.84,wood);for(let i=0;i<3;i++){box(.39,.19,.018,-1.50,.16+i*.21,-1.44,cream);box(.13,.018,.025,-1.50,.19+i*.21,-1.42,gold)}
 cylinder(.07,.055,.12,1.47,1.0,-1.52,terra);cylinder(.059,.059,.006,1.47,1.064,-1.52,mat('#392f27'));
 rod([.44,.97,-1.49],[.55,.94,-1.7],.006,black);rod([.55,.94,-1.7],[.8,.94,-2.22],.006,black);
 box(.18,.025,.25,-1.11,.95,-1.53,mat('#d4bc83'));
 // A hand-built, sculpted gaming chair shell covers the former flat slab.
 // Curved shoulder silhouette, inset panels, stitch lines and racing harness openings.
 const shell=new THREE.Shape();shell.moveTo(-.30,.55);shell.lineTo(-.36,.91);shell.lineTo(-.29,1.36);shell.quadraticCurveTo(-.25,1.58,-.13,1.61);shell.lineTo(.13,1.61);shell.quadraticCurveTo(.25,1.58,.29,1.36);shell.lineTo(.36,.91);shell.lineTo(.30,.55);shell.closePath();
 const geom=new THREE.ExtrudeGeometry(shell,{depth:.12,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035});
 const shellMesh=new THREE.Mesh(geom,mat('#354d45'));shellMesh.position.set(0,0,-.66);shellMesh.castShadow=true;scene.add(shellMesh);
 for(const x of [-.12,.12]){box(.085,.045,.02,x,1.39,-.485,black);rod([x,.72,-.475],[x,1.25,-.475],.004,mat('#a5b49b'))}
 // Subtle edges in the PC chassis, fan grills and front power switch.
 for(const x of [2.135,2.605])box(.012,.70,.61,x,.40,-1.85,metal);
 for(let i=0;i<3;i++){const fan=new THREE.Mesh(new THREE.TorusGeometry(.09,.003,6,32),metal);fan.position.set(2.37,.2+i*.22,-1.5);scene.add(fan)}
 cylinder(.012,.012,.008,2.46,.755,-1.64,glow('#b8e7d6'));
}
