import { initWebGL } from "../util.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const vertexShader = `
attribute vec4 a_position;
void main () {
    gl_Position = a_position;
    gl_PointSize = 10.;
}  
`;

const fragmentShader = `
    precision mediump float;
    void main () {
        gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
    }
`;
const pointPos = [-0.5, 0.0, 0.5, 0.0, 0.0, 0.5];

const program = initWebGL(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointPos), gl.STATIC_DRAW);

const a_position = gl.getAttribLocation(program, "a_position");
gl.vertexAttribPointer(
    a_position,
    2,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * 2,
    0
);
gl.enableVertexAttribArray(a_position);

gl.drawArrays(gl.TRIANGLES, 0, 3);
