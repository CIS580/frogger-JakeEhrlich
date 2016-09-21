"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.xoff = 0;
  this.ix = position.x;
  this.y = position.y;
  this.width  = 32;
  this.height = 32;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;

  var self = this;
  document.onkeydown = function(e) {
    if(self.state != "idle") return;
    e = e || window.event;
    switch(e.code) {
      case 'ArrowRight': self.state = "jump"; self.frame = 0; self.timer = 0; break;
    }
    console.log(e);
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "jump":
      this.xoff += 0.06*time;
      console.log(time);
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) {
          this.frame = 0;
          if(this.state == "jump") {
            this.x += 32;
            this.xoff = 0;
            console.log(this.x);
          }
          this.state = "idle";
        }
      }
      break;
    // TODO: Implement your player's update by state
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  var y = 64;
  if(this.state == "jump") y = 0;
  ctx.drawImage(
    // image
    this.spritesheet,
    // source rectangle
    this.frame * 64, y, 64, 64,
    // destination rectangle
    this.x + this.xoff, this.y, this.width, this.height
  );
}
