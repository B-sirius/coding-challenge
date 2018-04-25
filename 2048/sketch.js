// 棋盘尺寸
const size = 4;
// 初始数字个数
const initialCount = 4;
// 动画时长（总帧数）
const durationFrame = 0.2 * 60;
// 格子间距
const margin = 10;
// 格子宽高
let w, h;
// 此次操作是否发生滑动
let isSlided = false;
// 动画进行标记
let animationFlag = false;
// 数字记录
let gridMap = [];
let numGridHashMap = {};
// 棋盘背景色
const boardColor = "rgb(233, 233, 233)";
// 空格子颜色
const gridColor = "rgb(200, 200, 200)";
// 数字对应的颜色
const numColorH = {};

function initNumH() {
    let num = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    for (let item of num) {
        let H = map(Math.log(item) / Math.log(2), 1, 10, 29, 335);
        numColorH[item] = H;
    }
}
// 缓动函数
function easeIn(t, b, c, d) {
    return c * (t /= d) * t + b;
}

function setup() {
    createCanvas(400, 400);

    // 计算格子宽高
    w = (width - (size + 1) * margin) / size;
    h = (height - (size + 1) * margin) / size;

    // 初始化数字颜色
    initNumH();
    // 初始化
    newGame();
}

function draw() {
    background(boardColor);
    drawGrid();
}

// 添加一个数字
function addNumGrid() {
    const options = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (gridMap[i][j] === 0)
                options.push({
                    x: i,
                    y: j
                });
        }
    }

    let pos = options[floor(random(options.length))];
    let val = random() > 0.5 ? 2 : 4;
    gridMap[pos.x][pos.y] = val;

    let numGrid = new NumGrid(val, pos.x, pos.y);
    numGridHashMap[`${pos.x}-${pos.y}`] = numGrid;
}

function drawGrid() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            fill(gridColor);
            noStroke();
            rect(i * w + (i + 1) * margin, j * h + (j + 1) * margin, w, h, 5);
        }
    }
    drawNumGrid();
}

// 下划
function slideDown() {
    for (let row = 0; row < size; row++) {
        let endIndex = size - 1;
        for (let col = size - 1; col >= 0; col--) {
            if (gridMap[row][col] !== 0) {
                if (col !== endIndex) {
                    gridMap[row][endIndex] = gridMap[row][col];
                    gridMap[row][col] = 0;
                    // 记录target
                    const item = numGridHashMap[`${row}-${col}`];
                    numGridHashMap[`${row}-${endIndex}`] = item;
                    numGridHashMap[`${row}-${col}`] = null;
                    if (Object.prototype.toString.call(item) === "[object Array]") {
                        for (let numGrid of item) {
                            numGrid.targetPos.y = endIndex;
                        }
                    } else {
                        item.targetPos.y = endIndex;
                    }
                }
                endIndex--;
            }
        }
    }
}

function combineDown() {
    for (let row = 0; row < size; row++) {
        for (let col = size - 1; col >= 1; col--) {
            if (gridMap[row][col] && gridMap[row][col] === gridMap[row][col - 1]) {
                const numGrid1 = numGridHashMap[`${row}-${col - 1}`];
                numGridHashMap[`${row}-${col - 1}`] = null;
                numGrid1.targetPos.y++;
                // 合并时，两个子块暂时合并为数组
                const numGrid2 = numGridHashMap[`${row}-${col}`];
                numGridHashMap[`${row}-${col}`] = [numGrid1, numGrid2];

                gridMap[row][col - 1] = 0;
                gridMap[row][col] *= 2;
            }
        }
    }
}

function operateDown() {
    let originGridStr = gridMap.toString();
    slideDown();
    combineDown();
    slideDown();
    if (originGridStr !== gridMap.toString()) isSlided = true;
    handleNumGrid();
}

// 上划
function slideUp() {
    for (let row = 0; row < size; row++) {
        let startIndex = 0;
        for (let col = 0; col < size; col++) {
            if (gridMap[row][col] !== 0) {
                if (col !== startIndex) {
                    gridMap[row][startIndex] = gridMap[row][col];
                    gridMap[row][col] = 0;
                    // 记录target
                    const item = numGridHashMap[`${row}-${col}`];
                    numGridHashMap[`${row}-${startIndex}`] = item;
                    numGridHashMap[`${row}-${col}`] = null;
                    if (Object.prototype.toString.call(item) === "[object Array]") {
                        for (let numGrid of item) {
                            numGrid.targetPos.y = startIndex;
                        }
                    } else {
                        item.targetPos.y = startIndex;
                    }
                }
                startIndex++;
            }
        }
    }
}

