varying vec2 v_uv;

uniform vec2 u_rasterizePosition;
uniform float u_rasterizeSize;
uniform sampler2D u_texture0;

void main(){
    vec2 uv       = v_uv;
    float pixSize = clamp(1.0 / u_rasterizeSize, 0.0001, 0.5);
    vec2 pixPos   = u_rasterizePosition;

    // Apply rasterize position
    uv = pixPos - uv;

    // Rasterize
    vec2 ratio = ceil(uv / pixSize);
    uv = pixSize * ratio;

    // Restore UV position
    uv = pixPos - uv;

    gl_FragColor = texture2D(u_texture0, uv);
}
