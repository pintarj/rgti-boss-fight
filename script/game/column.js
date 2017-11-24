
/**
 * Create a Column object.
 * */
function Column(distance, angle) {
    SceneObject.call(this, 'pillar', 'janez');
    this.distance = distance;
    this.angle = angle / 180 * Math.PI;
    var x = +distance * Math.sin(this.angle);
    var z = -distance * Math.cos(this.angle);
    this.setPosition([x, 0, z]);
    var offsetAngle = Math.atan2(1, distance);
    this.startAngle = this.angle - offsetAngle;
    this.stopAngle = this.angle + offsetAngle;
}

/**
 * Inherit SceneObject.
 * */
Column.prototype = Object.create(SceneObject.prototype);

/**
 * Correct the constructor pointer because it points to Column.
 */
Column.prototype.constructor = Column;

/**
 * Tells if the column is on a specified angle.
 * @param {number} angle - The angle to test.
 * @return {boolean} true if the column is on angle, false otherwise
 */
Column.prototype.isOnAngle = function(angle) {
    return angle >= this.startAngle && angle <= this.stopAngle;
};
