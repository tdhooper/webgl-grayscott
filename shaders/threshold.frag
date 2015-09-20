precision mediump float;

uniform vec2 resolution;
uniform float threshold;
uniform sampler2D u_texture;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 origin = texture2D( u_texture, uv );
    float value = origin.g > threshold ? 1.0 : 0.0;
    gl_FragColor = vec4(value, value, value, 1.0);
}