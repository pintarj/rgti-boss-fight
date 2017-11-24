
/**
 * Create a Hero object.
 * */
function Hero() {
    SceneObject.call(this, 'hero', 'janez');
    this.setPosition([5, 0, 55]);
    this.speed = 5;
    this.orientation = 0;
}

/**
 * Inherit SceneObject.
 * */
Hero.prototype = Object.create(SceneObject.prototype);

/**
 * Correct the constructor pointer because it points to Hero.
 */
Hero.prototype.constructor = Hero;

/**
 * Calculate the hero's view matrix.
 * @return {mat4}
 * */
Hero.prototype.calculateViewMatrix = function () {
    var matrix = SceneObject.prototype.calculateViewMatrix.call(this);
    mat4.rotateY(matrix, matrix, -this.orientation);
    return matrix;
};
