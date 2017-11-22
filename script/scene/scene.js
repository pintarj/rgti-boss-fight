/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * Create a Scene object.
 * @param {string} id - The scene identifier, should be a string like "example.awesome-scene".
 * */
function Scene(id) {
    this.id = id;
    this.nextScene = undefined;
    this.camera = new SceneCamera();
}

/**
 * Update the scene.
 * @param {number} delta - The amount of time to update (units in seconds).
 * @return {undefined}
 * */
Scene.prototype.update = function (delta) {
    // Default implementation does nothing.
};

/**
 * Set the next scene.
 * @param {Scene} nextScene - The next scene.
 * @return {undefined}
 * */
Scene.prototype.setNextScene = function (nextScene) {
    this.nextScene = nextScene;
};

/**
 * Draw the scene.
 * @return {undefined}
 * */
Scene.prototype.draw = function () {
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

/**
 * Handle keyboard's "keyDown" events.
 * @param {KeyboardEvent} event - The keyDown event.
 * */
Scene.prototype.onKeyDown = function (event) {

};

/**
 * Handle keyboard's "keyUp" events.
 * @param {KeyboardEvent} event - The keyUp event.
 * */
Scene.prototype.onKeyUp = function (event) {

};

/**
 * Handle mouse's "onMove" events.
 * @param {MouseEvent} event - The onMove event.
 * */
Scene.prototype.onMouseMove = function (event) {

};

/**
 * Called when the canvas is change size.
 * @param {number} width - The new width of the canvas.
 * @param {number} height - The new height of the canvas.
 * @return {undefined}
 * */
Scene.prototype.on_resize = function (width, height) {
    // Default implementation does nothing.
};

/**
 * Tells the core if the scene requires the mouse pointer locked (hidden).
 * @return {boolean} true (default implementation) if it's required, false otherwise.
 * */
Scene.prototype.requirePointerLock = function () {
    return true;
};
