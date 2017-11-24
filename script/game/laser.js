
/**
 * Create a Laser object.
 * */
function Laser() {
    SceneObject.call(this, 'laser', 'laser');
    this.setPosition([0, 4, 0]);
    this.orientation = 0;
    this.length = 100;
    this.flickering = 0;
}

/**
 * Inherit SceneObject.
 * */
Laser.prototype = Object.create(SceneObject.prototype);

/**
 * Correct the constructor pointer because it points to Laser.
 */
Laser.prototype.constructor = Laser;

/**
 * Calculate the laser's view matrix.
 * @return {mat4}
 * */
Laser.prototype.calculateViewMatrix = function () {
    var matrix = SceneObject.prototype.calculateViewMatrix.call(this);
    mat4.rotateY(matrix, matrix, -this.orientation);
    mat4.rotateX(matrix, matrix, -0.03);
    var randomScale = 1 + this.flickering / 2.0;
    mat4.scale(matrix, matrix, [randomScale, 2.2 * randomScale, this.length]);
    return matrix;
};

Laser.prototype.draw = function () {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    SceneObject.prototype.draw.call(this);
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
};
