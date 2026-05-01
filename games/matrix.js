/* ─── MATRIX RAIN ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.matrix.hint;
let W,H;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',resize);

const FONT_SIZE=16;
const CHARS='アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789@#$%^&*';
const COLS=Math.floor(W/FONT_SIZE);
const TRAILS=[];

for(let i=0;i<COLS;i++){
  TRAILS.push({
    y:Math.random()*H,
    speed:Math.random()*2+1,
    char:()=>CHARS[Math.floor(Math.random()*CHARS.length)],
    trail:[]
  });
}

function update(){
  TRAILS.forEach((t,i)=>{
    t.y+=t.speed;
    if(t.y>H) t.y=-FONT_SIZE;
    t.trail.push({char:t.char(),y:t.y});
    if(t.trail.length>20) t.trail.shift();
  });
}

function render(){
  ctx.fillStyle='rgba(7,6,6,0.1)';
  ctx.fillRect(0,0,W,H);
  
  TRAILS.forEach((t,i)=>{
    t.trail.forEach((item,j)=>{
      const alpha=(j/t.trail.length)*0.8;
      ctx.fillStyle=`rgba(0,255,100,${alpha})`;
      ctx.font=`${FONT_SIZE}px monospace`;
      ctx.fillText(item.char,i*FONT_SIZE,item.y);
    });
    ctx.fillStyle='rgba(0,255,150,1)';
    ctx.font=`bold ${FONT_SIZE}px monospace`;
    ctx.fillText(t.char(),i*FONT_SIZE,t.y);
  });
}

function loop(){
  update();
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
