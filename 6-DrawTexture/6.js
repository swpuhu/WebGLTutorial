import { initWebGL, createTexture } from "../util.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const vertexShader = `
attribute vec4 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main () {
    gl_Position = a_position;
    v_texCoord = a_texCoord;
}  
`;

const fragmentShader = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main () {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;
const pointPos = [
    -1, 1,
    -1, -1,
    1, -1,
    1, -1,
    1, 1,
    -1, 1,
];
const texCoordPos = [
    0, 1,
    0, 0,
    1, 0,
    1, 0,
    1, 1,
    0, 1
];

const program = initWebGL(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointPos), gl.STATIC_DRAW);

const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordPos), gl.STATIC_DRAW);

const a_position = gl.getAttribLocation(program, "a_position");
const a_texCoord = gl.getAttribLocation(program, "a_texCoord");

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

gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.vertexAttribPointer(
    a_texCoord,
    2,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * 2,
    0
);
gl.enableVertexAttribArray(a_texCoord);

const texture = createTexture(gl);
const image = new Image();
image.src = '../assets/gaoda1.jpg';
image.onload = function () {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}



