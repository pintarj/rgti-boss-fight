/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * Create a MenuScene object.
 * */
function MenuScene() {
    Scene.call(this, 'menu-scene');
    document.getElementById('the_menu').style.display = 'block';
    document.getElementById('victory_message').style.display = 'none';
    document.getElementById('cthun_message').style.display = 'none';
}

/**
 * Inherit Scene.
 * */
MenuScene.prototype = Object.create(Scene.prototype);

/**
 * Correct the constructor pointer because it points to Scene.
 */
MenuScene.prototype.constructor = MenuScene;

/**
 * Update the scene.
 * @param {number} delta - The amount of time to update (units in seconds).
 * @return {undefined}
 * */
MenuScene.prototype.update = function (delta) {

};

/**
 * Draw the scene.
 * @return {undefined}
 * */
MenuScene.prototype.draw = function () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/**
 * Tells the core if the scene requires the mouse pointer locked (hidden).
 * @return {boolean} true if it's required, false otherwise.
 * */
MenuScene.prototype.requirePointerLock = function () {
    return false;
};

/**
 * Launch the game scene. Called when the "Play" button is pressed.
 * */
function launchGame() {
    document.getElementById('the_menu').style.display = 'none';
    var nextScene = new GameScene();
    current_scene.setNextScene(nextScene);
    if (nextScene.requirePointerLock())
        the_canvas.requestPointerLock();
}
