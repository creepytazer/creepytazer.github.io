class Display {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext("2d")
    this.bg = this.context.createLinearGradient(0,canvas.height,canvas.width,0)
    this.bg.addColorStop(0,'rgb(102,100,166)')
    this.bg.addColorStop(1,'rgb(169,169,169)')
    this.context.textAlign = 'center'
  }

  draw(game) {
    this.drawBG()


    if (game.running) {
      this.drawWalls(game.stages.walls)
      this.drawWinZone(game.stages.goal)
      this.drawPlayers(game.playerList) 
      this.drawObstacles(game.stages.obstacles)
    }
    this.drawMenuButtons(game.menu.buttons)
    this.drawMenuText(game.menu.text)
    this.drawMenuImages(game.menu.images)
    
  }

  drawMenuImages(imageList) {
    imageList.forEach((item) => {
      var image = document.createElement('img')
      image.src = `resources/projects/botstacle course/images/${item.img}`
      this.context.drawImage(image,item.pos.x,item.pos.y, item.width, item.height)
    })
  }

  drawMenuText(textList) {
    this.context.lineWidth = 2
    for (var i = 0; i < textList.length; i++) {
      var t = textList[i]
      this.context.fillStyle = t.fillColor
      this.context.strokeStyle = t.outlineColor
      this.context.font = t.font  

      this.context.fillText(t.text, t.pos.x + t.width / 2, t.pos.y + t.fontSize / 3.5 + t.height/2)
      if (t.outlineColor) {this.context.strokeText(t.text, t.pos.x + t.width / 2, t.pos.y + t.fontSize / 3.5 + t.height/2)}
    }
  }

  drawMenuButtons(buttonList) {
    this.context.lineWidth = 5
    for (var i = 0; i < buttonList.length; i++) {
      var b = buttonList[i]
      this.context.fillStyle = b.btnColor
      this.context.strokeStyle = b.btnOutline  
      this.context.fillRect(b.pos.x, b.pos.y, b.width,b.height)
      this.context.strokeRect(b.pos.x, b.pos.y, b.width,b.height)
      if (b.isHovered) {
        this.context.fillStyle = 'rgba(0,0,0,0.2)'
        this.context.fillRect(b.pos.x, b.pos.y, b.width,b.height)

      }
      this.context.fillStyle = b.fontColor
      this.context.strokeStyle = b.fontOutline
      this.context.font = b.font  
      this.context.fillText(b.text, b.pos.x + b.width / 2, b.pos.y + b.fontSize / 3.5 + b.height/2)
      if (b.fontOutline) {this.context.strokeText(b.text, b.pos.x + b.width / 2, b.pos.y + b.fontSize / 3.5 + b.height/2)
    }
    }    
  }

  drawBG() {
    this.context.fillStyle = this.bg
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawWinZone(winZone) {
    this.context.fillStyle = 'rgba(0,255,0,0.5)'
    this.context.fillRect(winZone.pos.x, winZone.pos.y, winZone.width, winZone.height)
  }

  drawPlayers(playerList) {
    this.context.lineWidth = 5

    for (var i = 0; i < playerList.length; i++) {
      this.context.fillStyle = `rgba(255,0,0,${playerList[i].alpha})`
      this.context.strokeStyle = `rgba(0,0,0,${playerList[i].alpha})`
  
      var p = playerList[i]
      this.context.fillRect(p.pos.x, p.pos.y, p.width, p.height)
      this.context.strokeRect(p.pos.x, p.pos.y, p.width, p.height)
    }
    p = playerList[0]
    if (playerList[0].brain.isBest) {
      this.context.fillStyle = `rgba(0,200,0,${playerList[0].alpha})`
      this.context.strokeStyle = `rgba(0,0,0,${playerList[0].alpha})`
      this.context.fillRect(p.pos.x, p.pos.y, p.width, p.height)
      this.context.strokeRect(p.pos.x, p.pos.y, p.width, p.height)

    }
  }
  drawWalls(wallList) {
    this.context.fillStyle = 'black'
    
    for (var i = 0; i < wallList.length; i++) {
      this.context.translate(wallList[i].pos.x + wallList[i].width / 2, wallList[i].pos.y + wallList[i].height / 2)
      this.context.rotate((wallList[i].rotation * Math.PI) / 180)
      this.context.fillRect(-wallList[i].width / 2, -wallList[i].height / 2, wallList[i].width, wallList[i].height)
      this.context.rotate(-((wallList[i].rotation * Math.PI) / 180))
      this.context.translate(-(wallList[i].pos.x + wallList[i].width / 2), -(wallList[i].pos.y + wallList[i].height / 2))
    }
  }
  drawObstacles(obstacleList) {
    this.context.fillStyle = 'blue'
    this.context.strokeStyle = 'black'
    this.context.lineWidth = 5
    for (var i = 0; i < obstacleList.length; i++) {
      var o = obstacleList[i]
      this.context.fillRect(o.pos.x, o.pos.y, o.width, o.height)
      this.context.strokeRect(o.pos.x, o.pos.y, o.width, o.height)

    }
  }
}

