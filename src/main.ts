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

let isStarted: boolean = true

function placeMines(mines: number, click_r: number, click_c: number) {
  const mineSet = new Set<string>()
  outer: for (let i = 0; i < mines; i++) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (r == click_r && c == click_c) continue outer
    for (const [dr, dc] of direction) {
      /* クリックしたセルの周囲はmineにしない*/
      const nr = click_r + dr
      const nc = click_c + dc
      if (nr == r && nc == c) continue outer
    }
    mineSet.add(`${r},${c}`)
    board[r][c].isMine = true
    tdGrid[r][c].style.backgroundColor = `red`
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
      //td.addEventListener("click", () => alert(JSON.stringify(board[r][c])))
      td.addEventListener('click', () => {
        if (isStarted) {
          isStarted = false
          startGame(r, c)
          openCell(r, c)
          return
        }
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
      if (!board[r][c].isMine) {
        tdGrid[r][c].addEventListener('click', () => {
          tdGrid[r][c].textContent = String(board[r][c].adjacentMines)
        })
      } else {
        tdGrid[r][c].addEventListener('click', () => {
          alert('Bomm!!')
        })
      }
    }
  }
}

function openCell(r: number, c: number) {
  if (!board[r][c].isOpen) {
    tdGrid[r][c].textContent = String(board[r][c].adjacentMines)
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
      //tdGrid[nr][nc].textContent = String(board[nr][nc].adjacentMines)
    }
  }
}

createGrid()

document.body.appendChild(table)
