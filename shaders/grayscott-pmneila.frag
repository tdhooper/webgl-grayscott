// FROM https://github.com/pmneila/jsexp

precision mediump float;

uniform vec2 resolution;
uniform sampler2D tSource;
uniform float delta;
uniform float time;
uniform float feed;
uniform float kill;
uniform vec2 mouse;
uniform bool mousedown;

#define radius 15.0;
#define zoomRate 0.08;

vec2 zoomUv(vec2 origin) {
    float deltax = gl_FragCoord.x/resolution.x - origin.x;
    float deltay = gl_FragCoord.y/resolution.y - origin.y;
    float angleradians = atan(deltay,deltax)+3.14159265;
    float newx = gl_FragCoord.x + cos(angleradians)*zoomRate;
    float newy = gl_FragCoord.y + sin(angleradians)*zoomRate;
    vec2 positionPixel = vec2(newx,newy);
    vec2 position = positionPixel/resolution;
    return position;
}

float rand(vec2 co, float scale){
    co = vec2(float(int(co.x / scale)), float(int(co.y / scale)));
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 draw(vec4 color, vec2 origin) {
    bool inCircle = length(origin * resolution - gl_FragCoord.xy) < radius;
    if (inCircle) {
        float timestep = float(int(time * 0.1)) * 10.0;
        if (rand(gl_FragCoord.xy + timestep, 5.0) > 0.1) {
            color.g = 0.0;
        } else {
            color.g = 0.5;
        }
    }
    return color;
}

void main() {
    vec2 origin = mouse;
    vec2 vUv = zoomUv(origin);
    //vec2 vUv = gl_FragCoord.xy / resolution;

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

    float diffuseA = 0.2097;
    float diffuseB = 0.105;

    float laplA = lapl.r;
    float laplB = lapl.g;

    float reaction = A * B * B;

    float feed = feed;
    float kill = kill;

    float du = diffuseA * laplA - reaction + feed * (1.0 - A);
    float dv = diffuseB * laplB + reaction - (kill + feed) * B;

    float newA = A + du * delta;
    float newB = B + dv * delta;

    vec4 color = vec4(newA, newB, 0.0, 1.0);

    // if (mousedown) {
        color = draw(color, mouse);
    // }

    gl_FragColor = color;
}
