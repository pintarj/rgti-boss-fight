/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";


//Global variable of starting time
var startTime;

//Audio context
//footsteps
var footstepSoundEffect = new Audio("asset/footStepSoundEffect.mp3");
const smallNum1 = 0.0;
const smallNum2 = 0.085;
const timeDivider = 200; // the smaller the divider, the shorter the steps
//laser
var laserSoundEffect = new Audio("asset/laserSoundEffect.mp3");
laserSoundEffect.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
laserSoundEffect.play();
//background
var backgroundMusic = new Audio("asset/glasba2.mp3");
backgroundMusic.play();


/**
 * Create a GameScene object.
 * */
function GameScene() {
    Scene.call(this, 'game-scene');
    this.cthun = new Cthun();
    this.hero = new Hero();
    this.arena = new SceneObject('arena', 'janez');

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
    var winCondition = false;    
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
        


        var okToMovePillar = true;
        for (var i = 0; i < this.columns.length; ++i) {
            var a = this.columns[i].position[0] -  x;
            var b = this.columns[i].position[2] -  z;
            var c = Math.sqrt(a*a + b*b);

            if(c < 2){
                okToMovePillar = false;
            }                               
        }
        var okToMoveRoom = true;
        var c = Math.sqrt(x*x + z*z);
        if(c > 62){
            okToMoveRoom = false;
        }
        if(c < 4){
            winCondition = true;
        }

        if(okToMoveRoom && okToMovePillar){
            this.hero.setPosition([x, 0, z]);
        }

    }
    this.updateCamera();

    //win condition
    if(winCondition){
        
    }

    // update Cthun and its laser
    var currentTime = new Date();
    var difTime = currentTime - startTime;
    var speedModify = 0;
    if(difTime/1000 > 60 ){
    	speedModify = 3;
    }
    else {
    	speedModify = 12 - difTime * (10/60000);
    }
    var orientation = this.cthun.orientation + delta * (this.cthun.speed / speedModify);
    orientation = (orientation >= 2 * Math.PI) ? (orientation - 2 * Math.PI) : orientation;
    this.cthun.orientation = orientation;
    this.cthun.laser.orientation = orientation;
    this.cthun.laser.length = 100;

    
    var aJePillarHit = false;
    var hitting = undefined;
    for (var i = 0; i < this.columns.length; ++i) {
        if (this.columns[i].isOnAngle(orientation)) {
            hitting = this.columns[i];
            this.cthun.laser.length = hitting.distance;
            aJePillarHit = true;
            break;
        }
    }

    /*console.log(aJePillarHit);*/


    //checking if it is time to play the footstep sound
    if((this.wasd[0] || this.wasd[1] || this.wasd[2] || this.wasd[3]) &&
     (Math.cos(difTime/timeDivider) < smallNum2 && Math.cos(difTime/timeDivider) > smallNum1)) {
        //console.log(Math.cos(difTime/200));
        footstepSoundEffect.play();
        console.log(orientation);
    }

    /*var tmpDist = 30;
    var tmpKot = 2.93;
    

    this.cthun.laser.flickering = 0.5 * (Math.random() - 0.5);
    var laserDirection = vec3.create();
    laserDirection[0] = Math.sin(orientation);
    laserDirection[2] = -Math.cos(orientation);
    vec3.normalize(laserDirection, laserDirection);
    var program = programs['janez'];
    gl.useProgram(program);
    gl.uniform3fv(program.laserDirectionUniformLocation, laserDirection);
    gl.uniform1f(program.laserFlickeringUniformLocation, this.cthun.laser.flickering);
    */
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
