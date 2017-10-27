/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * The canvas on which the drawings will be performed. Variable assigned during the call of the boot() function.
 * @type {HTMLCanvasElement}
 * */
var the_canvas = null;

/**
 * The WebGL rendering context. Variable assigned during the call of the boot() function.
 * @type {WebGLRenderingContext}
 * */
var gl = null;

/**
 * The last timestamp passed as argument to the loop() method. The unit is milliseconds.
 * @type {number}
 * */
var previous_loop_timestamp = null;

/**
 * The current scene to update/draw during the frame rendering requests.
 * @type {Scene}
 * */
var current_scene = null;

/**
 * Update and draw the scene. This method will recursively call itself every time that a frame rendering is required by
 * the browser. This method is firstly called by the boot() method.
 * @param {number} timestamp - The timestamp of the frame rendering request.
 * @return {undefined}
 * */
function loop(timestamp) {
    try {
        if (!previous_loop_timestamp)
            previous_loop_timestamp = timestamp - 1000.0 / 60.0;

        var delta = (timestamp - previous_loop_timestamp) / 1000.0;
        current_scene.update(delta);
        current_scene.draw();
        previous_loop_timestamp = timestamp;
        window.requestAnimationFrame(loop);
    } catch (exception) {
        console.error(exception.message);
    }
}

/**
 * Resize the canvas and WebGL context viewport according to the dimension of the window.
 * @return {undefined}
 * */
function on_resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    the_canvas.width  = w;
    the_canvas.height = h;
    gl.viewport(0, 0, w, h);

    if (current_scene)
        current_scene.on_resize(w, h);
}

/**
 * Returns the initial scene.
 * @return {Scene}
 * */
function create_initial_scene() {
    return new Scene("base");
}

/**
 * Initialize the application. This mean: WebGL context creation, launch the update/draw loop, ...
 * @return {undefined}
 * */
function boot() {
    try {
        the_canvas = document.getElementById("the_canvas");
        gl = the_canvas.getContext("webgl") || the_canvas.getContext("webgl-experimental");
        on_resize();

        window.addEventListener("resize", function(event) {
            on_resize();
        });

        current_scene = create_initial_scene();
        window.requestAnimationFrame(loop);
    } catch (exception) {
        console.error(exception.message);
    }
}
