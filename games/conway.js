/* ─── CONWAY'S GAME OF LIFE ─── */
const canvas=document.getElementById('tc');
const ctx=canvas.getContext('2d');
const GAME_STRINGS=window.AppStrings;
const gameHint=document.getElementById('game-hint');
if(gameHint&&GAME_STRINGS) gameHint.textContent=GAME_STRINGS.conway.hint;
let W,H,CELL_SIZE=8;

function resize(){
  W=canvas.width=innerWidth;
  H=canvas.height=innerHeight;
}
resize();
window.addEventListener('resize',()=>{resize();initLife();});

const COLS=Math.floor(W/CELL_SIZE);
const ROWS=Math.floor(H/CELL_SIZE);
let grid=[];
let nextGrid=[];

function initLife(){
  grid=Array(ROWS).fill(0).map(()=>Array(COLS).fill(0).map(()=>Math.random()<0.3?1:0));
  nextGrid=grid.map(row=>[...row]);
}

function step(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      let neighbors=0;
      for(let dr=-1;dr<=1;dr++){
        for(let dc=-1;dc<=1;dc++){
          if(dr===0&&dc===0) continue;
          const nr=(r+dr+ROWS)%ROWS;
          const nc=(c+dc+COLS)%COLS;
          neighbors+=grid[nr][nc];
        }
      }
      nextGrid[r][c]=(grid[r][c]===1&&(neighbors===2||neighbors===3))||(grid[r][c]===0&&neighbors===3)?1:0;
    }
  }
  [grid,nextGrid]=[nextGrid,grid];
}

function render(){
  ctx.fillStyle='#070706';
  ctx.fillRect(0,0,W,H);
  
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(grid[r][c]===1){
        ctx.fillStyle=`hsla(${(r+c)*2%360},70%,50%,0.9)`;
        ctx.fillRect(c*CELL_SIZE,r*CELL_SIZE,CELL_SIZE-1,CELL_SIZE-1);
      }
    }
  }
}

function loop(){
  step();
  render();
  requestAnimationFrame(loop);
}

initLife();
requestAnimationFrame(loop);
