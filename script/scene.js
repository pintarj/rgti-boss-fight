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
 * Draw the scene.
 * @return {undefined}
 * */
Scene.prototype.draw = function () {
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
