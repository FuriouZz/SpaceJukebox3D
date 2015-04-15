varying vec2 v_uv;

uniform float u_t;
uniform sampler2D u_texture0;
uniform sampler2D u_texture1;

void main(){
    vec2 uv      = v_uv;
    vec4 c       = mix(texture2D(u_texture0, uv), texture2D(u_texture1, uv), u_t);
    gl_FragColor = clamp(c, 0.0, 1.0);
}
