(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 256});
var cars = []
var speed = 0.1;
for(var i = 0; i < 2; ++i) {
  cars.push(new Car(speed, {x: 64, y: i*240}, 0.0));
}
for(var i = 0; i < 2; ++i) {
  cars.push(new Car(-speed, {x: 32, y: i*240}, Math.PI));
}
for(var i = 0; i < 1; ++i) {
  cars.push(new Car(2*speed, {x: 128+32, y: i*240}, 0.0));
}
for(var i = 0; i < 1; ++i) {
  cars.push(new Car(-2*speed, {x: 128, y: i*240}, Math.PI));
}
for(var i = 0; i < 1; ++i) {
  cars.push(new Car(4*speed, {x: 96*2+64, y: i*240}, 0.0));
}
for(var i = 0; i < 4; ++i) {
  cars.push(new Car(-1.5*speed, {x: 96*2+32, y: i*64}, Math.PI));
}
for(var i = 0; i < 6; ++i) {
  cars.push(new Car(0.5*speed, {x: 96*2+64+96, y: i*64}, 0.0));
}
for(var i = 0; i < 3; ++i) {
  cars.push(new Car(-2.5*speed, {x: 96*2+32+96, y: i*120}, Math.PI));
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  cars.forEach(function(c){c.update(elapsedTime);})
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //render background
  for(var i = 1; i < 12; i += 3) {
    var x = 32*i;
    ctx.fillStyle = "grey";
    ctx.fillRect(x, 0, 64, canvas.height);
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(x + 32, 0);
    ctx.lineTo(x + 32, canvas.height + 32);
    ctx.stroke();
  }
  for(var i = 13; i < 22; ++i) {
    var x = 32*i;
    ctx.fillStyle = "blue";
    ctx.fillRect(x, 0, 64, canvas.height);
  }
  cars.forEach(function(c){c.render(elapsedTime, ctx);})
  player.render(elapsedTime, ctx);
}

},{"./car.js":2,"./game.js":3,"./player.js":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
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

},{}]},{},[1]);
