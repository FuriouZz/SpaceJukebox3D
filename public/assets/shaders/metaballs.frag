precision highp float;

varying vec2 vUv;

varying vec2 vMoves[3];

uniform sampler2D texture;
uniform sampler2D texture1;
uniform vec2 resolution;

uniform float aTime;

#define PI 3.1415926535897932384626433832795

void main(){
    vec2 uv         = vUv;

    vec2 pos        = resolution * vUv;

    float radius     = 100.0;

    float dist      = 0.0;
    float influence = 0.0;
    float intensity = 0.0;

    float count = 4.0;

    float inf = 0.0;

    for (float i = 0.0; i < 4.0; i++) {
        vec2 mv = vMoves[0];

        float position = cos((count - i+1.0) / count + aTime * 0.5);

        position = mix(-1.0, 1.0, smoothstep(-1.0, 1.0, position));

        mv.x -= position * (100.0 * (i+1.0));

        dist      = clamp(distance(mv, pos), 0.0, radius * 0.5);
        influence = 1.0 - dist/(radius * 0.5);
        inf += distance(vMoves[0], mv) / radius * 0.5;
        intensity += pow(influence, 2.0);
    }

    // Center
    float r   = radius * 0.5;// + (radius * 0.5) * max(1.0 - (inf / 4.0), 0.0);//max(1.0 - (inf / 4.0), 0.0) * 50.0;// + 100.0 * clamp(1.0 - (inf / 2.0) / (radius * 2.0), 0.0, radius * 0.5);//mix(radius * 0.5, radius * 2.0, inf);
    dist      = clamp(distance(vMoves[0], pos), 0.0, r);
    influence = 1.0 - dist/r;
    intensity += pow(influence, 2.0);


    // vec2 mv    = vMoves[0];
    // mv.x       -= abs(cos(aTime * 0.5)) * 500.0;

    // dis2       = clamp(distance(mv, pos), 0.0, radius * 0.5);
    // influence2 = 1.0 - dis2/(radius * 0.5);
    // intensity  += pow(influence2, 2.0);

    intensity  = 1.0 - intensity;



    // float influence = 1.0 - dis/10.0;

    // float intensity = 1.0 - (pow(influence, 2.0));

    // vec4 c = mix(texture2D(texture, uv), texture2D(texture1, uv), smoothstep(-0.5, 1.5, intensity));
    vec4 render1 = vec4(1.0, 1.0, 0.0, 1.0);//texture2D(texture, uv);
    vec4 render2 = vec4(1.0, 0.0, 1.0, 1.0);//texture2D(texture1, uv);

    // vec4 c1 = mix(render1, render2, max(smoothstep(radius-diffuse, radius, dis1), 0.0));
    // vec4 c2 = mix(render1, render2, max(smoothstep(radius-diffuse, radius, dis2), 0.0));

    // vec4 c = c1 + c2;
    vec4 c = mix(render1, render2, smoothstep(0.75, 0.8, intensity));

    gl_FragColor = clamp(c, 0.0, 1.0);
}
