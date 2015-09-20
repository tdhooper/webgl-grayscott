// FROM https://github.com/mattdesl/lwjgl-basics/wiki/ShaderLesson5

precision mediump float;

uniform vec2 resolution;
uniform sampler2D u_texture;
uniform float ammount;
uniform vec2 dir;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    //this will be our RGBA sum
    vec4 sum = vec4(0.0);

    //our original texcoord for this fragment
    vec2 tc = uv;

    float hblur = ammount / resolution.x;
    float vblur = ammount / resolution.y;

    //the direction of our blur
    //(1.0, 0.0) -> x-axis blur
    //(0.0, 1.0) -> y-axis blur
    float hstep = dir.x;
    float vstep = dir.y;

    //apply blurring, using a 9-tap filter with predefined gaussian weights

    sum += texture2D(u_texture, vec2(tc.x - 4.0*hblur*hstep, tc.y - 4.0*vblur*vstep)) * 0.0162162162;
    sum += texture2D(u_texture, vec2(tc.x - 3.0*hblur*hstep, tc.y - 3.0*vblur*vstep)) * 0.0540540541;
    sum += texture2D(u_texture, vec2(tc.x - 2.0*hblur*hstep, tc.y - 2.0*vblur*vstep)) * 0.1216216216;
    sum += texture2D(u_texture, vec2(tc.x - 1.0*hblur*hstep, tc.y - 1.0*vblur*vstep)) * 0.1945945946;

    sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.2270270270;

    sum += texture2D(u_texture, vec2(tc.x + 1.0*hblur*hstep, tc.y + 1.0*vblur*vstep)) * 0.1945945946;
    sum += texture2D(u_texture, vec2(tc.x + 2.0*hblur*hstep, tc.y + 2.0*vblur*vstep)) * 0.1216216216;
    sum += texture2D(u_texture, vec2(tc.x + 3.0*hblur*hstep, tc.y + 3.0*vblur*vstep)) * 0.0540540541;
    sum += texture2D(u_texture, vec2(tc.x + 4.0*hblur*hstep, tc.y + 4.0*vblur*vstep)) * 0.0162162162;

    //discard alpha for our simple demo, multiply by vertex color and return
    gl_FragColor = vec4(sum.rgb, 1.0);
}