// FROM https://github.com/pmneila/jsexp

precision mediump float;

uniform vec2 resolution;
uniform sampler2D tSource;
uniform sampler2D tLapl;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.3846153846) * direction;
    vec2 off2 = vec2(3.2307692308) * direction;
    color += texture2D(image, uv) * 0.2270270270;
    color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
    color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
    color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
    color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
    return color;
}

vec4 blur2(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec2 off = direction / resolution;
    vec4 color = texture2D(image, uv);
    vec4 uv0 = texture2D(image, uv + off);
    vec4 uv1 = texture2D(image, uv - off);
    return (uv0 + uv1 - 2.0 * color);
}

vec4 blur3(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec2 off1 = direction / resolution;
    vec2 off2 = 2.0 * direction / resolution;
    vec4 color = texture2D(image, uv);
    vec4 uv0 = texture2D(image, uv + off1);
    vec4 uv1 = texture2D(image, uv - off1);
    vec4 uv2 = texture2D(image, uv + off2);
    vec4 uv3 = texture2D(image, uv - off2);
    return (uv0 + uv1 + uv2 + uv3 - 4.0 * color);
}

vec4 blurNX(sampler2D image, vec2 uv, vec2 resolution, int n) {
    
    vec4 color = vec4(0.0);
    vec2 offX;
    vec2 offY;

    for (int i = 1; i < 64; i++) {
        if (i > n) { break; }
        offX = float(i) * vec2(1.0, 0.0) / resolution;
        // offY = float(i) * vec2(0.0, 1.0) / resolution;
        color += texture2D(image, uv + offX);
        color += texture2D(image, uv - offX);
        // color += texture2D(image, uv + offY);
        // color += texture2D(image, uv - offY);
    }

    vec4 original = texture2D(image, uv);
    return color - float(n * 2) * original;
}


vec4 blurN(sampler2D image, vec2 uv, vec2 resolution, int n) {
    
    vec4 color = vec4(0.0);
    vec2 offX;
    vec2 offY;

    for (int i = 0; i < 64; i++) {
        if (i >= n) { break; }
        offX = float(i + 1) * vec2(1.0, 0.0) / resolution;
        offY = float(i + 1) * vec2(0.0, 1.0) / resolution;
        color += texture2D(image, uv + offX);
        color += texture2D(image, uv - offX);
        color += texture2D(image, uv + offY);
        color += texture2D(image, uv - offY);
    }

    vec4 original = texture2D(image, uv);
    return color - float(n * 4) * original;
}

vec4 blur2(sampler2D image, vec2 uv, vec2 resolution, vec2 direction, int n) {
    
    vec2 off;
    off = float(1) * direction / resolution;
    vec4 uvX = vec4(0.0);
    vec4 uv0 = texture2D(image, uv + off);
    vec4 uv1 = texture2D(image, uv - off);
    vec4 color = texture2D(image, uv);
    return uvX + uv0 + uv1 - 2.0 * color;
}

void main() {
    vec2 vUv = gl_FragCoord.xy / resolution;

    gl_FragColor = blurN(tSource, vUv, resolution * 2.0, 1);
    // gl_FragColor = blur2(tSource, vUv, resolution * 2.0, vec2(1.0, 0.0), 1);

    // float step_x = 1.0 / resolution.x;
    // float step_y = 1.0 / resolution.y; // Resolution

    // vec4 uv = texture2D(tSource, vUv);

    // vec4 uv0 = texture2D(tSource, vUv+vec2(-step_x, 0.0));
    // vec4 uv1 = texture2D(tSource, vUv+vec2(step_x, 0.0));
    // vec4 uv2 = texture2D(tSource, vUv+vec2(0.0, -step_y));
    // vec4 uv3 = texture2D(tSource, vUv+vec2(0.0, step_y));

    // vec4 lapl = (uv0 + uv1 + uv2 + uv3 - 4.0*uv);

    // gl_FragColor = lapl;
}