class BostacleWinZone {
  constructor(x, y, w, h) {
    this.width = w
    this.height = h
    this.pos = new Point(x,y)
  }
}

class BostacleWall {
  constructor(pos, width=10, height=10, rotation=0) {
    this.pos = pos
    this.rotation = rotation   // in degrees
    this.width = width
    this.height = height
  }
}

class BotstaclePlayer {
  constructor(human, directionCount, x=0, y=0) {
    this.width = 70
    this.height = 70
    this.pos = new Point(x - this.width / 2,y - this.height / 2)
    this.prevPos = new Point(x,y)
    this.dirH = [0,0,0,0]
    this.brain = new BostacleBrain(directionCount)
    this.alpha = 1
    this.movespeed = 15
    this.human = human
    this.dead = false
    this.score = null
    this.reachedGoal = false
  }

  update(game) {
    if (!this.dead && !this.reachedGoal) {
      this.move()
      this.checkBoundries(game.display)
      this.checkWalls(game.stages.walls)
      this.checkObstacles(game.stages.obstacles)  
      this.checkGoal(game.stages.goal)
      this.getScore(game.stages.goal)
    }
    if (this.dead) {
      this.alpha = Math.max(this.alpha - 0.05, 0.2)
    }
    return (!this.dead && !this.reachedGoal)
  }

  checkBoundries(display) {
    this.pos.x = Math.max(Math.min(this.pos.x, display.canvas.width - this.width), 0)
    this.pos.y = Math.max(Math.min(this.pos.y, display.canvas.height - this.height), 0)
  }

  checkObstacles(obstacleList) {
    for (var i = 0; i < obstacleList.length; i++) {
      if (this.checkCollision(this, obstacleList[i])) {
        this.dead = true
      }
    }
  } 

  checkWalls(wallList) {
    for (var i = 0; i < wallList.length; i++) {
      if (this.checkCollision(this, wallList[i])) {
        this.againstWall(wallList[i])
      }
    }
  }
  goPreviousPos() {
    this.pos.x = this.prevPos.x, this.pos.y = this.prevPos.y
    this.pos.x2 = this.prevPos.x2 + 0, this.pos.y2 = this.prevPos.y2 + 0
  }
  againstWall(wall) {
    var pX1 = this.pos.x, pX2 = this.pos.x + this.width
    var pY1 = this.pos.y, pY2 = this.pos.y + this.height
    
    var wX1 = wall.pos.x, wX2 = wall.pos.x + wall.width
    var wY1 = wall.pos.y, wY2 = wall.pos.y + wall.height

    if (this.prevPos.x + this.width < wX1) {
      this.pos.x = wX1 - (this.width + 1)
    } else if (this.prevPos.x > wX2) {
      this.pos.x = wX2 + 1
    }
    if (this.prevPos.y + this.height < wY1) {
      this.pos.y = wY1 - (this.height + 1)
    } else if (this.prevPos.y > wY2) {
      this.pos.y = wY2 + 1
    }
  }

