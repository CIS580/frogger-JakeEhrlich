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
    if(checkCollide(box, c)) {game.over = true; player = new Player({x: 0, y: 256});}
  });
  cars.forEach(function(c){c.update(elapsedTime);});
  if(player.state == "idle" && player.x < 704+32 && player.x >= 416 && player.speed == 0) {
    game.over = true;
    player = new Player({x: 0, y: 256});
  }
  if(box.y + box.height <= 0 || player.y >= 484) {
    game.over = true;
    player = new Player({x: 0, y: 256});
  }
  if(box.x + box.width <= 0) {
    game.over = true;
    player = new Player({x: 0, y: 256});
  }
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
  ctx.fillText("lives: " + game.lives, 40, 80);
}
