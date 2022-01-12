var counter = 0;
var score = 0;
var header = document.querySelector("#header");
var startbutton = document.querySelector("#startButton")
var left = document.querySelector("#left");
var middle = document.querySelector("#middle");
var right = document.querySelector("#right");
var timer;
var timerSpeed = 800;
var numberOfClicksRight = 0;
var stopButton = document.querySelector("#stopButton");
const AUDIO = new Audio('explosionSound.mp3');
let highscoreArray = [
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
]


async function getHighscoreData() {
    const response = await fetch('/api')
        .then(response => response.json())
        .then(response => {
            let objectLength = response.length - 1;
            highscoreArray = response.highscores.highscoreArray;

            // render highscore table on page load

            var highscoreTable = "<table {id = 'highscoretable'}><th>#</th><th>Player</th><th>Highscore</th><tr>";

            for (i = 0; i < highscoreArray.length; i++) {
                for (j = 0; j < highscoreArray[i].length; j++) {}
                highscoreTable += `<td>${i + 1}.</td>` + `<td>${highscoreArray[i][0]}</td>` + `<td>${highscoreArray[i][1]}</td>`;

                // break to next table row after each score 
                var next = i + 1;
                var perRow = 1;
                if (next % perRow == 0 && next != highscoreArray.length) {
                    highscoreTable += "</tr><tr>";
                }
            }
            highscoreTable += "</tr></table>";

            document.getElementById("container").innerHTML = highscoreTable;

        })
};

window.onload = getHighscoreData();

const submitButton = document.getElementById("submitButton");

//randomizer set to integers
function run() {

    counter = Math.floor(Math.random() * 3);

    //determine where the mole should appear

    if (counter == 0) {
        left.style.backgroundImage = "url(mole.jpg)";
    } else {
        left.style.backgroundImage = "url(nomole.jpg)";
    }

    if (counter == 1) {
        middle.style.backgroundImage = "url(mole.jpg)";
    } else {
        middle.style.backgroundImage = "url(nomole.jpg)";
    }

    if (counter == 2) {
        right.style.backgroundImage = "url(mole.jpg)";
    } else {
        right.style.backgroundImage = "url(nomole.jpg)";
    }
}

// Keep track of number of clicks on right div
right.addEventListener("click", function () {
    numberOfClicksRight += 1;
});

function start() {
    timer = setInterval(run, 800);
    score = 0;
    header.innerHTML = ("Score: 0");
};

startbutton.onclick = start;

function stop(divMole1, divMole2, divClick, counterMoment) {
    clearInterval(timer);
    divMole1.style.backgroundImage = "url(nomole.jpg)";
    divMole2.style.backgroundImage = "url(nomole.jpg)";
    AUDIO.play();
    divClick.style.backgroundImage = "url(explosion.gif)";
    document.querySelector(".pop-up").style.display = "flex";
}

//Stop function is called in click functions


function pause() {
    clearInterval(timer);
}
stopButton.onclick = pause;

// make sure name and score are saved in highscore table (highscoreArray)

function assignScore() {
    if (score >= highscoreArray[0][1]) {
        highscoreArray.unshift([playerNameInput.value, score]);
        highscoreArray.pop();
    } else {
        for (let i = 1; i < highscoreArray.length; i++) {
            if (score >= highscoreArray[i][1]) {
                highscoreArray.splice(i, 0, [playerNameInput.value, score]);
                highscoreArray.pop();
                break;
            } else if (score >= highscoreArray[9][1]) {
                highscoreArray.splice(9, 1, [playerNameInput.value, score])
            }
        }
    }
    // Create html table for highscores

    var highscoreTable = "<table {id = 'highscoretable'}><th>#</th><th>Player</th><th>Highscore</th><tr>";

    for (i = 0; i < highscoreArray.length; i++) {
        for (j = 0; j < highscoreArray[i].length; j++) {}
        highscoreTable += `<td>${i + 1}.</td>` + `<td>${highscoreArray[i][0]}</td>` + `<td>${highscoreArray[i][1]}</td>`;

        // break to next table row after each score 
        var next = i + 1;
        var perRow = 1;
        if (next % perRow == 0 && next != highscoreArray.length) {
            highscoreTable += "</tr><tr>";
        }
    }
    highscoreTable += "</tr></table>";

    document.getElementById("container").innerHTML = highscoreTable;
};

async function saveScore() {

    document.querySelector(".pop-up").style.display = "none";
    left.style.backgroundImage = "url(nomole.jpg)";
    middle.style.backgroundImage = "url(nomole.jpg)";
    right.style.backgroundImage = "url(nomole.jpg)";
    assignScore();

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            highscoreArray,
        }),
    };

    fetch('/api', options)
    return;

};

submitButton.onclick = saveScore;

//determine the score once clicked on the mole or once miss-clicked
function leftClick() {
    if (counter == 0) {
        score = score + 1;
        header.innerHTML = "Score: " + score;
    } else {
        stop(middle, right, left, 0);
    }
}

left.onclick = leftClick;

function middleClick() {
    if (counter == 1) {
        score = score + 1;
        header.innerHTML = "Score: " + score;
    } else {
        stop(left, right, middle, 1);

    }
}
middle.onclick = middleClick;

function rightClick() {
    if (counter == 2) {
        score = score + 1;
        header.innerHTML = "Score: " + score;
    } else {
        stop(left, middle, right, 2);
    }
}
right.onclick = rightClick;