import scrabbleJSON from './pieces.json' assert {type: 'json'};

// Path to folder containing all letter tile images
var tileFolder = "./graphics_data/scrabble_tiles/";

// Global Variables
var boardArray = [];
var currentWord = [];
var scrabbleBag = [];

var currentScore = 0;
var highestScore = 0;

var rackSize = 7;
var remainingTiles = 100;
var tilesOnRack = 7;
var tilesGiven = 7;
var boardSize = 14;

// Bag index when searching for tiles or regenerating distribution
var index;

// On Scrabble Launch
$(document).ready(function() {
    initScoreData();
    generateBoard();
    generateDistribution();
    generateRack();
    makeDroppable();
    displayRemainingTiles();

    $("#nextWord").click(function() {
        getMoreTiles();
        clearBoard();
        clearCurrentScore();
        makeDroppable();
        enableDroppable();
        displayRemainingTiles();
    })

    $("#reset").click(function() {
        clearBoard();

        // Clear rack
        $("#tile-holder").html("");

        generateDistribution();
        generateRack();
        makeDroppable();
        enableDroppable();

        $("#word").html("Word: ");

        // Clear current word array
        currentWord.length = 0;

        remainingTiles = 100;
        displayRemainingTiles();
    });

    $("#board > div").on("updateBoard", function() {
        readBoard();
        calculateScore();
    });
})

// Clears the board and makes the slots droppable again.
function clearBoard() {
    $("#board > div").html("");
}

// When Next Word button is clicked, the current score is set to 0.
function clearCurrentScore() {
    $("#score").html("Score: 0");
}

