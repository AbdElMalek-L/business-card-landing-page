/* Shared board layout helper for background games */
(function(){
  function toNumber(value,fallback){
    const n=Number(value);
    return Number.isFinite(n)?n:fallback;
  }

  function isMobile(){
    return window.innerWidth<600;
  }

  function getBottomInset(extraHeight){
    const ticker=document.getElementById('ticker-bar');
    const tickerHeight=ticker?ticker.offsetHeight:38;
    // Positive values enlarge the available game area by reducing reserved bottom inset.
    return Math.max(0,tickerHeight-toNumber(extraHeight,0));
  }

  function getGameArea(extraHeight){
    const bottomInset=getBottomInset(extraHeight);
    const width=window.innerWidth;
    const height=Math.max(140,window.innerHeight-bottomInset);
    return {
      left:0,
      top:0,
      width,
      height,
      bottomInset,
    };
  }

  function getSharedBoardArea(){
    // Increase this value to make the board larger.
    return getGameArea(isMobile()?4:2);
  }

  function buildSharedBoardMetrics(){
    const area=getSharedBoardArea();
    const playScale=isMobile()?1.02:1.18;
    const usableWidth=Math.max(320,area.width);
    const usableHeight=Math.max(200,area.height);
    const targetCols=isMobile()?14:18;
    const targetRows=isMobile()?10:14;
    const baseCell=Math.max(18,Math.floor(Math.min(usableWidth/targetCols,usableHeight/targetRows)*playScale));
    const cols=Math.max(1,Math.floor(area.width/baseCell));
    const cell=area.width/cols;
    const rows=Math.max(1,Math.floor(area.height/cell));
    const boardHeight=rows*cell;
    return {
      CELL:cell,
      BS:cell,
      COLS:cols,
      ROWS:rows,
      OX:area.left,
      OY:area.top+Math.max(0,area.height-boardHeight),
      area,
    };
  }

  function getBoardmetrics(){
    return buildSharedBoardMetrics();
  }

  window.PlayBoardLayout={
    getBoardmetrics,
  };
})();
