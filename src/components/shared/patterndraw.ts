
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
    const maxCols = Math.max(cols)
    const maxRows = Math.max(rows)

    ctx.font = `normal ${fontSize}pt monospace`
    let metricsCols = ctx.measureText(maxCols.toString());
    let metricsRows = ctx.measureText(maxRows.toString());
    //let fontHeight = metricsCols.fontBoundingBoxAscent + metricsCols.fontBoundingBoxDescent;
    let actualHeight = metricsCols.actualBoundingBoxAscent + metricsCols.actualBoundingBoxDescent;

    let cellSize = actualHeight + 4

    let headerHeight = metricsCols.width + 4

    let rowIndexWidth = metricsRows.width + 4

    let w = cellSize * cols + rowIndexWidth * 2
    let h = cellSize * rows + headerHeight * 2

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

        let x = rowIndexWidth + c * cellSize
        let y = headerHeight + r * cellSize

        ctx.fillStyle = cellColor
        ctx.fillRect(x, y, cellSize, cellSize)
        
        if (showCellStitchType && row[c].t !== CELL_TYPE.EMPTY) {
          let image = icons[row[c].t]
          if (image) {
            ctx.globalCompositeOperation = "difference";
            ctx.drawImage(image, x+2, y+2)
            ctx.globalCompositeOperation = "source-over";
          }
        }
      }
    }

    // rows, cols numbers
    ctx.fillStyle = "black"
    ctx.textBaseline = "top"

    ctx.textAlign = "right"
    for (let r = 1; r <= rows; r++) {
      let y = h - headerHeight - r * cellSize 
      ctx.fillText(r.toString(), rowIndexWidth - 2, y) // left
    }

      ctx.textAlign = "left"
    for (let r = 1; r <= rows; r++) {
      let y = h - headerHeight - r * cellSize
      ctx.fillText(r.toString(), w - rowIndexWidth + 2, y) // right
    }

    ctx.save();
    ctx.translate(-cellSize+2, headerHeight);
    ctx.rotate(-Math.PI/2);
 
    ctx.textAlign = "left"
    for (let c = 0; c < cols; c++) {
      let y = w - c * cellSize - rowIndexWidth - 2 
      ctx.fillText((c+1).toString(), 2, y) // top
    }

    ctx.textAlign = "right"
    for (let c = 0; c < cols; c++) {
      let y = w - c * cellSize - rowIndexWidth - 2 
      ctx.fillText((c+1).toString(), -h + headerHeight * 2 - 2, y) // bottom
    }

    ctx.restore();

    // grid
    for (let r = 0; r <= rows; r++) {
      let y = headerHeight + r * cellSize
      drawLine(ctx, [0, y], [w, y])
      for (let c = 0; c <= cols; c++) {
        let x = rowIndexWidth + c * cellSize
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
        pattern[row - 1][col - 1].t.includes('r')
    ) {
        return getColor(pattern, colors, row - 1, col - 1)
    } else if (
        pattern[row - 1] &&
        pattern[row - 1][col + 1] &&
        pattern[row - 1][col + 1].t.includes('l')
    ) {
        return getColor(pattern, colors, row - 1, col + 1)
    } else if (
        pattern[row - 1] &&
        pattern[row - 1][col] &&
        pattern[row - 1][col].t.includes('x')
    ) {
        return getColor(pattern, colors, row - 1, col)
    }
    return getColor(pattern, colors, row, col)
}

const getColor = (pattern: IPatternGrid, colors: string[], row: number, col: number) => {
    var r = Math.max(0, row)
    var c = Math.max(0, col)
    return pattern[r][c].c >= 0
        ? colors[pattern[r][c].c]
        : BACKGROUND_COLOR
}

export const PatternDraw = {getCellColor, drawPattern}