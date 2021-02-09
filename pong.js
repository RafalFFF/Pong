const canva = document.querySelector("#pong");
const context = canva.getContext('2d');
const startButton = document.querySelector("#start");
const resetButton = document.querySelector("#reset");
//dźwięk
const hit = new Audio();
const wall = new Audio();
const score = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
score.src = "sounds/score.mp3";

//punkty graczy 
let score1 = 0;
let score2 = 0;

let drawScore1 = {
    x: 340,
    y: 50,
    color: "white"
}

let drawScore2 = {
    x: 440,
    y: 50,
    color: "white"
}
//Wyniki graczy 
function drawScore(score, x, y, color) {
    context.fillStyle = color;
    context.font = '40px sans-serif';
    context.fillText(score, x, y);
}
//piłka
let ball = {
    x: canva.width / 2,
    y: canva.height / 2,
    r: 10,
    color: "white"
}

function drawBall() {
    context.fillStyle = ball.color;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}

//Paletki 
let racket1 = {
    x: canva.width - 30,
    y: canva.height / 2,
    width: 10,
    height: 60,
}

let racket2 = {
    x: 20,
    y: canva.height / 2,
    width: 10,
    height: 60,
}
//baner końcowy
function drawWinner(winner){
    if(score1>score2){
        winner = "wygrał gracz 1";
    }else winner = " wygrał gracz 2";
   // win.play();
    context.fillStyle = "white";
    context.font = '40px sans-serif';
    context.fillText(winner,canva.width/2-140,canva.height/2);
}
//poruszanie się paletek 

document.addEventListener("keydown", movePadel2);
canva.addEventListener("mousemove", movePadel1);

/*Poruszanie się paletek*/

//sprawdzanie czy są w zasięgu "planszy"
function checkRange(obj) {
    if (obj.y <= 0 || obj.y + obj.height >= canva.height) {
        return false;
    } else return true;
}

function movePadel2(e) {
    if (checkRange(racket2)) {
        switch (e.keyCode) {
            case 38:
                racket2.y -= 10;
                break;
            case 40:
                racket2.y += 10;
                break;
        }
        //jeśli paletki zetnkął się z końcówką planszy zostaną odbite
    } else if (racket2.y <= 0) {
        racket2.y += 2;
    } else if (racket2.y + racket2.height >= canva.height) {
        racket2.y -= 2;
    }
}

function movePadel1(e) {
    if (checkRange(racket1)) {
        racket1.y = e.offsetY - 30;
    }
    //jeśli paletki zetnkął się z końcówką planszy zostaną odbite 
    else if (racket1.y <= 0) {
        racket1.y += 2;
    } else if (racket1.y + racket1.height >= canva.height) {
        racket1.y -= 2;
    }
}

function drawPadle(x, y, hei, wid) {
    context.fillStyle = "white";
    context.fillRect(x, y, wid, hei);
}
//Siatka
function drawNet() {
    for (let i = 0; i < canva.height; i += 20) {
        context.fillStyle = "white";
        context.fillRect(canva.width / 2 - 2.5, i, 5, 10);
    }
}


// sprawdzenie wyników

function checkScore() {
    if (ball.x > canva.width) {
        score1++;
        score.play();
        resetBall();
    } else if (ball.x < 0) {
        score2++;
        score.play();
        resetBall();
    }
}
//zresetowanie pozycji piłki
function resetBall() {
    ball.x = canva.width / 2;
    ball.y = canva.height / 2;
    dX = 4;
    dY = 4;
}

//poruszanie się piłki + sprawdzenie czy w coś uderzyła
let pickup = 0;

let dX = 4;
let dY = 4;

