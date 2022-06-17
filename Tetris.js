class Coordinates{ // contains one coordinate to make up squares
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let game; // this is the main reference for all the functions
let gameBoardHeight = 20; // game board height (20 cells) 
let gameBoardWidth = 12; // game board width (12 cells)
let startX = 4; // Starting point of tetromino
let startY = 0; 
let score = 0; 
let level = 1; // different levels could have differnet intervals
let condition = "Playing";  
let direction;
let tetrominos = []; // Array that holds all the tetrominos
let currentTetrominoColor; // curTetromino
let currentTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]]; // generate the first tetromino (for details can see the chart)
let tetrominoColors = ['purple','cyan','blue','pink','orange','green','red']; // Array that holds the colors of the tetrominos
const DIRECTION = { still: 0,down: 1,left: 2,right: 3}; // Tetrominos directions for reference
let stillTetrominos = [...Array(20)].map(e => Array(12).fill(0));  // all zero array that holds stopped tetrominos
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));  // array of the game board coordinates
let coordinateArray = [...Array(gameBoardHeight)].map(e => Array(gameBoardWidth).fill(0)); // For drawing boxes on the canvas

function CanvasSetUp(){  // Set up the game board 
    canvasElement = document.getElementById('gameboard');
    game = canvasElement.getContext('2d'); 
    canvasElement.height = 950; // canvas size - height and width
    canvasElement.width = 956; 
    game.scale(2, 2);
    game.fillStyle = 'white'; // Canvas background 
    game.fillRect(0, 0, canvasElement.width, canvasElement.height);
    game.strokeStyle = 'black'; // Canvas rectangle
    game.strokeRect(8, 8, 280, 460); // the size of the board
    game.fillStyle = 'purple'; // Score label font and color
    game.font = '20px Papyrus, Fantasy';
    game.fillText("SCORE", 330, 98);
    game.strokeRect(300, 107, 161, 24); // Draw score section rectangle
    game.fillText(score.toString(), 310, 127); // Draw score
    game.fillText("LEVEL", 338, 157); // Draw level label text
    game.strokeRect(300, 171, 161, 24); // Draw level rectangle
    game.fillText(level.toString(), 310, 190); // Draw level
    game.fillText("WIN / LOSE", 310, 221); // Draw next label text
    game.fillText(condition, 310, 261)// Draw playing condition
    game.strokeRect(300, 232, 161, 95); // Draw playing condition rectangle
    game.fillText("CONTROLS", 305, 354); // Draw controls label text
    game.strokeRect(300, 366, 161, 104);// Draw controls rectangle
    game.font = '17px Papyrus, Fantasy'; // Draw controls text
    game.fillText("A : Move Left", 310, 388);
    game.fillText("D : Move Right", 310, 413);
    game.fillText("S : Move Down", 310, 438);
    game.fillText("E : Rotate Right", 310, 463);
    tetrisLogo = new Image(160, 54); // logo size
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";
    document.addEventListener('keydown', HandleKeyPress); // Create keyboard listener
    CreateTetrominos(); // generate the first tetromino
    CreateTetromino();
    CreateCoordArray();
    DrawTetromino();
}

setInterval(function(){
    if(condition != "Game Over"){ // This function will be called every one second if the game is still playing
        MoveTetrominoDown();
    }}, 1000);

function CreateCoordArray(){ // Create array with square coordinates [0,0] in pixcels is x:11px y:9px, [1,0] is X:34px Y:9px
    let a = 0, b = 0;
    for(let y = 9; y <= 446; y += 23){ // 9px is 0, which means is the top the board, and 446 is the location of the bottom of board
        for(let x = 11; x <= 264; x += 23){ // 23 is the height (also width) of each sqare
            coordinateArray[a][b] = new Coordinates(x,y);
            a++;
        }
        b++;
        a = 0;
    }
}

function DrawTetrisLogo(){ // Generate the logo on the canvas
    game.drawImage(tetrisLogo, 300, 8, 161, 54); // the location of the logo
}

