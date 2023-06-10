// Initialisation
hiding();
let moveHistory = [];
let score1 = 0;
let score2 = 0;
let player1 = "Chien";
let player2 = "Chat";
let avatarColor1 = "none";
let avatarColor2 = "none";
let colonne = 7;
let ligne = 6;
let board = new Array();
let playerTurn = document.getElementById('playerTurn');
let containerElt = document.getElementById('container');
let player = 1;
// let undoActivated = false;

let boutonElt = document.getElementById('newGame');
// Ajout d'un gestionnaire pour l'événement click
boutonElt.addEventListener("click", function () {
    // Joueur 1 est le joueur rouge
    player = 1;
    newGame();
    cleanBoard();
});

// Fonction de création du board
function createBoard(ligne, colonne) {
    // On vide l'affichage
    containerElt.innerHTML = "";
    // On crée l'élément table du DOM
    let tableElt = document.createElement('table');
    // Chaque case est un élément du tableau à deux dimensions
    // On parcours les lignes
    for (let i = 0; i < ligne; i++) {
        // Deuxième dimension du tableau
        board[i] = new Array();
        // Element tr du DOM
        let ligneElt = document.createElement('tr');
        ligneElt.id = "L" + i;
        // On parcours les colonnes de la ligne
        for (let j = 0; j < colonne; j++) {
            // Chaque case est initialisée à 0
            board[i][j] = 0;
            // Element td du DOM
            let colonneElt = document.createElement('td');
            colonneElt.id = "L" + i + "C" + j;
            // Ajout des colonnes à la ligne
            ligneElt.appendChild(colonneElt);
        };
        // Ajout des lignes au tableau
        tableElt.appendChild(ligneElt);
    };
    // ajout du tableau au container
    containerElt.appendChild(tableElt);
}


// Fonction d'initialisation d'une nouvelle partie
function newGame() {
    console.log(board);
    createBoard(ligne, colonne);
    createEvent(ligne, colonne);
    cleanBoard();
    showPlayerTurn();
    hideWinner();
    let playerAvatar = document.getElementById("playerAvatar");
    let currentPlayer = document.getElementById("currentPlayer");
    playerAvatar.src = player == 1 ? "/img/chien.png" : "/img/chat.png";
    currentPlayer.innerHTML = player == 1 ? player1 : player2;
}

function cleanBoard() {
    let colx = document.getElementById("colx");
    let lngy = document.getElementById("lgny");
    let joueur1 = document.getElementById("joueur1")
    let joueur2 = document.getElementById("joueur2")
    joueur1.style.display = "none";
    joueur2.style.display = "none";
    colx.style.display = "none";
    lngy.style.display = "none"
}

// Fonction d'ajout des évènement click sur le tableau
function createEvent(ligne, colonne) {
    // On créé les évènements sur les cases
    for (let i = 0; i < ligne; i++) {
        for (let j = 0; j < colonne; j++) {
            //ajoutEventCase(i,j);
            let caseElt = document.getElementById("L" + i + "C" + j);
            caseElt.addEventListener('click', clickEvent);
        };
    };
}

// Fonction clickEvent
function clickEvent() {
    // if (undoActivated) {
    //     undoActivated = false;

    //     player *= -1;
    // }
    // else {

        let l = Number(this.id.charAt(3));
        let k = ligne - 1;
        moveHistory.push({ row: k, column: l });
        let delay = 0; // délai initial de l'animation
        while (k > -1) {
            if (board[k][l] == 0) {
                let caseMinElt = document.getElementById("L" + k + "C" + l);
                let divElt = document.createElement('div');
                divElt.className = "player";
                caseMinElt.appendChild(divElt);
                divElt.style.backgroundImage = player == 1 ? "url(/img/chien.png)" : "url(/img/chat.png)";
                divElt.style.border = player == 1 ? "solid 3px" + avatarColor1 : "solid 3px" + avatarColor2;
                divElt.style.opacity = 1;
                let playerAvatar = document.getElementById("playerAvatar");
                let currentPlayer = document.getElementById("currentPlayer");
                playerAvatar.src = player == 1 ? "/img/chat.png" : "/img/chien.png";
                currentPlayer.innerHTML = player == 1 ? player2 : player1;
                // currentPlayer.style.color = player == 1 ? avatarColor2 : avatarColor1;

                board[k][l] = player;

                // Ajouter l'animation
                divElt.style.transform = "translateY(-5000%)";
                divElt.style.transition = "transform 1s ease " + delay + "s";
                divElt.offsetHeight; // Pour forcer la réinitialisation de la transition
                divElt.style.transform = "translateY(0)";

                setTimeout(function () {
                    audio.play();
                }, 400);
                // On vérifie la victoire à chaque clic
                checkWin(k, l);
                if (isTie()) {
                    //On supprime les clics
                    for (let i = 0; i < ligne; i++) {
                        for (let j = 0; j < colonne; j++) {
                            let caseElt = document.getElementById("L" + i + "C" + j);
                            setTimeout(() => {
                                caseElt.style.backgroundColor = "gray";
                                let winElt = document.getElementById('winner');
                                winElt.innerHTML = "<h2>Match nul !</h2>";
                                hiding();
                                showWinner();
                                playerTurn.appendChild(winElt);
                                console.log("Match nul");
                            }, 1000);
                            caseElt.removeEventListener('click', clickEvent);

                        };
                    };
                } else {
                    player *= -1;
                }
                k = -1;
            }
            else {
                k--;
            }
        }
    }
