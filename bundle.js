(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 256});
var cars = []
var logs = []
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
  cars.push(new Car(-speed, {x: 96*2+32, y: i*64}, Math.PI));
}
for(var i = 0; i < 6; ++i) {
  cars.push(new Car(0.25*speed, {x: 96*2+64+96, y: i*64}, 0.0));
}
for(var i = 0; i < 3; ++i) {
  cars.push(new Car(-1.75*speed, {x: 96*2+32+96, y: i*120}, Math.PI));
}
for(var i = 0; i < 5; ++i) {
  logs.push(new Log(0.5*speed, 64, {x: 416, y: i*96}));
}
for(var i = 0; i < 5; ++i) {
  logs.push(new Log(-0.5*speed, 64, {x: 416+32, y: i*96+13}));
}
for(var i = 0; i < 5; ++i) {
  logs.push(new Log(0.5*speed, 32, {x: 416+64, y: i*96+27}, "green"));
}
for(var i = 0; i < 2; ++i) {
  logs.push(new Log(-0.3*speed, 128+32, {x: 416+64+32, y: i*240}));
}
for(var i = 0; i < 5; ++i) {
  logs.push(new Log(0.5*speed, 32, {x: 480+64, y: i*96}, "green"));
}
for(var i = 0; i < 3; ++i) {
  logs.push(new Log(-speed, 128, {x: 480+64+32, y: i*240}));
}
for(var i = 0; i < 5; ++i) {
  logs.push(new Log(0.5*speed, 32, {x: 512+64+32, y: i*96+27}, "green"));
}
for(var i = 0; i < 1; ++i) {
  logs.push(new Log(-0.5*speed, 256, {x: 512+64+64, y: i*96}));
}
for(var i = 0; i < 5; ++i) {
  logs.push(new Log(speed, 32, {x: 512+64+64+32, y: i*96}, "green"));
}
for(var i = 0; i < 1; ++i) {
  logs.push(new Log(1.5*speed, 256, {x: 512+64+64+64, y: i*96}));
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
  var box = {width : player.width - 6, height:player.height - 6};
  box.x = player.x + player.xoff + 3;
  box.y = player.y + player.yoff + player.soff + 3;
  player.update(elapsedTime);
  if(player.x >= 704+32) {
    game.score += 1;
    player = new Player({x: 0, y: 256});
    logs.forEach(function(c){c.speed *= 1.1;});
    cars.forEach(function(c){c.speed *= 1.1;});
  }
  logs.forEach(function(c){c.update(elapsedTime);});
  logs.forEach(function(c){
    if(player.state == "idle" && checkCollide(box, c)) {
      console.log("yo yo yo");
      player.speed = -c.speed;
      console.log(player.speed);
    }
  });
  cars.forEach(function(c) {
    if(checkCollide(box, c)) game.over = true;
  });
  cars.forEach(function(c){c.update(elapsedTime);});
  if(player.state == "idle" && player.x < 704+32 && player.x >= 416 && player.speed == 0) {
    game.over = true;
  }
  if(box.y + box.height <= 0 || player.y >= 484) game.over = true;
  if(box.x + box.width <= 0) game.over = true;
}

//take and modified from this: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function checkCollide(o1, o2) {
  return o1.x < o2.x + o2.width &&
         o1.x + o1.width > o2.x &&
         o1.y < o2.y + o2.height &&
         o1.height + o1.y > o2.y
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
  cars.forEach(function(c){c.render(elapsedTime, ctx);});
  logs.forEach(function(c){c.render(elapsedTime, ctx);})
  player.render(elapsedTime, ctx);
  ctx.font = "30px serif";
  ctx.fillStyle = "black";
  ctx.fillText("score: " + game.score, 40, 40);
}

},{"./car.js":2,"./game.js":3,"./log.js":4,"./player.js":5}],2:[function(require,module,exports){
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
  this.over = false;
  this.score = 0;
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

  if(this.over) {
    this.frontCtx.fillStyle = "white";
    this.frontCtx.fillRect(0, 0, this.frontBuffer.width, this.frontBuffer.height);
    this.frontCtx.fillStyle = "black";
    this.frontCtx.fillText("DED", 764/2 - 50, 484/2 - 20);
    this.frontCtx.drawImage(this.backBuffer, 0, 0);
    return;
  }

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
  this.xdir = 0;
  this.ydir = 0;
  this.x = position.x;
  this.xoff = 0;
  this.yoff = 0;
  this.soff = 0;
  this.ix = position.x;
  this.y = position.y;
  this.width  = 32;
  this.height = 32;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
  this.speed = 0;
  var self = this;
  document.onkeydown = function(e) {
    if(self.state != "idle") return;
    e = e || window.event;
    switch(e.code) {
      case 'ArrowUp': self.speed = 0; self.ydir = -1; self.state = "jump"; self.frame = 0; self.timer = 0; break;
      case 'ArrowDown': self.speed = 0; self.ydir = 1; self.state = "jump"; self.frame = 0; self.timer = 0; break;
      case 'ArrowRight': self.speed = 0; self.xdir = 1; self.state = "jump"; self.frame = 0; self.timer = 0; break;
      case 'ArrowLeft': self.speed = 0; self.xdir = -1; self.state = "jump"; self.frame = 0; self.timer = 0; break;
      default: break;
    }
    console.log(e);
  }
}

Player.prototype.animate = function(time) {
  this.timer += time;
  if(this.timer > MS_PER_FRAME) {
    this.timer = 0;
    this.frame += 1;
    if(this.frame > 3) {
      this.frame = 0;
      if(this.state == "jump") {
        this.x += 32*this.xdir;
        this.y += 32*this.ydir;
        this.xoff = 0;
        this.yoff = 0;
        console.log(this.x);
        console.log(this.y);
      }
      //this.soff = 0;
      this.state = "idle";
      this.ydir = 0;
      this.xdir = 0;
    }
  }
}
/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "jump":
      //this.soff -= 0.1*time;
      this.xoff += this.xdir*0.06*time;
      this.yoff += this.ydir*0.06*time;
      break;
    case "idle":
      this.soff += this.speed*time;
      var sng = Math.sign(this.speed);
      if(Math.abs(this.soff) >= 32) { this.y += sng*32; this.soff -= sng*32; }
      break;
    // TODO: Implement your player's update by state
  }
  this.animate(time);
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
    this.x + this.xoff, this.y + this.yoff + this.soff, this.width, this.height
  );
}

},{}]},{},[1]);
