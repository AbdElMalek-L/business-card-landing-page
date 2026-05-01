/* ─── GRID PULSE ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.gridpulse.hint;
let W,H,time=0;
let mx=W/2,my=H/2;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',resize);

const GRID_SIZE=40;
const COLS=Math.ceil(W/GRID_SIZE)+2;
const ROWS=Math.ceil(H/GRID_SIZE)+2;

document.addEventListener('mousemove',e=>{
  mx=e.clientX;
  my=e.clientY;
});

function render(){
  time+=0.05;
  ctx.fillStyle='#070706';
  ctx.fillRect(0,0,W,H);
  
  for(let c=0;c<COLS;c++){
    for(let r=0;r<ROWS;r++){
      const x=c*GRID_SIZE;
      const y=r*GRID_SIZE;
      const dx=x-mx;
      const dy=y-my;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const pulse=Math.sin(time-dist*0.01)*0.5+0.5;
      const alpha=Math.max(0,1-dist/400)*pulse;
      
      ctx.strokeStyle=`rgba(184,150,95,${alpha*0.6})`;
      ctx.lineWidth=1;
      ctx.strokeRect(x,y,GRID_SIZE,GRID_SIZE);
      
      ctx.fillStyle=`rgba(240,234,216,${alpha*0.3})`;
      const dot=GRID_SIZE*0.15*pulse;
      ctx.fillRect(x+GRID_SIZE/2-dot/2,y+GRID_SIZE/2-dot/2,dot,dot);
    }
  }
}

function loop(){
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
