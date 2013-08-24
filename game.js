var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');

var game = new Game({
  canvasId: 'game',
  width: 800,
  height: 400,
  backgroundColor: '#ff1f1f'
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
}

var keyboard = new Keyboard(game);
var keysdown = keyboard.keysdown;

game.on('update', function(interval){});

game.on('draw', function(context){});

game.on('pause', function(){});

game.on('resume', function(){});
