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
      {name:'snake',src:'games/snake.js',hint:'Arrow keys or WASD steer, P pauses, R restarts'}
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
    }
  };

  window.AppStrings=Object.freeze(AppStrings);
})();
