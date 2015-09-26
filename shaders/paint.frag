precision mediump float;

uniform vec2 resolution;
uniform float threshold;
uniform float hue;
uniform sampler2D u_texture;
uniform sampler2D u_texture_blur;
uniform sampler2D u_texture_mask;


// From http://www.opengl.org/discussion_boards/showthread.php/180866-Modifying-Hue-value-with-GLSL
vec3 RGBToHSL(vec3 color)
{
    vec3 hsl; // init to 0 to avoid warnings ? (and reverse if + remove first part)

    float fmin = min(min(color.r, color.g), color.b); //Min. value of RGB
    float fmax = max(max(color.r, color.g), color.b); //Max. value of RGB
    float delta = fmax - fmin; //Delta RGB value

    hsl.z = (fmax + fmin) / 2.0; // Luminance

    if (delta == 0.0)    //This is a gray, no chroma...
    {
        hsl.x = 0.0;    // Hue
        hsl.y = 0.0;    // Saturation
    }
    else //Chromatic data...
    {
        if (hsl.z < 0.5)
            hsl.y = delta / (fmax + fmin); // Saturation
        else
            hsl.y = delta / (2.0 - fmax - fmin); // Saturation

        float deltaR = (((fmax - color.r) / 6.0) + (delta / 2.0)) / delta;
        float deltaG = (((fmax - color.g) / 6.0) + (delta / 2.0)) / delta;
        float deltaB = (((fmax - color.b) / 6.0) + (delta / 2.0)) / delta;

        if (color.r == fmax )
            hsl.x = deltaB - deltaG; // Hue
        else if (color.g == fmax)
            hsl.x = (1.0 / 3.0) + deltaR - deltaB; // Hue
        else if (color.b == fmax)
            hsl.x = (2.0 / 3.0) + deltaG - deltaR; // Hue

        if (hsl.x < 0.0)
            hsl.x += 1.0; // Hue
        else if (hsl.x > 1.0)
            hsl.x -= 1.0; // Hue
    }

    return hsl;
}


float HueToRGB(float f1, float f2, float hue)
{
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
        float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 HSLToRGB(vec3 hsl)
{
    vec3 rgb;

    if (hsl.y == 0.0)
        rgb = vec3(hsl.z); // Luminance
    else
    {
        float f2;

        if (hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = (hsl.z + hsl.y) - (hsl.y * hsl.z);

            float f1 = 2.0 * hsl.z - f2;

            rgb.r = HueToRGB(f1, f2, hsl.x + (1.0/3.0));
            rgb.g = HueToRGB(f1, f2, hsl.x);
            rgb.b= HueToRGB(f1, f2, hsl.x - (1.0/3.0));
    }

    return rgb;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 mask = texture2D( u_texture_mask, uv );
    vec3 fill = vec3(0.0);
    vec3 fillHSL = vec3(hue, 1.0, 0.5);

    if (mask.g > threshold) {
        vec4 lastFill = texture2D( u_texture, uv );
        if (lastFill.rgb != vec3(0.0)) {
            fillHSL = RGBToHSL(lastFill.rgb);
        } else {
            vec4 blurFill = texture2D( u_texture_blur, uv );
            if (blurFill.rgb != vec3(0.0)) {
                fillHSL = RGBToHSL(blurFill.rgb);
            }
        }
        fillHSL = vec3(fillHSL.r, 1.0, 0.5);
        fill = HSLToRGB(fillHSL);
    }

    gl_FragColor = vec4(fill, 1.0);
}