var playerOne = undefined, playerTwo = undefined;
var turn = 0;
var buttonCount = 0;
var gridSize = 7;
var filledButtons = 0;

$(document).ready(function () {
    playerOne = prompt("Player One Name:", "Player One");
    playerTwo = prompt("Player Two Name:","Player Two")
    buttonCount = $("button").length;
    checkEmptyName();
    displayTurn();
    disableButtons();
    registerButtonEvent();
});

//only allows upper row of buttons to be clicked.
function disableButtons() {
    for (var index = gridSize; index < buttonCount; index++) {
        $("button").eq(index).attr("disabled", "disabled");
    }
}

//checks whether the names are empty.
function checkEmptyName() {
    if (playerOne == "" || playerOne == null) {
        playerOne = "Player One";
    }

    if (playerTwo === "" || playerTwo == null) {
        playerTwo = "Player Two";
    }
}

//registers event for the buttons.
function registerButtonEvent() {
    $("#wrapper").on("click", "button", function () {
        var index = $("button").index(this);
        var allValidIndexes = getValidIndexesOfColumnButtons(index);
        allValidIndexes = allValidIndexes.reverse();

        for (validIndex of allValidIndexes) {
            if (isValidButton(validIndex)) {
                setButtonClass(validIndex);
                break;
            }
        }
    });
}

//return the valid indexes of buttons in that particular column
function getValidIndexesOfColumnButtons(index) {
    var indexes = [];
    var btnIndex = index;
    while (btnIndex < buttonCount) {
        indexes.push(btnIndex);
        btnIndex += gridSize;
    }
    return indexes;
}

//sets the button color, respective to the player.
function setButtonClass(index) {
    var className = undefined;
    if (turn == 0) {
        className = "blue";
    }
    else {
        className = "red";
    }
    $("button").eq(index).attr("class", className);
    filledButtons++;
    checkGameStatus(index);
    changeTurn();
}

//toggles the turn of thr players.
function changeTurn() {
    if (turn == 0) {
        turn = 1;
    }
    else {
        turn = 0;
    }
    displayTurn();
}

// function to check whether the game can be continued or not.
function checkGameStatus(index) {
    checkHorizontalMatch(index);
    checkVerticalMatch(index);
    checkLeftDiagonal(index);
    checkRightHorizontal(index);
    gameOver(filledButtons === buttonCount, false);
}

//displays whose turn it is to play.
function displayTurn() {
    var player;
    if (turn == 0) {
        player = playerOne;
    }
    else {
        player = playerTwo;
    }
    var turnMessage = "Turn: " + player;
    $("#turn").html(turnMessage);
}

//checks whether a class has been assigned to the button, if yes it returns false
function isValidButton(index) {
    var className = $("button").eq(index).attr("class");
    if (className == undefined) {
        return true;
    }
    return false;
}

// checks whether all colors are same.
function checkMatch(classOne, classTwo, classThree, classFour) {
    if (classOne !== undefined && classOne === classTwo && classOne === classThree && classOne === classFour) {
        return true;
    }
    return false;
}

// checks horizontal match.
function checkHorizontalMatch(index) {
    var start = index % gridSize;
    start = index - start;
    var end = start + gridSize;

    for (; start < end; start++) {
        var classOne = getClass(start);
        var classTwo = getClass(start + 1);
        var classThree = getClass(start + 2);
        var classFour = getClass(start + 3);
        if (checkMatch(classOne, classTwo, classThree, classFour)) {
            gameOver();
        }
    }

}

// checks vertical match.
function checkVerticalMatch(index) {
    var start = index % gridSize;

    for (; start < buttonCount; start = start + gridSize) {
        var classOne = getClass(start);
        var classTwo = getClass(start + gridSize);
        var classThree = getClass(start + (2 * gridSize));
        var classFour = getClass(start + (3 * gridSize));
        if (checkMatch(classOne, classTwo, classThree, classFour)) {
            gameOver();
        }
    }
}

function checkLeftDiagonal(index) {
    var initial = index % gridSize;
    var leftStart = index - (initial * gridSize) - initial;
    var leftIndexes = [];
    var temp = leftStart;
    while (temp < buttonCount) {
        leftIndexes.push(temp);
        temp = temp + gridSize + 1;
    }
    if (leftIndexes.length >= 4) {
        var count = gridSize - 4;
        for (var i = 0; i < leftIndexes.length; i++) {
            if (count < 0) {
                break;
            }
            else {
                var classOne = getClass(leftIndexes[i]);
                var classTwo = getClass(leftIndexes[i + 1]);
                var classThree = getClass(leftIndexes[i + 2]);
                var classFour = getClass(leftIndexes[i + 3]);
                if (checkMatch(classOne, classTwo, classThree, classFour)) {
                    gameOver();
                }
                count--;
            }
        }
    }
}

function checkRightHorizontal(index) {
    var initial = index % gridSize;
    initial = gridSize - initial - 1;
    var rightStart = index - (initial * gridSize) + initial;
    var rightIndexes = [];
    var temp = rightStart;
    while (temp < buttonCount) {
        rightIndexes.push(temp);
        temp = temp + gridSize -1;
    }
    if (rightIndexes.length >= 4) {
        var count = gridSize - 4;
        for (var i = 0; i < rightIndexes.length; i++) {
            if (count < 0) {
                break;
            }
            else {
                var classOne = getClass(rightIndexes[i]);
                var classTwo = getClass(rightIndexes[i + 1]);
                var classThree = getClass(rightIndexes[i + 2]);
                var classFour = getClass(rightIndexes[i + 3]);
                if (checkMatch(classOne, classTwo, classThree, classFour)) {
                    gameOver();
                }
                count--;
            }
        }
    }
}

//indicates that the game is over.
function gameOver(draw = false, won = true) {
    var message = undefined;
    if (draw) {
        message = "Game Over. It's a draw!!";
    }
    else {
        if (won) {
            if (turn == 0) {
                message = playerOne + " Wins!";
            }
            else {
                message = playerTwo + " Wins!";
            }
        }
    }

    if (message !== undefined) {
        alert(message);
        location.reload();
    }

}

//return the class of particular button.
function getClass(index) {
    return $("button").eq(index).attr("class");
}

