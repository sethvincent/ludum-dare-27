var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Item;
inherits(Item, Entity);

function Item(options){
  this.name = options.name;

  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: 5,
    y: 5
  };

  this.color = options.color;

  this.on('draw', function(context){
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);   
  });
}