"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Car;

function Car(speed, position) {
  this.speed = speed;
  this.x = position.x;
  this.y = position.y;
  this.width  = 30;
  this.height = 52;
}

Car.prototype.update = function(time) {
  this.y -= this.speed*time;
  if(this.y + this.height < 10 && this.speed > 0) this.y = 500;
  else if(this.y > 780) this.y = -100;
}

Car.prototype.render = function(time, ctx) {
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    0, 0, 200, 345,
    // destination rectangle
    this.x+2, this.y, this.width, this.height
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
