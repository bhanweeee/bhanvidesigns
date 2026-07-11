
let menu = document.querySelector(".menu");

let game = document.querySelector(".game");

let playFriend = document.getElementById("playFriend");

let playComputer = document.getElementById("playComputer");
let cells = document.querySelectorAll(".cell");
let status = document.getElementById("status");
let restart = document.getElementById("restart");

let friendBtn = document.getElementById("friendBtn");
let computerBtn = document.getElementById("computerBtn");

let xScoreText = document.getElementById("xScore");
let oScoreText = document.getElementById("oScore");

let currentPlayer = "X";
let board = ["","","","","","","","",""];
let gameActive = true;
let vsComputer = false;

let xScore = 0;
let oScore = 0;

const winPatterns = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

// ---------------- MODE ----------------

friendBtn.addEventListener("click",function(){

    vsComputer=false;

    restartGame();

    status.innerHTML="👭 Two Player Mode";

});

computerBtn.addEventListener("click",function(){

    vsComputer=true;

    restartGame();

    status.innerHTML="🤖 VS Computer Mode";

});

// ---------------- CLICK ----------------

cells.forEach((cell,index)=>{

    cell.addEventListener("click",()=>{

        if(!gameActive) return;

        if(board[index]!="") return;

        // Computer mode me sirf Bow player click karega
        if(vsComputer && currentPlayer!="X") return;

        playMove(index,currentPlayer);

        if(checkWinner()) return;

        if(vsComputer){

            currentPlayer="O";

            status.innerHTML="🤖 Computer Thinking...";

            setTimeout(()=>{

                computerMove();

            },500);

        }else{

            currentPlayer=currentPlayer=="X"?"O":"X";

            status.innerHTML=currentPlayer=="X"
            ?"🎀 Bow's Turn 🎀"
            :"💖 Heart's Turn 💖";

        }

    });

});

// ---------------- PLAY MOVE ----------------

function playMove(index,player){

    board[index]=player;

    cells[index].textContent=player=="X"?"🎀":"💖";

}

// ---------------- COMPUTER ----------------

function computerMove(){

    if(!gameActive) return;

    // 1. Computer pehle jeetne ki koshish karega
    let move = findBestMove("O");

    // 2. Agar jeet nahi sakta to player ko block karega
    if(move == -1){

        move = findBestMove("X");

    }

    // 3. Agar kuch bhi nahi mila to random move
    if(move == -1){

        let empty = [];

        board.forEach(function(value,index){

            if(value==""){

                empty.push(index);

            }

        });

        move = empty[Math.floor(Math.random()*empty.length)];

    }

    playMove(move,"O");

    if(checkWinner()) return;

    currentPlayer="X";

    status.innerHTML="🎀 Bow's Turn 🎀";

}
function findBestMove(player){

    for(let pattern of winPatterns){

        let a = pattern[0];
        let b = pattern[1];
        let c = pattern[2];

        let values = [board[a], board[b], board[c]];

        if(values.filter(v => v==player).length==2 &&
           values.includes("")){

            if(board[a]=="") return a;
            if(board[b]=="") return b;
            if(board[c]=="") return c;

        }

    }

    return -1;

}
// ---------------- CHECK WINNER ----------------

function checkWinner(){

    for(let pattern of winPatterns){

        let a=board[pattern[0]];
        let b=board[pattern[1]];
        let c=board[pattern[2]];

        if(a=="") continue;

        if(a==b && b==c){

            gameActive=false;

            cells[pattern[0]].classList.add("win");
            cells[pattern[1]].classList.add("win");
            cells[pattern[2]].classList.add("win");

            if(a=="X"){

                xScore++;

                xScoreText.innerHTML=xScore;

            }else{

                oScore++;

                oScoreText.innerHTML=oScore;

            }

            status.innerHTML=
            a=="X"
            ?"👑🎀 Bow Wins!!"
            :"👑💖 Heart Wins!!";

            confetti({
                particleCount:180,
                spread:120,
                origin:{y:0.6}
            });

            return true;

        }

    }

    if(!board.includes("")){

        gameActive=false;

        status.innerHTML="🤝 Draw!";

        return true;

    }

    return false;

}

// ---------------- RESTART ----------------

restart.addEventListener("click",restartGame);

function restartGame(){

    board=["","","","","","","","",""];

    gameActive=true;

    currentPlayer="X";

    status.innerHTML="🎀 Bow's Turn 🎀";

    cells.forEach(cell=>{

        cell.textContent="";

        cell.classList.remove("win");

    });

}
playFriend.addEventListener("click",function(){

    vsComputer = false;

    menu.style.display = "none";

    game.style.display = "block";

    restartGame();

});
playComputer.addEventListener("click",function(){

    vsComputer = true;

    menu.style.display = "none";

    game.style.display = "block";

    restartGame();

});
let resetScore = document.getElementById("resetScore");

resetScore.addEventListener("click",()=>{

    xScore=0;
    oScore=0;

    xScoreText.innerHTML=0;
    oScoreText.innerHTML=0;

});
localStorage.setItem("xScore",xScore);
localStorage.setItem("oScore",oScore);
xScore = Number(localStorage.getItem("xScore")) || 0;
oScore = Number(localStorage.getItem("oScore")) || 0;

xScoreText.innerHTML = xScore;
oScoreText.innerHTML = oScore;
