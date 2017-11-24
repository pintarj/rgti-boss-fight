precision mediump float;

uniform sampler2D texture;

varying vec3 color;
varying highp vec2 varyingTex;

void main() {
    vec4 texColor = texture2D(texture, varyingTex);
    gl_FragColor = vec4(color, 1.0) + 0.7 * texColor;
}
