import './style.css'

const ROWS:number = 10
const COLS:number = 10
const MINES:number = 10

interface Cell {
  row: number
  col: number
  isMine: boolean
  isOpen: boolean
  isFlagged: boolean
  adjacentMines: number
}

function placeMines(mines: number): Set<string>{
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

for (let r = 0; r < ROWS; r++) {
  const tr = document.createElement('tr')
  board[r] = []
  for (let c = 0; c < COLS; c++) {
    const td = document.createElement('td')
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

document.body.appendChild(table)


