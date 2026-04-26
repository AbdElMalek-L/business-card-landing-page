/* ─── TETRIS ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.tetris.hint;
let W,H,COLS=12,ROWS,BS,OX,OY;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
  const metrics=window.PlayBoardLayout&&window.PlayBoardLayout.getBoardmetrics
    ? window.PlayBoardLayout.getBoardmetrics()
    : null;
  if(!metrics) return;
  COLS=metrics.COLS;
  BS=metrics.CELL;
  ROWS=metrics.ROWS;
  OX=metrics.OX;
  OY=metrics.OY;
}
resize();window.addEventListener('resize',()=>{resize();initBoard()});

/* piece definitions */
const SHAPES={
  I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O:[[1,1],[1,1]],
  T:[[0,1,0],[1,1,1],[0,0,0]],
  S:[[0,1,1],[1,1,0],[0,0,0]],
  Z:[[1,1,0],[0,1,1],[0,0,0]],
  J:[[1,0,0],[1,1,1],[0,0,0]],
  L:[[0,0,1],[1,1,1],[0,0,0]],
};
const PIECE_KEYS=Object.keys(SHAPES);

/* classic tetromino palette per piece */
const COLORS={
  I:{fill:'rgba(0,188,212,', stroke:'rgba(129,236,255,'},
  O:{fill:'rgba(255,214,10,',stroke:'rgba(255,243,153,'},
  T:{fill:'rgba(156,39,176,',stroke:'rgba(218,112,255,'},
  S:{fill:'rgba(76,175,80,', stroke:'rgba(164,255,166,'},
  Z:{fill:'rgba(244,67,54,', stroke:'rgba(255,152,145,'},
  J:{fill:'rgba(33,150,243,',stroke:'rgba(128,205,255,'},
  L:{fill:'rgba(255,152,0,', stroke:'rgba(255,204,128,'},
};

/* board */
let board,score,level,lines,paused,gameOver,current,next,dropTimer,dropInterval,lockTimer,lockDelay,isLocking;

function initBoard(){
  board=Array.from({length:ROWS},()=>new Array(COLS).fill(null));
  score=0;level=1;lines=0;paused=false;gameOver=false;
  dropTimer=0;dropInterval=48;lockTimer=0;lockDelay=30;isLocking=false;
  document.getElementById('gameover').style.display='none';
  updateHUD();
  next=randomPiece();
  spawnPiece();
}

function randomPiece(){
  const k=PIECE_KEYS[Math.floor(Math.random()*PIECE_KEYS.length)];
  return{type:k,shape:SHAPES[k].map(r=>[...r]),x:Math.floor(COLS/2)-2,y:0};
}

function spawnPiece(){
  current=next;
  current.x=Math.floor(COLS/2)-Math.floor(current.shape[0].length/2);
  current.y=0;
  next=randomPiece();
  if(collides(current.shape,current.x,current.y)){
    gameOver=true;
    document.getElementById('gameover').style.display='block';
  }
}

function collides(shape,px,py){
  for(let r=0;r<shape.length;r++)
    for(let c=0;c<shape[r].length;c++)
      if(shape[r][c]){
        const nx=px+c,ny=py+r;
        if(nx<0||nx>=COLS||ny>=ROWS) return true;
        if(ny>=0&&board[ny][nx]) return true;
      }
  return false;
}

function rotateCW(shape){
  const rows=shape.length,cols=shape[0].length;
  const out=Array.from({length:cols},()=>new Array(rows).fill(0));
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) out[c][rows-1-r]=shape[r][c];
  return out;
}

function tryRotate(){
  const rotated=rotateCW(current.shape);
  const kicks=[0,-1,1,-2,2];
  for(const k of kicks){
    if(!collides(rotated,current.x+k,current.y)){
      current.shape=rotated;current.x+=k;
      isLocking=false;lockTimer=0;
      return;
    }
  }
}

function lockPiece(){
  current.shape.forEach((row,r)=>row.forEach((v,c)=>{
    if(v&&current.y+r>=0) board[current.y+r][current.x+c]=current.type;
  }));
  clearLines();
  spawnPiece();
  isLocking=false;lockTimer=0;
}

function clearLines(){
  let cleared=0;
  for(let r=ROWS-1;r>=0;r--){
    if(board[r].every(c=>c)){
      board.splice(r,1);
      board.unshift(new Array(COLS).fill(null));
      cleared++;r++;
    }
  }
  if(cleared){
    const pts=[0,100,300,500,800];
    score+=pts[cleared]*level;
    lines+=cleared;
    level=Math.floor(lines/10)+1;
    dropInterval=Math.max(6,48-level*4);
    updateHUD();
  }
}

function updateHUD(){
  // HUD removed from the layout.
}

function ghostY(){
  let gy=current.y;
  while(!collides(current.shape,current.x,gy+1)) gy++;
  return gy;
}