  checkGoal(goal) {
      if (this.checkCollision(this, goal)) {   // if one hitbox is below other
          this.reachedGoal = true
      }
  }

  checkCollision(obj1, obj2) {
    var x1 =  obj1.pos.x, y1 = obj1.pos.y, x2 = x1 + obj1.width, y2 = y1 + obj1.height
    var b1 =  obj2.pos.x, c1 = obj2.pos.y, b2 = b1 + obj2.width, c2 = c1 + obj2.height     
    if (x1 > b2 || b1 > x2 || y1 > c2 || c1 > y2) {
          return false
        }
    return true
  }

  move() {
    this.updatePreviousPos()
    var dir = null
    var toMove = this.movespeed
    if (this.human) {
      dir = [this.dirH[1] + this.dirH[3], this.dirH[0] + this.dirH[2]]
    } else {
      if (this.brain.step == this.brain.directions.length || this.reachedGoal) {
        this.dead = true
        return false
      }
      dir = this.brain.directions[this.brain.step]
      this.brain.step++
    }
    if (dir[0] && dir[1]) {
      toMove = integerDivision(toMove, 1.5)
    }
    this.pos.x += dir[0] * toMove
    this.pos.y += dir[1] * toMove
    return true
  }

  getScore(goal) {
    var x1 = [this.pos.x + this.width / 2, this.pos.y + this.height / 2]
    var x2 = [goal.pos.x + goal.width / 2, goal.pos.y + goal.height / 2]
    this.score = 1 / ((Math.abs(x2[0] - x1[0])**2 + Math.abs(x2[1] - x1[1])**2)**0.5)
    if (this.reachedGoal) {
      this.score += this.brain.directions.length - this.brain.step
    }
  }

  updatePreviousPos() {
    this.prevPos.x = this.pos.x + 0
    this.prevPos.y = this.pos.y + 0
    this.prevPos.x2 = this.pos.x2 + 0
    this.prevPos.y2 = this.pos.y2 + 0
  }
}

class BostacleObstacle {
  constructor(pos, w, h, time, moves=null) {
    this.pos = pos
    this.width = w
    this.height = h
    this.time = time  // in frames, to each move
    this.step = 0

    this.moves = moves
    this.moveIndex = 0
    this.reverse = false
  }

  update() {
    if (this.moves && this.moves.length > 1) {
      this.move()
      if (this.step >= this.time - 1) {
        this.iterateMoveIndex()
      }
    }
  }

  move() {
    var x1 = this.moves[this.moveIndex].x, y1 = this.moves[this.moveIndex].y
    if (!this.reverse) {
      var x2 = this.moves[this.moveIndex + 1].x, y2 = this.moves[this.moveIndex + 1].y
    } else {
      var x2 = this.moves[this.moveIndex - 1].x, y2 = this.moves[this.moveIndex - 1].y
    }
    var amount = (1 / this.time) * this.step
    this.pos.x = x1 + (x2 - x1) * amount
    this.pos.y = y1 + (y2 - y1) * amount
    this.step += 1
  }

  iterateMoveIndex() {
    if (this.reverse){
      this.moveIndex--
    } else {
      this.moveIndex++
    }
    if (this.moveIndex == this.moves.length -1) {
      this.reverse = true
    } else if (this.moveIndex == 0) {
      this.reverse = false
    }
    this.step = 0
  }
}

class BostacleBrain {
  constructor(directionCount, mutationRate = 0.1) {
    this.directions = this.getRandomDirections(directionCount)
    this.step = 0
    this.mutationRate = mutationRate
    this.isBest = false
  }

  getRandomDirections(count) {
    var directions = []
    for (var i = 0; i < count; i++) {
      directions.push([getRandomInt(3) - 1, getRandomInt(3) - 1])
    }
    return directions
  }

