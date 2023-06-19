if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  initializeHome()
}

function transitionWallIn() {
  var wall = document.getElementById('transition-wall')
  wall.style.display = 'block'
  wall.classList.add('transition-start')
}

function transitionWallOut() {
  var wall = document.getElementById('transition-wall')
  wall.style.display = 'block'
  wall.classList.add('transition-end')
  setTimeout(() => {
    wall.classList.remove('transition-end')
    wall.style.display = 'none'
  }, 1000)
}

function homeTransition() {
  transitionWallIn()
  setTimeout(() => {
    initializeHome()
    transitionWallOut()
  },1000)
}

function mazeTransition() {
  console.log('yay!')
  transitionWallIn()
  setTimeout(() => {
    initializeMaze()
    transitionWallOut()
  },1000)
}