"use strict";

let points;
let angle;
let projection;
let rotationX;
let rotationY;
let rotationZ;
let inc;

function pVector2mat(pVector) {
  const mat = [];
  mat[0] = [pVector.x];
  mat[1] = [pVector.y];
  mat[2] = [pVector.z];
  return mat;
}

function mat2pVector(mat) {
  return createVector(mat[0][0], mat[1][0], mat[2] ? mat[2][0] : 0);
}

function matrixMul(matA, matB) {
  const rowA = matA.length;
  const colA = matA[0].length;

  const rowB = matB.length;
  const colB = matB[0].length;

  if (colA !== rowB) {
    console.error("cols dont match rows!");
    return;
  }

  const resultMat = [];
  resultMat.length = rowA;
  for (let i = 0; i < rowA; i++) {
    resultMat[i] = [];
    for (let j = 0; j < colB; j++) {
      let sum = 0;
      for (let k = 0; k < colA; k++) {
        sum += matA[i][k] * matB[k][j];
      }
      resultMat[i][j] = sum;
    }
  }

  return resultMat;
}

function matrixPvector(matA, pVector) {
  return mat2pVector(matrixMul(matA, pVector2mat(pVector)));
}

function connect(p1, p2) {
  strokeWeight(1);
  stroke(255);
  line(p1.x, p1.y, p2.x, p2.y);
}

function drawBox(points) {
  stroke(255);
  strokeWeight(16);
  noFill();

  for (let item of points) {
    point(item.x, item.y);
  }

  connect(points[0], points[1]);
  connect(points[1], points[2]);
  connect(points[2], points[3]);
  connect(points[3], points[0]);
  connect(points[4], points[5]);
  connect(points[5], points[6]);
  connect(points[6], points[7]);
  connect(points[7], points[4]);
  connect(points[0], points[4]);
  connect(points[1], points[5]);
  connect(points[2], points[6]);
  connect(points[3], points[7]);

}

function setup() {
  createCanvas(400, 400);

  points = [];
  angle = 0;
  inc = PI / 90;
  projection = (z = 1) => [
    [z, 0, 0],
    [0, z, 0],
  ];
  rotationX = angle => [
    [1, 0, 0],
    [0, cos(angle), -sin(angle)],
    [0, sin(angle), cos(angle)],
  ];
  rotationY = angle => [
    [cos(angle), 0, sin(angle)],
    [0, 1, 0],
    [-sin(angle), 0, cos(angle)],
  ];
  rotationZ = angle => [
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1]
  ];

  points[0] = createVector(50, 50, -50);
  points[1] = createVector(50, -50, -50);
  points[2] = createVector(-50, -50, -50);
  points[3] = createVector(-50, 50, -50);
  points[4] = createVector(50, 50, 50);
  points[5] = createVector(50, -50, 50);
  points[6] = createVector(-50, -50, 50);
  points[7] = createVector(-50, 50, 50);
}

function draw() {
  background(51);

  translate(width / 2, height / 2);

  angle += inc;
  const transformedPoints = [];

  for (let item of points) {
    let newP = item;
    newP = matrixPvector(rotationX(angle), newP);
    newP = matrixPvector(rotationY(angle), newP);
    newP = matrixPvector(rotationZ(angle), newP);

    const z = 50 / (150 - newP.z);

    newP = matrixPvector(projection(z), newP);
    transformedPoints.push(newP);
  }

  drawBox(transformedPoints);
}
