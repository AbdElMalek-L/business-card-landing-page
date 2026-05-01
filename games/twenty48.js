/* ─── 2048 ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.twenty48.hint;
const gameOverPanel=document.getElementById('gameover');
const restartButton=document.getElementById('restart-btn');
let W,H,COLS=4,ROWS=4,CELL,OX,OY;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
  const metrics=window.PlayBoardLayout&&window.PlayBoardLayout.getBoardmetrics
    ? window.PlayBoardLayout.getBoardmetrics()
    : null;
  if(!metrics) return;
  CELL=Math.max(40,metrics.CELL*1.5);
  OX=(W-COLS*CELL)/2;
  OY=(H-ROWS*CELL)/2;
}
resize();
window.addEventListener('resize',()=>{resize();resetGame();});

let board=[];
let gameOver=false;
let score=0;

function initBoard(){
  board=Array(ROWS).fill(0).map(()=>Array(COLS).fill(0));
  addNewTile();
  addNewTile();
}

function addNewTile(){
  const empty=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r][c]===0) empty.push({r,c});
  if(empty.length>0){
    const {r,c}=empty[Math.floor(Math.random()*empty.length)];
    board[r][c]=Math.random()<0.9?2:4;
  }
}

function resetGame(){
  initBoard();
  gameOver=false;
  score=0;
  gameOverPanel.style.display='none';
}

function move(dr,dc){
  let moved=false;
  const newBoard=board.map(row=>[...row]);
  
  for(let i=0;i<2;i++){
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(newBoard[r][c]===0) continue;
        let nr=r,nc=c;
        while(nr+dr>=0&&nr+dr<ROWS&&nc+dc>=0&&nc+dc<COLS&&newBoard[nr+dr][nc+dc]===0){
          newBoard[nr+dr][nc+dc]=newBoard[nr][nc];
          newBoard[nr][nc]=0;
          nr+=dr;nc+=dc;
          moved=true;
        }
        if(nr+dr>=0&&nr+dr<ROWS&&nc+dc>=0&&nc+dc<COLS&&newBoard[nr+dr][nc+dc]===newBoard[nr][nc]){
          newBoard[nr+dr][nc+dc]*=2;
          score+=newBoard[nr+dr][nc+dc];
          newBoard[nr][nc]=0;
          moved=true;
        }
      }
    }
  }
  
  if(moved){
    board=newBoard;
    addNewTile();
  }
  
  let hasEmpty=false;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r][c]===0) hasEmpty=true;
  if(!hasEmpty){
    let canMove=false;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      if((r<ROWS-1&&board[r][c]===board[r+1][c])||(c<COLS-1&&board[r][c]===board[r][c+1])) canMove=true;
    }
    if(!canMove){
      gameOver=true;
      gameOverPanel.style.display='block';
    }
  }
}

function getColor(value){
  const colors={2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
  return colors[value]||'#3c3c2f';
}

function render(){
  ctx.fillStyle='#070706';
  ctx.fillRect(0,0,W,H);
  
  ctx.fillStyle='rgba(184,150,95,0.15)';
  ctx.fillRect(OX,OY,COLS*CELL,ROWS*CELL);
  
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const px=OX+c*CELL;
      const py=OY+r*CELL;
      ctx.fillStyle='rgba(100,100,100,0.3)';
      ctx.fillRect(px+2,py+2,CELL-4,CELL-4);
      
      if(board[r][c]>0){
        ctx.fillStyle=getColor(board[r][c]);
        ctx.fillRect(px+2,py+2,CELL-4,CELL-4);
        ctx.fillStyle='#000';
        ctx.font=`bold ${CELL*0.4}px Arial`;
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(board[r][c],px+CELL/2,py+CELL/2);
      }
    }
  }
  
  ctx.fillStyle='rgba(240,234,216,0.8)';
  ctx.font=`12px Arial`;
  ctx.textAlign='right';
  ctx.fillText(`Score: ${score}`,W-20,30);
}

function loop(){
  render();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft') {move(0,-1);event.preventDefault();}
  if(event.key==='ArrowRight') {move(0,1);event.preventDefault();}
  if(event.key==='ArrowUp') {move(-1,0);event.preventDefault();}
  if(event.key==='ArrowDown') {move(1,0);event.preventDefault();}
  if(event.key==='r'||event.key==='R') resetGame();
});

restartButton.addEventListener('click',resetGame);

resetGame();
requestAnimationFrame(loop);
