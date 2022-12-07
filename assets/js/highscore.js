//These functions will be primarily used for the creation, storing, and overall handling of the game high scores.
//At this time, the functions will be coded under the assumption that each game will have five high scores.

//Sets how many high scores will be saved
const totalHighScores = 5;

//Used for array/string translation
//var highScoresArray = getGameName(gameName);

function getGameName (gameName) {
    gameName += '-hs';
    return gameName;
}

//The purpose of this function is to check if the player's score is a "high score"
//The funciton should be called by whatever script will control the "game over" part of the games
function highScoreChecker(gameScore, gameName) {
    var highScoresArray = getGameName(gameName);
    
    var highScores = JSON.parse(localStorage.getItem(highScoresArray)) ?? [];

    //Elvis operator used to return 0 if there is not a full list yet
    var lowestScore = highScores[totalHighScores - 1]?.gameScore ?? 0;

    //This if statement will check if the player's score is greater than the lowest score in the highScoresArray
    //If it is, the if statement will then call the saveHighScore function and the displayHighScores function
    if (gameScore > lowestScore) {
        saveHighScore(gameScore, highScores, highScoresArray);
        displayHighScores(highScoresArray);
    }
}

//The purpose of this function is to save the player's score to the highScores Array
function saveHighScore(gameScore, highScores, highScoresArray) {
    
    //NOTE: It said in the instructions to not use prompts. I am still looking into replacing this code with a modal
    //For the moment, the function will use a prompt, but it will be replaced at some point.
    //Also, need to limit input to just three characters
    var playerName = prompt("CONGRATULATIONS!! Enter your Initials: ");
    var newScore = {gameScore, playerName };

    //This will add the newly recorded score to highScores
    highScores.push(newScore);

    //This will sort the highScores list
    highScores.sort((a, b) => b.score - a.score);

    //This will select the new list
    highScores.splice(totalHighScores);

    //This will save to local storage
    localStorage.setItem(highScoresArray, JSON.stringify(highScores));
}


//The purpose of this function is to display the high score results
function displayHighScores(highScoresArray) {
    const highScores = JSON.parse(localStorage.getItem(highScoresArray)) ?? [];
    const hsList = document.getElementById(highScoresArray);

    hsList.innerHTML = highScores.map((score) => `<li>${score.gameScore} - ${score.name}`).join('');
}
