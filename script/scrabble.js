import scrabbleJSON from './pieces.json' assert {type: 'json'};

// must add blank tile later
var tileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
var graphicsFolder = "./graphics_data/"
var tileFolder = "./graphics_data/scrabble_tiles/";

var currentTiles = [];
var boardArray = [];

var rackSize = 7;
var boardSize = 14;
var totalTiles = 0;

window.addEventListener("load", (event) => {
    console.log("page has loaded");
    console.log(scrabbleJSON.pieces);

    generateBoard();
    generateRack();

    for (var i = 0; i < scrabbleJSON.pieces.length; i++) {
        let amount = scrabbleJSON.pieces[i]["amount"];
        totalTiles += amount;
    }

    console.log(totalTiles);
});

// const nextWordButton = document.getElementById("nextWord");
// nextWordButton.addEventListener("click", (event) => {
//     generateRack();
// });

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", (event) => {
    tileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    document.getElementById("tile-holder").innerHTML = "";
    generateRack();
});

function generateBoard() {
    var boardElement = document.getElementById("board");
    var i;

    for (i = 0; i < boardSize; i++) {
        boardArray.push("Tile");
    }

    boardArray[2] = boardArray[12] = "DoubleWord";
    boardArray[6] = boardArray[8] = "DoubleLetter";

    for (i = 0; i < boardSize; i++) {

        var tileAttribute = '<div class="boardSlot ui-droppable" row=0 col=' + i + ' style="background-image: url(\'../graphics_data/Scrabble_Board_' + boardArray[i] + '.png\');"></div>'
        boardElement.innerHTML += tileAttribute;
    }
}

function generateRack() {

    for (let i = 0; i < rackSize; i++) {
        var index = Math.floor(Math.random() * tileKeys.length - 1) + 1;
        var randomLetter = tileKeys[index];
        var letterAmount = scrabbleJSON.pieces[index].amount;
        var letterAttribute;
        
        console.log(randomLetter);
        console.log(--letterAmount);
        currentTiles.push(scrabbleJSON.pieces[randomLetter]);

        if (randomLetter == '_') {
            letterAttribute = "Blank";
        }

        else {
            letterAttribute = randomLetter;
        }

        let filePath = tileFolder + "Scrabble_Tile_" + letterAttribute + ".jpg";
        let imgAttribute = '<img src="' + filePath + '" class="tile-image ui-draggable ui-draggable-handle" letter="' + letterAttribute + '" style="position: relative;">';

        document.getElementById("tile-holder").innerHTML += imgAttribute;

        if (letterAmount == 0) {
            tileKeys = tileKeys.replace(randomLetter, '');
            console.log(tileKeys);
        }
    }
}
