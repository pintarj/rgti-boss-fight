"use strict";

/**
 * Create a SceneObject.
 * @param {string} modelName - The name of the model that incarnate this object.
 * @param {string} programName - The name of the program used to draw this object's model.
 * */
function SceneObject(modelName, programName) {
    this.position = [0, 0, 0];
    this.model = models[modelName];
    this.program = programs[programName];
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

/**
 * Draws the object.
 * @return {undefined}
 * */
SceneObject.prototype.draw = function () {
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(this.program);

    var mvMatrix = this.calculateViewMatrix();
    var nMatrix = mat3.create();
    mat3.fromMat4(nMatrix, mvMatrix);
    mat3.invert(nMatrix, nMatrix);
    mat3.transpose(nMatrix, nMatrix);
    gl.uniformMatrix4fv(this.program.mvMatrixUniformLocation, false, mvMatrix);
    gl.uniformMatrix3fv(this.program.nMatrixUniformLocation, false, nMatrix);

    this.model.bindArrayBuffer();
    gl.enableVertexAttribArray(this.program.vertexAttributeLocation);
    gl.vertexAttribPointer(this.program.vertexAttributeLocation, 3, gl.FLOAT, false, 6 * 4, 0);

    gl.enableVertexAttribArray(this.program.normalAttributeLocation);
    gl.vertexAttribPointer(this.program.normalAttributeLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

    this.model.bindElementArrayBuffer();
    gl.drawElements(gl.TRIANGLES, this.model.elementsCount, gl.UNSIGNED_SHORT, null);
};