  mutateDirections() {
    for (var i = 0; i < this.directions.length; i++) {
      var chance = Math.random()
      if (chance < this.mutationRate) {
        this.directions[i] = [getRandomInt(3) - 1, getRandomInt(3) - 1]
      }
    }
  }
}

class BostacleGame {
  constructor() {
    this.running = false

    this.menu = new BostacleHud

    this.stages = new BostacleStages
    this.maxPlayerMoves = 5
    this.currentPlayerMoves = 0
    this.playerMovesIncreseRate = 1
    this.playerMovesIncreseAmount = 5

    this.gameSpeed = 30
    this.generation = 1
    this.display = new Display(document.getElementById('project-canvas'))
    this.playerList = null
    this.gameInterval =  null
    this.winZone = new BostacleWinZone(1850, 530, 230, 390)
    this.wallList = this.stages.walls
    this.obstacleList = this.stages.obstacles
    this.update = setInterval(()=>{this.playFrame()},this.gameSpeed)
  }

  startGame(numberOfBots) {
    this.stages.setStage1()
    this.menu.inGame()

    this.running = true
    this.maxPlayerMoves = 5
    this.currentPlayerMoves = 0
    this.playerMovesIncreseRate = 1
    this.playerMovesIncreseAmount = 5

    this.playerList = []
    if (numberOfBots > 0) {
      for (var i = 0; i < numberOfBots; i++) {
        this.playerList.push(new BotstaclePlayer(false, this.maxPlayerMoves,this.stages.playerSpawn[0],this.stages.playerSpawn[1]))
      }
    } else {
      this.playerList = [new BotstaclePlayer(true, 0,this.stages.playerSpawn[0],this.stages.playerSpawn[1])]
    }
  }

  endGame() {
    this.running = false
    this.menu.stageSelect()
    this.playerList = []
    this.generation = 1
    this.stages.removeStage()
  }

  playFrame() {
    if (this.running) {
      this.updatePlayers()
      this.updateObstacles()
      this.currentPlayerMoves++  
    }
    this.menu.update()
    this.display.draw(this)
  }

  updateObstacles() {
    for (var i = 0; i < this.stages.obstacles.length; i++) {
      this.stages.obstacles[i].update()
    }
  }

  updatePlayers() {
    var allDead = true
    for (var i = 0; i < this.playerList.length; i++) {
        if (this.playerList[i].update(this)) {
          allDead = false
        }
    }
    
    if (allDead || (this.currentPlayerMoves == this.maxPlayerMoves && !this.playerList[0].human)) {
      if (!this.playerList[0].human) {
        if (this.playerList[0].reachedGoal) {
          this.maxPlayerMoves = this.playerList[0].brain.step
        } else if (this.generation % this.playerMovesIncreseRate == 0) {
          this.maxPlayerMoves += this.playerMovesIncreseAmount
        }
        this.remakeBots()
      } else {
        this.playerList[0] = new BotstaclePlayer(true, 0,this.stages.playerSpawn[0],this.stages.playerSpawn[1])
      }
      this.currentPlayerMoves = 0
      this.generation++
    }
  }

  remakeBots() {
    var nextGeneration = [];
    for (var i = 0; i < this.playerList.length; i++) {
      nextGeneration[i] = new BotstaclePlayer(false, 0, this.stages.playerSpawn[0],this.stages.playerSpawn[1])
    }
    this.createNextGeneration(nextGeneration)
    this.mutateNextGeneration(nextGeneration)
    if (this.maxPlayerMoves > nextGeneration[0].brain.directions.length) {
      this.addPlayerMoves(nextGeneration)
    }
    this.playerList = nextGeneration
    this.playerList[0].isBest = true
    this.generations++
  }

