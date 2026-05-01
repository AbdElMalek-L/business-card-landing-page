/* ─── BREAKOUT: CLASSIC ATARI EDITION ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.breakout.hint;
const gameOverPanel=document.getElementById('gameover');
const restartButton=document.getElementById('restart-btn');
let W,H;

const PADDLE_WIDTH=80;
const PADDLE_HEIGHT=8;
const BALL_RADIUS=4;
const BRICK_ROWS=8;
const BRICK_COLS=13;
const BRICK_HEIGHT=10;
const BRICK_PADDING=2;
const BASE_SPEED=5;

let BRICK_WIDTH;
let paddle={x:0,y:0,width:PADDLE_WIDTH};
let ball={x:0,y:0,vx:0,vy:0,stuck:true};
let bricks=[];
let gameOver=false;
let score=0;
let lives=3;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
  BRICK_WIDTH=(W-BRICK_PADDING*(BRICK_COLS-1))/BRICK_COLS;
}
resize();
window.addEventListener('resize',()=>{resize();resetGame();});

function createBricks(){
  bricks=[];
  for(let r=0;r<BRICK_ROWS;r++){
    for(let c=0;c<BRICK_COLS;c++){
      bricks.push({
        x:c*(BRICK_WIDTH+BRICK_PADDING),
        y:r*(BRICK_HEIGHT+BRICK_PADDING)+40,
        width:BRICK_WIDTH,
        height:BRICK_HEIGHT,
        exists:true
      });
    }
  }
}

function resetGame(){
  createBricks();
  paddle.x=W/2-PADDLE_WIDTH/2;
  paddle.y=H-20;
  ball.x=paddle.x+PADDLE_WIDTH/2;
  ball.y=paddle.y-BALL_RADIUS*2;
  ball.vx=0;
  ball.vy=0;
  ball.stuck=true;
  score=0;
  lives=3;
  gameOver=false;
  gameOverPanel.style.display='none';
}

function update(){
  if(gameOver) return;
  
  // Ball stuck to paddle
  if(ball.stuck){
    ball.x=paddle.x+PADDLE_WIDTH/2;
    ball.y=paddle.y-BALL_RADIUS*2;
    return;
  }
  
  // Move ball
  ball.x+=ball.vx;
  ball.y+=ball.vy;
  
  // Wall collision (left/right)
  if(ball.x-BALL_RADIUS<=0||ball.x+BALL_RADIUS>=W) ball.vx=-ball.vx;
  
  // Top collision
  if(ball.y-BALL_RADIUS<=0) ball.vy=-ball.vy;
  
  // Bottom - lose life
  if(ball.y+BALL_RADIUS>H){
    lives--;
    if(lives<=0){
      gameOver=true;
      gameOverPanel.style.display='block';
    }else{
      ball.stuck=true;
      ball.vx=0;
      ball.vy=0;
    }
    return;
  }
  
  // Paddle collision
  if(ball.vx>0?ball.x+BALL_RADIUS>paddle.x&&ball.x-BALL_RADIUS<paddle.x+PADDLE_WIDTH&&ball.y+BALL_RADIUS>paddle.y&&ball.y-BALL_RADIUS<paddle.y+PADDLE_HEIGHT:false){
    if(ball.vy>0){
      const hitPos=(ball.x-paddle.x)/PADDLE_WIDTH;
      ball.vy=-BASE_SPEED;
      ball.vx=(hitPos-0.5)*BASE_SPEED*3;
      ball.y=paddle.y-BALL_RADIUS;
    }
  }
  
  // Brick collisions
  for(let i=0;i<bricks.length;i++){
    const b=bricks[i];
    if(!b.exists) continue;
    
    if(ball.x+BALL_RADIUS>b.x&&ball.x-BALL_RADIUS<b.x+b.width&&ball.y+BALL_RADIUS>b.y&&ball.y-BALL_RADIUS<b.y+b.height){
      b.exists=false;
      score+=100;
      
      const overlapLeft=ball.x+BALL_RADIUS-b.x;
      const overlapRight=b.x+b.width-(ball.x-BALL_RADIUS);
      const overlapTop=ball.y+BALL_RADIUS-b.y;
      const overlapBottom=b.y+b.height-(ball.y-BALL_RADIUS);
      
      const minOverlap=Math.min(overlapLeft,overlapRight,overlapTop,overlapBottom);
      
      if(minOverlap===overlapTop||minOverlap===overlapBottom){
        ball.vy=-ball.vy;
      }else{
        ball.vx=-ball.vx;
      }
      break;
    }
  }
  
  // Check win condition
  if(bricks.every(b=>!b.exists)){
    gameOver=true;
    gameOverPanel.style.display='block';
  }
}

function render(){
  // Classic black background
  ctx.fillStyle='#000000';
  ctx.fillRect(0,0,W,H);
  
  // Draw bricks - simple colored rows (Atari style)
  const colors=['#ff0000','#ff7700','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffffff'];
  for(let b of bricks){
    if(b.exists){
      const colorIdx=Math.floor(b.y/40)%colors.length;
      ctx.fillStyle=colors[colorIdx];
      ctx.fillRect(b.x,b.y,b.width,b.height);
    }
  }
  
  // Draw paddle - simple line
  ctx.fillStyle='#00ff00';
  ctx.fillRect(paddle.x,paddle.y,PADDLE_WIDTH,PADDLE_HEIGHT);
  
  // Draw ball - simple square
  ctx.fillStyle='#ffff00';
  ctx.fillRect(ball.x-BALL_RADIUS,ball.y-BALL_RADIUS,BALL_RADIUS*2,BALL_RADIUS*2);
  
  // Draw UI
  ctx.fillStyle='#ffffff';
  ctx.font='bold 14px Arial';
  ctx.textAlign='left';
  ctx.fillText(`SCORE: ${score}`,10,20);
  ctx.textAlign='right';
  ctx.fillText(`LIVES: ${lives}`,W-10,20);
  
  // Launch hint
  if(ball.stuck&&!gameOver){
    ctx.textAlign='center';
    ctx.font='14px Arial';
    ctx.fillStyle='#00ffff';
    ctx.fillText('PRESS SPACE OR CLICK TO LAUNCH',W/2,H/2);
  }
}

function loop(){
  update();
  render();
  requestAnimationFrame(loop);
}

let mouseX=W/2;
document.addEventListener('mousemove',e=>{
  mouseX=e.clientX;
  paddle.x=mouseX-PADDLE_WIDTH/2;
  paddle.x=Math.max(0,Math.min(W-PADDLE_WIDTH,paddle.x));
});

document.addEventListener('click',()=>{
  if(ball.stuck){
    ball.stuck=false;
    ball.vx=(Math.random()-0.5)*BASE_SPEED*2;
    ball.vy=-BASE_SPEED;
  }
});

document.addEventListener('touchmove',e=>{
  paddle.x=e.touches[0].clientX-PADDLE_WIDTH/2;
  paddle.x=Math.max(0,Math.min(W-PADDLE_WIDTH,paddle.x));
  e.preventDefault();
},{passive:false});

document.addEventListener('touchstart',()=>{
  if(ball.stuck){
    ball.stuck=false;
    ball.vx=(Math.random()-0.5)*BASE_SPEED*2;
    ball.vy=-BASE_SPEED;
  }
});

restartButton.addEventListener('click',resetGame);

document.addEventListener('keydown',e=>{
  if(e.key==='r'||e.key==='R') resetGame();
  if(e.key===' '&&ball.stuck){
    e.preventDefault();
    ball.stuck=false;
    ball.vx=(Math.random()-0.5)*BASE_SPEED*2;
    ball.vy=-BASE_SPEED;
  }
});

resetGame();
requestAnimationFrame(loop);
