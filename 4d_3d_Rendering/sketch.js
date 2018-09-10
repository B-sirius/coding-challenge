"use strict";

let points;
let projection3d;
let rotationXY;
let rotationYZ;
let rotationZW;
let angle = 0;

class P4Vector {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

function line(x1, y1, z1, x2, y2, z2) {
  beginShape();
  vertex(x1, y1, z1);
  vertex(x2, y2, z2);
  endShape();
}

// 矩阵乘法
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

// 4维坐标 -> 矩阵
function p4Vector2mat(p4Vector) {
  const mat = [];
  mat[0] = [p4Vector.x];
  mat[1] = [p4Vector.y];
  mat[2] = [p4Vector.z];
  mat[3] = [p4Vector.w];
  return mat;
}

// 矩阵 -> 4维坐标
function mat2p4Vector(mat) {
  return new P4Vector(mat[0][0], mat[1][0], mat[2][0], mat[3] ? mat[3][0] : 0);
}

// 对4维坐标应用矩阵变换
function matrixP4Vector(mat, p4Vector) {
  return mat2p4Vector(matrixMul(mat, p4Vector2mat(p4Vector)));
}

// 连接两个坐标
function connect(p1, p2) {
  strokeWeight(1);
  stroke(255);
  line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
}

// 画个盒子
function drawBox(points) {
  console.log('box', points);
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

// 绘制超方体（的投影的投影）！
function drawTesseract(points) {
  for (let item of points) {
    point(item.x, item.y, item.z);
  }

  console.log('all', points);

  drawBox(points.slice(0, 8));
  drawBox(points.slice(8, 16));
}

function setup() {
  createCanvas(400, 400);

  points = [];

  // 4维 -> 3维投影矩阵
  projection3d = w => [[w, 0, 0, 0], [0, w, 0, 0], [0, 0, w, 0]];

  // 4维旋转，不过此时字母代表有变化的纬度，因为俺不会同时旋转3维（而不是不变的旋转轴）
  rotationXY = angle => [
    [cos(angle), -sin(angle), 0, 0],
    [sin(angle), cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  rotationYZ = angle => [
    [1, 0, 0, 0],
    [0, cos(angle), -sin(angle), 0],
    [0, sin(angle), cos(angle), 0],
    [0, 0, 0, 1]
  ];
  rotationZW = angle => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, cos(angle), -sin(angle)],
    [0, 0, sin(angle), cos(angle)]
  ];

  // i can always refactor it later :)
  points[0] = new P4Vector(50, 50, -50, 50);
  points[1] = new P4Vector(50, -50, -50, 50);
  points[2] = new P4Vector(-50, -50, -50, 50);
  points[3] = new P4Vector(-50, 50, -50, 50);
  points[4] = new P4Vector(50, 50, 50, 50);
  points[5] = new P4Vector(50, -50, 50, 50);
  points[6] = new P4Vector(-50, -50, 50, 50);
  points[7] = new P4Vector(-50, 50, 50, 50);
  points[8] = new P4Vector(50, 50, -50, -50);
  points[9] = new P4Vector(50, -50, -50, -50);
  points[10] = new P4Vector(-50, -50, -50, -50);
  points[11] = new P4Vector(-50, 50, -50, -50);
  points[12] = new P4Vector(50, 50, 50, -50);
  points[13] = new P4Vector(50, -50, 50, -50);
  points[14] = new P4Vector(-50, -50, 50, -50);
  points[15] = new P4Vector(-50, 50, 50, -50);
}

function draw() {
  background(51);
  translate(width / 2, height / 2);
  stroke(255);
  strokeWeight(8);
  noFill();

  point(40, 40, 40);
  point(40, -40, 40);
  point(-40, -40, 40);
  point(-40, 40, 40);

  line(40, 40, -40, 40, 40, 40);
  line(40, 40, -40, 40, -40, 40);
  // line(-40, -40, 40, -40, -40, 40);
  // line(-40, 40, 40, 40, 40, 40);

  // angle += 0.02;

  // const newPoints = [];

  // for (let item of points) {
  //   let newP = item;
  //   newP = matrixP4Vector(rotationXY(angle), newP);
  //   newP = matrixP4Vector(rotationYZ(angle), newP);
  //   newP = matrixP4Vector(rotationZW(angle), newP);

  //   const w = 50 / (100 - newP.w);

  //   newP = matrixP4Vector(projection3d(w), newP);
  //   newPoints.push(newP);
  // }

  // drawTesseract(newPoints);
}