function DrawTetromino(){
    for(let i = 0; i < currentTetromino.length; i++){
        let x = currentTetromino[i][0] + startX; // Get the coordinates of the tetromino that appears at top of the canvas (starting point)
        let y = currentTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1; // Put Tetromino shape in the gameboard array from changing the zeros to ones
        let coordinateX = coordinateArray[x][y].x; // Look for the x & y values in the lookup table
        let coordinateY = coordinateArray[x][y].y;
        game.fillStyle = currentTetrominoColor; // Draw the tetromino (fill up the corresponding sqaures with colors)
        game.fillRect(coordinateX, coordinateY, 21, 21); // the colored square size is 21 * 21
    }
}

function MoveTetrominoDown(){ // Checks for vertical collision
    direction = DIRECTION.down;
    if(!VerticalCollisionCheck()){
        RemoveTetromino();
        startY++; // moving down one square
        DrawTetromino();
    }
} 

function RemoveTetromino(){ // Clears the previously drawn Tetromino by filling the same squares white color
    for(let i = 0; i < currentTetromino.length; i++){
        let x = currentTetromino[i][0] + startX;
        let y = currentTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coordinateX = coordinateArray[x][y].x;
        let coordinateY = coordinateArray[x][y].y;
        game.fillStyle = 'white';
        game.fillRect(coordinateX, coordinateY, 21, 21);
    }
}