  addPlayerMoves(nextGeneration) {
    for (var i = 0; i < nextGeneration.length; i++) {
      var extendedDirections = nextGeneration[i].brain.getRandomDirections(this.playerMovesIncreseAmount)
      nextGeneration[i].brain.directions.push(...extendedDirections)
    }
  }

  createNextGeneration(nextGeneration) {
    var alphaParent = this.selectBestParent()
    for (var i = 0; i < nextGeneration.length; i++) {
      for (var j = 0; j < alphaParent.brain.directions.length; j++) {
        nextGeneration[i].brain.directions[j] = [alphaParent.brain.directions[j][0],alphaParent.brain.directions[j][1]]
      }
    }
  }

  selectRngParent() {
    var randomCheck = getRandomInt(this.calculateTotalScore())
    var total = 0
    for (var i = 0; i < this.playerList.length; i++) {
      total += this.playerList[i].score
      if (total > randomCheck) {
        return this.playerList[i]
      }
    }
  }

  selectBestParent() {
    var bestParent = null
    var bestScore = 0
    for (var i = 0; i < this.playerList.length; i++) {
      if (this.playerList[i].score > bestScore) {
        bestScore = this.playerList[i].score
        bestParent = this.playerList[i]
      }
    }
    console.log(bestParent.score)
    console.log(bestParent.brain.step)
    return bestParent
  }
  calculateTotalScore() {
    var totalScore = 0
    for (var i = 0; i < this.playerList.length; i++) {
      totalScore += this.playerList[i].score
    }
    return totalScore
  }

  mutateNextGeneration(nextGeneration) {
    for (var i = 1; i < nextGeneration.length; i++) {
      nextGeneration[i].brain.mutateDirections()
    }
    nextGeneration[0].brain.isBest = true
  }

  addEventListeners() {
    this.display.canvas.addEventListener("keydown", (event) => {
      this.keyDown(event.key)
    })
    this.display.canvas.addEventListener("keyup", (event) => {
      this.keyUp(event.key)
    })
    this.display.canvas.addEventListener("mousemove", (event) => {
      var rect = this.display.canvas.getBoundingClientRect(),
        scaleX = this.display.canvas.width / rect.width,
        scaleY = this.display.canvas.height / rect.height
      this.hoverButtons((event.clientX - rect.left)* scaleX,(event.clientY - rect.top)* scaleY)
    })
    this.display.canvas.addEventListener("click", (event) => {
      var rect = this.display.canvas.getBoundingClientRect(),
        scaleX = this.display.canvas.width / rect.width,
        scaleY = this.display.canvas.height / rect.height
      this.clickButtons((event.clientX - rect.left)* scaleX,(event.clientY - rect.top)* scaleY)
    })
  }

  hoverButtons(mouseX, mouseY) {
    var buttons = this.menu.buttons
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i]
      if (pointInRect(new Point(mouseX, mouseY),b)) {
            b.isHovered = true
          } else {b.isHovered = false}
    }
  }

  clickButtons(mouseX,mouseY) {
    var buttons = this.menu.buttons
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i]
      if (pointInRect(new Point(mouseX, mouseY),b)) {
            this.buttonFunction(b.use)
          } 
  }
}

  buttonFunction(use) {
    switch(use) {
      case 'stageSelect' :
        this.menu.stageSelect()
        break
      case 'startGame' :
        this.startGame(500)
        break
      case 'slidesPlus' :
        this.menu.iterateSlides(0)
        break
      case 'slidesMinus' :
        this.menu.iterateSlides(1)
        break
    }
  }

  keyDown(key) {
      switch(key) {
        case 'w' : if (this.menu.menuState == 'inGame') {
          this.playerList[0].dirH[0] = -1
        } 
          break
        case 'd' : if (this.menu.menuState == 'inGame') {
          this.playerList[0].dirH[1] = 1
        }
          break
        case 's' : if (this.menu.menuState == 'inGame') {
          this.playerList[0].dirH[2] = 1
        }
          break
        case 'a' : if (this.menu.menuState == 'inGame') {
          this.playerList[0].dirH[3] = -1
        }
          break
        case 'Escape' : if (this.menu.menuState[0] == 'inGame') {
          this.endGame()
        } else if (this.menu.menuState[0] == 'stageSelect') {
          this.menu.mainMenu()
        }
          break
      }
    
  }
  keyUp(key) {
    if (this.running) {
      switch(key) {
        case 'w' : this.playerList[0].dirH[0] = 0
          break
        case 'd' : this.playerList[0].dirH[1] = 0
          break
        case 's' : this.playerList[0].dirH[2] = 0
          break
        case 'a' : this.playerList[0].dirH[3] = 0
          break
      }
    }
  }
}

