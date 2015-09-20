precision mediump float;

uniform vec2 resolution;
uniform sampler2D u_texture;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    // const float steps = 2.0;
    // float stepSize = 20.0 / resolution.y;

    // vec4 average = texture2D( u_texture, uv );

    // for (float i = 0.0; i < steps; i++) {
    //     vec4 up = texture2D( u_texture, uv + vec2(0.0, stepSize * (i * -1.0)) );
    //     vec4 down = texture2D( u_texture, uv + vec2(0.0, stepSize * i) );
    //     float blend = ((steps - i) / steps) * 0.2;
    //     average = mix(average, up, blend);
    //     average = mix(average, down, blend);
    // }

    // // average /= steps * 2.0;
    // gl_FragColor = average;

    //this will be our RGBA sum
    vec4 sum = vec4(0.0);

    //our original texcoord for this fragment
    vec2 tc = uv;

    vec2 dir = vec2(1.0, 0.0);

    //the amount to blur, i.e. how far off center to sample from 
    //1.0 -> blur by one pixel
    //2.0 -> blur by two pixels, etc.
    float blur = 5.0 / resolution.x;

    //the direction of our blur
    //(1.0, 0.0) -> x-axis blur
    //(0.0, 1.0) -> y-axis blur
    float hstep = dir.x;
    float vstep = dir.y;

    //apply blurring, using a 9-tap filter with predefined gaussian weights

    sum += texture2D(u_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
    sum += texture2D(u_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
    sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
    sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;

    sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.2270270270;

    sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
    sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
    sum += texture2D(u_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
    sum += texture2D(u_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;

    //discard alpha for our simple demo, multiply by vertex color and return
    gl_FragColor = vec4(sum.rgb, 1.0);
}