import { initWebGL } from "../util.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const vertexShader = `
attribute vec4 a_position;
attribute vec4 a_color;
varying vec4 v_color;
void main () {
    gl_Position = a_position;
    v_color = a_color;
}  
`;

const fragmentShader = `
    precision mediump float;
    varying vec4 v_color;
    void main () {
        gl_FragColor = v_color;
    }
`;
const pointPos = [-0.5, 0.0, 0.5, 0.0, 0.0, 0.5];
const pointColor = [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0];

const program = initWebGL(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointPos), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointColor), gl.STATIC_DRAW);

const a_position = gl.getAttribLocation(program, "a_position");
const a_color = gl.getAttribLocation(program, "a_color");

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(
    a_position,
    2,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * 2,
    0
);
gl.enableVertexAttribArray(a_position);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(
    a_color,
    4,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * 4,
    0
);
gl.enableVertexAttribArray(a_color);

gl.drawArrays(gl.TRIANGLES, 0, 3);
