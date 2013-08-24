var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Player;
inherits(Player, Entity);

function Player(options){
  this.position = { 
    x: options.position.x, 
    y: options.position.y 
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.velocity = {
    x: 0,
    y: 0
  };

  this.direction = 'right';
  
  this.friction = 0.8;
  this.speed = options.speed;
  this.color = options.color;
}

Player.prototype.move = function(){
  this.position.x += this.velocity.x * this.friction;
  this.position.y += this.velocity.y * this.friction;
};

Player.prototype.boundaries = function(){
  if (this.position.x <= 0){
    this.position.x = 0;
  }

  if (this.position.x >= 3000 - this.size.x){
    this.position.x = 3000 - this.size.x;
  }

  if (this.position.y <= 0){
    this.position.y = 0;
  }

  if (this.position.y >= 320 - this.size.y){
    this.position.y = 320 - this.size.y;
    this.jumping = false;
  }
};

Player.prototype.input = function(keysdown){
  if ('A' in keysdown){
    this.direction = 'left';
    this.velocity.x = -this.speed;
  }

  if ('D' in keysdown){
    this.direction = 'right';
    this.velocity.x = this.speed;
  }

  if ('W' in keysdown|| '<space>' in keysdown){
    if (!this.jumping){
      this.jumping = true;
      this.velocity.y = -15;
    }
    
    console.log('wut')
  }

  if ('S' in keysdown){
    this.velocity.y = this.speed;
  }
};