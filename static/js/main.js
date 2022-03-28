console.log("Haberlas...")

const pacmanButton = document.getElementById("pacman")
const snakeButton = document.getElementById("snake")
const pongButton = document.getElementById("pong")
const spaceinvadersButton = document.getElementById("spaceinvaders")
const puzzleButton = document.getElementById("puzzle")
const postmanButton = document.getElementById("postman")

function buttonFunction(button) {
    location.href = button.id + "/index.html"
}

pacmanButton.onclick = function () { buttonFunction(pacmanButton) }
snakeButton.onclick = function () { buttonFunction(snakeButton) }
pongButton.onclick = function () { buttonFunction(pongButton) }
spaceinvadersButton.onclick = function () { buttonFunction(spaceinvadersButton) }
puzzleButton.onclick = function () { buttonFunction(puzzleButton) }
postmanButton.onclick = function () { buttonFunction(puzzleButton) }

console.log("Las vi.")
