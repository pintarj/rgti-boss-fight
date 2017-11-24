/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

//Audio context
//footsteps
var footstepSoundEffect = new Audio("asset/footStepSoundEffect.mp3");
const smallNum1 = 0.0;
const smallNum2 = 0.085;
const timeDivider = 200; // the smaller the divider, the shorter the steps
//laser
var laserSoundEffect = new Audio("asset/laserSoundEffect.mp3");
//background
var backgroundMusic = new Audio("asset/glasba2.mp3");
//death message
var tauntSound = new Audio("asset/taunt.mp3");

//Global variable of starting time
var startTime;



/**
 * Create a GameScene object.
 * */
function GameScene() {
    Scene.call(this, 'game-scene');
    this.cthun = new Cthun();
    this.hero = new Hero();
    this.arena = new SceneObject('arena', 'janez');
    this.gameFinished = false;

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
    this.columns.push(new Column(50, (3.5) * 480 / columnsNumber));

    // array that tells which key is pressed
    this.wasd = [false, false, false, false];

    // Global variable of starting time.
    this.startTime = new Date();

    // Play the music
    backgroundMusic.play();
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
    var pMatrix = this.camera.calculatePVMatrix();

    // update programs pMatrix
    ['janez', 'laser', 'arena-tex'].forEach(function (name) {
        var program = programs[name];
        gl.useProgram(program);
        gl.uniformMatrix4fv(program.pMatrixUniformLocation, false, pMatrix);
    });
};

/**
 * Update the scene.
 * @param {number} delta - The amount of time to update (units in seconds).
 * @return {undefined}
 * */
