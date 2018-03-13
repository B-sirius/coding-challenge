let angle = 0;
let w = 20;
let magicAngle = Math.atan(1 / Math.sqrt(2));
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
    background(255, 214, 193);
    ortho(300, -300, -300, 300, 0, 1000);

    directionalLight(200, 0, 200, 0.6, -0.3, -0.7);
    ambientLight(200, 0, 200);
    noStroke();
    
    rotateX(-PI / 4);
    rotateY(PI / 4);
    
    for (let z = 0; z < boxWidth; z += w) {
        for (let x = 0; x < boxHeight; x += w) {
            push();
            let d = dist(x, z,  boxWidth / 2, boxHeight / 2);
            let offset = map(d, 0, maxD, -4, 4);

            let a = angle + offset;
    
            let h = map(sin(a), -1, 1, 0, 180) + 120;
    
            translate(x - boxWidth / 2, 0, z - boxWidth / 2);
            ambientMaterial(231, 0, 62);
            box(w, h, w);
            
            pop();
        }
    }

    angle -= 0.1;
}