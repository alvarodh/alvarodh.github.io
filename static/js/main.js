console.log("Haberlas...")

const pacmanButton = document.getElementById("pacman")
const snakeButton = document.getElementById("snake")
const pongButton = document.getElementById("pong")
const spaceinvadersButton = document.getElementById("spaceinvaders")

function buttonFunction(button) {
    location.href = button.id + "/index.html"
}

pacmanButton.onclick = function () { buttonFunction(pacmanButton) }
snakeButton.onclick = function () { buttonFunction(snakeButton) }
pongButton.onclick = function () { buttonFunction(pongButton) }
spaceinvadersButton.onclick = function () { buttonFunction(spaceinvadersButton) }

console.log("Las vi.")