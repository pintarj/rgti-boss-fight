/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * Compiles the shader of a given type out of the specified source.
 * @param {number} type - The shader type (either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
 * @param {string} source - The shader source (written in GLSL).
 * @return {WebGLShader} The shader created out of given source.
 * */
function compile_shader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw ("Could not compile WebGL program: " + info);
    }

    return shader;
}

/**
 * Create a GL program linking
 * @param {WebGLShader[]} shaders - The shaders to link in the program.
 * @param {Object[]} attributes_bind_locations - If specified: the function will bound the attributes to the specified
 *    locations. This parameter is not required.
 * @return {WebGLProgram} The WebGL program created out of parameters.
 * */
function create_program(shaders, attributes_bind_locations) {
    var program = gl.createProgram();

    shaders.forEach(function(shader) {
        gl.attachShader(program, shader);
    });

    if (attributes_bind_locations) {
        attributes_bind_locations.forEach(function(attribute_bind_location) {
            gl.bindAttribLocation(program, attribute_bind_location.index, attribute_bind_location.name);
        });
    }

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program: ' + info;
    }

    shaders.forEach(function(shader) {
        gl.detachShader(program, shader);
    });

    return program;
}
