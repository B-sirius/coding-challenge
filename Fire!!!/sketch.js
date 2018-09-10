'ues strict';

const W = 150;
const H = 100;

let buffer1;
let cooling;
let buffer2;
let fps;
let ystart = 0;

function initializeBuffer(buffer) {
    buffer.loadPixels();
    for (let i = 0; i < buffer.width; i++) {
        for (let j = 0; j < buffer.height; j++) {
            buffer.set(i, j, color(0, 0, 0));
        }
    }
    buffer.updatePixels();
}

function fire(rows) {
    buffer1.loadPixels();
    for (let x = 0; x < width; x++) {
        for (let n = 1; n <= rows; n++) {
            const y = height - n;
            const index = 4 * (x + y * buffer1.width);
            buffer1.pixels[index] = 255;
            buffer1.pixels[index + 1] = 255;
            buffer1.pixels[index + 2] = 255;
        }
    }
    buffer1.updatePixels();
}

function cool() {
    cooling.loadPixels();

    let xoff = 0;
    const xincrement = 0.3; // 视觉上影响火焰宽度
    const yincrement = 0.2; // 视觉上影响火焰速度

    for (let x = 0; x < width; x++) {
        xoff += xincrement;

        yoff = ystart;
        for (let y = 0; y < height; y++) {
            yoff += yincrement;

            const n = noise(xoff, yoff);
            const bright = pow(n, 3) * 100;

            const index = 4 * (x + y * width);
            cooling.pixels[index] = bright;
            cooling.pixels[index + 1] = bright;
            cooling.pixels[index + 2] = bright;
        }
    }
    cooling.updatePixels();
    ystart += yincrement;
}

function mouseDragged() {
    buffer1.fill(255);
    buffer1.noStroke();
    buffer1.ellipse(mouseX, mouseY, 10, 10);
}

function setup() {
    fps = document.querySelector('#fps');
    createCanvas(W, H);
    pixelDensity(1);
    buffer1 = createGraphics(width, height);
    buffer2 = createGraphics(width, height);
    cooling = createGraphics(width, height);
    initializeBuffer(buffer1);
    initializeBuffer(buffer2);
    initializeBuffer(cooling);
}

function draw() {
    image(buffer2, 0, 0);
    fire(2);
    cool()

    buffer2.loadPixels();
    for (let x = 1; x < width - 1; x++) {
        for (let y = 1; y < height - 1; y++) {
            const index0 = 4 * (x + (y - 1) * width);
            const index1 = 4 * ((x + 1) + y * width);
            const index2 = 4 * ((x - 1) + y * width);
            const index3 = 4 * (x + (y + 1) * width);
            const index4 = 4 * (x + (y - 1) * width);

            const color0 = buffer1.pixels[index0];
            const color1 = buffer1.pixels[index1];
            const color2 = buffer1.pixels[index2];
            const color3 = buffer1.pixels[index3];
            const color4 = buffer1.pixels[index4];

            const newColor = (color1 + color2 + color3 + color4) * 0.25 - cooling.pixels[index0];

            buffer2.pixels[index0] = newColor;
            buffer2.pixels[index0 + 1] = newColor;
            buffer2.pixels[index0 + 2] = newColor;
        }
    }
    buffer2.updatePixels();

    let temp = buffer1;
    buffer1 = buffer2;
    buffer2 = temp;

    fps.textContent = Math.round(frameRate());
}