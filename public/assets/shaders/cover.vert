attribute vec2 T0Coords;
attribute vec2 T1Coords;

varying vec2 vT0Coords;
varying vec2 vT1Coords;

void main() {
    vT0Coords = T0Coords;
    vT1Coords = T1Coords;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}
