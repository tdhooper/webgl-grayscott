precision mediump float;

uniform vec2 resolution;
uniform vec2 direction;
uniform sampler2D u_texture;

vec4 blurSingleDirection(vec4 color, sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    int steps = 4;
    int n = 1;
    vec4 adj;
    int loop = 64;
    for (int i = 0 ; i < 64 ; i++) {
        if (i > steps) {
            break;
        }
        adj = texture2D(image, uv + (direction / resolution) * float(i + 1));
        if (adj.rgb == vec3(0.0)) {
            break;
        }
        color += adj;
        n += 1;
    }
    return color /= float(n);
}

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    int n = 1;
    vec4 color = texture2D(image, uv);
    color = blurSingleDirection(color, image, uv, resolution, direction);
    color = blurSingleDirection(color, image, uv, resolution, direction * -1.0);
    return color;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    gl_FragColor = blur(u_texture, uv, resolution, direction);
}
