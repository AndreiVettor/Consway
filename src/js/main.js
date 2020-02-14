// INTERFACE ACTIONS
document.addEventListener('keydown', function(e) {
    switch(e.code) {
        case "KeyS":
            console.log(tempSpace);
            simulationStep();
            drawCells();
            console.log(space);
            console.log('step');
            break;
        default:
            break;
    }
});

// EXPERIMENT AREA
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

// canvas.width = 300;
// canvas.height = 180;

const SIZE_UNIVERSE = 50;
const SIZE_CELL = 12;
const SIZE_STROKE = 2;
const C_ALIVE = '#f3f3f3';
const C_DEAD = '#0c0c0c';
const C_STROKE = '#b0b0b0';
let space = [
    [],
    []
];
let tempSpace = [
    [],
    []
];

// Draw background
ctx.fillStyle = C_DEAD;
ctx.fillRect(0, 0, canvas.width, canvas.height);


space = Array(SIZE_UNIVERSE).fill().map(() => Array(SIZE_UNIVERSE).fill(0));

tempSpace = Array(SIZE_UNIVERSE).fill().map(() => Array(SIZE_UNIVERSE).fill(0));

// Initialize Universe
glider = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
]

const offsetX = 2;
const offsetY = 2;
for (let i = 0; i < glider.length; i++) {
    for (let j = 0; j < glider[0].length; j++) {
        space[offsetX + i][offsetY + j] = glider[i][j];
        
    }
}
console.log(space);



function simulationStep() {
    for (let row = 1; row < space.length - 1; row++) {
        for (let col = 1; col < space[row].length - 1; col++) {
            processCellState(row, col, getCellNeighbours(row, col));
        }
    }

    for (let row = 0; row < tempSpace.length; row++) {
        for (let col = 0; col < tempSpace.length; col++) {
            space[row][col] = tempSpace[row][col];
        }
    }
}

function drawCells() {
    for (let row = 1; row < space.length - 1; row++) {
        for (let col = 1; col < space[row].length - 1; col++) {
            space[row][col] == 1 ? ctx.fillStyle = C_ALIVE :
                ctx.fillStyle = C_DEAD;
            ctx.fillRect(
                SIZE_CELL * col, SIZE_CELL * row,
                SIZE_CELL, SIZE_CELL);

            if (space[row][col] == 1) {
                ctx.fillStyle = C_STROKE;
                ctx.strokeRect(
                    SIZE_CELL * col, SIZE_CELL * row,
                    SIZE_CELL, SIZE_CELL);
            }
        }
    }
}

function getCellNeighbours(row, col) {
    let sum = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            sum += space[row + i][col + j];
        }
    }
    sum -= space[row][col];

    return sum;
}

function processCellState(row, col, neighboursNumber) {
    if (neighboursNumber < 2 || neighboursNumber > 3) {
        tempSpace[row][col] = 0;
    } else if (neighboursNumber == 3) {
        tempSpace[row][col] = 1;
    } else if(neighboursNumber == 2 && space[row][col] == 1){
        tempSpace[row][col] = 1;
    } else {
        // Do nothing
    }
}

function main() {
    drawCells();
}

main();