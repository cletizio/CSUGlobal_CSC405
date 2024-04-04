function setup() {
    "use strict";

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var m4 = twgl.m4;

    var slider1 = document.getElementById('slider1');
    slider1.value = 40;
    var slider2 = document.getElementById('slider2');
    slider2.value = 150;
    var slider3 = document.getElementById('slider3');
    slider3.value = 5;
    var slider4 = document.getElementById('slider4');
    slider4.value = 0;
    var slider5 = document.getElementById('slider5');
    slider5.value = 8;

    slider1.addEventListener('input', draw);
    slider2.addEventListener('input', draw);
    slider3.addEventListener('input', draw);
    slider4.addEventListener('input', draw);
    slider5.addEventListener('input', draw);
    


    function draw() {

        var angle1 = slider1.value * 0.01 * Math.PI;
        var height = slider2.value;
        var angle2 = slider3.value * 0.01 * Math.PI;
        var angle3 = slider4.value * 0.01 * Math.PI;
        var zoomFactor = Math.PI / slider5.value;
        var axis = [1, 1, 1];

        var Tmodel = m4.multiply(m4.scaling([0.6, 0.6, 0.6]), m4.multiply(m4.translation([20, 40, 40]), m4.axisRotation(axis, angle3)));

        var eye = [600 * Math.cos(angle1), height, 600 * Math.sin(angle1)];
        var target = [0, 0, 0];
        var up = [0, 1, 0];

        var Tcamera = m4.inverse(m4.lookAt(eye, target, up));
        var Tprojection = m4.perspective(zoomFactor, 1, 5, 400);
        var Tviewport = m4.multiply(m4.scaling([200, -200, 200]), m4.translation([canvas.width / 2.0, canvas.width / 2.0, 0]));

        var Tmc = m4.multiply(Tmodel, Tcamera);
        var Tcpv = m4.multiply(m4.multiply(Tcamera, Tprojection), Tviewport);
        var Tmcpv = m4.multiply(Tmodel, Tcpv);

        var triangles = getPyramidTriangles();
        insertLeftUpperTriangles(-angle2, triangles);
        insertRightUpperTriangles(angle2, triangles);
        insertLeftLowerTriangles(triangles);
        insertRightLowerTriangles(triangles);

        paintersAlgorithm(Tmcpv, triangles);

        // Clear canvas.
        canvas.width = canvas.width;

        drawAxes(Tcpv);
        drawScene(Tmcpv, triangles);
    }

    function moveToTx(x, y, z, Tx) {
        var pos = [x, y, z];
        var posTx = m4.transformPoint(Tx, pos);
        context.moveTo(posTx[0], posTx[1]);
    }

    function lineToTx(x, y, z, Tx) {
        var pos = [x, y, z];
        var posTx = m4.transformPoint(Tx, pos);
        context.lineTo(posTx[0], posTx[1]);
    }

    function drawAxes(Tx) {
        context.lineWidth = 3;
        // Draw x-axis.
        context.beginPath();
        context.strokeStyle = 'red';
        moveToTx(0, 0, 0, Tx);
        lineToTx(100, 0, 0, Tx);
        context.stroke();
        context.closePath();

        // Draw y-axis.
        context.beginPath();
        context.strokeStyle = 'green';
        moveToTx(0, 0, 0, Tx);
        lineToTx(0, 100, 0, Tx);
        context.stroke();
        context.closePath();

        // Draw z-axis.
        context.beginPath();
        context.strokeStyle = 'blue';
        moveToTx(0, 0, 0, Tx);
        lineToTx(0, 0, 100, Tx);
        context.stroke();
        context.closePath();
    }

    function drawScene(Tx, triangles) {
        var i;
        for (i = triangles.length - 1; i >= 0; --i) {
            drawTriangle(triangles[i], Tx);
        }
    }

    function drawTriangle(triangle, Tx) {
        context.beginPath();
        context.fillStyle = triangle[3];
        moveToTx(triangle[0][0], triangle[0][1], triangle[0][2], Tx);
        lineToTx(triangle[1][0], triangle[1][1], triangle[1][2], Tx);
        lineToTx(triangle[2][0], triangle[2][1], triangle[2][2], Tx);
        context.closePath();
        context.fill();
    }

    function getPyramidTriangles() {
        var pyramidTriangles = [
            // Base of pyramid
            [[25, 0, 0], [75, 0, 0], [50, 0, 50], 'blue', 0], // Bottom front
            [[25, 0, 100], [75, 0, 100], [50, 0, 50], 'blue', 0], // Bottom back

            // Sides of pyramid
            [[25, 0, 0], [75, 0, 0], [50, 100, 50], 'blue', 0], // Front
            [[75, 0, 0], [75, 0, 100], [50, 100, 50], 'black', 0], // Right
            [[25, 0, 0], [25, 0, 100], [50, 100, 50], 'blue', 0], // Left
            [[25, 0, 100], [75, 0, 100], [50, 100, 50], 'black', 0] // Back
        ];

        return pyramidTriangles;
    }


    function insertLeftUpperTriangles(angle, triangles) {
        var leftUpperTriangles = getPyramidTriangles();
        var TleftUpper = m4.multiply(m4.translation([-50, -100, 0]), m4.multiply(m4.scaling([0.4, 0.6, 0.4]), m4.multiply(m4.rotationZ(angle), m4.translation([0, 80, 9]))));
        var i = 0;
        for (i = 0; i < leftUpperTriangles.length; ++i) {
            leftUpperTriangles[i][0] = m4.transformPoint(TleftUpper, leftUpperTriangles[i][0]);
            leftUpperTriangles[i][1] = m4.transformPoint(TleftUpper, leftUpperTriangles[i][1]);
            leftUpperTriangles[i][2] = m4.transformPoint(TleftUpper, leftUpperTriangles[i][2]);
        }

        leftUpperTriangles.forEach(function (triangle) {
            triangles.push(triangle);
        });
    }

    function insertRightUpperTriangles(angle, triangles) {
        var rightUpperTriangles = getPyramidTriangles();
        var TrightUpper = m4.multiply(m4.translation([0, -100, 0]), m4.multiply(m4.scaling([0.4, 0.6, 0.4]), m4.multiply(m4.rotationZ(angle), m4.translation([50, 80, 9]))));
        var i = 0;
        for (i = 0; i < rightUpperTriangles.length; ++i) {
            rightUpperTriangles[i][0] = m4.transformPoint(TrightUpper, rightUpperTriangles[i][0]);
            rightUpperTriangles[i][1] = m4.transformPoint(TrightUpper, rightUpperTriangles[i][1]);
            rightUpperTriangles[i][2] = m4.transformPoint(TrightUpper, rightUpperTriangles[i][2]);
        }

        rightUpperTriangles.forEach(function (triangle) {
            triangles.push(triangle);
        });
    }

    function insertLeftLowerTriangles(triangles) {
        var leftLowerTriangles = getPyramidTriangles();
        var TleftLower = m4.multiply(m4.multiply(m4.translation([0, -100, 0]), 
        m4.scaling([0.4, 0.6, 0.6])), m4.translation([0, 0, 9]));
        var i = 0;
        for (i = 0; i < leftLowerTriangles.length; ++i) {
            leftLowerTriangles[i][0] = m4.transformPoint(TleftLower, leftLowerTriangles[i][0]);
            leftLowerTriangles[i][1] = m4.transformPoint(TleftLower, leftLowerTriangles[i][1]);
            leftLowerTriangles[i][2] = m4.transformPoint(TleftLower, leftLowerTriangles[i][2]);
        }

        leftLowerTriangles.forEach(function (triangle) {
            triangles.push(triangle);
        });
    }

    function insertRightLowerTriangles(triangles) {
        var rightLowerTriangles = getPyramidTriangles();
        var TrightLower = m4.multiply(m4.multiply(m4.translation([0, -100, 0]), 
        m4.scaling([0.4, 0.6, 0.6])), m4.translation([25, 0, 9]));
        var i = 0;
        for (i = 0; i < rightLowerTriangles.length; ++i) {
            rightLowerTriangles[i][0] = m4.transformPoint(TrightLower, rightLowerTriangles[i][0]);
            rightLowerTriangles[i][1] = m4.transformPoint(TrightLower, rightLowerTriangles[i][1]);
            rightLowerTriangles[i][2] = m4.transformPoint(TrightLower, rightLowerTriangles[i][2]);
        }

        rightLowerTriangles.forEach(function (triangle) {
            triangles.push(triangle);
        });
    }

    function paintersAlgorithm(Tx, triangles) {
        var i;
        // Calculate and store depth (averaged z-component) of each triangle.
        for (i = 0; i < triangles.length; ++i) {
            var point1Tx = m4.transformPoint(Tx, triangles[i][0]);
            var point2Tx = m4.transformPoint(Tx, triangles[i][1]);
            var point3Tx = m4.transformPoint(Tx, triangles[i][2]);
            var depth = (point1Tx[2] + point2Tx[2] + point3Tx[2]) / 3;
            triangles[i][4] = depth;
        }
        // Sort collection of triangles based on depth. If a's depth is less than b's depth,
        // a will come before b in the sorted array.
        triangles.sort(function (a, b) {
            return a[4] - b[4];
        });
    }
}

window.onload = setup;