function combineUp() {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size - 1; col++) {
            if (gridMap[row][col] && gridMap[row][col] === gridMap[row][col + 1]) {
                const numGrid1 = numGridHashMap[`${row}-${col + 1}`];
                numGridHashMap[`${row}-${col + 1}`] = null;
                numGrid1.targetPos.y--;
                // 合并时，两个子块暂时合并为数组
                const numGrid2 = numGridHashMap[`${row}-${col}`];
                numGridHashMap[`${row}-${col}`] = [numGrid1, numGrid2];

                gridMap[row][col + 1] = 0;
                gridMap[row][col] *= 2;
            }
        }
    }
}

function operateUp() {
    let originGridStr = gridMap.toString();
    slideUp();
    combineUp();
    slideUp();
    if (originGridStr !== gridMap.toString()) isSlided = true;
    handleNumGrid();
}

// 右划
function slideRight() {
    for (let col = 0; col < size; col++) {
        let endIndex = size - 1;
        for (let row = size - 1; row >= 0; row--) {
            if (gridMap[row][col] !== 0) {
                if (row !== endIndex) {
                    gridMap[endIndex][col] = gridMap[row][col];
                    gridMap[row][col] = 0;
                    // 记录target
                    const item = numGridHashMap[`${row}-${col}`];
                    numGridHashMap[`${endIndex}-${col}`] = item;
                    numGridHashMap[`${row}-${col}`] = null;
                    if (Object.prototype.toString.call(item) === "[object Array]") {
                        for (let numGrid of item) {
                            numGrid.targetPos.x = endIndex;
                        }
                    } else {
                        item.targetPos.x = endIndex;
                    }
                }
                endIndex--;
            }
        }
    }
}

function combineRight() {
    for (let col = 0; col < size; col++) {
        for (let row = size - 1; row >= 1; row--) {
            if (gridMap[row][col] && gridMap[row][col] === gridMap[row - 1][col]) {
                const numGrid1 = numGridHashMap[`${row - 1}-${col}`];
                numGridHashMap[`${row - 1}-${col}`] = null;
                numGrid1.targetPos.x++;
                // 合并时，两个子块暂时合并为数组
                const numGrid2 = numGridHashMap[`${row}-${col}`];
                numGridHashMap[`${row}-${col}`] = [numGrid1, numGrid2];

                gridMap[row - 1][col] = 0;
                gridMap[row][col] *= 2;
            }
        }
    }
}

function operateRight() {
    let originGridStr = gridMap.toString();
    slideRight();
    combineRight();
    slideRight();
    if (originGridStr !== gridMap.toString()) isSlided = true;
    handleNumGrid();
}

// 左划
function slideLeft() {
    for (let col = 0; col < size; col++) {
        let startIndex = 0;
        for (let row = 0; row < size; row++) {
            if (gridMap[row][col] !== 0) {
                if (row !== startIndex) {
                    gridMap[startIndex][col] = gridMap[row][col];
                    gridMap[row][col] = 0;
                    // 记录target
                    const item = numGridHashMap[`${row}-${col}`];
                    numGridHashMap[`${startIndex}-${col}`] = item;
                    numGridHashMap[`${row}-${col}`] = null;
                    if (Object.prototype.toString.call(item) === "[object Array]") {
                        for (let numGrid of item) {
                            numGrid.targetPos.x = startIndex;
                        }
                    } else {
                        item.targetPos.x = startIndex;
                    }
                }
                startIndex++;
            }
        }
    }
}

function combineLeft() {
    for (let col = 0; col < size; col++) {
        for (let row = 0; row < size - 1; row++) {
            if (gridMap[row][col] && gridMap[row][col] === gridMap[row + 1][col]) {
                const numGrid1 = numGridHashMap[`${row + 1}-${col}`];
                numGridHashMap[`${row + 1}-${col}`] = null;
                numGrid1.targetPos.x--;
                // 合并时，两个子块暂时合并为数组
                const numGrid2 = numGridHashMap[`${row}-${col}`];
                numGridHashMap[`${row}-${col}`] = [numGrid1, numGrid2];

                gridMap[row + 1][col] = 0;
                gridMap[row][col] *= 2;
            }
        }
    }
}

function operateLeft() {
    let originGridStr = gridMap.toString();
    slideLeft();
    combineLeft();
    slideLeft();
    if (originGridStr !== gridMap.toString()) isSlided = true;
    handleNumGrid();
}

function keyPressed() {
    if (animationFlag === true) return;
    if (keyCode === DOWN_ARROW) {
        operateDown();
    } else if (keyCode === UP_ARROW) {
        operateUp();
    } else if (keyCode === LEFT_ARROW) {
        operateLeft();
    } else if (keyCode === RIGHT_ARROW) {
        operateRight();
    } else if (keyCode === ENTER) {
        newGame();
    }
}

