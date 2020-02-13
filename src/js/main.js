const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 180;

const PSIZE = 16;
const C_ALIVE = '#f3f3f3';
const C_DEAD = '#0c0c0c';
let space = [[],[]];

ctx.fillStyle = C_DEAD;
ctx.fillRect(0, 0, canvas.width, canvas.height);

space = [
    [1, 0],
    [0, 1]
]

for (let row = 0; row < space.length; row++) {
    for (let col = 0; col < space[row].length; col++) {
        space[row][col] == 1 ? ctx.fillStyle = C_ALIVE : ctx.fillStyle = C_DEAD;
        ctx.fillRect(PSIZE*col, PSIZE*row, PSIZE, PSIZE);
    }
}

// TODO: Implement Conway's Game of life rules
// TODO: Implement simulation steps