function CreateTetrominos(){ // This function generates all the tetrominos in all shapes (details in the chart)
    // T shape 
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // I shape
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // J shape
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Square shape
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // L shape
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // S shape
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Z shape
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino(){ // This function generates one random tetromino
    let random= Math.floor(Math.random() * tetrominos.length); // Get a random tetromino index
    currentTetromino = tetrominos[random]; // random shape
    currentTetrominoColor = tetrominoColors[random]; // random color
}

function HandleKeyPress(key){ // Each time a move key is pressed, the starting points x or y will be changed 
    if(condition != "Game Over"){
    // A keycode (LEFT)
    if(key.keyCode === 65){
        // Check if It'll hit the wall
        direction = DIRECTION.left;
        if(!HittingTheWall() && !HorizontalCollisionCheck()){
            RemoveTetromino();
            startX--;
            DrawTetromino(); // redraw the tetromino
        } 
    // D keycode (RIGHT)
    } else if(key.keyCode === 68){
        direction = DIRECTION.right;
        if(!HittingTheWall() && !HorizontalCollisionCheck()){
            RemoveTetromino();
            startX++;
            DrawTetromino();
        }
    // S keycode (DOWN)
    } else if(key.keyCode === 83){
        MoveTetrominoDown(); 
    // E keycode (ROTATE)
    } else if(key.keyCode === 69){
        RotateTetromino();
    }
    } 
}

function HittingTheWall(){ // Checks if the tetromino hits the wall and makes the tetromino stop
    let hit = false
    for(let i = 0; i < currentTetromino.length; i++){
        let newCoordinateX = currentTetromino[i][0] + startX;
        if(newCoordinateX <= 0 && direction === DIRECTION.left){
            hit = true;
        } else if(newCoordinateX >= 11 && direction === DIRECTION.right){
            hit = true
        }  
    }
    return hit;
}

function ClearRowCheck(){ // Check for completed rows and track how many rows to delete and where to start deleting
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for (let y = 0; y < gameBoardHeight; y++){
        let done = true;
        for(let x = 0; x < gameBoardWidth; x++)
        {
            let square = stillTetrominos[x][y];
            if (square === 0 || (typeof square === 'undefined'))
            {
                done = false; // If the row is not complete then jump out
                break;
            }
        }
        if (done) 
        {
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            // Delete the line everywhere
            for(let i = 0; i < gameBoardWidth; i++)
            {
                // Update the arrays by deleting previous squares
                stillTetrominos[i][y] = 0;
                gameBoardArray[i][y] = 0;
                // Look for the x & y values in the lookup table
                let coordinateX = coordinateArray[i][y].x;
                let coordinateY = coordinateArray[i][y].y;
                game.fillStyle = 'white';
                game.fillRect(coordinateX, coordinateY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 100; // Add 100 score after a row being completed
        game.fillStyle = 'white';
        game.fillRect(310, 109, 140, 19);
        game.fillStyle = 'purple';
        game.fillText(score.toString(), 310, 127);
        RowsMovingDown(rowsToDelete, startOfDeletion);
    }
}

function GetLastSquareX() // Gets the x value for the last square in the Tetromino
{
    let lastX = 0;
    for(let i = 0; i < currentTetromino.length; i++){
        let square = currentTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}

function VerticalCollisionCheck(){ // Checks for vertical collisions (same steps as the check vertical collison function)
    let tetrominoCopy = currentTetromino; // details are in the chart
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i]; // Move into position based on the changing upper left hand corner of the tetromino
        let x = square[0] + startX;
        let y = square[1] + startY;
        if(direction === DIRECTION.down){
            y++;
        }
        if(typeof stillTetrominos[x][y+1] === 'string'){ // Check if it's going to hit a previously set piece
            RemoveTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }

    if(collision){ // Check for game over and if so set game over text
        if(startY <= 2){
            condition = "Game Over";
            game.fillStyle = 'white';
            game.fillRect(310, 242, 140, 30);
            game.fillStyle = 'purple';
            game.fillText(condition, 310, 261);
        } else {
            for(let i = 0; i < tetrominoCopy.length; i++){
                let indSquare = tetrominoCopy[i];
                let x = indSquare[0] + startX;
                let y = indSquare[1] + startY;
                stillTetrominos[x][y] = currentTetrominoColor;
            }
            ClearRowCheck();
            CreateTetromino();
            direction = DIRECTION.still; // Create the next Tetromino and draw it and reset direction
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }
}

function HorizontalCollisionCheck(){ // Checks for horizontal collisions 
    let tetrominoCopy = currentTetromino;
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (direction == DIRECTION.left){
            x--;
        }else if (direction == DIRECTION.right){
            x++;
        }
        let stoppedShapeVal = stillTetrominos[x][y];
        if (typeof stoppedShapeVal === 'string')
        {
            collision = true;
            break;
        }
    }
    return collision;
}

function RowsMovingDown(rowsToDelete, startOfDeletion){ // Move rows down after a row has been clea
    for (let i = startOfDeletion-1; i >= 0; i--)
    {
        for(let x = 0; x < gameBoardWidth; x++){
            let y2 = i + rowsToDelete;
            let square = stillTetrominos[x][i];
            let nextSquare = stillTetrominos[x][y2];
            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; 
                stillTetrominos[x][y2] = square; // Draw color into stopped
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                game.fillStyle = nextSquare;
                game.fillRect(coorX, coorY, 21, 21);
                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in two arrays
                stillTetrominos[x][i] = 0; 
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                game.fillStyle = 'white';
                game.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino() // This function allows tetrominos rotate
{
    let tetrominoCopy = currentTetromino;
    let currentTetrominoBackUp;
    let newRotation = new Array(); // Handle a reference error by copying an array
    for(let i = 0; i < tetrominoCopy.length; i++){
        currentTetrominoBackUp = [...currentTetromino];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]); // reverse x and y
    }
    RemoveTetromino();
    try{ // Draw the new Tetromino rotation
        currentTetromino = newRotation;
        DrawTetromino();
    }  
    catch (e){ // If there is an error get the backup Tetromino and draw it instead
        if(e instanceof TypeError) {
            currentTetromino = currentTetrominoBackUp;
            RemoveTetromino();
            DrawTetromino();
        }
    }
}

document.addEventListener('DOMContentLoaded', CanvasSetUp); // Set up the canvas when the page is loaded