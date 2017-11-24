"use strict";

/**
 * Create a SceneObject.
 * @param {string} modelName - The name of the model that incarnate this object.
 * @param {string} programName - The name of the program used to draw this object's model.
 * @param {string} textureName - The name of the texture applied on this object's model.
 * */
function SceneObject(modelName, programName, textureName) {
    this.position = [0, 0, 0];
    this.model = models[modelName];
    this.program = programs[programName];
    this.texture = textureName === undefined ? undefined : textures[textureName];
}

/**
 * Set the object position.
 * @param {Array} position - A 3.dimensional array that represent the position.
 * @return {undefined}
 * */
SceneObject.prototype.setPosition = function (position) {
    this.position = position;
};

/**
 * Calculate the view matrix for this scene object.
 * @return {mat4}
 * */
SceneObject.prototype.calculateViewMatrix = function () {
    var matrix = mat4.create();
    mat4.translate(matrix, matrix, this.position);
    return matrix;
};

SceneObject.prototype.distance2DFrom = function(object) {
    var x = this.position[0] - object.position[0];
    var z = this.position[2] - object.position[2];
    return Math.sqrt(x * x + z * z);
};

/**
 * Draws the object.
 * @return {undefined}
 * */
SceneObject.prototype.draw = function () {
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(this.program);

    var mvMatrix = this.calculateViewMatrix();
    gl.uniformMatrix4fv(this.program.mvMatrixUniformLocation, false, mvMatrix);

    if (this.program.nMatrixUniformLocation) {
        var nMatrix = mat3.create();
        mat3.fromMat4(nMatrix, mvMatrix);
        mat3.invert(nMatrix, nMatrix);
        mat3.transpose(nMatrix, nMatrix);
        gl.uniformMatrix3fv(this.program.nMatrixUniformLocation, false, nMatrix);
    }

    var stride = (6 + (this.model.hasUVs ? 2 : 0)) * 4;

    this.model.bindArrayBuffer();
    gl.enableVertexAttribArray(this.program.vertexAttributeLocation);
    gl.vertexAttribPointer(this.program.vertexAttributeLocation, 3, gl.FLOAT, false, stride, 0);

    if (this.program.texAttributeLocation) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.program.textureUniformLocation, 0);
        gl.enableVertexAttribArray(this.program.texAttributeLocation);
        gl.vertexAttribPointer(this.program.texAttributeLocation, 3, gl.FLOAT, false, stride, 3 * 4);
    }

    if (this.program.normalAttributeLocation) {
        gl.enableVertexAttribArray(this.program.normalAttributeLocation);
        gl.vertexAttribPointer(this.program.normalAttributeLocation, 3, gl.FLOAT, false, stride, stride - 3 * 4);
    }

    this.model.bindElementArrayBuffer();
    gl.drawElements(gl.TRIANGLES, this.model.elementsCount, gl.UNSIGNED_SHORT, null);
};
