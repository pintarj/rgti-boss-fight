
attribute vec3 vertex;

uniform mat4 pMatrix;
uniform mat4 mvMatrix;

void main()
{
    gl_Position = pMatrix * mvMatrix * vec4(vertex, 1.0);
}
