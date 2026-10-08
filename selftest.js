var fs=require('fs');
global.document={addEventListener:function(){}};
eval(fs.readFileSync(__dirname+'/cross.js','utf8'));
var fails=0;
function ok(cond,msg){if(cond){console.log('ok   '+msg);}else{fails++;console.log('FAIL '+msg);}}
function eq(a,b,msg){ok(JSON.stringify(a)===JSON.stringify(b),msg);}

ok(crossSolved(newCube())===true,'solved cube has white cross');

var u=applyMove(newCube(),'U');
ok(u.F[0]==='O'&&u.F[2]==='O','U CW: F top row comes from R (orange)');
var d=applyMove(newCube(),'D');
ok(d.F[6]==='R'&&d.F[8]==='R','D CW: F bottom row comes from L (red)');
var f=applyMove(newCube(),'F');
ok(f.R[0]==='Y'&&f.R[6]==='Y','F CW: R col0 comes from U (yellow)');
ok(f.D[0]==='O'&&f.D[2]==='O','F CW: D row0 comes from R (orange)');
var r=applyMove(newCube(),'R');
ok(r.B[0]==='Y'&&r.B[6]==='Y','R CW: B col0 comes from U (yellow)');
var l=applyMove(newCube(),'L');
ok(l.F[0]==='Y'&&l.F[6]==='Y','L CW: F col0 comes from U (yellow)');
var b=applyMove(newCube(),'B');
ok(b.L[0]==='Y'&&b.L[6]==='Y','B CW: L col0 comes from U (yellow)');

FACES.forEach(function(m){var x=newCube(),i;for(i=0;i<4;i++)x=applyMove(x,m);eq(x,newCube(),m+' x4 = solved');});

function invOf(m){return m.length===1?m+"'":(m[1]==="'"?m[0]:m);}
var scr=getScramble(30);
eq(applySequence(applySequence(newCube(),scr),scr.slice().reverse().map(invOf)),newCube(),'scramble + inverse = solved');

ok(crossSolved(applyMove(newCube(),'U'))===true,'U preserves cross');
ok(crossSolved(applyMove(newCube(),'F'))===false,'F breaks cross');
var t1=newCube();t1.D[1]='Y';ok(crossSolved(t1)===false,'D edge checked');
var t2=newCube();t2.F[7]='R';ok(crossSolved(t2)===false,'F side sticker checked');
var t3=newCube();t3.L[7]='G';ok(crossSolved(t3)===false,'L side sticker checked');
var t4=newCube();t4.R[7]='G';ok(crossSolved(t4)===false,'R side sticker checked');
var t5=newCube();t5.B[7]='G';ok(crossSolved(t5)===false,'B side sticker checked');

eq(findCross(newCube(),8),[],'already solved -> []');

var sw=newCube();
sw.D[1]='W';sw.F[7]='B';sw.D[7]='W';sw.B[7]='G';
ok(crossSolved(sw)===false&&!absGoal(absState(sw))&&absState(sw)!==absState(newCube()),'abs state distinguishes swapped white pieces');

function brute(c,md){if(crossSolved(c))return[];function rec(cc,cs,dep,lm){if(dep===0)return crossSolved(cc)?cs:null;for(var j=0;j<MOVES.length;j++){var mv=MOVES[j];if(lm&&mv[0]===lm[0])continue;var res=rec(applyMove(cc,mv),cs.concat([mv]),dep-1,mv);if(res)return res;}return null;}for(var d=1;d<=md;d++){var r=rec(c,[],d,null);if(r)return r;}return null;}
var mism=0;
for(t=0;t<8;t++){s=getScramble(10);bc=applySequence(newCube(),s);var B=brute(bc,5),A=findCross(bc,8);if(A===null||(B&&A.length>B.length)||!crossSolved(applySequence(bc,A))){mism++;console.log('brute mismatch: bfs='+(A?A.length:'null')+' brute='+(B?B.length:'null')+' | '+s.join(' '));}}
ok(mism===0,'findCross agrees with brute force on 8 short scrambles');

var bad=0,maxlen=0,i,t;
for(t=0;t<30;t++){var s=getScramble(25),bc=applySequence(newCube(),s),sol=findCross(bc,8);if(!sol){bad++;console.log('no solution: '+s.join(' '));continue;}if(!crossSolved(applySequence(bc,sol))){bad++;console.log('wrong solution: '+s.join(' '));}if(sol.length>maxlen)maxlen=sol.length;}
ok(bad===0,'30 random scrambles solved, worst length '+maxlen);

console.log(fails?fails+' FAILURES':'ALL TESTS PASSED');
process.exit(fails?1:0);
