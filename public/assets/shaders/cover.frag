precision highp float;

varying vec2 vUv;

uniform sampler2D texture0;
uniform sampler2D texture1;

uniform float tFade;
uniform float tScale;

void main(void) {
    vec2 uv = vUv;

    float scale   = 1.0 / tScale;

    vec2 scaledUV = uv;
    scaledUV      *= scale;
    scaledUV      -= (scale - 1.0) * 0.5;

    vec4 c       = mix(texture2D(texture1, uv), texture2D(texture0, scaledUV), tFade);
    if (scaledUV.x < 0.0 || scaledUV.x > 1.0 || scaledUV.y < 0.0 || scaledUV.y > 1.0) {
        c = texture2D(texture1, uv);
    }

    gl_FragColor = clamp(c, 0.0, 1.0);
}
