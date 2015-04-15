varying vec2 v_uv;

uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform vec2 u_resolution;
uniform float u_radius;

void main(){
    vec2 uv         = v_uv;
    vec2 uvposition = uv;
    uvposition.x    = uvposition.x * (resolution.x / resolution.y);

    float radius  = clamp(u_radius, 0.0, 1.0);
    float p       = abs(0.5 * (u_resolution.x / u_resolution.y)  - uvposition.x) / radius;
    float diffuse = 0.001;

    vec4 c       = mix(texture2D(u_texture0, uv), texture2D(u_texture1, uv), max(smoothstep(1.0-diffuse, 1.0, p), 0.0));
    gl_FragColor = clamp(c, 0.0, 1.0);
}
