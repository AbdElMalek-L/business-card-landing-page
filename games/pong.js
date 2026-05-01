/* ─── PONG ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.pong.hint;
let W,H;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',resize);

const PADDLE_HEIGHT=130;
const PADDLE_WIDTH=12;
const BALL_SIZE=8;
const AI_SPEED=5.8;
const AI_DEAD_ZONE=6;
const BALL_SPEED=4.2;

let ball={x:W/2,y:H/2,vx:5,vy:5};
let p1={y:H/2-PADDLE_HEIGHT/2,score:0};
let p2={y:H/2-PADDLE_HEIGHT/2,score:0};
let p1Input=0,p2Input=0;

function reset(){
  ball={x:W/2,y:H/2,vx:(Math.random()>0.5?1:-1)*BALL_SPEED,vy:(Math.random()>0.5?1:-1)*BALL_SPEED};
}

function updateBot(){
  const p2Center=p2.y+PADDLE_HEIGHT/2;
  let targetY=H/2;

  if(ball.vx>0){
    const targetX=W-PADDLE_WIDTH-BALL_SIZE/2;
    const timeToReach=(targetX-ball.x)/ball.vx;
    let predictedY=ball.y+ball.vy*timeToReach;
    const bounceRange=H-BALL_SIZE;
    while(predictedY<0||predictedY>bounceRange){
      if(predictedY<0) predictedY=-predictedY;
      if(predictedY>bounceRange) predictedY=2*bounceRange-predictedY;
    }
    targetY=predictedY;
  }

  const delta=targetY-p2Center;
  if(Math.abs(delta)<=AI_DEAD_ZONE){
    p2Input=0;
  }else{
    p2Input=delta>0?1:-1;
  }
}

function update(){
  updateBot();
  p1.y+=p1Input*6;
  p2.y+=p2Input*AI_SPEED;
  p1.y=Math.max(0,Math.min(H-PADDLE_HEIGHT,p1.y));
  p2.y=Math.max(0,Math.min(H-PADDLE_HEIGHT,p2.y));
  
  ball.x+=ball.vx;
  ball.y+=ball.vy;
  
  if(ball.y-BALL_SIZE/2<0||ball.y+BALL_SIZE/2>H) ball.vy=-ball.vy;
  
  if(ball.x-BALL_SIZE/2<PADDLE_WIDTH&&ball.y>p1.y&&ball.y<p1.y+PADDLE_HEIGHT){
    ball.vx=-ball.vx;
    ball.x=PADDLE_WIDTH+BALL_SIZE/2;
  }
  if(ball.x+BALL_SIZE/2>W-PADDLE_WIDTH&&ball.y>p2.y&&ball.y<p2.y+PADDLE_HEIGHT){
    ball.vx=-ball.vx;
    ball.x=W-PADDLE_WIDTH-BALL_SIZE/2;
  }
  
  if(ball.x<0) {p2.score++;reset();}
  if(ball.x>W) {p1.score++;reset();}
}

function render(){
  ctx.fillStyle='#070706';
  ctx.fillRect(0,0,W,H);
  
  ctx.strokeStyle='rgba(184,150,95,0.2)';
  ctx.setLineDash([10,10]);
  ctx.beginPath();
  ctx.moveTo(W/2,0);
  ctx.lineTo(W/2,H);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.fillStyle='rgba(184,150,95,0.9)';
  ctx.fillRect(0,p1.y,PADDLE_WIDTH,PADDLE_HEIGHT);
  ctx.fillRect(W-PADDLE_WIDTH,p2.y,PADDLE_WIDTH,PADDLE_HEIGHT);
  
  ctx.fillStyle='rgba(240,234,216,0.9)';
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,BALL_SIZE/2,0,Math.PI*2);
  ctx.fill();
  
  ctx.fillStyle='rgba(240,234,216,0.7)';
  ctx.font='20px Arial';
  ctx.textAlign='center';
  ctx.fillText(p1.score,W/4,40);
  ctx.fillText(p2.score,3*W/4,40);
}

function loop(){
  update();
  render();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown',e=>{
  if(e.key==='w'||e.key==='W'||e.key==='ArrowUp') p1Input=-1;
  if(e.key==='s'||e.key==='S'||e.key==='ArrowDown') p1Input=1;
});
document.addEventListener('keyup',e=>{
  if(e.key==='w'||e.key==='W'||e.key==='ArrowUp'||e.key==='s'||e.key==='S'||e.key==='ArrowDown') p1Input=0;
});

document.addEventListener('touchmove',e=>{
  const touch=e.touches[0];
  const y=touch.clientY;
  p1.y=Math.max(0,Math.min(H-PADDLE_HEIGHT,y-PADDLE_HEIGHT/2));
  e.preventDefault();
},{passive:false});

requestAnimationFrame(loop);