function makeDroppable() {
    $(".boardSlot").droppable({
        classes: {"ui-droppable-active": "ui-state-default"},
        hoverClass: "ui-state-active",
        drop: function(event, ui) {
        
            $(this).append(ui.draggable);

            $(this).find(".draggable").css({
                position: "relative",
                top: 2,
                left: 0,
                padding: 0
            });

            $(this).find(".draggable").removeClass("tile-on-rack");
            $(this).find(".draggable").addClass("tile-on-board").trigger("updateBoard");

            $(event.target).droppable("disable");

            tilesOnRack--;
            remainingTiles--;
            displayRemainingTiles();
        }
    });

    for (var i = 0; i < rackSize; i++) {
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

function enableDroppable() {
    $(".boardSlot").droppable("enable");
    console.log("boardSlot opened");
}

// Initialize current score and highest score to 0.
function initScoreData() {
    $("#score").append(currentScore);
    $("#highestScore").append(highestScore);
}

// Board Array created for tile placement. 
// Designates type of tile and used to calculate overall score.
function generateBoard() {
    var boardElement = $("#board");
    var i;

    // currentWord array initialized to *, which represent gaps.
    for (i = 0; i < boardSize; i++) {
        boardArray.push("Tile");
        currentWord.push("-");
    }

    // Initialized for board creation
    boardArray[2] = boardArray[12] = "DoubleWord";
    boardArray[6] = boardArray[8] = "DoubleLetter";

    // Div creation
    for (i = 0; i < boardSize; i++) {
        var tileAttribute = '<div class="boardSlot" col="' + i + '" style="background-image: url(\'../graphics_data/Scrabble_Board_' + boardArray[i] + '.png\');"></div>'
        boardElement.append(tileAttribute);
    }
    console.log(boardArray);
}

// Used to initialize and reset the distribution of the Scrabble bag.
// Adds 100 tiles to the array (or resets it) to represent the bag.
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

// Function to generate the rack with a random set of 7 tiles.
// Calculates a random index based on the size of the bag.
// Creates a div for the tile, then takes that tile out of the bag (splices the array).
function generateRack() {

    for (let i = 0; i < rackSize; i++) {
        index = Math.floor(Math.random() * scrabbleBag.length);
        var randomLetter = scrabbleBag[index];
        var letterAttribute;

        if (randomLetter == '_') {
            letterAttribute = "Blank";
        }

        else {
            letterAttribute = randomLetter;
        }

        let filePath = tileFolder + "Scrabble_Tile_" + letterAttribute + ".jpg";
        let imgAttribute = '<img id="tile' + i + '" src="' + filePath + '" class="tile-image tile-on-rack draggable" letter="' + letterAttribute + '" style="position: relative;">';
        $("#tile-holder").append(imgAttribute);

        $("#tile-holder").droppable({
            classes: {"ui-droppable-active": "ui-state-default"},
            hoverClass: "ui-state-active",
            drop: function(event, ui) {
                $(this).append(ui.draggable);

                $(this).find(".draggable").css({
                    position: "relative",
                    top: 2,
                    left: 0,
                });

                $(this).find(".draggable").addClass("tile-on-rack");
                $(this).find(".draggable").removeClass("tile-on-board").trigger("updateBoard");
            }
        });
         
    }
}

// Function to read the board every time it's updated.
function readBoard() {
    var i = 0;

    $("#word").html("");
    $("#word").html("Word: ");
    console.log("readBoard() called");

    $("#board > div").each(function() {
        let tileLetter = $(this).children("img").attr("letter");
        if (tileLetter === undefined) {
            tileLetter = "-";
        }

        currentWord[i++] = tileLetter;

        console.log(tileLetter);
        console.log(currentWord);
        $("#word").append(tileLetter);
    })
}

// Update the scores
function updateData() {
    var scoreHTML = $("#score");
    var highestScoreHTML = $("#highestScore")

    scoreHTML.html("");
    scoreHTML.html("Score: " + currentScore);

    console.log(currentScore);

    if (currentScore > highestScore) {
        highestScore = currentScore;

        highestScoreHTML.html("");
        highestScoreHTML.html("Highest Score: " + highestScore);
    }
}

// Function to calculate score and save the highest score.
function calculateScore() {
    var i = 0;
    var sum = 0;
    var pieces = scrabbleJSON.pieces;
    var doubleWord = false;
    var A = 65; // ASCII code to relate to index

    currentScore = sum;

    for (i = 0; i < boardSize; i++) {
        if (currentWord[i] == '-') {
            continue;
        }

        let index = currentWord[i].charCodeAt() - A;

        if (boardArray[i] == "Tile") {
            sum += pieces[index].value;
            currentScore = sum;
            updateData();
        }

        else if (boardArray[i] == "DoubleLetter") {
            sum += pieces[index].value * 2;
            currentScore = sum;
            updateData();
        }

        else if (boardArray[i] == "DoubleWord") {
            doubleWord = true;
        }
    }
}

// When the player submits a word, replace the missing tiles.
function getMoreTiles() {
    var tilesMissing = rackSize - tilesOnRack;
    console.log("tilesMissing" + tilesMissing);

    // Give amount of tiles missing
    for (let i = 0; i < tilesMissing; i++) {
        index = Math.floor(Math.random() * scrabbleBag.length);
        var randomLetter = scrabbleBag[index];
        var letterAttribute;

        if (randomLetter == '_') {
            letterAttribute = "Blank";
        }

        else {
            letterAttribute = randomLetter;
        }

        let filePath = tileFolder + "Scrabble_Tile_" + letterAttribute + ".jpg";
        let imgAttribute = '<img id="tile' + tilesGiven + '" src="' + filePath + '" class="tile-image tile-on-rack draggable" letter="' + letterAttribute + '" style="position: relative;">';
        $("#tile-holder").append(imgAttribute);

        $("#tile" + tilesGiven).draggable({
            revert: 'invalid',
            zIndex: 1000,
            revertDuration: 100,
        });    
    
        if (index > -1) {
            scrabbleBag.splice(index, 1);
        } 

        tilesGiven++;
    }

    tilesOnRack = 7;
}

function displayRemainingTiles() {
    $("#tilesLeft").html("");
    $("#tilesLeft").html("Tiles Left: " + remainingTiles);
}