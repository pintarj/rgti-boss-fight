
/**
 * Create a Column object.
 * */
function Column(distance, angle) {
    SceneObject.call(this, 'pillar', 'janez');
    this.distance = distance;
    this.angle = angle;
    var x = +distance * Math.sin(angle / 180 * Math.PI);
    var z = -distance * Math.cos(angle / 180 * Math.PI);
    this.setPosition([x, 0, z]);
}

/**
 * Inherit SceneObject.
 * */
Column.prototype = Object.create(SceneObject.prototype);

/**
 * Correct the constructor pointer because it points to Column.
 */
Column.prototype.constructor = Column;
