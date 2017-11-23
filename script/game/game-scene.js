/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";


//Global variable of starting time
var startTime;

/**
 * Create a GameScene object.
 * */
function GameScene() {
    Scene.call(this, 'game-scene');
    this.cthun = new Cthun();
    this.hero = new Hero();

    // columns generation
    this.columns = [];
    var columnsNumber = 10;


    this.columns.push(new Column(10, 0 * 480 / columnsNumber));
    this.columns.push(new Column(14, (1/2) * 480 / columnsNumber));
    this.columns.push(new Column(20, (1.2) * 480 / columnsNumber));
    this.columns.push(new Column(28, (1.6) * 480 / columnsNumber));
    this.columns.push(new Column(38, (2.1) * 480 / columnsNumber));
    this.columns.push(new Column(48, (2.5) * 480 / columnsNumber));
    this.columns.push(new Column(50, (3) * 480 / columnsNumber));

    // array that tells which key is pressed
    this.wasd = [false, false, false, false];


    startTime = new Date();
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
 * Update the camera so that is looking at the hero from behind.
 * */
GameScene.prototype.updateCamera = function () {
    this.camera.lookAt([this.hero.position[0], 2.3, this.hero.position[2]]);
    var x = this.hero.position[0] - 5 * Math.sin(this.hero.orientation);
    var y = 3;
    var z = this.hero.position[2] + 5 * Math.cos(this.hero.orientation);
    this.camera.setPosition([x, y, z]);
};

/**
 * Update the scene.
 * @param {number} delta - The amount of time to update (units in seconds).
 * @return {undefined}
 * */
GameScene.prototype.update = function (delta) {

    // update the hero position
    if (this.wasd[0] || this.wasd[1] || this.wasd[2] || this.wasd[3]) {
        var heroMoveVector = vec2.create();
        if (this.wasd[0])
            heroMoveVector[1] += 1;
        if (this.wasd[1])
            heroMoveVector[0] -= 1;
        if (this.wasd[2])
            heroMoveVector[1] -= 1;
        if (this.wasd[3])
            heroMoveVector[0] += 1;
        vec2.normalize(heroMoveVector, heroMoveVector);
        var x = this.hero.position[0];
        var z = this.hero.position[2];
        x += delta * this.hero.speed * Math.sin(this.hero.orientation) * heroMoveVector[1];
        z -= delta * this.hero.speed * Math.cos(this.hero.orientation) * heroMoveVector[1];
        x += delta * this.hero.speed * Math.cos(this.hero.orientation) * heroMoveVector[0];
        z += delta * this.hero.speed * Math.sin(this.hero.orientation) * heroMoveVector[0];
        this.hero.setPosition([x, 0, z]);
    }

    this.updateCamera();

    // update Cthun and its laser
    var currentTime = new Date();
    var difTime = currentTime - startTime;
    var speedModify = 0;
    if(difTime/1000 > 60 ){
    	speedModify = 3;
    }
    else {
    	speedModify = 15 - difTime * (12/60000);
    }
    var orientation = this.cthun.orientation + delta * (this.cthun.speed / speedModify);
    this.cthun.orientation = orientation;
    this.cthun.laser.orientation = orientation;
    
	
	
};

/**
 * Draw the scene.
 * @return {undefined}
 * */
GameScene.prototype.draw = function () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.columns.forEach(function(column) {
        column.draw();
    });

    this.hero.draw();
    this.cthun.draw();
};

/**
 * Handle keyboard's "keyDown" events.
 * @param {KeyboardEvent} event - The keyDown event.
 * */
GameScene.prototype.onKeyDown = function (event) {
    switch (event.key) {
        case 'w':
            this.wasd[0] = true;
            break;
        case 'a':
            this.wasd[1] = true;
            break;
        case 's':
            this.wasd[2] = true;
            break;
        case 'd':
            this.wasd[3] = true;
            break;
    }
};

/**
 * Handle keyboard's "keyUp" events.
 * @param {KeyboardEvent} event - The keyUp event.
 * */
GameScene.prototype.onKeyUp = function (event) {
    switch (event.key) {
        case 'w':
            this.wasd[0] = false;
            break;
        case 'a':
            this.wasd[1] = false;
            break;
        case 's':
            this.wasd[2] = false;
            break;
        case 'd':
            this.wasd[3] = false;
            break;
    }
};

/**
 * Handle mouse's "onMove" events.
 * @param {MouseEvent} event - The onMove event.
 * */
GameScene.prototype.onMouseMove = function (event) {
    this.hero.orientation += event.movementX / 200;
};
