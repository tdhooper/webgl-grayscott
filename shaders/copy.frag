precision mediump float;

uniform vec2 resolution;
uniform sampler2D u_texture;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 origin = texture2D( u_texture, uv );
    vec4 new = vec4(1.0, 1.0, 0.0, 1.0);
    gl_FragColor = mix(origin, new, 0.3);
}