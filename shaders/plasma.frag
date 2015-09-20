precision mediump float;

uniform vec2 resolution;
uniform float time;

void main() {
    float t = time;
    vec2 uv = gl_FragCoord.xy / resolution;
    float color = 0.0;
    // lifted from glslsandbox.com
    color += sin( uv.x * cos( t / 3.0 ) * 60.0 ) + cos( uv.y * cos( t / 2.80 ) * 10.0 );
    color += sin( uv.y * sin( t / 2.0 ) * 40.0 ) + cos( uv.x * sin( t / 1.70 ) * 40.0 );
    color += sin( uv.x * sin( t / 1.0 ) * 10.0 ) + sin( uv.y * sin( t / 3.50 ) * 80.0 );
    color *= sin( t / 10.0 ) * 0.5;

    gl_FragColor = vec4( vec3( color * 0.5, sin( color + t / 2.5 ) * 0.75, color ), 1.0 );
}