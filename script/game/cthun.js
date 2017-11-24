
/**
 * Create a Cthun object.
 * */
function Cthun() {
    SceneObject.call(this, 'cthun-uv', 'arena-tex', 'cthun-tex');
    this.setPosition([0, 1.3, 0]);
    this.speed = 2 * Math.PI;
    this.orientation = 0;
    this.laser = new Laser();
    this.base = new SceneObject('cthun-base', 'janez');
    this.base.setPosition([0, 0, 0]);
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
    this.base.draw();
    this.laser.draw();
};