function isGameover() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (gridMap[i][j] === 0) return false;
            if (i !== size - 1 && gridMap[i][j] === gridMap[i + 1][j]) return false;
            if (j !== size - 1 && gridMap[i][j] === gridMap[i][j + 1]) return false;
        }
    }

    return true;
}

function isWon() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (gridMap[i][j] === 2048) return true;
        }
    }
    return false;
}

function newGame() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!gridMap[i]) gridMap[i] = [];
            gridMap[i][j] = 0;
        }
    }
    numGridHashMap = {};
    for (i = 0; i < initialCount; i++) {
        addNumGrid();
    }
}

class NumGrid {
    constructor(val, x = null, y = null) {
        this.val = val;
        this.pos = {
            x: x,
            y: y
        };
        this.targetPos = {
            x: x,
            y: y
        };
        this.w = 0;
        this.h = 0;
        this.grow();
    }
    grow() {
        let currFrame = 0;
        const startW = this.w;
        const changedW = w - this.w;
        const startH = this.w;
        const changedH = h - this.h;
        const animate = () => {
            this.w = easeIn(currFrame, startW, changedW, durationFrame);
            this.h = easeIn(currFrame, startW, changedW, durationFrame);
            if (currFrame < durationFrame) {
                currFrame++;
                requestAnimationFrame(animate);
            } else {
                this.w = w;
                this.y = y;
            }
        };
        animate();
    }
}

function drawNumGrid() {
    let drawList = [];
    for (let key of Object.keys(numGridHashMap)) {
        if (numGridHashMap[key] !== null) {
            if (
                Object.prototype.toString.call(numGridHashMap[key]) === "[object Array]"
            ) {
                drawList = drawList.concat(numGridHashMap[key]);
            } else {
                drawList.push(numGridHashMap[key]);
            }
        }
    }

    for (let item of drawList) {
        const x = item.pos.x;
        const y = item.pos.y;
        const val = item.val;

        push();
        colorMode(HSL, 360, 100, 100, 1);
        fill(numColorH[item.val], 100, 70, 1);
        noStroke();
        rect(x * w + (x + 1) * margin, y * h + (y + 1) * margin, item.w, item.h, 5);
        pop();

        textAlign(CENTER, CENTER);
        textSize(map(item.w, 0, w, 0, 36));
        fill(0);
        text(
            val,
            x * w + (x + 1) * margin + w / 2,
            y * h + (y + 1) * margin + h / 2
        );
    }
}

function handleNumGrid() {
    let moveList = [];
    let numGridToCombine = [];
    for (let key of Object.keys(numGridHashMap)) {
        if (numGridHashMap[key] !== null) {
            if (
                Object.prototype.toString.call(numGridHashMap[key]) === "[object Array]"
            ) {
                moveList = moveList.concat(numGridHashMap[key]);
                numGridToCombine.push(numGridHashMap[key]);
            } else {
                moveList.push(numGridHashMap[key]);
            }
        }
    }

    let animationCount = 0;

    function isMovingDone() {
        return animationCount === moveList.length;
    }

    for (let item of moveList) {
        const startX = item.pos.x;
        const endX = item.targetPos.x;
        const startY = item.pos.y;
        const endY = item.targetPos.y;

        const changedX = endX - startX;
        const changedY = endY - startY;
        let currFrame = 0;

        function animate() {
            item.pos.x = easeIn(currFrame, startX, changedX, durationFrame);
            item.pos.y = easeIn(currFrame, startY, changedY, durationFrame);
            if (currFrame < durationFrame) {
                currFrame++;
                requestAnimationFrame(animate);
            } else {
                item.pos.x = endX;
                item.pos.y = endY;
                animationCount++;

                // 所有滑动结束
                if (isMovingDone()) {
                    // 改变动画标记
                    animationFlag = false;
                    // 组合一样的数
                    combineNumGrid();
                    // 若滑动，增加一个数
                    if (isSlided) addNumGrid();
                    // 将滑动标记重置
                    isSlided = false;
                    // 检查胜负
                    if (isWon()) {
                        setTimeout(() => {
                            alert("u made it!");
                            newGame();
                        }, 1000);
                    }
                    if (isGameover()) {
                        setTimeout(() => {
                            alert("die!");
                            newGame();
                        }, 1000);
                    }
                }
            }
        }

        animate();
        animationFlag = true;
    }

    function combineNumGrid() {
        for (let numCombines of numGridToCombine) {
            let newNumGrid;
            let val = numCombines[0].val * 2;
            let x = numCombines[0].pos.x;
            let y = numCombines[0].pos.y;
            newNumGrid = new NumGrid(val, x, y);
            numGridHashMap[`${newNumGrid.pos.x}-${newNumGrid.pos.y}`] = newNumGrid;
        }
    }
}