function initializeBostacle() {
  botstacleHTML()
  game = new BostacleGame()
  game.addEventListeners()
}

class BostacleHud {
  constructor() {
    this.buttons = null
    this.images = null
    this.text = null
    this.menuState = ['mainMenu']
    this.mainMenu()
  }

  iterateSlides(right) {
    function move(item, dist) {
      var x1 = item.pos.x + item.width / 2, x2 = item.pos.x + dist + item.width / 2
      if (item.movement) {
        x2 = item.movement[1].x + dist
      }
      item.movement = [new Point(x1, item.pos.y + item.height / 2), new Point(x2, item.pos.y + item.height / 2),30, 0]
    }
    var dist = 1600
    if (!right) {
      if (this.menuState[1] == 3) {return}
      this.menuState[1]++
      dist *= -1
    } else {if (
      this.menuState[1] == 0) {return}
      this.menuState[1]--
    }
    this.buttons.slice(3).forEach((item) => {
      move(item, dist)
    })
    this.text.slice(1).forEach((item) => {
      move(item, dist)
    })
    this.images.slice(0).forEach((item) => {
      move(item, dist)
    })
  }

  update() {
    function translate(item) {
      if (!(item.movement && item.movement[2] + 1 > item.movement[3])) {
      return}
      var x1 = item.movement[0].x, y1 = item.movement[0].y
      var x2 = item.movement[1].x, y2 = item.movement[1].y
      
      var amount = (1 / item.movement[2]) * item.movement[3]
      item.pos.x = x1 + (x2 - x1) * amount - item.width / 2
      item.pos.y = y1 + (y2 - y1) * amount - item.height / 2
      item.movement[3] += 1
      if (item.movement[3] > item.movement[2]) {
        item.movement = null
      }
    }
    this.buttons.forEach((item) => {translate(item)});
    this.images.forEach((item) => {translate(item)});
    this.text.forEach((item) => {translate(item)});
  }

  mainMenu() {
    this.menuState = ['mainMenu']
    this.images = []
    this.buttons = [new BotsacleButton('Stage Select',new Point(980, 1500), 600, 150,[new Point(1280, 1500),new Point(1280,1000),25,0],'stageSelect'), new BotsacleButton('About',new Point(1280, 1700), 600, 150,[new Point(1280, 1700),new Point(1280,1200),25,0],'startGame')]
    this.text = [new BostacleText('Bostacle Course!',new Point(930,300),700, 200,null,'Arial',130,'#4deb21','black')]
  }

  stageSelect() {
    this.menuState = ['stageSelect', 0]
    this.images = [
      new BostacleImage('createStage.png',new Point(680,350),1200,675),
      new BostacleImage('stage1.png',new Point(2280,350),1200,675),
      new BostacleImage('createStage.png',new Point(3880,350),1200,675),
      new BostacleImage('stage1.png',new Point(5480,350),1200,675),

    ]
    this.buttons = [
      new BotsacleButton('Start',new Point(980,1195),600,120,null,'startGame'),
      new BotsacleButton('||',new Point(1610,1195),210,120,null,'slidesPlus'),
      new BotsacleButton('||',new Point(740,1195),210,120,null,'slidesMinus'),
      new BotsacleButton('', new Point(690, 360),1200, 675,null,null,null,null,null,null,'rgb(100,100,100)','rgba(0,0,0,0)'),
      new BotsacleButton('', new Point(2290, 360),1200, 675,null,null,null,null,null,null,'rgb(100,100,100)','rgba(0,0,0,0)')

    ]
    this.text = [
      new BostacleText('Select Stage',new Point(980,50),600,300,null,'Arial',130,'white','black',2),
      new BostacleText('Create Stage', new Point(680,1045),1200,100),
      new BostacleText('Stage 1', new Point(2280,1045),1200,100)
    ]
  }