// }

let audio = new Audio('/img/bruit jeton.wav');
//i = ligne et j = colonne
function checkWin(i, j) {
    // Vérification horizontale
    let countLigne = 0;
    let h = 0;
    while (h < colonne) {
        if (board[i][h] == player) {
            countLigne++;
            h++;
        }
        else if (board[i][h] !== player && countLigne == 4) {
            h++;
        }
        else {
            countLigne = 0;
            h++;
        };
    };

    // Vérification verticale
    let countColonne = 0;
    let v = 0;
    while (v < ligne) {
        if (board[v][j] == player) {
            countColonne++;
            v++;
        }
        else if (board[v][j] !== player && countColonne == 4) {
            v++;
        }
        else {
            countColonne = 0;
            v++;
        };
    };

    // Vérification diagonale
    let countDiag = 0;
    let d = -Math.min(i, j);

    while (i + d < ligne && j + d < colonne && i + d >= 0 && j + d >= 0) {

        if (board[i + d][j + d] == player) {
            countDiag++;
            d++;
        }
        else if (board[i + d][j + d] !== player && countDiag == 4) {
            d++;
        }
        else {
            countDiag = 0;
            d++;
        };
    };

    // Vérification anti-diagonale
    let countAntiDiag = 0;
    let a = -Math.min(i, colonne - 1 - j);
    while (i + a < ligne && j - a < colonne && i + a >= 0 && j - a >= 0) {
        if (board[i + a][j - a] == player) {
            countAntiDiag++;
            a++;
        }
        else if (board[i + a][j - a] !== player && countAntiDiag == 4) {
            a++;
        }
        else {
            countAntiDiag = 0;
            a++;
        };
    };


    // Affichage Résultat
    if (countLigne >= 4 || countColonne >= 4 || countDiag >= 4 || countAntiDiag >= 4) {

        victoire = true;
        // Affichage Vainqueur
        let gagnant = (player == 1) ? player1 : player2;
        let winElt = document.getElementById('winner');
        hiding();
        showWinner();
        winElt.innerHTML = "<h2>Le vainqueur est " + gagnant + " </h2>";
        playerTurn.appendChild(winElt);
        // Jouer le fichier audio correspondant à la victoire du joueur
        if (player == 1) {
            setTimeout(() => {
                // Mettre à jour l'affichage des scores
                score1++;
                let score1Elt = document.getElementById("score1");
                score1Elt.innerHTML = "Score du " + player1 + ":" + score1;
                //Jouer le cri de guerre
                document.getElementById("victoire-chien").play();
            }, 600);
        } else {
            setTimeout(() => {
                score2++;
                let score2Elt = document.getElementById("score2");
                score2Elt.innerHTML = "Score du " + player2 + ":" + score2;
                document.getElementById("victoire-chat").play();
            }, 600);
        }

        // On supprime les évènements clics
        for (let i = 0; i < ligne; i++) {
            for (let j = 0; j < colonne; j++) {
                let caseElt = document.getElementById("L" + i + "C" + j);
                setTimeout(() => {
                    caseElt.style.backgroundColor = "lightgreen";
                }, 1000);
                caseElt.removeEventListener('click', clickEvent);

            };
        };

    }
    else {
        console.log("tour suivant");
        // Affichage Tour suivant 
    };
}

// function undoMove() {
//     undoActivated = true;
//     if (moveHistory.length > 0) {
//         let lastMove = moveHistory.pop();
//         let row = lastMove.row;
//         let col = lastMove.column;
//         let divElt = document.querySelector("#L" + row + "C" + col + " div");
//         divElt.style.transform = "translateY(-5000%)";
//         divElt.style.transition = "transform 1s ease";
//         divElt.addEventListener("transitionend", function () {
//             divElt.remove();
//             board[row][col] = 0;
//         });
//     }
// }

function showPlayerTurn() {
    let show = document.getElementById("turnVisible");
    // let btnUndo = document.getElementById("btnUndo")
    show.style.display = "block";
    // btnUndo.style.display = "flex";

}

function hiding() {
    let hide = document.getElementById('turnVisible');
    // let btnUndo = document.getElementById("btnUndo")
    hide.style.display = "none";
    // btnUndo.style.display = "none";
}

function isTie() {
    let count = 0;
    for (let i = 0; i < ligne; i++) {
        for (let j = 0; j < colonne; j++) {
            if (board[i][j] !== 0) {
                count++;
            }
        }
    }
    return count === ligne * colonne;
}

function hideWinner() {
    let winner = document.getElementById("winner");
    winner.style.display = "none";
}

function showWinner() {
    let winner = document.getElementById("winner");
    winner.style.display = "block";
}

function assignerValeurColonne() {
    colonne = document.getElementById("x").value;
}

function assignerValeurLigne() {
    ligne = document.getElementById("y").value;
}

function assignerNomPlayer1() {
    player1 = document.getElementById("player1").value;
}

function assignerNomPlayer2() {
    player2 = document.getElementById("player2").value;
}

function assignerAvatarColor1() {
    avatarColor1 = document.getElementById("avatarColor1").value;
    console.log(avatarColor1);
}

function assignerAvatarColor2() {
    avatarColor2 = document.getElementById("avatarColor2").value;
}
