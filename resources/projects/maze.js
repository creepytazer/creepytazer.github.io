var mazeGame = null

function initializeMaze() { 
  window.scrollTo(0, 0); 
  maze_HTML()
  mazeGame = new MazeGame()
  mazeGame.maze_fillMaze(23, 43)
  mazeGame.maze_addEventListeners()
}

class MazeGame {
  constructor() {
    this.board = document.getElementById('maze-game')
    this.rows = null
    this.columns = null
    this.startPos = null
    this.endPos = null
    this.running = null
    this.userEdit = true
    this.mouseDown = 0
    this.neighbors = [[-1, 0],[0, -1],[1, 0],[0, 1]]
  }

  maze_fillMaze(r, c) {
  this.rows = r
  this.columns = c
    for (var i = 0; i < r; i++) {
      var newRow = document.createElement('div')
      newRow.classList.add('maze-row')
      for (var j = 0; j < c; j++) {
        var newTile = document.createElement('div')
        newTile.classList.add('maze-tile')
        newTile.dataset.row = i
        newTile.dataset.column = j
        newTile.addEventListener('mousedown', (e) => {
          this.mouseDown = 1
          this.placeTile(e)
        })
        newTile.addEventListener('mouseover', this.placeTile)
        newRow.appendChild(newTile)
      }
      this.board.appendChild(newRow)
    }
  }

  placeTile(e) {
    var selected = document.getElementsByClassName('maze-currently-selected')
    if (! selected.length || mazeGame.running || mazeGame.mouseDown != 1) {
      return
    }
    switch (selected[0].id) {
      case 'maze-start-placer': mazeGame.placeStart(e)
        break
      case 'maze-goal-placer': mazeGame.placeEnd(e);
        break
      case 'maze-wall-placer': mazeGame.placeWall(e)
        break
      case 'maze-eraser-placer': mazeGame.eraseTile(e)

    }
  }

  eraseTile(tile) {
    if (!this.userEdit) {
      return
    }
    switch (tile.target.id) {
      case 'maze-start-pos' : this.startPos = null
          break
      case 'maze-end-pos' : this.endPos = null
      
    }
    tile.target.removeAttribute('id')
    tile.target.classList = 'maze-tile'
    this.tileDelete(tile.target)
  }

  placeStart(event) {
    if (!this.userEdit) {
      return
    }
    var row = parseInt(event.target.dataset.row)
    var column = parseInt(event.target.dataset.column)

    var oldStart = document.getElementById('maze-start-pos')
    if (oldStart) {
      oldStart.removeAttribute('id')
      oldStart.classList = 'maze-tile'
    }

    if (event.target.id == 'maze-end-pos') {
      this.endPos = null
    }

    event.target.id = 'maze-start-pos'
    event.target.classList = 'maze-tile maze-start-pos'

    this.startPos = [row, column]
  }

  placeEnd(event) {
    if (!this.userEdit) {
      return
    }
    var row = parseInt(event.target.dataset.row)
    var column = parseInt(event.target.dataset.column)

    var oldend = document.getElementById('maze-end-pos')
    if (oldend) {
      oldend.removeAttribute('id')
      oldend.classList = 'maze-tile'
    }
    
    if (event.target.id == 'maze-start-pos') {
      this.startPos = null
    }

    event.target.id = 'maze-end-pos'
    event.target.classList = 'maze-tile maze-end-pos'

    this.endPos = [row, column]
  }

  placeWall(tile) {
    if (!this.userEdit) {
      return
    }
    tile.target.classList = 'maze-tile maze-wall'

    switch (tile.target.id) {
      case 'maze-start-pos':
        this.startPos = null
        break
      case 'maze-end-pos':
        this.endPos = null
        break
    }
    tile.target.removeAttribute('id')
  }
  startSearch() {
    if (!this.userEdit || !this.startPos) {
      return
    }
    this.speed = Math.abs(document.getElementById('maze-speed-input').value - 1000)

    var searchMode = document.getElementsByClassName('maze-search-mode-selected')[0].id
    switch (searchMode) {
      case "maze-DFS":
        var q = [this.startPos]
        this.disableEdit()
        this.dfs(q)
        break

      case "maze-BFS":
        var q = new Deque()
        q.append(this.startPos)
        this.disableEdit()
        this.bfs(q)
        break
      case "maze-dijkstra":
        if (!this.endPos) {
          alert("Goal Needed For Dijkstra's Algorithm.")
          return
        } 
        var q = new Heap([[getManhattan(this.startPos, this.endPos), this.startPos]])
        this.disableEdit()
        this.dijkstra(q)
        break
    }
    this.ChangeStartToCancel()
  }

