/* ─── SNAKE ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.snake.hint;
const gameOverPanel=document.getElementById('gameover');
const restartButton=document.getElementById('restart-btn');
let W,H,COLS=20,ROWS=20,CELL,OX,OY;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
  const metrics=window.PlayBoardLayout&&window.PlayBoardLayout.getBoardmetrics
    ? window.PlayBoardLayout.getBoardmetrics()
    : null;
  if(!metrics) return;
  CELL=metrics.CELL;
  COLS=metrics.COLS;
  ROWS=metrics.ROWS;
  OX=metrics.OX;
  OY=metrics.OY;
}
resize();
window.addEventListener('resize',()=>{resize();resetGame();});

const DIRECTIONS={
  up:{x:0,y:-1},
  down:{x:0,y:1},
  left:{x:-1,y:0},
  right:{x:1,y:0},
};
const KEY_MAP={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',W:'up',s:'down',S:'down',a:'left',A:'left',d:'right',D:'right'};

let snake=[];
let direction=DIRECTIONS.right;
let queuedDirection=DIRECTIONS.right;
let food={x:0,y:0};
let score=0;
let apples=0;
let paused=false;
let gameOver=false;
let accumulator=0;
let lastTime=0;
let stepMs=240;
let headPulse=0;

function updateHUD(){
  // HUD removed from the layout.
}

function randomCell(){
  return {x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};
}

function spawnFood(){
  let candidate=randomCell();
  while(snake.some(segment=>segment.x===candidate.x&&segment.y===candidate.y)){
    candidate=randomCell();
  }
  food=candidate;
}

function resetGame(){
  snake=[
    {x:Math.floor(COLS/2),y:Math.floor(ROWS/2)},
    {x:Math.floor(COLS/2)-1,y:Math.floor(ROWS/2)},
    {x:Math.floor(COLS/2)-2,y:Math.floor(ROWS/2)},
  ];
  direction=DIRECTIONS.right;
  queuedDirection=DIRECTIONS.right;
  score=0;
  apples=0;
  paused=false;
  gameOver=false;
  accumulator=0;
  lastTime=performance.now();
  stepMs=240;
  headPulse=0;
  spawnFood();
  gameOverPanel.style.display='none';
  updateHUD();
}

function canTurn(nextDirection){
  return !(nextDirection.x===-direction.x && nextDirection.y===-direction.y);
}

function setDirection(nextDirection){
  if(canTurn(nextDirection)) queuedDirection=nextDirection;
}

function step(){
  direction=queuedDirection;
  const head=snake[0];
  const nextHead={
    x:(head.x+direction.x+COLS)%COLS,
    y:(head.y+direction.y+ROWS)%ROWS,
  };
  if(snake.some(segment=>segment.x===nextHead.x&&segment.y===nextHead.y)){
    gameOver=true;
    gameOverPanel.style.display='block';
    return;
  }

  snake.unshift(nextHead);
  if(nextHead.x===food.x&&nextHead.y===food.y){
    apples++;
    score+=10+Math.max(0,Math.floor(apples/3));
    stepMs=Math.max(130,240-apples*2);
    spawnFood();
  }else{
    snake.pop();
  }
  updateHUD();
}

function drawCell(x,y,fill,glow,alpha=1){
  const px=OX+x*CELL;
  const py=OY+y*CELL;
  ctx.fillStyle=fill;
  ctx.globalAlpha=alpha;
  ctx.fillRect(px+1,py+1,CELL-2,CELL-2);
  ctx.fillStyle=glow;
  ctx.globalAlpha=alpha*0.6;
  ctx.fillRect(px+1,py+1,CELL-2,3);
  ctx.fillRect(px+1,py+1,3,CELL-2);
  ctx.globalAlpha=alpha*0.4;
  ctx.fillRect(px+1,py+CELL-4,CELL-2,3);
  ctx.fillRect(px+CELL-4,py+1,3,CELL-2);
  ctx.strokeStyle=glow;
  ctx.globalAlpha=alpha*0.35;
  ctx.lineWidth=0.5;
  ctx.strokeRect(px+3,py+3,CELL-6,CELL-6);
  ctx.globalAlpha=1;
}

function drawGrid(){
  ctx.strokeStyle='rgba(184,150,95,0.03)';
  ctx.lineWidth=0.5;
  for(let c=0;c<=COLS;c++){
    ctx.beginPath();
    ctx.moveTo(OX+c*CELL,OY);
    ctx.lineTo(OX+c*CELL,OY+ROWS*CELL);
    ctx.stroke();
  }
  for(let r=0;r<=ROWS;r++){
    ctx.beginPath();
    ctx.moveTo(OX,OY+r*CELL);
    ctx.lineTo(OX+COLS*CELL,OY+r*CELL);
    ctx.stroke();
  }
}

function drawFood(){
  const pulse=0.7+Math.sin(headPulse*0.18)*0.15;
  drawCell(food.x,food.y,'rgba(224,82,82,0.88)','rgba(255,179,140,1)',pulse);
}

function drawSnake(){
  snake.forEach((segment,index)=>{
    const alpha=index===0?1:Math.max(0.4,1-index*0.08);
    const fill=index===0?'rgba(184,150,95,0.95)':'rgba(240,234,216,0.82)';
    const glow=index===0?'rgba(255,220,160,1)':'rgba(212,170,112,0.9)';
    drawCell(segment.x,segment.y,fill,glow,alpha);
  });

  const head=snake[0];
  const eyeSize=Math.max(2,Math.floor(CELL/10));
  const offset=Math.max(3,Math.floor(CELL/4));
  ctx.fillStyle='rgba(7,6,6,0.9)';
  if(direction.x===1){
    ctx.fillRect(OX+head.x*CELL+CELL-offset-eyeSize,OY+head.y*CELL+offset,eyeSize,eyeSize);
    ctx.fillRect(OX+head.x*CELL+CELL-offset-eyeSize,OY+head.y*CELL+CELL-offset-eyeSize*2,eyeSize,eyeSize);
  }else if(direction.x===-1){
    ctx.fillRect(OX+head.x*CELL+offset,OY+head.y*CELL+offset,eyeSize,eyeSize);
    ctx.fillRect(OX+head.x*CELL+offset,OY+head.y*CELL+CELL-offset-eyeSize*2,eyeSize,eyeSize);
  }else if(direction.y===1){
    ctx.fillRect(OX+head.x*CELL+offset,OY+head.y*CELL+CELL-offset-eyeSize,eyeSize,eyeSize);
    ctx.fillRect(OX+head.x*CELL+CELL-offset-eyeSize*2,OY+head.y*CELL+CELL-offset-eyeSize,eyeSize,eyeSize);
  }else{
    ctx.fillRect(OX+head.x*CELL+offset,OY+head.y*CELL+offset,eyeSize,eyeSize);
    ctx.fillRect(OX+head.x*CELL+CELL-offset-eyeSize*2,OY+head.y*CELL+offset,eyeSize,eyeSize);
  }
}

function render(){
  ctx.fillStyle='#070706';
  ctx.fillRect(0,0,W,H);
  drawGrid();
  drawFood();
  drawSnake();

  if(paused&&!gameOver){
    ctx.fillStyle='rgba(7,6,5,0.45)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(240,234,216,0.88)';
    ctx.font=`${Math.max(18,Math.floor(CELL*0.9))}px Geist Mono, monospace`;
    ctx.textAlign='center';
    ctx.fillText(GAME_STRINGS?GAME_STRINGS.snake.paused:'Paused',W/2,H/2);
  }
}

function loop(now){
  if(!lastTime) lastTime=now;
  const dt=now-lastTime;
  lastTime=now;
  if(!paused&&!gameOver){
    accumulator+=dt;
    while(accumulator>=stepMs){
      accumulator-=stepMs;
      step();
      if(gameOver) break;
    }
  }
  headPulse++;
  render();
  requestAnimationFrame(loop);
}

function restart(){
  resetGame();
}

document.addEventListener('keydown',event=>{
  if(event.key==='p'||event.key==='P'){
    paused=!paused;
    return;
  }
  if(event.key==='r'||event.key==='R'){
    restart();
    return;
  }
  const mapped=KEY_MAP[event.key];
  if(mapped){
    setDirection(DIRECTIONS[mapped]);
    event.preventDefault();
  }
});

restartButton.addEventListener('click',restart);

let sx=0,sy=0;
document.addEventListener('touchstart',event=>{
  sx=event.touches[0].clientX;
  sy=event.touches[0].clientY;
},{passive:true});
document.addEventListener('touchend',event=>{
  const dx=event.changedTouches[0].clientX-sx;
  const dy=event.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>Math.abs(dy)){
    if(dx>24) setDirection(DIRECTIONS.right);
    if(dx<-24) setDirection(DIRECTIONS.left);
  }else{
    if(dy>24) setDirection(DIRECTIONS.down);
    if(dy<-24) setDirection(DIRECTIONS.up);
  }
},{passive:true});

resetGame();
requestAnimationFrame(loop);
