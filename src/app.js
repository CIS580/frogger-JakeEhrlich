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
