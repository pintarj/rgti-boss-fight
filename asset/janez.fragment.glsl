precision mediump float;

varying vec3 color;

void main() {
    gl_FragColor = 0.5 * vec4(1, 1, 1, 1) + 0.5 * vec4(color, 1.0);
}