  dfs(q) {
    while (q.length > 0 && this.board.children[q[q.length - 1][0]].children[q[q.length - 1][1]].classList.contains('maze-searched')) {
      q.pop()
    }
    if (q.length == 0) {
      this.running = null
      return
    }
    var curr = q.pop()
    var r = curr[0]
    var c = curr[1]
      
    if (this.board.children[r].children[c].id == 'maze-end-pos') {
      this.tileWin(this.board.children[r].children[c])
      this.running = null
      return
    }
    this.board.children[r].children[c].classList.add('maze-searched')
    this.board.children[r].children[c].classList.remove('maze-queue')
    this.tileSearched(this.board.children[r].children[c])
    this.checkNeighbors(r,c,this.rows,this.columns,q, 0).forEach((item) => {
      q.push(item)
    })
  
    this.running = setTimeout(() => {
      this.dfs(q)
    }, this.speed)
  }

  bfs(q) {
    if (q.length == 0) {
      this.running = null
      return
    }
    var curr = q.popleft()
    var r = curr[0]
    var c = curr[1]
    if (this.board.children[r].children[c].id == 'maze-end-pos') {
      this.tileWin(this.board.children[r].children[c])
      this.running = null
      return
    }
    this.board.children[r].children[c].classList.add('maze-searched')
    this.board.children[r].children[c].classList.remove('maze-queue')
    this.tileSearched(this.board.children[r].children[c])

    this.checkNeighbors(r,c,this.rows,this.columns, 1).forEach((item) => {
      q.append(item) 
    })
    
    this.running = setTimeout(() => {
      this.bfs(q)
    }, this.speed)
  }

  dijkstra(q) {
    if (q.length == 0) {
      this.running = null
      return
    }
    var curr = q.heappop()
    var r = curr[1][0]
    var c = curr[1][1]
    if (this.board.children[r].children[c].id == 'maze-end-pos') {
      this.tileWin(this.board.children[r].children[c])
      this.running = null
      return
    }
    this.board.children[r].children[c].classList.add('maze-searched')
    this.board.children[r].children[c].classList.remove('maze-queue')
    this.tileSearched(this.board.children[r].children[c])
    this.checkNeighbors(r,c,this.rows,this.columns, 1).forEach((item) => {
      q.heappush([getManhattan(item, this.endPos),item]) 
    })
    this.running = setTimeout(() => {
      this.dijkstra(q)
    }, this.speed)
  }

  checkNeighbors(r, c, m, n, addQueueClass) {
    var validNeighbors = []
    this.neighbors.forEach((item) => {
      var dr = r + item[0]
      var dc = c + item[1]
      if (0 <= dr && dr < m && 0 <= dc && dc < n && !this.board.children[dr].children[dc].classList.contains('maze-searched') && !this.board.children[dr].children[dc].classList.contains('maze-queue') && !this.board.children[dr].children[dc].classList.contains('maze-wall')) {
        var tile = this.board.children[dr].children[dc]
        validNeighbors.push([dr,dc])
        if (addQueueClass == 1) {
          tile.classList.add('maze-queue')
        }
      }
    })

    return validNeighbors
  }

  disableEdit() {
    this.userEdit = false
    var editables = document.getElementsByClassName('editable')
    for (var i = 0; i < editables.length; i++) {
      editables[i].classList.add('maze-noEdit')
    }
  }

  enableEdit() {
    this.userEdit = true
    var editables = document.getElementsByClassName('editable')
    for (var i = 0; i < editables.length; i++) {
      editables[i].classList.remove('maze-noEdit')
  }
}

