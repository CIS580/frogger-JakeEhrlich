"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Log;

function Log(speed, height, position, color) {
  if(!color) color = "brown";
  this.color = color;
  this.speed = speed;
  this.x = position.x;
  this.y = position.y;
  this.width  = 28;
  this.height = height;
}

Log.prototype.update = function(time) {
  this.y -= this.speed*time;
  if(this.y + this.height < 10 && this.speed > 0) this.y = 500;
  else if(this.y > 780) this.y = -this.height - 30;
}

Log.prototype.render = function(time, ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x+4, this.y, this.width, this.height);
}
