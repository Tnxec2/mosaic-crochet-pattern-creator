import { CELL_TYPE } from "../../model/patterntype.enum";

const WIDTH_RATIO = 20/4

function drawR(size: number) {
    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    if (ctx){ 
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        const w = size / WIDTH_RATIO

        // center to bottom-left "\"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((-45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, 0, w, size / 2);
        ctx.restore();

        triangleRight(ctx,size)
    }

    return canvas;
}

function drawL(size: number) {
    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    if (ctx){ 
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        const w = size / WIDTH_RATIO
        // center to bottom-left "/"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, 0, w, size / 2);
        ctx.restore();

        triangleLeft(ctx,size)
    }

    return canvas;
}

function triangleLeft(ctx: CanvasRenderingContext2D, size: number) {
    const w = size / WIDTH_RATIO
    const triangleHeight = w + size/6
    // triangle left
    ctx.moveTo(0, size);
    ctx.lineTo(0, size - triangleHeight);
    ctx.lineTo(triangleHeight, size);
    ctx.lineTo(0, size);
    ctx.fill();
    ctx.stroke();
}

function triangleRight(ctx: CanvasRenderingContext2D, size: number) {
    const w = size / WIDTH_RATIO
    const triangleHeight = w + size/6
    // triangle right
    ctx.moveTo(size, size);
    ctx.lineTo(size, size - triangleHeight);
    ctx.lineTo(size - triangleHeight, size);
    ctx.lineTo(size, size);
    ctx.fill();
    ctx.stroke();
}

function drawLR(size: number) {
    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    if (ctx){ 
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        const w = size / WIDTH_RATIO
        // center to bottom-left "\"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((-45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, 0, w, size / 2);
        ctx.restore();
        
        // center to bottom-left "/"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, 0, w, size / 2);
        ctx.restore();
        
        triangleLeft(ctx, size)
        triangleRight(ctx, size)
    }

    return canvas;
}

function drawX(size: number) {
    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    
    if (ctx){ 
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        const w = size / WIDTH_RATIO
        // top left to bottom right "\"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((-45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
        // top right to bottom left "/"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
    } 
    return canvas
}


function drawXR(size: number) {
    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    if (ctx) { 
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        const w = size / WIDTH_RATIO
        // top left to bottom right "\"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((-45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
        // top right to bottom left "/"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
        triangleRight(ctx, size)
    } 
    return canvas
}

function drawLX(size: number) {
    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    if (ctx) {  
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        const w = size / WIDTH_RATIO
        // top left to bottom right "\"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((-45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
        // top right to bottom left "/"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
        triangleLeft(ctx,size)
    } 
    return canvas
}

function drawLXR(size: number) {
    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    if (ctx) { 
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        const w = size / WIDTH_RATIO
        // top left to bottom right "\"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((-45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
        // top right to bottom left "/"
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillRect(-w / 2, -size/2, w, size);
        ctx.restore();
        triangleLeft(ctx,size)
        triangleRight(ctx,size)
    } 
    return canvas
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testDraw() {
    const size = 30;

    var r = drawR(size);
    var l = drawL(size);
    var lr = drawLR(size);
    var x = drawX(size);
    var xr = drawXR(size);
    var lx = drawLX(size);
    var lxr = drawLXR(size);

    var canvas  = document.getElementById("canvas") as HTMLCanvasElement;
    var destCtx = canvas?.getContext("2d");
    if (destCtx) { 
        destCtx.drawImage(r, 0, 0);
        destCtx.drawImage(l, (size+2)*1, size);
        destCtx.drawImage(lr, (size+2)*2, 0);
        destCtx.drawImage(x, (size+2)*3, size);
        destCtx.drawImage(xr, (size+2)*4, 0);
        destCtx.drawImage(lx, (size+2)*5, size);
        destCtx.drawImage(lxr, (size+2)*6, 0);
    } 
}

function draw(size: number, type: CELL_TYPE): HTMLCanvasElement | null  {
    if (type === CELL_TYPE.EMPTY) return null

    switch (type) {
        case CELL_TYPE.L:
            return drawL(size)
        case CELL_TYPE.R:
            return drawR(size)
        case CELL_TYPE.LR:
            return drawLR(size)
        case CELL_TYPE.X:
            return drawX(size)
        case CELL_TYPE.LX:
            return drawLX(size)
        case CELL_TYPE.XR: 
            return drawXR(size)
        case CELL_TYPE.LXR:
            return drawLXR(size)
        default:
            break;
    }
    return null
} 

export const DRAW = {
    draw
} 
