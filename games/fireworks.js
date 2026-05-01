/* ─── FIREWORKS ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.fireworks.hint;
let W,H;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',resize);

const PARTICLES=[];

function createExplosion(x,y){
  const count=Math.floor(Math.random()*30)+20;
  const hue=Math.floor(Math.random()*360);
  for(let i=0;i<count;i++){
    const angle=Math.random()*Math.PI*2;
    const speed=Math.random()*8+3;
    PARTICLES.push({
      x,y,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      life:255,
      hue
    });
  }
}

function update(){
  for(let i=PARTICLES.length-1;i>=0;i--){
    const p=PARTICLES[i];
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=0.2;
    p.life-=4;
    if(p.life<=0) PARTICLES.splice(i,1);
  }
}

function render(){
  ctx.fillStyle='rgba(7,6,6,0.05)';
  ctx.fillRect(0,0,W,H);
  
  PARTICLES.forEach(p=>{
    ctx.fillStyle=`hsla(${p.hue},100%,50%,${p.life/255})`;
    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fill();
  });
}

function loop(){
  update();
  render();
  requestAnimationFrame(loop);
}

document.addEventListener('click',e=>{
  createExplosion(e.clientX,e.clientY);
});

document.addEventListener('touchstart',e=>{
  const touch=e.touches[0];
  createExplosion(touch.clientX,touch.clientY);
});

setInterval(()=>{
  createExplosion(Math.random()*W,Math.random()*H*0.6);
},800);

requestAnimationFrame(loop);
