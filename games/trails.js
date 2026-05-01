/* ─── TRAIL EFFECTS ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.trails.hint;
let W,H,mx=0,my=0;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',resize);

const TRAILS=[];

document.addEventListener('mousemove',e=>{
  mx=e.clientX;
  my=e.clientY;
  
  if(Math.random()<0.7){
    const angle=Math.random()*Math.PI*2;
    const speed=Math.random()*3+2;
    TRAILS.push({
      x:mx,
      y:my,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      life:255,
      hue:Math.random()*360
    });
  }
});

function update(){
  for(let i=TRAILS.length-1;i>=0;i--){
    const t=TRAILS[i];
    t.x+=t.vx;
    t.y+=t.vy;
    t.vy+=0.15;
    t.life-=3;
    if(t.life<=0) TRAILS.splice(i,1);
  }
}

function render(){
  ctx.fillStyle='rgba(7,6,6,0.08)';
  ctx.fillRect(0,0,W,H);
  
  TRAILS.forEach(t=>{
    ctx.fillStyle=`hsla(${t.hue},80%,50%,${t.life/255})`;
    ctx.beginPath();
    ctx.arc(t.x,t.y,5+Math.random()*3,0,Math.PI*2);
    ctx.fill();
  });
}

function loop(){
  update();
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
