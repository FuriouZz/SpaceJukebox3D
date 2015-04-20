precision highp float;

varying vec2 vT0Coords;
varying vec2 vT1Coords;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D blurried0;
uniform sampler2D blurried1;
// uniform vec2 ratio;
// uniform vec2 resolution;

uniform float tMove;
uniform float tScale;
// uniform float aTime;

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


    float move    = tMove * (1.0 / tScale);
    // move          = clamp(move, 0.0, 1.0);
    vec2 position = t0UV;
    position.y   += move;

    vec4 c = texture2D(texture0, position);

    if (position.y > 1.0) {
        position    = t1UV;
        position.y += move;
        position.y += move - (1.0 / tScale) * 2.0;        

        c = texture2D(texture1, position);
    }

    if (any(lessThan(position, vec2(0.0))) || any(greaterThan(position, vec2(1.0)))) {
        float p       = clamp(1.0 - tMove, 0.0, 1.0);
        float t       = (1.0 - vT0Coords.y) / p;
        float diffuse = 0.001;

        float scale = max(tScale + 0.2, 1.0);
        t0UV = scaleUV(scale, vT0Coords);
        t1UV = scaleUV(scale, vT1Coords);

        c = mix(texture2D(blurried0, t0UV), texture2D(blurried1, t1UV), smoothstep(1.0-diffuse, 1.0, t));

        if (any(lessThan(t0UV, vec2(0.0))) || any(greaterThan(t0UV, vec2(1.0)))) {
            c = vec4(0.0);
        }

        vec2 coordMax = max(vT0Coords, vT1Coords);
        c = mix(c, vec4(0.0), smoothstep(0.0, 2.0, abs(coordMax.x - 0.5) / 0.5));
        c = mix(c, vec4(0.0), smoothstep(0.0, 2.0, abs(coordMax.y - 0.5) / 0.5));
    }

    gl_FragColor = clamp(c, 0.0, 1.0);
}
