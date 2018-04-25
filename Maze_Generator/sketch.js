'use strict'

let COLS;
let ROWS;
const W = 20;
const grid = [];
let currCell;
const stack = [];

function index(i, j) {
    if (i < 0 || i >= COLS || j < 0 || j >= ROWS) return -1;
    return i + j * COLS;
}

function removeWalls(a, b) {
    let x = a.i - b.i;
    let y = a.j - b.j;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    }
    else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    else if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    }
    else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function setup() {
    createCanvas(400, 400);
    COLS = floor(width / W);
    ROWS = floor(height / W);

    for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
            let cell = new Cell(i, j);
            grid.push(cell);
        }
    }

    currCell = grid[0];
}

function draw() {
    frameRate(30);

    background(51);

    for (let cell of grid) {
        cell.show();
    }

    currCell.visited = true;
    currCell.highlight();

    let nextCell = currCell.checkNeighbours();
    if (nextCell) {
        nextCell.visited = true;

        stack.push(currCell);

        removeWalls(currCell, nextCell);

        currCell = nextCell;
    }
    else if (stack.length) {
        currCell = stack.pop();
    }
}

class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];
        this.visited = false;
    }
    show() {
        const x = this.i * W;
        const y = this.j * W;

        stroke(150, 150, 150);
        if (this.walls[0]) line(x, y, x + W, y);
        if (this.walls[1]) line(x + W, y, x + W, y + W);
        if (this.walls[2]) line(x, y + W, x + W, y + W);
        if (this.walls[3]) line(x, y, x, y + W);

        fill('rgba(225, 94, 255, 0.6)');
        noStroke();
        if (this.visited) rect(x, y, W, W);
    }

    highlight() {
        fill(252, 38, 245);
        noStroke();
        rect(this.i * W, this.j * W, W, W);
    }

    checkNeighbours() {
        const neighboursToVisit = [];

        const topNeighbour = grid[index(this.i, this.j - 1)];
        const rightNeighbour = grid[index(this.i + 1, this.j)];
        const bottomNeighbour = grid[index(this.i, this.j + 1)];
        const leftNeighbour = grid[index(this.i - 1, this.j)];

        if (topNeighbour && !topNeighbour.visited) neighboursToVisit.push(topNeighbour);
        if (rightNeighbour && !rightNeighbour.visited) neighboursToVisit.push(rightNeighbour);
        if (bottomNeighbour && !bottomNeighbour.visited) neighboursToVisit.push(bottomNeighbour);
        if (leftNeighbour && !leftNeighbour.visited) neighboursToVisit.push(leftNeighbour);

        if (neighboursToVisit.length) {
            let randomNeighbour = neighboursToVisit[floor(random(0, neighboursToVisit.length))];
            return randomNeighbour;
        }
        else return undefined;
    }
}

