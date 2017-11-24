
attribute vec3 vertex;
attribute vec3 normal;

uniform mat4 pMatrix;
uniform mat4 mvMatrix;
uniform mat3 nMatrix;
uniform vec3 laserDirection;

varying vec3 color;

const vec3 lightPosition = vec3(0.0, 20.0, 0.0);

void main()
{
    vec4 mvVertex = mvMatrix * vec4(vertex, 1.0);
    gl_Position = pMatrix * mvVertex;

    vec3 toLight = lightPosition - mvVertex.xyz;
    float toLightDistance = length(toLight);
    vec3 mvNormal = nMatrix * normal;
    float factor = 0.5 + dot(normalize(toLight), mvNormal) / 2.0;
    vec3 ambient = 0.0 * vec3(1.0, 1.0, 1.0);
    vec3 diffuse = factor * vec3(1.0, 1.0, 1.0) * 140.0 / (toLightDistance * toLightDistance);

    vec3 laserL = vec3(0.0, 0.0, 0.0);
    float dotP = dot(laserDirection.xz, mvVertex.xz);

    if (dotP >= 0.0)
    {
        vec3 distanceVector = (dotP * laserDirection + vec3(0.0, 2.0, 0.0)) - mvVertex.xyz;
        float distance = length(distanceVector);
        float channel = min(1.0, max(0.0, dot(distanceVector, mvNormal)));
        laserL.x = 5.0 * channel / (distance * distance);
    }

    color = ambient + diffuse + laserL;
}
