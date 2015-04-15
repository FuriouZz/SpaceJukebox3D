precision highp float;

varying vec2 vT0Coords;
varying vec2 vT1Coords;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform vec2 ratio;
uniform vec2 resolution;

uniform float tFade;
uniform float tScale;
uniform float aTime;

vec2 scaleUV(float value, vec2 uv) {
    vec2 scaledUV = uv;
    float scale   = 1.0 / value;
    scaledUV      *= scale;
    scaledUV      -= (scale - 1.0) * 0.5;    
    return scaledUV;
}

void main(void) {
    vec2 t0UV = scaleUV(tScale, vT0Coords);
    vec2 t1UV = scaleUV(tScale, vT1Coords);

    float tmove   = cos(aTime * 0.5);     


    float move    = clamp(tmove, 0.0, 1.0) * (1.0 / tScale);
    vec2 position = t0UV;
    position.y   += move;

    vec4 c = texture2D(texture0, position);

    if (position.y > 1.0) {
        position    = t1UV;
        position.y += move;
        position.y += move - (1.0 / tScale) * 2.0;        

        c = texture2D(texture1, position);
    }

    if (position.x < 0.0 || position.x > 1.0 || position.y < 0.0 || position.y > 1.0) {
        float p       = clamp(1.0 - tmove, 0.0, 1.0);
        float t       = (1.0 - vT0Coords.y) / p;
        float diffuse = 0.001;

        c = mix(texture2D(texture2, vT0Coords), texture2D(texture3, vT1Coords), smoothstep(1.0-diffuse, 1.0, t));
        c *= 0.5;
    }

    gl_FragColor = clamp(c, 0.0, 1.0);
}
