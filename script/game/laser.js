
/**
 * Create a Laser object.
 * */
function Laser() {
    SceneObject.call(this, 'laser', 'janez');
    this.setPosition([0, 0, 0]); // not considered in "calculateViewMatrix"
    this.orientation = 0;
    this.length = 100;
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
    var matrix = mat4.create();
    mat4.rotateY(matrix, matrix, -this.orientation);
    var randomScale = 1;
    mat4.scale(matrix, matrix, [randomScale, randomScale, this.length]);
    return matrix;
};
