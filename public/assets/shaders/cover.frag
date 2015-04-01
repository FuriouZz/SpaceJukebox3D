precision highp float;

varying vec2 vUv;

// #ifdef TRANSITION_1
// #else
// varying vec2 vMoves[3];
// #endif

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform vec2 resolution;

uniform float aTime;

uniform float tMove;
uniform float tScale;

#define PI 3.1415926535897932384626433832795

void main(void) {
    vec2 uv  = vUv;
    vec2 pos = resolution * uv;

    // Divide
    #ifdef TRANSITION_1
        float divSize   = 0.1;
        float direction = -1.0;

        if (mod(uv.y, divSize) > divSize * 0.5) {
            direction = 1.0;
        }

        uv.x = uv.x + max(cos(aTime), 0.0) * direction;

        if (uv.x < 0.0 || uv.x > 1.0) {
            uv.x         = uv.x + max(cos(aTime), 0.0) * -direction;
            gl_FragColor = texture2D(texture0, uv);
        } else {
            uv.x         = uv.x - max(cos(aTime), 0.0) * direction;
            gl_FragColor = texture2D(texture1, uv);
        }
    #endif

    // Circle
    #ifdef TRANSITION_2
        vec2 uvposition = uv;
        uvposition.x    = uvposition.x * (resolution.x / resolution.y);

        float dist    = distance(vec2(0.5 * (resolution.x / resolution.y), 0.5), uvposition);
        float radius  = 1.0 * max(cos(aTime), 0.0);
        float diffuse = 0.001;

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), max(smoothstep(radius-diffuse, radius, dist), 0.0));
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Left to Right
    #ifdef TRANSITION_3
        vec2 uvposition = uv;
        uvposition.x    = uvposition.x * (resolution.x / resolution.y);

        float p       = cos(aTime * 0.5) * (resolution.x / resolution.y) / uvposition.x;
        float diffuse = 0.001;

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), max(smoothstep(1.0-diffuse, 1.0, p), 0.0));
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Door
    #ifdef TRANSITION_4
        vec2 uvposition = uv;
        uvposition.x    = uvposition.x * (resolution.x / resolution.y);

        float radius  = max(cos(aTime * 0.5), 0.0);
        float p       = abs(0.5 * (resolution.x / resolution.y)  - uvposition.x) / radius;
        float diffuse = 0.001;

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), max(smoothstep(1.0-diffuse, 1.0, p), 0.0));
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Fade I/O
    #ifdef TRANSITION_5
        float p = max(0.0, cos(aTime * 0.5));

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), p);
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    #ifdef TRANSITION_6
        // float p = max(0.0, cos(aTime * 0.5));


        float ratio = 0.75 + (0.25 * (1.0 - tScale));//1.0 / (1.0 + 0.5 * max(0.0, cos(aTime * 0.5)));
        ratio       = 1.0 / ratio;

        vec2 vv = uv;
        vv      *= ratio;
        vv      -= (ratio - 1.0) * 0.5;

        float po = tMove * ratio;
        vv.y += po;

        vec4 c = texture2D(texture0, vv);
        if (vv.y > 1.0) {
            vv.y += po - ratio * 2.0;
            c = texture2D(texture1, vv);
        }

        if (vv.y > 0.0 && vv.y < 1.0 && vv.x > 0.0 && vv.x < 1.0) {

        } else {
            c = vec4(0.0, 0.0, 0.0, 1.0);
        }

        // vec4 c;
        // if (vv.y > 0.0 && vv.y < 1.0 && vv.x > 0.0 && vv.x < 1.0) {
        //     uv = vv;
        //     c = mix(texture2D(texture0, uv), texture2D(texture1, uv), p);
        // } else {
        //     c = vec4(0.0, 0.0, 0.0, 1.0);
        // }

        // vec4 c = texture2D(tex, vv);

        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Rasterization
    #ifdef TRANSITION_7
        float pixSize = clamp(abs(cos(aTime * 0.25)), 0.0001, 0.5);

        vec2 pixPos = vec2(0.5, 0.5);
        uv          = pixPos - uv;

        vec2 ratio  = ceil(uv / pixSize);
        uv          = pixSize * ratio;
        uv          = pixPos - uv;

        gl_FragColor = texture2D(texture0, uv);

    #else

        // if (uv.y > 0.5 && uv.y < 0.505 && uv.x < 0.5) {
        //     float test = 0.5 * cos(aTime * 1000.0) + 0.5 * sin(mod(uv.y, 2.0) * PI * 100.0);//clamp(sin(mod(uv.y, 2.0) * aTime * 10.0), 0.0, 1.1);
        //     uv.x -= test;
        // }

        // if (uv.x < 0.0 || uv.x > 1.0) {
            // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        // } else {
            gl_FragColor = texture2D(texture0, uv);
        // }

    #endif

}
