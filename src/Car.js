"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Car;

function Car(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 32;
  this.height = 32;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_mini.png');

  
}
