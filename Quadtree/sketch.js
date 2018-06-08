"use strict";
const particles = [];
let qTree;

class Particle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.highlight = false;
    }
    move() {
        this.x += random(-1, 1);
        this.y += random(-1, 1);
    }
    show() {
        noStroke();
        if (this.highlight) fill(255);
        else fill(100);
        ellipse(this.x, this.y, 2 * this.r);
    }
    intersect(other) {
        return (
            Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) <
            Math.pow(this.r + other.r, 2)
        );
    }
    setHighlight(boolean) {
        this.highlight = boolean;
    }
}
class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contain(point) {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }

    intersect(range) {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
}
class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }
    contain(point) {
        let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
        return d <= this.rSquared;
    }
    intersect(range) {
        const xDist = Math.abs(range.x - this.x);
        const yDist = Math.abs(range.y - this.y);

        const r = this.r;

        const w = range.w;
        const h = range.h;

        const edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

        if (xDist > r + w || yDist > r + h) return false;

        if (xDist <= w || yDist <= h) return true;

        return edges <= this.rSquared;
    }
}
class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.boundary.contain(point)) return false;

        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            this.NW.insert(point);
            this.NE.insert(point);
            this.SW.insert(point);
            this.SE.insert(point);
        }

        return true;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);

        this.NW = new QuadTree(nw, this.capacity);
        this.NE = new QuadTree(ne, this.capacity);
        this.SW = new QuadTree(sw, this.capacity);
        this.SE = new QuadTree(se, this.capacity);

        this.divided = true;
    }

    query(range, found = []) {
        if (!range.intersect(this.boundary)) return;
        else {
            for (let p of this.points) {
                if (range.contain(p)) found.push(p);
            }

            if (this.divided) {
                this.NW.query(range, found);
                this.NE.query(range, found);
                this.SW.query(range, found);
                this.SE.query(range, found);
            }
            return found;
        }
    }
}

function setup() {
    createCanvas(600, 400);

    for (let i = 0; i < 1000; i++) {
        particles.push(new Particle(random(width), random(height), 4));
    }
}

function draw() {
    background(51);

    let boundary = new Rectangle(width / 2, height / 2, width, height);
    let qTree = new QuadTree(boundary, 4);

    for (let particle of particles) {
        let point = new Point(particle.x, particle.y, particle);
        qTree.insert(point);

        particle.move();
        particle.show();
        particle.setHighlight(false);
    }

    for (let particle of particles) {
        const range = new Circle(particle.x, particle.y, particle.r * 2);
        const otherPoints = qTree.query(range);
        for (let item of otherPoints) {
            const otherParticle = item.userData;
            if (particle !== otherParticle && particle.intersect(otherParticle))
                particle.setHighlight(true);
        }
    }
}
