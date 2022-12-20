import scrabbleJSON from './pieces.json' assert {type: 'json'};

"use strict";

// Path to folder containing all letter tile images
var tileFolder = "graphics_data/scrabble_tiles/";

// Global Variables
var boardArray = [];
var currentWord = [];
var scrabbleBag = [];

// dictionary lookup object
var scrabbleDict = {};

// Global Scrabble Data
var currentScore = 0;
var highestScore = 0;
var rackSize = 7;
var totalTiles = 100;
var tilesOnRack = 7;
var tilesGiven = 0;
var boardSize = 14;

// Bag index when searching for tiles or regenerating distribution
var index;

// On Scrabble Launch
$(document).ready(function() {
    // AJAX request for the dictionary
    $.ajax({
        url: "dictionary.txt",
        success: function(result) {
            var words = result.split("\n");
    
            for (var i = 0; i < words.length; i++) {
                scrabbleDict[words[i].toUpperCase()] = true;
            }
        }
    })    

    createHelpDialog();
    initScoreData();
    generateBoard();
    generateDistribution();
    generateRack();
    makeDroppable();
    createBlankTileMenu();
    displayRemainingTiles();

    if ($("#nextWord").is(":disabled")) {
        $("#nextWord").css("background-color", "red")
    }

    $("#nextWord").click(function() {
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] == '-') {
                continue;
            }

            else {
                tilesOnRack--;
            }
        }

        $("#nextWord").css("background-color", "red")
        $("#word").html("Your word will appear here.");
        $("#nextWord").attr("disabled", true);
        
        getMoreTiles();
        clearBoard();
        clearCurrentScore();
        makeDroppable();
        enableDroppable();
        displayRemainingTiles();
    })

    $("#reset").click(function() {
        tilesGiven = 0;
        currentScore = 0;
        highestScore = 0;
        $("#word").html("Your word will appear here.");
        clearBoard();
        
        // Clear rack
        $("#tile-holder").html("");

        generateDistribution();
        generateRack();
        makeDroppable();
        enableDroppable();
        updateData(false);

        $("#wordDiv").css("background-color", "white");
        $("#nextWord").css("background-color", "red")
        $("#highestScore").html("");
        $("#highestScore").html("Highest Score: " + highestScore);

        // Clear current word array
        currentWord.length = 0;

        totalTiles = 100;
        displayRemainingTiles();
    });

    $("#helpButton").click(function() {
        $("#helpDialog").dialog('open');
    })

    $("#board > div").on("updateBoard", function() {
        readBoard();
    });
})

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
}

// Function to generate the rack with a random set of 7 tiles.
// Calculates a random index based on the size of the bag.
// Creates a div for the tile, then takes that tile out of the bag (splices the array).
function generateRack() {

    for (var i = 0; i < rackSize; i++) {
        tilesGiven++;

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

        if (letterAttribute == "Blank") {
            $(imgAttribute).addClass("blank-tile");
        }

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

                if ($(ui.draggable).hasClass("blank-tile")) {
                    $(ui.draggable).attr("src", tileFolder + "Scrabble_Tile_Blank.jpg");
                }

                $(this).find(".draggable").addClass("tile-on-rack");
                $(this).find(".draggable").removeClass("tile-on-board").trigger("updateBoard");
                readBoard();
            }
        });
    
        $("#tile" + tilesGiven).draggable({
            revert: 'invalid',
            zIndex: 1000,
            revertDuration: 100,
        });    
    
        if (index > -1) {
            scrabbleBag.splice(index, 1);
        } 
    }

    $("#tradeLetter").droppable({
        over: function(event, ui) {
            ui.draggable.remove();
            getNewTile(ui.draggable.attr("letter"));
        }
    })
}

// Clears the board and makes the slots droppable again.
function clearBoard() {
    $("#board > div").html("");
}

// When Next Word button is clicked, the current score is set to 0.
function clearCurrentScore() {
    $("#score").html("Score: 0");
}

// Checks if board slot is empty so it can be droppable again.
function boardSlotIsEmpty(slotNumber) {
    return typeof($("#board > div").attr("id") === undefined);
}

function makeDroppable() {
    $(".boardSlot").droppable({
        accept: function() {
            var slot = $(this).attr("col");

            if (boardSlotIsEmpty(slot)) {
                return true;
            }

            else {
                return false;
            }
        },

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

            if ($(this).find(".draggable").attr("letter") == "Blank") {
                $("#blankTileMenu").dialog('open');
                getChosenTileFromBlank($(ui.draggable), $(ui.draggable).attr("id"));
            }
        }
    });
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

