// main.js
var slider1, slider2, slider3, slider4, slider5;
var context;
var Tx;
var Tcpv;

var cubeVertices = [
    // Front face
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,

    // Back face
    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    // Top face
    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,

    // Bottom face
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,

    // Right face
    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,

    // Left face
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
];

var triangles = [
    // Front face
    [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], 'blue'],
    [[-0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], 'black'],
    // Back face
    [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], 'red'],
    [[-0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], 'black'],
    // Top face
    [[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], 'green'],
    [[-0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], 'green'],
    // Bottom face
    [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], 'purple'],
    [[-0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], 'purple'],
    // Right face
    [[0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], 'gray'],
    [[0.5, -0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], 'gray'],
    // Left face
    [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], 'yellow'],
    [[-0.5, -0.5, -0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], 'yellow']
];

window.onload = function() {
    var canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    var gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error("WebGL context creation failed, WebGL may not be supported.");
        return;
    }

    context = canvas.getContext('2d');

    setup();
    draw(context);

    // Define shaders
    var vertexShaderSource = `
        attribute vec3 a_position;
        void main() {
            gl_Position = vec4(a_position, 1.0);
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Example: Render all objects with red color
        }
    `;

    // Create shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create shader program
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Get attribute location
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    // Set up buffer data for object vertices
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

    // Enable vertex attribute array
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Specify how to pull the data out
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Set viewport and clear color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw objects in sorted order using Painter's algorithm
    gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / 3); 
};

function setup(){

    var canvas = document.getElementById('canvas');
    var m4 = twgl.m4;

    slider1 = document.getElementById('slider1');
    slider1.value = 40;
    slider2 = document.getElementById('slider2');
    slider2.value = 150;
    slider3 = document.getElementById('slider3');
    slider3.value = 5;
    slider4 = document.getElementById('slider4');
    slider4.value = 0;
    slider5 = document.getElementById('slider5');
    slider5.value = 8;

    slider1.addEventListener('input', draw);
    slider2.addEventListener('input', draw);
    slider3.addEventListener('input', draw);
    slider4.addEventListener('input', draw);
    slider5.addEventListener('input', draw);
}

function draw(context) {
    var angle1 = slider1.value * 0.01 * Math.PI;
    var height = slider2.value;
    var angle2 = slider3.value * 0.01 * Math.PI;
    var angle3 = slider4.value * 0.01 * Math.PI;
    var zoomFactor = Math.PI / slider5.value;
    var axis = [1, 1, 1];

    var Tmodel = twgl.m4.multiply(twgl.m4.scaling([0.6, 0.6, 0.6]), twgl.m4.multiply(twgl.m4.translation([20, 40, 40]), twgl.m4.axisRotation(axis, angle3)));

    var eye = [600 * Math.cos(angle1), height, 600 * Math.sin(angle1)];
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    var Tcamera = twgl.m4.inverse(twgl.m4.lookAt(eye, target, up));
    var Tprojection = twgl.m4.perspective(zoomFactor, 1, 5, 400);
    var Tviewport = twgl.m4.multiply(twgl.m4.scaling([200, -200, 200]), twgl.m4.translation([canvas.width / 2.0, canvas.width / 2.0, 0]));

    var Tmc = twgl.m4.multiply(Tmodel, Tcamera);
    Tcpv = twgl.m4.multiply(twgl.m4.multiply(Tcamera, Tprojection), Tviewport);
    var Tmcpv = twgl.m4.multiply(Tmodel, Tcpv);

    // Calculate depths of triangles
    var trianglesWithDepths = [];
    for (var i = 0; i < triangles.length; i++) {
        var triangle = triangles[i];
        var depth = calculateDepth(triangle, Tmcpv);
        trianglesWithDepths.push({ triangle: triangle, depth: depth });
    }

    // Sort triangles by depth (back-to-front)
    trianglesWithDepths.sort(function (a, b) {
        return b.depth - a.depth;
    });

    // Clear canvas.
    canvas.width = canvas.width;

    drawAxes(Tcpv, context);

    // Draw sorted triangles
    for (var i = 0; i < trianglesWithDepths.length; i++) {
        drawTriangle(trianglesWithDepths[i].triangle, Tmcpv, context);
    }
}

function calculateDepth(triangle, Tmcpv) {
    // Calculate depth based on the average z-coordinate of triangle vertices
    var zAvg = (triangle[0][2] + triangle[1][2] + triangle[2][2]) / 3;
    // Transform vertex to clip space and get z-coordinate
    var clipSpace = twgl.m4.transformPoint(Tmcpv, [0, 0, zAvg]);
    return clipSpace[2]; // return the z-coordinate (depth)
}

function drawTriangle(triangle, Tmcpv, context) {
    context.beginPath();
    context.fillStyle = triangle[3];
    moveToTx(triangle[0][0], triangle[0][1], triangle[0][2], Tx);
    lineToTx(triangle[1][0], triangle[1][1], triangle[1][2], Tx);
    lineToTx(triangle[2][0], triangle[2][1], triangle[2][2], Tx);
    context.closePath();
    context.fill();
}

function drawAxes(gl, program, positionAttributeLocation, colorLocation, Tcpv) {
    var axisLength = 100; // Length of each axis
    var axisColor = [
        [1, 0, 0, 1], // Red
        [0, 1, 0, 1], // Green
        [0, 0, 1, 1]  // Blue
    ]; 

    var axes = [
        [[0, 0, 0], [axisLength, 0, 0]], // X axis
        [[0, 0, 0], [0, axisLength, 0]], // Y axis
        [[0, 0, 0], [0, 0, axisLength]]  // Z axis
    ];

    // Draw each axis
    for (var i = 0; i < axes.length; i++) {
        var axis = axes[i];
        var startPoint = axis[0];
        var endPoint = axis[1];

        // Transform points to clip space
        startPoint = twgl.m4.transformPoint(Tcpv, startPoint);
        endPoint = twgl.m4.transformPoint(Tcpv, endPoint);

        // Prepare vertex data
        var vertices = [
            startPoint[0], startPoint[1], startPoint[2],
            endPoint[0], endPoint[1], endPoint[2]
        ];

        // Create buffer and bind data
        var axisBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Enable the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the buffer and specify the attribute pointer
        gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        // Set the color for the axis
        gl.uniform4fv(colorLocation, axisColor[i]);

        // Draw the axis
        gl.drawArrays(gl.LINES, 0, 2);
    }
}

function moveToTx(x, y, z, Tx) {
    var pos = [x, y, z];
    var posTx = twgl.m4.transformPoint(Tx, pos);
    context.moveTo(posTx[0], posTx[1]);
}

function lineToTx(x, y, z, Tx) {
    var pos = [x, y, z];
    var posTx = twgl.m4.transformPoint(Tx, pos);
    context.lineTo(posTx[0], posTx[1]);
}

