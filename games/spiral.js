/* ─── SPIRAL / KALEIDOSCOPE ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.spiral.hint;
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
  
  for(let i=0;i<12;i++){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(i*Math.PI/6+time);
    
    const pattern=ctx.createLinearGradient(0,0,W,0);
    pattern.addColorStop(0,`hsla(${i*30+time*50},70%,50%,0.3)`);
    pattern.addColorStop(1,`hsla(${i*30+time*50+60},70%,50%,0.8)`);
    ctx.fillStyle=pattern;
    
    for(let j=0;j<5;j++){
      const x=Math.sin(time+j*0.5)*200;
      const y=Math.cos(time*0.7+j)*200;
      ctx.beginPath();
      ctx.arc(x,y,30+Math.sin(time+j)*20,0,Math.PI*2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

function loop(){
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
