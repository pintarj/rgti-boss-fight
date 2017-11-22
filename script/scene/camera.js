
/**
 * Constructor for the Camera class.
 * */
function SceneCamera()
{
    this.position = [20, 20, 20];
    this.center = [0, 0, -1];
    this.fov = 45;
}

/**
 * Set the position at which the camera stays.
 * @param {Array} position - A 3.dimensional vector that represent the position.
 * */
SceneCamera.prototype.setPosition = function (position) {
    this.position = position;
};

/**
 * Set the position at which the camera is looking at.
 * @param {Array} center - A 3.dimensional vector that represent the position.
 * */
SceneCamera.prototype.lookAt = function (center) {
    this.center = center;
};

/**
 * Set the FOV (field of view) of the camera.
 * @param {number} fov - Field of view in degrees.
 * */
SceneCamera.prototype.setFOV = function(fov) {
    this.fov = fov * Math.PI / 180;
};

/**
 * Calculates the PV matrix (projection-view) of the camera
 * @return {mat4} The PV matrix (projection-view) of the camera.
 * */
SceneCamera.prototype.calculatePVMatrix = function () {

    var projectionMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var PVMatrix = mat4.create();

    mat4.perspective(projectionMatrix, this.fov, the_canvas.width / the_canvas.height, 1.0, 100.0);
    mat4.lookAt(viewMatrix, this.position, this.center, [0, 1, 0]);
    mat4.multiply(PVMatrix, projectionMatrix, viewMatrix);

    return PVMatrix;
};
