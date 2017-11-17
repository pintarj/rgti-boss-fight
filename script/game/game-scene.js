/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * Create a GameScene object.
 * */
function GameScene() {
    Scene.call(this, "game-scene");
}

/**
 * Update the scene.
 * @param {number} delta - The amount of time to update (units in seconds).
 * @return {undefined}
 * */
GameScene.prototype.update = function (delta) {

};

/**
 * Draw the scene.
 * @return {undefined}
 * */
GameScene.prototype.draw = function () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

/**
 * Called when the canvas is change size.
 * @param {number} width - The new width of the canvas.
 * @param {number} height - The new height of the canvas.
 * @return {undefined}
 * */
GameScene.prototype.on_resize = function (width, height) {

};
