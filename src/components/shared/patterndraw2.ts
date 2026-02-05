
import { BACKGROUND_COLOR, BACKGROUND_COLOR_ERROR } from "../../model/constats"
import { IPatternGrid } from "../../model/patterncell.model"
import { CELL_TYPE, hasX, TVIEWBOX_SIZE } from "../../model/patterntype.enum"
import { DRAW } from "../export/draw"


export type TSize = {
    width: number
    height: number
    rowNumberWidth: number
    headerHeight: number
    cellSize: number
}

// iconCache = map(color to map(StitchType to IconImage))
const iconCache: { [key: string]: Record<string, HTMLCanvasElement | null> } = {};
const iconCacheError: { [key: string]: HTMLCanvasElement } = {};
let cachedIconSize = -1;

const drawPattern = (
  pattern: IPatternGrid, 
  colors: string[], 
  fontSize: number, 
  showCellStitchType: boolean, 
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D,
  oldPattern: IPatternGrid,
  oldColors: string[],
  oldShowCellStitchType: boolean,
  oldFontSize: number,
  viewBox: TVIEWBOX_SIZE,
  viewBoxOld: TVIEWBOX_SIZE,
): TSize =>  {
  const maxRows = pattern.length
  const maxCols = pattern[0].length

  const rows = viewBox ? Math.min(viewBox.wy, maxRows) : maxRows
  const cols = viewBox ? Math.min(viewBox.wx, maxCols) : maxCols
  const startRow = viewBox ? Math.max(0, viewBox.row) : 0
  const startCol = viewBox ? Math.max(0, viewBox.col) : 0

  console.log('rows, cols, startRow, startCol', rows, cols, startRow, startCol);
  

  ctx.font = `normal ${fontSize}pt monospace`
  let metricsCols = ctx.measureText(maxCols.toString());
  let metricsRows = ctx.measureText(maxRows.toString());
  //let fontHeight = metricsCols.fontBoundingBoxAscent + metricsCols.fontBoundingBoxDescent;
  let actualHeight = Math.floor(metricsCols.actualBoundingBoxAscent + metricsCols.actualBoundingBoxDescent);

  let cellSize = actualHeight + 4

  let headerHeight = Math.ceil(metricsCols.width) + 4

  let rowIndexWidth = Math.ceil(metricsRows.width) + 4
    
  if (
    oldPattern.length === 0|| oldColors.length === 0 || !oldShowCellStitchType || 
    fontSize !== oldFontSize || showCellStitchType !== oldShowCellStitchType || 
    pattern.length !== oldPattern.length || pattern[0].length !== oldPattern[0].length ||
    colors.length !== oldColors.length || 
    viewBox.row !== viewBoxOld.row || viewBox.col !== viewBoxOld.col || 
    viewBox.wx !== viewBoxOld.wx || viewBox.wy !== viewBoxOld.wy
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let w = cellSize * cols + rowIndexWidth * 2
    let h = cellSize * rows + headerHeight * 2

    canvas.width = w
    canvas.height = h

    ctx.font = `normal ${fontSize}pt monospace`
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, w, h)
    ctx.lineWidth = 1

    // rows, cols numbers
    ctx.fillStyle = "black"
    ctx.textBaseline = "top"

    ctx.textBaseline = "middle"

    const leftAxisX = rowIndexWidth - 2;
    const rightAxisX = w - rowIndexWidth + 2;

    ctx.textAlign = "right"
    for (let r = 1; r <= rows; r++) {
      let y = h - headerHeight - r * cellSize + cellSize / 2
      ctx.fillText( (startRow + r).toString(), leftAxisX, y) // left
    }

    ctx.textAlign = "left"
    for (let r = 1; r <= rows; r++) {
      let y = h - headerHeight - r * cellSize + cellSize / 2
      ctx.fillText((startRow + r).toString(), rightAxisX, y) // right
    }

    ctx.save();
    ctx.translate(rowIndexWidth, headerHeight);
    ctx.rotate(-Math.PI/2);

    for (let c = 0; c < cols; c++) {
      const x = c * cellSize;
      ctx.textAlign = "left";
      ctx.fillText((maxCols - startCol - c).toString(), 2, x + cellSize/2); // top
      ctx.textAlign = "right";
      ctx.fillText((maxCols - startCol - c).toString(), -h + headerHeight * 2 - 2, x + cellSize/2); // bottom
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
    drawStitches(ctx, cellSize, pattern, colors, showCellStitchType, rowIndexWidth, headerHeight, oldPattern, true, oldColors, viewBox)
    return {width: w, height: h, rowNumberWidth: rowIndexWidth, headerHeight: headerHeight, cellSize: cellSize}
  } else {
    drawStitches(ctx, cellSize, pattern, colors, showCellStitchType, rowIndexWidth, headerHeight, oldPattern, false, oldColors, viewBox)
    return {width: canvas.width, height: canvas.height, rowNumberWidth: rowIndexWidth, headerHeight: headerHeight, cellSize: cellSize}
  }
}


