let gl;
let near = -1.0;
let far = 1.0;
let radius = 1.0;
let theta = 0.0;
let phi = 0.0;
let modelViewMatrixLoc; // Variable to store the location of the modelViewMatrix uniform
let projectionMatrixLoc; // Variable to store the location of the projectionMatrix uniform
// Define the number of positions (number of vertices)
const numPositions = 3;

// Define the point the camera is looking at
const at = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
// Define the upward direction
const up = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);

window.onload = function init() {
    const canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl');
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Initialize shaders, buffers, etc.
    const vertexShaderSource = `
        attribute vec4 aPosition;
        attribute vec4 aColor;
        varying vec4 vColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            vColor = aColor;
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
    }`;

    const fragmentShaderSource = `
        precision mediump float;
        varying vec4 vColor;

        void main() {
            gl_FragColor = vColor;
        }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Obtain the locations of the modelViewMatrix and projectionMatrix uniforms
    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    // Set up event handler for the depth slider
    document.getElementById("depthSlider").oninput = function () {
        let depth = parseFloat(event.target.value);
        near = -depth / 2;
        far = depth / 2;
    };

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let eye = glMatrix.vec3.fromValues(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
    );
    let modelViewMatrix = glMatrix.mat4.create();
    let projectionMatrix = glMatrix.mat4.create();

    modelViewMatrix = glMatrix.mat4.lookAt(modelViewMatrix, eye, at, up);
    projectionMatrix = glMatrix.mat4.ortho(projectionMatrix, -1, 1, -1, 1, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    requestAnimationFrame(render);
}

// Helper function to create a shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Helper function to create a program
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}
