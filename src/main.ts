import './style.css'

const ROWS: number = 10
const COLS: number = 10
const MINES: number = 10

interface Cell {
  row: number
  col: number
  isMine: boolean
  isOpen: boolean
  isFlagged: boolean
  adjacentMines: number
}

function placeMines(mines: number): Set<string> {
  const mineSet = new Set<string>()
  for (let i = 0; i < mines; i++) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    mineSet.add(`${r},${c}`)
  }
  return mineSet
}

type Board = Cell[][];

const board: Board = []
const table = document.createElement('table')
const mineSet: Set<string> = placeMines(MINES)
const tdGrid: HTMLTableCellElement[][] = []

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
    if (mineSet.has(`${r},${c}`)) {
      board[r][c].isMine = true
      td.style.backgroundColor = `red`
    }
    td.addEventListener("click", () => alert(JSON.stringify(board[r][c])))
  }
  table.appendChild(tr)
}


const direction: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
]

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
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


document.body.appendChild(table)


