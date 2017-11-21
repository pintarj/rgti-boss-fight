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
function compileShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
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
function createProgram(shaders, attributes_bind_locations) {
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

/**
 * The array that contains all shaders asserts names to compile at boot.
 * */
var shadersNames = [
    "janez.fragment",
    "janez.vertex"
];

/**
 * The collection (a map) that will store the compiled shaders.
 * */
var shaders = {};

/**
 * The "asserts loaded"counter for the shaders loading.
 * @type {AssetLoadedCounter}
 * */
var shadersLoadingCounter;

/**
 * Starts loading shaders assets asynchronously. This function is called at boot.
 * */
function startLoadingShaders() {

    shadersLoadingCounter = new AssetLoadedCounter(shadersNames.length, startCreatingPrograms);

    shadersNames.forEach(function (name) {
        loadAsset(name + '.glsl', function (source) {
            var type = name.endsWith('vertex') ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
            shaders[name] = compileShader(type, source);
            shadersLoadingCounter.increment();
        });
    });
}

var programsStructures = [
    {
        name: 'janez',
        vertexShader: 'janez.vertex',
        fragmentShader: 'janez.fragment',
        attributes: [
            'vertex'
        ],
        uniforms: [
            'mvp'
        ]
    }
];

/**
 * The collection (a map) that will store the linked programs.
 * */
var programs = {};

/**
 * Create the GL programs. This function is invoked after all the shaders are compiled.
 * */
function startCreatingPrograms() {
    programsStructures.forEach(function (structure) {
        var program = createProgram([
            shaders[structure.vertexShader],
            shaders[structure.fragmentShader]
        ]);

        program['name'] = structure.name;

        structure.attributes.forEach(function (attribute) {
            var objectAttributeName = attribute + 'AttributeLocation';
            program[objectAttributeName] = gl.getAttribLocation(program, attribute);
        });

        structure.uniforms.forEach(function (uniform) {
            var objectAttributeName = uniform + 'UniformLocation';
            program[objectAttributeName] = gl.getUniformLocation(program, uniform);
        });

        programs[program.name] = program;
    });
}
