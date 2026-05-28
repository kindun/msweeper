import './style.css'

interface Cell {
  row: number
  col: number
  isMine: boolean
  isOpen: boolean
  isFlagged: boolean
  adjacentMines: number
}

type Board = Cell[][]

const ROWS: number = 10
const COLS: number = 10
const MINES: number = 10
const board: Board = []
const table = document.createElement('table')
const tdGrid: HTMLTableCellElement[][] = []
const direction: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]
const controller = new AbortController()

let isStarted: boolean = true

const clickAction = (r: number, c: number) => {
  if (isStarted) {
    startGame(r, c)
    isStarted = false
  }
  if (!board[r][c].isFlagged) {
    if (!board[r][c].isMine) {
      openCell(r, c)
    } else {
      // alert('Bomm!!')
      tdGrid[r][c].textContent = '💣'
      board[r][c].isOpen = true
      gameFinish(0)
    }
  }
  gameFinish(1)
}

const makeFlag = (r: number, c: number, event: KeyboardEvent) => {
  if (event.repeat) {
    // 長押しの禁止
    event.preventDefault()
    return
  }
  if (event.key === 'f' || event.key === 'F') {
    if (!board[r][c].isOpen || !board[r][c].isMine) {
      if (!board[r][c].isFlagged) {
        tdGrid[r][c].textContent = '🚩'
        board[r][c].isFlagged = !board[r][c].isFlagged
      } else {
        tdGrid[r][c].textContent = ''
        board[r][c].isFlagged = !board[r][c].isFlagged
      }
    }
  }
}

function placeMines(mines: number, click_r: number, click_c: number) {
  const mineSet = new Set<string>()
  let i = 0
  outer: while (i < mines) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (r == click_r && c == click_c) continue outer
    if (mineSet.has(`${r},${c}`)) continue outer
    for (const [dr, dc] of direction) {
      /* クリックしたセルの周囲はmineにしない*/
      const nr = click_r + dr
      const nc = click_c + dc
      if (nr == r && nc == c) continue outer
    }
    mineSet.add(`${r},${c}`)
    board[r][c].isMine = true
    // tdGrid[r][c].style.backgroundColor = `red`
    if (mineSet.size >= ROWS * COLS - 9) break
    i++
  }
}

function createGrid() {
  for (let r = 0; r < ROWS; r++) {
    const tr = document.createElement('tr')
    board[r] = []
    tdGrid[r] = []
    for (let c = 0; c < COLS; c++) {
      const td = document.createElement('td')
      tdGrid[r][c] = td
      tr.appendChild(td)
      board[r][c] = {
        row: r,
        col: c,
        isFlagged: false,
        isMine: false,
        isOpen: false,
        adjacentMines: 0,
      }
      // td.addEventListener('click', () => alert(JSON.stringify(board[r][c])))

      const clickHandler = () => clickAction(r, c)
      td.addEventListener('click', clickHandler, { signal: controller.signal })

      const handler = (event: KeyboardEvent) => makeFlag(r, c, event)
      td.addEventListener('mouseenter', () => {
        if (!board[r][c].isOpen) {
          tdGrid[r][c].style.backgroundColor = 'white'
          window.addEventListener('keydown', handler)
        }
      })
      td.addEventListener('mouseleave', () => {
        if (!board[r][c].isOpen) {
          tdGrid[r][c].style.backgroundColor = 'lightblue'
        }
        window.removeEventListener('keydown', handler)
      })
    }
    table.appendChild(tr)
  }
}

function startGame(r: number, c: number) {
  placeMines(MINES, r, c)

  /* Mineをセットする */
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c].isMine) {
        for (const [dr, dc] of direction) {
          const nr = r + dr
          const nc = c + dc
          if (0 <= nr && nr < ROWS && 0 <= nc && nc < COLS) {
            if (board[nr][nc].isMine) {
              board[r][c].adjacentMines++
            }
          }
        }
      }
    }
  }
}

function openCell(r: number, c: number) {
  if (!board[r][c].isOpen) {
    tdGrid[r][c].style.backgroundColor = `lightgray`
    if (board[r][c].adjacentMines != 0) {
      tdGrid[r][c].textContent = String(board[r][c].adjacentMines)
    } else {
      tdGrid[r][c].textContent = ''
    }
  } else {
    return
  }
  board[r][c].isOpen = true
  if (board[r][c].adjacentMines == 0 && !board[r][c].isMine) {
    for (const [dr, dc] of direction) {
      const nr = r + dr
      const nc = c + dc
      if (0 <= nr && nr < ROWS && 0 <= nc && nc < COLS) {
        openCell(nr, nc)
      }
    }
  }
}

function gameFinish(status: number) {
  let clear: boolean = true
  if (status) {
    // ゲームを続けるかの判定
    for (let r = 0; r < ROWS; r++) {
      var result = board[r].filter(({ isMine }) => isMine === false)
      if (result.find(({ isOpen }) => isOpen === false) != undefined) {
        clear = false
        break
      }
    }
    if (clear) {
      alert('ゲームクリア！')
      gameStop()
    }
  } else {
    alert('ゲームオーバー')
    gameStop()
  }
}

function gameStop() {
  controller.abort()
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) {
        tdGrid[r][c].textContent = '💣'
      }
    }
  }
}
createGrid()

document.body.appendChild(table)
