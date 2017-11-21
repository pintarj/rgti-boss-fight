/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * Create a GameScene object.
 * */
function GameScene() {
    Scene.call(this, 'game-scene');
    this.cube = new SceneObject('cube', 'janez');
    this.time = 0;
}

/**
 * Inherit Scene.
 * */
GameScene.prototype = Object.create(Scene.prototype);

/**
 * Correct the constructor pointer because it points to Scene.
 */
GameScene.prototype.constructor = GameScene;

/**
 * Update the scene.
 * @param {number} delta - The amount of time to update (units in seconds).
 * @return {undefined}
 * */
GameScene.prototype.update = function (delta) {
    this.time += delta;
    this.cube.setPosition([Math.sin(this.time) * 5, 0, -8]);
};

/**
 * Draw the scene.
 * @return {undefined}
 * */
GameScene.prototype.draw = function () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.cube.draw();
};
