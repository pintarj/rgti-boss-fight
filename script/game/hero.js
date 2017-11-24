
/**
 * Create a Hero object.
 * */
function Hero() {
    SceneObject.call(this, 'hero', 'arena-tex', 'hero-tex');
    this.angle = 0;
    this.distance = 0;
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

/**
 * Sets the hero position.
 * @param {Array} position - The hero position.
 * @return {undefined}
 * */
Hero.prototype.setPosition = function (position) {
    SceneObject.prototype.setPosition.call(this, position);
    var x = this.position[0];
    var z = this.position[2];
    this.distance = vec3.length([x, 0, z]);
    this.angle = (Math.PI + Math.atan2(-x, z)) % (2 * Math.PI);
};


/**
 * Tells if the hero is on a specified angle.
 * @param {number} angle - The angle to test.
 * @return {boolean} true if the hero is on angle, false otherwise
 */
Hero.prototype.isOnAngle = function(angle) {
    var offsetAngle = Math.atan2(0.5, this.distance);
    var startAngle = this.angle - offsetAngle;
    var stopAngle = this.angle + offsetAngle;
    return angle >= startAngle && angle <= stopAngle;
};
