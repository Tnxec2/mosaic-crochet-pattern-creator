import MedianCut from "mediancut";
import { IPattern } from "../../context";
import { IPatternCell, IPatternGrid } from "../../model/patterncell.model";
import { CELL_TYPE } from "../../model/patterntype.enum";
import { ACTION_TYPES } from "../../model/actiontype.enum";
import { baseName } from "../../services/file.service";

const cellSize = 10;

function fillTransparentPixelsWithWhite(imageData: ImageData) {
    // Get image data
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]; // Alpha channel
      if (alpha === 0) {
        // Check if pixel is fully transparent
        data[i] = 255; // Red
        data[i + 1] = 255; // Green
        data[i + 2] = 255; // Blue
        data[i + 3] = 255; // Set alpha to fully opaque
      }
    }
  
    // Put image data back
    return imageData;
  }
  
  
  function contrastImage(imageData: ImageData, contrast: number, brightness: number) {
    const data = imageData.data;
  
    // Adjust brightness and contrast
    const brightnessFactor = (brightness - 100) * 2.55; // Convert to [-255, 255]
    const contrastFactor = (contrast - 100) / 100 + 1; // Convert to [0, 2]
    const intercept = 128 * (1 - contrastFactor);
  
    for (let i = 0; i < data.length; i += 4) {
      data[i] = contrastFactor * (data[i] + brightnessFactor) + intercept; // Red
      data[i + 1] = contrastFactor * (data[i + 1] + brightnessFactor) + intercept; // Green
      data[i + 2] = contrastFactor * (data[i + 2] + brightnessFactor) + intercept; // Blue
    }
  
    return imageData;
  }
  
  
  
  
  function drawPatternToCanvas(context: CanvasRenderingContext2D, pattern: IPatternCell[][], paletteHex: string[]) {
    context.lineWidth = 0.5;
    context.strokeStyle = "black";
  
    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        const cell = pattern[row][col];
        context.fillStyle = paletteHex[cell.c];
        if (row > 0) {
          if (pattern[row - 1][col].t === CELL_TYPE.X) {
            context.fillStyle = paletteHex[pattern[row - 1][col].c];
          }
        }
  
        //if (cell.cellType == 'x') {
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        //}
  
        context.beginPath();
        context.rect(col * cellSize, row * cellSize, cellSize, cellSize);
  
        if (cell.t === CELL_TYPE.X) {
          context.moveTo(col * cellSize, row * cellSize);
          context.lineTo(col * cellSize + cellSize, row * cellSize + cellSize);
          context.moveTo(col * cellSize + cellSize, row * cellSize);
          context.lineTo(col * cellSize, row * cellSize + cellSize);
        }
  
        context.stroke();
      }
    }
  }
  
  function drawPaletteToCanvas(palette: string[]) {
    const sizePaletteCell = 20;
    const canvasPalette = document.createElement("canvas");
    const contextPalette = canvasPalette.getContext("2d");
    canvasPalette.width = palette.length * sizePaletteCell;
    canvasPalette.height = sizePaletteCell;
    if (contextPalette) {
      contextPalette.lineWidth = 1;
      contextPalette.strokeStyle = "black";
  
      for (let index = 0; index < palette.length; index++) {
        contextPalette.fillStyle = palette[index];
        contextPalette.fillRect(
          index * sizePaletteCell,
          0,
          sizePaletteCell,
          sizePaletteCell
        );
        contextPalette.beginPath();
        contextPalette.rect(
          index * sizePaletteCell,
          0,
          sizePaletteCell,
          sizePaletteCell
        );
        contextPalette.stroke();
      }
    }
    return canvasPalette;
  }
  
  function generateColorGrid(
    imageData: any, // Uint8ClampedArray<ArrayBufferLike>,
    imageWidth: number,
    imageHeight: number,
    patternColumnsCount: number,
    patternRowsCount: number
  ) {
    const factorX = Math.floor(imageWidth / patternColumnsCount);
    const factorY = Math.floor(imageHeight / patternRowsCount);
    const colorGrid = new Array(patternRowsCount);
    var row = 0;
    for (let y = 0; y < imageHeight; y += factorY) {
      colorGrid[row] = [];
      for (let x = 0; x < imageWidth; x += factorX) {
        // extracting the position of the sample pixel
        //const pixelIndexPosition = (x + y * imageWidth) * 4;
        // drawing a square replacing the current pixels
        // colorGrid[row].push(rgbToHex(
        //   imageData[pixelIndexPosition],
        //   imageData[pixelIndexPosition + 1],
        //   imageData[pixelIndexPosition + 2]
        // ));
  
        // extracting all pixels of the square
        const pixels = [];
        for (let yP = y; yP < y + factorY; yP++) {
          for (let xP = x; xP < x + factorX; xP++) {
            // extracting the position of the sample pixel
            const pixelIndexPosition = (xP + yP * imageWidth) * 4;
            pixels.push(
              rgbToHex(
                imageData[pixelIndexPosition],
                imageData[pixelIndexPosition + 1],
                imageData[pixelIndexPosition + 2]
              )
            );
          }
        }
        // drawing a square replacing by most common color pixel
        colorGrid[row].push(findWinner(pixels));
      }
      row++;
    }
  
    return colorGrid;
  }
  
  function findWinner(array: any[]) {
    const counts: any = {};
    let max: any = array[0];
  
    for (const value of array) {
      counts[value] = (counts[value] || 0) + 1;
      if (counts[value] <= counts[max]) continue;
      max = value;
    }
  
    return max;
  }

  function getCounts(array: any) {
    const counts: any = {};
  
    for (const value of array) {
      counts[value] = (counts[value] || 0) + 1;
    }
  
    return counts
  }
  
  function generatePattern2(colorGrid: [][], paletteHex: string[], processPattern: boolean): IPatternGrid {
    const pattern: IPatternCell[][] = colorGrid.map((row) =>
      [
        { c: 0, t: CELL_TYPE.EMPTY },  // empty cell for row color
        ...row.map((color) => {
        return { c: paletteHex.indexOf(color), t: CELL_TYPE.EMPTY };
      })]
    );
    const rowColor: number[] = [];
  
    const height = pattern.length - 1;
  
    const colors = (pattern.flat(2).map((c) => c.c));
    
    // find first and second color
    const colorsCount = getCounts(colors)
    
    var firstColor = 0
    var firstCount = 0
    var secondColor = 0
    var secondCount = 0
    Object.keys(colorsCount).forEach((k) => {
      if (colorsCount[k] > firstCount) {
        secondColor = firstColor
        secondCount = firstCount
        firstColor = Number(k)
        firstCount = colorsCount[k]
      } else if (colorsCount[k] > secondCount) {
        secondColor = Number(k)
        secondCount = colorsCount[k]
      }
    })
    console.log(`firstColor: ${firstColor}, secondColor: ${secondColor}`);
  
    // fill row color array
    const row = pattern[0];
    const mostColor = findWinner(row.map((c) => c.c))
    rowColor[0] = mostColor
    pattern[0][0].c = rowColor[0]
    console.log(mostColor);
    
  
    for (let rowIndex = 1; rowIndex <= height; rowIndex++) {
      const row = pattern[rowIndex];
  
      const mostColor = findWinner(
        row
          .map((c) => c.c)
          .filter((c) => c !== rowColor[rowIndex - 1])
      );
      rowColor[rowIndex] = rowColor[rowIndex-1] === firstColor ? secondColor : firstColor
      pattern[rowIndex][0].c = rowColor[rowIndex]
    }
  
    console.log(rowColor);
    console.log(pattern);
    
    //return pattern
  
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const row = pattern[rowIndex];
      const rowNext = pattern[rowIndex + 1];
  
      for (let colIndex = 1; colIndex < row.length; colIndex++) {
        var cellColor = row[colIndex].c;
        row[colIndex].c = rowColor[rowIndex];
  
        if (
          rowColor[rowIndex] !== cellColor &&
          (rowIndex === 0 || pattern[rowIndex - 1][0].c !== cellColor) &&
          (rowIndex === 0 || pattern[rowIndex - 1][colIndex].t !== CELL_TYPE.X)
        ) {
          row[colIndex].c = cellColor;
        }
  
        if (
          row[colIndex].c === rowNext[colIndex].c &&
          (rowIndex === 0 || pattern[rowIndex - 1][colIndex].t !== CELL_TYPE.X)
        ) {
          if (colIndex > 0) row[colIndex].t = CELL_TYPE.X;
        }
      }
    }

    return pattern
  }
  
  function generatePattern(colorGrid: [][], paletteHex: string[], processPattern: boolean) {
    const pattern: IPatternCell[][] = colorGrid.map((row) =>
      row.map((color) => {
        return { c: paletteHex.indexOf(color), t: CELL_TYPE.EMPTY };
      })
    );
    const rowColor: number[] = [];
  
    const height = pattern.length - 1;
  
    if (!processPattern) return pattern
  
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const row = pattern[rowIndex];
      const rowNext = pattern[rowIndex + 1];
  
      const mostColor = findWinner(
        row
          .map((c) => c.c)
          .filter((c) => rowIndex === 0 || c !== rowColor[rowIndex - 1])
      );
  
      rowColor[rowIndex] = mostColor;
  
      for (let colIndex = 1; colIndex < row.length; colIndex++) {
        var cellColor = row[colIndex].c;
        row[colIndex].c = mostColor;
  
        if (
          mostColor !== cellColor &&
          (rowIndex === 0 || pattern[rowIndex - 1][0].c !== cellColor) &&
          (rowIndex === 0 || pattern[rowIndex - 1][colIndex].t !== CELL_TYPE.X)
        ) {
          row[colIndex].c = cellColor;
        }
  
        if (
          row[colIndex].c === rowNext[colIndex].c &&
          (rowIndex === 0 || pattern[rowIndex - 1][colIndex].t !== CELL_TYPE.X)
        ) {
          if (colIndex > 0) row[colIndex].t = CELL_TYPE.X;
        }
      }
      row[0].c = rowColor[rowIndex];
      //row[1].colorindex = mostColorNext
    }
  
    return pattern;
  }
  
  function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  
  function drawCanvas(image: string, imageName: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D,
    brightness: number, contrast: number, colors: number, width: number, height: number,
    cutLeft: number, cutRight: number, cutTop: number, cutBottom: number,
    processPattern: boolean, setPattern: (pattern: IPattern) => void
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  
    var originalImage = new Image()
    
    originalImage.onload = () => {
      const originalWidth = originalImage.width;
      const originalHeight = originalImage.height;
    
      canvas.width = originalWidth - cutLeft - cutRight;
      canvas.height = originalHeight - cutTop - cutBottom;
    
      ctx.drawImage(originalImage, cutLeft, cutTop, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    
      console.log(originalWidth, originalHeight);
      
      var originalImageData = fillTransparentPixelsWithWhite(
        ctx.getImageData(0, 0, canvas.width, canvas.height)
      );
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      var contrastedImageData = contrastImage(
        originalImageData,
        contrast,
        brightness
      );
    
      const medianCut = new MedianCut(contrastedImageData);
      const reducedImageData = medianCut.reduce(colors).data;
    
      const paletteHex = medianCut.palette.map((color) =>
        rgbToHex(color[0], color[1], color[2])
      );
    
      const colorGrid = generateColorGrid(
        reducedImageData,
        canvas.width, canvas.height,
        width, height
      );
    
      const pattern = generatePattern2(colorGrid, paletteHex, processPattern);
  
      canvas.width = pattern[0].length * cellSize;
      canvas.height = pattern.length * cellSize;
    
      drawPatternToCanvas(ctx, pattern, paletteHex);
      //pixelatedImage.src = canvas.toDataURL();
    
      //const canvasPalette = drawPaletteToCanvas(paletteHex);
      //paletteImage.src = canvasPalette.toDataURL();
  
      setPattern({
        pattern: pattern,
        colors: paletteHex,
        selectedColorIndex: 0,
        selectedAction: ACTION_TYPES.NONE,
        scaleFactor: 1,
        saved: false,
        name: baseName(imageName),
        version: 2
      })
    }
    originalImage.src = image
  
  
  }

export const PatternImport = {drawCanvas}