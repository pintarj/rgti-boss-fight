/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * Create a LoadingScene object.
 * */
function LoadingScene() {
    Scene.call(this, 'loading-scene');
}

/**
 * Inherit Scene.
 * */
LoadingScene.prototype = Object.create(Scene.prototype);

/**
 * Correct the constructor pointer because it points to Scene.
 */
LoadingScene.prototype.constructor = LoadingScene;

/**
 * Update the scene.
 * @param {number} delta - The amount of time to update (units in seconds).
 * @return {undefined}
 * */
LoadingScene.prototype.update = function (delta) {
    if (assetsLoading.isCompleted()) {
        document.getElementById('loading_message').style.visibility = 'hidden';
        this.setNextScene(new GameScene());
    }
};

/**
 * Draw the scene.
 * @return {undefined}
 * */
LoadingScene.prototype.draw = function () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
