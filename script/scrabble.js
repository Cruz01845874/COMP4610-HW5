import scrabbleJSON from './pieces.json' assert {type: 'json'};

const constantTileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
var tileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
var graphicsFolder = "./graphics_data/"
var tileFolder = "./graphics_data/scrabble_tiles/";

var currentTiles = [];
var boardArray = [];
var currentWord = [];

var currentScore = 0;
var highestScore = 0;

var rackSize = 7;
var boardSize = 14;
var totalTiles = 0;

$(document).ready(function() {
    console.log("page has loaded");
    console.log(scrabbleJSON.pieces);

    generateBoard();
    generateRack();

    $("#score").append(currentScore);
    $("#highestScore").append(highestScore);

    for (var i = 0; i < scrabbleJSON.pieces.length; i++) {
        let amount = scrabbleJSON.pieces[i]["amount"];
        totalTiles += amount;
    }

    console.log(totalTiles);
})

const resetButton = $("#reset");

resetButton.click(function() {
    tileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    $("#tile-holder").html("");
    generateRack();
})

function generateBoard() {
    var boardElement = $("#board");
    var i;

    for (i = 0; i < boardSize; i++) {
        boardArray.push("Tile");
    }

    boardArray[2] = boardArray[12] = "DoubleWord";
    boardArray[6] = boardArray[8] = "DoubleLetter";

    for (i = 0; i < boardSize; i++) {
        var tileAttribute = '<div class="boardSlot" id="slot' + i + '" style="background-image: url(\'../graphics_data/Scrabble_Board_' + boardArray[i] + '.png\');"></div>'
        boardElement.append(tileAttribute);

        $("#slot" + i).droppable({
            classes: {"ui-droppable-active": "ui-state-default"},
            hoverClass: "ui-state-active",
            drop: function(event, ui) {
                $(this).append(ui.draggable);

                $(this).find(".draggable").css({
                position: "relative",
                top: 0,
                left: 0,
                margin: "-1px",
                width: $(this).width() + "px"
                });

                $(event.target).droppable("disable");

                let dragLetter = $(this).find(".draggable").attr("letter");
                parseWord(dragLetter);
            }
        });
    }
}

function generateRack() {

    for (let i = 0; i < rackSize; i++) {
        var index = Math.floor(Math.random() * tileKeys.length);
        var randomLetter = tileKeys[index];
        var letterAmount = scrabbleJSON.pieces[index].amount;
        var letterAttribute;
        
        // console.log(randomLetter);
        // console.log(--letterAmount);
        currentTiles.push(scrabbleJSON.pieces[randomLetter]);

        if (randomLetter == '_') {
            letterAttribute = "Blank";
        }

        else {
            letterAttribute = randomLetter;
        }

        let filePath = tileFolder + "Scrabble_Tile_" + letterAttribute + ".jpg";
        let imgAttribute = '<img id="tile' + i + '" src="' + filePath + '" class="tile-image tile-on-rack draggable ui-draggable ui-draggable-handle" letter="' + letterAttribute + '" style="position: relative;">';

        $("#tile-holder").append(imgAttribute);
        $("#tile" + i).draggable({
            revert: 'invalid',
            zIndex: 1000,
            revertDuration: 400,
        });

        if (letterAmount == 0) {
            tileKeys = tileKeys.replace(randomLetter, '');
            // console.log(tileKeys);
        }
    }
}

function parseWord(letterArg) {

    if (letterArg != null) {
        var index = constantTileKeys.indexOf(letterArg);

        var letterValue = scrabbleJSON.pieces[index].value;
        console.log(letterValue);

        var word = $("#word");

        word.append(letterArg);
        currentWord.push(letterArg);
    }

    else {
        currentWord.push('*');
    }
    
    calculateScore();
}

function calculateScore() {

}