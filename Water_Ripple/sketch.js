'use strict';

const ROWS = 200;
const COLS = 200;
let dampening = 0.99;

let previous;
let current;

function getWaterArray(rgb) {
    return Array.from({ length: ROWS }).map(i => Array.from({ length: COLS }).fill(rgb));
}

function mousePressed() {
    previous[mouseX][mouseY] = 3000;
}

function setup() {
    createCanvas(200, 200);
    pixelDensity(1);
    previous = getWaterArray(0);
    current = getWaterArray(0);
}

function draw() {
    background(0);

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

            let index = (i + j * COLS) * 4;
            pixels[index] = current[i][j];
            pixels[index + 1] = current[i][j];
            pixels[index + 2] = current[i][j];
        }
    }
    updatePixels();

    let temp = previous;
    previous = current;
    current = temp;
}