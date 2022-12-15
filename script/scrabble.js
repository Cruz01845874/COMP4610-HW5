import scrabbleJSON from './pieces.json' assert {type: 'json'};

// const constantTileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
// var tileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
var graphicsFolder = "./graphics_data/"
var tileFolder = "./graphics_data/scrabble_tiles/";

var currentTiles = [];
var boardArray = [];
var currentWord = [];
var scrabbleBag = [];

var currentScore = 0;
var highestScore = 0;

var rackSize = 7;
var boardSize = 14;
var totalTiles = 0;

$(document).ready(function() {
    console.log("page has loaded");
    console.log(scrabbleJSON.pieces);

    generateBoard();
    generateDistribution();
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
    $("#tile-holder").html("");
    generateDistribution();
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
                currentWord.push(dragLetter);
                parseWord();
            }
        });
    }
}

function generateDistribution() {
    scrabbleBag = [];
    let pieces = scrabbleJSON.pieces;

    for (let i = 0; i < pieces.length; i++) {
        for (let j = 0; j < pieces[i].amount; j++) {
            scrabbleBag.push(pieces[i].letter);
        }
    }

    console.log(scrabbleBag);
}


function generateRack() {

    for (let i = 0; i < rackSize; i++) {
        var index = Math.floor(Math.random() * scrabbleBag.length);
        var randomLetter = scrabbleBag[index];
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

        $("#tile-holder").droppable({
            classes: {"ui-droppable-active": "ui-state-default"},
            hoverClass: "ui-state-active",
            drop: function(event, ui) {
                $(this).append(ui.draggable);

                $(this).find(".draggable").css({
                    position: "relative",
                    margin: "-1px"
                });
            }

        });

        $("#tile-holder").append(imgAttribute);
        $("#tile" + i).draggable({
            revert: 'invalid',
            zIndex: 1000,
            revertDuration: 100,
        });

        if (index > -1) {
            scrabbleBag.splice(index, 1);
        }

        console.log(scrabbleBag);
    }
}

function parseWord() {
    for (let i = 0; i < currentWord.length; i++) {
        
    }
}
