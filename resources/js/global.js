if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
var game = null
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
  transitionWallIn()
  setTimeout(() => {
    initializeMaze()
    transitionWallOut()
  },1000)
}

function BotstacleTransition() {
  transitionWallIn()
  setTimeout(() => {
    initializeBostacle()
    transitionWallOut()
  },1000)
}

function pointInRect(point,rect) {
  if (rect.pos.x < point.x && point.x < rect.pos.x + rect.width &&
    rect.pos.y < point.y && point.y < rect.pos.y + rect.height) {
      return true
    }
  return false
}

class Point {
  constructor(x, y, x2=null, y2=null) {
    this.x = x
    this.y = y
    this.x2 = x2
    this.y2 = y2
  }
}