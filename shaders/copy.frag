precision mediump float;

uniform vec2 resolution;
uniform float threshold;
uniform sampler2D u_texture;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 origin = texture2D( u_texture, uv );
    gl_FragColor = origin;
}