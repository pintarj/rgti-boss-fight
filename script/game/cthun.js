
/**
 * Create a Cthun object.
 * */
function Cthun() {
    SceneObject.call(this, 'cthun', 'janez');
    this.setPosition([0, 0, 0]);
    this.speed = 2 * Math.PI / 1; // one turn every 10s
    this.orientation = 0;
    this.laser = new Laser();
}

/**
 * Inherit SceneObject.
 * */
Cthun.prototype = Object.create(SceneObject.prototype);

/**
 * Correct the constructor pointer because it points to Hero.
 */
Cthun.prototype.constructor = Cthun;

/**
 * Calculate the Cthun's view matrix.
 * @return {mat4}
 * */
Cthun.prototype.calculateViewMatrix = function () {
    var matrix = SceneObject.prototype.calculateViewMatrix.call(this);
    mat4.rotateY(matrix, matrix, -this.orientation);
    return matrix;
};

Cthun.prototype.draw = function() {
    SceneObject.prototype.draw.call(this);
    this.laser.draw();
};
