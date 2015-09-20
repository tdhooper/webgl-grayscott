precision mediump float;

uniform vec2 resolution;
uniform float time;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // bool on = length(vec2(0.5, 0.5)*resolution-gl_FragCoord.xy) > 20.;
    bool on = rand(gl_FragCoord.xy) > 0.01;
    if (on) {
        gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    } else {
        gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );
    }
}