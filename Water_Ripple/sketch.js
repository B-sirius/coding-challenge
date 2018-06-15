'use strict';

const ROWS = 400;
const COLS = 400;
const dampening = 1 - 1 / 32;

let previous;
let current;
let imagePixelsCopy;

function getWaterArray(rgb) {
    return Array.from({ length: ROWS }).map(i => Array.from({ length: COLS }).fill(rgb));
}

function mouseDragged() {
    previous[int(mouseX)][int(mouseY)] = 512;
}

// 绘制图像
function drawImage() {
    background(255, 63, 213);
    fill(65, 241, 242);
    noStroke();
    for (let i = 0; i < 8; i++) {
        rect(i * 60, 0, 30, 600);
    }
}

function setup() {
    createCanvas(400, 400);
    pixelDensity(1);
    previous = getWaterArray(0);
    current = getWaterArray(0);

    drawImage();

    loadPixels();
    imagePixelsCopy = Array.from(pixels);
}

function draw() {
    drawImage();
    loadPixels();
    // 循环非边缘的对象
    for (let i = 1; i < COLS - 1; i++) {
        for (let j = 1; j < ROWS - 1; j++) {
            current[i][j] = (
                previous[i - 1][j] +
                previous[i + 1][j] +
                previous[i][j - 1] +
                previous[i][j + 1]
            ) / 2 - current[i][j];

            current[i][j] *= dampening;

            // 调整波纹的结束
            if (current[i][j] !== 0 && Math.abs(current[i][j]) < 0.1) {
                current[i][j] = 0;
            }

            const data = 1024 - current[i][j];

            // 获得偏移值
            let xoffset = int((i) * data / 1024);
            let yoffset = int((j) * data / 1024);

            // 边缘检查
            if (xoffset >= COLS) xoffset = COLS - 1;
            else if (xoffset < 0) xoffset = 0;
            if (yoffset >= ROWS) yoffset = ROWS - 1;
            else if (yoffset < 0) yoffset = 0;

            // 根据偏移值获得偏移下标
            const index = (i + j * COLS) * 4;
            const newIndex = (xoffset + yoffset * COLS) * 4;

            pixels[index] = imagePixelsCopy[newIndex];
            pixels[index + 1] = imagePixelsCopy[newIndex + 1];
            pixels[index + 2] = imagePixelsCopy[newIndex + 2];
        }
    }
    updatePixels();

    let temp = previous;
    previous = current;
    current = temp;
}