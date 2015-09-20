// FROM https://github.com/pmneila/jsexp

precision mediump float;

uniform vec2 resolution;
uniform sampler2D tSource;
uniform float delta;
uniform float feed;
uniform float kill;

void main() {
    vec2 vUv = gl_FragCoord.xy / resolution;

    float step_x = 1.0 / resolution.x;
    float step_y = 1.0 / resolution.y; // Resolution

    // float feed = vUv.y * 0.083;
    // float kill = vUv.x * 0.073;

    vec2 uv = texture2D(tSource, vUv).rg;
    vec2 uv0 = texture2D(tSource, vUv+vec2(-step_x, 0.0)).rg;
    vec2 uv1 = texture2D(tSource, vUv+vec2(step_x, 0.0)).rg;
    vec2 uv2 = texture2D(tSource, vUv+vec2(0.0, -step_y)).rg;
    vec2 uv3 = texture2D(tSource, vUv+vec2(0.0, step_y)).rg;

    vec2 lapl = (uv0 + uv1 + uv2 + uv3 - 4.0*uv);//10485.76;

    float A = uv.r;
    float B = uv.g;

    float dist = 1.0 - distance(vec2(0.5), vUv) * 2.0;
    dist = (dist * 0.5) + 0.1;
    dist = 1.0 - cos(dist * 3.14159265359);
    // float dist = vUv.x;
    float delta = delta * 0.25;
    float diffustionRate = 0.5 + dist * 4.0;

    float diffuseA = 0.2097 * diffustionRate;
    float diffuseB = 0.105 * diffustionRate;

    float laplA = lapl.r;
    float laplB = lapl.g;

    float reaction = A * B * B;

    float feed = feed * 1.0;
    float kill = kill * 1.0;

    float du = diffuseA * laplA - reaction + feed * (1.0 - A);
    float dv = diffuseB * laplB + reaction - (kill + feed) * B;
    
    float newA = A + du * delta;
    float newB = B + dv * delta;

    gl_FragColor = vec4(newA, newB, 0.0, 1.0);
}
