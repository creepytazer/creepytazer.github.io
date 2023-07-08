class Deque {
  constructor() {
    this.length = 0
    this.head = null
    this.tail = null
  }

  append(value) {
    var toAppend = new LinkedListNode(value, null, this.tail)
    if (this.length > 0) {
      this.tail.next = toAppend
    } else {
      this.head = toAppend
    }
    this.tail = toAppend
    this.length++
  }

  prepend(value) {
    var toAppend = new LinkedListNode(value, this.head)
    if (this.length > 0) {
      this.head.prev = toAppend
    } else {
      this.tail = toAppend
    }
    this.head = toAppend
    this.length++
  }

  pop() {
    if (this.length > 0) {
      var toPop = this.tail.value
      this.tail = this.tail.prev
      this.length--
    } else {
      throw new Error('Cannot pop from empty deque')
    }
    if (this.length > 0) {
      this.tail.next = null
    } else {
      this.head = null
    }
    return toPop
  }

  popleft() {
    if (this.length > 0) {
      var toPop = this.head.value
      this.head = this.head.next
      this.length--
    } else {
      throw new Error('Cannot popleft from empty deque')
    }
    if (this.length > 0) {
      this.head.prev = null
    } else {
      this.tail = null
    }
    return toPop
  }
}

class LinkedListNode {
  constructor(value=0, next=null, prev=null) {
    this.value = value
    this.next = next
    this.prev = prev
  }
}

class Heap {
  constructor(list=[]) {
    this.length = 0
    this.heap = [0]
    list.forEach((item) => {
      this.heappush(item)
    })
  }

  heappush(value) {
    this.length++
    var i = this.heap.length
    this.heap.push(value)
    var val = this.getValue(value)
    while (integerDivision(i, 2) > 0 ) {
      var j = integerDivision(i, 2)
      if (val < this.getValue(this.heap[j])) {
        var tmp = this.heap[j]
        this.heap[j] = value
        this.heap[i] = tmp
        i = j
      } else {
        break
      }
    }
  }

  heappop() {
    if (this.length < 1) {
      throw new Error('Cannot heappop from empty heap')
    }
    if (this.length == 1) {
      this.length = 0
      return this.heap.pop()
    }
    var toReturn = this.heap[1]
    this.heap[1] = this.heap.pop()
    this.length--
    var i = 1
    var val = this.getValue(this.heap[1])
    while (i * 2 < this.heap.length) {
      let j = i * 2
      let valTwo = this.getValue(this.heap[j])
      if (j + 1 < this.heap.length) {
        let valThree = this.getValue(this.heap[j + 1])
        if (valThree < valTwo && valThree < val) {
          let tmp = this.heap[j + 1]
          this.heap[j + 1] = this.heap[i]
          this.heap[i] = tmp
          i = j + 1
          continue
        }
      }
      if (valTwo < val) {
        let tmp = this.heap[j]
          this.heap[j] = this.heap[i]
          this.heap[i] = tmp
          i = j
      } else {
        break
      }
    }
    return toReturn
  }

  getValue(item) {
    if (Array.isArray(item) && item.length > 0) {
      return item[0]
    }
    return item
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function integerDivision(n1, n2) {
  return parseInt(n1 / n2)
}
function getManhattan(set1, set2) {
  return Math.abs(set1[0] - set2[0]) + Math.abs(set1[1] - set2[1])
}
function getEuclidean(xyList1, xyList2) {
  return (((Math.abs(xyList2[0] - xyList1[0])**2) + (Math.abs(xyList2[1] - xyList1[1])**2))**0.5)
} 