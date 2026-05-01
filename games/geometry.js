/* ─── MOVING GEOMETRY ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.geometry.hint;
let W,H,time=0;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',resize);

function render(){
  time+=0.01;
  ctx.fillStyle='#070706';
  ctx.fillRect(0,0,W,H);
  
  const cx=W/2;
  const cy=H/2;
  
  for(let layer=0;layer<5;layer++){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(time+layer*Math.PI/2.5);
    
    const size=100+layer*60;
    const sides=3+layer;
    const hue=(layer*72+time*50)%360;
    
    ctx.strokeStyle=`hsl(${hue},70%,50%)`;
    ctx.lineWidth=2;
    ctx.globalAlpha=0.6-layer*0.1;
    
    ctx.beginPath();
    for(let i=0;i<sides;i++){
      const angle=i*Math.PI*2/sides;
      const x=Math.cos(angle)*size;
      const y=Math.sin(angle)*size;
      if(i===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  }
}

function loop(){
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