function drawStitches(
  ctx: CanvasRenderingContext2D,
  cellSize: number,
  pattern: IPatternGrid, 
  colors: string[], 
  showCellStitchType: boolean,
  rowIndexWidth: number,
  headerHeight: number,
  oldPattern: IPatternGrid,
  redrawAll: boolean,
  oldColors: string[],
  viewBox: TVIEWBOX_SIZE,
) {
  const iconSize = cellSize-4

  const rows = viewBox ? Math.min(viewBox.wy, pattern.length) : pattern.length
  const cols = viewBox ? Math.min(viewBox.wx, pattern[0].length) : pattern[0].length
  const startRow = viewBox ? Math.max(0, viewBox.row) : 0
  const startCol = viewBox ? Math.max(0, viewBox.col) : 0

  console.log('rows, cols, startRow, startCol', rows, cols, startRow, startCol);

  if (cachedIconSize !== iconSize) {
    Object.keys(iconCache).forEach(key => delete iconCache[key]);
    Object.keys(iconCacheError).forEach(key => delete iconCacheError[key]);
    cachedIconSize = iconSize;
  }
    
  // fill iconCache for all colors
  colors.forEach((color) => {
    if (!iconCache[color]) {
      iconCache[color] = {};
      Object.values(CELL_TYPE).forEach(cellType => {
        var c = document.createElement('canvas');
        c.width = iconSize;
        c.height = iconSize;
        const tx = c.getContext('2d');
        if (tx) {
          DRAW.draw(iconSize, cellType, tx, DRAW.contrastingColor(color), 0, 0);
          iconCache[color][cellType] = c;
        }
      });
    }
  });

  if (Object.keys(iconCacheError).length === 0) {
    Object.values(CELL_TYPE).forEach(cellType => {
      var canvasError = document.createElement('canvas');
      canvasError.width = iconSize;
      canvasError.height = iconSize;
      const tx = canvasError.getContext('2d');
      if (tx) {
        DRAW.draw(iconSize, cellType, tx, '#ff0000', 0, 0);
        iconCacheError[cellType] = canvasError;
      }
    });
  }
    
  // pattern content
  for (let r = startRow + rows - 1; r >= startRow; r--) {
    for (let c = startCol; c < startCol + cols; c++) {
      const error = hasError(pattern, r, c);
      const oldCellError = hasError(oldPattern, r, c);
      const cellColor = error ? BACKGROUND_COLOR_ERROR : getCellColor(pattern, colors, r, c);
      const oldCellColor = oldCellError ? BACKGROUND_COLOR_ERROR : getCellColor(oldPattern, oldColors, r, c);
      const stitchType = pattern[r][c].t;
      const oldStitchType = oldPattern.length > 0 && oldPattern[r] && oldPattern[r][c] ? oldPattern[r][c].t : null;

      if (redrawAll || cellColor !== oldCellColor || stitchType !== oldStitchType) {
        const x = rowIndexWidth + (c-startCol) * cellSize;
        const y = headerHeight + (r-startRow) * cellSize;
        ctx.fillStyle = cellColor;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        if (showCellStitchType && stitchType !== CELL_TYPE.EMPTY) {
          const image = error ? iconCacheError[stitchType] : iconCache[cellColor][stitchType];
          if (image) {
            ctx.drawImage(image, x + 2, y + 2);
          }
        }
      }
    }
  }
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

const hasError = (pattern: IPatternGrid, row: number, col: number): boolean => {
  if (pattern.length === 0 || row < 0 || row >= pattern.length || col < 0 || col >= pattern[0].length) {
    return false
  }

  const cell = pattern[row][col]
  const isX = hasX(cell.t);
  if (!isX) return false;

  const upperRow = pattern[row - 1];
  const lowerRow = pattern[row + 1];

  const hasErrorUp = upperRow && hasX(upperRow[col].t);
  const hasErrorDown = lowerRow && hasX(lowerRow[col].t);

  return hasErrorUp || hasErrorDown;
}

const getCellColor = (pattern: IPatternGrid, colors: string[], row: number, col: number) => {
  if (pattern.length === 0 || colors.length === 0) {
    return BACKGROUND_COLOR
  }
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
    
    return ( pattern[r] && pattern[r][c] && pattern[r][c].c) >= 0
        ? colors[pattern[r][c].c]
        : BACKGROUND_COLOR
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    // Remove the leading '#' if present
    hex = hex.replace(/^#/, '');

    // Parse the hex string into its RGB components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

export const PatternDraw2 = {getCellColor, drawPattern, hexToRgb}