  generateMaze() {
    if (!this.userEdit) {
      return
    }
    this.userEdit = false
    this.clearAll()
    this.running = setTimeout(() => {
      switch (Math.floor(Math.random() * 2) + 1) {
        case 1:
          this.generateWilsonMaze()
          console.log('Generated Wilson Maze')
          break
        case 2:
          this.generateDfsMaze()
          console.log('Generated DFS Maze')
          break
      }
      this.running = null
      this.userEdit = true
    }, 300)
    
  }

  generateWallTemplate() {
    var tiles = document.getElementsByClassName('maze-tile')
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].classList.add('maze-wall')
    }
    for (var r = 0; r < document.getElementById('maze-game').children.length; r = r + 2) {
      for (var c = 0; c < document.getElementById('maze-game').children[0].children.length; c = c + 2) {
        document.getElementById('maze-game').children[r].children[c].classList.remove('maze-wall')
      }
    }
  }

  generateDfsMaze() {
    function searchNeighbors(self, r, c) {
      var validNeighbors = []
      var neighbors = [[0,2], [2,0],[0,-2],[-2,0]]
      neighbors.forEach((item) => {
        var dr = r + item[0]
        var dc = c + item[1]
        if (0 <= dr && dr < self.rows && 0 <= dc && dc < self.columns && !self.board.children[dr].children[dc].classList.contains('maze-visit')) {
          validNeighbors.push([dr,dc])
        }
      })
      return validNeighbors
    }

    function digMaze(self) {
      var q = [[2 * Math.round(getRandomInt(self.rows) / 2), 2 * Math.round(getRandomInt(self.columns) / 2)]]
      while (q.length > 0) {
        var curr = q.pop()
        var r = curr[0]
        var c = curr[1]
        var currentTile = self.board.children[r].children[c]
        currentTile.classList.add('maze-visit')
        var neighbors = searchNeighbors(self, r,c)
        if (neighbors.length > 0) {
          q.push([r,c])
          var random = getRandomInt(neighbors.length)
          var next = neighbors[random]
          var between = self.board.children[Math.trunc((r + next[0]) / 2)].children[Math.trunc((c + next[1]) / 2)]
          between.classList.remove('maze-wall')
          q.push(next)
        }
      }
    }

    

    this.generateWallTemplate(this)
    digMaze(this)
    this.animateMaze(this)
    this.clearVisited()
    this.randomPlaceStartAndEnd()
  }

  animateMaze(self) {
    var walls = document.getElementsByClassName('maze-wall')
    for (var i = 0; i < walls.length; i++) {
      self.mazePlacedAnimation(walls[i])
    }
  }

  generateWilsonMaze() {
    function checkNeighbors(self, tile) {
      var r = parseInt(tile.dataset.row)
      var c = parseInt(tile.dataset.column)
      var neighbors = [[0,2], [2,0],[0,-2],[-2,0]]
      var toReturn = []
      neighbors.forEach((item) => {
        var dr = r + item[0]
        var dc = c + item[1]
        if (0 <= dr && dr < self.rows && 0 <= dc && dc < self.columns) {
          toReturn.push(self.board.children[dr].children[dc])
        }
      })
      return toReturn
    }
    function digMaze(self) {
      var notVisited = document.getElementsByClassName('not-visited')
      notVisited[getRandomInt(notVisited.length)].classList.remove('not-visited')
      var q = []
      while (notVisited.length > 0) {
        var q = [notVisited[getRandomInt(notVisited.length)]]
        while (true) {
          var curr = q[q.length - 1]
          if (!curr.classList.contains('not-visited'))
            break
          if (curr.classList.contains('visited')) {
            q.pop()
            while (q[q.length - 1] != curr) {
              q[q.length - 1].classList.remove('visited')

              q.pop()
            } 
          }
          curr.classList.add('visited')
          var validNeighbors = checkNeighbors(self, curr)
          q.push(validNeighbors[getRandomInt(validNeighbors.length)]) 
        }
        for (var i = 0; i < q.length - 1; i++) {
          var curr = q[i]
          q[i].classList = 'maze-tile'
          var r = Math.trunc((parseInt(q[i].dataset.row) + parseInt(q[i + 1].dataset.row)) / 2)
          var c = Math.trunc((parseInt(q[i].dataset.column) + parseInt(q[i + 1].dataset.column)) / 2)
          self.board.children[r].children[c].classList = 'maze-tile'
        }
      }
    }

    this.generateWallTemplate()
    var tiles = document.getElementsByClassName('maze-tile') 
    for (var i = 0; i < tiles.length; i++) {
      if (!tiles[i].classList.contains('maze-wall')) {
        tiles[i].classList.add('not-visited')
      }
    }
    digMaze(this)
    this.animateMaze(this)
    this.randomPlaceStartAndEnd()
  }
  randomPlaceStartAndEnd() {
    var startR = getRandomInt(this.rows)
    var startC = getRandomInt(this.columns)
    var startTile = this.board.children[startR].children[startC]
    while (startTile.classList.contains('maze-wall')) {
      startR = getRandomInt(this.rows)
      startC = getRandomInt(this.columns)
      startTile = this.board.children[startR].children[startC]
    }
    startTile.id = 'maze-start-pos'
    startTile.classList.add('maze-start-pos')

    this.startPos = [startR,startC]

    var endR = getRandomInt(this.rows)
    var endC = getRandomInt(this.columns)
    var endTile = this.board.children[endR].children[endC]
    var manhattanDistance = Math.abs(endR - startR) + Math.abs(endC - startC)

    while (endTile.classList.contains('maze-wall') || manhattanDistance < (this.columns / 2 + this.rows / 2 - 5)) {
      endR = getRandomInt(this.rows)
      endC = getRandomInt(this.columns)
      manhattanDistance = Math.abs(endR - startR) + Math.abs(endC - startC)
      endTile = this.board.children[endR].children[endC]
    }
    endTile.id = 'maze-end-pos'
    endTile.classList.add('maze-end-pos')

    this.endPos = [endR,endC]
  }
  clearVisited() {
    var visited = document.getElementsByClassName('maze-visit')
    for (var i = visited.length - 1; i >= 0; i--) {
      visited[i].classList.remove('maze-visit')
    }
  }

  tileSearched(tile) {
    var animation = [
      {
        transform: 'scale(1.4)',
        backgroundColor: '#25ff15',
      }, {
        transform: 'scale(1.2)',
        backgroundColor: '#25ff15',
      }, {
        transform: 'scale(1)',
        backgroundColor: '#00a2ff',
      },
    ];

    var Timing = {
      duration: this.speed * 2,
      iterations: 1
    };

    tile.animate(animation, Timing);
  }

  mazePlacedAnimation(tile) {
    var animation = [
      {
        backgroundColor: '#e3e3e3'
      }, {
        backgroundColor: '#1b004f'
      }
    ];

    var Timing = {
      duration: 300,
      iterations: 1
    };

    tile.animate(animation, Timing);
  }

  tileWin(tile) {
    tile.classList = 'maze-tile maze-end-pos maze-win'
    var animation = [
      {
        transform: 'scale(2)',
        backgroundColor: '#f1b900'
      }, {
        transform: 'scale(1.5)',
        backgroundColor: '#f1b900'
      }, {
        transform: 'scale(1)',
        backgroundColor: '#34f100'
      },
    ];

    var Timing = {
      duration: 500,
      iterations: 1
    };

    tile.animate(animation, Timing);

  }

  tileDelete(tile, speed=150) {
    var animation = [
      {
        transform: 'scale(1)',
        backgroundColor: '#ff0000'
      }, {
        transform: 'scale(0.7)',
        backgroundColor: '#ff0000'
      }, {
        transform: 'scale(1)',
        backgroundColor: '#e3e3e3'
      },
    ];

    var Timing = {
      duration: Math.max(speed * 2, 300),
      iterations: 1
    };

    tile.animate(animation, Timing);
  }

  clearMaze(clearType) {
    if (!this.userEdit) {
      return
    }
    switch (clearType) {
      case 'maze-clear-all':
        this.clearAll()
        break
      case 'maze-clear-walls':
        this.clearWalls()
    }
  }

  clearAll() {
    this.clearStartAndEndTiles()
    this.clearWalls()
    this.clearQueuedTiles()
    this.clearSearchedTiles()
  }

  clearStartAndEndTiles() {
    var start = document.getElementById('maze-start-pos')
    if (start) {
      this.tileDelete(start)
      start.removeAttribute('id')
      start.classList.remove('maze-start-pos')
    }
    var end = document.getElementById('maze-end-pos')
    if (end) {
      this.tileDelete(end)
      end.removeAttribute('id')
      end.classList.remove('maze-end-pos')
    }
    this.startPos = null
    this.endPos = null
  }

  clearWalls() {
    var walls = document.getElementsByClassName('maze-wall')
    for (var i = walls.length - 1; i >= 0; i--) {
      this.tileDelete(walls[i])
      walls[i].classList.remove('maze-wall')
    }
  }
  clearSearchedTiles(animationSpeed=150) {
    var searchedTiles = document.getElementsByClassName('maze-searched')
    for (var i = searchedTiles.length - 1; i >= 0; i--) {
      this.tileDelete(searchedTiles[i], animationSpeed)
      searchedTiles[i].classList.remove('maze-searched')
    }
    var winTile = document.getElementsByClassName('maze-win')
    if (winTile.length > 0) {
      this.tileDelete(winTile[0], animationSpeed)
      winTile[0].classList.remove('maze-win')
    }
  }
  clearQueuedTiles(animationSpeed=150) {
    var queuedTiles = document.getElementsByClassName('maze-queue')
    for (var i = queuedTiles.length - 1; i >= 0; i--) {
      this.tileDelete(queuedTiles[i], animationSpeed)
      queuedTiles[i].classList.remove('maze-queue')
    }
  }

  ChangeStartToCancel() {
    var resetSearchButton = document.createElement('div')
    resetSearchButton.id = 'maze-reset-game'
    resetSearchButton.classList = 'maze-button-template'
    resetSearchButton.innerHTML = 'RESET SEARCH'
    resetSearchButton.addEventListener('click', () => {
      this.resetSearch()
    })
    document.getElementsByClassName('maze-tools')[1].insertBefore(resetSearchButton, document.getElementById('maze-start-game'))
    document.getElementById('maze-start-game').remove()
  }
  resetSearch() {
    if (this.running) {
      clearTimeout(this.running)
      this.running = null
    }
    this.enableEdit()
    this.clearQueuedTiles(this.speed)
    this.clearSearchedTiles(this.speed)
    var board = document.getElementById('maze-game')

    var startSearchButton = document.createElement('div')
    startSearchButton.id = 'maze-start-game'
    startSearchButton.classList = 'maze-button-template'
    startSearchButton.innerHTML = 'START SEARCH'
    startSearchButton.addEventListener('click', () => {this.startSearch()})
    document.getElementsByClassName('maze-tools')[1].insertBefore(startSearchButton, document.getElementById('maze-reset-game'))
    document.getElementById('maze-reset-game').remove()
  }

  

