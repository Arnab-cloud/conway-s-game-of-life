const board = document.querySelector(".board");
const buttons = document.querySelector(".buttons").children;

const row = 55;
const column = 140;
const size = row*column;
let grid = new Array(row);
let newGrid = new Array(row);

let isPlaying = false;
let drawMode = false;
let isMouseDown = false;
let timer;
let waitingTime = 110;


// initializes the "grid" and "newGrid"
function initializeGrid(){
    for(let i=0; i<row; i++){
        grid[i] = new Array(column);
        newGrid[i] = new Array(column);
    }
    resetGrid();
}

// resets the grid values to false
function resetGrid(){
    for(let i=0; i<row; i++){
        for(let j=0; j<column; j++){
            grid[i][j] = false;
            newGrid[i][j] = false;
        }
    }
}


// creates the table for the GAME OF LIFE to run
// adds the event listeners to each cell
function createTable(){
    const table = document.createElement("table");
    for(let i=0; i<row; i++){
        const tr = document.createElement("tr");
        for(let j=0; j<column; j++){
            const td = document.createElement("td");
            td.setAttribute("class", "dead");
            td.setAttribute("id", i + "_" + j);
            td.onclick = handleCellClick;
            td.addEventListener("mousedown",(e)=>{
                if(drawMode){
                    isMouseDown = true;
                    makeAlive(e.target);
                }
            });
            td.addEventListener("mouseover",(e)=>{
                if(drawMode && isMouseDown) makeAlive(e.target);
            });
            td.addEventListener("mouseup",(e)=>{
                if(drawMode){
                    isMouseDown = false;
                    makeAlive(e.target);
                }
            })
            tr.appendChild(td);
        }
        table.appendChild(tr);           
    }
    board.appendChild(table);
}

// function that make the "tar" cell alive (white)
function makeAlive(tar){
    tar.setAttribute("class", "live");
    const num = tar.getAttribute("id").split("_")
    grid[num[0]][num[1]] = true;
}

// cell click handler function
// updates the class and the value of the corresponding cell
function handleCellClick(){
    if(!drawMode){
        const rowColl = this.id.split("_");
        const row = rowColl[0];
        const col = rowColl[1];
        const classes = this.getAttribute("class");
        if(classes === "dead"){
            this.setAttribute("class", "live");
            grid[row][col] = true;
        }
        else{
            this.setAttribute("class", "dead");
            grid[row][col] = false;
        }
    }
}

// updates the view according to the "Grid" matrix
// updates the class of each cell according their entry in "grid"
function updateView(){
    for(let i=0; i<row; i++){
        for(let j=0; j<column; j++){
            const ele = document.getElementById(`${i}_${j}`);
            if(grid[i][j]){
                ele.setAttribute("class", "live");
            }
            else{
                ele.setAttribute("class", "dead");
            }
        }
    }
}

// copies the "newGrid" into the old "grid"
// resets the "newGrid" 
function updateOldGrid(){
    for(let i=0; i<row; i++){
        for(let j=0; j<column; j++){
            grid[i][j] = newGrid[i][j];
            newGrid[i][j] = false;
        }
    }
}

// function that initializes the game
// control buttons
// creates the table and initializes it
function initialize(){
    initializeControlButtons()
    createTable();
    initializeGrid();
}

// function to make cells alive randomly
function fillWithRandomNumber(){
    const len = Math.floor(Math.random()*size);
    for(let i=0; i<len; i++){
        const idx = Math.floor(Math.random()*size);
        const i = Math.floor(idx/column);
        const j = idx%column;
        grid[i][j] = true;
    }
}

// function to start playing
function play(){
    // calculates the next generation
    nextGen();

    // if the game is still being played
    // delays the next call
    if(isPlaying){
        timer = setTimeout(play, waitingTime);
    }
}

// computes the next gen
function nextGen(){
    for(let i=0; i<row; i++){
        for(let j=0; j<column; j++){
            applyRules(i,j);
        }
    }
    updateOldGrid();
    updateView();
}

// applies the rules of game of life on the cell (i,j)
function applyRules(i,j){
    const count = getNeighbors(i,j);
    if(grid[i][j]){
        if(count < 2 || count > 3) newGrid[i][j] = false;
        else newGrid[i][j] = true;
    }
    else if(count === 3){
        newGrid[i][j] = true; 
    }
}

//modulo
function mod(i,j){
    if(i<0) return j+i;
    else return i%j;
}

// returns the number of alive neighbor cells 
function getNeighbors(i,j){
    let count = 0;
    for(let a=-1; a<2; a++){
        for(let b=-1; b<2; b++){
            if((a!=b || a!=0)  && grid[mod(i+a, row)][mod(j+b, column)]){
                count += 1;
            }
        }
    }
    return count;
}

// initializes control buttons
function initializeControlButtons(){
    const start = buttons[0];
    start.onclick = handleStartButton
    const reset = buttons[1];
    reset.onclick = handleResetButton
    const random = buttons[2];
    random.onclick = handleRandomButton
    const draw = buttons[3];
    draw.onclick = handleDrawButton;
}

// Functionality of the "start" button
function handleStartButton(){
    if(isPlaying){
        isPlaying = false;
        this.innerText = "Continue";
        clearTimeout(timer);
    }
    else{
        isPlaying = true;
        this.innerText = "Pause";
        play();
    }
}

// functionality of the "stop" button 
function handleResetButton(){
    
    isPlaying = false;
    resetGrid();
    updateView();
    buttons[0].innerText = "Start";
}

// functionality of the "Random" button
function handleRandomButton(){
    if(isPlaying) return;
    resetGrid();
    fillWithRandomNumber();
    updateView();
};

// function to handle drawing mode
function handleDrawButton(){
    if(!drawMode){
        this.innerText = "Normal";
        drawMode = true;
    }
    else{
        this.innerText = "Draw";
        drawMode = false;
    }

}

// start the game
initialize();