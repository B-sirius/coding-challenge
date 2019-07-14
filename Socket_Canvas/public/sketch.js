"use strict";
let socket

function setup() {
    createCanvas(600, 400);
    background(51);

    socket = io('http://localhost:3000');
    // 接收并处理来自socket的信息
    socket.on('mouse', newDrawing);
}

function newDrawing(mouseMsg) {
    const { x, y } = mouseMsg;
    noStroke();
    fill(235, 87, 230);
    ellipse(x, y, 10, 10);
}

function mouseDragged() {
    noStroke();
    fill(87, 235, 218);
    ellipse(mouseX, mouseY, 10, 10);

    // 通过socket发送信息
    socket.emit('mouse', {
        x: mouseX,
        y: mouseY
    });
}

function draw() {
};