function moveBall() {
    ball.x += dX;
    ball.y += dY;

    //uderzenie w bande
    if (ball.y + ball.r >= canva.height || ball.y + ball.r <= 20) {
        dY = -dY;
        wall.play();
    }
    //Paletka 1 (5 przedziałów zależnie od miejsca uderzenia kąt odbicia jest inny)
    else if ((ball.x + ball.r >= racket1.x) && (dY < 0 || dY == 0)) {
        if ((ball.y + ball.r >= racket1.y && ball.y - ball.r <= racket1.y + 10) || (ball.y - ball.r > racket1.y + 40 && ball.y - ball.r <= racket1.y + 50)) {
            dX = -4;
            dY = -4;
            hit.play();
        } else if ((ball.y - ball.r > racket1.y + 10 && ball.y - ball.r <= racket1.y + 20) || (ball.y - ball.r > racket1.y + 30 && ball.y - ball.r <= racket1.y + 40)) {
            dX = -5;
            dY = -0.75 * 3;
            hit.play();
        } else if (ball.y - ball.r > racket1.y + 20 && ball.y - ball.r <= racket1.y + 30) {
            dX = -7;
            dY = 0;
            hit.play();
        }
    } else if ((ball.x + ball.r >= racket1.x) && (dY > 0 || dY == 0)) {
        if ((ball.y - ball.r >= racket1.y && ball.y - ball.r <= racket1.y + 10) || (ball.y - ball.r > racket1.y + 40 && ball.y - ball.r <= racket1.y + 50)) {
            dX = -4;
            dY = 4;
            hit.play();
        } else if ((ball.y - ball.r > racket1.y + 10 && ball.y - ball.r <= racket1.y + 20) || (ball.y - ball.r > racket1.y + 30 && ball.y - ball.r <= racket1.y + 40)) {
            dX = -5;
            dY = 0.75 * 3;
            hit.play();
        } else if (ball.y - ball.r > racket1.y + 20 && ball.y - ball.r <= racket1.y + 30) {
            dX = -7;
            dY = 0;
            hit.play();
        }
        //Paletka 2 (5 przedziałów w zależności od miejsca uderzenia inny kąt odbicia )
    } else if ((ball.x - ball.r <= racket2.x + racket2.width && ball.x > racket2.x) && (dY < 0 || dY == 0)) {
        if ((ball.y + ball.r >= racket2.y && ball.y - ball.r <= racket2.y + 10) || (ball.y - ball.r > racket2.y + 40 && ball.y - ball.r <= racket2.y + 50)) {
            dX = 4;
            dY = -4;
            hit.play();
        } else if ((ball.y - ball.r > racket2.y + 10 && ball.y - ball.r <= racket2.y + 20) || (ball.y - ball.r > racket2.y + 30 && ball.y - ball.r <= racket2.y + 40)) {
            dX = 5;
            dY = -0.75 * 3;
            hit.play();
        } else if (ball.y - ball.r > racket2.y + 20 && ball.y - ball.r <= racket2.y + 30) {
            dX = 6;
            dY = 0;
            hit.play();
        }
    } else if ((ball.x - ball.r <= racket2.x + racket2.width && ball.x > racket2.x) && (dY > 0 || dY == 0)) {
        if ((ball.y + ball.r >= racket2.y && ball.y - ball.r <= racket2.y + 10) || (ball.y - ball.r > racket2.y + 40 && ball.y - ball.r <= racket2.y + 50)) {
            dX = 4;
            dY = 4;
            hit.play();
        } else if ((ball.y - ball.r > racket2.y + 10 && ball.y - ball.r <= racket2.y + 20) || (ball.y - ball.r > racket2.y + 30 && ball.y - ball.r <= racket2.y + 40)) {
            dX = 5;
            dY = 0.75 * 3;
            hit.play();
        } else if (ball.y - ball.r > racket2.y + 20 && ball.y - ball.r <= racket2.y + 30) {
            dX = 7;
            dY = 0;
            hit.play();
        }
    }
    checkScore();
}
//Zmienne potrzebne do obsługi przycisków
let temp=0;
let temp1=0
let temp2 =1;
function checkClick(){
    temp++;
    if(temp<2){
        game();
    }else return;
}


function game() {
    context.clearRect(0, 0, canva.width, canva.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canva.width, canva.height);
    context.strokeStyle = 'white';
    context.strokeRect(0, 0, canva.width, canva.height);

    drawPadle(racket1.x, racket1.y, racket1.height, racket1.width);
    drawPadle(racket2.x, racket2.y, racket2.height, racket2.width);

    drawNet();
    drawBall();
    moveBall();

    drawScore(score1, drawScore1.x, drawScore1.y, drawScore1.color);
    drawScore(score2, drawScore2.x, drawScore2.y, drawScore2.color);

    let myReq = requestAnimationFrame(game);
    if (score1 == 8 || score2 == 8) {
        score1=0;
        score2=0;
        cancelAnimationFrame(myReq);
        context.clearRect(0, 0, canva.width, canva.height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canva.width, canva.height);
        context.strokeStyle = 'white';
        context.strokeRect(0, 0, canva.width, canva.height);
        resetButton.classList.remove("hide");
        resetButton.classList.add("btn");
        resetButton.style.height = 40 + "px";
        drawWinner();
        temp1=0
        temp2=0;
        
    }
}

function firstDraw() {
    context.clearRect(0, 0, canva.width, canva.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canva.width, canva.height);
    context.strokeStyle = 'white';
    context.strokeRect(0, 0, canva.width, canva.height);
    drawPadle(racket1.x, racket1.y, racket1.height, racket1.width);
    drawPadle(racket2.x, racket2.y, racket2.height, racket2.width);
    drawNet();
    resetButton.classList.add("hide");
}
function resetGame(){
    console.log("click");
    if(temp1==0 && temp2==0){
        game();
    }
    else return;
    temp2=1;
}
firstDraw();
startButton.addEventListener("click", checkClick);
resetButton.addEventListener("click",resetGame);