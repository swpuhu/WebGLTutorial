import { 
    initWebGL,
    createTexture, 
    createProjectionMat, 
    createRotateMat, 
    createTranslateMat, 
    createScaleMat 
} from "../util.js";

import {Slider} from '../UICreator.js'

const width = 480;
const height = 270;
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
const gl = canvas.getContext("webgl");

const vertexShader = `
attribute vec4 a_position;
attribute vec2 a_texCoord;
uniform mat4 u_projection;
uniform mat4 u_rotate;
uniform mat4 u_scale;
uniform mat4 u_translate;
varying vec2 v_texCoord;
void main () {
    gl_Position = u_projection * u_translate * u_rotate * u_scale * a_position;
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
let pointPos = [
    0, 0,
    533, 0,
    533, 300,
    533, 300,
    0, 300,
    0, 0
];
const texCoordPos = [
    0, 0,
    1, 0,
    1, 1,
    1, 1,
    0, 1,
    0, 0
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

const u_projection = gl.getUniformLocation(program, 'u_projection');
const projectionMat = createProjectionMat(0, width, height, 0, 0, 1);
gl.uniformMatrix4fv(u_projection, false, projectionMat);

const u_translate = gl.getUniformLocation(program, 'u_translate');
const u_scale = gl.getUniformLocation(program, 'u_scale');
const u_rotate = gl.getUniformLocation(program, 'u_rotate');

let translateMat = createTranslateMat(0, 0);
let rotateMat = createRotateMat(0);
let scaleMat = createScaleMat(1, 1);

gl.uniformMatrix4fv(u_translate, false, translateMat);
gl.uniformMatrix4fv(u_rotate, false, rotateMat);
gl.uniformMatrix4fv(u_scale, false, scaleMat);


const texture = createTexture(gl);
const image = new Image();
image.src = '../assets/gaoda1.jpg';
image.onload = function () {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function draw() {
    translateMat = createTranslateMat(tx, ty);
    rotateMat = createRotateMat(rotate);
    scaleMat = createScaleMat(sx, sy);
    gl.uniformMatrix4fv(u_translate, false, translateMat);
    gl.uniformMatrix4fv(u_rotate, false, rotateMat);
    gl.uniformMatrix4fv(u_scale, false, scaleMat);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

let tx = 0;
let ty = 0;
let rotate = 0;
let sx = 1;
let sy = 1;

const txSlider = new Slider({
    min: -width,
    max: width,
    value: tx,
    labelText: 'translateX'
});

txSlider.onChange = () => {
    tx = txSlider.value;
    draw();
}

const tySlider = new Slider({
    min: -height,
    max: height,
    value: ty,
    labelText: 'translateY'
});

tySlider.onChange = () => {
    ty = tySlider.value;
    draw();
}


const rotateSlider = new Slider({
    min: -180,
    max: 180,
    value: rotate,
    labelText: 'Rotate'
});

rotateSlider.onChange = () => {
    rotate = rotateSlider.value;
    draw();
}


const sxSlider = new Slider({
    min: -3,
    max: 3,
    value: sx,
    step: 0.1,
    labelText: 'scaleX'
});

sxSlider.onChange = () => {
    sx = sxSlider.value;
    draw();
}

const sySlider = new Slider({
    min: -3,
    max: 3,
    value: sy,
    step: 0.1,
    labelText: 'scaleY'
});

sySlider.onChange = () => {
    sy = sySlider.value;
    draw();
}




txSlider.mountTo(document.body);
tySlider.mountTo(document.body);
rotateSlider.mountTo(document.body);
sxSlider.mountTo(document.body);
sySlider.mountTo(document.body);