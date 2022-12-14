import scrabbleJSON from './pieces.json' assert {type: 'json'};

// must add blank tile later
const tileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var graphicsFolder = "./graphics_data/"
var tileFolder = "./graphics_data/scrabble_tiles/";

var currentTiles = [];
var boardArray = [];

var rackSize = 7;
var boardSize = 14;

window.addEventListener("load", (event) => {
    console.log("page has loaded");
    console.log(scrabbleJSON.pieces);

    generateBoard();
    generateRack();
});

// const nextWordButton = document.getElementById("nextWord");
// nextWordButton.addEventListener("click", (event) => {
//     generateRack();
// });

// const resetButton = document.getElementById("reset");
// resetButton.addEventListener("click", (event) => {
//     generateRack();
// });

function generateBoard() {
    var boardElement = document.getElementById("board");
    var i;

    for (i = 0; i < boardSize; i++) {
        boardArray.push("Tile");
    }

    boardArray[2] = boardArray[12] = "DoubleWord";
    boardArray[6] = boardArray[8] = "DoubleLetter";

    for (i = 0; i < boardSize; i++) {

        var tileAttribute = '<div class="boardSlot" row=0 col=' + i + ' style="background-image: url(\'../graphics_data/Scrabble_Board_' + boardArray[i] + '.png\');"></div>'
        boardElement.innerHTML += tileAttribute;
        
    }
}

function generateRack() {
    // make array of tiles.
    // if (remaining != 0) then 
    //      add it to the array.
    //      subtract one from the "remaining" attribute.
    // else
    //      choose again.
    //      if remaining != 0 then repeat above process.

    for (let i = 0; i < rackSize; i++) {
        var index = Math.floor(Math.random() * tileKeys.length - 1) + 1;
        var randomLetter = tileKeys[index];
        
        console.log(randomLetter);

        currentTiles.push(scrabbleJSON.pieces[randomLetter]);
        console.log(scrabbleJSON.pieces[index]["amount"]--);

        let filePath = tileFolder + "Scrabble_Tile_" + randomLetter + ".jpg";
        let imgAttribute = "<img src=\"" + filePath + "\" class='tile-image'/>";
        document.getElementById("tiles").innerHTML += imgAttribute;
    }
}
