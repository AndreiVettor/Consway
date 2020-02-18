// Simulation configuration
const TIME_STEP = 100;

// Graphic configuration
const SIZE_UNIVERSE_X = 50; // grid size
const SIZE_UNIVERSE_Y = 20;
const SIZE_CELL = 24 ;
const SIZE_STROKE = 2;
const C_ALIVE = '#f3f3f3';
const C_DEAD = '#5c5c5c';
const C_STROKE = '#1c1c1c';
const C_HOVER = 'rgba(5, 240, 60, 0.2)';

// INTERFACE ACTIONS
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "KeyS":
            simulationStep();
            drawCells();
            console.log('step');
            break;
        case "Space":
            if (simulation != null) {
                window.clearInterval(simulation);
                // use the simulation handle as a bool until next unpause
                simulation = null;
            } else {
                simulation = setInterval(() => {
                    simulationStep();
                    drawCells();
                }, TIME_STEP);
            }
            break;
        default:
            break;
    }
});


// Initialize canvases

// Background
const bgCanvas = document.getElementById('background');
const bgCtx = bgCanvas.getContext('2d');
// Adapt canvas to matrix size
bgCanvas.width = SIZE_UNIVERSE_X * SIZE_CELL;
bgCanvas.height = SIZE_UNIVERSE_Y * SIZE_CELL;

// Main
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
// Adapt canvas to matrix size
canvas.width = SIZE_UNIVERSE_X * SIZE_CELL;
canvas.height = SIZE_UNIVERSE_Y * SIZE_CELL;

// Overlay
const olCanvas = document.getElementById('overlay');
const olCtx = olCanvas.getContext('2d');
// Adapt canvas to matrix size
olCanvas.width = SIZE_UNIVERSE_X * SIZE_CELL;
olCanvas.height = SIZE_UNIVERSE_Y * SIZE_CELL;

let focusCell = [-1, -1];



// Draw background grid
bgCtx.fillStyle = C_DEAD;
bgCtx.fillRect(0, 0, canvas.width, canvas.height);

bgCtx.beginPath();
for (let i = 0; i < SIZE_UNIVERSE_X + 1; i++) {
    bgCtx.moveTo(i * SIZE_CELL, 0);
    bgCtx.lineTo(i * SIZE_CELL, bgCanvas.height);
}
for (let i = 0; i < SIZE_UNIVERSE_Y + 1; i++) {
    bgCtx.moveTo(0, i * SIZE_CELL);
    bgCtx.lineTo(bgCanvas.width, i * SIZE_CELL);
}

bgCtx.strokeStyle = C_STROKE;
bgCtx.lineWidth = SIZE_STROKE;
bgCtx.stroke();


// Initialize matrix and buffer matrix
let space = [
    [],
    []
];
let tempSpace = [
    [],
    []
];

space = Array(SIZE_UNIVERSE_X).fill().map(() => Array(SIZE_UNIVERSE_Y).fill(0));
tempSpace = Array(SIZE_UNIVERSE_X).fill().map(() => Array(SIZE_UNIVERSE_Y).fill(0));



// Initial state and structures
glider = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
]

// Add structure at offset (x,y)
const offsetX = 2;
const offsetY = 2;
for (let i = 0; i < glider.length; i++) {
    for (let j = 0; j < glider[0].length; j++) {
        space[offsetX + i][offsetY + j] = glider[i][j];
    }
}



// Add canvas interaction
olCanvas.addEventListener("mousemove", (e) => {
    pX = (e.offsetX - e.offsetX % SIZE_CELL);
    pY = (e.offsetY - e.offsetY % SIZE_CELL);

    posY = pY / SIZE_CELL;
    posX = pX / SIZE_CELL;

    if (posX != focusCell[0] || posY != focusCell[1]) {
        olCtx.clearRect(0, 0, olCanvas.width, olCanvas.height);
        olCtx.fillStyle = C_HOVER;
        olCtx.fillRect(
            pX,
            pY,
            SIZE_CELL,
            SIZE_CELL);
        focusCell[0] = posX;
        focusCell[1] = posY;
    }
}, false);

olCanvas.addEventListener("mousedown", (e) => {
    switch (e.button) {
        case 0:
            // LMB
            space[focusCell[0]][focusCell[1]] = 1;
            ctx.fillStyle = C_ALIVE;
            ctx.fillRect(
                focusCell[0] * SIZE_CELL,
                focusCell[1] * SIZE_CELL,
                SIZE_CELL, 
                SIZE_CELL);
            break;
        case 1:
            // MMB 
            break;
        case 2:
            // RMB
            space[focusCell[0]][focusCell[1]] = 0;
            ctx.clearRect(
                focusCell[0] * SIZE_CELL,
                focusCell[1] * SIZE_CELL,
                SIZE_CELL, 
                SIZE_CELL);
            break;
        default:
            break;
    }
}, false);

// Disable context menu
olCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
}, false);



function simulationStep() {
    // All calculations will be applied simultaneously by storing the results in
    // a buffer space

    for (let row = 1; row < space.length - 1; row++) {
        for (let col = 1; col < space[row].length - 1; col++) {
            processCellState(row, col, getCellNeighbours(row, col));
        }
    }

    // Move all calculated cells from the buffer space into the main space
    for (let row = 1; row < tempSpace.length - 1; row++) {
        for (let col = 1; col < tempSpace.length - 1; col++) {
            space[row][col] = tempSpace[row][col];
        }
    }
}

function drawCells() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for (let row = 1; row < space.length - 1; row++) {
        for (let col = 1; col < space[row].length - 1; col++) {
            if (space[row][col] == 1) {
                // Drawing is inverted because of how the javascript reference
                // is setup. X corresponds to column and Y to row.
                // So x -> j and y -> i. 
                ctx.rect(
                    SIZE_CELL * row + SIZE_STROKE / 2,
                    SIZE_CELL * col + SIZE_STROKE / 2,
                    SIZE_CELL - SIZE_STROKE,
                    SIZE_CELL - SIZE_STROKE); 
            }
        }
    }

    ctx.fillStyle = C_ALIVE;
    ctx.fill();
}

function getCellNeighbours(row, col) {
    let sum = 0;

    // Add up all living cells in 3x3 area
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            sum += space[row + i][col + j];
        }
    }
    // Remove middle cell from calculation
    sum -= space[row][col];

    return sum;
}

function processCellState(row, col, neighboursNumber) {
    if (neighboursNumber < 2 || neighboursNumber > 3) {
        // If under/over populated (<2 or >3) kill the cell
        tempSpace[row][col] = 0;
    } else if (neighboursNumber == 3) {
        // Create new cell when there are 3 neighbours
        tempSpace[row][col] = 1;
    } else if (neighboursNumber == 2 && space[row][col] == 1) {
        // Keep the cell alive if it has 2/3 neighbours
        tempSpace[row][col] = 1;
    } else {
        // Do nothing
    }
}

function main() {
    drawCells();
}

main();
let simulation = setInterval(() => {
    simulationStep();
    drawCells();
}, TIME_STEP);