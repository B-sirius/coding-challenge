let inc = 0.1;
let scl = 10;
let cols, rows;
let zoff = 0;
let particles;
let flowField;

function setup() {
    createCanvas(400, 400);
    cols = floor(width / scl);
    rows = floor(height / scl);
    background(255);
    colorMode(HSB, 255);


    particles = [];
    for (let i = 0; i < 500; i++) {
        particles[i] = new Particle();
    }

    flowField = Array.from({ length: cols * rows });
}

function draw() {
    let yoff = 0;
    for (y = 0; y < rows; y++) {
        let xoff = 0;
        for (x = 0; x < cols; x++) {
            let index = x + y * cols;
            let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
            let v = p5.Vector.fromAngle(angle);
            v.setMag(1);
            flowField[index] = v;

            xoff += inc;
        }
        yoff += inc;
        zoff += 0.0001;
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
    }
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.h = 0;
    this.prevPos = this.pos.copy();
}

Particle.prototype.update = function () {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
    this.h++;
    if (this.h > 255) this.h = 0;
};

Particle.prototype.applyForce = function (force) {
    this.acc.add(force);
};

Particle.prototype.show = function () {
    stroke(this.h, 255, 255, 5);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    this.updatePrev();
};

Particle.prototype.edges = function () {
    if (this.pos.x > width) {
        this.pos.x = 0;
        this.updatePrev();
    }
    if (this.pos.x < 0) {
        this.pos.x = width;
        this.updatePrev();
    }
    if (this.pos.y > height) {
        this.pos.y = 0;
        this.updatePrev();
    }
    if (this.pos.y < 0) {
        this.pos.y = height;
        this.updatePrev();
    }
};

Particle.prototype.follow = function (vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
};

Particle.prototype.updatePrev = function () {
    this.prevPos = this.pos.copy();
}