GameScene.prototype.update = function (delta) {

    if (this.gameFinished)
        return;

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

        var oldPosition = this.hero.position;
        this.hero.setPosition([x, 0, z]);

        // check win condition
        if (this.hero.distance <= 4) {
            gameFinished(true);
            return;
        }

        if (this.hero.distance > 62)
            this.hero.setPosition(oldPosition);

        for (var i = 0; i < this.columns.length; ++i) {
            if (this.hero.distance2DFrom(this.columns[i]) < 2) {
                this.hero.setPosition(oldPosition);
                break;
            }                               
        }
    }

    this.updateCamera();

    // update Cthun and its laser
    var difTime = new Date() - this.startTime;
    var speedModify = 0;

    if(difTime/1000 > 60 )
    	speedModify = 3;
    else
    	speedModify = 12 - difTime * (10/60000);

    var orientation = this.cthun.orientation + delta * (this.cthun.speed / speedModify);
    orientation = (orientation >= 2 * Math.PI) ? (orientation - 2 * Math.PI) : orientation;

    if (this.hero.isOnAngle(orientation)) {
        var saved = false;

        for (var i = 0; i < this.columns.length; ++i) {
            var heroBehind = this.columns[i].distance < this.hero.distance;
            if (this.columns[i].isOnAngle(this.hero.angle) && heroBehind) {
                saved = true;
                break;
            }
        }

        if (!saved) {
            gameFinished(false);
            return;
        }
    }

    this.cthun.orientation = orientation;
    this.cthun.laser.orientation = orientation;
    this.cthun.laser.length = 100;

    var hitting = undefined;
    for (var i = 0; i < this.columns.length; ++i) {
        if (this.columns[i].isOnAngle(orientation)) {
            hitting = this.columns[i];
            this.cthun.laser.length = hitting.distance;
            break;
        }
    }

    /*/
    //checking if it is time to play the footstep sound
    if((this.wasd[0] || this.wasd[1] || this.wasd[2] || this.wasd[3]) &&
     (Math.cos(difTime/timeDivider) < smallNum2 && Math.cos(difTime/timeDivider) > smallNum1)) {
        footstepSoundEffect.play();
    }
    /*/
    //checking if it is time to play the footstep sound
    if((this.wasd[0] || this.wasd[1] || this.wasd[2] || this.wasd[3]) && footstepSoundEffect.paused) {
        footstepSoundEffect.play();
    } else if(!(this.wasd[0] || this.wasd[1] || this.wasd[2] || this.wasd[3]) && !footstepSoundEffect.paused) {
        footstepSoundEffect.pause();
        footstepSoundEffect.currentTime = 0;
    }
    
    //checking if it is time to play the laser sound
    var heroVec = vec3.create();
    vec3.subtract(heroVec, this.hero.position, this.cthun.laser.position);
    var laserVec = vec3.fromValues(Math.cos(orientation-3.14), 0, Math.sin(orientation-3.14));
    if(vec3.angle(heroVec,laserVec) > 2.8 && vec3.angle(heroVec,laserVec) < 3.1 && laserSoundEffect.paused) {
        laserSoundEffect.volume = 1;
        laserSoundEffect.play();
    } else if (vec3.angle(heroVec,laserVec) > 0.9 && vec3.angle(heroVec,laserVec) < 1.3 && !laserSoundEffect.paused) {
        var interval = setInterval(function () {
            var newVolume = laserSoundEffect.volume - 0.1;

            // Check if the newVolume is greater than zero
            if(newVolume >= 0.01){
                laserSoundEffect.volume = newVolume;
            }
            else{
                // Stop fade
                clearInterval(interval);
                laserSoundEffect.volume = 0;
                laserSoundEffect.pause();
                laserSoundEffect.currentTime = 0;
            }
        }, 300);
    }


    this.cthun.laser.flickering = 0.5 * (Math.random() - 0.5);
    var laserDirection = vec3.create();
    laserDirection[0] = Math.sin(orientation);
    laserDirection[2] = -Math.cos(orientation);
    vec3.normalize(laserDirection, laserDirection);
    var program = programs['janez'];
    gl.useProgram(program);
    gl.uniform3fv(program.laserDirectionUniformLocation, laserDirection);
    gl.uniform1f(program.laserFlickeringUniformLocation, this.cthun.laser.flickering);

    program = programs['arena-tex'];
    gl.useProgram(program);
    gl.uniform3fv(program.laserDirectionUniformLocation, laserDirection);
    gl.uniform1f(program.laserFlickeringUniformLocation, this.cthun.laser.flickering);


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
    this.arena.draw();
    this.cthun.draw();
};

/**
 * Handle keyboard's "keyDown" events.
 * @param {KeyboardEvent} event - The keyDown event.
 * */
GameScene.prototype.onKeyDown = function (event) {
    if (this.gameFinished)
        return;

    switch (event.key.toLowerCase()) {
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
    if (this.gameFinished)
        return;

    switch (event.key.toLowerCase()) {
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
    if (this.gameFinished)
        return;

    this.hero.orientation += event.movementX / 200;
};

/**
 * Called when the game is finished. The it returns to the menu.
 * @param {boolean} victory - True if the game was won, false otherwise.
 * */
function gameFinished(victory) {
    current_scene.wasd = [false, false, false, false];
    current_scene.gameFinished = true;
    document.getElementById(victory ? 'victory_message' : 'cthun_message').style.display = 'block';
    //laserSoundEffect.volume = 0.2;
    if(!victory) {
        var interval = setInterval(function () {
            var newVolume = laserSoundEffect.volume - 0.1;

            // Check if the newVolume is greater than zero
            if(newVolume >= 0.01){
                laserSoundEffect.volume = newVolume;
                backgroundMusic.volume = newVolume;
            }
            else{
                // Stop fade
                clearInterval(interval);
                laserSoundEffect.volume = 0;
                laserSoundEffect.pause();
                laserSoundEffect.currentTime = 0;
            }
        }, 100);
        tauntSound.play();
    }
    setTimeout(function () {
        current_scene.setNextScene(new MenuScene());
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }, 4000);
}
