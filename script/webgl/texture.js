/*
 * Enable the JavaScript Strict Mode: changes previously accepted "bad syntax" into real errors.
 */
"use strict";

/**
 * Create a GL texture with the given image.
 * @param {Image} image - The given loaded image.
 * @return {WebGLTexture} The created texture.
 * */
function createTexture(image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
}

/**
 * The array that contains all textures asserts names to load at boot.
 * */
var textureNames = [
    'cthun-tex',
    'hero-tex'
];

/**
 * The collection (a map) that will store the loaded textures.
 * */
var textures = {};

/**
 * The "asserts loaded" counter for the textures loading.
 * @type {AssetLoadedCounter}
 * */
var textureLoadingCounter;

/**
 * Starts loading textures assets asynchronously. This function is called at boot.
 * */
function startLoadingTextures() {

    textureLoadingCounter = new AssetLoadedCounter(textureNames.length, function () {
        assetsLoading.increment();
    });

    textureNames.forEach(function (name) {
        loadAsset(name + '.png', function (image) {
            textures[name] = createTexture(image);
            textureLoadingCounter.increment();
        });
    });
}
