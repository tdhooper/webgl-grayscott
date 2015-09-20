precision mediump float;

uniform vec2 resolution;
uniform sampler2D u_sample_small;
uniform sampler2D u_sample_large;
uniform float time;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 position = uv;
    float substrate = 0.0;

    vec4 radiusA = texture2D(u_sample_small, uv);
    vec4 radiusB = texture2D(u_sample_large, uv);

    float activator = radiusA.r;
    float inhibitor = radiusB.r;

    if (activator > inhibitor) {
        substrate = 1.0;
    }

    // if (inhibitor == 0.0) {
    //     float random = rand(gl_FragCoord.xy + time);
    //     if (random > 0.997) {
    //         substrate = 1.0;
    //     }
    // }

    gl_FragColor = vec4(substrate, substrate, substrate, 1.0);
}