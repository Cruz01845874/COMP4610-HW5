import scrabbleJSON from './pieces.json' assert {type: 'json'};

// must add blank tile later
const tileKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var tileFolder = "./graphics_data/scrabble_tiles/";

var currentTiles = [];
var rackSize = 7;

window.addEventListener("load", (event) => {
    console.log("page has loaded");
    console.log(scrabbleJSON.pieces);
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
