varying vec2 vUv;

uniform vec2 u_resolution;
uniform vec2 u_direction;
uniform sampler2D u_texture0;
uniform float u_radius;

void main(){
    //this will be our RGBA sum
    vec4 sum = vec4(0.0);

    //our original texcoord for this fragment
    vec2 tc = vUv;

    //the amount to blur, i.e. how far off center to sample from
    //1.0 -> blur by one pixel
    //2.0 -> blur by two pixels, etc.
    vec2 radius = vec2(u_radius);
    vec2 blur   = radius/u_resolution;

    //the direction of our blur
    //(1.0, 0.0) -> x-axis blur
    //(0.0, 1.0) -> y-axis blur
    float hstep = u_direction.x;//dir.x;
    float vstep = u_direction.y;//dir.y;

    //apply blurring, using a 9-tap filter with predefined gaussian weights

    // sum += texture2D(u_texture0, vec2(tc.x - 4.0*blur.x*hstep, tc.y - 4.0*blur.y*vstep)) * 0.0162162162;
    // sum += texture2D(u_texture0, vec2(tc.x - 3.0*blur.x*hstep, tc.y - 3.0*blur.y*vstep)) * 0.0540540541;
    // sum += texture2D(u_texture0, vec2(tc.x - 2.0*blur.x*hstep, tc.y - 2.0*blur.y*vstep)) * 0.1216216216;
    // sum += texture2D(u_texture0, vec2(tc.x - 1.0*blur.x*hstep, tc.y - 1.0*blur.y*vstep)) * 0.1945945946;

    // sum += texture2D(u_texture0, vec2(tc.x, tc.y)) * 0.2270270270;

    // sum += texture2D(u_texture0, vec2(tc.x + 1.0*blur.x*hstep, tc.y + 1.0*blur.y*vstep)) * 0.1945945946;
    // sum += texture2D(u_texture0, vec2(tc.x + 2.0*blur.x*hstep, tc.y + 2.0*blur.y*vstep)) * 0.1216216216;
    // sum += texture2D(u_texture0, vec2(tc.x + 3.0*blur.x*hstep, tc.y + 3.0*blur.y*vstep)) * 0.0540540541;
    // sum += texture2D(u_texture0, vec2(tc.x + 4.0*blur.x*hstep, tc.y + 4.0*blur.y*vstep)) * 0.0162162162;

    float h = (1.0 / 512.0) * u_direction.x * (u_resolution.x / u_resolution.y);
    float v = (1.0 / 512.0) * u_direction.y;

    sum += texture2D( u_texture0, vec2( tc.x - 4.0 * h, tc.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( u_texture0, vec2( tc.x - 3.0 * h, tc.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( u_texture0, vec2( tc.x - 2.0 * h, tc.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( u_texture0, vec2( tc.x - 1.0 * h, tc.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( u_texture0, vec2( tc.x, tc.y ) ) * 0.1633;
    sum += texture2D( u_texture0, vec2( tc.x + 1.0 * h, tc.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( u_texture0, vec2( tc.x + 2.0 * h, tc.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( u_texture0, vec2( tc.x + 3.0 * h, tc.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( u_texture0, vec2( tc.x + 4.0 * h, tc.y + 4.0 * v ) ) * 0.051;

    //discard alpha for our simple demo, multiply by vertex color and return
    gl_FragColor = vec4(1.0) * vec4(sum.rgb, 1.0);
}
