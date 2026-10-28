// Floor-level footprints only: the cat may walk beneath the tall desk.
export const CAT_OBSTACLES=[
 [-3.35,-2.58,-2.9,-.94], // left book cabinet
 [-3.15,-2.49,.02,1.34], // glass display
 [-3.21,-2.73,1.99,2.53], [2.71,3.19,2.06,2.54], // large pots
 [.66,2.78,1.34,2.28], // sofa
 [.80,1.86,.19,1.25], // coffee table
 [.02,.46,1.80,2.24], // reading-lamp foot
 [2.60,3.30,.63,1.17], // right shelf
 [2.12,2.62,-2.18,-1.52], // PC
 [-1.82,-1.22,-2.28,-1.40], // desk drawers
 [-1.95,-1.54,-2.29,-1.31], [1.52,1.98,-2.29,-1.31], // desk feet
 [-.51,.51,-1.51,-.48], // gaming-chair casters
];
export const CAT_DESTINATIONS=[[-1.25,.2],[-2.15,1.4],[-1.35,2.48],[1.25,2.65],[2.30,1.00],[2.90,-.60],[2.95,-2.52],[.70,-2.55],[-1.00,-2.50],[-2.12,-1.7],[-.6,.75]];
export const CAT_RADIUS=.19;
const STEP=.14,MIN_X=-3.18,MIN_Z=-2.72,MAX_X=3.18,MAX_Z=2.74;
const W=Math.floor((MAX_X-MIN_X)/STEP)+1,H=Math.floor((MAX_Z-MIN_Z)/STEP)+1;
export function isCatPositionSafe(x,z){return x>=MIN_X&&x<=MAX_X&&z>=MIN_Z&&z<=MAX_Z&&!CAT_OBSTACLES.some(([a,b,c,d])=>x>a-CAT_RADIUS&&x<b+CAT_RADIUS&&z>c-CAT_RADIUS&&z<d+CAT_RADIUS);}
const point=id=>[MIN_X+(id%W)*STEP,MIN_Z+Math.floor(id/W)*STEP];
const key=(x,z)=>Math.round((z-MIN_Z)/STEP)*W+Math.round((x-MIN_X)/STEP);
function nearest(position){let best=-1,distance=Infinity;for(let id=0;id<W*H;id++){const p=point(id);if(!isCatPositionSafe(...p))continue;const d=(p[0]-position[0])**2+(p[1]-position[1])**2;if(d<distance){best=id;distance=d}}return best;}
export function findCatPath(start,goal){
 const a=nearest(start),b=nearest(goal);if(a===b)return [point(a)];
 const open=new Set([a]),came=new Map(),g=new Map([[a,0]]),score=new Map([[a,0]]);const destination=point(b);
 while(open.size){let current=-1,best=Infinity;for(const id of open){const value=score.get(id);if(value<best){best=value;current=id;}}if(current===b){const path=[];while(current!==undefined){path.push(point(current));current=came.get(current);}return path.reverse();}open.delete(current);
  const cx=current%W,cz=Math.floor(current/W);
  for(const [dx,dz]of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){
   const nx=cx+dx,nz=cz+dz;if(nx<0||nx>=W||nz<0||nz>=H)continue;const next=nz*W+nx,p=point(next);if(!isCatPositionSafe(...p))continue;
   if(dx&&dz&&(!isCatPositionSafe(...point(cz*W+nx))||!isCatPositionSafe(...point(nz*W+cx))))continue;
   const distance=g.get(current)+Math.hypot(dx,dz);if(distance>=(g.get(next)??Infinity))continue;
   came.set(next,current);g.set(next,distance);score.set(next,distance+Math.hypot(p[0]-destination[0],p[1]-destination[1])/STEP);open.add(next);
  }
 }
 return [];
}
