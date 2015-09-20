precision mediump float;

uniform vec2 resolution;
uniform sampler2D u_texture;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 origin = texture2D( u_texture, uv );
    gl_FragColor = origin * 10000000.;
    // gl_FragColor = vec4(0.5, 1.0, 0.0, 1.0);
}