let angle = 0;
let w = 20;
let maxD = dist(0, 0, 200, 200)

let boxWidth = 300;
let boxHeight = 300;

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2))
}

function setup() {
    createCanvas(400, 400, WEBGL);
}

function draw() {
    background(255, 255, 255);
    ortho(300, -300, -300, 300, 0, 1000);

    ambientLight(255, 255, 255);
    noStroke();
    
    rotateX(- PI / 4);
    rotateY(- PI / 4);
    
    for (let z = 0; z < boxWidth; z += w) {
        for (let x = 0; x < boxHeight; x += w) {
            push();
            let d = dist(x, z,  boxWidth / 2, boxHeight / 2);
            let offset = map(d, 0, maxD, -5, 5);

            let a = angle + offset;
    
            let h = map(sin(a), -1, 1, 0, 190) + 110;
    
            translate(x - boxWidth / 2, 0, z - boxWidth / 2);
            ambientMaterial(231, 0, 62);
            colorBox(w, h, w, [223, 216, 157], [115, 167, 160], [59, 78, 135]);
            
            pop();
        }
    }

    angle -= 0.07;

    // colorBox(50, 150, 20, [252, 251, 214], [113, 111, 237], [111, 230, 237])
}

function colorBox(xLength, yLength, zLength, color1, color2, color3) {
    // 前后面
    push();
    ambientMaterial(...color1);
    
    push();
    translate(0, 0, - zLength / 2);
    plane(xLength, yLength);
    pop();

    push();
    translate(0, 0, zLength / 2);
    plane(xLength, yLength);
    pop();

    pop();

    // 上下面
    push();
    ambientMaterial(...color2);
    rotateX(PI / 2);

    push();
    translate(0, 0, yLength / 2);
    plane(xLength, zLength);
    pop();

    push();
    translate(0, 0, - yLength / 2);
    plane(xLength, zLength);
    pop();

    pop();
    
    // 左右面
    push();
    ambientMaterial(...color3);
    rotateY(PI / 2);
    
    push();
    translate(0, 0, xLength / 2);
    plane(zLength, yLength);
    pop();

    push();
    translate(0, 0, - xLength / 2);    
    plane(zLength, yLength);
    pop();

    pop();
}