// Function to read the board every time it's updated.
function readBoard() {
    var i = 0;
    var word = "";

    $("#word").html("");
    $("#word").html("");
    console.log("readBoard() called");

    $("#board > div").each(function() {
        let tileLetter = $(this).children("img").attr("letter");
        if (tileLetter === undefined) {
            tileLetter = "-";
        }

        currentWord[i++] = tileLetter;

        if (tileLetter != "-" && tileLetter != "Blank") {
            $("#word").append(tileLetter);
        }
    })

    for (i = 0; i < currentWord.length; i++) {
        if (currentWord[i] != "-") {
            word += currentWord[i];
        }
    }

    console.log("word: " + word);

    if (wordIsValid(word)) {
        calculateScore();
        $("#nextWord").removeAttr("disabled");
        $("#nextWord").css("background-color", "rgb(0,255,0)")
        $("#wordDiv").css("background-color", "rgb(0,255,0)")
    }

    else {
        $("#nextWord").attr("disabled", true);
        $("#nextWord").css("background-color", "red")
        $("#wordDiv").css("background-color", "rgb(255,0,0)");
    }
}

// Update the scores
function updateData(isDoubleWord) {
    var scoreHTML = $("#score");
    var highestScoreHTML = $("#highestScore")

    scoreHTML.html("");

    scoreHTML.html("Score: " + currentScore);

    if (isDoubleWord) {
        currentScore *= 2;
        scoreHTML.html("Score: " + (currentScore));
    }

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
            updateData(doubleWord);
        }

        else if (boardArray[i] == "DoubleLetter") {
            sum += pieces[index].value * 2;
            currentScore = sum;
            updateData(doubleWord);
        }

        else if (boardArray[i] == "DoubleWord") {
            sum += pieces[index].value;
            currentScore = sum;
            doubleWord = true;
            updateData(doubleWord);
        }
    }
}

// When a user trades in a tile
function getNewTile(replacedLetter) {
    tilesGiven++;
    scrabbleBag.push(replacedLetter);

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
}

// When the player submits a word, replace the missing tiles.
function getMoreTiles() {
    var tilesMissing = rackSize - tilesOnRack;
    console.log("tilesMissing" + tilesMissing);

    // Give amount of tiles missing
    for (let i = 0; i < tilesMissing; i++) {
        tilesGiven++;

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
    }

    tilesOnRack = 7;
}

function displayRemainingTiles() {
    $("#tilesLeft").html("");
    $("#tilesLeft").html("Tiles Left: " + (totalTiles - tilesGiven));
}

// CALL ONLY ONCE
// Creates the dialog for the blank tile menu
function createBlankTileMenu() {
    var blankTileMenu = $("#blankTileMenu");
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < alphabet.length; i++) {

        let letterAttribute = alphabet[i];
        let filePath = tileFolder + "Scrabble_Tile_" + letterAttribute + ".jpg";
        let imgAttribute = '<img id="tile_' + letterAttribute + '" src="' + filePath + '" class="tile-menu" letter="' + letterAttribute + '">';

        blankTileMenu.append(imgAttribute);
    }

    blankTileMenu.dialog({
        title: "Choose Your Letter"
    });

    blankTileMenu.dialog({
        open: function() {
            $(".ui-dialog-titlebar-close").hide();
        },
        draggable: false
    });

    blankTileMenu.dialog('close');
}

// Get the user's choice from the blank tile
function getChosenTileFromBlank(blankDraggable, tileID) {
    $("#blankTileMenu > img").click(function() {
        console.log("Tile from menu clicked");
        var newLetter = $(this).attr("letter");

        blankDraggable.attr("letter", newLetter);
        blankDraggable.attr("src", tileFolder + "Scrabble_Tile_" + newLetter + ".jpg");
        tileID = blankDraggable.attr("id");
        $("#blankTileMenu").dialog('close');

        readBoard();
    })
}

function createHelpDialog() {
    $("#helpDialog").dialog({draggable: false});
    $("#helpDialog").dialog('close');
}

// checks if word exists in dictionary
function wordIsValid(wordQuery) {

    console.log(scrabbleDict[wordQuery + "\r"]);

    if (wordQuery.length > 2 && scrabbleDict[wordQuery + "\r"] == true) {
        return true;
    }

    return false;
}