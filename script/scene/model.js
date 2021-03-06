"use strict";

/**
 * Parse the specified OBJ source and creates the appropriate GL array and element-array buffers.
 * @param {string} source - The OBJ source.
 * */
function Model(source) {
    var lines = source.split(/\r?\n/);
    var vertices = [];
    var normals = [];
    var tex = [];
    var virtualFaces = [];
    var elements = [];

    var virtualFace = function (name) {
        var index = elements.indexOf(name);

        if (index === -1) {
            index = elements.length;
            elements.push(name);
        }

        return index;
    };

    var parseFace = function(atom) {
        var face = [];
        face.push(Number(atom[0]) - 1);
        face.push(atom[1] ? Number(atom[1]) - 1 : undefined);
        face.push(atom[2] ? Number(atom[2]) - 1 : undefined);
        return face;
    };

    lines.forEach(function (line) {
        var atoms = line.trim().split(/\s+/);

        switch (atoms[0]) {
            case "v": {
                var x = Number(atoms[1]);
                var y = Number(atoms[2]);
                var z = Number(atoms[3]);
                vertices.push([x, y, z]);
                break;
            }

            case "vn": {
                var nx = Number(atoms[1]);
                var ny = Number(atoms[2]);
                var nz = Number(atoms[3]);
                normals.push([nx, ny, nz]);
                break;
            }

            case "vt": {
                var t = Number(atoms[1]);
                var s = Number(atoms[2]);
                tex.push([t, s]);
                break;
            }

            case "f": {
                var a = virtualFace(atoms[1]);
                var b = virtualFace(atoms[2]);
                var c = virtualFace(atoms[3]);
                virtualFaces.push([a, b, c]);
                break;
            }
        }
    });

    var arrayBufferData = [];

    elements.forEach(function (element) {
        var parsed = parseFace(element.split(/\//));
        var vertex_index = parsed[0];
        var texture_index = parsed[1];
        var normal_index = parsed[2];
        arrayBufferData.push.apply(arrayBufferData, vertices[vertex_index]);

        if (texture_index !== undefined)
            arrayBufferData.push.apply(arrayBufferData, tex[texture_index]);

        if (normal_index !== undefined)
            arrayBufferData.push.apply(arrayBufferData, normals[normal_index]);
    });

    var arrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayBufferData), gl.STATIC_DRAW);

    var elementArrayBufferData = [];

    virtualFaces.forEach(function (face) {
        elementArrayBufferData.push.apply(elementArrayBufferData, face)
    });

    var elementArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementArrayBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementArrayBufferData), gl.STATIC_DRAW);

    this.arrayBuffer = arrayBuffer;
    this.elementArrayBuffer = elementArrayBuffer;
    this.elementsCount = elementArrayBufferData.length;
    this.hasUVs = tex.length > 0;
    this.hasNormals = normals.length > 0;
}

/**
 * Bind the "array buffer" of this model to the ARRAY_BUFFER target.
 * @return {undefined}
 * */
Model.prototype.bindArrayBuffer = function () {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer);
};

/**
 * Bind the "element array buffer" of this model to the ELEMENT_ARRAY_BUFFER target.
 * @return {undefined}
 * */
Model.prototype.bindElementArrayBuffer = function () {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementArrayBuffer);
};


/**
 * The array that contains all models asserts names to load at boot.
 * */
var modelsNames = [
    'cube',
    'cthun-uv',
    'pillar',
    'hero',
    'laser',
    'cthun-base',
    'arena'
];

/**
 * The "asserts loaded" counter for the models loading.
 * @type {AssetLoadedCounter}
 * */
var modelLoadingCounter;

/**
 * The collection (a map) that will store the models.
 * */
var models = {};

/**
 * Starts loading models assets asynchronously. This function is called at boot.
 * */
function startLoadingModels() {
    modelLoadingCounter = new AssetLoadedCounter(modelsNames.length, function () {
        assetsLoading.increment();
    });

    modelsNames.forEach(function (name) {
        loadAsset(name + '.obj', function (source) {
            models[name] = new Model(source);
            modelLoadingCounter.increment();
        });
    });
}
