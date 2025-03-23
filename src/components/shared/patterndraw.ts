
import { BACKGROUND_COLOR } from "../../model/constats"
import { IPatternGrid } from "../../model/patterncell.model"
import { CELL_TYPE } from "../../model/patterntype.enum"
import { DRAW } from "../export/draw"


export type TSize = {
    width: number
    height: number
}

const drawPattern = (pattern: IPatternGrid, colors: string[], fontSize: number, showCellStitchType: boolean, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): TSize =>  {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const rows = pattern.length
    const cols = pattern[0].length
    const max = Math.max(rows, cols)

    ctx.font = `normal ${fontSize}pt monospace`
    let metrics = ctx.measureText(max.toString());
    let cellSize = metrics.width + 4

    let w = cellSize * (cols + 2)
    let h = cellSize * (rows + 2)

    canvas.width = w
    canvas.height = h

    var cellColor = BACKGROUND_COLOR

    ctx.font = `normal ${fontSize}pt monospace`
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, w, h)
    ctx.lineWidth = 1

    const iconSize = cellSize-4
    const icons: Record<string, HTMLCanvasElement | null> = {}
    Object.values(CELL_TYPE).forEach(cellType => {
      icons[cellType] = DRAW.draw(iconSize, cellType)
    });

    // pattern content
    for (let r = rows - 1; r >= 0; r--) {
      const row = pattern[r]
      for (let c = 0; c < row.length; c++) {
        cellColor = getCellColor(pattern, colors, r, c)

        let x = (c + 1) * cellSize
        let y = (r + 1) * cellSize

        ctx.fillStyle = cellColor
        ctx.fillRect(x, y, cellSize, cellSize)

        if (showCellStitchType && row[c].type !== CELL_TYPE.EMPTY) {
          let image = icons[row[c].type]
          if (image) ctx.drawImage(image, x+2, y+2)
        }
      }
    }

    // rows, cols numbers
    ctx.fillStyle = "black"
    ctx.textBaseline = "top"

    for (let r = 1; r <= rows; r++) {
      let y = h - (r+1) * cellSize
      ctx.fillText(r.toString(), 2, y+2) // left
      ctx.fillText(r.toString(), w - cellSize + 2, y+2) // right
    }

    for (let c = 1; c <= cols; c++) {
      let x = w - (c+1) * cellSize
      ctx.fillText(c.toString(), x + 2, 2) // top
      ctx.fillText(c.toString(), x + 2, h - cellSize + 2) // bottom
    }

    // grid
    for (let r = 0; r <= rows; r++) {
      let y = (r + 1) * cellSize
      drawLine(ctx, [0, y], [w, y])
      for (let c = 0; c <= cols; c++) {
        let x = (c + 1) * cellSize
        drawLine(ctx, [x, 0], [x, h])
      }
    }
    return {width: w, height: h}
  }

  function drawLine(
    ctx: CanvasRenderingContext2D,
    begin: [number, number],
    end: [number, number],
    stroke = "black",
    width = 1
  ) {
    if (stroke) {
      ctx.strokeStyle = stroke;
    }

    if (width) {
      ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(begin[0], begin[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  }

const getCellColor = (pattern: IPatternGrid, colors: string[], row: number, col: number) => {
    if (
        pattern[row - 1] &&
        pattern[row - 1][col - 1] &&
        pattern[row - 1][col - 1].type.includes('r')
    ) {
        return getColor(pattern, colors, row - 1, col - 1)
    } else if (
        pattern[row - 1] &&
        pattern[row - 1][col + 1] &&
        pattern[row - 1][col + 1].type.includes('l')
    ) {
        return getColor(pattern, colors, row - 1, col + 1)
    } else if (
        pattern[row - 1] &&
        pattern[row - 1][col] &&
        pattern[row - 1][col].type.includes('x')
    ) {
        return getColor(pattern, colors, row - 1, col)
    }
    return getColor(pattern, colors, row, col)
}

const getColor = (pattern: IPatternGrid, colors: string[], row: number, col: number) => {
    var r = Math.max(0, row)
    var c = Math.max(0, col)
    return pattern[r][c].colorindex >= 0
        ? colors[pattern[r][c].colorindex]
        : BACKGROUND_COLOR
}

export const PatternDraw = {getCellColor, drawPattern}