precision mediump float;

uniform vec2 resolution;
uniform float time;

void main() {
    if (length(vec2(0.5, 0.5)*resolution-gl_FragCoord.xy) > 50.) {
        gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
    } else {
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );    
    }
}