maze_addEventListeners() {
  var board = document.getElementById('maze-game')
  board.addEventListener('mousedown', () => {
    mazeGame.mouseDown = 1
  })
  board.addEventListener('mouseup', () => {
    mazeGame.mouseDown = 0
  })
  board.addEventListener('mouseleave', () => {
    mazeGame.mouseDown = 0
  })

  var placerSettings = document.getElementsByClassName('maze-tile-selector')
  for (var i = 0; i < placerSettings.length; i++) {
    placerSettings[i].addEventListener('click', (e) =>{
      if (this.userEdit) {
        this.maze_removeSelectedPlacer()
        e.target.classList.add('maze-currently-selected')  
      }
    })
  }

  var searchModes = document.getElementsByClassName('maze-mode-list-item')
    for (var i = 0; i < searchModes.length; i++) {
      searchModes[i].addEventListener('click', (e) => {
        if (this.userEdit) {
          mazeGame.maze_removeSelectedSearchMode()
          e.target.classList.add('maze-search-mode-selected')
  }
      })
    }
  

  var clearModes = document.getElementsByClassName('maze-clear-list-item')
    for (var i = 0; i < clearModes.length; i++) {
      clearModes[i].addEventListener('click', function (event) {
      mazeGame.clearMaze(event.target.id)
      })
    }

  var startButton = document.getElementById('maze-start-game')
  startButton.addEventListener('click', () => {
    mazeGame.startSearch()
  })

  var speedSlider = document.getElementById('maze-speed-input')
  var speedText = document.getElementById('maze-speed-slider-text')
  speedText.innerHTML = `Search Speed : ${
    Math.abs(speedSlider.value - 1000)
  }ms`
  speedSlider.oninput = function () {
    speedText.innerHTML = `Search Speed : ${
      Math.abs(this.value - 1000)
    }ms`
    mazeGame.speed = Math.abs(this.value - 1000)
  }

  document.getElementById('maze-generate-walls').addEventListener('click', () => {
    mazeGame.generateMaze()
  })
  document.getElementById('project-back-to-home').addEventListener('click', ()=> {
    mazeGame = null
    homeTransition()
  })
}

