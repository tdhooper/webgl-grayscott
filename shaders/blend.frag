precision mediump float;

uniform vec2 resolution;
uniform sampler2D u_texture_a;
uniform sampler2D u_texture_b;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 originA = texture2D( u_texture_a, uv );
    vec4 originB = texture2D( u_texture_b, uv );
    gl_FragColor = mix(originA, originB, uv.x);
}