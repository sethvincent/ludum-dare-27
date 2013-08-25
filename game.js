var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var LevelManager = require('crtrdg-scene');
var Goals = require('crtrdg-goal');
var Inventory = require('./inventory');
var Item = require('./item');
var Player = require('./player');
var Camera = require('./camera');
var Map = require('./map');
var Text = require('./text');

/* create game */
var game = new Game({
  canvasId: 'game',
  width: window.innerWidth,
  height: 320,
  backgroundColor: '#000'
});

game.paused = false;

game.over = function(){
  levelManager.set(gameOver);
};


/*
*
* GAME EVENT LISTENERS
*
*/

game.on('update', function(interval){
  camera.update();
});

game.on('draw', function(context){
  map.draw(context, camera.position.x, camera.position.y)
});

game.on('pause', function(){});

game.on('resume', function(){});

var goals = new Goals(game);
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
  player.tick();
}


/*
*
* KEYBOARD
*
*/

var keyboard = new Keyboard(game);
var keysdown = keyboard.keysdown;

keyboard.on('keyup', function(key){
  if (key === 'S'){
    player.scrunched = false;
  }
});

keyboard.on('keydown', function(key){
  if (key === '<space>' && game.currentScene.name === 'menu'){
    levelManager.set(levelOne);
    game.resume();
  }

  if (key === 'P'){
    console.log(game.paused)
    if (!game.paused){
      game.pause();
      game.paused = true;
      player.visible = false;
      game.previousScene = game.currentScene;
      levelManager.set(pauseMenu);
    } else {
      game.resume();
      game.paused = false;
      player.visible = true;
      levelManager.set(game.previousScene);
    }
  }
});


/*
*
* PLAYER
*
*/

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
  friction: 0.9,
  health: 10
});

player.addTo(game);

player.on('update', function(interval){
  this.input(keyboard.keysDown);
  this.move();
  this.velocity.x *= this.friction;
  this.velocity.y += 1.5;
  this.boundaries();
});

player.on('draw', function(context){
  if (player.visible){
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
  }
});

player.tick = function(){
  this.setHealth(-1);

  if (this.health <= 0){
    player.kill();
  }
};

player.setHealth = function(n){
  this.health += n;
  health.update(this.health);
}

player.kill = function(){
  player.remove();
  game.over();
}


/*
*
* MAP & CAMERA
*
*/

var map = new Map(game, 3000, 320);
map.generate();

var camera = new Camera({
  follow: player,
  followPoint: { x: game.width / 2 },
  viewport: { width: game.width, height: game.height },
  map: map
});


/*
*
* MAIN MENU
*
*/

var menu = levelManager.create({
  name: 'menu',
  backgroundColor: '#ffffff'
});

menu.on('start', function(){
  console.log('menu screen')
  player.visible = false;
  game.pause();
});

// set main menu as first screen
levelManager.set(menu);


/*
*
* GAME OVER
*
*/

var gameOver = levelManager.create({
  name: 'game over',
  backgroundColor: '#000'
});

gameOver.on('start', function(){
  console.log('game over')
  player.visible = false;
  game.pause();
});


/*
*
* PAUSE MENU
*
*/

var pauseMenu = levelManager.create({
  name: 'pause menu',
  backgroundColor: 'blue'
});

pauseMenu.on('start', function(){

});


/*
*
* LEVEL ONE
*
*/

var pizza = new Item({
  name: 'pizza',
  color: '#000',
  position: {
    x: 200,
    y: game.height - 50
  }
});

pizza.on('draw', function(c){
  c.fillStyle = this.color;
  c.fillRect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.x, this.size.y);  
});

var levelOne = levelManager.create({
  name: 'level one',
  backgroundColor: '#000'
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
  pizza.addTo(game);
  player.visible = true;
  goals.set(levelOne.goal);
});

levelOne.on('draw', function(context){
});


/*
*
* UI
*
*/

var health = new Text({ 
  el: '#health', 
  html: player.health
});



