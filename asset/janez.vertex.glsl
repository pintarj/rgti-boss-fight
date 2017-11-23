
attribute vec3 vertex;
attribute vec3 normal;

uniform mat4 mvp;

varying vec3 color;

void main() {
    const vec3 lightPosition = vec3(0, 20, 0);
    vec3 toLight = normalize(lightPosition - vertex);
    float factor = dot(toLight, normal);
    color = factor * vec3(1, 1, 1);
    gl_Position = mvp * vec4(vertex, 1.0);
}
