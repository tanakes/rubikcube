var MOVES=['U',"U'","U2",'D',"D'","D2",'F',"F'","F2",'B',"B'","B2",'L',"L'","L2",'R',"R'","R2"];
var FACES=['U','D','F','B','L','R'],NRM={'U':[0,1,0],'D':[0,-1,0],'F':[0,0,1],'B':[0,0,-1],'L':[-1,0,0],'R':[1,0,0]},PERM={};
function facelet(f,i){var r=i/3|0,c=i%3;switch(f){case'U':return[c-1,1,r-1];case'D':return[c-1,-1,1-r];case'F':return[c-1,1-r,1];case'B':return[1-c,1-r,-1];case'L':return[-1,1-r,c-1];default:return[1,1-r,1-c];}}
function slotAt(p,n){var f,r,c,x=p[0],y=p[1],z=p[2];if(n[1]===1)f=0;else if(n[1]===-1)f=1;else if(n[2]===1)f=2;else if(n[2]===-1)f=3;else if(n[0]===-1)f=4;else f=5;switch(FACES[f]){case'U':r=z+1;c=x+1;break;case'D':r=1-z;c=x+1;break;case'F':r=1-y;c=x+1;break;case'B':r=1-y;c=1-x;break;case'L':r=1-y;c=z+1;break;default:r=1-y;c=1-z;}return f*9+r*3+c;}
function cross3(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot3(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function cwLayer(a){var p=new Array(54),i,f,k,pos,nrm,d,x,np,nn;for(i=0;i<54;i++){f=FACES[i/9|0];k=i%9;pos=facelet(f,k);nrm=NRM[f];if(dot3(a,pos)!==1){p[i]=i;continue;}d=dot3(a,pos);x=cross3(a,pos);np=[a[0]*d-x[0],a[1]*d-x[1],a[2]*d-x[2]];d=dot3(a,nrm);x=cross3(a,nrm);nn=[a[0]*d-x[0],a[1]*d-x[1],a[2]*d-x[2]];p[i]=slotAt(np,nn);}return p;}
FACES.forEach(function(f){var b=cwLayer(NRM[f]);MOVES.forEach(function(mv){if(mv[0]!==f)return;var n=mv.length===1?1:(mv[1]==='2'?2:3),p=b.slice(),i,k,t;for(k=1;k<n;k++){t=new Array(54);for(i=0;i<54;i++)t[i]=b[p[i]];p=t;}PERM[mv]=p;});});
function rep(ch){var a=[],i;for(i=0;i<9;i++)a.push(ch);return a;}
function newCube(){return{U:rep('Y'),D:rep('W'),F:rep('G'),B:rep('B'),L:rep('R'),R:rep('O')};}
function applyMove(c,mv){var p=PERM[mv],a=c.U.concat(c.D,c.F,c.B,c.L,c.R),b=new Array(54),i;for(i=0;i<54;i++)b[p[i]]=a[i];return{U:b.slice(0,9),D:b.slice(9,18),F:b.slice(18,27),B:b.slice(27,36),L:b.slice(36,45),R:b.slice(45,54)};}
function applySequence(c,seq){for(var i=0;i<seq.length;i++)c=applyMove(c,seq[i]);return c;}
function getScramble(n){var f='URFDLB'.split(''),v=["'",'2'],s=[],last='',m;while(s.length<n){m=f[(Math.random()*6)|0];if(m===last)continue;last=m;s.push(m+(Math.random()<0.35?v[(Math.random()*2)|0]:''));}return s;}
function crossSolved(c){return c.D[1]===c.D[4]&&c.D[3]===c.D[4]&&c.D[5]===c.D[4]&&c.D[7]===c.D[4]&&c.F[7]===c.F[4]&&c.L[7]===c.L[4]&&c.R[7]===c.R[4]&&c.B[7]===c.B[4];}
var EDGES=[['U',7,'F',1],['U',3,'L',1],['U',5,'R',1],['U',1,'B',1],['D',1,'F',7],['D',3,'L',7],['D',5,'R',7],['D',7,'B',7],['F',3,'L',5],['F',5,'R',3],['L',3,'B',5],['B',3,'R',5]];
var WID={'G':0,'R':1,'O':2,'B':3},EMAP={};EDGES.forEach(function(e,s){EMAP[FACES.indexOf(e[0])*9+e[1]]=[s,0];EMAP[FACES.indexOf(e[2])*9+e[3]]=[s,1];});
var TRANS={};MOVES.forEach(function(mv){var p=PERM[mv],n=[],f=[],s,d;for(s=0;s<12;s++){d=EMAP[p[FACES.indexOf(EDGES[s][0])*9+EDGES[s][1]]];n.push(d[0]);f.push(d[1]);}TRANS[mv]={n:n,f:f};});
function absState(c){var s='',i,e;for(i=0;i<12;i++){e=EDGES[i];if(c[e[0]][e[1]]==='W')s+=String.fromCharCode(49+WID[c[e[2]][e[3]]]*2);else if(c[e[2]][e[3]]==='W')s+=String.fromCharCode(50+WID[c[e[0]][e[1]]]*2);else s+='.';}return s;}
function absStep(s,mv){var t=TRANS[mv],o=new Array(12),i,v,id,fl;for(i=0;i<12;i++){v=s.charCodeAt(i)-49;if(v<0){o[t.n[i]]='.';continue;}id=v>>1;fl=(v&1)^t.f[i];o[t.n[i]]=String.fromCharCode(49+id*2+fl);}return o.join('');}
function absGoal(s){return s[4]==='1'&&s[5]==='3'&&s[6]==='5'&&s[7]==='7';}
function findCross(c,md){md=md||8;var s0=absState(c);if(absGoal(s0))return[];var seen={};seen[s0]=1;var q=[{s:s0,p:null,m:''}],d,i,nq,j,node,ns,seq,mv;for(d=1;d<=md;d++){nq=[];for(i=0;i<q.length;i++){node=q[i];for(j=0;j<MOVES.length;j++){ns=absStep(node.s,MOVES[j]);if(absGoal(ns)){mv=MOVES[j];seq=[mv];while(node.p){seq.push(node.m);node=node.p;}return seq.reverse();}if(seen[ns])continue;seen[ns]=1;nq.push({s:ns,p:node,m:MOVES[j]});}}q=nq;if(!q.length)break;}return null;}
function colorOf(ch){switch(ch){case'W':return'#fff';case'Y':return'#facc15';case'G':return'#22c55e';case'B':return'#3b82f6';case'O':return'#fb923c';case'R':return'#ef4444';default:return'#64748b';}}
var FACE_T={U:'rotateX(90deg) translateZ(42px)',D:'rotateX(-90deg) translateZ(42px)',F:'translateZ(42px)',B:'rotateY(180deg) translateZ(42px)',L:'rotateY(-90deg) translateZ(42px)',R:'rotateY(90deg) translateZ(42px)'};
var AXIS={U:[0,-1,0],D:[0,1,0],F:[0,0,1],B:[0,0,-1],L:[-1,0,0],R:[1,0,0]};
function rng(f,idx){return idx.map(function(i){return f+i;});}
var ALL=[0,1,2,3,4,5,6,7,8];
var LYR={
U:rng('U',ALL).concat(rng('F',[0,1,2]),rng('B',[0,1,2]),rng('L',[0,1,2]),rng('R',[0,1,2])),
D:rng('D',ALL).concat(rng('F',[6,7,8]),rng('B',[6,7,8]),rng('L',[6,7,8]),rng('R',[6,7,8])),
F:rng('F',ALL).concat(rng('U',[6,7,8]),rng('D',[0,1,2]),rng('L',[2,5,8]),rng('R',[0,3,6])),
B:rng('B',ALL).concat(rng('U',[0,1,2]),rng('D',[6,7,8]),rng('L',[0,3,6]),rng('R',[2,5,8])),
L:rng('L',ALL).concat(rng('U',[0,3,6]),rng('D',[0,3,6]),rng('F',[0,3,6]),rng('B',[2,5,8])),
R:rng('R',ALL).concat(rng('U',[2,5,8]),rng('D',[2,5,8]),rng('F',[2,5,8]),rng('B',[0,3,6]))
};
var NET={U:[0,0],F:[0,84],D:[0,168],L:[-84,84],R:[84,84],B:[168,84]},is3d=true;
function cellT(d){var f=d.getAttribute('data-f'),i=+d.getAttribute('data-i'),c=i%3,r=i/3|0;return is3d?(FACE_T[f]?FACE_T[f]+' ':'')+'translate('+((c-1)*28)+'px,'+((r-1)*28)+'px)':'translate('+(NET[f][0]+c*28-70)+'px,'+(NET[f][1]+r*28-112)+'px)';}
function setCellTransforms(){var els=[cubeA,cubeB],j,k;for(j=0;j<els.length;j++){for(k in els[j]._cells)els[j]._cells[k].style.transform=cellT(els[j]._cells[k]);}}
function buildCube(el){var cells={},f,i,d;for(f=0;f<6;f++){for(i=0;i<9;i++){d=document.createElement('div');d.className='st';d.setAttribute('data-f',FACES[f]);d.setAttribute('data-i',i);el.appendChild(d);cells[FACES[f]+i]=d;}}el._cells=cells;}
function renderCube(el,c){var k;for(k in el._cells)el._cells[k].style.background=colorOf(c[k[0]][+k[1]]);}
function animateTurn(el,mv,done){var f=mv[0],n=mv.length===1?1:(mv[1]==='2'?2:3),a=AXIS[f],g=document.createElement('div'),list=LYR[f],cells=[],i;g.className='layer';el.appendChild(g);for(i=0;i<list.length;i++){cells.push(el._cells[list[i]]);g.appendChild(el._cells[list[i]]);}void g.offsetWidth;g.style.transform='rotate3d('+a[0]+','+a[1]+','+a[2]+','+(90*n)+'deg)';g.addEventListener('transitionend',function h(e){if(e.target!==g)return;g.removeEventListener('transitionend',h);for(i=0;i<cells.length;i++)el.appendChild(cells[i]);el.removeChild(g);if(done)done();});}
var currentScramble=[],currentSolution=[],step=0,baseCube=newCube(),busy=false;var st,sot,mc,nb,sb,pb,nxb,rb,modeEl,customInput,applyBtn,cubeA,cubeB;
function invOf(m){return m.length===1?m+"'":(m[1]==="'"?m[0]:m);}
function setBtns(){pb.disabled=busy||step===0;nxb.disabled=busy||step>=currentSolution.length;rb.disabled=busy||step===0;}
function setScramble(seq){currentScramble=seq;st.textContent=seq.join(' ');customInput.value=seq.join(' ');baseCube=applySequence(newCube(),seq);renderCube(cubeA,baseCube);renderCube(cubeB,baseCube);currentSolution=[];sot.textContent='-';step=0;mc.textContent='0 / 0';sb.disabled=false;setBtns();}
function generateNew(){if(busy)return;setScramble(getScramble(25));}
function applyCustom(){if(busy)return;var txt=customInput.value.trim();if(!txt)return;var toks=txt.toUpperCase().split(/\s+/),i,seq=[];for(i=0;i<toks.length;i++){if(MOVES.indexOf(toks[i])<0){customInput.setCustomValidity('Bad move: '+toks[i]);customInput.reportValidity();return;}seq.push(toks[i]);}customInput.setCustomValidity('');setScramble(seq);}
function findAndShow(){if(busy)return;sb.disabled=true;sb.textContent='Searching...';setTimeout(function(){var sol=findCross(baseCube,8);if(sol===null){currentSolution=[];sot.textContent='(no cross within 8 moves)';step=0;mc.textContent='0 / 0';}else{currentSolution=sol;sot.textContent=sol.length?sol.join(' '):'(already solved)';step=0;updateView();}sb.textContent='Show Optimal Cross';sb.disabled=false;},10);}
function updateView(){mc.textContent=currentSolution.length?(step+' / '+currentSolution.length):'0 / 0';renderCube(cubeB,applySequence(baseCube,currentSolution.slice(0,step)));setBtns();}
function prevStep(){if(busy||step<=0)return;if(!is3d){step--;updateView();return;}busy=true;setBtns();animateTurn(cubeB,invOf(currentSolution[step-1]),function(){step--;busy=false;updateView();});}
function nextStep(){if(busy||step>=currentSolution.length)return;if(!is3d){step++;updateView();return;}busy=true;setBtns();animateTurn(cubeB,currentSolution[step],function(){step++;busy=false;updateView();});}
function resetStep(){if(busy)return;step=0;updateView();}
function toggleMode(){if(busy){modeEl.checked=is3d;return;}is3d=modeEl.checked;cubeA.parentElement.classList.toggle('flat',!is3d);cubeB.parentElement.classList.toggle('flat',!is3d);setCellTransforms();applyPose(cubeA);applyPose(cubeB);}
function applyPose(el){var o=el._pose;el.style.transform=is3d?'rotateX('+o.pitch+'deg) rotateY('+o.yaw+'deg)':'';}
function bindOrbit(scene,el){var o=el._pose={yaw:-36,pitch:-28},down=false,lx=0,ly=0;scene.addEventListener('pointerdown',function(e){if(!is3d||e.button)return;e.preventDefault();down=true;lx=e.clientX;ly=e.clientY;try{scene.setPointerCapture(e.pointerId);}catch(x){}});scene.addEventListener('pointermove',function(e){if(!down)return;o.yaw+=(e.clientX-lx)*0.4;o.pitch=Math.max(-89,Math.min(89,o.pitch-(e.clientY-ly)*0.4));lx=e.clientX;ly=e.clientY;applyPose(el);});scene.addEventListener('pointerup',function(){down=false;});scene.addEventListener('pointercancel',function(){down=false;});}
document.addEventListener('DOMContentLoaded',function(){nb=document.getElementById('newScrambleBtn');sb=document.getElementById('showSolutionBtn');pb=document.getElementById('prevMoveBtn');nxb=document.getElementById('nextMoveBtn');rb=document.getElementById('resetViewBtn');modeEl=document.getElementById('mode3d');customInput=document.getElementById('customScramble');applyBtn=document.getElementById('applyScrambleBtn');st=document.getElementById('scrambleText');sot=document.getElementById('solutionText');mc=document.getElementById('moveCounter');cubeA=document.getElementById('cube1');cubeB=document.getElementById('cube2');nb.addEventListener('click',generateNew);sb.addEventListener('click',findAndShow);pb.addEventListener('click',prevStep);nxb.addEventListener('click',nextStep);rb.addEventListener('click',resetStep);modeEl.addEventListener('change',toggleMode);applyBtn.addEventListener('click',applyCustom);customInput.addEventListener('keydown',function(e){if(e.key==='Enter')applyCustom();});buildCube(cubeA);buildCube(cubeB);bindOrbit(cubeA.parentElement,cubeA);bindOrbit(cubeB.parentElement,cubeB);setCellTransforms();renderCube(cubeA,newCube());renderCube(cubeB,newCube());});
