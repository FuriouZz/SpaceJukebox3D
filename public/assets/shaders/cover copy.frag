precision highp float;

varying vec2 vUv;

// #ifdef TRANSITION_1
// #else
// varying vec2 vMoves[3];
// #endif

uniform sampler2D texture0;
uniform sampler2D texture1;

uniform vec2 resolution;
uniform vec2 size_ratio;

uniform float aTime;

uniform float tMove;
uniform float tScale;

#define PI 3.1415926535897932384626433832795

void main(void) {
    vec2 uv      = vUv;
    float aspect = resolution.x / resolution.y;
    vec2 pos = resolution * uv;

    // Divide
    #ifdef TRANSITION_1
        float divSize   = 0.1;
        float direction = -1.0;
        float t         = clamp(0.0, 1.0, tMove);

        if (mod(uv.y, divSize) > divSize * 0.5) {
            direction = 1.0;
        }

        uv.x = uv.x + t * direction;

        if (uv.x < 0.0 || uv.x > 1.0) {
            uv.x         = uv.x + t * -direction;
            gl_FragColor = texture2D(texture0, uv);
        } else {
            uv.x         = uv.x - t * direction;
            gl_FragColor = texture2D(texture1, uv);
        }
    #endif

    // Circle
    #ifdef TRANSITION_2
        vec2 uvposition = uv;
        uvposition.x    = uvposition.x * aspect;

        float dist    = distance(vec2(0.5 * aspect, 0.5), uvposition);
        float radius  = clamp(0.0, 1.0, tMove);
        float diffuse = 0.001;

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), max(smoothstep(radius-diffuse, radius, dist), 0.0));
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Sweep
    #ifdef TRANSITION_3
        vec2 uvposition = uv;
        uvposition.x    = uvposition.x * aspect;

        vec3 u_direction = vec3(1.0, 0.0, 1.0);

        float direction = max(u_direction.x * uvposition.x, u_direction.y * uvposition.y);
        float way       = clamp(0.0, 1.0, u_direction.z);

        float t       = way - clamp(0.0, 1.0, tMove);
        float p       = abs(t) * aspect / direction;
        float diffuse = 0.001;

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), max(smoothstep(1.0-diffuse, 1.0, p), 0.0));
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Door
    #ifdef TRANSITION_4
        vec2 uvposition = uv;
        uvposition.x    = uvposition.x * aspect;

        float radius  = clamp(0.0, 1.0, tMove);
        float p       = abs(0.5 * aspect  - uvposition.x) / radius;
        float diffuse = 0.001;

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), max(smoothstep(1.0-diffuse, 1.0, p), 0.0));
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Fade I/O
    #ifdef TRANSITION_5
        float p = clamp(0.0, 1.0, tMove);

        vec4 c       = mix(texture2D(texture0, uv), texture2D(texture1, uv), p);
        gl_FragColor = clamp(c, 0.0, 1.0);
    #endif

    // Fade I/O
    // #ifdef TRANSITION_5
        float t = clamp(0.0, 1.0, tMove);

        float scale   = 1.0 / tScale;

        vec2 scaledUV = uv;
        scaledUV      *= scale;
        scaledUV      -= (scale - 1.0) * 0.5;


        vec4 c       = mix(texture2D(texture0, scaledUV), texture2D(texture1, uv), t);
        if (scaledUV.x < 0.0 || scaledUV.x > 1.0 || scaledUV.y < 0.0 || scaledUV.y > 1.0) {
            c = texture2D(texture1, uv);
        }

        gl_FragColor = clamp(c, 0.0, 1.0);
    // #endif

    // // #ifdef TRANSITION_6
    //     // float p = max(0.0, cos(aTime * 0.5));

    //     float ratio = tScale;//0.75 + (0.25 * (1.0 - tScale));//1.0 / (1.0 + 0.5 * max(0.0, cos(aTime * 0.5)));
    //     ratio       = 1.0 / ratio;

    //     vec2 vv = uv;
    //     vv      *= ratio;
    //     vv      -= (ratio - 1.0) * 0.5;

    //     float po = tMove * ratio;
    //     vv.y += po;

    //     vec4 c = texture2D(texture0, vv);
    //     if (vv.y > 1.0) {
    //         vv.y += po - ratio * 2.0;


    //         c = texture2D(texture1, vv);
    //     }

    //     if (vv.y > 0.0 && vv.y < 1.0 && vv.x > 0.0 && vv.x < 1.0) {

    //     } else {
    //         // float test    = abs(cos(aTime * 0.05));
    //         // vec2 fuv      = vec2(uv.x, test);
    //         // // float diffuse = 0.001;

    //         // // vec2 uvposition = fuv;
    //         // // uvposition.x    = uvposition.x * aspect;
    //         // // float p       = abs(0.5 * aspect  - uvposition.x) / tMove;

    //         // vec2 uvposition = uv;
    //         // uvposition.x    = uvposition.x * aspect;

    //         // float p       = tMove * 1.0 / uvposition.y;
    //         // float diffuse = 0.001;

    //         // c = mix(texture2D(texture0, fuv), texture2D(texture1, fuv), smoothstep(1.0-diffuse, 1.0, p));
    //         // // c = texture2D(texture0, fuv);
    //         c = vec4(0.0, 0.0, 0.0, 0.0);
    //     }

    //     // vec4 c;
    //     // if (vv.y > 0.0 && vv.y < 1.0 && vv.x > 0.0 && vv.x < 1.0) {
    //     //     uv = vv;
    //     //     c = mix(texture2D(texture0, uv), texture2D(texture1, uv), p);
    //     // } else {
    //     //     c = vec4(0.0, 0.0, 0.0, 1.0);
    //     // }

    //     // vec4 c = texture2D(tex, vv);

    //     gl_FragColor = clamp(c, 0.0, 1.0);
    // // #endif

    // // // Rasterization
    // // #ifdef TRANSITION_7
    // //     float pixSize = clamp(abs(cos(aTime * 0.25)), 0.0001, 0.5);

    // //     vec2 pixPos = vec2(0.5, 0.5);
    // //     uv          = pixPos - uv;

    // //     vec2 ratio  = ceil(uv / pixSize);
    // //     uv          = pixSize * ratio;
    // //     uv          = pixPos - uv;

    // //     gl_FragColor = texture2D(texture0, uv);

    // // #else

    // //     // if (uv.y > 0.5 && uv.y < 0.6) {
    // //     //     float ratio = 1.0 - ((uv.y - 0.5) / (0.6 - 0.5));
    // //     //     uv.y = 0.5 + 0.1 * abs(cos(aTime * 100.0)) * (1.0 - ratio);
    // //     //     uv.x -= 0.05 * (1.0 - cos(ratio)) * abs(cos(aTime * 100.0));
    // //     // }



    // //     vec4 c = texture2D(texture0, uv);
    // //     // if (uv.x < 0.0 || uv.x > 1.0) {
    // //         gl_FragColor = vec4(c.x, 0.0, 0.0, 1.0);
    // //     // } else {
    // //         gl_FragColor = c;
    // //     // }

    // //     // //this will be our RGBA sum
    // //     // vec4 sum = vec4(0.0);

    // //     // //our original texcoord for this fragment
    // //     // vec2 tc = uv;

    // //     // //the amount to blur, i.e. how far off center to sample from
    // //     // //1.0 -> blur by one pixel
    // //     // //2.0 -> blur by two pixels, etc.
    // //     // vec2 radius = vec2(10.0);
    // //     // vec2 blur   = radius/resolution;

    // //     // //the direction of our blur
    // //     // //(1.0, 0.0) -> x-axis blur
    // //     // //(0.0, 1.0) -> y-axis blur
    // //     // float hstep = 1.0;//dir.x;
    // //     // float vstep = 0.0;//dir.y;

    // //     // //apply blurring, using a 9-tap filter with predefined gaussian weights

    // //     // sum += texture2D(texture0, vec2(tc.x - 4.0*blur.x*hstep, tc.y - 4.0*blur.y*vstep)) * 0.0162162162;
    // //     // sum += texture2D(texture0, vec2(tc.x - 3.0*blur.x*hstep, tc.y - 3.0*blur.y*vstep)) * 0.0540540541;
    // //     // sum += texture2D(texture0, vec2(tc.x - 2.0*blur.x*hstep, tc.y - 2.0*blur.y*vstep)) * 0.1216216216;
    // //     // sum += texture2D(texture0, vec2(tc.x - 1.0*blur.x*hstep, tc.y - 1.0*blur.y*vstep)) * 0.1945945946;

    // //     // sum += texture2D(texture0, vec2(tc.x, tc.y)) * 0.2270270270;

    // //     // sum += texture2D(texture0, vec2(tc.x + 1.0*blur.x*hstep, tc.y + 1.0*blur.y*vstep)) * 0.1945945946;
    // //     // sum += texture2D(texture0, vec2(tc.x + 2.0*blur.x*hstep, tc.y + 2.0*blur.y*vstep)) * 0.1216216216;
    // //     // sum += texture2D(texture0, vec2(tc.x + 3.0*blur.x*hstep, tc.y + 3.0*blur.y*vstep)) * 0.0540540541;
    // //     // sum += texture2D(texture0, vec2(tc.x + 4.0*blur.x*hstep, tc.y + 4.0*blur.y*vstep)) * 0.0162162162;

    // //     // //discard alpha for our simple demo, multiply by vertex color and return
    // //     // gl_FragColor = vec4(1.0) * vec4(sum.rgb, 1.0);

    // // #endif

}
