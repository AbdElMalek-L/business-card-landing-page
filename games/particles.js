/* ─── DANCING PARTICLES ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.particles.hint;
let W,H,time=0;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',resize);

const NUM_PARTICLES=80;
const PARTICLES=[];

for(let i=0;i<NUM_PARTICLES;i++){
  PARTICLES.push({
    index:i,
    x:Math.random()*W,
    y:Math.random()*H,
    size:Math.random()*4+2
  });
}

function render(){
  time+=0.01;
  ctx.fillStyle='rgba(7,6,6,0.1)';
  ctx.fillRect(0,0,W,H);
  
  PARTICLES.forEach((p,i)=>{
    const angle=time+i*Math.PI*2/NUM_PARTICLES;
    const radius=150+Math.sin(time*0.5+i)*100;
    p.x=W/2+Math.cos(angle)*radius;
    p.y=H/2+Math.sin(angle)*radius;
    
    ctx.fillStyle=`hsla(${(i/NUM_PARTICLES*360+time*50)%360},70%,50%,0.8)`;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  });
  
  ctx.strokeStyle='rgba(184,150,95,0.1)';
  ctx.lineWidth=0.5;
  for(let i=0;i<NUM_PARTICLES-1;i++){
    const p1=PARTICLES[i];
    const p2=PARTICLES[i+1];
    const dx=p2.x-p1.x;
    const dy=p2.y-p1.y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<150){
      ctx.globalAlpha=(1-dist/150)*0.3;
      ctx.beginPath();
      ctx.moveTo(p1.x,p1.y);
      ctx.lineTo(p2.x,p2.y);
      ctx.stroke();
      ctx.globalAlpha=1;
    }
  }
}

function loop(){
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