maze_removeSelectedPlacer() {
  var selected = document.getElementsByClassName('maze-currently-selected');
  for (var i = 0; i < selected.length; i++) {
    selected[i].classList.remove('maze-currently-selected')
  }
}

maze_removeSelectedSearchMode() {
  var currentlySelected = document.getElementsByClassName('maze-search-mode-selected')
  for (var i = 0; i < currentlySelected.length; i++) {
    currentlySelected[i].classList.remove('maze-search-mode-selected')
  }
}

}

function maze_HTML() {
  var html = `
  <div id="transition-wall"></div>
    <div id="maze-backing"></div>
    <div id="maze-content">
      <span class="section-header">Maze Game</span>
      <div class="maze-outer maze-top-settings">
        <span>Maze Tools</span>
        <div class="maze-tools">
          <div id="maze-start-placer" class="maze-button-template maze-tile-selector editable">START-TEMP</div>
          <div id="maze-goal-placer" class="maze-button-template maze-tile-selector editable">GOAL-TEMP</div>
          <div id="maze-wall-placer" class="maze-button-template maze-tile-selector editable">WALL-TEMP</div>
          <div id="maze-eraser-placer" class="maze-button-template maze-tile-selector editable">ERASER-TEMP</div>
        </div>
      </div>
      <div id="maze-game"></div>
      <div class="maze-outer">
        <div class="maze-tools">
          <div id="maze-start-game" class="maze-button-template">START SEARCH</div>
          <div id="maze-generate-walls" class="maze-button-template editable">Generate Maze</div>
          <div id="maze-speed-slider">
            <label for="maze-speed-input" id="maze-speed-slider-text">Loading Speed</label>
            <input id="maze-speed-input" type="range" min="0" max="990" step="10" value="850">
          </div>
          <div id="maze-menu-settings" class="maze-button-template">
            <span>Settings</span>
            <div class="maze-menu-dropdown">
              <div class="maze-menu-vertical">
                <span id="maze-DFS" class="maze-mode-list-item maze-search-mode-selected maze-menu-item">Depth First Search</span>
                <span id="maze-BFS" class="maze-mode-list-item maze-menu-item">Breadth First Search</span>
                <span id="maze-dijkstra" class="maze-mode-list-item maze-menu-item">Dijkstra's</span>
              </div>
              <div class="maze-menu-vertical">
                <span id="maze-clear-walls" class="maze-clear-list-item maze-menu-item">Clear Walls</span>
                <span id="maze-clear-all" class="maze-clear-list-item maze-menu-item">Clear All</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="project-back-to-home">
        <span>
          <i class="fa-solid fa-angle-left"></i>
          Back</span>
      </div>
    </div>
    `
  document.getElementsByTagName('body')[0].innerHTML = html
}

// initializeMaze()