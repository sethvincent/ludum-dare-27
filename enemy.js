var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Enemy;
inherits(Enemy, Entity);

function Enemy(options){
  var self = this;

  this.position = { 
    x: options.position.x, 
    y: options.position.y 
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.velocity = {
    x: options.velocity.x,
    y: options.velocity.y
  };

  this.speed = options.speed;
  this.friction = 0.8;
  this.color = options.color;
  
  this.on('update', function(interval){
    self.move();
    this.velocity.y += 1.5;
    self.boundaries();
  });
}

Enemy.prototype.move = function(){
  this.position.x += this.velocity.x * this.friction;
  this.position.y += this.velocity.y * this.friction;
};

Enemy.prototype.boundaries = function(){
  if (this.position.x <= 0){
    this.velocity.x *= -1;
  }

  if (this.position.x >= 3000 - this.size.x){
    this.velocity.x *= -1;
  }

  if (this.position.y <= 0){
    this.position.y = 0;
  }

  if (this.position.y >= 320 - this.size.y){
    this.position.y = 320 - this.size.y;
    this.velocity.y = -10;
    this.jumping = false;
  }
};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}