function hardDrop(){
  current.y=ghostY();
  lockPiece();
}

/* input */
const keys={};
document.addEventListener('keydown',e=>{
  if(gameOver){if(e.key==='r'||e.key==='R'){initBoard();}return;}
  if(e.key==='p'||e.key==='P'){paused=!paused;return;}
  if(paused)return;
  switch(e.key){
    case'ArrowLeft': if(!collides(current.shape,current.x-1,current.y)){current.x--;isLocking=false;lockTimer=0;} break;
    case'ArrowRight':if(!collides(current.shape,current.x+1,current.y)){current.x++;isLocking=false;lockTimer=0;} break;
    case'ArrowUp':case'z':case'Z': tryRotate(); break;
    case'ArrowDown': if(!collides(current.shape,current.x,current.y+1)){current.y++;score+=1;updateHUD();} break;
    case' ': e.preventDefault();hardDrop(); break;
  }
});

document.getElementById('restart-btn').addEventListener('click',()=>initBoard());

/* swipe */
let sx=0,sy=0;
document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
document.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-sx;
  const dy=e.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>Math.abs(dy)){
    if(dx<-30&&!collides(current.shape,current.x-1,current.y))current.x--;
    if(dx>30&&!collides(current.shape,current.x+1,current.y))current.x++;
  }else{
    if(dy>30&&!collides(current.shape,current.x,current.y+1))current.y++;
    if(dy<-30)tryRotate();
  }
},{passive:true});

/* ─── RENDER ─── */
function drawBlock(x,y,type,alpha){
  if(!type)return;
  const c=COLORS[type];
  const px=OX+x*BS, py=OY+y*BS;
  // main fill
  ctx.fillStyle=c.fill+alpha+')';
  ctx.fillRect(px+1,py+1,BS-2,BS-2);
  // highlight edge
  ctx.fillStyle=c.stroke+(alpha*.6)+')';
  ctx.fillRect(px+1,py+1,BS-2,3);
  ctx.fillRect(px+1,py+1,3,BS-2);
  // shadow edge
  ctx.fillStyle='rgba(0,0,0,'+(alpha*.4)+')';
  ctx.fillRect(px+1,py+BS-4,BS-2,3);
  ctx.fillRect(px+BS-4,py+1,3,BS-2);
  // inner glow
  ctx.strokeStyle=c.stroke+(alpha*.35)+')';
  ctx.lineWidth=0.5;
  ctx.strokeRect(px+3,py+3,BS-6,BS-6);
}

function drawGhost(){
  const gy=ghostY();
  if(gy===current.y)return;
  current.shape.forEach((row,r)=>row.forEach((v,c)=>{
    if(v) drawBlock(current.x+c,gy+r,current.type,0.12);
  }));
}

function drawGrid(){
  ctx.strokeStyle='rgba(184,150,95,0.04)';
  ctx.lineWidth=0.5;
  const topY=Math.max(0,OY);
  const bottomY=Math.min(H,OY+ROWS*BS);
  for(let c=0;c<=COLS;c++){
    ctx.beginPath();ctx.moveTo(OX+c*BS,topY);ctx.lineTo(OX+c*BS,bottomY);ctx.stroke();
  }
  for(let r=0;r<=ROWS;r++){
    const y=OY+r*BS;
    if(y<0||y>H) continue;
    ctx.beginPath();ctx.moveTo(OX,y);ctx.lineTo(OX+COLS*BS,y);ctx.stroke();
  }
}

let frame=0;
function gameLoop(){
  frame++;
  ctx.fillStyle='#070706';ctx.fillRect(0,0,W,H);
  drawGrid();

  if(!gameOver&&!paused){
    // gravity
    dropTimer++;
    if(dropTimer>=dropInterval){
      dropTimer=0;
      if(!collides(current.shape,current.x,current.y+1)){
        current.y++;isLocking=false;lockTimer=0;
      }else{
        isLocking=true;
      }
    }
    // lock delay
    if(isLocking){
      lockTimer++;
      if(lockTimer>=lockDelay) lockPiece();
    }
  }

  // draw board
  board.forEach((row,r)=>row.forEach((type,c)=>{
    if(type) drawBlock(c,r,type,0.75);
  }));

  // ghost
  if(!gameOver&&!paused) drawGhost();

  // current piece
  if(!gameOver&&current){
    current.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if(v) drawBlock(current.x+c,current.y+r,current.type,0.9);
    }));
  }

  // lock flash
  if(isLocking&&lockTimer>lockDelay-10){
    const flash=(lockTimer%4)<2?0.15:0;
    current.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if(v){
        const px=OX+(current.x+c)*BS,py=OY+(current.y+r)*BS;
        ctx.fillStyle='rgba(240,200,140,'+flash+')';
        ctx.fillRect(px,py,BS,BS);
      }
    }));
  }

  requestAnimationFrame(gameLoop);
}

initBoard();
gameLoop();
