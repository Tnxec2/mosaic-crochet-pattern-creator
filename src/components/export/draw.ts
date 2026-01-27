import { CELL_TYPE } from "../../model/patterntype.enum";

const WIDTH_RATIO = 20/4

const drawColor = "white";


function leftToRight(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    const w = size / WIDTH_RATIO
    // top left to bottom right "\"
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((-45 * Math.PI) / 180);
    ctx.fillRect(-w / 2, -size/2, w, size);
    ctx.restore();
}

function rightToLeft(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    const w = size / WIDTH_RATIO
    // top right to bottom left "/"
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((45 * Math.PI) / 180);
    ctx.fillRect(-w / 2, -size/2, w, size);
    ctx.restore();
}

function centerToRight(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    const w = size / WIDTH_RATIO
    // center to bottom-left "\"
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((-45 * Math.PI) / 180);
    ctx.fillRect(-w / 2, 0, w, size / 2);
    ctx.restore();
}

function centerToLeft(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    const w = size / WIDTH_RATIO
    // center to bottom-left "/"
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((45 * Math.PI) / 180);
    ctx.fillRect(-w / 2, 0, w, size / 2);
    ctx.restore();
}

function triangleLeft(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    const w = size / WIDTH_RATIO
    const triangleHeight = w + size/6
    // triangle left
    ctx.moveTo(x, y + size);
    ctx.lineTo(x, y + size - triangleHeight);
    ctx.lineTo(x + triangleHeight, y + size);
    ctx.lineTo(x, y + size);
    ctx.fill();
    ctx.stroke();
}

function triangleRight(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    const w = size / WIDTH_RATIO
    const triangleHeight = w + size/6
    // triangle right
    ctx.moveTo(x + size, y + size);
    ctx.lineTo(x + size, y + size - triangleHeight);
    ctx.lineTo(x + size - triangleHeight, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.fill();
    ctx.stroke();
}

function drawR(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    centerToRight(ctx, size, x, y)
    triangleRight(ctx, size, x, y)
}

function drawL(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    centerToLeft(ctx, size, x, y)
    triangleLeft(ctx,size, x, y)
}

function drawLR(ctx: CanvasRenderingContext2D, size: number, x: number = 0, y: number = 0) {
    centerToLeft(ctx, size, x, y)
    centerToRight(ctx, size, x, y)
    triangleLeft(ctx, size, x, y)
    triangleRight(ctx, size, x, y)
}

function drawX(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    leftToRight(ctx, size, x, y)
    rightToLeft(ctx, size, x, y)
}

function drawXR(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    leftToRight(ctx, size, x, y)
    rightToLeft(ctx, size, x, y)
    triangleRight(ctx, size, x, y)
}

function drawLX(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    leftToRight(ctx, size, x, y)
    rightToLeft(ctx, size, x, y)
    triangleLeft(ctx,size, x, y)
}

function drawLXR(ctx: CanvasRenderingContext2D, size: number, x: number, y: number) {
    leftToRight(ctx, size, x, y)
    rightToLeft(ctx, size, x, y)
    triangleLeft(ctx,size, x, y)
    triangleRight(ctx,size, x, y)
}

function draw(size: number, type: CELL_TYPE, ctx: CanvasRenderingContext2D, color: string, x: number, y: number)  {
    if (type === CELL_TYPE.EMPTY) return null
    
    if (ctx){ 
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        switch (type) {
            case CELL_TYPE.L:
                drawL(ctx, size, x, y)
                break;
            case CELL_TYPE.R:
                drawR(ctx, size, x, y)
                break;
            case CELL_TYPE.LR:
                drawLR(ctx, size, x, y)
                break;
            case CELL_TYPE.X:
                drawX(ctx, size, x, y)
                break;
            case CELL_TYPE.LX:
                drawLX(ctx, size, x, y)
                break;
            case CELL_TYPE.XR: 
                drawXR(ctx, size, x, y)
                break;
            case CELL_TYPE.LXR:
                drawLXR(ctx, size, x, y)
                break;
            default:
                break;
        }
    }
}

function contrastingColor(color: string) {
    return (luma(color) >= 165) ? '#000' : '#fff';
}

function luma(color: string) {
    var rgb = hexToRGBArray(color);
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}

function hexToRGBArray(c: string) {
    let color = c.startsWith('#') ? c.slice(1) : c;
    
    if (color.length === 3)
        color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
    else if (color.length !== 6)
        throw new Error('Invalid hex color: ' + color);
    var rgb = [];
    for (var i = 0; i <= 2; i++)
        rgb[i] = parseInt(color.substr(i * 2, 2), 16);
    return rgb;
}

export const DRAW = {
    draw,
    contrastingColor
} 
