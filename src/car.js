"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Car;

function Car(speed, position, angle) {
  this.speed = speed;
  this.angle = angle;
  this.x = position.x;
  this.y = position.y;
  this.width  = 30;
  this.height = 52;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_mini.svg');
}

Car.prototype.update = function(time) {
  this.y -= this.speed*time;
  if(this.y + this.height < 10 && this.speed > 0) this.y = 500;
  else if(this.y > 780) this.y = -100;
}

Car.prototype.render = function(time, ctx) {
  ctx.translate(this.x + this.width/2, this.y + this.height/2);
  ctx.rotate(this.angle);
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    0, 0, 200, 345,
    // destination rectangle
    -this.width/2, -this.height/2, this.width, this.height
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
