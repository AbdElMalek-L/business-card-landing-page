(function(){
  const AppStrings={
    pageTitle:'AbdElMalek-L',
card:{
  monogram:'AL',
  role:'AI & Robotics Engineer',
  domain:'abdelmalek.engineer',

  firstName:'Abdelmalek',
  lastName:'Lamkadem',

  tagline:'Designing intelligent systems & AI-driven solutions —<br>turning data into autonomous action.',

  status:'Available for AI projects',

  contactEmail:'abdelmalek.lamkadem.23@ump.ac.ma',

  githubLabel:'GitHub',
  githubUrl:'https://github.com/AbdElMalek-L',

  linkedinLabel:'LinkedIn',
  linkedinUrl:'https://linkedin.com/in/AbdElMalek-L',

  separator:'/'
},
    hud:{
      levelLabel:'Level',
      linesLabel:'Lines'
    },
    gameOver:{
      title:'Game Over',
      restartButton:'Restart [ R ]'
    },
    hint:{
      loading:'Loading background game...',
      backgroundPrefix:'Background game:',
      separator:' - '
    },
    ticker:{
      category:'AI & Tech',
      loading:'Fetching headlines...',
      wrapStyle:'display:inline-flex;align-items:center;'
    },
    stamp:'abdelmalek.engineer',
    games:[
      {name:'tetris',src:'games/tetris.js',hint:'Arrow keys move and rotate, space hard drops, P pauses'},
      {name:'snake',src:'games/snake.js',hint:'Arrow keys or WASD steer, P pauses, R restarts'},
      {name:'2048',src:'games/twenty48.js',hint:'Arrow keys merge tiles, R restarts'},
      {name:'pong',src:'games/pong.js',hint:'W/S or arrow keys move the left paddle, the right paddle is AI-controlled'},
      {name:'breakout',src:'games/breakout.js',hint:'Move mouse to paddle, break the bricks'},
      {name:'matrix',src:'games/matrix.js',hint:'Enjoy the Matrix rain effect'},
      {name:'fireworks',src:'games/fireworks.js',hint:'Click anywhere for fireworks, watch the display'},
      {name:'spiral',src:'games/spiral.js',hint:'Mesmerizing kaleidoscope patterns'},
      {name:'gridpulse',src:'games/gridpulse.js',hint:'Move your mouse to create pulse effects'},
      {name:'particles',src:'games/particles.js',hint:'Watch dancing connected particles'},
      {name:'conway',src:'games/conway.js',hint:'Conway\'s Game of Life unfolding'},
      {name:'geometry',src:'games/geometry.js',hint:'Rotating geometric shapes'},
      {name:'trails',src:'games/trails.js',hint:'Move mouse to create colorful trails'}
    ],
    news:{
      topStoriesUrl: 'https://hacker-news.firebaseio.com/v0/topstories.json',
      itemUrlPrefix: 'https://hacker-news.firebaseio.com/v0/item/',
  
      itemUrlSuffix: '.json',
      fallbackStoryUrlPrefix: 'https://news.ycombinator.com/item?id=',
      keywords:['ai','gpt','llm','model','openai','anthropic','google','microsoft','apple','nvidia','chip','gpu','quantum','robot','code','software','hardware','cloud','security','cyber','hack','data','python','linux','github','startup','tech','machine learning','neural','transformer','agi','gemini','claude','meta','samsung','intel','amd','arm','risc','memory','semiconductor']
    },
    snake:{
      hint:'Arrow keys or WASD steer, P pauses, R restarts',
      paused:'Paused'
    },
    tetris:{
      hint:'Arrow keys move and rotate, space hard drops, P pauses'
    },
    twenty48:{
      hint:'Arrow keys merge tiles, R restarts'
    },
    pong:{
      hint:'W/S or arrow keys move the left paddle, the right paddle is AI-controlled'
    },
    breakout:{
      hint:'Move mouse to paddle, break the bricks'
    },
    matrix:{
      hint:'Enjoy the Matrix rain effect'
    },
    fireworks:{
      hint:'Click anywhere for fireworks, watch the display'
    },
    spiral:{
      hint:'Mesmerizing kaleidoscope patterns'
    },
    gridpulse:{
      hint:'Move your mouse to create pulse effects'
    },
    particles:{
      hint:'Watch dancing connected particles'
    },
    conway:{
      hint:'Conway\'s Game of Life unfolding'
    },
    geometry:{
      hint:'Rotating geometric shapes'
    },
    trails:{
      hint:'Move mouse to create colorful trails'
    }
  };

  window.AppStrings=Object.freeze(AppStrings);
})();
