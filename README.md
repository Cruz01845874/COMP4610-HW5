# Implementing a Bit of Scrabble with Drag-and-Drop

A Bit of Scrabble by Roberto Cruz

For this last GUI assignment, I have implemented almost all of the features, including
one extra credit. There are a few bugs, however, the majority of the program functions
correctly. I will be explaining the program based off the requirements in the rubric:

PROGRAM INTEGRITY/DESIGN

    Note: the Scrabble Bag is an array of 98 letter tiles and 2 blanks, which respects each
          letter's distribution.

    * Letter tiles in the player’s “hand” are selected randomly from a data structure with the proper
      distribution of the letters - FULLY WORKING

      I imported the JSON file with all the Scrabble letter tiles and placed them into an
      array, respecting the distribution and number of each letter tile in the bag. The bag
      is an array of 100 letters, and, for example, E is repeated 12 times. A random index is 
      chosen every time the user submits a word or a new game is started.

    * Letter tiles can be dragged-and-dropped onto target Scrabble squares - FULLY WORKING
      
      Tiles can be dropped onto any Scrabble square using the jQuery API and its draggable 
      and droppable features. Each board is a div, and each tile an image. When a tile is 
      dragged onto the droppable board slot, it is appended as a child of that board slot div.
    
    * Program identifies which letter tile is dropped onto which Scrabble square - FULLY WORKING

      Every letter tile has a letter attribute based on what letter it is, except for the Blank tile,
      which has a letter attribute of simply "Blank." When a tile is dropped onto the board, it triggers
      an event called updateBoard and then a function called readBoard, which reads every tile on the board
      after every placement or removal. This is also shown in the word info box, which displays if the word
      is valid or not (more on this later).

    * Board includes at least two bonus squares - FULLY WORKING
    
      Not too much here, just that the board has both two Double Letter tiles and Double Word tiles.
      More importantly, they tally up the scores correctly.

    * Score is tallied correctly, including consideration of bonus square multipliers - FULLY WORKING

      Whenever the board is updated AND the word is VALID, the score is tallied and updated continuously
      for any valid word. This works for any place on the tile, and makes sure that any invalid words are
      not tallied.

    * Any number of words can be played until the player wishes to quit or depletes all tiles - FULLY WORKING

      It's incredibly difficult, maybe impossible, to deplete all the tiles. However, the user can't really quit.
      They can reset the game, and are able to keep playing words until they reset and the bag is refilled.

    * After playing a word, only the number of letter tiles needed to bring the player’s “hand” back
      to 7 tiles are selected - FULLY WORKING

      The rack size (7) - number of tiles on the rack = number of tiles missing. The rack fills the tiles up accordingly.
      (This was before I implemented word validation. Now I would probably go back and replace it with the length of the
      valid word.)

    * Score is kept for multiple words until the user restart a new game (implement next vs. restart) - FULLY WORKING
      
      I decided to call each game a session until the user presses the RESET TILES button.
      For a valid word, when the NEXT WORD button is pressed, the word score resets to 0, but the highest score is saved.
      This highest score is reset after the RESET TILES button is pressed and the bag is refilled.

    * Tiles can only be dragged from the “rack” to Scrabble board. If the user drop them anywhere else, they will be 
      bounced back to the “rack” - FULLY WORKING (but modified)

      For this criterion, I decided to have a tile revert based on where it was last dropped. For example,
      once a tile is placed on the board, its new "home" is the board slot where it was placed. Once dragged anywhere
      besides the rack, it will revert to the board slot. This is the same case for if it was dropped on the rack.

    * Once the tile is placed on the Scrabble board, it can be moved back to the “rack” - FULLY WORKING

      A tile placed on the board can be moved back to the rack. It will take up the farthest right slot on the rack.

    * Except for the first letter, all sub-subsequent letters must be placed directly next to or below
      another letter with no space. Else, they will bounce back to the “rack” - PARTIALLY WORKING

      The word validation is critical for this one, as without the green NEXT WORD button, the player cannot move on
      to another word. However, the tiles don't bounce back to the rack if there's a gap in the word.

    * User can always restart the game - FULLY WORKING 
      
      As stated before, the user can restart the game by pressing the RESET TILES button, which refills the Scrabble
      bag back to its full 100 tiles and resets the highest word score for that session.

EXTRA CREDIT

    * Validating to see if a word that the user enters is valid - FULLY WORKING (server-side/on GitHub pages)

      I used AJAX to make a Scrabble dictionary from a dictionary.txt file. Then, every time the board is updated
      and read with the readBoard() function, it checks if that word is valid. The background of the current word div
      and the "Next Word" button itself will light up red if the word is currently invalid and will light up green 
      otherwise. 
      
      The button is disabled when it's red and enabled when it's green, allowing the user to move on once they've pieced
      together a valid word.

    * Tile Trading
    
      This isn't part of the extra credit, but I thought that it should be implemented as it's also a rule of Scrabble.
      If the user gets stuck and doesn't want to reset their score, they can exchange a tile for another random one. 
      Note: this puts it back in the bag so the user can possibly reclaim it again.

KNOWN BUGS
    * Blank tile
    
      As of right now, you cannot choose a different letter for a blank tile after taking it back to the rack. 
      For example, if you select J for your blank tile, that and the other blank tile will turn into a J.