  inGame() {
    this.menuState = ['inGame']
    this.buttons = []
    this.images = []
    this.text = []
  }
}

class BotsacleButton {
  constructor(text, pos, w, h,movement=null, use=null, font='Arial', fontSize='100', fontColor='black', fontOutline=null, btnColor='#bbd5f2', btnOutline='#1f1f1f') {
    this.text = text
    this.pos = pos
    this.width = w
    this.height = h
    this.font = `${fontSize}px ${font}`
    this.fontSize = fontSize
    this.fontColor = fontColor
    this.fontOutline = fontOutline
    this.btnColor = btnColor
    this.btnOutline = btnOutline
    this.isHovered = false
    this.use = use
    this.movement = movement    // [endPos, frames, currFrame] LERP IT
  }
}
class BostacleText {
  constructor(text, pos, w, h, movement=null, font='Arial', fontSize=100, color='black', outline=null, outlineThickness=null) {
    this.text = text
    this.pos = pos
    this.width = w
    this.height = h
    this.font = `${fontSize}px ${font}`
    this.fontSize=fontSize
    this.fillColor = color
    this.outlineColor = outline
    this.outlineThickness = outlineThickness
    this.movement=movement
  }
}

class BostacleImage {
  constructor(img, pos, w, h, movement=null) {
    this.img = img
    this.pos = pos
    this.width = w
    this.height = h
    this.movement = movement
    
  }
}

class BostacleStages {
  constructor() {
    this.walls = null
    this.playerSpawn = null
    this.goal = null
    this.obstacles = null
    this.selectedStage = 0
    this.stageIndexes = 2
  }

  removeStage() {
    this.playerSpawn = [0,0]
    this.obstacles = []
    this.walls = []
    this.goal = null
  }

  setStage1() {
    this.playerSpawn = [635,725]
    this.goal = new BostacleWinZone(1850, 530, 230, 390)
    this.obstacles = []
    this.walls = [
      new BostacleWall(new Point(780,220),1000,10,0),
      new BostacleWall(new Point(780,1220),1000,10,0),
      new BostacleWall(new Point(480,520),300,10,0),
      new BostacleWall(new Point(480,920),300,10,0),
      new BostacleWall(new Point(1780,520),300,10,0),
      new BostacleWall(new Point(1780,920),300,10,0),
      new BostacleWall(new Point(780,220),10,310,0),
      new BostacleWall(new Point(780,920),10,310,0),
      new BostacleWall(new Point(1780,920),10,310,0),
      new BostacleWall(new Point(1780,220),10,310,0),
      new BostacleWall(new Point(480,520),10,410,0),
      new BostacleWall(new Point(2080,520),10,410,0),
      new BostacleWall(new Point(1275,530),10,390,0)
    ]
  }
}

function botstacleHTML() {
  var html = `
  <div id="transition-wall"></div>
    <div id="maze-backing"></div>
    <div id="maze-content">
      <span class="section-header">Botstacle Course</span>
      <canvas id="project-canvas" class="res-1024-576" style="width: 1024px; height: 576px;" width="2560" height="1440" tabindex="-1"></canvas>
      <div id="project-back-to-home">
        <span>
          <i class="fa-solid fa-angle-left"></i>
          Back</span>
      </div>
    </div>
    `
  document.getElementsByTagName('body')[0].innerHTML = html
}
// initializeBostacle()
