precision mediump float;

uniform vec2 resolution;
uniform vec2 direction;
uniform sampler2D u_texture;

int n = 1;
const int loop = 64;
vec4 color;

void blurSingleDirection(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    int steps = 4;
    vec4 adj;
    for (int i = 0; i < loop; i++) {
        if (i > steps) {
            break;
        }
        adj = texture2D(image, uv + (direction / resolution) * float(i + 1));
        if (adj.rgb == vec3(0.0)) {
            break;
        }
        n += 1;
        color += adj;
    }
}

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    color = texture2D(image, uv);
    if (color.rgb == vec3(0.0)) {
        return color;
    }
    blurSingleDirection(image, uv, resolution, direction);
    blurSingleDirection(image, uv, resolution, direction * -1.0);
    return color / float(n);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    gl_FragColor = blur(u_texture, uv, resolution, direction);
}
