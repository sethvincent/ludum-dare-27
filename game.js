var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var Player = require('./player');
var Camera = require('./camera');
var Map = require('./map');


/* create game */
var game = new Game({
  canvasId: 'game',
  width: window.innerWidth,
  height: 320,
  backgroundColor: '#fff'
});


/*
*
* yes, this is for the 10 seconds theme.
* i mean, there'll be more to it than this.
* but it would be sorta funny if this is all i did
* that related to the theme.
*
*/
setInterval(tick, 10000);

function tick(){
  console.log('10 seconds have passed');
  map.generate();
}


/* set up keyboard */
var keyboard = new Keyboard(game);
var keysdown = keyboard.keysdown;


/* create player */
var player = new Player({
  size: {
    x: 40,
    y: 55
  },
  position: {
    x: game.width / 2 - 4,
    y: game.height / 2 - 6,
  },
  color: '#fff',
  speed: 8
});

var map = new Map(game, 3000, 320);
map.generate();

var camera = new Camera({
  follow: player,
  followPoint: { x: game.width / 2 },
  viewport: { width: game.width, height: game.height },
  map: map
});

game.on('update', function(interval){
  camera.update();
});

game.on('draw', function(context){
  map.draw(context, camera.position.x, camera.position.y)
});

game.on('pause', function(){});

game.on('resume', function(){});

player.addTo(game);

player.on('update', function(interval){
  this.input(keyboard.keysDown);
  this.move();
  this.velocity.x *= this.friction;
  this.velocity.y += 1.5;
  this.boundaries();
});

player.on('draw', function(context){
  context.save();
  context.fillStyle = this.color;
  context.fillRect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.x, this.size.y);
  context.fillStyle = 'rgba(205,183,152,0.8)';
  if (this.direction === 'right') {
    context.fillRect(this.position.x+25 - camera.position.x, this.position.y+5 - camera.position.y, 10, 10);
  } else {
    context.fillRect(this.position.x+5 - camera.position.x, this.position.y+5 - camera.position.y, 10, 10);
  }
  context.restore();
});
