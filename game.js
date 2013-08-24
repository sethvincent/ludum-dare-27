var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var LevelManager = require('crtrdg-scene');
var goals = require('crtrdg-goal')(game);
var Inventory = require('./inventory');
var Item = require('./item');
var Player = require('./player');
var Camera = require('./camera');
var Map = require('./map');


/* create game */
var game = new Game({
  canvasId: 'game',
  width: window.innerWidth,
  height: 320,
  backgroundColor: '#000'
});

var levelManager = new LevelManager(game);


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

keyboard.on('keyup', function(key){
  if (key === 'S'){
    player.scrunched = false;
  }
})

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
  speed: 11,
  friction: 0.9
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

  /* the body */
  context.fillStyle = this.color;

  if(this.scrunched){
    context.fillRect(this.position.x - camera.position.x-10, this.position.y - camera.position.y+30, this.size.x+20, this.size.y-30);

    /* the eye */
    context.fillStyle = '#ccc';

    /* direction of eye */
    if (this.direction === 'right') {
      context.fillRect(this.position.x+this.size.x-5 - camera.position.x, this.position.y - camera.position.y+35, 10, 10);
    } else {
      context.fillRect(this.position.x - camera.position.x-5, this.position.y - camera.position.y+35, 10, 10);
    }

  } else {
    context.fillRect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.x, this.size.y);
  
    /* the eye */
    context.fillStyle = '#ccc';

    /* direction of eye */
    if (this.direction === 'right') {
      context.fillRect(this.position.x+this.size.x-15 - camera.position.x, this.position.y+5 - camera.position.y, 10, 10);
    } else {
      context.fillRect(this.position.x+5 - camera.position.x, this.position.y+5 - camera.position.y, 10, 10);
    }
  }

  context.restore();
});


/*
*
* LEVEL ONE
*
*/

var levelOne = levelManager.create({
  name: 'level one'
});

levelOne.goal = goals.create({
  name: 'level one goal'
});

levelOne.goal.on('active', function(){
  console.log(this.name, 'active')
});

levelOne.goal.on('met', function(){
  levelManager.set(levelTwo);
});

levelOne.on('start', function(){
  goals.set(levelOne.goal);
});

levelManager.set(levelOne);

