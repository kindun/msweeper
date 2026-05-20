import './style.css'

const ROWS: number = 10
const COLS: number = 10
const MINES: number = 10
let isStarted: boolean = true

interface Cell {
  row: number
  col: number
  isMine: boolean
  isOpen: boolean
  isFlagged: boolean
  adjacentMines: number
}

const direction: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
]


function placeMines(mines: number, click_r: number, click_c: number): Set<string> {
  const mineSet = new Set<string>()
  outer: for (let i = 0; i < mines; i++) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (r == click_r && c == click_c) continue outer
    for (const [dr, dc] of direction) {
      const nr = click_r + dr
      const nc = click_c + dc
      if (nr == r && nc == c) continue outer
    }
    mineSet.add(`${r},${c}`)
  }
  return mineSet
}

type Board = Cell[][];

const board: Board = []
const table = document.createElement('table')
const tdGrid: HTMLTableCellElement[][] = []

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
        adjacentMines: 0
      }
      //td.addEventListener("click", () => alert(JSON.stringify(board[r][c])))
      td.addEventListener("click", () => {
        if (isStarted) {
          isStarted = false
          startGame(r, c)
          return
        }
      })
    }
    table.appendChild(tr)
  }
}

createGrid()

function startGame(r: number, c: number) {
  const mineSet: Set<string> = placeMines(MINES, r, c)

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (mineSet.has(`${r},${c}`)) {
        board[r][c].isMine = true
        tdGrid[r][c].style.backgroundColor = `red`
      }
      if (!board[r][c].isMine) {
        for (const [dr, dc] of direction) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            if (board[nr][nc].isMine) {
              board[r][c].adjacentMines++
            }
          }
          tdGrid[r][c].textContent = String(board[r][c].adjacentMines)          
        }
      }
    }
  }
}


document.body.appendChild(table)


