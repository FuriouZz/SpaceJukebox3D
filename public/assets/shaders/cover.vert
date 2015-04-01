varying vec2 vUv;

uniform float aTime;
uniform vec2 resolution;

// #ifdef TRANSITION_1
// #else
//     varying vec2 vMoves[3];
// #endif

void main() {
    vUv = uv;

    // vec2 pos = resolution * vUv;
    // float divSize = 150.0;

    // if (mod(position.y, divSize) > divSize * 0.5) {
    //     vUv.x = vUv.x + cos(aTime);
    // } else {
    //     vUv.x = vUv.x - sin(aTime);
    // }

    #ifdef TRANSITION_1
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
    #else
        // vec2 center = resolution * 0.5;
        // vMoves[0].x = 0.5;
        // vMoves[0].y = 0.5;

        // vMoves[1].x = 0.5;// - 200.0;
        // vMoves[1].y = 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
    #endif
}
